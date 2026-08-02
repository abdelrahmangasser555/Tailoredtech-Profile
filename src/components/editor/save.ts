"use client"

import { toast } from "sonner"

export async function saveContentItem<T>(opts: {
  kind: "presentations" | "services"
  id: string
  item: T
}): Promise<T> {
  const res = await fetch("/api/local-edit/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(opts),
  })
  const data = (await res.json()) as { item?: T; error?: string }
  if (!res.ok || !data.item) {
    throw new Error(data.error || "Save failed")
  }
  toast.success("Saved to JSON")
  return data.item
}
