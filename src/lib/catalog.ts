import { releases, type Release, type ReleaseArtist } from "../data/catalog";

const SPACEY_NAME = "Spacey Panda";

export function isAppearsOn(release: Release): boolean {
  return release.type === "APPEARS_ON" || release.isPrimaryArtist === false;
}

export function otherArtists(artists: ReleaseArtist[] | undefined): string[] {
  if (!artists) return [];
  return artists.filter((a) => a.name !== SPACEY_NAME).map((a) => a.name);
}

export function collaboratorLabel(release: Release): string | null {
  const others = otherArtists(release.artists);
  if (others.length === 0) return null;
  const list = others.join(", ");
  return isAppearsOn(release) ? `by ${list}` : `feat. ${list}`;
}

export function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

const sortedAsc = [...releases].sort(
  (a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime() ||
    a.id.localeCompare(b.id),
);

const numberById = new Map<string, number>(
  sortedAsc.map((release, i) => [release.id, i + 1]),
);

export function releaseNumber(release: Release): number {
  return numberById.get(release.id) ?? 1;
}

const monthFmt = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
});

const dayFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatMonth(release: Release): string {
  return monthFmt.format(new Date(release.date)).toUpperCase();
}

export function formatDay(release: Release): string {
  if (release.datePrecision === "YEAR") {
    return String(new Date(release.date).getUTCFullYear());
  }
  return dayFmt.format(new Date(release.date));
}

export function releaseYear(release: Release): number {
  return new Date(release.date).getUTCFullYear();
}

/**
 * The most recent release where Spacey Panda is the primary artist
 * (skips "appears on" credits). Catalogue is already sorted newest-first.
 */
export function latestRelease(): Release | undefined {
  return releases.find((r) => !isAppearsOn(r));
}

/** Singular noun for a release type, for prose like "New single · …". */
export function releaseKindWord(release: Release): string {
  switch (release.type) {
    case "SINGLE":
      return "single";
    case "EP":
      return "EP";
    case "ALBUM":
      return "album";
    default:
      return "release";
  }
}
