// Content for the Edition 02 homepage (Konaseema Half Marathon 2027).
// Values set to null show "To be announced" on the site — fill them in as they are confirmed.

export type RaceCategory = {
    id: 'r3' | 'r5' | 'r10' | 'r21';
    distance: string;
    name: string;            // race name, e.g. 'Jawan Run'
    timed: boolean;
    title: string;
    desc: string;
    color: string;           // bib / category colour
    fee: number | null;      // regular entry fee (₹)
    earlyBird: number | null; // early-bird fee (₹)
};

// One prize category in a race, e.g. 10K Masters. Amounts are 1st, 2nd and 3rd (₹).
export type PrizeGroup = {
    group: string;
    criteria?: string;            // who qualifies, e.g. dates of birth
    men: [number, number, number];
    women: [number, number, number];
    labels?: [string, string];    // row labels; default ['Male', 'Female']
};

export type RacePrizes = {
    id: RaceCategory['id'];
    pool: number;                 // the race's prize money as printed on the prize list (₹)
    note?: string;                // shown under the race heading
    groups: PrizeGroup[];
};

const p = (a: number, b: number, c: number): [number, number, number] => [a, b, c];

// Edition 02 prize list, exactly as printed on the official prize poster
// (public/images/edition2-prize-list.jpg): names, dates, amounts and totals.
// Keep it matching the poster when the poster changes.
const prizes: RacePrizes[] = [
    {
        id: 'r21',
        pool: 36000,
        groups: [{ group: 'Open', men: p(7000, 6000, 5000), women: p(7000, 6000, 5000) }],
    },
    {
        id: 'r10',
        pool: 84000,
        groups: [
            { group: 'Fastest', men: p(4000, 3500, 3000), women: p(4000, 3500, 3000) },
            { group: 'Upto 18 Yrs > Youth', criteria: 'ON or AFTER 01-02-2008', men: p(3000, 2500, 2000), women: p(3000, 2500, 2000) },
            { group: '19-40 Yrs > Masters', criteria: '01-02-1986 to 31-01-2008', men: p(3000, 2500, 2000), women: p(3000, 2500, 2000) },
            { group: '41-55 Yrs > Veteran', criteria: '01-02-1971 to 31-01-1986', men: p(3000, 2500, 2000), women: p(3000, 2500, 2000) },
            { group: '56+ > Senior Veteran', criteria: 'ON or BEFORE 31-01-1971', men: p(3000, 2500, 2000), women: p(3000, 2500, 2000) },
        ],
    },
    {
        id: 'r5',
        pool: 79000,
        note: 'Local only (Konaseema Dist)',
        groups: [
            { group: 'Fastest', men: p(3500, 3000, 2500), women: p(3500, 3000, 2500) },
            { group: 'Upto 14Yrs > High school', criteria: 'ON or AFTER 01-02-2012', men: p(2500, 2000, 1500), women: p(2500, 2000, 1500) },
            { group: '15 - 25 Yrs > Youth', criteria: '01-02-2001 to 31-01-2012', men: p(2500, 2000, 1500), women: p(2500, 2000, 1500) },
            { group: '26-40 Yrs > Masters', criteria: '01-02-1986 to 31-01-2001', men: p(2500, 2000, 1500), women: p(2500, 2000, 1500) },
            { group: '41-55 Yrs > Veteran', criteria: '01-02-1971 to 31-01-1986', men: p(2500, 2000, 1500), women: p(2500, 2000, 1500) },
            { group: '56+ > Senior Veteran', criteria: 'ON or BEFORE 31-01-1971', men: p(2500, 2000, 1500), women: p(2500, 2000, 1500) },
        ],
    },
    {
        id: 'r3',
        pool: 9000,
        groups: [{ group: 'Upto 10Yrs > Pr.School', men: p(2000, 1500, 1000), women: p(2000, 1500, 1000), labels: ['Male', 'Girls'] }],
    },
];

export const edition2 = {
    eventName: 'Konaseema Half Marathon',
    edition: '2nd Edition',
    tagline: 'First-ever Half Marathon in Konaseema District',
    raceDateLabel: '31 Jan 2027',
    raceDateLong: 'Sunday, 31 January 2027',
    // Countdown target (IST). Update if the flag-off time changes.
    flagOffISO: '2027-01-31T05:30:00+05:30',
    flagOffTime: null as string | null, // e.g. '5:30 AM'
    startVenue: null as string | null, // e.g. 'Sri Potamsetti Rami Reddy Park'
    town: 'Ravulapalem, Konaseema District',
    bibExpo: null as string | null,
    registrationOpen: false,
    registrationOpensLabel: 'soon', // e.g. '1 Nov 2026'
    registerHref: '/register',
    mapsLink: 'https://maps.app.goo.gl/pKamaAwknD7Vigva8',
    youtubeId: '5W7dELeWMwo',
    poster: '/images/edition2-poster.jpg',
    poweredBy: 'Konaseema Godavari Runners Association – Ravulapalem',
    // As printed on the prize list.
    prizeMoney: 204000,
    prizeMoneyLabel: '₹2.04 Lakh',
    prizeCount: 78,
    prizes,
    prizeList: '/images/edition2-prize-list.jpg',
    // Shown with the prize list.
    prizeProofNote: 'Age proof and District residential proof are compulsory.',
    earlyBirdLastDate: '30 Nov 2026',
    earlyBirdShort: '30 Nov',

    causes: [
        'Jai Jawan Jai Kisan',
        'Health is Wealth',
        'Say Yes to Life, No to Drugs',
        'I’m Plastic Free',
        'Always Happy & Healthy',
    ],

    // Colours: 3K pink, 5K blue, 10K red, 21.1K green
    categories: [
        { id: 'r21', distance: '21.1', name: 'Jawan Run', timed: true, title: 'The headline race', desc: 'Konaseema’s first-ever half marathon. 21.1 km for runners ready to go the distance.', color: '#15803D', fee: 850, earlyBird: 700 },
        { id: 'r10', distance: '10', name: 'Kisan Run', timed: true, title: 'The long game', desc: 'A challenging middle-distance race for runners who like to dig deep.', color: '#C62828', fee: 650, earlyBird: 500 },
        { id: 'r5', distance: '5', name: 'Arthur Cotton Run', timed: true, title: 'The classic', desc: 'Fast, scenic and exhilarating. The distance everyone loves.', color: '#2563C9', fee: 550, earlyBird: 400 },
        { id: 'r3', distance: '3', name: 'Fun Run', timed: false, title: 'The first step', desc: 'Short and sweet, made for beginners, families and first-timers.', color: '#C8326E', fee: 400, earlyBird: 300 },
    ] as RaceCategory[],

    contact: {
        email: 'kgrunnersravulapalem@gmail.com',
        phones: ['9494847967', '9849129557'],
    },
};

export const TBA = 'To be announced';
