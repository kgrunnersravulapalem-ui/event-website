'use client';
import styles from './Contact.module.css';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import { useState } from 'react';

const Contact = () => {
    // Add logic to handle form submission if needed
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        // Integrate with firebase or API route later
    }

    return (
        <section className={styles.section} id="contact">
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.info}>
                        <h2>Get in Touch</h2>
                        <p className={styles.description}>
                            Have questions about registration, the route, or sponsorship?
                            We're here to help.
                        </p>

                        <div className={styles.details}>
                            <div className={styles.detailItem}>
                                <strong>Email</strong>
                                <p>support@runevent.com</p>
                            </div>
                            <div className={styles.detailItem}>
                                <strong>Location</strong>
                                <p>Beach Road, City Center<br />Vizag, India</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formdWrapper}>
                        {submitted ? (
                            <div className={styles.successMessage}>
                                <h3>Message Sent!</h3>
                                <p>We will get back to you shortly.</p>
                                <Button onClick={() => setSubmitted(false)} variant="outline">Send Another</Button>
                            </div>
                        ) : (
                            <form className={styles.form} onSubmit={handleSubmit}>
                                <div className={styles.row}>
                                    <Input label="Name" placeholder="Your Name" required />
                                    <Input label="Email" type="email" placeholder="john@example.com" required />
                                </div>
                                <Input label="Subject" placeholder="How can we help?" required />

                                <div className={styles.textareaWrapper}>
                                    <label className={styles.label}>Message</label>
                                    <textarea className={styles.textarea} placeholder="Write your message here..." rows={5} required></textarea>
                                </div>

                                <Button type="submit" fullWidth>Send Message</Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
