"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { slides } from "./slides"
import { bahriBody, bahriDisplay, displayFace, SLIDE_H, SLIDE_W } from "./theme"

function useSlideScale() {
  const [scale, setScale] = useState(1)
  const [node, setNode] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!node) return
    const update = () => {
      const pad = 24
      const width = node.clientWidth - pad
      const height = node.clientHeight - pad
      if (width <= 0 || height <= 0) return
      setScale(Math.min(width / SLIDE_W, height / SLIDE_H))
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [node])

  return { scale, setNode }
}

export function BahriLogisticsDeck() {
  const [index, setIndex] = useState(0)
  const { scale, setNode } = useSlideScale()
  const slide = slides[index] ?? slides[0]

  const go = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, next))
    setIndex(clamped)
    const id = slides[clamped]?.id
    if (id && window.location.hash !== `#${id}`) {
      history.replaceState(null, "", `#${id}`)
    }
  }, [])

  useEffect(() => {
    const applyHash = () => {
      const id = window.location.hash.replace("#", "")
      const found = slides.findIndex((item) => item.id === id)
      if (found >= 0) setIndex(found)
    }
    applyHash()
    window.addEventListener("hashchange", applyHash)
    return () => window.removeEventListener("hashchange", applyHash)
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")
      ) {
        return
      }
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault()
        go(index + 1)
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault()
        go(index - 1)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go, index])

  return (
    <div className={cn(bahriBody.className, bahriBody.variable, bahriDisplay.variable, "bg-[#E6EBF0] text-[#003C71]")}>
      <h1 className="sr-only">Bahri Logistics Module. Walkthrough and orientation.</h1>

      <div className="lg:hidden">
        <nav className="sticky top-0 z-20 flex gap-2 overflow-x-auto bg-[#003C71] px-3 py-2">
          {slides.map((item) => (
            <a
              key={item.id}
              href={`#doc-${item.id}`}
              className="shrink-0 bg-white/10 px-2.5 py-1 text-[12px] font-medium text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        {slides.map((item) => (
          <section
            key={item.id}
            id={`doc-${item.id}`}
            aria-label={item.label}
            className="scroll-mt-12"
          >
            {item.render("doc")}
          </section>
        ))}
      </div>

      <div className="hidden h-svh flex-col lg:flex">
        <div ref={setNode} className="relative min-h-0 flex-1">
          <div
            className="absolute top-1/2 left-1/2 shadow-[0_16px_50px_rgba(0,31,61,0.16)]"
            style={{
              width: SLIDE_W,
              height: SLIDE_H,
              transform: `translate(-50%, -50%) scale(${scale})`,
            }}
            data-slide-canvas
            data-slide={slide.id}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}. ${slide.label}`}
          >
            {slide.render("deck")}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-[#003C71]/10 bg-white px-4 py-2.5">
          <p className={cn(displayFace, "text-[13px]")}>
            {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            <span className="ml-3 font-medium text-[#5C6B7A]">{slide.label}</span>
          </p>
          <div className="flex items-center gap-1.5">
            {slides.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                data-goto={item.id}
                aria-label={item.label}
                aria-current={itemIndex === index}
                onClick={() => go(itemIndex)}
                className={cn(
                  "h-2 w-2",
                  itemIndex === index ? "bg-[#FF681D]" : "bg-[#003C71]/25"
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              className="inline-flex items-center gap-1 border border-[#003C71]/20 px-3 py-1.5 text-[13px] font-medium disabled:opacity-40"
            >
              <ChevronLeft className="size-4" aria-hidden />
              Back
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              disabled={index === slides.length - 1}
              className="inline-flex items-center gap-1 bg-[#003C71] px-3 py-1.5 text-[13px] font-medium text-white disabled:opacity-40"
            >
              Next
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
