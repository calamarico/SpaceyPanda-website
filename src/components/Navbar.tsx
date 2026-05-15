import { useEffect, useState } from "react";
import { ui } from "../lib/icons";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={"sp-nav" + (scrolled ? " scrolled" : "")}>
      <div className="sp-container sp-nav-inner">
        <a href="#top" className="sp-nav-mark">
          <span className="sp-mark-spacey">SPACEY</span>
          <span className="sp-mark-panda">PANDA</span>
        </a>
        <div className="sp-nav-links">
          <a href="#about">About</a>
          <a href="#releases">Releases</a>
          <a href="#listen">Listen</a>
          <a href="#blog">Blog</a>
          <a href="#instagram">Instagram</a>
        </div>
        <a className="sp-nav-cta" href="#listen">
          <ui.Headphones size={14} /> Listen
        </a>
      </div>
    </nav>
  );
}
