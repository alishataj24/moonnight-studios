import { useState } from "react"
import { viewpoint } from "../data/content"
import { piece } from "../data/media"
import { Reveal } from "./Reveal"

/**
 * ACT 04 — THE POINT OF VIEW.
 *
 * The studio's position, written on a frame rather than beside one.
 * Three marks sit on the picture at points that are actually in it,
 * each with a leader line back to what it refers to — the way a
 * director's notes sit on a still, not the way a feature list sits on
 * a page. Opening one is the whole interaction.
 *
 * There are no oversized floating words and no row of rules here, on
 * purpose: the previous version of this act was three nine-rem words
 * in sequence, which looked like a title card and said very little.
 *
 * Hover opens a mark on a pointer; tap and keyboard open it anywhere.
 * One is open from the start, so the act is never a bare picture with
 * three dots on it.
 */
export function ActViewpoint() {
  const [open, setOpen] = useState(viewpoint.marks[0].id)
  const frame = piece(viewpoint.frame)
  if (!frame) return null

  return (
    <section
      className="act act-viewpoint"
      id="viewpoint"
      data-band-tone="dark"
      aria-labelledby="viewpoint-head"
    >
      <div className="vp-spread spread">
        <h2 className="u-hidden" id="viewpoint-head">
          How Moonnight Studios works
        </h2>

        <Reveal variant="frame" className="vp-plate">
          <picture>
            {frame.posterSmall && (
              <source srcSet={frame.posterSmall} media="(max-width: 760px)" type="image/webp" />
            )}
            <img src={frame.poster} alt={frame.alt} loading="lazy" decoding="async" />
          </picture>
          <span className="vp-gel" aria-hidden="true" />

          {viewpoint.marks.map((mark) => (
            <div
              key={mark.id}
              className="vp-mark"
              data-open={open === mark.id ? "true" : "false"}
              /* A mark past the middle opens back towards the centre,
                 so a note never hangs off the edge of the picture.
                 A data attribute, not a custom property matched with
                 [style*=…]: that selector depends on exactly how the
                 property is serialised into the attribute. */
              data-side={mark.at.x > 55 ? "left" : "right"}
              style={{ "--x": `${mark.at.x}%`, "--y": `${mark.at.y}%` } as React.CSSProperties}
            >
              <button
                type="button"
                className="vp-pin"
                aria-expanded={open === mark.id}
                aria-controls={`vp-note-${mark.id}`}
                onClick={() => setOpen(mark.id)}
                onPointerEnter={(e) => e.pointerType !== "touch" && setOpen(mark.id)}
                onFocus={() => setOpen(mark.id)}
              >
                <span className="vp-n">{mark.n}</span>
                <span className="u-hidden">{mark.term}</span>
              </button>
              <span className="vp-leader" aria-hidden="true" />
              <div className="vp-note" id={`vp-note-${mark.id}`}>
                <p className="vp-term">{mark.term}</p>
                <p className="vp-copy">{mark.copy}</p>
              </div>
            </div>
          ))}
        </Reveal>

        {/* The same three in plain sequence. On a wide screen the
            picture carries them and this is hidden: printed under the
            frame as a numbered row with a rule over it, it was the
            exact process-timeline furniture the act is meant to avoid.
            Below the mark breakpoint it is the act. */}
        <ol className="vp-list">
          {viewpoint.marks.map((mark) => (
            <li key={mark.id} className="vp-item">
              <p className="vp-term">{mark.term}</p>
              <p className="vp-copy">{mark.copy}</p>
            </li>
          ))}
        </ol>

        <p className="vp-price">{viewpoint.price}</p>
      </div>
    </section>
  )
}
