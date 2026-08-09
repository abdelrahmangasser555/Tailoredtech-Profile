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
 * Register Latin + Arabic fonts for bilingual invoice PDFs (TTF only).
 */
export async function registerInvoicePdfFonts(origin: string) {
  if (registered) return
  if (registerPromise) return registerPromise

  registerPromise = (async () => {
    const base = origin.replace(/\/$/, "")

    const [sans400, sans500, ar400, ar500] = await Promise.all([
      toDataUrl(`${base}/fonts/NotoSans-Regular.ttf`),
      toDataUrl(`${base}/fonts/NotoSans-Medium.ttf`),
      toDataUrl(`${base}/fonts/NotoSansArabic-Regular.ttf`),
      toDataUrl(`${base}/fonts/NotoSansArabic-Medium.ttf`),
    ])

    Font.register({
      family: "InvoiceSans",
      fonts: [
        { src: sans400, fontWeight: 400 },
        { src: sans500, fontWeight: 500 },
      ],
    })

    Font.register({
      family: "InvoiceArabic",
      fonts: [
        { src: ar400, fontWeight: 400 },
        { src: ar500, fontWeight: 500 },
      ],
    })

    Font.registerHyphenationCallback((word) => [word])
    registered = true
  })().catch((err) => {
    registerPromise = null
    throw err
  })

  return registerPromise
}
