"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

/**
 * Site chrome that hides Navbar + Footer on /presentations, /notes, and /finance.
 * Direct-URL surfaces — no marketing chrome (SEO-isolated / gated modules).
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const bare =
    pathname.startsWith("/presentations") ||
    pathname.startsWith("/notes") ||
    pathname.startsWith("/finance")

  return (
    <>
      {!bare && <Navbar />}
      <main className="flex-1 w-full overflow-x-clip">{children}</main>
      {!bare && <Footer />}
    </>
  )
}
