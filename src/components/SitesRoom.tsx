import { useCallback, useEffect, useState } from "react"
import { sites } from "../data/sites"
import { useWheelStep } from "../hooks/useWheelStep"
import { WorldChrome } from "./ImageExhibition"

/**
 * SITES — the product room.
 *
 * Films want a strip. Stills want a field. Products want a surface you
 * can look at and then open. One plate at a time: the live site on the
 * right, the name and one true line on the left. The rest wait as a thin
 * index along the foot, so the room stays a cut rather than a logo wall.
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
      <div className="sites-stage">
        <div className="sites-copy">
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
          <p className="sites-count">
            {String(index + 1).padStart(2, "0")} / {String(sites.length).padStart(2, "0")}
          </p>
        </div>

        <a
          className="sites-surface"
          href={work.href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={`Open ${work.name}`}
        >
          <img key={work.id} src={work.poster} alt={work.alt} decoding="async" />
        </a>
      </div>

      <div className="sites-index" role="tablist" aria-label="Sites">
        {sites.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            className="sites-thumb"
            data-on={i === index || undefined}
            onClick={() => setIndex(i)}
          >
            <img src={item.poster} alt="" loading="lazy" decoding="async" />
            <span>{item.name}</span>
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
