
import GalleryPlaceholder from "@/components/sections/Gallery/GalleryPlaceholder";

export default function GalleryPage() {
    return (
        <div style={{ paddingTop: '4rem' }}>
            <header style={{
                backgroundColor: 'var(--surface)',
                padding: '4rem 1.5rem',
                textAlign: 'center',
                marginBottom: '2rem'
            }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--foreground)' }}>Event Gallery</h1>
                <p style={{ color: '#64748b' }}>Relive the moments.</p>
            </header>
            <GalleryPlaceholder />
        </div>
    );
}
