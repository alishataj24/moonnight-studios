import type { CSSProperties } from "react"
import type { Piece } from "../data/portfolio"
import { useAmbientVideo } from "../hooks/useAmbientVideo"

/**
 * One picture, optionally alive.
 *
 * Used by every act so a visual behaves identically wherever it appears:
 * responsive still, a silent loop over it where the clip is suited to it,
 * and a play mark that opens the viewer when a real video file exists.
 *
 * It renders no text. `alt` reaches assistive technology only.
 */
export function MediaFrame({
  item,
  onOpen,
  ambient,
  eager,
  focus,
  className,
  style,
  depthRef,
}: {
  item: Piece
  /** Receives the frame's own rect, so the viewer can grow out of it. */
  onOpen?: (origin: DOMRect) => void
  /** Loop silently in place. Ignored unless the piece has a video file. */
  ambient?: boolean
  eager?: boolean
  focus?: string
  className?: string
  style?: CSSProperties
  /** Receives the inner element so a parent can drive parallax on it. */
  depthRef?: (node: HTMLDivElement | null) => void
}) {
  const live = Boolean(ambient && item.video)
  const { hostRef, videoRef, mounted, active } = useAmbientVideo(live)
  const position = focus ?? item.focus

  return (
    <div className={`frame ${className ?? ""}`} style={style} ref={hostRef}>
      <div className="frame-inner" ref={depthRef}>
        <picture>
          {item.posterSmall && (
            <source srcSet={item.posterSmall} media="(max-width: 860px)" type="image/webp" />
          )}
          <img
            src={item.poster}
            alt={item.alt}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            style={{ objectPosition: position }}
          />
        </picture>

        {mounted && item.video && (
          <video
            ref={videoRef}
            src={item.video}
            poster={item.poster}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            data-playing={active}
            style={{ objectPosition: position }}
          />
        )}
      </div>

      {item.video && onOpen && (
        <button
          type="button"
          className="frame-open"
          onClick={(event) =>
            onOpen(event.currentTarget.getBoundingClientRect())
          }
          aria-label={`View larger: ${item.alt}`}
        >
          <span className="play-mark" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
