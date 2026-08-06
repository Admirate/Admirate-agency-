/**
 * VIDEO PRODUCTION — films, argued from the edit rather than the shoot.
 *
 * Set-pieces unique to this page:
 *   APERTURE  six blades open and close around a play mark in the hero
 *   SHOWREEL  the reel itself, framed as footage — it loops muted as ambience
 *             and commits to sound only when asked
 *   CRAFT     the four beats of a film that works, landing in sequence behind
 *             a red rule that draws across them
 *   SOUND     an equaliser standing in for the half of a film you cannot see
 *
 * The showreel replaced a 360vh pinned scroll-scrub and a marquee of six
 * invented frames. Both were arguing for work the page could now simply show.
 */

import { HERO_KEYWORD_CSS, heroKeyword } from "@/components/shared/hero-keyword";
import { JOURNAL_CSS, journalLinks } from "@/components/shared/journal-links";
import {
  SERVICE_PROSE_CSS,
  serviceProse,
} from "@/components/shared/service-prose";
import { NAP_HTML, LEGAL_HTML } from "@/lib/seo";
import { video } from "@/lib/cdn";

/**
 * The showreel object in the "videos" bucket.
 *
 * Nothing else references the name, so a re-cut or a rename is this one string.
 */
const SHOWREEL = "admirate summary 3 (1).mp4";

