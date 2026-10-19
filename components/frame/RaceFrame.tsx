'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { CARD_FONTS } from '@/lib/raceFrame/canvas.js';
import { DESIGNS, FORMAT_ORDER, FORMATS, getLayout, renderCardForExport } from '@/lib/raceFrame/designs/index.js';
import { canvasToBlob, EXPORT_TYPE, loadAssets, loadImage } from '@/lib/raceFrame/images.js';
import type { CardAssets, CardData, DesignKey, FormatKey, PhotoState, PhotoUpdater, RaceFrameEvent } from '@/lib/raceFrame/types';
import CardCanvas from './CardCanvas';
import FramePicker from './FramePicker';
import PhotoAdjust from './PhotoAdjust';
import Segmented from './Segmented';
import StylePicker from './StylePicker';
import styles from './RaceFrame.module.css';

const FORMAT_OPTIONS = (FORMAT_ORDER as FormatKey[]).map((value) => ({
    value,
    label: (
        <>
            <span className={`${styles.ratioIcon} ${value === 'square' ? styles.ratioSquare : styles.ratioStory}`} aria-hidden="true" />
            {FORMATS[value].label} <span className={styles.muted}>{FORMATS[value].ratio}</span>
        </>
    ),
}));
const DEFAULT_ADJUST = { zoom: 1, panX: 0.5, panY: 0.5 };

// Whether this browser can hand an image to the phone's share sheet.
function canShareFiles() {
    try {
        return Boolean(navigator.canShare?.({ files: [new File([''], 'card.jpg', { type: EXPORT_TYPE.mime })] }));
    } catch {
        return false;
    }
}

function downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function formatList(items: string[]) {
    return items.length < 2 ? items.join('') : `${items.slice(0, -1).join(', ')} and ${items.at(-1)}`;
}

/**
 * Race-day photo card maker: the runner adds a photo, name and distance, picks a
 * frame, colour and size, then downloads or shares the card. Cards are drawn on
 * a canvas, so the download matches the preview exactly. The photo never leaves
 * the runner's device.
 */
