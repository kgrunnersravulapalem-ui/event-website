import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Prizes & Benefits',
    description: 'Konaseema Half Marathon 2027 prize list: Rs 2.04 Lakh across 78 prizes for the 21.1K Jawan Run, 10K Kisan Run, 5K Arthur Cotton Run and 3K Fun Run, men and women in every age category.',
};

export default function PrizesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
