// Colour options for the card. Each event can define its own (see event.ts);
// these are used when it doesn't.
//
// paper/ink/muted: bib paper and the finish-line strip.
// stripe/stripeText: bib stripe, finish tape and the headline shadow on photos.
// number: the distance printed on the bib.
// field/fieldText/fieldAccent: deep backgrounds (medal, poster) and the one bright colour on them.
// medal: ribbon, ribbon stripe and the text on the distance banner.
// empty: gradient shown where the photo goes until one is added.
// logoChip (optional): white backing behind logos on dark paper.
export const DEFAULT_THEMES = {
  sunrise: {
    label: 'Sunrise',
    paper: '#ffffff',
    ink: '#1d2340',
    muted: '#6b7687',
    stripe: '#ff5a36',
    stripeText: '#ffffff',
    number: '#1d2340',
    field: '#1d2340',
    fieldText: '#fff4ec',
    fieldAccent: '#ff6b45',
    medal: { ribbon: '#ff6b45', ribbonStripe: '#fff4ec', plaqueText: '#ffffff' },
    empty: ['#ffb27a', '#ff5a36'],
  },
  ocean: {
    label: 'Ocean',
    paper: '#ffffff',
    ink: '#0e2a47',
    muted: '#63738a',
    stripe: '#1560b0',
    stripeText: '#ffffff',
    number: '#0e2a47',
    field: '#0b3a66',
    fieldText: '#ffffff',
    fieldAccent: '#7fd3ff',
    medal: { ribbon: '#7fd3ff', ribbonStripe: '#ffffff', plaqueText: '#0b3a66' },
    empty: ['#7cc3e6', '#1560b0'],
  },
  forest: {
    label: 'Forest',
    paper: '#fbfaf5',
    ink: '#16301f',
    muted: '#66776b',
    stripe: '#1f7a4d',
    stripeText: '#ffffff',
    number: '#16301f',
    field: '#173d2a',
    fieldText: '#f4f1e6',
    fieldAccent: '#f2c14e',
    medal: { ribbon: '#f2c14e', ribbonStripe: '#173d2a', plaqueText: '#173d2a' },
    empty: ['#a6d49b', '#1f7a4d'],
  },
  midnight: {
    label: 'Midnight',
    paper: '#17191f',
    ink: '#f4f3ee',
    muted: '#9aa0ab',
    stripe: '#ffd23f',
    stripeText: '#17191f',
    number: '#ffd23f',
    field: '#121419',
    fieldText: '#f4f3ee',
    fieldAccent: '#ffd23f',
    logoChip: '#ffffff',
    medal: { ribbon: '#ffd23f', ribbonStripe: '#121419', plaqueText: '#121419' },
    empty: ['#3a4152', '#17191f'],
  },
}
