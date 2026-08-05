/**
 * IDENTITY — the page about marks, built out of one mark being made.
 *
 * Set-pieces unique to this page:
 *   MARK    the hero mark draws itself out of a circle and a square, then the
 *           construction geometry retracts and leaves the letterform behind
 *   ANAT    a three-stage scroll scrub: the mark is picked out of visual
 *           noise, echoed once it is gone, then left standing alone
 *   BRANDS  a tile wall of the twelve marks now doing their job out in the
 *           world, drawn from the shared client list the landing marquee reads
 *
 * The scrub is switched off below 768px (see IS_M in init.ts), where the three
 * stages simply stack and are all visible.
 */

import { HERO_KEYWORD_CSS, heroKeyword } from "@/components/shared/hero-keyword";
import { JOURNAL_CSS, journalLinks } from "@/components/shared/journal-links";
import { clientLogo, optimized } from "@/lib/cdn";
import { CLIENT_LOGOS } from "@/components/shared/clients";

import { NAP_HTML, LEGAL_HTML } from "@/lib/seo";

export const IDENTITY_CSS = String.raw`
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
html{scroll-behavior:auto}
body{font-family:var(--body);background:var(--paper);color:var(--black);overflow-x:hidden;-webkit-font-smoothing:antialiased}
body.smopen{overflow:hidden}
::selection{background:var(--red);color:var(--white)}

/* ---------- fixed layers ---------- */
#idbg{position:fixed;inset:0;z-index:-2;background:var(--paper);transition:background-color .7s cubic-bezier(.4,0,.2,1)}
#idline{position:fixed;top:0;left:0;height:2px;width:0;background:var(--red);z-index:200}
#idrail{
  position:fixed;left:clamp(14px,2.4vw,34px);top:50%;transform:translateY(-50%);
  z-index:120;display:flex;flex-direction:column;gap:14px;
}
#idrail button{
  width:0;height:0;padding:0;border:none;background:none;cursor:pointer;
  display:flex;align-items:center;gap:10px;
}
#idrail i{
  display:block;width:18px;height:1px;background:rgba(11,11,12,.25);
  transition:width .35s cubic-bezier(.16,1,.3,1),background .35s;
}
#idrail.ondark i{background:rgba(255,255,255,.3)}
#idrail button.on i,#idrail.ondark button.on i{width:38px;background:var(--red)}

#idcur{
  position:fixed;top:0;left:0;width:30px;height:30px;border-radius:50%;
  border:1px solid var(--red);z-index:300;pointer-events:none;
  transform:translate(-50%,-50%);transition:width .25s,height .25s,background .25s;
}
body.idhover #idcur{width:56px;height:56px;background:rgba(227,0,27,.08)}

/* ---------- section frame ---------- */
.ids{position:relative;z-index:1;padding:clamp(96px,14vh,150px) var(--pad) clamp(70px,11vh,120px)}
.ids.dark{color:var(--white)}
.idh{
  font-family:var(--display);font-weight:800;font-stretch:106%;
  font-size:clamp(27px,4.6vw,60px);line-height:1.05;letter-spacing:-.026em;
  max-width:17ch;
}
.idh em{font-style:normal;color:var(--red)}
.idp{font-size:clamp(15px,1.4vw,18px);line-height:1.7;color:#4a4a4e;max-width:56ch;margin-top:18px}
.ids.dark .idp{color:#a4a4a8}

.up{opacity:0;transform:translateY(26px);transition:opacity .8s,transform .8s cubic-bezier(.16,1,.3,1)}
.ids.in .up{opacity:1;transform:none;transition-delay:var(--d,0s)}

/* ============ 1 — MARK ============
   The mark draws itself out of a circle and a square, then the construction
   geometry retracts and leaves the letterform behind. */
#mark{min-height:100svh;display:grid;grid-template-columns:1.15fr .85fr;gap:clamp(28px,5vw,80px);align-items:center}
#mark .mgrid{
  position:absolute;inset:0;z-index:0;pointer-events:none;opacity:.55;
  background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);
  background-size:clamp(54px,7vw,104px) clamp(54px,7vw,104px);
  mask-image:radial-gradient(ellipse 70% 60% at 30% 50%,#000 15%,transparent 78%);
}
#mark .mleft{position:relative;z-index:2}
#mark .crumb{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--grey);margin-bottom:clamp(20px,3.4vh,34px);display:flex;gap:10px;flex-wrap:wrap}
#mark .crumb a{color:var(--grey);text-decoration:none;transition:color .25s}
#mark .crumb a:hover{color:var(--red)}
#mark .crumb b{color:var(--black);font-weight:500}
#mark h1{
  font-family:var(--display);font-weight:900;font-stretch:114%;
  font-size:clamp(46px,8.6vw,120px);line-height:.9;letter-spacing:-.035em;
  text-transform:uppercase;
}
#mark h1 .wd{display:inline-block;white-space:nowrap}
#mark h1 .l{display:inline-block;overflow:hidden;vertical-align:bottom}
#mark h1 .l i{display:inline-block;font-style:normal;transform:translateY(102%);animation:mkrise .95s cubic-bezier(.16,1,.3,1) forwards;animation-delay:var(--d,0s)}
@keyframes mkrise{to{transform:none}}
#mark h1 u{text-decoration:none;color:var(--red)}
#mark .msub{margin-top:clamp(20px,3vh,32px)}

/* the construction stage */
#mark .mstage{position:relative;z-index:2;display:flex;align-items:center;justify-content:center}
#mstage{width:min(100%,460px);height:auto;color:var(--black);overflow:visible}
#mstage .con{stroke:var(--red);stroke-width:1;fill:none;opacity:.85;
  stroke-dasharray:var(--l,600);stroke-dashoffset:var(--l,600);
  animation:condraw 1.5s cubic-bezier(.5,0,.2,1) forwards,confade .8s ease 2.9s forwards;
  animation-delay:var(--sd,0s),2.9s;
}
#mstage .glyph{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;
  stroke-dasharray:var(--l,400);stroke-dashoffset:var(--l,400);
  animation:condraw 1.3s cubic-bezier(.5,0,.2,1) forwards;animation-delay:1.5s;
}
#mstage .fillp{opacity:0;animation:cfade .7s ease 2.6s forwards}
@keyframes condraw{to{stroke-dashoffset:0}}
@keyframes confade{to{opacity:.14}}
@keyframes cfade{to{opacity:1}}
#mark #idscroll{
  position:absolute;bottom:clamp(26px,5vh,52px);left:var(--pad);z-index:3;
  font-family:var(--mono);font-size:10px;letter-spacing:.24em;color:var(--grey);
  display:flex;align-items:center;gap:12px;
}
#idscroll .b{width:54px;height:1px;background:var(--line);overflow:hidden}
#idscroll .b i{display:block;height:100%;width:38%;background:var(--red);animation:sw 2s ease-in-out infinite}
@keyframes sw{0%{transform:translateX(-100%)}100%{transform:translateX(270%)}}

/* ============ 2 — PHILOSOPHY (scrub) ============ */
#anat{height:320vh;padding:0}
#anat .pin{position:sticky;top:0;height:100svh;display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,4vw,64px);align-items:center;padding:clamp(90px,13vh,140px) var(--pad) clamp(50px,8vh,90px)}
#anat .atext{position:relative}
#anat .astep{position:absolute;top:0;left:0;opacity:0;transform:translateY(18px);transition:opacity .45s,transform .45s cubic-bezier(.16,1,.3,1);pointer-events:none}
#anat .astep.on{opacity:1;transform:none;position:relative;pointer-events:auto}
#anat #anatsvg{width:min(100%,440px);justify-self:center;overflow:visible;color:var(--black)}
#anatsvg .nz{stroke:var(--grey);stroke-width:1.2;fill:none;opacity:.4;transition:opacity .6s ease,transform .6s cubic-bezier(.16,1,.3,1)}
#anatsvg .mm{fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round;transition:opacity .6s ease,transform .7s cubic-bezier(.16,1,.3,1);transform-origin:100px 105px}
#anatsvg .echo{fill:none;stroke:var(--red);stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round;opacity:0;transform:scale(1.12);transform-origin:100px 105px;transition:opacity .6s ease,transform .7s cubic-bezier(.16,1,.3,1)}
#anatsvg .dotp{fill:var(--red);opacity:0;transition:opacity .5s ease .15s}
#anat[data-stage="1"] .nz{opacity:0;transform:scale(.94)}
#anat[data-stage="1"] .mm{opacity:.1}
#anat[data-stage="1"] .echo{opacity:1;transform:scale(1)}
#anat[data-stage="2"] .nz{opacity:0;transform:scale(.94)}
#anat[data-stage="2"] .mm{opacity:1;transform:scale(1.05)}
#anat[data-stage="2"] .echo{opacity:0;transform:scale(.96)}
#anat[data-stage="2"] .dotp{opacity:1}
#anat .aprog{position:absolute;left:var(--pad);bottom:clamp(30px,6vh,60px);display:flex;gap:6px}
#anat .aprog i{width:26px;height:2px;background:rgba(11,11,12,.16);transition:background .35s}
#anat .aprog i.on{background:var(--red)}

/* ============ 3 — BRANDS WE'VE CRAFTED ============ */
#brands .bsub{margin-top:14px}
/* Fixed column counts rather than auto-fit. Twelve marks divide evenly by
   6/4/3/2, so every row fills at every breakpoint — auto-fit left whatever did
   not fit the last row as a bare stretch of the wall's own background, which
   read as a rendering fault rather than as space. */
#brands .bwall{margin-top:clamp(32px,5vh,56px);display:grid;grid-template-columns:repeat(6,1fr);gap:1px;background:var(--line);border:1px solid var(--line)}
.btile{position:relative;background:#fff;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;padding:clamp(18px,2.4vw,30px);overflow:hidden;transition:background .4s ease}
/* The marks are real files of assorted proportions, so each is contained
   inside the tile rather than sized to it, and --s lifts the ones whose file
   carries its own padding up to the same optical size as the rest. */
.btile img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;transform:scale(var(--s,1));transition:transform .5s cubic-bezier(.16,1,.3,1)}
/* Zythum is drawn white on transparent and would be an empty tile here. */
.btile img.inv{filter:invert(1)}
/* The tile used to go black on hover, which worked when the mark was type this
   page set itself. It cannot survive real logo files: anything black-on-
   transparent disappears, and inverting to compensate turns a two-colour mark
   into a colour negative. The lift is the hover now, and the marks stay exactly
   as their owners drew them. */
.btile:hover{background:var(--paper)}
.btile:hover img{transform:scale(calc(var(--s,1) * 1.06))}

/* ============ 4 — CLOSE ============ */
#close{position:relative;overflow:hidden}
#close .nlist{margin-top:clamp(26px,4vh,46px);border-top:1px solid rgba(255,255,255,.14)}
.nrow{display:flex;align-items:center;gap:clamp(12px,2vw,26px);padding:clamp(12px,1.9vh,20px) clamp(6px,1.4vw,16px);
  border-bottom:1px solid rgba(255,255,255,.14);text-decoration:none;color:#fff;position:relative;overflow:hidden}
.nrow::before{content:"";position:absolute;inset:0;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .45s cubic-bezier(.16,1,.3,1)}
.nrow:hover::before,.nrow:focus-visible::before{transform:scaleX(1)}
.nrow>*{position:relative;z-index:1}
.nrow .nn{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--red);transition:color .3s}
.nrow .nt{font-family:var(--display);font-weight:800;font-stretch:106%;text-transform:uppercase;font-size:clamp(19px,3.4vw,42px);line-height:1.05;letter-spacing:-.018em;transition:transform .45s cubic-bezier(.16,1,.3,1)}
.nrow .na{margin-left:auto;opacity:0;transform:translateX(-12px);transition:opacity .35s,transform .45s cubic-bezier(.16,1,.3,1)}
.nrow:hover .nn,.nrow:focus-visible .nn{color:#fff}
.nrow:hover .nt,.nrow:focus-visible .nt{transform:translateX(clamp(6px,1vw,14px))}
.nrow:hover .na,.nrow:focus-visible .na{opacity:1;transform:none}
#close .cta{margin-top:clamp(40px,7vh,78px)}
#close .cta h2{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(34px,6.4vw,92px);line-height:.96;letter-spacing:-.03em;text-transform:uppercase;color:#fff}
#close .cta h2 em{font-style:normal;color:var(--red)}
#close .csub{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--grey);margin-top:16px}
#close .btns{display:flex;gap:13px;flex-wrap:wrap;margin-top:clamp(24px,4vh,40px)}
.idbtn{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 clamp(20px,2.4vw,32px);border-radius:999px;
  font-family:var(--body);font-weight:600;font-size:14.5px;text-decoration:none;transition:transform .25s,background .25s,border-color .25s,gap .25s}
.idbtn .ar{transition:transform .25s}
.idbtn:hover .ar{transform:translateX(4px)}
.idbtn.red{background:var(--red);color:#fff}
.idbtn.red:hover{background:#c40017;transform:translateY(-2px)}
.idbtn.gh{border:1px solid rgba(255,255,255,.26);color:#fff}
.idbtn.gh:hover{border-color:#fff;background:rgba(255,255,255,.06);transform:translateY(-2px)}
#close footer{margin-top:clamp(42px,7vh,80px);padding-top:20px;border-top:1px solid rgba(255,255,255,.14);
  display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;
  font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;color:#66666a}

a:focus-visible,button:focus-visible{outline:2px solid var(--red);outline-offset:3px;border-radius:4px}

/* Twelve divides by every count used here, so the wall never ends on a part
   row at any width. */
@media (max-width:1180px){ #brands .bwall{grid-template-columns:repeat(4,1fr)} }

/* ============ MOBILE ============ */
@media (max-width:768px){
  #idrail,#idcur{display:none}
  #mark{grid-template-columns:1fr;gap:34px;min-height:auto;padding-top:clamp(96px,15vh,130px)}
  #mark .mstage{order:-1}
  #mstage{width:min(74%,300px)}
  #idscroll{position:static;margin-top:28px}
  /* The scrub is switched off below 768px (see IS_M in init.ts); the three
     philosophy stages simply stack and are all visible. */
  #anat{height:auto}
  #anat .pin{position:static;height:auto;grid-template-columns:1fr;gap:28px;padding:clamp(70px,10vh,100px) var(--pad)}
  #anat .astep{position:relative;opacity:1;transform:none;margin-bottom:24px}
  #anat .aprog{display:none}
  #anatsvg{width:min(80%,320px)}
  #brands .bwall{grid-template-columns:repeat(3,1fr)}
  .btile{aspect-ratio:16/9}
}
@media (max-width:480px){
  #mark h1{font-size:clamp(38px,12vw,56px)}
  #brands .bwall{grid-template-columns:repeat(2,1fr)}
}
@media (max-height:600px){
  #mark{min-height:auto}
  #anat{height:auto}
  #anat .pin{position:static;height:auto}
  #anat .astep{position:relative;opacity:1;transform:none;margin-bottom:20px}
}
@media (prefers-reduced-motion:reduce){
  *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
  .up{opacity:1;transform:none}
  #mark h1 .l i{transform:none;animation:none}
  #mstage .con,#mstage .glyph{stroke-dashoffset:0;animation:none}
  #mstage .con{opacity:.14}
  #mstage .fillp{opacity:1;animation:none}
  #anat{height:auto}
  #anat .pin{position:static;height:auto}
  #anat .astep{position:relative;opacity:1;transform:none;margin-bottom:22px}
  #anatsvg .nz{opacity:.4 !important;transform:none !important}
  #anatsvg .mm{opacity:1 !important;transform:none !important}
}
${JOURNAL_CSS}
${HERO_KEYWORD_CSS}
`;

