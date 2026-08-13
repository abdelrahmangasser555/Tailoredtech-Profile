import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Svg,
  Rect,
} from "@react-pdf/renderer"
import type { PreparedProposalPdf } from "@/lib/finance-pdf/prepare"
import {
  LetterheadHeader,
  LetterheadMetaTable,
  LetterheadTitle,
} from "@/lib/finance-pdf/letterhead"
import { PdfMarkdownBody } from "@/lib/presentation-pdf/markdown"
import type { PresentationPdfBrand } from "@/lib/presentation-pdf/brand"
import type { ProposalPdfBrand } from "@/lib/finance-pdf/brand"
import type {
  FinanceProposal,
  ProposalComparisonCell,
  ProposalSolution,
} from "@/lib/finance/types"
import {
  discountAmount,
  formatMoney,
  lineItemTotal,
  solutionSubtotal,
  solutionTotal,
} from "@/lib/finance/pricing"

const PAGE_PAD = 28
const INK = "#1a1a1a"
const MUTED = "#444444"
const BORDER = "#9a9a9a"
const LABEL_BG = "#e8e8e8"
const WHITE = "#FFFFFF"

function toMarkdownBrand(brand: ProposalPdfBrand): PresentationPdfBrand {
  return {
    id: brand.id,
    name: brand.name,
    primary: brand.primary,
    accent: brand.accent,
    accentForeground: "#FFFFFF",
    muted: brand.muted,
    border: brand.border,
    soft: brand.soft,
    ink: brand.ink,
    paper: brand.paper,
    headerBg: brand.soft,
    headerHighlightBg: brand.soft,
    darkSurface: brand.primary,
  }
}

