/** Load a public image and return a PNG data URL for PDF and Excel embedding. */
export async function imageToPngDataUrl(src: string, maxEdge = 900): Promise<string | null> {
  try {
    const absolute =
      src.startsWith("data:") || src.startsWith("http://") || src.startsWith("https://")
        ? src
        : `${window.location.origin}${src.startsWith("/") ? "" : "/"}${src}`

    const image = await loadHtmlImage(absolute)
    const width = image.naturalWidth || image.width
    const height = image.naturalHeight || image.height
    if (!width || !height) return null

    const scale = Math.min(1, maxEdge / Math.max(width, height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.max(1, Math.round(width * scale))
    canvas.height = Math.max(1, Math.round(height * scale))
    const ctx = canvas.getContext("2d")
    if (!ctx) return null
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL("image/png")
  } catch {
    return null
  }
}

function loadHtmlImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const el = new Image()
    el.decoding = "async"
    el.onload = () => resolve(el)
    el.onerror = () => reject(new Error("Image failed"))
    el.src = src
  })
}

export async function rasterizePaths(paths: string[]): Promise<Record<string, string>> {
  const images: Record<string, string> = {}
  await Promise.all(
    paths.map(async (path) => {
      const data = await imageToPngDataUrl(path)
      if (data) images[path] = data
    })
  )
  return images
}
