/**
 * The work.
 *
 * This file carries no titles, captions, descriptions, client names or
 * project names — by design. The gallery is silent: the only strings here
 * are `alt`, which is never rendered visually and exists so the gallery is
 * usable by screen readers and when an image fails to load.
 *
 * Every `poster` and `video` path below is a file that exists in `public/`.
 * Never add a path here before the file is on disk.
 *
 * ORDER IS THE EDIT. The sequence is arranged by light, colour, scale and
 * subject — dark interior, hazy aerial, dawn mist, architecture in green,
 * rain, quiet ground, golden hour, cold blue dawn, night, water — so the
 * gallery reads as a cut rather than a dump. Inserting a piece in the
 * middle changes the rhythm; place new work where its atmosphere belongs.
 *
 * To add work:
 *   1. Put the media in `public/media/<group>/` and a poster in
 *      `public/images/<group>/`.
 *   2. Add an entry here with a unique `id` and a `category`.
 *   3. Put it in exactly one room in `rooms.ts` — the exhibition if it
 *      is a still, the screening if it is a clip. Never both.
 */

export type Category = "films" | "images" | "portraits"


export type Piece = {
  id: string
  category: Category
  /** Still frame, always present. Doubles as the video poster. */
  poster: string
  /** Narrow-viewport variant where one exists. */
  posterSmall?: string
  /** Present only when a real video file exists. Never fake this. */
  video?: string
  /** `width / height` of the source, used to reserve space. */
  ratio: string
  /** Display crop. Defaults to the source ratio. */
  crop?: string
  focus?: string
  /**
   * Not rendered on screen. Assistive technology and broken-image fallback
   * only — the gallery stays visually silent.
   */
  alt: string
  /**
   * Loops silently in place while on screen, on wide viewports only.
   * Reserved for short, seamless, lightweight clips. A long cut with a
   * narrative or audio belongs in the viewer, not in the grid.
   */
  ambient?: boolean
  /** Audible content. Playback always starts muted. */
  hasAudio?: boolean
}

const S = "/images/aranyaka/stills"
const M = "/images/moonnight"
const V = "/media/studies"
const P = "/images/studies"

