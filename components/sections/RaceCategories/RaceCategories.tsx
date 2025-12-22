'use client';
import styles from './RaceCategories.module.css';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button/Button';
import { eventConfig } from '@/lib/eventConfig';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const RaceCategories = () => {
    const router = useRouter();

    const handleRegister = (categoryId: string) => {
        router.push(`/register?category=${categoryId}`);
    };

    return (
        <section className={styles.section} id="race-categories">
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>{eventConfig.raceCategories.title}</h2>
                    <p>{eventConfig.raceCategories.subtitle}</p>
                </div>

                <div className={styles.grid}>
                    {eventConfig.raceCategories.categories.map((cat, index) => (
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
                                {cat.distance}
                            </div>
                            <h3 className={styles.cardTitle}>{cat.distance}</h3>
                            <p className={styles.cardDesc}>{cat.desc}</p>

                            {/* Route Image */}
                            <div className={styles.routeImageWrapper}>
                                <div className={styles.routeImagePlaceholder}>
                                    <span>Route Map</span>
                                    <small>Coming Soon</small>
                                </div>
                            </div>

                            <div className={styles.priceSection}>
                                <span className={styles.priceLabel}>Registration Fee</span>
                                <span className={styles.price}>₹{cat.price}</span>
                            </div>

                            <Button
                                size="sm"
                                variant="primary"
                                fullWidth
                                onClick={() => handleRegister(cat.id)}
                            >
                                Register Now
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default RaceCategories;



