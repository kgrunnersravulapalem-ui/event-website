'use client';
import styles from './Hero.module.css';
import Button from '@/components/ui/Button/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { eventConfig } from '@/lib/eventConfig';
import Countdown from '@/components/ui/Countdown/Countdown';

const Hero = () => {
    return (
        <section className={styles.hero}>
            <div className={styles.background}>
                {/* Abstract gradient background handled in CSS */}
            </div>

            <div className={styles.content}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={styles.textContent}
                >
                    <div className={styles.editionBadge}>1st Edition</div>
                    <h1 className={styles.headline}>
                        {eventConfig.eventName} <br />
                    </h1>

                    <Countdown />

                    <div className={styles.deadlineInfo}>
                        Last Date for Registration: <strong>10 JAN 2026</strong>
                    </div>

                    <p className={styles.subhead}>
                        Join thousands of runners in the most scenic marathon of the year.
                        Experience the thrill, the view, and the glory.
                    </p>

                    <div className={styles.ctaGroup}>
                        <Link href="/register">
                            <Button size="lg" variant="primary">Register Now</Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
