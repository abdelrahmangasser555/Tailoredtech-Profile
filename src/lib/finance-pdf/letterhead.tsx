import { View, Text, Image, StyleSheet } from "@react-pdf/renderer"
import { MixedText } from "@/lib/finance-pdf/mixed-text"
import type { InvoiceCustomer, InvoiceIssuer, InvoiceLanguageMode } from "@/lib/finance/types"

const INK = "#1a1a1a"
const MUTED = "#444444"
const BORDER = "#9a9a9a"
const LABEL_BG = "#e8e8e8"

export const letterheadStyles = StyleSheet.create({
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
    marginBottom: 6,
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
  subtitle: {
    fontFamily: "InvoiceSans",
    fontSize: 9,
    color: MUTED,
    textAlign: "center",
    marginBottom: 10,
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
  fixedHeader: {
    position: "absolute",
    top: 28,
    left: 28,
    right: 28,
    backgroundColor: "#FFFFFF",
    paddingBottom: 6,
    borderBottomWidth: 0.75,
    borderBottomColor: BORDER,
  },
})

function bilingual(language: InvoiceLanguageMode) {
  return language === "bilingual"
}

function MultilineMixed({ text, style }: { text: string; style: object }) {
  const lines = text.split("\n")
  return (
    <View>
      {lines.map((line, i) => (
        <MixedText key={i} style={style}>
          {line || " "}
        </MixedText>
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
      <View style={letterheadStyles.metaLabelAr}>
        <Text style={letterheadStyles.metaLabelTextAr}>{ar}</Text>
      </View>
    )
  }
  return (
    <View
      style={
        showAr
          ? letterheadStyles.metaLabelEn
          : [letterheadStyles.metaLabelEn, { width: 110 }]
      }
    >
      <Text style={letterheadStyles.metaLabelTextEn}>{en}</Text>
    </View>
  )
}

function MetaValueCell({ text }: { text: string }) {
  return (
    <View style={letterheadStyles.metaValue}>
      <MultilineMixed text={text} style={letterheadStyles.metaValueText} />
    </View>
  )
}

export function LetterheadHeader({
  issuer,
  logoDataUrl,
  language,
}: {
  issuer: InvoiceIssuer
  logoDataUrl: string | null
  language: InvoiceLanguageMode
}) {
  const showAr = bilingual(language)

  return (
    <View style={letterheadStyles.header}>
      <View style={letterheadStyles.headerSide}>
        <Text style={letterheadStyles.enName}>{issuer.nameEn}</Text>
        {issuer.addressEn.split("\n").map((line, i) => (
          <Text key={i} style={letterheadStyles.enLine}>
            {line}
          </Text>
        ))}
        {issuer.vatNumber ? (
          <Text style={letterheadStyles.enLine}>VAT: {issuer.vatNumber}</Text>
        ) : null}
        {issuer.commercialNumber ? (
          <Text style={letterheadStyles.enLine}>700: {issuer.commercialNumber}</Text>
        ) : null}
      </View>

      <View style={letterheadStyles.headerCenter}>
        {logoDataUrl ? (
          // eslint-disable-next-line jsx-a11y/alt-text
          <Image src={logoDataUrl} style={letterheadStyles.logo} />
        ) : null}
      </View>

      <View style={letterheadStyles.headerSide}>
        {showAr ? (
          <>
            <Text style={letterheadStyles.arName}>{issuer.nameAr}</Text>
            {issuer.addressAr.split("\n").map((line, i) => (
              <Text key={i} style={letterheadStyles.arLine}>
                {line}
              </Text>
            ))}
            {issuer.vatNumber ? (
              <View style={{ marginBottom: 1 }}>
                <MixedText style={[letterheadStyles.arLine, { textAlign: "right" }]}>
                  {`الرقم الضريبي: ${issuer.vatNumber}`}
                </MixedText>
              </View>
            ) : null}
            {issuer.commercialNumber ? (
              <View style={{ marginBottom: 1 }}>
                <MixedText style={[letterheadStyles.arLine, { textAlign: "right" }]}>
                  {`700: ${issuer.commercialNumber}`}
                </MixedText>
              </View>
            ) : null}
          </>
        ) : null}
      </View>
    </View>
  )
}

export function LetterheadMetaTable({
  customer,
  language,
  number,
  numberLabelEn,
  numberLabelAr,
  date,
  showNumber,
  showDate,
}: {
  customer: InvoiceCustomer
  language: InvoiceLanguageMode
  number: string
  numberLabelEn: string
  numberLabelAr: string
  date: string
  showNumber: boolean
  showDate: boolean
}) {
  const showAr = bilingual(language)

  return (
    <View style={letterheadStyles.metaTable}>
      <View style={letterheadStyles.metaRow}>
        <MetaLabel en="Customer" ar="العميل" showAr={showAr} side="en" />
        <MetaValueCell text={customer.name} />
        <MetaLabel en="Customer" ar="العميل" showAr={showAr} side="ar" />
      </View>
      <View style={letterheadStyles.metaRow}>
        <MetaLabel en="Address" ar="العنوان" showAr={showAr} side="en" />
        <MetaValueCell text={customer.address} />
        <MetaLabel en="Address" ar="العنوان" showAr={showAr} side="ar" />
      </View>
      <View
        style={showNumber || showDate ? letterheadStyles.metaRow : letterheadStyles.metaRowLast}
      >
        <MetaLabel en="Other ID" ar="معرف آخر" showAr={showAr} side="en" />
        <MetaValueCell text={customer.otherId} />
        <MetaLabel en="Other ID" ar="معرف آخر" showAr={showAr} side="ar" />
      </View>
      {showNumber || showDate ? (
        <View style={letterheadStyles.metaRowLast}>
          {showNumber ? (
            <View
              style={[
                letterheadStyles.halfMeta,
                showDate ? letterheadStyles.halfMetaBorder : undefined,
              ]}
            >
              <MetaLabel
                en={numberLabelEn}
                ar={numberLabelAr}
                showAr={showAr}
                side="en"
              />
              <MetaValueCell text={number} />
              <MetaLabel
                en={numberLabelEn}
                ar={numberLabelAr}
                showAr={showAr}
                side="ar"
              />
            </View>
          ) : null}
          {showDate ? (
            <View
              style={
                showNumber
                  ? letterheadStyles.halfMeta
                  : [letterheadStyles.halfMeta, { flex: 1 }]
              }
            >
              <MetaLabel en="Date" ar="التاريخ" showAr={showAr} side="en" />
              <MetaValueCell text={date} />
              <MetaLabel en="Date" ar="التاريخ" showAr={showAr} side="ar" />
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  )
}

export function LetterheadTitle({
  title,
  subtitle,
}: {
  title: string
  subtitle?: string
}) {
  return (
    <>
      <View style={letterheadStyles.titleRow}>
        <Text style={letterheadStyles.title}>{title}</Text>
      </View>
      {subtitle ? (
        <Text style={letterheadStyles.subtitle}>{subtitle}</Text>
      ) : null}
    </>
  )
}
