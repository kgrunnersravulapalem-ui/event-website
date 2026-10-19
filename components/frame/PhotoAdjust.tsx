import { MAX_ZOOM, MIN_ZOOM } from './CardCanvas';
import type { PhotoState, PhotoUpdater } from '@/lib/raceFrame/types';
import styles from './RaceFrame.module.css';

const SLIDERS = [
    { key: 'zoom', label: 'Zoom', min: MIN_ZOOM, max: MAX_ZOOM, step: 0.01 },
    { key: 'panX', label: 'Left and right', min: 0, max: 1, step: 0.005 },
    { key: 'panY', label: 'Up and down', min: 0, max: 1, step: 0.005 },
] as const;

type PhotoAdjustProps = {
    photo: PhotoState;
    onChange: PhotoUpdater;
    onReset: () => void;
};

/** Sliders for zooming and moving the photo, for anyone who'd rather not drag. */
export default function PhotoAdjust({ photo, onChange, onReset }: PhotoAdjustProps) {
    return (
        <div className={styles.adjust}>
            <p className={styles.hint}>Drag the photo on the card to move it. Pinch, scroll or use the sliders to zoom.</p>
            {SLIDERS.map((s) => (
                <label key={s.key} className={styles.sliderRow}>
                    <span>{s.label}</span>
                    <input
                        type="range"
                        min={s.min}
                        max={s.max}
                        step={s.step}
                        value={photo[s.key]}
                        onChange={(e) => onChange((p) => ({ ...p, [s.key]: Number(e.target.value) }))}
                    />
                </label>
            ))}
            <button type="button" className={styles.linkBtn} onClick={onReset}>
                Reset position
            </button>
        </div>
    );
}
