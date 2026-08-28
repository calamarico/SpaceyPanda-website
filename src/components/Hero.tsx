import { useMemo } from "react";
import { site } from "../data/data";
import { latestRelease, releaseKindWord } from "../lib/catalog";
import { ui } from "../lib/icons";

export function Hero() {
  // Promo pill is driven by the latest Spotify release, not a hardcoded string.
  const latest = latestRelease();
  const pillText = latest
    ? `New ${releaseKindWord(latest)} · ${latest.name} · out now`
    : "New music · out now";

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
        {/* Sharp copy — masked to reveal ONLY the right-hand colour burst. */}
        <img
          className="sp-portrait-base"
          src="/spacey-portrait.webp"
          srcSet="/spacey-portrait-768.webp 768w, /spacey-portrait.webp 1440w"
          sizes="100vw"
          width={1440}
          height={1603}
          alt=""
          decoding="async"
        />
        {/* Heavily blurred + scaled copy — masked to the left/face region so the
            profile dissolves into an abstract colour smear (face never reads).
            It is blurred 34px, so the small source is always enough. */}
        <img
          className="sp-portrait-soft"
          src="/spacey-portrait-768.webp"
          width={768}
          height={855}
          alt=""
          decoding="async"
        />
        {/* Additive bloom over the old face position. */}
        <div className="sp-portrait-bloom" />
      </div>
      <div className="sp-portrait-vignette" aria-hidden />
      <div className="sp-hero-inner">
        <span className="sp-hero-pill">
          <span className="sp-dot" aria-hidden />
          {pillText}
        </span>

        <h1 className="sp-logo-wrap">
          <span className="sp-logo-halo" aria-hidden />
          <span className="sp-logo-ring" aria-hidden>
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
          </span>
          <img
            src="/spacey-logo.webp"
            srcSet="/spacey-logo-480.webp 480w, /spacey-logo.webp 960w"
            sizes="(max-width: 880px) 50vw, 460px"
            alt="Spacey Panda"
            width={960}
            height={960}
            fetchPriority="high"
            decoding="async"
          />
          <span className="sp-visually-hidden">
            Spacey Panda — melodic electronic producer
          </span>
        </h1>

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
          <a
            className="sp-btn sp-btn-primary sp-btn-large"
            href={site.streaming.find((s) => s.icon === "spotify")?.url}
            target="_blank"
            rel="noopener noreferrer"
          >
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
