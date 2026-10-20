import { useCallback, useEffect, useRef, useState } from "react"
import { piece } from "../data/media"
import type { Piece } from "../data/portfolio"
import { exhibition, slots } from "../data/rooms"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"
import { useWheelStep } from "../hooks/useWheelStep"

/**
 * IMAGES — the exhibition.
 *
 * Not a grid, not a carousel, not a scroll. A field of pictures that
 * recomposes around whichever one you are looking at.
 *
 * One image holds the centre at full size; the rest sit in hand-placed
 * slots around it at different scales and depths. Changing the hero
 * rotates every picture by one slot, so the whole field moves at once
 * and each frame travels from a position you just saw it in to the next
 * one. That is what makes it read as choreography rather than a swap.
 *
 * Slots are hand-placed rather than generated: evenly spaced satellites
 * read as a carousel, and the gaps and the clustering are the point.
 *
 * Two interactions, learnable in one go:
 *   click a satellite   it comes to the centre
 *   click the centre    it opens to full bleed
 *
 * Arrow keys move the hero, Escape leaves. Closing a full-bleed image
 * returns to the same composition — the hero never resets.
 */
export function ImageExhibition({
  onOpen,
  onClose,
}: {
  onOpen: (item: Piece, collection: Piece[], origin: DOMRect) => void
  onClose: () => void
}) {
  const items = exhibition.map((id) => piece(id)).filter(Boolean) as Piece[]
  const [hero, setHero] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const reduced = usePrefersReducedMotion()

  const step = useCallback(
    (delta: number) => setHero((h) => (h + delta + items.length) % items.length),
    [items.length],
  )

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") return onClose()
      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault()
        step(1)
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault()
        step(-1)
      }
      if (event.key === "Home") { event.preventDefault(); setHero(0) }
      if (event.key === "End") { event.preventDefault(); setHero(items.length - 1) }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose, step, items.length])

  useWheelStep(step)

  // Pointer parallax straight onto custom properties — no render per move.
  const onMove = useCallback(
    (event: React.PointerEvent) => {
      const stage = stageRef.current
      if (!stage || reduced) return
      const r = stage.getBoundingClientRect()
      stage.style.setProperty("--mx", ((event.clientX - r.left) / r.width - 0.5).toFixed(3))
      stage.style.setProperty("--my", ((event.clientY - r.top) / r.height - 0.5).toFixed(3))
    },
    [reduced],
  )

  // Touch: swipe moves the hero.
  const touch = useRef<{ x: number; y: number } | null>(null)

  return (
    <div
      className="exhibition"
      ref={stageRef}
      onPointerMove={onMove}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }}
      onTouchEnd={(e) => {
        const s = touch.current
        touch.current = null
        if (!s) return
        const dx = e.changedTouches[0].clientX - s.x
        const dy = e.changedTouches[0].clientY - s.y
        if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.6) return
        step(dx < 0 ? 1 : -1)
      }}
    >
      {items.map((item, i) => {
        // Distance round the ring decides where this picture sits now.
        const offset = (i - hero + items.length) % items.length
        const isHero = offset === 0
        const slot = slots[offset - 1]
        const parked = !isHero && !slot

        return (
          <button
            key={item.id}
            type="button"
            className="plate"
            data-hero={isHero || undefined}
            data-parked={parked || undefined}
            style={
              {
                "--x": isHero ? 0 : (slot?.x ?? 0),
                "--y": isHero ? 0 : (slot?.y ?? 0),
                "--s": isHero ? 1 : (slot?.s ?? 0.1),
                // 8, not the top: one satellite deliberately sits in
                // front of the hero, which is what makes it a
                // composition rather than a ring of planets.
                "--z": isHero ? 8 : (slot?.z ?? 0),
                "--ar": item.crop ?? item.ratio,
              } as React.CSSProperties
            }
            // The hero is the only one that opens; the rest come forward.
            onClick={(event) => {
              if (isHero) onOpen(item, items, event.currentTarget.getBoundingClientRect())
              else setHero(i)
            }}
            aria-label={isHero ? `View larger: ${item.alt}` : `Bring forward: ${item.alt}`}
            aria-hidden={parked || undefined}
            tabIndex={parked ? -1 : 0}
          >
            <picture>
              {item.posterSmall && (
                <source srcSet={item.posterSmall} media="(max-width: 760px)" type="image/webp" />
              )}
              <img
                src={item.poster}
                alt={item.alt}
                loading={offset < 4 ? "eager" : "lazy"}
                decoding="async"
                style={{ objectPosition: item.focus }}
              />
            </picture>
          </button>
        )
      })}

      <WorldChrome
        position={`${hero + 1} / ${items.length}`}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        hint="Scroll or use ← →"
      />
    </div>
  )
}

/**
 * The only interface either world shows: where you are, two steps and a
 * way out. Shared so the two experiences feel like one house even
 * though they behave nothing alike.
 */
/** The step controls and the count. The way out is not here — it
 *  lives in `WorldOverlay`, first in the DOM, so Tab finds it before
 *  anything else in the room. */
export function WorldChrome({
  position,
  onPrev,
  onNext,
  hint,
}: {
  position: string
  onPrev: () => void
  onNext: () => void
  /** What moves this room. Each one is driven differently, so neither
   *  can own the sentence. */
  hint?: string
}) {
  return (
    <div className="world-chrome">
      <span className="world-count" aria-hidden="true">
        {position}
      </span>
      <div className="world-steps">
        <button type="button" onClick={onPrev} aria-label="Previous">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 4L7 12l8 8" /></svg>
        </button>
        <button type="button" onClick={onNext} aria-label="Next">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4l8 8-8 8" /></svg>
        </button>
        {hint && (
          <span className="world-hint" aria-hidden="true">
            {hint}
          </span>
        )}
      </div>
    </div>
  )
}
