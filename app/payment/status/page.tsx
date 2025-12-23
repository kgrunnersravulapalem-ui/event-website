'use client';
import { useEffect, useState, Suspense, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './PaymentStatus.module.css';
import Button from '@/components/ui/Button/Button';
import { motion } from 'framer-motion';

interface PaymentData {
    status: string;
    registration: any;
    transaction: any;
}

// Polling configuration for PENDING status
const POLLING_CONFIG = {
    INTERVAL_MS: 3000,      // Check every 3 seconds
    MAX_ATTEMPTS: 15,       // Max 15 attempts (3s x 15 = 45 seconds)
    MAX_DURATION_MS: 45 * 1000, // 45 seconds maximum polling time
};

function PaymentStatusContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [pollCount, setPollCount] = useState(0);
    const [pollingTimedOut, setPollingTimedOut] = useState(false);
    
    // Refs for cleanup
    const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const pollStartTimeRef = useRef<number>(0);
    const isPollingRef = useRef(false);

    // Cleanup function
    const stopPolling = useCallback(() => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
        isPollingRef.current = false;
    }, []);

    // Verify payment function
    const verifyPayment = useCallback(async (orderId: string, isPolling = false): Promise<'COMPLETED' | 'FAILED' | 'PENDING' | 'ERROR'> => {
        try {
            const cloudFunctionsUrl = process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL;
            
            if (!cloudFunctionsUrl) {
                throw new Error('Cloud Functions URL not configured');
            }

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
                const status = data.state || 'UNKNOWN';
                setPaymentData({
                    status,
                    registration: data.registration,
                    transaction: data.transaction
                });
                
                if (!isPolling) {
                    setLoading(false);
                }
                
                return status;
            } else {
                setError(data.error || 'Payment verification failed');
                setLoading(false);
                return 'ERROR';
            }
        } catch (err) {
            console.error('Error verifying payment:', err);
            if (!isPolling) {
                setError('Failed to verify payment status');
                setLoading(false);
            }
            return 'ERROR';
        }
    }, []);

    useEffect(() => {
        const orderId = searchParams.get('orderId') || searchParams.get('transactionId');
        
        if (!orderId) {
            setError('Invalid payment reference');
            setLoading(false);
            return;
        }

        // Initial verification
        const initVerification = async () => {
            const status = await verifyPayment(orderId);
            
            // If PENDING, start polling with limits
            if (status === 'PENDING' && !isPollingRef.current) {
                isPollingRef.current = true;
                pollStartTimeRef.current = Date.now();
                setPollCount(1);
                
                pollIntervalRef.current = setInterval(async () => {
                    const elapsedTime = Date.now() - pollStartTimeRef.current;
                    
                    setPollCount(prev => {
                        const newCount = prev + 1;
                        
                        // Check if we've exceeded limits
                        if (newCount > POLLING_CONFIG.MAX_ATTEMPTS || elapsedTime > POLLING_CONFIG.MAX_DURATION_MS) {
                            stopPolling();
                            setPollingTimedOut(true);
                            setLoading(false);
                            return prev;
                        }
                        
                        return newCount;
                    });
                    
                    // Don't continue if we've stopped polling
                    if (!isPollingRef.current) return;
                    
                    const pollStatus = await verifyPayment(orderId, true);
                    
                    // Stop polling if status is final
                    if (pollStatus === 'COMPLETED' || pollStatus === 'FAILED' || pollStatus === 'ERROR') {
                        stopPolling();
                        setLoading(false);
                    }
                }, POLLING_CONFIG.INTERVAL_MS);
            }
        };

        initVerification();

        // Cleanup on unmount
        return () => {
            stopPolling();
        };
    }, [searchParams, verifyPayment, stopPolling]);

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
                    {isPending && (pollingTimedOut ? 'Payment Status Unknown' : 'Payment Pending')}
                </h1>

                <p className={styles.message}>
                    {isSuccess && 'Thank you for registering! Your payment has been confirmed.'}
                    {isFailed && 'Your payment could not be processed. Please try again.'}
                    {isPending && !pollingTimedOut && `Checking payment status... (${pollCount}/${POLLING_CONFIG.MAX_ATTEMPTS})`}
                    {isPending && pollingTimedOut && 'Payment verification is taking longer than expected. If money was deducted, your registration will be confirmed once we receive payment confirmation from PhonePe, or it will be refunded within 5-7 business days.'}
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
                    {isPending && !pollingTimedOut && (
                        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                            Auto-checking every 3 seconds...
                        </p>
                    )}
                    {isPending && pollingTimedOut && (
                        <>
                            <Button 
                                onClick={() => window.location.reload()}
                                variant="secondary"
                            >
                                Check Again
                            </Button>
                            <Button 
                                onClick={() => router.push('/')}
                                variant="outline"
                                style={{ marginTop: '0.5rem' }}
                            >
                                Back to Home
                            </Button>
                        </>
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
