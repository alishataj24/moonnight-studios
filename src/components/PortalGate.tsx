import { useCallback, useEffect, useRef, useState } from "react"
import { piece } from "../data/media"
import { gatePreview } from "../data/rooms"
import { sites } from "../data/sites"
import { q, registerStage, span } from "../motion/stage"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"

/**
 * THE GATE.
 *
 * Two destinations, and deliberately not two cards side by side. The
 * fields are different shapes, sit at different depths, and overlap —
 * so the composition reads as one picture plane with two things in it
 * rather than as a choice widget.
 *
 * **Both fields are alive.** This is the only place on the page where
 * the work shows without choosing a world, and a films field that does
 * not move is the single least convincing thing a film studio can put
 * on a page. The stills cross-fade; the films play silently and cut to
 * the next as each ends, so a visitor who never clicks anything still
 * watches a short reel.
 *
 * One video element exists, it carries no audio, it loads nothing until
 * the gate is near the viewport, and it pauses the moment the gate
 * leaves the screen.
 *
 * Approaching a field opens it: it comes forward, grows, and its crop
 * widens. Nothing depends on hover — focus drives the same states for
 * the keyboard, and on touch both fields sit at rest until tapped.
 *
 * **And the work flows in.** The gate is a track, not a screen: keep
 * scrolling and eight more frames rise into the composition around the
 * two fields while the fields themselves settle back. By the foot of
 * the act you are looking at the body of work rather than at two
 * panels, and the two destinations are still the only things you can
 * click. One scroll channel drives the whole flow; each frame takes
 * its own cue from it in the stylesheet.
 */

export type WorldId = "images" | "films" | "sites"

/** How long a still holds before the next one fades up. */
const STILL_MS = 4200
/** A clip that cannot play must not stall the reel. */
const CLIP_CAP_MS = 14000

export function PortalGate({ onEnter }: { onEnter: (world: WorldId) => void }) {
  const trackRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [near, setNear] = useState<WorldId | null>(null)
  const [coarse, setCoarse] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const [still, setStill] = useState(0)
  const [clip, setClip] = useState(0)
  const [site, setSite] = useState(0)
  const reduced = usePrefersReducedMotion()

  const stills = gatePreview.images.map((id) => piece(id)).filter(Boolean)
  const flow = gatePreview.flow.map((id) => piece(id)).filter(Boolean)
  const films = gatePreview.films.map((id) => piece(id)).filter(Boolean)
  const film = films[clip % films.length]

  useEffect(() => setCoarse(window.matchMedia("(hover: none)").matches), [])

  // One channel. Every frame in the flow reads it with its own cue.
  useEffect(() => {
    const track = trackRef.current
    const stage = stageRef.current
    if (!track || !stage || reduced) return
    return registerStage(track, stage, (p) => ({ "--p": q(span(p, 0, 1)) }))
  }, [reduced])

  // Nothing loads or runs until the gate is actually near the screen.
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting && entry.intersectionRatio > 0.25),
      { threshold: [0, 0.25, 0.6] },
    )
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  // Stills cross-fade.
  useEffect(() => {
    if (!onScreen || reduced || stills.length < 2) return
    const id = window.setInterval(() => setStill((i) => (i + 1) % stills.length), STILL_MS)
    return () => window.clearInterval(id)
  }, [onScreen, reduced, stills.length])

  // Product surfaces cycle on the Sites field.
  useEffect(() => {
    if (!onScreen || reduced || sites.length < 2) return
    const id = window.setInterval(() => setSite((i) => (i + 1) % sites.length), STILL_MS)
    return () => window.clearInterval(id)
  }, [onScreen, reduced])

  // Films play, and cut to the next when one finishes.
  useEffect(() => {
    const node = videoRef.current
    if (!node) return
    if (!onScreen || reduced) {
      node.pause()
      return
    }
    void node.play().catch(() => undefined)
    const cap = window.setTimeout(() => setClip((i) => i + 1), CLIP_CAP_MS)
    return () => window.clearTimeout(cap)
  }, [onScreen, reduced, clip])

  const onMove = useCallback(
    (event: React.PointerEvent) => {
      const stage = stageRef.current
      if (!stage || coarse) return
      const r = stage.getBoundingClientRect()
      stage.style.setProperty("--mx", ((event.clientX - r.left) / r.width - 0.5).toFixed(3))
      stage.style.setProperty("--my", ((event.clientY - r.top) / r.height - 0.5).toFixed(3))
    },
    [coarse],
  )

  const fieldProps = (id: WorldId, label: string) => ({
    type: "button" as const,
    className: "gate-field",
    "data-world": id,
    onPointerEnter: () => !coarse && setNear(id),
    onFocus: () => setNear(id),
    onBlur: () => setNear(null),
    onClick: () => onEnter(id),
    "aria-label": `Enter ${label}`,
  })

  return (
    <section
      className="act gate"
      id="work"
      data-band-tone="dark"
      aria-labelledby="gate-head"
      ref={trackRef}
    >
      <h2 className="u-hidden" id="gate-head">
        Choose a world
      </h2>

      <div className="gate-hold">
      <div
        className="gate-stage"
        ref={stageRef}
        data-near={near ?? "none"}
        onPointerMove={onMove}
        onPointerLeave={() => {
          setNear(null)
          stageRef.current?.style.setProperty("--mx", "0")
          stageRef.current?.style.setProperty("--my", "0")
        }}
      >
        <button {...fieldProps("images", "Images")}>
          <span className="gate-media">
            {stills.map((item, i) => (
              <picture key={item!.id} data-on={i === still || undefined}>
                {item!.posterSmall && (
                  <source srcSet={item!.posterSmall} media="(max-width: 760px)" type="image/webp" />
                )}
                <img
                  src={item!.poster}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </picture>
            ))}
          </span>
          <span className="gate-label">Images</span>
        </button>

        <button {...fieldProps("films", "Films")}>
          <span className="gate-media">
            {film && (
              <video
                ref={videoRef}
                key={film.id}
                src={onScreen ? film.video : undefined}
                poster={film.poster}
                muted
                playsInline
                preload="none"
                aria-hidden="true"
                tabIndex={-1}
                onEnded={() => setClip((i) => i + 1)}
              />
            )}
          </span>
          <span className="gate-label">Films</span>
        </button>

        <button {...fieldProps("sites", "Sites")}>
          <span className="gate-media gate-media-logo">
            {sites.map((item, i) => (
              <img
                key={item.id}
                src={item.logo}
                alt=""
                data-on={i === site || undefined}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            ))}
          </span>
          <span className="gate-label">Sites</span>
        </button>

        {/* Decorative: the destinations above are the content and the
            only things reachable. These are the work arriving. */}
        <div className="gate-flow" aria-hidden="true">
          {flow.map((item, i) => (
            <figure
              key={item!.id}
              className="gate-drift"
              style={{ "--i": i, "--in": 0.26 + i * 0.065 } as React.CSSProperties}
            >
              <picture>
                {item!.posterSmall && (
                  <source srcSet={item!.posterSmall} media="(max-width: 1100px)" type="image/webp" />
                )}
                <img
                  src={item!.poster}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: item!.focus }}
                />
              </picture>
            </figure>
          ))}
        </div>
      </div>
      </div>
    </section>
  )
}
