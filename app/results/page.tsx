'use client';
import styles from './Results.module.css';
import { motion } from 'framer-motion';
import { getWinnersByCategoryAndGender } from '@/lib/winnersData';

interface GenderGroupProps {
    winners: any[];
    label: string;
}

const GenderGroup = ({ winners, label }: GenderGroupProps) => {
    const validWinners = winners.filter(w => w.name && w.name.trim());
    if (validWinners.length === 0) return null;
    return (
        <div className={styles.genderGroup}>
            <div className={styles.genderHeader}>{label}</div>
            {validWinners.map((winner, idx) => (
                <div key={idx} className={styles.winnerItem}>
                    <span className={styles.winnerName}>{winner.name}</span>
                    <span className={styles.winnerBib}>#{winner.bibNo}</span>
                </div>
            ))}
        </div>
    );
};

const PositionGroup = ({ position, medal, male, female }: any) => (
    <div className={styles.positionSection}>
        <div className={styles.positionHeader}>
            <span className={styles.medal}>{medal}</span>
            <span className={styles.positionTitle}>{position}</span>
        </div>
        <div className={styles.winnersGrid}>
            {male.length > 0 && <GenderGroup winners={male} label="♂ Male" />}
            {female.length > 0 && <GenderGroup winners={female} label="♀ Female" />}
        </div>
    </div>
);

const RaceSection = ({ distance, categoryWinners, ageLabel, ageType, getMedalIcon }: any) => {
    const distanceWinners = categoryWinners.filter((c: any) => c.baseCategory.startsWith(distance));
    let filteredWinners = distanceWinners;
    
    if (ageType === 'above') {
        filteredWinners = distanceWinners.filter((c: any) => c.baseCategory.includes('>18Y'));
    } else if (distance === '3K') {
        filteredWinners = distanceWinners.filter((c: any) => c.baseCategory.includes('<13Y'));
    } else {
        filteredWinners = distanceWinners.filter((c: any) => c.baseCategory.includes('<18Y'));
    }

    if (filteredWinners.length === 0) return null;

    return (
        <div className={styles.ageSubSection}>
            <h3 className={styles.ageSubTitle}>{ageLabel}</h3>
            {filteredWinners.map((categoryGroup: any, idx: number) => (
                <div key={idx} className={styles.categorySection}>
                    {categoryGroup.positions.map((positionGroup: any, posIdx: number) => {
                        const medal = 
                            positionGroup.position === 'WINNER' ? '🥇' :
                            positionGroup.position === '1st RUNNER UP' ? '🥈' : '🥉';
                        return (
                            <PositionGroup
                                key={posIdx}
                                position={positionGroup.position}
                                medal={medal}
                                male={positionGroup.male}
                                female={positionGroup.female}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default function ResultsPage() {
    const categoryWinners = getWinnersByCategoryAndGender();

    const races = [
        { distance: '10K', title: '10K RUN', delay: 0.1 },
        { distance: '5K', title: '5K RUN', delay: 0.2 },
        { distance: '3K', title: '3K RUN (Kids)', delay: 0.3 },
    ];

    const ageGroups = [
        { type: 'above' as const, label: 'Above 18 Years' },
        { type: 'below' as const, label: 'Below 18 Years' },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div className={styles.headerContent}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Konaseema Run 2026
                    </motion.h1>
                    <p>Race Results & Winners</p>
                </div>
            </div>

            <div className={styles.container}>
                {races.map((race) => (
                    <motion.section
                        key={race.distance}
                        className={styles.ageGroupSection}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: race.delay }}
                    >
                        <h2 className={styles.distanceTitle}>{race.title}</h2>
                        
                        {race.distance === '3K' ? (
                            <RaceSection
                                distance={race.distance}
                                categoryWinners={categoryWinners}
                                ageLabel="Below 13 Years"
                                ageType="below"
                            />
                        ) : (
                            ageGroups.map((group) => (
                                <RaceSection
                                    key={`${race.distance}-${group.type}`}
                                    distance={race.distance}
                                    categoryWinners={categoryWinners}
                                    ageLabel={group.label}
                                    ageType={group.type}
                                />
                            ))
                        )}
                    </motion.section>
                ))}
            </div>
        </div>
    );
}
