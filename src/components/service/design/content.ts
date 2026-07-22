/**
 * DESIGN — advertising and design, argued by showing rather than telling.
 *
 * Set-pieces unique to this page:
 *   RETIC  a faint reticle drifts across the hero — the page's premise, stated
 *          quietly rather than written out
 *   CRAFT  an ad assembles itself on a dark canvas, element by element, in the
 *          order the eye is meant to take them
 *   MED    one idea rebuilt for a hoarding, a feed and a printed page, to make
 *          the point that the three are different problems and not one resize
 *   DWORK  a rolling cut of the real client creatives, drawn from the same
 *          shared list the #social grid on /services renders
 *
 * The assembly is CSS-only: the section's `.in` class starts it, so it plays
 * once when scrolled to and never needs a frame of JavaScript.
 */

import { creative, optimized } from "@/lib/cdn";
import { CLIENT_CREATIVES } from "@/components/shared/creatives";

import { NAP_HTML } from "@/lib/seo";

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
.dgh{font-family:var(--display);font-weight:800;font-stretch:106%;font-size:clamp(27px,4.6vw,60px);line-height:1.05;letter-spacing:-.026em;max-width:17ch}
.dgh em{font-style:normal;color:var(--red)}
.dgp{font-size:clamp(15px,1.4vw,18px);line-height:1.7;color:#4a4a4e;max-width:56ch;margin-top:18px}
.dgs.dark .dgp{color:#a4a4a8}
.up{opacity:0;transform:translateY(26px);transition:opacity .8s,transform .8s cubic-bezier(.16,1,.3,1)}
.dgs.in .up{opacity:1;transform:none;transition-delay:var(--d,0s)}

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

/* ============ 2 — THE CRAFT ============ */
#craft .cwrap{display:grid;grid-template-columns:1fr 1fr;gap:clamp(30px,5vw,80px);align-items:center}
.captags{display:flex;flex-wrap:wrap;gap:9px;margin-top:26px}
.captags span{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;color:#c8c8cc;border:1px solid rgba(255,255,255,.2);border-radius:999px;padding:9px 15px;transition:border-color .3s,color .3s}
.captags span:hover{border-color:var(--red);color:#fff}
#craft .asm{display:flex;flex-direction:column;align-items:center;gap:14px}
.acanvas{position:relative;width:min(100%,440px);aspect-ratio:16/11;background:#141417;border:1px solid rgba(255,255,255,.12);border-radius:8px;overflow:hidden}
.acanvas .gl{position:absolute;background:rgba(227,0,27,.5);opacity:0}
.acanvas .gv{left:9%;top:0;width:1px;height:100%}
.acanvas .gh{left:0;top:26%;height:1px;width:100%}
.acanvas .ael{position:absolute;opacity:0}
.a-mk{left:9%;top:9%;font-family:var(--display);font-weight:900;font-stretch:114%;font-size:clamp(20px,2.2vw,28px);color:#fff;transform:translate(-14px,0)}
.a-mk u{text-decoration:none;color:var(--red)}
.a-hd{left:9%;top:30%;width:56%;height:11%;background:#fff;border-radius:3px;transform:translateY(14px)}
.a-hd2{left:9%;top:45%;width:38%;height:6%;background:rgba(255,255,255,.34);border-radius:3px;transform:translateY(14px)}
.a-img{right:9%;bottom:14%;width:30%;height:44%;background:linear-gradient(145deg,#2a2a2e,#1a1a1d 60%,rgba(227,0,27,.35));border-radius:4px;transform:scale(.9);transform-origin:center}
.a-cta{left:9%;bottom:14%;font-family:var(--body);font-weight:600;font-size:clamp(10px,1.1vw,13px);letter-spacing:.04em;background:var(--red);color:#fff;padding:9px 16px;border-radius:999px;transform:translateY(12px)}
.dgs.in .acanvas .gl{animation:aguide 2.4s ease forwards}
.dgs.in .a-mk{animation:ain .7s cubic-bezier(.16,1,.3,1) .15s forwards}
.dgs.in .a-hd{animation:ain .7s cubic-bezier(.16,1,.3,1) .5s forwards}
.dgs.in .a-hd2{animation:ain .7s cubic-bezier(.16,1,.3,1) .68s forwards}
.dgs.in .a-img{animation:ain .8s cubic-bezier(.16,1,.3,1) .9s forwards}
.dgs.in .a-cta{animation:ain .7s cubic-bezier(.16,1,.3,1) 1.2s forwards,ctapulse 4.5s ease-in-out 3s infinite}
@keyframes ain{to{opacity:1;transform:none}}
@keyframes aguide{0%{opacity:0}18%{opacity:1}72%{opacity:1}100%{opacity:0}}
@keyframes ctapulse{0%,100%{box-shadow:0 0 0 0 rgba(227,0,27,.45)}42%{box-shadow:0 0 0 9px rgba(227,0,27,0)}}

/* ============ 3 — MEDIUM ============ */
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

/* ============ 4 — THE WORK ============ */
#dwork .mq{margin-top:clamp(30px,5vh,52px);overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
/* 120s, not the 46s this ran at while the strip was six drawn cards. The track
   is ~2.6x longer now, and translateX(-50%) covers whatever it holds in the
   duration given — at 46s the same set scrolls 2.6x faster and the drift turns
   into a blur. This keeps the original px/sec. */
#dwork .mqtrack{display:flex;width:max-content;animation:mqx 120s linear infinite}
#dwork .mq:hover .mqtrack{animation-play-state:paused}
.mqset{display:flex;gap:clamp(14px,2vw,24px);padding-right:clamp(14px,2vw,24px)}
@keyframes mqx{to{transform:translateX(-50%)}}
/* Cards are sized by height, not width — the reverse of the #social grid on
   /services. The strip carries both 4:5 and 1:1 creatives, so a fixed width
   would leave a ragged bottom edge; a fixed height with the image's true ratio
   on --ar keeps the top and bottom lines straight and lets the ratio show as
   width. object-fit:cover therefore never actually crops: the box is already
   the shape of the image inside it. */
.wcard{flex:0 0 auto}
.wart{height:clamp(260px,30vw,375px);aspect-ratio:var(--ar,1);border:1px solid var(--line);border-radius:6px;overflow:hidden;position:relative;background:#fff;transition:transform .45s cubic-bezier(.16,1,.3,1),box-shadow .45s}
.wart img{display:block;width:100%;height:100%;object-fit:cover}
.wcard:hover .wart{transform:translateY(-6px);box-shadow:0 18px 40px rgba(11,11,12,.14)}

/* ============ 5 — CLOSE ============ */
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
  #craft .cwrap{grid-template-columns:1fr;gap:30px}
}
@media (max-width:480px){ #dhero h1{font-size:clamp(36px,12vw,54px)} }
@media (max-height:600px){
  #dhero{min-height:auto}
}
@media (prefers-reduced-motion:reduce){
  *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
  .up{opacity:1;transform:none}
  #dhero h1 .l i{transform:none;animation:none}
  #dhero .retic{display:none}
  #dwork .mqtrack{animation:none}
  #dwork .mq{overflow-x:auto;-webkit-mask-image:none;mask-image:none}
  .acanvas .ael{opacity:1;transform:none;animation:none}
  .acanvas .gl{display:none}
}
`;

/** What the craft section claims to cover, as chips. */
const CAPABILITIES = [
  "CAMPAIGN CREATIVE",
  "AD CREATIVES",
  "PRINT",
  "DIGITAL",
  "ART DIRECTION",
];

/* One line, rebuilt three times. The copy is deliberately identical across the
   three frames — the frames are the argument, not the words. */
const MEDIUMS = [
  { cls: "bill", d: 0.2 },
  { cls: "feed", d: 0.27 },
  { cls: "page", d: 0.34 },
];
const MEDIUM_LINE = `Stop<span>.</span> Look here first`;

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

/* The marquee needs its contents twice: the track translates -50%, so the
   second copy is what occupies the viewport as the first scrolls out. It is
   duplicate content, hence aria-hidden on the copy — and an empty alt on its
   images, so the artwork is not announced twice by anything that walks the
   images directly rather than honouring the container.

   The URLs are byte-identical to the ones the #social grid on /services emits
   (same optimizer width and quality), so arriving here from that page is a
   cache hit rather than fourteen fresh downloads. `q` must stay 75 — Next 16
   ships only that in images.qualities and 400s anything else. */
const workSet = (hidden: boolean) => `
      <div class="mqset"${hidden ? ' aria-hidden="true"' : ""}>
      ${CLIENT_CREATIVES.map(
        (c) =>
          `<div class="wcard"><div class="wart" style="--ar:${c.ar}"><img src="${optimized(
            creative(c.file),
          )}" alt="${hidden ? "" : c.alt}" loading="lazy" decoding="async"></div></div>`,
      ).join("\n      ")}
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
  <p class="dgp">Purposeful, minimal, functional — design where every element exists for a reason, placed to carry the eye from first glance to action.</p>
</section>

<!-- 2 — THE CRAFT -->
<section class="dgs dark" id="craft" data-bg="#0B0B0C" data-label="The craft">
  <div class="cwrap">
    <div>
      <h2 class="dgh up" style="--d:.08s">Every element <em>earns</em> its place.</h2>
      <p class="dgp up" style="--d:.16s">Purposeful, minimal, functional. Nothing decorative, nothing shouting — each element exists for a reason, arranged into one seamless visual journey from first glance to action.</p>
      <div class="captags up" style="--d:.24s">
        ${CAPABILITIES.map((c) => `<span>${c}</span>`).join("")}
      </div>
    </div>
    <div class="asm up" style="--d:.2s" aria-hidden="true">
      <div class="acanvas">
        <i class="gl gv"></i><i class="gl gh"></i>
        <span class="ael a-mk">A<u>.</u></span>
        <span class="ael a-hd"></span>
        <span class="ael a-hd2"></span>
        <span class="ael a-img"></span>
        <span class="ael a-cta">START →</span>
      </div>
    </div>
  </div>
</section>

<!-- 3 — MEDIUM -->
<section class="dgs" id="med" data-bg="#FAFAF8" data-label="Medium">
  <h2 class="dgh up" style="--d:.08s">One idea. Three genuinely <em>different</em> problems.</h2>
  <p class="dgp up" style="--d:.14s">A hoarding, a feed and a printed page are three different problems — so the idea is rebuilt for each, never just resized.</p>
  <div class="mrow">
    ${MEDIUMS.map(
      (m) => `<div class="mfr up" style="--d:${m.d.toFixed(2)}s">
      <div class="win ${m.cls}"><div class="t">${MEDIUM_LINE}</div></div>
    </div>`,
    ).join("\n    ")}
  </div>
</section>

<!-- 4 — THE WORK -->
<section class="dgs" id="dwork" data-bg="#FFFFFF" data-label="The work">
  <h2 class="dgh up">Design that earned the <em>look</em>.</h2>
  <p class="dgp up" style="--d:.1s">A rolling cut of campaign and ad creative — built to stop the eye, then move it.</p>
  <div class="mq up" style="--d:.18s">
    <div class="mqtrack">${workSet(false)}${workSet(true)}
    </div>
  </div>
</section>

<!-- 5 — CLOSE -->
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
    <h2 class="up">Let's make them<br><em>look</em>.</h2>
    <p class="csub up" style="--d:.12s">// TELL US THE GOAL. WE REPLY WITHIN ONE WORKING DAY.</p>
    <div class="btns up" style="--d:.22s">
      <a class="dbtn gh" href="/services" data-h>All services <span class="ar">→</span></a>
      <a class="dbtn red" href="/start-project?service=Design" data-h>Start your project <span class="ar">→</span></a>
    </div>
  </div>
  <footer><div>© 2026 ADMIRATE.IN</div><div>${NAP_HTML}</div><div>MADE TO CONVERT</div></footer>
</section>
`;
