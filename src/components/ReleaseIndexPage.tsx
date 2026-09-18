/**
 * /releases/ — the hub that links to every release page.
 *
 * The home page links releases too, but this gives crawlers (and people) a
 * single flat, paginated-free index: one hop from the home page to any of the
 * 57 release pages.
 */
import { releases } from "../data/catalog";
import { formatDay, isAppearsOn, ownReleases, releaseYear } from "../lib/catalog";
import { releasePath } from "../lib/releaseUrl";
import { Cover } from "./Cover";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { StarsCanvas } from "./StarsCanvas";

function byYear() {
  const map = new Map<number, typeof releases>();
  for (const release of releases) {
    const year = releaseYear(release);
    map.set(year, [...(map.get(year) ?? []), release]);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}

export function ReleaseIndexPage() {
  const groups = byYear();

  return (
    <>
      <div className="sp-cosmos" aria-hidden />
      <StarsCanvas />
      <Navbar hrefBase="/" />

      <main className="sp-rp" id="top">
        <div className="sp-container">
          <nav className="sp-rp-crumbs" aria-label="Breadcrumb">
            <a href="/">Spacey Panda</a>
            <span aria-hidden>/</span>
            <span aria-current="page">Releases</span>
          </nav>

          <h1 className="sp-rp-title" style={{ marginBottom: 18 }}>
            The full <span className="sp-text-gradient">catalogue</span>.
          </h1>
          <p className="sp-rp-about" style={{ marginBottom: 0 }}>
            Every Spacey Panda release — {ownReleases.length} of them, plus{" "}
            {releases.length - ownReleases.length} featured appearances — from{" "}
            {groups[groups.length - 1]?.[0]} to {groups[0]?.[0]}. IDM, ambient
            textures and cinematic electronic music, synced live from Spotify.
          </p>

          {groups.map(([year, items]) => (
            <section className="sp-rp-section" key={year} aria-labelledby={`y${year}`}>
              <h2 className="sp-rp-h2" id={`y${year}`}>
                {year} · {items.length} {items.length === 1 ? "release" : "releases"}
              </h2>
              <ul className="sp-ri-grid">
                {items.map((release) => (
                  <li className="sp-ri-card" key={release.id}>
                    <a href={releasePath(release)}>
                      <span className="sp-ri-cover">
                        <Cover
                          release={release}
                          sizes="220px"
                          showYear={false}
                          showTitle={false}
                        />
                      </span>
                      <span className="sp-ri-name">{release.name}</span>
                      <span className="sp-ri-meta">
                        {isAppearsOn(release) ? "Feat." : release.type} ·{" "}
                        {formatDay(release)}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </main>

      <Footer hrefBase="/" />
    </>
  );
}
