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
                <h2 className={styles.title}>Important Notice</h2>

                {/* Message */}
                <div className={styles.message}>
                    <p className={styles.highlight}>
                        ⚡ <strong className={styles.redHighlight}>Registrations Closed!</strong>
                    </p>

                    <p className={styles.text}>
                        We have reached our full capacity. All slots are filled and <strong className={styles.redHighlight}>registrations are now closed</strong>.
                    </p>

                    <p className={styles.text}>
                        All registered participants will receive important updates regarding
                        <strong className={styles.redText}> Bib collection, t-shirt distribution,</strong> and other event-related
                        information via <strong className={styles.redText}>WhatsApp</strong>.
                    </p>

                    <p className={styles.textSmall}>
                        Please ensure you have provided accurate contact details for communication.
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
