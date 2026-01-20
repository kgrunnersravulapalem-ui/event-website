'use client';
import styles from './Hero.module.css';
import Button from '@/components/ui/Button/Button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';

import { eventConfig } from '@/lib/eventConfig';
import Countdown from '@/components/ui/Countdown/Countdown';

const carouselImages = [
    '/images/run_1.jpeg',
    '/images/run_2.jpeg',
];

const Hero = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                (prevIndex + 1) % carouselImages.length
            );
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <section className={styles.hero}>
            {/* Carousel Background */}
            <div className={styles.carouselContainer}>
                {carouselImages.map((image, index) => (
                    <div
                        key={image}
                        className={`${styles.carouselSlide} ${
                            index === currentImageIndex ? styles.active : ''
                        }`}
                    >
                        <Image
                            src={image}
                            alt={`Running event image ${index + 1}`}
                            fill
                            priority={index === 0}
                            className={styles.carouselImage}
                            sizes="100vw"
                        />
                    </div>
                ))}
            </div>

            {/* Gradient Overlay */}
            <div className={styles.background}>
                {/* Abstract gradient overlay to maintain brand colors */}
            </div>

            {/* Carousel Indicators */}
            <div className={styles.carouselIndicators}>
                {carouselImages.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.indicator} ${
                            index === currentImageIndex ? styles.activeIndicator : ''
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            <div className={styles.content}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className={styles.textContent}
                >
                    <div className={styles.editionBadge}>1st Edition</div>
                    <h1 className={styles.headline}>
                        {eventConfig.eventName} <br />
                    </h1>

                    <Countdown />

                    <div className={styles.deadlineInfo}>
                        Last Date for Registration: <strong>{eventConfig.registration.deadline}</strong>
                    </div>

                    <p className={styles.subhead}>
                        Join hundreds of runners in the most scenic run of the year.
                        Experience the thrill, the view, and the glory.
                    </p>

                    <div className={styles.ctaGroup}>
                        <Link href="/register">
                            <Button size="lg" variant="primary">Register Now</Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
