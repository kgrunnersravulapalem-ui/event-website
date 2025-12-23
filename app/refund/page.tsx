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
                        At <span className={styles.strong}>Konaseema Godavari Runners</span>, we strive to provide a seamless registration and event experience for all participants of <span className={styles.strong}>KONASEEMA RUN</span>. This Refund & Cancellation Policy outlines the terms and conditions for refunds and cancellations related to event registration and payments.
                    </p>
                    <p className={styles.text}>
                        Please read this policy carefully before completing your registration.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>1. General Policy</h2>
                <div className={styles.section}>
                    <ul className={styles.list}>
                        <li>All registration fees are <span className={styles.strong}>non-refundable and non-transferable</span> under normal circumstances.</li>
                        <li>Once payment is successfully processed and registration is confirmed, cancellations or changes are generally not permitted.</li>
                        <li>Refunds will only be considered in exceptional cases as outlined in this policy.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>2. Eligibility for Refunds</h2>
                <div className={styles.section}>
                    <p className={styles.text}>Refunds may be considered in the following situations:</p>
                    
                    <h3 className={styles.sectionTitle} style={{ fontSize: '1.2rem', marginTop: '20px' }}>
                        a) Event Cancellation by Organizers
                    </h3>
                    <ul className={styles.list}>
                        <li>If the event is cancelled by the organizers due to unforeseen circumstances (e.g., natural disasters, government restrictions, safety concerns), participants will be eligible for a <span className={styles.strong}>full refund</span> of the registration fee.</li>
                        <li>Refunds will be processed within <span className={styles.strong}>14-21 business days</span> from the date of cancellation announcement.</li>
                        <li>Participants will be notified via email regarding the cancellation and refund process.</li>
                    </ul>

                    <h3 className={styles.sectionTitle} style={{ fontSize: '1.2rem', marginTop: '20px' }}>
                        b) Event Postponement
                    </h3>
                    <ul className={styles.list}>
                        <li>If the event is postponed to a new date, participants have the option to:
                            <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                                <li>Transfer their registration to the new event date at no additional cost.</li>
                                <li>Request a refund, subject to a processing fee (details below).</li>
                            </ul>
                        </li>
                        <li>Refund requests due to postponement must be submitted within <span className={styles.strong}>7 days</span> of the postponement announcement.</li>
                    </ul>

                    <h3 className={styles.sectionTitle} style={{ fontSize: '1.2rem', marginTop: '20px' }}>
                        c) Duplicate or Erroneous Payments
                    </h3>
                    <ul className={styles.list}>
                        <li>If you have been charged multiple times for the same registration due to a technical error, the duplicate amount will be refunded in full.</li>
                        <li>Please contact us at <a href="mailto:kgrunnersravulapalem@gmail.com" className={styles.link}>kgrunnersravulapalem@gmail.com</a> with proof of the duplicate transaction (e.g., payment receipts, bank statements).</li>
                    </ul>

                    <h3 className={styles.sectionTitle} style={{ fontSize: '1.2rem', marginTop: '20px' }}>
                        d) Medical Emergency or Injury
                    </h3>
                    <ul className={styles.list}>
                        <li>In case of a serious medical emergency or injury that prevents you from participating, you may request a refund by providing valid medical documentation (e.g., doctor&apos;s certificate, hospital records).</li>
                        <li>Refund requests must be submitted at least <span className={styles.strong}>7 days before the event</span>.</li>
                        <li>Such requests will be reviewed on a case-by-case basis, and a processing fee may apply.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>3. Non-Refundable Situations</h2>
                <div className={styles.section}>
                    <p className={styles.text}>Refunds will <span className={styles.strong}>NOT</span> be provided in the following cases:</p>
                    <ul className={styles.list}>
                        <li><span className={styles.strong}>Change of Mind:</span> If you decide not to participate after registration.</li>
                        <li><span className={styles.strong}>Inability to Attend:</span> Personal reasons, scheduling conflicts, or travel issues that prevent participation.</li>
                        <li><span className={styles.strong}>No-Show:</span> Failure to collect race kits or attend the event on the scheduled date.</li>
                        <li><span className={styles.strong}>Disqualification:</span> If you are disqualified for violating event rules or code of conduct.</li>
                        <li><span className={styles.strong}>Weather Conditions:</span> Minor weather changes that do not lead to event cancellation.</li>
                        <li><span className={styles.strong}>Late Registration:</span> If you miss the event registration deadline.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>4. Refund Processing Fee</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        In cases where refunds are approved (excluding event cancellation by organizers), a processing fee may be deducted:
                    </p>
                    <ul className={styles.list}>
                        <li><span className={styles.strong}>Refund Processing Fee:</span> Up to 10% of the registration fee or a flat fee (whichever is applicable), to cover administrative and payment gateway charges.</li>
                        <li>The net refund amount after deducting the processing fee will be credited to the original payment method.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>5. Refund Process & Timeline</h2>
                <div className={styles.section}>
                    <p className={styles.text}>If your refund request is approved:</p>
                    <ul className={styles.list}>
                        <li>Refunds will be processed to the <span className={styles.strong}>original payment method</span> (e.g., credit card, debit card, UPI).</li>
                        <li>Processing Time:
                            <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                                <li><span className={styles.strong}>Bank Transfer / UPI:</span> 7-14 business days</li>
                                <li><span className={styles.strong}>Credit/Debit Card:</span> 10-21 business days (depending on your bank)</li>
                            </ul>
                        </li>
                        <li>You will receive a confirmation email once the refund has been initiated.</li>
                    </ul>
                    <p className={styles.text}>
                        <span className={styles.strong}>Note:</span> The actual time for the refund to reflect in your account may vary based on your bank or payment provider&apos;s processing time.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>6. How to Request a Refund</h2>
                <div className={styles.section}>
                    <p className={styles.text}>To request a refund, please follow these steps:</p>
                    <ol className={styles.list}>
                        <li>Send an email to <a href="mailto:kgrunnersravulapalem@gmail.com" className={styles.link}>kgrunnersravulapalem@gmail.com</a> with the subject line: <span className={styles.strong}>&quot;Refund Request - [Your Full Name]&quot;</span></li>
                        <li>Include the following details in your email:
                            <ul style={{ marginLeft: '20px', marginTop: '10px' }}>
                                <li>Full Name (as registered)</li>
                                <li>Registration Number / Transaction ID</li>
                                <li>Reason for Refund Request</li>
                                <li>Supporting Documents (if applicable, e.g., medical certificate)</li>
                            </ul>
                        </li>
                        <li>Our team will review your request and respond within <span className={styles.strong}>5-7 business days</span>.</li>
                    </ol>
                </div>

                <h2 className={styles.sectionTitle}>7. Transfer of Registration</h2>
                <div className={styles.section}>
                    <ul className={styles.list}>
                        <li>Registration is <span className={styles.strong}>non-transferable</span> to another person.</li>
                        <li>You cannot transfer your slot to another participant or sell your registration.</li>
                        <li>Any attempt to transfer or misuse registration (e.g., using someone else&apos;s BIB) will result in immediate disqualification without a refund.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>8. Payment Gateway Failures</h2>
                <div className={styles.section}>
                    <ul className={styles.list}>
                        <li>If your payment fails but the amount is debited from your account, it will typically be auto-reversed by the payment gateway within <span className={styles.strong}>5-7 business days</span>.</li>
                        <li>If the amount is not refunded within this period, please contact us with your transaction details, and we will coordinate with the payment gateway to resolve the issue.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>9. Event Kit & Merchandise</h2>
                <div className={styles.section}>
                    <ul className={styles.list}>
                        <li>Event kits (BIB, timing chip, T-shirt, etc.) are part of the registration package and are <span className={styles.strong}>non-refundable</span>.</li>
                        <li>If you are unable to collect your event kit before the event, no refund will be issued.</li>
                        <li>Unclaimed kits will not be shipped or refunded post-event.</li>
                    </ul>
                </div>

                <h2 className={styles.sectionTitle}>10. Force Majeure</h2>
                <div className={styles.section}>
                    <p className={styles.text}>
                        In the event of circumstances beyond our control (natural disasters, pandemics, government orders, acts of terrorism, etc.) that result in event cancellation or postponement, we will make every effort to provide a fair resolution, which may include:
                    </p>
                    <ul className={styles.list}>
                        <li>Full or partial refunds</li>
                        <li>Transfer to a future event</li>
                        <li>Event credits or vouchers</li>
                    </ul>
                    <p className={styles.text}>
                        Participants will be notified via email about the resolution plan.
                    </p>
                </div>

                <h2 className={styles.sectionTitle}>11. Contact Us</h2>
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
