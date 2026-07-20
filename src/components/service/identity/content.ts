import { SITE } from "@/lib/seo";

/**
 * IDENTITY — a page about marks, built as one.
 *
 * Authored the way /landing and /services are: a raw stylesheet and a raw HTML
 * document, driven by an imperative init.ts. Nothing here is shared with the
 * other service pages by design — the brief was six pages that do not look
 * alike, and a shared section grammar is exactly what made them look alike.
 *
 * The journey, and why it is in this order:
 *   1 MARK      the mark assembles out of its own construction geometry
 *   2 HALFSEC   the recognition test — the page's central claim, made playable
 *   3 ANATOMY   the mark taken apart against its grid (scrub)
 *   4 SYSTEM    mark becomes system: type, colour, rules
 *   5 SCALE     the same mark from 16px to hoarding
 *   6 PROOF     real clients
 *   7 DEPTH     the long argument
 *   8 CLOSE     onward links + CTA
 *
 * Selectors are prefixed `id-` or are unique ids, so this sheet cannot collide
 * with the other pages' identically-named selectors when RawPage mounts it.
 */

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
.ideb{
  font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--red);
  display:flex;align-items:center;gap:11px;margin-bottom:16px;
}
.ideb::after{content:"";height:1px;width:clamp(26px,5vw,60px);background:currentColor;opacity:.45}
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
#mark .mcap{
  position:absolute;bottom:-4px;left:50%;transform:translateX(-50%);
  font-family:var(--mono);font-size:10px;letter-spacing:.22em;color:var(--grey);white-space:nowrap;
  opacity:0;animation:cfade .6s ease 3.2s forwards;
}
#idscroll{
  position:absolute;bottom:clamp(26px,5vh,52px);left:var(--pad);z-index:3;
  font-family:var(--mono);font-size:10px;letter-spacing:.24em;color:var(--grey);
  display:flex;align-items:center;gap:12px;
}
#idscroll .b{width:54px;height:1px;background:var(--line);overflow:hidden}
#idscroll .b i{display:block;height:100%;width:38%;background:var(--red);animation:sw 2s ease-in-out infinite}
@keyframes sw{0%{transform:translateX(-100%)}100%{transform:translateX(270%)}}

/* ============ 2 — HALF A SECOND ============
   The claim, made playable: a mark is shown for 500ms and taken away. */
#half{background:transparent;min-height:100svh;display:flex;flex-direction:column;justify-content:center}
#half .hwrap{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(30px,5vw,80px);align-items:center}
#flash{
  position:relative;aspect-ratio:16/10;width:100%;
  background:#141417;border:1px solid rgba(255,255,255,.12);border-radius:6px;
  display:flex;align-items:center;justify-content:center;overflow:hidden;
}
#flash .shot{
  position:absolute;inset:0;display:flex;align-items:center;justify-content:center;
  opacity:0;transition:opacity .06s linear;
}
#flash.lit .shot{opacity:1}
#flash .shot svg{width:34%;height:auto}
#flash .prompt{
  font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:#55555a;text-align:center;padding:0 20px;
}
#flash.lit .prompt,#flash.running .prompt{opacity:0}
#flash .timer{
  position:absolute;left:0;bottom:0;height:3px;width:0;background:var(--red);
}
#flash.running .timer{width:100%;transition:width .5s linear}
#flash .grain2{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,.5))}
#half .opts{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
#half .opt{
  font-family:var(--mono);font-size:11px;letter-spacing:.14em;
  background:none;border:1px solid rgba(255,255,255,.2);color:#c8c8cc;
  padding:11px 16px;border-radius:999px;cursor:pointer;
  transition:border-color .25s,color .25s,background .25s;
}
#half .opt:hover{border-color:var(--red);color:#fff}
#half .opt.right{border-color:var(--red);background:var(--red);color:#fff}
#half .opt.wrong{border-color:rgba(255,255,255,.14);color:#5a5a5e}
#half .play{
  display:inline-flex;align-items:center;gap:10px;margin-top:24px;min-height:46px;
  padding:0 24px;border-radius:999px;background:var(--red);color:#fff;border:none;
  font-family:var(--body);font-weight:600;font-size:14px;cursor:pointer;
  transition:background .25s,transform .25s;
}
#half .play:hover{background:#c40017;transform:translateY(-2px)}
#half .play:disabled{opacity:.45;cursor:default;transform:none}
#hres{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--red);margin-top:18px;min-height:1.4em}

