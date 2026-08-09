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

const PAGE = {
  width: "A4" as const,
  padding: 36,
}

const BORDER = "rgba(10,10,10,0.22)"
const LABEL_BG = "#F0F0EE"

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
    paddingTop: PAGE.padding,
    paddingHorizontal: PAGE.padding,
    paddingBottom: 52,
    fontFamily: "GeistSans",
    backgroundColor: "#FFFFFF",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 0.75,
    borderBottomColor: BORDER,
  },
  brandBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    height: 30,
    maxWidth: 120,
    objectFit: "contain",
  },
  icon: {
    width: 26,
    height: 26,
    objectFit: "contain",
  },
  brandName: {
    fontFamily: "GeistSans",
    fontWeight: 500,
    fontSize: 11,
  },
  metaBlock: {
    alignItems: "flex-end",
    maxWidth: 240,
  },
  metaLabel: {
    fontFamily: "GeistSans",
    fontSize: 7,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  metaValue: {
    fontFamily: "GeistSans",
    fontSize: 10,
    textAlign: "right",
  },
  title: {
    fontFamily: "GeistSans",
    fontWeight: 500,
    fontSize: 17,
    marginBottom: 3,
  },
  subtitle: {
    fontFamily: "GeistSans",
    fontSize: 10,
    marginBottom: 12,
  },
  sectionLabel: {
    fontFamily: "GeistSans",
    fontSize: 7.5,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 6,
    marginTop: 12,
  },
  solutionName: {
    fontFamily: "GeistSans",
    fontWeight: 500,
    fontSize: 11,
    marginBottom: 3,
  },
  solutionDesc: {
    fontFamily: "GeistSans",
    fontSize: 9,
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
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  colLabel: { flex: 1, fontSize: 9 },
  colQty: { width: 40, fontSize: 9, textAlign: "right" },
  colAmount: { width: 78, fontSize: 9, textAlign: "right" },
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
    fontFamily: "GeistSans",
    fontSize: 9,
  },
  totalValue: {
    fontFamily: "GeistSans",
    fontWeight: 500,
    fontSize: 10,
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
    fontFamily: "GeistSans",
    fontSize: 8,
    width: 16,
  },
  featureTitle: {
    fontFamily: "GeistSans",
    fontWeight: 500,
    fontSize: 9,
  },
  featureDesc: {
    fontFamily: "GeistSans",
    fontSize: 8,
    lineHeight: 1.35,
    marginTop: 1,
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
    position: "absolute",
    left: PAGE.padding,
    right: PAGE.padding,
    bottom: 18,
    borderTopWidth: 0.75,
    borderTopColor: BORDER,
    paddingTop: 6,
    alignItems: "center",
  },
  footerText: {
    fontFamily: "GeistSans",
    fontSize: 7,
    textAlign: "center",
    lineHeight: 1.35,
  },
  pageNum: {
    fontFamily: "GeistSans",
    fontSize: 7,
    marginTop: 2,
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

function CellValue({
  cell,
  ink,
  muted,
}: {
  cell: ProposalComparisonCell
  ink: string
  muted: string
}) {
  if (cell.type === "check") {
    return cell.value ? <CheckMark color={ink} /> : <XMark color={muted} />
  }
  if (cell.type === "x") {
    return <XMark color={muted} />
  }
  return (
    <Text style={{ fontSize: 8, color: ink }}>{String(cell.value)}</Text>
  )
}

function BreakdownTable({
  solution,
  currency,
  brand,
}: {
  solution: ProposalSolution
  currency: string
  brand: ProposalPdfBrand
}) {
  const sub = solutionSubtotal(solution)
  const total = solutionTotal(solution)

  return (
    <View wrap={false}>
      <Text style={[styles.solutionName, { color: brand.ink }]}>
        {solution.name}
      </Text>
      {solution.description ? (
        <Text style={[styles.solutionDesc, { color: brand.muted }]}>
          {solution.description}
        </Text>
      ) : null}

      {solution.lineItems.length > 0 ? (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.colLabel, { color: brand.muted }]}>Item</Text>
            <Text style={[styles.colQty, { color: brand.muted }]}>Qty</Text>
            <Text style={[styles.colAmount, { color: brand.muted }]}>
              Amount
            </Text>
          </View>
          {solution.lineItems.map((line, i) => (
            <View
              key={line.id}
              style={[
                styles.tableRow,
                i === solution.lineItems.length - 1
                  ? { borderBottomWidth: 0 }
                  : null,
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.colLabel, { color: brand.ink }]}>
                  {line.label}
                </Text>
                {line.note ? (
                  <Text
                    style={{ fontSize: 7, color: brand.muted, marginTop: 1 }}
                  >
                    {line.note}
                  </Text>
                ) : null}
              </View>
              <Text style={[styles.colQty, { color: brand.ink }]}>
                {line.quantity ?? 1}
              </Text>
              <Text style={[styles.colAmount, { color: brand.ink }]}>
                {formatMoney(lineItemTotal(line), currency)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      <View style={styles.totalsBlock}>
        <View style={styles.totalsRow}>
          <Text style={[styles.totalLabel, { color: brand.muted }]}>
            Subtotal
          </Text>
          <Text style={[styles.totalValue, { color: brand.ink }]}>
            {formatMoney(sub, currency)}
          </Text>
        </View>
        {solution.discounts.map((d) => (
          <View key={d.id} style={styles.totalsRow}>
            <Text style={[styles.totalLabel, { color: brand.muted }]}>
              {d.label}
              {typeof d.percent === "number" ? ` (${d.percent}%)` : ""}
            </Text>
            <Text style={[styles.totalValue, { color: brand.ink }]}>
              −{formatMoney(discountAmount(d, sub), currency)}
            </Text>
          </View>
        ))}
        <View style={styles.totalsRow}>
          <Text
            style={[styles.totalLabel, { color: brand.ink, fontWeight: 500 }]}
          >
            Total
          </Text>
          <Text style={[styles.totalValue, { color: brand.ink }]}>
            {formatMoney(total, currency)}
          </Text>
        </View>
      </View>
    </View>
  )
}

function PriceSummary({
  proposal,
  brand,
}: {
  proposal: FinanceProposal
  brand: ProposalPdfBrand
}) {
  return (
    <View>
      {proposal.solutions.map((solution) => (
        <View key={solution.id} style={{ marginBottom: 10 }} wrap={false}>
          <Text style={[styles.solutionName, { color: brand.ink }]}>
            {solution.name}
          </Text>
          {solution.prices.map((price) => (
            <View key={price.id} style={styles.priceRow}>
              <Text style={{ fontSize: 9, color: brand.ink }}>{price.label}</Text>
              <Text
                style={{ fontSize: 10, fontWeight: 500, color: brand.ink }}
              >
                {formatMoney(price.amount, proposal.currency)}
              </Text>
            </View>
          ))}
          {solution.discounts.map((d) => (
            <Text
              key={d.id}
              style={{ fontSize: 8, color: brand.muted, marginTop: 2 }}
            >
              {d.label}
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
  brand,
}: {
  proposal: FinanceProposal
  brand: ProposalPdfBrand
}) {
  if (!proposal.display.showFeatures || proposal.features.length === 0) {
    return null
  }
  return (
    <View>
      <Text style={[styles.sectionLabel, { color: brand.muted }]}>
        Features
      </Text>
      {proposal.features.map((f, i) => (
        <View key={f.id} style={styles.featureRow} wrap={false}>
          <Text style={[styles.featureIndex, { color: brand.muted }]}>
            {String(i + 1).padStart(2, "0")}
          </Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.featureTitle, { color: brand.ink }]}>
              {f.title}
            </Text>
            {f.description ? (
              <Text style={[styles.featureDesc, { color: brand.muted }]}>
                {f.description}
              </Text>
            ) : null}
          </View>
        </View>
      ))}
    </View>
  )
}

function ComparisonBlock({
  proposal,
  brand,
}: {
  proposal: FinanceProposal
  brand: ProposalPdfBrand
}) {
  const cmp = proposal.comparison
  if (!proposal.display.showComparison || !cmp.enabled || !cmp.columns.length) {
    return null
  }

  const colWidth = `${Math.floor(55 / cmp.columns.length)}%`

  return (
    <View wrap={false}>
      <Text style={[styles.sectionLabel, { color: brand.muted }]}>
        {cmp.eyebrow || "Comparison"}
      </Text>
      <Text style={[styles.solutionName, { color: brand.ink, marginBottom: 6 }]}>
        {cmp.title}
      </Text>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={{ width: "45%", fontSize: 8, color: brand.muted }}>
            {" "}
          </Text>
          {cmp.columns.map((col) => (
            <Text
              key={col.id}
              style={{
                width: colWidth,
                fontSize: 8,
                color: col.highlight ? brand.ink : brand.muted,
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
              i === cmp.rows.length - 1 ? { borderBottomWidth: 0 } : null,
            ]}
          >
            <Text style={{ width: "45%", fontSize: 8, color: brand.ink }}>
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
                <CellValue cell={cell} ink={brand.ink} muted={brand.muted} />
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  )
}

function ProposalPageContent({ data }: { data: PreparedProposalPdf }) {
  const { proposal, brand, brandLogoDataUrl, iconDataUrl } = data
  const format = proposal.format
  const showBreakdown =
    proposal.display.showBreakdown &&
    (format === "formal-breakdown" ||
      (format === "formal-features" && proposal.display.showBreakdown))
  const showPrices = proposal.display.showPrices
  const mdBrand = toMarkdownBrand(brand)

  return (
    <>
      <View style={styles.headerRow}>
        <View style={styles.brandBlock}>
          {brandLogoDataUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={brandLogoDataUrl} style={styles.logo} />
          ) : (
            <Text style={[styles.brandName, { color: brand.primary }]}>
              {brand.name}
            </Text>
          )}
          {iconDataUrl ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={iconDataUrl} style={styles.icon} />
          ) : null}
        </View>
        <View style={styles.metaBlock}>
          <Text style={[styles.metaLabel, { color: brand.muted }]}>
            Prepared for
          </Text>
          <Text style={[styles.metaValue, { color: brand.ink }]}>
            {proposal.clientName || "—"}
          </Text>
        </View>
      </View>

      <Text style={[styles.title, { color: brand.ink }]}>{proposal.title}</Text>
      {proposal.subtitle ? (
        <Text style={[styles.subtitle, { color: brand.muted }]}>
          {proposal.subtitle}
        </Text>
      ) : (
        <View style={{ marginBottom: 8 }} />
      )}

      {proposal.display.showMarkdown && proposal.markdown.trim() ? (
        <View style={{ marginBottom: 4 }}>
          <PdfMarkdownBody source={proposal.markdown} brand={mdBrand} />
        </View>
      ) : null}

      {format === "formal-features" ||
      (format === "formal-breakdown" && proposal.display.showFeatures) ? (
        <FeaturesBlock proposal={proposal} brand={brand} />
      ) : null}

      {format === "formal-compact" ? null : showBreakdown ? (
        <View>
          <Text style={[styles.sectionLabel, { color: brand.muted }]}>
            Pricing breakdown
          </Text>
          {proposal.solutions.map((solution) => (
            <View key={solution.id} style={{ marginBottom: 12 }}>
              <BreakdownTable
                solution={solution}
                currency={proposal.currency}
                brand={brand}
              />
            </View>
          ))}
        </View>
      ) : null}

      {(format === "formal-compact" ||
        format === "formal-features" ||
        (!showBreakdown && showPrices)) &&
      showPrices ? (
        <View>
          <Text style={[styles.sectionLabel, { color: brand.muted }]}>
            {format === "formal-compact" ? "Pricing" : "Price summary"}
          </Text>
          <PriceSummary proposal={proposal} brand={brand} />
        </View>
      ) : null}

      {format === "formal-compact" && proposal.display.showFeatures ? (
        <FeaturesBlock proposal={proposal} brand={brand} />
      ) : null}

      <ComparisonBlock proposal={proposal} brand={brand} />

      {proposal.display.footer.enabled || proposal.display.showPageNumbers ? (
        <View style={styles.footer} fixed>
          {proposal.display.footer.enabled ? (
            <Text style={[styles.footerText, { color: brand.muted }]}>
              {proposal.display.footer.text}
            </Text>
          ) : null}
          {proposal.display.showPageNumbers ? (
            <Text
              style={[styles.pageNum, { color: brand.muted }]}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          ) : null}
        </View>
      ) : null}
    </>
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
      author="TailoredTech Finance"
    >
      {pages.map((data) => (
        <Page
          key={data.proposal.id}
          size={PAGE.width}
          style={[styles.page, { backgroundColor: data.brand.paper || "#FFFFFF" }]}
          wrap={false}
        >
          <ProposalPageContent data={data} />
        </Page>
      ))}
    </Document>
  )
}
