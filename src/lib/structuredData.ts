/**
 * schema.org JSON-LD for the site, built from the same data the page renders.
 *
 * Emitted into <head> by the prerender step (scripts/prerender.ts), so it is in
 * the HTML the crawler receives — no JS execution required. Regenerating it from
 * `site` + `releases` means the graph can never drift from the visible content,
 * which is exactly what Google penalises.
 *
 * The graph describes: the artist (MusicGroup — the entity we want in the
 * Knowledge Panel), the site and the page, and every release in the catalogue.
 */
import { releases, type Release } from "../data/catalog";
import { site } from "../data/data";
import { isAppearsOn } from "./catalog";
import { releasePath } from "./releaseUrl";

export const SITE_URL = "https://spaceypanda.com";

export const ARTIST_ID = `${SITE_URL}/#artist`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const WEBPAGE_ID = `${SITE_URL}/#webpage`;

/** Absolute URL of a release's own page on this site. */
export const releaseUrl = (r: Release) => `${SITE_URL}${releasePath(r)}`;

/** Each release is identified by its page, not by a fragment on the home page. */
export const releaseId = (r: Release) => `${releaseUrl(r)}#release`;

/** ms → ISO-8601 duration ("PT4M32S"), the format schema.org expects. */
function isoDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `PT${m}M${s}S`;
}

/** Spotify dates can be year- or month-precision; schema.org accepts all three. */
function publishedDate(r: Release): string {
  if (r.datePrecision === "YEAR") return r.date.slice(0, 4);
  if (r.datePrecision === "MONTH") return r.date.slice(0, 7);
  return r.date;
}

function albumReleaseType(r: Release): string {
  switch (r.type) {
    case "EP":
      return "https://schema.org/EPRelease";
    case "ALBUM":
      return "https://schema.org/AlbumRelease";
    case "COMPILATION":
      return "https://schema.org/AlbumRelease";
    default:
      return "https://schema.org/SingleRelease";
  }
}

type JsonLdNode = Record<string, unknown>;

/** Collaborators are referenced by name + their Spotify profile, not by @id. */
function artistRef(name: string, spotifyUrl?: string): JsonLdNode {
  const node: JsonLdNode = { "@type": "MusicGroup", name };
  if (spotifyUrl) node.sameAs = spotifyUrl;
  return node;
}

function byArtistOf(r: Release): unknown {
  if (!isAppearsOn(r)) return { "@id": ARTIST_ID };
  const others = (r.artists ?? []).filter((a) => a.name !== "Spacey Panda");
  if (others.length === 0) return { "@id": ARTIST_ID };
  const refs = others.map((a) => artistRef(a.name, a.spotifyUrl));
  return refs.length === 1 ? refs[0] : refs;
}

export function releaseNode(r: Release): JsonLdNode {
  const node: JsonLdNode = {
    "@type": "MusicAlbum",
    "@id": releaseId(r),
    name: r.name,
    albumReleaseType: albumReleaseType(r),
    byArtist: byArtistOf(r),
    datePublished: publishedDate(r),
    numTracks: r.trackCount,
    image: r.coverArt,
    url: releaseUrl(r),
    sameAs: r.spotifyUrl,
  };

  // Spacey Panda is a credited performer on releases fronted by someone else.
  if (isAppearsOn(r)) node.contributor = { "@id": ARTIST_ID };

  // A single's tracklist just restates the album, so only multi-track releases
  // carry one. Keeps the payload honest and the HTML small.
  if (r.tracks && r.tracks.length > 1) {
    node.track = r.tracks.map((t) => ({
      "@type": "MusicRecording",
      name: t.name,
      position: t.trackNumber,
      duration: isoDuration(t.durationMs),
      url: t.spotifyUrl,
      byArtist: t.artists.map((a) =>
        a.name === "Spacey Panda"
          ? { "@id": ARTIST_ID }
          : artistRef(a.name, a.spotifyUrl),
      ),
      ...(t.isrc ? { isrcCode: t.isrc } : {}),
    }));
  }

  return node;
}

/**
 * `withAlbums` controls whether the full discography is listed. The home page and
 * the catalogue index want it; an individual release page only needs the entity
 * itself (name, genre, sameAs), and 47 extra @id references per page add up.
 */
export function artistNode({ withAlbums = true } = {}): JsonLdNode {
  const own = releases.filter((r) => !isAppearsOn(r));

  return {
    "@type": "MusicGroup",
    "@id": ARTIST_ID,
    name: site.artist.name,
    alternateName: "SpaceyPanda",
    url: `${SITE_URL}/`,
    mainEntityOfPage: { "@id": WEBPAGE_ID },
    description: site.artist.bio.join(" "),
    slogan: site.artist.tagline,
    genre: [
      "IDM",
      "Ambient",
      "Experimental Electronic",
      "Electronic",
      "Downtempo",
    ],
    foundingDate: site.stats.started,
    foundingLocation: { "@type": "Place", name: site.artist.location },
    address: { "@type": "PostalAddress", addressCountry: "CA" },
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og-image.jpg`,
      width: 1200,
      height: 630,
    },
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/spacey-logo.webp`,
      width: 960,
      height: 960,
    },
    // Entity reconciliation: this is how Google ties the site to the Spotify /
    // Apple Music / Beatport profiles it already knows about.
    sameAs: [
      ...site.streaming.map((s) => s.url),
      site.instagram.url,
      site.blog.url,
    ],
    ...(withAlbums
      ? { album: own.map((r) => ({ "@id": releaseId(r) })) }
      : {}),
  };
}

export function websiteNode(): JsonLdNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: "Spacey Panda",
    description: site.artist.tagline,
    inLanguage: "en",
    publisher: { "@id": ARTIST_ID },
  };
}

export function buildStructuredData(): JsonLdNode {
  const webpage: JsonLdNode = {
    "@type": "WebPage",
    "@id": WEBPAGE_ID,
    url: `${SITE_URL}/`,
    name: "Spacey Panda — IDM, Ambient & Experimental Electronic",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ARTIST_ID },
    primaryImageOfPage: { "@id": `${SITE_URL}/#logo` },
    inLanguage: "en",
  };

  return {
    "@context": "https://schema.org",
    "@graph": [artistNode(), websiteNode(), webpage, ...releases.map(releaseNode)],
  };
}

/** Serialised for inlining in a <script type="application/ld+json"> tag. */
export function structuredDataJson(): string {
  // `<` is escaped so the payload can never terminate the surrounding <script>.
  return JSON.stringify(buildStructuredData()).replace(/</g, "\\u003c");
}
