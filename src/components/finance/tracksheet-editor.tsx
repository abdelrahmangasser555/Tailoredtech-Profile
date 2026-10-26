"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
} from "lucide-react"
import { toast } from "sonner"
import type { Tracksheet, TracksheetItem } from "@/lib/tracksheets/types"
import {
  TRACKSHEET_STATUSES,
  TRACKSHEET_TYPES,
  emptyTracksheetItem,
  tracksheetUid,
} from "@/lib/tracksheets/types"
import { TRACKSHEET_PALETTES } from "@/lib/tracksheets/palettes"
import {
  addChild,
  itemDepth,
  mapItemById,
  moveItem,
  removeItem,
  updateItem,
} from "@/lib/tracksheets/tree"
import { CloneTracksheetButton } from "@/components/finance/tracksheet-clone"
import { TracksheetExcelButton, TracksheetPdfButton } from "@/components/finance/tracksheet-export"
import { TracksheetPreview } from "@/components/finance/tracksheet-preview"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

const MAX_ITEM_DEPTH = 3

async function uploadImage(file: File, slug: string) {
  const form = new FormData()
  form.set("file", file)
  form.set("slug", slug)
  const res = await fetch("/api/finance/upload", { method: "POST", body: form })
  const data = (await res.json()) as { path?: string; error?: string }
  if (!res.ok || !data.path) throw new Error(data.error || "Upload failed")
  return data.path
}

