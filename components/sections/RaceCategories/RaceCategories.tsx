'use client';
import styles from './RaceCategories.module.css';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button/Button';
import { eventConfig } from '@/lib/eventConfig';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';

const routeMapImages: Record<string, string> = {
    '3K': 'https://firebasestorage.googleapis.com/v0/b/konaseema-run.firebasestorage.app/o/images%2Frandom-images%2F1770264111748_3km.jpeg?alt=media&token=4ecff5bb-9442-414d-a114-f7fb35e858ff',
    '5K': 'https://firebasestorage.googleapis.com/v0/b/konaseema-run.firebasestorage.app/o/images%2Frandom-images%2F1770264115236_5km.jpeg?alt=media&token=1caae202-a03b-4996-8b8e-9f126ad982db',
    '10K': 'https://firebasestorage.googleapis.com/v0/b/konaseema-run.firebasestorage.app/o/images%2Frandom-images%2F1770264117883_10km.jpeg?alt=media&token=16c72b17-5807-4fcf-8e8b-48701ba2b9b9',
};

const RaceCategories = () => {
    const router = useRouter();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
                                <div 
                                    className={styles.routeImage}
                                    onClick={() => setSelectedImage(routeMapImages[cat.distance] || null)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <img
                                        src={routeMapImages[cat.distance]}
                                        alt={`${cat.distance} Route Map`}
                                        className={styles.routeImageImg}
                                    />
                                    <div className={styles.imageOverlay}>
                                        <span className={styles.viewText}>View Route Map</span>
                                    </div>
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
                                disabled
                                style={{ opacity: 0.7, cursor: 'not-allowed' }}
                            >
                                Closed
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div 
                    className={styles.modal}
                    onClick={() => setSelectedImage(null)}
                >
                    <div className={styles.modalContent}>
                        <button 
                            className={styles.closeButton}
                            onClick={() => setSelectedImage(null)}
                        >
                            ×
                        </button>
                        <Image
                            src={selectedImage}
                            alt="Route Map"
                            width={800}
                            height={600}
                            className={styles.modalImage}
                            priority
                        />
                    </div>
                </div>
            )}
        </section>
    );
};

export default RaceCategories;



