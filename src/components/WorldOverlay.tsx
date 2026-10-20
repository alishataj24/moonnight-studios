import { useEffect, useRef, type ReactNode } from "react"
import { createPortal } from "react-dom"

/**
 * A world, opened over the journey.
 *
 * The two portfolio experiences are not scroll sections — they take the
 * whole screen, and the page waits behind them. That is what stops the
 * portfolio from being "more of the page" and makes entering one feel
 * like going somewhere.
 *
 * Behaves as a dialog: focus moves in, Tab is trapped, the page behind
 * does not scroll, and focus returns to the gate on the way out, so the
 * visitor lands back exactly where they left.
 */
export function WorldOverlay({
  label,
  open,
  onClose,
  children,
}: {
  label: string
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const restoreTo = useRef<Element | null>(null)

  useEffect(() => {
    if (!open) return
    restoreTo.current = document.activeElement
    document.body.classList.add("is-locked")
    // The dialog itself, not its first control. The first control is
    // now Close: focusing it put the way out in its approached state
    // the instant the room opened, and left Enter undoing the click
    // that got the visitor here. From the container, one Tab reaches
    // Close — which is the point of it being first in the DOM.
    const id = window.setTimeout(() => ref.current?.focus(), 80)

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return
      const focusable = ref.current?.querySelectorAll<HTMLElement>(
        'button:not([tabindex="-1"]), input, [href], [tabindex]:not([tabindex="-1"])',
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
      window.clearTimeout(id)
      document.removeEventListener("keydown", onKey, true)
      document.body.classList.remove("is-locked")
      ;(restoreTo.current as HTMLElement | null)?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      className="world-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={label}
      tabIndex={-1}
      ref={ref}
    >
      {/* First in the DOM, so the way out is the first thing Tab
          reaches. Rendered last it sat behind the film strip's
          thirty-eight posters — Escape still worked, but a keyboard
          visitor had to press Tab forty times to find the door.
          It is positioned, so DOM order costs it nothing visually. */}
      <button type="button" className="world-close" onClick={onClose}>
        <span className="world-close-mark" aria-hidden="true">
          <i />
          <i />
        </span>
        <span className="world-close-word">Close</span>
      </button>
      {children}
    </div>,
    document.body,
  )
}
