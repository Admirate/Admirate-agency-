/**
 * DIGITAL — a page about websites, which builds one in front of you.
 *
 * Set-pieces unique to this page:
 *   RACE   two load bars run against each other on demand, with the share of
 *          visitors still waiting counted off as they go
 *   BUILD  a browser frame assembles a page in four stages as you scroll —
 *          skeleton, structure, content, done
 */

export const DIGITAL_CSS = String.raw`
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
.dgs.in .up,#build.in .up{opacity:1;transform:none;transition-delay:var(--d,0s)}

/* shared browser chrome, used by hero and the build scrub */
.brw{background:var(--white);border:1px solid var(--line);border-radius:8px;overflow:hidden;box-shadow:0 26px 64px rgba(0,0,0,.09)}
.brw .chrome{display:flex;align-items:center;gap:7px;padding:10px 13px;border-bottom:1px solid var(--line);background:#F4F4F1}
.brw .chrome b{width:9px;height:9px;border-radius:50%;background:#DcDcD8;display:block}
.brw .url{
  flex:1;margin-left:9px;background:#fff;border:1px solid var(--line);border-radius:999px;
  padding:6px 13px;font-family:var(--mono);font-size:10.5px;color:#6a6a6e;white-space:nowrap;overflow:hidden;
}
.brw .url .caret{display:inline-block;width:1px;height:1em;background:var(--red);vertical-align:-2px;animation:blink 1s step-end infinite}
@keyframes blink{50%{opacity:0}}
.brw .load{height:2px;background:transparent}
.brw .load i{display:block;height:100%;width:0;background:var(--red)}
.brw .view{position:relative;aspect-ratio:16/10;overflow:hidden;background:#fff}

/* ============ 1 — HERO ============ */
#dhero{min-height:100svh;display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(28px,5vw,76px);align-items:center}
#dhero .crumb{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--grey);margin-bottom:clamp(20px,3.4vh,34px);display:flex;gap:10px;flex-wrap:wrap}
#dhero .crumb a{color:var(--grey);text-decoration:none;transition:color .25s}
#dhero .crumb a:hover{color:var(--red)}
#dhero .crumb b{color:var(--black);font-weight:500}
#dhero h1{font-family:var(--display);font-weight:900;font-stretch:114%;font-size:clamp(42px,8vw,112px);line-height:.9;letter-spacing:-.035em;text-transform:uppercase}
#dhero h1 .wd{display:inline-block;white-space:nowrap}
#dhero h1 .l{display:inline-block;overflow:hidden;vertical-align:bottom}
#dhero h1 .l i{display:inline-block;font-style:normal;transform:translateY(102%);animation:dgr .95s cubic-bezier(.16,1,.3,1) forwards;animation-delay:var(--d,0s)}
@keyframes dgr{to{transform:none}}
#dhero h1 u{text-decoration:none;color:var(--red)}
/* the hero browser paints itself once, on load */
#hbrw .sk{position:absolute;left:7%;right:7%;background:#EDEDEA;border-radius:3px;opacity:0;animation:skin .5s ease forwards}
@keyframes skin{to{opacity:1}}
#hbrw .s1{top:12%;height:9%;right:44%;background:var(--black);animation-delay:.5s}
#hbrw .s2{top:27%;height:6%;right:22%;animation-delay:.72s}
#hbrw .s3{top:37%;height:6%;right:34%;animation-delay:.84s}
#hbrw .s4{top:52%;height:20%;right:52%;background:linear-gradient(140deg,#1a1a1d,#3a3a40);animation-delay:1s}
#hbrw .s5{top:52%;left:52%;height:20%;right:7%;background:#EDEDEA;animation-delay:1.12s}
#hbrw .s6{top:80%;height:8%;right:62%;background:var(--red);border-radius:999px;animation-delay:1.3s}

/* ============ 2 — RACE ============ */
#race .rwrap{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(28px,5vw,72px);align-items:center;margin-top:clamp(28px,4.6vh,50px)}
.lane{margin-bottom:26px}
.lane .top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:9px}
.lane .nm{font-family:var(--display);font-weight:800;font-stretch:104%;text-transform:uppercase;font-size:clamp(14px,1.6vw,19px);color:#fff}
.lane .ms{font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:var(--red)}
.lane .bar{height:10px;background:rgba(255,255,255,.1);border-radius:999px;overflow:hidden}
.lane .bar i{display:block;height:100%;width:0;background:var(--red);border-radius:999px}
.lane.slow .bar i{background:#55555a}
.lane .note{font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:#7a7a7e;margin-top:8px;min-height:1.3em}
#rgo{
  display:inline-flex;align-items:center;gap:10px;min-height:46px;padding:0 24px;border-radius:999px;
  background:var(--red);color:#fff;border:none;font-family:var(--body);font-weight:600;font-size:14px;cursor:pointer;
  transition:background .25s,transform .25s;margin-top:6px;
}
#rgo:hover{background:#c40017;transform:translateY(-2px)}
#rgo:disabled{opacity:.45;transform:none;cursor:default}

/* ============ 3 — BUILD (scrub) ============ */
#build{height:340vh;padding:0}
#build .pin{position:sticky;top:0;height:100svh;display:grid;grid-template-columns:.85fr 1.15fr;gap:clamp(26px,4vw,68px);align-items:center;padding:clamp(90px,13vh,140px) var(--pad) clamp(50px,8vh,90px)}
#build .btext{position:relative}
#build .bstep{position:absolute;top:0;left:0;opacity:0;transform:translateY(16px);transition:opacity .4s,transform .4s cubic-bezier(.16,1,.3,1);pointer-events:none}
#build .bstep.on{opacity:1;transform:none;position:relative;pointer-events:auto}
#build .bnum{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--red);margin-bottom:11px}
#bview .el{position:absolute;left:7%;right:7%;border-radius:3px;background:#EDEDEA;opacity:0;transform:translateY(10px);transition:opacity .45s,transform .45s cubic-bezier(.16,1,.3,1),background .45s}
#bview .el.on{opacity:1;transform:none}
#bview .e1{top:11%;height:9%;right:44%}
#bview .e2{top:26%;height:6%;right:20%}
#bview .e3{top:35%;height:6%;right:32%}
#bview .e4{top:50%;height:21%;right:53%}
#bview .e5{top:50%;left:53%;height:21%;right:7%}
#bview .e6{top:81%;height:8%;right:63%;border-radius:999px}
/* stage 3 dresses the skeleton in the real thing */
#bview.done .e1{background:var(--black)}
#bview.done .e4{background:linear-gradient(140deg,#1a1a1d,#3a3a40)}
#bview.done .e6{background:var(--red)}
#bmeter{position:absolute;right:12px;bottom:10px;font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:var(--grey)}
#build .bprog{position:absolute;left:var(--pad);bottom:clamp(30px,6vh,60px);display:flex;gap:6px}
#build .bprog i{width:24px;height:2px;background:rgba(11,11,12,.16);transition:background .35s}
#build .bprog i.on{background:var(--red)}

/* ============ 4 — ONE JOB ============ */
#job .jgrid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line);border:1px solid var(--line);margin-top:clamp(30px,5vh,54px)}
.jcol{background:var(--white);padding:clamp(22px,3vw,38px)}
.jcol h3{font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;color:var(--red);margin-bottom:18px}
.jcol ul{list-style:none;display:flex;flex-direction:column;gap:11px}
.jcol li{font-size:14.5px;line-height:1.5;color:#4a4a4e;display:flex;gap:10px;align-items:flex-start}
.jcol li::before{content:"";flex:0 0 auto;width:6px;height:6px;border-radius:50%;background:var(--line);margin-top:7px}
.jcol.good li::before{background:var(--red)}
.jcol .verdict{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;color:var(--grey);margin-top:20px;padding-top:15px;border-top:1px solid var(--line)}
.jcol.good .verdict{color:var(--red)}

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
  #dhero{grid-template-columns:1fr;gap:32px;min-height:auto;padding-top:clamp(96px,15vh,130px)}
  #race .rwrap{grid-template-columns:1fr;gap:26px}
  #build{height:auto}
  #build .pin{position:static;height:auto;grid-template-columns:1fr;gap:26px;padding:clamp(70px,10vh,100px) var(--pad)}
  #build .bstep{position:relative;opacity:1;transform:none;margin-bottom:22px}
  #build .bprog{display:none}
  #bview .el{opacity:1;transform:none}
  #job .jgrid{grid-template-columns:1fr}
  .prow{grid-template-columns:auto minmax(0,1fr);row-gap:7px}
  .prow .pt{grid-column:2;justify-self:start}
}
@media (max-width:480px){ #dhero h1{font-size:clamp(36px,12vw,54px)} }
@media (max-height:600px){
  #dhero{min-height:auto}
  #build{height:auto}
  #build .pin{position:static;height:auto}
  #build .bstep{position:relative;opacity:1;transform:none;margin-bottom:20px}
  #bview .el{opacity:1;transform:none}
}
@media (prefers-reduced-motion:reduce){
  *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
  .up{opacity:1;transform:none}
  #dhero h1 .l i{transform:none;animation:none}
  #hbrw .sk{opacity:1;animation:none}
  #build{height:auto}
  #build .pin{position:static;height:auto}
  #build .bstep{position:relative;opacity:1;transform:none;margin-bottom:22px}
  #bview .el{opacity:1;transform:none}
}
`;

