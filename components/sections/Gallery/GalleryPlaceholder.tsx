
import styles from './GalleryPlaceholder.module.css';
import Link from 'next/link';

const GalleryPlaceholder = () => {
    return (
        <section className={styles.section} id="gallery">
            <div className={styles.container}>
                <h2 className={styles.title}>Gallery</h2>
                <p className={styles.subtitle}>Moments from our previous runs.</p>

                <div className={styles.placeholderBox}>
                    <p>Image Gallery will appear here once images are uploaded.</p>
                    <br />
                    <small className={styles.devNote}>
                        Developers: Upload images at <Link href="/admin" className={styles.link}>/admin</Link>
                    </small>
                </div>
            </div>
        </section>
    );
};

export default GalleryPlaceholder;
