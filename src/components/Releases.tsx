import { site } from "../data/data";
import { ui } from "../lib/icons";

export function Releases() {
  return (
    <section id="releases" className="sp-section">
      <div className="sp-container sp-reveal">
        <div className="sp-releases-head">
          <div className="sp-section-head" style={{ marginBottom: 0 }}>
            <span className="sp-eyebrow">Discography</span>
            <h2 className="sp-h2">
              Latest <span className="sp-text-gradient">releases</span>.
            </h2>
            <p className="sp-body-lg" style={{ maxWidth: 520, margin: 0 }}>
              The three most recent. Full catalogue lives on Spotify and Bandcamp.
            </p>
          </div>
          <a className="sp-discog-link" href="#listen">
            Full catalogue <ui.Arrow size={14} />
          </a>
        </div>

        <div className="sp-releases-grid">
          {site.releases.map((r) => (
            <article key={r.title} className="sp-release">
              <div className={`sp-release-art ${r.cover}`}>
                <div className="sp-cover-stars" aria-hidden />
                <div className="sp-release-art-inner">{r.title}</div>
                <button type="button" className="sp-release-play" aria-label="Play preview">
                  <ui.Play size={14} />
                </button>
              </div>
              <div className="sp-release-meta">
                <div className="sp-release-kind">{r.kind}</div>
                <h3 className="sp-release-title">{r.title}</h3>
                <div className="sp-release-date">{r.date}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
