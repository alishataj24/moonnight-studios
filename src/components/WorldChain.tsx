import { useEffect, useRef, type ReactNode } from "react"
import type { World } from "../data/worlds"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"
import { q as round, registerStage, span } from "../motion/stage"
import { ApertureGuide, WorldLayer } from "./Passage"

/**
 * A CHAIN OF WORLDS.
 *
 * n worlds, n-1 passages, one sticky stage. Each passage runs in two
 * phases, and the split is the whole trick:
 *
 *   phase A   the aperture fills with the next world — an iris opening
 *             inside the doorway while the doorway itself holds still
 *   phase B   both grow together from the aperture's centre, locked to
 *             the same factor, so the opening and what is behind it stay
 *             welded while the camera flies through
 *
 * Locking them is what makes it read as travel rather than as a wipe.
 * If the incoming clip and the outgoing scale drift apart by even a few
 * per cent you see a seam crawling along the door frame, and the whole
 * illusion is gone.
 *
 * Worlds stack in document order with the later one on top, so each new
 * place arrives over the last and covers it completely once the aperture
 * has passed the screen edges.
 */

/** Growth factor at which an aperture covers the whole screen. */
function coverFactor(a: NonNullable<World["aperture"]>) {
  const cx = a.x + a.w / 2
  const cy = a.y + a.h / 2
  return Math.max(
    (2 * Math.max(cx, 100 - cx)) / a.w,
    (2 * Math.max(cy, 100 - cy)) / a.h,
  )
}

/** Accelerating — the push into an opening should gather speed. */
const drive = (t: number) => t * t * (3 - 2 * t) * (0.35 + 0.65 * t)

export function WorldChain({
  id,
  worlds,
  /** Viewport-heights of scroll per passage. */
  pace = 1.6,
  /**
   * Viewport-heights of hold after the last passage lands.
   *
   * A full one gives the final world a screen of its own, which is
   * right when something is written on it. When nothing is, it is a
   * photograph scrolling past with nothing happening on it — and the
   * resort chain hands straight over to the instrument, so its last
   * world needs only enough to settle.
   */
  tail = 1,
  children,
  guides,
  eagerFirst,
  className = "",
}: {
  id: string
  worlds: World[]
  pace?: number
  tail?: number
  children?: ReactNode
  guides?: boolean
  eagerFirst?: boolean
  className?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const layerRefs = useRef<(HTMLDivElement | null)[]>([])
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const track = trackRef.current
    const stage = stageRef.current
    if (!track || !stage || reduced) return

    const passages = Math.max(1, worlds.length - 1)
    const layout = () => {
      // A phone should not have to travel two screens of the same
      // picture before the next one starts. The choreography is still
      // 0→1; only the distance changes.
      const phone = window.matchMedia("(max-width: 760px)").matches
      const scrollPace = phone ? Math.min(pace, 1) : pace
      const scrollTail = phone ? Math.min(tail, 0.65) : tail
      track.style.height = `${window.innerHeight * (passages * scrollPace + scrollTail)}px`
    }
    layout()
    window.addEventListener("resize", layout)

    const release = registerStage(track, stage, (p) => {
      const seg = 1 / passages

      for (let i = 0; i < worlds.length; i += 1) {
        const layer = layerRefs.current[i]
        if (!layer) continue

        // As the outgoing half of passage i.
        const out = worlds[i].aperture
        let scale = 1
        let fade = 1
        if (out && i < passages) {
          // Hold, then push. The hold is what gives each world a moment
          // to be looked at before it is left.
          const t = span(p, i * seg + seg * 0.42, (i + 1) * seg)
          const K = coverFactor(out)
          const phaseB = span(t, 0.3, 1)
          scale = 1 + (K - 1) * drive(phaseB)
          fade = 1 - span(t, 0.93, 1)
          layer.style.transformOrigin = `${out.x + out.w / 2}% ${out.y + out.h / 2}%`
        }
        layer.style.transform = `scale(${scale.toFixed(4)})`
        layer.style.opacity = String(round(fade))

        // As the incoming half of passage i-1.
        const prev = worlds[i - 1]?.aperture
        if (!prev) {
          layer.style.clipPath = i === 0 ? "none" : "inset(0)"
          continue
        }
        const t = span(p, (i - 1) * seg + seg * 0.42, i * seg)
        const K = coverFactor(prev)
        // Phase A opens the iris to exactly the aperture; phase B then
        // tracks the outgoing world's scale, factor for factor.
        // Phase A starts at exactly zero area, so at rest the next world
        // is not a stray rectangle sitting inside the doorway.
        const m =
          t <= 0.3 ? span(t, 0, 0.3) : 1 + (K - 1) * drive(span(t, 0.3, 1))
        const cx = prev.x + prev.w / 2
        const cy = prev.y + prev.h / 2
        const hw = (prev.w * m) / 2
        const hh = (prev.h * m) / 2
        const top = Math.max(0, cy - hh)
        const right = Math.max(0, 100 - (cx + hw))
        const bottom = Math.max(0, 100 - (cy + hh))
        const left = Math.max(0, cx - hw)
        const r = prev.round ? `round ${prev.round}%` : ""
        layer.style.clipPath = `inset(${top.toFixed(2)}% ${right.toFixed(2)}% ${bottom.toFixed(2)}% ${left.toFixed(2)}% ${r})`
      }

      return { "--p": round(p) }
    })

    return () => {
      release()
      window.removeEventListener("resize", layout)
    }
  }, [reduced, worlds, pace, tail])

  return (
    <section className={`act chain ${className}`} id={id} data-band-tone="dark">
      <div className="track" ref={trackRef}>
        <div className="stage" ref={stageRef}>
          {worlds.map((world, i) => (
            <div
              key={world.id}
              className="world-slot"
              style={{ zIndex: i }}
              ref={(node) => {
                layerRefs.current[i] = node
              }}
            >
              <WorldLayer world={world} eager={eagerFirst && i === 0} />
              {guides && <ApertureGuide world={world} />}
            </div>
          ))}
          {children}
        </div>
      </div>
    </section>
  )
}
