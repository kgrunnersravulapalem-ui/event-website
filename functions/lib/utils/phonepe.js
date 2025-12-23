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
exports.getApiUrls = getApiUrls;
exports.generateAccessToken = generateAccessToken;
exports.createPayment = createPayment;
exports.checkOrderStatus = checkOrderStatus;
exports.validateWebhookAuth = validateWebhookAuth;
const crypto = __importStar(require("crypto"));
// API timeout configurations (in milliseconds)
const TIMEOUTS = {
    AUTH: 10000, // 10 seconds for token generation
    PAYMENT: 15000, // 15 seconds for payment creation
    STATUS: 10000, // 10 seconds for status check
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
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Retry wrapper for operations
 */
async function retryOperation(operation, operationName, maxRetries = RETRY_CONFIG.MAX_RETRIES) {
    var _a;
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            if (attempt > 0) {
                console.log(`Retry attempt ${attempt} for ${operationName}...`);
                await sleep(RETRY_CONFIG.RETRY_DELAY * attempt); // Exponential backoff
            }
            return await operation();
        }
        catch (error) {
            lastError = error;
            console.error(`${operationName} attempt ${attempt + 1} failed:`, error.message);
            // Don't retry on certain errors
            if (!RETRY_CONFIG.RETRYABLE_ERRORS.some(e => { var _a; return (_a = error.message) === null || _a === void 0 ? void 0 : _a.includes(e); }) &&
                !((_a = error.message) === null || _a === void 0 ? void 0 : _a.includes('timeout'))) {
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
async function fetchWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, Object.assign(Object.assign({}, options), { signal: controller.signal }));
        clearTimeout(timeoutId);
        return response;
    }
    catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
    }
}
// Token cache to avoid generating new tokens for every request
let tokenCache = null;
/**
 * Get PhonePe API base URLs based on environment
 */
function getApiUrls(environment) {
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
async function generateAccessToken(config) {
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
async function createPayment(config, paymentData) {
    return await retryOperation(async () => {
        const accessToken = await generateAccessToken(config);
        const urls = getApiUrls(config.environment);
        const payload = {
            merchantOrderId: paymentData.merchantOrderId,
            amount: paymentData.amount,
            currency: 'INR', // Indian Rupees
            expireAfter: 300, // 2 minutes
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
async function checkOrderStatus(config, merchantOrderId, options) {
    return await retryOperation(async () => {
        const accessToken = await generateAccessToken(config);
        const urls = getApiUrls(config.environment);
        const queryParams = new URLSearchParams();
        if ((options === null || options === void 0 ? void 0 : options.details) !== undefined) {
            queryParams.append('details', String(options.details));
        }
        if ((options === null || options === void 0 ? void 0 : options.errorContext) !== undefined) {
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
function validateWebhookAuth(authHeader, webhookUsername, webhookPassword) {
    try {
        const expectedHash = crypto
            .createHash('sha256')
            .update(`${webhookUsername}:${webhookPassword}`)
            .digest('hex');
        // Remove any prefix like "SHA256 " if present
        const receivedHash = authHeader.replace(/^SHA256\s*/i, '');
        return expectedHash.toLowerCase() === receivedHash.toLowerCase();
    }
    catch (error) {
        console.error('Webhook validation error:', error);
        return false;
    }
}
//# sourceMappingURL=phonepe.js.map