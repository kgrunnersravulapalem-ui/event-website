# 🚀 ONE-TIME CLEANUP - Quick Guide

## What This Does

The `cleanupPendingPayments` function processes **ALL** pending payments without any limits:
- ✅ **NO cutoff time** - Processes all pending regardless of age
- ✅ **NO limit** - Processes all ~20 pending transactions at once
- ✅ **Updates Firebase** - Marks as COMPLETED or FAILED
- ✅ **Sends emails** - Success or failure notifications
- ✅ **Adds participants** - To participants collection

---

## 🎯 When to Use This

**Use this ONE TIME to clear the backlog of ~20 pending payments.**

After this cleanup:
- Use the regular `scheduledCheckPendingPayments` (runs every 15 min)
- That one has safeguards (2-min cutoff, 50 limit) for ongoing maintenance

---

## 📋 Step-by-Step Instructions

### Step 1: Deploy the Cleanup Function

```bash
cd functions
npm run build
firebase deploy --only functions:cleanupPendingPayments
```

**Expected Output:**
```
✔  functions[cleanupPendingPayments(us-central1)] Successful create operation.
Function URL: https://us-central1-konaseema-run.cloudfunctions.net/cleanupPendingPayments
```

**⏱️ Time**: ~2-3 minutes

---

### Step 2: Run the Cleanup

```bash
curl -X POST https://us-central1-konaseema-run.cloudfunctions.net/cleanupPendingPayments > cleanup_results.json
```

**⏱️ Time**: ~2-5 minutes (depends on number of pending payments)

---

### Step 3: Monitor the Logs (Optional)

While it's running, monitor in another terminal:

```bash
firebase functions:log --only cleanupPendingPayments --follow
```

**You'll see:**
```
================================================================================
ONE-TIME CLEANUP - Processing ALL pending payments
Environment: PRODUCTION
Started at: 2026-01-23T07:45:00.000Z
================================================================================

Found 20 pending transactions to process

--------------------------------------------------------------------------------
[1/20] Processing: ORDER_1768888713185
Age: 1440 minutes
Participant: John Doe (john@example.com)
PhonePe status for ORDER_1768888713185: COMPLETED
✅ Updated to COMPLETED
--------------------------------------------------------------------------------

[2/20] Processing: ORDER_1768888713186
...

================================================================================
CLEANUP COMPLETED
================================================================================
Total Processed: 20
Updated: 18
  ✅ Succeeded: 15
  ❌ Failed: 2
Still Pending: 2
Errors: 0
Completed at: 2026-01-23T07:48:00.000Z
================================================================================
```

---

### Step 4: Review Results

```bash
cat cleanup_results.json
```

**Or with formatting:**
```bash
cat cleanup_results.json | jq '.'
```

**Expected Output:**
```json
{
  "success": true,
  "message": "One-time cleanup completed",
  "timestamp": "2026-01-23T07:48:00.000Z",
  "environment": "PRODUCTION",
  "processed": 20,
  "updated": 18,
  "succeeded": 15,
  "failed": 2,
  "stillPending": 2,
  "errors": 0,
  "details": [
    {
      "orderId": "ORDER_1768888713185",
      "ageInMinutes": 1440,
      "oldStatus": "PENDING",
      "newStatus": "COMPLETED",
      "updated": true,
      "participantName": "John Doe"
    }
    // ... more
  ]
}
```

---

### Step 5: Verify in Firebase

**Check these collections:**

1. **Transactions** (`transactions` or `transactions-sandbox`)
   - All should show updated status (COMPLETED or FAILED)
   - Check `cleanupCheckedAt` timestamp

2. **Registrations** (`registrations` or `registrations-sandbox`)
   - Status should be CONFIRMED or PAYMENT_FAILED
   - Check `paymentStatus` field

3. **Participants** (`participants` or `participants-sandbox`)
   - All successful payments should have participant entries
   - Check count matches succeeded count

---

### Step 6: Verify Emails Sent

Check your email service logs to confirm:
- ✅ Success emails sent to all COMPLETED transactions
- ✅ Failure emails sent to all FAILED transactions

---

## 🔄 After Cleanup

### Option 1: Run Analysis Again (Recommended)

```bash
curl -X POST https://us-central1-konaseema-run.cloudfunctions.net/analyzePendingPayments > post_cleanup_analysis.json
```

