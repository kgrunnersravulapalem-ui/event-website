import {
  DISPLAY_FONT, TEXT_FONT, drawCircleText, drawLogo, drawLogoBlock, drawLogoRow, drawPhotoFill, fitFont, drawHeadline, drawWebsite, runnerName, setFont, WEBSITE_SCALE, wrapLines,
} from '../canvas.js'

// The photo sits inside a finisher's medal hanging from its ribbon.
// Square puts the details in a column beside the medal; story stacks them below.
const layouts = {
  square: {
    mode: 'side',
    medal: { cx: 380, cy: 600, R: 300, rim: 46 },
    ribbon: { spread: 250, width: 150 },
    column: { x: 730, right: 1030 },
    event: { y: 104, size: 58, subSize: 28 },
    headline: { y1: 352, size: 92 },
    name: { y: 670, size: 84 },
    logos: { y: 780, h: 68, eventW: 112, orgW: 142, gap: 16, withSponsor: { sponsorH: 60, rowGap: 16 } },
    foot: { y: 1030, size: 30, x: 60, right: 1020 },
  },
  story: {
    mode: 'stack',
    medal: { cx: 540, cy: 800, R: 380, rim: 56 },
    ribbon: { spread: 260, width: 160 },
    topLogos: { y: 60, h: 100, eventW: 166, orgW: 208, x: 60, right: 1020 },
    // With a sponsor, all three logos share one row between the name and the event name
    logoRow: { y: 1582, h: 70 },
    headline: { y: 1370, size: 132 },
    name: { y: 1540, size: 116 },
    event: { y: 1720, size: 68, subY: 1772, subSize: 32 },
    foot: { y: 1826, size: 34 },
  },
}

function photoFrame(layout) {
  const { cx, cy, R, rim } = layout.medal
  const r = R - rim
  return { x: cx - r, y: cy - r, w: r * 2, h: r * 2 }
}

const GOLD_DARK = '#6e4a0c'

function strap(ctx, topLeft, topRight, bottom, half) {
  ctx.beginPath()
  ctx.moveTo(topLeft, -10)
  ctx.lineTo(topRight, -10)
  ctx.lineTo(bottom.x + half, bottom.y)
  ctx.lineTo(bottom.x - half, bottom.y)
  ctx.closePath()
}

function drawRibbon(ctx, medal, ribbon, colors) {
  const { cx, cy, R } = medal
  const { spread, width } = ribbon
  const bottom = { x: cx, y: cy - R + 30 }
  const half = width * 0.38
  const straps = [
    { l: cx + spread - width, r: cx + spread, shade: true },
    { l: cx - spread, r: cx - spread + width, shade: false },
  ]
  for (const s of straps) {
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.25)'
    ctx.shadowBlur = 16
    strap(ctx, s.l, s.r, bottom, half)
    ctx.fillStyle = colors.ribbon
    ctx.fill()
    ctx.restore()

    ctx.save()
    strap(ctx, s.l, s.r, bottom, half)
    ctx.clip()
    ctx.strokeStyle = colors.ribbonStripe
    ctx.lineWidth = width * 0.2
    ctx.beginPath()
    ctx.moveTo((s.l + s.r) / 2, -10)
    ctx.lineTo(bottom.x, bottom.y)
    ctx.stroke()
    if (s.shade) {
      ctx.fillStyle = 'rgba(0,0,0,0.18)'
      ctx.fill()
    }
    ctx.restore()
  }

  // Ring joining ribbon and medal
  ctx.strokeStyle = '#c9972e'
  ctx.lineWidth = R * 0.04
  ctx.beginPath()
  ctx.arc(cx, cy - R - R * 0.02, R * 0.09, 0, Math.PI * 2)
  ctx.stroke()
}

