import type { SiteData } from "./types";

export const site: SiteData = {
  artist: {
    name: "Spacey Panda",
    tagline: "Charting constellations of sound and souls",
    location: "Canada",
    role: "Electronic / Melodic Producer",
    bio: [
      "I'm a melodic-electronic producer from Canada, working in the soft space between dance music and ambient drift — synths that breathe, basslines you can dance to slowly, and percussion that feels like it's mapping something out in the dark.",
      "My tracks tend to start as small constellations — a chord, a vocal chop, a single texture — that I trace out until they connect into a full sky. Continuous, melodic, a little nostalgic. I'd rather move you than impress you.",
      "Off the decks I write a blog about the people behind the music — interviews, listening notes, and the songs I can't stop returning to.",
    ],
  },

  stats: {
    based_in: "Canada",
    started: "2019",
    releases: "32 tracks",
    label: "Independent",
  },

  hero_meta: ["Melodic Electronic", "Producer", "Writer", "Est. 2019"],

  releases: [
    { title: "Northern Drift", kind: "Single", date: "21 Mar 2026", cover: "sp-cover-1" },
    { title: "Soft Orbits", kind: "EP · 4", date: "08 Nov 2025", cover: "sp-cover-2" },
    { title: "Lantern Sky", kind: "Single", date: "12 Sep 2025", cover: "sp-cover-3" },
  ],

  streaming: [
    { name: "Spotify", handle: "open.spotify.com/artist", icon: "spotify", color: "#1DB954" },
    { name: "Apple Music", handle: "music.apple.com", icon: "apple", color: "#FA243C" },
    { name: "SoundCloud", handle: "soundcloud.com", icon: "soundcloud", color: "#FF5500" },
    { name: "Bandcamp", handle: "spaceypanda.bandcamp", icon: "bandcamp", color: "#629AA9" },
    { name: "YouTube", handle: "@spaceypanda", icon: "youtube", color: "#FF0000" },
    { name: "Beatport", handle: "beatport.com/artist", icon: "beatport", color: "#A4FF45" },
    { name: "Deezer", handle: "deezer.com/artist", icon: "deezer", color: "#A238FF" },
    { name: "Tidal", handle: "tidal.com/browse", icon: "tidal", color: "#00FFFF" },
  ],

  blog: {
    url: "https://spaceypandamusic.com",
    intro: "Sounds and souls",
    headline: "A little blog about the people behind the music.",
    description:
      "Interviews with artists I'm into, notes on songs that keep me up at night, and the occasional liner note for my own tracks. Posted whenever it's ready, not on a schedule.",
    posts: [
      {
        kind: "Interview",
        title: "In conversation with Marlowe Crane on textures, tape & touring solo",
        excerpt:
          "We talked about field recordings from her last trip across the Yukon, why she's only releasing on cassette this year, and the loop pedal she refuses to upgrade.",
        date: "02 May 2026",
        readTime: "9 min",
      },
      {
        kind: "Listening Notes",
        title: "Five tracks I haven't been able to skip this month",
        excerpt:
          "A neo-soul B-side I caught on a friend's car stereo, two dub-techno records, and an unreleased demo a producer slipped into my DMs. The fifth one will surprise you.",
        date: "18 Apr 2026",
        readTime: "5 min",
      },
      {
        kind: "Liner Notes",
        title: "Behind 'Northern Drift' — collaborating with Yuki Saito",
        excerpt:
          "How a four-bar voice memo became the spine of the single, what Yuki added in Tokyo, and the synth patch that almost didn't make the final mix.",
        date: "26 Mar 2026",
        readTime: "7 min",
      },
    ],
  },

  instagram: {
    handle: "@spacey.panda",
    url: "https://www.instagram.com/spacey.panda/",
    followers: "182K",
    tiles: ["sp-cover-1", "sp-cover-4", "sp-cover-3", "sp-cover-6", "sp-cover-2", "sp-cover-5"],
  },
};
