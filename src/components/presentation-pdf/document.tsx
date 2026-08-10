import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Svg,
  Rect,
  Line,
} from "@react-pdf/renderer"
import type { PreparedPresentationPdf } from "@/lib/presentation-pdf/prepare-assets"
import { PdfMarkdownBody } from "@/lib/presentation-pdf/markdown"
import type { ComparisonCell, ComparisonRow } from "@/components/sections/solution-comparison-table"

const PAGE = {
  width: "A4" as const,
  padding: 40,
}

function PdfPageFooter({
  brandName,
  pageLabel,
  accent,
  muted,
}: {
  brandName: string
  pageLabel: string
  accent: string
  muted: string
}) {
  return (
    <View
      style={{
        position: "absolute",
        left: PAGE.padding,
        right: PAGE.padding,
        bottom: 24,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      fixed
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View style={{ width: 10, height: 2, backgroundColor: accent }} />
        <Text
          style={{
            fontFamily: "GeistMono",
            fontSize: 7,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: muted,
          }}
        >
          {brandName}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: "GeistMono",
          fontSize: 7,
          letterSpacing: 1.2,
          color: muted,
        }}
        render={({ pageNumber, totalPages }) =>
          `${pageLabel}  ·  ${String(pageNumber).padStart(2, "0")} / ${String(totalPages).padStart(2, "0")}`
        }
      />
    </View>
  )
}

function DashedRule({ color, width = 515 }: { color: string; width?: number }) {
  return (
    <Svg width={width} height={3} style={{ marginTop: 20, marginBottom: 20 }}>
      <Line
        x1={0}
        y1={1.5}
        x2={width}
        y2={1.5}
        stroke={color}
        strokeWidth={1.25}
        strokeDasharray="5 4"
        strokeLinecap="round"
      />
    </Svg>
  )
}

function CheckMark({ color }: { color: string }) {
  // Drawn shapes: Unicode check is missing from embedded TTF glyphs
  const cells: Array<[number, number]> = [
    [4, 9],
    [6, 11],
    [8, 9],
    [10, 7],
    [12, 5],
  ]
  return (
    <Svg width={12} height={12} viewBox="0 0 18 18">
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
    <Svg width={12} height={12} viewBox="0 0 18 18">
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

function ComparisonRowLabelPdf({
  label,
  star,
  primary,
  primaryForeground,
}: {
  label: string
  star?: boolean
  primary: string
  primaryForeground: string
}) {
  if (!star) {
    return (
      <Text
        style={{
          fontFamily: "GeistSans",
          fontSize: 7,
          fontWeight: 500,
          color: primary,
          opacity: 0.88,
        }}
      >
        {label}
      </Text>
    )
  }

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 4 }}>
      <Text
        style={{
          fontFamily: "GeistSans",
          fontSize: 7,
          fontWeight: 500,
          color: primary,
          opacity: 0.88,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 2,
          backgroundColor: primary,
          paddingHorizontal: 4,
          paddingVertical: 2,
        }}
      >
        <Text style={{ fontSize: 6, color: primaryForeground }}>★</Text>
        <Text
          style={{
            fontFamily: "GeistMono",
            fontSize: 5.5,
            letterSpacing: 0.8,
            textTransform: "uppercase",
            color: primaryForeground,
          }}
        >
          Star
        </Text>
      </View>
    </View>
  )
}

function ComparisonCellPdf({
  cell,
  ink,
  muted,
  comparisonCheck,
  comparisonXMark,
}: {
  cell: ComparisonCell
  ink: string
  muted: string
  comparisonCheck: string
  comparisonXMark: string
}) {
  if (cell.type === "check") return <CheckMark color={comparisonCheck} />
  if (cell.type === "x") return <XMark color={comparisonXMark} />
  if (cell.type === "number") {
    return (
      <Text
        style={{
          fontFamily: "GeistPixel",
          fontSize: 8,
          color: ink,
        }}
      >
        {String(cell.value)}
      </Text>
    )
  }
  return (
    <Text style={{ fontFamily: "GeistSans", fontSize: 7, color: muted, textAlign: "center" }}>
      {String(cell.value)}
    </Text>
  )
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    paddingTop: PAGE.padding,
    paddingBottom: 52,
    paddingHorizontal: PAGE.padding,
    fontFamily: "GeistSans",
  },
  coverAccentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 6,
  },
  coverSideRail: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 8,
    bottom: 0,
  },
})

