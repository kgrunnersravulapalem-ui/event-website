
import Contact from "@/components/sections/Contact/Contact";
import { eventConfig } from "@/lib/eventConfig";

export default function ContactPage() {
    return (
        <div style={{ paddingTop: '4rem' }}>
            <header style={{
                backgroundColor: 'var(--surface)',
                padding: '4rem 1.5rem',
                textAlign: 'center',
            }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--foreground)' }}>{eventConfig.contact.title}</h1>
                <p style={{ color: '#64748b' }}>{eventConfig.contact.subtitle}</p>
            </header>
            <Contact />
        </div>
    );
}

