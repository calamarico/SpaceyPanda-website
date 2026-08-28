import { site } from "../data/data";
import { ui } from "../lib/icons";

export function Footer() {
  const year = new Date().getFullYear();
  const spotifyUrl = site.streaming.find((s) => s.icon === "spotify")?.url;
  const bandcampUrl = site.streaming.find((s) => s.icon === "bandcamp")?.url;

  return (
    <footer className="sp-footer">
      <div className="sp-container">
        <div className="sp-footer-inner">
          <div>
            <a href="#top" className="sp-nav-mark" style={{ fontSize: 22 }}>
              <span className="sp-mark-spacey">SPACEY</span>
              <span className="sp-mark-panda">PANDA</span>
            </a>
            <p className="sp-footer-tag">
              <ui.Headphones size={14} /> {site.artist.tagline}
            </p>
          </div>
          <div>
            <h2>Explore</h2>
            <div className="sp-footer-links">
              <a href="#about">About</a>
              <a href="#releases">Releases</a>
              <a href="#listen">Listen</a>
              <a href="#blog">Blog</a>
            </div>
          </div>
          <div>
            <h2>Elsewhere</h2>
            <div className="sp-footer-links">
              <a href={site.blog.url} target="_blank" rel="noopener noreferrer">
                spaceypandamusic.com
              </a>
              <a href={site.instagram.url} target="_blank" rel="noopener noreferrer">
                {site.instagram.handle}
              </a>
              {spotifyUrl && (
                <a href={spotifyUrl} target="_blank" rel="noopener noreferrer">
                  open.spotify.com
                </a>
              )}
              {bandcampUrl && (
                <a href={bandcampUrl} target="_blank" rel="noopener noreferrer">
                  Bandcamp
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="sp-footer-bottom">
          <span>© {year} Spacey Panda · {site.stats.based_in}</span>
          <span>Charting constellations · {year}</span>
        </div>
      </div>
    </footer>
  );
}
