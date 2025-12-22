
'use client';
import styles from './About.module.css';
import { motion } from 'framer-motion';
import { eventConfig } from '@/lib/eventConfig';

const About = () => {
    return (
        <section className={styles.section} id="about">
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.content}
                >
                    <h2 className={styles.title}>{eventConfig.about.title}</h2>
                    {eventConfig.about.paragraphs.map((paragraph, index) => (
                        <p key={index} className={styles.text}>
                            {paragraph}
                        </p>
                    ))}
                    <p className={styles.text}>
                        <strong>{eventConfig.about.year} Year motto:</strong> "{eventConfig.about.yearMotto}"
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.imageBlock}
                >
                    {/* Placeholder for an about image */}
                    <div className={styles.placeholderImg}>
                        <span>Running Community</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;

