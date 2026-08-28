/**
 * The posts <Blog /> shows on first paint.
 *
 * The build fetches the live WordPress feed and prerenders those posts, so the
 * indexable HTML carries the current articles instead of the stale snapshot in
 * data.ts. The same list is serialised into the page as `window.__SP_BLOG__`, so
 * the browser's first render matches the server's exactly — otherwise hydration
 * would throw the prerendered markup away.
 *
 * Fallback order: SSR-injected → HTML-embedded → the static list in data.ts.
 */
import { site } from "../data/data";
import type { BlogPost } from "../data/types";

export const BLOG_SEED_KEY = "__SP_BLOG__";

let ssrSeed: BlogPost[] | null = null;

/** Called by entry-server.tsx before rendering. Build-time only. */
export function setBlogSeed(posts: BlogPost[]): void {
  ssrSeed = posts;
}

export function blogSeed(): BlogPost[] {
  if (ssrSeed) return ssrSeed;

  if (typeof window !== "undefined") {
    const embedded = (window as unknown as Record<string, unknown>)[BLOG_SEED_KEY];
    if (Array.isArray(embedded) && embedded.length > 0) {
      return embedded as BlogPost[];
    }
  }

  return site.blog.posts;
}