**Expected Result:**
```json
{
  "summary": {
    "total": 2,  // Only genuinely pending ones left
    "shouldBeCompleted": 0,
    "shouldBeFailed": 0,
    "stillPending": 2,
    "errors": 0
  }
}
```

---

### Option 2: Deploy Regular Cron Job

Now that the backlog is cleared, deploy the regular cron job:

```bash
cd functions
npm run build
firebase deploy --only functions:scheduledCheckPendingPayments
```

This will:
- Run every 15 minutes automatically
- Check pending payments older than 2 minutes
- Process max 50 at a time
- Handle future pending payments

---

## 📊 What Gets Updated

For each COMPLETED payment:
1. ✅ Transaction status → COMPLETED
2. ✅ Registration status → CONFIRMED
3. ✅ Participant added to participants collection
4. ✅ Success email sent
5. ✅ `emailSent` flag set to true

For each FAILED payment:
1. ❌ Transaction status → FAILED
2. ❌ Registration status → PAYMENT_FAILED
3. ❌ Failure email sent
4. ❌ `emailSent` flag set to true

---

## 🛡️ Safety Features

1. **Idempotent** - Safe to run multiple times
   - Won't duplicate participants (checks if exists)
   - Won't send duplicate emails (checks `emailSent` flag)

2. **Rate Limiting** - 500ms delay between requests
   - Prevents PhonePe API rate limiting

3. **Error Handling** - Continues on errors
   - Logs errors but doesn't stop processing
   - Returns detailed error report

4. **Comprehensive Logging** - Full audit trail
   - Every transaction logged
   - Success/failure clearly marked
   - Timestamps for everything

---

## ⚠️ Important Notes

### This is a ONE-TIME function

- Use it to clear the initial backlog
- After cleanup, use the regular cron job
- Don't run this repeatedly (use analysis instead)

### Memory Allocation

- Allocated 1GB memory (vs 512MB for regular cron)
- Can handle large batches
- 9-minute timeout (max for Cloud Functions)

### No Filters

- Processes ALL pending transactions
- No age limit
- No quantity limit
- Processes oldest first

---

## 🔍 Troubleshooting

### Issue: Function times out

**Solution:**
- This is rare but possible with many transactions
- Re-run the function (it's idempotent)
- Already processed ones will be skipped

### Issue: Some still pending after cleanup

**Solution:**
- These are genuinely still pending on PhonePe
- They'll be picked up by the regular cron job
- Or run cleanup again later

### Issue: Emails not sent

**Solution:**
- Check email service configuration
- Verify email templates exist
- Check `emailSent` flag in transactions

---

## 📝 Quick Commands

```bash
# Deploy
firebase deploy --only functions:cleanupPendingPayments

# Run cleanup
curl -X POST https://us-central1-konaseema-run.cloudfunctions.net/cleanupPendingPayments > cleanup_results.json

# View results
cat cleanup_results.json | jq '.summary'

# Monitor logs
firebase functions:log --only cleanupPendingPayments --follow

# Verify with analysis
curl -X POST https://us-central1-konaseema-run.cloudfunctions.net/analyzePendingPayments | jq '.summary'
```

---

## ✅ Success Criteria

After running cleanup, you should see:
- ✅ All verified COMPLETED payments updated in Firebase
- ✅ All participants added to participants collection
- ✅ All success emails sent
- ✅ All failed payments marked as FAILED
- ✅ Only genuinely pending payments remain
- ✅ Analysis shows 0 `shouldBeCompleted`

---

## 🎯 Next Steps

1. **Run cleanup** - Clear the backlog
2. **Verify results** - Check Firebase and emails
3. **Run analysis** - Confirm all cleared
4. **Deploy cron job** - Enable automatic checks (15 min)
5. **Monitor** - Watch first few runs

---

**Ready to clean up? Run:**
```bash
firebase deploy --only functions:cleanupPendingPayments
curl -X POST https://us-central1-konaseema-run.cloudfunctions.net/cleanupPendingPayments > cleanup_results.json
```

---

**Created**: 2026-01-23T07:45:00+05:30
**Purpose**: One-time cleanup of accumulated pending payments
**Next**: Deploy regular cron job after cleanup
