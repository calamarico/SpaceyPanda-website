/**
 * SSG entrypoint. Built separately (`vite build --ssr`) and executed once at the
 * end of the build by scripts/prerender.ts, whose output is baked into dist/.
 * Never shipped to the browser.
 *
 * It renders three kinds of page:
 *   /                   the home page
 *   /releases/          the catalogue index
 *   /releases/<slug>/   one page per release
 *
 * Everything under these components must render identically here and on the
 * client, or hydration will throw the markup away. Three places needed care for
 * that: the seeded starfield in Blog.tsx, the ?view= param in Releases.tsx, and
 * the blog feed — fetched here and replayed to the client via `window.__SP_BLOG__`.
 */
import { renderToString } from "react-dom/server";
import App from "./App";
import { ReleaseIndexPage } from "./components/ReleaseIndexPage";
import { ReleasePage } from "./components/ReleasePage";
import type { Release } from "./data/catalog";
import { site } from "./data/data";
import type { BlogPost } from "./data/types";
import { BLOG_SEED_KEY, setBlogSeed } from "./lib/blogSeed";
import {
  releaseHead,
  releaseIndexHead,
  releaseIndexStructuredDataJson,
  releaseStructuredDataJson,
} from "./lib/releaseMeta";
import { allReleasePages } from "./lib/releaseUrl";
import { structuredDataJson } from "./lib/structuredData";
import { fetchLatestPosts } from "./lib/wordpress";

export interface PageResult {
  /** Output path relative to dist/, e.g. "releases/slow-gravity-zone/index.html". */
  outPath: string;
  /** Canonical URL path, for the sitemap. */
  urlPath: string;
  html: string;
  jsonLd: string;
  /** Replacement for the PAGE-META block; undefined keeps the home page's. */
  head?: string;
  /** Only the home page renders <Blog />. */
  needsBlogSeed?: boolean;
  /** <lastmod> for the sitemap; defaults to the build date. */
  lastmod?: string;
}

export interface RenderResult {
  pages: PageResult[];
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

function renderRelease(release: Release, slug: string): PageResult {
  return {
    outPath: `releases/${slug}/index.html`,
    urlPath: `/releases/${slug}/`,
    html: renderToString(<ReleasePage release={release} />),
    jsonLd: releaseStructuredDataJson(release),
    head: releaseHead(release),
    // The page is about the release, so that is the date that describes it —
    // not whenever the build last happened to run.
    lastmod: release.date.slice(0, 10),
  };
}

export async function render(): Promise<RenderResult> {
  const { posts, live } = await latestPostsOrFallback();
  setBlogSeed(posts);

  // `<` escaped so the payload can never terminate the surrounding <script>.
  const seed = JSON.stringify(posts).replace(/</g, "\\u003c");

  const pages: PageResult[] = [
    {
      outPath: "index.html",
      urlPath: "/",
      html: renderToString(<App />),
      jsonLd: structuredDataJson(),
      needsBlogSeed: true,
    },
    {
      outPath: "releases/index.html",
      urlPath: "/releases/",
      html: renderToString(<ReleaseIndexPage />),
      jsonLd: releaseIndexStructuredDataJson(),
      head: releaseIndexHead(),
    },
    ...allReleasePages().map(({ release, slug }) => renderRelease(release, slug)),
  ];

  return {
    pages,
    blogSeedScript: `<script>window.${BLOG_SEED_KEY}=${seed}</script>`,
    liveBlog: live,
  };
}
