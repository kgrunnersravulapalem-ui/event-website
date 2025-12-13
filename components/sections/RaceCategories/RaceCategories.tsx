'use client';
import styles from './RaceCategories.module.css';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button/Button';

const categories = [
    {
        distance: '20 Miler',
        km: '32K',
        desc: 'The ultimate endurance test. Perfect for marathon simulation.',
        color: '#ef4444', // Red
    },
    {
        distance: '16 Miler',
        km: '25K',
        desc: 'Push beyond the half marathon. A challenging middle distance.',
        color: '#f97316', // Orange
    },
    {
        distance: '11 Miler',
        km: '17K',
        desc: 'The classic distance redefined. Fast, scenic, and exhilarating.',
        color: '#eab308', // Yellow
    },
    {
        distance: '5 Miler',
        km: '8K',
        desc: 'Short, sweet, and spirited. Great for beginners & speedsters.',
        color: '#22c55e', // Green
    },
];

const RaceCategories = () => {
    return (
        <section className={styles.section} id="race-categories">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>Race Categories</h2>
                    <p>Choose your challenge. Experience the thrill.</p>
                </div>

                <div className={styles.grid}>
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.distance}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={styles.card}
                            style={{ borderTopColor: cat.color }}
                        >
                            <div className={styles.distanceBadge} style={{ backgroundColor: cat.color }}>
                                {cat.km}
                            </div>
                            <h3 className={styles.cardTitle}>{cat.distance}</h3>
                            <p className={styles.cardDesc}>{cat.desc}</p>
                            <Button size="sm" variant="outline" fullWidth>Details</Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RaceCategories;
