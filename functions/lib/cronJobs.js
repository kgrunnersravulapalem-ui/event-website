"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduledCheckPendingPayments = exports.checkPendingPayments = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const phonepe_1 = require("./utils/phonepe");
const email_1 = require("./utils/email");
const paymentSuccess_1 = require("./templates/paymentSuccess");
const paymentFailed_1 = require("./templates/paymentFailed");
const db = admin.firestore();
// PhonePe configuration from environment
const getPhonePeConfig = () => {
    const config = functions.config().phonepe;
    return {
        clientId: (config === null || config === void 0 ? void 0 : config.client_id) || process.env.PHONEPE_CLIENT_ID || '',
        clientSecret: (config === null || config === void 0 ? void 0 : config.client_secret) || process.env.PHONEPE_CLIENT_SECRET || '',
        clientVersion: (config === null || config === void 0 ? void 0 : config.client_version) || process.env.PHONEPE_CLIENT_VERSION || '1',
        environment: ((config === null || config === void 0 ? void 0 : config.environment) || process.env.PHONEPE_ENVIRONMENT || 'SANDBOX')
    };
};
/**
 * Get environment-specific collection name
 */
const getCollectionName = (baseName, environment) => {
    return environment === 'PRODUCTION' ? baseName : `${baseName}-sandbox`;
};
/**
 * Add confirmed participant to the 'participants' collection
 * Reused from payment.ts
 */
