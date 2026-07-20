/**
 * BRAND COLLATERALS — a page about physical things, built with depth and light.
 *
 * Set-pieces unique to this page:
 *   SHELF  four objects on a lit shelf that rotate and rise into place as the
 *          section is scrubbed, each one taking its turn under the light
 *   PRESS  a draggable divider between a colour as approved on screen and the
 *          same colour as it lands on stock — the one argument on this page
 *          that a screen genuinely struggles to make, which is the point
 *
 * Print partners, materials and lead times are stated nowhere: the repository
 * records none of them, and they are exactly the detail a client is held to.
 */

export const COLLAT_CSS = String.raw`
:root{
  --white:#FFFFFF;--paper:#FAFAF8;--warm:#FBF7F1;--black:#0B0B0C;--red:#E3001B;
  --grey:#8A8A8E;--line:#E9E9E6;--pad:clamp(24px,6vw,96px);
  --display:'Archivo',sans-serif;--body:'Inter',sans-serif;--mono:'IBM Plex Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:auto}
body{font-family:var(--body);background:var(--warm);color:var(--black);overflow-x:hidden;-webkit-font-smoothing:antialiased}
body.smopen{overflow:hidden}
::selection{background:var(--red);color:var(--white)}

#cbg{position:fixed;inset:0;z-index:-2;background:var(--warm);transition:background-color .7s cubic-bezier(.4,0,.2,1)}
#cline{position:fixed;top:0;left:0;height:2px;width:0;background:var(--red);z-index:200}
#crail{position:fixed;left:clamp(14px,2.4vw,34px);top:50%;transform:translateY(-50%);z-index:120;display:flex;flex-direction:column;gap:14px}
#crail button{padding:0;border:none;background:none;cursor:pointer;display:flex;align-items:center}
#crail i{display:block;width:18px;height:1px;background:rgba(11,11,12,.25);transition:width .35s cubic-bezier(.16,1,.3,1),background .35s}
#crail.ondark i{background:rgba(255,255,255,.3)}
#crail button.on i,#crail.ondark button.on i{width:38px;background:var(--red)}

.cs{position:relative;z-index:1;padding:clamp(96px,14vh,150px) var(--pad) clamp(70px,11vh,120px)}
.cs.dark{color:var(--white)}
.ceb{font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--red);display:flex;align-items:center;gap:11px;margin-bottom:16px}
.ceb::after{content:"";height:1px;width:clamp(26px,5vw,60px);background:currentColor;opacity:.45}
.ch{font-family:var(--display);font-weight:800;font-stretch:106%;font-size:clamp(27px,4.6vw,60px);line-height:1.05;letter-spacing:-.026em;max-width:17ch}
.ch em{font-style:normal;color:var(--red)}
.cp{font-size:clamp(15px,1.4vw,18px);line-height:1.7;color:#4a4a4e;max-width:56ch;margin-top:18px}
.cs.dark .cp{color:#a4a4a8}
.up{opacity:0;transform:translateY(26px);transition:opacity .8s,transform .8s cubic-bezier(.16,1,.3,1)}
.cs.in .up,#shelf.in .up{opacity:1;transform:none;transition-delay:var(--d,0s)}

/* ============ 1 — HERO ============ */
#chero{min-height:100svh;display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(28px,5vw,76px);align-items:center}
#chero .crumb{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--grey);margin-bottom:clamp(20px,3.4vh,34px);display:flex;gap:10px;flex-wrap:wrap}
#chero .crumb a{color:var(--grey);text-decoration:none;transition:color .25s}
#chero .crumb a:hover{color:var(--red)}
#chero .crumb b{color:var(--black);font-weight:500}
#chero h1{font-family:var(--display);font-weight:900;font-stretch:114%;font-size:clamp(40px,7.8vw,110px);line-height:.9;letter-spacing:-.035em;text-transform:uppercase}
#chero h1 .wd{display:inline-block;white-space:nowrap}
#chero h1 .l{display:inline-block;overflow:hidden;vertical-align:bottom}
#chero h1 .l i{display:inline-block;font-style:normal;transform:translateY(102%);animation:cr .95s cubic-bezier(.16,1,.3,1) forwards;animation-delay:var(--d,0s)}
@keyframes cr{to{transform:none}}
#chero h1 u{text-decoration:none;color:var(--red)}
/* a card resting at an angle, catching light */
#chero .cardwrap{display:flex;justify-content:center;perspective:1100px}
#chero .bizcard{
  width:min(78%,300px);aspect-ratio:1.72;border-radius:5px;position:relative;
  background:linear-gradient(135deg,#141417,#0b0b0c);
  box-shadow:0 34px 62px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.07);
  transform:rotateX(46deg) rotateZ(-19deg);
  animation:hover 8s ease-in-out infinite;
  display:flex;align-items:center;justify-content:center;
}
@keyframes hover{0%,100%{transform:rotateX(46deg) rotateZ(-19deg) translateY(0)}50%{transform:rotateX(42deg) rotateZ(-16deg) translateY(-16px)}}
#chero .bizcard .mk{font-family:var(--display);font-weight:900;font-stretch:116%;font-size:clamp(26px,4vw,46px);color:#fff}
#chero .bizcard .mk span{color:var(--red)}
#chero .bizcard::after{
  content:"";position:absolute;inset:0;border-radius:5px;pointer-events:none;
  background:linear-gradient(118deg,transparent 38%,rgba(255,255,255,.16) 50%,transparent 62%);
}
#chero .shadow{width:min(60%,230px);height:16px;margin:26px auto 0;border-radius:50%;background:rgba(11,11,12,.16);filter:blur(11px)}

/* ============ 2 — SHELF (scrub) ============ */
#shelf{height:340vh;padding:0}
#shelf .pin{position:sticky;top:0;height:100svh;display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(26px,4vw,68px);align-items:center;padding:clamp(90px,13vh,140px) var(--pad) clamp(50px,8vh,90px)}
#shelf .stext{position:relative}
#shelf .sstep{position:absolute;top:0;left:0;opacity:0;transform:translateY(16px);transition:opacity .4s,transform .4s cubic-bezier(.16,1,.3,1);pointer-events:none}
#shelf .sstep.on{opacity:1;transform:none;position:relative;pointer-events:auto}
#shelf .snum{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--red);margin-bottom:11px}
.stage{position:relative;perspective:1300px;display:flex;align-items:center;justify-content:center;min-height:min(58vh,440px)}
.stage .band{position:absolute;left:6%;right:6%;top:50%;height:1px;background:linear-gradient(90deg,transparent,rgba(227,0,27,.4),transparent)}
.obj{
  position:absolute;transition:opacity .55s,transform .75s cubic-bezier(.16,1,.3,1);
  opacity:0;transform:translateY(30px) rotateX(52deg) rotateZ(-18deg) scale(.86);
  transform-style:preserve-3d;
}
.obj.on{opacity:1;transform:translateY(0) rotateX(42deg) rotateZ(-14deg) scale(1)}
.obj .lbl{
  position:absolute;left:50%;bottom:-38px;transform:translateX(-50%) rotateX(-42deg) rotateZ(14deg);
  font-family:var(--mono);font-size:10px;letter-spacing:.18em;color:var(--grey);white-space:nowrap;
}
/* the four objects */
.o-card{width:clamp(150px,22vw,250px);aspect-ratio:1.72;border-radius:5px;background:linear-gradient(135deg,#17171a,#0b0b0c);box-shadow:0 30px 52px rgba(0,0,0,.3)}
.o-book{width:clamp(140px,20vw,220px);aspect-ratio:.76;border-radius:3px;background:linear-gradient(135deg,#f4f4f1,#e2e2dd);box-shadow:0 30px 52px rgba(0,0,0,.24);position:relative;overflow:hidden}
.o-book::before{content:"";position:absolute;left:0;top:0;bottom:0;width:13px;background:var(--red)}
.o-book::after{content:"";position:absolute;left:30px;right:22px;top:34px;height:8px;background:#0b0b0c;box-shadow:0 20px 0 #cfcfca,0 36px 0 #cfcfca}
.o-bag{width:clamp(120px,17vw,190px);aspect-ratio:.82;border-radius:3px 3px 5px 5px;background:linear-gradient(135deg,#e9e6df,#d6d2c8);box-shadow:0 30px 52px rgba(0,0,0,.24);position:relative}
.o-bag::before{content:"";position:absolute;left:26%;right:26%;top:-13px;height:16px;border:2px solid #c2beb4;border-bottom:none;border-radius:22px 22px 0 0}
.o-bag::after{content:"";position:absolute;left:50%;top:44%;transform:translateX(-50%);font-family:var(--display);font-weight:900;font-size:26px;color:var(--red);content:"A."}
.o-sign{width:clamp(160px,23vw,260px);aspect-ratio:2.6;border-radius:3px;background:linear-gradient(135deg,#0b0b0c,#1b1b1f);box-shadow:0 30px 52px rgba(0,0,0,.32);display:flex;align-items:center;justify-content:center}
.o-sign span{font-family:var(--display);font-weight:900;font-stretch:116%;font-size:clamp(17px,2.4vw,30px);color:#fff;letter-spacing:.02em}
.o-sign span i{font-style:normal;color:var(--red)}
#shelf .sprog{position:absolute;left:var(--pad);bottom:clamp(30px,6vh,60px);display:flex;gap:6px}
#shelf .sprog i{width:24px;height:2px;background:rgba(11,11,12,.16);transition:background .35s}
#shelf .sprog i.on{background:var(--red)}

/* ============ 3 — PRESS (drag compare) ============ */
#press .pwrap{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(28px,5vw,72px);align-items:center;margin-top:clamp(28px,4.6vh,50px)}
#swatch{
  position:relative;aspect-ratio:16/10;overflow:hidden;border:1px solid rgba(255,255,255,.14);
  cursor:ew-resize;touch-action:none;user-select:none;
}
#swatch .half{position:absolute;inset:0;display:flex;align-items:flex-end;padding:clamp(14px,2vw,24px)}
/* left: as approved on a bright screen */
#swatch .scr{background:#FF0A22}
/* right: the same ink on uncoated stock — flatter, warmer, slightly darker */
#swatch .prn{background:#C4121F;clip-path:inset(0 0 0 var(--x,50%))}
#swatch .prn::after{
  content:"";position:absolute;inset:0;pointer-events:none;opacity:.5;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='90' height='90' filter='url(%23p)' opacity='.5'/%3E%3C/svg%3E");
}
#swatch .tag{font-family:var(--mono);font-size:10px;letter-spacing:.18em;color:rgba(255,255,255,.9);position:relative;z-index:3}
#swatch .prn .tag{margin-left:auto}
#shandle{position:absolute;top:0;bottom:0;width:2px;background:#fff;left:50%;z-index:4;pointer-events:none;box-shadow:0 0 14px rgba(0,0,0,.4)}
#shandle::after{
  content:"⇄";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
  width:38px;height:38px;border-radius:50%;background:#fff;color:var(--black);
  display:flex;align-items:center;justify-content:center;font-size:15px;
}
#press .hint{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;color:var(--red);margin-top:14px}

/* ============ 4 — HARD CASES ============ */
#hard .hgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,190px),1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin-top:clamp(30px,5vh,54px)}
.hc{background:var(--white);padding:clamp(20px,2.6vw,32px);display:flex;flex-direction:column;gap:14px;min-height:210px}
.hc .box{height:74px;display:flex;align-items:center;justify-content:center;border-radius:3px}
.hc .box .m{font-family:var(--display);font-weight:900;font-stretch:114%;font-size:30px}
.hc.emb .box{background:#e6e2d8}
.hc.emb .m{color:#e6e2d8;text-shadow:1px 1px 0 rgba(255,255,255,.9),-1px -1px 1px rgba(0,0,0,.28)}
.hc.one .box{background:var(--black)}
.hc.one .m{color:#fff}
.hc.fab .box{background:#2b2f38}
.hc.fab .m{color:#dfe2e8;letter-spacing:.02em;filter:blur(.4px)}
.hc.tiny .box{background:var(--paper)}
.hc.tiny .m{font-size:13px}
.hc h3{font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;color:var(--red)}
.hc p{font-size:13.5px;line-height:1.6;color:#5a5a5e}

/* ============ 5 — PROOF ============ */
#cproof .plist{margin-top:clamp(30px,5vh,52px);border-top:1px solid var(--line)}
.prow{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:clamp(14px,3vw,40px);align-items:center;padding:clamp(18px,2.6vh,30px) 0;border-bottom:1px solid var(--line);position:relative;overflow:hidden}
.prow::before{content:"";position:absolute;inset:0;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .5s cubic-bezier(.16,1,.3,1)}
.prow>*{position:relative;z-index:1;transition:color .35s}
.prow:hover::before{transform:scaleX(1)}
.prow .pn{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--red)}
.prow .pnm{font-family:var(--display);font-weight:800;font-stretch:106%;text-transform:uppercase;font-size:clamp(19px,3vw,38px);line-height:1.08;letter-spacing:-.018em;transition:transform .45s cubic-bezier(.16,1,.3,1),color .35s}
.prow .pd{font-size:13.5px;line-height:1.5;color:#5a5a5e;max-width:54ch}
.prow .pt{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;color:var(--grey);white-space:nowrap}
.prow:hover .pn,.prow:hover .pd,.prow:hover .pt{color:rgba(255,255,255,.88)}
.prow:hover .pnm{color:#fff;transform:translateX(clamp(5px,1vw,12px))}

/* ============ 6 — DEPTH ============ */
#cdepth .dwrap{max-width:68ch;margin-top:clamp(30px,5vh,52px)}
#cdepth h3{font-family:var(--display);font-weight:800;font-stretch:104%;font-size:clamp(19px,2.2vw,28px);line-height:1.2;letter-spacing:-.015em;margin:clamp(32px,5vh,54px) 0 13px}
#cdepth p{font-size:clamp(15px,1.35vw,17.5px);line-height:1.78;color:#4a4a4e;margin-bottom:19px}
#cdepth .dwrap>p:first-of-type::first-letter{font-family:var(--display);font-weight:900;font-stretch:110%;float:left;font-size:3.5em;line-height:.82;padding:6px 12px 0 0;color:var(--red)}

/* ============ 7 — CLOSE ============ */
#cclose .nlist{margin-top:clamp(26px,4vh,46px);border-top:1px solid rgba(255,255,255,.14)}
.nrow{display:flex;align-items:center;gap:clamp(12px,2vw,26px);padding:clamp(12px,1.9vh,20px) clamp(6px,1.4vw,16px);border-bottom:1px solid rgba(255,255,255,.14);text-decoration:none;color:#fff;position:relative;overflow:hidden}
.nrow::before{content:"";position:absolute;inset:0;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .45s cubic-bezier(.16,1,.3,1)}
.nrow:hover::before,.nrow:focus-visible::before{transform:scaleX(1)}
.nrow>*{position:relative;z-index:1}
.nrow .nn{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--red);transition:color .3s}
.nrow .nt{font-family:var(--display);font-weight:800;font-stretch:106%;text-transform:uppercase;font-size:clamp(19px,3.4vw,42px);line-height:1.05;letter-spacing:-.018em;transition:transform .45s cubic-bezier(.16,1,.3,1)}
.nrow .na{margin-left:auto;opacity:0;transform:translateX(-12px);transition:opacity .35s,transform .45s cubic-bezier(.16,1,.3,1)}
.nrow:hover .nn,.nrow:focus-visible .nn{color:#fff}
.nrow:hover .nt,.nrow:focus-visible .nt{transform:translateX(clamp(6px,1vw,14px))}
.nrow:hover .na,.nrow:focus-visible .na{opacity:1;transform:none}
#cclose .cta{margin-top:clamp(40px,7vh,78px)}
#cclose .cta h2{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(34px,6.4vw,92px);line-height:.96;letter-spacing:-.03em;text-transform:uppercase;color:#fff}
#cclose .cta h2 em{font-style:normal;color:var(--red)}
#cclose .csub{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--grey);margin-top:16px}
#cclose .btns{display:flex;gap:13px;flex-wrap:wrap;margin-top:clamp(24px,4vh,40px)}
.cbtn{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 clamp(20px,2.4vw,32px);border-radius:999px;font-family:var(--body);font-weight:600;font-size:14.5px;text-decoration:none;transition:transform .25s,background .25s,border-color .25s}
.cbtn .ar{transition:transform .25s}
.cbtn:hover .ar{transform:translateX(4px)}
.cbtn.red{background:var(--red);color:#fff}
.cbtn.red:hover{background:#c40017;transform:translateY(-2px)}
.cbtn.gh{border:1px solid rgba(255,255,255,.26);color:#fff}
.cbtn.gh:hover{border-color:#fff;background:rgba(255,255,255,.06);transform:translateY(-2px)}
#cclose footer{margin-top:clamp(42px,7vh,80px);padding-top:20px;border-top:1px solid rgba(255,255,255,.14);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;color:#66666a}

a:focus-visible,button:focus-visible{outline:2px solid var(--red);outline-offset:3px;border-radius:4px}

@media (max-width:768px){
  #crail{display:none}
  #chero{grid-template-columns:1fr;gap:40px;min-height:auto;padding-top:clamp(96px,15vh,130px)}
  #chero .cardwrap{order:-1}
  #shelf{height:auto}
  #shelf .pin{position:static;height:auto;grid-template-columns:1fr;gap:26px;padding:clamp(70px,10vh,100px) var(--pad)}
  #shelf .sstep{position:relative;opacity:1;transform:none;margin-bottom:22px}
  #shelf .sprog{display:none}
  /* Objects stack rather than overlap once the stage is not pinned. */
  .stage{flex-direction:column;gap:64px;min-height:auto;padding:20px 0 44px;perspective:none}
  .obj{position:relative;opacity:1;transform:none}
  .obj.on{transform:none}
  .obj .lbl{transform:translateX(-50%);bottom:-26px}
  .stage .band{display:none}
  #press .pwrap{grid-template-columns:1fr;gap:24px}
  .prow{grid-template-columns:auto minmax(0,1fr);row-gap:7px}
  .prow .pt{grid-column:2;justify-self:start}
}
@media (max-width:480px){ #chero h1{font-size:clamp(34px,11.5vw,52px)} }
@media (max-height:600px){
  #chero{min-height:auto}
  #shelf{height:auto}
  #shelf .pin{position:static;height:auto}
  #shelf .sstep{position:relative;opacity:1;transform:none;margin-bottom:20px}
  .stage{flex-direction:column;gap:56px;min-height:auto;perspective:none}
  .obj{position:relative;opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){
  *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
  .up{opacity:1;transform:none}
  #chero h1 .l i{transform:none;animation:none}
  #chero .bizcard{animation:none}
  #shelf{height:auto}
  #shelf .pin{position:static;height:auto}
  #shelf .sstep{position:relative;opacity:1;transform:none;margin-bottom:22px}
  .stage{flex-direction:column;gap:56px;min-height:auto;perspective:none}
  .obj{position:relative;opacity:1;transform:none}
  .obj.on{transform:none}
  .stage .band{display:none}
}
`;

