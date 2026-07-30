"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

/**
 * Site chrome that hides Navbar + Footer on /presentations routes.
 * Presentations are direct-URL surfaces — no marketing chrome.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const bare = pathname.startsWith("/presentations")

  return (
    <>
      {!bare && <Navbar />}
      <main className="flex-1 w-full overflow-x-clip">{children}</main>
      {!bare && <Footer />}
    </>
  )
}
