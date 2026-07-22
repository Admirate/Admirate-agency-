/**
 * Floating pill navigation, shared by every public page.
 *
 * Self-contained and class-scoped (.pnav*) so it can be dropped into any of the
 * page stylesheets without colliding with their selectors. It is a solid dark
 * pill rather than a mix-blend-mode bar, so it stays legible over both the
 * light and the black sections without any per-section handling.
 */

import { asset } from "@/lib/cdn";
import { SERVICE_LIST } from "@/components/service/registry";

const LOGO = asset("admirate logo.webp");

export const NAV_CSS = String.raw`
/* Surface sits just above pure black, with a hairline highlight, so the pill
   still reads as a distinct object over the black sections (#intro, #reels,
   #cta, #web, #collat) as well as over the light ones. */
/* width:max-content is load-bearing. Fixed + left:50% makes the pill shrink-to-
   fit against the space right of the 50% line, which on a phone is narrower than
   its own contents — the box then lands smaller than its children and clips the
   CTA off the right edge. max-content sizes it to what it actually holds; the
   media queries below are what keep that under max-width. */
.pnav{
  position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:150;
  display:flex;align-items:center;gap:clamp(6px,1.4vw,18px);
  width:max-content;
  background:rgba(20,20,23,.92);border:1px solid rgba(255,255,255,.1);
  backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
  border-radius:999px;padding:7px;max-width:calc(100vw - 24px);
  box-shadow:0 8px 30px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.05);
  transition:box-shadow .3s,transform .3s,background .3s,border-color .3s;
}
.pnav.scrolled{
  background:rgba(24,24,27,.96);border-color:rgba(255,255,255,.14);
  box-shadow:0 14px 44px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.06);
  transform:translateX(-50%) translateY(-2px);
}

/* min-height on every hit area keeps the tap targets ~40px on touch, rather
   than the ~20-26px the text alone would give. */
.pnav .pbrand{display:flex;align-items:center;text-decoration:none;flex:0 0 auto;min-height:40px}
/* The lockup is a red mark next to a near-black wordmark, so it cannot sit
   directly on the dark pill — the wordmark would vanish. It rides on a white
   chip instead, which keeps both halves exactly as drawn. The chip echoes the
   pill's own radius and the CTA's shape at the other end. */
.pnav .pchip{
  display:flex;align-items:center;justify-content:center;flex:0 0 auto;
  background:#fff;border-radius:999px;padding:6px 12px;
  transition:transform .18s,box-shadow .18s;
}
.pnav .pbrand:hover .pchip{transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,.32)}
.pnav .plogo{display:block;height:18px;width:auto}

.pnav .plinks{display:flex;align-items:center;gap:clamp(2px,.9vw,8px);margin-left:clamp(4px,1vw,14px)}
.pnav .plink{
  position:relative;display:inline-flex;align-items:center;justify-content:center;min-height:40px;
  font-family:var(--body);font-weight:500;font-size:13.5px;letter-spacing:.01em;
  color:#8A8A8E;text-decoration:none;padding:0 12px;border-radius:999px;white-space:nowrap;
  transition:color .2s,background .2s;
}
.pnav .plink:hover{color:#fff;background:rgba(255,255,255,.06)}
.pnav .plink.on{color:#fff}
/* Absolutely placed so it sits under the label — as a flex child it would land
   beside it. */
.pnav .plink.on::after{
  content:"";position:absolute;left:50%;bottom:7px;transform:translateX(-50%);
  width:14px;height:2px;background:var(--red);border-radius:2px;
}

.pnav .pcta{
  display:inline-flex;align-items:center;justify-content:center;gap:7px;flex:0 0 auto;min-height:40px;
  font-family:var(--body);font-weight:600;font-size:13.5px;
  background:#fff;color:#0B0B0C;text-decoration:none;
  padding:0 16px;border-radius:999px;white-space:nowrap;
  transition:background .2s,color .2s,transform .18s;
}
.pnav .pcta .ar{display:inline-block;transition:transform .18s}
.pnav .pcta:hover{background:var(--red);color:#fff;transform:translateY(-1px)}
.pnav .pcta:hover .ar{transform:translateX(3px)}

/* Tablet — drop the gaps before anything has to shrink. */
@media (max-width:860px){
  .pnav{gap:8px;padding:6px}
  .pnav .plink{padding:8px 10px}
}
/* Phone — the logo chip tightens and the long half of the CTA label goes, so
   the three links survive at a tappable size. */
@media (max-width:640px){
  .pnav{gap:2px;padding:4px;top:10px}
  .pnav .pchip{padding:5px 8px}
  .pnav .plogo{height:14px}
  .pnav .plink{padding:0 7px;font-size:12.5px}
  .pnav .pcta{padding:0 12px;font-size:12.5px;gap:5px}
  .pnav .pcta .ctalong{display:none}
}
@media (max-width:380px){
  .pnav .pchip{padding:4px 7px}
  .pnav .plogo{height:12px}
  .pnav .plink{padding:0 6px;font-size:12px}
  .pnav .pcta{padding:0 10px}
}
/* Last stop before the CTA would be pushed past the pill's edge (320px-class
   phones). Everything gives up a couple of pixels rather than any one element
   collapsing. */
@media (max-width:340px){
  .pnav{gap:1px}
  .pnav .pchip{padding:3px 6px}
  .pnav .plogo{height:11px}
  .pnav .plink{padding:0 5px;font-size:11.5px}
  .pnav .pcta{padding:0 9px;font-size:12px}
}
@media (prefers-reduced-motion:reduce){
  .pnav,.pnav .pchip,.pnav .pcta,.pnav .pcta .ar{transition:none}
}

/* ---------- SERVICES MEGA MENU ----------
   "Services" is a button, not a link — it opens this panel rather than
   navigating. The panel carries its own "Overview" link so /services itself is
   still reachable. Full-screen ink, so it reads as part of the site rather than
   as a dropdown bolted onto it. */
.pnav .pmenu{
  background:none;border:0;font:inherit;cursor:pointer;
  display:inline-flex;align-items:center;gap:5px;
}
.pnav .pmenu .pcar{
  display:inline-block;font-size:9px;line-height:1;opacity:.75;
  transition:transform .3s,opacity .2s;
}
.pnav .pmenu[aria-expanded="true"] .pcar{transform:rotate(180deg);opacity:1}
.pnav .pmenu[aria-expanded="true"]{color:#fff}

/* Sits above the pill (z 150) and covers it; the panel's own ✕ closes it. */
.smenu{
  position:fixed;inset:0;z-index:200;
  background:#0B0B0C;color:#fff;
  display:flex;flex-direction:column;
  padding:clamp(18px,3vw,34px);
  opacity:0;visibility:hidden;pointer-events:none;
  transition:opacity .4s ease,visibility .4s;
  overflow-y:auto;overscroll-behavior:contain;
}
.smenu.open{opacity:1;visibility:visible;pointer-events:auto}
/* Locks the page behind the panel. A distinct class from the landing loader's
   body.locked, so the two can never clobber each other. */
body.smopen{overflow:hidden}

.smenu .smtop{
  display:flex;align-items:center;justify-content:space-between;
  padding-bottom:clamp(14px,2.4vw,26px);flex:0 0 auto;
}
.smenu .smeb{
  font-family:var(--mono);font-size:11px;letter-spacing:.26em;color:var(--red);
}
.smenu .smclose{
  background:none;border:1px solid rgba(255,255,255,.22);color:#fff;cursor:pointer;
  width:42px;height:42px;border-radius:999px;font-size:16px;line-height:1;
  display:inline-flex;align-items:center;justify-content:center;
  transition:background .25s,border-color .25s,transform .25s;
}
.smenu .smclose:hover{background:var(--red);border-color:var(--red);transform:rotate(90deg)}

.smenu .smlist{flex:1 1 auto;display:flex;flex-direction:column;justify-content:center}

.sitem{
  position:relative;display:flex;align-items:center;gap:clamp(12px,2vw,26px);
  padding:clamp(10px,1.6vh,18px) clamp(8px,1.6vw,20px);
  border-top:1px solid rgba(255,255,255,.1);
  text-decoration:none;color:#fff;overflow:hidden;
  opacity:0;transform:translateY(22px);
}
.sitem:last-of-type{border-bottom:1px solid rgba(255,255,255,.1)}
.smenu.open .sitem{
  opacity:1;transform:none;
  transition:opacity .55s cubic-bezier(.16,1,.3,1),transform .55s cubic-bezier(.16,1,.3,1);
  transition-delay:calc(var(--i)*55ms + .08s);
}
/* The red wipe. Scales from the left behind the label, which then steps aside. */
.sitem::before{
  content:"";position:absolute;inset:0;background:var(--red);
  transform:scaleX(0);transform-origin:left;
  transition:transform .45s cubic-bezier(.16,1,.3,1);
}
.sitem:hover::before,.sitem:focus-visible::before{transform:scaleX(1)}
.sitem > *{position:relative}
.sitem .sn{
  font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--red);
  flex:0 0 auto;transition:color .3s;
}
.sitem .st{
  font-family:var(--display);font-weight:800;font-stretch:106%;text-transform:uppercase;
  font-size:clamp(26px,5.2vw,60px);line-height:1.05;letter-spacing:-.015em;
  transition:transform .45s cubic-bezier(.16,1,.3,1);
}
.sitem .sar{
  margin-left:auto;flex:0 0 auto;opacity:0;font-size:clamp(16px,2vw,24px);
  transform:translateX(-12px);
  transition:opacity .35s,transform .45s cubic-bezier(.16,1,.3,1);
}
.sitem:hover .sn,.sitem:focus-visible .sn{color:#fff}
.sitem:hover .st,.sitem:focus-visible .st{transform:translateX(clamp(6px,1vw,14px))}
.sitem:hover .sar,.sitem:focus-visible .sar{opacity:1;transform:none}

.smenu .smfoot{
  flex:0 0 auto;padding-top:clamp(14px,2.4vw,26px);
  display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;
}
.smenu .small{
  font-family:var(--body);font-weight:600;font-size:14px;color:#fff;text-decoration:none;
  display:inline-flex;align-items:center;gap:8px;
  border-bottom:1px solid rgba(255,255,255,.3);padding-bottom:3px;
  transition:color .25s,border-color .25s,gap .25s;
}
.smenu .small:hover{color:var(--red);border-color:var(--red);gap:13px}
.smenu .smnote{font-family:var(--mono);font-size:10px;letter-spacing:.2em;color:#66666a}

@media (max-width:640px){
  .smenu{padding:16px 14px}
  .sitem{gap:12px;padding:9px 4px}
  .smenu .smclose{width:38px;height:38px}
  .smenu .smnote{display:none}
}
/* Landscape phones: the list must scroll rather than crush the type. */
@media (max-height:600px){
  .smenu .smlist{justify-content:flex-start}
  .sitem .st{font-size:clamp(18px,4vw,26px)}
}
@media (prefers-reduced-motion:reduce){
  .smenu,.sitem,.sitem::before,.sitem .st,.sitem .sar,.smenu .smclose{transition:none}
  .sitem{opacity:1;transform:none}
}
`;