/* The mark itself, shared by the hero construction and the philosophy scrub so
   the two can never drift apart. The scrub sits it 5px lower than the hero. */
const GLYPH_A = `M64 150 L100 50 L136 150`;
const GLYPH_BAR = `M80 118 H120`;
const GLYPH_A_LG = `M64 155 L100 55 L136 155`;
const GLYPH_BAR_LG = `M80 123 H120`;

/** What a mark has to do, in the order the scrub reveals it. */
const PHILOSOPHY = [
  "Recognised in an instant",
  "Remembered after it's gone",
  "Understood at a glance",
];

/* Marks out in the world. These were previously eight wordmarks this page set
   in its own typography — a recreation of each brand rather than the brand's
   own mark. They are now the real files, from the same list the landing
   marquee reads, so the wall shows what was actually delivered and covers all
   twelve clients rather than the eight that had been redrawn. */

const NEXT_SERVICES = [
  { slug: "design", label: "Design" },
  { slug: "social-media", label: "Social Media" },
  { slug: "digital", label: "Digital" },
  { slug: "video-production", label: "Video Production" },
  { slug: "brand-collaterals", label: "Brand Collaterals" },
];

const heroLine = (text: string, start: number, dot = false) => {
  const words = text.split(" ");
  let d = start;
  return words
    .map((word, wi) => {
      const letters = word
        .split("")
        .map((ch) => {
          const html = `<span class="l"><i style="--d:${d.toFixed(2)}s">${ch}</i></span>`;
          d += 0.033;
          return html;
        })
        .join("");
      /* The red full stop rides inside the final word. As a sibling element it
         is free to wrap to a line of its own, where at hero size it reads as a
         stray red block rather than punctuation. */
      const tail = dot && wi === words.length - 1 ? "<u>.</u>" : "";
      return `<span class="wd">${letters}${tail}</span>`;
    })
    .join(" ");
};

