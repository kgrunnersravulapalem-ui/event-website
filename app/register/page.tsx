'use client';
import { useState } from 'react';
import styles from './Register.module.css';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import { motion } from 'framer-motion';
import { eventConfig } from '@/lib/eventConfig';

const tickets = [
    { id: '20m', name: '20 Miler (32K)', price: '₹1400', color: '#ef4444' },
    { id: '16m', name: '16 Miler (25K)', price: '₹1200', color: '#f97316' },
    { id: '11m', name: '11 Miler (17K)', price: '₹1000', color: '#eab308' },
    { id: '5m', name: '5 Miler (8K)', price: '₹700', color: '#22c55e' },
    { id: '5k', name: '5K Run', price: '₹500', color: '#3b82f6' },
];

export default function RegisterPage() {
    const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

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

                    {/* Left Column: Event Poster / Details */}
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
                                <p><strong>Organizer:</strong> Vizag Runners</p>
                                <p className={styles.note}>
                                    Prices are inclusive of taxes. T-shirt and personalized bib included for all categories.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Ticket Selection / Form */}
                    <div className={styles.formCol}>
                        <motion.div
                            className={styles.card}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2>Select Category</h2>
                            <div className={styles.ticketList}>
                                {tickets.map((t) => (
                                    <div
                                        key={t.id}
                                        className={`${styles.ticketItem} ${selectedTicket === t.id ? styles.selected : ''}`}
                                        onClick={() => setSelectedTicket(t.id)}
                                    >
                                        <div className={styles.ticketColor} style={{ backgroundColor: t.color }} />
                                        <div className={styles.ticketInfo}>
                                            <span className={styles.ticketName}>{t.name}</span>
                                            <span className={styles.ticketPrice}>{t.price}</span>
                                        </div>
                                        <div className={styles.radio}>
                                            {selectedTicket === t.id && <div className={styles.radioInner} />}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedTicket && (
                                <motion.div
                                    className={styles.registrationForm}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                >
                                    <h3>Participant Information</h3>
                                    <div className={styles.fieldGroup}>
                                        <Input label="Full Name" placeholder="John Doe" />
                                        <Input label="Email" type="email" placeholder="john@example.com" />
                                        <Input label="Phone Number" type="tel" placeholder="+91 98765 43210" />
                                        <div className={styles.formActions}>
                                            <Button fullWidth onClick={() => alert('Proceed to Payment Gateway Mock')}>
                                                Proceed to Pay
                                            </Button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