function drawMedal(ctx, layout, theme, data) {
  const { event } = data
  const { cx, cy, R, rim } = layout.medal
  const inner = R - rim

  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.4)'
  ctx.shadowBlur = 40
  ctx.shadowOffsetY = 16
  const gold = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.1, cx, cy, R)
  gold.addColorStop(0, '#fff1b8')
  gold.addColorStop(0.45, '#e6bf4f')
  gold.addColorStop(1, '#a8761b')
  ctx.fillStyle = gold
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  // Engraving around the rim
  ctx.fillStyle = GOLD_DARK
  setFont(ctx, 700, rim * 0.42, TEXT_FONT)
  drawCircleText(ctx, `${event.title} • ${event.subtitle} • `.toUpperCase(), cx, cy, R - rim / 2)

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, inner, 0, Math.PI * 2)
  ctx.clip()
  drawPhotoFill(ctx, photoFrame(layout), data.photo, theme, data.assets.background, cy - inner * 0.15)
  ctx.restore()

  ctx.lineWidth = 6
  ctx.strokeStyle = '#8a5f12'
  ctx.beginPath()
  ctx.arc(cx, cy, inner, 0, Math.PI * 2)
  ctx.stroke()

  // Distance on a banner across the bottom of the medal
  const py = cy + R * 0.72
  const w = R * 1.2
  const h = R * 0.3
  const notch = h * 0.4
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.3)'
  ctx.shadowBlur = 14
  ctx.shadowOffsetY = 6
  ctx.beginPath()
  ctx.moveTo(cx - w / 2 - notch, py - h / 2)
  ctx.lineTo(cx + w / 2 + notch, py - h / 2)
  ctx.lineTo(cx + w / 2, py)
  ctx.lineTo(cx + w / 2 + notch, py + h / 2)
  ctx.lineTo(cx - w / 2 - notch, py + h / 2)
  ctx.lineTo(cx - w / 2, py)
  ctx.closePath()
  ctx.fillStyle = theme.medal.ribbon
  ctx.fill()
  ctx.restore()
  ctx.fillStyle = theme.medal.plaqueText
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  fitFont(ctx, data.distance, 900, h * 0.8, DISPLAY_FONT, w - 20)
  ctx.fillText(data.distance, cx, py + h * 0.04)
}

function drawBackground(ctx, layout, theme) {
  ctx.fillStyle = theme.field
  ctx.fillRect(0, 0, layout.width, layout.height)
  const { cx, cy, R } = layout.medal
  const glow = ctx.createRadialGradient(cx, cy, R * 0.5, cx, cy, R * 1.9)
  glow.addColorStop(0, 'rgba(255,255,255,0.14)')
  glow.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, layout.width, layout.height)
}

function drawSideText(ctx, layout, theme, data) {
  const { event } = data
  const { x, right } = layout.column
  const maxW = right - x
  ctx.fillStyle = theme.fieldText
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'

  // Event name, highlighted in the accent colour, over up to two lines
  const ev = layout.event
  ctx.fillStyle = theme.fieldAccent
  const { lines, size } = wrapLines(ctx, event.title.toUpperCase(), 800, ev.size, DISPLAY_FONT, maxW, 2)
  lines.forEach((line, i) => ctx.fillText(line, x, ev.y + i * size * 0.95))
  const subY = ev.y + (lines.length - 1) * size * 0.95 + ev.subSize * 1.5
  ctx.fillStyle = theme.fieldText
  ctx.globalAlpha = 0.8
  fitFont(ctx, event.subtitle, 600, ev.subSize, TEXT_FONT, maxW)
  ctx.fillText(event.subtitle, x, subY)
  ctx.globalAlpha = 1

  // Headline over two lines in the narrow column
  const hl = layout.headline
  drawHeadline(ctx, data.headline, {
    x, y: hl.y1, size: hl.size, maxW, fill: theme.fieldText, shadow: theme.fieldAccent, split: 'always',
  })
  ctx.fillStyle = theme.fieldText
  ctx.textAlign = 'left'

  const r = runnerName(data.name)
  ctx.globalAlpha = r.nameAlpha
  fitFont(ctx, r.name, 800, layout.name.size, DISPLAY_FONT, maxW)
  ctx.fillText(r.name, x, layout.name.y)
  ctx.globalAlpha = 1

  drawLogoBlock(ctx, right, layout.logos, data.assets, { chip: '#ffffff', line: '#6b7280' })

  const ft = layout.foot
  ctx.fillStyle = theme.fieldText
  ctx.textBaseline = 'alphabetic'
  ctx.textAlign = 'right'
  const siteW = drawWebsite(ctx, event, ft.right, ft.y, ft.size * WEBSITE_SCALE, {
    align: 'right',
    maxW: (ft.right - ft.x) * 0.62,
  })
  ctx.textAlign = 'left'
  ctx.globalAlpha = 0.85
  fitFont(ctx, event.details, 500, ft.size, TEXT_FONT, ft.right - ft.x - siteW - 24)
  ctx.fillText(event.details, ft.x, ft.y)
  ctx.globalAlpha = 1
}

