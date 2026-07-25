import Link from "next/link"
import Image from "next/image"
import { site } from "@/lib/content"

export function Footer() {
  const { company, navigation, services } = site
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[var(--section-dark)] text-white">
      <div className="mx-auto max-w-6xl px-5 md:px-8 pt-20 pb-10">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5 flex flex-col gap-6">
            <Link href="/" className="inline-flex w-fit">
              <Image
                src={company.logo.dark}
                alt={company.logo.alt}
                width={150}
                height={34}
                className="h-7 w-auto"
              />
            </Link>
            <p className="max-w-xs font-heading text-2xl md:text-3xl font-medium tracking-tight leading-snug text-white/90">
              {company.tagline}
            </p>
            <div className="flex gap-5 text-xs tracking-wide uppercase text-white/40">
              {Object.entries(company.social).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  {key}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 flex flex-col gap-3">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">
              Navigate
            </p>
            {navigation.links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-white/55 hover:text-white transition-colors w-fit"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="md:col-span-4 flex flex-col gap-3">
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 mb-1">
              Solutions
            </p>
            {services.items.slice(0, 4).map((s) => (
              <Link
                key={s.id}
                href={s.href}
                className="text-sm text-white/55 hover:text-accent transition-colors w-fit"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-white/10 pt-8 text-xs text-white/30">
          <p>
            © {year} {company.legalName}
          </p>
          <a
            href={`mailto:${company.contact.email}`}
            className="hover:text-accent transition-colors"
          >
            {company.contact.email}
          </a>
        </div>
      </div>
    </footer>
  )
}
