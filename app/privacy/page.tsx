import type { Metadata } from "next";
import styles from "../terms/Policy.module.css";

export const metadata: Metadata = {
    title: "Privacy Policy | KONASEEMA RUN",
    description: "Privacy policy for KONASEEMA RUN event and website.",
};

export default function PrivacyPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Privacy Policy</h1>
                <p className={styles.lastUpdated}>Last Updated: January 2026</p>

                <div className={styles.section}>
                    <p className={styles.text}>
                        At <span className={styles.strong}>Konaseema Godavari Runners</span>, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard your data when you visit our website <a href="https://kgrunners.in" className={styles.link}>https://kgrunners.in</a> or register for our event, <span className={styles.strong}>KONASEEMA RUN</span>.
                    </p>
                    <p className={styles.text}>
                        By using our website or services, you consent to the practices described in this Privacy Policy.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
                <div className={styles.section}>
                    <p className={styles.text}>When you register for our event, we collect:</p>
                    <ul className={styles.list}>
                        <li>Name, Email, Phone Number, Age, Gender</li>
                        <li>Emergency Contact Details</li>
                        <li>T-Shirt Size, Blood Group (optional)</li>
                    </ul>
                    <p className={styles.text}>
                        Payment details are processed securely by PhonePe. We do not store any credit/debit card or banking information.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
                <div className={styles.section}>
                    <p className={styles.text}>We use your information to:</p>
                    <ul className={styles.list}>
                        <li>Process registration and confirm participation</li>
                        <li>Send event updates, confirmations, and important announcements</li>
                        <li>Organize race categories and distribute event kits</li>
                        <li>Contact emergency contacts if needed during the event</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>3. Data Protection</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        We do not sell or trade your personal information. We may share data only with payment gateway partners (PhonePe) and event service providers (timing, medical support) necessary for event management.
                    </p>
                    <p className={styles.text}>
                        We implement security measures to protect your data, including encryption and secure payment gateways.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>4. Your Rights</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        You can request access, correction, or deletion of your personal data by contacting us at <a href="mailto:kgrunnersravulapalem@gmail.com" className={styles.link}>kgrunnersravulapalem@gmail.com</a>.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>5. Contact Us</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us:
                    </p>
                    <p className={styles.text}>
                        <span className={styles.strong}>Email:</span> <a href="mailto:kgrunnersravulapalem@gmail.com" className={styles.link}>kgrunnersravulapalem@gmail.com</a><br />
                        <span className={styles.strong}>Event:</span> KONASEEMA RUN<br />
                        <span className={styles.strong}>Organizer:</span> Konaseema Godavari Runners
                    </p>
                </div>

                <div className={styles.section} style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <p className={styles.text}>
                        By registering for our event, you consent to this Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}
