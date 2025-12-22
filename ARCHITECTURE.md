# System Architecture

## Overview

This document describes the complete architecture of the PhonePe payment integration for the running event website.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                              │
│                                                                     │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐    │
│  │  Homepage    │      │Registration  │      │Payment Status│    │
│  │   (/)        │─────▶│   (/register)│      │  (/payment/  │    │
│  │              │      │              │      │    status)   │    │
│  └──────────────┘      └──────┬───────┘      └──────▲───────┘    │
│                               │                      │            │
└───────────────────────────────┼──────────────────────┼─────────────┘
                                │                      │
                                │ POST /initiatePayment│
                                │                      │ POST /verifyPayment
                                ▼                      │
┌─────────────────────────────────────────────────────┼─────────────┐
│                  FIREBASE CLOUD FUNCTIONS           │             │
│                (us-central1-project-id)             │             │
│                                                     │             │
│  ┌─────────────────────────────────────────────────┼──────────┐  │
│  │ initiatePayment (POST)                          │          │  │
│  │ • Create registration in Firestore              │          │  │
│  │ • Generate PhonePe payment request              │          │  │
│  │ • Return checkout URL                           │          │  │
│  └────────┬────────────────────────────────────────┼──────────┘  │
│           │                                        │             │
│           │                                        │             │
│  ┌────────┼────────────────────────────────────────┼──────────┐  │
│  │ paymentCallback (POST)            ◀────────────┼──────┐   │  │
│  │ • Validate PhonePe signature                   │      │   │  │
│  │ • Update transaction status                    │      │   │  │
│  │ • Update registration status                   │      │   │  │
│  └────────┼────────────────────────────────────────┼──────┼───┘  │
│           │                                        │      │      │
│           │                                        │      │      │
│  ┌────────┼────────────────────────────────────────┼──────┼───┐  │
│  │ verifyPayment (POST)                           │      │   │  │
│  │ • Query PhonePe status                         │      │   │  │
│  │ • Return transaction + registration data   ────┼──────┘   │  │
│  └────────┼────────────────────────────────────────┼──────────┘  │
│           │                                        │             │
│           │                                        │             │
│  ┌────────┼────────────────────────────────────────┼──────────┐  │
│  │ checkStatus (GET)                              │          │  │
│  │ • Check payment status with PhonePe            │          │  │
│  │ • Update Firestore records                     │          │  │
│  └────────┼────────────────────────────────────────┼──────────┘  │
│           │                                        │             │
└───────────┼────────────────────────────────────────┼─────────────┘
            │                                        │
            │                                        │
            ▼                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FIREBASE FIRESTORE                           │
│                                                                 │
│  ┌──────────────────────┐          ┌──────────────────────┐   │
│  │ registrations        │          │ transactions         │   │
│  │ Collection           │          │ Collection           │   │
│  │                      │          │                      │   │
│  │ {                    │          │ {                    │   │
│  │   name               │◀────────▶│   merchantTxnId      │   │
│  │   email              │          │   registrationId     │   │
│  │   phone              │          │   amount             │   │
│  │   raceCategory       │          │   status             │   │
│  │   amount             │          │   transactionId      │   │
│  │   status             │          │   callbackData       │   │
│  │   merchantTxnId      │          │   createdAt          │   │
│  │   ...                │          │   ...                │   │
│  │ }                    │          │ }                    │   │
│  └──────────────────────┘          └──────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
            ▲                                        ▲
            │                                        │
            │ Create/Update Records                  │
            │                                        │
            │                                        │
┌───────────┴────────────────────────────────────────┴─────────────┐
│                    PHONEPE PAYMENT GATEWAY                       │
│                  (api-preprod.phonepe.com)                       │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ POST /pg/v1/pay                                          │  │
│  │ • Receives payment initiation request                    │  │
│  │ • Returns checkout URL                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
│                           │                                     │
│                           ▼                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Checkout Page (User completes payment)                   │  │
│  └──────────────┬───────────────────────┬───────────────────┘  │
│                 │                       │                       │
│                 │ Server-to-Server      │ Browser Redirect      │
│                 │ Callback              │                       │
│                 ▼                       ▼                       │
│  ┌──────────────────────┐   ┌──────────────────────┐          │
│  │ POST /paymentCallback│   │ Redirect to:         │          │
│  │ (Cloud Function)     │   │ /payment/status?     │          │
│  │                      │   │ transactionId=XXX    │          │
│  └──────────────────────┘   └──────────────────────┘          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ GET /pg/v1/status/{merchantId}/{transactionId}           │  │
│  │ • Status check API                                       │  │
│  │ • Called by verifyPayment Cloud Function                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Payment Flow Sequence

