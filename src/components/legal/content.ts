import { NAP_HTML } from "@/lib/seo";
import type { LegalBlock, LegalDoc } from "@/components/legal/docs";

/**
 * The stylesheet and renderer shared by /privacy-policy and /terms.
 *
 * One stylesheet for both, because they are the same kind of page: a long,
 * numbered, unillustrated read that has to stay legible on a phone. The site's
 * display type is used for the h1 only — setting fifteen clause headings in
 * 900-weight Archivo would fight the text rather than organise it.
 *
 * The :root block is repeated from the other pages rather than imported,
 * because RawPage mounts exactly one stylesheet per route and these pages do
 * not load any other page's CSS. Without it the nav and footer, which resolve
 * their colours from these variables, would render unstyled.
 */

export const LEGAL_CSS = String.raw`
:root{
  --white:#FFFFFF;
  --paper:#FAFAF8;
  --black:#0B0B0C;
  --red:#E3001B;
  --grey:#8A8A8E;
  --line:#E9E9E6;
  --pad:clamp(24px,6vw,96px);
  --display:'Archivo',sans-serif;
  --body:'Inter',sans-serif;
  --mono:'IBM Plex Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--body);background:var(--paper);color:var(--black);overflow-x:hidden;-webkit-font-smoothing:antialiased}
::selection{background:var(--red);color:var(--white)}

.lgwrap{max-width:1180px;margin:0 auto;padding:0 var(--pad);position:relative;z-index:2}

/* ---- head ---- */
.lghead{position:relative;padding:clamp(120px,17vh,170px) 0 clamp(30px,5vh,48px);overflow:hidden}
.lghead .grid-bg{position:absolute;inset:0;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:110px 110px;opacity:.4;pointer-events:none}
.lghead .glow{position:absolute;top:-45%;right:-10%;width:52vw;height:52vw;max-width:760px;background:radial-gradient(circle,rgba(227,0,27,.07),transparent 62%);pointer-events:none}
.lgeb{font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--red);margin-bottom:16px;display:flex;align-items:center;gap:12px}
.lgeb::before{content:"";width:22px;height:1px;background:var(--red)}
.lghead h1{font-family:var(--display);font-weight:900;font-stretch:110%;font-size:clamp(34px,6vw,72px);line-height:1.02;letter-spacing:-.015em;text-transform:uppercase;max-width:16ch}
/* The intro is the one paragraph that is allowed to be wider and lighter than
   the body — it is a summary, not a clause. */
.lghead .lgintro{margin-top:22px;font-weight:300;font-size:clamp(16px,1.8vw,20px);color:#2c2c2f;line-height:1.6;max-width:58ch}
.lgupdated{margin-top:26px;font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:var(--grey);text-transform:uppercase}

/* ---- body ----
   68ch is the readable measure; the section index sits beside it on wide
   screens and collapses above the text on narrow ones. */
.lgbody{padding:clamp(30px,5vh,54px) 0 clamp(70px,10vh,110px);display:grid;grid-template-columns:minmax(0,1fr) 230px;gap:clamp(30px,5vw,72px);align-items:start}

.lgsec{padding-top:clamp(26px,4vh,40px);border-top:1px solid var(--line)}
.lgsec:first-child{border-top:0;padding-top:0}
.lgsec h2{font-family:var(--body);font-weight:700;font-size:clamp(19px,2.1vw,24px);letter-spacing:-.01em;line-height:1.25;margin-bottom:16px;scroll-margin-top:100px;display:flex;gap:14px}
/* The clause number is generated, so renumbering is impossible to get wrong. */
.lgsec h2 .lgn{color:var(--red);font-family:var(--mono);font-size:.72em;font-weight:400;padding-top:.28em;flex:none}
.lgsec p{font-size:16px;line-height:1.75;color:#3a3a3d;max-width:68ch;margin-bottom:14px}
.lgsec p:last-child{margin-bottom:0}
.lgsec ul{list-style:none;margin:0 0 14px;max-width:68ch}
.lgsec li{position:relative;padding-left:22px;font-size:16px;line-height:1.75;color:#3a3a3d;margin-bottom:9px}
.lgsec li::before{content:"";position:absolute;left:2px;top:.72em;width:7px;height:1px;background:var(--red)}
.lgsec strong{color:var(--black);font-weight:600}
.lgsec a{color:var(--black);text-decoration:none;border-bottom:1px solid rgba(227,0,27,.45);transition:color .2s,border-color .2s}
.lgsec a:hover{color:var(--red);border-bottom-color:var(--red)}

/* ---- section index ---- */
.lgtoc{position:sticky;top:96px}
.lgtoc h3{font-family:var(--mono);font-weight:400;font-size:10px;letter-spacing:.2em;color:var(--grey);margin-bottom:14px;text-transform:uppercase}
.lgtoc ol{list-style:none;counter-reset:t}
.lgtoc li{counter-increment:t;margin-bottom:7px}
.lgtoc a{display:flex;gap:9px;font-size:12.5px;line-height:1.5;color:#77777b;text-decoration:none;transition:color .2s}
.lgtoc a::before{content:counter(t);font-family:var(--mono);font-size:10px;color:var(--line);padding-top:.2em;flex:none}
.lgtoc a:hover{color:var(--red)}

.lgnap{margin-top:30px;padding-top:20px;border-top:1px solid var(--line);font-size:12.5px;line-height:1.7;color:var(--grey)}
.lgnap a{color:var(--grey);text-decoration:none}
.lgnap a:hover{color:var(--red)}

.lgwrap a:focus-visible,.lgtoc a:focus-visible{outline:2px solid var(--red);outline-offset:3px;border-radius:3px}

@media (max-width:900px){
  /* The index stops being a sidebar and becomes a jump list above the text. */
  .lgbody{grid-template-columns:1fr;gap:34px}
  .lgtoc{position:static;order:-1;padding-bottom:26px;border-bottom:1px solid var(--line)}
  .lgtoc ol{columns:2;column-gap:22px}
}
@media (max-width:560px){
  .lgsec h2{font-size:18px;gap:10px}
  .lgsec p,.lgsec li{font-size:15.5px}
  .lgtoc ol{columns:1}
}
`;

