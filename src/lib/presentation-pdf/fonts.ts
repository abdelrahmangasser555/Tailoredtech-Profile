import { Font } from "@react-pdf/renderer"

let registered = false
let registerPromise: Promise<void> | null = null

async function toDataUrl(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load font: ${url}`)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error ?? new Error("Font read failed"))
    reader.readAsDataURL(blob)
  })
}

/**
 * Register presentation PDF fonts once (TTF only — woff2 triggers
 * DataView RangeError in @react-pdf / fontkit).
 */
export async function registerPresentationPdfFonts(origin: string) {
  if (registered) return
  if (registerPromise) return registerPromise

  registerPromise = (async () => {
    const base = origin.replace(/\/$/, "")

    const [sans400, sans500, mono400, mono500] = await Promise.all([
      toDataUrl(`${base}/fonts/Geist-Regular.ttf`),
      toDataUrl(`${base}/fonts/Geist-Medium.ttf`),
      toDataUrl(`${base}/fonts/GeistMono-Regular.ttf`),
      toDataUrl(`${base}/fonts/GeistMono-Medium.ttf`),
    ])

    Font.register({
      family: "GeistSans",
      fonts: [
        { src: sans400, fontWeight: 400 },
        { src: sans500, fontWeight: 500 },
      ],
    })

    Font.register({
      family: "GeistMono",
      fonts: [
        { src: mono400, fontWeight: 400 },
        { src: mono500, fontWeight: 500 },
      ],
    })

    // Pixel Circle ships as woff2 only — use Mono Medium for display headings in PDF
    Font.register({
      family: "GeistPixel",
      fonts: [{ src: mono500, fontWeight: 500 }],
    })

    Font.registerHyphenationCallback((word) => [word])
    registered = true
  })().catch((err) => {
    registerPromise = null
    throw err
  })

  return registerPromise
}
