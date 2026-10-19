import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Race Day Photo Frame',
    description:
        'Make your Konaseema Half Marathon 2027 race-day card: add your photo, name and distance, pick a frame, then download or share it.',
};

export default function FrameLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