export const VIDEO_CSS = String.raw`
:root{
  --white:#FFFFFF;--paper:#FAFAF8;--black:#0B0B0C;--red:#E3001B;
  --grey:#8A8A8E;--line:#E9E9E6;--pad:clamp(24px,6vw,96px);
  --display:'Archivo',sans-serif;--body:'Inter',sans-serif;--mono:'IBM Plex Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:auto}
body{font-family:var(--body);background:var(--black);color:var(--black);overflow-x:hidden;-webkit-font-smoothing:antialiased}
body.smopen{overflow:hidden}
::selection{background:var(--red);color:var(--white)}

#vbg{position:fixed;inset:0;z-index:-2;background:var(--black);transition:background-color .7s cubic-bezier(.4,0,.2,1)}
#vline{position:fixed;top:0;left:0;height:2px;width:0;background:var(--red);z-index:200}
#vrail{position:fixed;left:clamp(14px,2.4vw,34px);top:50%;transform:translateY(-50%);z-index:120;display:flex;flex-direction:column;gap:14px}
#vrail button{padding:0;border:none;background:none;cursor:pointer;display:flex;align-items:center}
#vrail i{display:block;width:18px;height:1px;background:rgba(11,11,12,.25);transition:width .35s cubic-bezier(.16,1,.3,1),background .35s}
#vrail.ondark i{background:rgba(255,255,255,.3)}
#vrail button.on i,#vrail.ondark button.on i{width:38px;background:var(--red)}

.vs{position:relative;z-index:1;padding:clamp(96px,14vh,150px) var(--pad) clamp(70px,11vh,120px)}
.vs.dark{color:var(--white)}
.vh{font-family:var(--display);font-weight:800;font-stretch:106%;font-size:clamp(27px,4.6vw,60px);line-height:1.05;letter-spacing:-.026em;max-width:17ch}
.vh em{font-style:normal;color:var(--red)}
.vp{font-size:clamp(15px,1.4vw,18px);line-height:1.7;color:#4a4a4e;max-width:56ch;margin-top:18px}
.vs.dark .vp{color:#a4a4a8}
.up{opacity:0;transform:translateY(26px);transition:opacity .8s,transform .8s cubic-bezier(.16,1,.3,1)}
.vs.in .up{opacity:1;transform:none;transition-delay:var(--d,0s)}

/* ============ 1 — HERO ============ */
#vhero{min-height:100svh;display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(28px,5vw,76px);align-items:center}
#vhero .crumb{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--grey);margin-bottom:clamp(20px,3.4vh,34px);display:flex;gap:10px;flex-wrap:wrap}
#vhero .crumb a{color:var(--grey);text-decoration:none;transition:color .25s}
#vhero .crumb a:hover{color:var(--red)}
#vhero .crumb b{color:#fff;font-weight:500}
#vhero h1{font-family:var(--display);font-weight:900;font-stretch:114%;font-size:clamp(42px,8.4vw,118px);line-height:.9;letter-spacing:-.035em;text-transform:uppercase;color:#fff}
#vhero h1 .wd{display:inline-block;white-space:nowrap}
#vhero h1 .l{display:inline-block;overflow:hidden;vertical-align:bottom}
#vhero h1 .l i{display:inline-block;font-style:normal;transform:translateY(102%);animation:vr .95s cubic-bezier(.16,1,.3,1) forwards;animation-delay:var(--d,0s)}
@keyframes vr{to{transform:none}}
#vhero h1 u{text-decoration:none;color:var(--red)}
#vhero .apwrap{display:flex;justify-content:center;align-items:center}
#apsvg{width:min(100%,320px);color:var(--red);overflow:visible}
#apsvg .bl{fill:none;stroke:currentColor;stroke-width:1.4;transform-origin:100px 100px;animation:iris 7s ease-in-out infinite}
#apsvg .bl:nth-child(2){animation-delay:.1s}
#apsvg .bl:nth-child(3){animation-delay:.2s}
#apsvg .bl:nth-child(4){animation-delay:.3s}
#apsvg .bl:nth-child(5){animation-delay:.4s}
#apsvg .bl:nth-child(6){animation-delay:.5s}
@keyframes iris{0%,100%{transform:rotate(0deg) scale(1)}50%{transform:rotate(28deg) scale(.72)}}
#apsvg .play{fill:#fff;opacity:.9}
#vhero .rec{
  font-family:var(--mono);font-size:10px;letter-spacing:.2em;color:var(--red);
  display:flex;align-items:center;gap:8px;margin-top:22px;justify-content:center;
}
#vhero .rec i{width:8px;height:8px;border-radius:50%;background:var(--red);animation:blip 1.4s ease-in-out infinite}
@keyframes blip{50%{opacity:.25}}

/* ============ 2 — SHOWREEL ============
   The page already speaks in footage — 1px border, scanlines, vignette, mono
   timecode, a blinking REC. The reel uses that same vocabulary at full scale,
   so it reads as the real thing the small mock monitors were standing in for. */
#reel .rhead{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap}
#reel .rmeta{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--grey);white-space:nowrap}

/* The frame irises open as the section lands: a letterbox slit widening to a
   full 21:9. clip-path rather than height, so the video never reflows inside. */
.rwrap{position:relative;width:100%;aspect-ratio:21/9;margin-top:clamp(26px,4vh,44px);background:#000;border:1px solid rgba(255,255,255,.14);overflow:hidden;clip-path:inset(48% 0 48% 0);transition:clip-path 1.15s cubic-bezier(.16,1,.3,1) .1s}
#reel.in .rwrap{clip-path:inset(0 0 0 0)}
.rwrap video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;background:#000}
.rwrap.playing video{cursor:pointer}
.scan{position:absolute;inset:0;pointer-events:none;z-index:2;background:repeating-linear-gradient(0deg,rgba(255,255,255,.03) 0 1px,transparent 1px 3px)}
.vig{position:absolute;inset:0;pointer-events:none;z-index:2;background:radial-gradient(ellipse at 50% 50%,transparent 52%,rgba(0,0,0,.6))}
.rwrap .rrec{position:absolute;top:14px;left:16px;z-index:3;font-family:var(--mono);font-size:10px;letter-spacing:.2em;color:var(--red);display:flex;align-items:center;gap:7px}
.rwrap .rrec i{width:7px;height:7px;border-radius:50%;background:var(--red);animation:blip 1.4s ease-in-out infinite}

/* The overlay is the play affordance: the hero's aperture again, this time as
   the thing you click. It returns whenever the reel is paused, so there is
   always a focusable control rather than a frame you can only click. */
.rov{position:absolute;inset:0;z-index:4;display:flex;align-items:center;justify-content:center;border:none;padding:0;cursor:pointer;background:rgba(11,11,12,.34);transition:opacity .55s,background .4s}
.rov:hover{background:rgba(11,11,12,.14)}
.rwrap.playing .rov{opacity:0;pointer-events:none}
#rap{width:clamp(80px,10vw,132px);color:var(--red);overflow:visible;transition:transform .6s cubic-bezier(.16,1,.3,1)}
.rov:hover #rap,.rov:focus-visible #rap{transform:scale(1.08)}
#rap .bl{fill:none;stroke:currentColor;stroke-width:1.4;transform-origin:100px 100px;animation:iris 7s ease-in-out infinite}
#rap .bl:nth-child(2){animation-delay:.1s}
#rap .bl:nth-child(3){animation-delay:.2s}
#rap .bl:nth-child(4){animation-delay:.3s}
#rap .bl:nth-child(5){animation-delay:.4s}
#rap .bl:nth-child(6){animation-delay:.5s}
#rap .play{fill:#fff;opacity:.95}

/* Custom transport rather than native chrome — the browser's own controls drop
   a grey pill into a page that has none. */
.rbar{display:flex;align-items:center;gap:clamp(12px,1.6vw,20px);margin-top:14px}
.rprog{flex:1;height:3px;background:rgba(255,255,255,.16);position:relative;cursor:pointer}
/* Widens the hit area to a thumb without changing the drawn line. */
.rprog::after{content:"";position:absolute;inset:-10px 0}
.rprog i{position:absolute;left:0;top:0;bottom:0;width:0;background:var(--red);box-shadow:0 0 10px rgba(227,0,27,.7)}
#rtc{font-family:var(--mono);font-size:clamp(10.5px,1.1vw,13px);letter-spacing:.14em;color:var(--red);white-space:nowrap}

/* ============ 3 — CRAFT ============
   The four beats the old timeline argued over 360vh of hijacked scroll. Same
   argument, delivered as four cards that land in sequence behind a red rule
   that draws across them — it still reads as a timeline without seizing the
   page to say so. */
#craft .cgrid{position:relative;display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin-top:clamp(30px,5vh,52px);background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.14)}
#craft .cline{position:absolute;left:0;top:-1px;height:2px;width:0;background:var(--red);z-index:3;box-shadow:0 0 10px rgba(227,0,27,.6);transition:width 1.5s cubic-bezier(.16,1,.3,1) .25s}
#craft.in .cline{width:100%}
.ccard{position:relative;overflow:hidden;background:var(--black);padding:clamp(20px,2.3vw,32px);opacity:0;transform:translateY(30px);transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1);transition-delay:var(--d,0s)}
#craft.in .ccard{opacity:1;transform:none}
.ccard::before{content:"";position:absolute;inset:0;background:var(--red);transform:scaleY(0);transform-origin:bottom;transition:transform .45s cubic-bezier(.16,1,.3,1)}
.ccard:hover::before{transform:scaleY(1)}
.ccard>*{position:relative;z-index:1}
.ccard .cn{font-family:var(--mono);font-size:11px;letter-spacing:.18em;color:var(--red);transition:color .35s}
.ccard .cth{font-family:var(--display);font-weight:900;font-stretch:110%;font-size:clamp(19px,2.1vw,30px);line-height:1;letter-spacing:-.024em;text-transform:uppercase;color:#fff;margin-top:clamp(16px,2.4vh,26px)}
.ccard .ctp{font-size:clamp(13px,1.15vw,15px);line-height:1.6;color:#a4a4a8;margin-top:12px;transition:color .35s}
.ccard:hover .cn{color:#fff}
.ccard:hover .ctp{color:rgba(255,255,255,.92)}

/* ============ 4 — SOUND ============ */
#snd .bars{display:flex;align-items:flex-end;gap:clamp(3px,.6vw,7px);height:clamp(90px,16vh,150px);margin-top:clamp(30px,5vh,52px)}
#snd .bars i{flex:1;background:var(--red);opacity:.75;border-radius:2px 2px 0 0;transform-origin:bottom;animation:eq 1.6s ease-in-out infinite;animation-delay:var(--sd,0s)}
@keyframes eq{0%,100%{transform:scaleY(.22)}50%{transform:scaleY(1)}}

/* ============ 5 — CLOSE ============ */
#vclose .nlist{margin-top:clamp(26px,4vh,46px);border-top:1px solid rgba(255,255,255,.14)}
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
#vclose .cta{margin-top:clamp(40px,7vh,78px)}
#vclose .cta h2{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(34px,6.4vw,92px);line-height:.96;letter-spacing:-.03em;text-transform:uppercase;color:#fff}
#vclose .cta h2 em{font-style:normal;color:var(--red)}
#vclose .csub{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--grey);margin-top:16px}
#vclose .btns{display:flex;gap:13px;flex-wrap:wrap;margin-top:clamp(24px,4vh,40px)}
.vbtn{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 clamp(20px,2.4vw,32px);border-radius:999px;font-family:var(--body);font-weight:600;font-size:14.5px;text-decoration:none;transition:transform .25s,background .25s,border-color .25s}
.vbtn .ar{transition:transform .25s}
.vbtn:hover .ar{transform:translateX(4px)}
.vbtn.red{background:var(--red);color:#fff}
.vbtn.red:hover{background:#c40017;transform:translateY(-2px)}
.vbtn.gh{border:1px solid rgba(255,255,255,.26);color:#fff}
.vbtn.gh:hover{border-color:#fff;background:rgba(255,255,255,.06);transform:translateY(-2px)}
#vclose footer{margin-top:clamp(42px,7vh,80px);padding-top:20px;border-top:1px solid rgba(255,255,255,.14);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;color:#66666a}

a:focus-visible,button:focus-visible{outline:2px solid var(--red);outline-offset:3px;border-radius:4px}

@media (max-width:900px){
  #craft .cgrid{grid-template-columns:repeat(2,1fr)}
}
@media (max-width:768px){
  #vrail{display:none}
  #vhero{grid-template-columns:1fr;gap:34px;min-height:auto;padding-top:clamp(96px,15vh,130px)}
  #vhero .apwrap{order:-1}
  #apsvg{width:min(60%,220px)}
  /* A 21:9 letterbox is a sliver on a phone; 16:9 gives the reel real estate. */
  .rwrap{aspect-ratio:16/9}
  #reel .rhead{flex-direction:column;align-items:flex-start;gap:10px}
}
@media (max-width:560px){
  #craft .cgrid{grid-template-columns:1fr}
}
@media (max-width:480px){ #vhero h1{font-size:clamp(36px,12vw,54px)} }
@media (max-height:600px){
  #vhero{min-height:auto}
}
@media (prefers-reduced-motion:reduce){
  *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
  .up{opacity:1;transform:none}
  #vhero h1 .l i{transform:none;animation:none}
  #apsvg .bl,#rap .bl,#vhero .rec i,.rwrap .rrec i,#snd .bars i{animation:none}
  #snd .bars i{transform:scaleY(.6)}
  /* The set-pieces are pinned at their end states — the motion that would have
     revealed them is exactly what was asked to stop. */
  .rwrap{clip-path:none}
  .ccard{opacity:1;transform:none}
  #craft .cline{width:100%}
}
${JOURNAL_CSS}
${HERO_KEYWORD_CSS}
${SERVICE_PROSE_CSS}
`;

