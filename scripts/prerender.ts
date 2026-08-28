/**
 * Static-site generation pass. Runs last in `npm run build`, after the client
 * bundle and the SSR bundle have both been built.
 *
 * What it does to dist/index.html:
 *   1. renders <App /> to HTML and puts it inside #root, so crawlers that do not
 *      execute JavaScript (Bing, GPTBot, ClaudeBot, PerplexityBot, and every
 *      link-preview scraper) see the real content;
 *   2. inlines the schema.org graph built from the live catalogue;
 *   3. writes dist/sitemap.xml.
 *
 * The page still hydrates into the same interactive React app on the client.
 */
import { readFile, writeFile, rm, access } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const SSR_BUNDLE = path.join(ROOT, "dist-ssr", "entry-server.js");
const SITE_URL = "https://spaceypanda.com";

async function exists(p: string): Promise<boolean> {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Split the leading <link> tags off the rendered markup. Any whose href is
 * already preloaded in the document head is dropped rather than duplicated.
 */
function hoistPreloads(
  html: string,
  doc: string,
): { body: string; hoisted: string[] } {
  const hoisted: string[] = [];
  let body = html;

  const leadingLink = /^<link\b[^>]*\/?>/;
  let match: RegExpExecArray | null;
  while ((match = leadingLink.exec(body)) !== null) {
    const tag = match[0];
    const href = /\bhref="([^"]+)"/.exec(tag)?.[1];
    if (!href || !doc.includes(`href="${href}"`)) hoisted.push(tag);
    body = body.slice(tag.length);
  }

  return { body, hoisted };
}

/** Replace <link rel="stylesheet" href="/assets/x.css"> with the CSS itself. */
async function inlineStylesheet(doc: string): Promise<string> {
  const link = /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/.exec(doc);
  if (!link) return doc;

  const href = link[1];
  const css = await readFile(path.join(DIST, href.replace(/^\//, "")), "utf8");
  return doc.replace(link[0], `<style>${css}</style>`);
}

async function main(): Promise<void> {
  if (!(await exists(SSR_BUNDLE))) {
    throw new Error(
      `SSR bundle not found at ${SSR_BUNDLE}. Run \`vite build --ssr src/entry-server.tsx --outDir dist-ssr\` first.`,
    );
  }

  const { render } = (await import(SSR_BUNDLE)) as {
    render: () => Promise<{
      html: string;
      jsonLd: string;
      blogSeedScript: string;
      liveBlog: boolean;
    }>;
  };
  const { html, jsonLd, blogSeedScript, liveBlog } = await render();

  const indexPath = path.join(DIST, "index.html");
  let doc = await readFile(indexPath, "utf8");

  const ROOT_TAG = '<div id="root"></div>';
  if (!doc.includes(ROOT_TAG)) {
    throw new Error(`Could not find ${ROOT_TAG} in dist/index.html`);
  }

  // React 19 emits <link rel="preload"> for the images it renders, at the head of
  // the markup string. Inside #root they'd only be discovered once the parser
  // reaches the body — hoist them into <head> so the preload scanner sees them
  // immediately, skipping any URL <head> already preloads by hand.
  const { body, hoisted } = hoistPreloads(html, doc);
  doc = doc.replace(ROOT_TAG, `<div id="root">${body}</div>`);

  // Inline the stylesheet. This is a single-page site with no internal
  // navigation, so a cached .css file buys almost nothing on a repeat visit,
  // while the extra round trip delays first paint on every new one — and new
  // visits are the whole point of the SEO work.
  doc = await inlineStylesheet(doc);

  const ldTag = `<script type="application/ld+json">${jsonLd}</script>`;
  const headAdditions = [...hoisted, blogSeedScript, ldTag]
    .map((t) => `  ${t}`)
    .join("\n");
  doc = doc.replace("</head>", `${headAdditions}\n  </head>`);

  await writeFile(indexPath, doc, "utf8");

  // ── sitemap.xml ────────────────────────────────────────────────────────────
  // One page, one URL. Anchors (#about, #releases…) are not separate documents
  // and listing them would only dilute the sitemap.
  const lastmod = new Date().toISOString().slice(0, 10);
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${SITE_URL}/og-image.jpg</image:loc>
      <image:title>Spacey Panda — Melodic Electronic Producer</image:title>
    </image:image>
    <image:image>
      <image:loc>${SITE_URL}/spacey-logo.webp</image:loc>
      <image:title>Spacey Panda logo</image:title>
    </image:image>
  </url>
</urlset>
`;
  await writeFile(path.join(DIST, "sitemap.xml"), sitemap, "utf8");

  // The SSR bundle is a build artefact; nothing should deploy it.
  await rm(path.join(ROOT, "dist-ssr"), { recursive: true, force: true });

  const kb = (s: string) => `${(Buffer.byteLength(s) / 1024).toFixed(1)} kB`;
  console.log(
    `prerender: #root ${kb(html)} · JSON-LD ${kb(jsonLd)} · index.html ${kb(doc)} · ` +
      `blog ${liveBlog ? "live feed" : "STATIC FALLBACK (feed unreachable)"} · sitemap.xml written`,
  );
}

main().catch((err) => {
  console.error("prerender failed:", err);
  process.exit(1);
});
