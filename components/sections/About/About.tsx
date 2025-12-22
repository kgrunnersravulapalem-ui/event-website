
'use client';
import styles from './About.module.css';
import { motion } from 'framer-motion';
import { eventConfig } from '@/lib/eventConfig';

const About = () => {
    return (
        <section className={styles.section} id="about">
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.contentWrapper}
                >

                    <div className={styles.mainContent}>
                        <h2 className={styles.title}>{eventConfig.about.title}</h2>
                        {/* Telugu Motto - Right Side */}
                        <motion.div
                            className={styles.mottoCard}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className={styles.mottoIcon}>🏃</div>
                            <h3 className={styles.teluguMotto}>{eventConfig.about.teluguMotto}</h3>
                            <p className={styles.englishMotto}>{eventConfig.about.yearMotto}</p>
                        </motion.div>
                        {eventConfig.about.paragraphs.map((paragraph, index) => (
                            <p key={index} className={styles.text}>
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;

