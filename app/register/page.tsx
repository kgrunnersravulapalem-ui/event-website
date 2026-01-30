'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './Register.module.css';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import Select from '@/components/ui/Select/Select';
import RadioGroup from '@/components/ui/RadioGroup/RadioGroup';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { eventConfig } from '@/lib/eventConfig';
import type { RegistrationData } from '@/lib/types/payment';

// Declare PhonePe checkout types for TypeScript
declare global {
    interface Window {
        PhonePeCheckout?: {
            transact: (options: {
                tokenUrl: string;
                callback?: (response: 'USER_CANCEL' | 'CONCLUDED') => void;
                type?: 'IFRAME' | 'REDIRECT';
            }) => void;
            closePage: () => void;
        };
    }
}

interface FormData {
    fullName: string;
    gender: string;
    mobileNumber: string;
    dateOfBirth: string;
    tshirtSize: string;
    bloodGroup: string;
    email: string;
    emergencyContact: string;
    acceptedTerms: boolean;
    acceptedRefundPolicy: boolean;
}

function RegisterForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        gender: '',
        mobileNumber: '',
        dateOfBirth: '',
        tshirtSize: '',
        bloodGroup: '',
        email: '',
        emergencyContact: '',
        acceptedTerms: false,
        acceptedRefundPolicy: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);

    // Pre-select category from URL parameter
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [searchParams]);

    /**
     * Validates email and checks for common typos in email providers
     * Returns error message if invalid, null if valid
     */
    const validateEmail = (email: string): string | null => {
        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }

        // Extract domain from email
        const domain = email.split('@')[1]?.toLowerCase();
        if (!domain) {
            return 'Please enter a valid email address';
        }

        // Common email provider typos and their corrections
        const commonTypos: { [key: string]: string } = {
            // Gmail typos
            'bmail.com': 'gmail.com',
            'gmai.com': 'gmail.com',
            'gmial.com': 'gmail.com',
            'gmil.com': 'gmail.com',
            'gemail.com': 'gmail.com',
            'gmaill.com': 'gmail.com',
            'gmali.com': 'gmail.com',
            'gmal.com': 'gmail.com',
            'gnail.com': 'gmail.com',
            'gmeil.com': 'gmail.com',

            // Yahoo typos
            'yaho.com': 'yahoo.com',
            'yahooo.com': 'yahoo.com',
            'yahho.com': 'yahoo.com',
            'yahu.com': 'yahoo.com',
            'yhoo.com': 'yahoo.com',
            'yaoo.com': 'yahoo.com',

            // Outlook/Hotmail typos
            'hotmial.com': 'hotmail.com',
            'hotmil.com': 'hotmail.com',
            'hotmai.com': 'hotmail.com',
            'hotmal.com': 'hotmail.com',
            'outlok.com': 'outlook.com',
            'outloo.com': 'outlook.com',
            'outlookk.com': 'outlook.com',

            // Rediff typos
            'redif.com': 'rediffmail.com',
            'reddiff.com': 'rediffmail.com',
            'rediffmai.com': 'rediffmail.com',
        };

        // Check if domain is a common typo
        if (commonTypos[domain]) {
            const suggestion = email.split('@')[0] + '@' + commonTypos[domain];
            return `Did you mean "${suggestion}"? Please check your email address.`;
        }

        // Check for missing common TLDs
        if (!domain.includes('.')) {
            return 'Please enter a complete email address (e.g., user@example.com)';
        }

        return null; // Email is valid
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Validate email on change
        if (field === 'email') {
            const error = validateEmail(value);
            setEmailError(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // Validate email before submission
            const emailValidationError = validateEmail(formData.email);
            if (emailValidationError) {
                throw new Error(emailValidationError);
            }

            // Validate policy acceptance
            if (!formData.acceptedTerms) {
                throw new Error('Please accept the Terms & Conditions to continue');
            }
            if (!formData.acceptedRefundPolicy) {
                throw new Error('Please accept the Refund Policy to continue');
            }

            const selectedCat = eventConfig.raceCategories.categories.find(
                cat => cat.id === selectedCategory
            );

            if (!selectedCat) {
                throw new Error('Please select a category');
            }

            const registrationData = {
                name: formData.fullName,
                email: formData.email,
                phone: formData.mobileNumber,
                age: new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear(),
                gender: formData.gender,
                emergencyContact: formData.emergencyContact || formData.mobileNumber, // Use form field or fallback to mobile
                raceCategory: selectedCat.distance,
                amount: selectedCat.price,
                dateOfBirth: formData.dateOfBirth,
                tshirtSize: formData.tshirtSize,
                bloodGroup: formData.bloodGroup,
            };

            // Get Cloud Functions URL from environment
            const cloudFunctionsUrl = process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL;

            if (!cloudFunctionsUrl) {
                throw new Error('Cloud Functions URL not configured');
            }

            // Initiate payment via Cloud Function
            const response = await fetch(`${cloudFunctionsUrl}/initiatePayment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to initiate payment');
            }

            // Get the redirect URL from response (v2 API returns redirectUrl directly)
            const checkoutUrl = data.data?.redirectUrl;
            const orderId = data.data?.merchantOrderId;

            if (!checkoutUrl) {
                throw new Error('No checkout URL received');
            }

            // Direct redirect to PhonePe's secure payment page
            // This is the most reliable method for v2 API to avoid iframe/SDK 400 errors 
            // and ensures bank OTP pages load correctly without "blank tab" issues.
            window.location.href = checkoutUrl;
        } catch (err) {
            console.error('Error submitting registration:', err);
            setError(err instanceof Error ? err.message : 'Failed to process registration');
            setIsSubmitting(false);
        }
    };

    // Registrations Closed State
    return (
        <div className={styles.grid}>
            {/* Left Column: Event Details */}
            <div className={styles.detailsCol}>
                <motion.div
                    className={styles.posterCard}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className={styles.posterPlaceholder}>
                        <div className={styles.posterImageWrapper}>
                            <Image
                                src="/images/run_2.jpeg"
                                alt="Event poster"
                                fill
                                priority
                                className={styles.posterPlaceholderImage}
                                sizes="(max-width: 768px) 100vw, 40vw"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Column: Registrations Closed Message */}
            <div className={styles.formCol}>
                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <h2 style={{ color: '#ef4444', fontSize: '2rem', marginBottom: '1rem' }}>Registrations Closed</h2>
                        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', lineHeight: '1.6' }}>
                            We have reached our full capacity for <strong>{eventConfig.eventName}</strong>.
                            <br />
                            Thank you for your overwhelming response!
                        </p>
                        <p style={{ color: '#666' }}>
                            For those who have registered, important updates will be sent via WhatsApp.
                        </p>
                        <div style={{ marginTop: '2rem' }}>
                            <Button onClick={() => router.push('/')} variant="primary">
                                Back to Home
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div className={styles.page}>
            {/* Header Banner */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {eventConfig.eventName}
                    </motion.h1>
                    <p>{new Date(eventConfig.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
            </div>

            <div className={styles.container}>
                <Suspense fallback={<div className={styles.loading}>Loading registration form...</div>}>
                    <RegisterForm />
                </Suspense>
            </div>
        </div>
    );
}
