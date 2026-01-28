import Image from 'next/image';
import styles from './Sponsors.module.css';

const Sponsors = () => {
    return (
        <section className={styles.section} id="sponsors">
            <div className={styles.container}>
                <h2 className={styles.title}>Our Sponsors</h2>

                {/* Main Sponsors - Equal Priority */}
                <div className={styles.mainSponsorsGrid}>
                    {/* Aditya University */}
                    <div className={styles.mainSponsorItem}>
                        <Image
                            src="/images/sponsor_logos/aditya_logo.png"
                            alt="Aditya University"
                            width={280}
                            height={140}
                            className={styles.mainLogo}
                            priority
                        />
                    </div>

                    {/* Teja Free Food - Text Only */}
                    <div className={styles.mainSponsorItem}>
                        <span className={styles.textSponsorMain}>Teja Free Food</span>
                    </div>

                    {/* Victory Bazars */}
                    <div className={styles.mainSponsorItem}>
                        <Image
                            src="/images/sponsor_logos/victory_logo.jpeg"
                            alt="Victory Bazars"
                            width={280}
                            height={140}
                            className={styles.mainLogo}
                        />
                    </div>

                    {/* Manihamsa Power Projects */}
                    <div className={styles.mainSponsorItem}>
                        <Image
                            src="/images/sponsor_logos/manihamsa_logo.png"
                            alt="Manihamsa Power Projects"
                            width={280}
                            height={140}
                            className={styles.mainLogo}
                        />
                    </div>
                </div>

                {/* Other Sponsors */}
                <div className={styles.otherSponsorsGrid}>
                    {/* Recovery */}
                    <div className={styles.sponsorItem}>
                        <Image
                            src="/images/sponsor_logos/recovery_logo.png"
                            alt="Recovery"
                            width={160}
                            height={80}
                            className={styles.logo}
                        />
                    </div>

                    {/* Reddy Drugs */}
                    <div className={styles.sponsorItem}>
                        <Image
                            src="/images/sponsor_logos/reddy_drugs.jpeg"
                            alt="Reddy Drugs"
                            width={160}
                            height={80}
                            className={styles.logo}
                        />
                    </div>

                    {/* Haldi Plus */}
                    <div className={styles.sponsorItem}>
                        <Image
                            src="/images/sponsor_logos/haldi_plus_logo.png"
                            alt="Haldi Plus"
                            width={160}
                            height={80}
                            className={styles.logo}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Sponsors;
