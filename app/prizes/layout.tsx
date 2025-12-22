import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Prizes & Benefits',
    description: 'Check out the prize money distribution for KONASEEMA RUN 2026. Top prizes for 10K and 5K categories in both Male and Female divisions.',
};

export default function PrizesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
