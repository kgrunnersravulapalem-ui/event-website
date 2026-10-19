import type { CardTheme } from '@/lib/raceFrame/types';
import styles from './RaceFrame.module.css';

type StylePickerProps = {
    themes: Record<string, CardTheme>;
    value: string;
    onChange: (key: string) => void;
};

/** Colour options, each shown as a swatch of its background and accent colours. */
export default function StylePicker({ themes, value, onChange }: StylePickerProps) {
    return (
        <fieldset className={styles.field}>
            <legend className={styles.fieldLabel}>Colour</legend>
            <div className={styles.swatches}>
                {Object.entries(themes).map(([key, t]) => (
                    <button key={key} type="button" className={styles.swatch} aria-pressed={key === value} onClick={() => onChange(key)}>
                        <span
                            className={styles.swatchDot}
                            // Each swatch previews its own colours.
                            style={{ background: t.field, boxShadow: `inset 0 0 0 5px ${t.field}, inset 0 0 0 10px ${t.fieldAccent}` }}
                            aria-hidden="true"
                        />
                        {t.label}
                    </button>
                ))}
            </div>
        </fieldset>
    );
}
