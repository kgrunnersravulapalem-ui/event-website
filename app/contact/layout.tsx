import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with the KONASEEMA RUN 2026 team. Contact us for registrations, sponsorships, or any other queries regarding the marathon.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
