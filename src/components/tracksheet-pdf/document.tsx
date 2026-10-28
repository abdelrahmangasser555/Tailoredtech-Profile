import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { Tracksheet } from "@/lib/tracksheets/types"
import { flattenTracksheet } from "@/lib/tracksheets/numbering"
import { footnotePlainLines, formatTargetDate } from "@/lib/tracksheets/format"
import {
  getPalette,
  printFontFamily,
  printFontFamilyBold,
  statusLabel,
  statusSwatch,
  typeLabel,
} from "@/lib/tracksheets/palettes"
import { scalePt, tracksheetPdfScale } from "@/lib/tracksheets/pdf-fit"

function buildStyles(bodyFont: string, boldFont: string, scale: number) {
  const s = (n: number) => scalePt(n, scale)
  return StyleSheet.create({
    page: {
      paddingTop: s(22),
      paddingBottom: s(26),
      paddingHorizontal: s(24),
      fontFamily: bodyFont,
    },
    decorRing: {
      position: "absolute",
      top: 18,
      left: 18,
      width: 72,
      height: 72,
      borderRadius: 36,
      borderWidth: 1.5,
      borderStyle: "dashed",
      opacity: 0.35,
    },
    headerBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: s(8),
    },
    logo: {
      width: s(108),
      height: s(44),
      objectFit: "contain",
    },
    metaRow: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginBottom: s(6),
      gap: s(8),
    },
    metaLabel: {
      fontSize: s(7.5),
      letterSpacing: 0.8,
      textTransform: "uppercase",
      color: "#6A6A6A",
    },
    metaValue: {
      fontSize: s(9),
      fontFamily: boldFont,
    },
    project: {
      fontSize: s(15),
      fontFamily: boldFont,
      marginBottom: s(1),
    },
    title: {
      fontSize: s(10.5),
      fontFamily: boldFont,
      marginBottom: s(2),
    },
    description: {
      fontSize: s(8),
      lineHeight: 1.3,
      marginBottom: s(8),
    },
    footnote: {
      fontSize: s(7),
      lineHeight: 1.28,
      marginBottom: s(5),
      marginTop: s(2),
    },
    tableHead: {
      flexDirection: "row",
      minHeight: s(16),
    },
    headCell: {
      fontSize: s(7.5),
      fontFamily: boldFont,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      paddingHorizontal: s(5),
      paddingVertical: s(3),
    },
    row: {
      flexDirection: "row",
      alignItems: "stretch",
    },
    category: {
      paddingHorizontal: s(6),
      paddingVertical: s(4),
      marginTop: s(2),
    },
    categoryText: {
      fontSize: s(9.5),
      fontFamily: boldFont,
    },
    numCell: {
      width: s(46),
      paddingHorizontal: s(3),
      paddingVertical: s(4),
      justifyContent: "flex-start",
      alignItems: "center",
    },
    numText: {
      fontSize: s(8),
      fontFamily: boldFont,
    },
    itemCell: {
      flex: 1,
      paddingHorizontal: s(6),
      paddingVertical: s(4),
    },
    dateCell: {
      width: s(66),
      paddingHorizontal: s(3),
      paddingVertical: s(4),
      justifyContent: "center",
      alignItems: "center",
    },
    dateText: {
      fontSize: s(7.5),
      textAlign: "center",
    },
    itemTitle: {
      fontSize: s(8.5),
      fontFamily: boldFont,
    },
    itemBody: {
      fontSize: s(7),
      lineHeight: 1.28,
      marginTop: s(1),
    },
    badgeCell: {
      width: s(96),
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: s(4),
      paddingVertical: s(4),
    },
    badgeText: {
      fontSize: s(7),
      fontFamily: boldFont,
      textAlign: "center",
    },
    shots: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 4,
      marginTop: 6,
    },
    shot: {
      width: 78,
      height: 48,
      objectFit: "cover",
    },
    footer: {
      position: "absolute",
      left: s(24),
      right: s(24),
      bottom: s(10),
      fontSize: s(7),
      color: "#8A8A8A",
    },
  })
}

function FootnoteBlock({
  markdown,
  muted,
  styles,
}: {
  markdown: string
  muted: string
  styles: ReturnType<typeof buildStyles>
}) {
  const lines = footnotePlainLines(markdown)
  if (!lines.length) return null
  return (
    <View>
      {lines.map((line) => (
        <Text key={line} style={[styles.footnote, { color: muted }]}>{line}</Text>
      ))}
    </View>
  )
}

