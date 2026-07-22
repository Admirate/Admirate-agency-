import { asset } from "@/lib/cdn";

const LOGO = asset("admirate logo.webp");

import { NAP_HTML } from "@/lib/seo";

export const START_CSS = String.raw`
:root{
  --white:#FFFFFF;
  --paper:#FAFAF8;
  --black:#0B0B0C;
  --red:#E3001B;
  --grey:#8A8A8E;
  --line:#E9E9E6;
  --pad:clamp(24px,6vw,96px);
  --display:'Archivo',sans-serif;
  --body:'Inter',sans-serif;
  --mono:'IBM Plex Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{font-family:var(--body);background:var(--black);color:var(--black);overflow-x:hidden;-webkit-font-smoothing:antialiased}
::selection{background:var(--red);color:var(--white)}
button{font:inherit;background:none;border:none;cursor:pointer}
input,textarea{font:inherit;color:inherit}

/* —— the background IS the animation: ink → paper as you scroll —— */
#bgfade{position:fixed;inset:0;z-index:0;background:var(--black);will-change:background-color}
#topline{position:fixed;top:0;left:0;height:2px;width:0;background:var(--red);z-index:200}

/* custom cursor */
@media (pointer:fine){
  #cdot{position:fixed;top:0;left:0;width:7px;height:7px;border-radius:50%;background:var(--red);z-index:400;pointer-events:none;transform:translate(-50%,-50%)}
  #cring{position:fixed;top:0;left:0;width:30px;height:30px;border-radius:50%;border:1.5px solid rgba(227,0,27,.5);z-index:399;pointer-events:none;transform:translate(-50%,-50%) scale(1);transition:transform .25s cubic-bezier(.2,.8,.2,1),border-color .25s}
  body.hovering #cring{transform:translate(-50%,-50%) scale(1.9);border-color:var(--red)}
}
@media (pointer:coarse){#cdot,#cring{display:none}}

/* —— nav —— */
/* This nav used to ride mix-blend-mode:difference so it stayed legible as the
   background morphs ink -> paper. The logo cannot survive that: under difference
   the mark's red inverts to cyan on paper. The blend is gone, and both children
   now carry their own contrast instead — a white chip for the logo, a solid ink
   chip for the back link. Both read on either background, with no blending.
   (Moving the blend down onto .back alone does NOT work: nav is a fixed,
   z-indexed stacking context, so a child blends against nav's own transparent
   backdrop rather than the page, and the link washes out to white on paper.) */
nav{position:fixed;top:0;left:0;right:0;z-index:90;display:flex;justify-content:space-between;align-items:center;padding:20px var(--pad);color:#fff}
nav .logo{display:flex;align-items:center;background:#fff;border-radius:999px;padding:6px 12px;text-decoration:none;transition:transform .18s,box-shadow .18s}
nav .logo:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,.18)}
nav .logo img{display:block;height:18px;width:auto}
nav a.back{font-family:var(--mono);font-size:11px;text-decoration:none;color:#fff;background:var(--black);border:1px solid rgba(255,255,255,.28);padding:9px 16px;letter-spacing:.12em;transition:background .2s,border-color .2s}
nav a.back:hover{background:var(--red);border-color:var(--red)}

main{position:relative;z-index:3}

/* —— SECTION 1: INTRO — one full screen on ink —— */
#intro{height:100svh;overflow:hidden;display:flex;flex-direction:column;justify-content:center;padding:120px var(--pad) 56px;position:relative}
#intro .dots{position:absolute;inset:-40%;background-image:radial-gradient(#1d1d1f 1.2px,transparent 1.2px);background-size:34px 34px;opacity:.5;animation:dotdrift 60s linear infinite;pointer-events:none}
@keyframes dotdrift{to{transform:translate(34px,34px)}}
#intro .glow{position:absolute;top:-20%;right:-12%;width:60vmin;height:60vmin;background:radial-gradient(circle,rgba(227,0,27,.16),transparent 65%);pointer-events:none}
#intro .inner{position:relative;z-index:1;max-width:720px;will-change:transform,opacity}

.eb{font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--red);margin-bottom:20px;display:flex;align-items:center;gap:12px}
.eb::before{content:"";width:22px;height:1px;background:var(--red)}
h1{font-family:var(--display);font-weight:900;font-stretch:110%;font-size:clamp(42px,6.6vw,84px);line-height:1.04;letter-spacing:-.015em;color:#fff}
h1 .w{display:inline-block;opacity:0;transform:translateY(40px);filter:blur(8px)}
body.ready h1 .w{animation:wIn .85s forwards cubic-bezier(.16,1,.3,1);animation-delay:var(--d,0s)}
@keyframes wIn{to{opacity:1;transform:none;filter:blur(0)}}
h1 .dot{color:var(--red)}
.sub{margin-top:22px;font-weight:300;font-size:clamp(16px,1.5vw,19px);line-height:1.65;color:#b8b8bb;max-width:46ch;opacity:0;transform:translateY(14px)}
body.ready .sub{animation:fadeUp .8s .62s forwards}
@keyframes fadeUp{to{opacity:1;transform:none}}
.sub b{font-weight:700;color:#fff}
.rule{width:56px;height:2px;background:var(--red);margin:28px 0 0;transform:scaleX(0);transform-origin:left}
body.ready .rule{animation:ruleIn .6s .88s forwards cubic-bezier(.7,0,.3,1)}
@keyframes ruleIn{to{transform:scaleX(1)}}

.steps{margin-top:30px;display:flex;flex-direction:column;gap:13px}
.step{display:flex;align-items:baseline;gap:14px;font-family:var(--mono);font-size:11.5px;letter-spacing:.14em;color:#9a9a9e;opacity:0;transform:translateX(-14px)}
body.ready .step{animation:stepIn .6s forwards cubic-bezier(.2,.8,.2,1)}
body.ready .step:nth-child(1){animation-delay:1s}
body.ready .step:nth-child(2){animation-delay:1.15s}
body.ready .step:nth-child(3){animation-delay:1.3s}
@keyframes stepIn{to{opacity:1;transform:none}}
.step b{color:var(--red);font-weight:500}

.talk{margin-top:34px;opacity:0}
body.ready .talk{animation:fadeUp .7s 1.45s forwards}
.talk .t{font-family:var(--mono);font-size:10px;letter-spacing:.22em;color:#77777b;margin-bottom:12px}
.talk .chips{display:flex;gap:10px;flex-wrap:wrap}
.tchip{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-decoration:none;color:#fff;border:1px solid #2c2c2e;background:transparent;padding:11px 16px;display:inline-flex;align-items:center;gap:8px;transition:border-color .2s,background .2s,transform .2s}
.tchip:hover{border-color:var(--red);background:var(--red);transform:translateY(-2px)}
.tchip i{width:7px;height:7px;border-radius:50%;background:var(--red)}
.tchip:hover i{background:#fff}

#scrollhint{position:absolute;bottom:34px;left:var(--pad);font-family:var(--mono);font-size:9px;letter-spacing:.3em;color:#77777b;opacity:0;z-index:1}
body.ready #scrollhint{animation:fadeUp .7s 1.65s forwards}
#scrollhint .line{width:1px;height:30px;background:#2c2c2e;margin-top:8px;position:relative;overflow:hidden}
#scrollhint .line i{position:absolute;left:0;top:-100%;width:100%;height:100%;background:var(--red);animation:fall 1.7s cubic-bezier(.7,0,.3,1) infinite}
@keyframes fall{to{top:100%}}

/* —— SECTION 2: FORM — centered on paper —— */
#formsec{min-height:100svh;display:flex;align-items:center;justify-content:center;padding:clamp(80px,11vh,110px) var(--pad) clamp(56px,8vh,80px)}
.fcard{position:relative;width:min(680px,100%);background:var(--white);border:1px solid var(--line);box-shadow:12px 12px 0 rgba(11,11,12,.06);padding:clamp(24px,2.6vw,34px)}
.fcard .fx{opacity:0;transform:translateY(16px);transition:opacity .6s cubic-bezier(.2,.8,.2,1),transform .6s cubic-bezier(.2,.8,.2,1);transition-delay:var(--fd,0s)}
.fcard.inview .fx{opacity:1;transform:none}

.fhead{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:20px}
.fhead .ft{font-family:var(--display);font-weight:800;font-stretch:106%;font-size:clamp(18px,1.8vw,22px);letter-spacing:-.01em}
.fhead .fm{font-family:var(--mono);font-size:9.5px;letter-spacing:.18em;color:var(--grey)}

.frow{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:13px}
.fgroup{display:flex;flex-direction:column;gap:6px}
.fgroup label{font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;color:#5a5a5e}
.fgroup label b{color:var(--red);font-weight:500}
.fin{background:var(--paper);border:1px solid var(--line);padding:12px 13px;font-size:14.5px;outline:none;transition:border-color .2s,box-shadow .2s;border-radius:0;width:100%}
.fin::placeholder{color:#b6b6b3}
.fin:focus{border-color:var(--red);box-shadow:4px 4px 0 rgba(227,0,27,.12)}
.fin.err{border-color:var(--red);animation:shake .4s}
@keyframes shake{0%,100%{transform:none}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
textarea.fin{resize:vertical;min-height:92px;line-height:1.55}

.fsec{margin:4px 0 13px}
.fsec .fl{font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;color:#5a5a5e;margin-bottom:9px}
.chipset{display:flex;flex-wrap:wrap;gap:7px}
.chip{font-family:var(--mono);font-size:10.5px;letter-spacing:.08em;border:1px solid var(--line);background:var(--white);padding:8px 12px;transition:background .18s,border-color .18s,color .18s,transform .18s,box-shadow .18s;user-select:none}
.chip:hover{border-color:var(--red);transform:translateY(-2px);box-shadow:3px 3px 0 rgba(227,0,27,.14)}
.chip.on{background:var(--red);border-color:var(--red);color:#fff;animation:pop .3s cubic-bezier(.34,1.56,.64,1)}
@keyframes pop{0%{transform:scale(.9)}100%{transform:scale(1)}}

.helper{font-size:12.5px;color:var(--grey);margin-top:-6px;margin-bottom:13px;font-weight:300}

.fsubmit{display:flex;align-items:center;gap:18px;margin-top:4px}
.sendbtn{font-family:var(--body);font-weight:600;font-size:15px;background:var(--red);color:#fff;padding:15px 25px;display:inline-flex;align-items:center;gap:10px;transition:transform .18s,box-shadow .18s}
.sendbtn .ar{display:inline-block;transition:transform .18s}
.sendbtn:hover{transform:translateY(-2px);box-shadow:4px 4px 0 var(--black)}
.sendbtn:hover .ar{transform:translateX(6px)}
.sendbtn:disabled{opacity:.6;cursor:default}
.fstatus{font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:var(--grey)}
.fstatus.bad{color:var(--red)}
.fnote{margin-top:14px;font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;color:var(--grey)}

/* success */
.done{position:absolute;inset:0;background:var(--white);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px;opacity:0;pointer-events:none;transition:opacity .5s}
.fcard.sent .done{opacity:1;pointer-events:auto}
.fcard.sent form{opacity:0;pointer-events:none;transition:opacity .35s}
.done svg{width:84px;height:84px;margin-bottom:22px}
.done circle{fill:none;stroke:var(--red);stroke-width:2.5;stroke-dasharray:264;stroke-dashoffset:264}
.fcard.sent .done circle{animation:draw 1s .2s forwards cubic-bezier(.7,0,.3,1)}
.done path{fill:none;stroke:var(--red);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:48;stroke-dashoffset:48}
.fcard.sent .done path{animation:draw .5s .9s forwards}
@keyframes draw{to{stroke-dashoffset:0}}
.done h3{font-family:var(--display);font-weight:900;font-stretch:110%;font-size:clamp(24px,2.4vw,34px);margin-bottom:12px}
.done p{font-weight:300;color:#4a4a4d;max-width:36ch;line-height:1.6;margin-bottom:22px}
.done .again{font-family:var(--mono);font-size:10px;letter-spacing:.18em;color:var(--grey);border-bottom:1px solid var(--line);padding-bottom:2px;transition:color .2s,border-color .2s}
.done .again:hover{color:var(--red);border-color:var(--red)}

footer{position:relative;z-index:3;border-top:1px solid var(--line);padding:16px var(--pad);display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;font-family:var(--mono);font-size:10px;color:var(--grey);letter-spacing:.12em}

@media (max-width:900px){
  #intro{height:auto;min-height:100svh;padding:100px var(--pad) 90px}
  h1{font-size:clamp(34px,9.6vw,52px)}
  .frow{grid-template-columns:1fr}
  #scrollhint{bottom:22px}
  nav{background:rgba(11,11,12,.85);backdrop-filter:blur(8px);border-bottom:1px solid #1d1d1f;padding:12px var(--pad)}
  nav .logo{padding:5px 10px}
  nav .logo img{height:16px}
}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01s!important;transition-duration:.01s!important;animation-delay:0s!important;transition-delay:0s!important}
  h1 .w,.sub,.rule,.step,.talk,#scrollhint,.fcard .fx{opacity:1!important;transform:none!important;filter:none!important}
  #cdot,#cring,#bgfade{display:none}
  #intro{background:var(--black)}
  #formsec,footer{background:var(--paper)}
}
`;

