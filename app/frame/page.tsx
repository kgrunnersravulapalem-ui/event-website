import PageHero from '@/components/kg/PageHero';
import RaceFrame from '@/components/frame/RaceFrame';
import { edition2 } from '@/lib/edition2';
import { raceFrameEvent } from '@/lib/raceFrame/event';
import styles from './Frame.module.css';

// Race-day photo frame: runners make a card for the Konaseema Half Marathon
// to post or share. Event text, logos and colours live in lib/raceFrame/event.ts.
export default function FramePage() {
    return (
        <main className="kg kg-main">
            <PageHero
                label="Race day photo frame"
                title={<>Make your <span className={styles.gold}>race-day</span> card.</>}
                lede={
                    <>
                        Add a photo and your name, pick a frame, then post it or send it to your crew.
                        {` ${edition2.eventName} · ${edition2.raceDateLabel}, Ravulapalem.`}
                    </>
                }
            />
            <section className={`light ${styles.section}`}>
                <div className="wrap">
                    <RaceFrame event={raceFrameEvent} />
                </div>
            </section>
        </main>
    );
}
