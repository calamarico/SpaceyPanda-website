import { site } from "../data/data";
import { ui } from "../lib/icons";

export function About() {
  return (
    <section id="about" className="sp-section">
      <div className="sp-container sp-reveal">
        <div className="sp-section-head">
          <span className="sp-eyebrow">About</span>
          <h2 className="sp-h2">
            Melodic electronic, made{" "}
            <span className="sp-text-gradient">slowly and on purpose</span>.
          </h2>
        </div>
        <div className="sp-about-grid">
          <div className="sp-about-copy">
            {site.artist.bio.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <aside className="sp-stat-card">
            <div className="sp-stat-card-head">
              <span className="sp-eyebrow">Vitals</span>
              <span className="sp-caption">2026</span>
            </div>
            <div className="sp-stat-row">
              <span className="sp-stat-label">Based in</span>
              <span className="sp-stat-value">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <ui.Pin size={12} /> {site.stats.based_in}
                </span>
              </span>
            </div>
            <div className="sp-stat-row">
              <span className="sp-stat-label">Producing since</span>
              <span className="sp-stat-value">{site.stats.started}</span>
            </div>
            <div className="sp-stat-row">
              <span className="sp-stat-label">Catalogue</span>
              <span className="sp-stat-value sp-stat-value-big">{site.stats.releases}</span>
            </div>
            <div className="sp-stat-row">
              <span className="sp-stat-label">Genre</span>
              <span className="sp-stat-value">Melodic Electronic</span>
            </div>
            <div className="sp-stat-row">
              <span className="sp-stat-label">Currently working on</span>
              <span className="sp-stat-value">An LP, slowly</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
