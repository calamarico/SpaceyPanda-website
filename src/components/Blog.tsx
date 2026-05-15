import { useMemo } from "react";
import { site } from "../data/data";
import { ui } from "../lib/icons";

const NODES = [
  { x: 40, y: 60, r: 3.4 },
  { x: 75, y: 40, r: 2.4 },
  { x: 110, y: 75, r: 4.2 },
  { x: 90, y: 130, r: 2.8 },
  { x: 145, y: 150, r: 3.6 },
  { x: 165, y: 90, r: 2.2 },
  { x: 130, y: 55, r: 1.8 },
];

function Constellation() {
  const faintDots = useMemo(
    () =>
      Array.from({ length: 30 }, () => ({
        cx: Math.random() * 200,
        cy: Math.random() * 200,
        r: Math.random() * 0.6 + 0.2,
      })),
    [],
  );

  return (
    <svg viewBox="0 0 200 200" aria-hidden>
      <defs>
        <radialGradient id="blogDotGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f472d0" />
          <stop offset="100%" stopColor="#67e8f9" />
        </radialGradient>
        <linearGradient id="blogLineGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(244,114,208,0.6)" />
          <stop offset="100%" stopColor="rgba(103,232,249,0.4)" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#blogLineGrad)"
        strokeWidth="0.8"
        points="40,60 75,40 110,75 90,130 145,150 165,90 130,55 75,40"
      />
      <line x1="110" y1="75" x2="145" y2="150" stroke="url(#blogLineGrad)" strokeWidth="0.6" />
      <line x1="90" y1="130" x2="165" y2="90" stroke="url(#blogLineGrad)" strokeWidth="0.6" />
      {NODES.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={p.r * 3} fill="url(#blogDotGrad)" opacity="0.18" />
          <circle cx={p.x} cy={p.y} r={p.r} fill="url(#blogDotGrad)" />
        </g>
      ))}
      {faintDots.map((d, i) => (
        <circle key={`f${i}`} cx={d.cx} cy={d.cy} r={d.r} fill="rgba(246,245,255,0.5)" />
      ))}
    </svg>
  );
}

export function Blog() {
  return (
    <section id="blog" className="sp-section sp-blog">
      <div className="sp-container sp-reveal">
        <div className="sp-blog-feature">
          <div className="sp-blog-feature-inner">
            <div>
              <span className="sp-blog-feature-tag">
                <ui.Sparkle size={11} /> The Blog
              </span>
              <h2 className="sp-h2" style={{ marginBottom: 20 }}>
                Sounds &amp; <span className="sp-text-gradient">souls</span>.
              </h2>
              <p className="sp-body-lg" style={{ margin: "0 0 32px" }}>
                {site.blog.description}
              </p>
              <a
                className="sp-btn sp-btn-primary sp-btn-large"
                href={site.blog.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ui.ExternalLink size={14} /> Read on spaceypandamusic.com
              </a>
            </div>
            <div className="sp-blog-orbit">
              <Constellation />
            </div>
          </div>
        </div>

        <div className="sp-blog-posts">
          {site.blog.posts.map((p) => (
            <a
              key={p.title}
              className="sp-post"
              href={site.blog.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="sp-post-kind">{p.kind}</span>
              <h3 className="sp-post-title">{p.title}</h3>
              <p className="sp-post-excerpt">{p.excerpt}</p>
              <div className="sp-post-meta">
                <span>
                  {p.date} · {p.readTime}
                </span>
                <span className="sp-post-arrow">
                  <ui.Arrow size={14} />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
