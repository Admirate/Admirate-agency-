/**
 * VIDEO PRODUCTION — films, argued from the edit rather than the shoot.
 *
 * Set-pieces unique to this page:
 *   APERTURE  six blades open and close around a play mark in the hero
 *   TIMELINE  a scroll-driven playhead crosses a real track, the timecode
 *             counting in frames, scenes cutting as the head crosses each clip
 *   SOUND     an equaliser standing in for the half of a film you cannot see
 *   MONTAGE   a rolling strip of finished frames, sprocket holes and all
 *
 * The clip widths are the flex values in the markup, so the playhead and the
 * clips cannot disagree — both are read from the laid-out DOM in measure().
 */

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
.vs.in .up,#tl.in .up{opacity:1;transform:none;transition-delay:var(--d,0s)}

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

/* ============ 2 — TIMELINE (scrub) ============ */
#tl{height:360vh;padding:0}
#tl .pin{position:sticky;top:0;height:100svh;display:flex;flex-direction:column;justify-content:center;gap:clamp(18px,3vh,32px);padding:clamp(90px,13vh,140px) var(--pad) clamp(50px,8vh,90px)}
#tl .head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap}
#tcode{font-family:var(--mono);font-size:clamp(12px,1.4vw,17px);letter-spacing:.16em;color:var(--red)}
/* the monitor */
.mon{position:relative;width:100%;aspect-ratio:21/9;background:#0a0a0c;border:1px solid rgba(255,255,255,.14);overflow:hidden}
.mon .scene{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:clamp(20px,4vw,60px);opacity:0;transition:opacity .5s}
.mon .scene.on{opacity:1}
.mon .scene .sn{font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;color:var(--red);margin-bottom:12px}
.mon .scene h3{font-family:var(--display);font-weight:900;font-stretch:110%;font-size:clamp(22px,4.4vw,62px);line-height:.98;letter-spacing:-.03em;color:#fff;text-transform:uppercase}
.mon .scene p{font-size:clamp(13px,1.3vw,16px);line-height:1.6;color:#a4a4a8;max-width:52ch;margin-top:14px}
.mon .s0{background:linear-gradient(120deg,#2a0f13,#0a0a0c 60%)}
.mon .s1{background:linear-gradient(120deg,#101d29,#0a0a0c 60%)}
.mon .s2{background:linear-gradient(120deg,#1d2410,#0a0a0c 60%)}
.mon .s3{background:linear-gradient(120deg,#26161f,#0a0a0c 60%)}
.mon .scan{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,rgba(255,255,255,.03) 0 1px,transparent 1px 3px)}
.mon .vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,transparent 52%,rgba(0,0,0,.6))}
/* the track */
.track{position:relative;height:52px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);display:flex}
.track .clip{position:relative;border-right:1px solid rgba(255,255,255,.12);display:flex;align-items:center;padding:0 12px;overflow:hidden;transition:background .4s}
.track .clip:last-child{border-right:none}
.track .clip.on{background:rgba(227,0,27,.16)}
.track .clip span{font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;color:#8a8a8e;white-space:nowrap;transition:color .4s}
.track .clip.on span{color:#fff}
#play{position:absolute;top:-6px;bottom:-6px;width:2px;background:var(--red);left:0;box-shadow:0 0 12px rgba(227,0,27,.8)}
#play::before{content:"";position:absolute;top:-4px;left:50%;transform:translateX(-50%);width:9px;height:9px;background:var(--red);border-radius:1px}

/* ============ 3 — SOUND ============ */
#snd .bars{display:flex;align-items:flex-end;gap:clamp(3px,.6vw,7px);height:clamp(90px,16vh,150px);margin-top:clamp(30px,5vh,52px)}
#snd .bars i{flex:1;background:var(--red);opacity:.75;border-radius:2px 2px 0 0;transform-origin:bottom;animation:eq 1.6s ease-in-out infinite;animation-delay:var(--sd,0s)}
@keyframes eq{0%,100%{transform:scaleY(.22)}50%{transform:scaleY(1)}}

/* ============ 4 — THE MONTAGE ============ */
#montage .strip{margin-top:clamp(30px,5vh,52px);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:16px 0;position:relative}
#montage .strip::before,#montage .strip::after{content:"";position:absolute;left:0;right:0;height:7px;background-image:repeating-linear-gradient(90deg,var(--line) 0 11px,transparent 11px 27px);opacity:.8}
#montage .strip::before{top:4px}
#montage .strip::after{bottom:4px}
#montage .mq{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
#montage .mqtrack{display:flex;width:max-content;animation:mqx 44s linear infinite}
#montage .mq:hover .mqtrack{animation-play-state:paused}
.mqset{display:flex;gap:clamp(12px,1.8vw,22px);padding-right:clamp(12px,1.8vw,22px)}
@keyframes mqx{to{transform:translateX(-50%)}}
.fcard{flex:0 0 auto;width:clamp(240px,28vw,340px)}
.fframe{aspect-ratio:16/9;border-radius:4px;position:relative;overflow:hidden;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;transition:transform .45s cubic-bezier(.16,1,.3,1)}
.fcard:hover .fframe{transform:scale(1.03)}
.fframe .tc{position:absolute;top:9px;left:11px;font-family:var(--mono);font-size:8.5px;letter-spacing:.14em;color:rgba(255,255,255,.65)}
.fframe .rdot{position:absolute;top:9px;right:11px;width:7px;height:7px;border-radius:50%;background:var(--red);animation:blip 1.4s ease-in-out infinite}
.fframe .vg{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,transparent 52%,rgba(0,0,0,.5))}
.fframe .w{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(24px,2.6vw,34px);letter-spacing:-.025em;text-transform:uppercase;color:#fff}
.fframe .w u{text-decoration:none;color:var(--red)}
.fframe .wsoft{font-family:var(--body);font-weight:300;font-size:clamp(19px,2.1vw,27px);letter-spacing:.2em;color:#fff;text-transform:lowercase}
.fframe.f1{background:linear-gradient(150deg,#26060a,#0B0B0C 62%)}
.fframe.f2{background:linear-gradient(160deg,#17171b,#0B0B0C 70%)}
.fframe.f3{background:linear-gradient(150deg,#2b2117,#141110 68%)}
.fframe.f4{background:linear-gradient(155deg,#1d2226,#0e1113 70%)}
.fframe.f5{background:linear-gradient(150deg,#1b1b1f,#0B0B0C 66%)}
.fframe.f6{background:linear-gradient(155deg,#211d16,#0f0e0c 70%)}
.fmeta{display:flex;justify-content:space-between;gap:10px;margin-top:10px;font-family:var(--mono);font-size:10px;letter-spacing:.12em;color:var(--grey);white-space:nowrap}
.fmeta b{color:var(--black);font-weight:500}
#montage .cutnote{margin-top:clamp(26px,4vh,42px);text-align:center;font-family:var(--mono);font-size:11px;letter-spacing:.18em;color:var(--grey)}
#montage .cutnote b{color:var(--red);font-weight:400}

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

@media (max-width:768px){
  #vrail{display:none}
  #vhero{grid-template-columns:1fr;gap:34px;min-height:auto;padding-top:clamp(96px,15vh,130px)}
  #vhero .apwrap{order:-1}
  #apsvg{width:min(60%,220px)}
  /* The scrub is switched off below 768px (see IS_M in init.ts); the scenes
     stack and the track, which has nothing to drive it, is hidden. */
  #tl{height:auto}
  #tl .pin{position:static;height:auto;padding:clamp(70px,10vh,100px) var(--pad)}
  .mon{aspect-ratio:4/3}
  .mon .scene{position:relative;opacity:1;inset:auto;border-bottom:1px solid rgba(255,255,255,.1)}
  .track{display:none}
}
@media (max-width:480px){ #vhero h1{font-size:clamp(36px,12vw,54px)} }
@media (max-height:600px){
  #vhero{min-height:auto}
  #tl{height:auto}
  #tl .pin{position:static;height:auto}
  .mon .scene{position:relative;opacity:1;inset:auto}
}
@media (prefers-reduced-motion:reduce){
  *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
  .up{opacity:1;transform:none}
  #vhero h1 .l i{transform:none;animation:none}
  #apsvg .bl,#vhero .rec i,#snd .bars i,.fframe .rdot{animation:none}
  #snd .bars i{transform:scaleY(.6)}
  #montage .mqtrack{animation:none}
  #montage .mq{overflow-x:auto;-webkit-mask-image:none;mask-image:none}
  #tl{height:auto}
  #tl .pin{position:static;height:auto}
  .mon{aspect-ratio:auto}
  .mon .scene{position:relative;opacity:1;inset:auto;padding:24px 0;border-bottom:1px solid rgba(255,255,255,.1)}
  .track{display:none}
}
`;

/* The four beats of a film that works, and how much of the running time each
   is given. `flex` is the clip width on the track, so the playhead crossing a
   clip and the scene cutting are the same event. */
const SCENES = [
  { h: "The hook", p: "Attention is captured in the first moments or never. The hook is the whole strategy — everything after it only exists if this works.", clip: "THE HOOK", flex: 18 },
  { h: "The turn", p: "Something has to change, or the viewer already knows the rest. Pacing is decided cut by cut — and pacing is what keeps the thumb still.", clip: "THE TURN", flex: 22 },
  { h: "The proof", p: "The claim, shown rather than said — and cut tight enough that no second asks to be skipped.", clip: "THE PROOF", flex: 34 },
  { h: "The ask", p: "One clear next move, made while attention is still yours.", clip: "THE ASK", flex: 26 },
];

/* Finished frames. Each carries its own grade so the strip reads as six films
   rather than one look repeated. */
const MONTAGE = [
  { cls: "f1", tc: "TC 00:00:12", art: `<span class="w">GAME <u>ON</u></span>`, b: "Hitex SportExpo", tag: "LAUNCH FILM" },
  { cls: "f2", tc: "TC 00:01:04", art: `<span class="wsoft">listen.</span>`, b: "Hope Trust India", tag: "BRAND STORY" },
  { cls: "f3", tc: "TC 00:00:38", art: `<span class="wsoft">the space</span>`, b: "Our Sacred Space", tag: "VENUE FILM" },
  { cls: "f4", tc: "TC 00:00:21", art: `<span class="w">CLARITY<u>.</u></span>`, b: "South Glass", tag: "PRODUCT FILM" },
  { cls: "f5", tc: "TC 00:00:47", art: `<span class="wsoft">flow</span>`, b: "Samyoga Studio", tag: "STUDIO FILM" },
  { cls: "f6", tc: "TC 00:02:10", art: `<span class="w">50 <u>YEARS</u></span>`, b: "Patil Group", tag: "CORPORATE FILM" },
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

/* The equaliser. Nine delays repeated across the row so neighbouring bars are
   always out of phase without needing a value per bar. */
const eqBars = () =>
  Array.from(
    { length: 34 },
    (_, i) => `<i style="--sd:${((i % 9) * 0.13).toFixed(2)}s"></i>`,
  ).join("");

/* The marquee needs its contents twice: the track translates -50%, so the
   second copy is what occupies the viewport as the first scrolls out. It is
   duplicate content, hence aria-hidden on the copy. */
const montageSet = (hidden: boolean) => `
        <div class="mqset"${hidden ? ' aria-hidden="true"' : ""}>
      ${MONTAGE.map(
        (m) =>
          `<div class="fcard"><div class="fframe ${m.cls}"><span class="tc">${m.tc}</span><span class="rdot"></span>${m.art}<span class="vg"></span></div><div class="fmeta"><b>${m.b}</b><span>${m.tag}</span></div></div>`,
      ).join("\n      ")}
        </div>`;

export const VIDEO_HTML = String.raw`
<div id="vbg"></div>
<div id="vline"></div>
<div id="vrail" role="navigation" aria-label="Section"></div>

<!-- 1 — HERO -->
<section class="vs dark" id="vhero" data-bg="#0B0B0C" data-label="Video">
  <div>
    <div class="crumb"><a href="/">Home</a><span>/</span><a href="/services">Services</a><span>/</span><b>Video Production</b></div>
    <h1>${heroLine("FILMS THAT", 0.15)}<br>${heroLine("DO A JOB", 0.42, true)}</h1>
    <p class="vp">Anything can be filmed. What gets watched is decided in the edit — the hook that stops the scroll, the pacing that holds it, the story that lands.</p>
  </div>
  <div class="apwrap">
    <div>
      <svg id="apsvg" viewBox="0 0 200 200" fill="none" role="img" aria-label="An aperture opening around a play mark">
        ${blades()}
        <circle cx="100" cy="100" r="72" stroke="currentColor" stroke-width="1.4" fill="none" opacity=".5"/>
        <path class="play" d="M88 82 L124 100 L88 118 Z"/>
      </svg>
      <div class="rec"><i></i>REC</div>
    </div>
  </div>
</section>

<!-- 2 — TIMELINE (scrub) -->
<section id="tl" data-bg="#0B0B0C" data-label="The timeline">
  <div class="pin">
    <div class="head">
      <div>
        <h2 class="vh" style="color:#fff">Won in the first seconds. Held by the <em>cut</em>.</h2>
      </div>
      <div id="tcode">TC 00:00:00</div>
    </div>
    <div class="mon">
      ${SCENES.map(
        (s, i) => `<div class="scene s${i}${i === 0 ? " on" : ""}" data-i="${i}">
        <h3>${s.h}</h3>
        <p>${s.p}</p>
      </div>`,
      ).join("\n      ")}
      <div class="scan" aria-hidden="true"></div>
      <div class="vig" aria-hidden="true"></div>
    </div>
    <div class="track" id="track">
      ${SCENES.map(
        (s, i) =>
          `<div class="clip${i === 0 ? " on" : ""}" data-i="${i}" style="flex:${s.flex}"><span>${s.clip}</span></div>`,
      ).join("\n      ")}
      <div id="play"></div>
    </div>
  </div>
</section>

<!-- 3 — SOUND -->
<section class="vs dark" id="snd" data-bg="#0B0B0C" data-label="Sound">
  <h2 class="vh up" style="--d:.08s">Half the film you can't <em>see</em>.</h2>
  <p class="vp up" style="--d:.14s">Viewers forgive an imperfect image long before poor audio. Sound is half the edit — the pace, mood and weight you never see.</p>
  <div class="bars up" style="--d:.2s" aria-hidden="true">${eqBars()}</div>
</section>

<!-- 4 — THE MONTAGE -->
<section class="vs" id="montage" data-bg="#FFFFFF" data-label="The montage">
  <h2 class="vh up">Straight from the <em>timeline</em>.</h2>
  <p class="vp up" style="--d:.1s">A running cut of finished work — films made to hook, hold and convert.</p>
  <div class="strip up" style="--d:.18s">
    <div class="mq">
      <div class="mqtrack">${montageSet(false)}${montageSet(true)}
      </div>
    </div>
  </div>
  <p class="cutnote up" style="--d:.26s"><b>//</b> NOTICE HOW QUICKLY THIS PAGE GOT TO THE POINT? THAT'S THE EDIT.</p>
</section>

<!-- 5 — CLOSE -->
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
  <footer><div>© 2026 ADMIRATE.IN</div><div>MADE TO CONVERT</div></footer>
</section>
`;
