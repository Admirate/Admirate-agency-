/**
 * VIDEO PRODUCTION — a page that behaves like an edit suite.
 *
 * Set-pieces unique to this page:
 *   TIMELINE  scrolling scrubs a real timeline: timecode counts, the playhead
 *             moves, scenes cut. The section's argument is about structure and
 *             pacing, so the reader is given the scrubber
 *   RATIOS    the same film in three ratios, switchable — the point being that
 *             these are three edits, not three crops
 *
 * Crew size, kit and turnaround are stated nowhere: the repository records
 * none of it.
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
.veb{font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--red);display:flex;align-items:center;gap:11px;margin-bottom:16px}
.veb::after{content:"";height:1px;width:clamp(26px,5vw,60px);background:currentColor;opacity:.45}
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

/* ============ 3 — RATIOS ============ */
#rat .rwrap{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(28px,5vw,72px);align-items:center;margin-top:clamp(28px,4.6vh,50px)}
#rat .tabs{display:inline-flex;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.16);border-radius:999px;padding:4px;margin-top:22px}
#rat .tabs button{font-family:var(--mono);font-size:10.5px;letter-spacing:.14em;background:none;border:none;color:#9a9a9e;padding:10px 15px;border-radius:999px;cursor:pointer;transition:background .25s,color .25s}
#rat .tabs button.on{background:var(--red);color:#fff}
#rstage{display:flex;align-items:center;justify-content:center;min-height:min(56vh,420px)}
#rframe{
  position:relative;background:#0a0a0c;border:1px solid rgba(255,255,255,.14);overflow:hidden;
  transition:width .6s cubic-bezier(.16,1,.3,1),height .6s cubic-bezier(.16,1,.3,1);
  display:flex;align-items:center;justify-content:center;padding:clamp(14px,2.4vw,30px);
}
#rframe .rt{font-family:var(--display);font-weight:900;font-stretch:112%;letter-spacing:-.028em;line-height:.98;color:#fff;text-transform:uppercase;text-align:center;transition:font-size .6s cubic-bezier(.16,1,.3,1)}
#rframe .rt span{color:var(--red)}
#rframe .vig{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 50%,transparent 55%,rgba(0,0,0,.55))}
#rcap{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--red);margin-top:16px;min-height:1.4em}

/* ============ 4 — SOUND ============ */
#snd .bars{display:flex;align-items:flex-end;gap:clamp(3px,.6vw,7px);height:clamp(90px,16vh,150px);margin-top:clamp(30px,5vh,52px)}
#snd .bars i{flex:1;background:var(--red);opacity:.75;border-radius:2px 2px 0 0;transform-origin:bottom;animation:eq 1.6s ease-in-out infinite;animation-delay:var(--sd,0s)}
@keyframes eq{0%,100%{transform:scaleY(.22)}50%{transform:scaleY(1)}}

/* ============ 5 — PROOF ============ */
#vproof .plist{margin-top:clamp(30px,5vh,52px);border-top:1px solid var(--line)}
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
#vdepth .dwrap{max-width:68ch;margin-top:clamp(30px,5vh,52px)}
#vdepth h3{font-family:var(--display);font-weight:800;font-stretch:104%;font-size:clamp(19px,2.2vw,28px);line-height:1.2;letter-spacing:-.015em;margin:clamp(32px,5vh,54px) 0 13px}
#vdepth p{font-size:clamp(15px,1.35vw,17.5px);line-height:1.78;color:#4a4a4e;margin-bottom:19px}
#vdepth .dwrap>p:first-of-type::first-letter{font-family:var(--display);font-weight:900;font-stretch:110%;float:left;font-size:3.5em;line-height:.82;padding:6px 12px 0 0;color:var(--red)}

