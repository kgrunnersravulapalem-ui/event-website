# Quick Deployment Commands

## 🚀 Deploy Cron Job Functions

### Build and Deploy
```bash
cd functions
npm run build
firebase deploy --only functions:checkPendingPayments,functions:scheduledCheckPendingPayments
```

### Test Manual Trigger
```bash
# Replace with your actual Cloud Functions URL
curl -X POST https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/checkPendingPayments
```

## 📊 Monitor Logs

### View Scheduled Function Logs
```bash
firebase functions:log --only scheduledCheckPendingPayments --limit 50
```

### View HTTP Function Logs
```bash
firebase functions:log --only checkPendingPayments --limit 50
```

### Stream Live Logs
```bash
firebase functions:log --only scheduledCheckPendingPayments --follow
```

## 🔍 Check Function Status

### List All Functions
```bash
firebase functions:list
```

### Check Specific Function
```bash
firebase functions:config:get
```

## 🛠️ Troubleshooting Commands

### Delete and Redeploy
```bash
firebase functions:delete checkPendingPayments
firebase functions:delete scheduledCheckPendingPayments
firebase deploy --only functions:checkPendingPayments,functions:scheduledCheckPendingPayments
```

### Check Cloud Scheduler Jobs (if using Blaze plan)
```bash
gcloud scheduler jobs list
```

### Manually Trigger Scheduled Job
```bash
gcloud scheduler jobs run scheduledCheckPendingPayments
```

## 📝 Environment Setup

### Set Environment Variables (if needed)
```bash
firebase functions:config:set phonepe.environment="PRODUCTION"
firebase functions:config:set phonepe.client_id="YOUR_CLIENT_ID"
firebase functions:config:set phonepe.client_secret="YOUR_CLIENT_SECRET"
```

### View Current Config
```bash
firebase functions:config:get
```

## 🎯 Quick Test Workflow

1. **Deploy Functions**
   ```bash
   cd functions && npm run build && firebase deploy --only functions:checkPendingPayments,functions:scheduledCheckPendingPayments
   ```

2. **Create Test Pending Payment** (in Firebase Console)
   - Go to Firestore
   - Find a transaction with status: "PENDING"
   - Note the order ID

3. **Manually Trigger Check**
   ```bash
   curl -X POST https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/checkPendingPayments
   ```

4. **Verify Results**
   ```bash
   firebase functions:log --only checkPendingPayments --limit 10
   ```

5. **Check Firebase**
   - Transaction status should be updated
   - Participant should be in participants collection
   - Email should be sent

## 🔔 Set Up Alerts (Optional)

### Using Firebase Console
1. Go to Firebase Console → Functions
2. Click on function name
3. Go to "Logs" tab
4. Click "Create Alert"
5. Set conditions (e.g., error rate > 5%)

## 📱 Contact Support Number

The contact phone number **8686144086** has been added to the register page below the category selection.

## ⚠️ Important Notes

- **Blaze Plan Required**: For scheduled functions (auto-run every 5 minutes)
- **Free Alternative**: Use HTTP function with external cron service (cron-job.org)
- **Cost**: ~$0.10/month for Cloud Scheduler
- **Frequency**: Runs every 5 minutes
- **Batch Size**: Processes up to 50 pending transactions per run
- **Timeout**: 9 minutes maximum
- **Delay**: 500ms between each transaction check

## 🎨 UI Changes Made

### Register Page
- ✅ Added support section with phone number 8686144086
- ✅ Positioned below category selection
- ✅ Clickable tel: link
- ✅ Gradient background with hover effects
- ✅ Mobile responsive

## 📂 Files Modified/Created

### New Files
- `/functions/src/cronJobs.ts` - Cron job implementation
- `/PAYMENT_CRON_GUIDE.md` - Comprehensive guide
- `/QUICK_DEPLOY.md` - This file

### Modified Files
- `/functions/src/index.ts` - Added cron job exports
- `/app/register/page.tsx` - Added contact support section
- `/app/register/Register.module.css` - Added support section styles

## 🔄 Next Steps

1. [ ] Deploy the cron job functions
2. [ ] Test manual trigger
3. [ ] Monitor first few automated runs
4. [ ] Verify pending payments are processed
5. [ ] Check emails are sent correctly
6. [ ] Document any edge cases

---

**Need Help?** Check the full guide: `PAYMENT_CRON_GUIDE.md`
