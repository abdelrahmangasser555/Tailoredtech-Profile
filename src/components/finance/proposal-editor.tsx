"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  Upload,
  Save,
} from "lucide-react"
import { toast } from "sonner"
import type {
  FinanceBrand,
  FinanceProposal,
  ProposalFormatId,
  ProposalSolution,
} from "@/lib/finance/types"
import { emptyProposal } from "@/lib/finance/types"
import { ProposalPdfExportButton } from "@/components/finance-pdf/export-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

type FormatOption = {
  id: ProposalFormatId
  label: string
  description: string
}

export function ProposalEditor({
  initial,
  brands,
  formats,
  isNew = false,
}: {
  initial: FinanceProposal
  brands: FinanceBrand[]
  formats: FormatOption[]
  isNew?: boolean
}) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [proposal, setProposal] = useState<FinanceProposal>(initial)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  function patch(partial: Partial<FinanceProposal>) {
    setProposal((prev) => ({ ...prev, ...partial }))
  }

  function patchDisplay(partial: Partial<FinanceProposal["display"]>) {
    setProposal((prev) => ({
      ...prev,
      display: { ...prev.display, ...partial },
    }))
  }

  function updateSolution(id: string, next: ProposalSolution) {
    setProposal((prev) => ({
      ...prev,
      solutions: prev.solutions.map((s) => (s.id === id ? next : s)),
    }))
  }

  async function save() {
    if (saving) return
    if (!proposal.title.trim()) {
      toast.error("Title is required")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/finance/proposals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposal }),
      })
      const data = (await res.json()) as {
        error?: string
        proposal?: FinanceProposal
      }
      if (!res.ok) {
        toast.error(data.error || "Save failed")
        return
      }
      toast.success("Proposal saved")
      if (isNew && data.proposal) {
        router.replace(`/finance/proposals/${data.proposal.id}`)
        router.refresh()
      } else {
        router.refresh()
      }
    } catch {
      toast.error("Save failed")
    } finally {
      setSaving(false)
    }
  }

  async function remove() {
    if (!confirm("Delete this proposal?")) return
    setSaving(true)
    try {
      const res = await fetch("/api/finance/proposals", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteId: proposal.id }),
      })
      if (!res.ok) {
        toast.error("Delete failed")
        return
      }
      toast.success("Deleted")
      router.push("/finance/proposals")
      router.refresh()
    } catch {
      toast.error("Delete failed")
    } finally {
      setSaving(false)
    }
  }

  async function onUpload(file: File) {
    setUploading(true)
    try {
      const form = new FormData()
      form.set("file", file)
      form.set("slug", proposal.id)
      const res = await fetch("/api/finance/upload", {
        method: "POST",
        body: form,
      })
      const data = (await res.json()) as { path?: string; error?: string }
      if (!res.ok || !data.path) {
        toast.error(data.error || "Upload failed")
        return
      }
      patch({ icon: data.path })
      toast.success("Icon uploaded")
    } catch {
      toast.error("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/finance/proposals"
            className="mb-3 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/45 hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Proposals
          </Link>
          <h1 className="font-pixel-circle text-3xl tracking-tight">
            {isNew ? "New proposal" : "Edit proposal"}
          </h1>
          <p className="mt-1 text-sm text-foreground/50">
            Customize content, branding, and layout. One PDF page per proposal.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <ProposalPdfExportButton proposals={[proposal]} label="Download PDF" />
          {!isNew ? (
            <Button
              type="button"
              variant="ghost"
              className="rounded-none text-destructive"
              onClick={() => void remove()}
              disabled={saving}
            >
              <Trash2 className="size-4" />
              Delete
            </Button>
          ) : null}
          <Button
            type="button"
            className="rounded-none"
            onClick={() => void save()}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <Panel title="Basics">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title">
                <Input
                  value={proposal.title}
                  onChange={(e) => patch({ title: e.target.value })}
                  className="rounded-none"
                />
              </Field>
              <Field label="Subtitle">
                <Input
                  value={proposal.subtitle}
                  onChange={(e) => patch({ subtitle: e.target.value })}
                  className="rounded-none"
                  placeholder="Optional"
                />
              </Field>
              <Field label="Client">
                <Input
                  value={proposal.clientName}
                  onChange={(e) => patch({ clientName: e.target.value })}
                  className="rounded-none"
                />
              </Field>
              <Field label="Currency">
                <Input
                  value={proposal.currency}
                  onChange={(e) =>
                    patch({ currency: e.target.value.toUpperCase().slice(0, 3) })
                  }
                  className="rounded-none"
                />
              </Field>
              <Field label="Brand">
                <Select
                  value={proposal.brandId}
                  onValueChange={(v) =>
                    patch({ brandId: v as FinanceProposal["brandId"] })
                  }
                >
                  <SelectTrigger className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {brands.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Format">
                <Select
                  value={proposal.format}
                  onValueChange={(v) =>
                    patch({ format: v as ProposalFormatId })
                  }
                >
                  <SelectTrigger className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {formats.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Proposal icon">
                <div className="flex flex-wrap items-center gap-3">
                  {proposal.icon ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={proposal.icon}
                      alt=""
                      className="size-10 border border-foreground/10 object-contain bg-white"
                    />
                  ) : (
                    <div className="flex size-10 items-center justify-center border border-dashed border-foreground/15 text-[10px] text-foreground/35">
                      None
                    </div>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) void onUpload(file)
                      e.target.value = ""
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-none"
                    disabled={uploading}
                    onClick={() => fileRef.current?.click()}
                  >
                    {uploading ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Upload className="size-4" />
                    )}
                    Upload
                  </Button>
                  {proposal.icon ? (
                    <Button
                      type="button"
                      variant="ghost"
                      className="rounded-none"
                      onClick={() => patch({ icon: null })}
                    >
                      Remove
                    </Button>
                  ) : null}
                </div>
              </Field>
            </div>
          </Panel>

          <Panel title="Markdown">
            <p className="mb-2 text-xs text-foreground/45">
              Same light markdown as presentation printouts: headings, bold, lists.
            </p>
            <Textarea
              value={proposal.markdown}
              onChange={(e) => patch({ markdown: e.target.value })}
              className="min-h-36 rounded-none font-mono text-sm"
              placeholder={"### Scope\n\nDescribe the offer…"}
            />
          </Panel>

          <Panel
            title="Features"
            action={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-none"
                onClick={() =>
                  patch({
                    features: [
                      ...proposal.features,
                      { id: uid("f"), title: "Feature", description: "" },
                    ],
                  })
                }
              >
                <Plus className="size-3.5" />
                Add
              </Button>
            }
          >
            <div className="space-y-3">
              {proposal.features.map((f, i) => (
                <div
                  key={f.id}
                  className="grid gap-2 border border-foreground/10 p-3 sm:grid-cols-[1fr_1fr_auto]"
                >
                  <Input
                    value={f.title}
                    onChange={(e) => {
                      const features = [...proposal.features]
                      features[i] = { ...f, title: e.target.value }
                      patch({ features })
                    }}
                    className="rounded-none"
                    placeholder="Title"
                  />
                  <Input
                    value={f.description}
                    onChange={(e) => {
                      const features = [...proposal.features]
                      features[i] = { ...f, description: e.target.value }
                      patch({ features })
                    }}
                    className="rounded-none"
                    placeholder="Description"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="rounded-none"
                    onClick={() =>
                      patch({
                        features: proposal.features.filter((x) => x.id !== f.id),
                      })
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              {proposal.features.length === 0 ? (
                <p className="text-sm text-foreground/45">No features yet.</p>
              ) : null}
            </div>
          </Panel>

          <Panel
            title="Solutions & pricing"
            action={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-none"
                onClick={() =>
                  patch({
                    solutions: [
                      ...proposal.solutions,
                      {
                        id: uid("sol"),
                        name: "Solution",
                        description: "",
                        lineItems: [],
                        prices: [
                          { id: uid("price"), label: "Total", amount: 0 },
                        ],
                        discounts: [],
                      },
                    ],
                  })
                }
              >
                <Plus className="size-3.5" />
                Add solution
              </Button>
            }
          >
            <div className="space-y-5">
              {proposal.solutions.map((sol) => (
                <SolutionEditor
                  key={sol.id}
                  solution={sol}
                  onChange={(next) => updateSolution(sol.id, next)}
                  onRemove={() =>
                    patch({
                      solutions: proposal.solutions.filter((s) => s.id !== sol.id),
                    })
                  }
                  canRemove={proposal.solutions.length > 1}
                />
              ))}
            </div>
          </Panel>

          <Panel title="Comparison table">
            <ToggleRow
              id="cmp-enabled"
              label="Enable comparison"
              checked={proposal.comparison.enabled}
              onCheckedChange={(v) =>
                patch({
                  comparison: { ...proposal.comparison, enabled: v },
                })
              }
            />
            {proposal.comparison.enabled ? (
              <div className="mt-4 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Eyebrow">
                    <Input
                      value={proposal.comparison.eyebrow}
                      onChange={(e) =>
                        patch({
                          comparison: {
                            ...proposal.comparison,
                            eyebrow: e.target.value,
                          },
                        })
                      }
                      className="rounded-none"
                    />
                  </Field>
                  <Field label="Title">
                    <Input
                      value={proposal.comparison.title}
                      onChange={(e) =>
                        patch({
                          comparison: {
                            ...proposal.comparison,
                            title: e.target.value,
                          },
                        })
                      }
                      className="rounded-none"
                    />
                  </Field>
                </div>
                <p className="text-xs text-foreground/45">
                  Columns and rows are edited as JSON for now (same shape as
                  solutions comparison).
                </p>
                <Textarea
                  value={JSON.stringify(
                    {
                      columns: proposal.comparison.columns,
                      rows: proposal.comparison.rows,
                    },
                    null,
                    2
                  )}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value) as {
                        columns: FinanceProposal["comparison"]["columns"]
                        rows: FinanceProposal["comparison"]["rows"]
                      }
                      patch({
                        comparison: {
                          ...proposal.comparison,
                          columns: parsed.columns ?? [],
                          rows: parsed.rows ?? [],
                        },
                      })
                    } catch {
                      /* allow typing invalid JSON mid-edit */
                    }
                  }}
                  className="min-h-40 rounded-none font-mono text-xs"
                />
              </div>
            ) : null}
          </Panel>

          <Panel title="Footer">
            <ToggleRow
              id="footer-enabled"
              label="Show footer"
              checked={proposal.display.footer.enabled}
              onCheckedChange={(v) =>
                patchDisplay({
                  footer: { ...proposal.display.footer, enabled: v },
                })
              }
            />
            <div className="mt-3">
              <Field label="Footer text">
                <Input
                  value={proposal.display.footer.text}
                  onChange={(e) =>
                    patchDisplay({
                      footer: {
                        ...proposal.display.footer,
                        text: e.target.value,
                      },
                    })
                  }
                  className="rounded-none"
                />
              </Field>
              <p className="mt-1 text-xs text-foreground/40">
                Centered, small type at the bottom of each page.
              </p>
            </div>
          </Panel>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Panel title="Display">
            <div className="space-y-2.5">
              {(
                [
                  ["showMarkdown", "Markdown body"],
                  ["showFeatures", "Features"],
                  ["showBreakdown", "Price breakdown"],
                  ["showPrices", "Price summary"],
                  ["showComparison", "Comparison"],
                  ["showPageNumbers", "Page numbers"],
                ] as const
              ).map(([key, label]) => (
                <ToggleRow
                  key={key}
                  id={`disp-${key}`}
                  label={label}
                  checked={proposal.display[key]}
                  onCheckedChange={(v) => patchDisplay({ [key]: v })}
                />
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-foreground/45">
              {formats.find((f) => f.id === proposal.format)?.description}
            </p>
          </Panel>

          <BrandLogoPanel
            brands={brands}
            activeBrandId={proposal.brandId}
            proposalId={proposal.id}
          />

          <div className="border border-foreground/10 bg-white p-4">
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/40">
              Tip
            </p>
            <p className="mt-2 text-sm text-foreground/60">
              Save first, then download. Stack multiple proposals from the list
              page into one PDF.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

function SolutionEditor({
  solution,
  onChange,
  onRemove,
  canRemove,
}: {
  solution: ProposalSolution
  onChange: (next: ProposalSolution) => void
  onRemove: () => void
  canRemove: boolean
}) {
  return (
    <div className="border border-foreground/10 bg-[var(--section-light)]/40 p-4">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="grid flex-1 gap-2 sm:grid-cols-2">
          <Input
            value={solution.name}
            onChange={(e) => onChange({ ...solution, name: e.target.value })}
            className="rounded-none"
            placeholder="Solution name"
          />
          <Input
            value={solution.description}
            onChange={(e) =>
              onChange({ ...solution, description: e.target.value })
            }
            className="rounded-none"
            placeholder="Short description"
          />
        </div>
        {canRemove ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-none"
            onClick={onRemove}
          >
            <Trash2 className="size-4" />
          </Button>
        ) : null}
      </div>

      <SubBlock
        title="Line items"
        onAdd={() =>
          onChange({
            ...solution,
            lineItems: [
              ...solution.lineItems,
              { id: uid("li"), label: "Item", amount: 0, quantity: 1 },
            ],
          })
        }
      >
        {solution.lineItems.map((line, i) => (
          <div
            key={line.id}
            className="grid grid-cols-[1fr_64px_88px_auto] gap-2"
          >
            <Input
              value={line.label}
              onChange={(e) => {
                const lineItems = [...solution.lineItems]
                lineItems[i] = { ...line, label: e.target.value }
                onChange({ ...solution, lineItems })
              }}
              className="rounded-none"
              placeholder="Label"
            />
            <Input
              type="number"
              value={line.quantity ?? 1}
              onChange={(e) => {
                const lineItems = [...solution.lineItems]
                lineItems[i] = {
                  ...line,
                  quantity: Number(e.target.value) || 1,
                }
                onChange({ ...solution, lineItems })
              }}
              className="rounded-none"
              placeholder="Qty"
            />
            <Input
              type="number"
              value={line.amount}
              onChange={(e) => {
                const lineItems = [...solution.lineItems]
                lineItems[i] = {
                  ...line,
                  amount: Number(e.target.value) || 0,
                }
                onChange({ ...solution, lineItems })
              }}
              className="rounded-none"
              placeholder="Amount"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-none"
              onClick={() =>
                onChange({
                  ...solution,
                  lineItems: solution.lineItems.filter((x) => x.id !== line.id),
                })
              }
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </SubBlock>

      <SubBlock
        title="Named prices"
        onAdd={() =>
          onChange({
            ...solution,
            prices: [
              ...solution.prices,
              { id: uid("price"), label: "Price", amount: 0 },
            ],
          })
        }
      >
        {solution.prices.map((price, i) => (
          <div
            key={price.id}
            className="grid grid-cols-[1fr_100px_auto] gap-2"
          >
            <Input
              value={price.label}
              onChange={(e) => {
                const prices = [...solution.prices]
                prices[i] = { ...price, label: e.target.value }
                onChange({ ...solution, prices })
              }}
              className="rounded-none"
            />
            <Input
              type="number"
              value={price.amount}
              onChange={(e) => {
                const prices = [...solution.prices]
                prices[i] = {
                  ...price,
                  amount: Number(e.target.value) || 0,
                }
                onChange({ ...solution, prices })
              }}
              className="rounded-none"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-none"
              onClick={() =>
                onChange({
                  ...solution,
                  prices: solution.prices.filter((x) => x.id !== price.id),
                })
              }
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </SubBlock>

      <SubBlock
        title="Discounts"
        onAdd={() =>
          onChange({
            ...solution,
            discounts: [
              ...solution.discounts,
              { id: uid("d"), label: "Discount", amount: 0 },
            ],
          })
        }
      >
        {solution.discounts.map((d, i) => (
          <div
            key={d.id}
            className="grid grid-cols-[1fr_88px_88px_auto] gap-2"
          >
            <Input
              value={d.label}
              onChange={(e) => {
                const discounts = [...solution.discounts]
                discounts[i] = { ...d, label: e.target.value }
                onChange({ ...solution, discounts })
              }}
              className="rounded-none"
              placeholder="Label"
            />
            <Input
              type="number"
              value={d.amount ?? ""}
              onChange={(e) => {
                const discounts = [...solution.discounts]
                const val = e.target.value
                discounts[i] = {
                  ...d,
                  amount: val === "" ? undefined : Number(val) || 0,
                }
                onChange({ ...solution, discounts })
              }}
              className="rounded-none"
              placeholder="Amount"
            />
            <Input
              type="number"
              value={d.percent ?? ""}
              onChange={(e) => {
                const discounts = [...solution.discounts]
                const val = e.target.value
                discounts[i] = {
                  ...d,
                  percent: val === "" ? undefined : Number(val) || 0,
                }
                onChange({ ...solution, discounts })
              }}
              className="rounded-none"
              placeholder="% off"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-none"
              onClick={() =>
                onChange({
                  ...solution,
                  discounts: solution.discounts.filter((x) => x.id !== d.id),
                })
              }
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
      </SubBlock>
    </div>
  )
}

function SubBlock({
  title,
  onAdd,
  children,
}: {
  title: string
  onAdd: () => void
  children: React.ReactNode
}) {
  return (
    <div className="mt-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/40">
          {title}
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="cursor-pointer font-mono text-[10px] tracking-wider uppercase text-foreground/45 hover:text-foreground"
        >
          + Add
        </button>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Panel({
  title,
  action,
  children,
}: {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="border border-foreground/10 bg-white p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-mono text-[11px] tracking-[0.18em] uppercase text-foreground/45">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label className="font-mono text-[10px] tracking-[0.14em] uppercase text-foreground/40">
        {label}
      </Label>
      {children}
    </div>
  )
}

function ToggleRow({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-2.5 text-sm text-foreground/80"
      )}
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onCheckedChange(v === true)}
        className="rounded-none"
      />
      <span>{label}</span>
    </label>
  )
}

function BrandLogoPanel({
  brands,
  activeBrandId,
  proposalId,
}: {
  brands: FinanceBrand[]
  activeBrandId: FinanceProposal["brandId"]
  proposalId: string
}) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const brand = brands.find((b) => b.id === activeBrandId) ?? brands[0]

  async function upload(file: File) {
    setBusy(true)
    try {
      const form = new FormData()
      form.set("file", file)
      form.set("slug", `brand-${activeBrandId}`)
      const up = await fetch("/api/finance/upload", {
        method: "POST",
        body: form,
      })
      const upData = (await up.json()) as { path?: string; error?: string }
      if (!up.ok || !upData.path) {
        toast.error(upData.error || "Upload failed")
        return
      }
      const res = await fetch("/api/finance/brands", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: activeBrandId, logo: upData.path }),
      })
      if (!res.ok) {
        toast.error("Could not save brand logo")
        return
      }
      toast.success(`${brand?.name ?? "Brand"} logo updated`)
      router.refresh()
    } catch {
      toast.error("Upload failed")
    } finally {
      setBusy(false)
    }
  }

  async function clearLogo() {
    setBusy(true)
    try {
      const res = await fetch("/api/finance/brands", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId: activeBrandId, logo: null }),
      })
      if (!res.ok) {
        toast.error("Could not clear logo")
        return
      }
      toast.success("Brand logo cleared")
      router.refresh()
    } catch {
      toast.error("Clear failed")
    } finally {
      setBusy(false)
    }
  }

  return (
    <Panel title={`${brand?.name ?? "Brand"} logo`}>
      <div className="flex flex-wrap items-center gap-3">
        {brand?.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={brand.logo}
            alt=""
            className="h-10 max-w-[120px] border border-foreground/10 object-contain bg-white p-1"
          />
        ) : (
          <div className="flex h-10 items-center justify-center border border-dashed border-foreground/15 px-3 text-[10px] text-foreground/35">
            Text name
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void upload(file)
            e.target.value = ""
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-none"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          {busy ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Upload className="size-3.5" />
          )}
          Upload
        </Button>
        {brand?.logo ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-none"
            disabled={busy}
            onClick={() => void clearLogo()}
          >
            Clear
          </Button>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-foreground/40">
        Applies to all proposals using this brand. Proposal icon is separate
        ({proposalId}).
      </p>
    </Panel>
  )
}

export function createBlankProposal(): FinanceProposal {
  return emptyProposal()
}
