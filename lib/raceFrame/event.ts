import { edition2 } from '@/lib/edition2';
import { defineEvent } from './defineEvent.js';
import type { RaceFrameEvent } from './types';

// Race-frame settings for the Konaseema Half Marathon (Edition 02).
// Dates, distances, headlines and the registration call to action come from
// lib/edition2.ts, so cards stay in step with the rest of the site.
// See lib/raceFrame/README.md for what each option does.

// "Sun" from the flag-off time, read in IST so it's the same everywhere.
const weekday = new Date(edition2.flagOffISO).toLocaleDateString('en-IN', {
    weekday: 'short',
    timeZone: 'Asia/Kolkata',
});

// Distance label on the card ("21.1K") for each race category.
const distanceLabel = (distance: string) => `${distance}K`;

export const raceFrameEvent: RaceFrameEvent = defineEvent({
    name: edition2.eventName,
    // Shown after the name: "Konaseema Half Marathon 2027".
    year: edition2.flagOffISO.slice(0, 4),
    // Short line shown next to the event name.
    subtitle: edition2.edition,
    details: `${weekday} ${edition2.raceDateLabel}, Ravulapalem`,
    date: edition2.flagOffISO.slice(0, 10),
    website: 'kgrunners.in',
    // Switches to "Register at" automatically once edition2.registrationOpen is true.
    websiteLabel: edition2.registrationOpen ? 'Register at' : 'More at',
    // Longest race first, so the half marathon is preselected.
    distances: edition2.categories.map((c) => distanceLabel(c.distance)),
    // The Edition 02 causes are the headline options; the first is preselected.
    headlines: edition2.causes,
    // Logos are trimmed of their white margins when loaded. Add `sponsorLogo`
    // here to show a "Powered by" logo on every frame.
    assets: {
        eventLogo: edition2.poster,
        organizerLogo: '/images/logo.png',
    },
    // Accent for the page itself: the site's gold.
    accent: '#f4b400',
    downloadName: 'konaseema-half-marathon',

    // Colour options: the same four as the Palakollu 10K Run frames.
    // See lib/raceFrame/themes.js for what each field colours.
    themes: {
        sunrise: {
            label: 'Sunrise',
            paper: '#ffffff',
            ink: '#1d2340',
            muted: '#6b7687',
            stripe: '#f15a24',
            stripeText: '#ffffff',
            number: '#1d2340',
            field: '#1d2340',
            fieldText: '#fff4ec',
            fieldAccent: '#ff7a3d',
            medal: { ribbon: '#f15a24', ribbonStripe: '#fff4ec', plaqueText: '#ffffff' },
            empty: ['#ffc36b', '#f15a24'],
        },
        delta: {
            label: 'Delta',
            paper: '#ffffff',
            ink: '#0a2f63',
            muted: '#5f7189',
            stripe: '#0a4ea3',
            stripeText: '#ffffff',
            number: '#0a2f63',
            field: '#0a2f63',
            fieldText: '#ffffff',
            fieldAccent: '#3cc3ee',
            medal: { ribbon: '#3cc3ee', ribbonStripe: '#ffffff', plaqueText: '#0a2f63' },
            empty: ['#7fd6f2', '#0a4ea3'],
        },
        palm: {
            label: 'Palm',
            paper: '#fbfaf5',
            ink: '#123d22',
            muted: '#62766a',
            stripe: '#1a8a3e',
            stripeText: '#ffffff',
            number: '#123d22',
            field: '#123d22',
            fieldText: '#f4f1e6',
            fieldAccent: '#f7d117',
            medal: { ribbon: '#f7d117', ribbonStripe: '#123d22', plaqueText: '#123d22' },
            empty: ['#9fdc8f', '#1a8a3e'],
        },
        midnight: {
            label: 'Midnight',
            paper: '#17191f',
            ink: '#f4f3ee',
            muted: '#9aa0ab',
            stripe: '#e8232b',
            stripeText: '#ffffff',
            number: '#ff4a4f',
            field: '#121419',
            fieldText: '#f4f3ee',
            fieldAccent: '#ff4a4f',
            logoChip: '#ffffff',
            medal: { ribbon: '#e8232b', ribbonStripe: '#ffffff', plaqueText: '#ffffff' },
            empty: ['#3a4152', '#17191f'],
        },
    },
});
