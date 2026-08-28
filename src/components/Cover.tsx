import type { Release } from "../data/catalog";
import { releaseNumber, releaseYear } from "../lib/catalog";
import { ui } from "../lib/icons";

type CoverProps = {
  release: Release;
  variant?: "default" | "mini" | "big";
  /**
   * CSS `sizes` for the artwork. Drives which Spotify crop the browser downloads,
   * so it should match how big the cover actually renders in that slot.
   */
  sizes?: string;
};

// Spotify encodes the crop size in the image id: the catalogue stores the 640px
// one. Swapping the prefix is the documented way to ask for a smaller file, and
// an unrecognised URL simply falls through unchanged.
const SPOTIFY_CROPS = {
  64: "ab67616d00004851",
  300: "ab67616d00001e02",
  640: "ab67616d0000b273",
} as const;

const CROP_PATTERN = new RegExp(Object.values(SPOTIFY_CROPS).join("|"));

function crop(url: string, px: keyof typeof SPOTIFY_CROPS): string {
  return url.replace(CROP_PATTERN, SPOTIFY_CROPS[px]);
}

function coverSrcSet(url: string): string | undefined {
  if (!CROP_PATTERN.test(url)) return undefined;
  return `${crop(url, 64)} 64w, ${crop(url, 300)} 300w, ${crop(url, 640)} 640w`;
}

export function Cover({ release, variant = "default", sizes = "240px" }: CoverProps) {
  const isMini = variant === "mini";
  const isBig = variant === "big";
  const num = String(releaseNumber(release)).padStart(2, "0");

  return (
    <div className={`sp-cover sp-cover--${variant}`}>
      <img
        src={release.coverArt}
        srcSet={coverSrcSet(release.coverArt)}
        sizes={sizes}
        alt={`${release.name} — cover art`}
        loading="lazy"
        decoding="async"
        draggable={false}
        width={640}
        height={640}
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
