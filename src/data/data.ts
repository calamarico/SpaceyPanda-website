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

  streaming: [
    {
      name: "Spotify",
      handle: "open.spotify.com/artist",
      icon: "spotify",
      color: "#1DB954",
      url: "https://open.spotify.com/intl-es/artist/5XPqo8CFovDIu4bbfoaxRd?si=AJi5hmvkSxm9kL29oS62bQ",
    },
    {
      name: "Apple Music",
      handle: "music.apple.com",
      icon: "apple",
      color: "#FA243C",
      url: "https://music.apple.com/us/artist/spacey-panda/1712425840",
    },
    {
      name: "SoundCloud",
      handle: "soundcloud.com/spaceypanda",
      icon: "soundcloud",
      color: "#FF5500",
      url: "https://soundcloud.com/spaceypanda",
    },
    {
      name: "Bandcamp",
      handle: "spaceypanda.bandcamp.com",
      icon: "bandcamp",
      color: "#629AA9",
      url: "https://spaceypanda.bandcamp.com/",
    },
    {
      name: "YouTube",
      handle: "@spaceypandamusic",
      icon: "youtube",
      color: "#FF0000",
      url: "https://www.youtube.com/@spaceypandamusic",
    },
    {
      name: "Beatport",
      handle: "beatport.com/artist",
      icon: "beatport",
      color: "#A4FF45",
      url: "https://www.beatport.com/es/artist/spacey-panda/1194447",
    },
    {
      name: "Deezer",
      handle: "deezer.com/artist",
      icon: "deezer",
      color: "#A238FF",
      url: "https://www.deezer.com/en/artist/237428831?deferredFl=1",
    },
    {
      name: "Tidal",
      handle: "tidal.com/artist",
      icon: "tidal",
      color: "#00FFFF",
      url: "https://tidal.com/artist/42999698",
    },
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
