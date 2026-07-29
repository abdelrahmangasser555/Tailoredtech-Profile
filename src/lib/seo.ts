import type { Metadata } from "next"
import company from "@/config/company.json"
import type { Company, ServiceItem } from "@/lib/content"

/** Canonical public site URL. Override with NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  company.seo.siteUrl?.replace(/\/$/, "") ??
  "https://tailoredtech.tech"

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${SITE_URL}${normalized}`
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
}: {
  title: string
  description: string
  path: string
  keywords?: string[]
  type?: "website" | "article"
}): Metadata {
  const url = absoluteUrl(path)

  return {
    title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_US",
      url,
      siteName: "TailoredTech",
      title,
      description,
      images: [
        {
          url: absoluteUrl("/logo.svg"),
          width: 512,
          height: 512,
          alt: "TailoredTech maritime software",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl("/logo-light.svg")],
    },
  }
}

export function buildOrganizationJsonLd(company: Company) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: company.legalName,
    alternateName: company.name,
    description: company.seo.description,
    url: SITE_URL,
    email: company.contact.email,
    ...(company.contact.phone ? { telephone: company.contact.phone } : {}),
    logo: absoluteUrl("/logo.svg"),
    image: absoluteUrl("/logo-light.svg"),
    address: {
      "@type": "PostalAddress",
      addressLocality: company.contact.city?.replace(", UAE", "") ?? "Dubai",
      addressCountry: "AE",
    },
    sameAs: Object.values(company.social).filter(Boolean),
    knowsAbout: company.seo.keywords,
  }
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "TailoredTech",
    description:
      "Tailored maritime software solutions and digital risk assessment platforms for shipping operators.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/services?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}

export function buildProfessionalServiceJsonLd(company: Company) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#professional-service`,
    name: company.legalName,
    url: SITE_URL,
    description: company.seo.description,
    areaServed: "Worldwide",
    serviceType: [
      "Maritime software solutions",
      "Maritime risk assessment software",
      "Custom maritime software development",
      "Digital risk assessment for vessels",
      "Shipping safety and compliance software",
    ],
    provider: { "@id": `${SITE_URL}/#organization` },
  }
}

export function buildSoftwareApplicationJsonLd(service: ServiceItem) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: service.title,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android",
    description: service.description,
    url: absoluteUrl(service.href),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Contact for licensing and deployment options",
    },
    provider: { "@id": `${SITE_URL}/#organization` },
    featureList: service.page.outcomes.map((o) => o.label),
  }
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function buildItemListJsonLd(
  services: ServiceItem[],
  listName = "Maritime software solutions"
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: listName,
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(service.href),
      name: service.title,
    })),
  }
}

const SOLUTION_KEYWORDS: Record<string, string[]> = {
  "digital-risk-assessments": [
    "maritime risk assessment software",
    "digital risk assessment",
    "vessel risk assessment software",
    "fleet risk management software",
    "office superintendent risk platform",
    "maritime hazard assessment software",
    "shipping safety risk assessments",
  ],
  "moc-pcr": [
    "maritime management of change software",
    "procedure change request software",
    "MOC software shipping",
    "vessel change control software",
    "maritime compliance workflow software",
  ],
  "bbs": [
    "behaviour based safety software maritime",
    "BBS software shipping",
    "vessel safety observation software",
    "maritime safety culture platform",
    "ICP form software maritime",
  ],
  "sdr": [
    "stevedore damage report software",
    "vessel damage reporting software",
    "maritime damage claim software",
    "shipping stevedore liability software",
  ],
}

export function buildSolutionMetadata(service: ServiceItem): Metadata {
  const slugKeywords = SOLUTION_KEYWORDS[service.id] ?? []
  const title =
    service.id === "digital-risk-assessments"
      ? `${service.title} | Maritime Risk Assessment Software`
      : `${service.title} | Maritime Software Solutions`

  const description =
    service.page.tagline?.slice(0, 155) ?? service.description.slice(0, 155)

  return buildPageMetadata({
    title,
    description,
    path: service.href,
    keywords: [
      ...slugKeywords,
      "maritime software solutions",
      "tailored maritime software",
      "custom maritime software",
      service.title,
    ],
  })
}
