/**
 * The scroll engine.
 *
 * One rAF loop drives every scroll-linked composition on the page. A stage
 * registers a track element; the engine turns that track's position into a
 * 0 → 1 progress value and hands it to a `compute` function, which returns
 * named channels. Channels are written as CSS custom properties, so the
 * choreography itself lives in the stylesheet and only numbers cross the
 * JS/CSS boundary.
 *
 * Why not GSAP ScrollTrigger: pinning there rewrites the DOM with spacer
 * elements and takes ownership of the scroll position. Native
 * `position: sticky` plus the real scrollbar means the visitor keeps full
 * control — flick scrolling, End, Page Down, find-in-page and the scrollbar
 * thumb all behave normally. Nothing here listens to `wheel` or `touchmove`,
 * so the experience is choreographed but never hijacked.
 */

/** Channel values are usually numbers the stylesheet does arithmetic on,
 *  but a keyword is allowed where CSS cannot compute one — `pointer-events`
 *  in particular, so a faded-out control stops being clickable. */
export type Channels = Record<string, number | string>

type Stage = {
  track: HTMLElement
  target: HTMLElement
  compute: (progress: number) => Channels
  /** Extra viewport-heights of margin before the engine bothers updating. */
  previous: Channels
}

const stages = new Set<Stage>()
let frame = 0
let running = false

const clamp = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value)

function update() {
  frame = 0
  const viewport = window.innerHeight

  for (const stage of stages) {
    const rect = stage.track.getBoundingClientRect()

    // Skip anything comfortably off screen. Keeps the loop at a handful of
    // reads even on a page with a dozen stages.
    if (rect.bottom < -viewport || rect.top > viewport * 2) continue

    const travel = rect.height - viewport
    const progress = travel > 0 ? clamp(-rect.top / travel) : rect.top <= 0 ? 1 : 0
    const channels = stage.compute(progress)

    for (const key in channels) {
      const value = channels[key]
      // Writing an unchanged property still costs a style recalc.
      if (stage.previous[key] === value) continue
      stage.previous[key] = value
      stage.target.style.setProperty(key, String(value))
    }
  }
}

function schedule() {
  if (frame) return
  frame = requestAnimationFrame(update)
}

function start() {
  if (running) return
  running = true
  window.addEventListener("scroll", schedule, { passive: true })
  window.addEventListener("resize", schedule)
  // Fonts and late images change geometry; re-measure when they land.
  window.addEventListener("load", schedule)
}

export function registerStage(
  track: HTMLElement,
  target: HTMLElement,
  compute: (progress: number) => Channels,
) {
  const stage: Stage = { track, target, compute, previous: {} }
  stages.add(stage)
  start()
  schedule()
  return () => {
    stages.delete(stage)
  }
}

/** Nudge the engine after a layout change the scroll listener cannot see. */
export function refreshStages() {
  for (const stage of stages) stage.previous = {}
  schedule()
}

/* ---- easing and range helpers, used by the compute functions ---------- */

/** Maps `value` from [a, b] onto 0 → 1, clamped. The workhorse. */
export function span(value: number, a: number, b: number) {
  if (b === a) return value >= b ? 1 : 0
  return clamp((value - a) / (b - a))
}

/** Slow in, slow out. The default for anything with weight. */
export function ease(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

/** Fast start, long settle. For things arriving. */
export function easeOut(t: number) {
  return 1 - (1 - t) ** 3
}

/** 0 at the edges, 1 in the middle of [a, b]. For holds and cross-fades. */
export function hold(value: number, a: number, b: number, fade = 0.12) {
  return Math.min(span(value, a, a + fade), 1 - span(value, b - fade, b))
}

export const mix = (from: number, to: number, t: number) => from + (to - from) * t

/** Rounds to a sane precision so unchanged frames are actually skipped. */
export const q = (value: number, places = 4) => Number(value.toFixed(places))
