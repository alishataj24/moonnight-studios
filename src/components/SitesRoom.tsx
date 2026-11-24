import { useCallback, useEffect, useState } from "react"
import { sites } from "../data/sites"
import { useWheelStep } from "../hooks/useWheelStep"
import { WorldChrome } from "./ImageExhibition"

/**
 * SITES — the product room.
 *
 * Dark field, the mark in the middle, words at the foot. No page
 * screenshots — the live site is behind Open site, not the plate.
 */
export function SitesRoom({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(0)
  const work = sites[index]

  const step = useCallback(
    (delta: number) => setIndex((i) => (i + delta + sites.length) % sites.length),
    [],
  )

  useWheelStep(step)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return onClose()
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault()
        step(1)
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault()
        step(-1)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose, step])

  if (!work) return null

  return (
    <div className="sites-room">
      <div className="sites-frame">
        {sites.map((item, i) => (
          <div
            key={item.id}
            className="sites-plate"
            data-on={i === index || undefined}
            aria-hidden={i === index ? undefined : true}
          >
            <img src={item.logo} alt={i === index ? item.alt : ""} decoding="async" />
          </div>
        ))}
        <span className="sites-veil" aria-hidden="true" />

        <div className="sites-words">
          <p className="sites-kind">{work.kind}</p>
          <h2 className="sites-name">{work.name}</h2>
          <p className="sites-line">{work.line}</p>
          <a
            className="cta sites-open"
            href={work.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            Open site
            <span className="arrow" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>

      <div className="sites-names" role="tablist" aria-label="Sites">
        {sites.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            className="sites-name-link"
            data-on={i === index || undefined}
            onClick={() => setIndex(i)}
          >
            {item.name}
          </button>
        ))}
      </div>

      <WorldChrome
        position={`${index + 1} / ${sites.length}`}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        hint="Scroll or use ← →"
      />
    </div>
  )
}