```
User                Next.js              Cloud Functions       PhonePe           Firestore
 │                    │                        │                  │                 │
 │  1. Fill Form      │                        │                  │                 │
 │──────────────────▶ │                        │                  │                 │
 │                    │                        │                  │                 │
 │  2. Submit         │                        │                  │                 │
 │──────────────────▶ │                        │                  │                 │
 │                    │  3. POST /initiatePayment                 │                 │
 │                    │──────────────────────▶ │                  │                 │
 │                    │                        │  4. Create Reg   │                 │
 │                    │                        │──────────────────┼───────────────▶ │
 │                    │                        │                  │                 │
 │                    │                        │  5. POST /pg/v1/pay                │
 │                    │                        │─────────────────▶│                 │
 │                    │                        │                  │                 │
 │                    │  6. Checkout URL       │  7. Checkout URL │                 │
 │                    │ ◀─────────────────────│◀─────────────────│                 │
 │  8. Redirect       │                        │                  │                 │
 │ ◀─────────────────│                        │                  │                 │
 │                    │                        │                  │                 │
 │  9. PhonePe Checkout Page                   │                  │                 │
 │────────────────────────────────────────────▶│                  │                 │
 │                    │                        │                  │                 │
 │ 10. Complete Pay   │                        │                  │                 │
 │───────────────────▶│                        │                  │                 │
 │                    │                        │                  │                 │
 │                    │        11. POST /paymentCallback          │                 │
 │                    │                        │◀─────────────────│                 │
 │                    │                        │                  │                 │
 │                    │                        │ 12. Update Status│                 │
 │                    │                        │──────────────────┼───────────────▶ │
 │                    │                        │                  │                 │
 │  13. Redirect to /payment/status?transactionId=XXX             │                 │
 │◀───────────────────────────────────────────│                  │                 │
 │                    │                        │                  │                 │
 │  14. Load Status   │                        │                  │                 │
 │──────────────────▶ │                        │                  │                 │
 │                    │  15. POST /verifyPayment                  │                 │
 │                    │──────────────────────▶ │                  │                 │
 │                    │                        │  16. GET Status  │                 │
 │                    │                        │─────────────────▶│                 │
 │                    │                        │                  │                 │
 │                    │                        │  17. Get Records │                 │
 │                    │                        │──────────────────┼───────────────▶ │
 │                    │                        │                  │                 │
 │                    │  18. Payment Result    │  19. Data        │                 │
 │                    │ ◀─────────────────────│◀─────────────────┼─────────────────│
 │  20. Display       │                        │                  │                 │
 │ ◀─────────────────│                        │                  │                 │
 │                    │                        │                  │                 │
```

## Component Breakdown

### Frontend Components (Next.js on Netlify)

| Component | Path | Purpose |
|-----------|------|---------|
| Register Page | `/app/register/page.tsx` | Registration form & payment initiation |
| Payment Status | `/app/payment/status/page.tsx` | Display payment result |
| Homepage | `/app/page.tsx` | Landing page with event info |

### Backend Components (Firebase Cloud Functions)

| Function | Endpoint | Method | Purpose |
|----------|----------|--------|---------|
| initiatePayment | `/initiatePayment` | POST | Start payment process |
| paymentCallback | `/paymentCallback` | POST | Handle PhonePe webhook |
| checkStatus | `/checkStatus` | GET | Query payment status |
| verifyPayment | `/verifyPayment` | POST | Verify for frontend |

### Database Collections (Firestore)

| Collection | Purpose | Key Fields |
|------------|---------|------------|
| registrations | Store participant data | name, email, phone, raceCategory, status |
| transactions | Track payment status | merchantTransactionId, amount, status, callbackData |

### External Services

