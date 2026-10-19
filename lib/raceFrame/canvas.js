import { displayFont, headlineFont, textFont } from './fonts'

// Drawing helpers shared by every frame design.
export const DISPLAY_FONT = `${displayFont.style.fontFamily}, "Arial Narrow", Impact, sans-serif`
export const TEXT_FONT = `${textFont.style.fontFamily}, Arial, sans-serif`
// Heavy forward-leaning capitals, echoing the italic lettering in the event logo.
export const HEADLINE_FONT = `${headlineFont.style.fontFamily}, "Arial Narrow", sans-serif`
const HEADLINE_STYLE = 'italic 800'

export const CARD_FONTS = [
  `800 100px ${DISPLAY_FONT}`,
  `900 100px ${DISPLAY_FONT}`,
  `500 100px ${TEXT_FONT}`,
  `600 100px ${TEXT_FONT}`,
  `700 100px ${TEXT_FONT}`,
  `${HEADLINE_STYLE} 100px ${HEADLINE_FONT}`,
]

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

export function setFont(ctx, weight, size, family) {
  ctx.font = `${weight} ${size}px ${family}`
}

// Shrinks the font until the text fits in maxW. Returns the size used.
export function fitFont(ctx, text, weight, size, family, maxW) {
  let s = size
  setFont(ctx, weight, s, family)
  while (s > 12 && ctx.measureText(text).width > maxW) {
    s -= 2
    setFont(ctx, weight, s, family)
  }
  return s
}

export function drawCover(ctx, image, x, y, w, h) {
  const scale = Math.max(w / image.width, h / image.height)
  const dw = image.width * scale
  const dh = image.height * scale
  ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
}

// Where the photo sits inside its frame for a given zoom (>= 1) and pan (0..1 per axis).
export function getPhotoPlacement(frame, image, zoom, panX, panY) {
  const scale = Math.max(frame.w / image.width, frame.h / image.height) * zoom
  const w = image.width * scale
  const h = image.height * scale
  const overflowX = w - frame.w
  const overflowY = h - frame.h
  return {
    x: frame.x - overflowX * panX,
    y: frame.y - overflowY * panY,
    w,
    h,
    overflowX,
    overflowY,
  }
}

// Fills a frame with the runner's photo, or an empty state until they add one.
// The caller sets up any clip path first.
export function drawPhotoFill(ctx, frame, photo, theme, background, hintY = frame.y + frame.h / 2) {
  if (photo) {
    const p = getPhotoPlacement(frame, photo.image, photo.zoom, photo.panX, photo.panY)
    ctx.drawImage(photo.image, p.x, p.y, p.w, p.h)
    return
  }
  if (background) {
    drawCover(ctx, background, frame.x, frame.y, frame.w, frame.h)
  } else {
    const g = ctx.createLinearGradient(frame.x, frame.y, frame.x + frame.w, frame.y + frame.h)
    g.addColorStop(0, theme.empty[0])
    g.addColorStop(1, theme.empty[1])
    ctx.fillStyle = g
    ctx.fillRect(frame.x, frame.y, frame.w, frame.h)
  }
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  fitFont(ctx, 'Your photo goes here', 600, 40, TEXT_FONT, frame.w * 0.8)
  ctx.fillText('Your photo goes here', frame.x + frame.w / 2, hintY)
}

// The headline: italic capitals with a solid offset shadow in the theme colour.
// `split` is 'auto' (two balanced lines only when one line would get too small),
// 'always' or 'never'. The first baseline is at y; a second line goes below it.
// Returns the baseline of the last line.
export function drawHeadline(ctx, text, { x, y, size, maxW, align = 'left', fill, shadow, split = 'auto' }) {
  const caps = text.toUpperCase()
  ctx.textAlign = align
  ctx.textBaseline = 'alphabetic'
  let rows = [caps]
  let s = fitFont(ctx, caps, HEADLINE_STYLE, size, HEADLINE_FONT, maxW)
  const wantSplit = split === 'always' || (split === 'auto' && s < size * 0.8)
  if (wantSplit && caps.includes(' ')) {
    setFont(ctx, HEADLINE_STYLE, size, HEADLINE_FONT)
    rows = splitBalanced(ctx, caps)
    s = Math.min(...rows.map((r) => fitFont(ctx, r, HEADLINE_STYLE, size, HEADLINE_FONT, maxW)))
  }
  setFont(ctx, HEADLINE_STYLE, s, HEADLINE_FONT)
  const lineGap = s * 0.9
  // A slim offset reads as a coloured edge; a wide one looks like a second copy.
  const offset = Math.max(2, s * 0.028)
  rows.forEach((row, i) => {
    const by = y + i * lineGap
    if (shadow) {
      ctx.fillStyle = shadow
      ctx.fillText(row, x + offset, by + offset)
    }
    ctx.fillStyle = fill
    ctx.fillText(row, x, by)
  })
  return y + (rows.length - 1) * lineGap
}

