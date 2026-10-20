import type { CSSProperties } from "react"
import type { Aperture, World } from "../data/worlds"

/**
 * A WORLD, AND THE PASSAGE OUT OF IT.
 *
 * Two layers, both driven by one progress value the act writes as CSS
 * custom properties:
 *
 *   the world    scales up about the centre of its own aperture, so the
 *                opening grows toward the edges of the screen and the
 *                room around it blows past the camera
 *
 *   the next     sits full-bleed underneath, clipped to a rect that
 *                starts inside the aperture and opens out to the whole
 *                screen — so the new place arrives through the hole
 *
 * Nothing cross-fades. The outgoing world only drops away at the very
 * end, once its aperture is already past the frame edges and there is
 * nothing left of it to see.
 *
 * Both properties are transform and clip-path, so the whole thing runs
 * on the compositor.
 */

export function apertureVars(a: Aperture | undefined): CSSProperties {
  // A world with no aperture never leaves; the journey ends there.
  if (!a) return { "--ap-x": 50, "--ap-y": 50 } as CSSProperties
  return {
    "--ap-x": a.x + a.w / 2,
    "--ap-y": a.y + a.h / 2,
    // How far the world must grow for the opening to cover the screen.
    // A narrow doorway needs a much longer push than a wide glass wall,
    // which is exactly why the slot transitions feel faster and harder.
    "--ap-push": Math.min(6, 100 / Math.max(a.w, a.h)),
    "--ap-t": a.y,
    "--ap-r": 100 - (a.x + a.w),
    "--ap-b": 100 - (a.y + a.h),
    "--ap-l": a.x,
    "--ap-round": a.round ?? 0,
  } as CSSProperties
}

export function WorldLayer({
  world,
  eager,
  className = "",
  style,
}: {
  world: World
  eager?: boolean
  className?: string
  style?: CSSProperties
}) {
  return (
    <div className={`world-layer ${className}`} style={style}>
      <picture>
        {world.posterSmall && (
          <source srcSet={world.posterSmall} media="(max-width: 760px)" type="image/webp" />
        )}
        <img
          src={world.poster}
          alt={world.alt}
          loading={eager ? "eager" : "lazy"}
          decoding={eager ? "sync" : "async"}
          style={{ objectPosition: world.focus }}
        />
      </picture>
      <span className="world-veil" aria-hidden="true" />
    </div>
  )
}

/**
 * Drawn only with ?apertures=1. Calibration, not decoration: an aperture
 * is a measurement of a photograph and has to be checked against the live
 * cover-crop, which changes with the viewport.
 */
export function ApertureGuide({ world }: { world: World }) {
  const a = world.aperture
  if (!a) return null
  return (
    <div
      className="aperture-guide"
      style={{
        left: `${a.x}%`,
        top: `${a.y}%`,
        width: `${a.w}%`,
        height: `${a.h}%`,
        borderRadius: `${a.round ?? 0}%`,
      }}
    >
      <span>
        {world.id} · {a.x},{a.y} {a.w}×{a.h}
      </span>
    </div>
  )
}
