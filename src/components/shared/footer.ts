/**
 * The site footer — the closing screen on / and /services.
 *
 * It replaces the old #cta section rather than sitting under it: that section
 * was already a full-screen ask ("The journey starts with one click"), and two
 * large asks stacked back to back weaken each other. The headline here is the
 * link, so the conversion path the CTA carried is kept, not dropped.
 *
 * Everything it states resolves from lib/seo.ts. The address and phone in
 * particular are the same strings the LocalBusiness schema publishes — a NAP
 * that disagrees with its own structured data is read as two businesses.
 *
 * Class-scoped under .af* so it can be dropped into either page's stylesheet
 * without colliding, exactly as nav.ts is.
 */

import { asset } from "@/lib/cdn";
import { SITE, SOCIALS, telHref, WHATSAPP } from "@/lib/seo";
import { SERVICE_LIST } from "@/components/service/registry";

const LOGO = asset("admirate logo.webp");

export const FOOTER_CSS = String.raw`
/* text-align is reset explicitly: on both host pages this sits inside a section
   that centred its text for the old CTA, and the link columns inherit it. */
.afoot{position:relative;overflow:hidden;background:var(--black);color:#fff;text-align:left;padding:clamp(28px,4vh,44px) var(--pad) clamp(18px,2.4vh,26px);display:flex;flex-direction:column;gap:clamp(26px,4vh,48px);min-height:100svh;justify-content:space-between}

/* The red mass behind the headline. Two offset radial gradients under a heavy
   blur read as one organic shape rather than two circles, and drifting them on
   different durations keeps the silhouette from ever repeating exactly. It is
   painted, not photographed, so it costs nothing to download. */
.afblob{position:absolute;left:-10%;right:-10%;bottom:-22%;height:78%;z-index:0;pointer-events:none;filter:blur(58px);opacity:.85}
.afblob::before,.afblob::after{content:"";position:absolute;border-radius:50%;background:var(--red)}
.afblob::before{left:6%;bottom:0;width:62%;height:82%;animation:afdrift1 19s ease-in-out infinite}
.afblob::after{right:4%;bottom:-8%;width:54%;height:70%;opacity:.9;animation:afdrift2 24s ease-in-out infinite}
@keyframes afdrift1{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(7%,-6%) scale(1.12)}}
@keyframes afdrift2{0%,100%{transform:translate(0,0) scale(1.05)}50%{transform:translate(-8%,-4%) scale(.94)}}
.afoot>*:not(.afblob){position:relative;z-index:1}

/* ---- top rail: socials / email ---- */
.aftop{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;padding-bottom:clamp(14px,2vh,20px);border-bottom:1px solid rgba(255,255,255,.14)}
.afsoc{display:flex;gap:clamp(12px,2vw,26px);flex-wrap:wrap}
.afsoc a,.afmail{font-family:var(--body);font-weight:600;font-size:13px;color:#fff;text-decoration:none;transition:color .25s}
.afsoc a:hover{color:var(--red)}
.afmail{font-weight:400;color:#8a8a8e;font-family:var(--mono);font-size:12px}
.afmail:hover{color:#fff}

/* ---- middle: brand + link columns ---- */
.afmid{display:grid;grid-template-columns:auto 1fr;gap:clamp(24px,5vw,70px);align-items:start}
/* The wordmark is a red mark beside a near-black lockup, so it cannot sit on
   the black panel as drawn — it rides the same white chip the nav uses, which
   keeps both halves exactly as they were made. Inverting instead would turn
   the red mark cyan. */
.afbrand{display:inline-flex;background:#fff;border-radius:999px;padding:9px 15px;transition:transform .18s}
.afbrand:hover{transform:translateY(-2px)}
.afbrand img{display:block;height:20px;width:auto}
.afcols{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(18px,3vw,40px)}
.afcol h3{font-family:var(--mono);font-weight:400;font-size:10px;letter-spacing:.2em;color:#66666a;margin-bottom:14px;text-transform:uppercase}
.afcol a,.afcol span{display:block;font-family:var(--body);font-size:13.5px;line-height:1.9;color:#b4b4b8;text-decoration:none;transition:color .22s}
.afcol a:hover{color:var(--red)}
.afcol address{font-style:normal}

/* ---- the headline, which is the call to action ---- */
.afbig{display:block;text-decoration:none;color:#fff;font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(46px,12.5vw,168px);line-height:.86;letter-spacing:-.04em;transition:opacity .25s}
.afbig u{text-decoration:none;color:var(--red)}
.afbig:hover{opacity:.82}

/* ---- bottom rail ----
   White, not the #77777b grey it started as. That grey was chosen against the
   near-black panel higher up the footer, but this rail sits at the bottom of
   the red blob, and mid-grey on saturated red is the one combination that
   fails legibility from both directions — too dark to read, too light to be
   deliberate. */
.afbot{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-top:clamp(12px,1.8vh,18px);border-top:1px solid rgba(255,255,255,.14);font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:#fff}
/* Fixed width so the seconds ticking cannot shift the line beside it. */
.afclock{color:#fff;font-variant-numeric:tabular-nums}
/* Legal links sit in the bottom rail, which is where a reader looks for them.
   They inherit the rail's mono/tracked treatment so they read as fine print
   rather than competing with the sitemap columns above. The hover stays red:
   on white text over a red field it still reads as a state change, and it is
   the same hover every other link in this footer uses. */
.aflegal{display:flex;gap:clamp(14px,2vw,26px);flex-wrap:wrap}
.aflegal a{color:#fff;text-decoration:none;letter-spacing:.14em;transition:color .22s}
.aflegal a:hover{color:var(--red)}

.afoot a:focus-visible{outline:2px solid var(--red);outline-offset:3px;border-radius:3px}

@media (max-width:900px){
  .afmid{grid-template-columns:1fr;gap:26px}
  .afcols{grid-template-columns:repeat(2,minmax(0,1fr));gap:22px}
}
@media (max-width:560px){
  .afoot{min-height:0;gap:26px}
  .afcols{grid-template-columns:1fr}
  .aftop{flex-direction:column;align-items:flex-start;gap:10px}
}
@media (prefers-reduced-motion:reduce){
  .afblob::before,.afblob::after{animation:none}
}
`;

