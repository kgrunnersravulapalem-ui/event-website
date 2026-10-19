import {
  DISPLAY_FONT, TEXT_FONT, drawLogoBlock, drawLogoRow, drawPhotoFill, drawPhotoHeadline, fitFont, drawWebsite, runnerName, setFont, WEBSITE_SCALE,
} from '../canvas.js'

// Full-bleed photo broken by a finish tape, over a chequered finish line.
const layouts = {
  square: {
    headline: { x: 70, y: 158, size: 116 },
    tape: { cy: 776, h: 150, band: 36, angle: -4, pad: 70, size: 96 },
    checks: { y: 900, size: 40 },
    strip: { y: 940, pad: 60, titleY: 986, titleSize: 44, detailsY: 1022, footY: 1062, footSize: 26 },
    logos: {
      y: 975, h: 70, eventW: 116, orgW: 146, gap: 14,
      withSponsor: { scale: 0.72, y: 950, sponsorH: 44, rowGap: 8 },
    },
  },
  story: {
    headline: { x: 80, y: 272, size: 170 },
    tape: { cy: 1440, h: 196, band: 46, angle: -4, pad: 80, size: 128 },
    checks: { y: 1640, size: 54 },
    strip: { y: 1694, pad: 70, titleY: 1782, titleSize: 68, detailsY: 1834, footY: 1890, footSize: 36 },
    logos: {
      y: 1745, h: 110, eventW: 182, orgW: 228, gap: 18,
      withSponsor: { scale: 0.8, y: 1716, sponsorH: 76, rowGap: 14 },
    },
    // With a sponsor: the tape and strip move up so all three logos fit in one
    // row along the top of the strip, with the text below at full width.
    withSponsorRow: {
      tape: { cy: 1390, h: 196, band: 46, angle: -4, pad: 80, size: 128 },
      checks: { y: 1586, size: 54 },
      strip: { y: 1640, pad: 70, titleY: 1802, titleSize: 68, detailsY: 1848, footY: 1896, footSize: 36 },
      logoRow: { y: 1662, h: 72 },
    },
  },
}

function photoFrame(layout) {
  return { x: 0, y: 0, w: layout.width, h: layout.height }
}

function drawTape(ctx, layout, theme, data) {
  const { event } = data
  const t = layout.tape
  const W = layout.width
  ctx.save()
  ctx.translate(W / 2, t.cy)
  ctx.rotate((t.angle * Math.PI) / 180)
  const left = -W / 2 - 80
  const width = W + 160
  const top = -t.h / 2

  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 30
  ctx.shadowOffsetY = 12
  ctx.fillStyle = theme.stripe
  ctx.fillRect(left, top, width, t.h)
  ctx.restore()

  // Sponsor print repeated along the top edge
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  ctx.fillRect(left, top, width, t.band)
  ctx.fillStyle = theme.stripeText
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  setFont(ctx, 700, t.band * 0.5, TEXT_FONT)
  const unit = `${event.title}    ${event.subtitle}    ${event.website}    `.toUpperCase()
  const unitW = ctx.measureText(unit).width
  for (let x = left; x < left + width; x += unitW) ctx.fillText(unit, x, top + t.band / 2 + 1)

  // Name and distance
  const bodyY = top + t.band + (t.h - t.band) / 2 + t.size * 0.04
  ctx.textAlign = 'right'
  setFont(ctx, 900, t.size, DISPLAY_FONT)
  const distW = ctx.measureText(data.distance).width
  ctx.fillText(data.distance, W / 2 - t.pad, bodyY)
  const r = runnerName(data.name)
  ctx.textAlign = 'left'
  ctx.globalAlpha = r.nameAlpha
  fitFont(ctx, r.name, 800, t.size, DISPLAY_FONT, W - t.pad * 2 - distW - 40)
  ctx.fillText(r.name, -W / 2 + t.pad, bodyY)
  ctx.restore()
}

function drawFinishLine(ctx, layout, theme, data) {
  const { event } = data
  const W = layout.width
  // Two rows of square checks, `size` tall in total
  const { y, size } = layout.checks
  const cell = size / 2
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col * cell < W; col++) {
      ctx.fillStyle = (row + col) % 2 ? '#ffffff' : '#111418'
      ctx.fillRect(col * cell, y + row * cell, cell, cell)
    }
  }

  const s = layout.strip
  ctx.fillStyle = theme.paper
  ctx.fillRect(0, s.y, W, layout.height - s.y)

  const logoStyle = { chip: theme.logoChip, line: theme.logoChip ? '#6b7280' : theme.muted }
  let maxW
  if (layout.logoRow) {
    drawLogoRow(ctx, s.pad, layout.logoRow.y, layout.logoRow.h, data.assets, logoStyle)
    maxW = W - s.pad * 2
  } else {
    maxW = drawLogoBlock(ctx, W - s.pad, layout.logos, data.assets, logoStyle) - s.pad - 30
  }
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  // Event name, highlighted in the tape colour
  ctx.fillStyle = theme.stripe
  const title = event.title.toUpperCase()
  fitFont(ctx, title, 800, s.titleSize, DISPLAY_FONT, maxW)
  ctx.fillText(title, s.pad, s.titleY)
  // Date, then the register line, each on its own row
  ctx.fillStyle = theme.muted
  fitFont(ctx, event.details, 600, s.footSize, TEXT_FONT, maxW)
  ctx.fillText(event.details, s.pad, s.detailsY)
  ctx.fillStyle = theme.ink
  drawWebsite(ctx, event, s.pad, s.footY, s.footSize * WEBSITE_SCALE, { maxW })
}

function draw(ctx, base, theme, data) {
  const layout = data.assets.sponsorLogo && base.withSponsorRow ? { ...base, ...base.withSponsorRow } : base
  const hintY = (layout.headline.y + layout.tape.cy) / 2
  drawPhotoFill(ctx, photoFrame(layout), data.photo, theme, data.assets.background, hintY)
  drawPhotoHeadline(ctx, data.headline, layout, Boolean(data.photo || data.assets.background), theme)
  drawFinishLine(ctx, layout, theme, data)
  drawTape(ctx, layout, theme, data)
}

const finishDesign = { label: 'Finish line', layouts, photoFrame, draw }

export default finishDesign
