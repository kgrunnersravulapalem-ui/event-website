import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Register Now',
    description: 'Secure your spot for KONASEEMA RUN 2026. Register for 3K, 5K, or 10K categories. Limited spots available, sign up today!',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
