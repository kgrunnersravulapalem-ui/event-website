import { DISPLAY_FONT, TEXT_FONT, drawLogoBlock, drawLogoRow, drawPhotoFill, fitFont, drawHeadline, drawWebsite, runnerName, WEBSITE_SCALE, wrapLines } from '../canvas.js'

// Flat race poster: solid colour, the distance set vertically down the left,
// a hard-edged photo, and the details underneath.
const layouts = {
  square: {
    distance: { x: 285, top: 60, bottom: 740, size: 280 },
    photo: { x: 320, y: 60, w: 700, h: 680 },
    headline: { x: 320, y: 838, size: 84 },
    name: { y: 976, size: 72 },
    foot: { y: 1040, size: 26 },
    // Square: the date sits in the left column under the event name.
    event: { x: 60, maxW: 232, y1: 842, size: 56, maxLines: 3, subSize: 24, detailsSize: 22 },
    logos: {
      y: 896, h: 76, eventW: 126, orgW: 158, gap: 18, right: 1020,
      withSponsor: { scale: 0.8, y: 880, sponsorH: 52, rowGap: 10 },
    },
  },
  story: {
    distance: { x: 335, top: 120, bottom: 1330, size: 335 },
    photo: { x: 370, y: 120, w: 650, h: 1210 },
    headline: { x: 60, y: 1500, size: 150 },
    name: { y: 1670, size: 120 },
    foot: { y: 1892, size: 32, detailsY: 1846 },
    event: { x: 60, maxW: 520, y1: 1762, size: 62, maxLines: 1, subSize: 30 },
    logos: {
      y: 1716, h: 104, eventW: 172, orgW: 216, gap: 24, right: 1020,
      withSponsor: { scale: 0.85, y: 1700, sponsorH: 70, rowGap: 12 },
    },
    // With a sponsor, all three logos share one row in the top margin, right-aligned.
    logoRow: { y: 34, h: 62, right: 1020 },
  },
}

function photoFrame(layout) {
  return layout.photo
}

function draw(ctx, layout, theme, data) {
  const { event } = data
  const W = layout.width
  ctx.fillStyle = theme.field
  ctx.fillRect(0, 0, W, layout.height)

  // Photo
  const p = layout.photo
  ctx.save()
  ctx.beginPath()
  ctx.rect(p.x, p.y, p.w, p.h)
  ctx.clip()
  drawPhotoFill(ctx, p, data.photo, theme, data.assets.background)
  ctx.restore()

  // Distance, reading bottom to top, centred along the photo's height
  const d = layout.distance
  ctx.save()
  ctx.translate(d.x, (d.top + d.bottom) / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillStyle = theme.fieldAccent
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  fitFont(ctx, data.distance, 900, d.size, DISPLAY_FONT, d.bottom - d.top)
  ctx.fillText(data.distance, 0, 0)
  ctx.restore()

  ctx.fillStyle = theme.fieldText
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  const hl = layout.headline
  drawHeadline(ctx, data.headline, {
    x: hl.x, y: hl.y, size: hl.size, maxW: W - hl.x - 60, fill: theme.fieldText, shadow: theme.fieldAccent, split: 'never',
  })
  ctx.fillStyle = theme.fieldText

  const logoStyle = { chip: '#ffffff', line: '#6b7280' }
  let eventX
  if (data.assets.sponsorLogo && layout.logoRow) {
    const row = layout.logoRow
    drawLogoRow(ctx, row.right, row.y, row.h, data.assets, logoStyle, { align: 'right' })
    eventX = layout.logos.right
  } else {
    eventX = drawLogoBlock(ctx, layout.logos.right, layout.logos, data.assets, logoStyle)
  }
  ctx.fillStyle = theme.fieldText
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  // Runner, aligned with the headline
  const r = runnerName(data.name)
  const textMaxW = eventX - hl.x - 30
  ctx.globalAlpha = r.nameAlpha
  fitFont(ctx, r.name, 800, layout.name.size, DISPLAY_FONT, textMaxW)
  ctx.fillText(r.name, hl.x, layout.name.y)
  ctx.globalAlpha = 1

  // Event block
  // Event name, highlighted in the accent colour (stacked in the narrow square column)
  const ev = layout.event
  ctx.fillStyle = theme.fieldAccent
  const { lines, size } = wrapLines(ctx, event.title.toUpperCase(), 800, ev.size, DISPLAY_FONT, ev.maxW, ev.maxLines)
  lines.forEach((line, i) => ctx.fillText(line, ev.x, ev.y1 + i * size * 0.95))
  const subY = ev.y1 + (lines.length - 1) * size * 0.95 + ev.subSize * 1.6
  ctx.fillStyle = theme.fieldText
  ctx.globalAlpha = 0.85
  fitFont(ctx, event.subtitle, 600, ev.subSize, TEXT_FONT, ev.maxW)
  ctx.fillText(event.subtitle, ev.x, subY)
  ctx.globalAlpha = 1

  // Date: in the left column (square) or under the event block (story)
  const ft = layout.foot
  ctx.globalAlpha = 0.85
  if (ev.detailsSize) {
    const d = wrapLines(ctx, event.details, 500, ev.detailsSize, TEXT_FONT, ev.maxW, 2)
    d.lines.forEach((line, i) => ctx.fillText(line, ev.x, subY + ev.detailsSize * 1.5 + i * d.size * 1.25))
  } else {
    fitFont(ctx, event.details, 500, ft.size, TEXT_FONT, ev.maxW)
    ctx.fillText(event.details, ev.x, ft.detailsY)
  }
  ctx.globalAlpha = 1

  // Register line: under the runner (square) or along the bottom (story)
  const siteX = ev.detailsSize ? hl.x : ev.x
  drawWebsite(ctx, event, siteX, ft.y, ft.size * WEBSITE_SCALE, { maxW: layout.logos.right - siteX })
}

const posterDesign = { label: 'Poster', layouts, photoFrame, draw }

export default posterDesign
