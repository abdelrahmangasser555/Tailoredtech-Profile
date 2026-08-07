import { NextResponse } from "next/server"

export const runtime = "nodejs"

type Preview = {
  url: string
  title: string | null
  description: string | null
  image: string | null
  siteName: string | null
  favicon: string | null
}

function pickMeta(html: string, keys: string[]): string | null {
  for (const key of keys) {
    const prop = new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["']`,
      "i"
    )
    const prop2 = new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["']`,
      "i"
    )
    const m = html.match(prop) || html.match(prop2)
    if (m?.[1]) return decodeHTMLEntities(m[1])
  }
  return null
}

function pickTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return m?.[1] ? decodeHTMLEntities(m[1].trim()) : null
}

function decodeHTMLEntities(str: string) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function absoluteUrl(base: string, maybe: string | null): string | null {
  if (!maybe) return null
  try {
    return new URL(maybe, base).toString()
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const target = searchParams.get("url")

  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 })
  }

  let parsed: URL
  try {
    parsed = new URL(target)
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json({ error: "Invalid protocol" }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 })
  }

  try {
    const res = await fetch(parsed.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; TailoredTechNotesBot/1.0; +https://tailoredtech.io)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      next: { revalidate: 60 * 60 * 24 },
      signal: AbortSignal.timeout(8000),
    })

    const html = await res.text()
    const title =
      pickMeta(html, ["og:title", "twitter:title"]) || pickTitle(html)
    const description = pickMeta(html, [
      "og:description",
      "twitter:description",
      "description",
    ])
    const image = absoluteUrl(
      parsed.origin,
      pickMeta(html, ["og:image", "twitter:image"])
    )
    const siteName =
      pickMeta(html, ["og:site_name"]) || parsed.hostname.replace(/^www\./, "")
    const favicon =
      absoluteUrl(
        parsed.origin,
        pickMeta(html, ["og:image:secure_url"])
      ) || `${parsed.origin}/favicon.ico`

    // Prefer link rel icon
    const iconMatch =
      html.match(
        /<link[^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["'][^>]+href=["']([^"']+)["']/i
      ) ||
      html.match(
        /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["']/i
      )
    const faviconResolved = iconMatch?.[1]
      ? absoluteUrl(parsed.origin, iconMatch[1])
      : favicon

    const preview: Preview = {
      url: parsed.toString(),
      title,
      description,
      image,
      siteName,
      favicon: faviconResolved,
    }

    return NextResponse.json(preview, {
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    })
  } catch {
    return NextResponse.json(
      {
        url: parsed.toString(),
        title: parsed.hostname,
        description: null,
        image: null,
        siteName: parsed.hostname.replace(/^www\./, ""),
        favicon: `${parsed.origin}/favicon.ico`,
      } satisfies Preview,
      { status: 200 }
    )
  }
}
