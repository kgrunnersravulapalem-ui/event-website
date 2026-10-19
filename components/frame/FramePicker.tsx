'use client';

import { useEffect, useRef } from 'react';
import { DESIGNS, getLayout, renderCard } from '@/lib/raceFrame/designs/index.js';
import type { CardData, CardDesign, CardLayout, CardTheme, DesignKey, FormatKey } from '@/lib/raceFrame/types';
import styles from './RaceFrame.module.css';

const THUMB_WIDTH = 240;

type ThumbProps = {
    design: CardDesign;
    layout: CardLayout;
    theme: CardTheme;
    data: CardData;
    fontsReady: boolean;
};

/** Live thumbnail of a design with the runner's own photo and details. */
function Thumb({ design, layout, theme, data, fontsReady }: ThumbProps) {
    const ref = useRef<HTMLCanvasElement>(null);
    const scale = THUMB_WIDTH / layout.width;

    useEffect(() => {
        const ctx = ref.current?.getContext('2d');
        if (!fontsReady || !ctx) return;
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        renderCard(ctx, design, layout, theme, data);
    }, [design, layout, theme, data, fontsReady, scale]);

    return (
        <canvas
            ref={ref}
            className={styles.thumb}
            width={THUMB_WIDTH}
            height={Math.round(layout.height * scale)}
            aria-hidden="true"
        />
    );
}

type FramePickerProps = {
    frames: DesignKey[];
    value: DesignKey;
    onChange: (key: DesignKey) => void;
    formatKey: FormatKey;
    theme: CardTheme;
    data: CardData;
    fontsReady: boolean;
};

/** The frame choices, each previewed with the runner's card as it is now. */
export default function FramePicker({ frames, value, onChange, formatKey, theme, data, fontsReady }: FramePickerProps) {
    return (
        <fieldset className={styles.field}>
            <legend className={styles.fieldLabel}>Frame</legend>
            <div className={styles.frames}>
                {frames.map((key) => (
                    <button key={key} type="button" className={styles.frameOption} aria-pressed={key === value} onClick={() => onChange(key)}>
                        <Thumb
                            design={DESIGNS[key]}
                            layout={getLayout(key, formatKey)}
                            theme={theme}
                            data={data}
                            fontsReady={fontsReady}
                        />
                        {DESIGNS[key].label}
                    </button>
                ))}
            </div>
        </fieldset>
    );
}
