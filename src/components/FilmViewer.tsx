import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import type { Piece } from "../data/portfolio"

/**
 * The viewer.
 *
 * A distraction-free full-screen look at one piece, with no caption, title
 * or label of any kind. Arrow keys and swipes step through the collection
 * it was opened from, so the viewer is a way to explore the work rather
 * than a dead end.
 *
 * Native video controls are kept on purpose: keyboard accessible,
 * touch-sized, already localised, and honest about buffering.
 */
export function FilmViewer({
  collection,
  index,
  origin,
  onIndex,
  onClose,
}: {
  collection: Piece[]
  index: number
  /** The on-screen rect of the frame that was clicked, if any. */
  origin?: DOMRect | null
  onIndex: (next: number) => void
  onClose: () => void
}) {
  const frameRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreTo = useRef<Element | null>(null)
  const touch = useRef<{ x: number; y: number } | null>(null)
  const [direction, setDirection] = useState(1)

  const piece = collection[index]
  const many = collection.length > 1
  const grown = useRef(false)

  const step = useCallback(
    (delta: number) => {
      if (!many) return
      setDirection(delta)
      onIndex((index + delta + collection.length) % collection.length)
    },
    [collection.length, index, many, onIndex],
  )

  // Grow out of the frame that was clicked. Measured after layout, so
  // the final position is real rather than assumed, then played
  // backwards from the origin rect — the standard FLIP move.
  useLayoutEffect(() => {
    const node = frameRef.current
    if (!node || !origin || grown.current) return
    grown.current = true
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const to = node.getBoundingClientRect()
    if (!to.width || !to.height) return
    const scale = origin.width / to.width
    const dx = origin.left + origin.width / 2 - (to.left + to.width / 2)
    const dy = origin.top + origin.height / 2 - (to.top + to.height / 2)
    node.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.4 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 620, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    )
  }, [origin])

  useEffect(() => {
    restoreTo.current = document.activeElement
    document.body.classList.add("is-locked")
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key === "ArrowRight") {
        event.preventDefault()
        step(1)
        return
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        step(-1)
        return
      }
      if (event.key !== "Tab") return

      const focusable = frameRef.current?.querySelectorAll<HTMLElement>(
        'button, video, [href], [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKey, true)
    return () => {
      document.removeEventListener("keydown", onKey, true)
      document.body.classList.remove("is-locked")
      ;(restoreTo.current as HTMLElement | null)?.focus?.()
    }
  }, [onClose, step])

  if (!piece) return null

  return createPortal(
    <div
      className="viewer"
      role="dialog"
      aria-modal="true"
      aria-label={piece.alt}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onTouchStart={(event) => {
        const point = event.touches[0]
        touch.current = { x: point.clientX, y: point.clientY }
      }}
      onTouchEnd={(event) => {
        const start = touch.current
        touch.current = null
        if (!start) return
        const point = event.changedTouches[0]
        const dx = point.clientX - start.x
        const dy = point.clientY - start.y
        // Horizontal intent only, so a vertical flick never changes the piece.
        if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy) * 1.6) return
        step(dx < 0 ? 1 : -1)
      }}
    >
      <button
        ref={closeRef}
        type="button"
        className="viewer-close"
        onClick={onClose}
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M5 5l14 14M19 5L5 19" />
        </svg>
      </button>

      {many && (
        <>
          <button
            type="button"
            className="viewer-step"
            data-side="prev"
            onClick={() => step(-1)}
            aria-label="Previous"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M15 4L7 12l8 8" />
            </svg>
          </button>
          <button
            type="button"
            className="viewer-step"
            data-side="next"
            onClick={() => step(1)}
            aria-label="Next"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M9 4l8 8-8 8" />
            </svg>
          </button>
        </>
      )}

      <div className="viewer-frame" ref={frameRef} key={piece.id} data-dir={direction}>
        {piece.video ? (
          <video
            src={piece.video}
            poster={piece.poster}
            style={{ aspectRatio: piece.ratio }}
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={piece.poster}
            alt={piece.alt}
            style={{ aspectRatio: piece.ratio }}
            loading="eager"
          />
        )}
      </div>

      {many && (
        <div className="viewer-dots" aria-hidden="true">
          {collection.map((item, i) => (
            <span key={item.id} data-on={i === index} />
          ))}
        </div>
      )}
    </div>,
    document.body,
  )
}