/* "none" is for pages that carry the nav but are not in it — the legal pages,
   which are reached from the footer. Without it they would have to claim to be
   one of the three, lighting up a link that does not lead where you are. */
export type NavPage = "home" | "services" | "blogs" | "none";

const LINKS: { id: NavPage; label: string; href: string }[] = [
  { id: "home", label: "Home", href: "/" },
  { id: "blogs", label: "Blogs", href: "/blogs" },
];

/**
 * The services menu.
 *
 * Entries used to be anchors into sections of /services, because those sections
 * were all that existed. Each service now has its own page, so they point there
 * instead — the invariant is unchanged: the panel never promises a page we
 * haven't built. `SERVICE_LIST` is the single source of that truth, shared with
 * the sitemap and the route's generateStaticParams, and it carries no page copy
 * so importing it here costs nothing.
 */
const svcItemsHtml = () =>
  SERVICE_LIST.map(
    (s, i) => `<a class="sitem" href="/services/${s.slug}" style="--i:${i}" data-h>
      <span class="sn">${String(i + 1).padStart(2, "0")}</span>
      <span class="st">${s.label}</span>
      <span class="sar">→</span>
    </a>`
  ).join("\n    ");

/** `active` marks the current page; `ctaHref` differs per page (in-page anchor vs cross-page). */
export const navHtml = (active: NavPage, ctaHref = "/start-project") => `
<nav class="pnav" id="pnav" aria-label="Primary">
  <a class="pbrand" href="/" data-h aria-label="ADMIRATE home">
    <!-- The alt is real text, not "", so crawlers counting missing alts are
         satisfied. Screen readers still announce the anchor's aria-label and
         not this, so nothing is said twice. -->
    <span class="pchip"><img class="plogo" src="${LOGO}" alt="ADMIRATE" width="213" height="46" decoding="async"></span>
  </a>
  <div class="plinks">
    <a class="plink${active === "home" ? " on" : ""}" href="/"${
      active === "home" ? ' aria-current="page"' : ""
    } data-h>Home</a>
    <button type="button" class="plink pmenu${
      active === "services" ? " on" : ""
    }" id="psvc" aria-expanded="false" aria-controls="smenu" aria-haspopup="dialog" data-h>Services <span class="pcar">▼</span></button>
    <a class="plink${active === "blogs" ? " on" : ""}" href="/blogs"${
      active === "blogs" ? ' aria-current="page"' : ""
    } data-h>Blogs</a>
  </div>
  <a class="pcta" href="${ctaHref}" data-h>Start<span class="ctalong"> a project</span> <span class="ar">→</span></a>
</nav>

<div class="smenu" id="smenu" role="dialog" aria-modal="true" aria-label="Services" aria-hidden="true">
  <div class="smtop">
    <span class="smeb">SERVICES</span>
    <button type="button" class="smclose" id="smclose" aria-label="Close services menu" data-h>✕</button>
  </div>
  <div class="smlist">
    ${svcItemsHtml()}
  </div>
  <div class="smfoot">
    <a class="small" href="/services" data-h>Overview <span>→</span></a>
    <span class="smnote">STRATEGIC DESIGN &amp; MARKETING</span>
  </div>
</div>
`;

