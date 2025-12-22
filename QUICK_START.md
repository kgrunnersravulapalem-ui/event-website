# 🚀 Quick Start Guide

Get your PhonePe payment integration running in 15 minutes!

## Prerequisites

- Node.js 18+ installed
- Firebase account created
- PhonePe sandbox credentials

## Step-by-Step Setup

### 1️⃣ Configure Firebase Project (2 minutes)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login
```

**Update `.firebaserc`:**
```json
{
  "projects": {
    "default": "YOUR_FIREBASE_PROJECT_ID"
  }
}
```

### 2️⃣ Install & Deploy Cloud Functions (5 minutes)

```bash
# Install dependencies
cd functions
npm install

# Configure PhonePe credentials
cd ..
firebase functions:config:set phonepe.client_id="M23TCNCX7K1K7_2512221906"
firebase functions:config:set phonepe.client_secret="YOUR_CLIENT_SECRET"
firebase functions:config:set phonepe.environment="SANDBOX"

# Deploy
firebase deploy --only functions
```

After deployment, you'll see output like:
```
✔  functions[initiatePayment] deployed
   https://us-central1-your-project.cloudfunctions.net/initiatePayment
```

**Copy this URL!** ☝️

### 3️⃣ Configure Environment Variables (2 minutes)

Create `.env.local` in project root:

```env
NEXT_PUBLIC_CLOUD_FUNCTIONS_URL=https://us-central1-YOUR-PROJECT.cloudfunctions.net
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Add your Firebase config from Firebase Console
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
```

**Update Cloud Functions with callback URL:**
```bash
firebase functions:config:set app.url="https://us-central1-YOUR-PROJECT.cloudfunctions.net"
firebase deploy --only functions
```

### 4️⃣ Set PhonePe Callback URL (1 minute)

1. Go to [PhonePe Business Dashboard](https://business.phonepe.com/)
2. Navigate to Test Mode → API Settings
3. Set **Callback URL**:
   ```
   https://us-central1-YOUR-PROJECT.cloudfunctions.net/paymentCallback
   ```

### 5️⃣ Enable Firestore (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Firestore Database** → **Create Database**
3. Choose **Production Mode**
4. Select a location
5. Click **Enable**

### 6️⃣ Test Locally (3 minutes)

```bash
# Start Next.js development server
npm install
npm run dev
```

Visit `http://localhost:3000/register` and test:
1. Fill registration form
2. Click "Proceed to Pay"
3. Complete test payment on PhonePe
4. Verify redirect to status page

## 🎯 That's It!

Your payment integration is now live and ready for testing!

## 📊 Verify Everything Works

### Check Cloud Functions
```bash
firebase functions:log --only initiatePayment
```

### Check Firestore Data
Visit Firebase Console → Firestore Database to see:
- `registrations` collection
- `transactions` collection

### Test Payment Flow
1. Register page loads ✅
2. Form submission works ✅
3. Redirect to PhonePe ✅
4. Payment completion ✅
5. Status page shows result ✅
6. Data saved in Firestore ✅

## 🚨 Troubleshooting

### "Cloud Functions URL not configured"
→ Check `.env.local` has `NEXT_PUBLIC_CLOUD_FUNCTIONS_URL`

### "KEY_NOT_CONFIGURED" from PhonePe
→ Contact PhonePe support to activate credentials

### Functions not deploying
```bash
cd functions
npm run build  # Check for TypeScript errors
```

### Need to see what's configured?
```bash
firebase functions:config:get
```

## 📱 Deploy to Production

### Netlify Deployment

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add PhonePe integration"
   git push
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - New site from Git
   - Select your repository

3. **Add Environment Variables** in Netlify:
   ```
   NEXT_PUBLIC_CLOUD_FUNCTIONS_URL=https://us-central1-your-project.cloudfunctions.net
   NEXT_PUBLIC_BASE_URL=https://yoursite.netlify.app
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   ```

4. **Deploy!**

## 💡 Quick Commands Reference

```bash
# View logs
firebase functions:log

# View config
firebase functions:config:get

# Deploy only functions
firebase deploy --only functions

# Deploy everything
firebase deploy

# Run local emulator
cd functions && npm run serve
```

## 📚 Next Steps

- Read [CLOUD_FUNCTIONS_DEPLOYMENT.md](CLOUD_FUNCTIONS_DEPLOYMENT.md) for detailed setup
- Check [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md) for API details
- Review [IMPLEMENTATION_COMPLETE.md](IMPLEMENTATION_COMPLETE.md) for full overview

## ✅ Production Checklist

Before going live:

- [ ] Update PhonePe credentials to production keys
- [ ] Change `phonepe.environment` to `"PRODUCTION"`
- [ ] Update callback URL to production domain
- [ ] Test with real payment (small amount)
- [ ] Set up Firestore security rules
- [ ] Enable Firebase authentication (optional)
- [ ] Configure email notifications
- [ ] Set up monitoring alerts

## 🎉 You're Ready!

Your running event payment system is fully configured and ready to accept registrations!

**Need help?** Check the detailed guides in the docs folder.

**Happy coding!** 🏃‍♂️💨
