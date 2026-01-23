import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {
    checkOrderStatus,
    PhonePeConfig
} from './utils/phonepe';

const db = admin.firestore();

// PhonePe configuration from environment
const getPhonePeConfig = (): PhonePeConfig => {
    const config = functions.config().phonepe;
    return {
        clientId: config?.client_id || process.env.PHONEPE_CLIENT_ID || '',
        clientSecret: config?.client_secret || process.env.PHONEPE_CLIENT_SECRET || '',
        clientVersion: config?.client_version || process.env.PHONEPE_CLIENT_VERSION || '1',
        environment: (config?.environment || process.env.PHONEPE_ENVIRONMENT || 'SANDBOX') as 'SANDBOX' | 'PRODUCTION'
    };
};

/**
 * Get environment-specific collection name
 */
const getCollectionName = (baseName: string, environment: 'SANDBOX' | 'PRODUCTION'): string => {
    return environment === 'PRODUCTION' ? baseName : `${baseName}-sandbox`;
};

interface PendingPaymentAnalysis {
    merchantOrderId: string;
    currentStatus: string;
    phonepeStatus: string;
    createdAt: any;
    registrationData: {
        name: string;
        email: string;
        phone: string;
        category: string;
        amount: number;
    };
    ageInMinutes: number;
    needsUpdate: boolean;
    errorMessage?: string;
}

/**
 * ANALYSIS ONLY - Does NOT update any data
 * 
 * This function:
 * 1. Finds all PENDING transactions
 * 2. Checks their actual status with PhonePe
 * 3. Returns detailed report for manual review
 * 4. DOES NOT modify any Firebase data
 * 
 * Use this to identify which pending payments need to be updated
 * before running the actual cron job.
 */