const OBJECTS = [
  { cls: "o-card", lbl: "BUSINESS CARD", inner: "" },
  { cls: "o-book", lbl: "BRAND GUIDELINES", inner: "" },
  { cls: "o-bag", lbl: "PACKAGING", inner: "" },
  { cls: "o-sign", lbl: "SIGNAGE", inner: "<span>ADMIRATE<i>.</i></span>" },
];

const SHELF_STEPS = [
  { n: "OBJECT 01", h: "The card is the whole brand, shrunk", p: "It is small, it is held, and it is often the only physical thing anyone keeps. Weight, finish and edge do more of the talking here than the layout does." },
  { n: "OBJECT 02", h: "Guidelines are what survive you", p: "The document that lets a printer, a new hire or an agency you have never met apply the brand correctly. Without it, every future piece is a negotiation." },
  { n: "OBJECT 03", h: "Packaging competes on a shelf", p: "Designed for the distance it is first seen from and the hands that will open it — not for the render that made it look good in a deck." },
  { n: "OBJECT 04", h: "Signage is read at a glance, in bad light", p: "Set for the distance, the angle and the lighting it will actually live in. Almost every legibility problem here was invisible on the screen it was approved on." },
];

const HARD = [
  { cls: "emb", m: "A.", h: "EMBOSSED", p: "No colour at all — only light and shadow. A mark that relies on its fill has nothing left here." },
  { cls: "one", m: "A.", h: "ONE COLOUR", p: "Single-colour print, stamps and engraving. Any mark needing two tones to read needs a second version." },
  { cls: "fab", m: "A.", h: "ON FABRIC", p: "Embroidery loses fine detail and thin strokes close up. The mark has to survive the thread." },
  { cls: "tiny", m: "A.", h: "VERY SMALL", p: "On a pen, a label, a screw-cap. The smallest case is the one that decides how simple the mark must be." },
];