const addConfirmedParticipant = async (registrationData, transactionData, environment) => {
    try {
        const participantsCollection = getCollectionName('participants', environment);
        const orderId = (transactionData === null || transactionData === void 0 ? void 0 : transactionData.merchantOrderId) || '';
        const phone = registrationData.phone || registrationData.mobileNumber || '';
        if (!orderId) {
            console.warn('Cannot add participant without orderId');
            return;
        }
        const participantRef = db.collection(participantsCollection).doc(orderId);
        // Check if already exists
        const existingDoc = await participantRef.get();
        if (existingDoc.exists) {
            console.log(`Participant for order ${orderId} already exists in ${participantsCollection}`);
            return;
        }
        // Format date of birth to DD/MM/YYYY if available
        let formattedDob = registrationData.dateOfBirth || '';
        if (formattedDob && formattedDob.includes('-')) {
            const [year, month, day] = formattedDob.split('-');
            formattedDob = `${day}/${month}/${year}`;
        }
        const participantData = {
            name: registrationData.name || '',
            email: registrationData.email || '',
            mobileNumber: phone,
            gender: registrationData.gender || '',
            dateOfBirth: formattedDob,
            bloodGroup: registrationData.bloodGroup || '',
            size: registrationData.tshirtSize || '',
            category: registrationData.raceCategory || '',
            emergencyContact: registrationData.emergencyContact || '',
            organization: 'online-phonepe',
            isPaid: true,
            swagKitGiven: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        await participantRef.set(participantData);
        console.log(`Participant added to ${participantsCollection} with orderId:`, orderId);
    }
    catch (error) {
        console.error('Error adding confirmed participant:', error);
    }
};
/**
 * Process a single pending transaction
 * Returns true if transaction was updated, false otherwise
 */
const processPendingTransaction = async (merchantOrderId, transactionData, registrationData, config) => {
    try {
        console.log(`Processing pending transaction: ${merchantOrderId}`);
        // Check status with PhonePe
        const statusResponse = await (0, phonepe_1.checkOrderStatus)(config, merchantOrderId, {
            details: true,
            errorContext: true,
        });
        const newStatus = statusResponse.state;
        console.log(`PhonePe status for ${merchantOrderId}: ${newStatus}`);
        // If status hasn't changed, skip
        if (newStatus === 'PENDING') {
            return { updated: false, newStatus: 'PENDING' };
        }
        // Update transaction
        const transactionRef = db.collection(getCollectionName('transactions', config.environment)).doc(merchantOrderId);
        await transactionRef.update({
            status: newStatus,
            phonePeOrderId: statusResponse.orderId,
            paymentDetails: statusResponse.paymentDetails || [],
            cronCheckedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // Update registration based on new status
        if (transactionData === null || transactionData === void 0 ? void 0 : transactionData.registrationId) {
            const registrationRef = db.collection(getCollectionName('registrations', config.environment)).doc(transactionData.registrationId);
            if (newStatus === 'COMPLETED') {
                // Payment succeeded
                await registrationRef.update({
                    status: 'CONFIRMED',
                    paymentStatus: 'SUCCESS',
                    paymentCompletedAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                // Add to participants collection
                await addConfirmedParticipant(registrationData, transactionData, config.environment);
                // Send success email if not already sent
                if (registrationData && !transactionData.emailSent) {
                    const emailData = {
                        participantName: registrationData.name || 'Participant',
                        participantEmail: registrationData.email || '',
                        phone: registrationData.phone || '',
                        age: registrationData.age,
                        gender: registrationData.gender || '',
                        dateOfBirth: registrationData.dateOfBirth,
                        emergencyContact: registrationData.emergencyContact,
                        tshirtSize: registrationData.tshirtSize,
                        bloodGroup: registrationData.bloodGroup,
                        raceCategory: registrationData.raceCategory || 'N/A',
                        amount: transactionData.amount || 0,
                        orderId: merchantOrderId,
                        transactionId: statusResponse.orderId || merchantOrderId,
                        paymentDate: new Date().toLocaleString('en-IN', {
                            timeZone: 'Asia/Kolkata',
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        }),
                    };
                    await (0, email_1.sendEmail)({
                        to: registrationData.email,
                        subject: 'Payment Successful - Ravulapalem Run 2026 Registration Confirmed',
                        html: (0, paymentSuccess_1.generatePaymentSuccessEmail)(emailData),
                    });
                    await transactionRef.update({ emailSent: true });
                    console.log(`Success email sent for ${merchantOrderId}`);
                }
            }
            else if (newStatus === 'FAILED' || newStatus === 'CANCELLED' || newStatus === 'TIMEOUT') {
                // Payment failed
                await registrationRef.update({
                    status: 'PAYMENT_FAILED',
                    paymentStatus: 'FAILED',
                    errorCode: statusResponse.errorCode || null,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                // Send failure email if not already sent
                if (registrationData && !transactionData.emailSent) {
                    const emailData = {
                        participantName: registrationData.name || 'Participant',
                        participantEmail: registrationData.email || '',
                        phone: registrationData.phone || '',
                        age: registrationData.age,
                        gender: registrationData.gender || '',
                        dateOfBirth: registrationData.dateOfBirth,
                        emergencyContact: registrationData.emergencyContact,
                        tshirtSize: registrationData.tshirtSize,
                        bloodGroup: registrationData.bloodGroup,
                        raceCategory: registrationData.raceCategory || 'N/A',
                        amount: transactionData.amount || 0,
                        orderId: merchantOrderId,
                        transactionId: statusResponse.orderId || merchantOrderId,
                        paymentDate: new Date().toLocaleString('en-IN', {
                            timeZone: 'Asia/Kolkata',
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        }),
                        failureReason: statusResponse.errorCode || 'Payment declined',
                    };
                    await (0, email_1.sendEmail)({
                        to: registrationData.email,
                        subject: 'Payment Failed - Ravulapalem Run 2026 Registration',
                        html: (0, paymentFailed_1.generatePaymentFailedEmail)(emailData),
                    });
                    await transactionRef.update({ emailSent: true });
                    console.log(`Failure email sent for ${merchantOrderId}`);
                }
            }
        }
        return { updated: true, newStatus };
    }
    catch (error) {
        console.error(`Error processing transaction ${merchantOrderId}:`, error);
        return { updated: false, newStatus: 'ERROR' };
    }
};
/**
 * Cron Job: Check and update pending payments
 *
 * This function runs periodically to:
 * 1. Find all transactions with PENDING status
 * 2. Filter transactions older than 2 minutes (to avoid checking immediately created orders)
 * 3. Check their actual status with PhonePe
 * 4. Update Firebase and send emails accordingly
 *
 * Scheduled to run every 5 minutes via Firebase Cloud Scheduler
 * Schedule: every 5 minutes
 *
 * Can also be triggered manually via HTTP for testing:
 * POST https://your-cloud-function-url/checkPendingPayments
 */
exports.checkPendingPayments = functions
    .runWith({
    timeoutSeconds: 540, // 9 minutes (max for Cloud Functions)
    memory: '512MB'
})
    .https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    try {
        const config = getPhonePeConfig();
        const transactionsCollection = getCollectionName('transactions', config.environment);
        const registrationsCollection = getCollectionName('registrations', config.environment);
        console.log(`Starting pending payments check for environment: ${config.environment}`);
        // Calculate cutoff time (15 minutes ago)
        // This ensures payments have enough time to process before being checked
        // Matches the cron job interval of 15 minutes
        const cutoffTime = new Date(Date.now() - 15 * 60 * 1000);
        // Query for pending transactions older than 15 minutes
        const pendingTransactionsSnapshot = await db
            .collection(transactionsCollection)
            .where('status', '==', 'PENDING')
            .where('createdAt', '<', cutoffTime)
            .limit(50) // Process max 50 at a time to avoid timeout
            .get();
        console.log(`Found ${pendingTransactionsSnapshot.size} pending transactions to check`);
        if (pendingTransactionsSnapshot.empty) {
            res.status(200).json({
                success: true,
                message: 'No pending transactions to process',
                processed: 0,
                updated: 0
            });
            return;
        }
        const results = {
            processed: 0,
            updated: 0,
            succeeded: 0,
            failed: 0,
            stillPending: 0,
            errors: 0
        };
        // Process each pending transaction
        for (const doc of pendingTransactionsSnapshot.docs) {
            const merchantOrderId = doc.id;
            const transactionData = doc.data();
            // Get registration data
            let registrationData = null;
            if (transactionData.registrationId) {
                const regDoc = await db.collection(registrationsCollection).doc(transactionData.registrationId).get();
                if (regDoc.exists) {
                    registrationData = regDoc.data();
                }
            }
            // Process the transaction
            const result = await processPendingTransaction(merchantOrderId, transactionData, registrationData, config);
            results.processed++;
            if (result.updated) {
                results.updated++;
                if (result.newStatus === 'COMPLETED') {
                    results.succeeded++;
                }
                else if (result.newStatus === 'FAILED' || result.newStatus === 'CANCELLED' || result.newStatus === 'TIMEOUT') {
                    results.failed++;
                }
            }
            else {
                if (result.newStatus === 'PENDING') {
                    results.stillPending++;
                }
                else if (result.newStatus === 'ERROR') {
                    results.errors++;
                }
            }
            // Add small delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        console.log('Pending payments check completed:', results);
        res.status(200).json(Object.assign({ success: true, message: 'Pending payments check completed' }, results));
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Cron job failed';
        console.error('Pending payments check error:', error);
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});
/**
 * Scheduled version of checkPendingPayments
 * Runs automatically every 15 minutes
 *
 * To deploy: firebase deploy --only functions:scheduledCheckPendingPayments
 *
 * Note: Requires Firebase Blaze plan for Cloud Scheduler
 */
exports.scheduledCheckPendingPayments = functions
    .runWith({
    timeoutSeconds: 540,
    memory: '512MB'
})
    .pubsub
    .schedule('*/15 * * * *') // Every 15 minutes
    .timeZone('Asia/Kolkata')
    .onRun(async (context) => {
    try {
        const config = getPhonePeConfig();
        const transactionsCollection = getCollectionName('transactions', config.environment);
        const registrationsCollection = getCollectionName('registrations', config.environment);
        console.log(`[SCHEDULED] Starting pending payments check for environment: ${config.environment}`);
        const cutoffTime = new Date(Date.now() - 15 * 60 * 1000);
        const pendingTransactionsSnapshot = await db
            .collection(transactionsCollection)
            .where('status', '==', 'PENDING')
            .where('createdAt', '<', cutoffTime)
            .limit(50)
            .get();
        console.log(`[SCHEDULED] Found ${pendingTransactionsSnapshot.size} pending transactions to check`);
        if (pendingTransactionsSnapshot.empty) {
            console.log('[SCHEDULED] No pending transactions to process');
            return null;
        }
        const results = {
            processed: 0,
            updated: 0,
            succeeded: 0,
            failed: 0,
            stillPending: 0,
            errors: 0
        };
        for (const doc of pendingTransactionsSnapshot.docs) {
            const merchantOrderId = doc.id;
            const transactionData = doc.data();
            let registrationData = null;
            if (transactionData.registrationId) {
                const regDoc = await db.collection(registrationsCollection).doc(transactionData.registrationId).get();
                if (regDoc.exists) {
                    registrationData = regDoc.data();
                }
            }
            const result = await processPendingTransaction(merchantOrderId, transactionData, registrationData, config);
            results.processed++;
            if (result.updated) {
                results.updated++;
                if (result.newStatus === 'COMPLETED') {
                    results.succeeded++;
                }
                else if (result.newStatus === 'FAILED' || result.newStatus === 'CANCELLED' || result.newStatus === 'TIMEOUT') {
                    results.failed++;
                }
            }
            else {
                if (result.newStatus === 'PENDING') {
                    results.stillPending++;
                }
                else if (result.newStatus === 'ERROR') {
                    results.errors++;
                }
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        console.log('[SCHEDULED] Pending payments check completed:', results);
        return null;
    }
    catch (error) {
        console.error('[SCHEDULED] Pending payments check error:', error);
        throw error;
    }
});
//# sourceMappingURL=cronJobs.js.map