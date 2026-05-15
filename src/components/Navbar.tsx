import { useEffect, useState } from "react";
import { ui } from "../lib/icons";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#releases", label: "Releases" },
  { href: "#listen", label: "Listen" },
  { href: "#blog", label: "Blog" },
  { href: "#instagram", label: "Instagram" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onResize = () => {
      if (window.innerWidth > 880) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
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
          <a className="sp-nav-cta" href="#listen" onClick={closeMenu}>
            <ui.Headphones size={14} /> Listen
          </a>
          <button
            type="button"
            className="sp-nav-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="sp-nav-mobile"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <ui.Close size={18} /> : <ui.Menu size={18} />}
          </button>
        </div>
      </div>
      <div
        id="sp-nav-mobile"
        className={"sp-nav-mobile" + (menuOpen ? " is-open" : "")}
        aria-hidden={!menuOpen}
      >
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
            {l.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
