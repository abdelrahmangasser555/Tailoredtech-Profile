import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer"
import type { PreparedInvoicePdf } from "@/lib/finance-pdf/prepare-invoice"
import { MixedText } from "@/lib/finance-pdf/mixed-text"
import type { FinanceInvoice, InvoiceLineItem } from "@/lib/finance/types"
import {
  discountAmount,
  formatInvoiceMoney,
  invoiceDiscountTotal,
  invoiceGrandTotal,
  invoiceSubtotal,
  invoiceVatTotal,
  lineAmount,
  lineTaxable,
  lineVatAmount,
  lineVatPercent,
} from "@/lib/finance/invoice-pricing"

const PAGE_PAD = 28
const INK = "#1a1a1a"
const MUTED = "#444444"
const BORDER = "#9a9a9a"
const LABEL_BG = "#e8e8e8"
const NOTE_BG = "#fff59d"
const WHITE = "#FFFFFF"

const styles = StyleSheet.create({
  page: {
    paddingTop: PAGE_PAD,
    paddingHorizontal: PAGE_PAD,
    paddingBottom: 48,
    backgroundColor: WHITE,
    fontFamily: "InvoiceSans",
    fontSize: 8,
    color: INK,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerSide: {
    width: "32%",
  },
  headerCenter: {
    width: "34%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 2,
  },
  logo: {
    width: 72,
    height: 52,
    objectFit: "contain",
  },
  enName: {
    fontFamily: "InvoiceSans",
    fontWeight: 500,
    fontSize: 8,
    marginBottom: 2,
  },
  enLine: {
    fontFamily: "InvoiceSans",
    fontSize: 7,
    color: MUTED,
    marginBottom: 1,
  },
  arName: {
    fontFamily: "InvoiceArabic",
    fontWeight: 500,
    fontSize: 8,
    textAlign: "right",
    marginBottom: 2,
  },
  arLine: {
    fontFamily: "InvoiceArabic",
    fontSize: 7,
    color: MUTED,
    textAlign: "right",
    marginBottom: 1,
  },
  titleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "baseline",
    gap: 8,
    marginTop: 4,
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 0.75,
    borderBottomColor: BORDER,
  },
  title: {
    fontFamily: "InvoiceSans",
    fontWeight: 500,
    fontSize: 16,
  },
  titleAr: {
    fontFamily: "InvoiceArabic",
    fontWeight: 500,
    fontSize: 14,
  },
  metaTable: {
    borderWidth: 0.75,
    borderColor: BORDER,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: "row",
    borderBottomWidth: 0.75,
    borderBottomColor: BORDER,
  },
  metaRowLast: {
    flexDirection: "row",
  },
  metaLabelEn: {
    width: 78,
    backgroundColor: LABEL_BG,
    borderRightWidth: 0.75,
    borderRightColor: BORDER,
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  metaLabelAr: {
    width: 78,
    backgroundColor: LABEL_BG,
    borderLeftWidth: 0.75,
    borderLeftColor: BORDER,
    paddingVertical: 5,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  metaValue: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 6,
    justifyContent: "center",
  },
  metaLabelTextEn: {
    fontFamily: "InvoiceSans",
    fontSize: 7,
  },
  metaLabelTextAr: {
    fontFamily: "InvoiceArabic",
    fontSize: 7,
    textAlign: "right",
  },
  metaValueText: {
    fontFamily: "InvoiceSans",
    fontSize: 8,
    lineHeight: 1.35,
  },
  halfMeta: {
    flex: 1,
    flexDirection: "row",
  },
  halfMetaBorder: {
    borderRightWidth: 0.75,
    borderRightColor: BORDER,
  },
  itemsTable: {
    borderWidth: 0.75,
    borderColor: BORDER,
  },
  itemsHeader: {
    flexDirection: "row",
    backgroundColor: LABEL_BG,
    borderBottomWidth: 0.75,
    borderBottomColor: BORDER,
  },
  itemsRow: {
    flexDirection: "row",
    borderBottomWidth: 0.75,
    borderBottomColor: BORDER,
    minHeight: 28,
  },
  colLineAmt: {
    width: "14%",
    borderRightWidth: 0.75,
    borderRightColor: BORDER,
    paddingVertical: 4,
    paddingHorizontal: 3,
  },
  colVat: {
    width: "12%",
    borderRightWidth: 0.75,
    borderRightColor: BORDER,
    paddingVertical: 4,
    paddingHorizontal: 3,
  },
  colTaxable: {
    width: "14%",
    borderRightWidth: 0.75,
    borderRightColor: BORDER,
    paddingVertical: 4,
    paddingHorizontal: 3,
  },
  colPrice: {
    width: "12%",
    borderRightWidth: 0.75,
    borderRightColor: BORDER,
    paddingVertical: 4,
    paddingHorizontal: 3,
  },
  colQty: {
    width: "7%",
    borderRightWidth: 0.75,
    borderRightColor: BORDER,
    paddingVertical: 4,
    paddingHorizontal: 3,
  },
  colDesc: {
    width: "35%",
    borderRightWidth: 0.75,
    borderRightColor: BORDER,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  colNum: {
    width: "6%",
    paddingVertical: 4,
    paddingHorizontal: 2,
    alignItems: "center",
  },
  thEn: {
    fontFamily: "InvoiceSans",
    fontSize: 6.5,
    textAlign: "center",
  },
  thAr: {
    fontFamily: "InvoiceArabic",
    fontSize: 6.5,
    textAlign: "center",
    marginTop: 1,
  },
  cellNum: {
    fontFamily: "InvoiceSans",
    fontSize: 8,
    textAlign: "right",
  },
  cellCenter: {
    fontFamily: "InvoiceSans",
    fontSize: 8,
    textAlign: "center",
  },
  descLine: {
    fontFamily: "InvoiceSans",
    fontSize: 8,
    lineHeight: 1.35,
    marginBottom: 1,
  },
  descBullet: {
    fontFamily: "InvoiceSans",
    fontSize: 7.5,
    lineHeight: 1.3,
    marginLeft: 6,
    marginBottom: 1,
  },
  noteBox: {
    marginTop: 4,
    backgroundColor: NOTE_BG,
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  noteText: {
    fontFamily: "InvoiceSans",
    fontSize: 7.5,
  },
  totalsWrap: {
    marginTop: 10,
    width: "52%",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  totalsLabelEn: {
    fontFamily: "InvoiceSans",
    fontSize: 8,
  },
  totalsLabelAr: {
    fontFamily: "InvoiceArabic",
    fontSize: 8,
  },
  totalsValue: {
    fontFamily: "InvoiceSans",
    fontSize: 9,
    fontWeight: 500,
    textAlign: "right",
    minWidth: 100,
  },
  footer: {
    position: "absolute",
    left: PAGE_PAD,
    right: PAGE_PAD,
    bottom: 16,
    borderTopWidth: 0.75,
    borderTopColor: BORDER,
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  footerLeft: {
    width: "38%",
  },
  footerCenter: {
    width: "24%",
    alignItems: "center",
  },
  footerRight: {
    width: "38%",
    alignItems: "flex-end",
  },
  footerEn: {
    fontFamily: "InvoiceSans",
    fontSize: 6.5,
    color: MUTED,
  },
  footerAr: {
    fontFamily: "InvoiceArabic",
    fontSize: 6.5,
    color: MUTED,
    textAlign: "right",
  },
  footerPage: {
    fontFamily: "InvoiceSans",
    fontSize: 7,
    color: MUTED,
  },
  footerNum: {
    fontFamily: "InvoiceSans",
    fontSize: 7,
    color: MUTED,
  },
})

function bilingual(invoice: FinanceInvoice) {
  return invoice.language === "bilingual"
}

function currencyLabel(invoice: FinanceInvoice) {
  const sym = (invoice.currencySymbol || invoice.currency || "SAR").trim()
  if (sym === "﷼" || sym === "ر.س" || sym === "ر.س.") return "SAR"
  return sym
}

function HeaderCell({
  en,
  ar,
  showAr,
}: {
  en: string
  ar: string
  showAr: boolean
}) {
  return (
    <View>
      <Text style={styles.thEn}>{en}</Text>
      {showAr ? <Text style={styles.thAr}>{ar}</Text> : null}
    </View>
  )
}

function DescriptionBlock({ text, note }: { text: string; note: string }) {
  const lines = text.replace(/\r\n/g, "\n").split("\n")
  return (
    <View>
      {lines.map((raw, i) => {
        const line = raw.trimEnd()
        const trimmed = line.trim()
        if (!trimmed) return <View key={i} style={{ height: 3 }} />
        if (/^[-*•]\s+/.test(trimmed)) {
          return (
            <MixedText key={i} style={styles.descBullet}>
              {`• ${trimmed.replace(/^[-*•]\s+/, "")}`}
            </MixedText>
          )
        }
        return (
          <MixedText key={i} style={styles.descLine}>
            {trimmed}
          </MixedText>
        )
      })}
      {note.trim() ? (
        <View style={styles.noteBox}>
          <MixedText style={styles.noteText}>{note.trim()}</MixedText>
        </View>
      ) : null}
    </View>
  )
}

function MultilineMixed({ text, style }: { text: string; style: object }) {
  return (
    <View>
      {text.split("\n").map((line, i) => (
        <MixedText key={i} style={style}>
          {line}
        </MixedText>
      ))}
    </View>
  )
}

function LineRow({
  line,
  index,
  invoice,
}: {
  line: InvoiceLineItem
  index: number
  invoice: FinanceInvoice
}) {
  const vatPct = lineVatPercent(line, invoice.vatPercent)
  const taxable = lineTaxable(line)
  const vat = lineVatAmount(line, invoice.vatPercent)
  const total = lineAmount(line, invoice.vatPercent)

  return (
    <View style={styles.itemsRow} wrap={false}>
      <View style={styles.colLineAmt}>
        <Text style={styles.cellNum}>{formatInvoiceMoney(total)}</Text>
      </View>
      <View style={styles.colVat}>
        <Text style={styles.cellNum}>{formatInvoiceMoney(vat)}</Text>
        <Text style={[styles.cellCenter, { fontSize: 7, marginTop: 1 }]}>
          {vatPct}%
        </Text>
      </View>
      <View style={styles.colTaxable}>
        <Text style={styles.cellNum}>{formatInvoiceMoney(taxable)}</Text>
      </View>
      <View style={styles.colPrice}>
        <Text style={styles.cellNum}>{formatInvoiceMoney(line.unitPrice)}</Text>
      </View>
      <View style={styles.colQty}>
        <Text style={styles.cellCenter}>{line.quantity}</Text>
      </View>
      <View style={styles.colDesc}>
        <DescriptionBlock text={line.description} note={line.note} />
      </View>
      <View style={styles.colNum}>
        <Text style={styles.cellCenter}>{index + 1}</Text>
      </View>
    </View>
  )
}

function TotalsBlock({ invoice }: { invoice: FinanceInvoice }) {
  const showAr = bilingual(invoice)
  const sub = invoiceSubtotal(invoice)
  const vat = invoiceVatTotal(invoice)
  const disc = invoiceDiscountTotal(invoice)
  const total = invoiceGrandTotal(invoice)
  const sym = currencyLabel(invoice)

  const rows: { key: string; en: string; ar: string; amount: number }[] = []

  if (invoice.display.showSubtotal) {
    rows.push({
      key: "sub",
      en: "Subtotal",
      ar: "المجموع الفرعي",
      amount: sub,
    })
  }
  if (
    invoice.display.showDiscount &&
    (disc > 0 || invoice.discounts.length > 0)
  ) {
    for (const d of invoice.discounts) {
      rows.push({
        key: d.id,
        en: d.labelEn,
        ar: d.labelAr,
        amount: -discountAmount(d, sub),
      })
    }
  }
  if (invoice.display.showVat) {
    rows.push({
      key: "vat",
      en: "Total VAT",
      ar: "إجمالي ضريبة القيمة المضافة",
      amount: vat,
    })
  }
  for (const custom of invoice.display.customMoneyLines) {
    if (!custom.visible) continue
    rows.push({
      key: custom.id,
      en: custom.labelEn,
      ar: custom.labelAr,
      amount: custom.amount,
    })
  }
  if (invoice.display.showTotal) {
    rows.push({
      key: "total",
      en: "Total",
      ar: "المجموع شامل القيمة المضافة",
      amount: total,
    })
  }

  if (rows.length === 0) return null

  return (
    <View style={styles.totalsWrap}>
      {rows.map((row) => (
        <View key={row.key} style={styles.totalsRow} wrap={false}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={styles.totalsLabelEn}>{row.en}</Text>
            {showAr ? (
              <Text style={styles.totalsLabelAr}>{row.ar}</Text>
            ) : null}
          </View>
          <Text style={styles.totalsValue}>
            {row.amount < 0 ? "−" : ""}
            {formatInvoiceMoney(Math.abs(row.amount))} {sym}
          </Text>
        </View>
      ))}
    </View>
  )
}

function MetaLabel({
  en,
  ar,
  showAr,
  side,
}: {
  en: string
  ar: string
  showAr: boolean
  side: "en" | "ar"
}) {
  if (side === "ar") {
    if (!showAr) return null
    return (
      <View style={styles.metaLabelAr}>
        <Text style={styles.metaLabelTextAr}>{ar}</Text>
      </View>
    )
  }
  return (
    <View
      style={showAr ? styles.metaLabelEn : [styles.metaLabelEn, { width: 110 }]}
    >
      <Text style={styles.metaLabelTextEn}>{en}</Text>
    </View>
  )
}

function MetaValueCell({ text }: { text: string }) {
  return (
    <View style={styles.metaValue}>
      <MultilineMixed text={text} style={styles.metaValueText} />
    </View>
  )
}

function InvoicePage({ data }: { data: PreparedInvoicePdf }) {
  const { invoice, logoDataUrl } = data
  const showAr = bilingual(invoice)
  const showNumber = invoice.display.showInvoiceNumber !== false
  const showDate = invoice.display.showDate !== false

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.headerSide}>
          <Text style={styles.enName}>{invoice.issuer.nameEn}</Text>
          {invoice.issuer.addressEn.split("\n").map((line, i) => (
            <Text key={i} style={styles.enLine}>
              {line}
            </Text>
          ))}
          {invoice.issuer.vatNumber ? (
            <Text style={styles.enLine}>VAT: {invoice.issuer.vatNumber}</Text>
          ) : null}
          {invoice.issuer.commercialNumber ? (
            <Text style={styles.enLine}>
              700: {invoice.issuer.commercialNumber}
            </Text>
          ) : null}
        </View>

        <View style={styles.headerCenter}>
          {logoDataUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={logoDataUrl} style={styles.logo} />
          ) : null}
        </View>

        <View style={styles.headerSide}>
          {showAr ? (
            <>
              <Text style={styles.arName}>{invoice.issuer.nameAr}</Text>
              {invoice.issuer.addressAr.split("\n").map((line, i) => (
                <Text key={i} style={styles.arLine}>
                  {line}
                </Text>
              ))}
              {invoice.issuer.vatNumber ? (
                <View style={{ marginBottom: 1 }}>
                  <MixedText style={[styles.arLine, { textAlign: "right" }]}>
                    {`الرقم الضريبي: ${invoice.issuer.vatNumber}`}
                  </MixedText>
                </View>
              ) : null}
              {invoice.issuer.commercialNumber ? (
                <View style={{ marginBottom: 1 }}>
                  <MixedText style={[styles.arLine, { textAlign: "right" }]}>
                    {`700: ${invoice.issuer.commercialNumber}`}
                  </MixedText>
                </View>
              ) : null}
            </>
          ) : null}
        </View>
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title}>{invoice.titleEn}</Text>
        {showAr && invoice.titleAr ? (
          <Text style={styles.titleAr}>{invoice.titleAr}</Text>
        ) : null}
      </View>

      <View style={styles.metaTable}>
        <View style={styles.metaRow}>
          <MetaLabel en="Customer" ar="العميل" showAr={showAr} side="en" />
          <MetaValueCell text={invoice.customer.name} />
          <MetaLabel en="Customer" ar="العميل" showAr={showAr} side="ar" />
        </View>
        <View style={styles.metaRow}>
          <MetaLabel en="Address" ar="العنوان" showAr={showAr} side="en" />
          <MetaValueCell text={invoice.customer.address} />
          <MetaLabel en="Address" ar="العنوان" showAr={showAr} side="ar" />
        </View>
        <View
          style={showNumber || showDate ? styles.metaRow : styles.metaRowLast}
        >
          <MetaLabel en="Other ID" ar="معرف آخر" showAr={showAr} side="en" />
          <MetaValueCell text={invoice.customer.otherId} />
          <MetaLabel en="Other ID" ar="معرف آخر" showAr={showAr} side="ar" />
        </View>
        {showNumber || showDate ? (
          <View style={styles.metaRowLast}>
            {showNumber ? (
              <View
                style={[
                  styles.halfMeta,
                  showDate ? styles.halfMetaBorder : null,
                ]}
              >
                <MetaLabel
                  en={invoice.numberLabelEn || "Proforma number"}
                  ar={invoice.numberLabelAr || "رقم الفاتورة المبدئية"}
                  showAr={showAr}
                  side="en"
                />
                <MetaValueCell text={invoice.number} />
                <MetaLabel
                  en={invoice.numberLabelEn || "Proforma number"}
                  ar={invoice.numberLabelAr || "رقم الفاتورة المبدئية"}
                  showAr={showAr}
                  side="ar"
                />
              </View>
            ) : null}
            {showDate ? (
              <View
                style={
                  showNumber ? styles.halfMeta : [styles.halfMeta, { flex: 1 }]
                }
              >
                <MetaLabel en="Date" ar="التاريخ" showAr={showAr} side="en" />
                <MetaValueCell text={invoice.date} />
                <MetaLabel en="Date" ar="التاريخ" showAr={showAr} side="ar" />
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      <View style={styles.itemsTable}>
        <View style={styles.itemsHeader} wrap={false}>
          <View style={styles.colLineAmt}>
            <HeaderCell en="Line amount" ar="المجموع" showAr={showAr} />
          </View>
          <View style={styles.colVat}>
            <HeaderCell en="VAT amount" ar="القيمة المضافة" showAr={showAr} />
          </View>
          <View style={styles.colTaxable}>
            <HeaderCell
              en="Taxable amount"
              ar="المبلغ الخاضع للضريبة"
              showAr={showAr}
            />
          </View>
          <View style={styles.colPrice}>
            <HeaderCell en="Price" ar="السعر" showAr={showAr} />
          </View>
          <View style={styles.colQty}>
            <HeaderCell en="Qty" ar="الكمية" showAr={showAr} />
          </View>
          <View style={styles.colDesc}>
            <HeaderCell en="Description" ar="الوصف" showAr={showAr} />
          </View>
          <View style={styles.colNum}>
            <Text style={styles.thEn}>#</Text>
          </View>
        </View>

        {invoice.lineItems.map((line, i) => (
          <LineRow key={line.id} line={line} index={i} invoice={invoice} />
        ))}
      </View>

      <TotalsBlock invoice={invoice} />

      <View style={styles.footer} fixed>
        <View style={styles.footerLeft}>
          <Text style={styles.footerEn}>{invoice.issuer.nameEn}</Text>
          {showAr ? (
            <Text style={styles.footerAr}>{invoice.issuer.nameAr}</Text>
          ) : null}
        </View>
        <View style={styles.footerCenter}>
          {invoice.display.showPageNumbers ? (
            <Text
              style={styles.footerPage}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          ) : null}
        </View>
        <View style={styles.footerRight}>
          {showNumber ? (
            <Text style={styles.footerNum}>{invoice.number}</Text>
          ) : null}
        </View>
      </View>
    </Page>
  )
}

export function InvoicePdfDocument({
  pages,
}: {
  pages: PreparedInvoicePdf[]
}) {
  return (
    <Document
      title={
        pages.length === 1
          ? `${pages[0]!.invoice.number} · ${pages[0]!.invoice.titleEn}`
          : `Invoices (${pages.length})`
      }
      author={pages[0]?.invoice.issuer.nameEn ?? "Finance"}
    >
      {pages.map((data) => (
        <InvoicePage key={data.invoice.id} data={data} />
      ))}
    </Document>
  )
}