const BUILD_STEPS = [
  { n: "STAGE 01", h: "Structure before anything else", p: "What the page is for and what order its argument runs in. A page whose case works in plain text will work beautifully once designed; one that does not never recovers." },
  { n: "STAGE 02", h: "Real content, not lorem", p: "Layouts are built against the words that will actually be there. Designing around placeholder text is how a site ends up with a headline slot nothing true fits into." },
  { n: "STAGE 03", h: "Weight added deliberately", p: "Images and type are the page's weight, and every kilobyte is a decision. Sized properly here, they cost nothing later; ignored here, they become the reason the page is slow." },
  { n: "STAGE 04", h: "Useful before it is finished", p: "The page should be readable and usable before everything has arrived. That is what separates a site that feels instant from one that technically loads in the same time." },
];

const JOB_BAD = [
  "Impress investors",
  "Explain the product",
  "Recruit staff",
  "Rank for six search terms",
  "Announce the latest news",
  "Collect newsletter signups",
];
const JOB_GOOD = [
  "Make the offer obvious in one line",
  "Prove it with real work",
  "Answer the two objections that stop people",
  "Give one clear next step",
];

const PROOF = [
  { n: "Hitex SportExpo", t: "Web · Registration", d: "Built to hold up under launch-week traffic, with visitor registration and exhibitor enquiries on one clean path." },
  { n: "Patil Group", t: "Web · Corporate", d: "A corporate site carrying fifty years of scale without raising its voice." },
  { n: "Hope Trust India", t: "Web · Content", d: "Built for someone reaching out at their lowest — clear programmes, honest copy, a therapist one click away." },
  { n: "Our Sacred Space", t: "Web · Bookings", d: "A venue whose calendar is the product, with booking never more than one click away." },
];

