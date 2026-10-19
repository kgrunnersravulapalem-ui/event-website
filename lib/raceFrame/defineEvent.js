import { DESIGN_ORDER } from './designs/index.js'
import { DEFAULT_THEMES } from './themes.js'

// Used when an event doesn't list its own headlines.
// {distance} becomes the runner's distance, e.g. "10K loading".
export const DEFAULT_HEADLINES = [
  "I'm running",
  'Race day ready',
  'Count me in',
  '{distance} loading',
  'Chasing the sunrise',
  'See you at the start',
]

const REQUIRED = ['name', 'distances', 'assets']

// Fills in defaults for an event config and checks the required fields.
// See lib/raceFrame/README.md for every option.
export function defineEvent(config) {
  const missing = REQUIRED.filter((key) => !config[key] || config[key].length === 0)
  if (missing.length) throw new Error(`Event "${config.name ?? 'unnamed'}" is missing: ${missing.join(', ')}`)

  const event = {
    date: '',
    year: '',
    subtitle: '',
    details: '',
    website: '',
    websiteLabel: '',
    headlines: DEFAULT_HEADLINES,
    themes: DEFAULT_THEMES,
    frames: DESIGN_ORDER,
    ...config,
  }
  // Event name with the year when there is one, e.g. "Palakollu 10K Run 2026".
  event.title = [event.name, event.year].filter(Boolean).join(' ')
  // Page accent colour; defaults to the first colour option's stripe.
  event.accent ??= Object.values(event.themes)[0].stripe
  return event
}
