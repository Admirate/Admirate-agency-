/**
 * SOCIAL MEDIA — reels and creatives, argued on a phone.
 *
 * Set-pieces unique to this page:
 *   PHONE  a handset in the hero cycling three reels, with a thumb drifting up
 *          the screen — the gesture the whole page is about
 *   ROUTE  a four-node path from view to enquiry, drawn in as the section
 *          arrives: the claim that attention without a destination is worth
 *          nothing, made as a diagram rather than a sentence
 *   SWALL  a rolling strip of posts and reels, each in its own treatment
 */

export const SOCIAL_CSS = String.raw`
:root{
  --white:#FFFFFF;--paper:#FAFAF8;--warm:#FBF7F1;--black:#0B0B0C;--red:#E3001B;
  --grey:#8A8A8E;--line:#E9E9E6;--pad:clamp(24px,6vw,96px);
  --display:'Archivo',sans-serif;--body:'Inter',sans-serif;--mono:'IBM Plex Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:auto}
body{font-family:var(--body);background:var(--black);color:var(--black);overflow-x:hidden;-webkit-font-smoothing:antialiased}
body.smopen{overflow:hidden}
::selection{background:var(--red);color:var(--white)}

#smbg{position:fixed;inset:0;z-index:-2;background:var(--black);transition:background-color .7s cubic-bezier(.4,0,.2,1)}
#smline{position:fixed;top:0;left:0;height:2px;width:0;background:var(--red);z-index:200}
#smrail{position:fixed;left:clamp(14px,2.4vw,34px);top:50%;transform:translateY(-50%);z-index:120;display:flex;flex-direction:column;gap:14px}
#smrail button{padding:0;border:none;background:none;cursor:pointer;display:flex;align-items:center}
#smrail i{display:block;width:18px;height:1px;background:rgba(11,11,12,.25);transition:width .35s cubic-bezier(.16,1,.3,1),background .35s}
#smrail.ondark i{background:rgba(255,255,255,.3)}
#smrail button.on i,#smrail.ondark button.on i{width:38px;background:var(--red)}

.sms{position:relative;z-index:1;padding:clamp(96px,14vh,150px) var(--pad) clamp(70px,11vh,120px)}
.sms.dark{color:var(--white)}
.smh{font-family:var(--display);font-weight:800;font-stretch:106%;font-size:clamp(27px,4.6vw,60px);line-height:1.05;letter-spacing:-.026em;max-width:17ch}
.smh em{font-style:normal;color:var(--red)}
.smp{font-size:clamp(15px,1.4vw,18px);line-height:1.7;color:#4a4a4e;max-width:56ch;margin-top:18px}
.sms.dark .smp{color:#a4a4a8}
.up{opacity:0;transform:translateY(26px);transition:opacity .8s,transform .8s cubic-bezier(.16,1,.3,1)}
.sms.in .up{opacity:1;transform:none;transition-delay:var(--d,0s)}

/* ---------- the phone ---------- */
.fone{
  width:min(100%,270px);aspect-ratio:9/19;position:relative;
  background:#0e0e10;border:8px solid #1c1c1f;border-radius:34px;
  box-shadow:0 30px 70px rgba(0,0,0,.5),inset 0 0 0 1px rgba(255,255,255,.06);
  overflow:hidden;
}
.fone .notch{position:absolute;top:0;left:50%;transform:translateX(-50%);width:38%;height:19px;background:#1c1c1f;border-radius:0 0 12px 12px;z-index:5}
.fone .screen{position:absolute;inset:0;overflow:hidden;background:#000}
.reeltrack{position:absolute;inset:0;transition:transform .7s cubic-bezier(.16,1,.3,1)}
.reel{position:absolute;left:0;right:0;height:100%;padding:34px 13px 54px;display:flex;flex-direction:column;justify-content:flex-end;color:#fff}
.reel .fx{position:absolute;inset:0;z-index:0}
.reel.r0 .fx{background:linear-gradient(160deg,#2a1216,#0d0d0f 62%)}
.reel.r1 .fx{background:linear-gradient(160deg,#12202a,#0d0d0f 62%)}
.reel.r2 .fx{background:linear-gradient(160deg,#1c2a12,#0d0d0f 62%)}
.reel>*:not(.fx){position:relative;z-index:1}
.reel .tag{font-family:var(--mono);font-size:8.5px;letter-spacing:.18em;color:var(--red);margin-bottom:8px}
.reel .hd{font-family:var(--display);font-weight:800;font-stretch:104%;font-size:16px;line-height:1.12;letter-spacing:-.012em;margin-bottom:7px}
.reel .cp{font-size:10.5px;line-height:1.5;color:#b4b4b8}
.reel .hash{font-size:9px;color:#6a6a6e;margin-top:7px}
.fone .bar{position:absolute;left:13px;right:13px;bottom:15px;height:2px;background:rgba(255,255,255,.16);border-radius:2px;z-index:4}
.fone .bar i{display:block;height:100%;width:0;background:var(--red);border-radius:2px;transition:width .5s linear}
/* the thumb, drifting up the screen — the gesture the whole page is about */
.fone .thumb{
  position:absolute;right:16px;bottom:34px;width:26px;height:26px;border-radius:50%;
  border:1px solid rgba(255,255,255,.5);z-index:6;pointer-events:none;
  animation:swipe 3.4s ease-in-out infinite;
}
@keyframes swipe{0%,12%{transform:translateY(0);opacity:0}20%{opacity:1}70%{transform:translateY(-116px);opacity:1}88%,100%{transform:translateY(-140px);opacity:0}}

/* While the reels are following the scroll they have to track it exactly. The
   easing that makes the timer's discrete jumps land softly reads as lag when
   the input is a scroll wheel, so both transitions come off. The thumb goes
   too: the visitor's own scroll is the gesture now, and a loop running on its
   own clock would be contradicting it rather than illustrating it. */
.fone.scrubbing{will-change:transform}
.fone.scrubbing .reeltrack,.fone.scrubbing .bar i{transition:none}
.fone.scrubbing .thumb{display:none}

/* ============ 1 — HERO ============ */
/* The section's height is scroll distance, not layout. .spin pins to the
   viewport and holds the headline and the phone still while that distance is
   spent scrubbing the reels — the same shape as the scrub sections on the
   landing page. Below 900px, on short viewports, and under reduced motion the
   rules further down collapse this back to an ordinary one-viewport hero, and
   initSocial() puts the phone back on its timer to match. */
#shero{height:260vh;padding:0}
#shero .spin{position:sticky;top:0;height:100svh;display:flex;align-items:center;padding:clamp(96px,14vh,150px) var(--pad) clamp(70px,11vh,120px)}
#shero .sgrid{width:100%;display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(28px,5vw,76px);align-items:center}
#shero .crumb{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--grey);margin-bottom:clamp(20px,3.4vh,34px);display:flex;gap:10px;flex-wrap:wrap}
#shero .crumb a{color:var(--grey);text-decoration:none;transition:color .25s}
#shero .crumb a:hover{color:var(--red)}
#shero .crumb b{color:#fff;font-weight:500}
#shero h1{font-family:var(--display);font-weight:900;font-stretch:114%;font-size:clamp(42px,8.4vw,118px);line-height:.9;letter-spacing:-.035em;text-transform:uppercase;color:#fff}
#shero h1 .wd{display:inline-block;white-space:nowrap}
#shero h1 .l{display:inline-block;overflow:hidden;vertical-align:bottom}
#shero h1 .l i{display:inline-block;font-style:normal;transform:translateY(102%);animation:smr .95s cubic-bezier(.16,1,.3,1) forwards;animation-delay:var(--d,0s)}
@keyframes smr{to{transform:none}}
#shero h1 u{text-decoration:none;color:var(--red)}
#shero .pwrap{display:flex;justify-content:center}

/* ============ 2 — ROUTE ============ */
#route .rwrap{margin-top:clamp(32px,5vh,58px)}
#rsvg{width:100%;height:auto;overflow:visible}
#rsvg .rpath{fill:none;stroke:var(--line);stroke-width:2}
#rsvg .rlive{fill:none;stroke:var(--red);stroke-width:2;stroke-linecap:round;
  stroke-dasharray:var(--rl,900);stroke-dashoffset:var(--rl,900);transition:stroke-dashoffset 1.6s cubic-bezier(.5,0,.2,1)}
#route.in #rsvg .rlive{stroke-dashoffset:0}
#rsvg .node{fill:var(--white);stroke:var(--line);stroke-width:2}
#rsvg .node.hit{stroke:var(--red)}
#rsvg .ntxt{font-family:var(--mono);font-size:8px;letter-spacing:.1em;fill:#4a4a4e}
#rsvg .nnum{font-family:var(--mono);font-size:7px;fill:var(--red)}

/* ============ 3 — SOCIALS THAT STAND OUT ============ */
#swall .mq{margin-top:clamp(30px,5vh,52px);overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent)}
#swall .mqtrack{display:flex;width:max-content;animation:mqx 48s linear infinite}
#swall .mq:hover .mqtrack{animation-play-state:paused}
.mqset{display:flex;gap:clamp(14px,2vw,24px);padding-right:clamp(14px,2vw,24px)}
@keyframes mqx{to{transform:translateX(-50%)}}
.scard2{flex:0 0 auto;width:clamp(178px,20vw,236px)}
.stile{aspect-ratio:9/16;border-radius:16px;border:1px solid var(--line);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:18px;background:#fff;transition:transform .45s cubic-bezier(.16,1,.3,1),box-shadow .45s}
.scard2:hover .stile{transform:translateY(-6px);box-shadow:0 18px 40px rgba(11,11,12,.16)}
.stile .chip{position:absolute;top:12px;left:12px;display:flex;align-items:center;gap:6px;font-family:var(--mono);font-size:8.5px;letter-spacing:.18em;color:var(--grey)}
.stile .chip i{width:6px;height:6px;border-radius:50%;background:var(--red)}
.stile .hook{font-family:var(--display);font-weight:900;font-stretch:110%;font-size:clamp(17px,1.9vw,23px);line-height:1.02;letter-spacing:-.02em;text-transform:uppercase;text-align:center}
.stile .hash{position:absolute;bottom:12px;left:0;right:0;text-align:center;font-family:var(--mono);font-size:8.5px;letter-spacing:.12em;color:var(--grey)}
.stile.s-dark{background:linear-gradient(160deg,#1a1a1e,#0B0B0C 70%)}
.stile.s-dark .hook{color:#fff}
.stile.s-dark .hook u{text-decoration:none;color:var(--red)}
.stile.s-warm{background:#FBF7F1}
.stile.s-warm .hook{font-family:var(--body);font-weight:300;font-size:clamp(15px,1.7vw,20px);letter-spacing:.06em;text-transform:lowercase;color:var(--black)}
.stile.s-red{background:linear-gradient(160deg,#E3001B,#a80014 78%)}
.stile.s-red .hook{color:#fff}
.stile.s-red .hash{color:rgba(255,255,255,.6)}
.stile.s-red .chip{color:rgba(255,255,255,.7)}
.stile.s-red .chip i{background:#fff}
.stile.s-paper{background:#FAFAF8}
.stile.s-paper .hook{color:var(--black)}
.stile.s-paper .hook u{text-decoration:none;color:var(--red)}
.stile.s-air .hook{font-family:var(--body);font-weight:300;font-size:clamp(14px,1.6vw,18px);letter-spacing:.3em;text-transform:uppercase;color:var(--black);padding-left:.3em}
.smeta{display:flex;justify-content:space-between;gap:8px;margin-top:10px;font-family:var(--mono);font-size:9.5px;letter-spacing:.1em;color:var(--grey);white-space:nowrap}
.smeta b{color:var(--black);font-weight:500}

/* ============ 4 — CLOSE ============ */
#sclose .nlist{margin-top:clamp(26px,4vh,46px);border-top:1px solid rgba(255,255,255,.14)}
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
#sclose .cta{margin-top:clamp(40px,7vh,78px)}
#sclose .cta h2{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(34px,6.4vw,92px);line-height:.96;letter-spacing:-.03em;text-transform:uppercase;color:#fff}
#sclose .cta h2 em{font-style:normal;color:var(--red)}
#sclose .csub{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--grey);margin-top:16px}
#sclose .btns{display:flex;gap:13px;flex-wrap:wrap;margin-top:clamp(24px,4vh,40px)}
.sbtn{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 clamp(20px,2.4vw,32px);border-radius:999px;font-family:var(--body);font-weight:600;font-size:14.5px;text-decoration:none;transition:transform .25s,background .25s,border-color .25s}
.sbtn .ar{transition:transform .25s}
.sbtn:hover .ar{transform:translateX(4px)}
.sbtn.red{background:var(--red);color:#fff}
.sbtn.red:hover{background:#c40017;transform:translateY(-2px)}
.sbtn.gh{border:1px solid rgba(255,255,255,.26);color:#fff}
.sbtn.gh:hover{border-color:#fff;background:rgba(255,255,255,.06);transform:translateY(-2px)}
#sclose footer{margin-top:clamp(42px,7vh,80px);padding-top:20px;border-top:1px solid rgba(255,255,255,.14);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;color:#66666a}

a:focus-visible,button:focus-visible{outline:2px solid var(--red);outline-offset:3px;border-radius:4px}

/* Un-pin the hero. Pinning the very first screen of a phone is a heavier
   landing than the reels are worth, so the scrub is a desktop enhancement and
   this is the fallback it degrades to. The breakpoint is mirrored by scrubMQ in
   init.ts — change one and the other has to move with it. */
@media (max-width:900px){
  #shero{height:auto;min-height:100svh;padding:clamp(96px,15vh,130px) var(--pad) clamp(70px,11vh,120px)}
  #shero .spin{position:static;height:auto;padding:0}
}
@media (max-width:768px){
  #smrail{display:none}
  #shero .sgrid{grid-template-columns:1fr;gap:34px}
  #shero .pwrap{order:-1}
  .fone{width:min(64%,210px)}
}
@media (max-width:480px){ #shero h1{font-size:clamp(36px,12vw,54px)} }
/* A landscape phone has no room to give away to a pinned hero. */
@media (max-height:600px){
  #shero{height:auto;min-height:auto;padding:clamp(96px,15vh,130px) var(--pad) clamp(70px,11vh,120px)}
  #shero .spin{position:static;height:auto;padding:0}
}
@media (prefers-reduced-motion:reduce){
  *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
  .up{opacity:1;transform:none}
  #shero h1 .l i{transform:none;animation:none}
  #shero{height:auto;min-height:100svh;padding:clamp(96px,15vh,130px) var(--pad) clamp(70px,11vh,120px)}
  #shero .spin{position:static;height:auto;padding:0}
  .fone .thumb{display:none}
  .reeltrack{transition:none}
  #rsvg .rlive{stroke-dashoffset:0;transition:none}
  #swall .mqtrack{animation:none}
  #swall .mq{overflow-x:auto;-webkit-mask-image:none;mask-image:none}
}
`;

