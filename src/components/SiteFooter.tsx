import { disclosures } from "../data/content"
import { studio } from "../data/studio"

function SocialIcon({ label }: { label: string }) {
  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
      </svg>
    )
  }
  if (label === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M6.2 9.4H3.6V20h2.6V9.4zm.2-3a1.55 1.55 0 1 1-3.1 0 1.55 1.55 0 0 1 3.1 0zM20.4 20h-2.6v-5.4c0-1.55-.55-2.4-1.75-2.4-1.05 0-1.65.72-1.92 1.42-.1.24-.08.58-.08.92V20H11.5s.04-9.5 0-10.6h2.55v1.7c.4-.62 1.35-1.9 3.45-1.9 2.45 0 4.3 1.6 4.3 5.05V20z"
        />
      </svg>
    )
  }
  return null
}

/** One line. The navigation is not repeated here. */
export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="foot">
      <div className="shell">
        {/* The galleries are silent, so the accuracy notes live here. */}
        {disclosures.map((line) => (
          <p className="foot-note" key={line}>
            {line}
          </p>
        ))}
      </div>
      <div className="shell foot-row">
        <span>
          {studio.wordmark} — {year}
        </span>
        {studio.email && <a href={`mailto:${studio.email}`}>{studio.email}</a>}
        <span className="foot-socials">
          {studio.social.map((item) => (
            <a
              key={item.href}
              className="foot-social"
              href={item.href}
              rel="noreferrer noopener"
              target="_blank"
              aria-label={item.label}
            >
              <SocialIcon label={item.label} />
            </a>
          ))}
        </span>
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}
