'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './Register.module.css';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import Select from '@/components/ui/Select/Select';
import RadioGroup from '@/components/ui/RadioGroup/RadioGroup';
import { motion } from 'framer-motion';
import { eventConfig } from '@/lib/eventConfig';

interface FormData {
    fullName: string;
    gender: string;
    mobileNumber: string;
    dateOfBirth: string;
    tshirtSize: string;
    bloodGroup: string;
    email: string;
}

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        gender: '',
        mobileNumber: '',
        dateOfBirth: '',
        tshirtSize: '',
        bloodGroup: '',
        email: '',
    });

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const selectedCat = eventConfig.raceCategories.categories.find(
            cat => cat.id === selectedCategory
        );

        const registrationData = {
            ...formData,
            category: selectedCat?.distance,
            categoryId: selectedCategory,
            price: selectedCat?.price,
        };

        console.log('Registration Data:', registrationData);
        // TODO: Implement API call here
        alert('Registration submitted! (API integration pending)');
    };

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
                                    Prices are inclusive of taxes. T-shirt and personalized bib included for all categories.
                                </p>
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

                                        <div className={styles.formActions}>
                                            <Button type="submit" fullWidth>
                                                Proceed to Pay
                                            </Button>
                                        </div>
                                    </div>
                                </motion.form>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
