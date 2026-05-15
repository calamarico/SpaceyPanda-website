import type { IconType } from "react-icons";
import {
  FaSpotify,
  FaSoundcloud,
  FaBandcamp,
  FaYoutube,
  FaDeezer,
  FaHeadphones,
  FaArrowRight,
  FaPlay,
  FaInstagram,
  FaArrowUpRightFromSquare,
  FaLocationDot,
  FaWandMagicSparkles,
  FaBars,
  FaXmark,
} from "react-icons/fa6";
import { SiApplemusic, SiBeatport, SiTidal } from "react-icons/si";

import type { PlatformIcon } from "../data/types";

export const platformIcons: Record<PlatformIcon, IconType> = {
  spotify: FaSpotify,
  apple: SiApplemusic,
  soundcloud: FaSoundcloud,
  bandcamp: FaBandcamp,
  youtube: FaYoutube,
  beatport: SiBeatport,
  deezer: FaDeezer,
  tidal: SiTidal,
};

export const ui = {
  Spotify: FaSpotify,
  Headphones: FaHeadphones,
  Arrow: FaArrowRight,
  Play: FaPlay,
  Instagram: FaInstagram,
  ExternalLink: FaArrowUpRightFromSquare,
  Pin: FaLocationDot,
  Sparkle: FaWandMagicSparkles,
  Menu: FaBars,
  Close: FaXmark,
} as const;
