// Resolves to null (instead of rejecting) so missing brand files fall back to placeholders.
export function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

// Crops away the plain white margin around a logo so it fills its space on the card.
// Returns a canvas (drawable like an image) or the original image if there's nothing to trim.
export function trimWhitespace(image, threshold = 240) {
  // Find the content box on a small copy for speed, then crop the full-size image.
  const scan = Math.min(1, 600 / Math.max(image.width, image.height))
  const sw = Math.max(1, Math.round(image.width * scan))
  const sh = Math.max(1, Math.round(image.height * scan))
  const probe = document.createElement('canvas')
  probe.width = sw
  probe.height = sh
  const pctx = probe.getContext('2d', { willReadFrequently: true })
  pctx.drawImage(image, 0, 0, sw, sh)
  const { data } = pctx.getImageData(0, 0, sw, sh)

  let top = sh
  let left = sw
  let right = -1
  let bottom = -1
  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const i = (y * sw + x) * 4
      const isInk = data[i + 3] > 16 && (data[i] < threshold || data[i + 1] < threshold || data[i + 2] < threshold)
      if (!isInk) continue
      if (x < left) left = x
      if (x > right) right = x
      if (y < top) top = y
      if (y > bottom) bottom = y
    }
  }
  if (right < 0) return image

  const pad = 0.03 * Math.max(right - left, bottom - top)
  const x0 = Math.max(0, (left - pad) / scan)
  const y0 = Math.max(0, (top - pad) / scan)
  const x1 = Math.min(image.width, (right + 1 + pad) / scan)
  const y1 = Math.min(image.height, (bottom + 1 + pad) / scan)
  const out = document.createElement('canvas')
  out.width = Math.round(x1 - x0)
  out.height = Math.round(y1 - y0)
  out.getContext('2d').drawImage(image, x0, y0, out.width, out.height, 0, 0, out.width, out.height)
  return shrinkInSteps(out, LOGO_MAX)
}

// Logos are drawn at most ~460px wide (story, 2x download); keep some headroom.
const LOGO_MAX = 900

// Halves an image repeatedly until it's no wider/taller than `max`. Shrinking in
// steps keeps fine detail crisp; one big jump blurs it in some browsers.
export function shrinkInSteps(source, max) {
  let current = source
  while (Math.max(current.width, current.height) > max) {
    const factor = Math.max(0.5, max / Math.max(current.width, current.height))
    const next = document.createElement('canvas')
    next.width = Math.round(current.width * factor)
    next.height = Math.round(current.height * factor)
    const ctx = next.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(current, 0, 0, next.width, next.height)
    current = next
  }
  return current
}

const TRIMMED = new Set(['eventLogo', 'organizerLogo', 'sponsorLogo'])

export async function loadAssets(paths) {
  const entries = await Promise.all(
    Object.entries(paths).map(async ([key, src]) => {
      const image = await loadImage(src)
      return [key, image && TRIMMED.has(key) ? trimWhitespace(image) : image]
    }),
  )
  return Object.fromEntries(entries)
}

// Cards are mostly photo, so high-quality JPEG keeps them sharp at a fraction
// of PNG's size (a 2160x3840 photo card is ~2MB instead of ~12MB).
export const EXPORT_TYPE = { mime: 'image/jpeg', extension: 'jpg', quality: 0.92 }

export function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not create image'))),
      EXPORT_TYPE.mime,
      EXPORT_TYPE.quality,
    )
  })
}
