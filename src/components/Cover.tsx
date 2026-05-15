import type { Release } from "../data/catalog";
import { releaseNumber, releaseYear } from "../lib/catalog";
import { ui } from "../lib/icons";

type CoverProps = {
  release: Release;
  variant?: "default" | "mini" | "big";
};

export function Cover({ release, variant = "default" }: CoverProps) {
  const isMini = variant === "mini";
  const isBig = variant === "big";
  const num = String(releaseNumber(release)).padStart(2, "0");

  return (
    <div className={`sp-cover sp-cover--${variant}`}>
      <img
        src={release.coverArt}
        alt={`${release.name} cover`}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="sp-cover-img"
      />

      <div className="sp-cover-vignette" aria-hidden />

      {!isMini && (
        <>
          <span className="sp-cover-badge sp-cover-badge--year">
            {releaseYear(release)}
          </span>

          <span className="sp-cover-watermark" aria-hidden>
            {num}
          </span>

          {!isBig && (
            <span className="sp-cover-play" aria-hidden>
              <ui.Play size={11} />
            </span>
          )}
        </>
      )}

      <span className="sp-cover-title">{release.name}</span>
    </div>
  );
}
