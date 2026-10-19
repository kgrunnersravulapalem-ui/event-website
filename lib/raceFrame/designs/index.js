import bib from './bib.js'
import finish from './finish.js'
import medal from './medal.js'
import poster from './poster.js'

// Each design: { label, layouts: { square, story }, photoFrame(layout), draw(ctx, layout, theme, data) }
export const DESIGNS = { bib, medal, finish, poster }
export const DESIGN_ORDER = ['bib', 'medal', 'finish', 'poster']

export const FORMATS = {
  square: { label: 'Post', ratio: '1:1', width: 1080, height: 1080 },
  story: { label: 'Story', ratio: '9:16', width: 1080, height: 1920 },
}
export const FORMAT_ORDER = ['square', 'story']

// Built once so the same layout object is reused across renders.
const LAYOUTS = Object.fromEntries(
  DESIGN_ORDER.map((d) => [
    d,
    Object.fromEntries(FORMAT_ORDER.map((f) => [f, { ...FORMATS[f], ...DESIGNS[d].layouts[f] }])),
  ]),
)

export function getLayout(designKey, formatKey) {
  return LAYOUTS[designKey][formatKey]
}

export function renderCard(ctx, design, layout, theme, data) {
  ctx.clearRect(0, 0, layout.width, layout.height)
  ctx.save()
  // Best available resampling when shrinking photos and logos.
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  design.draw(ctx, layout, theme, data)
  ctx.restore()
}

// Downloads are drawn at twice the layout size (2160px wide) so logos, small
// text and photo detail stay sharp. The on-screen preview stays at 1x.
export const EXPORT_SCALE = 2

export function renderCardForExport(design, layout, theme, data, scale = EXPORT_SCALE) {
  const canvas = document.createElement('canvas')
  canvas.width = layout.width * scale
  canvas.height = layout.height * scale
  const ctx = canvas.getContext('2d')
  ctx.setTransform(scale, 0, 0, scale, 0, 0)
  renderCard(ctx, design, layout, theme, data)
  return canvas
}
