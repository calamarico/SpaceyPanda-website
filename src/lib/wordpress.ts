// Live blog feed — WordPress REST API.
// See design_handoff_spacey_panda/INTEGRATIONS.md for the field-mapping contract.
//
// NOTE: the handoff assumed the origin REST API (spaceypandamusic.com/wp-json)
// is public + CORS-open. It no longer is — the origin sits behind a Cloudflare
// "managed challenge" that 403s any cross-origin / non-browser request (returns
// the "Just a moment…" HTML, no CORS headers). So we read the same posts through
// the WordPress.com public mirror, which is CORS-open (`Access-Control-Allow-
// Origin: *`), serves identical `wp/v2`-shaped JSON, and returns images from the
// i0.wp.com CDN (also outside Cloudflare). If the artist later allowlists
// `/wp-json/wp/v2/*` in Cloudflare, this can point back at the origin unchanged.
import type { BlogPost } from "../data/types";

const WP_ENDPOINT =
  "https://public-api.wordpress.com/wp/v2/sites/spaceypandamusic.com/posts?_embed&per_page=3";

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

/** Minimal shape of the WordPress post fields we read (with `_embed`). */
interface WpMediaSize {
  source_url: string;
}
interface WpPost {
  link: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: {
    "wp:term"?: Array<Array<{ name: string }>>;
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      media_details?: { sizes?: Record<string, WpMediaSize | undefined> };
    }>;
  };
}

/** Decode HTML entities and strip tags by round-tripping through a DOM node. */
function htmlToText(html: string): string {
  if (typeof document === "undefined") return html;
  const el = document.createElement("div");
  el.innerHTML = html;
  return (el.textContent || "").replace(/\s+/g, " ").trim();
}

/** Plain-text excerpt: strip tags/entities, drop the WP "read more" tail, clamp. */
function cleanExcerpt(html: string, max = 180): string {
  let text = htmlToText(html)
    .replace(/\s*\[(?:…|\.\.\.|&hellip;)\]\s*$/i, "")
    .replace(/\s*\[?\s*read more\s*\.*\s*…?\s*\]?\s*$/i, "")
    .trim();
  if (text.length > max) {
    text = text.slice(0, max).replace(/\s+\S*$/, "").trim() + "…";
  }
  return text;
}

/** WordPress doesn't expose read time over REST — derive it at ~200 wpm. */
function readTime(contentHtml: string): string {
  const words = htmlToText(contentHtml).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
}

function category(post: WpPost): string {
  return post._embedded?.["wp:term"]?.[0]?.[0]?.name ?? "Blog";
}

/** Featured image, preferring a mid-size crop. May be absent → null. */
function featuredImage(post: WpPost): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;
  const sizes = media.media_details?.sizes;
  return (
    sizes?.medium?.source_url ??
    sizes?.["morenews-medium"]?.source_url ??
    media.source_url ??
    null
  );
}

/** Fetch + map the latest posts. Throws on network/HTTP error (caller falls back). */
export async function fetchLatestPosts(signal?: AbortSignal): Promise<BlogPost[]> {
  const res = await fetch(WP_ENDPOINT, { signal });
  if (!res.ok) throw new Error(`WordPress responded ${res.status}`);
  const raw = (await res.json()) as WpPost[];
  return raw.map((post) => ({
    kind: category(post),
    title: htmlToText(post.title.rendered),
    excerpt: cleanExcerpt(post.excerpt.rendered),
    date: dateFmt.format(new Date(post.date)),
    readTime: readTime(post.content.rendered),
    url: post.link,
    image: featuredImage(post),
  }));
}
