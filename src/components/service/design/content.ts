/**
 * DESIGN — a page about where the eye goes, which watches where your eye goes.
 *
 * Set-pieces unique to this page:
 *   GAZE       a scroll-scrubbed eye path that lands on four fixation points in
 *              the order a real reader takes them
 *   HIERARCHY  a live toggle between "everything shouts" and "one thing first",
 *              on the same layout — the argument, demonstrated rather than made
 *   MEDIUM     one idea re-composed for hoarding, feed and page, side by side
 */

export const DESIGN_CSS = String.raw`
:root{
  --white:#FFFFFF;--paper:#FAFAF8;--black:#0B0B0C;--red:#E3001B;
  --grey:#8A8A8E;--line:#E9E9E6;--pad:clamp(24px,6vw,96px);
  --display:'Archivo',sans-serif;--body:'Inter',sans-serif;--mono:'IBM Plex Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:auto}
body{font-family:var(--body);background:var(--paper);color:var(--black);overflow-x:hidden;-webkit-font-smoothing:antialiased}
body.smopen{overflow:hidden}
::selection{background:var(--red);color:var(--white)}

#dgbg{position:fixed;inset:0;z-index:-2;background:var(--paper);transition:background-color .7s cubic-bezier(.4,0,.2,1)}
#dgline{position:fixed;top:0;left:0;height:2px;width:0;background:var(--red);z-index:200}
#dgrail{position:fixed;left:clamp(14px,2.4vw,34px);top:50%;transform:translateY(-50%);z-index:120;display:flex;flex-direction:column;gap:14px}
#dgrail button{padding:0;border:none;background:none;cursor:pointer;display:flex;align-items:center}
#dgrail i{display:block;width:18px;height:1px;background:rgba(11,11,12,.25);transition:width .35s cubic-bezier(.16,1,.3,1),background .35s}
#dgrail.ondark i{background:rgba(255,255,255,.3)}
#dgrail button.on i,#dgrail.ondark button.on i{width:38px;background:var(--red)}

.dgs{position:relative;z-index:1;padding:clamp(96px,14vh,150px) var(--pad) clamp(70px,11vh,120px)}
.dgs.dark{color:var(--white)}
.dgeb{font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--red);display:flex;align-items:center;gap:11px;margin-bottom:16px}
.dgeb::after{content:"";height:1px;width:clamp(26px,5vw,60px);background:currentColor;opacity:.45}
.dgh{font-family:var(--display);font-weight:800;font-stretch:106%;font-size:clamp(27px,4.6vw,60px);line-height:1.05;letter-spacing:-.026em;max-width:17ch}
.dgh em{font-style:normal;color:var(--red)}
.dgp{font-size:clamp(15px,1.4vw,18px);line-height:1.7;color:#4a4a4e;max-width:56ch;margin-top:18px}
.dgs.dark .dgp{color:#a4a4a8}
.up{opacity:0;transform:translateY(26px);transition:opacity .8s,transform .8s cubic-bezier(.16,1,.3,1)}
.dgs.in .up,#gaze.in .up{opacity:1;transform:none;transition-delay:var(--d,0s)}

/* ============ 1 — HERO ============ */
#dhero{min-height:100svh;display:flex;flex-direction:column;justify-content:center}
#dhero .crumb{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--grey);margin-bottom:clamp(20px,3.4vh,34px);display:flex;gap:10px;flex-wrap:wrap}
#dhero .crumb a{color:var(--grey);text-decoration:none;transition:color .25s}
#dhero .crumb a:hover{color:var(--red)}
#dhero .crumb b{color:var(--black);font-weight:500}
#dhero h1{font-family:var(--display);font-weight:900;font-stretch:114%;font-size:clamp(44px,9.2vw,132px);line-height:.9;letter-spacing:-.035em;text-transform:uppercase;max-width:14ch}
#dhero h1 .wd{display:inline-block;white-space:nowrap}
#dhero h1 .l{display:inline-block;overflow:hidden;vertical-align:bottom}
#dhero h1 .l i{display:inline-block;font-style:normal;transform:translateY(102%);animation:dgr .95s cubic-bezier(.16,1,.3,1) forwards;animation-delay:var(--d,0s)}
@keyframes dgr{to{transform:none}}
#dhero h1 u{text-decoration:none;color:var(--red)}
/* A faint reticle drifts across the hero — the page's premise, stated quietly. */
#dhero .retic{position:absolute;width:74px;height:74px;border:1px solid rgba(227,0,27,.4);border-radius:50%;pointer-events:none;z-index:0;
  animation:drift 17s ease-in-out infinite}
#dhero .retic::before,#dhero .retic::after{content:"";position:absolute;background:rgba(227,0,27,.4)}
#dhero .retic::before{left:50%;top:-11px;bottom:-11px;width:1px}
#dhero .retic::after{top:50%;left:-11px;right:-11px;height:1px}
@keyframes drift{
  0%{transform:translate(6vw,10vh)}25%{transform:translate(48vw,20vh)}
  50%{transform:translate(62vw,54vh)}75%{transform:translate(20vw,62vh)}100%{transform:translate(6vw,10vh)}
}

/* ============ 2 — GAZE (scrub) ============ */
#gaze{height:340vh;padding:0}
#gaze .pin{position:sticky;top:0;height:100svh;display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(26px,4vw,68px);align-items:center;padding:clamp(90px,13vh,140px) var(--pad) clamp(50px,8vh,90px)}
#gaze .gtext{position:relative}
#gaze .gstep{position:absolute;top:0;left:0;opacity:0;transform:translateY(16px);transition:opacity .4s,transform .4s cubic-bezier(.16,1,.3,1);pointer-events:none}
#gaze .gstep.on{opacity:1;transform:none;position:relative;pointer-events:auto}
#gaze .gnum{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--red);margin-bottom:11px}

/* the mock composition the eye travels across */
.comp{position:relative;aspect-ratio:4/3;width:100%;background:var(--white);border:1px solid var(--line);overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.07)}
.comp .cel{position:absolute;transition:opacity .4s,filter .4s}
.comp .clogo{top:7%;left:6%;font-family:var(--display);font-weight:900;font-stretch:116%;font-size:clamp(15px,2vw,26px)}
.comp .clogo span{color:var(--red)}
.comp .chead{top:26%;left:6%;right:34%;font-family:var(--display);font-weight:800;font-stretch:104%;font-size:clamp(15px,2.3vw,31px);line-height:1.08;letter-spacing:-.02em}
.comp .cimg{right:6%;top:22%;width:26%;aspect-ratio:3/4;background:linear-gradient(140deg,#1a1a1d,#3a3a40);border-radius:2px}
.comp .ccta{bottom:9%;left:6%;background:var(--red);color:#fff;font-family:var(--body);font-weight:600;font-size:clamp(10px,1.1vw,13px);padding:9px 17px;border-radius:999px}
.comp .cbody{bottom:9%;left:32%;right:6%;font-size:clamp(8px,.85vw,11px);line-height:1.5;color:#9a9a9e}
/* Dimmed until the gaze reaches them, so the order is legible rather than assumed. */
.comp.seq .cel{opacity:.16;filter:grayscale(1)}
.comp.seq .cel.hit{opacity:1;filter:none}
#gsvg{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
#gsvg .trail{fill:none;stroke:rgba(227,0,27,.24);stroke-width:2;stroke-linecap:round}
#gsvg .live{fill:none;stroke:var(--red);stroke-width:2;stroke-linecap:round}
.gdot{position:absolute;width:16px;height:16px;border-radius:50%;background:var(--red);transform:translate(-50%,-50%);box-shadow:0 0 0 6px rgba(227,0,27,.16);pointer-events:none;transition:opacity .3s}
.gfix{position:absolute;width:34px;height:34px;border:1px solid var(--red);border-radius:50%;transform:translate(-50%,-50%) scale(.4);opacity:0;transition:transform .45s cubic-bezier(.16,1,.3,1),opacity .45s}
.gfix.on{opacity:1;transform:translate(-50%,-50%) scale(1)}
#gaze .gprog{position:absolute;left:var(--pad);bottom:clamp(30px,6vh,60px);display:flex;gap:6px}
#gaze .gprog i{width:24px;height:2px;background:rgba(11,11,12,.16);transition:background .35s}
#gaze .gprog i.on{background:var(--red)}

/* ============ 3 — HIERARCHY (interactive) ============ */
#hier .hwrap{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(28px,5vw,72px);align-items:center;margin-top:clamp(30px,5vh,54px)}
#hier .toggle{display:inline-flex;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:4px;margin-top:24px}
#hier .toggle button{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;background:none;border:none;color:#9a9a9e;
  padding:10px 16px;border-radius:999px;cursor:pointer;transition:background .25s,color .25s;
}
#hier .toggle button.on{background:var(--red);color:#fff}
#hier .demo{position:relative;aspect-ratio:4/3;background:#141417;border:1px solid rgba(255,255,255,.12);overflow:hidden}
#hier .demo .d{position:absolute;transition:all .55s cubic-bezier(.16,1,.3,1);font-family:var(--display);font-weight:800;font-stretch:104%;color:#fff;line-height:1.05}
/* SHOUT: everything at once, nothing first. */
#hier .demo.shout .d1{top:8%;left:6%;font-size:clamp(13px,2vw,26px);color:var(--red)}
#hier .demo.shout .d2{top:30%;left:6%;font-size:clamp(13px,2vw,26px)}
#hier .demo.shout .d3{top:52%;left:6%;font-size:clamp(13px,2vw,26px)}
#hier .demo.shout .d4{top:74%;left:6%;font-size:clamp(13px,2vw,26px);color:var(--red)}
/* ORDER: one thing first, the rest in support. */
#hier .demo.order .d1{top:10%;left:6%;font-size:clamp(9px,1vw,12px);color:var(--red);font-family:var(--mono);font-weight:400;letter-spacing:.2em}
#hier .demo.order .d2{top:26%;left:6%;right:12%;font-size:clamp(19px,3.4vw,44px);letter-spacing:-.02em}
#hier .demo.order .d3{top:66%;left:6%;right:34%;font-size:clamp(9px,1vw,12px);font-family:var(--body);font-weight:400;color:#8a8a8e}
#hier .demo.order .d4{bottom:9%;left:6%;top:auto;font-size:clamp(10px,1.1vw,13px);font-family:var(--body);font-weight:600;background:var(--red);padding:9px 17px;border-radius:999px}
#hcap{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--red);margin-top:16px;min-height:1.4em}

/* ============ 4 — MEDIUM ============ */
#med .mrow{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:clamp(18px,2.6vw,34px);margin-top:clamp(32px,5vh,56px)}
.mfr{display:flex;flex-direction:column;gap:12px}
.mfr .win{background:var(--white);border:1px solid var(--line);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:14px}
.mfr .win.bill{aspect-ratio:3/1}
.mfr .win.feed{aspect-ratio:4/5}
.mfr .win.page{aspect-ratio:3/4}
.mfr .t{font-family:var(--display);font-weight:900;font-stretch:112%;letter-spacing:-.022em;line-height:.98;text-align:center;text-transform:uppercase}
.mfr .win.bill .t{font-size:clamp(15px,2.4vw,30px)}
.mfr .win.feed .t{font-size:clamp(14px,2vw,25px)}
.mfr .win.page .t{font-size:clamp(11px,1.5vw,18px)}
.mfr .t span{color:var(--red)}
.mfr .lbl{font-family:var(--mono);font-size:10px;letter-spacing:.18em;color:var(--grey)}
.mfr .sub{font-size:12.5px;line-height:1.55;color:#5a5a5e}

/* ============ 5 — PROOF ============ */
#dproof .plist{margin-top:clamp(30px,5vh,52px);border-top:1px solid var(--line)}
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
#ddepth .dwrap{max-width:68ch;margin-top:clamp(30px,5vh,52px)}
#ddepth h3{font-family:var(--display);font-weight:800;font-stretch:104%;font-size:clamp(19px,2.2vw,28px);line-height:1.2;letter-spacing:-.015em;margin:clamp(32px,5vh,54px) 0 13px}
#ddepth p{font-size:clamp(15px,1.35vw,17.5px);line-height:1.78;color:#4a4a4e;margin-bottom:19px}
#ddepth .dwrap>p:first-of-type::first-letter{font-family:var(--display);font-weight:900;font-stretch:110%;float:left;font-size:3.5em;line-height:.82;padding:6px 12px 0 0;color:var(--red)}

/* ============ 7 — CLOSE ============ */
#dclose .nlist{margin-top:clamp(26px,4vh,46px);border-top:1px solid rgba(255,255,255,.14)}
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
#dclose .cta{margin-top:clamp(40px,7vh,78px)}
#dclose .cta h2{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(34px,6.4vw,92px);line-height:.96;letter-spacing:-.03em;text-transform:uppercase;color:#fff}
#dclose .cta h2 em{font-style:normal;color:var(--red)}
#dclose .csub{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--grey);margin-top:16px}
#dclose .btns{display:flex;gap:13px;flex-wrap:wrap;margin-top:clamp(24px,4vh,40px)}
.dbtn{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 clamp(20px,2.4vw,32px);border-radius:999px;font-family:var(--body);font-weight:600;font-size:14.5px;text-decoration:none;transition:transform .25s,background .25s,border-color .25s}
.dbtn .ar{transition:transform .25s}
.dbtn:hover .ar{transform:translateX(4px)}
.dbtn.red{background:var(--red);color:#fff}
.dbtn.red:hover{background:#c40017;transform:translateY(-2px)}
.dbtn.gh{border:1px solid rgba(255,255,255,.26);color:#fff}
.dbtn.gh:hover{border-color:#fff;background:rgba(255,255,255,.06);transform:translateY(-2px)}
#dclose footer{margin-top:clamp(42px,7vh,80px);padding-top:20px;border-top:1px solid rgba(255,255,255,.14);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;color:#66666a}

a:focus-visible,button:focus-visible{outline:2px solid var(--red);outline-offset:3px;border-radius:4px}

@media (max-width:768px){
  #dgrail{display:none}
  #dhero .retic{display:none}
  #gaze{height:auto}
  #gaze .pin{position:static;height:auto;grid-template-columns:1fr;gap:26px;padding:clamp(70px,10vh,100px) var(--pad)}
  #gaze .gstep{position:relative;opacity:1;transform:none;margin-bottom:22px}
  #gaze .gprog{display:none}
  .comp.seq .cel{opacity:1;filter:none}
  #hier .hwrap{grid-template-columns:1fr;gap:24px}
  .prow{grid-template-columns:auto minmax(0,1fr);row-gap:7px}
  .prow .pt{grid-column:2;justify-self:start}
}
@media (max-width:480px){ #dhero h1{font-size:clamp(36px,12vw,54px)} }
@media (max-height:600px){
  #dhero{min-height:auto}
  #gaze{height:auto}
  #gaze .pin{position:static;height:auto}
  #gaze .gstep{position:relative;opacity:1;transform:none;margin-bottom:20px}
}
@media (prefers-reduced-motion:reduce){
  *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
  .up{opacity:1;transform:none}
  #dhero h1 .l i{transform:none;animation:none}
  #dhero .retic{display:none}
  #gaze{height:auto}
  #gaze .pin{position:static;height:auto}
  #gaze .gstep{position:relative;opacity:1;transform:none;margin-bottom:22px}
  .comp.seq .cel{opacity:1;filter:none}
}
`;

