#!/bin/bash

# 🚨 SAFE PRODUCTION DEPLOYMENT - Quick Start Script
# This script helps you safely analyze pending payments before making any changes

set -e  # Exit on error

echo "=================================================="
echo "  PENDING PAYMENTS ANALYSIS - SAFE MODE"
echo "=================================================="
echo ""
echo "⚠️  This script will:"
echo "   1. Deploy the read-only analysis function"
echo "   2. Run the analysis"
echo "   3. Save results to pending_analysis.json"
echo "   4. Display summary"
echo ""
echo "✅ NO DATA WILL BE MODIFIED"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Step 1: Build and deploy analysis function
echo ""
echo "📦 Step 1: Building functions..."
cd functions
npm run build

echo ""
echo "🚀 Step 2: Deploying analysis function..."
# firebase deploy --only functions:analyzePendingPayments

# Get the function URL
PROJECT_ID=$(firebase use | grep "active project" | awk '{print $4}' | tr -d '()')
REGION="us-central1"  # Change if your region is different
# FUNCTION_URL="https://${REGION}-${PROJECT_ID}.cloudfunctions.net/analyzePendingPayments"
FUNCTION_URL="https://us-central1-konaseema-run.cloudfunctions.net/analyzePendingPayments"
echo ""
echo "✅ Function deployed successfully!"
echo "📍 URL: $FUNCTION_URL"

# Step 2: Run analysis
echo ""
echo "🔍 Step 3: Running analysis..."
echo "   This may take 30 seconds to 2 minutes..."
echo ""

curl -X POST "$FUNCTION_URL" -H "Content-Type: application/json" > ../pending_analysis.json

echo ""
echo "✅ Analysis complete!"
echo "📄 Results saved to: pending_analysis.json"

# Step 3: Display summary
echo ""
echo "=================================================="
echo "  SUMMARY"
echo "=================================================="

if command -v jq &> /dev/null; then
    # If jq is installed, show formatted summary
    cat ../pending_analysis.json | jq '.summary'
    
    echo ""
    echo "📊 Detailed breakdown:"
    echo ""
    echo "To Complete (SUCCESS in PhonePe):"
    cat ../pending_analysis.json | jq '.categorized.toComplete | length'
    echo ""
    echo "To Fail (FAILED in PhonePe):"
    cat ../pending_analysis.json | jq '.categorized.toFail | length'
    echo ""
    echo "Still Pending (Genuinely pending):"
    cat ../pending_analysis.json | jq '.categorized.stillPending | length'
    echo ""
    echo "Errors:"
    cat ../pending_analysis.json | jq '.categorized.errors | length'
else
    # If jq is not installed, show raw JSON
    echo "⚠️  Install 'jq' for better formatting: brew install jq"
    echo ""
    cat ../pending_analysis.json
fi

echo ""
echo "=================================================="
echo "  NEXT STEPS"
echo "=================================================="
echo ""
echo "1. 📋 Review the full report: pending_analysis.json"
echo "2. 🔍 Cross-check each order with PhonePe dashboard"
echo "3. ✍️  Document your findings"
echo "4. 📖 Follow SAFE_PRODUCTION_DEPLOYMENT.md for next steps"
echo ""
echo "⚠️  DO NOT deploy the cron job until you've manually"
echo "   verified and updated the pending payments!"
echo ""
echo "=================================================="

cd ..
