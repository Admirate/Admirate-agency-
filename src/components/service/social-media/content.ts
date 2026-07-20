/**
 * SOCIAL MEDIA — a page shaped like the feed it is about.
 *
 * Set-pieces unique to this page:
 *   FEED   a phone whose reels advance as you scroll, each one a stage in how a
 *          piece is actually made — hook, cut, route
 *   ROUTE  a funnel that draws itself: view → profile → page → enquiry, with
 *          the point that a view which routes nowhere is where most feeds stop
 *
 * No follower, view or engagement figures appear anywhere on this page. The
 * repository holds none, and a fabricated metric is a claim the studio would
 * have to defend.
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
.smeb2{font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--red);display:flex;align-items:center;gap:11px;margin-bottom:16px}
.smeb2::after{content:"";height:1px;width:clamp(26px,5vw,60px);background:currentColor;opacity:.45}
.smh{font-family:var(--display);font-weight:800;font-stretch:106%;font-size:clamp(27px,4.6vw,60px);line-height:1.05;letter-spacing:-.026em;max-width:17ch}
.smh em{font-style:normal;color:var(--red)}
.smp{font-size:clamp(15px,1.4vw,18px);line-height:1.7;color:#4a4a4e;max-width:56ch;margin-top:18px}
.sms.dark .smp{color:#a4a4a8}
.up{opacity:0;transform:translateY(26px);transition:opacity .8s,transform .8s cubic-bezier(.16,1,.3,1)}
.sms.in .up,#feed.in .up{opacity:1;transform:none;transition-delay:var(--d,0s)}

/* ---------- the phone, shared by hero and feed scrub ---------- */
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

/* ============ 1 — HERO ============ */
#shero{min-height:100svh;display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(28px,5vw,76px);align-items:center}
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

/* ============ 2 — FEED (scrub) ============ */
#feed{height:330vh;padding:0}
#feed .pin{position:sticky;top:0;height:100svh;display:grid;grid-template-columns:1.05fr .95fr;gap:clamp(26px,4vw,68px);align-items:center;padding:clamp(90px,13vh,140px) var(--pad) clamp(50px,8vh,90px)}
#feed .ftext{position:relative}
#feed .fstep{position:absolute;top:0;left:0;opacity:0;transform:translateY(16px);transition:opacity .4s,transform .4s cubic-bezier(.16,1,.3,1);pointer-events:none}
#feed .fstep.on{opacity:1;transform:none;position:relative;pointer-events:auto}
#feed .fnum{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--red);margin-bottom:11px}
#feed .pwrap{display:flex;justify-content:center}
#feed .fprog{position:absolute;left:var(--pad);bottom:clamp(30px,6vh,60px);display:flex;gap:6px}
#feed .fprog i{width:24px;height:2px;background:rgba(255,255,255,.18);transition:background .35s}
#feed .fprog i.on{background:var(--red)}

/* ============ 3 — ROUTE ============ */
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
#route .dead{
  display:flex;align-items:flex-start;gap:12px;margin-top:clamp(26px,4vh,44px);
  border-left:2px solid var(--red);padding-left:16px;max-width:60ch;
}
#route .dead b{font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;color:var(--red);display:block;margin-bottom:7px}
#route .dead p{font-size:14.5px;line-height:1.65;color:#4a4a4e}

/* ============ 4 — PROOF ============ */
#sproof .plist{margin-top:clamp(30px,5vh,52px);border-top:1px solid var(--line)}
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

/* ============ 5 — DEPTH ============ */
#sdepth .dwrap{max-width:68ch;margin-top:clamp(30px,5vh,52px)}
#sdepth h3{font-family:var(--display);font-weight:800;font-stretch:104%;font-size:clamp(19px,2.2vw,28px);line-height:1.2;letter-spacing:-.015em;margin:clamp(32px,5vh,54px) 0 13px}
#sdepth p{font-size:clamp(15px,1.35vw,17.5px);line-height:1.78;color:#4a4a4e;margin-bottom:19px}
#sdepth .dwrap>p:first-of-type::first-letter{font-family:var(--display);font-weight:900;font-stretch:110%;float:left;font-size:3.5em;line-height:.82;padding:6px 12px 0 0;color:var(--red)}

/* ============ 6 — CLOSE ============ */
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

