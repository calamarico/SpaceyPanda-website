/**
 * SSG entrypoint. Built separately (`vite build --ssr`) and executed once at the
 * end of the build by scripts/prerender.ts, whose output is baked into
 * dist/index.html. Never shipped to the browser.
 *
 * Everything under <App /> must render identically here and on the client, or
 * hydration will throw the markup away. Three places needed care for that: the
 * seeded starfield in Blog.tsx, the ?view= param in Releases.tsx, and the blog
 * feed — fetched here and replayed to the client via `window.__SP_BLOG__`.
 */
import { renderToString } from "react-dom/server";
import App from "./App";
import { site } from "./data/data";
import type { BlogPost } from "./data/types";
import { BLOG_SEED_KEY, setBlogSeed } from "./lib/blogSeed";
import { structuredDataJson } from "./lib/structuredData";
import { fetchLatestPosts } from "./lib/wordpress";

export interface RenderResult {
  html: string;
  jsonLd: string;
  /** `<script>` payload seeding the client with the same posts we rendered. */
  blogSeedScript: string;
  /** Whether the live feed answered, for the build log. */
  liveBlog: boolean;
}

/** The build must never fail because a third-party blog was slow or down. */
async function latestPostsOrFallback(): Promise<{
  posts: BlogPost[];
  live: boolean;
}> {
  try {
    const posts = await fetchLatestPosts(AbortSignal.timeout(10_000));
    if (posts.length > 0) return { posts, live: true };
  } catch {
    /* network/HTTP/timeout — fall through to the static snapshot */
  }
  return { posts: site.blog.posts, live: false };
}

export async function render(): Promise<RenderResult> {
  const { posts, live } = await latestPostsOrFallback();
  setBlogSeed(posts);

  // `<` escaped so the payload can never terminate the surrounding <script>.
  const seed = JSON.stringify(posts).replace(/</g, "\\u003c");

  return {
    html: renderToString(<App />),
    jsonLd: structuredDataJson(),
    blogSeedScript: `<script>window.${BLOG_SEED_KEY}=${seed}</script>`,
    liveBlog: live,
  };
}
