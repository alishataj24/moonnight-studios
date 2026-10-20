import { useCallback, useEffect, useState } from "react"
import { ActAbout } from "./components/ActAbout"
import { ActArrival } from "./components/ActArrival"
import { ActLastFrame } from "./components/ActLastFrame"
import { ActInstrument } from "./components/ActInstrument"
import { ActViewpoint } from "./components/ActViewpoint"
import { ActResort } from "./components/ActResort"
import { ContactPanel } from "./components/ContactPanel"
import { FilmViewer } from "./components/FilmViewer"
import { FilmScreening } from "./components/FilmScreening"
import { ImageExhibition } from "./components/ImageExhibition"
import { PortalGate, type WorldId } from "./components/PortalGate"
import { SiteFooter } from "./components/SiteFooter"
import { SiteRail } from "./components/SiteRail"
import { WorldOverlay } from "./components/WorldOverlay"
import type { Piece } from "./data/portfolio"

/**
 * The journey, and the two worlds that open out of it.
 *
 * The page itself is a short cinematic sequence — arrival, the gate,
 * the resort chain, two quiet beats, the ending. The portfolio is not
 * part of that scroll: IMAGES and FILMS take the whole screen when
 * chosen, and hand the visitor back to the gate when closed.
 *
 * The open world is reflected in the URL hash, so Back leaves a world
 * rather than the site, and a link can point straight at one.
 */
export function App() {
  const [world, setWorld] = useState<WorldId | null>(null)
  const [view, setView] = useState<{
    collection: Piece[]
    index: number
    origin?: DOMRect | null
  } | null>(null)
  const [panel, setPanel] = useState(false)
  const [presetType, setPresetType] = useState<string | null>(null)
  const [guides, setGuides] = useState(false)

  // Hash drives the world, so Back works and a world can be linked to.
  useEffect(() => {
    const read = () => {
      const hash = window.location.hash.replace("#", "")
      setWorld(hash === "images" || hash === "films" ? hash : null)
    }
    read()
    window.addEventListener("hashchange", read)
    const params = new URLSearchParams(window.location.search)
    setGuides(params.has("apertures"))
    const project = params.get("project")
    if (project) {
      setPresetType(project)
      setPanel(true)
    }
    return () => window.removeEventListener("hashchange", read)
  }, [])

  const enter = useCallback((id: WorldId) => {
    history.pushState(null, "", `#${id}`)
    setWorld(id)
  }, [])

  const leave = useCallback(() => {
    if (window.location.hash === "#images" || window.location.hash === "#films") history.back()
    else setWorld(null)
  }, [])

  const openViewer = useCallback((item: Piece, collection: Piece[], origin: DOMRect) => {
    const index = collection.findIndex((entry) => entry.id === item.id)
    setView({ collection, index: Math.max(0, index), origin })
  }, [])

  const startProject = useCallback(() => setPanel(true), [])

  return (
    <>
      <a className="skip" href="#work">
        Skip to the work
      </a>

      <SiteRail onWorld={enter} onContact={startProject} />

      <main id="main">
        <ActArrival guides={guides} />
        <PortalGate onEnter={enter} />
        <ActResort guides={guides} />
        <ActInstrument onFilms={() => enter("films")} />
        <ActViewpoint />
        <ActAbout />
        <ActLastFrame onStart={startProject} />
      </main>

      <SiteFooter />

      <WorldOverlay label="Images" open={world === "images"} onClose={leave}>
        <ImageExhibition onOpen={openViewer} onClose={leave} />
      </WorldOverlay>

      <WorldOverlay label="Films" open={world === "films"} onClose={leave}>
        <FilmScreening onClose={leave} />
      </WorldOverlay>

      {view && (
        <FilmViewer
          collection={view.collection}
          index={view.index}
          origin={view.origin}
          onIndex={(index) =>
            setView((current) => (current ? { ...current, index, origin: null } : current))
          }
          onClose={() => setView(null)}
        />
      )}

      <ContactPanel
        open={panel}
        presetType={presetType}
        onClose={() => {
          setPanel(false)
          setPresetType(null)
        }}
      />
    </>
  )
}