/* Fixation points as percentages of the composition box. The order is the
   claim: mark, then headline, then image, then the ask. */
export const FIXATIONS = [
  { x: 11, y: 12, label: "01 — THE MARK" },
  { x: 30, y: 33, label: "02 — THE HEADLINE" },
  { x: 80, y: 44, label: "03 — THE IMAGE" },
  { x: 15, y: 87, label: "04 — THE ASK" },
];

const GAZE_STEPS = [
  {
    n: "FIXATION 01",
    h: "It starts where you put the mark",
    p: "The first fixation is almost never chosen by the reader — it is chosen by contrast, position and scale. Put the mark somewhere the eye was going anyway and it is read for free.",
  },
  {
    n: "FIXATION 02",
    h: "Then the one line that matters",
    p: "The headline gets the second look and roughly two seconds of patience. If it explains rather than interests, the sequence ends here and nothing below it is ever seen.",
  },
  {
    n: "FIXATION 03",
    h: "The image confirms or contradicts",
    p: "Pictures are processed faster than words, so the image either backs the headline instantly or quietly undermines it. Stock photography usually does the second thing.",
  },
  {
    n: "FIXATION 04",
    h: "And only then, the ask",
    p: "The call to action works because of everything above it. Placed first it is noise; placed last, after the argument has landed, it is the obvious next move.",
  },
];