| Service | Purpose | Integration Point |
|---------|---------|-------------------|
| PhonePe Sandbox | Payment processing | API calls from Cloud Functions |
| Firebase Firestore | Data persistence | Read/Write from Cloud Functions |
| Firebase Cloud Functions | Backend logic | Called from Next.js frontend |
| Netlify | Frontend hosting | Hosts Next.js application |

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layers                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. HTTPS/TLS Encryption                                    │
│     • All communications encrypted                          │
│     • SSL certificates on all endpoints                     │
│                                                             │
│  2. CORS Protection                                         │
│     • Cloud Functions restrict origins                      │
│     • Only allowed domains can call APIs                    │
│                                                             │
│  3. PhonePe Signature Validation                            │
│     • SHA-256 checksum verification                         │
│     • Prevents callback tampering                           │
│                                                             │
│  4. Environment Variables                                   │
│     • Secrets not in code                                   │
│     • Firebase config for Cloud Functions                   │
│                                                             │
│  5. Firestore Security Rules                                │
│     • Only Cloud Functions can write                        │
│     • Authenticated reads only                              │
│                                                             │
│  6. Input Validation                                        │
│     • Required fields checked                               │
│     • Data types validated                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Registration Creation
```
User Input → Frontend Validation → Cloud Function → Firestore
                                        ↓
                                   PhonePe API
```

### Payment Processing
```
PhonePe Checkout → User Payment → PhonePe Backend
                                        ↓
                                   Callback URL
                                        ↓
                                 Cloud Function
                                        ↓
                                   Firestore Update
```

### Status Verification
```
Status Page → Cloud Function → PhonePe Status API
                   ↓
              Firestore Query
                   ↓
              Response to Frontend
```

## Deployment Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    Development Flow                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Local Development                                           │
│  ├─ Next.js Dev Server (localhost:3000)                     │
│  └─ Firebase Emulators (localhost:5001) [Optional]          │
│                                                              │
│  ↓ git push                                                  │
│                                                              │
│  GitHub Repository                                           │
│  └─ main branch                                              │
│                                                              │
│  ↓ Auto-deploy                                               │
│                                                              │
│  Production                                                  │
│  ├─ Netlify (Frontend)                                       │
│  │  └─ yoursite.netlify.app                                 │
│  │                                                           │
│  └─ Firebase (Backend)                                       │
│     ├─ Cloud Functions                                       │
│     │  └─ us-central1-project.cloudfunctions.net            │
│     └─ Firestore Database                                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Animation**: Framer Motion
- **Hosting**: Netlify

### Backend
- **Runtime**: Node.js 18
- **Platform**: Firebase Cloud Functions
- **Language**: TypeScript
- **Database**: Firestore
- **Payment**: PhonePe Payment Gateway SDK v2.0.3

### DevOps
- **Version Control**: Git
- **CI/CD**: Netlify Auto-Deploy
- **Monitoring**: Firebase Console
- **Logging**: Cloud Functions Logs

## Scalability Considerations

### Current Architecture (Events < 5000 participants)
- **Cloud Functions**: Auto-scales to handle load
- **Firestore**: Handles up to 10K writes/second
- **Cost**: < $10/month for 5000 registrations

### Large Events (> 10000 participants)
- **Consider**: Cloud Functions regional deployment
- **Add**: Load balancing for multiple regions
- **Implement**: Caching layer (Redis/Memcache)
- **Enable**: Firestore query optimization

## Monitoring Points

```
Frontend Monitoring (Netlify)
├─ Page Load Times
├─ API Call Success Rates
└─ Error Tracking

Cloud Functions Monitoring (Firebase)
├─ Invocation Count
├─ Execution Time
├─ Error Rate
├─ Memory Usage
└─ Cost Analysis

Database Monitoring (Firestore)
├─ Read/Write Operations
├─ Storage Size
├─ Query Performance
└─ Security Rule Violations

Payment Gateway Monitoring (PhonePe)
├─ Success Rate
├─ Failure Reasons
├─ Transaction Volume
└─ Settlement Status
```

## Disaster Recovery

### Backup Strategy
- **Firestore**: Automatic daily backups
- **Code**: Git version control
- **Config**: Documented in `.env.example`

### Recovery Steps
1. Restore Firestore from backup
2. Redeploy Cloud Functions
3. Verify environment variables
4. Test payment flow

### Rollback Plan
```bash
# Revert to previous version
git checkout <previous-commit>
firebase deploy --only functions
```

## Future Enhancements

- [ ] Admin dashboard for registration management
- [ ] Email confirmation system
- [ ] SMS notifications
- [ ] PDF certificate generation
- [ ] QR code for check-in
- [ ] Real-time analytics dashboard
- [ ] Multiple payment gateway support
- [ ] Refund processing workflow

---

**Last Updated**: December 22, 2025
**Architecture Version**: 1.0
