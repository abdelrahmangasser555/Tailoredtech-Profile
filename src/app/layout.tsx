import type { Metadata, Viewport } from "next"
import { Syne, Manrope, Unbounded, Instrument_Serif, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { SmoothScroll } from "@/components/motion/smooth-scroll"
import { site } from "@/lib/content"
import { buildThemeCss } from "@/lib/theme"
import "./globals.css"

const display = Unbounded({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
})

const heading = Syne({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
})

const body = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
})

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const { company } = site

export const metadata: Metadata = {
  metadataBase: new URL("https://tailoredtech.io"),
  title: {
    default: company.seo.title,
    template: `%s | ${company.name}`,
  },
  description: company.seo.description,
  keywords: company.seo.keywords,
  authors: [{ name: company.legalName }],
  creator: company.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tailoredtech.io",
    siteName: company.name,
    title: company.seo.title,
    description: company.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: company.seo.title,
    description: company.seo.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f6f8" },
    { media: "(prefers-color-scheme: dark)", color: "#080b12" },
  ],
  width: "device-width",
  initialScale: 1,
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.legalName,
  alternateName: company.name,
  description: company.seo.description,
  url: "https://tailoredtech.io",
  email: company.contact.email,
  telephone: company.contact.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: company.contact.city,
  },
  sameAs: Object.values(company.social),
  knowsAbout: company.seo.keywords,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${heading.variable} ${body.variable} ${serif.variable} ${geistMono.variable} h-full`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: buildThemeCss() }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-clip">
        <SmoothScroll>
          <Navbar />
          <main className="flex-1 w-full overflow-x-clip">{children}</main>
          <Footer />
          <Toaster />
        </SmoothScroll>
      </body>
    </html>
  )
}
