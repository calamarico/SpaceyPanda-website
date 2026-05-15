import { useEffect, useMemo, useState } from "react";
import { releases, type Release } from "../data/catalog";
import {
  collaboratorLabel,
  formatDay,
  formatMonth,
  isAppearsOn,
  otherArtists,
  releaseYear,
} from "../lib/catalog";
import { Cover } from "./Cover";
import { ReleaseModal } from "./ReleaseModal";
import { ui } from "../lib/icons";

type Filter = "all" | "single" | "ep";
type View = "grid" | "list" | "timeline";

const FEATURED_COUNT = 3;

function readView(): View {
  if (typeof window === "undefined") return "grid";
  const v = new URLSearchParams(window.location.search).get("view");
  return v === "list" || v === "timeline" ? v : "grid";
}

function writeView(v: View) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (v === "grid") url.searchParams.delete("view");
  else url.searchParams.set("view", v);
  window.history.replaceState(null, "", url.toString());
}

export function Releases() {
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>(readView);
  const [modalRelease, setModalRelease] = useState<Release | null>(null);

  useEffect(() => writeView(view), [view]);

  const featured = releases
    .filter((r) => r.type !== "APPEARS_ON")
    .slice(0, FEATURED_COUNT);

  const counts = useMemo(
    () => ({
      all: releases.length,
      single: releases.filter((r) => r.type === "SINGLE").length,
      ep: releases.filter((r) => r.type === "EP").length,
    }),
    [],
  );

  const filtered = useMemo(() => {
    if (filter === "all") return releases;
    const target = filter === "ep" ? "EP" : "SINGLE";
    return releases.filter((r) => r.type === target);
  }, [filter]);

  const byYear = useMemo(() => {
    const map = new Map<number, Release[]>();
    filtered.forEach((r) => {
      const y = releaseYear(r);
      if (!map.has(y)) map.set(y, []);
      map.get(y)!.push(r);
    });
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [filtered]);

  const years = useMemo(() => filtered.map(releaseYear), [filtered]);
  const yearRange =
    years.length > 0
      ? `${Math.min(...years)} → ${Math.max(...years)}`
      : "";

  const filterLabel =
    filter === "ep" ? "EPs" : filter === "single" ? "singles" : "releases";

  return (
    <section id="releases" className="sp-section">
      <div className="sp-container sp-reveal">
        <div className="sp-section-head">
          <span className="sp-eyebrow">Discography</span>
          <h2 className="sp-h2">
            Latest <span className="sp-text-gradient">releases</span>.
          </h2>
          <p className="sp-body-lg" style={{ maxWidth: 520, margin: 0 }}>
            Three featured at the top. The full catalogue follows — synced live from Spotify.
          </p>
        </div>

        <ul className="sp-release-featured-grid">
          {featured.map((r, i) =>
            i === 0 ? (
              <FeaturedLead
                key={r.id}
                release={r}
                onClick={() => setModalRelease(r)}
              />
            ) : (
              <FeaturedSecondary
                key={r.id}
                release={r}
                onClick={() => setModalRelease(r)}
              />
            ),
          )}
        </ul>

        <div className="sp-release-toolbar">
          <div>
            <p className="sp-release-toolbar-eyebrow">Full catalogue</p>
            <h3 className="sp-release-toolbar-title">
              {filtered.length} {filterLabel}
              {yearRange ? ` · ${yearRange}` : ""}
            </h3>
          </div>

          <div className="sp-release-toolbar-switches">
            <Switch
              value={filter}
              onChange={setFilter}
              options={[
                { k: "all", l: `All · ${counts.all}` },
                { k: "single", l: `Singles · ${counts.single}` },
                { k: "ep", l: `EPs · ${counts.ep}` },
              ]}
            />
            <Switch
              value={view}
              onChange={setView}
              options={[
                { k: "grid", l: "Grid" },
                { k: "list", l: "List" },
                { k: "timeline", l: "Timeline" },
              ]}
            />
          </div>
        </div>

        <div className="sp-release-view">
          {view === "grid" && (
            <ul className="sp-release-grid">
              {filtered.map((r) => (
                <GridCard
                  key={r.id}
                  release={r}
                  onClick={() => setModalRelease(r)}
                />
              ))}
            </ul>
          )}

          {view === "list" && (
            <ListView releases={filtered} onOpen={setModalRelease} />
          )}

          {view === "timeline" && (
            <Timeline byYear={byYear} onOpen={setModalRelease} />
          )}
        </div>
      </div>

      <ReleaseModal
        release={modalRelease}
        onClose={() => setModalRelease(null)}
      />
    </section>
  );
}

function FeaturedLead({
  release,
  onClick,
}: {
  release: Release;
  onClick: () => void;
}) {
  const formatLabel =
    release.type === "EP"
      ? `EP · ${release.trackCount} tracks`
      : release.type === "ALBUM"
        ? `Album · ${release.trackCount} tracks`
        : release.type === "COMPILATION"
          ? `Compilation · ${release.trackCount} tracks`
          : release.type === "APPEARS_ON"
            ? "Featured appearance"
            : "Single";

  return (
    <li
      onClick={onClick}
      className="sp-release-featured-lead"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="sp-release-featured-lead-cover">
        <Cover release={release} />
        <span className="sp-release-featured-lead-pill">
          <span className="sp-dot" aria-hidden />
          Latest release · Out now
        </span>
      </div>

      <div className="sp-release-featured-lead-body">
        <p className="sp-release-featured-lead-eyebrow">
          {isAppearsOn(release) ? "FEATURED" : release.type}
        </p>

        <h3 className="sp-release-featured-lead-title">
          <span className="sp-text-gradient">{release.name}</span>
        </h3>

        {collaboratorLabel(release) && (
          <p className="sp-release-featured-lead-collab">
            {collaboratorLabel(release)}
          </p>
        )}

        <div className="sp-release-featured-lead-meta">
          <LeadMetaCell label="Format" value={formatLabel} />
          <LeadMetaCell label="Released" value={formatDay(release)} mono />
          <LeadMetaCell label="Tracks" value={String(release.trackCount)} />
        </div>

        <div className="sp-release-featured-lead-actions">
          <a
            href={release.spotifyUrl}
            target="_blank"
            rel="noreferrer noopener"
            onClick={(e) => e.stopPropagation()}
            className="sp-btn sp-btn-primary"
          >
            <ui.Spotify size={14} /> Listen on Spotify
          </a>
          <span className="sp-release-featured-lead-hint">
            Open release <ui.Arrow size={12} />
          </span>
        </div>
      </div>
    </li>
  );
}

function LeadMetaCell({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="sp-release-featured-lead-meta-cell">
      <span className="sp-release-featured-lead-meta-label">{label}</span>
      <span
        className={
          "sp-release-featured-lead-meta-value" +
          (mono ? " sp-release-featured-lead-meta-value--mono" : "")
        }
      >
        {value}
      </span>
    </div>
  );
}

function FeaturedSecondary({
  release,
  onClick,
}: {
  release: Release;
  onClick: () => void;
}) {
  return (
    <li
      onClick={onClick}
      className="sp-release-featured-secondary"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="sp-release-featured-secondary-cover">
        <Cover release={release} />
      </div>
      <div className="sp-release-featured-secondary-meta">
        <div className="sp-release-featured-secondary-eyebrow">
          <span>
            {release.type === "APPEARS_ON"
              ? "Featured"
              : release.type === "EP"
                ? `EP · ${release.trackCount} tracks`
                : "Single"}
          </span>
          <span>{formatDay(release)}</span>
        </div>
        <h3 className="sp-release-featured-secondary-title">{release.name}</h3>
        {collaboratorLabel(release) && (
          <p className="sp-release-featured-secondary-collab">
            {collaboratorLabel(release)}
          </p>
        )}
      </div>
    </li>
  );
}

function GridCard({
  release,
  onClick,
}: {
  release: Release;
  onClick: () => void;
}) {
  return (
    <li
      onClick={onClick}
      className="sp-release-grid-card"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="sp-release-grid-card-cover">
        <Cover release={release} />
      </div>
      <div className="sp-release-grid-card-meta">
        <div className="sp-release-grid-card-row">
          <h4 className="sp-release-grid-card-title">{release.name}</h4>
          <span className="sp-release-grid-card-year">
            {release.type === "EP"
              ? `EP · ${release.trackCount}`
              : releaseYear(release)}
          </span>
        </div>
        {collaboratorLabel(release) && (
          <p className="sp-release-grid-card-collab">
            {collaboratorLabel(release)}
          </p>
        )}
      </div>
    </li>
  );
}

function ListView({
  releases,
  onOpen,
}: {
  releases: Release[];
  onOpen: (r: Release) => void;
}) {
  return (
    <ul className="sp-release-list">
      <li className="sp-release-list-header">
        <span>Cover</span>
        <span>Title</span>
        <span>Type</span>
        <span>Year</span>
        <span>Tracks</span>
        <span></span>
      </li>
      {releases.map((r) => (
        <li
          key={r.id}
          onClick={() => onOpen(r)}
          className="sp-release-list-row"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onOpen(r);
            }
          }}
        >
          <div className="sp-release-list-cover">
            <Cover release={r} variant="mini" />
          </div>
          <span className="sp-release-list-title">
            <span className="sp-release-list-name">{r.name}</span>
            <span className="sp-release-list-sub">
              {(() => {
                const others = otherArtists(r.artists);
                if (isAppearsOn(r)) {
                  return `by ${others.join(", ")} · ${formatMonth(r)}`;
                }
                if (others.length > 0) {
                  return `Spacey Panda, ${others.join(", ")} · ${formatMonth(r)}`;
                }
                return `Spacey Panda · ${formatMonth(r)}`;
              })()}
            </span>
          </span>
          <span className="sp-release-list-type">
            {r.type === "APPEARS_ON" ? "FEAT." : r.type}
          </span>
          <span className="sp-release-list-year">{releaseYear(r)}</span>
          <span className="sp-release-list-tracks">{r.trackCount}</span>
          <span className="sp-release-list-play" aria-hidden>
            <ui.Play size={11} />
          </span>
        </li>
      ))}
    </ul>
  );
}

