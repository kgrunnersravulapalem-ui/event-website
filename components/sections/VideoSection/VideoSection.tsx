'use client';
import styles from './VideoSection.module.css';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface VideoSectionProps {
    videoUrl: string;
    title?: string;
    description?: string;
}

/**
 * VideoSection Component
 * 
 * Displays a YouTube video embed with muted autoplay by default.
 * Users can unmute and control the video using YouTube's native controls.
 * 
 * @param videoUrl - Full YouTube URL or video ID
 * @param title - Optional section title
 * @param description - Optional section description
 */
const VideoSection = ({
    videoUrl,
    title = "Event Highlights",
    description = "Watch the excitement and energy of our running event"
}: VideoSectionProps) => {
    // Extract video ID from YouTube URL
    const getVideoId = (url: string): string => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    };

    const videoId = getVideoId(videoUrl);

    // YouTube embed URL with autoplay and mute parameters
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1`;

    return (
        <section className={styles.videoSection} id="video">
            <div className={styles.container}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className={styles.content}
                >
                    {title && <h2 className={styles.title}>{title}</h2>}
                    {description && <p className={styles.description}>{description}</p>}

                    <div className={styles.videoWrapper}>
                        <iframe
                            src={embedUrl}
                            title={title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className={styles.videoFrame}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default VideoSection;
