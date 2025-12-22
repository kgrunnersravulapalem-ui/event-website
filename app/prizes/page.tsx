'use client';
import styles from './Prizes.module.css';
import { eventConfig } from '@/lib/eventConfig';
import { motion } from 'framer-motion';

// Prize structure based on the image
const prizeStructure = {
    above18: {
        title: "Above 18 years (DOB ON OR BEFORE :07/02/2008)",
        categories: {
            "10k": {
                male: [5000, 4000, 3000],
                female: [5000, 4000, 3000]
            },
            "5k": {
                male: [3000, 2000, 1000],
                female: [3000, 2000, 1000]
            }
        }
    },
    below18: {
        title: "Below 18 years (DOB ON OR AFTER:08/02/2008)",
        categories: {
            "10k": {
                male: [3000, 2500, 2000],
                female: [3000, 2500, 2000]
            },
            "5k": {
                male: [2000, 1500, 1000],
                female: [2000, 1500, 1000]
            }
        }
    }
};

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
                        Prize Money & Registration
                    </motion.h1>
                    <p>Compete for exciting prizes and be part of the celebration!</p>
                </div>
            </div>

            <div className={styles.container}>
                {/* Registration Info Section */}
                <motion.section
                    className={styles.registrationSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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

                {/* Prize Money Tables */}
                <motion.section
                    className={styles.prizeSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className={styles.sectionTitle}>Prize Money Distribution</h2>

                    {/* Above 18 Table */}
                    <div className={styles.prizeTableWrapper}>
                        <h3 className={styles.ageGroupTitle}>{prizeStructure.above18.title}</h3>
                        <div className={styles.tableContainer}>
                            <table className={styles.prizeTable}>
                                <thead>
                                    <tr>
                                        <th colSpan={2}>10k</th>
                                        <th colSpan={2}>5k</th>
                                    </tr>
                                    <tr>
                                        <th>Male</th>
                                        <th>Female</th>
                                        <th>Male</th>
                                        <th>Female</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>₹{prizeStructure.above18.categories["10k"].male[0]}</td>
                                        <td>₹{prizeStructure.above18.categories["10k"].female[0]}</td>
                                        <td>₹{prizeStructure.above18.categories["5k"].male[0]}</td>
                                        <td>₹{prizeStructure.above18.categories["5k"].female[0]}</td>
                                    </tr>
                                    <tr>
                                        <td>₹{prizeStructure.above18.categories["10k"].male[1]}</td>
                                        <td>₹{prizeStructure.above18.categories["10k"].female[1]}</td>
                                        <td>₹{prizeStructure.above18.categories["5k"].male[1]}</td>
                                        <td>₹{prizeStructure.above18.categories["5k"].female[1]}</td>
                                    </tr>
                                    <tr>
                                        <td>₹{prizeStructure.above18.categories["10k"].male[2]}</td>
                                        <td>₹{prizeStructure.above18.categories["10k"].female[2]}</td>
                                        <td>₹{prizeStructure.above18.categories["5k"].male[2]}</td>
                                        <td>₹{prizeStructure.above18.categories["5k"].female[2]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Below 18 Table */}
                    <div className={styles.prizeTableWrapper}>
                        <h3 className={styles.ageGroupTitle}>{prizeStructure.below18.title}</h3>
                        <div className={styles.tableContainer}>
                            <table className={styles.prizeTable}>
                                <thead>
                                    <tr>
                                        <th colSpan={2}>10k</th>
                                        <th colSpan={2}>5k</th>
                                    </tr>
                                    <tr>
                                        <th>Male</th>
                                        <th>Female</th>
                                        <th>Male</th>
                                        <th>Female</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>₹{prizeStructure.below18.categories["10k"].male[0]}</td>
                                        <td>₹{prizeStructure.below18.categories["10k"].female[0]}</td>
                                        <td>₹{prizeStructure.below18.categories["5k"].male[0]}</td>
                                        <td>₹{prizeStructure.below18.categories["5k"].female[0]}</td>
                                    </tr>
                                    <tr>
                                        <td>₹{prizeStructure.below18.categories["10k"].male[1]}</td>
                                        <td>₹{prizeStructure.below18.categories["10k"].female[1]}</td>
                                        <td>₹{prizeStructure.below18.categories["5k"].male[1]}</td>
                                        <td>₹{prizeStructure.below18.categories["5k"].female[1]}</td>
                                    </tr>
                                    <tr>
                                        <td>₹{prizeStructure.below18.categories["10k"].male[2]}</td>
                                        <td>₹{prizeStructure.below18.categories["10k"].female[2]}</td>
                                        <td>₹{prizeStructure.below18.categories["5k"].male[2]}</td>
                                        <td>₹{prizeStructure.below18.categories["5k"].female[2]}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.section>

                {/* Important Notes */}
                <motion.section
                    className={styles.notesSection}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h3>Important Notes</h3>
                    <ul>
                        <li>Prizes will be awarded to the top 3 positions in each category</li>
                        <li>Age categories are determined by date of birth</li>
                        <li>Above 18: DOB ON OR BEFORE 07/02/2008</li>
                        <li>Below 18: DOB ON OR AFTER 08/02/2008</li>
                        <li>Winners must present valid ID proof for verification</li>
                        <li>Prize distribution will be done on the event day</li>
                    </ul>
                </motion.section>

                {/* CTA Section */}
                <motion.div
                    className={styles.ctaSection}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <h2>Ready to Join?</h2>
                    <p>Register now and compete for exciting prizes!</p>
                    <a href="/register" className={styles.ctaButton}>
                        Register Now
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
