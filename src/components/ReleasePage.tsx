/**
 * A single release's own page, prerendered to /releases/<slug>/.
 *
 * Why these pages exist: the site used to be one URL, so its entire search
 * surface was the artist name — competing against seven streaming platforms for
 * it. Each release has a title people actually search for, and nothing on the
 * web owns those queries. Every section here is real, page-specific content
 * (tracklist with durations, credits, date) plus links out to neighbouring
 * releases, which is what turns 57 pages into a crawlable site instead of 57
 * dead ends.
 */
import type { Release } from "../data/catalog";
import { releases } from "../data/catalog";
import { site } from "../data/data";
import {
  collaboratorLabel,
  formatDay,
  formatDuration,
  isAppearsOn,
  otherArtists,
} from "../lib/catalog";
import { ui } from "../lib/icons";
import { formatNoun } from "../lib/releaseMeta";
import { RELEASES_BASE, releasePath } from "../lib/releaseUrl";
import { Cover } from "./Cover";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";
import { StarsCanvas } from "./StarsCanvas";

const RELATED_COUNT = 6;

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** Neighbours in the catalogue — the releases either side of this one. */
function relatedReleases(release: Release): Release[] {
  const index = releases.findIndex((r) => r.id === release.id);
  if (index < 0) return releases.slice(0, RELATED_COUNT);

  const before = releases.slice(Math.max(0, index - RELATED_COUNT), index);
  const after = releases.slice(index + 1, index + 1 + RELATED_COUNT);
  return [...after, ...before.reverse()].slice(0, RELATED_COUNT);
}

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="sp-rp-meta-cell">
      <span className="sp-rp-meta-label">{label}</span>
      <span className="sp-rp-meta-value">{value}</span>
    </div>
  );
}

export function ReleasePage({ release }: { release: Release }) {
  const featured = isAppearsOn(release);
  const others = otherArtists(release.artists);
  const collaborators = collaboratorLabel(release);
  const related = relatedReleases(release);
  const spotifyProfile = site.streaming.find((s) => s.icon === "spotify")?.url;

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
            <a href="/#releases">Releases</a>
            <span aria-hidden>/</span>
            <span aria-current="page">{release.name}</span>
          </nav>

          <article className="sp-rp-hero">
            <div className="sp-rp-cover">
              <Cover
                release={release}
                variant="big"
                sizes="(max-width: 880px) 92vw, 420px"
                showYear={false}
                showTitle={false}
                priority
              />
            </div>

            <div className="sp-rp-body">
              <p className="sp-rp-eyebrow">
                {featured ? "Featured appearance" : formatNoun(release)}
                <span aria-hidden> · </span>
                {formatDay(release)}
              </p>

              <h1 className="sp-rp-title">
                <span className="sp-text-gradient">{release.name}</span>
              </h1>

              <p className="sp-rp-byline">
                {featured && others.length > 0 ? (
                  <>
                    by {others.join(", ")} — featuring{" "}
                    <a href="/">Spacey Panda</a>
                  </>
                ) : (
                  <>
                    by <a href="/">Spacey Panda</a>
                    {collaborators ? ` ${collaborators}` : ""}
                  </>
                )}
              </p>

              <div className="sp-rp-meta">
                <MetaCell
                  label="Format"
                  value={
                    featured
                      ? "Featured appearance"
                      : capitalise(formatNoun(release))
                  }
                />
                <MetaCell label="Released" value={formatDay(release)} />
                <MetaCell label="Tracks" value={String(release.trackCount)} />
              </div>

              <div className="sp-rp-actions">
                <a
                  className="sp-btn sp-btn-primary sp-btn-large"
                  href={release.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ui.Spotify size={18} /> Listen on Spotify
                </a>
                <a className="sp-btn sp-btn-ghost sp-btn-large" href="/#listen">
                  All platforms
                </a>
              </div>
            </div>
          </article>

          {release.tracks && release.tracks.length > 0 && (
            <section className="sp-rp-section" aria-labelledby="tracklist">
              <h2 className="sp-rp-h2" id="tracklist">
                Tracklist
              </h2>
              <ol className="sp-rp-tracks">
                {release.tracks.map((track) => {
                  const guests = otherArtists(track.artists);
                  return (
                    <li key={track.id} className="sp-rp-track">
                      <span className="sp-rp-track-num">
                        {String(track.trackNumber).padStart(2, "0")}
                      </span>
                      <span className="sp-rp-track-meta">
                        <a
                          className="sp-rp-track-name"
                          href={track.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {track.name}
                        </a>
                        {track.isCollab && guests.length > 0 && (
                          <span className="sp-rp-track-feat">
                            {featured
                              ? `with ${guests.join(", ")}`
                              : `feat. ${guests.join(", ")}`}
                          </span>
                        )}
                      </span>
                      <span className="sp-rp-track-dur">
                        {formatDuration(track.durationMs)}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          <section className="sp-rp-section" aria-labelledby="about-artist">
            <h2 className="sp-rp-h2" id="about-artist">
              About Spacey Panda
            </h2>
            <p className="sp-rp-about">{site.artist.bio[0]}</p>
            <p className="sp-rp-about-more">
              <a href="/#about">Read the full bio</a>
              <span aria-hidden> · </span>
              <a href="/#releases">Browse the full catalogue</a>
              {spotifyProfile && (
                <>
                  <span aria-hidden> · </span>
                  <a
                    href={spotifyProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Follow on Spotify
                  </a>
                </>
              )}
            </p>
          </section>

          <section className="sp-rp-section" aria-labelledby="more-releases">
            <h2 className="sp-rp-h2" id="more-releases">
              More from Spacey Panda
            </h2>
            <ul className="sp-rp-related">
              {related.map((r) => (
                <li key={r.id} className="sp-rp-related-card">
                  <a href={releasePath(r)}>
                    <span className="sp-rp-related-cover">
                      <Cover
                        release={r}
                        sizes="200px"
                        showYear={false}
                        showTitle={false}
                      />
                    </span>
                    <span className="sp-rp-related-name">{r.name}</span>
                    <span className="sp-rp-related-date">{formatDay(r)}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="sp-rp-all">
              <a href={`${RELEASES_BASE}/`}>See all {releases.length} releases</a>
            </p>
          </section>
        </div>
      </main>

      <Footer hrefBase="/" />
    </>
  );
}