/* The four beats of a film that works. */
const SCENES = [
  { h: "The hook", p: "Attention is captured in the first moments or never. The hook is the whole strategy — everything after it only exists if this works." },
  { h: "The turn", p: "Something has to change, or the viewer already knows the rest. Pacing is decided cut by cut — and pacing is what keeps the thumb still." },
  { h: "The proof", p: "The claim, shown rather than said — and cut tight enough that no second asks to be skipped." },
  { h: "The ask", p: "One clear next move, made while attention is still yours." },
];

const NEXT = [
  { slug: "identity", label: "Identity" },
  { slug: "design", label: "Design" },
  { slug: "social-media", label: "Social Media" },
  { slug: "digital", label: "Digital" },
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

/* Six aperture blades, drawn as a ring of chords. */
const blades = () => {
  const pts = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (i * Math.PI) / 3;
    return { x: 100 + 72 * Math.cos(a), y: 100 + 72 * Math.sin(a) };
  });
  return pts
    .map((p, i) => {
      const q = pts[(i + 2) % 6];
      return `<path class="bl" d="M${p.x.toFixed(1)} ${p.y.toFixed(1)} L${q.x.toFixed(1)} ${q.y.toFixed(1)}"/>`;
    })
    .join("");
};

/* The aperture, reused at two sizes: decoration in the hero, the play control
   on the reel. The id is what tells the two apart in CSS. */
