import { disclosures } from "../data/content"
import { studio } from "../data/studio"

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
        {studio.social.map((item) => (
          <a key={item.href} href={item.href} rel="noreferrer noopener" target="_blank">
            {item.label}
          </a>
        ))}
        <a href="#top">Back to top ↑</a>
      </div>
    </footer>
  )
}
