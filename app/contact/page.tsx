
import Contact from "@/components/sections/Contact/Contact";

export default function ContactPage() {
    return (
        <div style={{ paddingTop: '4rem' }}>
            <header style={{
                backgroundColor: 'var(--surface)',
                padding: '4rem 1.5rem',
                textAlign: 'center',
            }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--foreground)' }}>Contact Us</h1>
                <p style={{ color: '#64748b' }}>We'd love to hear from you.</p>
            </header>
            <Contact />
        </div>
    );
}
