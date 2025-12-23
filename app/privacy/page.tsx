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
                        At <span className={styles.strong}>Konaseema Godavari Runners</span>, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard your data when you visit our website <a href="https://konaseemarkgrunners.netlify.app" className={styles.link}>https://konaseemarkgrunners.netlify.app</a> or register for our event, <span className={styles.strong}>KONASEEMA RUN</span>.
                    </p>
                    <p className={styles.text}>
                        By using our website or services, you consent to the practices described in this Privacy Policy.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
                <div className={styles.section}>
                    <p className={styles.text}>We collect the following types of information:</p>
                    
                    <h3 className={styles.sectionTitle} style={{ fontSize: '1.2rem', marginTop: '20px' }}>
                        a) Personal Information
                    </h3>
                    <p className={styles.text}>When you register for our event, we may collect:</p>
                    <ul className={styles.list}>
                        <li>Full Name</li>
                        <li>Email Address</li>
                        <li>Phone Number</li>
                        <li>Date of Birth / Age</li>
                        <li>Gender</li>
                        <li>Emergency Contact Details</li>
                        <li>T-Shirt Size (for event merchandise)</li>
                        <li>Blood Group (optional, for safety purposes)</li>
                    </ul>

                    <h3 className={styles.sectionTitle} style={{ fontSize: '1.2rem', marginTop: '20px' }}>
                        b) Payment Information
                    </h3>
                    <p className={styles.text}>
                        When you make a payment, our third-party payment gateway (PhonePe) processes your payment details. We do not store or have access to your credit card, debit card, or banking information.
                    </p>

                    <h3 className={styles.sectionTitle} style={{ fontSize: '1.2rem', marginTop: '20px' }}>
                        c) Technical Information
                    </h3>
                    <p className={styles.text}>We may automatically collect:</p>
                    <ul className={styles.list}>
                        <li>IP Address</li>
                        <li>Browser Type and Version</li>
                        <li>Device Information</li>
                        <li>Operating System</li>
                        <li>Pages Visited and Time Spent on the Website</li>
                        <li>Cookies and Tracking Technologies</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
                <div className={styles.section}>
                    <p className={styles.text}>We use your information for the following purposes:</p>
                    <ul className={styles.list}>
                        <li><span className={styles.strong}>Event Registration:</span> To process your registration and confirm your participation.</li>
                        <li><span className={styles.strong}>Communication:</span> To send you event-related updates, confirmations, reminders, and important announcements via email or SMS.</li>
                        <li><span className={styles.strong}>Payment Processing:</span> To facilitate secure payment transactions through our payment gateway partner.</li>
                        <li><span className={styles.strong}>Safety & Emergency:</span> To contact you or your emergency contact in case of any health or safety issues during the event.</li>
                        <li><span className={styles.strong}>Event Management:</span> To organize race categories, distribute BIB numbers, timing chips, and event kits.</li>
                        <li><span className={styles.strong}>Marketing & Promotions:</span> To send promotional emails about future events, updates, and offers (you can opt out anytime).</li>
                        <li><span className={styles.strong}>Website Improvement:</span> To analyze website traffic and improve user experience.</li>
                        <li><span className={styles.strong}>Legal Compliance:</span> To comply with legal obligations and resolve disputes.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>3. Cookies & Tracking Technologies</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        Our website may use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small data files stored on your device that help us:
                    </p>
                    <ul className={styles.list}>
                        <li>Remember your preferences</li>
                        <li>Analyze website traffic and usage patterns</li>
                        <li>Improve website functionality</li>
                    </ul>
                    <p className={styles.text}>
                        You can control or disable cookies through your browser settings. However, disabling cookies may affect the functionality of our website.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>4. Sharing Your Information</h2>
                <div className={styles.section}>
                    <p className={styles.text}>We do not sell, rent, or trade your personal information to third parties. However, we may share your data in the following cases:</p>
                    <ul className={styles.list}>
                        <li><span className={styles.strong}>Payment Gateway Partners:</span> To process payments securely (e.g., PhonePe).</li>
                        <li><span className={styles.strong}>Event Service Providers:</span> With vendors involved in event logistics, such as timing chip providers, merchandise suppliers, and medical support teams.</li>
                        <li><span className={styles.strong}>Legal Authorities:</span> If required by law or to comply with legal processes, court orders, or government requests.</li>
                        <li><span className={styles.strong}>Event Sponsors & Partners:</span> With prior consent, for promotional purposes related to the event.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>5. Data Security</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        We take reasonable measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. Our security measures include:
                    </p>
                    <ul className={styles.list}>
                        <li>Encryption of sensitive data during transmission</li>
                        <li>Secure payment gateways for financial transactions</li>
                        <li>Regular security audits and updates</li>
                        <li>Access controls to limit who can view your data</li>
                    </ul>
                    <p className={styles.text}>
                        However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>6. Data Retention</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Typically:
                    </p>
                    <ul className={styles.list}>
                        <li>Registration and payment data are retained for a minimum of 3 years for record-keeping and legal compliance.</li>
                        <li>Marketing communications can be opted out of at any time, and your data will be removed from our mailing lists.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>7. Your Rights</h2>
                <div className={styles.section}>
                    <p className={styles.text}>You have the following rights regarding your personal data:</p>
                    <ul className={styles.list}>
                        <li><span className={styles.strong}>Access:</span> You can request a copy of the personal information we hold about you.</li>
                        <li><span className={styles.strong}>Correction:</span> You can request corrections to inaccurate or incomplete data.</li>
                        <li><span className={styles.strong}>Deletion:</span> You can request deletion of your personal data, subject to legal and contractual obligations.</li>
                        <li><span className={styles.strong}>Opt-Out:</span> You can unsubscribe from promotional emails by clicking the &quot;Unsubscribe&quot; link in any email or by contacting us.</li>
                        <li><span className={styles.strong}>Data Portability:</span> You can request your data in a structured, commonly used format.</li>
                    </ul>
                    <p className={styles.text}>
                        To exercise these rights, please contact us at <a href="mailto:kgrunnersravulapalem@gmail.com" className={styles.link}>kgrunnersravulapalem@gmail.com</a>.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>8. Third-Party Links</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        Our website may contain links to third-party websites (e.g., social media platforms, sponsors). We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>9. Children&apos;s Privacy</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children. If a parent or guardian becomes aware that their child has provided us with personal information without consent, please contact us, and we will take steps to delete such information.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>10. Changes to This Privacy Policy</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. Any updates will be posted on this page with a revised &quot;Last Updated&quot; date. We encourage you to review this policy periodically.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>11. Consent</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        By using our website and registering for our event, you consent to the collection, use, and sharing of your information as described in this Privacy Policy.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>12. Contact Us</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your data, please contact us:
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
                        <span className={styles.strong}>Thank you for trusting us with your information. We are committed to keeping your data safe and secure!</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
