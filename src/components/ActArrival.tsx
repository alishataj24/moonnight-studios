import { hero } from "../data/content"
import { arrival, threshold } from "../data/worlds"
import { Headline, Reveal } from "./Reveal"
import { WorldChain } from "./WorldChain"

/**
 * ACT I — ARRIVAL.
 *
 * Two worlds, one passage. The page opens on a woman behind a car
 * window; as you scroll, the window becomes a window into somewhere
 * else, and then you are through it and standing in a doorway.
 *
 * The words clear before the push begins. Reading and travelling at the
 * same time is how you get a headline sliding over a moving frame, which
 * always looks like a slide deck.
 */
export function ActArrival({ guides }: { guides?: boolean }) {
  return (
    <WorldChain
      id="top"
      className="act-arrival"
      worlds={[arrival, threshold]}
      pace={1.4}
      guides={guides}
      eagerFirst
    >
      {/* No margin label here. The opening is not a numbered section —
          the wordmark already sits in that column, and a label over a
          bright frame reads as a smudge rather than as orientation. */}
      <div className="arrival-type spread">
        <div className="body">
          <h1 className="display">
            <Headline text={hero.headline} baseDelay={200} />
          </h1>
          <Reveal as="p" variant="rise" delay={470} threshold={0.01} className="lead">
            {hero.support}
          </Reveal>
          <Reveal variant="rise" delay={620} threshold={0.01}>
            <a className="cta" href="#work">
              {hero.cta}
              <span className="arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </WorldChain>
  )
}
