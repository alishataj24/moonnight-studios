import { useEffect, useRef, useState } from "react"

/**
 * Silent in-place playback for gallery tiles.
 *
 * Three rules keep this cheap:
 *   1. The <video> element is not mounted at all until the tile is near the
 *      viewport, so nothing is fetched for work further down the page.
 *   2. Only PLAYING_LIMIT clips play at once. Tiles queue for a slot and
 *      release it the moment they leave the screen.
 *   3. Narrow viewports and reduced-motion get the poster and nothing else.
 */

const PLAYING_LIMIT = 3
const MIN_WIDTH = 820

const holders = new Set<symbol>()
const waiting: { token: symbol; wake: () => void }[] = []

function claimSlot(token: symbol, wake: () => void) {
  if (holders.has(token)) return true
  if (holders.size < PLAYING_LIMIT) {
    holders.add(token)
    return true
  }
  if (!waiting.some((entry) => entry.token === token)) waiting.push({ token, wake })
  return false
}

function releaseSlot(token: symbol) {
  holders.delete(token)
  const index = waiting.findIndex((entry) => entry.token === token)
  if (index >= 0) waiting.splice(index, 1)
  const next = waiting.shift()
  if (next) next.wake()
}

function ambientAllowed() {
  if (typeof window === "undefined") return false
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false
  // Coarse pointers are usually phones on metered connections.
  if (window.innerWidth < MIN_WIDTH) return false
  const connection = (navigator as { connection?: { saveData?: boolean } }).connection
  return !connection?.saveData
}

export function useAmbientVideo(enabled: boolean) {
  const hostRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  // `mounted` controls whether the <video> exists; `active` whether it plays.
  const [mounted, setMounted] = useState(false)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!enabled || !host || !ambientAllowed() || typeof IntersectionObserver === "undefined") {
      return
    }

    const token = Symbol("ambient")
    let near = false
    let onScreen = false

    const sync = () => {
      if (onScreen && claimSlot(token, sync)) setActive(true)
      else {
        setActive(false)
        if (!onScreen) releaseSlot(token)
      }
    }

    // Outer ring: mount the element and let it buffer.
    const prefetch = new IntersectionObserver(
      ([entry]) => {
        near = entry.isIntersecting
        setMounted((value) => value || near)
      },
      { rootMargin: "600px 0px" },
    )

    // Inner ring: actually play while the tile is properly on screen.
    const visible = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting && entry.intersectionRatio >= 0.45
        sync()
      },
      { threshold: [0, 0.45, 0.8] },
    )

    prefetch.observe(host)
    visible.observe(host)

    return () => {
      prefetch.disconnect()
      visible.disconnect()
      releaseSlot(token)
    }
  }, [enabled])

  // Drive the element from `active`, never from the render path.
  useEffect(() => {
    const node = videoRef.current
    if (!node) return
    if (active) void node.play().catch(() => undefined)
    else node.pause()
  }, [active, mounted])

  return { hostRef, videoRef, mounted, active }
}
