'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal/Modal';
import Button from '@/components/ui/Button/Button';
import styles from './ImportantNotice.module.css';

/**
 * ImportantNotice Component
 * 
 * Displays an important notice modal to users when they first visit the website.
 * Uses localStorage to track if the user has already seen the notice.
 * The modal will show again after page refresh if localStorage is cleared.
 */
const ImportantNotice = () => {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Check if user has already seen the notice
        const hasSeenNotice = localStorage.getItem('hasSeenImportantNotice');

        if (!hasSeenNotice) {
            // Small delay for better UX
            setTimeout(() => {
                setIsOpen(true);
            }, 500);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        // Mark as seen in localStorage
        localStorage.setItem('hasSeenImportantNotice', 'true');
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} showCloseButton={true}>
            <div className={styles.content}>
                {/* Icon */}
                <div className={styles.iconWrapper}>
                    <svg
                        className={styles.icon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>

                {/* Title */}
                <h2 className={styles.title}>Important Notice</h2>

                {/* Message */}
                <div className={styles.message}>
                    <p className={styles.highlight}>
                        ⚡ Only <strong>300 slots remaining!</strong>
                    </p>

                    <p className={styles.text}>
                        We are nearing our participant capacity and will be closing registrations
                        earlier than planned on <strong>January 30, 2026</strong>.
                    </p>

                    <p className={styles.text}>
                        All registered participants will receive important updates regarding
                        <strong> bib collection, t-shirt distribution,</strong> and other event-related
                        information via <strong>WhatsApp</strong>.
                    </p>

                    <p className={styles.textSmall}>
                        Please ensure your contact details are accurate during registration.
                    </p>
                </div>

                {/* Action Button */}
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleClose}
                >
                    Got it, Thanks!
                </Button>
            </div>
        </Modal>
    );
};

export default ImportantNotice;
