import { site } from "../data/data";
import { ui } from "../lib/icons";

export function Instagram() {
  return (
    <section id="instagram" className="sp-section">
      <div className="sp-container sp-reveal">
        <div className="sp-ig-head">
          <div className="sp-section-head" style={{ marginBottom: 0 }}>
            <span className="sp-eyebrow">Where I post most</span>
            <h2 className="sp-h2">
              The real-time feed lives on <span className="sp-text-gradient">Instagram</span>.
            </h2>
            <p className="sp-body-lg" style={{ margin: 0, maxWidth: 540 }}>
              Snippets from the studio, sets in motion, and the visual notes I make for tracks
              before they have names.
            </p>
          </div>
          <div className="sp-ig-stat">
            <div className="sp-ig-stat-num">{site.instagram.followers}</div>
            <div className="sp-ig-stat-label">
              followers · {site.instagram.handle}
            </div>
          </div>
        </div>

        <div className="sp-ig-grid">
          {site.instagram.tiles.map((t, i) => (
            <a
              key={`${t}-${i}`}
              className={`sp-ig-tile ${t}`}
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Instagram profile"
            >
              <div className="sp-ig-tile-stars" aria-hidden />
            </a>
          ))}
        </div>

        <div className="sp-ig-cta">
          <a
            className="sp-btn sp-btn-ghost sp-btn-large"
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ui.Instagram size={18} /> Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
