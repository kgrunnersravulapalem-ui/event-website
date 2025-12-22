'use client';
import styles from './Venue.module.css';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { eventConfig } from '@/lib/eventConfig';

const Venue = () => {
    return (
        <section className={styles.section} id="venue">
            <div className={styles.container}>
                <div className={styles.header}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Location & Venue
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        Join us at the starting line
                    </motion.p>
                </div>

                <div className={styles.grid}>
                    <div className={styles.info}>
                        <motion.div
                            className={styles.item}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className={styles.iconWrapper}>
                                <FaCalendarAlt className={styles.icon} />
                            </div>
                            <div>
                                <h3>Date & Time</h3>
                                <p>{eventConfig.venue.date}</p>
                                <p>{eventConfig.venue.time}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            className={styles.item}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className={styles.iconWrapper}>
                                <FaMapMarkerAlt className={styles.icon} />
                            </div>
                            <div>
                                <h3>Location</h3>
                                <p>{eventConfig.contact.location.line1}</p>
                                <p>{eventConfig.contact.location.line2}</p>
                                <a
                                    href={eventConfig.contact.location.mapLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.mapLink}
                                >
                                    View on Google Maps
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        className={styles.mapContainer}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3822.846566417743!2d81.83646351187428!3d16.767191283415983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTbCsDQ2JzAxLjkiTiA4McKwNTAnMjAuNSJF!5e0!3m2!1sen!2sin!4v1703241234567!5m2!1sen!2sin"
                            width="100%"
                            height="450"
                            style={{ border: 0, borderRadius: 'var(--radius-xl)' }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Venue;