export const pieces: Piece[] = [
  // Opening frame — dark interior, a figure in a doorway.
  {
    id: "aranyaka",
    category: "films",
    video: "/media/aranyaka/film.mp4",
    poster: "/images/aranyaka/threshold.jpg",
    posterSmall: "/images/aranyaka/threshold-960.webp",
    ratio: "16 / 9",
    crop: "21 / 9",
    focus: "50% 30%",
    alt: "A woman in a pale dress stands in an open doorway, dense foliage and soft smoke beyond.",
    hasAudio: true,
  },

  // Out to the land, then back inside at dawn.
  {
    id: "acres",
    category: "images",
    poster: `${S}/acres.jpg`,
    posterSmall: `${S}/acres-960.webp`,
    ratio: "1200 / 1248",
    alt: "An aerial view of stone houses and trees in warm, low sun.",
  },
  {
    id: "cluster",
    category: "images",
    poster: `${S}/cluster.jpg`,
    posterSmall: `${S}/cluster-960.webp`,
    ratio: "3 / 4",
    alt: "Tight rows of stone houses with dark roofs, set into dense forest.",
  },
  {
    id: "canopy",
    category: "images",
    poster: `${S}/canopy.jpg`,
    posterSmall: `${S}/canopy-960.webp`,
    ratio: "3 / 4",
    alt: "An aerial view of pale stone houses among dense trees, haze over the forest beyond.",
  },
  {
    id: "mist",
    category: "images",
    poster: `${S}/mist.jpg`,
    posterSmall: `${S}/mist-960.webp`,
    ratio: "4 / 3",
    alt: "A person at a glass wall looking onto mist, trees and low sun, a chair and small table in the room.",
  },

  // Architecture held in green, then rain.
  {
    id: "timber",
    category: "images",
    poster: `${S}/timber.jpg`,
    posterSmall: `${S}/timber-960.webp`,
    ratio: "3 / 4",
    alt: "A house with a timber balcony, glass rail and hanging lamp, under a large tree.",
  },
  {
    id: "gate",
    category: "films",
    video: `${V}/gate.mp4`,
    poster: `${P}/gate.jpg`,
    ratio: "16 / 9",
    alt: "Two cars and a family with an umbrella at a timber entrance gate in the rain.",
    ambient: true,
  },

  // Three uprights: the quiet ground.
  {
    id: "path",
    category: "images",
    poster: `${S}/path.jpg`,
    posterSmall: `${S}/path-960.webp`,
    ratio: "3 / 4",
    alt: "A stone path leads to a timber door between two slender trees.",
  },
  {
    id: "lawn",
    category: "images",
    poster: `${S}/lawn.jpg`,
    posterSmall: `${S}/lawn-960.webp`,
    ratio: "3 / 4",
    alt: "A row of stone houses behind a lawn, a deer grazing, a large tree overhead.",
  },
  {
    id: "deer",
    category: "images",
    poster: `${S}/deer.jpg`,
    posterSmall: `${S}/deer-960.webp`,
    ratio: "4 / 3",
    crop: "3 / 4",
    focus: "52% 45%",
    alt: "A young deer beside bamboo, a pale railing and soft hills behind.",
  },

  // Golden hour, people.
  {
    id: "cycling",
    category: "films",
    video: `${V}/cycling.mp4`,
    poster: `${P}/cycling.jpg`,
    ratio: "16 / 9",
    alt: "A family cycles along a garden path between residential towers at low sun.",
    ambient: true,
  },
  {
    id: "reading",
    category: "portraits",
    video: `${V}/reading.mp4`,
    poster: `${P}/reading.jpg`,
    ratio: "16 / 9",
    alt: "A boy reads a book on a sofa in window light.",
  },

  // Night, then the cold blue of first light.
  {
    id: "stadium",
    category: "films",
    video: `${V}/stadium.mp4`,
    poster: `${P}/stadium.jpg`,
    ratio: "16 / 9",
    alt: "A child runs across a floodlit pitch at night.",
  },
  {
    id: "dusk",
    category: "images",
    poster: `${S}/dusk.jpg`,
    posterSmall: `${S}/dusk-960.webp`,
    ratio: "3 / 4",
    alt: "A person in a pale robe on a balcony at sunrise, a deer in the frosted field beyond.",
  },

  // Graphic green, then water.
  {
    id: "shadows",
    category: "films",
    video: `${V}/shadows.mp4`,
    poster: `${P}/shadows.jpg`,
    ratio: "16 / 9",
    alt: "Three long shadows stretch across a grass pitch into low evening sun.",
    ambient: true,
  },

  // Three uprights: closer in.
  {
    id: "court",
    category: "films",
    video: `${V}/court.mp4`,
    poster: `${P}/court.jpg`,
    ratio: "16 / 9",
    crop: "3 / 4",
    focus: "50% 55%",
    alt: "A paddle and a yellow ball on a wet court at dusk.",
    ambient: true,
  },
  {
    id: "pitch",
    category: "films",
    video: `${V}/pitch.mp4`,
    poster: `${P}/pitch.jpg`,
    ratio: "16 / 9",
    crop: "3 / 4",
    focus: "50% 50%",
    alt: "A lone figure on a grass pitch at sunset, towers standing behind.",
    ambient: true,
  },
  {
    id: "study",
    category: "portraits",
    video: `${V}/study.mp4`,
    poster: `${P}/study.jpg`,
    ratio: "720 / 964",
    crop: "3 / 4",
    alt: "A child writes at a table in a bright living room.",
    hasAudio: true,
  },

  // Water and after-rain.
  {
    id: "float",
    category: "portraits",
    video: `${V}/float.mp4`,
    poster: `${P}/float.jpg`,
    ratio: "16 / 9",
    alt: "A child on a float in a pool, palms and low sun behind.",
    ambient: true,
  },
  {
    id: "promenade",
    category: "films",
    video: `${V}/promenade.mp4`,
    poster: `${P}/promenade.jpg`,
    ratio: "16 / 9",
    alt: "A wet promenade between houses after rain, a bicycle and a distant fountain.",
    ambient: true,
  },

  // Back out to the buildings.
  {
    id: "villa",
    category: "images",
    poster: `${S}/villa.jpg`,
    posterSmall: `${S}/villa-960.webp`,
    ratio: "16 / 9",
    alt: "A residence with a dark roof and timber screens, set against a forested hill.",
  },
  {
    id: "drive",
    category: "images",
    poster: `${S}/drive.jpg`,
    posterSmall: `${S}/drive-960.webp`,
    ratio: "16 / 9",
    alt: "A pale house on a stone base, a car in the garage and planted beds along the drive.",
  },

  // Closing frame — dark water, leading into the resort sequence.
  {
    id: "water",
    category: "images",
    poster: "/images/aranyaka/water.jpg",
    posterSmall: "/images/aranyaka/water-960.webp",
    ratio: "16 / 9",
    crop: "21 / 9",
    focus: "50% 55%",
    alt: "A stone fountain in warm, low sunlight, water falling into a dark pool.",
  },

  /* ---- Supplied October 2026 -------------------------------------
     The estate and community set. Converted from PNG at 1600px / q62;
     no -960 variants because the toolchain here cannot write webp, so
     these carry no `posterSmall` and rely on lazy loading instead.

     Nine supplied files are deliberately not here:
       7 multi-up proposal boards (5, 12, 21, 22, 24, 26) — contact
         sheets, not frames, and they would read as a slide in a deck
       2 broken exports (35, 36) — a sliver of picture over black
       1 trademark (15) — a child in a Lakers-branded kit
     ------------------------------------------------------------------ */
  {
    id: "terrace",
    category: "images",
    poster: `${M}/terrace.jpg`,
    ratio: "1800 / 1012",
    alt: "A stone terrace at dawn, a chair and a cup of tea, and a deer grazing in mist beyond the railing.",
  },
  {
    id: "bamboo-deck",
    category: "images",
    poster: `${M}/bamboo-deck.jpg`,
    ratio: "4 / 3",
    alt: "A timber balcony against bamboo, a deer looking over the rail, and wooded hills receding into haze.",
  },
  {
    id: "fawn",
    category: "images",
    poster: `${M}/fawn.jpg`,
    ratio: "4 / 3",
    alt: "A young deer standing in bamboo in low backlight, ears raised.",
  },
  {
    id: "oaks-dusk",
    category: "images",
    poster: `${M}/oaks-dusk.jpg`,
    ratio: "3 / 4",
    alt: "A glass pavilion under old oaks at dusk, almost in silhouette.",
  },
  {
    id: "house-trees",
    category: "images",
    poster: `${M}/house-trees.jpg`,
    ratio: "3 / 4",
    alt: "A house of pale stone and timber screens, held under mature trees in late sun.",
  },
  {
    id: "canopy-ridge",
    category: "images",
    poster: `${M}/canopy-ridge.jpg`,
    ratio: "3 / 4",
    alt: "An aerial view across a forest canopy at sunset, a ridge running to the sea.",
  },
  {
    id: "estate-aerial",
    category: "images",
    poster: `${M}/estate-aerial.jpg`,
    ratio: "3 / 4",
    alt: "An aerial view of stone residences set into dense forest in low light.",
  },
  {
    id: "swans-deer",
    category: "images",
    poster: `${M}/swans-deer.jpg`,
    ratio: "3 / 4",
    alt: "A deer on the far bank of a pond with two swans on the water, backlit through old trees.",
  },
  {
    id: "deer-pond",
    category: "images",
    poster: `${M}/deer-pond.jpg`,
    ratio: "3 / 4",
    alt: "A deer at the edge of a wooded pond with ducks on the water.",
  },
  {
    id: "swans-pond",
    category: "images",
    poster: `${M}/swans-pond.jpg`,
    ratio: "3 / 4",
    alt: "Two swans and ducks on a green pond, a deer watching from the bank.",
  },
  {
    id: "infinity-pool",
    category: "images",
    poster: `${M}/infinity-pool.jpg`,
    ratio: "1800 / 1012",
    alt: "An infinity pool on a terrace above a forested valley, with a rocky ridge beyond.",
  },
  {
    id: "family-lawn",
    category: "images",
    poster: `${M}/family-lawn.jpg`,
    ratio: "1800 / 1012",
    alt: "A family and a golden retriever walking down a sloping lawn beside a stone house.",
  },
  {
    id: "villa-night",
    category: "images",
    poster: `${M}/villa-night.jpg`,
    ratio: "1800 / 1012",
    alt: "A lit villa at night seen across a still pool, trees framing the glass.",
  },
  {
    id: "gym-sea",
    category: "images",
    poster: `${M}/gym-sea.jpg`,
    ratio: "1800 / 1012",
    alt: "A gym behind full-height glass looking onto rocks and sunlit sea.",
  },
  {
    id: "estate-wide",
    category: "images",
    poster: `${M}/estate-wide.jpg`,
    ratio: "1800 / 1012",
    alt: "An aerial view of tiled-roof houses in a wide expanse of forest.",
  },
  {
    id: "forest-kitchen",
    category: "images",
    poster: `${M}/forest-kitchen.jpg`,
    ratio: "1800 / 1012",
    alt: "An open-air kitchen under a canopy, a woman preparing food at a stone counter.",
  },
  {
    id: "butterfly",
    category: "images",
    poster: `${M}/butterfly.jpg`,
    ratio: "1800 / 1012",
    alt: "A pale butterfly resting on driftwood on a beach, the sea bright behind it.",
  },
  {
    id: "boy-reading",
    category: "portraits",
    poster: `${M}/boy-reading.jpg`,
    ratio: "1344 / 1800",
    alt: "A boy lying on the floor with his legs up the wall, reading a book in window light.",
  },
  {
    id: "pool-boy",
    category: "portraits",
    poster: `${M}/pool-boy.jpg`,
    ratio: "1800 / 1005",
    alt: "A boy at the edge of a pool with goggles pushed up, pavilion and palms behind.",
  },
  {
    id: "man-window",
    category: "portraits",
    poster: `${M}/man-window.jpg`,
    ratio: "1800 / 1004",
    alt: "A man in a navy blazer sitting by a window in warm afternoon light.",
  },
  {
    id: "boy-car",
    category: "portraits",
    poster: `${M}/boy-car.jpg`,
    ratio: "1800 / 1004",
    alt: "A boy in the back of a car holding a football, looking out at traffic.",
  },
  {
    id: "living-room",
    category: "portraits",
    poster: `${M}/living-room.jpg`,
    ratio: "1344 / 1800",
    alt: "A woman at a dining table in a bright living room, sunlight across the floor.",
  },
  {
    id: "boy-kit",
    category: "portraits",
    poster: `${M}/boy-kit.jpg`,
    ratio: "1344 / 1800",
    alt: "A boy in a green football kit with a ball at his feet, teammates behind him.",
  },
  {
    id: "coach",
    category: "portraits",
    poster: `${M}/coach.jpg`,
    ratio: "1344 / 1800",
    alt: "A coach in a green tracksuit pointing across a pitch, two boys listening.",
  },
  {
    id: "water-break",
    category: "portraits",
    poster: `${M}/water-break.jpg`,
    ratio: "1800 / 1004",
    alt: "A man handing a water bottle to a boy in a football kit, a match going on beyond the glass.",
  },
  {
    id: "railing",
    category: "portraits",
    poster: `${M}/railing.jpg`,
    ratio: "1800 / 1005",
    alt: "A man leaning on a railing watching a boy run with a ball on a floodlit pitch.",
  },
  {
    id: "driving",
    category: "portraits",
    poster: `${M}/driving.jpg`,
    ratio: "1800 / 1004",
    alt: "A man driving with a boy beside him holding a football, city traffic around them.",
  },
  {
    id: "clubhouse-man",
    category: "portraits",
    poster: `${M}/clubhouse-man.jpg`,
    ratio: "1344 / 1800",
    alt: "A man in a blazer walking through a clubhouse terrace.",
  },
  {
    id: "clubhouse",
    category: "images",
    poster: `${M}/clubhouse.jpg`,
    ratio: "1800 / 1004",
    alt: "A clubhouse lounge behind glass at sunset, a football pitch and towers beyond.",
  },
  {
    id: "tennis",
    category: "images",
    poster: `${M}/tennis.jpg`,
    ratio: "1800 / 1005",
    alt: "A boy playing tennis on a blue court, apartment towers and low sun behind.",
  },
  {
    id: "goal",
    category: "images",
    poster: `${M}/goal.jpg`,
    ratio: "1800 / 1004",
    alt: "A boy in a blue kit celebrating a goal on a grass pitch, teammates running in.",
  },
  {
    id: "basketball",
    category: "images",
    poster: `${M}/basketball.jpg`,
    ratio: "1344 / 1800",
    alt: "A glass-walled basketball court with children playing, towers and palms outside.",
  },
  {
    id: "cycling-dusk",
    category: "images",
    poster: `${M}/cycling-dusk.jpg`,
    ratio: "1344 / 1800",
    alt: "A family cycling a garden path between towers at sunset.",
  },

  /* ---- Supplied clips, October 2026 ------------------------------
     Web encodes in public/media/reels, posters in public/images/reels.
     No titles. The picture is the only label.
     ------------------------------------------------------------------ */
  {
    id: "stream",
    category: "films",
    video: "/media/reels/stream.mp4",
    poster: "/images/reels/stream.jpg",
    ratio: "16 / 9",
    alt: "Shallow water moving over a dark stone lip, rocks and light on the surface.",
    hasAudio: true,
  },
  {
    id: "forest-bath",
    category: "films",
    video: "/media/reels/forest-bath.mp4",
    poster: "/images/reels/forest-bath.jpg",
    ratio: "16 / 9",
    alt: "A wooden soaking tub and an open shower on a stone terrace, forest pressed against the glass.",
    hasAudio: true,
  },
  {
    id: "pond",
    category: "films",
    video: "/media/reels/pond.mp4",
    poster: "/images/reels/pond.jpg",
    ratio: "16 / 9",
    alt: "A deer stands on a bank above still water, two ducks swimming below.",
    hasAudio: true,
  },
  {
    id: "sea-gym",
    category: "films",
    video: "/media/reels/sea-gym.mp4",
    poster: "/images/reels/sea-gym.jpg",
    ratio: "16 / 9",
    alt: "Treadmills in a stone and glass room, the sea and a rock island beyond the glass.",
    hasAudio: true,
  },
  {
    id: "meadow",
    category: "films",
    video: "/media/reels/meadow.mp4",
    poster: "/images/reels/meadow.jpg",
    ratio: "16 / 9",
    alt: "A butterfly and a grasshopper on white flowers in wet grass, backlight and mist.",
    hasAudio: true,
  },
  {
    id: "mist-rail",
    category: "films",
    video: "/media/reels/mist-rail.mp4",
    poster: "/images/reels/mist-rail.jpg",
    ratio: "16 / 9",
    alt: "A person with a cup on a wet terrace, a deer standing in mist beyond the railing.",
    hasAudio: true,
  },
  {
    id: "fern",
    category: "films",
    video: "/media/reels/fern.mp4",
    poster: "/images/reels/fern.jpg",
    ratio: "16 / 9",
    alt: "A pale butterfly resting on a white flower, ferns and bamboo behind.",
    hasAudio: true,
  },
  {
    id: "stone-court",
    category: "films",
    video: "/media/reels/stone-court.mp4",
    poster: "/images/reels/stone-court.jpg",
    ratio: "16 / 9",
    alt: "A court set on a stone terrace above rocks and trees, seen through old branches.",
    hasAudio: true,
  },
  {
    id: "shore",
    category: "films",
    video: "/media/reels/shore.mp4",
    poster: "/images/reels/shore.jpg",
    ratio: "16 / 9",
    alt: "A pale butterfly on driftwood at the waterline, low sun across the sand.",
    hasAudio: true,
  },
  {
    id: "bamboo",
    category: "films",
    video: "/media/reels/bamboo.mp4",
    poster: "/images/reels/bamboo.jpg",
    ratio: "16 / 9",
    alt: "A young deer among bamboo, a railing and soft hills behind.",
    hasAudio: true,
  },
  {
    id: "water-wall",
    category: "films",
    video: "/media/reels/water-wall.mp4",
    poster: "/images/reels/water-wall.jpg",
    ratio: "16 / 9",
    alt: "A sheet of water falling down a stone wall in a planted garden, palms and low sun.",
  },
  {
    id: "fountain-lawn",
    category: "films",
    video: "/media/reels/fountain-lawn.mp4",
    poster: "/images/reels/fountain-lawn.jpg",
    ratio: "16 / 9",
    alt: "A square fountain on a lawn, framed by trees, a low round building in the distance.",
  },
  {
    id: "rain-walk",
    category: "films",
    video: "/media/reels/rain-walk.mp4",
    poster: "/images/reels/rain-walk.jpg",
    ratio: "16 / 9",
    alt: "Three figures with an umbrella walking a wet garden path between palms.",
  },
  {
    id: "overlook",
    category: "films",
    video: "/media/reels/overlook.mp4",
    poster: "/images/reels/overlook.jpg",
    ratio: "16 / 9",
    alt: "A boy at a window looking over a sunlit pitch, pool and residential towers.",
  },
  {
    id: "pitch-sun",
    category: "films",
    video: "/media/reels/pitch-sun.mp4",
    poster: "/images/reels/pitch-sun.jpg",
    ratio: "16 / 9",
    alt: "An aerial view of a grass pitch in long sun, a pool along one side.",
  },
  {
    id: "halfway",
    category: "films",
    video: "/media/reels/halfway.mp4",
    poster: "/images/reels/halfway.jpg",
    ratio: "16 / 9",
    alt: "A boy in a green kit standing over a football on the halfway line at sunset.",
  },
  {
    id: "wet-ball",
    category: "films",
    video: "/media/reels/wet-ball.mp4",
    poster: "/images/reels/wet-ball.jpg",
    ratio: "16 / 9",
    alt: "A football on wet grass beside a white line, floodlights and towers behind.",
  },
  {
    id: "glass-court",
    category: "films",
    video: "/media/reels/glass-court.mp4",
    poster: "/images/reels/glass-court.jpg",
    ratio: "16 / 9",
    alt: "Children running a glass-walled basketball court, palms and low sun outside.",
  },
  {
    id: "dribble",
    category: "films",
    video: "/media/reels/dribble.mp4",
    poster: "/images/reels/dribble.jpg",
    ratio: "16 / 9",
    alt: "Two boys chasing a basketball across an indoor court at sunset.",
  },
  {
    id: "kit",
    category: "portraits",
    video: "/media/reels/kit.mp4",
    poster: "/images/reels/kit.jpg",
    ratio: "16 / 9",
    alt: "A boy in a green kit holding a football, a match and towers behind him.",
  },
  {
    id: "sofa-book",
    category: "portraits",
    video: "/media/reels/sofa-book.mp4",
    poster: "/images/reels/sofa-book.jpg",
    ratio: "16 / 9",
    alt: "A boy reading on a sofa in window light, books and a tablet on the table in front.",
  },
  {
    id: "tablet",
    category: "portraits",
    video: "/media/reels/tablet.mp4",
    poster: "/images/reels/tablet.jpg",
    ratio: "1280 / 788",
    alt: "A boy at a wooden table using a tablet, a bright living room behind him.",
    hasAudio: true,
  },
  {
    id: "floor-book",
    category: "portraits",
    video: "/media/reels/floor-book.mp4",
    poster: "/images/reels/floor-book.jpg",
    ratio: "16 / 9",
    alt: "A boy lying on a wooden floor with a book over his face, toys and blankets around him.",
  },
  {
    id: "sofa-read",
    category: "portraits",
    video: "/media/reels/sofa-read.mp4",
    poster: "/images/reels/sofa-read.jpg",
    ratio: "16 / 9",
    alt: "A close view of a boy on a sofa, looking down at a book in warm light.",
  },
  {
    id: "gym-light",
    category: "portraits",
    video: "/media/reels/gym-light.mp4",
    poster: "/images/reels/gym-light.jpg",
    ratio: "16 / 9",
    alt: "A close portrait of a boy in a gym, window light behind him.",
  },
  {
    id: "yacht",
    category: "films",
    video: "/media/reels/yacht.mp4",
    poster: "/images/reels/yacht.jpg",
    ratio: "9 / 16",
    alt: "A white motor yacht crossing sunlit water, a suspension bridge and hills behind.",
    hasAudio: true,
  },
  {
    id: "deck",
    category: "films",
    video: "/media/reels/deck.mp4",
    poster: "/images/reels/deck.jpg",
    ratio: "9 / 16",
    alt: "A man in a navy jacket offering a glass of water across a table on a boat, a bridge and hills behind.",
    hasAudio: true,
  },
]

export const filters = [
  { value: "all", label: "All" },
  { value: "films", label: "Films" },
  { value: "images", label: "Images" },
  { value: "portraits", label: "Portraits" },
] as const

export type FilterValue = (typeof filters)[number]["value"]