const styles = StyleSheet.create({
  page: {
    paddingTop: PAGE_PAD,
    paddingHorizontal: PAGE_PAD,
    paddingBottom: PAGE_PAD,
    backgroundColor: WHITE,
    fontFamily: "InvoiceSans",
    fontSize: 8,
    color: INK,
    flexDirection: "column",
  },
  pageInner: {
    flex: 1,
    flexDirection: "column",
    minHeight: "100%",
  },
  body: {
    flexGrow: 1,
  },
  sectionLabel: {
    fontFamily: "InvoiceSans",
    fontSize: 7.5,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: MUTED,
    marginBottom: 6,
    marginTop: 10,
  },
  solutionName: {
    fontFamily: "InvoiceSans",
    fontWeight: 500,
    fontSize: 10,
    marginBottom: 3,
  },
  solutionDesc: {
    fontFamily: "InvoiceSans",
    fontSize: 8,
    color: MUTED,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  table: {
    borderWidth: 0.75,
    borderColor: BORDER,
    marginBottom: 6,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: LABEL_BG,
    borderBottomWidth: 0.75,
    borderBottomColor: BORDER,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  colLabelCell: {
    flex: 1,
    paddingRight: 4,
  },
  colLabelText: {
    fontFamily: "InvoiceSans",
    fontSize: 8,
  },
  colNoteText: {
    fontFamily: "InvoiceSans",
    fontSize: 7,
    color: MUTED,
    marginTop: 2,
  },
  colQty: { width: 40, fontSize: 8, textAlign: "right", paddingTop: 1 },
  colAmount: { width: 78, fontSize: 8, textAlign: "right", paddingTop: 1 },
  totalsBlock: {
    marginTop: 4,
    width: "55%",
    alignSelf: "flex-end",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  totalLabel: {
    fontFamily: "InvoiceSans",
    fontSize: 8,
    color: MUTED,
  },
  totalValue: {
    fontFamily: "InvoiceSans",
    fontWeight: 500,
    fontSize: 9,
    minWidth: 80,
    textAlign: "right",
  },
  featureRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
    paddingBottom: 6,
    borderBottomWidth: 0.4,
    borderBottomColor: BORDER,
  },
  featureIndex: {
    fontFamily: "InvoiceSans",
    fontSize: 8,
    width: 16,
    color: MUTED,
  },
  featureTitle: {
    fontFamily: "InvoiceSans",
    fontWeight: 500,
    fontSize: 9,
  },
  featureDesc: {
    fontFamily: "InvoiceSans",
    fontSize: 8,
    lineHeight: 1.35,
    marginTop: 1,
    color: MUTED,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 0.75,
    borderColor: BORDER,
    marginBottom: 4,
  },
  footer: {
    marginTop: "auto",
    borderTopWidth: 0.75,
    borderTopColor: BORDER,
    paddingTop: 6,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  footerText: {
    fontFamily: "InvoiceSans",
    fontSize: 7,
    color: MUTED,
    textAlign: "center",
    lineHeight: 1.3,
  },
  footerIssuer: {
    fontFamily: "InvoiceSans",
    fontSize: 7,
    color: MUTED,
    width: "28%",
  },
  footerCenter: {
    flex: 1,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  footerRight: {
    width: "28%",
    alignItems: "flex-end",
  },
  footerNum: {
    fontFamily: "InvoiceSans",
    fontSize: 7,
    color: MUTED,
    textAlign: "right",
  },
  pageNum: {
    fontFamily: "InvoiceSans",
    fontSize: 7,
    color: MUTED,
    textAlign: "center",
    marginTop: 4,
  },
  proposalIcon: {
    width: 22,
    height: 22,
    objectFit: "contain",
    marginLeft: 6,
  },
})

function CheckMark({ color }: { color: string }) {
  const cells: Array<[number, number]> = [
    [4, 9],
    [6, 11],
    [8, 9],
    [10, 7],
    [12, 5],
  ]
  return (
    <Svg width={10} height={10} viewBox="0 0 18 18">
      <Rect
        x={1}
        y={1}
        width={16}
        height={16}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
      {cells.map(([x, y]) => (
        <Rect key={`${x}-${y}`} x={x} y={y} width={2} height={2} fill={color} />
      ))}
    </Svg>
  )
}

function XMark({ color }: { color: string }) {
  const cells: Array<[number, number]> = [
    [4, 4],
    [6, 6],
    [8, 8],
    [10, 10],
    [12, 12],
    [12, 4],
    [10, 6],
    [6, 10],
    [4, 12],
  ]
  return (
    <Svg width={10} height={10} viewBox="0 0 18 18">
      <Rect
        x={1}
        y={1}
        width={16}
        height={16}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
      {cells.map(([x, y]) => (
        <Rect key={`${x}-${y}`} x={x} y={y} width={2} height={2} fill={color} />
      ))}
    </Svg>
  )
}

function CellValue({ cell }: { cell: ProposalComparisonCell }) {
  if (cell.type === "check") {
    return cell.value ? <CheckMark color={INK} /> : <XMark color={MUTED} />
  }
  if (cell.type === "x") {
    return <XMark color={MUTED} />
  }
  return <Text style={{ fontSize: 8, color: INK }}>{String(cell.value)}</Text>
}

function BreakdownTable({
  solution,
  currency,
}: {
  solution: ProposalSolution
  currency: string
}) {
  const sub = solutionSubtotal(solution)
  const total = solutionTotal(solution)

  return (
    <View wrap={false}>
      <Text style={styles.solutionName}>{solution.name}</Text>
      {solution.description ? (
        <Text style={styles.solutionDesc}>{solution.description}</Text>
      ) : null}

      {solution.lineItems.length > 0 ? (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colLabelText, { flex: 1, color: MUTED }]}>Item</Text>
            <Text style={[styles.colQty, { color: MUTED }]}>Qty</Text>
            <Text style={[styles.colAmount, { color: MUTED }]}>Amount</Text>
          </View>
          {solution.lineItems.map((line, i) => (
            <View
              key={line.id}
              style={[
                styles.tableRow,
                ...(i === solution.lineItems.length - 1
                  ? [{ borderBottomWidth: 0 }]
                  : []),
              ]}
            >
              <View style={styles.colLabelCell}>
                <Text style={[styles.colLabelText, { color: INK }]}>
                  {line.label}
                </Text>
                {line.note ? (
                  <Text style={styles.colNoteText}>{line.note}</Text>
                ) : null}
              </View>
              <Text style={[styles.colQty, { color: INK }]}>
                {line.quantity ?? 1}
              </Text>
              <Text style={[styles.colAmount, { color: INK }]}>
                {formatMoney(lineItemTotal(line), currency)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.totalsBlock}>
        <View style={styles.totalsRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={[styles.totalValue, { color: INK }]}>
            {formatMoney(sub, currency)}
          </Text>
        </View>
        {solution.discounts.map((d) => (
          <View key={d.id} style={styles.totalsRow}>
            <Text style={styles.totalLabel}>
              {d.label}
              {d.optional ? " (optional)" : ""}
              {typeof d.percent === "number" ? ` (${d.percent}%)` : ""}
            </Text>
            <Text style={[styles.totalValue, { color: INK }]}>
              −{formatMoney(discountAmount(d, sub), currency)}
            </Text>
          </View>
        ))}
        <View style={styles.totalsRow}>
          <Text style={[styles.totalLabel, { color: INK, fontWeight: 500 }]}>
            {solution.totalLabel || "Total"}
            {solution.totalMode !== "manual" && solution.discounts.some((d) => d.optional)
              ? " (excl. optional credits)"
              : ""}
          </Text>
          <Text style={[styles.totalValue, { color: INK }]}>
            {formatMoney(total, currency)}
          </Text>
        </View>
      </View>
    </View>
  )
}

function PriceSummary({ proposal }: { proposal: FinanceProposal }) {
  return (
    <View>
      {proposal.solutions.map((solution) => (
        <View key={solution.id} style={{ marginBottom: 10 }} wrap={false}>
          <Text style={styles.solutionName}>{solution.name}</Text>
          {solution.prices.map((price) => (
            <View key={price.id} style={styles.priceRow}>
              <Text style={{ fontSize: 8, color: INK }}>{price.label}</Text>
              <Text style={{ fontSize: 9, fontWeight: 500, color: INK }}>
                {formatMoney(price.amount, proposal.currency)}
              </Text>
            </View>
          ))}
          {solution.discounts.map((d) => (
            <Text key={d.id} style={{ fontSize: 8, color: MUTED, marginTop: 2 }}>
              {d.label}
              {d.optional ? " (optional)" : ""}
              {typeof d.percent === "number"
                ? `: ${d.percent}%`
                : d.amount != null
                  ? `: −${formatMoney(d.amount, proposal.currency)}`
                  : ""}
            </Text>
          ))}
        </View>
      ))}
    </View>
  )
}

function FeaturesBlock({
  proposal,
  label,
}: {
  proposal: FinanceProposal
  label: string
}) {
  if (!proposal.display.showFeatures || proposal.features.length === 0) {
    return null
  }
  return (
    <View>
      <Text style={styles.sectionLabel}>{label}</Text>
      {proposal.features.map((f, i) => (
        <View key={f.id} style={styles.featureRow}>
          <Text style={styles.featureIndex}>{String(i + 1).padStart(2, "0")}</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.featureTitle}>{f.title}</Text>
            {f.description ? (
              <Text style={styles.featureDesc}>{f.description}</Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  )
}

function ComparisonBlock({ proposal }: { proposal: FinanceProposal }) {
  const cmp = proposal.comparison
  if (!proposal.display.showComparison || !cmp.enabled || !cmp.columns.length) {
    return null
  }

  const colWidth = `${Math.floor(55 / cmp.columns.length)}%`

  return (
    <View>
      <Text style={styles.sectionLabel}>{cmp.eyebrow || "Options"}</Text>
      <Text style={[styles.solutionName, { marginBottom: 6 }]}>{cmp.title}</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={{ width: "45%", fontSize: 8, color: MUTED }}> </Text>
          {cmp.columns.map((col) => (
            <Text
              key={col.id}
              style={{
                width: colWidth,
                fontSize: 8,
                color: col.highlight ? INK : MUTED,
                fontWeight: col.highlight ? 500 : 400,
                textAlign: "center",
              }}
            >
              {col.label}
            </Text>
          ))}
        </View>
        {cmp.rows.map((row, i) => (
          <View
            key={`${row.label}-${i}`}
            style={[
              styles.tableRow,
              { alignItems: "center" },
              ...(i === cmp.rows.length - 1 ? [{ borderBottomWidth: 0 }] : []),
            ]}
          >
            <Text style={{ width: "45%", fontSize: 8, color: INK }}>
              {row.label}
            </Text>
            {row.cells.map((cell, j) => (
              <View
                key={j}
                style={{
                  width: colWidth,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CellValue cell={cell} />
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}

function OfferBlock({ proposal }: { proposal: FinanceProposal }) {
  const format = proposal.format
  const showBreakdown =
    proposal.display.showBreakdown &&
    (format === "formal-breakdown" ||
      (format === "formal-features" && proposal.display.showBreakdown))
  const showPrices = proposal.display.showPrices
  const offerLabel = proposal.display.offerLabel || "Pricing breakdown"

  const hasBreakdown = showBreakdown
  const hasPrices =
    (format === "formal-compact" ||
      format === "formal-features" ||
      (!showBreakdown && showPrices)) &&
    showPrices

  if (!hasBreakdown && !hasPrices) return null

  return (
    <View>
      {hasBreakdown ? (
        <>
          <Text style={styles.sectionLabel}>{offerLabel}</Text>
          {proposal.solutions.map((solution) => (
            <View key={solution.id} style={{ marginBottom: 12 }}>
              <BreakdownTable solution={solution} currency={proposal.currency} />
            </View>
          ))}
        </>
      ) : null}
      {hasPrices ? (
        <>
          <Text style={styles.sectionLabel}>
            {format === "formal-compact" ? "Pricing" : "Price summary"}
          </Text>
          <PriceSummary proposal={proposal} />
        </>
      ) : null}
    </View>
  )
}

function ProposalHeaderBlock({ data }: { data: PreparedProposalPdf }) {
  const { proposal, issuerLogoDataUrl, iconDataUrl } = data
  const { display } = proposal

  if (!display.showHeader) return null

  return (
    <View wrap={false}>
      <LetterheadHeader
        issuer={proposal.issuer}
        logoDataUrl={issuerLogoDataUrl}
        language={proposal.language}
      />
      {iconDataUrl ? (
        <View style={{ alignItems: "flex-end", marginTop: -4, marginBottom: 4 }}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={iconDataUrl} style={styles.proposalIcon} />
        </View>
      ) : null}
    </View>
  )
}

function ProposalFooter({
  proposal,
  showNumber,
}: {
  proposal: FinanceProposal
  showNumber: boolean
}) {
  const { display } = proposal
  if (!display.footer.enabled && !display.showPageNumbers) return null

  return (
    <View style={styles.footer} wrap={false}>
      <View style={styles.footerRow}>
        <Text style={styles.footerIssuer}>{proposal.issuer.nameEn}</Text>
        <View style={styles.footerCenter}>
          {display.footer.enabled ? (
            <Text style={styles.footerText}>{display.footer.text}</Text>
          ) : null}
        </View>
        <View style={styles.footerRight}>
          {showNumber ? (
            <Text style={styles.footerNum}>{proposal.number}</Text>
          ) : null}
        </View>
      </View>
      {display.showPageNumbers ? (
        <Text
          style={styles.pageNum}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
        />
      ) : null}
    </View>
  )
}

function ProposalPageContent({ data }: { data: PreparedProposalPdf }) {
  const { proposal, brand } = data
  const { display } = proposal
  const mdBrand = toMarkdownBrand(brand)
  const showNumber = display.showProposalNumber !== false
  const showDate = display.showDate !== false
  const featuresLabel = display.featuresLabel || "Features"

  return (
    <View style={styles.pageInner} wrap={false}>
      <View style={styles.body}>
        <ProposalHeaderBlock data={data} />

        <LetterheadTitle title={proposal.title} subtitle={proposal.subtitle} />

        <LetterheadMetaTable
          customer={proposal.customer}
          language={proposal.language}
          number={proposal.number}
          numberLabelEn={proposal.numberLabelEn || "Proposal reference"}
          numberLabelAr={proposal.numberLabelAr || "مرجع العرض"}
          date={proposal.date}
          showNumber={showNumber}
          showDate={showDate}
        />

        {display.showMarkdown && proposal.markdown.trim() ? (
          <View style={{ marginBottom: 4 }}>
            <PdfMarkdownBody source={proposal.markdown} brand={mdBrand} />
          </View>
        ) : null}

        <FeaturesBlock proposal={proposal} label={featuresLabel} />
        <OfferBlock proposal={proposal} />
        <ComparisonBlock proposal={proposal} />
      </View>

      <ProposalFooter proposal={proposal} showNumber={showNumber} />
    </View>
  )
}

export function ProposalPdfDocument({
  pages,
}: {
  pages: PreparedProposalPdf[]
}) {
  return (
    <Document
      title={
        pages.length === 1
          ? pages[0]!.proposal.title
          : `Proposals (${pages.length})`
      }
      author={pages[0]?.proposal.issuer.nameEn ?? "TailoredTech Finance"}
    >
      {pages.map((data) => (
        <Page
          key={data.proposal.id}
          size="A4"
          style={styles.page}
          wrap={false}
        >
          <ProposalPageContent data={data} />
        </Page>
      ))}
    </Document>
  )
}