export const IDENTITY_HTML = String.raw`
<div id="idbg"></div>
<div id="idline"></div>
<div id="idrail" role="navigation" aria-label="Section"></div>
<div id="idcur" aria-hidden="true"></div>

<!-- 1 — MARK -->
<section class="ids" id="mark" data-bg="#FAFAF8" data-label="The mark">
  <div class="mgrid" aria-hidden="true"></div>
  <div class="mleft">
    <div class="crumb"><a href="/">Home</a><span>/</span><a href="/services">Services</a><span>/</span><b>Identity</b></div>
    <h1>${heroLine("BUILT TO", 0.15)}<br>${heroLine("BE KNOWN", 0.42, true)}${heroKeyword("Brand Identity & Logo Design in Hyderabad")}</h1>
    <p class="idp msub">Great logos don't explain themselves. They're recognised in an instant, remembered after one look, and simple enough to be understood at a glance.</p>
  </div>
  <div class="mstage">
    <svg id="mstage" viewBox="0 0 200 210" fill="none" role="img" aria-label="A mark being constructed from a circle and a square">
      <circle class="con" style="--l:534;--sd:0s"   cx="100" cy="100" r="85"/>
      <rect   class="con" style="--l:480;--sd:.16s" x="40" y="40" width="120" height="120"/>
      <path   class="con" style="--l:170;--sd:.3s"  d="M15 100 H185"/>
      <path   class="con" style="--l:170;--sd:.38s" d="M100 15 V185"/>
      <path class="glyph" style="--l:215" d="${GLYPH_A}"/>
      <path class="glyph" style="--l:44"  d="${GLYPH_BAR}"/>
      <circle class="fillp" cx="150" cy="150" r="6" fill="#E3001B"/>
    </svg>
  </div>
  <div id="idscroll">SCROLL<span class="b"><i></i></span></div>
</section>

<!-- 2 — PHILOSOPHY (scrub) -->
<section id="anat" data-bg="#FFFFFF" data-label="Philosophy" data-stage="0">
  <div class="pin">
    <div class="atext">
      ${PHILOSOPHY.map(
        (h, i) =>
          `<div class="astep${i === 0 ? " on" : ""}" data-i="${i}">
        <h2 class="idh">${h}</h2>
      </div>`,
      ).join("\n      ")}
    </div>
    <svg id="anatsvg" viewBox="0 0 200 200" fill="none" role="img" aria-label="A simple mark standing out from visual noise, then remaining alone">
      <circle class="nz" cx="34" cy="42" r="15"/>
      <rect class="nz" x="152" y="26" width="26" height="26"/>
      <path class="nz" d="M18 158 L34 138 L50 158 L66 138"/>
      <path class="nz" d="M158 148 H186 M158 158 H178 M158 168 H186"/>
      <circle class="nz" cx="172" cy="106" r="9"/>
      <rect class="nz" x="18" y="88" width="20" height="20" transform="rotate(18 28 98)"/>
      <path class="echo" d="${GLYPH_A_LG} ${GLYPH_BAR_LG}"/>
      <path class="mm" d="${GLYPH_A_LG}"/>
      <path class="mm" d="${GLYPH_BAR_LG}"/>
      <circle class="dotp" cx="148" cy="155" r="6"/>
    </svg>
    <div class="aprog" aria-hidden="true">${PHILOSOPHY.map(
      (_, i) => `<i${i === 0 ? ' class="on"' : ""}></i>`,
    ).join("")}</div>
  </div>
</section>

<!-- 3 — BRANDS WE'VE CRAFTED -->
<section class="ids" id="brands" data-bg="#FAFAF8" data-label="Brands">
  <h2 class="idh up">Brands we've <em>crafted</em>.</h2>
  <p class="idp bsub up" style="--d:.1s">Marks and identities now doing their job out in the world.</p>
  <div class="bwall up" style="--d:.18s">
    ${/* Through the optimizer rather than straight from storage: served raw,
          these fourteen skip Next's AVIF/WebP negotiation and arrive at full
          size for a tile that is about 180px wide. 384 is the 2x width and one
          of Next's configured imageSizes — an unconfigured width is rejected
          with a 400. */ ""}
    ${CLIENT_LOGOS.map(
      (b) =>
        `<div class="btile"><img src="${optimized(clientLogo(b.file), 384)}" alt="${b.name}"${
          b.inv ? ' class="inv"' : ""
        }${b.scale ? ` style="--s:${b.scale}"` : ""} loading="lazy" decoding="async"></div>`,
    ).join("\n    ")}
  </div>
</section>

<!-- 4 — CLOSE -->
<section class="ids dark" id="close" data-bg="#0B0B0C" data-label="Close">
  <h2 class="idh up" style="--d:.08s">The rest of what we do.</h2>
  <div class="nlist">
    ${NEXT_SERVICES.map(
      (n, i) => `<a class="nrow up" href="/services/${n.slug}" style="--d:${(0.14 + i * 0.05).toFixed(
        2,
      )}s" data-h>
      <span class="nn">${String(i + 1).padStart(2, "0")}</span>
      <span class="nt">${n.label}</span>
      <span class="na">→</span>
    </a>`,
    ).join("\n    ")}
  </div>

  <div class="cta">
    <h2 class="up">Let's build<br>your <em>identity</em>.</h2>
    <p class="csub up" style="--d:.12s">// TELL US THE GOAL. WE REPLY WITHIN ONE WORKING DAY.</p>
    <div class="btns up" style="--d:.22s">
      <a class="idbtn gh" href="/services" data-h>All services <span class="ar">→</span></a>
      <a class="idbtn red" href="/start-project?service=Identity" data-h>Start your project <span class="ar">→</span></a>
    </div>
  </div>

  ${journalLinks("what-a-logo-actually-costs", "when-to-rebrand")}

  <footer>
    <div>© 2026 ADMIRATE.IN</div>
    <div>${NAP_HTML}</div>
    <div>${LEGAL_HTML}</div>
    <div>MADE TO CONVERT</div>
  </footer>
</section>
`;

/** How many stages the philosophy scrub steps through. */
export const STAGE_COUNT = PHILOSOPHY.length;