// Headline over a photo, with a fade behind it so it reads on any picture.
export function drawPhotoHeadline(ctx, text, layout, hasImage, theme) {
  const hl = layout.headline
  if (hasImage) {
    const fadeTo = hl.y + hl.size * 1.3
    const g = ctx.createLinearGradient(0, 0, 0, fadeTo)
    g.addColorStop(0, 'rgba(0,0,0,0.5)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, layout.width, fadeTo)
  }
  drawHeadline(ctx, text, {
    x: hl.x,
    y: hl.y,
    size: hl.size,
    maxW: layout.width - hl.x * 2,
    fill: '#ffffff',
    // The empty placeholder is itself the theme colour, so use ink until there's a picture.
    shadow: hasImage ? theme.stripe : theme.ink,
  })
}

// The website is set this much larger (and bold) than the date line next to it.
export const WEBSITE_SCALE = 1.25

// The website with its call to action, e.g. "Register at palakollurunners.org":
// the label in regular weight, the address in bold. Shrinks only if it can't fit
// maxW. `align` is where x sits: left, right or center. Returns the width drawn.
export function drawWebsite(ctx, event, x, y, size, { align = 'left', maxW = Infinity } = {}) {
  if (!event.website) return 0
  const label = event.websiteLabel ? `${event.websiteLabel} ` : ''
  let s = size
  let labelW = 0
  let siteW = 0
  for (; s > 12; s -= 1) {
    setFont(ctx, 500, s, TEXT_FONT)
    labelW = ctx.measureText(label).width
    setFont(ctx, 700, s, TEXT_FONT)
    siteW = ctx.measureText(event.website).width
    if (labelW + siteW <= maxW) break
  }
  const total = labelW + siteW
  const start = align === 'right' ? x - total : align === 'center' ? x - total / 2 : x
  ctx.textAlign = 'left'
  setFont(ctx, 500, s, TEXT_FONT)
  ctx.fillText(label, start, y)
  setFont(ctx, 700, s, TEXT_FONT)
  ctx.fillText(event.website, start + labelW, y)
  return total
}

// Splits text into two lines of similar width at a word boundary.
export function splitBalanced(ctx, text) {
  const words = text.split(' ')
  if (words.length < 2) return [text, '']
  let best = [text, '']
  let bestW = Infinity
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(' ')
    const b = words.slice(i).join(' ')
    const w = Math.max(ctx.measureText(a).width, ctx.measureText(b).width)
    if (w < bestW) {
      bestW = w
      best = [a, b]
    }
  }
  return best
}

// Wraps text onto at most `maxLines` lines no wider than maxW, shrinking the font
// only if it can't fit. Sets the font and returns { lines, size }.
export function wrapLines(ctx, text, weight, size, family, maxW, maxLines) {
  const words = text.split(' ')
  for (let s = size; s > 12; s -= 2) {
    setFont(ctx, weight, s, family)
    const lines = []
    let line = ''
    for (const word of words) {
      const next = line ? `${line} ${word}` : word
      if (line && ctx.measureText(next).width > maxW) {
        lines.push(line)
        line = word
      } else {
        line = next
      }
    }
    lines.push(line)
    if (lines.length <= maxLines && lines.every((l) => ctx.measureText(l).width <= maxW)) return { lines, size: s }
  }
  setFont(ctx, weight, 12, family)
  return { lines: [text], size: 12 }
}

// The runner's name, with a faded placeholder until they type it.
export function runnerName(name) {
  return {
    name: name.trim().toUpperCase() || 'YOUR NAME',
    nameAlpha: name.trim() ? 1 : 0.35,
  }
}

// How far a logo's white backing extends past the logo on each side.
const CHIP_PAD = 6

