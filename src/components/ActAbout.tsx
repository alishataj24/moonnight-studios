import { useEffect, useRef } from "react"
import { about } from "../data/content"
import { easeOut, mix, q, registerStage, span } from "../motion/stage"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"
import { Headline, Reveal } from "./Reveal"

/**
 * ACT 05 — ABOUT.
 *
 * Was a label and two sentences floating in a dark void with the
 * picture parked underneath them. The picture now stands behind the
 * words, the way it does in every other act, and the only thing the
 * scroll does is let it settle — it arrives slightly oversized, comes
 * to rest, and the ground under it deepens as it does.
 *
 * Two sentences on a photograph. Nothing else happens here, and that
 * is the point: it sits between the point of view and the last frame as
 * the one place the site simply states what it is.
 */
export function ActAbout() {
  const ref = useRef<HTMLElement>(null)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || reduced) return
    // Track and target are the same element: the picture and the words
    // are siblings, and a custom property only inherits downwards, so
    // the channels have to land on their common ancestor.
    //
    // The scroll drives the settle and nothing else. It cannot drive
    // the words: progress reads 0 both while the section is still
    // entering and at the instant it pins, so anything keyed to it is
    // invisible exactly when the section first fills the screen. The
    // words use the same reveal as every other act instead.
    return registerStage(node, node, (p) => {
      const settle = easeOut(span(p, 0, 0.62))
      return {
        "--settle": q(mix(1.1, 1, settle), 4),
        "--dark": q(mix(0.34, 0.68, settle), 3),
      }
    })
  }, [reduced])

  return (
    <section
      className="act act-about"
      id="about"
      data-band-tone="dark"
      aria-labelledby="about-head"
      ref={ref}
    >
      <div className="about-hold">
        <div className="about-stage">
          <picture>
            <source srcSet={about.posterSmall} media="(max-width: 760px)" type="image/webp" />
            <img src={about.poster} alt={about.alt} loading="lazy" decoding="async" />
          </picture>
          <span className="about-veil" aria-hidden="true" />
        </div>

        <div className="about-ui spread">
          <div className="about-copy">
            <h2 className="head" id="about-head">
              <Headline text={about.headline} />
            </h2>
            <Reveal as="p" variant="rise" delay={140} className="lead">
              {about.support}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
