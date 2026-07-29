import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { GeistPixelCircle } from "geist/font/pixel"
import { Toaster } from "@/components/ui/sonner"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { SmoothScroll } from "@/components/motion/smooth-scroll"
import { JsonLd } from "@/components/seo/json-ld"
import { site } from "@/lib/content"
import { buildThemeCss } from "@/lib/theme"
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  SITE_URL,
} from "@/lib/seo"
import "./globals.css"

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const { company } = site

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: company.seo.title,
    template: `%s | ${company.name}`,
  },
  description: company.seo.description,
  keywords: company.seo.keywords,
  authors: [{ name: company.legalName, url: SITE_URL }],
  creator: company.name,
  publisher: company.legalName,
  category: "technology",
  applicationName: company.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: company.name,
    title: company.seo.title,
    description: company.seo.description,
    images: [
      {
        url: "/logo-light.svg",
        width: 512,
        height: 512,
        alt: company.logo.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: company.seo.title,
    description: company.seo.description,
    images: ["/logo-light.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "x-default": "/",
    },
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${GeistPixelCircle.variable} h-full`}
      style={
        {
          "--font-display": "var(--font-geist)",
          "--font-heading": "var(--font-geist)",
          "--font-body": "var(--font-geist)",
          "--font-serif": "var(--font-geist)",
          "--font-pixel-circle": "var(--font-geist-pixel-circle)",
        } as React.CSSProperties
      }
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: buildThemeCss() }} />
        <JsonLd
          data={[buildOrganizationJsonLd(company), buildWebSiteJsonLd()]}
        />
      </head>
      <body className="min-h-full flex flex-col overflow-x-clip font-sans">
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
