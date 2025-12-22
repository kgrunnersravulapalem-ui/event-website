# Firebase Cloud Functions Deployment Guide

This guide will help you deploy the PhonePe payment integration using Firebase Cloud Functions, which is compatible with Netlify deployment.

## Prerequisites

1. **Firebase Project**: Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. **Firebase CLI**: Install Firebase CLI globally
   ```bash
   npm install -g firebase-tools
   ```
3. **Firebase Login**: Authenticate with Firebase
   ```bash
   firebase login
   ```

## Step 1: Configure Firebase Project

1. **Update `.firebaserc`** with your Firebase project ID:
   ```json
   {
     "projects": {
       "default": "your-firebase-project-id"
     }
   }
   ```

2. **Enable Firestore** in Firebase Console:
   - Go to Firestore Database
   - Click "Create Database"
   - Start in **production mode**
   - Choose a location close to your users

3. **Enable Billing** (Required for Cloud Functions):
   - Go to Firebase Console → Billing
   - Upgrade to **Blaze Plan** (pay as you go)
   - Note: Free tier includes generous limits

## Step 2: Install Cloud Functions Dependencies

```bash
cd functions
npm install
```

## Step 3: Set Environment Variables

Configure PhonePe credentials and app settings using Firebase Functions config:

```bash
# PhonePe Credentials
firebase functions:config:set phonepe.client_id="M23TCNCX7K1K7_2512221906"
firebase functions:config:set phonepe.client_secret="your_actual_client_secret_here"
firebase functions:config:set phonepe.client_version="1"
firebase functions:config:set phonepe.environment="SANDBOX"

# Your Cloud Functions URL (will be updated after first deployment)
firebase functions:config:set app.url="https://us-central1-your-project-id.cloudfunctions.net"
```

**View current config:**
```bash
firebase functions:config:get
```

## Step 4: Deploy Cloud Functions

```bash
# Deploy all functions
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:initiatePayment
```

After deployment, you'll see URLs like:
```
✔  functions[initiatePayment(us-central1)] deployed
   https://us-central1-your-project-id.cloudfunctions.net/initiatePayment
```

## Step 5: Update Frontend Environment Variables

1. **Update `.env.local`** with your Cloud Functions URL:
   ```env
   NEXT_PUBLIC_CLOUD_FUNCTIONS_URL=https://us-central1-your-project-id.cloudfunctions.net
   NEXT_PUBLIC_BASE_URL=https://yourwebsite.com
   ```

2. **Update `app.url` in Firebase config**:
   ```bash
   firebase functions:config:set app.url="https://us-central1-your-project-id.cloudfunctions.net"
   firebase deploy --only functions
   ```

## Step 6: Set Firestore Security Rules

Update Firestore rules in Firebase Console → Firestore Database → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only Cloud Functions can write to registrations and transactions
    match /registrations/{registrationId} {
      allow read: if request.auth != null;
      allow write: if false; // Only Cloud Functions can write
    }
    
    match /transactions/{transactionId} {
      allow read: if request.auth != null;
      allow write: if false; // Only Cloud Functions can write
    }
  }
}
```

## Step 7: Configure PhonePe Callback URL

1. Login to [PhonePe Business Dashboard](https://business.phonepe.com/)
2. Go to **Test Mode** → **API Settings**
3. Set **Callback URL** to:
   ```
   https://us-central1-your-project-id.cloudfunctions.net/paymentCallback
   ```

## Step 8: Test the Integration

### Local Testing (Optional)

```bash
# Start Firebase emulators
cd functions
npm run serve
```

This starts local emulators at `http://localhost:5001/your-project-id/us-central1/`

### Production Testing

1. Deploy your Next.js app to Netlify
2. Visit `/register` page
3. Fill registration form
4. Click "Proceed to Pay"
5. Complete payment on PhonePe test page
6. Verify redirect to `/payment/status`

## Cloud Functions Endpoints

After deployment, your functions will be available at:

- **Initiate Payment**: `POST https://[region]-[project-id].cloudfunctions.net/initiatePayment`
- **Payment Callback**: `POST https://[region]-[project-id].cloudfunctions.net/paymentCallback`
- **Check Status**: `GET https://[region]-[project-id].cloudfunctions.net/checkStatus?transactionId=TXN_xxx`
- **Verify Payment**: `POST https://[region]-[project-id].cloudfunctions.net/verifyPayment`

## Monitoring and Logs

### View Logs
```bash
firebase functions:log

# Or filter by function
firebase functions:log --only initiatePayment
```

### Firebase Console
- Go to Functions → Logs to see detailed execution logs
- Monitor errors and performance

## Cost Optimization

Cloud Functions pricing:
- **Invocations**: First 2M free, then $0.40 per million
- **Compute time**: First 400K GB-seconds free
- **Egress**: First 5GB free

For a running event with ~1000 registrations:
- Estimated cost: **< $1**

## Troubleshooting

### Function Not Deploying
```bash
# Check for TypeScript errors
cd functions
npm run build

# Check Firebase CLI version
firebase --version  # Should be >= 12.0.0
npm install -g firebase-tools@latest
```

### CORS Errors
Cloud Functions already include CORS headers. If issues persist, verify:
1. `NEXT_PUBLIC_CLOUD_FUNCTIONS_URL` matches deployed URL
2. No trailing slashes in URL

### PhonePe Callback Not Working
1. Verify callback URL in PhonePe dashboard
2. Check Cloud Functions logs for errors
3. Ensure `app.url` config is correct

### Environment Variables Not Working
```bash
# Verify config
firebase functions:config:get

# Re-deploy after config changes
firebase deploy --only functions
```

## Production Checklist

- [ ] Firebase project created and configured
- [ ] Firestore database enabled
- [ ] Billing enabled (Blaze plan)
- [ ] PhonePe credentials configured
- [ ] Cloud Functions deployed successfully
- [ ] Frontend environment variables updated
- [ ] PhonePe callback URL configured
- [ ] Test payment completed successfully
- [ ] Firestore security rules updated
- [ ] Monitoring set up

## Next Steps

1. **Switch to Production**:
   ```bash
   firebase functions:config:set phonepe.environment="PRODUCTION"
   firebase deploy --only functions
   ```

2. **Update PhonePe credentials** to production keys

3. **Monitor** first few real transactions closely

## Support

- [Firebase Documentation](https://firebase.google.com/docs/functions)
- [PhonePe API Docs](https://developer.phonepe.com/v1/docs)
- [GitHub Issues](https://github.com/your-repo/issues)
