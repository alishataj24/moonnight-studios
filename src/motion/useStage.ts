import { useEffect, useRef, type RefObject } from "react"
import { registerStage, type Channels } from "./stage"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"

/**
 * Binds a scroll-linked composition.
 *
 * `track` is the tall section that defines the scroll span; `target` is the
 * element the channels are written to (usually the sticky stage inside it).
 *
 * Under reduced motion nothing is registered at all — the stylesheet's
 * reduced-motion block lays every stage out statically, so the page reads
 * as a plain, complete document with no scroll dependency whatsoever.
 */
export function useStage<T extends HTMLElement, U extends HTMLElement>(
  compute: (progress: number) => Channels,
): { track: RefObject<T | null>; target: RefObject<U | null> } {
  const track = useRef<T>(null)
  const target = useRef<U>(null)
  const reduced = usePrefersReducedMotion()
  const latest = useRef(compute)
  latest.current = compute

  useEffect(() => {
    if (reduced || !track.current || !target.current) return
    return registerStage(track.current, target.current, (p) => latest.current(p))
  }, [reduced])

  return { track, target }
}
