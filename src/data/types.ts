export type CoverClass =
  | "sp-cover-1"
  | "sp-cover-2"
  | "sp-cover-3"
  | "sp-cover-4"
  | "sp-cover-5"
  | "sp-cover-6"
  | "sp-cover-7";

export type PlatformIcon =
  | "spotify"
  | "apple"
  | "soundcloud"
  | "bandcamp"
  | "youtube"
  | "beatport"
  | "deezer"
  | "tidal";

export interface Artist {
  name: string;
  tagline: string;
  location: string;
  role: string;
  bio: string[];
}

export interface Stats {
  based_in: string;
  started: string;
  releases: string;
  label: string;
}

export interface Platform {
  name: string;
  handle: string;
  icon: PlatformIcon;
  color: string;
  url: string;
}

export interface BlogPost {
  kind: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  /** Per-post permalink. Live posts link to their own article. */
  url: string;
  /** Featured image URL. May be absent → card falls back to a gradient cover. */
  image?: string | null;
}

export interface BlogMeta {
  url: string;
  intro: string;
  headline: string;
  description: string;
  posts: BlogPost[];
}

/**
 * Instagram no longer has a dedicated section (removed in the pilot review).
 * Only the handle + profile URL survive, for the single footer "Elsewhere" link.
 */
export interface InstagramMeta {
  handle: string;
  url: string;
}

export interface SiteData {
  artist: Artist;
  stats: Stats;
  hero_meta: string[];
  streaming: Platform[];
  blog: BlogMeta;
  instagram: InstagramMeta;
}
