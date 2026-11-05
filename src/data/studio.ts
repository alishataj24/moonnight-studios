/**
 * The studio name. Change `wordmark` here and it updates the navigation,
 * the mobile bar and the footer; `index.html` carries it for the
 * document title and the Open Graph tags. Nothing else hard-codes it.
 *
 * Leave `email`, `whatsapp` and the social handles empty until the
 * addresses are real. Empty values are not rendered anywhere.
 *
 * `whatsapp` is digits only, with the country code and no plus:
 * 9198… for an Indian mobile. The contact form opens a chat to this
 * number with the enquiry already written.
 */
export const studio = {
  wordmark: "Moonnight Studios",
  siteUrl: (import.meta.env.VITE_SITE_URL ?? "").replace(/\/$/, ""),
  email: "",
  whatsapp: "919019863943",
  social: [
    { label: "Instagram", href: "https://www.instagram.com/moonnight_studios/" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/moonnightstudios/" },
  ],
} as const

/** Nav targets. Every one must exist in the DOM — a nav item pointing
 *  at a section that no longer exists is a dead link, not a label. */
/** The rail. Every id must exist in the DOM, or a nav item is a dead
 *  link rather than a label. `world` items open an overlay instead of
 *  scrolling, which is why they carry one. */
export const sections = [
  { id: "work", label: "Work", world: null },
  { id: "work", label: "Images", world: "images" },
  { id: "work", label: "Films", world: "films" },
  { id: "resorts", label: "For Resorts", world: null },
  { id: "about", label: "About", world: null },
  { id: "contact", label: "Contact", world: null },
] as const