const REELS = [
  { tag: "SCRIPT + HOOK", hd: "Scripted to stop thumbs", cp: "The opening line is written before anything is filmed — it is the whole distribution strategy.", hash: "#hooks #brandfilm" },
  { tag: "EDIT + MOTION", hd: "Cut to the beat", cp: "Captions, motion and sound design. Every frame has to earn the next one.", hash: "#edit #sounddesign" },
  { tag: "ROUTE + CONVERT", hd: "Built to send people somewhere", cp: "Every piece ends with a path — profile, page, enquiry.", hash: "#leadgen #convert" },
];

const ROUTE_NODES = [
  { x: 60, label: "THE VIEW" },
  { x: 230, label: "THE PROFILE" },
  { x: 400, label: "THE PAGE" },
  { x: 570, label: "THE ENQUIRY" },
];

/* Posts and reels as they actually ran. Each carries its own treatment so the
   strip reads as six accounts rather than one template filled in six times. */
const WALL = [
  { cls: "s-dark", chip: "REEL", hook: `GAME<br><u>DAY</u>.`, hash: "#SPORTEXPO #GAMEON", b: "Hitex SportExpo", tag: "CAMPAIGN" },
  { cls: "s-warm", chip: "POST", hook: `this weekend,<br>at the space`, hash: "#EVENTS #COMMUNITY", b: "Our Sacred Space", tag: "FEED" },
  { cls: "s-paper", chip: "REEL", hook: `One breath<br>at a <u>time</u>.`, hash: "#PRACTICE #STUDIO", b: "Samyoga Studio", tag: "REELS" },
  { cls: "s-dark", chip: "POST", hook: `Recovery starts with a <u>conversation</u>.`, hash: "#CARE #SUPPORT", b: "Hope Trust India", tag: "CONTENT" },
  { cls: "s-air", chip: "POST", hook: `Clearly premium`, hash: "#GLASS #FACADES", b: "South Glass", tag: "FEED" },
  { cls: "s-red", chip: "REEL", hook: `MADE TO<br>CONVERT.`, hash: "#ADMIRATE", b: "ADMIRATE", tag: "REELS" },
];

