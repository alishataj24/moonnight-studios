/**
 * Commissioned product work — websites and apps.
 *
 * Unlike the film and image galleries, these plates name the product and
 * link to it. The lines describe what the product is, not what Moonnight
 * claims about the engagement. Do not invent metrics, awards or roles.
 */

export type SiteWork = {
  id: string
  name: string
  href: string
  /** Website, app, or both — only what is true of the live product. */
  kind: string
  /** One short line about the product itself. */
  line: string
  poster: string
  alt: string
}

export const sites: SiteWork[] = [
  {
    id: "spiked",
    name: "SpikedAI",
    href: "https://www.spiked.ai/",
    kind: "Website",
    line: "Digital colleagues that prepare for, join and follow sales conversations.",
    poster: "/images/sites/spiked.jpg",
    alt: "SpikedAI homepage: Digital Colleagues for knowledge professionals.",
  },
  {
    id: "saima",
    name: "Saima",
    href: "https://saima.ai/",
    kind: "Website & app",
    line: "Adaptive video speed and shared notes, so people watch at the pace they understand.",
    poster: "/images/sites/saima.jpg",
    alt: "Saima homepage: AI video speed controller.",
  },
  {
    id: "broadrange",
    name: "Broadrange AI",
    href: "https://www.broadrange.ai/",
    kind: "Website",
    line: "Agentic AI, digital twins and governance for teams putting intelligence to work.",
    poster: "/images/sites/broadrange.jpg",
    alt: "Broadrange AI homepage: Transform your business with intelligent AI.",
  },
  {
    id: "einsteini",
    name: "Einsteini",
    href: "https://www.einsteini.ai/",
    kind: "Website & app",
    line: "Context-aware replies, comments and posts that keep a professional voice.",
    poster: "/images/sites/einsteini.jpg",
    alt: "Einsteini homepage: Think faster. Build smarter. Engage superhuman.",
  },
  {
    id: "regdeed",
    name: "Regdeed",
    href: "https://www.regdeed.com/",
    kind: "Website & app",
    line: "Property documents, registration support and listings for buyers and owners.",
    poster: "/images/sites/regdeed.jpg",
    alt: "Regdeed homepage: Your property documents.",
  },
]
