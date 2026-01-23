# 🚨 SAFE PRODUCTION DEPLOYMENT GUIDE
## Step-by-Step: Analyzing and Fixing Pending Payments

---

## ⚠️ IMPORTANT: Read This First

**This guide follows a SAFE, CAUTIOUS approach:**
1. ✅ **ANALYZE FIRST** - Read-only check (no data changes)
2. ✅ **MANUAL REVIEW** - You verify against PhonePe dashboard
3. ✅ **SELECTIVE UPDATE** - Only update confirmed transactions
4. ✅ **AUTOMATED CRON** - Enable only after manual verification

**DO NOT skip steps. This is production data.**

---

## 📋 Phase 1: ANALYSIS (Read-Only)

### Step 1.1: Deploy Analysis Function

```bash
cd functions
npm run build
firebase deploy --only functions:analyzePendingPayments
```

**Expected Output:**
```
✔  functions[analyzePendingPayments(us-central1)] Successful create operation.
Function URL: https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/analyzePendingPayments
```

**⏱️ Time**: ~2-3 minutes

---

### Step 1.2: Run Analysis

```bash
# Replace with your actual Cloud Functions URL
curl -X POST https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/analyzePendingPayments > pending_analysis.json
```

**Or use this command to get formatted output:**
```bash
curl -X POST https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/analyzePendingPayments | jq '.' > pending_analysis.json
```

**⏱️ Time**: ~30 seconds to 2 minutes (depending on number of pending payments)

---

### Step 1.3: Review Analysis Report

Open `pending_analysis.json` and review the categorized results:

```json
{
  "success": true,
  "message": "Analysis completed - NO DATA WAS MODIFIED",
  "summary": {
    "total": 20,
    "shouldBeCompleted": 15,
    "shouldBeFailed": 2,
    "stillPending": 3,
    "errors": 0
  },
  "categorized": {
    "toComplete": [
      {
        "orderId": "ORDER_1768888713185",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "category": "5K",
        "amount": 300,
        "ageInMinutes": 1440,
        "createdAt": "2026-01-22T05:30:00.000Z"
      }
      // ... more
    ],
    "toFail": [...],
    "stillPending": [...],
    "errors": [...]
  }
}
```

---

### Step 1.4: Cross-Check with PhonePe Dashboard

**For each transaction in `toComplete` array:**

1. Go to PhonePe Dashboard
2. Search for the Order ID (e.g., `ORDER_1768888713185`)
3. Verify status is actually "SUCCESS" or "COMPLETED"
4. Note down any discrepancies

**Create a verification checklist:**

```
✅ ORDER_1768888713185 - Confirmed SUCCESS in PhonePe
✅ ORDER_1768888713186 - Confirmed SUCCESS in PhonePe
❌ ORDER_1768888713187 - Actually FAILED in PhonePe (move to toFail)
✅ ORDER_1768888713188 - Confirmed SUCCESS in PhonePe
...
```

---

### Step 1.5: Document Your Findings

Create a file `verified_pending_payments.txt`:

```
VERIFIED TO COMPLETE (15 transactions):
- ORDER_1768888713185 (John Doe, john@example.com, ₹300)
- ORDER_1768888713186 (Jane Smith, jane@example.com, ₹300)
...

VERIFIED TO FAIL (2 transactions):
- ORDER_1768888713199 (Failed payment)
...

STILL PENDING (3 transactions):
- ORDER_1768888713200 (Genuinely pending)
...

DISCREPANCIES FOUND:
- ORDER_1768888713187 - Analysis says COMPLETED, but PhonePe shows FAILED
  Action: Manually mark as FAILED
```

---

## 📋 Phase 2: MANUAL UPDATE (Selective)

### Option A: Update via Firebase Console (Safest)

**For each VERIFIED transaction:**

1. Go to Firebase Console → Firestore
2. Navigate to `transactions` collection (or `transactions-sandbox`)
3. Find document by Order ID
4. Click "Edit"
5. Update fields:
   ```
   status: "COMPLETED" (or "FAILED")
   updatedAt: [current timestamp]
   manuallyVerified: true
   verifiedBy: "admin"
   verifiedAt: [current timestamp]
   ```
6. Save

**Then update registration:**

1. Get `registrationId` from transaction document
2. Navigate to `registrations` collection
3. Find document by registration ID
4. Update fields:
   ```
   status: "CONFIRMED" (or "PAYMENT_FAILED")
   paymentStatus: "SUCCESS" (or "FAILED")
   updatedAt: [current timestamp]
   ```
5. Save

**Then add to participants (for COMPLETED only):**

1. Navigate to `participants` collection
2. Create new document with Order ID as document ID
3. Add participant data from registration
4. Save

**⏱️ Time**: ~2-3 minutes per transaction

---

### Option B: Create Manual Update Script (Faster)

Create a one-time script to update verified transactions:

```typescript
// functions/src/manualUpdate.ts
import * as admin from 'firebase-admin';

const ordersToComplete = [
  'ORDER_1768888713185',
  'ORDER_1768888713186',
  // ... add all verified orders
];

const ordersToFail = [
  'ORDER_1768888713199',
  // ... add all verified failed orders
];

// Run this locally with admin SDK
async function updateVerifiedOrders() {
  const db = admin.firestore();
  
  for (const orderId of ordersToComplete) {
    // Update transaction
    await db.collection('transactions').doc(orderId).update({
      status: 'COMPLETED',
      manuallyVerified: true,
      verifiedBy: 'admin',
      verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Get and update registration
    const txDoc = await db.collection('transactions').doc(orderId).get();
    const registrationId = txDoc.data()?.registrationId;
    
    if (registrationId) {
      await db.collection('registrations').doc(registrationId).update({
        status: 'CONFIRMED',
        paymentStatus: 'SUCCESS',
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    console.log(`✅ Updated ${orderId}`);
  }
  
  console.log('All verified orders updated!');
}
```

