import { Barlow, Barlow_Condensed, Big_Shoulders } from 'next/font/google';

// Fonts drawn on the race-frame cards. They are self-hosted by next/font and
// only loaded on the /frame page. Canvas text needs real family names, so the
// drawing code reads each font's generated `fontFamily` string.

// Big numbers, names and event titles ("Big Shoulders Display" on Google Fonts
// is now "Big Shoulders" with an optical-size axis).
export const displayFont = Big_Shoulders({ subsets: ['latin'], axes: ['opsz'], display: 'swap' });

// Small text: dates, website, labels.
export const textFont = Barlow({ subsets: ['latin'], weight: ['500', '600', '700'], display: 'swap' });

// Headlines: heavy italic capitals, like "HALF MARATHON" on the poster.
export const headlineFont = Barlow_Condensed({
    subsets: ['latin'],
    weight: '800',
    style: 'italic',
    display: 'swap',
});