function Timeline({
  byYear,
  onOpen,
}: {
  byYear: [number, Release[]][];
  onOpen: (r: Release) => void;
}) {
  return (
    <>
      <div className="sp-release-timeline-hint">
        <span>Scroll horizontally</span>
        <ui.Arrow size={12} />
      </div>
      <div className="sp-release-timeline-bleed">
        <div className="sp-release-timeline-track">
          {byYear.flatMap(([year, items]) => [
            <div key={`marker-${year}`} className="sp-release-timeline-marker">
              <div className="sp-release-timeline-marker-line" />
              <div className="sp-release-timeline-marker-year">{year}</div>
            </div>,
            ...items.map((r) => (
              <div
                key={r.id}
                onClick={() => onOpen(r)}
                className="sp-release-timeline-card"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen(r);
                  }
                }}
              >
                <div className="sp-release-timeline-cover">
                  <Cover release={r} />
                </div>
                <div className="sp-release-timeline-meta">
                  {isAppearsOn(r) ? "FEAT." : r.type}
                </div>
                <div className="sp-release-timeline-title">{r.name}</div>
                {collaboratorLabel(r) && (
                  <div className="sp-release-timeline-collab">
                    {collaboratorLabel(r)}
                  </div>
                )}
              </div>
            )),
          ])}
        </div>
      </div>
    </>
  );
}

function Switch<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { k: T; l: string }[];
}) {
  return (
    <div className="sp-release-switch">
      {options.map((opt) => {
        const active = opt.k === value;
        return (
          <button
            key={opt.k}
            type="button"
            onClick={() => onChange(opt.k)}
            className={
              "sp-release-switch-btn" + (active ? " is-active" : "")
            }
          >
            {opt.l}
          </button>
        );
      })}
    </div>
  );
}
