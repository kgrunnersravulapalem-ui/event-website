'use client';
import styles from './EventHighlights.module.css';
import { motion } from 'framer-motion';
import { FaRunning, FaClock, FaMapMarkedAlt } from 'react-icons/fa';

const features = [
    {
        icon: <FaRunning />,
        title: 'Multiple Categories',
        description: 'Whether you are a beginner or a pro, choose from 5K, 10K, 21K, or the full 42K marathon.',
    },
    {
        icon: <FaMapMarkedAlt />,
        title: 'Scenic Route',
        description: 'Run through the heart of the city and along the coastline. Fully closed roads for your safety.',
    },
    {
        icon: <FaClock />,
        title: 'Professional Timing',
        description: 'Chip-timed event with instant results. Qualify for major international marathons.',
    },
];

const EventHighlights = () => {
    return (
        <section className={styles.section} id="event">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Why Run With Us?</h2>
                    <p>Experience a world-class marathon event organized with passion.</p>
                </div>

                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className={styles.card}
                        >
                            <div className={styles.iconWrapper}>{feature.icon}</div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventHighlights;
