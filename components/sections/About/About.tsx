
'use client';
import styles from './About.module.css';
import { motion } from 'framer-motion';

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
                    <h2 className={styles.title}>About The Run</h2>
                    <p className={styles.text}>
                        Join us for the most anticipated running event of the year! The Tanuku Marathon is not just a race;
                        it's a celebration of health, community, and the human spirit. Organized by running enthusiasts
                        for running enthusiasts.
                    </p>
                    <p className={styles.text}>
                        Our motto "Run Together" embodies our belief that running connects us all. Whether you are aiming
                        for a personal best or just here for the fun, we have a spot for you.
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
