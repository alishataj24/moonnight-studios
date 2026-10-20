import { useCallback, useEffect, useRef, useState } from "react"
import { resort } from "../data/content"
import { GRID_COLS, GRID_ROWS, distance, grid, light } from "../data/instrument"
import { piece } from "../data/media"
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion"

/**
 * ACT 03 — THE INSTRUMENT.
 *
 * Not a carousel, not tabs, not cards. One frame fills the screen and
 * a small pad in the margin moves it along two axes of direction:
 * how far back the camera stands, and what the light is doing. The
 * point is not that there are nine pictures. The point is that you can
 * feel what changing a direction does to a brief, in the time it takes
 * to move your hand.
 *
 * A third control turns the chosen frame into the film it is a frame
 * of. Because every cell is a piece whose poster comes out of its own
 * clip, the still and the motion are always the same scene — that is
 * the whole reason these nine were chosen.
 *
 * Interaction: click or tap a cell, drag across the pad, or use the
 * arrow keys from any cell. The pad is a radiogroup, so a screen
 * reader announces it as one control with nine positions rather than
 * as nine unrelated buttons.
 */
export function ActInstrument({ onFilms }: { onFilms: () => void }) {
  const [row, setRow] = useState(1)
  const [col, setCol] = useState(1)
  const [prev, setPrev] = useState<{ row: number; col: number } | null>(null)
  const [rolling, setRolling] = useState(false)
  const [ready, setReady] = useState(false)
  const padRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const timer = useRef(0)
  const reduced = usePrefersReducedMotion()

  const cell = grid[row][col]
  const item = piece(cell.piece)

  const go = useCallback(
    (r: number, c: number) => {
      if (r === row && c === col) return
      setPrev({ row, col })
      setRow(r)
      setCol(c)
      // Changing the frame abandons the take: the clip belongs to the
      // frame you were on, not to the one you just moved to.
      setRolling(false)
      setReady(false)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setPrev(null), 1000)
    },
    [row, col],
  )

  useEffect(() => () => window.clearTimeout(timer.current), [])

  // One <video>, and its src is only set once the visitor asks for
  // motion — nine clips must never be fetched to show one picture.
  useEffect(() => {
    const node = videoRef.current
    if (!node) return
    if (!rolling) {
      node.removeAttribute("src")
      node.load()
      return
    }
    node.src = item?.video ?? ""
    node.play().catch(() => setRolling(false))
  }, [rolling, item?.video])

  const onPadKey = (event: React.KeyboardEvent) => {
    const map: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    }
    const step = map[event.key]
    if (!step) return
    event.preventDefault()
    const r = Math.min(GRID_ROWS - 1, Math.max(0, row + step[0]))
    const c = Math.min(GRID_COLS - 1, Math.max(0, col + step[1]))
    go(r, c)
    const index = r * GRID_COLS + c
    ;(padRef.current?.querySelectorAll(".inst-cell")[index] as HTMLElement)?.focus()
  }

  if (!item) return null

  return (
    <section
      className="act act-instrument"
      id="instrument"
      data-band-tone="dark"
      aria-labelledby="inst-head"
    >
      <h2 className="u-hidden" id="inst-head">
        One property, nine directions
      </h2>

      <div className="inst-frame">
        {/* The frame you came from stays until the new one has covered
            it, so the stage is never empty between two pictures. */}
        {prev && !reduced && <Plate key={`${prev.row}-${prev.col}`} id={grid[prev.row][prev.col].piece} state="out" />}
        <Plate key={`${row}-${col}`} id={cell.piece} state="in" hidden={rolling && ready} />

        <video
          ref={videoRef}
          className="inst-video"
          data-on={rolling && ready ? "true" : "false"}
          muted
          loop
          playsInline
          preload="none"
          poster={item.poster}
          aria-label={item.alt}
          onPlaying={() => setReady(true)}
        />

        <span className="inst-veil" aria-hidden="true" />
      </div>

      <div className="inst-ui spread">
        {/* No slate number. "B-07" could not be looked up anywhere and
            was there to look like a film studio rather than to tell
            anyone anything. What is left is the coordinate, which says
            where on the pad you actually are. */}
        <p className="inst-coord">
          {/* The light stops read "In mist", "In shade" — lower-cased
              here so the two axes join into one phrase instead of
              reading as two labels stuck together. */}
          {distance.stops[col].name}, {light.stops[row].name.toLowerCase()}
        </p>

        <div className="inst-controls">
          <p className="inst-note" key={cell.piece}>
            {cell.note}
          </p>

          <div className="inst-pad-set">
            {/* The pad and its axes are one grid: the labels occupy
                their own tracks instead of being positioned over the
                dots, which is what kept them colliding with each
                other and with the controls beside them. */}
            <div className="inst-pad-wrap">
              {/* The two axis names. On a narrow screen these replace
                  the per-stop labels, which are wider than the pad's
                  own columns and collide with each other there; the
                  slate above already states the exact coordinate. */}
              <span className="inst-axis-name inst-name-y" aria-hidden="true">
                {light.label} ↓
              </span>
              <span className="inst-axis-name inst-name-x" aria-hidden="true">
                {distance.label} →
              </span>
              <span className="inst-axis inst-axis-x" aria-hidden="true">
                {distance.stops.map((s) => (
                  <i key={s.id}>{s.name}</i>
                ))}
              </span>
              <span className="inst-axis inst-axis-y" aria-hidden="true">
                {light.stops.map((s) => (
                  <i key={s.id}>{s.name}</i>
                ))}
              </span>
              <div
                className="inst-pad"
                role="radiogroup"
                aria-label="Direction: distance and light"
                ref={padRef}
                onKeyDown={onPadKey}
              >
                {grid.map((line, r) =>
                  line.map((entry, c) => (
                    <button
                      key={entry.piece}
                      type="button"
                      role="radio"
                      aria-checked={r === row && c === col}
                      tabIndex={r === row && c === col ? 0 : -1}
                      className="inst-cell"
                      onClick={() => go(r, c)}
                      onPointerEnter={(e) => e.buttons === 1 && go(r, c)}
                      aria-label={`${distance.stops[c].name}, ${light.stops[r].name}`}
                    >
                      <span className="inst-dot" aria-hidden="true" />
                    </button>
                  )),
                )}
              </div>
            </div>

            <div className="inst-motion">
              <button
                type="button"
                className="inst-roll"
                aria-pressed={rolling}
                onClick={() => setRolling((on) => !on)}
              >
                <span className="inst-roll-mark" aria-hidden="true" />
                {rolling ? "Stop" : "Roll this frame"}
              </button>
              <button type="button" className="inst-open" onClick={onFilms}>
                All films<span className="arrow" aria-hidden="true">↗</span>
              </button>
            </div>
          </div>

          {/* Moved here from the end of the resort chain, which was
              holding a whole screen on a photograph to carry this one
              line. It belongs with the frames it describes. */}
          <p className="fine-print inst-note-fine">{resort.note}</p>
        </div>
      </div>
    </section>
  )
}

function Plate({ id, state, hidden }: { id: string; state: "in" | "out"; hidden?: boolean }) {
  const item = piece(id)
  if (!item) return null
  return (
    <figure className="inst-plate" data-state={state} data-hidden={hidden ? "true" : "false"}>
      <picture>
        {item.posterSmall && (
          <source srcSet={item.posterSmall} media="(max-width: 760px)" type="image/webp" />
        )}
        <img
          src={item.poster}
          alt={state === "in" ? item.alt : ""}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: item.focus }}
        />
      </picture>
    </figure>
  )
}
