"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

/**
 * Site chrome that hides Navbar + Footer on /presentations and /notes.
 * Direct-URL surfaces — no marketing chrome (SEO-isolated learning docs).
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const bare =
    pathname.startsWith("/presentations") || pathname.startsWith("/notes")

  return (
    <>
      {!bare && <Navbar />}
      <main className="flex-1 w-full overflow-x-clip">{children}</main>
      {!bare && <Footer />}
    </>
  )
}
