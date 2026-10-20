import { useEffect, useRef } from "react"

/**
 * The wheel steps a full-screen room.
 *
 * Everywhere else on the site nothing listens to `wheel`, because
 * hijacking the page's own scroll takes the visitor's control away.
 * Inside a world overlay there is no page scroll to take: the overlay
 * is fixed, the body is locked, and a visitor who scrolls otherwise
 * gets nothing at all — which is what both rooms did.
 *
 * Deltas are accumulated rather than acted on one at a time. A
 * trackpad emits dozens of small deltas per flick and a mouse emits
 * one large one; counting to a threshold makes both advance by one at
 * a time instead of either crawling or rocketing. A pause longer than
 * the gesture window starts the count clean, so a long flick cannot
 * bank momentum from the one before it.
 */
export function useWheelStep(step: (delta: number) => void, active = true) {
  const total = useRef(0)
  const last = useRef(0)

  useEffect(() => {
    if (!active) return
    const onWheel = (event: WheelEvent) => {
      event.preventDefault()
      const now = performance.now()
      if (now - last.current > 220) total.current = 0
      last.current = now
      total.current += event.deltaY + event.deltaX
      if (Math.abs(total.current) < 90) return
      step(total.current > 0 ? 1 : -1)
      total.current = 0
    }
    // Not passive: the gesture is the control here, and the page
    // behind must not move with it.
    window.addEventListener("wheel", onWheel, { passive: false })
    return () => window.removeEventListener("wheel", onWheel)
  }, [step, active])
}