const col = (heading: string, rows: string) =>
  `<div class="afcol"><h3>${heading}</h3>${rows}</div>`;

/**
 * The sitemap column is the same four links on every page, including a link to
 * the page you are already on. That is ordinary footer behaviour and it is what
 * a crawler expects; the first attempt varied one slot per host to avoid the
 * self-link, and on /services that produced two "Home" entries side by side.
 */
/* A <footer>, not a <div>. This is the site footer on the homepage, /services,
   both legal pages and the sitemap; as a div it was invisible to anything
   navigating by landmark, while the compact rails on every other page were
   already real <footer> elements. The class is unchanged, so the stylesheet
   and the clock are untouched. */
export const footerHtml = () => `
<footer class="afoot">
  <div class="afblob" aria-hidden="true"></div>

  <div class="aftop">
    <nav class="afsoc" aria-label="Elsewhere">
      ${SOCIALS.map(
        (s) =>
          `<a href="${s.href}" target="_blank" rel="noopener noreferrer" data-h>${s.label}</a>`,
      ).join("")}
    </nav>
    <a class="afmail" href="mailto:${SITE.email}" data-h>${SITE.email}</a>
  </div>

  <div class="afmid">
    <a class="afbrand" href="/" aria-label="${SITE.name} home" data-h><img src="${LOGO}" alt="${SITE.name}" width="120" height="20"></a>
    <div class="afcols">
      ${col(
        "Sitemap",
        `<a href="/" data-h>Home</a><a href="/services" data-h>Services</a><a href="/blogs" data-h>Blogs</a><a href="/start-project" data-h>Start a project</a>`,
      )}
      ${col(
        "Services",
        SERVICE_LIST.map(
          (s) => `<a href="/services/${s.slug}" data-h>${s.label}</a>`,
        ).join(""),
      )}
      ${col(
        "Contact",
        /* "Chat on WhatsApp" rather than "WhatsApp": the same anchor text
           already appears in the rail above, and repeated anchor text over one
           destination is a link-structure warning as well as a weaker signal
           about what is on the other end. */
        `<address>
        <span>${SITE.area}, ${SITE.city}</span>
        <span>${SITE.region}, ${SITE.country}</span>
        <a href="${telHref}" data-h>${SITE.phone.replace("-", " ")}</a>
        <a href="mailto:${SITE.email}" data-h>Email us</a>
        <a href="${WHATSAPP}" target="_blank" rel="noopener noreferrer" data-h>Chat on WhatsApp</a>
      </address>`,
      )}
    </div>
  </div>

  <a class="afbig" href="/start-project" data-h>Get in touch<u>.</u></a>

  <div class="afbot">
    <span>© 2026 ${SITE.name}.IN — MADE TO CONVERT</span>
    <nav class="aflegal" aria-label="Legal and site information">
      <a href="/privacy-policy" data-h>Privacy Policy</a>
      <a href="/terms" data-h>Terms &amp; Conditions</a>
      <a href="/sitemap" data-h>Sitemap</a>
    </nav>
    <span>${SITE.city} <b class="afclock" id="afclock">--:--:--</b></span>
  </div>
</footer>`;

/**
 * Runs the clock.
 *
 * It shows the time in Hyderabad, not the visitor's — that is the whole point
 * of the line, and it is why the timezone is pinned rather than left to the
 * browser. Returns a cleanup that stops the interval.
 */
export function initFooter(): () => void {
  const el = document.getElementById("afclock");
  if (!el) return () => {};

  const fmt = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const tick = () => {
    el.textContent = fmt.format(new Date()).toUpperCase();
  };
  tick();
  const id = setInterval(tick, 1000);

  return () => clearInterval(id);
}
