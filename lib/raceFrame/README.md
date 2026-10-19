# Race frame (`/frame`)

Runners add a photo, name and distance, pick a frame, colour and size, and download or share a race-day card. Cards are drawn on a canvas in the browser, so the download matches the preview exactly and photos never leave the runner's device.

The drawing code is ported from the standalone RaceFrame app (`running-frame`, used for the Palakollu 10K Run), so the four frames look the same for every event.

## Changing the card

Everything event-specific is in `event.ts`. Most of it comes from `lib/edition2.ts`, so updating the date, distances or causes there updates the cards too.

- **Registration call to action**: "More at kgrunners.in" switches to "Register at kgrunners.in" when `edition2.registrationOpen` is set to `true`.
- **Logos**: `assets.eventLogo` (the Edition 02 poster) and `assets.organizerLogo` (the KG Runners logo). White margins are trimmed automatically. Add `sponsorLogo: '/images/…'` to show a "Powered by" logo on every frame.
- **Headlines**: the Edition 02 causes (`edition2.causes`: Jai Jawan Jai Kisan, Health is Wealth, …), so editing that list updates both the site and the cards. A headline can include `{distance}`, which becomes the runner's distance.
- **Colours**: `themes`: Sunrise, Delta, Palm and Midnight, the same four as the Palakollu 10K Run frames.

## Options

Only `name`, `distances` and `assets` are required.

| Option | What it does |
|---|---|
| `name`, `year`, `subtitle` | Event name on every card ("Konaseema Half Marathon 2027"), and the short line next to it ("2nd Edition") |
| `details` | Date and venue line |
| `website`, `websiteLabel` | Website on the card, and the call to action before it |
| `distances` | Distances runners can pick; the first is preselected |
| `headlines` | Headline options |
| `assets` | `{ eventLogo, organizerLogo, sponsorLogo?, background? }` image URLs. `background` shows until the runner adds a photo |
| `themes` | Colour options; `themes.js` explains what each field colours |
| `frames` | Which frames to offer, in order: `bib`, `medal`, `finish`, `poster` (default: all four) |
| `downloadName` | Start of the downloaded file name |

## Code map

- `app/frame/`: the page.
- `components/frame/`: the card maker and its controls (`RaceFrame.tsx` is the main component).
- `lib/raceFrame/designs/`: the four frames, each with its own Post (1:1) and Story (9:16) layout numbers at the top of its file.
- `lib/raceFrame/canvas.js`: shared drawing helpers (headline style, logos, photo fill).
- `lib/raceFrame/fonts.ts`: the card fonts, self-hosted with `next/font`.
- `lib/raceFrame/images.js`: image loading, logo trimming and export.