/** Escapes text that goes into markup. */
const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Inline formatting for clause text: `**bold**` and `[label](href)`.
 *
 * Escaping runs first, so a stray `<` in a clause can never open a tag; the
 * two patterns are then applied to the already-safe string. External
 * destinations get `rel="noopener noreferrer"` and open in a new tab, while
 * root-relative and `mailto:` links stay in place — a policy that threw the
 * reader into a new tab to reach our own privacy page would be its own
 * small usability bug.
 */
const inline = (s: string) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) => {
      const external = /^https?:/i.test(href);
      const attrs = external
        ? ' target="_blank" rel="noopener noreferrer"'
        : " data-h";
      return `<a href="${href}"${attrs}>${label}</a>`;
    });

const block = (b: LegalBlock) =>
  b.t === "p"
    ? `<p>${inline(b.c)}</p>`
    : `<ul>${b.c.map((li) => `<li>${inline(li)}</li>`).join("")}</ul>`;

/** Stable anchor for a heading, so the index links and deep links survive. */
const anchor = (h: string) =>
  h
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export const legalHtml = (doc: LegalDoc) => `
<section class="lghead">
  <div class="grid-bg" aria-hidden="true"></div>
  <div class="glow" aria-hidden="true"></div>
  <div class="lgwrap">
    <div class="lgeb">LEGAL</div>
    <h1>${esc(doc.title)}</h1>
    <p class="lgintro">${inline(doc.intro)}</p>
    <p class="lgupdated">Last updated <time datetime="${esc(doc.updated)}">${fmtDate(doc.updated)}</time></p>
  </div>
</section>

<div class="lgwrap">
  <div class="lgbody">
    <div class="lgmain">
      ${doc.sections
        .map(
          (s, i) => `<section class="lgsec">
        <h2 id="${anchor(s.h)}"><span class="lgn">${String(i + 1).padStart(2, "0")}</span>${esc(s.h)}</h2>
        ${s.body.map(block).join("\n        ")}
      </section>`,
        )
        .join("\n      ")}
    </div>

    <nav class="lgtoc" aria-label="Sections">
      <h3>On this page</h3>
      <ol>
        ${doc.sections
          .map((s) => `<li><a href="#${anchor(s.h)}">${esc(s.h)}</a></li>`)
          .join("\n        ")}
      </ol>
      <p class="lgnap">${NAP_HTML}</p>
    </nav>
  </div>
</div>
`;
