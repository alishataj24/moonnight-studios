import { useEffect, useRef, useState } from "react"
import { contact } from "../data/content"
import { sections, studio } from "../data/studio"
import type { WorldId } from "./PortalGate"

/**
 * THE RAIL.
 *
 * Navigation lives in the left margin and stays there, rather than
 * floating across the top of the pictures. Three reasons:
 *
 *   it frees the entire right of the screen for imagery, which is the
 *   whole point of the site;
 *
 *   it gives the page a permanent left edge to align everything else
 *   against, which is what makes a layout read as composed rather than
 *   stacked;
 *
 *   it never crosses a picture, so it needs no scrim, no inversion and
 *   no hiding on scroll — it is simply always there.
 *
 * Below 1100px there is no margin to live in, so the name sits in a
 * bar and the links move into a sheet.
 */
export function SiteRail({
  onWorld,
  onContact,
}: {
  onWorld: (id: WorldId) => void
  onContact: () => void
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState("")
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const targets = [...new Set(sections.map((s) => s.id))]
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => Boolean(n))
    if (!targets.length || typeof IntersectionObserver === "undefined") return
    // Track the whole set, not just the latest entries: otherwise a
    // section stays marked current long after it has left the screen,
    // which is worse than marking nothing.
    const onScreen = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) onScreen.set(entry.target.id, entry.intersectionRatio)
          else onScreen.delete(entry.target.id)
        }
        const best = [...onScreen.entries()].sort((a, b) => b[1] - a[1])[0]
        setActive(best ? best[0] : "")
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] },
    )
    targets.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.toggle("is-locked", open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  const startProject = () => {
    setOpen(false)
    onContact()
  }

  const items = sections.map((item, i) => {
    const onClick = (event: React.MouseEvent) => {
      setOpen(false)
      if (item.world) {
        event.preventDefault()
        onWorld(item.world)
      } else if (item.id === "contact") {
        event.preventDefault()
        onContact()
      }
    }
    return (
      <a
        key={`${item.label}-${i}`}
        href={item.world ? `#${item.world}` : `#${item.id}`}
        className="rail-link"
        data-active={!item.world && active === item.id ? "true" : undefined}
        onClick={onClick}
      >
        {item.label}
      </a>
    )
  })

  const startControl = (className = "rail-start") => (
    <button type="button" className={className} onClick={startProject}>
      {contact.cta}
      <span className="arrow" aria-hidden="true">
        ↗
      </span>
    </button>
  )

  return (
    <>
      <header className="rail">
        <a className="wordmark" href="#top">
          <img src="/brand/mark.png" alt={studio.wordmark} />
        </a>
        <nav className="rail-nav" aria-label="Sections">
          {items}
        </nav>
        <p className="rail-foot">Independent creative production</p>
      </header>

      <div className="rail-start-desk">{startControl()}</div>

      <header className="mobile-bar">
        <a className="bar-mark" href="#top" onClick={() => setOpen(false)}>
          <img src="/brand/mark.png" alt="" />
          <span>{studio.wordmark}</span>
        </a>

        <div className="bar-actions">
          {startControl()}
          <button
            ref={toggleRef}
            type="button"
            className="rail-toggle"
            aria-expanded={open}
            aria-controls="rail-sheet"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      <div className="rail-sheet" id="rail-sheet" data-open={open} inert={!open}>
        {items}
        {startControl("rail-start rail-start-sheet")}
      </div>
    </>
  )
}