const NEXT = [
  { slug: "identity", label: "Identity" },
  { slug: "design", label: "Design" },
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

const phone = (id: string, withThumb: boolean) => `
<div class="fone">
  <div class="notch"></div>
  <div class="screen">
    <div class="reeltrack" id="${id}">
      ${REELS.map(
        (r, i) => `<div class="reel r${i}" style="top:${i * 100}%">
        <div class="fx"></div>
        <div class="tag">${r.tag}</div>
        <div class="hd">${r.hd}</div>
        <div class="cp">${r.cp}</div>
        <div class="hash">${r.hash}</div>
      </div>`,
      ).join("")}
    </div>
  </div>
  <div class="bar"><i id="${id}bar"></i></div>
  ${withThumb ? '<div class="thumb" aria-hidden="true"></div>' : ""}
</div>`;

/* The marquee needs its contents twice: the track translates -50%, so the
   second copy is what occupies the viewport as the first scrolls out. It is
   duplicate content, hence aria-hidden on the copy. */
const wallSet = (hidden: boolean) => `
      <div class="mqset"${hidden ? ' aria-hidden="true"' : ""}>
      ${WALL.map(
        (w) =>
          `<div class="scard2"><div class="stile ${w.cls}"><span class="chip"><i></i>${w.chip}</span><span class="hook">${w.hook}</span><span class="hash">${w.hash}</span></div><div class="smeta"><b>${w.b}</b><span>${w.tag}</span></div></div>`,
      ).join("\n      ")}
      </div>`;

export const SOCIAL_HTML = String.raw`
<div id="smbg"></div>
<div id="smline"></div>
<div id="smrail" role="navigation" aria-label="Section"></div>

<!-- 1 — HERO -->
<section class="sms dark" id="shero" data-bg="#0B0B0C" data-label="Social">
  <div class="spin">
    <div class="sgrid">
      <div>
        <div class="crumb"><a href="/">Home</a><span>/</span><a href="/services">Services</a><span>/</span><b>Social Media</b></div>
        <h1>${heroLine("MADE TO", 0.15)}<br>${heroLine("CONVERT", 0.4, true)}</h1>
        <p class="smp">Reels, creatives and campaigns produced to send people somewhere — not to fill a content calendar and quietly disappear.</p>
      </div>
      <div class="pwrap">${phone("hreel", true)}</div>
    </div>
  </div>
</section>

<!-- 2 — ROUTE -->
<section class="sms" id="route" data-bg="#FFFFFF" data-label="The route">
  <h2 class="smh up" style="--d:.08s">A view that goes nowhere is a <em>vanity</em> number.</h2>
  <p class="smp up" style="--d:.14s">Attention is the hard part, and it is worth nothing on its own. Every piece should end with somewhere to go — and that path is designed, not hoped for.</p>
  <div class="rwrap up" style="--d:.2s">
    <svg id="rsvg" viewBox="0 0 640 130" role="img" aria-label="A route from view to profile to page to enquiry">
      <path class="rpath" d="M60 70 H570"/>
      <path class="rlive" style="--rl:520" d="M60 70 H570"/>
      ${ROUTE_NODES.map(
        (n, i) => `<circle class="node hit" cx="${n.x}" cy="70" r="15"/>
        <text class="nnum" x="${n.x}" y="73" text-anchor="middle">0${i + 1}</text>
        <text class="ntxt" x="${n.x}" y="105" text-anchor="middle">${n.label}</text>`,
      ).join("\n      ")}
    </svg>
  </div>
</section>

<!-- 3 — SOCIALS THAT STAND OUT -->
<section class="sms" id="swall" data-bg="#FBF7F1" data-label="The work">
  <h2 class="smh up">Socials that <em>stand out</em>.</h2>
  <p class="smp up" style="--d:.1s">Accounts and creatives cut through the scroll — and send people somewhere.</p>
  <div class="mq up" style="--d:.18s">
    <div class="mqtrack">${wallSet(false)}${wallSet(true)}
    </div>
  </div>
</section>

<!-- 4 — CLOSE -->
<section class="sms dark" id="sclose" data-bg="#0B0B0C" data-label="Close">
  <h2 class="smh up" style="--d:.08s">The rest of what we do.</h2>
  <div class="nlist">
    ${NEXT.map(
      (s, i) => `<a class="nrow up" href="/services/${s.slug}" style="--d:${(0.14 + i * 0.05).toFixed(
        2,
      )}s" data-h>
      <span class="nn">${String(i + 1).padStart(2, "0")}</span>
      <span class="nt">${s.label}</span>
      <span class="na">→</span>
    </a>`,
    ).join("\n    ")}
  </div>
  <div class="cta">
    <h2 class="up">Let's make them<br><em>stop</em>.</h2>
    <p class="csub up" style="--d:.12s">// TELL US THE GOAL. WE REPLY WITHIN ONE WORKING DAY.</p>
    <div class="btns up" style="--d:.22s">
      <a class="sbtn gh" href="/services" data-h>All services <span class="ar">→</span></a>
      <a class="sbtn red" href="/start-project?service=Social%20Media" data-h>Start your project <span class="ar">→</span></a>
    </div>
  </div>
  <footer><div>© 2026 ADMIRATE.IN</div><div>MADE TO CONVERT</div></footer>
</section>
`;

export const REEL_COUNT = REELS.length;