const MEDIUMS = [
  { cls: "bill", lbl: "HOARDING — 3 SECONDS AT 60KM/H", sub: "Six words, one image, read at distance. Anything else is decoration nobody has time for." },
  { cls: "feed", lbl: "FEED — A THUMB ALREADY MOVING", sub: "Vertical, high contrast, the point in the first frame. It competes with everything else on the phone." },
  { cls: "page", lbl: "PAGE — HELD STILL, READ SLOWLY", sub: "The one medium that rewards detail, because the reader has already chosen to stop." },
];

const PROOF = [
  { n: "Hitex SportExpo", t: "Event · Campaign", d: "India's largest sports, fitness and wellness expo — creative that had to work at hoarding scale and in a feed." },
  { n: "Our Sacred Space", t: "Arts · Events", d: "A venue whose calendar is the product, with creative built to make each event legible at a glance." },
  { n: "South Glass", t: "Product · Premium", d: "A technical product given the composure of a premium one." },
];

const NEXT = [
  { slug: "identity", label: "Identity" },
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

/** The mock ad, reused by the gaze scrub. */
const composition = () => `
<div class="comp seq" id="comp">
  <div class="cel clogo" data-f="0">A<span>.</span></div>
  <div class="cel chead" data-f="1">Your best line goes exactly here.</div>
  <div class="cel cimg" data-f="2"></div>
  <div class="cel ccta" data-f="3">START NOW →</div>
  <div class="cel cbody" data-f="1">Supporting copy sits below the fold of attention — read only by people the headline already convinced.</div>
  <svg id="gsvg" viewBox="0 0 100 75" preserveAspectRatio="none" aria-hidden="true">
    <path class="trail" id="gtrail" d=""/>
    <path class="live" id="glive" d=""/>
  </svg>
  ${FIXATIONS.map(
    (f, i) => `<span class="gfix" id="gfix${i}" style="left:${f.x}%;top:${f.y}%"></span>`
  ).join("")}
  <span class="gdot" id="gdot" style="left:${FIXATIONS[0].x}%;top:${FIXATIONS[0].y}%"></span>
</div>`;

export const DESIGN_HTML = String.raw`
<div id="dgbg"></div>
<div id="dgline"></div>
<div id="dgrail" role="navigation" aria-label="Section"></div>

<!-- 1 — HERO -->
<section class="dgs" id="dhero" data-bg="#FAFAF8" data-label="Eye level">
  <div class="retic" aria-hidden="true"></div>
  <div class="crumb"><a href="/">Home</a><span>/</span><a href="/services">Services</a><span>/</span><b>Design</b></div>
  <h1>${heroLine("PLACED WHERE", 0.15)}<br>${heroLine("THE EYE GOES", 0.5, true)}</h1>
  <p class="dgp">Advertising and design built around how people actually look at things — which is quickly, on a small screen, while doing something else entirely.</p>
</section>

<!-- 2 — GAZE (scrub) -->
<section id="gaze" data-bg="#FFFFFF" data-label="The gaze">
  <div class="pin">
    <div class="gtext">
      <div class="dgeb">THE PATH</div>
      ${GAZE_STEPS.map(
        (s, i) => `<div class="gstep${i === 0 ? " on" : ""}" data-i="${i}">
        <div class="gnum">${s.n}</div>
        <h2 class="dgh">${s.h}</h2>
        <p class="dgp">${s.p}</p>
      </div>`
      ).join("\n      ")}
    </div>
    ${composition()}
    <div class="gprog" aria-hidden="true">${FIXATIONS.map((_, i) => `<i${i === 0 ? ' class="on"' : ""}></i>`).join("")}</div>
  </div>
</section>

<!-- 3 — HIERARCHY -->
<section class="dgs dark" id="hier" data-bg="#0B0B0C" data-label="Hierarchy">
  <div class="dgeb up">HIERARCHY</div>
  <h2 class="dgh up" style="--d:.08s">If everything shouts, <em>nothing</em> is heard.</h2>
  <div class="hwrap">
    <div>
      <p class="dgp up" style="--d:.14s">The same four elements, the same box, the same amount of ink. The only difference is whether an order was decided. Switch between them.</p>
      <div class="toggle up" style="--d:.22s" id="htog" role="group" aria-label="Layout comparison">
        <button type="button" data-m="shout" class="on" data-h>EVERYTHING SHOUTS</button>
        <button type="button" data-m="order" data-h>ONE THING FIRST</button>
      </div>
      <div id="hcap" role="status" aria-live="polite">// FOUR ELEMENTS COMPETING. NOTHING WINS.</div>
    </div>
    <div class="demo shout up" id="hdemo" style="--d:.18s">
      <div class="d d1">ESTABLISHED 2015</div>
      <div class="d d2">Your best line goes exactly here.</div>
      <div class="d d3">Supporting copy nobody reads first.</div>
      <div class="d d4">START NOW</div>
    </div>
  </div>
</section>

<!-- 4 — MEDIUM -->
<section class="dgs" id="med" data-bg="#FAFAF8" data-label="Medium">
  <div class="dgeb up">THE MEDIUM</div>
  <h2 class="dgh up" style="--d:.08s">One idea. Three genuinely <em>different</em> problems.</h2>
  <p class="dgp up" style="--d:.14s">A billboard, a feed placement and a printed page are not one design at three sizes. Work that is made once and resized into all three is optimised for none of them.</p>
  <div class="mrow">
    ${MEDIUMS.map(
      (m, i) => `<div class="mfr up" style="--d:${(0.2 + i * 0.07).toFixed(2)}s">
      <div class="win ${m.cls}"><div class="t">Stop<span>.</span> Look here first</div></div>
      <span class="lbl">${m.lbl}</span>
      <p class="sub">${m.sub}</p>
    </div>`
    ).join("\n    ")}
  </div>
</section>

<!-- 5 — PROOF -->
<section class="dgs" id="dproof" data-bg="#FFFFFF" data-label="Proof">
  <div class="dgeb up">PROOF</div>
  <h2 class="dgh up" style="--d:.08s">Work that had to earn its <em>attention</em>.</h2>
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
<section class="dgs" id="ddepth" data-bg="#FAFAF8" data-label="In depth">
  <div class="dgeb up">IN DEPTH</div>
  <h2 class="dgh up" style="--d:.08s">The long version, for anyone who wants it.</h2>
  <div class="dwrap up" style="--d:.16s">
    <p>Almost nobody looks at advertising. They pass it. The real unit of attention is not the thirty seconds a concept was presented in — it is the fraction of a second someone spends deciding whether this is worth stopping for, usually while scrolling, walking, or waiting for something else to load. Design that ignores that can be beautiful and still do nothing.</p>
    <h3>Hierarchy is the whole job</h3>
    <p>Every piece of creative contains the same argument: look here first, then here, then act. When that order is deliberate the work feels effortless to read. When everything is emphasised — three competing headlines, a logo fighting the product, a call to action in the same weight as the legal line — nothing is, and the viewer resolves it by leaving.</p>
    <h3>The medium is a constraint, not a canvas</h3>
    <p>A billboard is read at speed from a distance. A feed placement is read with a thumb already moving. A printed page is held still. These are different problems, and creative designed once and resized into all three is optimised for none of them. Adapting properly costs more up front and considerably less than a campaign that underperforms everywhere.</p>
    <h3>Different beats better</h3>
    <p>Within any category most advertising converges: the same stock imagery, the same reassuring adjectives, the same layout. Being marginally better than that is nearly worthless, because nobody is comparing. Being visibly unlike it is what buys the second of attention everything else depends on.</p>
  </div>
</section>

<!-- 7 — CLOSE -->
<section class="dgs dark" id="dclose" data-bg="#0B0B0C" data-label="Close">
  <div class="dgeb up">KEEP GOING</div>
  <h2 class="dgh up" style="--d:.08s">The rest of what we do.</h2>
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
    <h2 class="up">Let's make them<br><em>look</em>.</h2>
    <p class="csub up" style="--d:.12s">// TELL US THE GOAL. WE REPLY WITHIN ONE WORKING DAY.</p>
    <div class="btns up" style="--d:.22s">
      <a class="dbtn gh" href="/services" data-h>All services <span class="ar">→</span></a>
      <a class="dbtn red" href="/start-project?service=Design" data-h>Start your project <span class="ar">→</span></a>
    </div>
  </div>
  <footer><div>© 2026 ADMIRATE.IN</div><div>MADE TO CONVERT</div></footer>
</section>
`;
