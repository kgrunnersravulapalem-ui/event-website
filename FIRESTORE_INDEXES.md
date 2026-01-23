# 🔍 Firestore Composite Indexes Required

## ⚠️ Important: Composite Index Needed

### Query in `scheduledCheckPendingPayments`

**File**: `/functions/src/cronJobs.ts`

**Query**:
```typescript
const pendingTransactionsSnapshot = await db
  .collection(transactionsCollection)
  .where('status', '==', 'PENDING')
  .where('createdAt', '<', cutoffTime)
  .limit(50)
  .get();
```

**This query requires a composite index because**:
- It filters on `status` field
- It also filters on `createdAt` field
- Firestore requires an index for queries with multiple field filters

---

## 📋 How to Create the Index

### Option 1: Automatic (Recommended)

When the cron job runs for the first time, you'll see an error like:

```
Error: 9 FAILED_PRECONDITION: The query requires an index. 
You can create it here: https://console.firebase.google.com/...
```

**Steps**:
1. Click the URL in the error message
2. It will take you to Firebase Console
3. Click "Create Index"
4. Wait 2-5 minutes for index to build
5. Run the function again

---

### Option 2: Manual Creation

**Go to Firebase Console**:
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `konaseema-run`
3. Go to **Firestore Database** → **Indexes** tab
4. Click **Create Index**

**Index Configuration**:

#### For Production (`transactions` collection):
```
Collection ID: transactions
Fields to index:
  - status (Ascending)
  - createdAt (Ascending)
Query scope: Collection
```

#### For Sandbox (`transactions-sandbox` collection):
```
Collection ID: transactions-sandbox
Fields to index:
  - status (Ascending)
  - createdAt (Ascending)
Query scope: Collection
```

**Click "Create"** and wait for the index to build (2-5 minutes).

---

### Option 3: Using Firebase CLI

Create a file `firestore.indexes.json` in your project root:

```json
{
  "indexes": [
    {
      "collectionGroup": "transactions",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "transactions-sandbox",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

**Then deploy**:
```bash
firebase deploy --only firestore:indexes
```

---

## ✅ What to Expect

### First Run (Without Index):
```
❌ Error: The query requires an index
📍 Link provided to create index
⏱️  Function fails
```

### After Creating Index:
```
✅ Query executes successfully
✅ Cron job processes pending payments
✅ No errors
```

---

## 🎯 Index Build Time

| Collection Size | Build Time |
|----------------|------------|
| < 100 documents | 1-2 minutes |
| 100-1000 documents | 2-5 minutes |
| > 1000 documents | 5-10 minutes |

---

## 📊 Current Deployment Status

### Functions Deployed:
- ✅ `cleanupPendingPayments` (one-time cleanup)
- ✅ `scheduledCheckPendingPayments` (15-min cron)

### What Happens Next:

1. **Cron job will try to run** (every 15 minutes)
2. **First run will fail** with index error
3. **Click the link** in the error to create index
4. **Wait 2-5 minutes** for index to build
5. **Next run will succeed** automatically

---

## 🔍 How to Monitor

### Check Logs:
```bash
firebase functions:log --only scheduledCheckPendingPayments --limit 20
```

### Look for:
```
✅ Success: "Pending payments check completed"
❌ Error: "The query requires an index"
```

---

## 📝 Other Considerations

### 1. **Firestore Rules**
Make sure your Firestore rules allow the Cloud Functions to read/write:

```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow Cloud Functions to access transactions
    match /transactions/{document=**} {
      allow read, write: if request.auth != null || request.auth.token.admin == true;
    }
    
    match /transactions-sandbox/{document=**} {
      allow read, write: if request.auth != null || request.auth.token.admin == true;
    }
  }
}
```

**Note**: Cloud Functions run with admin privileges, so they should work regardless of rules.

---

### 2. **Cloud Scheduler**
The scheduled function requires Firebase Blaze plan and Cloud Scheduler to be enabled.

**Check if enabled**:
```bash
gcloud scheduler jobs list
```

**If not enabled**, you'll see an error. Enable it in Firebase Console:
1. Go to **Functions** tab
2. Click on `scheduledCheckPendingPayments`
3. Follow prompts to enable Cloud Scheduler

---

### 3. **Billing**
Make sure you're on the **Blaze (pay-as-you-go) plan** for:
- Cloud Scheduler ($0.10/month per job)
- Cloud Functions (free tier is generous)

---

## ✅ Quick Checklist

After deployment, verify:

- [ ] Functions deployed successfully
- [ ] Composite index created (or will be created on first run)
- [ ] Cloud Scheduler enabled (Blaze plan)
- [ ] Firestore rules allow access
- [ ] Monitor logs for first few runs
- [ ] Verify pending payments are being processed

---

## 🚨 Troubleshooting

### Issue: "The query requires an index"
**Solution**: Click the link in the error and create the index

### Issue: "Cloud Scheduler not enabled"
**Solution**: Enable it in Firebase Console or upgrade to Blaze plan

### Issue: "Permission denied"
**Solution**: Check Firestore rules (though Cloud Functions should have admin access)

### Issue: "Function timeout"
**Solution**: Reduce batch size or increase timeout (already at max 540s)

---

## 📞 Support

If you encounter issues:
1. Check the logs: `firebase functions:log --only scheduledCheckPendingPayments`
2. Verify index is created in Firebase Console
3. Check Cloud Scheduler status
4. Review this guide

---

## 🎉 Summary

**What you need to do**:
1. ✅ Wait for first cron run (will fail with index error)
2. ✅ Click the link to create index
3. ✅ Wait 2-5 minutes for index to build
4. ✅ Next run will succeed automatically

**That's it!** The system will handle everything else.

---

**Created**: 2026-01-23T08:07:00+05:30
**Status**: Awaiting index creation
**Action Required**: Create composite index on first run
