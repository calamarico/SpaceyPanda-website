/**
 * Canonical URLs for the per-release pages the build prerenders.
 *
 * Every release gets its own page at /releases/<slug>/. These are the URLs that
 * end up in the sitemap and (hopefully) in Google, so they must stay stable:
 * a slug that changes is a 404 for anyone who linked to it.
 *
 * Stability rule: when two releases slugify the same (the catalogue has
 * "C'est une symphonie" and "C'est une Symphonie"), the one released FIRST keeps
 * the clean slug and later ones get a short id suffix. Assigning by release date
 * rather than by array order means a brand-new release can never steal the URL
 * of an older one.
 */
import { releases, type Release } from "../data/catalog";

export const RELEASES_BASE = "/releases";

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics: Irrésistible → irresistible
    .toLowerCase()
    .replace(/['’`]/g, "") // C'est → cest, not c-est
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const slugById = new Map<string, string>();
const releaseBySlug = new Map<string, Release>();

{
  // Oldest first, id as the tie-breaker, so the mapping is deterministic and
  // identical on the server and in the browser.
  const oldestFirst = [...releases].sort(
    (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime() ||
      a.id.localeCompare(b.id),
  );

  for (const release of oldestFirst) {
    const base = slugify(release.name) || "release";
    const slug = releaseBySlug.has(base)
      ? `${base}-${release.id.slice(0, 6).toLowerCase()}`
      : base;
    slugById.set(release.id, slug);
    releaseBySlug.set(slug, release);
  }
}

export function releaseSlug(release: Release): string {
  return slugById.get(release.id) ?? slugify(release.name);
}

/** Path with a trailing slash — what Cloudflare Pages serves for a directory. */
export function releasePath(release: Release): string {
  return `${RELEASES_BASE}/${releaseSlug(release)}/`;
}

/** Resolve a release from a pathname, for the client to hydrate the right page. */
export function releaseFromPath(pathname: string): Release | undefined {
  const match = new RegExp(`^${RELEASES_BASE}/([^/]+)/?$`).exec(pathname);
  return match ? releaseBySlug.get(match[1]) : undefined;
}

/** Every release page the build should emit, in catalogue order. */
export function allReleasePages(): { release: Release; slug: string }[] {
  return releases.map((release) => ({ release, slug: releaseSlug(release) }));
}
