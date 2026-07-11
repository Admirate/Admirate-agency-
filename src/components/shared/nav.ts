/**
 * Floating pill navigation, shared by every public page.
 *
 * Self-contained and class-scoped (.pnav*) so it can be dropped into any of the
 * page stylesheets without colliding with their selectors. It is a solid dark
 * pill rather than a mix-blend-mode bar, so it stays legible over both the
 * light and the black sections without any per-section handling.
 */

export const NAV_CSS = String.raw`
/* Surface sits just above pure black, with a hairline highlight, so the pill
   still reads as a distinct object over the black sections (#intro, #reels,
   #cta, #web, #collat) as well as over the light ones. */
.pnav{
  position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:150;
  display:flex;align-items:center;gap:clamp(6px,1.4vw,18px);
  background:rgba(20,20,23,.92);border:1px solid rgba(255,255,255,.1);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  border-radius:999px;padding:7px 7px 7px 16px;max-width:calc(100vw - 24px);
  box-shadow:0 8px 30px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.05);
  transition:box-shadow .3s,transform .3s,background .3s,border-color .3s;
}
.pnav.scrolled{
  background:rgba(24,24,27,.96);border-color:rgba(255,255,255,.14);
  box-shadow:0 14px 44px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.06);
  transform:translateX(-50%) translateY(-2px);
}

.pnav .pbrand{display:flex;align-items:center;gap:9px;text-decoration:none;flex:0 0 auto}
.pnav .pmark{
  width:26px;height:26px;flex:0 0 26px;border-radius:8px;
  background:linear-gradient(150deg,#FF3B4E,#E3001B 55%,#9c0013);
  display:flex;align-items:center;justify-content:center;
  font-family:var(--display);font-weight:900;font-size:14px;color:#fff;line-height:1;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.35);
}
.pnav .pword{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:15px;letter-spacing:.01em;color:#fff;white-space:nowrap}
.pnav .pword b{color:var(--red);-webkit-text-fill-color:var(--red)}

.pnav .plinks{display:flex;align-items:center;gap:clamp(2px,.9vw,8px);margin-left:clamp(4px,1vw,14px)}
.pnav .plink{
  font-family:var(--body);font-weight:500;font-size:13.5px;letter-spacing:.01em;
  color:#8A8A8E;text-decoration:none;padding:8px 12px;border-radius:999px;white-space:nowrap;
  transition:color .2s,background .2s;
}
.pnav .plink:hover{color:#fff;background:rgba(255,255,255,.06)}
.pnav .plink.on{color:#fff}
.pnav .plink.on::after{
  content:"";display:block;height:2px;width:14px;margin:3px auto -2px;
  background:var(--red);border-radius:2px;
}

.pnav .pcta{
  display:inline-flex;align-items:center;gap:7px;flex:0 0 auto;
  font-family:var(--body);font-weight:600;font-size:13.5px;
  background:#fff;color:#0B0B0C;text-decoration:none;
  padding:10px 16px;border-radius:999px;white-space:nowrap;
  transition:background .2s,color .2s,transform .18s;
}
.pnav .pcta .ar{display:inline-block;transition:transform .18s}
.pnav .pcta:hover{background:var(--red);color:#fff;transform:translateY(-1px)}
.pnav .pcta:hover .ar{transform:translateX(3px)}

@media (max-width:720px){
  .pnav{gap:4px;padding:6px 6px 6px 12px;top:10px}
  .pnav .pword{display:none}
  .pnav .plink{padding:8px 9px;font-size:12.5px}
  .pnav .pcta{padding:9px 13px;font-size:12.5px}
  .pnav .pcta .ctalong{display:none}
}
@media (prefers-reduced-motion:reduce){
  .pnav,.pnav .pcta,.pnav .pcta .ar{transition:none}
}
`;

export type NavPage = "home" | "services" | "blogs";

const LINKS: { id: NavPage; label: string; href: string }[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "services", label: "Services", href: "/services" },
  { id: "blogs", label: "Blogs", href: "/blogs" },
];

/** `active` marks the current page; `ctaHref` differs per page (in-page anchor vs cross-page). */
export const navHtml = (active: NavPage, ctaHref = "/#contact") => `
<nav class="pnav" id="pnav" aria-label="Primary">
  <a class="pbrand" href="/" data-h aria-label="ADMIRATE home">
    <span class="pmark" aria-hidden="true">A</span>
    <span class="pword">ADMIRATE<b>.</b></span>
  </a>
  <div class="plinks">
    ${LINKS.map(
      (l) =>
        `<a class="plink${l.id === active ? " on" : ""}" href="${l.href}"${
          l.id === active ? ' aria-current="page"' : ""
        } data-h>${l.label}</a>`
    ).join("\n    ")}
  </div>
  <a class="pcta" href="${ctaHref}" data-h>Start a project<span class="ctalong"></span> <span class="ar">→</span></a>
</nav>
`;

/** Adds the raised/shadowed state once the page has scrolled. Returns a cleanup fn. */
export function initNav(): () => void {
  const nav = document.getElementById("pnav");
  if (!nav) return () => {};

  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => window.removeEventListener("scroll", onScroll);
}
