/**
 * Commissioned product work — websites and apps.
 *
 * Plates show the product mark, not a screenshot of the live site.
 * Lines describe what the product is, not what Moonnight claims about
 * the engagement. Do not invent metrics, awards or roles.
 */

export type SiteWork = {
  id: string
  name: string
  href: string
  /** Website, app, or both — only what is true of the live product. */
  kind: string
  /** One short line about the product itself. */
  line: string
  /** Brand mark on a dark field — not a page capture. */
  logo: string
  alt: string
}

export const sites: SiteWork[] = [
  {
    id: "spiked",
    name: "SpikedAI",
    href: "https://www.spiked.ai/",
    kind: "Website",
    line: "Digital colleagues that prepare for, join and follow sales conversations.",
    logo: "/images/sites/logos/spiked.svg",
    alt: "SpikedAI logo",
  },
  {
    id: "saima",
    name: "Saima",
    href: "https://saima.ai/",
    kind: "Website & app",
    line: "Adaptive video speed and shared notes, so people watch at the pace they understand.",
    logo: "/images/sites/logos/saima.png",
    alt: "Saima logo",
  },
  {
    id: "broadrange",
    name: "Broadrange AI",
    href: "https://www.broadrange.ai/",
    kind: "Website",
    line: "Agentic AI, digital twins and governance for teams putting intelligence to work.",
    logo: "/images/sites/logos/broadrange.jpg",
    alt: "Broadrange AI logo",
  },
  {
    id: "einsteini",
    name: "Einsteini",
    href: "https://www.einsteini.ai/",
    kind: "Website & app",
    line: "Context-aware replies, comments and posts that keep a professional voice.",
    logo: "/images/sites/logos/einsteini.png",
    alt: "Einsteini logo",
  },
  {
    id: "regdeed",
    name: "Regdeed",
    href: "https://www.regdeed.com/",
    kind: "Website & app",
    line: "Property documents, registration support and listings for buyers and owners.",
    logo: "/images/sites/logos/regdeed.png",
    alt: "Regdeed logo",
  },
]