@media (max-width:768px){
  #smrail{display:none}
  #shero{grid-template-columns:1fr;gap:34px;min-height:auto;padding-top:clamp(96px,15vh,130px)}
  #shero .pwrap{order:-1}
  .fone{width:min(64%,210px)}
  #feed{height:auto}
  #feed .pin{position:static;height:auto;grid-template-columns:1fr;gap:26px;padding:clamp(70px,10vh,100px) var(--pad)}
  #feed .fstep{position:relative;opacity:1;transform:none;margin-bottom:22px}
  #feed .fprog{display:none}
  .prow{grid-template-columns:auto minmax(0,1fr);row-gap:7px}
  .prow .pt{grid-column:2;justify-self:start}
}
@media (max-width:480px){ #shero h1{font-size:clamp(36px,12vw,54px)} }
@media (max-height:600px){
  #shero{min-height:auto}
  #feed{height:auto}
  #feed .pin{position:static;height:auto}
  #feed .fstep{position:relative;opacity:1;transform:none;margin-bottom:20px}
}
@media (prefers-reduced-motion:reduce){
  *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
  .up{opacity:1;transform:none}
  #shero h1 .l i{transform:none;animation:none}
  .fone .thumb{display:none}
  .reeltrack{transition:none}
  #feed{height:auto}
  #feed .pin{position:static;height:auto}
  #feed .fstep{position:relative;opacity:1;transform:none;margin-bottom:22px}
  #rsvg .rlive{stroke-dashoffset:0;transition:none}
}
`;

const REELS = [
  { tag: "SCRIPT + HOOK", hd: "Scripted to stop thumbs", cp: "The opening line is written before anything is filmed — it is the whole distribution strategy.", hash: "#hooks #brandfilm" },
  { tag: "EDIT + MOTION", hd: "Cut to the beat", cp: "Captions, motion and sound design. Every frame has to earn the next one.", hash: "#edit #sounddesign" },
  { tag: "ROUTE + CONVERT", hd: "Built to send people somewhere", cp: "Every piece ends with a path — profile, page, enquiry.", hash: "#leadgen #convert" },
];

const FEED_STEPS = [
  { n: "STAGE 01", h: "The first second is the strategy", p: "Distribution on every feed platform is decided by whether people stay. That makes the opening moment the highest-leverage part of the entire production — higher than the camera, the location or the edit. It is a writing problem, which is why it is solved on paper first." },
  { n: "STAGE 02", h: "The cut is where pace is decided", p: "Captions, motion and sound carry more of the result than most people expect. Pace is what an audience actually experiences, and pace is made in the edit — not found there." },
  { n: "STAGE 03", h: "Then it has to go somewhere", p: "A piece that is widely seen and leads nowhere has converted attention into nothing. The path out is designed as part of the content, not bolted on once the numbers look good." },
];

const ROUTE_NODES = [
  { x: 60, label: "THE VIEW" },
  { x: 230, label: "THE PROFILE" },
  { x: 400, label: "THE PAGE" },
  { x: 570, label: "THE ENQUIRY" },
];

const PROOF = [
  { n: "Hitex SportExpo", t: "Event · Social", d: "Expo campaign creative built to carry launch-week momentum across feeds." },
  { n: "Our Sacred Space", t: "Events · Community", d: "A rolling calendar of classes and events turned into content with somewhere to go." },
  { n: "Samyoga Studio", t: "Studio · Lifestyle", d: "Practice-led content in a category where sameness is the default." },
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
      </div>`
      ).join("")}
    </div>
  </div>
  <div class="bar"><i id="${id}bar"></i></div>
  ${withThumb ? '<div class="thumb" aria-hidden="true"></div>' : ""}
</div>`;

export const SOCIAL_HTML = String.raw`
<div id="smbg"></div>
<div id="smline"></div>
<div id="smrail" role="navigation" aria-label="Section"></div>

<!-- 1 — HERO -->
<section class="sms dark" id="shero" data-bg="#0B0B0C" data-label="Social">
  <div>
    <div class="crumb"><a href="/">Home</a><span>/</span><a href="/services">Services</a><span>/</span><b>Social Media</b></div>
    <h1>${heroLine("MADE TO", 0.15)}<br>${heroLine("CONVERT", 0.4, true)}</h1>
    <p class="smp">Reels, creatives and campaigns produced to send people somewhere — not to fill a content calendar and quietly disappear.</p>
  </div>
  <div class="pwrap">${phone("hreel", true)}</div>
