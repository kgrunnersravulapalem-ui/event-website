import type { Metadata } from "next";
import styles from "./Policy.module.css";

export const metadata: Metadata = {
    title: "Terms & Conditions | KONASEEMA RUN",
    description: "Terms and conditions for participation in KONASEEMA RUN event.",
};

export default function TermsPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Terms & Conditions</h1>
                <p className={styles.lastUpdated}>Last Updated: January 2026</p>

                <div className={styles.section}>
                    <p className={styles.text}>
                        Welcome to <span className={styles.strong}>KONASEEMA RUN</span> operated by <span className={styles.strong}>Konaseema Godavari Runners</span>. By accessing or using our website <a href="https://kgrunners.in" className={styles.link}>https://kgrunners.in</a> and registering for our event, you agree to comply with and be bound by the following Terms & Conditions. Please read them carefully before using our services.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>1. Registration & Payment</h2>
                <div className={styles.section}>
                    <ul className={styles.list}>
                        <li>Registration is confirmed only upon successful payment through PhonePe payment gateway.</li>
                        <li>All information provided during registration must be accurate and complete.</li>
                        <li>Registration fees are <span className={styles.strong}>non-transferable and non-refundable</span> (see <a href="/refund" className={styles.link}>Refund Policy</a>).</li>
                        <li>Participants must be 18+ years old. Minors require parental consent.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>2. Event Participation</h2>
                <div className={styles.section}>
                    <ul className={styles.list}>
                        <li>Participants must be physically fit and medically cleared to participate in running events.</li>
                        <li>Collect your race kit (BIB number, timing chip, etc.) as per the communicated schedule.</li>
                        <li>Using another person&apos;s BIB number or timing chip is prohibited and will result in disqualification.</li>
                        <li>Follow all event rules, designated race routes, and instructions from event officials.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>3. Liability & Safety</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        Participants acknowledge that running events involve inherent risks. <span className={styles.strong}>Konaseema Godavari Runners</span>, its organizers, sponsors, and volunteers shall not be held liable for any injury, illness, loss, or damage sustained during the event. Participants waive any claims against the organizers.
                    </p>
                    <p className={styles.text}>
                        Medical assistance will be available, but participants are responsible for their own health and safety.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>4. Code of Conduct</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        Behave respectfully and maintain sportsmanlike conduct. No harassment, cheating, or unauthorized assistance. Violations result in immediate disqualification without refund.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>5. Media Rights</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        By participating, you grant permission to use photographs/videos of you for promotional purposes without compensation.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>6. Website Owner Information</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        <span className={styles.strong}>THIS WEBSITE OWNED BY NAGA CHANDRASEKARA REDDY PADALA</span>
                    </p>
                    <p className={styles.text}>
                        <span className={styles.strong}>Address:</span> 8-228/2, verideswaram road, ravulapalem, Ravulapalem, Konaseema district, Andhra Pradesh - 534238
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>7. Contact Information</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        If you have any questions or concerns regarding these Terms & Conditions, please contact us:
                    </p>
                    <p className={styles.text}>
                        <span className={styles.strong}>Email:</span> <a href="mailto:kgrunnersravulapalem@gmail.com" className={styles.link}>kgrunnersravulapalem@gmail.com</a><br />
                        <span className={styles.strong}>Event:</span> KONASEEMA RUN<br />
                        <span className={styles.strong}>Location:</span> Sri Potamsetti Rami Reddy Park, Ravulapalem, Konaseema Dist, Andhra Pradesh - 533238
                    </p>
                </div>

                <div className={styles.section} style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <p className={styles.text}>
                        By registering for our event, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.
                    </p>
                    <p className={styles.text} style={{ marginTop: '20px' }}>
                        <span className={styles.strong}>Thank you for choosing KONASEEMA RUN!</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
