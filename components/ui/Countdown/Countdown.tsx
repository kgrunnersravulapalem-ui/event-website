'use client';
import { useState, useEffect } from 'react';
import styles from './Countdown.module.css';
import { eventConfig } from '@/lib/eventConfig';

// Helper to calculate time left
const calculateTimeLeft = () => {
    const difference = +new Date(eventConfig.eventDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }
    return timeLeft;
};

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Prevent hydration mismatch
    if (!isMounted) return null;

    const timerComponents = Object.keys(timeLeft).map((interval) => {
        if (!timeLeft[interval as keyof typeof timeLeft]) {
            // Optional: Don't show if 0? Actually better to show for countdown feeling
            // return null; 
        }

        return (
            <div className={styles.timerItem} key={interval}>
                <span className={styles.timeValue}>
                    {String(timeLeft[interval as keyof typeof timeLeft]).padStart(2, '0')}
                </span>
                <span className={styles.timeLabel}>{interval}</span>
            </div>
        );
    });

    return (
        <div className={styles.container}>
            {Object.keys(timeLeft).length ? (
                <div className={styles.timerWrapper}>
                    {timerComponents}
                </div>
            ) : (
                <span className={styles.finished}>Event Started!</span>
            )}
        </div>
    );
};

export default Countdown;