</section>

<!-- 2 — FEED (scrub) -->
<section id="feed" data-bg="#FAFAF8" data-label="The feed">
  <div class="pin">
    <div class="ftext">
      <div class="smeb2">HOW A PIECE IS MADE</div>
      ${FEED_STEPS.map(
        (s, i) => `<div class="fstep${i === 0 ? " on" : ""}" data-i="${i}">
        <div class="fnum">${s.n}</div>
        <h2 class="smh">${s.h}</h2>
        <p class="smp">${s.p}</p>
      </div>`
      ).join("\n      ")}
    </div>
    <div class="pwrap">${phone("freel", false)}</div>
    <div class="fprog" aria-hidden="true">${FEED_STEPS.map((_, i) => `<i${i === 0 ? ' class="on"' : ""}></i>`).join("")}</div>
  </div>
</section>

<!-- 3 — ROUTE -->
<section class="sms" id="route" data-bg="#FFFFFF" data-label="The route">
  <div class="smeb2 up">THE ROUTE</div>
  <h2 class="smh up" style="--d:.08s">A view that goes nowhere is a <em>vanity</em> number.</h2>
  <p class="smp up" style="--d:.14s">Attention is the hard part, and it is worth nothing on its own. Every piece should end with somewhere to go — and that path is designed, not hoped for.</p>
  <div class="rwrap up" style="--d:.2s">
    <svg id="rsvg" viewBox="0 0 640 130" role="img" aria-label="A route from view to profile to page to enquiry">
      <path class="rpath" d="M60 70 H570"/>
      <path class="rlive" style="--rl:520" d="M60 70 H570"/>
      ${ROUTE_NODES.map(
        (n, i) => `<circle class="node hit" cx="${n.x}" cy="70" r="15"/>
        <text class="nnum" x="${n.x}" y="73" text-anchor="middle">0${i + 1}</text>
        <text class="ntxt" x="${n.x}" y="105" text-anchor="middle">${n.label}</text>`
      ).join("\n      ")}
    </svg>
  </div>
  <div class="dead">
    <div>
      <b>WHERE MOST FEEDS STOP</b>
      <p>At node one. The piece is seen, it performs, the number is screenshotted — and there was never anything after it. The production cost was identical.</p>
    </div>
  </div>
</section>

<!-- 4 — PROOF -->
<section class="sms" id="sproof" data-bg="#FBF7F1" data-label="Proof">
  <div class="smeb2 up">PROOF</div>
  <h2 class="smh up" style="--d:.08s">Accounts with somewhere to <em>send</em> people.</h2>
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

<!-- 5 — DEPTH -->
<section class="sms" id="sdepth" data-bg="#FFFFFF" data-label="In depth">
  <div class="smeb2 up">IN DEPTH</div>
  <h2 class="smh up" style="--d:.08s">The long version, for anyone who wants it.</h2>
  <div class="dwrap up" style="--d:.16s">
    <p>The most common social brief is a number of posts per month. It is easy to agree to, easy to invoice against, and almost unrelated to whether anything improves. Volume without a point produces a busy account and a flat business — the work happens, the calendar fills, and nothing downstream moves.</p>
    <h3>Consistency beats intensity</h3>
    <p>A burst of excellent content followed by six quiet weeks performs worse than a steady run of good work, because these platforms reward reliability and audiences form habits. Production is planned so one session yields a sequence — the goal is a pace that can be sustained, not a launch that cannot.</p>
    <h3>Views are not the product</h3>
    <p>A piece that is widely seen and leads nowhere has converted attention into nothing. Every piece should end somewhere — a profile that explains, a page that sells, a form that starts a conversation.</p>
    <h3>It still has to look like you</h3>
    <p>Social is where most brands quietly come apart. The pace invites shortcuts, and a year later the feed shares nothing with the website. The identity system exists precisely so speed does not cost coherence.</p>
  </div>
</section>

<!-- 6 — CLOSE -->
<section class="sms dark" id="sclose" data-bg="#0B0B0C" data-label="Close">
  <div class="smeb2 up">KEEP GOING</div>
  <h2 class="smh up" style="--d:.08s">The rest of what we do.</h2>
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
