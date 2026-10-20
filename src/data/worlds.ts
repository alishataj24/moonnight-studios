/**
 * WORLDS AND APERTURES
 *
 * The journey does not cross-fade between pictures. It travels *through
 * the openings that already exist in them* — the car window, the doorway,
 * the glazed wall, the gap under the eave. The camera pushes into the
 * aperture until the aperture is the screen, and what is on the other
 * side is somewhere else entirely.
 *
 * That is why this file exists: an aperture is not a design decision you
 * can make in CSS, it is a measurement of a photograph. Each rect below
 * was read off the actual frame with a coordinate grid, then calibrated
 * in the running site against the live cover-crop.
 *
 * Coordinates are percentages of the DISPLAYED element box, after
 * `object-fit: cover` and `focus` have cropped it — not of the source
 * file. Change `focus` and the aperture moves with the crop, so the two
 * must always be re-checked together.
 *
 * To calibrate: run the site with ?apertures=1 and every aperture is
 * drawn over its world with its id. Nudge until the rect sits on the
 * opening, then copy the numbers back here.
 */

export type Aperture = {
  /** Left edge, % of the displayed box. */
  x: number
  /** Top edge, %. */
  y: number
  w: number
  h: number
  /** Corner softening, % — a doorway has square corners, a window may not. */
  round?: number
}

export type World = {
  id: string
  poster: string
  posterSmall?: string
  alt: string
  /** object-position for the cover crop. The aperture is measured against this. */
  focus?: string
  /** The opening the journey leaves through. The last world needs none. */
  aperture?: Aperture
}

const S = "/images/aranyaka/stills"
const M = "/images/moonnight"

/**
 * The opening frame.
 *
 * Dawn, mist, low sun, and someone standing at a glass wall watching
 * it. It carries the studio's name without illustrating it, it holds
 * light and dark in one frame, and the glass wall is a real opening —
 * so the first move of the site is stepping through it.
 *
 * TO REPLACE: drop a landscape file in `public/images/` and change
 * `poster` here, then re-measure `aperture` with ?apertures=1. The
 * opening has to contain an opening; a frame with no door, window or
 * gap in it cannot be left through one.
 */
export const arrival: World = {
  id: "arrival",
  poster: "/images/aranyaka/stills/mist.jpg",
  posterSmall: "/images/aranyaka/stills/mist-960.webp",
  alt: "A person stands at a glass wall at dawn, mist and low sun across the grass outside.",
  focus: "50% 46%",
  // The glass wall. Nearly the whole frame, so the push through it is
  // a slow open rather than a dive — which is what an opening wants.
  aperture: { x: 3, y: 11, w: 94, h: 61 },
}

/** Arrived through the car window. A doorway, and a garden past it. */
export const threshold: World = {
  id: "threshold",
  poster: "/images/aranyaka/threshold.jpg",
  posterSmall: "/images/aranyaka/threshold-960.webp",
  alt: "A woman in a pale dress stands in an open doorway, dense foliage and soft smoke beyond.",
  focus: "50% 45%",
  // The open door she is standing in. Narrow and tall — the most dramatic
  // passage on the site, because the screen has to come through a slot.
  aperture: { x: 40, y: 4, w: 20, h: 88 },
}

/**
 * THE RESORT CHAIN.
 *
 * Five worlds, four passages, no cuts: the land, the house, the eave, the
 * room, the morning. You enter each one through the last one's opening,
 * which is what makes it read as moving through a place rather than
 * looking at photographs of one.
 */
export const resortChain: World[] = [
  {
    id: "estate-aerial",
    poster: `${M}/estate-aerial.jpg`,
    alt: "An aerial view of stone residences set into dense forest in low light.",
    focus: "50% 54%",
    // No built opening in an aerial, so the passage irises on the one
    // clearing the eye already reads — the lawn between the two nearest
    // roofs. This is the weakest aperture on the site precisely because
    // it is found in CSS rather than in the photograph.
    aperture: { x: 38, y: 42, w: 24, h: 20, round: 50 },
  },
  {
    id: "house-trees",
    poster: `${M}/house-trees.jpg`,
    alt: "A house of pale stone and timber screens, held under mature trees in late sun.",
    focus: "50% 50%",
    // The upper window.
    aperture: { x: 21, y: 36, w: 26, h: 12 },
  },
  {
    id: "timber",
    poster: `${S}/timber.jpg`,
    posterSmall: `${S}/timber-960.webp`,
    alt: "A house with a timber balcony, glass rail and a hanging lamp, under a large tree.",
    focus: "50% 50%",
    // The lit room behind the balcony glass.
    aperture: { x: 26, y: 38, w: 34, h: 20 },
  },
  {
    id: "forest-kitchen",
    poster: `${M}/forest-kitchen.jpg`,
    alt: "An open-air kitchen under a canopy, a woman preparing food at a stone counter.",
    focus: "50% 52%",
    // The gap between the counter and the canopy, out into the trees.
    aperture: { x: 6, y: 20, w: 34, h: 34 },
  },
  {
    id: "terrace",
    poster: `${M}/terrace.jpg`,
    alt: "A stone terrace at dawn, a chair and a cup of tea, and a deer grazing in mist beyond the railing.",
    focus: "50% 50%",
    // The last world. Nothing leads out of it, which is the point.
  },
]
