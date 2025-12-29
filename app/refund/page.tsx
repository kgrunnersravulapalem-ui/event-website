import type { Metadata } from "next";
import styles from "../terms/Policy.module.css";

export const metadata: Metadata = {
    title: "Refund Policy | KONASEEMA RUN",
    description: "Refund and cancellation policy for KONASEEMA RUN event.",
};

export default function RefundPage() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Refund & Cancellation Policy</h1>
                <p className={styles.lastUpdated}>Last Updated: January 2026</p>

                <div className={styles.section}>
                    <p className={styles.text}>
                        At <span className={styles.strong}>Konaseema Godavari Runners</span>, we strive to provide a seamless registration and event experience for all participants of <span className={styles.strong}>KONASEEMA RUN</span>. This Refund & Cancellation Policy outlines the terms and conditions for refunds related to event registration and payments.
                    </p>
                    <p className={styles.text}>
                        Please read this policy carefully before completing your registration.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>1. General Policy</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        All registration fees are <span className={styles.strong}>non-refundable and non-transferable</span>. Once payment is successfully processed and registration is confirmed, cancellations or changes are not permitted.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>2. Refunds Issued Only For</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        <span className={styles.strong}>Duplicate Payment:</span> In case of an accidental double charge for the same order.
                    </p>
                    <p className={styles.text}>
                        Please contact us at <a href="mailto:kgrunnersravulapalem@gmail.com" className={styles.link}>kgrunnersravulapalem@gmail.com</a> with proof of the duplicate transaction (e.g., payment receipts, bank statements).
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>3. Refund Request Process</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        <span className={styles.strong}>Processing Time:</span> Approved refunds will be processed and credited back to your original payment method within <span className={styles.strong}>7–10 working days</span>.
                    </p>
                    <p className={styles.text}>
                        To request a refund for duplicate payment, send an email to <a href="mailto:kgrunnersravulapalem@gmail.com" className={styles.link}>kgrunnersravulapalem@gmail.com</a> with:
                    </p>
                    <ul className={styles.list}>
                        <li>Full Name (as registered)</li>
                        <li>Transaction IDs for both payments</li>
                        <li>Payment receipts or bank statements showing the duplicate charge</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>4. Contact Us</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        If you have any questions or concerns regarding this Refund & Cancellation Policy, please contact us:
                    </p>
                    <p className={styles.text}>
                        <span className={styles.strong}>Email:</span> <a href="mailto:kgrunnersravulapalem@gmail.com" className={styles.link}>kgrunnersravulapalem@gmail.com</a><br />
                        <span className={styles.strong}>Event:</span> KONASEEMA RUN<br />
                        <span className={styles.strong}>Organizer:</span> Konaseema Godavari Runners<br />
                        <span className={styles.strong}>Location:</span> Sri Potamsetti Rami Reddy Park, Ravulapalem, Konaseema Dist, Andhra Pradesh - 533238
                    </p>
                </div>

                <div className={styles.section} style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <p className={styles.text}>
                        By registering for our event, you acknowledge that you have read, understood, and agreed to this Refund & Cancellation Policy.
                    </p>
                    <p className={styles.text} style={{ marginTop: '20px' }}>
                        <span className={styles.strong}>Thank you for your understanding and cooperation!</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
