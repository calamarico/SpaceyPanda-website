import { useEffect, useState } from "react";
import { site } from "../data/data";
import { ui } from "../lib/icons";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#releases", label: "Releases" },
  { href: "#listen", label: "Listen" },
  { href: "#blog", label: "Blog" },
];

const SPOTIFY_URL = site.streaming.find((s) => s.icon === "spotify")?.url;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the drawer is open: lock body scroll, close on Escape, and close if the
  // viewport grows back past the mobile breakpoint.
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onResize = () => {
      if (window.innerWidth > 880) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className={"sp-nav" + (scrolled ? " scrolled" : "")}>
        <div className="sp-container sp-nav-inner">
          <a href="#top" className="sp-nav-mark" onClick={closeMenu}>
            <span className="sp-mark-spacey">SPACEY</span>
            <span className="sp-mark-panda">PANDA</span>
          </a>
          <div className="sp-nav-links">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>
          <div className="sp-nav-actions">
            <a className="sp-nav-cta" href="#listen">
              <ui.Headphones size={14} /> Listen
            </a>
            <button
              type="button"
              className={"sp-nav-burger" + (menuOpen ? " is-open" : "")}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="sp-mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Full-screen opaque drawer — sibling of <nav> so the burger (z-50) stays
          above the overlay (z-49) and tappable. */}
      <div
        id="sp-mobile-menu"
        className={"sp-mobile-menu" + (menuOpen ? " is-open" : "")}
        aria-hidden={!menuOpen}
      >
        <div className="sp-mobile-menu-links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
              {l.label}
            </a>
          ))}
        </div>
        {SPOTIFY_URL && (
          <a
            className="sp-btn sp-btn-primary sp-btn-large"
            href={SPOTIFY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
            tabIndex={menuOpen ? 0 : -1}
          >
            <ui.Spotify size={18} /> Listen on Spotify
          </a>
        )}
      </div>
    </>
  );
}
