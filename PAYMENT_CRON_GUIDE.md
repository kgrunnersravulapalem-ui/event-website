# Payment Cron Job Implementation Guide

## Overview
This document explains the cron job system implemented to automatically check and update pending payments that may have succeeded on PhonePe but weren't updated in Firebase due to webhook failures or network issues.

## Problem Statement
**Issue**: Payment succeeds on PhonePe dashboard, but the `verifyPayment` function doesn't update Firebase because:
- Webhook callback fails due to network issues
- Timeout during payment verification
- Race conditions between payment completion and status check

**Solution**: Automated cron job that periodically checks all pending payments and updates their status.

## Implementation Details

### Files Created/Modified

#### 1. **New File**: `/functions/src/cronJobs.ts`
This file contains two main functions:

##### a. `checkPendingPayments` (HTTP-triggered)
- **Purpose**: Can be called manually via HTTP for testing or emergency checks
- **Endpoint**: `POST https://your-cloud-function-url/checkPendingPayments`
- **Timeout**: 540 seconds (9 minutes)
- **Memory**: 512MB

##### b. `scheduledCheckPendingPayments` (Scheduled)
- **Purpose**: Runs automatically every 5 minutes
- **Schedule**: `*/5 * * * *` (cron expression)
- **Timezone**: Asia/Kolkata
- **Timeout**: 540 seconds
- **Memory**: 512MB

### How It Works

1. **Query Pending Transactions**
   - Finds all transactions with `status: 'PENDING'`
   - Filters transactions older than 2 minutes (avoids checking newly created orders)
   - Limits to 50 transactions per run (prevents timeout)

2. **Check Each Transaction**
   - Calls PhonePe's status check API
   - Compares current status with stored status

3. **Update Based on Status**
   - **COMPLETED**: 
     - Updates transaction and registration status
     - Adds participant to participants collection
     - Sends success email (if not already sent)
   - **FAILED/CANCELLED/TIMEOUT**: 
     - Updates status to failed
     - Sends failure email (if not already sent)
   - **PENDING**: 
     - Skips (will check again in next run)

4. **Rate Limiting**
   - Adds 500ms delay between each transaction check
   - Prevents PhonePe API rate limiting

### Configuration

#### Environment Variables Required
Already configured in your existing setup:
- `PHONEPE_CLIENT_ID`
- `PHONEPE_CLIENT_SECRET`
- `PHONEPE_CLIENT_VERSION`
- `PHONEPE_ENVIRONMENT` (SANDBOX or PRODUCTION)

## Deployment Instructions

### Step 1: Update Firebase Functions Index
Add the cron job exports to your functions index file:

```typescript
// In /functions/src/index.ts or /functions/index.ts
export { checkPendingPayments, scheduledCheckPendingPayments } from './src/cronJobs';
```

### Step 2: Deploy Functions
```bash
cd functions
npm run build
firebase deploy --only functions:checkPendingPayments,functions:scheduledCheckPendingPayments
```

### Step 3: Verify Deployment
After deployment, you should see:
```
✔  functions[checkPendingPayments(us-central1)] Successful create operation.
✔  functions[scheduledCheckPendingPayments(us-central1)] Successful create operation.
```

### Step 4: Test Manual Trigger (Optional)
Test the HTTP-triggered version:

```bash
curl -X POST https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/checkPendingPayments
```

Expected response:
```json
{
  "success": true,
  "message": "Pending payments check completed",
  "processed": 5,
  "updated": 3,
  "succeeded": 2,
  "failed": 1,
  "stillPending": 2,
  "errors": 0
}
```

## Important Notes

### Firebase Blaze Plan Requirement
⚠️ **Cloud Scheduler requires Firebase Blaze (pay-as-you-go) plan**

If you're on the Spark (free) plan:
- The HTTP-triggered version (`checkPendingPayments`) will work
- The scheduled version (`scheduledCheckPendingPayments`) will NOT work
- You'll need to upgrade to Blaze plan or use an external cron service

### Alternative: External Cron Service
If you don't want to upgrade to Blaze plan, use a free external cron service:

1. **cron-job.org** (Free)
   - Create account at https://cron-job.org
   - Add new cron job
   - URL: `https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/checkPendingPayments`
   - Method: POST
   - Schedule: Every 5 minutes

2. **EasyCron** (Free tier available)
   - Similar setup to cron-job.org

3. **GitHub Actions** (Free for public repos)
   ```yaml
   name: Check Pending Payments
   on:
     schedule:
       - cron: '*/5 * * * *'
   jobs:
     check:
       runs-on: ubuntu-latest
       steps:
         - name: Trigger Cloud Function
           run: |
             curl -X POST ${{ secrets.CLOUD_FUNCTION_URL }}
   ```

