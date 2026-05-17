import type { CSSProperties } from "react";
import { site } from "../data/data";
import { platformIcons } from "../lib/icons";

export function Streaming() {
  return (
    <section id="listen" className="sp-section">
      <div className="sp-container sp-reveal">
        <div className="sp-section-head">
          <span className="sp-eyebrow">Everywhere</span>
          <h2 className="sp-h2">
            Listen wherever <span className="sp-text-gradient">you usually do</span>.
          </h2>
          <p className="sp-body-lg" style={{ margin: 0, maxWidth: 600 }}>
            All platforms, one set of links. Save the album, follow the artist, or download from
            Bandcamp — your call.
          </p>
        </div>
        <div className="sp-stream-grid">
          {site.streaming.map((s) => {
            const Icon = platformIcons[s.icon];
            const styleVars = { "--platform-color": s.color } as CSSProperties;
            return (
              <a
                key={s.name}
                className="sp-stream-card"
                style={styleVars}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="sp-stream-icon">
                  <Icon size={22} />
                </div>
                <div className="sp-stream-meta">
                  <div className="sp-stream-name">{s.name}</div>
                  <div className="sp-stream-handle">{s.handle}</div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
