const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--ink)", padding: "24px var(--pad)" }}>
      <div
        className="footer-inner mx-auto flex justify-between items-center flex-wrap gap-3"
        style={{ maxWidth: "var(--maxw)" }}
      >
        <div
          className="font-disp font-black text-base tracking-tight"
          style={{
            fontStretch: "expanded",
            letterSpacing: "-.02em",
            color: "rgba(255,255,255,.7)",
          }}
        >
          ADMIRATE
        </div>

        <p
          className="font-mono text-[10px] tracking-[.06em]"
          style={{ color: "rgba(255,255,255,.2)" }}
        >
          &copy; {new Date().getFullYear()} Admirate. Advertising, done the right way.
        </p>

        <ul className="flex gap-6 list-none">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="font-mono text-[10px] tracking-[.1em] uppercase transition-colors duration-250 hover:text-white/70"
                style={{ color: "rgba(255,255,255,.25)" }}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