export const START_HTML = String.raw`

<div id="bgfade"></div>
<div id="topline"></div>
<div id="cdot"></div><div id="cring"></div>

<nav>
  <!-- This page carries its own header rather than shared/nav.ts, so the logo
       alt has to be fixed here too. Same reasoning as there: real text, so a
       crawler counting missing alts is satisfied, while the anchor's
       aria-label is what a screen reader announces — nothing is said twice. -->
  <a class="logo" href="/" data-h aria-label="ADMIRATE home"><img src="${LOGO}" alt="ADMIRATE" width="213" height="46" decoding="async"></a>
  <a class="back" href="/" data-h>← BACK TO SITE</a>
</nav>

<main>
  <!-- SECTION 1: INTRO (ink) -->
  <section id="intro">
    <div class="dots"></div>
    <div class="glow"></div>
    <div class="inner" id="introInner">
      <div class="eb">// START A PROJECT</div>
      <h1>
        <span class="w" style="--d:.15s">Tell</span>
        <span class="w" style="--d:.28s">us</span>
        <span class="w" style="--d:.42s">everything<span class="dot">.</span></span>
      </h1>
      <p class="sub">Mention a little about your project below — so when we <b>call you</b>, we're already prepared. Two lines is enough. Links help. Fluff doesn't.</p>
      <div class="rule"></div>

      <div class="steps">
        <div class="step"><b>01</b> YOU SEND THE BRIEF</div>
        <div class="step"><b>02</b> WE CALL WITHIN ONE WORKING DAY</div>
        <div class="step"><b>03</b> PLAN + QUOTE IN YOUR INBOX</div>
      </div>

      <div class="talk">
        <div class="t">PREFER TALKING FIRST?</div>
        <div class="chips">
          <a class="tchip" href="https://wa.me/918374494954" target="_blank" rel="noopener noreferrer" data-h><i></i>WHATSAPP US</a>
          <a class="tchip" href="mailto:essentials@admirate.in" data-h><i></i>ESSENTIALS@ADMIRATE.IN</a>
        </div>
      </div>
    </div>
    <div id="scrollhint">SCROLL FOR THE BRIEF<div class="line"><i></i></div></div>
  </section>

  <!-- SECTION 2: FORM (paper) -->
  <section id="formsec">
    <div class="fcard" id="fcard">
      <form id="brief" novalidate>
        <div class="fhead fx" style="--fd:.05s">
          <div class="ft">The brief</div>
          <div class="fm">~ 2 MIN</div>
        </div>

        <div class="frow fx" style="--fd:.12s">
          <div class="fgroup">
            <label for="f-name">YOUR NAME <b>*</b></label>
            <input class="fin" id="f-name" name="name" type="text" placeholder="First name is fine" autocomplete="name">
          </div>
          <div class="fgroup">
            <label for="f-co">BRAND / COMPANY</label>
            <input class="fin" id="f-co" name="company" type="text" placeholder="What are we making famous?" autocomplete="organization">
          </div>
        </div>

        <div class="frow fx" style="--fd:.19s">
          <div class="fgroup">
            <label for="f-email">EMAIL <b>*</b></label>
            <input class="fin" id="f-email" name="email" type="email" placeholder="you@company.com" autocomplete="email">
          </div>
          <div class="fgroup">
            <label for="f-phone">PHONE / WHATSAPP</label>
            <input class="fin" id="f-phone" name="phone" type="tel" placeholder="+91 …" autocomplete="tel">
          </div>
        </div>

        <div class="fsec fx" style="--fd:.26s">
          <div class="fl">WHAT DO YOU NEED? <span style="color:var(--grey)">— TAP ALL THAT APPLY</span></div>
          <div class="chipset" id="svc"></div>
        </div>

        <div class="frow fx" style="--fd:.33s">
          <div class="fgroup">
            <span class="fl" style="margin-bottom:3px">BUDGET</span>
            <div class="chipset" id="budget" data-single></div>
          </div>
          <div class="fgroup">
            <span class="fl" style="margin-bottom:3px">TIMELINE</span>
            <div class="chipset" id="time" data-single></div>
          </div>
        </div>

        <div class="fx" style="--fd:.4s">
          <div class="fgroup" style="margin-bottom:7px">
            <label for="f-brief">ABOUT YOUR PROJECT <b>*</b></label>
            <textarea class="fin" id="f-brief" name="brief" rows="4" placeholder="e.g. We're a café chain opening in Hyderabad — need a logo, a website with table booking, and reels for launch month. Site refs: …"></textarea>
          </div>
          <div class="helper">Goals, links, deadlines — whatever you mention now, we'll have studied before the call.</div>
        </div>

        <div class="fx" style="--fd:.47s">
          <div class="fsubmit">
            <button class="sendbtn" type="submit" data-h>Send the brief <span class="ar">→</span></button>
            <div class="fstatus" id="fstatus"></div>
          </div>
          <div class="fnote">// WE REPLY WITHIN ONE WORKING DAY. NO SPAM, NO NEWSLETTERS.</div>
        </div>
      </form>

      <div class="done" aria-live="polite">
        <svg viewBox="0 0 90 90"><circle cx="45" cy="45" r="42"/><path d="M28 46l12 12 22-26"/></svg>
        <h3>BRIEF RECEIVED.</h3>
        <p>We'll call you within one working day — keep your phone loud. Meanwhile, we're already reading what you sent.</p>
        <button class="again" id="again" data-h>SEND ANOTHER BRIEF</button>
      </div>
    </div>
  </section>
</main>

<footer>
  <div>© 2026 ADMIRATE.IN</div>
  <div>${NAP_HTML}</div>
  <div>MADE TO CONVERT</div>
</footer>

`;
