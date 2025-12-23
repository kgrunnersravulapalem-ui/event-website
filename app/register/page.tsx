'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './Register.module.css';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import Select from '@/components/ui/Select/Select';
import RadioGroup from '@/components/ui/RadioGroup/RadioGroup';
import { motion } from 'framer-motion';
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
    acceptedTerms: boolean;
    acceptedRefundPolicy: boolean;
}

function RegisterForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        fullName: 'kiran',
        gender: 'Male',
        mobileNumber: '8686868686',
        dateOfBirth: '1995-08-14',
        tshirtSize: 'XL',
        bloodGroup: 'O+',
        email: 'mail2me.krishkiran@gmail.com',
        acceptedTerms: false,
        acceptedRefundPolicy: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pre-select category from URL parameter
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [searchParams]);

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
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
                emergencyContact: formData.mobileNumber, // Can be separate field if needed
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

            // Use PhonePe iframe mode if available (recommended), else fallback to redirect
            if (window.PhonePeCheckout?.transact) {
                window.PhonePeCheckout.transact({
                    tokenUrl: checkoutUrl,
                    type: 'IFRAME',
                    callback: (response) => {
                        setIsSubmitting(false);
                        if (response === 'USER_CANCEL') {
                            setError('Payment was cancelled. Please try again.');
                        } else if (response === 'CONCLUDED') {
                            // Payment concluded - redirect to status page
                            router.push(`/payment/status?orderId=${orderId}`);
                        }
                    }
                });
            } else {
                // Fallback to redirect mode
                window.location.href = checkoutUrl;
            }
        } catch (err) {
            console.error('Error submitting registration:', err);
            setError(err instanceof Error ? err.message : 'Failed to process registration');
            setIsSubmitting(false);
        }
    };

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
                        EVENT POSTER
                    </div>
                    <div className={styles.posterInfo}>
                        <h3>Event Details</h3>
                        <p><strong>Location:</strong> {eventConfig.location}</p>
                        <p><strong>Organizer:</strong> Konaseema Godavari Runners Society - Ravulapalem</p>
                        <p className={styles.note}>
                            Prices are inclusive of taxes.
                        </p>
                    </div>
                </motion.div>

                {/* Participant Benefits Section */}
                <motion.div
                    className={styles.benefitsCard}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3>Participant Benefits</h3>
                    <div className={styles.benefitsList}>
                        {eventConfig.deliverables.map((item, index) => (
                            <div key={index} className={styles.benefitItem}>
                                <span className={styles.checkIcon}>✓</span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Column: Registration Form */}
            <div className={styles.formCol}>
                <motion.div
                    className={styles.card}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2>Select Category</h2>
                    <div className={styles.ticketList}>
                        {eventConfig.raceCategories.categories.map((cat) => (
                            <div
                                key={cat.id}
                                className={`${styles.ticketItem} ${selectedCategory === cat.id ? styles.selected : ''}`}
                                onClick={() => setSelectedCategory(cat.id)}
                            >
                                <div className={styles.ticketColor} style={{ backgroundColor: cat.color }} />
                                <div className={styles.ticketInfo}>
                                    <span className={styles.ticketName}>{cat.distance}</span>
                                    <span className={styles.ticketPrice}>₹{cat.price}</span>
                                </div>
                                <div className={styles.radio}>
                                    {selectedCategory === cat.id && <div className={styles.radioInner} />}
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedCategory && (
                        <motion.form
                            className={styles.registrationForm}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            onSubmit={handleSubmit}
                        >
                            <h3>Participant Information</h3>
                            <div className={styles.fieldGroup}>
                                <Input
                                    label="Full Name"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    required
                                />

                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    required
                                />

                                <RadioGroup
                                    label="Gender"
                                    name="gender"
                                    options={eventConfig.formOptions.genders}
                                    value={formData.gender}
                                    onChange={(value) => handleInputChange('gender', value)}
                                    required
                                />

                                <Input
                                    label="Mobile Number"
                                    type="tel"
                                    placeholder="10 digit mobile number"
                                    value={formData.mobileNumber}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 10) {
                                            handleInputChange('mobileNumber', value);
                                        }
                                    }}
                                    pattern="[0-9]{10}"
                                    maxLength={10}
                                    required
                                />

                                <Input
                                    label="Date of Birth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                    required
                                />

                                <Select
                                    label="T-Shirt Size"
                                    name="tshirtSize"
                                    options={eventConfig.formOptions.tshirtSizes}
                                    value={formData.tshirtSize}
                                    onChange={(value) => handleInputChange('tshirtSize', value)}
                                    placeholder="Select your size"
                                    required
                                />

                                <RadioGroup
                                    label="Blood Group (Optional)"
                                    name="bloodGroup"
                                    options={eventConfig.formOptions.bloodGroups}
                                    value={formData.bloodGroup}
                                    onChange={(value) => handleInputChange('bloodGroup', value)}
                                />

                                {/* Policy Acceptance Checkboxes */}
                                <div className={styles.policySection}>
                                    <div className={styles.checkboxGroup}>
                                        <label className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={formData.acceptedTerms}
                                                onChange={(e) => handleInputChange('acceptedTerms', e.target.checked as any)}
                                                required
                                                className={styles.checkbox}
                                            />
                                            <span>
                                                I have read and agree to the{' '}
                                                <a href="/terms" target="_blank" rel="noopener noreferrer" className={styles.policyLink}>
                                                    Terms & Conditions
                                                </a>
                                            </span>
                                        </label>
                                    </div>
                                    <div className={styles.checkboxGroup}>
                                        <label className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={formData.acceptedRefundPolicy}
                                                onChange={(e) => handleInputChange('acceptedRefundPolicy', e.target.checked as any)}
                                                required
                                                className={styles.checkbox}
                                            />
                                            <span>
                                                I have read and agree to the{' '}
                                                <a href="/refund" target="_blank" rel="noopener noreferrer" className={styles.policyLink}>
                                                    Refund Policy
                                                </a>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {error && (
                                    <div className={styles.errorMessage}>
                                        {error}
                                    </div>
                                )}

                                <div className={styles.formActions}>
                                    <Button type="submit" fullWidth disabled={isSubmitting}>
                                        {isSubmitting ? 'Processing...' : 'Proceed to Pay'}
                                    </Button>
                                </div>
                            </div>
                        </motion.form>
                    )}
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
