'use client';
import styles from './Venue.module.css';
import { FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Venue = () => {
    return (
        <section className={styles.section} id="venue">
            <div className={styles.container}>
                <div className={styles.content}>
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className={styles.title}
                    >
                        The Venue
                    </motion.h2>

                    <div className={styles.infoGrid}>
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className={styles.infoItem}
                        >
                            <FaMapMarkerAlt className={styles.icon} />
                            <div>
                                <h3>MGM Park / Beach Road</h3>
                                <p>Vizag, India</p>
                                <small>Starting Point</small>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className={styles.infoItem}
                        >
                            <FaCalendarAlt className={styles.icon} />
                            <div>
                                <h3>January 5th, 2025</h3>
                                <p>Sunday Morning</p>
                                <small>Race Day</small>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className={styles.mapPlaceholder}
                    >
                        {/* In a real app, embed Google Maps iframe here */}
                        <div className={styles.mapContent}>
                            Map View of Course
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Venue;
