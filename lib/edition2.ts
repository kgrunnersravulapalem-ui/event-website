// Content for the Edition 02 homepage (Konaseema Half Marathon 2027).
// Values set to null show "To be announced" on the site — fill them in as they are confirmed.

export type RaceCategory = {
    id: 'r3' | 'r5' | 'r10' | 'r21';
    distance: string;
    timed: boolean;
    title: string;
    desc: string;
    fee: number | null;
};

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

    causes: [
        'Jai Jawan Jai Kisan',
        'Health is Wealth',
        'Say Yes to Life, No to Drugs',
        'I’m Plastic Free',
        'Always Happy & Healthy',
    ],

    categories: [
        { id: 'r21', distance: '21.1', timed: true, title: 'The headline race', desc: 'Konaseema’s first-ever half marathon. 21.1 km for runners ready to go the distance.', fee: null },
        { id: 'r10', distance: '10', timed: true, title: 'The long game', desc: 'A challenging middle-distance race for runners who like to dig deep.', fee: null },
        { id: 'r5', distance: '5', timed: true, title: 'The classic', desc: 'Fast, scenic and exhilarating. The distance everyone loves.', fee: null },
        { id: 'r3', distance: '3', timed: false, title: 'The first step', desc: 'Short and sweet, made for beginners, families and first-timers.', fee: null },
    ] as RaceCategory[],

    contact: {
        email: 'kgrunnersravulapalem@gmail.com',
        phones: ['9494847967', '9849129557'],
    },
};

export const TBA = 'To be announced';
