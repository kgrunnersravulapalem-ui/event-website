#!/bin/bash
# Quick Deploy Script for Firebase Cloud Functions

echo "🚀 Deploying PhonePe Payment Functions to Firebase..."
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
fi

# Login to Firebase
echo "📝 Step 1: Login to Firebase"
firebase login

# Set project
echo "📝 Step 2: Set Firebase project"
firebase use konaseema-run

# Show current config
echo "📝 Step 3: Current configuration"
firebase functions:config:get

echo ""
echo "⚠️  IMPORTANT: Before deploying, ensure you have set the following config:"
echo ""
echo "firebase functions:config:set phonepe.client_id=\"M23TCNCX7K1K7_2512221906\""
echo "firebase functions:config:set phonepe.client_secret=\"ZjhjYTFkNzAtN2UyMS00NGMzLWI5NTktY2JlNGFlZTBiODQ5\""
echo "firebase functions:config:set phonepe.client_version=\"1\""
echo "firebase functions:config:set phonepe.environment=\"SANDBOX\""
echo "firebase functions:config:set app.base_url=\"https://www.kgrunners.com\""
echo ""
echo "Optional (for webhook auth - not required by PhonePe v2):"
echo "firebase functions:config:set webhook.username=\"YOUR_USERNAME\""
echo "firebase functions:config:set webhook.password=\"YOUR_PASSWORD\""
echo ""

read -p "Have you set all the configuration? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please set the configuration first, then run this script again."
    exit 1
fi

# Deploy functions
echo "📝 Step 4: Deploying Cloud Functions..."
firebase deploy --only functions

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Note the function URLs from the output above"
echo "2. Update NEXT_PUBLIC_CLOUD_FUNCTIONS_URL in .env.local"
echo "3. Configure webhook URL in PhonePe Business Dashboard"
echo "4. Push changes to Git and redeploy Netlify"
echo ""
echo "Function URLs will be in format:"
echo "https://us-central1-konaseema-run.cloudfunctions.net/{functionName}"
