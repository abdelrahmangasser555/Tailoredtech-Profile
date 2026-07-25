"use client"

import { useEffect, useState } from "react"
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
import { site } from "@/lib/content"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { company, navigation, services } = site
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-5 md:px-8 pt-4">
        <nav
          className={cn(
            "flex items-center justify-between gap-4 px-1 py-3 transition-all duration-500",
            scrolled &&
              "rounded-sm border border-border/50 bg-background/80 px-4 backdrop-blur-xl shadow-sm"
          )}
        >
          <Link href="/" className="shrink-0">
            <Image
              src={scrolled ? company.logo.light : company.logo.dark}
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
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => setOpen(false)}
                >
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1 px-3 py-2 text-sm transition-colors",
                      scrolled
                        ? "text-foreground/70 hover:text-foreground"
                        : "text-white/75 hover:text-white"
                    )}
                    aria-expanded={open}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "size-3.5 transition-transform duration-300",
                        open && "rotate-180"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute left-1/2 top-full z-50 pt-4 -translate-x-1/2"
                      >
                        <SolutionsMega onNavigate={() => setOpen(false)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 text-sm transition-colors",
                    scrolled
                      ? "text-foreground/70 hover:text-foreground"
                      : "text-white/75 hover:text-white"
                  )}
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
              className="hidden sm:inline-flex rounded-sm bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href={navigation.cta.href}>{navigation.cta.label}</Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "lg:hidden",
                    !scrolled && "text-white hover:bg-white/10"
                  )}
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
                      className="rounded-sm px-3 py-2.5 text-sm font-medium hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="mt-4 flex flex-col gap-1 border-t border-border pt-4">
                    <p className="px-3 mb-2 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
                      Solutions
                    </p>
                    {services.items.map((s, i) => (
                      <Link
                        key={s.id}
                        href={s.href}
                        className="flex items-center gap-3 rounded-sm px-3 py-2 hover:bg-muted"
                      >
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm">{s.title}</span>
                      </Link>
                    ))}
                  </div>
                  <Button asChild className="mt-4 mx-3 rounded-sm">
                    <Link href={navigation.cta.href}>{navigation.cta.label}</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  )
}

function SolutionsMega({ onNavigate }: { onNavigate: () => void }) {
  const { services } = site

  return (
    <div className="w-[min(92vw,36rem)] rounded-sm border border-border bg-background p-2 shadow-2xl text-foreground">
      <div className="grid sm:grid-cols-2 gap-0.5">
        {services.items.map((s, i) => (
          <Link
            key={s.id}
            href={s.href}
            onClick={onNavigate}
            className={cn(
              "group flex flex-col gap-1 rounded-sm p-4 transition-colors hover:bg-muted",
              i === 0 &&
                "sm:col-span-2 sm:flex-row sm:items-end sm:justify-between sm:bg-muted/50"
            )}
          >
            <div>
              <span className="font-mono text-[10px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mt-1 flex items-center gap-1.5 font-heading text-sm font-medium">
                {s.title}
                <ArrowUpRight className="size-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {s.short}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-end px-3 py-2 border-t border-border mt-1">
        <Link
          href="/services"
          onClick={onNavigate}
          className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
        >
          View all
          <ArrowUpRight className="size-3" />
        </Link>
      </div>
    </div>
  )
}