**⏱️ Time**: ~5-10 minutes total

---

## 📋 Phase 3: VERIFICATION

### Step 3.1: Run Analysis Again

```bash
curl -X POST https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/analyzePendingPayments > pending_analysis_after.json
```

**Verify:**
- `shouldBeCompleted` count should be 0 (or only genuinely pending ones)
- All manually updated orders should not appear in the report

---

### Step 3.2: Check Firebase Collections

**Verify in Firebase Console:**

1. **Transactions**: All updated orders show `status: "COMPLETED"`
2. **Registrations**: All show `status: "CONFIRMED"`
3. **Participants**: All participants added with correct data

---

### Step 3.3: Send Emails Manually (If Needed)

If emails weren't sent, you can trigger them manually:

**Option 1**: Use existing email function
**Option 2**: Send via Firebase Console → Extensions → Email

---

## 📋 Phase 4: ENABLE AUTOMATED CRON (After Manual Fix)

### Step 4.1: Update Cron Schedule to 15 Minutes

Edit `/functions/src/cronJobs.ts`:

```typescript
// Line 381 - Change from 5 minutes to 15 minutes
.schedule('*/15 * * * *') // Every 15 minutes
```

---

### Step 4.2: Deploy Cron Functions

```bash
cd functions
npm run build
firebase deploy --only functions:checkPendingPayments,functions:scheduledCheckPendingPayments
```

**⏱️ Time**: ~2-3 minutes

---

### Step 4.3: Monitor First Few Runs

```bash
# Stream live logs
firebase functions:log --only scheduledCheckPendingPayments --follow
```

**Watch for:**
- ✅ Function runs every 15 minutes
- ✅ Processes pending payments correctly
- ✅ No errors
- ✅ Sends emails
- ✅ Adds participants

---

## 📋 Phase 5: ONGOING MONITORING

### Daily Checks (First Week)

```bash
# Check for any stuck pending payments
curl -X POST https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/analyzePendingPayments | jq '.summary'
```

**Expected Output:**
```json
{
  "total": 0,
  "shouldBeCompleted": 0,
  "shouldBeFailed": 0,
  "stillPending": 0,
  "errors": 0
}
```

Or very low numbers (only recent transactions).

---

### Weekly Checks (Ongoing)

1. Review cron job logs
2. Check for any anomalies
3. Verify email delivery rates
4. Monitor Firebase usage

---

## 🛠️ TROUBLESHOOTING

### Issue: Analysis shows errors

**Solution:**
- Check PhonePe API credentials
- Verify network connectivity
- Check if order IDs are valid
- Review error messages in logs

---

### Issue: Some orders still pending after manual update

**Solution:**
- Re-run analysis
- Check PhonePe dashboard again
- Verify order IDs are correct
- Check if payment actually completed

---

### Issue: Emails not sent

**Solution:**
- Check email configuration
- Verify email templates exist
- Check email service logs
- Manually trigger email send

---

### Issue: Participants not added

**Solution:**
- Check participant data structure
- Verify collection name
- Check for duplicate entries
- Manually add via Firebase Console

---

## 📊 QUICK REFERENCE

### Commands Cheat Sheet

```bash
# 1. Deploy analysis function
firebase deploy --only functions:analyzePendingPayments

# 2. Run analysis
curl -X POST https://YOUR_URL/analyzePendingPayments > analysis.json

# 3. View analysis
cat analysis.json | jq '.summary'

# 4. Deploy cron (after manual fix)
firebase deploy --only functions:checkPendingPayments,functions:scheduledCheckPendingPayments

# 5. Monitor logs
firebase functions:log --only scheduledCheckPendingPayments --follow

# 6. Check status anytime
curl -X POST https://YOUR_URL/analyzePendingPayments | jq '.summary'
```

---

## ✅ CHECKLIST

### Phase 1: Analysis
- [ ] Deploy analysis function
- [ ] Run analysis
- [ ] Review JSON report
- [ ] Cross-check with PhonePe dashboard
- [ ] Document findings

### Phase 2: Manual Update
- [ ] Update verified COMPLETED transactions
- [ ] Update verified FAILED transactions
- [ ] Update registrations
- [ ] Add participants
- [ ] Send emails (if needed)

### Phase 3: Verification
- [ ] Run analysis again
- [ ] Verify Firebase data
- [ ] Check participant collection
- [ ] Verify emails sent

### Phase 4: Enable Cron
- [ ] Update schedule to 15 minutes
- [ ] Deploy cron functions
- [ ] Monitor first few runs
- [ ] Verify no errors

### Phase 5: Monitoring
- [ ] Daily checks (first week)
- [ ] Weekly checks (ongoing)
- [ ] Review logs regularly
- [ ] Monitor Firebase usage

---

## 🎯 TIMELINE

**Total Time Estimate**: 2-4 hours

- **Phase 1** (Analysis): 30 minutes
- **Phase 2** (Manual Update): 1-2 hours (depending on number of transactions)
- **Phase 3** (Verification): 30 minutes
- **Phase 4** (Enable Cron): 15 minutes
- **Phase 5** (Monitoring): Ongoing

---

## 📞 SUPPORT

If you encounter any issues:
1. Check the logs first
2. Review this guide
3. Check `PAYMENT_CRON_GUIDE.md` for detailed explanations
4. Test with analysis function before making changes

---

**Remember**: Better safe than sorry. Take your time with Phase 1 and 2. The cron job can wait until you're 100% confident.

**Created**: 2026-01-23
**Version**: 1.0 - Production Safe Deployment
