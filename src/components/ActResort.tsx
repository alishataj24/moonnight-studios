import { resort } from "../data/content"
import { resortChain } from "../data/worlds"
import { Headline, Reveal } from "./Reveal"
import { WorldChain } from "./WorldChain"

/**
 * ACT IV — THE RESORT.
 *
 * Five worlds, four passages, and not one cut: the land, the house, the
 * eave, the room, the morning. You reach each place through the opening
 * in the last one — the glazed band on the upper floor, the lit room
 * behind the balcony glass, the wall that folds away onto the meadow.
 *
 * This is the argument the section is making, made structurally rather
 * than in copy: a property is a sequence of thresholds, and film is the
 * only medium that can walk a guest through them before they book.
 *
 * The headline rides the first world and clears before the first push.
 * Nothing else is placed on the chain: it is five photographs and four
 * passages, and the only words that arrive after the opening are the
 * line saying the property is not real.
 */
export function ActResort({ guides }: { guides?: boolean }) {
  return (
    <WorldChain
      id="resorts"
      className="act-resort"
      worlds={resortChain}
      /* 0.8, not 1.05. Measured: between the headline clearing and the
         instrument arriving there were 2,700px — three full screens —
         of scrolling with nothing said. The passages are the content
         here, but three screens of them is longer than anyone looks at
         a photograph they have already seen arrive. */
      pace={0.8}
      /* Just enough for the last world to settle. A full screen of
         hold on a photograph with nothing on it is a blank frame, and
         this chain hands straight over to the instrument — which is
         where the visitor takes the controls. */
      tail={0.3}
      guides={guides}
    >
      <span className="chain-veil" aria-hidden="true" />

      <div className="resort-copy spread">
        <div className="body">
        <h2 className="head" id="resort-head">
          <Headline text={resort.headline} />
        </h2>
        <Reveal as="p" variant="rise" delay={140} className="lead">
          {resort.support}
        </Reveal>
        </div>
      </div>

    </WorldChain>
  )
}