const NEXT = [
  { slug: "identity", label: "Identity" },
  { slug: "design", label: "Design" },
  { slug: "social-media", label: "Social Media" },
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

export const DIGITAL_HTML = String.raw`
<div id="dgbg"></div>
<div id="dgline"></div>
<div id="dgrail" role="navigation" aria-label="Section"></div>

<!-- 1 — HERO -->
<section class="dgs" id="dhero" data-bg="#FAFAF8" data-label="Digital">
  <div>
    <div class="crumb"><a href="/">Home</a><span>/</span><a href="/services">Services</a><span>/</span><b>Digital</b></div>
    <h1>${heroLine("SITES THAT", 0.15)}<br>${heroLine("EARN THEIR KEEP", 0.44, true)}</h1>
    <p class="dgp">Websites designed, built and shipped end to end — fast to load, clear to read, and built around the one thing you actually need a visitor to do.</p>
  </div>
  <div class="brw" id="hbrw">
    <div class="chrome"><b></b><b></b><b></b><div class="url">admirate.in/your-homepage<span class="caret"></span></div></div>
    <div class="load"><i style="width:100%"></i></div>
    <div class="view">
      <span class="sk s1"></span><span class="sk s2"></span><span class="sk s3"></span>
      <span class="sk s4"></span><span class="sk s5"></span><span class="sk s6"></span>
    </div>
  </div>
</section>

<!-- 2 — RACE -->
<section class="dgs dark" id="race" data-bg="#0B0B0C" data-label="The race">
  <div class="dgeb up">THE COST OF SLOW</div>
  <h2 class="dgh up" style="--d:.08s">Nobody complains. They just <em>leave</em>.</h2>
  <div class="rwrap">
    <div>
      <p class="dgp up" style="--d:.14s">A slow site does not produce angry emails. It produces a number that was always going to be lower, with no explanation attached. Run the two side by side.</p>
      <button type="button" id="rgo" class="up" style="--d:.22s" data-h>Run the race <span>→</span></button>
      <p class="dgp up" style="--d:.28s;font-size:12.5px;color:#6a6a6e">Illustrative, not a measurement of any particular site.</p>
    </div>
    <div class="up" style="--d:.18s">
      <div class="lane fast">
        <div class="top"><span class="nm">Built for speed</span><span class="ms" id="rmsf">0.0s</span></div>
        <div class="bar"><i id="rbf"></i></div>
        <div class="note" id="rnf"></div>
      </div>
      <div class="lane slow">
        <div class="top"><span class="nm">Everything left in</span><span class="ms" id="rmss">0.0s</span></div>
        <div class="bar"><i id="rbs"></i></div>
        <div class="note" id="rns"></div>
      </div>
    </div>
  </div>
</section>

<!-- 3 — BUILD (scrub) -->
<section id="build" data-bg="#FFFFFF" data-label="The build">
  <div class="pin">
    <div class="btext">
      <div class="dgeb">THE BUILD</div>
      ${BUILD_STEPS.map(
        (s, i) => `<div class="bstep${i === 0 ? " on" : ""}" data-i="${i}">
        <div class="bnum">${s.n}</div>
        <h2 class="dgh">${s.h}</h2>
        <p class="dgp">${s.p}</p>
      </div>`
      ).join("\n      ")}
    </div>
    <div class="brw">
      <div class="chrome"><b></b><b></b><b></b><div class="url" id="burl">admirate.in</div></div>
      <div class="load"><i id="bload"></i></div>
      <div class="view" id="bview">
        <span class="el e1"></span><span class="el e2"></span><span class="el e3"></span>
        <span class="el e4"></span><span class="el e5"></span><span class="el e6"></span>
        <span id="bmeter">0%</span>
      </div>
    </div>
    <div class="bprog" aria-hidden="true">${BUILD_STEPS.map((_, i) => `<i${i === 0 ? ' class="on"' : ""}></i>`).join("")}</div>
  </div>
</section>

<!-- 4 — ONE JOB -->
<section class="dgs" id="job" data-bg="#FAFAF8" data-label="One job">
  <div class="dgeb up">ONE PAGE, ONE JOB</div>
  <h2 class="dgh up" style="--d:.08s">Pages fail by trying to serve <em>everyone</em>.</h2>
  <p class="dgp up" style="--d:.14s">Deciding what a page is primarily for is the highest-leverage decision in a build — and it is a strategy decision, not a design one.</p>
  <div class="jgrid">
    <div class="jcol up" style="--d:.2s">
      <h3>A HOMEPAGE ASKED TO DO EVERYTHING</h3>
      <ul>${JOB_BAD.map((x) => `<li>${x}</li>`).join("")}</ul>
      <div class="verdict">// SIX JOBS. ALL OF THEM DONE WEAKLY.</div>
    </div>
    <div class="jcol good up" style="--d:.28s">
      <h3>A HOMEPAGE WITH ONE JOB</h3>
      <ul>${JOB_GOOD.map((x) => `<li>${x}</li>`).join("")}</ul>
      <div class="verdict">// ONE JOB. THE REST HAS ITS OWN PAGE.</div>
    </div>
  </div>
</section>

<!-- 5 — PROOF -->
<section class="dgs" id="dproof" data-bg="#FFFFFF" data-label="Proof">
  <div class="dgeb up">PROOF</div>
  <h2 class="dgh up" style="--d:.08s">Sites already doing the <em>job</em>.</h2>
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
    <p>A website is usually the only part of a brand a stranger meets alone — without a salesperson, a room, or any explanation. Whatever it communicates in the first few seconds is what the brand becomes to that person. It is a high-stakes moment that routinely gets treated as a technical deliverable.</p>
    <h3>Speed is not a technical concern</h3>
    <p>The delay between tapping a link and seeing something useful is where a large share of visitors are lost, and they are lost silently. Performance is not polish applied at the end; it is decided early, by choices about images, fonts and how much has to arrive before the page means anything at all.</p>
    <h3>Findable by construction</h3>
    <p>Search visibility is mostly a consequence of building the thing properly: real headings, honest metadata, structured data that matches what is on the page, and URLs that do not change. Done during the build it costs almost nothing. Added afterwards it becomes a project.</p>
    <h3>Built to be lived in</h3>
    <p>A site is not finished at launch — it is inherited. If updating it requires the people who built it, it will either stagnate or quietly degrade. The handover matters as much as the build.</p>
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
    <h2 class="up">Let's build<br>something <em>fast</em>.</h2>
    <p class="csub up" style="--d:.12s">// TELL US THE GOAL. WE REPLY WITHIN ONE WORKING DAY.</p>
    <div class="btns up" style="--d:.22s">
      <a class="dbtn gh" href="/services" data-h>All services <span class="ar">→</span></a>
      <a class="dbtn red" href="/start-project?service=Digital" data-h>Start your project <span class="ar">→</span></a>
    </div>
  </div>
  <footer><div>© 2026 ADMIRATE.IN</div><div>MADE TO CONVERT</div></footer>
</section>
`;
