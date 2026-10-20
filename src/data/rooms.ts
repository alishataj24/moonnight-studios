/**
 * TWO ROOMS, SPLIT BY MEDIUM.
 *
 * Moving work and still work want opposite things, and showing them
 * together means neither gets what it needs. A clip wants darkness, a
 * held frame line, a sense of projection and of time passing. A still
 * wants light, a margin, and to be looked at for as long as you like.
 *
 * So the work is shown in two rooms:
 *
 *   THE SCREENING   dark, horizontal, every frame the same height — a
 *                   strip of film running past. Sequence and motion.
 *   THE PLATES      light, one composed sheet, natural proportions and
 *                   generous margins. Stillness and simultaneity.
 *
 * Nothing appears in both. The split is by what a piece *is*, not by
 * what it is about, which is why the category words (films, images,
 * portraits) live only in the copy and never over the work.
 */

/**
 * THE SCREENING.
 *
 * Equal frame heights are the whole point — that is what makes a strip
 * read as a strip rather than as a row of cards. Width follows the
 * format, so the variety comes from the pictures and from the formats
 * themselves, not from arbitrary sizing.
 */
export type Frame = {
  id: string
  /** Display format, as a real projection ratio. */
  format: "2.39" | "1.85" | "1.78" | "upright"
  depth: number
  /** The arrival chain's doorway contracts into this frame. */
  handoff?: boolean
  /** Loops silently in the strip while on screen, wide viewports only. */
  ambient?: boolean
}

/*
 * Four supplied clips are deliberately absent:
 *   towers        a tagline burnt into the frame
 *   racket        the flame mark composited in as a watermark
 *   paper-villas  a printed brochure, not a film frame
 *   skyline       monochrome stock, a different register entirely
 * Each is one line to restore if you disagree; the files are still on
 * disk. The rule they break is the brief's own: nothing the website
 * shows carries text, a logo or a watermark over the work.
 */
export const screening: Frame[] = [
  // The feature, and the only frame in scope — a format change is how a
  // reel announces that something is the main title.
  { id: "aranyaka", format: "2.39", depth: 0.06, handoff: true },

  { id: "sofa-read", format: "1.78", depth: -0.1 },
  { id: "mist-rail", format: "1.78", depth: -0.12 },
  { id: "wet-ball", format: "1.78", depth: 0.14 },
  { id: "reading", format: "1.78", depth: 0.14 },
  { id: "shore", format: "1.78", depth: 0.1 },
  { id: "rain-walk", format: "1.78", depth: 0.12 },
  { id: "dribble", format: "1.78", depth: 0.06 },
  { id: "sofa-book", format: "1.78", depth: 0.08 },
  { id: "promenade", format: "1.78", depth: -0.06, ambient: true },
  { id: "stadium", format: "1.78", depth: 0.08 },
  { id: "cycling", format: "1.78", depth: 0.12, ambient: true },
  { id: "fern", format: "1.78", depth: 0.06 },
  { id: "yacht", format: "upright", depth: 0.12 },
  { id: "sea-gym", format: "1.78", depth: -0.06 },
  { id: "kit", format: "1.78", depth: -0.14 },
  { id: "pitch-sun", format: "1.78", depth: -0.12 },
  { id: "bamboo", format: "1.78", depth: -0.14 },
  { id: "court", format: "1.85", depth: -0.08, ambient: true },
  { id: "pond", format: "1.78", depth: 0.12 },
  { id: "shadows", format: "1.85", depth: -0.1, ambient: true },
  { id: "tablet", format: "1.78", depth: -0.06 },
  { id: "deck", format: "upright", depth: -0.14 },
  { id: "water-wall", format: "1.78", depth: 0.08 },
  { id: "pitch", format: "1.85", depth: -0.12, ambient: true },
  { id: "gate", format: "1.78", depth: 0.1, ambient: true },
  { id: "fountain-lawn", format: "1.78", depth: -0.1 },
  { id: "stream", format: "1.78", depth: 0.08 },
  { id: "halfway", format: "1.78", depth: -0.08 },
  { id: "forest-bath", format: "1.78", depth: -0.1 },
  { id: "floor-book", format: "1.78", depth: 0.12 },
  { id: "gym-light", format: "1.78", depth: 0.08 },
  { id: "study", format: "upright", depth: -0.16 },
  { id: "overlook", format: "1.78", depth: 0.1 },
  { id: "float", format: "1.78", depth: 0.1, ambient: true },
  { id: "glass-court", format: "1.78", depth: -0.1 },
  { id: "meadow", format: "1.78", depth: 0.14 },
  { id: "stone-court", format: "1.78", depth: -0.08 },
]

/** Frame height, in svh. Every frame shares it. */
export const FRAME_H = 54

