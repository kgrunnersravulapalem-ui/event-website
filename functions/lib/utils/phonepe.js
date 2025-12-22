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
 * Generate OAuth Access Token
 * POST /v1/oauth/token
 */
async function generateAccessToken(config) {
    // Check if we have a valid cached token
    if (tokenCache && tokenCache.expiresAt > Date.now() + 60000) { // 1 min buffer
        return tokenCache.accessToken;
    }
    const urls = getApiUrls(config.environment);
    const params = new URLSearchParams();
    params.append('client_id', config.clientId);
    params.append('client_version', config.clientVersion);
    params.append('client_secret', config.clientSecret);
    params.append('grant_type', 'client_credentials');
    console.log('Generating PhonePe access token...');
    const response = await fetch(urls.auth, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });
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
}
/**
 * Create Payment Request
 * POST /checkout/v2/pay
 */
async function createPayment(config, paymentData) {
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
    const response = await fetch(urls.pay, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
    });
    const responseData = await response.json();
    console.log('Create payment response:', {
        status: response.status,
        data: responseData,
    });
    if (!response.ok) {
        throw new Error(responseData.message || `Payment creation failed: ${response.status}`);
    }
    return responseData;
}
/**
 * Check Order Status
 * GET /checkout/v2/order/{merchantOrderId}/status
 */
async function checkOrderStatus(config, merchantOrderId, options) {
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
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${accessToken}`,
        },
    });
    const responseData = await response.json();
    console.log('Order status response:', {
        status: response.status,
        state: responseData.state,
    });
    if (!response.ok) {
        throw new Error(responseData.message || `Status check failed: ${response.status}`);
    }
    return responseData;
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