/**
 * Wires the pill's scrolled state and the services mega menu.
 * Returns a cleanup fn — every listener added here is removed there, because
 * RawPage calls it on unmount and a stray listener would leak across pages.
 */
export function initNav(): () => void {
  const stops: (() => void)[] = [];

  const nav = document.getElementById("pnav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    stops.push(() => window.removeEventListener("scroll", onScroll));
  }

  const menu = document.getElementById("smenu");
  const trigger = document.getElementById("psvc");
  const closeBtn = document.getElementById("smclose");

  if (menu && trigger) {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let open = false;

    const setOpen = (v: boolean) => {
      open = v;
      menu.classList.toggle("open", v);
      menu.setAttribute("aria-hidden", v ? "false" : "true");
      trigger.setAttribute("aria-expanded", v ? "true" : "false");
      document.body.classList.toggle("smopen", v);
      // Move focus into the panel on open and back to the trigger on close, so
      // the keyboard is never left on an element hidden behind the overlay.
      const target = v
        ? (menu.querySelector<HTMLElement>(".sitem") ?? null)
        : trigger;
      target?.focus({ preventScroll: true });
    };

    const onTrigger = (e: Event) => {
      e.preventDefault();
      setOpen(!open);
    };
    trigger.addEventListener("click", onTrigger);
    stops.push(() => trigger.removeEventListener("click", onTrigger));

    if (closeBtn) {
      const onClose = () => setOpen(false);
      closeBtn.addEventListener("click", onClose);
      stops.push(() => closeBtn.removeEventListener("click", onClose));
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    stops.push(() => document.removeEventListener("keydown", onKey));

    const onMenuClick = (e: MouseEvent) => {
      // Clicking the panel's own background closes it.
      if (e.target === menu) {
        setOpen(false);
        return;
      }

      const a = (e.target as Element).closest("a[href]");
      if (!a) return;

      const href = a.getAttribute("href") || "";
      const hash = href.indexOf("#");

      // Already on the page the item points at: scroll rather than reload.
      if (hash > -1) {
        const path = href.slice(0, hash);
        const id = href.slice(hash + 1);
        const el = id ? document.getElementById(id) : null;
        if (el && (path === location.pathname || path === "")) {
          e.preventDefault();
          setOpen(false);
          el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
          history.replaceState(null, "", href);
          return;
        }
      }

      // Otherwise let the browser navigate; just close so it isn't left open
      // behind the new page if the browser restores this one from bfcache.
      setOpen(false);
    };
    menu.addEventListener("click", onMenuClick);
    stops.push(() => menu.removeEventListener("click", onMenuClick));

    stops.push(() => document.body.classList.remove("smopen"));
  }

  return () => stops.forEach((s) => s());
}
