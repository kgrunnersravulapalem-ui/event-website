'use client';
import styles from './Prizes.module.css';
import { eventConfig } from '@/lib/eventConfig';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaAward } from 'react-icons/fa';

// Prize structure based on the image
const prizeStructure = [
    {
        id: 'above18',
        title: "Above 18 years",
        criteria: "DOB ON OR BEFORE: 07/02/2008",
        categories: [
            {
                name: "10K RUN",
                male: [5000, 4000, 3000],
                female: [5000, 4000, 3000],
                color: "#ef4444"
            },
            {
                name: "5K RUN",
                male: [3000, 2000, 1000],
                female: [3000, 2000, 1000],
                color: "#f97316"
            }
        ]
    },
    {
        id: 'below18',
        title: "Below 18 years",
        criteria: "DOB ON OR AFTER: 08/02/2008",
        categories: [
            {
                name: "10K RUN",
                male: [3000, 2500, 2000],
                female: [3000, 2500, 2000],
                color: "#ef4444"
            },
            {
                name: "5K RUN",
                male: [2000, 1500, 1000],
                female: [2000, 1500, 1000],
                color: "#f97316"
            }
        ]
    }
];

export default function PrizesPage() {
    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Prizes & Benefits
                    </motion.h1>
                    <p>Compete for excitement and celebrate your achievement!</p>
                </div>
            </div>

            <div className={styles.container}>
                {/* Participant Kit Info - Now at the Top */}
                <motion.div
                    className={styles.deliverablesSection}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className={styles.sectionTitle}>Participant Benefits</h2>
                    <p className={styles.benefitsText}>Every registered participant will receive:</p>
                    <div className={styles.deliverablesGrid}>
                        {eventConfig.deliverables.map((item, index) => (
                            <div key={index} className={styles.deliverableItem}>
                                <span className={styles.checkIcon}>✓</span>
                                {item}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Registration Info Section */}
                <motion.section
                    className={styles.registrationSection}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className={styles.sectionTitle}>Registration Information</h2>
                    <div className={styles.infoGrid}>
                        <div className={styles.infoCard}>
                            <div className={styles.infoLabel}>Last Date for Registration</div>
                            <div className={styles.infoValue}>{eventConfig.registration.deadline}</div>
                        </div>
                        <div className={styles.infoCard}>
                            <div className={styles.infoLabel}>Entry Fee</div>
                            <div className={styles.infoValue}>₹{eventConfig.registration.entryFee}/-</div>
                            <p className={styles.infoSubtext}>For 3K, 5K, 10K RUN/WALK</p>
                        </div>
                        <div className={styles.infoCard}>
                            <div className={styles.infoLabel}>Total Prize Pool</div>
                            <div className={styles.infoValue}>₹{eventConfig.registration.prizeMoney.total.toLocaleString()}/-</div>
                        </div>
                    </div>
                </motion.section>

                {/* Prize Money Redesign */}
                <motion.section
                    className={styles.prizeSection}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className={styles.sectionTitle}>Prize Money Distribution</h2>

                    <div className={styles.ageGroupsGrid}>
                        {prizeStructure.map((group) => (
                            <div key={group.id} className={styles.ageGroupBlock}>
                                <div className={styles.ageGroupHeader}>
                                    <h3>{group.title}</h3>
                                    <span className={styles.criteria}>{group.criteria}</span>
                                </div>

                                <div className={styles.categoriesGrid}>
                                    {group.categories.map((cat, idx) => (
                                        <div key={idx} className={styles.prizeCard} style={{ borderTop: `4px solid ${cat.color}` }}>
                                            <div className={styles.cardHeader}>
                                                <FaTrophy style={{ color: cat.color }} />
                                                <h4>{cat.name}</h4>
                                            </div>

                                            <div className={styles.genderSplit}>
                                                <div className={styles.genderCol}>
                                                    <h5>Male</h5>
                                                    <div className={styles.prizesList}>
                                                        <div className={styles.prizeRank}>
                                                            <FaMedal className={styles.gold} />
                                                            <span>1st: ₹{cat.male[0]}</span>
                                                        </div>
                                                        <div className={styles.prizeRank}>
                                                            <FaMedal className={styles.silver} />
                                                            <span>2nd: ₹{cat.male[1]}</span>
                                                        </div>
                                                        <div className={styles.prizeRank}>
                                                            <FaMedal className={styles.bronze} />
                                                            <span>3rd: ₹{cat.male[2]}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className={styles.divider} />

                                                <div className={styles.genderCol}>
                                                    <h5>Female</h5>
                                                    <div className={styles.prizesList}>
                                                        <div className={styles.prizeRank}>
                                                            <FaMedal className={styles.gold} />
                                                            <span>1st: ₹{cat.female[0]}</span>
                                                        </div>
                                                        <div className={styles.prizeRank}>
                                                            <FaMedal className={styles.silver} />
                                                            <span>2nd: ₹{cat.female[1]}</span>
                                                        </div>
                                                        <div className={styles.prizeRank}>
                                                            <FaMedal className={styles.bronze} />
                                                            <span>3rd: ₹{cat.female[2]}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Important Notes */}
                <motion.section
                    className={styles.notesSection}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <div className={styles.notesCard}>
                        <h3><FaAward /> Important Notes</h3>
                        <ul>
                            <li>Prizes will be awarded to the top 3 positions in each category.</li>
                            <li>Age categories are determined by the provided date of birth criteria.</li>
                            <li>Winners must present valid ID proof (Aadhar/Voter ID/School ID) for verification.</li>
                            <li>Prize distribution will be conducted at the venue post-race.</li>
                            <li>The organizer's decision will be final regarding any disputes.</li>
                        </ul>
                    </div>
                </motion.section>

                {/* CTA Section */}
                <motion.div
                    className={styles.ctaSection}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                >
                    <h2>Ready to Join?</h2>
                    <p>Don't miss out on the thrill and the glory. Secure your spot today!</p>
                    <a href="/register" className={styles.ctaButton}>
                        Register Now
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
