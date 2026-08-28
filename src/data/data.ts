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
    ],
  },

  stats: {
    based_in: "Canada",
    started: "2022",
    releases: "32 tracks",
    label: "Independent",
  },

  hero_meta: ["Melodic Electronic", "Producer", "Est. 2022"],

  streaming: [
    {
      name: "Spotify",
      handle: "open.spotify.com/artist",
      icon: "spotify",
      color: "#1DB954",
      url: "https://open.spotify.com/artist/5XPqo8CFovDIu4bbfoaxRd",
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
      url: "https://www.beatport.com/artist/spacey-panda/1194447",
    },
    {
      name: "Deezer",
      handle: "deezer.com/artist",
      icon: "deezer",
      color: "#A238FF",
      url: "https://www.deezer.com/artist/237428831",
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
      "Long-form interviews with the artists behind the music, plus notes, columns and the occasional liner note — published whenever there's something worth saying, not on a schedule.",
    // Static fallback — the 3 latest posts as of handoff. At runtime <Blog /> fetches
    // the live WordPress REST feed and replaces these; on any fetch error it keeps them.
    posts: [
      {
        kind: "Behind the Music",
        title: "In the Dark Corners of Jungle: A Conversation with Cumi R.A.S",
        excerpt:
          "Cumfi R.A.S was actually one of my first collaborators. At the time, I was already into drum and bass…",
        date: "23 Jun 2026",
        readTime: "7 min",
        url: "https://spaceypandamusic.com/in-the-dark-corners-of-jungle-a-conversation-with-cumi-r-a-s/",
        // CDN URL (i0.wp.com) so the fallback image loads even if the origin is Cloudflare-gated.
        image: "https://i0.wp.com/spaceypandamusic.com/wp-content/uploads/2026/06/Cumfi.png?fit=296%2C300&ssl=1",
      },
      {
        kind: "Professor Oddfellow's Chronicles",
        title: "The Remarkable Power of Saying “No”?",
        excerpt:
          "Saying “No” might feel rudely impolite, brusque, unsupportive, or just plain negative. We'll look at why it's a skill worth having…",
        date: "21 Jun 2026",
        readTime: "6 min",
        url: "https://spaceypandamusic.com/the-remarkable-power-of-saying-no/",
        image: null,
      },
      {
        kind: "Ellie's World",
        title: "What is synesthesia? A quick testimony",
        excerpt:
          "Synesthesia, also known as “crossing of the senses,” is where activity in one sensory pathway triggers another…",
        date: "19 Jun 2026",
        readTime: "2 min",
        url: "https://spaceypandamusic.com/what-is-synesthesia-a-quick-testimony/",
        image: "https://i0.wp.com/spaceypandamusic.com/wp-content/uploads/2026/06/Untitled-design-14.jpg?fit=300%2C300&ssl=1",
      },
    ],
  },

  // No Instagram section anymore — only the handle + URL remain, for the footer link.
  instagram: {
    handle: "@spacey.panda",
    url: "https://www.instagram.com/spacey.panda/",
  },
};
