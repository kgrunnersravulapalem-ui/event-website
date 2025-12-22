'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './PaymentStatus.module.css';
import Button from '@/components/ui/Button/Button';
import { motion } from 'framer-motion';

interface PaymentData {
    status: string;
    registration: any;
    transaction: any;
}

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // New API uses orderId (merchantOrderId) instead of transactionId
        const orderId = searchParams.get('orderId') || searchParams.get('transactionId');
        
        if (!orderId) {
            setError('Invalid payment reference');
            setLoading(false);
            return;
        }

        // Verify payment status via Cloud Function
        const verifyPayment = async () => {
            try {
                const cloudFunctionsUrl = process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL;
                
                if (!cloudFunctionsUrl) {
                    throw new Error('Cloud Functions URL not configured');
                }

                // Verify payment with Cloud Function (v2 API uses merchantOrderId)
                const response = await fetch(`${cloudFunctionsUrl}/verifyPayment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ merchantOrderId: orderId }),
                });

                if (!response.ok) {
                    throw new Error('Failed to verify payment');
                }

                const data = await response.json();
                
                if (data.success) {
                    setPaymentData({
                        status: data.state || 'UNKNOWN',
                        registration: data.registration,
                        transaction: data.transaction
                    });
                } else {
                    setError(data.error || 'Payment verification failed');
                }
            } catch (err) {
                console.error('Error verifying payment:', err);
                setError('Failed to verify payment status');
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [searchParams]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Verifying your payment...</p>
                </div>
            </div>
        );
    }

    if (error || !paymentData) {
        return (
            <div className={styles.container}>
                <motion.div
                    className={styles.errorCard}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className={styles.iconError}>✕</div>
                    <h1>Error</h1>
                    <p>{error || 'Unable to fetch payment status'}</p>
                    <Button onClick={() => router.push('/register')}>
                        Back to Registration
                    </Button>
                </motion.div>
            </div>
        );
    }

    const { status, registration, transaction } = paymentData;
    const isSuccess = status === 'COMPLETED';
    const isPending = status === 'PENDING';
    const isFailed = status === 'FAILED' || status === 'CANCELLED' || status === 'TIMEOUT';

    return (
        <div className={styles.container}>
            <motion.div
                className={`${styles.card} ${
                    isSuccess ? styles.success : isFailed ? styles.failed : styles.pending
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className={styles.icon}>
                    {isSuccess && <span className={styles.iconSuccess}>✓</span>}
                    {isFailed && <span className={styles.iconError}>✕</span>}
                    {isPending && <span className={styles.iconPending}>⏳</span>}
                </div>

                <h1>
                    {isSuccess && 'Payment Successful!'}
                    {isFailed && 'Payment Failed'}
                    {isPending && 'Payment Pending'}
                </h1>

                <p className={styles.message}>
                    {isSuccess && 'Thank you for registering! Your payment has been confirmed.'}
                    {isFailed && 'Your payment could not be processed. Please try again.'}
                    {isPending && 'Your payment is being processed. Please wait...'}
                </p>

                <div className={styles.details}>
                    <h2>Registration Details</h2>
                    <div className={styles.detailsGrid}>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Name:</span>
                            <span className={styles.value}>{registration?.name || registration?.fullName}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Email:</span>
                            <span className={styles.value}>{registration?.email}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Mobile:</span>
                            <span className={styles.value}>{registration?.phone || registration?.mobileNumber}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Category:</span>
                            <span className={styles.value}>{registration?.raceCategory || registration?.category}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Amount:</span>
                            <span className={styles.value}>₹{registration?.amount || registration?.price}</span>
                        </div>
                        <div className={styles.detailItem}>
                            <span className={styles.label}>Transaction ID:</span>
                            <span className={styles.value}>{transaction?.merchantTransactionId || transaction?.merchantOrderId}</span>
                        </div>
                    </div>
                </div>

                {isSuccess && (
                    <div className={styles.nextSteps}>
                        <h3>What's Next?</h3>
                        <ul>
                            <li>You will receive a confirmation email shortly</li>
                            <li>Check your email for event details and updates</li>
                            <li>Bring a valid ID on race day</li>
                        </ul>
                    </div>
                )}

                {isFailed && transaction.errorMessage && (
                    <div className={styles.errorDetails}>
                        <p><strong>Error:</strong> {transaction.errorMessage}</p>
                    </div>
                )}

                <div className={styles.actions}>
                    {isSuccess && (
                        <Button onClick={() => router.push('/')}>
                            Back to Home
                        </Button>
                    )}
                    {isFailed && (
                        <Button onClick={() => router.push('/register')}>
                            Try Again
                        </Button>
                    )}
                    {isPending && (
                        <Button 
                            onClick={() => window.location.reload()}
                            variant="secondary"
                        >
                            Refresh Status
                        </Button>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default function PaymentStatusPage() {
    return (
        <Suspense fallback={
            <div className={styles.container}>
                <div className={styles.loading}>
                    <div className={styles.spinner}></div>
                    <p>Loading...</p>
                </div>
            </div>
        }>
            <PaymentStatusContent />
        </Suspense>
    );
}
