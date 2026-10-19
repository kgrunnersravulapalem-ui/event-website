import {
  DISPLAY_FONT, TEXT_FONT, drawLogoPair, drawPhotoFill, drawSponsor, drawPhotoHeadline, fitFont, roundRect, drawWebsite, runnerName, setFont, WEBSITE_SCALE,
} from '../canvas.js'

// Full-bleed photo with a race bib pinned over the lower part.
// Bib coordinates are local to the bib and multiplied by `scale`; x/y place the scaled bib.
const layouts = {
  square: {
    headline: { x: 70, y: 158, size: 116 },
    bib: {
      x: 163, y: 612, scale: 0.82, w: 920, h: 522, angle: -2, r: 18,
      stripe: 104, stripeSize: 64, editionSize: 30, pad: 44,
      numberY: 292, numberSize: 230,
      tearY: 320,
      nameY: 408, nameSize: 78,
      detailsY: 454, detailsSize: 28,
      footY: 500, footSize: 30,
      logos: { y: 346, h: 88, eventW: 146, orgW: 184, gap: 16 },
      // When the event has a sponsor: smaller logos and text so the sponsor logo
      // fits centred under the club and event logos.
      withSponsor: {
        logos: { y: 338, h: 70, eventW: 116, orgW: 146, gap: 16 },
        sponsor: { y: 424, h: 50 },
        nameY: 398, nameSize: 72,
        detailsY: 442, detailsSize: 26,
        footY: 508, footSize: 28,
      },
    },
  },
  story: {
    headline: { x: 80, y: 272, size: 170 },
    bib: {
      x: 70, y: 1220, w: 940, h: 580, angle: -2, r: 20,
      stripe: 120, stripeSize: 72, editionSize: 34, pad: 48,
      numberY: 346, numberSize: 280,
      tearY: 378,
      nameY: 474, nameSize: 90,
      detailsY: 520, detailsSize: 32,
      footY: 560, footSize: 32,
      logos: { y: 404, h: 104, eventW: 172, orgW: 216, gap: 18 },
      // With a sponsor, the bib is 60px taller (growing upward, so its bottom edge
      // stays put) and the sponsor logo sits centred under the club and event logos.
      withSponsor: {
        y: 1160, h: 640,
        logos: { y: 396, h: 84, eventW: 140, orgW: 176, gap: 18 },
        sponsor: { y: 500, h: 60 },
        nameY: 470, nameSize: 86,
        detailsY: 518, detailsSize: 30,
        footY: 612, footSize: 32,
      },
    },
  },
}

function photoFrame(layout) {
  return { x: 0, y: 0, w: layout.width, h: layout.height }
}

