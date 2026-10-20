/**
 * THE INSTRUMENT — section 03.
 *
 * One property, nine frames, two axes of creative direction. Moving
 * across the pad is the thing the studio actually sells: the same
 * brief, taken in a different direction, seen immediately.
 *
 * WHY THESE NINE. Every cell is a piece that has BOTH a real still and
 * a real film on disk — and because a film's poster is literally a
 * frame of that film, the still and the moving version are guaranteed
 * to be the same scene. Nothing here is a pairing I invented: pull the
 * motion control on any cell and you are watching the clip that still
 * came from.
 *
 * The coordinates are read off the work, not assigned to fill a grid.
 * Each frame sits where its own description puts it. If a frame is
 * ever replaced, re-read it and place it honestly, or move it.
 *
 * There is no fourth column for rain or night. Rain exists in the
 * library (`rain-walk`, `stream`) but not at every distance, and there
 * is no night work at all — a column that had to be padded would make
 * the instrument a lie about what has been shot.
 */

export type Axis = {
  id: string
  /** Shown above the pad, in production-note type. */
  label: string
  /** Three stops, in order. */
  stops: { id: string; name: string }[]
}

/** Horizontal: how far back the camera stands. */
export const distance: Axis = {
  id: "distance",
  label: "Distance",
  stops: [
    { id: "wide", name: "The wide" },
    { id: "place", name: "The place" },
    { id: "detail", name: "The detail" },
  ],
}

/** Vertical: what the light is doing. */
export const light: Axis = {
  id: "light",
  label: "Light",
  stops: [
    { id: "mist", name: "In mist" },
    { id: "shade", name: "In shade" },
    { id: "sun", name: "In low sun" },
  ],
}

export type Cell = {
  /** A piece id from `portfolio.ts`. Carries the still and the film. */
  piece: string
  /** Scene identifier, in the manner of a slate. Not a project name. */
  slate: string
  /** What the direction does to the frame. One line, no adjectives for
   *  their own sake — it has to be true of the picture on screen. */
  note: string
}

/** Indexed [light stop][distance stop] — rows top to bottom. */
export const grid: Cell[][] = [
  [
    { piece: "pond", slate: "A-11", note: "Held back, nothing moving but the water." },
    { piece: "mist-rail", slate: "A-14", note: "Close enough to be standing there." },
    { piece: "meadow", slate: "A-19", note: "One small thing, the rest let go." },
  ],
  [
    { piece: "stone-court", slate: "B-03", note: "The setting first, read through what frames it." },
    { piece: "forest-bath", slate: "B-07", note: "Inside the place, the forest right against it." },
    { piece: "fern", slate: "B-12", note: "Shade, and the one pale thing in it." },
  ],
  [
    { piece: "fountain-lawn", slate: "C-02", note: "Open ground, the building left in the distance." },
    { piece: "water-wall", slate: "C-08", note: "Low sun on the one surface that moves." },
    { piece: "shore", slate: "C-16", note: "The last of the light, at the size of a hand." },
  ],
]

export const GRID_ROWS = grid.length
export const GRID_COLS = grid[0].length
