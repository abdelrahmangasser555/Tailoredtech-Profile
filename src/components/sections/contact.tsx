"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { Section } from "@/components/layout/section"
import { TextReveal, Reveal } from "@/components/motion/reveal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { site } from "@/lib/content"

export function Contact() {
  const { company } = site
  const [pending, setPending] = useState(false)
  const [sent, setSent] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    const form = e.currentTarget
    const data = new FormData(form)
    await new Promise((r) => setTimeout(r, 700))
    console.info("Contact form:", Object.fromEntries(data.entries()))
    setPending(false)
    setSent(true)
    form.reset()
    toast.success("Message sent. We'll be in touch shortly.")
  }

  return (
    <Section tone="dark" id="contact">
      <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div>
          <p className="mb-4 font-mono text-[11px] tracking-[0.22em] uppercase text-accent">
            Contact
          </p>
          <TextReveal
            text="Tell us what you're building"
            className="font-pixel-circle text-4xl md:text-5xl font-medium tracking-tight leading-[1.05]"
          />
          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-col gap-2 text-sm text-white/45">
              <a
                href={`mailto:${company.contact.email}`}
                className="inline-flex py-1 hover:text-accent transition-colors"
              >
                {company.contact.email}
              </a>
              {company.contact.phone ? (
                <a
                  href={`tel:${company.contact.phone.replace(/\s/g, "")}`}
                  className="inline-flex py-1 hover:text-accent transition-colors"
                >
                  {company.contact.phone}
                </a>
              ) : null}
              {company.contact.city ? <p>{company.contact.city}</p> : null}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          {sent ? (
            <div className="flex flex-col items-start gap-3 py-4">
              <CheckCircle2 className="size-7 text-accent" />
              <p className="font-pixel-circle text-2xl font-medium">Received</p>
              <p className="text-sm text-white/45">We'll follow up soon.</p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-2 text-sm text-accent hover:underline"
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-white/50 text-xs tracking-wide uppercase">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    className="h-11 rounded-sm border-0 border-b border-white/20 bg-transparent px-0 text-white placeholder:text-white/25 focus-visible:border-accent focus-visible:ring-0"
                    placeholder="Your name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email" className="text-white/50 text-xs tracking-wide uppercase">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="h-11 rounded-sm border-0 border-b border-white/20 bg-transparent px-0 text-white placeholder:text-white/25 focus-visible:border-accent focus-visible:ring-0"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="company" className="text-white/50 text-xs tracking-wide uppercase">
                  Company
                </Label>
                <Input
                  id="company"
                  name="company"
                  className="h-11 rounded-sm border-0 border-b border-white/20 bg-transparent px-0 text-white placeholder:text-white/25 focus-visible:border-accent focus-visible:ring-0"
                  placeholder="Company name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="message" className="text-white/50 text-xs tracking-wide uppercase">
                  Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={3}
                  className="rounded-sm border-0 border-b border-white/20 bg-transparent px-0 text-white placeholder:text-white/25 focus-visible:border-accent focus-visible:ring-0 resize-none"
                  placeholder="What do you need?"
                />
              </div>
              <Button
                type="submit"
                disabled={pending}
                className="mt-2 w-fit rounded-sm bg-accent text-accent-foreground hover:bg-accent/90 h-11 px-6"
              >
                {pending ? "Sending…" : "Send"}
                {!pending && <ArrowRight data-icon="inline-end" />}
              </Button>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  )
}
