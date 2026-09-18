/**
 * Per-page <head> and JSON-LD for the release pages.
 *
 * The prerender swaps the PAGE-META block of index.html for what `releaseHead`
 * returns, so every release page gets its own title, description, canonical and
 * social card instead of inheriting the home page's.
 */
import { releases, type Release } from "../data/catalog";
import { formatDay, isAppearsOn, otherArtists, ownReleases } from "./catalog";
import {
  ARTIST_ID,
  SITE_URL,
  artistNode,
  releaseId,
  releaseNode,
  releaseUrl,
  websiteNode,
} from "./structuredData";
import { RELEASES_BASE } from "./releaseUrl";

/** Escape for use inside a double-quoted HTML attribute. */
function attr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Noun for the release, as prose: "single", "4-track EP", "album". */
export function formatNoun(release: Release): string {
  switch (release.type) {
    case "EP":
      return `${release.trackCount}-track EP`;
    case "ALBUM":
      return `${release.trackCount}-track album`;
    case "COMPILATION":
      return "compilation";
    default:
      return "single";
  }
}

export function releaseTitle(release: Release): string {
  return `${release.name} — Spacey Panda`;
}

/**
 * One sentence of genuinely page-specific copy. Google needs a reason to treat
 * 57 pages as 57 documents rather than as one template repeated.
 */
export function releaseDescription(release: Release): string {
  const others = otherArtists(release.artists);
  const date = formatDay(release);

  if (isAppearsOn(release)) {
    const by = others.length > 0 ? ` by ${others.join(", ")}` : "";
    return `Spacey Panda appears on ${release.name}${by}, released ${date}. Listen on Spotify and explore the full catalogue of IDM, ambient and experimental electronic releases.`;
  }

  const withWhom = others.length > 0 ? ` with ${others.join(", ")}` : "";
  return `${release.name} is a ${formatNoun(release)} by Spacey Panda${withWhom}, released ${date}. Listen on Spotify, Apple Music, Bandcamp and more.`;
}

/** The <head> block that replaces PAGE-META for this release. */
export function releaseHead(release: Release): string {
  const url = releaseUrl(release);
  const title = attr(releaseTitle(release));
  const description = attr(releaseDescription(release));
  const image = attr(release.coverArt);
  const imageAlt = attr(`${release.name} — cover art`);

  return `<title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${url}" />
    <meta name="author" content="Spacey Panda" />
    <meta
      name="robots"
      content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    />

    <meta property="og:type" content="music.album" />
    <meta property="og:site_name" content="Spacey Panda" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="640" />
    <meta property="og:image:height" content="640" />
    <meta property="og:image:alt" content="${imageAlt}" />

    <!-- Square cover art: summary keeps it uncropped, where a large card would
         slice the top and bottom off the artwork. -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${imageAlt}" />`;
}

/** JSON-LD for a release page: the release itself, the artist, and a trail. */
export function releaseStructuredDataJson(release: Release): string {
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Spacey Panda",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Releases",
        item: `${SITE_URL}${RELEASES_BASE}/`,
      },
      { "@type": "ListItem", position: 3, name: release.name },
    ],
  };

  const webpage = {
    "@type": "WebPage",
    "@id": `${releaseUrl(release)}#webpage`,
    url: releaseUrl(release),
    name: releaseTitle(release),
    description: releaseDescription(release),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": releaseId(release) },
    primaryImageOfPage: release.coverArt,
    inLanguage: "en",
    breadcrumb,
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      releaseNode(release),
      // The artist node repeats on every release page on purpose: each page has
      // to stand on its own as a document, sameAs links and all. The full
      // discography is left out — this page is about one release.
      artistNode({ withAlbums: false }),
      websiteNode(),
      webpage,
    ],
  };

  return JSON.stringify(graph).replace(/</g, "\\u003c");
}

// ── /releases/ index ───────────────────────────────────────────────────────

const INDEX_URL = `${SITE_URL}${RELEASES_BASE}/`;
const INDEX_TITLE = "All releases — Spacey Panda";
const INDEX_DESCRIPTION = `The complete Spacey Panda discography: ${ownReleases.length} releases plus ${releases.length - ownReleases.length} featured appearances. IDM, ambient and experimental electronic music, synced live from Spotify.`;

export function releaseIndexHead(): string {
  const title = attr(INDEX_TITLE);
  const description = attr(INDEX_DESCRIPTION);

  return `<title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${INDEX_URL}" />
    <meta name="author" content="Spacey Panda" />
    <meta
      name="robots"
      content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Spacey Panda" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:url" content="${INDEX_URL}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${SITE_URL}/og-image.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Spacey Panda — electronic producer" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${SITE_URL}/og-image.jpg" />`;
}

export function releaseIndexStructuredDataJson(): string {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${INDEX_URL}#webpage`,
        url: INDEX_URL,
        name: INDEX_TITLE,
        description: INDEX_DESCRIPTION,
        isPartOf: { "@id": `${SITE_URL}/#website` },
        about: { "@id": ARTIST_ID },
        inLanguage: "en",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Spacey Panda",
              item: `${SITE_URL}/`,
            },
            { "@type": "ListItem", position: 2, name: "Releases" },
          ],
        },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: releases.length,
          itemListElement: releases.map((release, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: releaseUrl(release),
            name: release.name,
          })),
        },
      },
      artistNode(),
      websiteNode(),
    ],
  };

  return JSON.stringify(graph).replace(/</g, "\\u003c");
}

export { ARTIST_ID };
