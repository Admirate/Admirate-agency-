/**
 * DIGITAL — websites, argued as journeys rather than pages.
 *
 * Set-pieces unique to this page:
 *   RACE     two loading bars run side by side on a button press. It is the
 *            one claim on this page a paragraph cannot make, so it is played
 *            rather than stated — and labelled illustrative, because it is
 *            not a measurement of anyone's site
 *   JOURNEY  a five-node path from visit to CRM, drawn in as the section
 *            arrives, with the integrations that carry each step beneath it
 *   BUILT    the four things a build is held to, as a plain pillar row
 */

import { showcaseCss, SHOWCASE_HTML } from "@/components/shared/showcase";

import { NAP_HTML } from "@/lib/seo";

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
.dgh{font-family:var(--display);font-weight:800;font-stretch:106%;font-size:clamp(27px,4.6vw,60px);line-height:1.05;letter-spacing:-.026em;max-width:17ch}
.dgh em{font-style:normal;color:var(--red)}
.dgp{font-size:clamp(15px,1.4vw,18px);line-height:1.7;color:#4a4a4e;max-width:56ch;margin-top:18px}
.dgs.dark .dgp{color:#a4a4a8}
.up{opacity:0;transform:translateY(26px);transition:opacity .8s,transform .8s cubic-bezier(.16,1,.3,1)}
.dgs.in .up{opacity:1;transform:none;transition-delay:var(--d,0s)}

/* browser chrome, used by the hero */
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

/* ============ 3 — THE JOURNEY ============ */
#journey .jsub{margin-top:14px}
#jflow{width:100%;max-width:960px;height:auto;overflow:visible;margin-top:clamp(34px,5vh,58px)}
#jflow .jpath{fill:none;stroke:var(--line);stroke-width:2}
#jflow .jlive{fill:none;stroke:var(--red);stroke-width:2;stroke-linecap:round;stroke-dasharray:var(--jl,900);stroke-dashoffset:var(--jl,900);transition:stroke-dashoffset 1.8s cubic-bezier(.5,0,.2,1) .2s}
#journey.in #jflow .jlive{stroke-dashoffset:0}
#jflow .jnode{fill:var(--white);stroke:var(--line);stroke-width:2}
#jflow .jnode.hit{stroke:var(--red)}
#jflow .jnum{font-family:var(--mono);font-size:7px;fill:var(--red)}
#jflow .jtxt{font-family:var(--mono);font-size:8px;letter-spacing:.1em;fill:#4a4a4e}
#journey .jgrid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,170px),1fr));gap:1px;background:var(--line);border:1px solid var(--line);margin-top:clamp(30px,5vh,52px)}
.jcard{background:#fff;padding:clamp(18px,2.2vw,26px);display:flex;flex-direction:column;gap:10px;min-height:150px;transition:background .35s}
.jcard .jn{font-family:var(--mono);font-size:10px;letter-spacing:.2em;color:var(--red)}
.jcard h3{font-family:var(--display);font-weight:800;font-stretch:104%;text-transform:uppercase;font-size:clamp(14px,1.4vw,17px);letter-spacing:-.005em}
.jcard p{font-size:13px;line-height:1.6;color:#5a5a5e}
.jcard:hover{background:#FAFAF8}

/* ============ 4 — BUILT RIGHT ============ */
#built .pillars{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr));gap:clamp(18px,2.6vw,34px);margin-top:clamp(30px,5vh,52px)}
.pillar{border-top:2px solid var(--black);padding-top:16px;transition:border-color .3s}
.pillar:hover{border-color:var(--red)}
.pillar h3{font-family:var(--display);font-weight:900;font-stretch:110%;text-transform:uppercase;font-size:clamp(17px,1.8vw,22px);letter-spacing:-.01em}
.pillar p{font-size:13.5px;line-height:1.6;color:#5a5a5e;margin-top:9px}

/* ============ 5 — THE WORK ============
   The showcase brings its own styles. .dgs.in is what this page puts on a
   section once it is on screen, so that is the hook its entrance hangs off. */
${showcaseCss(".dgs.in")}

/* ============ 6 — CLOSE ============ */
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
}
@media (max-width:480px){ #dhero h1{font-size:clamp(36px,12vw,54px)} }
@media (max-height:600px){
  #dhero{min-height:auto}
}
@media (prefers-reduced-motion:reduce){
  *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
  .up{opacity:1;transform:none}
  #dhero h1 .l i{transform:none;animation:none}
  #hbrw .sk{opacity:1;animation:none}
  #jflow .jlive{stroke-dashoffset:0;transition:none}
}
`;

/** The path a visitor takes, and where it ends. */
const JOURNEY_NODES = [
  { x: 45, label: "VISIT" },
  { x: 182, label: "EXPLORE" },
  { x: 320, label: "CHAT" },
  { x: 458, label: "BOOK" },
  { x: 595, label: "CRM" },
];

/** What carries each step of that path. */
const JOURNEY_CARDS = [
  { h: "Booking systems", p: "Appointments and reservations taken on the spot — no back-and-forth." },
  { h: "WhatsApp integrations", p: "The conversation continues where your customers already are." },
  { h: "Chatbots", p: "Questions answered at 2 a.m., leads qualified before you wake up." },
  { h: "Lead capture", p: "Forms and flows that ask just enough — and never lose an enquiry." },
  { h: "CRM integrations", p: "Every lead lands in your pipeline automatically, tagged and ready." },
];

const PILLARS = [
  { h: "Future-proof", p: "Built on foundations that grow with you — never rebuilt from scratch in two years." },
  { h: "Secure", p: "Hardened, maintained and monitored — your site and your customers' data stay safe." },
  { h: "Scalable", p: "Launch-day traffic or year-five traffic, the experience stays instant." },
  { h: "Conversion-first", p: "Every page has one job, one path and one clear next step." },
];

/* The four clients this section used to list in type are the same four the
   showcase opens, with the same claims made about them — so the list is gone
   and the roster now comes from shared/showcase.ts, where the dashboard can
   also replace it. */

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
    <p class="dgp">We don't just build websites — we build frictionless customer journeys. From the first click to the enquiry in your CRM, every step is designed to convert.</p>
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
  <h2 class="dgh up" style="--d:.08s">Nobody complains. They just <em>leave</em>.</h2>
  <div class="rwrap">
    <div>
      <p class="dgp up" style="--d:.14s">Speed is the first step of the journey. Run the two side by side.</p>
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

<!-- 3 — THE JOURNEY -->
<section class="dgs" id="journey" data-bg="#FFFFFF" data-label="The journey">
  <h2 class="dgh up" style="--d:.08s">The site is the door. The <em>journey</em> is the point.</h2>
  <p class="dgp jsub up" style="--d:.14s">A visitor should glide from curiosity to conversation without ever hitting friction — every path ends in a booking, a chat or a lead, never a dead end.</p>
  <svg id="jflow" class="up" style="--d:.2s" viewBox="0 0 640 130" role="img" aria-label="A frictionless journey from visit to chat to booking to CRM">
    <path class="jpath" d="M45 70 H595"/>
    <path class="jlive" style="--jl:550" d="M45 70 H595"/>
    ${JOURNEY_NODES.map(
      (n, i) => `<circle class="jnode hit" cx="${n.x}" cy="70" r="15"/>
    <text class="jnum" x="${n.x}" y="73" text-anchor="middle">0${i + 1}</text>
    <text class="jtxt" x="${n.x}" y="105" text-anchor="middle">${n.label}</text>`,
    ).join("\n    ")}
  </svg>
  <div class="jgrid2 up" style="--d:.26s">
    ${JOURNEY_CARDS.map(
      (c, i) =>
        `<article class="jcard"><span class="jn">0${i + 1}</span><h3>${c.h}</h3><p>${c.p}</p></article>`,
    ).join("\n    ")}
  </div>
</section>

<!-- 4 — BUILT RIGHT -->
<section class="dgs" id="built" data-bg="#FAFAF8" data-label="Built right">
  <h2 class="dgh up">Designed around <em>conversion</em>, not just appearance.</h2>
  <div class="pillars up" style="--d:.14s">
    ${PILLARS.map((p) => `<div class="pillar"><h3>${p.h}</h3><p>${p.p}</p></div>`).join("\n    ")}
  </div>
</section>

<!-- 5 — THE WORK -->
<section class="dgs" id="dproof" data-bg="#FFFFFF" data-label="The work">
  <h2 class="dgh up">Journeys already doing the <em>job</em>.</h2>
  <p class="dgp up" style="--d:.1s">Pick a client and their site loads here. Every one of them is live right now — open it and judge the work yourself.</p>
  ${SHOWCASE_HTML}
</section>

<!-- 6 — CLOSE -->
<section class="dgs dark" id="dclose" data-bg="#0B0B0C" data-label="Close">
  <h2 class="dgh up" style="--d:.08s">The rest of what we do.</h2>
  <div class="nlist">
    ${NEXT.map(
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
    <h2 class="up">Let's build<br>something <em>fast</em>.</h2>
    <p class="csub up" style="--d:.12s">// TELL US THE GOAL. WE REPLY WITHIN ONE WORKING DAY.</p>
    <div class="btns up" style="--d:.22s">
      <a class="dbtn gh" href="/services" data-h>All services <span class="ar">→</span></a>
      <a class="dbtn red" href="/start-project?service=Digital" data-h>Start your project <span class="ar">→</span></a>
    </div>
  </div>
  <footer><div>© 2026 ADMIRATE.IN</div><div>${NAP_HTML}</div><div>MADE TO CONVERT</div></footer>
</section>
`;
