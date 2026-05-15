import { useEffect, useMemo } from "react";
import type { Release, Track } from "../data/catalog";
import {
  formatDay,
  formatDuration,
  isAppearsOn,
  otherArtists,
} from "../lib/catalog";
import { Cover } from "./Cover";
import { ui } from "../lib/icons";
import { FaXmark } from "react-icons/fa6";

type DisplayTrack = {
  name: string;
  dur: string;
  artists: string[];
  isCollab: boolean;
};

function realTracks(tracks: Track[]): DisplayTrack[] {
  return tracks.map((t) => ({
    name: t.name,
    dur: formatDuration(t.durationMs),
    artists: otherArtists(t.artists),
    isCollab: t.isCollab,
  }));
}

type Props = {
  release: Release | null;
  onClose: () => void;
};

export function ReleaseModal({ release, onClose }: Props) {
  useEffect(() => {
    if (!release) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [release, onClose]);

  const tracks = useMemo(
    () => (release?.tracks ? realTracks(release.tracks) : []),
    [release],
  );

  const open = !!release;

  return (
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      className={"sp-release-modal-backdrop" + (open ? " is-open" : "")}
    >
      {release && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={"sp-release-modal-panel" + (open ? " is-open" : "")}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="sp-release-modal-close"
          >
            <FaXmark size={16} />
          </button>

          <div className="sp-release-modal-grid">
            <div className="sp-release-modal-cover">
              <Cover release={release} variant="big" />
            </div>

            <div className="sp-release-modal-body">
              <p className="sp-release-modal-eyebrow">
                <span className="sp-release-modal-dot" aria-hidden />
                {isAppearsOn(release) ? "FEATURED APPEARANCE" : release.type}
              </p>

              <h2 className="sp-release-modal-title">
                <span className="sp-text-gradient">{release.name}</span>
              </h2>

              <div className="sp-release-modal-meta">
                <Meta
                  label="Type"
                  value={
                    release.type === "APPEARS_ON"
                      ? "Featured appearance"
                      : release.type === "EP"
                        ? `EP · ${release.trackCount} tracks`
                        : release.type === "ALBUM"
                          ? `Album · ${release.trackCount} tracks`
                          : release.type === "COMPILATION"
                            ? `Compilation · ${release.trackCount} tracks`
                            : "Single"
                  }
                />
                <Meta label="Released" value={formatDay(release)} />
                <Meta
                  label="Tracks"
                  value={String(release.trackCount)}
                />
              </div>

              <div>
                <p className="sp-release-modal-section-label">Tracklist</p>
                <ol className="sp-release-modal-tracklist">
                  {tracks.map((t, i) => (
                    <li key={i} className="sp-release-modal-track">
                      <span className="sp-release-modal-track-num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="sp-release-modal-track-meta">
                        <span className="sp-release-modal-track-name">
                          {t.name}
                        </span>
                        {t.isCollab && t.artists.length > 0 && (
                          <span className="sp-release-modal-track-feat">
                            {isAppearsOn(release)
                              ? `with ${t.artists.join(", ")}`
                              : `feat. ${t.artists.join(", ")}`}
                          </span>
                        )}
                      </span>
                      <span className="sp-release-modal-track-dur">
                        {t.dur}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="sp-release-modal-actions">
                <a
                  href={release.spotifyUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="sp-btn sp-btn-primary"
                >
                  <ui.Spotify size={14} /> Open in Spotify
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="sp-release-modal-meta-cell">
      <span className="sp-release-modal-meta-label">{label}</span>
      <span className="sp-release-modal-meta-value">{value}</span>
    </div>
  );
}
