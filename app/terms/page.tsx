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
                        Welcome to <span className={styles.strong}>KONASEEMA RUN</span> operated by <span className={styles.strong}>Konaseema Godavari Runners</span>. By accessing or using our website <a href="https://konaseemarkgrunners.netlify.app" className={styles.link}>https://konaseemarkgrunners.netlify.app</a> and registering for our event, you agree to comply with and be bound by the following Terms & Conditions. Please read them carefully before using our services.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        By registering for the event, making a payment, or using this website, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions, along with our Privacy Policy and Refund Policy.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>2. Eligibility</h2>
                <div className={styles.section}>
                    <ul className={styles.list}>
                        <li>Participants must be at least 18 years old to register independently. Minors (under 18) must have parental or guardian consent.</li>
                        <li>Participants must be physically fit to participate in the event and should consult a medical professional if they have any health concerns.</li>
                        <li>We reserve the right to refuse registration to any individual without providing a reason.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>3. Event Registration</h2>
                <div className={styles.section}>
                    <ul className={styles.list}>
                        <li>Registration is confirmed only upon successful payment of the registration fee.</li>
                        <li>All information provided during registration must be accurate and complete. Any false or misleading information may result in disqualification.</li>
                        <li>Registration fees are non-transferable and non-refundable except as stated in our Refund Policy.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>4. Payment Terms</h2>
                <div className={styles.section}>
                    <ul className={styles.list}>
                        <li>All payments are processed securely through our payment gateway partner, PhonePe.</li>
                        <li>Registration fees must be paid in full at the time of registration.</li>
                        <li>We do not store any payment card details. All transactions are handled by our authorized payment partners.</li>
                        <li>In case of payment failure, your registration will not be confirmed until successful payment is received.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>5. Event Participation</h2>
                <div className={styles.section}>
                    <ul className={styles.list}>
                        <li>Participants must follow all event rules and regulations communicated before and during the event.</li>
                        <li>Participants must collect their race kit (BIB number, timing chip, etc.) as per the schedule communicated prior to the event.</li>
                        <li>Use of another person&apos;s BIB number or timing chip is strictly prohibited and may result in disqualification.</li>
                        <li>Participants must adhere to the designated race route and follow instructions from event officials and volunteers.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>6. Health & Safety</h2>
                <div className={styles.section}>
                    <ul className={styles.list}>
                        <li>Participants acknowledge that running events involve inherent risks, including but not limited to physical injury, illness, or even death.</li>
                        <li>Participants are responsible for ensuring they are physically and medically fit to participate in the event.</li>
                        <li>Medical assistance will be available during the event, but participants should take personal responsibility for their health and safety.</li>
                        <li>We reserve the right to deny participation or remove any participant from the event if their health or behavior poses a risk to themselves or others.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>7. Limitation of Liability</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        <span className={styles.strong}>Konaseema Godavari Runners</span>, its organizers, sponsors, partners, volunteers, and affiliates shall not be held liable for:
                    </p>
                    <ul className={styles.list}>
                        <li>Any injury, illness, loss, damage, or death sustained by participants before, during, or after the event.</li>
                        <li>Loss or damage to personal belongings.</li>
                        <li>Event cancellation, postponement, or changes due to unforeseen circumstances (weather, government orders, natural disasters, etc.).</li>
                        <li>Any technical issues with the website, payment gateway, or registration system.</li>
                    </ul>
                    <p className={styles.text}>
                        By registering, participants waive any claims against the organizers for such incidents.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>8. Event Cancellation or Changes</h2>
                <div className={styles.section}>
                    <ul className={styles.list}>
                        <li>We reserve the right to cancel, postpone, or modify the event due to circumstances beyond our control (e.g., extreme weather, natural disasters, government restrictions).</li>
                        <li>In case of cancellation, participants will be notified via email and refund policies (if applicable) will be communicated accordingly.</li>
                        <li>Changes to the event schedule, route, or format may be made at the organizers&apos; discretion. Participants will be informed of any significant changes.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>9. Intellectual Property</h2>
                <div className={styles.section}>
                    <ul className={styles.list}>
                        <li>All content on this website, including text, images, logos, graphics, and event materials, is the property of <span className={styles.strong}>Konaseema Godavari Runners</span> and is protected by copyright laws.</li>
                        <li>Participants may not reproduce, distribute, or use any content from this website without prior written consent.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>10. Photography & Media Rights</h2>
                <div className={styles.section}>
                    <ul className={styles.list}>
                        <li>By participating in the event, you grant permission to the organizers to capture and use photographs, videos, or other media of you during the event for promotional, marketing, and social media purposes.</li>
                        <li>You waive any rights to compensation or approval for such use.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>11. Code of Conduct</h2>
                <div className={styles.section}>
                    <p className={styles.text}>Participants are expected to:</p>
                    <ul className={styles.list}>
                        <li>Behave respectfully towards fellow participants, volunteers, and event staff.</li>
                        <li>Refrain from any form of harassment, abuse, or unsportsmanlike conduct.</li>
                        <li>Not engage in cheating, including but not limited to using unauthorized shortcuts, vehicles, or assistance.</li>
                    </ul>
                    <p className={styles.text}>
                        Violation of the code of conduct may result in immediate disqualification without a refund.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>12. Privacy & Data Protection</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        We are committed to protecting your personal information. Please refer to our <a href="/privacy" className={styles.link}>Privacy Policy</a> to understand how we collect, use, and safeguard your data.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>13. Refund Policy</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        Our refund policy is detailed separately. Please review our <a href="/refund" className={styles.link}>Refund Policy</a> for information on eligibility and procedures for refunds.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>14. Governing Law & Jurisdiction</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        These Terms & Conditions are governed by the laws of India. Any disputes arising from these terms or the event shall be subject to the exclusive jurisdiction of the courts in <span className={styles.strong}>Ravulapalem, Andhra Pradesh</span>.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>15. Amendments</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        We reserve the right to modify or update these Terms & Conditions at any time without prior notice. Changes will be posted on this page with an updated &quot;Last Updated&quot; date. Continued use of the website or participation in the event constitutes acceptance of the revised terms.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>16. Contact Information</h2>
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