## Monitoring and Logs

### View Logs
```bash
# View scheduled function logs
firebase functions:log --only scheduledCheckPendingPayments

# View HTTP function logs
firebase functions:log --only checkPendingPayments
```

### Log Messages to Look For

**Success**:
```
[SCHEDULED] Starting pending payments check for environment: PRODUCTION
[SCHEDULED] Found 3 pending transactions to check
Processing pending transaction: ORDER_1768888713185
PhonePe status for ORDER_1768888713185: COMPLETED
Participant added to participants with orderId: ORDER_1768888713185
Success email sent for ORDER_1768888713185
[SCHEDULED] Pending payments check completed: { processed: 3, updated: 2, succeeded: 2, failed: 0 }
```

**No Pending Transactions**:
```
[SCHEDULED] Starting pending payments check for environment: PRODUCTION
[SCHEDULED] Found 0 pending transactions to check
[SCHEDULED] No pending transactions to process
```

## Cost Estimation

### Firebase Blaze Plan Costs
- **Cloud Scheduler**: $0.10 per job per month (1 job = ~$0.10/month)
- **Cloud Functions Invocations**: 
  - 2 million invocations free per month
  - Running every 5 minutes = ~8,640 invocations/month
  - Well within free tier ✅
- **Cloud Functions Compute Time**:
  - 400,000 GB-seconds free per month
  - Estimated usage: ~4,320 GB-seconds/month (if each run takes 30s)
  - Well within free tier ✅

**Total Estimated Cost**: ~$0.10/month

## Customization Options

### Change Schedule Frequency
Edit line 381 in `cronJobs.ts`:

```typescript
// Every 10 minutes instead of 5
.schedule('*/10 * * * *')

// Every hour
.schedule('0 * * * *')

// Every 30 minutes
.schedule('*/30 * * * *')
```

### Change Cutoff Time
Edit line 275 in `cronJobs.ts`:

```typescript
// Check transactions older than 5 minutes instead of 2
const cutoffTime = new Date(Date.now() - 5 * 60 * 1000);
```

### Change Batch Size
Edit line 282 in `cronJobs.ts`:

```typescript
// Process 100 transactions instead of 50
.limit(100)
```

## Troubleshooting

### Issue: Scheduled function not running
**Solution**: 
1. Verify Firebase Blaze plan is active
2. Check Cloud Scheduler in Firebase Console
3. Manually trigger to test: `gcloud scheduler jobs run scheduledCheckPendingPayments`

### Issue: Function timing out
**Solution**: 
1. Reduce batch size (limit)
2. Increase timeout (max 540 seconds)
3. Add more delay between requests

### Issue: PhonePe API rate limiting
**Solution**: 
1. Increase delay between requests (currently 500ms)
2. Reduce batch size
3. Reduce cron frequency

## Security Considerations

1. **CORS**: HTTP function allows all origins for testing. In production, restrict to your domain:
   ```typescript
   res.set('Access-Control-Allow-Origin', 'https://kgrunners.in');
   ```

2. **Authentication**: Consider adding authentication to HTTP endpoint:
   ```typescript
   const authHeader = req.headers['authorization'];
   if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
     res.status(401).json({ error: 'Unauthorized' });
     return;
   }
   ```

## Testing Checklist

- [ ] Deploy functions successfully
- [ ] Manually trigger HTTP endpoint
- [ ] Verify logs show correct execution
- [ ] Create a test pending payment
- [ ] Wait 5 minutes and verify it gets processed
- [ ] Check Firebase for updated status
- [ ] Verify email was sent
- [ ] Check participant was added to collection

## Contact Phone Number Addition

### Modified Files
1. `/app/register/page.tsx` - Added support section with phone number
2. `/app/register/Register.module.css` - Added styling for support section

### What Was Added
A prominent contact section displaying:
```
Need help? Contact us at 8686144086
```

- Clickable phone number (tel: link)
- Styled with gradient background
- Hover effects for better UX
- Positioned below category selection

## Next Steps

1. **Deploy the cron job functions**
2. **Monitor logs for first few runs**
3. **Verify pending payments are being processed**
4. **Set up alerts for errors** (optional)
5. **Document any edge cases** you encounter

## Support

If you encounter issues:
1. Check Firebase Functions logs
2. Verify PhonePe API credentials
3. Test with manual HTTP trigger first
4. Review this documentation

---

**Created**: 2026-01-23
**Last Updated**: 2026-01-23
**Version**: 1.0