// A logo contained in a box. `chip` draws a white backing; `line` is the placeholder color.
export function drawLogo(ctx, x, y, w, h, image, fallbackText, { chip, line }) {
  if (chip) {
    roundRect(ctx, x - CHIP_PAD, y - CHIP_PAD, w + CHIP_PAD * 2, h + CHIP_PAD * 2, 12)
    ctx.fillStyle = chip
    ctx.fill()
  }
  if (image) {
    const scale = Math.min(w / image.width, h / image.height)
    const dw = image.width * scale
    const dh = image.height * scale
    ctx.drawImage(image, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
    return
  }
  ctx.save()
  ctx.setLineDash([8, 6])
  ctx.lineWidth = 2
  ctx.strokeStyle = line
  roundRect(ctx, x, y, w, h, 10)
  ctx.stroke()
  ctx.restore()
  ctx.fillStyle = line
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  fitFont(ctx, fallbackText, 600, h * 0.22, TEXT_FONT, w - 16)
  ctx.fillText(fallbackText, x + w / 2, y + h / 2)
}

// Organizer logo then event logo, right-aligned so the pair ends at `right`.
// `gap` is the visible space between them, measured between their backings.
// Returns the pair's left edge.
export function drawLogoPair(ctx, right, y, { h, eventW, orgW, gap }, assets, style) {
  const eventX = right - eventW
  const orgX = eventX - (style.chip ? gap + CHIP_PAD * 2 : gap) - orgW
  drawLogo(ctx, orgX, y, orgW, h, assets.organizerLogo, 'Club logo', style)
  drawLogo(ctx, eventX, y, eventW, h, assets.eventLogo, 'Event logo', style)
  return orgX
}

// Width-to-height ratios used for logo placeholders until real logos load.
const PLACEHOLDER_RATIO = { organizerLogo: 2.1, eventLogo: 1.7, sponsorLogo: 2.6 }

// Organizer, event and sponsor logos in one row, all `h` tall and each as wide as
// its shape needs. `align` is where x sits: left, right or center. The sponsor is
// skipped if the event has none. Returns { left, right }.
export function drawLogoRow(ctx, x, y, h, assets, style, { align = 'left', gap = 20 } = {}) {
  const items = [
    ['organizerLogo', 'Club logo'],
    ['eventLogo', 'Event logo'],
    ['sponsorLogo', ''],
  ]
    .filter(([key]) => key !== 'sponsorLogo' || assets.sponsorLogo)
    .map(([key, label]) => {
      const image = assets[key]
      const w = image ? (h * image.width) / image.height : h * PLACEHOLDER_RATIO[key]
      return { image, label, w }
    })
  const gapPx = style.chip ? gap + CHIP_PAD * 2 : gap
  const total = items.reduce((sum, item) => sum + item.w, 0) + gapPx * (items.length - 1)
  let cursor = align === 'right' ? x - total : align === 'center' ? x - total / 2 : x
  const left = cursor
  for (const item of items) {
    drawLogo(ctx, cursor, y, item.w, h, item.image, item.label, style)
    cursor += item.w + gapPx
  }
  return { left, right: left + total }
}

// The sponsor logo ("Powered by …"), `h` tall and as wide as its shape needs (up
// to maxW), centred on cx. Optional: draws nothing if the event has none.
export function drawSponsor(ctx, cx, y, h, maxW, image, style) {
  if (!image) return
  const w = Math.min(maxW, (h * image.width) / image.height)
  drawLogo(ctx, cx - w / 2, y, w, h, image, '', style)
}

// Event and club logos, plus the sponsor logo centred beneath them when the event
// has one. `spec.withSponsor` ({ scale, y, sponsorH, rowGap }) shrinks and lifts
// the pair so the whole group still fits; without a sponsor nothing changes.
// Returns the group's left edge.
export function drawLogoBlock(ctx, right, spec, assets, style) {
  if (!assets.sponsorLogo || !spec.withSponsor) return drawLogoPair(ctx, right, spec.y, spec, assets, style)
  const { scale = 1, y = spec.y, sponsorH, rowGap } = spec.withSponsor
  const pair = { h: spec.h * scale, eventW: spec.eventW * scale, orgW: spec.orgW * scale, gap: spec.gap }
  const left = drawLogoPair(ctx, right, y, pair, assets, style)
  const chipPads = style.chip ? CHIP_PAD * 2 : 0
  drawSponsor(ctx, (left + right) / 2, y + pair.h + chipPads + rowGap, sponsorH, right - left, assets.sponsorLogo, style)
  return left
}

// Repeats text around a full circle, centred on (cx, cy), with glyphs standing on the radius.
export function drawCircleText(ctx, text, cx, cy, radius) {
  const circumference = Math.PI * 2 * radius
  const unit = ctx.measureText(text).width
  const repeats = Math.max(1, Math.floor(circumference / unit))
  const full = text.repeat(repeats)
  const chars = [...full]
  const widths = chars.map((c) => ctx.measureText(c).width)
  const spread = circumference / widths.reduce((a, b) => a + b, 0)
  let angle = -Math.PI / 2
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  chars.forEach((c, i) => {
    const step = (widths[i] * spread) / radius
    angle += step / 2
    ctx.save()
    ctx.translate(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius)
    ctx.rotate(angle + Math.PI / 2)
    ctx.fillText(c, 0, 0)
    ctx.restore()
    angle += step / 2
  })
}
