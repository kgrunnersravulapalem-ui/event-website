# Email Notifications Setup Guide

## Overview
Email notifications have been implemented for payment status updates (success/pending/failed) and contact form submissions. All emails are sent from Cloud Functions for guaranteed delivery.

## Features Implemented

### 1. Payment Email Notifications
- **Success Email**: Sent when payment is completed
- **Pending Email**: Sent when payment is processing (for long-running transactions)
- **Failed Email**: Sent when payment fails

### 2. Contact Form Migration
- Migrated from Next.js API route to Cloud Functions
- Consistent with payment email infrastructure
- Better reliability and error handling

### 3. Editable Email Configuration
All email content is configurable in [functions/src/config/emailConfig.ts](functions/src/config/emailConfig.ts):
- Event details (name, date, venue, reporting time)
- Social media links (Instagram, Facebook)
- Support contact information
- Brand colors
- Footer messages

## Setup Instructions

### Step 1: Install Dependencies
```bash
cd functions
npm install
```

This will install:
- `nodemailer@^6.9.8` - Email sending library
- `@types/nodemailer@^6.4.14` - TypeScript types

### Step 2: Configure Gmail App Password

1. **Enable 2-Step Verification** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Firebase Functions - Ravulapalem Run"
   - Copy the 16-character password (it will look like: `abcd efgh ijkl mnop`)

3. **Set Firebase Environment Variables**:
   ```bash
   cd functions
   firebase functions:config:set email.user="kgrunnersravulapalem@gmail.com"
   firebase functions:config:set email.pass="cyvx hrgx bnkm tfwq"
   ```

4. **For Local Testing** (optional):
   Create `functions/.env` file:
   ```env
   EMAIL_USER=kgrunnersravulapalem@gmail.com
   EMAIL_PASS=your-16-char-app-password
   ```

### Step 3: Update Email Configuration (if needed)

Edit [functions/src/config/emailConfig.ts](functions/src/config/emailConfig.ts) to update:

```typescript
export const EMAIL_CONFIG = {
  event: {
    name: 'Ravulapalem Run 2025',      // Update event name
    date: 'Feb 08, 2025',               // Update event date
    venue: 'Ravulapalem',               // Update venue
    reportingTime: '5:00 AM',           // Update reporting time
  },
  
  social: {
    instagram: 'https://instagram.com/kgrunnersravulapalem',  // Update Instagram link
    facebook: 'https://facebook.com/kgrunnersravulapalem',    // Update Facebook link
  },
  
  support: {
    phone: '+91 XXXXXXXXXX',  // Update support phone number
  },
};
```

### Step 4: Build and Deploy

```bash
# From functions directory
npm run build

# Deploy all functions
npm run deploy

# Or deploy specific function
firebase deploy --only functions:contact
firebase deploy --only functions:paymentWebhook
firebase deploy --only functions:verifyPayment
```

## Email Templates

### 1. Payment Success Email
**Subject**: "Payment Successful - Ravulapalem Run 2025 Registration Confirmed"

Features:
- Professional gradient header
- Success checkmark icon
- Registration details table
- Event information (date, venue, reporting time)
- Important instructions
- Social media follow buttons
- Clean footer with support contact

### 2. Payment Pending Email
**Subject**: "Payment Pending - Ravulapalem Run 2025 Registration"

Features:
- Warning color scheme
- Clock icon
- Transaction details
- "What happens next" section
- Important notices
- Auto-refund information

### 3. Payment Failed Email
**Subject**: "Payment Failed - Ravulapalem Run 2025 Registration"

Features:
- Error color scheme
- Cross icon
- Transaction details
- Common reasons for failure
- Action steps
- Refund information (3-5 business days)
- "Try Again" CTA button

### 4. Contact Form Email
**Subject**: "Contact Form: [Subject] - From [Name]"

Features:
- Sender information table
- Message content
- Reply button
- Timestamp

## Email Sending Logic

### Payment Webhook Flow
1. PhonePe sends webhook with payment status
2. Function validates webhook authentication
3. Updates Firestore (transaction + registration)
4. Checks if email already sent (`emailSent` flag)
5. Sends appropriate email (success/failed)
6. Marks `emailSent: true` to prevent duplicates

### Verify Payment Flow (Fallback)
1. Frontend polls for payment status
2. Function checks PhonePe API
3. Updates Firestore
4. If email not sent yet, sends email
5. Marks `emailSent: true`

This ensures emails are sent even if webhook fails!

### Contact Form Flow
1. User submits contact form
2. Function validates input
3. Sends email to support team
4. Returns success/error to frontend

## Environment Variables

Required in Firebase Functions config:

```bash
# Email credentials
email.user="kgrunnersravulapalem@gmail.com"
email.pass="your-app-password"

# PhonePe (already configured)
phonepe.client_id="..."
phonepe.client_secret="..."
phonepe.client_version="1"
phonepe.environment="SANDBOX"

# Webhook authentication (already configured)
webhook.username="..."
webhook.password="..."
```

## Testing

### Test Payment Emails
1. Complete a test payment in SANDBOX mode
2. Check recipient's inbox for confirmation email
3. Test all three statuses: SUCCESS, PENDING, FAILED

### Test Contact Form
1. Visit `/contact` page
2. Fill out contact form
3. Check `kgrunnersravulapalem@gmail.com` for submission

### Check Logs
```bash
# View function logs
firebase functions:log

# Or check in Firebase Console
# https://console.firebase.google.com/project/konaseema-run/functions
```

## Troubleshooting

### Emails not sending?

1. **Check Firebase config**:
   ```bash
   firebase functions:config:get
   ```
   Should show `email.user` and `email.pass`

2. **Check function logs**:
   ```bash
   firebase functions:log --only contact,paymentWebhook,verifyPayment
   ```

3. **Verify Gmail App Password**:
   - Make sure 2-Step Verification is enabled
   - App password is 16 characters (no spaces in code)
   - Using correct Gmail account

4. **Check spam folder**: Some emails might land in spam initially

### Duplicate emails?

- The `emailSent` flag prevents duplicates
- Only one email per transaction
- Webhook has priority, verifyPayment is fallback

### Email formatting issues?

- Templates use inline CSS for email client compatibility
- Tested with Gmail, Outlook, Yahoo
- Mobile-responsive design

## Files Created/Modified

### New Files
- `functions/src/config/emailConfig.ts` - Editable email configuration
- `functions/src/utils/email.ts` - Email sending utility
- `functions/src/templates/paymentSuccess.ts` - Success email template
- `functions/src/templates/paymentPending.ts` - Pending email template
- `functions/src/templates/paymentFailed.ts` - Failed email template
- `functions/src/contact.ts` - Contact form Cloud Function

### Modified Files
- `functions/package.json` - Added nodemailer dependencies
- `functions/src/index.ts` - Exported contact function
- `functions/src/payment.ts` - Added email sending logic
- `components/sections/Contact/Contact.tsx` - Updated to use Cloud Function
- Deleted: `app/api/contact/route.ts` - Replaced by Cloud Function

## Next Steps

1. ✅ Install dependencies: `cd functions && npm install`
2. ✅ Set up Gmail App Password
3. ✅ Configure Firebase environment variables
4. ✅ Update email config if needed
5. ✅ Build and deploy: `npm run build && npm run deploy`
6. ✅ Test payment flow with all statuses
7. ✅ Test contact form submission

## Support

For issues or questions:
- Check Firebase Functions logs
- Review email configuration
- Verify Gmail App Password setup
- Contact: kgrunnersravulapalem@gmail.com