export default function RaceFrame({ event }: { event: RaceFrameEvent }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const photoUrlRef = useRef<string | null>(null);

    const [designKey, setDesignKey] = useState<DesignKey>(() => event.frames[0]);
    const [themeKey, setThemeKey] = useState(() => Object.keys(event.themes)[0]);
    const [formatKey, setFormatKey] = useState<FormatKey>('square');
    const [photo, setPhoto] = useState<PhotoState | null>(null);
    const [name, setName] = useState('');
    const [distance, setDistance] = useState(event.distances[0]);
    const [headline, setHeadline] = useState(event.headlines[0]);
    const [assets, setAssets] = useState<CardAssets>({});
    const [fontsReady, setFontsReady] = useState(false);
    const [shareable, setShareable] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        Promise.all(CARD_FONTS.map((f: string) => document.fonts.load(f))).finally(() => setFontsReady(true));
        setShareable(canShareFiles());
        return () => {
            if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
        };
    }, []);

    useEffect(() => {
        loadAssets(event.assets).then(setAssets);
    }, [event]);

    const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        const url = URL.createObjectURL(file);
        const image = await loadImage(url);
        if (!image) {
            URL.revokeObjectURL(url);
            setError("That file couldn't be opened. Choose a JPG or PNG photo.");
            return;
        }
        if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
        photoUrlRef.current = url;
        setError('');
        setPhoto({ image, ...DEFAULT_ADJUST });
    };

    const updatePhoto: PhotoUpdater = useCallback((updater) => setPhoto((p) => (p ? updater(p) : p)), []);
    const resetPhoto = () => updatePhoto((p) => ({ ...p, ...DEFAULT_ADJUST }));

    const fillHeadline = (h: string) => h.replace('{distance}', distance);
    const headlineOptions = event.headlines.map((h) => ({ value: h, label: fillHeadline(h) }));
    const distanceOptions = event.distances.map((d) => ({ value: d, label: d }));
    const theme = event.themes[themeKey];
    const headlineText = fillHeadline(headline);
    const cardData: CardData = useMemo(
        () => ({ photo, name, distance, headline: headlineText, assets, event }),
        [photo, name, distance, headlineText, assets, event],
    );

    const missing = [!photo && 'photo', !name.trim() && 'name'].filter((m): m is string => Boolean(m));
    const ready = missing.length === 0;
    const filename = `${event.downloadName}-${designKey}-${formatKey}.${EXPORT_TYPE.extension}`;

    const handleExport = async (mode: 'download' | 'share') => {
        setBusy(true);
        setError('');
        try {
            const card = renderCardForExport(DESIGNS[designKey], getLayout(designKey, formatKey), theme, cardData);
            const blob = await canvasToBlob(card);
            if (mode === 'share') {
                const file = new File([blob], filename, { type: EXPORT_TYPE.mime });
                try {
                    await navigator.share({ files: [file], title: event.title });
                } catch (err) {
                    if (err instanceof Error && err.name === 'AbortError') return;
                    downloadBlob(blob, filename);
                }
            } else {
                downloadBlob(blob, filename);
            }
        } catch {
            setError("The image couldn't be created. Try again.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className={styles.shell}>
            <div className={styles.stage}>
                <CardCanvas
                    ref={canvasRef}
                    design={DESIGNS[designKey]}
                    layout={getLayout(designKey, formatKey)}
                    theme={theme}
                    event={event}
                    photo={photo}
                    name={name}
                    distance={distance}
                    headline={headlineText}
                    assets={assets}
                    fontsReady={fontsReady}
                    onPhotoChange={updatePhoto}
                />
            </div>

            <div className={styles.steps}>
                <Step n={1} title="Your photo">
                    <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
                    <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => fileRef.current?.click()}>
                        <UploadIcon />
                        {photo ? 'Change photo' : 'Choose photo'}
                    </button>
                    {photo ? (
                        <PhotoAdjust photo={photo} onChange={updatePhoto} onReset={resetPhoto} />
                    ) : (
                        <p className={styles.hint}>A clear, upright photo of you works best. It stays on your device.</p>
                    )}
                </Step>

                <Step n={2} title="Your details">
                    <TextField label="Name" value={name} onChange={setName} maxLength={24} autoComplete="given-name" />
                    <Segmented label="Distance" options={distanceOptions} value={distance} onChange={setDistance} />
                </Step>

                <Step n={3} title="Look">
                    <Segmented label="Headline" options={headlineOptions} value={headline} onChange={setHeadline} columns={2} />
                    <FramePicker
                        value={designKey}
                        onChange={setDesignKey}
                        frames={event.frames}
                        formatKey={formatKey}
                        theme={theme}
                        data={cardData}
                        fontsReady={fontsReady}
                    />
                    <StylePicker themes={event.themes} value={themeKey} onChange={setThemeKey} />
                    <Segmented label="Size" options={FORMAT_OPTIONS} value={formatKey} onChange={setFormatKey} />
                </Step>

                <Step n={4} title="Save it">
                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={`${styles.btn} ${styles.btnPrimary}`}
                            disabled={!ready || busy}
                            onClick={() => handleExport('download')}
                        >
                            Download image
                        </button>
                        {shareable && (
                            <button
                                type="button"
                                className={`${styles.btn} ${styles.btnSecondary}`}
                                disabled={!ready || busy}
                                onClick={() => handleExport('share')}
                            >
                                Share
                            </button>
                        )}
                    </div>
                    {!ready && <p className={styles.hint}>Add your {formatList(missing)} to save your card.</p>}
                    {error && (
                        <p className={styles.error} role="alert">
                            {error}
                        </p>
                    )}
                </Step>
            </div>
        </div>
    );
}

/** A numbered step with a heading. */
function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
    return (
        <section className={styles.step} aria-labelledby={`frame-step-${n}`}>
            <h2 id={`frame-step-${n}`} className={styles.stepTitle}>
                <span className={styles.stepNum} aria-hidden="true">
                    {n}
                </span>
                {title}
            </h2>
            <div className={styles.stepBody}>{children}</div>
        </section>
    );
}

type TextFieldProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    maxLength?: number;
    autoComplete?: string;
};

function TextField({ label, value, onChange, ...props }: TextFieldProps) {
    return (
        <label className={styles.field}>
            <span className={styles.fieldLabel}>{label}</span>
            <input className={styles.input} value={value} onChange={(e) => onChange(e.target.value)} {...props} />
        </label>
    );
}

function UploadIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 15V3M7 8l5-5 5 5M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
        </svg>
    );
}