/* ============ 3 — ANATOMY (scrub) ============ */
#anat{height:320vh;padding:0}
#anat .pin{position:sticky;top:0;height:100svh;display:grid;grid-template-columns:1fr 1fr;gap:clamp(24px,4vw,64px);align-items:center;padding:clamp(90px,13vh,140px) var(--pad) clamp(50px,8vh,90px)}
#anat .atext{position:relative}
#anat .astep{position:absolute;top:0;left:0;opacity:0;transform:translateY(18px);transition:opacity .45s,transform .45s cubic-bezier(.16,1,.3,1);pointer-events:none}
#anat .astep.on{opacity:1;transform:none;position:relative;pointer-events:auto}
#anat .anum{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--red);margin-bottom:12px}
#anatsvg{width:min(100%,440px);justify-self:center;overflow:visible;color:var(--black)}
#anatsvg .g{stroke:var(--red);stroke-width:1;fill:none;opacity:0;transition:opacity .4s}
#anatsvg .g.on{opacity:.8}
#anatsvg .letter{fill:none;stroke:currentColor;stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}
#anatsvg .dimtxt{font-family:var(--mono);font-size:7px;letter-spacing:.12em;fill:var(--red);opacity:0;transition:opacity .4s}
#anatsvg .dimtxt.on{opacity:1}
#anat .aprog{position:absolute;left:var(--pad);bottom:clamp(30px,6vh,60px);display:flex;gap:6px}
#anat .aprog i{width:26px;height:2px;background:rgba(11,11,12,.16);transition:background .35s}
#anat .aprog i.on{background:var(--red)}

