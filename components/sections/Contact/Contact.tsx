'use client';
import { useState } from 'react';
import { eventConfig } from '@/lib/eventConfig';
import RunnerFigure from '@/components/kg/RunnerFigure';

const fmtPhone = (p: string) => `+91 ${p.slice(0, 5)} ${p.slice(5)}`;

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

    const { contact } = eventConfig;

    return (
        <section className="sec light" id="contact-form">
            <div className="wrap contact-grid">
                <div className="stack">
                    <div className="split mono">Reach the organisers</div>
                    <h2 className="disp" style={{ fontSize: 'clamp(34px,4.2vw,60px)' }}>We’re here to help.</h2>
                    <p className="lede" style={{ color: '#3B4A36' }}>
                        Questions about registration, the route, race day or sponsorship? Send us a message or reach us directly.
                    </p>
                    <div className="contact-list">
                        <div><span className="mono">Organisation</span><span>KG Runners · Konaseema Godavari Runners Association</span></div>
                        <div><span className="mono">Email</span><a href={`mailto:${contact.email}`}>{contact.email}</a></div>
                        <div>
                            <span className="mono">Phone</span>
                            <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {contact.phones.map((p) => <a key={p} href={`tel:+91${p}`}>{fmtPhone(p)}</a>)}
                            </span>
                        </div>
                        <div>
                            <span className="mono">Location</span>
                            <span>
                                {contact.location.line1}<br />{contact.location.line2}<br />
                                <a href={contact.location.mapLink} target="_blank" rel="noopener noreferrer">Open in Google Maps →</a>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="form-card">
                    {submitted ? (
                        <div className="form-done" role="status">
                            <div className="run"><RunnerFigure /></div>
                            <h3 className="disp" style={{ fontSize: 32 }}>Message sent!</h3>
                            <p style={{ margin: 0, color: '#3B4A36' }}>We will get back to you shortly.</p>
                            <button type="button" className="btn btn-ink" onClick={() => setSubmitted(false)}>Send another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <div className="form-row">
                                <div className="field">
                                    <label className="mono" htmlFor="c-name">Name</label>
                                    <input id="c-name" name="name" placeholder="Your name" autoComplete="name" required />
                                </div>
                                <div className="field">
                                    <label className="mono" htmlFor="c-email">Email</label>
                                    <input id="c-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
                                </div>
                            </div>
                            <div className="field">
                                <label className="mono" htmlFor="c-subject">Subject</label>
                                <input id="c-subject" name="subject" placeholder="How can we help?" required />
                            </div>
                            <div className="field">
                                <label className="mono" htmlFor="c-message">Message</label>
                                <textarea id="c-message" name="message" placeholder="Write your message here…" rows={5} required />
                            </div>
                            {error && <p className="form-error" role="alert">{error}</p>}
                            <button type="submit" className="btn btn-ink" disabled={loading} style={{ minHeight: 54, fontSize: 16 }}>
                                {loading ? (<><span className="spin" aria-hidden="true" /> Sending…</>) : 'Send message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Contact;
