# Frontend Integration Guide for Cloud Functions

## Overview

The frontend has been updated to call Firebase Cloud Functions instead of Next.js API routes. This makes it compatible with Netlify deployment.

## Changes Made

### 1. Registration Form ([app/register/page.tsx](app/register/page.tsx))

**Before (Next.js API):**
```typescript
const response = await fetch('/api/payment/initiate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ registrationData }),
});
```

**After (Cloud Functions):**
```typescript
const cloudFunctionsUrl = process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL;

const response = await fetch(`${cloudFunctionsUrl}/initiatePayment`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(registrationData),
});
```

**Key Changes:**
- Uses environment variable `NEXT_PUBLIC_CLOUD_FUNCTIONS_URL`
- Calls `/initiatePayment` Cloud Function
- Data structure updated to match Cloud Functions payload

### 2. Payment Status Page ([app/payment/status/page.tsx](app/payment/status/page.tsx))

**Before (Next.js API):**
```typescript
const verifyResponse = await fetch('/api/payment/verify', {
  method: 'POST',
  body: JSON.stringify({ merchantOrderId }),
});
```

**After (Cloud Functions):**
```typescript
const response = await fetch(`${cloudFunctionsUrl}/verifyPayment`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ merchantTransactionId: transactionId }),
});
```

**Key Changes:**
- Uses `transactionId` from query params
- Calls `/verifyPayment` Cloud Function
- Handles response data structure from Cloud Functions

## Environment Variables Required

Add to your `.env.local`:

```env
# Cloud Functions URL (get this after deploying)
NEXT_PUBLIC_CLOUD_FUNCTIONS_URL=https://us-central1-your-project-id.cloudfunctions.net

# Base URL for payment redirects
NEXT_PUBLIC_BASE_URL=https://yourwebsite.com

# Firebase Configuration (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## API Endpoints Mapping

| Frontend Call | Cloud Function | Method | Purpose |
|--------------|----------------|--------|---------|
| Register form submission | `/initiatePayment` | POST | Create registration & start payment |
| PhonePe redirect | `/paymentCallback` | POST | Handle payment completion (server-to-server) |
| Status page verification | `/verifyPayment` | POST | Verify payment & get registration details |
| Manual status check | `/checkStatus` | GET | Check payment status with PhonePe |

## Request/Response Formats

### 1. Initiate Payment

**Request:**
```typescript
POST /initiatePayment
{
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  emergencyContact: string;
  raceCategory: string;
  amount: number;
  dateOfBirth: string;
  tshirtSize: string;
  bloodGroup: string;
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    merchantTransactionId: "TXN_1234567890",
    instrumentResponse: {
      redirectInfo: {
        url: "https://mercury-uat.phonepe.com/..."
      }
    },
    registrationId: "firestore_doc_id"
  }
}
```

### 2. Verify Payment

**Request:**
```typescript
POST /verifyPayment
{
  merchantTransactionId: "TXN_1234567890"
}
```

**Response:**
```typescript
{
  success: true,
  transaction: {
    merchantTransactionId: "TXN_1234567890",
    status: "COMPLETED",
    amount: 500,
    ...
  },
  registration: {
    name: "John Doe",
    email: "john@example.com",
    raceCategory: "5K Run",
    ...
  },
  phonePeStatus: {
    state: "COMPLETED",
    transactionId: "PHX123456",
    ...
  },
  verified: true
}
```

## Testing Flow

### Local Development

1. **Start Next.js dev server:**
   ```bash
   npm run dev
   ```

2. **Point to deployed Cloud Functions:**
   ```env
   NEXT_PUBLIC_CLOUD_FUNCTIONS_URL=https://us-central1-your-project.cloudfunctions.net
   ```

3. **Or use Firebase emulators:**
   ```bash
   cd functions
   npm run serve
   ```
   
   Then update `.env.local`:
   ```env
   NEXT_PUBLIC_CLOUD_FUNCTIONS_URL=http://localhost:5001/your-project-id/us-central1
   ```

### Production Testing

1. **Deploy Cloud Functions:**
   ```bash
   firebase deploy --only functions
   ```

2. **Update environment variables** in Netlify:
   - Go to Site Settings → Environment Variables
   - Add `NEXT_PUBLIC_CLOUD_FUNCTIONS_URL`
   - Redeploy site

3. **Test end-to-end:**
   - Visit `/register`
   - Fill form and submit
   - Complete payment on PhonePe
   - Verify redirect to `/payment/status`

## Error Handling

### Frontend Errors

```typescript
try {
  const response = await fetch(`${cloudFunctionsUrl}/initiatePayment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(registrationData),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Failed to initiate payment');
  }

  // Success - redirect to PhonePe
  window.location.href = data.data.instrumentResponse.redirectInfo.url;

} catch (err) {
  console.error('Payment initiation error:', err);
  setError(err instanceof Error ? err.message : 'Failed to process registration');
}
```

### Common Error Scenarios

1. **Cloud Functions URL not set:**
   ```
   Error: Cloud Functions URL not configured
   ```
   **Solution:** Add `NEXT_PUBLIC_CLOUD_FUNCTIONS_URL` to environment

2. **CORS Error:**
   ```
   Access to fetch blocked by CORS policy
   ```
   **Solution:** Cloud Functions already have CORS enabled. Check URL is correct.

3. **PhonePe Error:**
   ```
   Error: KEY_NOT_CONFIGURED
   ```
   **Solution:** Contact PhonePe support to activate credentials

## Payment Flow Diagram

```
User fills form
     ↓
Frontend calls /initiatePayment
     ↓
Cloud Function creates Firestore records
     ↓
Cloud Function calls PhonePe API
     ↓
User redirected to PhonePe checkout
     ↓
User completes payment
     ↓
PhonePe calls /paymentCallback (server-to-server)
     ↓
Cloud Function updates Firestore
     ↓
PhonePe redirects user to /payment/status?transactionId=XXX
     ↓
Frontend calls /verifyPayment
     ↓
Status page displays result
```

## Netlify Deployment

### 1. Environment Variables

Add these in Netlify Dashboard → Site Settings → Environment Variables:

```
NEXT_PUBLIC_CLOUD_FUNCTIONS_URL=https://us-central1-your-project.cloudfunctions.net
NEXT_PUBLIC_BASE_URL=https://yourwebsite.netlify.app
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

### 2. Build Settings

```
Build command: npm run build
Publish directory: .next
```

### 3. Deploy

```bash
git push origin main
```

Netlify will automatically build and deploy.

## Advantages of Cloud Functions

1. **No Timeout Issues**: Cloud Functions can run up to 60 seconds (vs Netlify's 10 seconds)
2. **Reliable Callbacks**: PhonePe webhooks work consistently
3. **Better Scaling**: Google Cloud infrastructure
4. **Cost Effective**: Free tier covers most small events
5. **Easy Monitoring**: Firebase Console provides detailed logs

## Next Steps

1. ✅ Cloud Functions deployed
2. ✅ Frontend updated to use Cloud Functions
3. ✅ Environment variables configured
4. ⏳ Test end-to-end payment flow
5. ⏳ Monitor first few transactions
6. ⏳ Switch to production mode when ready

## Support Resources

- [Firebase Functions Docs](https://firebase.google.com/docs/functions)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/configure-builds/environment-variables/)
