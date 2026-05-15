import { useMemo } from "react";
import logoUrl from "../assets/spacey-logo.jpg";
import portraitUrl from "../assets/spacey-portrait.png";
import { site } from "../data/data";
import { ui } from "../lib/icons";

export function Hero() {
  const dots = useMemo(() => {
    const N = 64;
    return Array.from({ length: N }, (_, i) => {
      const angle = (i / N) * Math.PI * 2;
      const cx = 50 + 49 * Math.cos(angle);
      const cy = 50 + 49 * Math.sin(angle);
      const big = i % 8 === 0;
      return { cx, cy, r: big ? 0.45 : 0.22, big };
    });
  }, []);

  return (
    <section id="top" className="sp-hero" data-hero-mode="logo-aura">
      <div className="sp-portrait-layer" aria-hidden>
        <img src={portraitUrl} alt="" />
      </div>
      <div className="sp-portrait-vignette" aria-hidden />
      <div className="sp-hero-inner">
        <span className="sp-hero-pill">
          <span className="sp-dot" aria-hidden />
          New single · Northern Drift · out now
        </span>

        <div className="sp-logo-wrap">
          <div className="sp-logo-halo" aria-hidden />
          <div className="sp-logo-ring" aria-hidden>
            <svg viewBox="0 0 100 100">
              <defs>
                <radialGradient id="dotGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#67e8f9" />
                  <stop offset="100%" stopColor="#f472d0" />
                </radialGradient>
              </defs>
              {dots.map((d, i) => (
                <circle
                  key={i}
                  cx={d.cx}
                  cy={d.cy}
                  r={d.r}
                  fill={d.big ? "url(#dotGrad)" : "rgba(246,245,255,0.6)"}
                />
              ))}
            </svg>
          </div>
          <img src={logoUrl} alt="Spacey Panda" />
        </div>

        <h2 className="sp-hero-tag" style={{ margin: 0 }}>
          <ui.Headphones size={18} />
          <span>{site.artist.tagline}</span>
        </h2>

        <div className="sp-hero-meta">
          {site.hero_meta.map((m) => (
            <span key={m}>
              <span className="sp-meta-glyph" aria-hidden />
              {m}
            </span>
          ))}
        </div>

        <div className="sp-hero-ctas">
          <a className="sp-btn sp-btn-primary sp-btn-large" href="#listen">
            <ui.Spotify size={18} /> Listen on Spotify
          </a>
          <a
            className="sp-btn sp-btn-ghost sp-btn-large"
            href={site.blog.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ui.ExternalLink size={14} /> Read the blog
          </a>
        </div>
      </div>
    </section>
  );
}