/* ============ 7 — CLOSE ============ */
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
  #tl{height:auto}
  #tl .pin{position:static;height:auto;padding:clamp(70px,10vh,100px) var(--pad)}
  .mon{aspect-ratio:4/3}
  .mon .scene{position:relative;opacity:1;inset:auto;border-bottom:1px solid rgba(255,255,255,.1)}
  .track{display:none}
  #rat .rwrap{grid-template-columns:1fr;gap:24px}
  .prow{grid-template-columns:auto minmax(0,1fr);row-gap:7px}
  .prow .pt{grid-column:2;justify-self:start}
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
  #apsvg .bl,#vhero .rec i,#snd .bars i{animation:none}
  #snd .bars i{transform:scaleY(.6)}
  #tl{height:auto}
  #tl .pin{position:static;height:auto}
  .mon{aspect-ratio:auto}
  .mon .scene{position:relative;opacity:1;inset:auto;padding:24px 0;border-bottom:1px solid rgba(255,255,255,.1)}
  .track{display:none}
}
`;

const SCENES = [
  { n: "SCENE 01 — 00:00", h: "The hook", p: "Whatever happens here decides whether anything after it is watched. It is written, not filmed — and it is the cheapest thing in the entire production to get right." },
  { n: "SCENE 02 — 00:08", h: "The turn", p: "The reason to keep watching. Something has to change, or the viewer has already learned the rest is predictable." },
  { n: "SCENE 03 — 00:22", h: "The proof", p: "The claim, shown rather than asserted. This is where production value finally earns its budget — and not a second before." },
  { n: "SCENE 04 — 00:38", h: "The ask", p: "One clear next move, made while the argument is still standing. Placed anywhere earlier it is noise." },
];

const RATIOS = [
  { k: "wide", lbl: "16:9 — SITE & YOUTUBE", w: 100, h: 56.25, fs: 34, cap: "// ROOM TO BREATHE. THE FULL ARGUMENT FITS." },
  { k: "tall", lbl: "9:16 — REELS & SHORTS", w: 42, h: 74, fs: 26, cap: "// RECOMPOSED, NOT CROPPED. THE SUBJECT MOVES." },
  { k: "sq", lbl: "1:1 — FEED", w: 62, h: 62, fs: 29, cap: "// A THIRD COMPOSITION. SAME FOOTAGE, NEW EDIT." },
];

const PROOF = [
  { n: "Hitex SportExpo", t: "Event · Film", d: "An expo with a launch window — film made to carry scale and urgency at once." },
  { n: "Hope Trust India", t: "Story · Care", d: "Subject matter that required restraint; a story told without dramatising the people in it." },
  { n: "Our Sacred Space", t: "Venue · Culture", d: "A space whose atmosphere is the offer, which makes it a film problem more than a photo one." },
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

/* Six aperture blades on a 200 box. */
const blades = () =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (i * 60 * Math.PI) / 180;
    const x1 = 100 + 72 * Math.cos(a);
    const y1 = 100 + 72 * Math.sin(a);
    const x2 = 100 + 72 * Math.cos(a + (120 * Math.PI) / 180);
    const y2 = 100 + 72 * Math.sin(a + (120 * Math.PI) / 180);
    return `<path class="bl" d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(
      1
    )} ${y2.toFixed(1)}"/>`;
  }).join("");

