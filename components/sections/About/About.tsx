
'use client';
import styles from './About.module.css';
import { motion } from 'framer-motion';
import { eventConfig } from '@/lib/eventConfig';

const About = () => {
    // Extract video ID from YouTube URL
    const getVideoId = (url: string): string => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    };

    const videoId = getVideoId(eventConfig.youtubeVideoUrl);
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1`;

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
                            {/* <div className={styles.mottoIcon}>🏃</div> */}
                            <h3 className={styles.teluguMotto}>{eventConfig.about.teluguMotto}</h3>
                            <p className={styles.englishMotto}>{eventConfig.about.yearMotto}</p>
                        </motion.div>
                        {eventConfig.about.paragraphs.map((paragraph, index) => (
                            <p key={index} className={styles.text}>
                                {paragraph}
                            </p>
                        ))}

                        {/* YouTube Video - No Heading */}
                        <motion.div
                            className={styles.videoWrapper}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className={styles.videoContainer}>
                                <iframe
                                    src={embedUrl}
                                    title="Event Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className={styles.videoFrame}
                                />
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;

