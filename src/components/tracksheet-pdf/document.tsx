import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import type { Tracksheet } from "@/lib/tracksheets/types"
import { flattenTracksheet } from "@/lib/tracksheets/numbering"
import {
  getPalette,
  statusLabel,
  statusSwatch,
  typeLabel,
  typeSwatch,
} from "@/lib/tracksheets/palettes"

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 32,
    paddingHorizontal: 28,
    fontFamily: "Helvetica",
  },
  partners: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  logo: {
    width: 84,
    height: 36,
    objectFit: "contain",
  },
  partnerMark: {
    fontSize: 12,
    color: "#8A8A8A",
  },
  meta: {
    marginLeft: "auto",
    alignItems: "flex-end",
    gap: 2,
  },
  metaLabel: {
    fontSize: 8,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#6A6A6A",
  },
  metaValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  project: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  description: {
    fontSize: 9,
    lineHeight: 1.4,
    marginBottom: 12,
  },
  tableHead: {
    flexDirection: "row",
    minHeight: 18,
  },
  headCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  category: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 6,
  },
  categoryText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
  },
  numCell: {
    width: 52,
    paddingHorizontal: 4,
    paddingVertical: 6,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  numText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
  },
  itemCell: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  itemTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  itemBody: {
    fontSize: 8,
    lineHeight: 1.35,
    marginTop: 2,
  },
  badgeCell: {
    width: 108,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
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
    left: 28,
    right: 28,
    bottom: 12,
    fontSize: 8,
    color: "#8A8A8A",
  },
})

export function TracksheetPdfDocument({
  sheet,
  images,
}: {
  sheet: Tracksheet
  images: Record<string, string>
}) {
  const palette = getPalette(sheet.paletteId)
  const showNo = sheet.numbering.enabled
  const showStatus = sheet.columns.status
  const showType = sheet.columns.type
  const showImages = sheet.columns.images
  const vendor = sheet.vendorLogo ? images[sheet.vendorLogo] : undefined
  const client = sheet.clientLogo ? images[sheet.clientLogo] : undefined

  return (
    <Document title={sheet.title || sheet.projectName || "Tracksheet"}>
      <Page size="A4" orientation="landscape" style={[styles.page, { backgroundColor: palette.paper }]}>
        <View style={styles.partners}>
          {vendor ? <Image src={vendor} style={styles.logo} /> : null}
          {vendor && client ? <Text style={styles.partnerMark}>×</Text> : null}
          {client ? <Image src={client} style={styles.logo} /> : null}
          <View style={styles.meta}>
            {sheet.refNumber ? (
              <Text style={[styles.metaLabel, { color: palette.muted }]}>Ref {sheet.refNumber}</Text>
            ) : null}
            {sheet.clientName ? (
              <Text style={[styles.metaValue, { color: palette.ink }]}>{sheet.clientName}</Text>
            ) : null}
          </View>
        </View>

        <Text style={[styles.project, { color: palette.primary }]}>
          {sheet.projectName || "Project"}
        </Text>
        <Text style={[styles.title, { color: palette.ink }]}>{sheet.title || "Tracksheet"}</Text>
        {sheet.description ? (
          <Text style={[styles.description, { color: palette.muted }]}>{sheet.description}</Text>
        ) : null}

        <View style={[styles.tableHead, { backgroundColor: palette.primary }]}>
          {showNo ? (
            <Text style={[styles.headCell, styles.numCell, { color: palette.primaryText, width: 52 }]}>
              No.
            </Text>
          ) : null}
          <Text style={[styles.headCell, { color: palette.primaryText, flex: 1 }]}>Item</Text>
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
          const type = typeSwatch(palette, row.item.type, row.item.customTypeColor)
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
                  borderBottomWidth: 0.6,
                  borderBottomColor: palette.line,
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
              {showStatus ? (
                <View style={[styles.badgeCell, { backgroundColor: status.bg }]}>
                  <Text style={[styles.badgeText, { color: status.fg }]}>{statusLabel(row.item.status)}</Text>
                </View>
              ) : null}
              {showType ? (
                <View style={[styles.badgeCell, { backgroundColor: type.bg }]}>
                  <Text style={[styles.badgeText, { color: type.fg }]}>
                    {typeLabel(row.item.type, row.item.customTypeLabel)}
                  </Text>
                </View>
              ) : null}
            </View>
          )
        })}

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
