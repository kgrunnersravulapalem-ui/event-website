'use client';
import styles from './Contact.module.css';
import Button from '@/components/ui/Button/Button';
import Input from '@/components/ui/Input/Input';
import { useState } from 'react';
import { eventConfig } from '@/lib/eventConfig';

const Contact = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message'),
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSubmitted(true);
            } else {
                throw new Error(result.error || 'Failed to send message');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles.section} id="contact">
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.info}>
                        <h2>{eventConfig.contact.heading}</h2>
                        <p className={styles.description}>
                            {eventConfig.contact.description}
                        </p>

                        <div className={styles.details}>
                            <div className={styles.detailItem}>
                                <strong>Email</strong>
                                <p>{eventConfig.contact.email}</p>
                            </div>
                            <div className={styles.detailItem}>
                                <strong>Contact</strong>
                                {eventConfig.contact.phones.map((phone, index) => (
                                    <p key={index}>{phone}</p>
                                ))}
                            </div>
                            <div className={styles.detailItem}>
                                <strong>Location</strong>
                                <p>
                                    {eventConfig.contact.location.line1}<br />
                                    {eventConfig.contact.location.line2}
                                </p>
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
                                    <Input name="name" label="Name" placeholder="Your Name" required />
                                    <Input name="email" label="Email" type="email" placeholder="john@example.com" required />
                                </div>
                                <Input name="subject" label="Subject" placeholder="How can we help?" required />

                                <div className={styles.textareaWrapper}>
                                    <label className={styles.label}>Message</label>
                                    <textarea
                                        name="message"
                                        className={styles.textarea}
                                        placeholder="Write your message here..."
                                        rows={5}
                                        required
                                    ></textarea>
                                </div>

                                {error && <p className={styles.error}>{error}</p>}
                                <Button type="submit" fullWidth disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Message'}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