export const VIDEO_HTML = String.raw`
<div id="vbg"></div>
<div id="vline"></div>
<div id="vrail" role="navigation" aria-label="Section"></div>

<!-- 1 — HERO -->
<section class="vs dark" id="vhero" data-bg="#0B0B0C" data-label="Video">
  <div>
    <div class="crumb"><a href="/">Home</a><span>/</span><a href="/services">Services</a><span>/</span><b>Video Production</b></div>
    <h1>${heroLine("FILMS THAT", 0.15)}<br>${heroLine("DO A JOB", 0.42, true)}</h1>
    <p class="vp">Brand films, ads and stories — scripted, shot and cut in-house, built around what the film has to achieve rather than how it should look.</p>
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
        <div class="veb">THE STRUCTURE</div>
        <h2 class="vh" style="color:#fff">A film is made on paper. <em>Twice</em>.</h2>
      </div>
      <div id="tcode">TC 00:00:00</div>
    </div>
    <div class="mon">
      ${SCENES.map(
        (s, i) => `<div class="scene s${i}${i === 0 ? " on" : ""}" data-i="${i}">
        <div class="sn">${s.n}</div>
        <h3>${s.h}</h3>
        <p>${s.p}</p>
      </div>`
      ).join("\n      ")}
      <div class="scan" aria-hidden="true"></div>
      <div class="vig" aria-hidden="true"></div>
    </div>
    <div class="track" id="track">
      ${SCENES.map(
        (s, i) => `<div class="clip${i === 0 ? " on" : ""}" data-i="${i}" style="flex:${[18, 22, 34, 26][i]}"><span>${s.h.toUpperCase()}</span></div>`
      ).join("\n      ")}
      <div id="play"></div>
    </div>
  </div>
</section>

<!-- 3 — RATIOS -->
<section class="vs" id="rat" data-bg="#FAFAF8" data-label="Ratios">
  <div class="veb up">THE DELIVERY</div>
  <h2 class="vh up" style="--d:.08s">Three ratios. Three <em>edits</em>.</h2>
  <div class="rwrap">
    <div>
      <p class="vp up" style="--d:.14s">The same footage has to work full-width on a site, vertically in a feed, and square. These are different compositions, not different crops — and planning them during the shoot is what makes them possible at all.</p>
      <div class="tabs up" style="--d:.22s" id="rtabs" role="group" aria-label="Aspect ratio">
        ${RATIOS.map(
          (r, i) => `<button type="button" data-k="${r.k}"${i === 0 ? ' class="on"' : ""} data-h>${r.lbl.split(" — ")[0]}</button>`
        ).join("")}
      </div>
      <div id="rcap" role="status" aria-live="polite">${RATIOS[0].cap}</div>
    </div>
    <div id="rstage" class="up" style="--d:.18s">
      <div id="rframe" style="width:${RATIOS[0].w}%;aspect-ratio:16/9">
        <div class="rt" style="font-size:${RATIOS[0].fs}px">Stop<span>.</span><br>Look here first</div>
        <div class="vig" aria-hidden="true"></div>
      </div>
    </div>
  </div>
</section>

<!-- 4 — SOUND -->
<section class="vs dark" id="snd" data-bg="#0B0B0C" data-label="Sound">
  <div class="veb up">SOUND</div>
  <h2 class="vh up" style="--d:.08s">Half the film you can't <em>see</em>.</h2>
  <p class="vp up" style="--d:.14s">Viewers tolerate an imperfect image far longer than poor audio, and sound carries most of a film's emotional weight. It is routinely the first thing cut from a budget and the first thing an audience notices.</p>
  <div class="bars up" style="--d:.2s" aria-hidden="true">
    ${Array.from({ length: 34 }, (_, i) => `<i style="--sd:${((i % 9) * 0.13).toFixed(2)}s"></i>`).join("")}
  </div>
</section>

<!-- 5 — PROOF -->
<section class="vs" id="vproof" data-bg="#FFFFFF" data-label="Proof">
  <div class="veb up">PROOF</div>
  <h2 class="vh up" style="--d:.08s">Films made to do <em>something</em>.</h2>
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
<section class="vs" id="vdepth" data-bg="#FAFAF8" data-label="In depth">
  <div class="veb up">IN DEPTH</div>
  <h2 class="vh up" style="--d:.08s">The long version, for anyone who wants it.</h2>
  <div class="dwrap up" style="--d:.16s">
    <p>Video is the most expensive thing most brands make and the least frequently briefed properly. The conversation usually starts with format and duration — a two-minute brand film, a thirty-second ad — before anyone has said what the film is supposed to do. Those decisions belong at the end of the reasoning, not the start.</p>
    <h3>Structure beats production value</h3>
    <p>Audiences forgive a great deal visually and almost nothing structurally. A film that is beautifully shot but takes forty seconds to reach a point will be abandoned; a plainly shot film that is clear from the first line will be watched through. Where the money goes should follow that, and it usually does not.</p>
    <h3>Written before it is filmed</h3>
    <p>Every problem is cheapest on paper. A scene that does not work costs a sentence to cut in the script, a morning to reshoot on location, and sometimes cannot be fixed at all in the edit. Scripting is not a formality ahead of the interesting part — it is where the film is actually made.</p>
    <h3>Cut for where it plays</h3>
    <p>The same footage has to work as a full film on a site, a short in a feed, and a few seconds before someone skips. These are different edits, not different crops. Planning the cutdowns during the shoot — rather than discovering them afterwards — is the difference between a set of real assets and one film awkwardly trimmed.</p>
  </div>
</section>

<!-- 7 — CLOSE -->
<section class="vs dark" id="vclose" data-bg="#0B0B0C" data-label="Close">
  <div class="veb up">KEEP GOING</div>
  <h2 class="vh up" style="--d:.08s">The rest of what we do.</h2>
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

export const SCENE_COUNT = SCENES.length;
export const RATIO_SPECS = RATIOS;
