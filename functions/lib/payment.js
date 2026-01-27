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
exports.verifyPayment = exports.checkStatus = exports.paymentWebhook = exports.initiatePayment = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const phonepe_1 = require("./utils/phonepe");
const email_1 = require("./utils/email");
const paymentSuccess_1 = require("./templates/paymentSuccess");
const paymentPending_1 = require("./templates/paymentPending");
const paymentFailed_1 = require("./templates/paymentFailed");
// Initialize Firebase Admin
admin.initializeApp();
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
 * Separates sandbox and production data in Firestore
 */
const getCollectionName = (baseName, environment) => {
    return environment === 'PRODUCTION' ? baseName : `${baseName}-sandbox`;
};
/**
 * Add confirmed participant to the 'participants' collection
 * This collection is used for event-day operations (kit distribution, etc.)
 * Uses orderId as document ID to ensure unique entries per transaction
 *
 * Collection naming:
 * - PRODUCTION: 'participants' (real paid registrations)
 * - SANDBOX: 'participants-sandbox' (test registrations)
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
        // Use orderId as document ID - ensures one participant entry per successful transaction
        const participantRef = db.collection(participantsCollection).doc(orderId);
        // Check if already exists (avoid duplicates from webhook + status check both triggering)
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
        // Don't throw - this is a non-critical operation
    }
};
// Webhook credentials
const getWebhookCredentials = () => {
    const config = functions.config().webhook;
    return {
        username: (config === null || config === void 0 ? void 0 : config.username) || process.env.WEBHOOK_USERNAME || '',
        password: (config === null || config === void 0 ? void 0 : config.password) || process.env.WEBHOOK_PASSWORD || ''
    };
};
/**
 * Initiate PhonePe payment
 * Cloud Function endpoint: /initiatePayment
 *
 * Performance Tip: If cold starts are still persistent, consider adding 'minInstances: 1'
 * to the runWith configuration. This keeps one instance warm 24/7 (Blaze plan only).
 */
