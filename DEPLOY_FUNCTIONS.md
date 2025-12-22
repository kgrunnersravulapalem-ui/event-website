# Deploy Firebase Cloud Functions to Google Cloud

This guide will help you deploy the PhonePe payment Cloud Functions to Google Cloud Firebase.

## Prerequisites

1. **Firebase CLI installed**
   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase project**: `konaseema-run` (already configured in `.firebaserc`)

## Step-by-Step Deployment

### 1. Login to Firebase

```bash
firebase login
```

This will open a browser window for authentication.

### 2. Set Firebase Project

```bash
firebase use konaseema-run
```

### 3. Configure Environment Variables

Set the PhonePe API credentials and webhook settings:

```bash
# PhonePe API v2 Configuration
firebase functions:config:set phonepe.client_id="M23TCNCX7K1K7_2512221906"
firebase functions:config:set phonepe.client_secret="YOUR_CLIENT_SECRET_HERE"
firebase functions:config:set phonepe.client_version="1"
firebase functions:config:set phonepe.environment="SANDBOX"

# Webhook Authentication (get from PhonePe Business Dashboard)
firebase functions:config:set webhook.username="YOUR_WEBHOOK_USERNAME"
firebase functions:config:set webhook.password="YOUR_WEBHOOK_PASSWORD"

# App Configuration
firebase functions:config:set app.base_url="https://www.kgrunners.com"
```

**Important:** Replace the placeholder values with your actual PhonePe credentials.

### 4. Verify Configuration

```bash
firebase functions:config:get
```

This should display all your configured variables.

### 5. Deploy Cloud Functions

```bash
# Deploy only functions (recommended for first deployment)
firebase deploy --only functions

# Or deploy specific function
firebase deploy --only functions:initiatePayment
```

### 6. Get Cloud Functions URLs

After deployment, Firebase will display the URLs for your functions. They will look like:

```
https://us-central1-konaseema-run.cloudfunctions.net/initiatePayment
https://us-central1-konaseema-run.cloudfunctions.net/paymentWebhook
https://us-central1-konaseema-run.cloudfunctions.net/checkStatus
https://us-central1-konaseema-run.cloudfunctions.net/verifyPayment
```

### 7. Update .env.local

Update your `.env.local` file with the Cloud Functions URL:

```dotenv
NEXT_PUBLIC_CLOUD_FUNCTIONS_URL=https://us-central1-konaseema-run.cloudfunctions.net
```

### 8. Configure PhonePe Webhook

1. Log in to [PhonePe Business Dashboard](https://business.phonepe.com/)
2. Go to **API Settings** → **Webhooks**
3. Set webhook URL:
   ```
   https://us-central1-konaseema-run.cloudfunctions.net/paymentWebhook
   ```
4. Configure webhook authentication (username/password)
5. Save settings

### 9. Redeploy Netlify Site

After updating `.env.local`, push changes and redeploy on Netlify:

```bash
git add .
git commit -m "Update Cloud Functions URL"
git push
```

## Function Endpoints

Your deployed Cloud Functions will have these endpoints:

| Function | Method | Endpoint | Description |
|----------|--------|----------|-------------|
| `initiatePayment` | POST | `/initiatePayment` | Create payment and get checkout URL |
| `paymentWebhook` | POST | `/paymentWebhook` | Receive PhonePe payment status updates |
| `checkStatus` | GET | `/checkStatus?orderId=xxx` | Check payment status |
| `verifyPayment` | POST | `/verifyPayment` | Verify payment and get registration details |

## Testing in Sandbox Mode

1. Use PhonePe Sandbox environment (`SANDBOX` mode is already set)
2. Test payment flow with sandbox credentials
3. Check logs: `firebase functions:log`

## Going to Production

When ready to go live:

```bash
# Update to production mode
firebase functions:config:set phonepe.environment="PRODUCTION"

# Update PhonePe credentials to production ones
firebase functions:config:set phonepe.client_id="YOUR_PROD_CLIENT_ID"
firebase functions:config:set phonepe.client_secret="YOUR_PROD_CLIENT_SECRET"

# Redeploy
firebase deploy --only functions
```

## Monitoring and Logs

```bash
# View real-time logs
firebase functions:log

# View specific function logs
firebase functions:log --only initiatePayment
```

## Troubleshooting

### Error: "Insufficient permissions"

Enable required APIs in Google Cloud Console:
- Cloud Functions API
- Cloud Build API
- Artifact Registry API

### Error: "Billing account required"

Firebase requires a Blaze (pay-as-you-go) plan for Cloud Functions:
1. Go to Firebase Console
2. Upgrade to Blaze plan
3. Set a budget alert (optional)

### CORS Issues

If you encounter CORS errors:
1. CORS headers are already set in the functions (`Access-Control-Allow-Origin: *`)
2. For production, restrict origins in the code

### Webhook Not Receiving Events

1. Check webhook URL in PhonePe Dashboard
2. Verify webhook authentication credentials match
3. Check function logs: `firebase functions:log --only paymentWebhook`

## Cost Estimation

Firebase Cloud Functions pricing (Blaze plan):
- First 2 million invocations/month: **FREE**
- First 400,000 GB-seconds/month: **FREE**
- First 200,000 CPU-seconds/month: **FREE**

For a typical event registration site, you'll likely stay within free tier limits.

## Support

- Firebase Docs: https://firebase.google.com/docs/functions
- PhonePe Docs: https://developer.phonepe.com/