const PROOF = [
  { n: "South Glass", t: "Identity · Print", d: "A technical product whose collateral had to feel as premium as the claim." },
  { n: "Hope Trust India", t: "Brand · Print", d: "Printed material that had to feel reassuring in the hand, not clinical." },
  { n: "Patil Group", t: "Corporate · Collateral", d: "Corporate documents carrying fifty years of scale, quietly." },
];

const NEXT = [
  { slug: "identity", label: "Identity" },
  { slug: "design", label: "Design" },
  { slug: "social-media", label: "Social Media" },
  { slug: "digital", label: "Digital" },
  { slug: "video-production", label: "Video Production" },
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

export const COLLAT_HTML = String.raw`
<div id="cbg"></div>
<div id="cline"></div>
<div id="crail" role="navigation" aria-label="Section"></div>

<!-- 1 — HERO -->
<section class="cs" id="chero" data-bg="#FBF7F1" data-label="Collaterals">
  <div>
    <div class="crumb"><a href="/">Home</a><span>/</span><a href="/services">Services</a><span>/</span><b>Brand Collaterals</b></div>
    <h1>${heroLine("THE PHYSICAL", 0.15)}<br>${heroLine("PROOF", 0.48, true)}</h1>
    <p class="cp">Business cards, guidelines, packaging and signage — the things people actually hold, carrying the same face your brand shows everywhere else.</p>
  </div>
  <div>
    <div class="cardwrap"><div class="bizcard"><span class="mk">A<span>.</span></span></div></div>
    <div class="shadow" aria-hidden="true"></div>
  </div>
</section>

<!-- 2 — SHELF (scrub) -->
<section id="shelf" data-bg="#0B0B0C" data-label="The shelf">
  <div class="pin">
    <div class="stext">
      <div class="ceb">THE OBJECTS</div>
      ${SHELF_STEPS.map(
        (s, i) => `<div class="sstep${i === 0 ? " on" : ""}" data-i="${i}" style="color:#fff">
        <div class="snum">${s.n}</div>
        <h2 class="ch" style="color:#fff">${s.h}</h2>
        <p class="cp" style="color:#a4a4a8">${s.p}</p>
      </div>`
      ).join("\n      ")}
    </div>
    <div class="stage" id="stage">
      <div class="band" aria-hidden="true"></div>
      ${OBJECTS.map(
        (o, i) => `<div class="obj ${o.cls}${i === 0 ? " on" : ""}" data-i="${i}">${o.inner}<span class="lbl">${o.lbl}</span></div>`
      ).join("\n      ")}
    </div>
    <div class="sprog" aria-hidden="true">${SHELF_STEPS.map((_, i) => `<i${i === 0 ? ' class="on"' : ""}></i>`).join("")}</div>
  </div>
</section>

<!-- 3 — PRESS -->
<section class="cs dark" id="press" data-bg="#0B0B0C" data-label="On press">
  <div class="ceb up">SCREEN VS PRESS</div>
  <h2 class="ch up" style="--d:.08s">Screen colour <em>lies</em>.</h2>
  <div class="pwrap">
    <div>
      <p class="cp up" style="--d:.14s">A colour approved on a bright screen and the same colour printed on stock are not the same colour — and the gap is widest exactly where brands care most. Drag the divider.</p>
      <p class="hint up" style="--d:.22s">// AN ILLUSTRATION, NOT A CALIBRATED PROOF — WHICH IS ITSELF THE POINT.</p>
    </div>
    <div class="up" style="--d:.18s">
      <div id="swatch" role="slider" aria-label="Compare screen colour with printed colour" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" tabindex="0">
        <div class="half scr"><span class="tag">AS APPROVED ON SCREEN</span></div>
        <div class="half prn"><span class="tag">AS IT LANDS ON STOCK</span></div>
        <div id="shandle"></div>
      </div>
    </div>
  </div>
</section>

<!-- 4 — HARD CASES -->
<section class="cs" id="hard" data-bg="#FAFAF8" data-label="Hard cases">
  <div class="ceb up">THE HARD CASES</div>
  <h2 class="ch up" style="--d:.08s">Where marks quietly <em>fail</em>.</h2>
  <p class="cp up" style="--d:.14s">Collateral is where an identity meets its hardest constraints. A mark designed only for full colour on white needs a quiet exception for each of these — and every exception weakens the system.</p>
  <div class="hgrid">
    ${HARD.map(
      (h, i) => `<div class="hc ${h.cls} up" style="--d:${(0.2 + i * 0.06).toFixed(2)}s">
      <div class="box"><span class="m">${h.m}</span></div>
      <h3>${h.h}</h3>
      <p>${h.p}</p>
    </div>`
    ).join("\n    ")}
  </div>
</section>

<!-- 5 — PROOF -->
<section class="cs" id="cproof" data-bg="#FFFFFF" data-label="Proof">
  <div class="ceb up">PROOF</div>
  <h2 class="ch up" style="--d:.08s">Brands that had to hold up in the <em>hand</em>.</h2>
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

<!-- 6 — DEPTH -->
<section class="cs" id="cdepth" data-bg="#FBF7F1" data-label="In depth">
  <div class="ceb up">IN DEPTH</div>
  <h2 class="ch up" style="--d:.08s">The long version, for anyone who wants it.</h2>
  <div class="dwrap up" style="--d:.16s">
    <p>Digital work can be corrected quietly. A colour is adjusted, a file replaced, and yesterday's version disappears. Print cannot. Once five thousand cards exist, the decision exists — which is why physical collateral is the honest test of whether an identity was ever really a system, or just a set of screens that happened to agree.</p>
    <h3>Material is a design decision</h3>
    <p>Weight, texture and finish communicate before anything is read. A heavy uncoated card and a thin glossy one say different things about the same company, in the same second, without a word being processed. Treating those as procurement details rather than design decisions is how brands end up feeling cheaper in the hand than they look on screen.</p>
    <h3>The pieces nobody briefs</h3>
    <p>Most physical brand output is not the launch set — it is the invoice, the name badge, the folder assembled in a hurry before a meeting. Those are produced without designers involved, and they are frequently what a client sees most often. Guidelines exist so those pieces still look like the brand.</p>
  </div>
</section>

<!-- 7 — CLOSE -->
<section class="cs dark" id="cclose" data-bg="#0B0B0C" data-label="Close">
  <div class="ceb up">KEEP GOING</div>
  <h2 class="ch up" style="--d:.08s">The rest of what we do.</h2>
  <div class="nlist">
    ${NEXT.map(
      (s, i) => `<a class="nrow up" href="/services/${s.slug}" style="--d:${(0.14 + i * 0.05).toFixed(2)}s" data-h>
      <span class="nn">${String(i + 1).padStart(2, "0")}</span>
      <span class="nt">${s.label}</span>
      <span class="na">→</span>
    </a>`
    ).join("\n    ")}
  </div>
  <div class="cta">
    <h2 class="up">Let's put it<br>in their <em>hands</em>.</h2>
    <p class="csub up" style="--d:.12s">// TELL US THE GOAL. WE REPLY WITHIN ONE WORKING DAY.</p>
    <div class="btns up" style="--d:.22s">
      <a class="cbtn gh" href="/services" data-h>All services <span class="ar">→</span></a>
      <a class="cbtn red" href="/start-project?service=Brand%20Collaterals" data-h>Start your project <span class="ar">→</span></a>
    </div>
  </div>
  <footer><div>© 2026 ADMIRATE.IN</div><div>MADE TO CONVERT</div></footer>
</section>
`;

export const OBJECT_COUNT = OBJECTS.length;