exports.initiatePayment = functions
    .runWith({
    memory: '512MB', // Higher memory grants more CPU power, reducing cold start time
    timeoutSeconds: 30
})
    .https.onRequest(async (req, res) => {
    var _a;
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    if (req.method !== 'POST') {
        res.status(405).json({ success: false, error: 'Method not allowed' });
        return;
    }
    // Warmup check for keeping function active
    if (req.body && req.body.warmup) {
        res.status(200).json({ success: true, message: 'Warmup successful' });
        return;
    }
    try {
        const registrationData = req.body;
        // Validate required fields
        if (!registrationData.name || !registrationData.email || !registrationData.phone) {
            res.status(400).json({ success: false, error: 'Missing required fields: name, email, phone' });
            return;
        }
        if (!registrationData.amount || registrationData.amount <= 0) {
            res.status(400).json({ success: false, error: 'Invalid amount' });
            return;
        }
        const config = getPhonePeConfig();
        // Generate unique order ID (merchantOrderId)
        const timestamp = Date.now();
        const merchantOrderId = `ORDER_${timestamp}`;
        // Create registration and transaction records in parallel to save time
        const registrationRef = db.collection(getCollectionName('registrations', config.environment)).doc();
        const registrationId = registrationRef.id;
        const transactionRef = db.collection(getCollectionName('transactions', config.environment)).doc(merchantOrderId);
        await Promise.all([
            registrationRef.set(Object.assign(Object.assign({}, registrationData), { merchantOrderId, status: 'PENDING', createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() })),
            transactionRef.set({
                merchantOrderId,
                registrationId,
                amount: registrationData.amount,
                amountInPaisa: registrationData.amount * 100,
                status: 'PENDING',
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            })
        ]);
        // Get base URL for redirect
        const baseUrl = ((_a = functions.config().app) === null || _a === void 0 ? void 0 : _a.base_url) || process.env.NEXT_PUBLIC_BASE_URL || 'https://yourwebsite.com';
        // Create payment using PhonePe API v2 with comprehensive metaInfo for dashboard visibility
        let paymentResponse;
        try {
            paymentResponse = await (0, phonepe_1.createPayment)(config, {
                merchantOrderId,
                amount: registrationData.amount * 100, // Convert to paisa
                redirectUrl: `${baseUrl}/payment/status?orderId=${merchantOrderId}`,
                metaInfo: {
                    udf1: registrationData.name, // Participant Name
                    udf2: registrationData.email, // Email
                    udf3: registrationData.phone, // Mobile Number
                    udf4: registrationData.raceCategory, // Race Category (3K/5K/10K)
                    udf5: registrationData.gender, // Gender
                    udf6: registrationData.tshirtSize || 'N/A', // T-Shirt Size
                    udf7: registrationData.bloodGroup || 'N/A', // Blood Group
                    udf8: registrationData.dateOfBirth || 'N/A', // Date of Birth
                    udf9: registrationId, // Internal Registration ID
                    udf10: `Age: ${registrationData.age}`, // Age
                },
            });
        }
        catch (paymentError) {
            console.error('PhonePe API error:', paymentError);
            // Update registration status to failed
            await registrationRef.update({
                status: 'PAYMENT_INIT_FAILED',
                error: paymentError.message,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            // Check if it's a timeout error
            if (paymentError.message.includes('timeout')) {
                res.status(504).json({
                    success: false,
                    error: 'Payment gateway is taking too long to respond. Please try again.',
                    errorType: 'TIMEOUT'
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'Failed to initiate payment. Please try again.',
                    errorType: 'PAYMENT_API_ERROR'
                });
            }
            return;
        }
        // Update transaction with PhonePe order ID
        await transactionRef.update({
            phonePeOrderId: paymentResponse.orderId,
            expireAt: paymentResponse.expireAt,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log('Payment initiated successfully:', {
            merchantOrderId,
            phonePeOrderId: paymentResponse.orderId,
            redirectUrl: paymentResponse.redirectUrl,
        });
        res.status(200).json({
            success: true,
            data: {
                merchantOrderId,
                orderId: paymentResponse.orderId,
                redirectUrl: paymentResponse.redirectUrl,
                registrationId,
                expiresAt: paymentResponse.expireAt,
            }
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initiate payment';
        console.error('Payment initiation error:', error);
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});
/**
 * PhonePe Webhook Handler
 * Receives payment status updates from PhonePe
 * Cloud Function endpoint: /paymentWebhook
 */
exports.paymentWebhook = functions.https.onRequest(async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ success: false, error: 'Method not allowed' });
        return;
    }
    try {
        // Validate webhook authorization
        const authHeader = req.headers['authorization'];
        const webhookCreds = getWebhookCredentials();
        if (webhookCreds.username && webhookCreds.password) {
            const isValid = (0, phonepe_1.validateWebhookAuth)(authHeader, webhookCreds.username, webhookCreds.password);
            if (!isValid) {
                console.error('Invalid webhook authorization');
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }
        }
        // Parse webhook payload
        const { event, payload } = req.body;
        console.log('Webhook received:', {
            event,
            merchantOrderId: payload === null || payload === void 0 ? void 0 : payload.merchantOrderId,
            state: payload === null || payload === void 0 ? void 0 : payload.state,
        });
        if (!(payload === null || payload === void 0 ? void 0 : payload.merchantOrderId)) {
            res.status(400).json({ success: false, error: 'Missing merchantOrderId' });
            return;
        }
        const merchantOrderId = payload.merchantOrderId;
        const config = getPhonePeConfig();
        // Get transaction from Firestore (environment-specific collection)
        const transactionRef = db.collection(getCollectionName('transactions', config.environment)).doc(merchantOrderId);
        const transactionDoc = await transactionRef.get();
        if (!transactionDoc.exists) {
            console.error('Transaction not found:', merchantOrderId);
            res.status(404).json({ success: false, error: 'Transaction not found' });
            return;
        }
        const transactionData = transactionDoc.data();
        const state = payload.state;
        // Update transaction status
        await transactionRef.update({
            status: state,
            phonePeOrderId: payload.orderId,
            paymentDetails: payload.paymentDetails || [],
            webhookEvent: event,
            webhookReceivedAt: admin.firestore.FieldValue.serverTimestamp(),
            errorCode: payload.errorCode || null,
            detailedErrorCode: payload.detailedErrorCode || null,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // Update registration status and send email
        if (transactionData === null || transactionData === void 0 ? void 0 : transactionData.registrationId) {
            const registrationRef = db.collection(getCollectionName('registrations', config.environment)).doc(transactionData.registrationId);
            const registrationDoc = await registrationRef.get();
            const registrationData = registrationDoc.exists ? registrationDoc.data() : null;
            if (state === 'COMPLETED') {
                await registrationRef.update({
                    status: 'CONFIRMED',
                    paymentStatus: 'SUCCESS',
                    paymentCompletedAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                // Add to participants collection for event-day operations
                await addConfirmedParticipant(registrationData, transactionData, config.environment);
                // Send success email
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
                        transactionId: payload.orderId || merchantOrderId,
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
                    // Mark email as sent
                    await transactionRef.update({ emailSent: true });
                }
            }
            else if (state === 'FAILED') {
                await registrationRef.update({
                    status: 'PAYMENT_FAILED',
                    paymentStatus: 'FAILED',
                    errorCode: payload.errorCode || null,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                // Send failure email
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
                        transactionId: payload.orderId || merchantOrderId,
                        paymentDate: new Date().toLocaleString('en-IN', {
                            timeZone: 'Asia/Kolkata',
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                        }),
                        failureReason: payload.errorCode || 'Payment declined',
                    };
                    await (0, email_1.sendEmail)({
                        to: registrationData.email,
                        subject: 'Payment Failed - Ravulapalem Run 2026 Registration',
                        html: (0, paymentFailed_1.generatePaymentFailedEmail)(emailData),
                    });
                    // Mark email as sent
                    await transactionRef.update({ emailSent: true });
                }
            }
        }
        console.log('Webhook processed successfully:', {
            merchantOrderId,
            state,
            event,
        });
        res.status(200).json({ success: true });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Webhook processing failed';
        console.error('Webhook processing error:', error);
        res.status(500).json({
            success: false,
            error: errorMessage
        });
    }
});
/**
 * Check Order Status
 * Cloud Function endpoint: /checkStatus
 */
exports.checkStatus = functions.https.onRequest(async (req, res) => {
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    if (req.method !== 'GET') {
        res.status(405).json({ success: false, error: 'Method not allowed' });
        return;
    }
    try {
        const merchantOrderId = req.query.orderId;
        if (!merchantOrderId) {
            res.status(400).json({ success: false, error: 'Order ID required' });
            return;
        }
        const config = getPhonePeConfig();
        // Check status with PhonePe with timeout handling
        let statusResponse;
        try {
            statusResponse = await (0, phonepe_1.checkOrderStatus)(config, merchantOrderId, {
                details: true,
                errorContext: true,
            });
        }
        catch (statusError) {
            console.error('Status check error:', statusError);
            if (statusError.message.includes('timeout')) {
                res.status(504).json({
                    success: false,
                    error: 'Payment status check is taking too long. Please try again.',
                    errorType: 'TIMEOUT'
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: 'Failed to check payment status. Please try again.',
                    errorType: 'STATUS_CHECK_ERROR'
                });
            }
            return;
        }
        // Update transaction in Firestore (environment-specific collection)
        const transactionRef = db.collection(getCollectionName('transactions', config.environment)).doc(merchantOrderId);
        const transactionDoc = await transactionRef.get();
        if (transactionDoc.exists) {
            const transactionData = transactionDoc.data();
            const state = statusResponse.state;
            await transactionRef.update({
                status: state,
                phonePeOrderId: statusResponse.orderId,
                paymentDetails: statusResponse.paymentDetails || [],
                statusCheckedAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            // Update registration if payment completed (environment-specific collection)
            if (state === 'COMPLETED' && (transactionData === null || transactionData === void 0 ? void 0 : transactionData.registrationId)) {
                await db.collection(getCollectionName('registrations', config.environment)).doc(transactionData.registrationId).update({
                    status: 'CONFIRMED',
                    paymentStatus: 'SUCCESS',
                    paymentCompletedAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            }
            else if (state === 'FAILED' && (transactionData === null || transactionData === void 0 ? void 0 : transactionData.registrationId)) {
                await db.collection(getCollectionName('registrations', config.environment)).doc(transactionData.registrationId).update({
                    status: 'PAYMENT_FAILED',
                    paymentStatus: 'FAILED',
                    errorCode: statusResponse.errorCode || null,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
            }
        }
        res.status(200).json({
            success: true,
            data: statusResponse
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Status check failed';
        console.error('Status check error:', error);
        // Provide user-friendly error message
        const userMessage = errorMessage.includes('sandbox')
            ? 'The payment gateway is temporarily unavailable. Your payment may still be processing. Please wait a moment and check your email, or contact support.'
            : errorMessage;
        res.status(500).json({
            success: false,
            error: userMessage
        });
    }
});
/**
 * Verify Payment (for frontend to confirm payment and get registration details)
 * Cloud Function endpoint: /verifyPayment
 */
exports.verifyPayment = functions.https.onRequest(async (req, res) => {
    var _a, _b, _c, _d, _e;
    // Enable CORS
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    if (req.method !== 'POST') {
        res.status(405).json({ success: false, error: 'Method not allowed' });
        return;
    }
    try {
        const { merchantOrderId } = req.body;
        if (!merchantOrderId) {
            res.status(400).json({ success: false, error: 'Order ID required' });
            return;
        }
        const config = getPhonePeConfig();
        // Get transaction from Firestore (environment-specific collection)
        const transactionRef = db.collection(getCollectionName('transactions', config.environment)).doc(merchantOrderId);
        const transactionDoc = await transactionRef.get();
        if (!transactionDoc.exists) {
            res.status(404).json({ success: false, error: 'Transaction not found' });
            return;
        }
        const transactionData = transactionDoc.data();
        // Verify with PhonePe
        const statusResponse = await (0, phonepe_1.checkOrderStatus)(config, merchantOrderId, {
            details: true,
            errorContext: true,
        });
        // Update transaction status
        await transactionRef.update({
            status: statusResponse.state,
            phonePeOrderId: statusResponse.orderId,
            paymentDetails: statusResponse.paymentDetails || [],
            verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        // Get registration data (environment-specific collection)
        let registrationData = null;
        if (transactionData === null || transactionData === void 0 ? void 0 : transactionData.registrationId) {
            const registrationDoc = await db.collection(getCollectionName('registrations', config.environment)).doc(transactionData.registrationId).get();
            if (registrationDoc.exists) {
                registrationData = registrationDoc.data();
                // Update registration status based on payment
                if (statusResponse.state === 'COMPLETED') {
                    await db.collection(getCollectionName('registrations', config.environment)).doc(transactionData.registrationId).update({
                        status: 'CONFIRMED',
                        paymentStatus: 'SUCCESS',
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                    if (registrationData) {
                        registrationData.status = 'CONFIRMED';
                        registrationData.paymentStatus = 'SUCCESS';
                    }
                    // Add to participants collection for event-day operations (fallback if webhook didn't trigger)
                    await addConfirmedParticipant(registrationData, transactionData, config.environment);
                    // Send success email (fallback if webhook didn't trigger)
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
                            amount: transactionData.amount || 0, // Use stored amount (Rupees)
                            orderId: merchantOrderId,
                            transactionId: statusResponse.orderId || merchantOrderId,
                            paymentDate: ((_b = (_a = statusResponse.paymentDetails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.timestamp)
                                ? new Date(statusResponse.paymentDetails[0].timestamp).toLocaleString('en-IN', {
                                    timeZone: 'Asia/Kolkata',
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })
                                : new Date().toLocaleString('en-IN', {
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
                        // Mark email as sent
                        await transactionRef.update({ emailSent: true });
                    }
                }
                else if (statusResponse.state === 'FAILED') {
                    await db.collection(getCollectionName('registrations', config.environment)).doc(transactionData.registrationId).update({
                        status: 'PAYMENT_FAILED',
                        paymentStatus: 'FAILED',
                        updatedAt: admin.firestore.FieldValue.serverTimestamp()
                    });
                    if (registrationData) {
                        registrationData.status = 'PAYMENT_FAILED';
                        registrationData.paymentStatus = 'FAILED';
                    }
                    // Send failure email (fallback if webhook didn't trigger)
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
                            amount: transactionData.amount || 0, // Use stored amount (Rupees)
                            orderId: merchantOrderId,
                            transactionId: statusResponse.orderId || merchantOrderId,
                            paymentDate: ((_d = (_c = statusResponse.paymentDetails) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.timestamp)
                                ? new Date(statusResponse.paymentDetails[0].timestamp).toLocaleString('en-IN', {
                                    timeZone: 'Asia/Kolkata',
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true
                                })
                                : new Date().toLocaleString('en-IN', {
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
                        // Mark email as sent
                        await transactionRef.update({ emailSent: true });
                    }
                }
                else if (statusResponse.state === 'PENDING') {
                    // Send pending email for long-running transactions
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
                            amount: transactionData.amount || 0, // Use stored amount (Rupees)
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
                            subject: 'Payment Pending - Ravulapalem Run 2026 Registration',
                            html: (0, paymentPending_1.generatePaymentPendingEmail)(emailData),
                        });
                        // Mark email as sent
                        await transactionRef.update({ emailSent: true });
                    }
                }
            }
        }
        const isCompleted = statusResponse.state === 'COMPLETED';
        const paymentDetails = (_e = statusResponse.paymentDetails) === null || _e === void 0 ? void 0 : _e[0];
        res.status(200).json({
            success: true,
            verified: isCompleted,
            state: statusResponse.state,
            transaction: {
                merchantOrderId,
                phonePeOrderId: statusResponse.orderId,
                amount: statusResponse.amount,
                status: statusResponse.state,
                paymentMode: paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.paymentMode,
                transactionId: paymentDetails === null || paymentDetails === void 0 ? void 0 : paymentDetails.transactionId,
                errorCode: statusResponse.errorCode,
            },
            registration: registrationData,
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Verification failed';
        console.error('Payment verification error:', error);
        // Provide user-friendly error message
        const userMessage = errorMessage.includes('sandbox')
            ? 'The payment gateway is temporarily unavailable. Your payment may still be processing. Please wait a moment and refresh, or contact support with your order ID.'
            : 'Failed to verify payment. Please try again or contact support if the issue persists.';
        res.status(500).json({
            success: false,
            error: userMessage,
            debug: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        });
    }
});
//# sourceMappingURL=payment.js.map