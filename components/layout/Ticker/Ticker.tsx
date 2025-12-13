'use client';
import styles from './Ticker.module.css';
import { motion } from 'framer-motion';
import { eventConfig } from '@/lib/eventConfig';

const Ticker = () => {
    return (
        <div className={styles.tickerWrapper}>
            <div className={styles.tickerContainer}>
                <motion.div
                    className={styles.tickerText}
                    animate={{ x: [0, -1000] }}
                    transition={{
                        repeat: Infinity,
                        duration: 25,
                        ease: "linear",
                    }}
                >
                    {/* Repeat text to ensure continuous flow */}
                    {[1, 2, 3, 4].map((i) => (
                        <span key={i} className={styles.item}>
                            🔥 {eventConfig.highlightText} &nbsp;&nbsp;&nbsp; • &nbsp;&nbsp;&nbsp;
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Ticker;