// A hole punched through the bib with a safety pin through it.
function drawPin(ctx, x, y) {
  ctx.fillStyle = 'rgba(0,0,0,0.45)'
  ctx.beginPath()
  ctx.arc(x, y, 7, 0, Math.PI * 2)
  ctx.fill()

  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 6
  ctx.shadowOffsetY = 2
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#c3c8d0'
  ctx.lineWidth = 7
  ctx.beginPath()
  ctx.moveTo(x - 30, y + 9)
  ctx.lineTo(x + 30, y - 9)
  ctx.stroke()
  ctx.strokeStyle = '#eef0f3'
  ctx.lineWidth = 2.5
  ctx.stroke()
  ctx.fillStyle = '#9aa1ab'
  ctx.beginPath()
  ctx.arc(x + 32, y - 10, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawBib(ctx, base, theme, { name, distance, assets, event }) {
  // Events with a sponsor logo use the layout's withSponsor adjustments.
  const bib = assets.sponsorLogo && base.withSponsor ? { ...base, ...base.withSponsor } : base
  const { w, h, pad } = bib
  const scale = bib.scale ?? 1
  // Text starts inside the safety pins so every row shares one left edge.
  const inner = pad + 36
  ctx.save()
  ctx.translate(bib.x + (w * scale) / 2, bib.y + (h * scale) / 2)
  ctx.rotate((bib.angle * Math.PI) / 180)
  ctx.scale(scale, scale)
  ctx.translate(-w / 2, -h / 2)

  // Paper
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 40
  ctx.shadowOffsetY = 18
  roundRect(ctx, 0, 0, w, h, bib.r)
  ctx.fillStyle = theme.paper
  ctx.fill()
  ctx.restore()

  // Sponsor stripe
  ctx.save()
  roundRect(ctx, 0, 0, w, h, bib.r)
  ctx.clip()
  ctx.fillStyle = theme.stripe
  ctx.fillRect(0, 0, w, bib.stripe)
  ctx.restore()

  ctx.fillStyle = theme.stripeText
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'right'
  setFont(ctx, 600, bib.editionSize, TEXT_FONT)
  const subtitleW = ctx.measureText(event.subtitle).width
  ctx.fillText(event.subtitle, w - inner, bib.stripe / 2 + 2)
  ctx.textAlign = 'left'
  const title = event.title.toUpperCase()
  fitFont(ctx, title, 800, bib.stripeSize, DISPLAY_FONT, w - inner * 2 - subtitleW - 24)
  ctx.fillText(title, inner, bib.stripe / 2 + 2)

  // Distance as the bib number
  ctx.fillStyle = theme.number
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  fitFont(ctx, distance, 900, bib.numberSize, DISPLAY_FONT, w - pad * 2)
  ctx.fillText(distance, w / 2, bib.numberY)

  // Tear-off line
  ctx.save()
  ctx.setLineDash([14, 10])
  ctx.lineWidth = 3
  ctx.strokeStyle = theme.muted
  ctx.globalAlpha = 0.5
  ctx.beginPath()
  ctx.moveTo(pad / 2, bib.tearY)
  ctx.lineTo(w - pad / 2, bib.tearY)
  ctx.stroke()
  ctx.restore()

  const logoStyle = { chip: theme.logoChip, line: theme.logoChip ? '#6b7280' : theme.muted }
  // Club and event logos beside the name, with the sponsor logo centred beneath them
  const logosLeft = drawLogoPair(ctx, w - inner, bib.logos.y, bib.logos, assets, logoStyle)
  if (bib.sponsor) {
    const right = w - inner
    drawSponsor(ctx, (logosLeft + right) / 2, bib.sponsor.y, bib.sponsor.h, right - logosLeft, assets.sponsorLogo, logoStyle)
  }

  // Runner
  const r = runnerName(name)
  const textMaxW = logosLeft - inner - 24
  ctx.textAlign = 'left'
  ctx.fillStyle = theme.ink
  ctx.globalAlpha = r.nameAlpha
  fitFont(ctx, r.name, 800, bib.nameSize, DISPLAY_FONT, textMaxW)
  ctx.fillText(r.name, inner, bib.nameY)
  ctx.globalAlpha = 1

  // Date under the name, then the register line along the bottom
  ctx.fillStyle = theme.muted
  fitFont(ctx, event.details, 500, bib.detailsSize, TEXT_FONT, textMaxW)
  ctx.fillText(event.details, inner, bib.detailsY)
  ctx.fillStyle = theme.ink
  drawWebsite(ctx, event, inner, bib.footY, bib.footSize * WEBSITE_SCALE, { maxW: w - inner * 2 })

  const inset = 32
  drawPin(ctx, inset, inset)
  drawPin(ctx, w - inset, inset)
  drawPin(ctx, inset, h - inset)
  drawPin(ctx, w - inset, h - inset)

  ctx.restore()
}

function draw(ctx, layout, theme, data) {
  const hintY = (layout.headline.y + layout.bib.y) / 2 + 20
  drawPhotoFill(ctx, photoFrame(layout), data.photo, theme, data.assets.background, hintY)
  drawPhotoHeadline(ctx, data.headline, layout, Boolean(data.photo || data.assets.background), theme)
  drawBib(ctx, layout.bib, theme, data)
}

const bibDesign = { label: 'Bib', layouts, photoFrame, draw }

export default bibDesign