function drawStackText(ctx, layout, theme, data) {
  const { event } = data
  const cx = layout.width / 2
  const maxW = layout.width - 120
  const tl = layout.topLogos
  const style = { chip: '#ffffff', line: '#6b7280' }
  const logoRow = data.assets.sponsorLogo && layout.logoRow
  if (!logoRow) {
    drawLogo(ctx, tl.x, tl.y, tl.orgW, tl.h, data.assets.organizerLogo, 'Club logo', style)
    drawLogo(ctx, tl.right - tl.eventW, tl.y, tl.eventW, tl.h, data.assets.eventLogo, 'Event logo', style)
  }

  ctx.fillStyle = theme.fieldText
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  drawHeadline(ctx, data.headline, {
    x: cx, y: layout.headline.y, size: layout.headline.size, maxW, align: 'center',
    fill: theme.fieldText, shadow: theme.fieldAccent, split: 'never',
  })
  ctx.fillStyle = theme.fieldText

  const r = runnerName(data.name)
  ctx.globalAlpha = r.nameAlpha
  fitFont(ctx, r.name, 800, layout.name.size, DISPLAY_FONT, maxW)
  ctx.fillText(r.name, cx, layout.name.y)
  ctx.globalAlpha = 1

  if (logoRow) drawLogoRow(ctx, cx, logoRow.y, logoRow.h, data.assets, style, { align: 'center' })
  ctx.fillStyle = theme.fieldText
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  const ev = layout.event
  const title = event.title.toUpperCase()
  ctx.fillStyle = theme.fieldAccent
  fitFont(ctx, title, 800, ev.size, DISPLAY_FONT, maxW)
  ctx.fillText(title, cx, ev.y)
  ctx.fillStyle = theme.fieldText
  ctx.globalAlpha = 0.85
  fitFont(ctx, event.subtitle, 600, ev.subSize, TEXT_FONT, maxW)
  ctx.fillText(event.subtitle, cx, ev.subY)
  fitFont(ctx, event.details, 500, layout.foot.size, TEXT_FONT, maxW)
  ctx.fillText(event.details, cx, layout.foot.y)
  ctx.globalAlpha = 1
  const siteSize = layout.foot.size * WEBSITE_SCALE
  drawWebsite(ctx, event, cx, layout.foot.y + siteSize * 1.25, siteSize, { align: 'center', maxW })
}

function draw(ctx, layout, theme, data) {
  drawBackground(ctx, layout, theme)
  drawRibbon(ctx, layout.medal, layout.ribbon, theme.medal)
  drawMedal(ctx, layout, theme, data)
  if (layout.mode === 'side') drawSideText(ctx, layout, theme, data)
  else drawStackText(ctx, layout, theme, data)
}

const medalDesign = { label: 'Medal', layouts, photoFrame, draw }

export default medalDesign
