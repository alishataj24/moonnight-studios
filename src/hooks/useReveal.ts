import { useEffect, useRef, type RefObject } from "react"

/**
 * Reveals an element once it enters the viewport by flipping a data
 * attribute that CSS transitions against. No library, no scroll listener.
 *
 * If the viewer prefers reduced motion we mark it shown immediately — the
 * stylesheet already neutralises the transition, this just avoids a frame
 * of hidden content.
 */
export function useReveal<T extends HTMLElement>(
  options: { threshold?: number; delay?: number; once?: boolean } = {},
): RefObject<T | null> {
  const { threshold = 0.18, delay = 0 } = options
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const show = () => {
      if (delay) node.style.transitionDelay = `${delay}ms`
      node.dataset.shown = "true"
    }

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      show()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          show()
          observer.disconnect()
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, delay])

  return ref
}
