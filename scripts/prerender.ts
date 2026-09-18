/**
 * Static-site generation pass. Runs last in `npm run build`, after the client
 * bundle and the SSR bundle have both been built.
 *
 * It takes dist/index.html as a template and writes one static document per
 * page: the home page, /releases/ and a page for every release. For each one it
 *   1. renders the React tree into #root, so crawlers that do not execute
 *      JavaScript (Bing, GPTBot, ClaudeBot, PerplexityBot, and every link-preview
 *      scraper) see the real content;
 *   2. swaps the PAGE-META block for that page's title/description/canonical/OG;
 *   3. inlines the schema.org graph for that page.
 * Finally it writes a sitemap covering every page.
 *
 * The stylesheet stays a shared, hashed, immutably-cached file: with 59 pages
 * and links between them, one cached request beats inlining 54 kB into each.
 *
 * Each page still hydrates into the same interactive React app on the client.
 */
import { readFile, writeFile, mkdir, rm, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SSR_BUNDLE = path.join(ROOT, "dist-ssr", "entry-server.js");
const SITE_URL = "https://spaceypanda.com";

const META_START = "<!-- PAGE-META:start -->";
const META_END = "<!-- PAGE-META:end -->";
const ROOT_TAG = '<div id="root"></div>';

interface PageResult {
  outPath: string;
  urlPath: string;
  html: string;
  jsonLd: string;
  head?: string;
  /** Only the home page renders <Blog />, so only it needs the seeded posts. */
  needsBlogSeed?: boolean;
  /** Date driving this URL's <lastmod> in the sitemap. */
  lastmod?: string;
}

async function exists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

/** Every URL a <link rel="preload"> tag refers to, href or srcset alike. */
function preloadUrls(tag: string): string[] {
  const urls: string[] = [];

  const href = /\bhref="([^"]+)"/i.exec(tag)?.[1];
  if (href) urls.push(href);

  // React emits imageSrcSet with no href at all, so matching on href alone
  // silently lets a duplicate of the same image through.
  const srcSet = /\bimagesrcset="([^"]+)"/i.exec(tag)?.[1];
  if (srcSet) {
    for (const candidate of srcSet.split(",")) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url) urls.push(url);
    }
  }

  return urls;
}

/**
 * Split the leading <link> tags off the rendered markup. Any pointing at a URL
 * the document head already preloads is dropped rather than duplicated.
 */
function hoistPreloads(
  html: string,
  doc: string,
): { body: string; hoisted: string[] } {
  const hoisted: string[] = [];
  let body = html;

  const headUrls = new Set(
    (doc.slice(0, doc.indexOf("</head>")).match(/<link\b[^>]*>/gi) ?? [])
      .filter((tag) => /rel="preload"/i.test(tag))
      .flatMap(preloadUrls),
  );

  const leadingLink = /^<link\b[^>]*\/?>/;
  let match: RegExpExecArray | null;
  while ((match = leadingLink.exec(body)) !== null) {
    const tag = match[0];
    const urls = preloadUrls(tag);
    if (urls.length === 0 || !urls.some((u) => headUrls.has(u))) hoisted.push(tag);
    body = body.slice(tag.length);
  }

  return { body, hoisted };
}

/** Build one page's final HTML from the shared template. */
function buildPage(
  template: string,
  page: PageResult,
  blogSeedScript: string,
): string {
  let doc = template;

  // Per-page <head>. The home page keeps whatever index.html already declares.
  if (page.head) {
    const start = doc.indexOf(META_START);
    const end = doc.indexOf(META_END);
    if (start < 0 || end < 0) {
      throw new Error("PAGE-META markers missing from index.html");
    }
    doc = doc.slice(0, start + META_START.length) + "\n    " + page.head + "\n    " + doc.slice(end);
  }

  const { body, hoisted } = hoistPreloads(page.html, doc);
  doc = doc.replace(ROOT_TAG, `<div id="root">${body}</div>`);

  const ldTag = `<script type="application/ld+json">${page.jsonLd}</script>`;
  const headAdditions = [
    ...hoisted,
    ...(page.needsBlogSeed ? [blogSeedScript] : []),
    ldTag,
  ]
    .map((t) => `  ${t}`)
    .join("\n");
  return doc.replace("</head>", `${headAdditions}\n  </head>`);
}

async function main(): Promise<void> {
  if (!(await exists(SSR_BUNDLE))) {
    throw new Error(
      `SSR bundle not found at ${SSR_BUNDLE}. Run \`vite build --ssr src/entry-server.tsx --outDir dist-ssr\` first.`,
    );
  }

  const { render } = (await import(SSR_BUNDLE)) as {
    render: () => Promise<{
      pages: PageResult[];
      blogSeedScript: string;
      liveBlog: boolean;
    }>;
  };
  const { pages, blogSeedScript, liveBlog } = await render();

  const indexPath = path.join(DIST, "index.html");
  const template = await readFile(indexPath, "utf8");
  if (!template.includes(ROOT_TAG)) {
    throw new Error(`Could not find ${ROOT_TAG} in dist/index.html`);
  }

  let bytes = 0;
  for (const page of pages) {
    const doc = buildPage(template, page, blogSeedScript);
    const outPath = path.join(DIST, page.outPath);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, doc, "utf8");
    bytes += Buffer.byteLength(doc);
  }

  // ── sitemap.xml ────────────────────────────────────────────────────────────
  const buildDate = new Date().toISOString().slice(0, 10);
  const urls = pages
    .map((page) => {
      const isHome = page.urlPath === "/";
      const lastmod = page.lastmod ?? buildDate;
      const image = isHome
        ? `
    <image:image>
      <image:loc>${SITE_URL}/og-image.jpg</image:loc>
      <image:title>Spacey Panda — IDM, Ambient &amp; Experimental Electronic</image:title>
    </image:image>`
        : "";
      return `  <url>
    <loc>${SITE_URL}${page.urlPath}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${isHome ? "weekly" : "monthly"}</changefreq>
    <priority>${isHome ? "1.0" : page.urlPath === "/releases/" ? "0.8" : "0.6"}</priority>${image}
  </url>`;
    })
    .join("\n");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;
  await writeFile(path.join(DIST, "sitemap.xml"), sitemap, "utf8");

  // The SSR bundle is a build artefact; nothing should deploy it.
  await rm(path.join(ROOT, "dist-ssr"), { recursive: true, force: true });

  console.log(
    `prerender: ${pages.length} pages (${(bytes / 1024 / 1024).toFixed(2)} MB total) · ` +
      `blog ${liveBlog ? "live feed" : "STATIC FALLBACK (feed unreachable)"} · ` +
      `sitemap.xml with ${pages.length} URLs`,
  );
}

main().catch((err) => {
  console.error("prerender failed:", err);
  process.exit(1);
});
