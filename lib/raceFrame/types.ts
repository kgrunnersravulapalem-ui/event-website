// Types shared by the race-frame components. The drawing code in this folder is
// plain JS (kept in step with the standalone RaceFrame app); these describe the
// data the React components pass into it.

/** Colours for one colour option. See themes.js for what each field colours. */
export type CardTheme = {
    label: string;
    paper: string;
    ink: string;
    muted: string;
    stripe: string;
    stripeText: string;
    number: string;
    field: string;
    fieldText: string;
    fieldAccent: string;
    logoChip?: string;
    medal: { ribbon: string; ribbonStripe: string; plaqueText: string };
    empty: string[];
};

export type DesignKey = 'bib' | 'medal' | 'finish' | 'poster';
export type FormatKey = 'square' | 'story';

/** An event after defineEvent() has filled in its defaults. */
export type RaceFrameEvent = {
    name: string;
    title: string;
    year: string;
    subtitle: string;
    details: string;
    date: string;
    website: string;
    websiteLabel: string;
    distances: string[];
    headlines: string[];
    themes: Record<string, CardTheme>;
    frames: DesignKey[];
    accent: string;
    downloadName: string;
    /** Image URLs: eventLogo, organizerLogo, and the optional sponsorLogo and background. */
    assets: Partial<Record<AssetKey, string>>;
};

export type AssetKey = 'eventLogo' | 'organizerLogo' | 'sponsorLogo' | 'background';

/** Loaded (and trimmed) images, ready to draw. */
export type CardAssets = Partial<Record<AssetKey, HTMLImageElement | HTMLCanvasElement>>;

/** The runner's photo and how it sits in the frame: zoom >= 1, pan 0..1 per axis. */
export type PhotoState = {
    image: HTMLImageElement;
    zoom: number;
    panX: number;
    panY: number;
};

export type PhotoUpdater = (update: (photo: PhotoState) => PhotoState) => void;

/** Everything a frame draws. */
export type CardData = {
    photo: PhotoState | null;
    name: string;
    distance: string;
    headline: string;
    assets: CardAssets;
    event: RaceFrameEvent;
};

/** A design's layout for one format: canvas size plus the design's own numbers. */
export type CardLayout = { width: number; height: number } & Record<string, unknown>;

/** One frame design (see designs/). */
export type CardDesign = {
    label: string;
    photoFrame: (layout: CardLayout) => { x: number; y: number; w: number; h: number };
};
