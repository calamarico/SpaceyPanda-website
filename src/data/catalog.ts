export { releases } from "./catalog.generated";

export type ReleaseType =
  | "SINGLE"
  | "EP"
  | "ALBUM"
  | "COMPILATION"
  | "APPEARS_ON";

export type DatePrecision = "DAY" | "MONTH" | "YEAR";

export type ReleaseArtist = {
  id: string;
  name: string;
  spotifyUrl: string;
};

export type Track = {
  id: string;
  name: string;
  trackNumber: number;
  durationMs: number;
  isrc?: string;
  previewUrl?: string;
  spotifyUrl: string;
  artists: ReleaseArtist[];
  isCollab: boolean;
};

export type Release = {
  id: string;
  name: string;
  type: ReleaseType;
  date: string;
  datePrecision: DatePrecision;
  trackCount: number;
  coverArt: string;
  spotifyUrl: string;
  artists?: ReleaseArtist[];
  isPrimaryArtist?: boolean;
  tracks?: Track[];
  label?: string;
};