/* ============ 4 — SYSTEM ============ */
#sys .sgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,240px),1fr));gap:1px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.14);margin-top:clamp(34px,5vh,58px)}
.scard{background:var(--black);padding:clamp(22px,2.6vw,34px);display:flex;flex-direction:column;gap:14px;min-height:230px}
.scard .sn{font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;color:var(--red)}
.scard h3{font-family:var(--display);font-weight:800;font-stretch:104%;text-transform:uppercase;font-size:clamp(16px,1.7vw,21px);letter-spacing:-.008em;color:#fff}
.scard p{font-size:14px;line-height:1.62;color:#9a9a9e}
.scard .demo{margin-top:auto;height:56px;display:flex;align-items:flex-end;gap:7px}
.scard .sw{flex:1;border-radius:3px;height:100%}
.scard .tyA{font-family:var(--display);font-weight:900;font-stretch:118%;font-size:30px;color:#fff;line-height:1}
.scard .tyB{font-family:var(--body);font-weight:400;font-size:13px;color:#8a8a8e}
.scard .rulez{display:flex;flex-direction:column;gap:6px;width:100%}
.scard .rulez span{height:2px;background:rgba(255,255,255,.22);border-radius:2px}

/* ============ 5 — SCALE ============ */
#scale{overflow:hidden}
#scale .track{display:flex;align-items:flex-end;gap:clamp(22px,4vw,64px);margin-top:clamp(36px,6vh,62px);flex-wrap:wrap}
.szitem{display:flex;flex-direction:column;align-items:center;gap:12px}
.szbox{display:flex;align-items:center;justify-content:center;color:var(--black)}
.szitem span{font-family:var(--mono);font-size:10px;letter-spacing:.16em;color:var(--grey);white-space:nowrap}
.szbox svg{width:100%;height:100%;display:block}

/* ============ 6 — PROOF ============ */
#proof .plist{margin-top:clamp(30px,5vh,52px);border-top:1px solid var(--line)}
.prow{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:clamp(14px,3vw,40px);align-items:center;
  padding:clamp(18px,2.6vh,30px) 0;border-bottom:1px solid var(--line);position:relative;overflow:hidden}
.prow::before{content:"";position:absolute;inset:0;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .5s cubic-bezier(.16,1,.3,1)}
.prow>*{position:relative;z-index:1;transition:color .35s}
.prow:hover::before{transform:scaleX(1)}
.prow .pn{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--red)}
.prow .pnm{font-family:var(--display);font-weight:800;font-stretch:106%;text-transform:uppercase;font-size:clamp(19px,3vw,38px);line-height:1.08;letter-spacing:-.018em;transition:transform .45s cubic-bezier(.16,1,.3,1),color .35s}
.prow .pd{font-size:13.5px;line-height:1.5;color:#5a5a5e;max-width:54ch}
.prow .pt{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;color:var(--grey);white-space:nowrap}
.prow:hover .pn,.prow:hover .pd,.prow:hover .pt{color:rgba(255,255,255,.88)}
.prow:hover .pnm{color:#fff;transform:translateX(clamp(5px,1vw,12px))}

/* ============ 7 — DEPTH ============ */
#depth .dwrap{max-width:68ch;margin-top:clamp(30px,5vh,52px)}
#depth h3{font-family:var(--display);font-weight:800;font-stretch:104%;font-size:clamp(19px,2.2vw,28px);line-height:1.2;letter-spacing:-.015em;margin:clamp(32px,5vh,54px) 0 13px}
#depth p{font-size:clamp(15px,1.35vw,17.5px);line-height:1.78;color:#4a4a4e;margin-bottom:19px}
#depth .dwrap>p:first-of-type::first-letter{font-family:var(--display);font-weight:900;font-stretch:110%;float:left;font-size:3.5em;line-height:.82;padding:6px 12px 0 0;color:var(--red)}

/* ============ 8 — CLOSE ============ */
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

/* ============ MOBILE ============ */
@media (max-width:768px){
  #idrail,#idcur{display:none}
  #mark{grid-template-columns:1fr;gap:34px;min-height:auto;padding-top:clamp(96px,15vh,130px)}
  #mark .mstage{order:-1}
  #mstage{width:min(74%,300px)}
  #idscroll{position:static;margin-top:28px}
  #half .hwrap{grid-template-columns:1fr;gap:26px}
  /* The scrub is switched off below 768px (see IS_M in init.ts); the three
     anatomy stages simply stack and are all visible. */
  #anat{height:auto}
  #anat .pin{position:static;height:auto;grid-template-columns:1fr;gap:28px;padding:clamp(70px,10vh,100px) var(--pad)}
  #anat .astep{position:relative;opacity:1;transform:none;margin-bottom:24px}
  #anat .aprog{display:none}
  #anatsvg{width:min(80%,320px)}
  .prow{grid-template-columns:auto minmax(0,1fr);row-gap:7px}
  .prow .pt{grid-column:2;justify-self:start}
}
@media (max-width:480px){
  #mark h1{font-size:clamp(38px,12vw,56px)}
  #scale .track{gap:18px}
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
  #mstage .fillp,#mark .mcap{opacity:1;animation:none}
  #anat{height:auto}
  #anat .pin{position:static;height:auto}
  #anat .astep{position:relative;opacity:1;transform:none;margin-bottom:22px}
}
`;

/* ---------- the construction mark, shared by hero and anatomy ---------- */
const GLYPH_A = `M64 150 L100 50 L136 150`;
const GLYPH_BAR = `M80 118 H120`;

/** Small solid mark used in the flash test and the scale ladder. */
const solidMark = () =>
  `<svg viewBox="0 0 200 200" fill="none" aria-hidden="true">
     <path d="${GLYPH_A}" fill="none" stroke="currentColor" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
     <path d="${GLYPH_BAR}" fill="none" stroke="currentColor" stroke-width="14" stroke-linecap="round"/>
   </svg>`;

/* Decoys for the recognition test. Deliberately generic — the point of the
   exercise is that a category-standard mark is hard to tell from its
   neighbours, which is the argument the section is making. */
const decoyMark = (n: number) => {
  const shapes = [
    `<circle cx="100" cy="100" r="52" stroke="currentColor" stroke-width="14" fill="none"/>`,
    `<rect x="52" y="52" width="96" height="96" rx="16" stroke="currentColor" stroke-width="14" fill="none"/>`,
    `<path d="M50 140 L100 55 L150 140 Z" stroke="currentColor" stroke-width="14" fill="none" stroke-linejoin="round"/>`,
  ];
  return `<svg viewBox="0 0 200 200" fill="none" aria-hidden="true">${shapes[n]}</svg>`;
};

const SIZES = [
  { px: 16, label: "16PX — FAVICON" },
  { px: 28, label: "28PX — APP ICON" },
  { px: 52, label: "52PX — PROFILE" },
  { px: 92, label: "92PX — CARD" },
  { px: 150, label: "150PX — SIGNAGE" },
];

const SYSTEM_CARDS = [
  {
    n: "01",
    h: "The mark",
    p: "One shape, drawn to survive every size and a single flat colour.",
    demo: `<div class="tyA">A<span style="color:var(--red)">.</span></div>`,
  },
  {
    n: "02",
    h: "The type",
    p: "A hierarchy with a job for every level — headline, body, and the four-word version.",
    demo: `<div><div class="tyA">Aa</div><div class="tyB">Archivo · Inter · Plex Mono</div></div>`,
  },
  {
    n: "03",
    h: "The colour",
    p: "Defined for screen and for press, with contrast checked rather than assumed.",
    demo: `<div class="demo">
      <span class="sw" style="background:#E3001B"></span>
      <span class="sw" style="background:#0B0B0C"></span>
      <span class="sw" style="background:#FAFAF8"></span>
      <span class="sw" style="background:#8A8A8E"></span>
    </div>`,
  },
  {
    n: "04",
    h: "The rules",
    p: "Written plainly enough that someone who has never met you applies them correctly.",
    demo: `<div class="rulez"><span style="width:100%"></span><span style="width:72%"></span><span style="width:88%"></span><span style="width:54%"></span></div>`,
  },
];

const ANATOMY_STEPS = [
  {
    n: "STAGE 01",
    h: "It starts as geometry",
    p: "Before it is a letter it is a circle and a square — a grid that decides the proportions, the angles and the optical centre. Marks drawn without one look almost right, and stay that way.",
  },
  {
    n: "STAGE 02",
    h: "The letterform is cut from it",
    p: "The shape is taken out of the construction, not drawn beside it. Every terminal, angle and join lands on the grid, which is what makes the result feel inevitable rather than arranged.",
  },
  {
    n: "STAGE 03",
    h: "Then the scaffolding goes",
    p: "The grid is removed and what remains has to hold on its own — at a hoarding, at sixteen pixels, in one flat colour, stitched into fabric. If it needs the scaffolding to look right, it is not finished.",
  },
];

const PROOF = [
  {
    n: "South Glass",
    t: "Identity · Web",
    d: "Glass and facades, established 2014. A technical product made to feel premium rather than industrial.",
  },
  {
    n: "Hope Trust India",
    t: "Brand · Content",
    d: "Addiction and mental-health care — an identity that had to feel safe to approach at someone's lowest moment.",
  },
  {
    n: "Patil Group",
    t: "Corporate",
    d: "The world's largest sleeper manufacturer, fifty years on the job. Scale carried without raising its voice.",
  },
  {
    n: "Our Sacred Space",
    t: "Arts · Culture",
    d: "Art, movement and mindful living, held together by one calm and consistent face.",
  },
];

const NEXT_SERVICES = [
  { slug: "design", label: "Design" },
  { slug: "social-media", label: "Social Media" },
  { slug: "digital", label: "Digital" },
  { slug: "video-production", label: "Video Production" },
  { slug: "brand-collaterals", label: "Brand Collaterals" },
];

/**
 * Splits a hero line into per-letter spans for the stagger.
 *
 * Letters are grouped into a nowrap word wrapper. Without it the browser is
 * free to break between any two inline-block letters, which is exactly what it
 * did at 1440px — "BE KNOWN" wrapped as "BE KNOW" / "N.".
 */
const heroLine = (text: string, start: number, dot = false) => {
  const words = text.split(" ");
  let d = start;
  return words
    .map((word, wi) => {
      const letters = word
        .split("")
        .map((ch) => {
          const html = `<span class="l"><i style="--d:${d.toFixed(
            2
          )}s">${ch}</i></span>`;
          d += 0.032;
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
    <h1>${heroLine("BUILT TO", 0.15)}<br>${heroLine("BE KNOWN", 0.42, true)}</h1>
    <p class="idp msub">A logo is the smallest part of it. Identity is the system that makes a brand recognisable before anyone has read its name — and impossible to confuse with the company beside it.</p>
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
    <span class="mcap">CIRCLE + SQUARE + GRID → ONE MARK</span>
  </div>
  <div id="idscroll">SCROLL<span class="b"><i></i></span></div>
</section>

<!-- 2 — HALF A SECOND -->
<section class="ids dark" id="half" data-bg="#0B0B0C" data-label="Half a second">
  <div class="hwrap">
    <div>
      <div class="ideb up">THE TEST</div>
      <h2 class="idh up" style="--d:.08s">You get about <em>half a second</em>.</h2>
      <p class="idp up" style="--d:.16s">That is roughly how long a mark has in a feed, on a shelf or at the side of a road. Not long enough to read anything. Long enough to recognise something — if there is something there to recognise.</p>
      <button type="button" class="play up" id="hplay" style="--d:.24s" data-h>Run the test <span>→</span></button>
      <div id="hres" role="status" aria-live="polite"></div>
    </div>
    <div class="up" style="--d:.14s">
      <div id="flash">
        <div class="prompt" id="hprompt">PRESS RUN — A MARK WILL APPEAR FOR 0.5 SECONDS</div>
        <div class="shot" id="hshot"></div>
        <div class="grain2" aria-hidden="true"></div>
        <div class="timer" id="htimer"></div>
      </div>
      <div class="opts" id="hopts" hidden></div>
    </div>
  </div>
</section>

<!-- 3 — ANATOMY (scrub) -->
<section id="anat" data-bg="#FFFFFF" data-label="Anatomy">
  <div class="pin">
    <div class="atext">
      <div class="ideb">ANATOMY</div>
      ${ANATOMY_STEPS.map(
        (s, i) => `<div class="astep${i === 0 ? " on" : ""}" data-i="${i}">
        <div class="anum">${s.n}</div>
        <h2 class="idh">${s.h}</h2>
        <p class="idp">${s.p}</p>
      </div>`
      ).join("\n      ")}
    </div>
    <svg id="anatsvg" viewBox="0 0 200 200" fill="none" role="img" aria-label="The mark dissected against its construction grid">
      <circle class="g" id="ag1" cx="100" cy="100" r="85"/>
      <rect   class="g" id="ag2" x="40" y="40" width="120" height="120"/>
      <path   class="g" id="ag3" d="M15 100 H185"/>
      <path   class="g" id="ag4" d="M100 15 V185"/>
      <path   class="g" id="ag5" d="M64 150 L136 150"/>
      <text class="dimtxt" id="ad1" x="104" y="34">R 85</text>
      <text class="dimtxt" id="ad2" x="104" y="163">BASELINE</text>
      <path class="letter" d="${GLYPH_A}"/>
      <path class="letter" d="${GLYPH_BAR}"/>
    </svg>
    <div class="aprog" aria-hidden="true"><i class="on"></i><i></i><i></i></div>
  </div>
</section>

<!-- 4 — SYSTEM -->
<section class="ids dark" id="sys" data-bg="#0B0B0C" data-label="The system">
  <div class="ideb up">THE SYSTEM</div>
  <h2 class="idh up" style="--d:.08s">A mark alone is not an identity. <em>This</em> is.</h2>
  <p class="idp up" style="--d:.16s">Four parts, and the rules that hold them together — so the next thing nobody has designed yet still comes out looking like you.</p>
  <div class="sgrid">
    ${SYSTEM_CARDS.map(
      (c, i) => `<article class="scard up" style="--d:${(0.22 + i * 0.07).toFixed(2)}s">
      <span class="sn">${c.n}</span>
      <h3>${c.h}</h3>
      <p>${c.p}</p>
      ${c.demo}
    </article>`
    ).join("\n    ")}
  </div>
</section>

<!-- 5 — SCALE -->
<section class="ids" id="scale" data-bg="#FAFAF8" data-label="Every size">
  <div class="ideb up">EVERY SIZE</div>
  <h2 class="idh up" style="--d:.08s">Approved large. <em>Lived</em> small.</h2>
  <p class="idp up" style="--d:.16s">Most marks are signed off at a size they will almost never appear at. This is the same shape at the sizes it will actually spend its life.</p>
  <div class="track">
    ${SIZES.map(
      (s, i) => `<div class="szitem up" style="--d:${(0.22 + i * 0.06).toFixed(2)}s">
      <div class="szbox" style="width:${s.px}px;height:${s.px}px">${solidMark()}</div>
      <span>${s.label}</span>
    </div>`
    ).join("\n    ")}
  </div>
</section>

<!-- 6 — PROOF -->
<section class="ids" id="proof" data-bg="#FFFFFF" data-label="Proof">
  <div class="ideb up">PROOF</div>
  <h2 class="idh up" style="--d:.08s">Brands this work has already <em>carried</em>.</h2>
  <div class="plist">
    ${PROOF.map(
      (p, i) => `<div class="prow up" style="--d:${(0.16 + i * 0.05).toFixed(2)}s">
      <span class="pn">${String(i + 1).padStart(2, "0")}</span>
      <span><span class="pnm">${p.n}</span><br><span class="pd">${p.d}</span></span>
      <span class="pt">${p.t.toUpperCase()}</span>
    </div>`
    ).join("\n    ")}
  </div>
</section>

<!-- 7 — DEPTH -->
<section class="ids" id="depth" data-bg="#FAFAF8" data-label="In depth">
  <div class="ideb up">IN DEPTH</div>
  <h2 class="idh up" style="--d:.08s">The long version, for anyone who wants it.</h2>
  <div class="dwrap up" style="--d:.16s">
    <p>Recognition is not the same as memory. People rarely fail to remember a brand outright — what actually happens is quieter and more expensive: they remember something, and attach it to the wrong company. They recall a colour three competitors also use, a typeface that came with the website template, a mark that reads in a presentation and turns to mush in a browser tab.</p>
    <h3>A logo is not an identity</h3>
    <p>A logo is one asset. An identity is the set of decisions that make every future asset obviously yours — including the ones nobody has designed yet. When the system is real, an intern can lay out a slide nobody briefed and it still looks like you. When it is not, every new piece is a negotiation, and the brand drifts a little further each time.</p>
    <p>That drift is the actual cost, and it is invisible month to month. A slightly different red here. A heavier typeface there because the licensed one was inconvenient. Six months later the deck, the site and the packaging look like three companies that share a name. Nobody made a bad decision; there was simply nothing to decide against.</p>
    <h3>Different on purpose, not by accident</h3>
    <p>Every industry has a default look, and defaults are comfortable precisely because they are shared. Sector-standard blue. The same three sans-serifs. Stock photography of people who have never used the product. It is safe, and it makes you interchangeable. Distinctiveness is not decoration here — it is the mechanism. A brand that looks like its category has to buy recognition with media spend. A brand that looks like itself earns it every time someone sees it.</p>
    <h3>Built to be handed over</h3>
    <p>An identity that only works while its designers are still involved has not finished. The system has to be documented plainly enough that your team, your printer and your next developer apply it correctly without asking — and structured well enough that when something genuinely new comes up, the right answer is obvious rather than invented.</p>
  </div>
</section>

<!-- 8 — CLOSE -->
<section class="ids dark" id="close" data-bg="#0B0B0C" data-label="Close">
  <div class="ideb up">KEEP GOING</div>
  <h2 class="idh up" style="--d:.08s">The rest of what we do.</h2>
  <div class="nlist">
    ${NEXT_SERVICES.map(
      (s, i) => `<a class="nrow up" href="/services/${s.slug}" style="--d:${(0.14 + i * 0.05).toFixed(2)}s" data-h>
      <span class="nn">${String(i + 1).padStart(2, "0")}</span>
      <span class="nt">${s.label}</span>
      <span class="na">→</span>
    </a>`
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

  <footer>
    <div>© 2026 ${SITE.name}.IN</div>
    <div>MADE TO CONVERT</div>
  </footer>
</section>
`;

/** Marks the flash test uses. Exported so init.ts does not redraw them. */
export const FLASH_MARKS = {
  real: solidMark(),
  decoys: [decoyMark(0), decoyMark(1), decoyMark(2)],
};
