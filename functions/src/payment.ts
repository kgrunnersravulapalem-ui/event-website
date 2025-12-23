import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { 
  createPayment, 
  checkOrderStatus, 
  validateWebhookAuth,
  PhonePeConfig 
} from './utils/phonepe';
import { sendEmail } from './utils/email';
import { generatePaymentSuccessEmail, PaymentSuccessEmailData } from './templates/paymentSuccess';
import { generatePaymentPendingEmail, PaymentPendingEmailData } from './templates/paymentPending';
import { generatePaymentFailedEmail, PaymentFailedEmailData } from './templates/paymentFailed';

// Initialize Firebase Admin
admin.initializeApp();
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

// Webhook credentials
const getWebhookCredentials = () => {
  const config = functions.config().webhook;
  return {
    username: config?.username || process.env.WEBHOOK_USERNAME || '',
    password: config?.password || process.env.WEBHOOK_PASSWORD || ''
  };
};

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  age?: number;
  gender: string;
  emergencyContact?: string;
  raceCategory: string;
  amount: number;
  dateOfBirth?: string;
  tshirtSize?: string;
  bloodGroup?: string;
}

/**
 * Initiate PhonePe payment
 * Cloud Function endpoint: /initiatePayment
 */
export const initiatePayment = functions.https.onRequest(async (req, res) => {
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
    const registrationData: RegistrationData = req.body;
    
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

    // Create registration document in Firestore
    const registrationRef = db.collection('registrations').doc();
    const registrationId = registrationRef.id;

    await registrationRef.set({
      ...registrationData,
      merchantOrderId,
      status: 'PENDING',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Create transaction record
    const transactionRef = db.collection('transactions').doc(merchantOrderId);
    await transactionRef.set({
      merchantOrderId,
      registrationId,
      amount: registrationData.amount,
      amountInPaisa: registrationData.amount * 100,
      status: 'PENDING',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Get base URL for redirect
    const baseUrl = functions.config().app?.base_url || process.env.NEXT_PUBLIC_BASE_URL || 'https://yourwebsite.com';
    
    // Create payment using PhonePe API v2 with comprehensive metaInfo for dashboard visibility
    let paymentResponse;
    try {
      paymentResponse = await createPayment(config, {
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
    } catch (paymentError: any) {
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
      } else {
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

  } catch (error: unknown) {
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
export const paymentWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  try {
    // Validate webhook authorization
    const authHeader = req.headers['authorization'] as string;
    const webhookCreds = getWebhookCredentials();
    
    if (webhookCreds.username && webhookCreds.password) {
      const isValid = validateWebhookAuth(authHeader, webhookCreds.username, webhookCreds.password);
      
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
      merchantOrderId: payload?.merchantOrderId,
      state: payload?.state,
    });

    if (!payload?.merchantOrderId) {
      res.status(400).json({ success: false, error: 'Missing merchantOrderId' });
      return;
    }

    const merchantOrderId = payload.merchantOrderId;

    // Get transaction from Firestore
    const transactionRef = db.collection('transactions').doc(merchantOrderId);
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
    if (transactionData?.registrationId) {
      const registrationRef = db.collection('registrations').doc(transactionData.registrationId);
      const registrationDoc = await registrationRef.get();
      const registrationData = registrationDoc.exists ? registrationDoc.data() : null;
      
      if (state === 'COMPLETED') {
        await registrationRef.update({
          status: 'CONFIRMED',
          paymentStatus: 'SUCCESS',
          paymentCompletedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Send success email
        if (registrationData && !transactionData.emailSent) {
          const emailData: PaymentSuccessEmailData = {
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

          await sendEmail({
            to: registrationData.email,
            subject: 'Payment Successful - Ravulapalem Run 2025 Registration Confirmed',
            html: generatePaymentSuccessEmail(emailData),
          });

          // Mark email as sent
          await transactionRef.update({ emailSent: true });
        }
      } else if (state === 'FAILED') {
        await registrationRef.update({
          status: 'PAYMENT_FAILED',
          paymentStatus: 'FAILED',
          errorCode: payload.errorCode || null,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Send failure email
        if (registrationData && !transactionData.emailSent) {
          const emailData: PaymentFailedEmailData = {
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

          await sendEmail({
            to: registrationData.email,
            subject: 'Payment Failed - Ravulapalem Run 2025 Registration',
            html: generatePaymentFailedEmail(emailData),
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

  } catch (error: unknown) {
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
export const checkStatus = functions.https.onRequest(async (req, res) => {
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
    const merchantOrderId = req.query.orderId as string;

    if (!merchantOrderId) {
      res.status(400).json({ success: false, error: 'Order ID required' });
      return;
    }

    const config = getPhonePeConfig();

    // Check status with PhonePe with timeout handling
    let statusResponse;
    try {
      statusResponse = await checkOrderStatus(config, merchantOrderId, {
        details: true,
        errorContext: true,
      });
    } catch (statusError: any) {
      console.error('Status check error:', statusError);
      
      if (statusError.message.includes('timeout')) {
        res.status(504).json({
          success: false,
          error: 'Payment status check is taking too long. Please try again.',
          errorType: 'TIMEOUT'
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Failed to check payment status. Please try again.',
          errorType: 'STATUS_CHECK_ERROR'
        });
      }
      return;
    }

    // Update transaction in Firestore
    const transactionRef = db.collection('transactions').doc(merchantOrderId);
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

      // Update registration if payment completed
      if (state === 'COMPLETED' && transactionData?.registrationId) {
        await db.collection('registrations').doc(transactionData.registrationId).update({
          status: 'CONFIRMED',
          paymentStatus: 'SUCCESS',
          paymentCompletedAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      } else if (state === 'FAILED' && transactionData?.registrationId) {
        await db.collection('registrations').doc(transactionData.registrationId).update({
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

  } catch (error: unknown) {
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
export const verifyPayment = functions.https.onRequest(async (req, res) => {
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

    // Get transaction from Firestore
    const transactionRef = db.collection('transactions').doc(merchantOrderId);
    const transactionDoc = await transactionRef.get();

    if (!transactionDoc.exists) {
      res.status(404).json({ success: false, error: 'Transaction not found' });
      return;
    }

    const transactionData = transactionDoc.data();
    const config = getPhonePeConfig();

    // Verify with PhonePe
    const statusResponse = await checkOrderStatus(config, merchantOrderId, {
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

    // Get registration data
    let registrationData = null;
    if (transactionData?.registrationId) {
      const registrationDoc = await db.collection('registrations').doc(transactionData.registrationId).get();
      if (registrationDoc.exists) {
        registrationData = registrationDoc.data();
        
        // Update registration status based on payment
        if (statusResponse.state === 'COMPLETED') {
          await db.collection('registrations').doc(transactionData.registrationId).update({
            status: 'CONFIRMED',
            paymentStatus: 'SUCCESS',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          if (registrationData) {
            registrationData.status = 'CONFIRMED';
            registrationData.paymentStatus = 'SUCCESS';
          }

          // Send success email (fallback if webhook didn't trigger)
          if (registrationData && !transactionData.emailSent) {
            const emailData: PaymentSuccessEmailData = {
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
              amount: statusResponse.amount || 0,
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

            await sendEmail({
              to: registrationData.email,
              subject: 'Payment Successful - Ravulapalem Run 2025 Registration Confirmed',
              html: generatePaymentSuccessEmail(emailData),
            });

            // Mark email as sent
            await transactionRef.update({ emailSent: true });
          }
        } else if (statusResponse.state === 'FAILED') {
          await db.collection('registrations').doc(transactionData.registrationId).update({
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
            const emailData: PaymentFailedEmailData = {
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
              amount: statusResponse.amount || 0,
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

            await sendEmail({
              to: registrationData.email,
              subject: 'Payment Failed - Ravulapalem Run 2025 Registration',
              html: generatePaymentFailedEmail(emailData),
            });

            // Mark email as sent
            await transactionRef.update({ emailSent: true });
          }
        } else if (statusResponse.state === 'PENDING') {
          // Send pending email for long-running transactions
          if (registrationData && !transactionData.emailSent) {
            const emailData: PaymentPendingEmailData = {
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
              amount: statusResponse.amount || 0,
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

            await sendEmail({
              to: registrationData.email,
              subject: 'Payment Pending - Ravulapalem Run 2025 Registration',
              html: generatePaymentPendingEmail(emailData),
            });

            // Mark email as sent
            await transactionRef.update({ emailSent: true });
          }
        }
      }
    }

    const isCompleted = statusResponse.state === 'COMPLETED';
    const paymentDetails = statusResponse.paymentDetails?.[0];

    res.status(200).json({
      success: true,
      verified: isCompleted,
      state: statusResponse.state,
      transaction: {
        merchantOrderId,
        phonePeOrderId: statusResponse.orderId,
        amount: statusResponse.amount,
        status: statusResponse.state,
        paymentMode: paymentDetails?.paymentMode,
        transactionId: paymentDetails?.transactionId,
        errorCode: statusResponse.errorCode,
      },
      registration: registrationData,
    });

  } catch (error: unknown) {
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
