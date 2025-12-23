import * as crypto from 'crypto';

/**
 * PhonePe Standard Checkout API v2 - OAuth Token Based Authentication
 * Based on: https://developer.phonepe.com/payment-gateway/website-integration/standard-checkout/api-integration/
 */

export interface PhonePeConfig {
  clientId: string;
  clientSecret: string;
  clientVersion: string;
  environment: 'SANDBOX' | 'PRODUCTION';
}

// API timeout configurations (in milliseconds)
const TIMEOUTS = {
  AUTH: 10000,      // 10 seconds for token generation
  PAYMENT: 15000,   // 15 seconds for payment creation
  STATUS: 10000,    // 10 seconds for status check
};

// Retry configuration
const RETRY_CONFIG = {
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000, // 1 second
  RETRYABLE_ERRORS: ['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND'],
};

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry wrapper for operations
 */
async function retryOperation<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxRetries: number = RETRY_CONFIG.MAX_RETRIES
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt} for ${operationName}...`);
        await sleep(RETRY_CONFIG.RETRY_DELAY * attempt); // Exponential backoff
      }
      
      return await operation();
    } catch (error: any) {
      lastError = error;
      console.error(`${operationName} attempt ${attempt + 1} failed:`, error.message);
      
      // Don't retry on certain errors
      if (!RETRY_CONFIG.RETRYABLE_ERRORS.some(e => error.message?.includes(e)) &&
          !error.message?.includes('timeout')) {
        throw error;
      }
      
      if (attempt === maxRetries) {
        break;
      }
    }
  }
  
  throw lastError || new Error(`${operationName} failed after ${maxRetries + 1} attempts`);
}

/**
 * Fetch with timeout wrapper
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

export interface AuthToken {
  accessToken: string;
  expiresAt: number;
}

// Token cache to avoid generating new tokens for every request
let tokenCache: AuthToken | null = null;

/**
 * Get PhonePe API base URLs based on environment
 */
export function getApiUrls(environment: string) {
  if (environment === 'PRODUCTION') {
    return {
      auth: 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token',
      pay: 'https://api.phonepe.com/apis/pg/checkout/v2/pay',
      status: 'https://api.phonepe.com/apis/pg/checkout/v2/order',
    };
  }
  return {
    auth: 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token',
    pay: 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay',
    status: 'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order',
  };
}

/**
 * Generate OAuth Access Token (with retry)
 * POST /v1/oauth/token
 */
export async function generateAccessToken(config: PhonePeConfig): Promise<string> {
  // Check if we have a valid cached token
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60000) { // 1 min buffer
    return tokenCache.accessToken;
  }

  return await retryOperation(async () => {
    const urls = getApiUrls(config.environment);
    
    const params = new URLSearchParams();
    params.append('client_id', config.clientId);
    params.append('client_version', config.clientVersion);
    params.append('client_secret', config.clientSecret);
    params.append('grant_type', 'client_credentials');

    console.log('Generating PhonePe access token...');
    
    const response = await fetchWithTimeout(urls.auth, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }, TIMEOUTS.AUTH);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Token generation failed:', errorText);
      throw new Error(`Failed to generate access token: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Cache the token
    tokenCache = {
      accessToken: data.access_token,
      expiresAt: data.expires_at * 1000, // Convert to milliseconds
    };

    console.log('Access token generated successfully, expires at:', new Date(tokenCache.expiresAt));
    
    return data.access_token;
  }, 'generateAccessToken', 1); // Only 1 retry for token generation
}

/**
 * Create Payment Request (with retry)
 * POST /checkout/v2/pay
 */
export async function createPayment(
  config: PhonePeConfig,
  paymentData: {
    merchantOrderId: string;
    amount: number; // in paisa
    redirectUrl: string;
    metaInfo?: Record<string, string>;
  }
): Promise<{
  orderId: string;
  state: string;
  expireAt: number;
  redirectUrl: string;
}> {
  return await retryOperation(async () => {
    const accessToken = await generateAccessToken(config);
    const urls = getApiUrls(config.environment);

    const payload = {
      merchantOrderId: paymentData.merchantOrderId,
      amount: paymentData.amount,
      expireAfter: 1200, // 20 minutes
      metaInfo: paymentData.metaInfo || {},
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: 'Payment for event registration',
        merchantUrls: {
          redirectUrl: paymentData.redirectUrl,
        },
      },
    };

    console.log('Creating payment:', {
      merchantOrderId: paymentData.merchantOrderId,
      amount: paymentData.amount,
      endpoint: urls.pay,
    });

    const response = await fetchWithTimeout(urls.pay, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    }, TIMEOUTS.PAYMENT);

    const responseData = await response.json();
    
    console.log('Create payment response:', {
      status: response.status,
      data: responseData,
    });

    if (!response.ok) {
      throw new Error(responseData.message || `Payment creation failed: ${response.status}`);
    }

    return responseData;
  }, 'createPayment');
}

/**
 * Check Order Status (with retry)
 * GET /checkout/v2/order/{merchantOrderId}/status
 */
export async function checkOrderStatus(
  config: PhonePeConfig,
  merchantOrderId: string,
  options?: { details?: boolean; errorContext?: boolean }
): Promise<{
  orderId: string;
  state: 'PENDING' | 'COMPLETED' | 'FAILED';
  amount: number;
  expireAt: number;
  metaInfo?: Record<string, string>;
  paymentDetails?: Array<{
    paymentMode: string;
    transactionId: string;
    timestamp: number;
    amount: number;
    state: string;
    errorCode?: string;
    detailedErrorCode?: string;
  }>;
  errorCode?: string;
  detailedErrorCode?: string;
}> {
  return await retryOperation(async () => {
    const accessToken = await generateAccessToken(config);
    const urls = getApiUrls(config.environment);

    const queryParams = new URLSearchParams();
    if (options?.details !== undefined) {
      queryParams.append('details', String(options.details));
    }
    if (options?.errorContext !== undefined) {
      queryParams.append('errorContext', String(options.errorContext));
    }

    const url = `${urls.status}/${merchantOrderId}/status${queryParams.toString() ? '?' + queryParams.toString() : ''}`;

    console.log('Checking order status:', {
      merchantOrderId,
      url,
    });

    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `O-Bearer ${accessToken}`,
      },
    }, TIMEOUTS.STATUS);

    const responseData = await response.json();
    
    console.log('Order status response:', {
      status: response.status,
      state: responseData.state,
    });

    if (!response.ok) {
      // Handle PhonePe sandbox errors specially
      if (response.status === 500 && config.environment === 'SANDBOX') {
        console.warn('PhonePe sandbox error - this is a known sandbox issue');
        throw new Error('PhonePe sandbox is temporarily unavailable. Please try again in a moment or contact support.');
      }
      throw new Error(responseData.message || `Status check failed: ${response.status}`);
    }

    return responseData;
  }, 'checkOrderStatus');
}

/**
 * Validate Webhook Authorization Header
 * PhonePe sends Authorization: SHA256(username:password)
 */
export function validateWebhookAuth(
  authHeader: string,
  webhookUsername: string,
  webhookPassword: string
): boolean {
  try {
    const expectedHash = crypto
      .createHash('sha256')
      .update(`${webhookUsername}:${webhookPassword}`)
      .digest('hex');
    
    // Remove any prefix like "SHA256 " if present
    const receivedHash = authHeader.replace(/^SHA256\s*/i, '');
    
    return expectedHash.toLowerCase() === receivedHash.toLowerCase();
  } catch (error) {
    console.error('Webhook validation error:', error);
    return false;
  }
}
