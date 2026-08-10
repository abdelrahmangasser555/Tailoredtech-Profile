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
  FinanceInvoice,
  InvoiceFormatId,
  InvoiceLanguageMode,
  InvoiceLineItem,
} from "@/lib/finance/types"
import { emptyInvoice } from "@/lib/finance/types"
import {
  formatInvoiceMoney,
  invoiceGrandTotal,
  invoiceSubtotal,
  invoiceVatTotal,
} from "@/lib/finance/invoice-pricing"
import { InvoicePdfExportButton } from "@/components/finance-pdf/invoice-export-button"
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
  id: InvoiceFormatId
  label: string
  description: string
}

export function InvoiceEditor({
  initial,
  formats,
  isNew = false,
}: {
  initial: FinanceInvoice
  formats: FormatOption[]
  isNew?: boolean
}) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [invoice, setInvoice] = useState<FinanceInvoice>(initial)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  function patch(partial: Partial<FinanceInvoice>) {
    setInvoice((prev) => ({ ...prev, ...partial }))
  }

  function patchIssuer(partial: Partial<FinanceInvoice["issuer"]>) {
    setInvoice((prev) => ({
      ...prev,
      issuer: { ...prev.issuer, ...partial },
    }))
  }

  function patchCustomer(partial: Partial<FinanceInvoice["customer"]>) {
    setInvoice((prev) => ({
      ...prev,
      customer: { ...prev.customer, ...partial },
    }))
  }

  function patchDisplay(partial: Partial<FinanceInvoice["display"]>) {
    setInvoice((prev) => ({
      ...prev,
      display: { ...prev.display, ...partial },
    }))
  }

  function updateLine(id: string, next: InvoiceLineItem) {
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((l) => (l.id === id ? next : l)),
    }))
  }

  async function save() {
    if (saving) return
    if (!invoice.number.trim()) {
      toast.error("Invoice number is required")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/finance/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice }),
      })
      const data = (await res.json()) as {
        error?: string
        invoice?: FinanceInvoice
      }
      if (!res.ok) {
        toast.error(data.error || "Save failed")
        return
      }
      toast.success("Invoice saved")
      if (isNew && data.invoice) {
        router.replace(`/finance/invoices/${data.invoice.id}`)
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
    if (!confirm("Delete this invoice?")) return
    setSaving(true)
    try {
      const res = await fetch("/api/finance/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deleteId: invoice.id }),
      })
      if (!res.ok) {
        toast.error("Delete failed")
        return
      }
      toast.success("Deleted")
      router.push("/finance/invoices")
      router.refresh()
    } catch {
      toast.error("Delete failed")
    } finally {
      setSaving(false)
    }
  }

  async function onUploadLogo(file: File) {
    setUploading(true)
    try {
      const form = new FormData()
      form.set("file", file)
      form.set("slug", `invoice-${invoice.id}`)
      const res = await fetch("/api/finance/upload", {
        method: "POST",
        body: form,
      })
      const data = (await res.json()) as { path?: string; error?: string }
      if (!res.ok || !data.path) {
        toast.error(data.error || "Upload failed")
        return
      }
      patchIssuer({ logo: data.path })
      toast.success("Logo uploaded")
    } catch {
      toast.error("Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const sub = invoiceSubtotal(invoice)
  const vat = invoiceVatTotal(invoice)
  const grand = invoiceGrandTotal(invoice)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/finance/invoices"
            className="mb-3 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/45 hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" />
            Invoices
          </Link>
          <h1 className="font-pixel-circle text-3xl tracking-tight">
            {isNew ? "New invoice" : "Edit invoice"}
          </h1>
          <p className="mt-1 text-sm text-foreground/50">
            White proforma layout. Customize fields only. Layout stays fixed.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <InvoicePdfExportButton invoices={[invoice]} label="Download PDF" />
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
          <Panel title="Document">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title (English)">
                <Input
                  value={invoice.titleEn}
                  onChange={(e) => patch({ titleEn: e.target.value })}
                  className="rounded-none"
                />
              </Field>
              <Field label="Title (Arabic)">
                <Input
                  value={invoice.titleAr}
                  onChange={(e) => patch({ titleAr: e.target.value })}
                  className="rounded-none"
                  dir="rtl"
                  disabled={invoice.language === "en"}
                />
              </Field>
              <Field label="Reference label (English)">
                <Input
                  value={invoice.numberLabelEn ?? "Proforma number"}
                  onChange={(e) => patch({ numberLabelEn: e.target.value })}
                  className="rounded-none"
                  placeholder="Proforma number"
                />
              </Field>
              <Field label="Reference label (Arabic)">
                <Input
                  value={invoice.numberLabelAr ?? "رقم الفاتورة المبدئية"}
                  onChange={(e) => patch({ numberLabelAr: e.target.value })}
                  className="rounded-none"
                  dir="rtl"
                  placeholder="رقم الفاتورة المبدئية"
                  disabled={invoice.language === "en"}
                />
              </Field>
              <Field label="Reference value">
                <Input
                  value={invoice.number}
                  onChange={(e) => patch({ number: e.target.value })}
                  className="rounded-none"
                  placeholder="QUO-000100"
                />
              </Field>
              <Field label="Date">
                <Input
                  type="date"
                  value={invoice.date}
                  onChange={(e) => patch({ date: e.target.value })}
                  className="rounded-none"
                />
              </Field>
              <Field label="Language">
                <Select
                  value={invoice.language}
                  onValueChange={(v) =>
                    patch({ language: v as InvoiceLanguageMode })
                  }
                >
                  <SelectTrigger className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="bilingual">English + Arabic</SelectItem>
                    <SelectItem value="en">English only</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Format">
                <Select
                  value={invoice.format}
                  onValueChange={(v) =>
                    patch({ format: v as InvoiceFormatId })
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
              <Field label="Currency code">
                <Input
                  value={invoice.currency}
                  onChange={(e) =>
                    patch({ currency: e.target.value.toUpperCase().slice(0, 3) })
                  }
                  className="rounded-none"
                />
              </Field>
              <Field label="Currency symbol">
                <Input
                  value={invoice.currencySymbol}
                  onChange={(e) => patch({ currencySymbol: e.target.value })}
                  className="rounded-none"
                  placeholder="SAR"
                />
              </Field>
              <Field label="Default VAT %">
                <Input
                  type="number"
                  value={invoice.vatPercent}
                  onChange={(e) =>
                    patch({ vatPercent: Number(e.target.value) || 0 })
                  }
                  className="rounded-none"
                />
              </Field>
              <Field label="Status">
                <Select
                  value={invoice.status}
                  onValueChange={(v) =>
                    patch({
                      status: v as FinanceInvoice["status"],
                    })
                  }
                >
                  <SelectTrigger className="rounded-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </Panel>

          <Panel title="Issuer (your company)">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {invoice.issuer.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={invoice.issuer.logo}
                  alt=""
                  className="h-14 max-w-[120px] border border-foreground/10 object-contain bg-white p-1"
                />
              ) : (
                <div className="flex h-14 items-center justify-center border border-dashed border-foreground/15 px-4 text-[10px] text-foreground/35">
                  Logo
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) void onUploadLogo(file)
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
                Upload logo
              </Button>
              {invoice.issuer.logo ? (
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-none"
                  onClick={() => patchIssuer({ logo: null })}
                >
                  Remove
                </Button>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company name (EN)">
                <Input
                  value={invoice.issuer.nameEn}
                  onChange={(e) => patchIssuer({ nameEn: e.target.value })}
                  className="rounded-none"
                />
              </Field>
              <Field label="Company name (AR)">
                <Input
                  value={invoice.issuer.nameAr}
                  onChange={(e) => patchIssuer({ nameAr: e.target.value })}
                  className="rounded-none"
                  dir="rtl"
                  disabled={invoice.language === "en"}
                />
              </Field>
              <Field label="Address (EN)">
                <Textarea
                  value={invoice.issuer.addressEn}
                  onChange={(e) => patchIssuer({ addressEn: e.target.value })}
                  className="min-h-16 rounded-none"
                />
              </Field>
              <Field label="Address (AR)">
                <Textarea
                  value={invoice.issuer.addressAr}
                  onChange={(e) => patchIssuer({ addressAr: e.target.value })}
                  className="min-h-16 rounded-none"
                  dir="rtl"
                  disabled={invoice.language === "en"}
                />
              </Field>
              <Field label="VAT number">
                <Input
                  value={invoice.issuer.vatNumber}
                  onChange={(e) => patchIssuer({ vatNumber: e.target.value })}
                  className="rounded-none"
                />
              </Field>
              <Field label="700 number">
                <Input
                  value={invoice.issuer.commercialNumber}
                  onChange={(e) =>
                    patchIssuer({ commercialNumber: e.target.value })
                  }
                  className="rounded-none"
                />
              </Field>
            </div>
          </Panel>

          <Panel title="Customer">
            <div className="grid gap-4">
              <Field label="Customer name">
                <Input
                  value={invoice.customer.name}
                  onChange={(e) => patchCustomer({ name: e.target.value })}
                  className="rounded-none"
                />
              </Field>
              <Field label="Address">
                <Textarea
                  value={invoice.customer.address}
                  onChange={(e) => patchCustomer({ address: e.target.value })}
                  className="min-h-20 rounded-none"
                />
              </Field>
              <Field label="Other ID (TRN, C/O, …)">
                <Textarea
                  value={invoice.customer.otherId}
                  onChange={(e) => patchCustomer({ otherId: e.target.value })}
                  className="min-h-16 rounded-none"
                />
              </Field>
            </div>
          </Panel>

          <Panel
            title="Line items"
            action={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-none"
                onClick={() =>
                  patch({
                    lineItems: [
                      ...invoice.lineItems,
                      {
                        id: uid("line"),
                        description: "New line",
                        quantity: 1,
                        unitPrice: 0,
                        vatPercent: null,
                        note: "",
                      },
                    ],
                  })
                }
              >
                <Plus className="size-3.5" />
                Add line
              </Button>
            }
          >
            <div className="space-y-4">
              {invoice.lineItems.map((line, index) => (
                <div
                  key={line.id}
                  className="border border-foreground/10 bg-[var(--section-light)]/40 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/40">
                      Line {index + 1}
                    </p>
                    {invoice.lineItems.length > 1 ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="rounded-none"
                        onClick={() =>
                          patch({
                            lineItems: invoice.lineItems.filter(
                              (l) => l.id !== line.id
                            ),
                          })
                        }
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    ) : null}
                  </div>
                  <Field label="Description (newlines + - bullets)">
                    <Textarea
                      value={line.description}
                      onChange={(e) =>
                        updateLine(line.id, {
                          ...line,
                          description: e.target.value,
                        })
                      }
                      className="min-h-28 rounded-none font-mono text-sm"
                    />
                  </Field>
                  <div className="mt-3 grid gap-3 sm:grid-cols-4">
                    <Field label="Qty">
                      <Input
                        type="number"
                        value={line.quantity}
                        onChange={(e) =>
                          updateLine(line.id, {
                            ...line,
                            quantity: Number(e.target.value) || 0,
                          })
                        }
                        className="rounded-none"
                      />
                    </Field>
                    <Field label="Unit price">
                      <Input
                        type="number"
                        value={line.unitPrice}
                        onChange={(e) =>
                          updateLine(line.id, {
                            ...line,
                            unitPrice: Number(e.target.value) || 0,
                          })
                        }
                        className="rounded-none"
                      />
                    </Field>
                    <Field label="VAT % (blank = default)">
                      <Input
                        type="number"
                        value={line.vatPercent ?? ""}
                        onChange={(e) => {
                          const val = e.target.value
                          updateLine(line.id, {
                            ...line,
                            vatPercent:
                              val === "" ? null : Number(val) || 0,
                          })
                        }}
                        className="rounded-none"
                        placeholder={String(invoice.vatPercent)}
                      />
                    </Field>
                    <Field label="Highlight note">
                      <Input
                        value={line.note}
                        onChange={(e) =>
                          updateLine(line.id, {
                            ...line,
                            note: e.target.value,
                          })
                        }
                        className="rounded-none"
                        placeholder="Invoice in Saudi Riyal SAR"
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Discounts"
            action={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-none"
                onClick={() => {
                  patch({
                    discounts: [
                      ...invoice.discounts,
                      {
                        id: uid("d"),
                        labelEn: "Discount",
                        labelAr: "خصم",
                        amount: 0,
                      },
                    ],
                  })
                  patchDisplay({ showDiscount: true })
                }}
              >
                <Plus className="size-3.5" />
                Add
              </Button>
            }
          >
            {invoice.discounts.length === 0 ? (
              <p className="text-sm text-foreground/45">
                No discounts. Add one and enable it in Display.
              </p>
            ) : (
              <div className="space-y-3">
                {invoice.discounts.map((d, i) => (
                  <div
                    key={d.id}
                    className="grid gap-2 border border-foreground/10 p-3 sm:grid-cols-[1fr_1fr_88px_88px_auto]"
                  >
                    <Input
                      value={d.labelEn}
                      onChange={(e) => {
                        const discounts = [...invoice.discounts]
                        discounts[i] = { ...d, labelEn: e.target.value }
                        patch({ discounts })
                      }}
                      className="rounded-none"
                      placeholder="Label EN"
                    />
                    <Input
                      value={d.labelAr}
                      onChange={(e) => {
                        const discounts = [...invoice.discounts]
                        discounts[i] = { ...d, labelAr: e.target.value }
                        patch({ discounts })
                      }}
                      className="rounded-none"
                      dir="rtl"
                      placeholder="Label AR"
                    />
                    <Input
                      type="number"
                      value={d.amount ?? ""}
                      onChange={(e) => {
                        const discounts = [...invoice.discounts]
                        const val = e.target.value
                        discounts[i] = {
                          ...d,
                          amount: val === "" ? undefined : Number(val) || 0,
                        }
                        patch({ discounts })
                      }}
                      className="rounded-none"
                      placeholder="Amount"
                    />
                    <Input
                      type="number"
                      value={d.percent ?? ""}
                      onChange={(e) => {
                        const discounts = [...invoice.discounts]
                        const val = e.target.value
                        discounts[i] = {
                          ...d,
                          percent: val === "" ? undefined : Number(val) || 0,
                        }
                        patch({ discounts })
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
                        patch({
                          discounts: invoice.discounts.filter(
                            (x) => x.id !== d.id
                          ),
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Panel>

          <Panel
            title="Extra money lines"
            action={
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="rounded-none"
                onClick={() =>
                  patchDisplay({
                    customMoneyLines: [
                      ...invoice.display.customMoneyLines,
                      {
                        id: uid("money"),
                        labelEn: "Other",
                        labelAr: "أخرى",
                        amount: 0,
                        visible: true,
                      },
                    ],
                  })
                }
              >
                <Plus className="size-3.5" />
                Add
              </Button>
            }
          >
            <p className="mb-3 text-xs text-foreground/45">
              Optional extra rows in the totals block (shipping, retainer, etc.).
            </p>
            {invoice.display.customMoneyLines.length === 0 ? (
              <p className="text-sm text-foreground/45">None.</p>
            ) : (
              <div className="space-y-3">
                {invoice.display.customMoneyLines.map((m, i) => (
                  <div
                    key={m.id}
                    className="grid gap-2 border border-foreground/10 p-3 sm:grid-cols-[auto_1fr_1fr_100px_auto]"
                  >
                    <label className="flex items-center gap-2 text-xs">
                      <Checkbox
                        checked={m.visible}
                        onCheckedChange={(v) => {
                          const customMoneyLines = [
                            ...invoice.display.customMoneyLines,
                          ]
                          customMoneyLines[i] = {
                            ...m,
                            visible: v === true,
                          }
                          patchDisplay({ customMoneyLines })
                        }}
                        className="rounded-none"
                      />
                      Show
                    </label>
                    <Input
                      value={m.labelEn}
                      onChange={(e) => {
                        const customMoneyLines = [
                          ...invoice.display.customMoneyLines,
                        ]
                        customMoneyLines[i] = {
                          ...m,
                          labelEn: e.target.value,
                        }
                        patchDisplay({ customMoneyLines })
                      }}
                      className="rounded-none"
                    />
                    <Input
                      value={m.labelAr}
                      onChange={(e) => {
                        const customMoneyLines = [
                          ...invoice.display.customMoneyLines,
                        ]
                        customMoneyLines[i] = {
                          ...m,
                          labelAr: e.target.value,
                        }
                        patchDisplay({ customMoneyLines })
                      }}
                      className="rounded-none"
                      dir="rtl"
                    />
                    <Input
                      type="number"
                      value={m.amount}
                      onChange={(e) => {
                        const customMoneyLines = [
                          ...invoice.display.customMoneyLines,
                        ]
                        customMoneyLines[i] = {
                          ...m,
                          amount: Number(e.target.value) || 0,
                        }
                        patchDisplay({ customMoneyLines })
                      }}
                      className="rounded-none"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-none"
                      onClick={() =>
                        patchDisplay({
                          customMoneyLines:
                            invoice.display.customMoneyLines.filter(
                              (x) => x.id !== m.id
                            ),
                        })
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <Panel title="Display">
            <div className="space-y-2.5">
              {(
                [
                  ["showSubtotal", "Subtotal"],
                  ["showVat", "Total VAT"],
                  ["showDiscount", "Discounts"],
                  ["showTotal", "Grand total"],
                  ["showInvoiceNumber", "Reference number row"],
                  ["showDate", "Date"],
                  ["showPageNumbers", "Page numbers"],
                ] as const
              ).map(([key, label]) => (
                <ToggleRow
                  key={key}
                  id={`inv-disp-${key}`}
                  label={label}
                  checked={invoice.display[key] ?? true}
                  onCheckedChange={(v) => patchDisplay({ [key]: v })}
                />
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-foreground/45">
              {formats.find((f) => f.id === invoice.format)?.description}
            </p>
          </Panel>

          <div className="border border-foreground/10 bg-white p-4">
            <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-foreground/40">
              Totals preview
            </p>
            <dl className="mt-3 space-y-1.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-foreground/50">Subtotal</dt>
                <dd className="font-medium">
                  {formatInvoiceMoney(sub)} {invoice.currencySymbol}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-foreground/50">VAT</dt>
                <dd className="font-medium">
                  {formatInvoiceMoney(vat)} {invoice.currencySymbol}
                </dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-foreground/10 pt-1.5">
                <dt className="text-foreground/50">Total</dt>
                <dd className="font-medium">
                  {formatInvoiceMoney(grand)} {invoice.currencySymbol}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
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

export function createBlankInvoice(): FinanceInvoice {
  return emptyInvoice()
}