export const analyzePendingPayments = functions
    .runWith({
        timeoutSeconds: 540,
        memory: '512MB'
    })
    .https.onRequest(async (req, res) => {
        // Enable CORS
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.status(204).send('');
            return;
        }

        try {
            const config = getPhonePeConfig();
            const transactionsCollection = getCollectionName('transactions', config.environment);
            const registrationsCollection = getCollectionName('registrations', config.environment);

            console.log(`\n${'='.repeat(80)}`);
            console.log(`PENDING PAYMENTS ANALYSIS - ${new Date().toISOString()}`);
            console.log(`Environment: ${config.environment}`);
            console.log(`${'='.repeat(80)}\n`);

            // Get ALL pending transactions (no time filter for initial analysis)
            const pendingTransactionsSnapshot = await db
                .collection(transactionsCollection)
                .where('status', '==', 'PENDING')
                .orderBy('createdAt', 'desc')
                .get();

            console.log(`Found ${pendingTransactionsSnapshot.size} pending transactions\n`);

            if (pendingTransactionsSnapshot.empty) {
                res.status(200).json({
                    success: true,
                    message: 'No pending transactions found',
                    totalPending: 0,
                    analysis: []
                });
                return;
            }

            const analysis: PendingPaymentAnalysis[] = [];
            const summary = {
                total: 0,
                shouldBeCompleted: 0,
                shouldBeFailed: 0,
                stillPending: 0,
                errors: 0
            };

            // Analyze each pending transaction
            for (const doc of pendingTransactionsSnapshot.docs) {
                const merchantOrderId = doc.id;
                const transactionData = doc.data();
                const createdAt = transactionData.createdAt?.toDate();
                const ageInMinutes = createdAt
                    ? Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60))
                    : 0;

                console.log(`\n${'-'.repeat(80)}`);
                console.log(`Analyzing: ${merchantOrderId}`);
                console.log(`Created: ${createdAt?.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`);
                console.log(`Age: ${ageInMinutes} minutes`);

                // Get registration data
                let registrationData: any = null;
                if (transactionData.registrationId) {
                    const regDoc = await db.collection(registrationsCollection).doc(transactionData.registrationId).get();
                    if (regDoc.exists) {
                        registrationData = regDoc.data();
                    }
                }

                let phonepeStatus = 'UNKNOWN';
                let errorMessage: string | undefined;

                try {
                    // Check actual status with PhonePe (READ ONLY)
                    const statusResponse = await checkOrderStatus(config, merchantOrderId, {
                        details: true,
                        errorContext: true,
                    });

                    phonepeStatus = statusResponse.state;

                    console.log(`PhonePe Status: ${phonepeStatus}`);
                    console.log(`Firebase Status: ${transactionData.status}`);

                    if (registrationData) {
                        console.log(`Participant: ${registrationData.name}`);
                        console.log(`Email: ${registrationData.email}`);
                        console.log(`Phone: ${registrationData.phone}`);
                        console.log(`Category: ${registrationData.raceCategory}`);
                        console.log(`Amount: ₹${transactionData.amount}`);
                    }

                    // Determine if update is needed
                    const needsUpdate = phonepeStatus !== 'PENDING';

                    if (needsUpdate) {
                        console.log(`⚠️  STATUS MISMATCH - Needs Update!`);
                        if (phonepeStatus === 'COMPLETED') {
                            console.log(`✅ Should be marked as COMPLETED`);
                            summary.shouldBeCompleted++;
                        } else if (phonepeStatus === 'FAILED' || phonepeStatus === 'CANCELLED' || phonepeStatus === 'TIMEOUT') {
                            console.log(`❌ Should be marked as FAILED`);
                            summary.shouldBeFailed++;
                        }
                    } else {
                        console.log(`⏳ Still genuinely pending`);
                        summary.stillPending++;
                    }

                    analysis.push({
                        merchantOrderId,
                        currentStatus: transactionData.status,
                        phonepeStatus,
                        createdAt: createdAt?.toISOString(),
                        registrationData: registrationData ? {
                            name: registrationData.name || '',
                            email: registrationData.email || '',
                            phone: registrationData.phone || '',
                            category: registrationData.raceCategory || '',
                            amount: transactionData.amount || 0
                        } : {} as any,
                        ageInMinutes,
                        needsUpdate
                    });

                } catch (error: any) {
                    console.error(`❌ Error checking PhonePe status: ${error.message}`);
                    errorMessage = error.message;
                    summary.errors++;

                    analysis.push({
                        merchantOrderId,
                        currentStatus: transactionData.status,
                        phonepeStatus: 'ERROR',
                        createdAt: createdAt?.toISOString(),
                        registrationData: registrationData ? {
                            name: registrationData.name || '',
                            email: registrationData.email || '',
                            phone: registrationData.phone || '',
                            category: registrationData.raceCategory || '',
                            amount: transactionData.amount || 0
                        } : {} as any,
                        ageInMinutes,
                        needsUpdate: false,
                        errorMessage
                    });
                }

                summary.total++;

                // Add delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            console.log(`\n${'='.repeat(80)}`);
            console.log('ANALYSIS SUMMARY');
            console.log(`${'='.repeat(80)}`);
            console.log(`Total Pending in Firebase: ${summary.total}`);
            console.log(`Should be COMPLETED: ${summary.shouldBeCompleted}`);
            console.log(`Should be FAILED: ${summary.shouldBeFailed}`);
            console.log(`Still Pending: ${summary.stillPending}`);
            console.log(`Errors: ${summary.errors}`);
            console.log(`${'='.repeat(80)}\n`);

            // Separate analysis by status
            const toComplete = analysis.filter(a => a.phonepeStatus === 'COMPLETED');
            const toFail = analysis.filter(a => a.phonepeStatus === 'FAILED' || a.phonepeStatus === 'CANCELLED' || a.phonepeStatus === 'TIMEOUT');
            const stillPending = analysis.filter(a => a.phonepeStatus === 'PENDING');
            const errors = analysis.filter(a => a.phonepeStatus === 'ERROR');

            res.status(200).json({
                success: true,
                message: 'Analysis completed - NO DATA WAS MODIFIED',
                timestamp: new Date().toISOString(),
                environment: config.environment,
                summary,
                categorized: {
                    toComplete: toComplete.map(a => ({
                        orderId: a.merchantOrderId,
                        name: a.registrationData.name,
                        email: a.registrationData.email,
                        phone: a.registrationData.phone,
                        category: a.registrationData.category,
                        amount: a.registrationData.amount,
                        ageInMinutes: a.ageInMinutes,
                        createdAt: a.createdAt
                    })),
                    toFail: toFail.map(a => ({
                        orderId: a.merchantOrderId,
                        name: a.registrationData.name,
                        email: a.registrationData.email,
                        status: a.phonepeStatus,
                        ageInMinutes: a.ageInMinutes,
                        createdAt: a.createdAt
                    })),
                    stillPending: stillPending.map(a => ({
                        orderId: a.merchantOrderId,
                        name: a.registrationData.name,
                        ageInMinutes: a.ageInMinutes,
                        createdAt: a.createdAt
                    })),
                    errors: errors.map(a => ({
                        orderId: a.merchantOrderId,
                        error: a.errorMessage,
                        ageInMinutes: a.ageInMinutes
                    }))
                },
                fullAnalysis: analysis
            });

        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
            console.error('Analysis error:', error);
            res.status(500).json({
                success: false,
                error: errorMessage
            });
        }
    });