export const FORMAT_RATIO: Record<Frame["format"], number> = {
  "2.39": 2.39,
  "1.85": 1.85,
  "1.78": 16 / 9,
  upright: 0.74,
}

/** Horizontal travel per unit of vertical scroll. A strip should run. */
export const STRIP_PACE = 0.42

/** Gap between frames, in vw. Tight, like a real strip. */
export const STRIP_GAP = 1.4

/**
 * THE EXHIBITION — the still work.
 *
 * Order matters: the field rotates by one slot each time the hero
 * changes, so neighbours in this list become neighbours in space. It is
 * sequenced by light and subject so that any two images on screen at
 * once have a reason to be beside each other.
 */
export const exhibition: readonly string[] = [
  /**
   * INTERLEAVED, NOT GROUPED.
   *
   * The field shows a hero and eight satellites at once, all drawn from
   * consecutive slots in this list — so the order is not a reading
   * sequence, it is what nine pictures hang together.
   *
   * Grouping by subject was the obvious first instinct and it was wrong:
   * it put six deer on screen at once, then five aerials, then nothing
   * but buildings. Every screenful looked like one photograph taken
   * repeatedly.
   *
   * So each subject is spread evenly across the whole run instead —
   * thirteen people frames land roughly every third slot, four night
   * frames roughly every eleventh. The result is no two neighbours
   * sharing a subject, and never more than three of anything in a
   * window of nine.
   *
   * `terrace` opens and `butterfly` closes; those two are pinned. If you
   * add frames, re-spread rather than appending, or the new subject will
   * clump at the end.
   */
  "terrace", "forest-kitchen", "house-trees", "clubhouse",
  "fawn", "canopy-ridge", "family-lawn", "villa-night",
  "cluster", "boy-reading", "gym-sea", "swans-deer",
  "man-window", "estate-aerial", "timber", "pool-boy",
  "infinity-pool", "basketball", "deer-pond", "living-room",
  "path", "boy-kit", "estate-wide", "lawn",
  "coach", "tennis", "bamboo-deck", "water",
  "water-break", "oaks-dusk", "acres", "railing",
  "goal", "swans-pond", "driving", "villa",
  "dusk", "boy-car", "canopy", "cycling-dusk",
  "deer", "drive", "clubhouse-man", "butterfly",
]

/**
 * Where the non-hero images sit, as a ring around the centre.
 *
 * x and y are percentages of the stage from its centre; `s` is scale
 * against the hero; `z` is both stacking order and parallax depth — the
 * further back a frame is, the less it answers the pointer.
 *
 * Hand-placed rather than generated: a ring of evenly spaced satellites
 * reads as a carousel, and the whole point is that it should not. The
 * gaps and the clustering are the composition.
 */
export type Slot = { x: number; y: number; s: number; z: number }
export const slots: Slot[] = [
  // Two large fragments crowd the hero and overlap its corners — that
  // overlap is what produces depth. The rest fall away asymmetrically.
  { x: -30, y: -21, s: 0.34, z: 5 },
  // The only frame that sits in FRONT of the hero. One foreground
  // element is the difference between a composition and a ring of
  // planets orbiting a sun.
  { x: 31, y: 21, s: 0.4, z: 12 },
  { x: 25, y: -30, s: 0.22, z: 3 },
  { x: -24, y: 27, s: 0.27, z: 4 },
  { x: -45, y: 7, s: 0.16, z: 2 },
  { x: 44, y: -13, s: 0.14, z: 1 },
  { x: -7, y: -37, s: 0.12, z: 1 },
  { x: 12, y: 37, s: 0.18, z: 2 },
]

/**
 * WHAT THE GATE PLAYS.
 *
 * The gate is the only place on the page where the work is visible
 * without choosing a world, so it has to actually show work rather
 * than label two destinations. The stills cross-fade; the films cut to
 * the next one as each finishes, so a visitor who never clicks still
 * watches a short reel.
 *
 * Keep these lists short — they are a trailer, not the collection.
 * Films here should be the ones that read in a few seconds with no
 * sound. Add to the rooms above first; this is a selection from them.
 */
export const gatePreview = {
  images: ["terrace", "canopy-ridge", "swans-deer", "infinity-pool", "house-trees", "fawn"],
  films: ["mist-rail", "bamboo", "rain-walk", "fern", "water-wall"],
  /**
   * The frames that flow in behind the two fields as the gate is
   * scrolled. Eight, spread across subject and light the same way the
   * exhibition is — the point of the flow is that the work is varied,
   * so eight frames of the same thing would argue the opposite.
   *
   * None of these repeat the six stills above: the gate would be
   * showing a picture twice on one screen.
   */
  flow: [
    "estate-aerial",
    "villa-night",
    "forest-kitchen",
    "boy-kit",
    "oaks-dusk",
    "deer-pond",
    "clubhouse",
    "water-break",
  ],
} as const
