import type { CSSProperties, ReactNode } from 'react';
import styles from './RaceFrame.module.css';

type SegmentedProps<T extends string> = {
    label: string;
    options: { value: T; label: ReactNode }[];
    value: T;
    onChange: (value: T) => void;
    /** Buttons per row; defaults to one row with every option. */
    columns?: number;
};

/** A row (or grid) of toggle buttons where exactly one is selected. */
export default function Segmented<T extends string>({ label, options, value, onChange, columns = options.length }: SegmentedProps<T>) {
    return (
        <fieldset className={styles.field}>
            <legend className={styles.fieldLabel}>{label}</legend>
            <div className={styles.segmented} style={{ '--count': columns } as CSSProperties}>
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        type="button"
                        className={styles.segment}
                        aria-pressed={opt.value === value}
                        onClick={() => onChange(opt.value)}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </fieldset>
    );
}
