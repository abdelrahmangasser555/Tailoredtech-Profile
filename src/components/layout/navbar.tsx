"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, ArrowUpRight, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ServiceVisual } from "@/components/ui/service-visual"
import { site } from "@/lib/content"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { company, navigation, services } = site
  const [megaOpen, setMegaOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      const top = y < 24
      setAtTop(top)

      if (top) {
        setHidden(false)
        lastY.current = y
        return
      }

      const delta = y - lastY.current
      if (Math.abs(delta) < 8) return

      if (delta > 0 && y > 90) {
        setHidden(true)
        setMegaOpen(false)
      } else if (delta < 0) {
        setHidden(false)
      }
      lastY.current = y
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const solid = !atTop

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={false}
      animate={{
        y: hidden ? "-110%" : "0%",
        opacity: hidden ? 0 : 1,
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={cn(
          "mx-auto px-5 pt-4 transition-[max-width,padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:px-8 md:pt-5",
          atTop ? "max-w-[100rem]" : "max-w-5xl md:px-5"
        )}
      >
        <nav
          className={cn(
            "flex items-center justify-between gap-4 px-1 py-2.5 transition-[background,padding,backdrop-filter] duration-500",
            solid && "bg-black/70 px-4 backdrop-blur-2xl"
          )}
        >
          <Link href="/" className="shrink-0">
            <Image
              src={company.logo.dark}
              alt={company.logo.alt}
              width={140}
              height={32}
              className="h-7 w-auto"
              priority
            />
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {navigation.links.map((link) =>
              link.mega ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 px-3 py-2 text-[13px] tracking-wide text-white/70 transition-colors hover:text-white"
                    aria-expanded={megaOpen}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-300",
                        megaOpen && "rotate-180"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {megaOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-1/2 top-full z-50 pt-4 -translate-x-1/2"
                      >
                        <SolutionsMega onNavigate={() => setMegaOpen(false)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 text-[13px] tracking-wide text-white/70 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex rounded-none bg-accent text-accent-foreground hover:brightness-95 px-4"
            >
              <Link href={navigation.cta.href}>
                {navigation.cta.label}
                <ArrowUpRight data-icon="inline-end" />
              </Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden text-white hover:bg-white/10"
                  aria-label="Open menu"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(100%,22rem)]">
                <SheetHeader>
                  <SheetTitle className="font-heading">{company.name}</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-1 px-2">
                  {navigation.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="rounded-none px-3 py-2.5 text-sm font-medium hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="mt-4 flex flex-col gap-1 pt-4">
                    <p className="px-3 mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                      Solutions
                    </p>
                    {services.items.map((s) => (
                      <Link
                        key={s.id}
                        href={s.href}
                        className="flex items-center gap-3 rounded-none px-3 py-2 hover:bg-muted"
                      >
                        <ServiceVisual
                          icon={s.icon}
                          logo={s.logo}
                          title={s.title}
                          className="size-8"
                        />
                        <span className="text-sm">{s.title}</span>
                      </Link>
                    ))}
                  </div>
                  <Button asChild className="mt-4 mx-3 rounded-none">
                    <Link href={navigation.cta.href}>{navigation.cta.label}</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}

function SolutionsMega({ onNavigate }: { onNavigate: () => void }) {
  const { services } = site

  return (
    <div className="w-[min(92vw,38rem)] rounded-none border border-white/10 bg-black/95 p-2 text-white shadow-2xl backdrop-blur-xl">
      <div className="grid sm:grid-cols-2 gap-0.5">
        {services.items.map((s, i) => (
          <Link
            key={s.id}
            href={s.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex gap-3 overflow-hidden rounded-none p-3.5 transition-colors hover:bg-white/5",
              i === 0 && "sm:col-span-2"
            )}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -left-0.5 -top-1 font-pixel-circle text-4xl font-medium text-white/[0.06] select-none"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
              <ServiceVisual
                icon={s.icon}
                logo={s.logo}
                title={s.title}
                bare
                className="opacity-0 scale-75 translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0"
              />
            </span>
            <div className="relative min-w-0">
              <div className="flex items-center gap-1.5 font-heading text-sm font-medium">
                {s.title}
                <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="mt-1 text-xs text-white/45 leading-relaxed">
                {s.short}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-end px-3 py-2 mt-1">
        <Link
          href="/services"
          onClick={onNavigate}
          className="inline-flex items-center gap-1 text-xs font-medium text-accent-foreground bg-accent px-2.5 py-1 rounded-none hover:brightness-95 transition"
        >
          View all
          <ArrowUpRight className="size-3" />
        </Link>
      </div>
    </div>
  )
}