export function TracksheetEditor({
  initial,
  isNew = false,
}: {
  initial: Tracksheet
  isNew?: boolean
}) {
  const router = useRouter()
  const [sheet, setSheet] = useState(initial)
  const [saving, setSaving] = useState(false)

  function patch(partial: Partial<Tracksheet>) {
    setSheet((prev) => ({ ...prev, ...partial }))
  }

  function patchItem(id: string, fn: (item: TracksheetItem) => TracksheetItem) {
    setSheet((prev) => ({
      ...prev,
      categories: prev.categories.map((category) => ({
        ...category,
        items: mapItemById(category.items, id, fn),
      })),
    }))
  }

  async function save() {
    if (saving) return
    if (!sheet.projectName.trim() && !sheet.title.trim()) {
      toast.error("Add a project name or a title")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/finance/tracksheets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tracksheet: sheet }),
      })
      const data = (await res.json()) as { error?: string; tracksheet?: Tracksheet }
      if (!res.ok || !data.tracksheet) {
        toast.error(data.error || "Save failed")
        return
      }
      toast.success("Tracksheet saved")
      setSheet(data.tracksheet)
      if (isNew) {
        router.replace(`/finance/tracksheets/${data.tracksheet.id}`)
      }
      router.refresh()
    } catch {
      toast.error("Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!confirm("Delete this tracksheet?")) return
    setSaving(true)
    try {
      const res = await fetch("/api/finance/tracksheets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteId: sheet.id }),
      })
      if (!res.ok) {
        toast.error("Delete failed")
        return
      }
      toast.success("Deleted")
      router.push("/finance/tracksheets")
      router.refresh()
    } catch {
      toast.error("Delete failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" className="rounded-none px-0">
          <Link href="/finance/tracksheets">
            <ArrowLeft className="size-4" />
            Tracksheets
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <TracksheetPdfButton sheet={sheet} />
          <TracksheetExcelButton sheet={sheet} />
          {isNew ? null : <CloneTracksheetButton sheet={sheet} />}
          <Button type="button" variant="outline" className="rounded-none" disabled={saving || isNew} onClick={() => void remove()}>
            <Trash2 className="size-4" />
            Delete
          </Button>
          <Button type="button" className="rounded-none" disabled={saving} onClick={() => void save()}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save
          </Button>
        </div>
      </div>

      <section className="grid gap-4 border border-foreground/10 bg-white p-5 md:grid-cols-2">
        <Field label="Project name">
          <Input value={sheet.projectName} onChange={(e) => patch({ projectName: e.target.value })} placeholder="Fleet safety platform" className="rounded-none" />
        </Field>
        <Field label="Title">
          <Input value={sheet.title} onChange={(e) => patch({ title: e.target.value })} placeholder="Module inside the project" className="rounded-none" />
        </Field>
        <Field label="Description" className="md:col-span-2">
          <Textarea value={sheet.description} onChange={(e) => patch({ description: e.target.value })} rows={3} className="rounded-none" />
        </Field>
        <Field label="Ref number">
          <Input value={sheet.refNumber} onChange={(e) => patch({ refNumber: e.target.value })} placeholder="TS-001" className="rounded-none" />
        </Field>
        <Field label="Client name">
          <Input value={sheet.clientName} onChange={(e) => patch({ clientName: e.target.value })} className="rounded-none" />
        </Field>
      </section>

      <section className="border border-foreground/10 bg-white p-5">
        <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/40">Palette</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TRACKSHEET_PALETTES.map((palette) => {
            const active = sheet.paletteId === palette.id
            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => patch({ paletteId: palette.id })}
                className={cn(
                  "flex items-center gap-2 border px-3 py-2 text-left text-sm",
                  active ? "border-foreground" : "border-foreground/15"
                )}
              >
                <span className="flex">
                  <span className="size-4" style={{ background: palette.primary }} />
                  <span className="size-4 border border-black/10" style={{ background: palette.accent }} />
                  <span className="size-4 border border-black/10" style={{ background: palette.paper }} />
                </span>
                {palette.name}
              </button>
            )
          })}
        </div>
        <div className="mt-5 flex flex-wrap gap-5">
          <Toggle
            label="Numbering"
            hint="1, 1.1, 1.1.1"
            checked={sheet.numbering.enabled}
            onChange={(enabled) => patch({ numbering: { enabled } })}
          />
          <Toggle
            label="Status"
            checked={sheet.columns.status}
            onChange={(status) => patch({ columns: { ...sheet.columns, status } })}
          />
          <Toggle
            label="Type"
            checked={sheet.columns.type}
            onChange={(type) => patch({ columns: { ...sheet.columns, type } })}
          />
          <Toggle
            label="Images"
            checked={sheet.columns.images}
            onChange={(images) => patch({ columns: { ...sheet.columns, images } })}
          />
          <Toggle
            label="Target date"
            checked={sheet.columns.targetDate}
            onChange={(targetDate) => patch({ columns: { ...sheet.columns, targetDate } })}
          />
        </div>
      </section>

      <section className="border border-foreground/10 bg-white p-5">
        <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/40">Sheet layout</p>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <Field label="Items column heading">
            <Input
              value={sheet.display.itemColumnLabel}
              onChange={(e) =>
                patch({ display: { ...sheet.display, itemColumnLabel: e.target.value } })
              }
              placeholder="Action items"
              className="rounded-none"
            />
          </Field>
          <Field label="Footnote position">
            <select
              value={sheet.display.footnote.position}
              onChange={(e) =>
                patch({
                  display: {
                    ...sheet.display,
                    footnote: {
                      ...sheet.display.footnote,
                      position: e.target.value === "before" ? "before" : "after",
                    },
                  },
                })
              }
              className="mt-1 h-9 w-full border border-foreground/15 bg-white px-2 text-sm"
            >
              <option value="before">Before table</option>
              <option value="after">After table</option>
            </select>
          </Field>
        </div>
        <div className="mt-3 flex flex-wrap gap-5">
          <Toggle
            label="Footnote"
            checked={sheet.display.footnote.enabled}
            onChange={(enabled) =>
              patch({
                display: {
                  ...sheet.display,
                  footnote: { ...sheet.display.footnote, enabled },
                },
              })
            }
          />
          <Toggle
            label="Background accent"
            checked={sheet.display.decor.enabled}
            onChange={(enabled) =>
              patch({
                display: { ...sheet.display, decor: { ...sheet.display.decor, enabled } },
              })
            }
          />
          <Toggle
            label="Table cell borders"
            checked={sheet.display.tableBorders}
            onChange={(tableBorders) =>
              patch({
                display: { ...sheet.display, tableBorders },
              })
            }
          />
        </div>
        {sheet.display.footnote.enabled ? (
          <Field label="Footnote (markdown)" className="mt-4">
            <Textarea
              value={sheet.display.footnote.markdown}
              onChange={(e) =>
                patch({
                  display: {
                    ...sheet.display,
                    footnote: { ...sheet.display.footnote, markdown: e.target.value },
                  },
                })
              }
              rows={4}
              className="rounded-none font-mono text-xs"
            />
          </Field>
        ) : null}
        {sheet.display.decor.enabled ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label="Accent style">
              <select
                value={sheet.display.decor.variant}
                onChange={(e) =>
                  patch({
                    display: {
                      ...sheet.display,
                      decor: {
                        ...sheet.display.decor,
                        variant: e.target.value as typeof sheet.display.decor.variant,
                      },
                    },
                  })
                }
                className="mt-1 h-9 w-full border border-foreground/15 bg-white px-2 text-sm"
              >
                <option value="dotted-ring-tl">Dotted ring (top left)</option>
                <option value="corner-cut-tr">Corner cut (top right)</option>
                <option value="corner-cut-bl">Corner cut (bottom left)</option>
                <option value="none">None</option>
              </select>
            </Field>
            <Field label="Accent color">
              <input
                type="color"
                value={sheet.display.decor.color}
                onChange={(e) =>
                  patch({
                    display: {
                      ...sheet.display,
                      decor: { ...sheet.display.decor, color: e.target.value },
                    },
                  })
                }
                className="mt-1 h-9 w-full border border-foreground/15 bg-white p-1"
              />
            </Field>
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 border border-foreground/10 bg-white p-5 md:grid-cols-2">
        <LogoField
          label="Vendor logo"
          src={sheet.vendorLogo}
          onChange={(vendorLogo) => patch({ vendorLogo })}
          slug={`tracksheet-${sheet.id}-vendor`}
        />
        <LogoField
          label="Client logo"
          src={sheet.clientLogo}
          onChange={(clientLogo) => patch({ clientLogo })}
          slug={`tracksheet-${sheet.id}-client`}
        />
        <p className="md:col-span-2 text-xs text-foreground/45">
          Logos sit beside each other as partners on the sheet. Files are stored locally under public uploads.
        </p>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-pixel-circle text-2xl tracking-tight">Categories</h2>
          <Button
            type="button"
            variant="outline"
            className="rounded-none"
            onClick={() =>
              patch({
                categories: [
                  ...sheet.categories,
                  { id: tracksheetUid("cat"), title: "New category", items: [emptyTracksheetItem()] },
                ],
              })
            }
          >
            <Plus className="size-4" />
            Category
          </Button>
        </div>

        {sheet.categories.map((category, index) => (
          <div key={category.id} className="border border-foreground/10 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-8 font-mono text-xs text-foreground/40">
                {sheet.numbering.enabled ? index + 1 : ""}
              </span>
              <Input
                value={category.title}
                onChange={(e) =>
                  patch({
                    categories: sheet.categories.map((row) =>
                      row.id === category.id ? { ...row, title: e.target.value } : row
                    ),
                  })
                }
                className="rounded-none"
              />
              <IconButton label="Move up" disabled={index === 0} onClick={() => moveCategory(index, -1)}>
                <ArrowUp className="size-4" />
              </IconButton>
              <IconButton label="Move down" disabled={index === sheet.categories.length - 1} onClick={() => moveCategory(index, 1)}>
                <ArrowDown className="size-4" />
              </IconButton>
              <IconButton
                label="Delete category"
                onClick={() => patch({ categories: sheet.categories.filter((row) => row.id !== category.id) })}
              >
                <Trash2 className="size-4" />
              </IconButton>
            </div>
            <div className="mt-4 space-y-3 pl-2">
              {category.items.map((item, itemIndex) => (
                <ItemEditor
                  key={item.id}
                  item={item}
                  depth={1}
                  numbering={sheet.numbering.enabled ? `${index + 1}` : ""}
                  index={itemIndex}
                  siblingCount={category.items.length}
                  showStatus={sheet.columns.status}
                  showType={sheet.columns.type}
                  showImages={sheet.columns.images}
                  showTargetDate={sheet.columns.targetDate}
                  slug={`tracksheet-${sheet.id}`}
                  onPatchItem={patchItem}
                  onChange={(next) =>
                    patch({
                      categories: sheet.categories.map((row) =>
                        row.id === category.id ? { ...row, items: updateItem(row.items, item.id, next) } : row
                      ),
                    })
                  }
                  onRemove={() =>
                    patch({
                      categories: sheet.categories.map((row) =>
                        row.id === category.id ? { ...row, items: removeItem(row.items, item.id) } : row
                      ),
                    })
                  }
                  onAddChild={() => {
                    const depth = itemDepth(category.items, item.id) ?? 1
                    if (depth >= MAX_ITEM_DEPTH) {
                      toast.error("That's as deep as the numbering goes")
                      return
                    }
                    patch({
                      categories: sheet.categories.map((row) =>
                        row.id === category.id ? { ...row, items: addChild(row.items, item.id) } : row
                      ),
                    })
                  }}
                  onMove={(direction) =>
                    patch({
                      categories: sheet.categories.map((row) =>
                        row.id === category.id ? { ...row, items: moveItem(row.items, item.id, direction) } : row
                      ),
                    })
                  }
                />
              ))}
              <Button
                type="button"
                variant="ghost"
                className="rounded-none"
                onClick={() =>
                  patch({
                    categories: sheet.categories.map((row) =>
                      row.id === category.id ? { ...row, items: [...row.items, emptyTracksheetItem()] } : row
                    ),
                  })
                }
              >
                <Plus className="size-4" />
                Item
              </Button>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 font-pixel-circle text-2xl tracking-tight">Preview</h2>
        <TracksheetPreview sheet={sheet} />
      </section>
    </div>
  )

  function moveCategory(index: number, direction: -1 | 1) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= sheet.categories.length) return
    const next = sheet.categories.slice()
    const [row] = next.splice(index, 1)
    next.splice(nextIndex, 0, row!)
    patch({ categories: next })
  }
}

