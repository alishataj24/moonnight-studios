import { contact } from "../data/content"
import { ease, easeOut, mix, q, span } from "../motion/stage"
import { useStage } from "../motion/useStage"
import { Headline } from "./Reveal"

/**
 * ACT VII — THE LAST FRAME.
 *
 * The journey stops moving. The picture arrives slightly oversized and
 * settles; the ground under it deepens; the words resolve on top of it and
 * stay. Then one control.
 *
 * The CTA opens a panel rather than scrolling to a form, so the final
 * frame is never scrolled off to reach it — and nothing reloads.
 */
export function ActLastFrame({ onStart }: { onStart: () => void }) {
  const { track, target } = useStage<HTMLDivElement, HTMLDivElement>((p) => {
    const settle = easeOut(span(p, 0, 0.7))
    return {
      "--settle": q(mix(1.12, 1, settle), 4),
      "--dark": q(mix(0.3, 0.72, settle), 3),
      "--words": q(span(p, 0.2, 0.5)),
      "--words-y": q(mix(26, 0, ease(span(p, 0.2, 0.62))), 2),
      "--cta": q(span(p, 0.45, 0.68)),
      "--cta-pe": p > 0.5 ? "auto" : "none",
    }
  })

  return (
    <section className="act act-last" id="contact" data-band-tone="dark" aria-labelledby="contact-head">
      <div className="track" ref={track}>
        <div className="stage" ref={target}>
          <div className="last-frame">
            <picture>
              <source srcSet={contact.posterSmall} media="(max-width: 760px)" type="image/webp" />
              <img src={contact.poster} alt={contact.alt} loading="lazy" decoding="async" />
            </picture>
            <span className="last-veil" aria-hidden="true" />
          </div>

          <div className="last-words spread">
            <div className="body">
            <h2 className="head" id="contact-head">
              <Headline text={contact.headline} />
            </h2>
            <div className="last-cta">
              <button type="button" className="cta cta-solid" onClick={onStart}>
                {contact.cta}
                <span className="arrow" aria-hidden="true">
                  ↗
                </span>
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