export function PresentationPdfDocument({ data }: { data: PreparedPresentationPdf }) {
  const { presentation, brand, clientLogoDataUrl, sections, generatedAt, options } =
    data
  const { page } = presentation
  const comparison = page.comparison
  const showComparison =
    options.includeComparison &&
    Boolean(comparison?.enabled && comparison.rows.length > 0)
  const showOutcomes = options.includeOutcomes && Boolean(page.outcomes?.length)

  return (
    <Document
      title={presentation.title}
      author="TailoredTech"
      subject={presentation.description}
      creator="TailoredTech Presentation Export"
    >
      {/* ── Cover ───────────────────────────────────────────────────────── */}
      {options.includeCover ? (
      <Page size="A4" style={styles.page}>
        <View style={[styles.coverAccentBar, { backgroundColor: brand.accent }]} />
        <View style={[styles.coverSideRail, { backgroundColor: brand.primary }]} />

        <View style={{ paddingLeft: 12, paddingTop: 28, flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {clientLogoDataUrl ? (
              // @react-pdf Image — not a DOM <img>
              // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt
              <Image
                src={clientLogoDataUrl}
                style={{ height: 42, width: 160, objectFit: "contain" }}
              />
            ) : (
              <Text
                style={{
                  fontFamily: "GeistPixel",
                  fontSize: 16,
                  color: brand.primary,
                }}
              >
                {presentation.clientName ?? brand.name}
              </Text>
            )}
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontFamily: "GeistMono",
                  fontSize: 7,
                  letterSpacing: 1.2,
                  color: brand.muted,
                }}
              >
                {generatedAt}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 64 }}>
            {page.eyebrow ? (
              <Text
                style={{
                  fontFamily: "GeistMono",
                  fontSize: 9,
                  letterSpacing: 2.2,
                  textTransform: "uppercase",
                  color: brand.accent,
                  marginBottom: 16,
                }}
              >
                {page.eyebrow}
              </Text>
            ) : null}

            <Text
              style={{
                fontFamily: "GeistPixel",
                fontSize: 52,
                lineHeight: 1.02,
                color: brand.ink,
                maxWidth: 480,
              }}
            >
              {page.headline}
            </Text>
            <Text
              style={{
                fontFamily: "GeistPixel",
                fontSize: 52,
                lineHeight: 1.02,
                color: brand.accent,
                marginTop: 2,
                maxWidth: 480,
              }}
            >
              {page.headlineAccent}
            </Text>

            <DashedRule color={brand.accent} width={515} />

            <Text
              style={{
                fontFamily: "GeistSans",
                fontSize: 11,
                lineHeight: 1.6,
                color: brand.muted,
                maxWidth: 400,
              }}
            >
              {page.tagline}
            </Text>
          </View>

          {showOutcomes ? (
            <View
              style={{
                marginTop: "auto",
                marginBottom: 28,
                flexDirection: "row",
                gap: 10,
              }}
            >
              {page.outcomes.map((outcome) => (
                <View
                  key={outcome.label}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: brand.border,
                    backgroundColor: brand.soft,
                    paddingVertical: 14,
                    paddingHorizontal: 12,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "GeistPixel",
                      fontSize: 18,
                      color: brand.ink,
                      marginBottom: 6,
                    }}
                  >
                    {outcome.value}
                  </Text>
                  <Text
                    style={{
                      fontFamily: "GeistMono",
                      fontSize: 7,
                      letterSpacing: 1.1,
                      textTransform: "uppercase",
                      color: brand.muted,
                      lineHeight: 1.35,
                    }}
                  >
                    {outcome.label}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={{ marginTop: "auto", marginBottom: 36 }} />
          )}

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: brand.border,
              paddingTop: 14,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontFamily: "GeistMono",
                fontSize: 7,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                color: brand.muted,
              }}
            >
              {presentation.title}
            </Text>
            <Text
              style={{
                fontFamily: "GeistMono",
                fontSize: 7,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                color: brand.muted,
              }}
            >
              TailoredTech
            </Text>
          </View>
        </View>
      </Page>
      ) : null}

      {/* ── Comparison (forced single page, compact) ───────────────────── */}
      {showComparison && comparison ? (
        <Page
          size="A4"
          style={{
            ...styles.page,
            paddingTop: 28,
            paddingBottom: 40,
            paddingHorizontal: 28,
          }}
          wrap={false}
        >
          <Text
            style={{
              fontFamily: "GeistMono",
              fontSize: 7,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: brand.muted,
              marginBottom: 4,
            }}
          >
            {comparison.eyebrow || "Compare"}
          </Text>
          <Text
            style={{
              fontFamily: "GeistPixel",
              fontSize: 16,
              color: brand.ink,
              marginBottom: 12,
              maxWidth: 460,
            }}
          >
            {comparison.title}
          </Text>

          <View
            style={{
              borderWidth: 1,
              borderColor: brand.border,
              backgroundColor: "#FFFFFF",
            }}
            wrap={false}
          >
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 1,
                borderBottomColor: brand.border,
              }}
              wrap={false}
            >
              <View
                style={{
                  width: "36%",
                  backgroundColor: brand.headerBg,
                  paddingVertical: 6,
                  paddingHorizontal: 7,
                  borderRightWidth: 1,
                  borderRightColor: brand.border,
                }}
              >
                <Text
                  style={{
                    fontFamily: "GeistMono",
                    fontSize: 6,
                    letterSpacing: 1.2,
                    textTransform: "uppercase",
                    color: brand.muted,
                  }}
                >
                  Capability
                </Text>
              </View>
              {comparison.columns.map((col) => (
                <View
                  key={col.id}
                  style={{
                    width: `${64 / comparison.columns.length}%`,
                    backgroundColor: col.highlight
                      ? brand.headerHighlightBg
                      : brand.headerBg,
                    paddingVertical: 6,
                    paddingHorizontal: 6,
                    borderLeftWidth: 1,
                    borderLeftColor: brand.border,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "GeistPixel",
                      fontSize: 8,
                      color: col.highlight ? brand.ink : brand.muted,
                    }}
                  >
                    {col.label}
                  </Text>
                </View>
              ))}
            </View>

            {(comparison.rows as readonly ComparisonRow[]).map((row, rowIndex) => (
              <View
                key={row.label}
                style={{
                  flexDirection: "row",
                  borderBottomWidth:
                    rowIndex === comparison.rows.length - 1 ? 0 : 1,
                  borderBottomColor: "rgba(10,10,10,0.08)",
                  minHeight: 20,
                }}
                wrap={false}
              >
                <View
                  style={{
                    width: "36%",
                    paddingVertical: 4,
                    paddingHorizontal: 7,
                    borderRightWidth: 1,
                    borderRightColor: "rgba(10,10,10,0.08)",
                    justifyContent: "center",
                    backgroundColor: "#FFFFFF",
                  }}
                >
                  <ComparisonRowLabelPdf
                    label={row.label}
                    star={row.star}
                    primary={brand.primary}
                    primaryForeground={brand.accentForeground}
                  />
                </View>
                {row.cells.map((cell, ci) => {
                  const col = comparison.columns[ci]
                  return (
                    <View
                      key={`${row.label}-${ci}`}
                      style={{
                        width: `${64 / comparison.columns.length}%`,
                        paddingVertical: 4,
                        paddingHorizontal: 4,
                        borderLeftWidth: 1,
                        borderLeftColor: "rgba(10,10,10,0.08)",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: col?.highlight ? brand.soft : "#FFFFFF",
                      }}
                    >
                      <ComparisonCellPdf
                        cell={cell}
                        ink={brand.ink}
                        muted={brand.muted}
                        comparisonCheck={brand.comparisonCheck ?? brand.ink}
                        comparisonXMark={brand.comparisonXMark ?? brand.muted}
                      />
                    </View>
                  )
                })}
              </View>
            ))}
          </View>

          <PdfPageFooter
            brandName={brand.name}
            pageLabel="Comparison"
            accent={brand.accent}
            muted={brand.muted}
          />
        </Page>
      ) : null}

      {/* ── Sections ────────────────────────────────────────────────────── */}
      {sections.map((section, index) => (
        <Page key={section.id} size="A4" style={styles.page} wrap>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 18,
              paddingBottom: 12,
              borderBottomWidth: 1,
              borderBottomColor: brand.border,
            }}
          >
            <View style={{ flex: 1, paddingRight: 16 }}>
              <Text
                style={{
                  fontFamily: "GeistMono",
                  fontSize: 8,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: brand.accent,
                  marginBottom: 6,
                }}
              >
                Section {String(index + 1).padStart(2, "0")}
              </Text>
              <Text
                style={{
                  fontFamily: "GeistPixel",
                  fontSize: 20,
                  color: brand.ink,
                }}
              >
                {section.title}
              </Text>
            </View>
            <View
              style={{
                width: 36,
                height: 36,
                backgroundColor: brand.primary,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "GeistPixel",
                  fontSize: 12,
                  color: "#FFFFFF",
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </Text>
            </View>
          </View>

          <PdfMarkdownBody source={section.body} brand={brand} />

          {section.bullets.length > 0 ? (
            <View style={{ marginTop: 6, marginBottom: 12 }}>
              {section.bullets.map((bullet) => (
                <View
                  key={bullet}
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    marginBottom: 6,
                  }}
                  wrap={false}
                >
                  <View
                    style={{
                      width: 5,
                      height: 5,
                      marginTop: 4,
                      backgroundColor: brand.accent,
                    }}
                  />
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: "GeistSans",
                      fontSize: 10,
                      lineHeight: 1.5,
                      color: brand.muted,
                    }}
                  >
                    {bullet}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {section.images.length > 0 ? (
            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontFamily: "GeistMono",
                  fontSize: 7,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                  color: brand.accent,
                  marginBottom: 8,
                }}
              >
                Gallery · {section.images.length}
              </Text>
              <View style={{ gap: 12 }}>
                {section.images.map((image) => (
                  <View
                    key={`${image.src}-${image.label}`}
                    style={{
                      borderWidth: 1,
                      borderColor: brand.border,
                      backgroundColor: brand.soft,
                      marginBottom: 12,
                    }}
                  >
                    {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
                    <Image
                      src={image.src}
                      style={{
                        width: "100%",
                        maxHeight: 240,
                        objectFit: "contain",
                      }}
                    />
                    {image.label ? (
                      <View
                        style={{
                          borderTopWidth: 1,
                          borderTopColor: brand.border,
                          paddingVertical: 8,
                          paddingHorizontal: 10,
                          backgroundColor: "#FFFFFF",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "GeistPixel",
                            fontSize: 9,
                            color: brand.ink,
                          }}
                        >
                          {image.label}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {section.mermaidPng ? (
            <View style={{ marginTop: 16, marginBottom: 8 }}>
              <Text
                style={{
                  fontFamily: "GeistMono",
                  fontSize: 7,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                  color: brand.accent,
                  marginBottom: 8,
                }}
              >
                {section.mermaidTitle || "Workflow"}
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: brand.border,
                  backgroundColor: "#FFFFFF",
                  padding: 10,
                }}
              >
                {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt */}
                <Image
                  src={section.mermaidPng}
                  style={{
                    width: "100%",
                    maxHeight: 220,
                    objectFit: "contain",
                  }}
                />
              </View>
              {section.mermaidCaption ? (
                <Text
                  style={{
                    marginTop: 6,
                    fontFamily: "GeistMono",
                    fontSize: 7,
                    color: brand.muted,
                    letterSpacing: 0.4,
                  }}
                >
                  {section.mermaidCaption}
                </Text>
              ) : null}
            </View>
          ) : null}

          <PdfPageFooter
            brandName={brand.name}
            pageLabel={section.title}
            accent={brand.accent}
            muted={brand.muted}
          />
        </Page>
      ))}
    </Document>
  )
}