const aperture = (id: string, label?: string) => `
      <svg id="${id}" viewBox="0 0 200 200" fill="none"${
        label ? ` role="img" aria-label="${label}"` : ' aria-hidden="true"'
      }>
        ${blades()}
        <circle cx="100" cy="100" r="72" stroke="currentColor" stroke-width="1.4" fill="none" opacity=".5"/>
        <path class="play" d="M88 82 L124 100 L88 118 Z"/>
      </svg>`;

/* The equaliser. Nine delays repeated across the row so neighbouring bars are
   always out of phase without needing a value per bar. */
const eqBars = () =>
  Array.from(
    { length: 34 },
    (_, i) => `<i style="--sd:${((i % 9) * 0.13).toFixed(2)}s"></i>`,
  ).join("");

export const VIDEO_HTML = String.raw`
<div id="vbg"></div>
<div id="vline"></div>
<div id="vrail" role="navigation" aria-label="Section"></div>

<!-- 1 — HERO -->
<section class="vs dark" id="vhero" data-bg="#0B0B0C" data-label="Video">
  <div>
    <div class="crumb"><a href="/">Home</a><span>/</span><a href="/services">Services</a><span>/</span><b>Video Production</b></div>
    <h1>${heroLine("FILMS THAT", 0.15)}<br>${heroLine("DO A JOB", 0.42, true)}${heroKeyword("Video Production in Hyderabad")}</h1>
    <p class="vp">Anything can be filmed. What gets watched is decided in the edit — the hook that stops the scroll, the pacing that holds it, the story that lands.</p>
  </div>
  <div class="apwrap">
    <div>
      ${aperture("apsvg", "An aperture opening around a play mark")}
      <div class="rec"><i></i>REC</div>
    </div>
  </div>
</section>

<!-- 2 — SHOWREEL -->
<section class="vs dark" id="reel" data-bg="#0B0B0C" data-label="Showreel">
  <div class="rhead">
    <h2 class="vh up">The reel, <em>uncut</em>.</h2>
    <div class="rmeta up" style="--d:.1s">// 2026 SHOWREEL</div>
  </div>
  <div class="rwrap" id="rwrap">
    <video id="rvid" playsinline muted loop preload="metadata" disablepictureinpicture>
      <source src="${video(SHOWREEL)}" type="video/mp4">
    </video>
    <span class="scan" aria-hidden="true"></span>
    <span class="vig" aria-hidden="true"></span>
    <span class="rrec" aria-hidden="true"><i></i>REC</span>
    <button class="rov" id="rov" type="button" aria-label="Play the showreel with sound">${aperture("rap")}
    </button>
  </div>
  <div class="rbar up" style="--d:.5s">
    <div class="rprog" id="rprog"><i></i></div>
    <div id="rtc">TC 00:00:00</div>
  </div>
</section>

<!-- 3 — CRAFT -->
<section class="vs dark" id="craft" data-bg="#0B0B0C" data-label="The craft">
  <h2 class="vh up" style="--d:.08s">Won in the first seconds. Held by the <em>cut</em>.</h2>
  <p class="vp up" style="--d:.14s">What holds attention is decided beat by beat — and every beat has a job.</p>
  <div class="cgrid">
    <span class="cline" aria-hidden="true"></span>
    ${SCENES.map(
      (s, i) => `<article class="ccard" style="--d:${(0.2 + i * 0.09).toFixed(2)}s">
      <div class="cn">${String(i + 1).padStart(2, "0")}</div>
      <h3 class="cth">${s.h}</h3>
      <p class="ctp">${s.p}</p>
    </article>`,
    ).join("\n    ")}
  </div>
</section>

<!-- 4 — SOUND -->
<section class="vs dark" id="snd" data-bg="#0B0B0C" data-label="Sound">
  <h2 class="vh up" style="--d:.08s">Half the film you can't <em>see</em>.</h2>
  <p class="vp up" style="--d:.14s">Viewers forgive an imperfect image long before poor audio. Sound is half the edit — the pace, mood and weight you never see.</p>
  <div class="bars up" style="--d:.2s" aria-hidden="true">${eqBars()}</div>
</section>

${/* This page runs black end to end, so the prose block does too — a paper
      section dropped into it would read as a different site. */ ""}
${serviceProse("video-production", {
  bg: "#0B0B0C",
  label: "Video in full",
  dark: true,
})}

<!-- 6 — CLOSE -->
<section class="vs dark" id="vclose" data-bg="#0B0B0C" data-label="Close">
  <h2 class="vh up" style="--d:.08s">The rest of what we do.</h2>
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
    <h2 class="up">Let's put it<br>on <em>film</em>.</h2>
    <p class="csub up" style="--d:.12s">// TELL US THE GOAL. WE REPLY WITHIN ONE WORKING DAY.</p>
    <div class="btns up" style="--d:.22s">
      <a class="vbtn gh" href="/services" data-h>All services <span class="ar">→</span></a>
      <a class="vbtn red" href="/start-project?service=Video%20Production" data-h>Start your project <span class="ar">→</span></a>
    </div>
  </div>
  ${journalLinks("what-a-brand-film-costs", "reels-that-route")}

  <footer><div>© 2026 ADMIRATE.IN</div><div>${NAP_HTML}</div><div>${LEGAL_HTML}</div><div>MADE TO CONVERT</div></footer>
</section>
`;
