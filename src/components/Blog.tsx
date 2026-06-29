import { useEffect, useState } from "react";
import { site } from "../data/data";
import type { BlogPost } from "../data/types";
import { fetchLatestPosts } from "../lib/wordpress";
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

// Decorative background stars — scattered once at module load so positions stay
// stable across renders (and never call an impure fn during render).
const FAINT_DOTS = Array.from({ length: 30 }, () => ({
  cx: Math.random() * 200,
  cy: Math.random() * 200,
  r: Math.random() * 0.6 + 0.2,
}));

function Constellation() {
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
      {FAINT_DOTS.map((d, i) => (
        <circle key={`f${i}`} cx={d.cx} cy={d.cy} r={d.r} fill="rgba(246,245,255,0.5)" />
      ))}
    </svg>
  );
}

// ⚠️ PROVISIONAL blog cover treatment. The original 4:3 crop was flagged as too
// large in the pilot review. This renders as a short banner whose ratio is the
// CSS var `--sp-post-cover-ratio` (see index.css). To restyle, change that var,
// or swap <PostCover> for a small square thumbnail / image-left row. Not final.
const FALLBACK_COVERS = ["sp-cover-3", "sp-cover-6", "sp-cover-1"] as const;

function PostCover({ post, index }: { post: BlogPost; index: number }) {
  if (post.image) {
    return (
      <div className="sp-post-cover">
        <img src={post.image} alt="" loading="lazy" decoding="async" />
      </div>
    );
  }
  // No featured image → cosmic gradient placeholder.
  const cover = FALLBACK_COVERS[index % FALLBACK_COVERS.length];
  return (
    <div className={`sp-post-cover sp-post-cover--fallback ${cover}`} aria-hidden>
      <span className="sp-post-cover-stars" />
    </div>
  );
}

export function Blog() {
  // Start from the static fallback, then swap in the live WordPress feed.
  // On any fetch error, keep the fallback silently.
  const [posts, setPosts] = useState<BlogPost[]>(site.blog.posts);

  useEffect(() => {
    const ctrl = new AbortController();
    fetchLatestPosts(ctrl.signal)
      .then((live) => {
        if (live.length > 0) setPosts(live);
      })
      .catch(() => {
        /* network/HTTP/abort — keep the static fallback */
      });
    return () => ctrl.abort();
  }, []);

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
          {posts.map((p, i) => (
            <a
              key={p.url || p.title}
              className="sp-post"
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <PostCover post={p} index={i} />
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
