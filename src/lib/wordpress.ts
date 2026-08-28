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

// The named entities WordPress actually emits. Numeric references (&#8217; and
// friends) are handled generically below.
const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: "\u00a0",
  hellip: "\u2026",
  mdash: "\u2014",
  ndash: "\u2013",
  lsquo: "\u2018",
  rsquo: "\u2019",
  ldquo: "\u201c",
  rdquo: "\u201d",
  laquo: "\u00ab",
  raquo: "\u00bb",
  eacute: "\u00e9",
  egrave: "\u00e8",
  agrave: "\u00e0",
  ccedil: "\u00e7",
  uuml: "\u00fc",
  ouml: "\u00f6",
  auml: "\u00e4",
  ntilde: "\u00f1",
  deg: "\u00b0",
  middot: "\u00b7",
  bull: "\u2022",
  copy: "\u00a9",
  trade: "\u2122",
  euro: "\u20ac",
  pound: "\u00a3",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (match, ref: string) => {
    if (ref.startsWith("#")) {
      const code =
        ref[1] === "x" || ref[1] === "X"
          ? Number.parseInt(ref.slice(2), 16)
          : Number.parseInt(ref.slice(1), 10);
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : match;
    }
    return NAMED_ENTITIES[ref.toLowerCase()] ?? match;
  });
}

/**
 * Strip tags and decode entities without touching the DOM.
 *
 * This runs twice for the same posts — once in Node during the prerender, once
 * in the browser when the live feed refreshes — and the two results have to be
 * identical or hydration would flag a mismatch.
 */
function htmlToText(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
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
