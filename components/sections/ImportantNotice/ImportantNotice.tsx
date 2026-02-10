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
        // Show modal on every visit (as per user request: "when refreshes")
        // No localStorage check
        setTimeout(() => {
            setIsOpen(true);
        }, 500);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
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
                <h2 className={styles.title}>Thank You!</h2>

                {/* Message */}
                <div className={styles.message}>
                    <p className={styles.highlight}>
                        🎉 <strong className={styles.redHighlight}>Thank You for the Overwhelming Response!</strong>
                    </p>

                    <p className={styles.text}>
                        We are thrilled by the incredible participation and enthusiasm from our community. Your support has made Konaseema Run 2026 a huge success!
                    </p>

                    
                    
                    <p className={styles.textSmall}>
                        Thank you for choosing to be part of this remarkable event!
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
