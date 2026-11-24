/**
 * Every word a visitor reads, in one file.
 *
 * Two rules hold this short.
 *
 * The headlines and the three section support lines are fixed copy and
 * are not to be rewritten. Everything else is as short as it can be and
 * still be true — because the thing that makes a studio site credible
 * is not more words about the work, it is fewer words and better work.
 *
 * Nothing here claims cheaper, faster or better, carries a number, or
 * names a client. If a line could not be checked by someone who asked,
 * it does not belong.
 */

export const hero = {
  /*
   * Two marks live in the headlines, and both belong with the words
   * rather than in a component:
   *   *asterisks*  the pivot — the one word the sentence turns on,
   *                set in the serif italic. One per headline, never two.
   *   |            a typeset line break, so the break is chosen by
   *                whoever wrote the line and not by the measure.
   */
  headline: "Make them|*feel* it.",
  support: "Films, visuals and sites for brands that sell experiences.",
  cta: "Explore our work",
}

export const resort = {
  headline: "Sell the *feeling*|of being there.",
  support:
    "Show guests the stay before they arrive. From cinematic property films to room, dining and experience visuals, create desire before the booking.",
  cta: "Create your resort film",
  // Said here, not only in the footer: this sequence is where a visitor
  // is most likely to assume they are looking at somewhere that exists.
  note: "Conceptual work. Not an existing property.",
}

/**
 * What AI-assisted production makes possible.
 *
 * One short line each, and no headline above them — the margin label
 * already names the act, so a headline would be the same sentence
 * twice. The third line is the only real claim here, and it is one a
 * client can check against their own experience of production.
 */

export const viewpoint = {
  /**
   * Three annotations, placed on a real frame. `x`/`y` are percentages
   * of the picture — they point at something actually in it, so if the
   * picture is ever swapped the marks have to be re-placed with it.
   *
   * The frame: a person at a glass wall, mist and low sun outside, a
   * chair and a small table in the room.
   */
  frame: "mist",
  marks: [
    {
      id: "direction",
      n: "01",
      at: { x: 27, y: 46 },
      term: "A person decides the frame",
      copy: "Where the camera stands, what the light does, when to cut. Those are judgements, and a person makes them.",
    },
    {
      id: "method",
      n: "02",
      at: { x: 62, y: 28 },
      term: "AI widens what gets tried",
      copy: "It is a production method. It means a direction can be explored properly instead of being argued about, and changed late without starting again.",
    },
    {
      id: "delivery",
      n: "03",
      at: { x: 79, y: 70 },
      term: "Every frame is chosen",
      copy: "Nothing ships because it came out of the machine. It is selected, graded, and delivered because it was the right frame.",
    },
  ],
  // Said once, where it helps, and no rate card.
  price: "Pricing is tailored to the brief, and the production cost is inside it.",
}

export const about = {
  headline: "We make brands look|worth *experiencing*.",
  support:
    "An independent creative production house making films, visuals and sites for ambitious brands.",
  poster: "/images/aranyaka/stills/stone-house.jpg",
  posterSmall: "/images/aranyaka/stills/stone-house-960.webp",
  alt: "A house of stone, plaster and timber held in the shade of mature trees at low sun.",
}

export const contact = {
  headline: "Let's make something|worth *watching*.",
  cta: "Start a project",
  poster: "/images/aranyaka/water.jpg",
  posterSmall: "/images/aranyaka/water-960.webp",
  alt: "A stone fountain in warm, low sunlight, water falling into a dark pool.",
}

/**
 * The one accuracy note. It lives in the footer because the galleries
 * and the resort sequence carry no text of their own, and it must not
 * be dropped just because there is nowhere in the pictures to put it.
 *
 * If any of this work was in fact commissioned, change this line —
 * do not relabel speculative work as commissioned.
 */
export const disclosures = [
  "Images and films are self-initiated concept work. No image shows a real property.",
  "Sites are commissioned websites and apps for the companies named.",
]
