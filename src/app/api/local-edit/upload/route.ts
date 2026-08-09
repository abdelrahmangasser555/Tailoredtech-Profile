import { NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { isLocalEditEnabled } from "@/lib/local-edit"

const ALLOWED = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
])

export async function POST(request: Request) {
  if (!isLocalEditEnabled()) {
    return NextResponse.json(
      { error: "Local edit is disabled" },
      { status: 403 }
    )
  }

  try {
    const form = await request.formData()
    const file = form.get("file")
    const slug = String(form.get("slug") ?? "misc")
      .replace(/[^a-zA-Z0-9-_]/g, "")
      .slice(0, 64)
    const kind = String(form.get("kind") ?? "presentations")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 })
    }

    if (!ALLOWED.has(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image type" },
        { status: 400 }
      )
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 8MB)" },
        { status: 400 }
      )
    }

    const ext =
      file.type === "image/png"
        ? "png"
        : file.type === "image/jpeg"
          ? "jpg"
          : file.type === "image/webp"
            ? "webp"
            : file.type === "image/gif"
              ? "gif"
              : "svg"

    const folder =
      kind === "services"
        ? "services"
        : kind === "notes"
          ? "notes"
          : "presentations"
    const dir = path.join(
      process.cwd(),
      "public",
      "assets",
      "uploads",
      folder,
      slug || "misc"
    )
    await fs.mkdir(dir, { recursive: true })

    const safeBase = (file.name || "image")
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .slice(0, 48)
    const stamp = Date.now().toString(36)
    const filename = `${safeBase || "image"}-${stamp}.${ext}`
    const dest = path.join(dir, filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(dest, buffer)

    const publicPath = `/assets/uploads/${folder}/${slug || "misc"}/${filename}`
    return NextResponse.json({ ok: true, src: publicPath })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