function ItemEditor({
  item,
  depth,
  numbering,
  index,
  siblingCount,
  showStatus,
  showType,
  showImages,
  showTargetDate,
  slug,
  onPatchItem,
  onChange,
  onRemove,
  onAddChild,
  onMove,
}: {
  item: TracksheetItem
  depth: number
  numbering: string
  index: number
  siblingCount: number
  showStatus: boolean
  showType: boolean
  showImages: boolean
  showTargetDate: boolean
  slug: string
  onPatchItem: (id: string, fn: (item: TracksheetItem) => TracksheetItem) => void
  onChange: (item: TracksheetItem) => void
  onRemove: () => void
  onAddChild: () => void
  onMove: (direction: -1 | 1) => void
}) {
  const number = numbering ? `${numbering}.${index + 1}` : ""

  return (
    <div className="border border-foreground/10 p-3" style={{ marginLeft: (depth - 1) * 16 }}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {number ? <span className="font-mono text-[11px] text-foreground/45">{number}</span> : null}
        <div className="ml-auto flex items-center gap-1">
          <IconButton label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
            <ArrowUp className="size-3.5" />
          </IconButton>
          <IconButton label="Move down" disabled={index === siblingCount - 1} onClick={() => onMove(1)}>
            <ArrowDown className="size-3.5" />
          </IconButton>
          <IconButton label="Delete item" onClick={onRemove}>
            <Trash2 className="size-3.5" />
          </IconButton>
        </div>
      </div>
      <Input
        value={item.title}
        onChange={(e) => onChange({ ...item, title: e.target.value })}
        placeholder="Item title"
        className="rounded-none"
      />
      <Textarea
        value={item.description}
        onChange={(e) => onChange({ ...item, description: e.target.value })}
        placeholder="Description under the title"
        rows={2}
        className="mt-2 rounded-none"
      />
      {showTargetDate ? (
        <label className="mt-2 block text-xs text-foreground/50">
          Target date
          <Input
            type="date"
            value={item.targetDate ? item.targetDate.slice(0, 10) : ""}
            onChange={(e) => onChange({ ...item, targetDate: e.target.value })}
            className="mt-1 rounded-none"
          />
        </label>
      ) : null}
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {showStatus ? (
          <label className="block text-xs text-foreground/50">
            Status
            <select
              value={item.status}
              onChange={(e) => onChange({ ...item, status: e.target.value as TracksheetItem["status"] })}
              className="mt-1 h-9 w-full border border-foreground/15 bg-white px-2 text-sm text-foreground"
            >
              {TRACKSHEET_STATUSES.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
        {showType ? (
          <label className="block text-xs text-foreground/50">
            Type
            <select
              value={item.type}
              onChange={(e) => onChange({ ...item, type: e.target.value as TracksheetItem["type"] })}
              className="mt-1 h-9 w-full border border-foreground/15 bg-white px-2 text-sm text-foreground"
            >
              {TRACKSHEET_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
      {showType && item.type === "custom" ? (
        <div className="mt-2 flex flex-wrap items-end gap-2">
          <label className="block min-w-40 flex-1 text-xs text-foreground/50">
            Custom type
            <Input
              value={item.customTypeLabel}
              onChange={(e) => onChange({ ...item, customTypeLabel: e.target.value })}
              className="mt-1 rounded-none"
            />
          </label>
          <label className="block text-xs text-foreground/50">
            Badge
            <input
              type="color"
              value={item.customTypeColor || "#0A0A0A"}
              onChange={(e) => onChange({ ...item, customTypeColor: e.target.value })}
              className="mt-1 h-9 w-14 border border-foreground/15 bg-white p-1"
            />
          </label>
        </div>
      ) : null}
      {showImages ? (
        <ItemImages
          item={item}
          slug={slug}
          onAppend={(paths) =>
            onPatchItem(item.id, (current) => ({ ...current, images: [...current.images, ...paths] }))
          }
          onRemove={(src) =>
            onPatchItem(item.id, (current) => ({
              ...current,
              images: current.images.filter((path) => path !== src),
            }))
          }
        />
      ) : null}
      {item.children.map((child, childIndex) => (
        <div key={child.id} className="mt-3">
          <ItemEditor
            item={child}
            depth={depth + 1}
            numbering={number || numbering}
            index={childIndex}
            siblingCount={item.children.length}
            showStatus={showStatus}
            showType={showType}
            showImages={showImages}
            showTargetDate={showTargetDate}
            slug={slug}
            onPatchItem={onPatchItem}
            onChange={(next) => onChange({ ...item, children: updateItem(item.children, child.id, next) })}
            onRemove={() => onChange({ ...item, children: removeItem(item.children, child.id) })}
            onAddChild={() => {
              if (depth + 1 >= MAX_ITEM_DEPTH) {
                toast.error("That's as deep as the numbering goes")
                return
              }
              onChange({ ...item, children: addChild(item.children, child.id) })
            }}
            onMove={(direction) => onChange({ ...item, children: moveItem(item.children, child.id, direction) })}
          />
        </div>
      ))}
      {depth < MAX_ITEM_DEPTH ? (
        <Button type="button" variant="ghost" className="mt-2 rounded-none" onClick={onAddChild}>
          <Plus className="size-3.5" />
          Sub-item
        </Button>
      ) : null}
    </div>
  )
}

function ItemImages({
  item,
  slug,
  onAppend,
  onRemove,
}: {
  item: TracksheetItem
  slug: string
  onAppend: (paths: string[]) => void
  onRemove: (src: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function onFiles(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    try {
      const paths: string[] = []
      for (const file of Array.from(files)) {
        paths.push(await uploadImage(file, slug))
      }
      onAppend(paths)
      toast.success(paths.length > 1 ? "Images uploaded" : "Image uploaded")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        {item.images.map((src) => (
          <div key={src} className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="h-16 w-24 border border-foreground/10 object-cover" />
            <button
              type="button"
              className="absolute top-0 right-0 bg-foreground px-1 text-[10px] text-background"
              onClick={() => onRemove(src)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => void onFiles(e.target.files)} />
      <Button type="button" variant="ghost" className="mt-2 rounded-none" disabled={uploading} onClick={() => inputRef.current?.click()}>
        {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <ImagePlus className="size-3.5" />}
        Images
      </Button>
    </div>
  )
}

function LogoField({
  label,
  src,
  onChange,
  slug,
}: {
  label: string
  src: string | null
  onChange: (path: string | null) => void
  slug: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function onFile(file: File | undefined) {
    if (!file) return
    setUploading(true)
    try {
      onChange(await uploadImage(file, slug))
      toast.success("Logo uploaded")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <Label className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/40">{label}</Label>
      <div className="mt-2 flex items-center gap-3">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" className="h-12 max-w-32 border border-foreground/10 bg-white object-contain p-1" />
        ) : (
          <div className="flex h-12 w-24 items-center justify-center border border-dashed border-foreground/15 text-[10px] text-foreground/35">
            None
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => void onFile(e.target.files?.[0])} />
        <Button type="button" variant="outline" className="rounded-none" disabled={uploading} onClick={() => inputRef.current?.click()}>
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Upload
        </Button>
        {src ? (
          <Button type="button" variant="ghost" className="rounded-none" onClick={() => onChange(null)}>
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/40">{label}</span>
      {children}
    </label>
  )
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={(value) => onChange(value === true)} className="rounded-none" />
      <span>
        {label}
        {hint ? <span className="ml-2 font-mono text-[10px] text-foreground/40">{hint}</span> : null}
      </span>
    </label>
  )
}

function IconButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button type="button" variant="ghost" size="icon" className="rounded-none" aria-label={label} disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  )
}
