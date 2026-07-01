"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Process", href: "#process" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between h-16"
        style={{
          padding: `0 var(--pad)`,
          background: isScrolled ? "rgba(250,250,247,.88)" : "transparent",
          backdropFilter: isScrolled ? "blur(14px)" : "none",
          borderBottom: isScrolled ? "1px solid var(--hair)" : "none",
          transition: "background .3s, backdrop-filter .3s",
        }}
      >
        <a
          href="#"
          className="font-disp font-black text-lg tracking-tight"
          style={{
            fontStretch: "expanded",
            letterSpacing: "-.02em",
            color: isScrolled ? "var(--ink)" : "#fff",
            transition: "color .3s",
          }}
        >
          ADMIRATE
        </a>

        <ul className="hidden md-nav:flex list-none gap-8 items-center">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="font-mono text-[11px] tracking-[.12em] uppercase transition-colors duration-250"
                style={{
                  color: isScrolled ? "var(--grey)" : "rgba(255,255,255,.6)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = isScrolled ? "var(--ink)" : "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isScrolled
                    ? "var(--grey)"
                    : "rgba(255,255,255,.6)";
                }}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="font-mono text-[11px] tracking-[.12em] uppercase px-[18px] py-2 rounded-sm transition-all duration-250"
              style={{
                color: isScrolled ? "var(--ink)" : "#fff",
                border: isScrolled
                  ? "1px solid var(--ink)"
                  : "1px solid rgba(255,255,255,.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isScrolled ? "var(--ink)" : "var(--red)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = isScrolled ? "var(--ink)" : "var(--red)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = isScrolled ? "var(--ink)" : "#fff";
                e.currentTarget.style.borderColor = isScrolled
                  ? "var(--ink)"
                  : "rgba(255,255,255,.3)";
              }}
            >
              Start a Project
            </a>
          </li>
        </ul>

        <button
          className="flex md-nav:hidden flex-col gap-[5px] p-1 bg-transparent border-none"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-[22px] h-[1.5px] transition-colors duration-300"
              style={{
                background: isScrolled ? "var(--ink)" : "#fff",
              }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className="fixed inset-0 top-16 z-[999] flex-col gap-6"
        style={{
          background: "var(--paper)",
          padding: `32px var(--pad)`,
          display: menuOpen ? "flex" : "none",
        }}
      >
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={handleNavClick}
            className="font-mono text-[13px] tracking-[.12em] uppercase py-3 border-b"
            style={{ color: "var(--grey)", borderColor: "var(--hair)" }}
            tabIndex={menuOpen ? 0 : -1}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#contact"
          onClick={handleNavClick}
          className="font-mono text-[13px] tracking-[.12em] uppercase py-3 border-b"
          style={{ color: "var(--grey)", borderColor: "var(--hair)" }}
          tabIndex={menuOpen ? 0 : -1}
        >
          Start a Project
        </a>
      </div>
    </>
  );
}
