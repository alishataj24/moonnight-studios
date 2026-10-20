import { useCallback, useEffect, useRef, useState } from "react"
import { piece } from "../data/media"
import type { Piece } from "../data/portfolio"
import { screening } from "../data/rooms"
import { useWheelStep } from "../hooks/useWheelStep"
import { WorldChrome } from "./ImageExhibition"

/**
 * FILMS — the screening room.
 *
 * A program frame and a strip, which is how an edit suite is laid out
 * and nothing like how a video site is. One film holds the frame; the
 * rest wait along the bottom edge as poster thumbs.
 *
 * **Exactly one video element exists at a time.** The strip is posters,
 * not players, so selecting a film swaps the source on the single
 * program element rather than mounting another. That is what keeps a
 * room of films to one decoder and one download.
 *
 * The scrubber is the real timeline — it reads `currentTime` and seeks
 * on drag, with a keyboard-accessible range input underneath doing the
 * actual work, so arrow keys scrub by five seconds and screen readers
 * get a slider rather than a mystery bar.
 */
export function FilmScreening({ onClose }: { onClose: () => void }) {
  const films = screening.map((f) => piece(f.id)).filter(Boolean) as Piece[]
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const film = films[index]

  const step = useCallback(
    (delta: number) => setIndex((i) => (i + delta + films.length) % films.length),
    [films.length],
  )

  // Same gesture as the exhibition: a visitor who learns that the
  // wheel moves one room will try it in the other.
  useWheelStep(step)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName
      if (tag === "INPUT") return
      if (event.key === "Escape") return onClose()
      if (event.key === "ArrowRight") { event.preventDefault(); step(1) }
      if (event.key === "ArrowLeft") { event.preventDefault(); step(-1) }
      if (event.key === " ") {
        event.preventDefault()
        setPlaying((p) => !p)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose, step])

  // Drive the single element from state rather than from the render path.
  useEffect(() => {
    const node = videoRef.current
    if (!node) return
    if (playing) void node.play().catch(() => setPlaying(false))
    else node.pause()
  }, [playing, index])

  useEffect(() => {
    setTime(0)
    setDuration(0)
    setPlaying(true)
  }, [index])

  if (!film?.video) return null

  const progress = duration ? (time / duration) * 100 : 0

  return (
    <div className="screening">
      <div className="program">
        <video
          ref={videoRef}
          key={film.id}
          src={film.video}
          poster={film.poster}
          muted={muted}
          playsInline
          preload="metadata"
          aria-label={film.alt}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
          onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
          onEnded={() => step(1)}
          onClick={() => setPlaying((p) => !p)}
        />

        <div className="program-bar">
          <button
            type="button"
            className="pill"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" fill="currentColor" stroke="none" /></svg>
            )}
          </button>

          {/* A real range input does the seeking: keyboard-operable,
              announced as a slider, and styled to read as a film
              scrubber rather than a form control. */}
          <label className="scrub">
            <span className="u-hidden">Scrub</span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.05}
              value={time}
              onChange={(e) => {
                const node = videoRef.current
                if (!node) return
                node.currentTime = Number(e.target.value)
                setTime(Number(e.target.value))
              }}
            />
            <span className="scrub-track" aria-hidden="true">
              <span style={{ transform: `scaleX(${progress / 100})` }} />
            </span>
          </label>

          <span className="clock" aria-hidden="true">
            {clock(time)} / {clock(duration)}
          </span>

          <button
            type="button"
            className="pill"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zM17 9l4 6M21 9l-4 6" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4zM17 8a5 5 0 010 8" /></svg>
            )}
          </button>
        </div>
      </div>

      {/* The strip. Posters only — no second video is ever mounted. */}
      <div className="strip" role="tablist" aria-label="Films">
        {films.map((item, i) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            className="strip-frame"
            data-on={i === index || undefined}
            onClick={() => setIndex(i)}
            aria-label={item.alt}
          >
            <img src={item.poster} alt="" loading={i < 5 ? "eager" : "lazy"} decoding="async" />
          </button>
        ))}
      </div>

      <WorldChrome
        position={`${index + 1} / ${films.length}`}
        onPrev={() => step(-1)}
        onNext={() => step(1)}
        hint="Scroll or use ← →"
      />
    </div>
  )
}

function clock(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00"
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, "0")}`
}