export function TracksheetPdfDocument({
  sheet,
  images,
}: {
  sheet: Tracksheet
  images: Record<string, string>
}) {
  const palette = getPalette(sheet.paletteId)
  const bodyFont = printFontFamily(sheet.paletteId)
  const boldFont = printFontFamilyBold(sheet.paletteId)
  const scale = tracksheetPdfScale(sheet)
  const styles = buildStyles(bodyFont, boldFont, scale)
  const showNo = sheet.numbering.enabled
  const showStatus = sheet.columns.status
  const showType = sheet.columns.type
  const showImages = sheet.columns.images
  const showTarget = sheet.columns.targetDate
  const itemLabel = sheet.display.itemColumnLabel || "Items"
  const vendor = sheet.vendorLogo ? images[sheet.vendorLogo] : undefined
  const client = sheet.clientLogo ? images[sheet.clientLogo] : undefined
  const decor = sheet.display.decor
  const footnote = sheet.display.footnote
  const tableBorders = sheet.display.tableBorders

  return (
    <Document title={sheet.title || sheet.projectName || "Tracksheet"}>
      <Page
        size="A4"
        orientation="landscape"
        wrap={false}
        style={[styles.page, { backgroundColor: palette.paper }]}
      >
        {decor.enabled && decor.variant === "dotted-ring-tl" ? (
          <View style={[styles.decorRing, { borderColor: decor.color }]} />
        ) : null}

        <View style={styles.headerBar}>
          {client ? <Image src={client} style={styles.logo} /> : <View />}
          {vendor ? <Image src={vendor} style={styles.logo} /> : <View />}
        </View>
        {sheet.refNumber || sheet.clientName ? (
          <View style={styles.metaRow}>
            {sheet.refNumber ? (
              <Text style={[styles.metaLabel, { color: palette.muted }]}>Ref {sheet.refNumber}</Text>
            ) : null}
            {sheet.clientName ? (
              <Text style={[styles.metaValue, { color: palette.ink }]}>{sheet.clientName}</Text>
            ) : null}
          </View>
        ) : null}

        <Text style={[styles.project, { color: palette.primary }]}>
          {sheet.projectName || "Project"}
        </Text>
        <Text style={[styles.title, { color: palette.ink }]}>{sheet.title || "Tracksheet"}</Text>
        {sheet.description ? (
          <Text style={[styles.description, { color: palette.muted }]}>{sheet.description}</Text>
        ) : null}

        {footnote.enabled && footnote.position === "before" ? (
          <FootnoteBlock markdown={footnote.markdown} muted={palette.muted} styles={styles} />
        ) : null}

        <View style={[styles.tableHead, { backgroundColor: palette.primary }]}>
          {showNo ? (
            <Text style={[styles.headCell, styles.numCell, { color: palette.primaryText, width: 52 }]}>
              No.
            </Text>
          ) : null}
          <Text style={[styles.headCell, { color: palette.primaryText, flex: 1 }]}>{itemLabel}</Text>
          {showTarget ? (
            <Text style={[styles.headCell, styles.dateCell, { color: palette.primaryText }]}>
              Target date
            </Text>
          ) : null}
          {showStatus ? (
            <Text style={[styles.headCell, styles.badgeCell, { color: palette.primaryText }]}>
              Status
            </Text>
          ) : null}
          {showType ? (
            <Text style={[styles.headCell, styles.badgeCell, { color: palette.primaryText }]}>
              Type
            </Text>
          ) : null}
        </View>

        {flattenTracksheet(sheet).map((row, index) => {
          if (row.kind === "category") {
            return (
              <View key={row.category.id} style={[styles.category, { backgroundColor: palette.primary }]}>
                <Text style={[styles.categoryText, { color: palette.primaryText }]}>
                  {row.number ? `${row.number}   ${row.category.title}` : row.category.title}
                </Text>
              </View>
            )
          }

          const status = statusSwatch(palette, row.item.status)
          const shots = showImages
            ? row.item.images.map((path) => images[path]).filter((src): src is string => !!src)
            : []

          return (
            <View
              key={row.item.id}
              style={[
                styles.row,
                {
                  backgroundColor: index % 2 === 0 ? palette.paper : palette.soft,
                  ...(tableBorders
                    ? {
                        borderBottomWidth: 0.6,
                        borderBottomColor: palette.line,
                      }
                    : {}),
                },
              ]}
            >
              {showNo ? (
                <View style={styles.numCell}>
                  <Text style={[styles.numText, { color: palette.primary, marginLeft: (row.depth - 1) * 2 }]}>
                    {row.number}
                  </Text>
                </View>
              ) : null}
              <View style={[styles.itemCell, { paddingLeft: 8 + (row.depth - 1) * 10 }]}>
                <Text style={[styles.itemTitle, { color: palette.ink }]}>
                  {row.item.title || "Untitled"}
                </Text>
                {row.item.description ? (
                  <Text style={[styles.itemBody, { color: palette.muted }]}>{row.item.description}</Text>
                ) : null}
                {shots.length ? (
                  <View style={styles.shots}>
                    {shots.map((src) => (
                      <Image key={src.slice(-24)} src={src} style={styles.shot} />
                    ))}
                  </View>
                ) : null}
              </View>
              {showTarget ? (
                <View style={styles.dateCell}>
                  <Text style={[styles.dateText, { color: palette.ink }]}>
                    {formatTargetDate(row.item.targetDate) || "—"}
                  </Text>
                </View>
              ) : null}
              {showStatus ? (
                <View style={[styles.badgeCell, { backgroundColor: status.bg }]}>
                  <Text style={[styles.badgeText, { color: status.fg }]}>{statusLabel(row.item.status)}</Text>
                </View>
              ) : null}
              {showType ? (
                <View style={styles.badgeCell}>
                  <Text style={[styles.badgeText, styles.dateText, { color: palette.ink, fontFamily: bodyFont }]}>
                    {typeLabel(row.item.type, row.item.customTypeLabel)}
                  </Text>
                </View>
              ) : null}
            </View>
          )
        })}

        {footnote.enabled && footnote.position === "after" ? (
          <FootnoteBlock markdown={footnote.markdown} muted={palette.muted} styles={styles} />
        ) : null}

        <Text
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `${sheet.projectName || "Tracksheet"}${sheet.refNumber ? `  ·  ${sheet.refNumber}` : ""}  ·  ${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  )
}
