/**
 * START A PROJECT — the step-by-step brief.
 *
 * This page exports `startHtml(view)` rather than a `START_HTML` constant for
 * the same reason the pricing page does: the plan cards are a function of
 * fetched data. Every figure in the markup is already formatted by the server,
 * and the embedded payload carries the same figures for every cycle, so
 * switching a billing cycle swaps strings rather than doing arithmetic — the
 * number a visitor sees can never disagree with the number the server rendered.
 *
 * DESIGN NOTE — why a wizard rather than a form.
 *
 * The old page put fourteen controls in one view. Everything competed with
 * everything, and the only thing separating a serious enquiry from a casual
 * one was how much the visitor chose to type. Seven short screens ask one
 * thing at a time and arrive at a lead with industry, service and plan as
 * their own fields.
 *
 * Set-pieces:
 *   MORPH    the ink -> paper transition is kept, but fires on the CTA rather
 *            than on scroll. The page no longer scrolls, so scroll could not
 *            drive it — and tying it to an intentional click is what makes the
 *            wizard feel entered rather than fallen into
 *   RAIL     seven segments across the top. Step 4 changes shape between the
 *            packaged and Something Else paths rather than disappearing, so
 *            the rail never renumbers underneath the visitor
 *   PANEL    "Know More" is a modal, not a card flip. A flip is fragile at
 *            variable content heights and on touch, and these panels run from
 *            three feature rows to seventeen
 */

import { asset } from "@/lib/cdn";
import { NAP_HTML, LEGAL_HTML } from "@/lib/seo";
import { BILLING_CYCLES } from "@/lib/pricing";
import {
  BUDGETS,
  FAMILY_LABELS,
  INDUSTRIES,
  SCOPE_CHIPS,
  TIMELINES,
  TOTAL_STEPS,
} from "@/lib/brief";
import type { PricingPlanView, PricingView } from "@/components/pricing/content";

const LOGO = asset("admirate logo.webp");

const esc = (value: string) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** What each service card says. The plan data behind it comes from Supabase. */
const SERVICE_COPY: Record<string, { lead: string; note: string }> = {
  retainer: {
    lead: "Social, ads and content, run every month by the same team.",
    note: "Website maintenance included at every tier.",
    },
  website: {
    lead: "A site designed, built and shipped — once, properly.",
    note: "One-time build. Care plans are separate.",
  },
  care: {
    lead: "Your existing site kept secure, backed up and monitored.",
    note: "For sites already live.",
  },
};

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
/* The wizard owns the viewport once entered, and scrolls internally. */
body.wizopen{overflow:hidden}
::selection{background:var(--red);color:var(--white)}
button{font:inherit;background:none;border:none;cursor:pointer;color:inherit}
input,textarea{font:inherit;color:inherit}

#bgfade{position:fixed;inset:0;z-index:0;background:var(--black);transition:background-color .7s cubic-bezier(.4,0,.2,1)}
body.paper #bgfade{background:var(--paper)}

/* custom cursor */
@media (pointer:fine){
  #cdot{position:fixed;top:0;left:0;width:7px;height:7px;border-radius:50%;background:var(--red);z-index:400;pointer-events:none;transform:translate(-50%,-50%)}
  #cring{position:fixed;top:0;left:0;width:30px;height:30px;border-radius:50%;border:1.5px solid rgba(227,0,27,.5);z-index:399;pointer-events:none;transform:translate(-50%,-50%) scale(1);transition:transform .25s cubic-bezier(.2,.8,.2,1),border-color .25s}
  body.hovering #cring{transform:translate(-50%,-50%) scale(1.9);border-color:var(--red)}
}
@media (pointer:coarse){#cdot,#cring{display:none}}

/* —— nav ——
   No mix-blend-mode: the logo cannot survive difference blending, where the
   mark's red inverts to cyan on paper. Both children carry their own contrast
   instead — a white chip for the logo, a solid ink chip for the back link. */
nav{position:fixed;top:0;left:0;right:0;z-index:90;display:flex;justify-content:space-between;align-items:center;padding:20px var(--pad);color:#fff}
nav .logo{display:flex;align-items:center;background:#fff;border-radius:999px;padding:6px 12px;text-decoration:none;transition:transform .18s,box-shadow .18s}
nav .logo:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(0,0,0,.18)}
nav .logo img{display:block;height:18px;width:auto}
nav a.back,nav button.back{font-family:var(--mono);font-size:11px;text-decoration:none;color:#fff;background:var(--black);border:1px solid rgba(255,255,255,.28);padding:9px 16px;letter-spacing:.12em;transition:background .2s,border-color .2s}
nav a.back:hover,nav button.back:hover{background:var(--red);border-color:var(--red)}

main{position:relative;z-index:3}

/* —— INTRO — one full screen on ink —— */
#intro{min-height:100svh;display:flex;flex-direction:column;justify-content:center;padding:120px var(--pad) 56px;position:relative;transition:opacity .45s,transform .45s}
body.wizopen #intro{opacity:0;transform:translateY(-40px);pointer-events:none}
#intro .dots{position:absolute;inset:-40%;background-image:radial-gradient(#1d1d1f 1.2px,transparent 1.2px);background-size:34px 34px;opacity:.5;animation:dotdrift 60s linear infinite;pointer-events:none}
@keyframes dotdrift{to{transform:translate(34px,34px)}}
#intro .glow{position:absolute;top:-20%;right:-12%;width:60vmin;height:60vmin;background:radial-gradient(circle,rgba(227,0,27,.16),transparent 65%);pointer-events:none}
#intro .inner{position:relative;z-index:1;max-width:720px}

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

/* the one CTA */
.cta{margin-top:38px;opacity:0}
body.ready .cta{animation:fadeUp .7s 1.45s forwards}
.startbtn{font-family:var(--body);font-weight:600;font-size:16px;background:var(--red);color:#fff;padding:17px 30px;display:inline-flex;align-items:center;gap:12px;transition:transform .18s,box-shadow .18s}
.startbtn .ar{display:inline-block;transition:transform .18s}
.startbtn:hover{transform:translateY(-2px);box-shadow:5px 5px 0 #fff}
.startbtn:hover .ar{transform:translateX(6px)}

.talk{margin-top:34px;opacity:0}
body.ready .talk{animation:fadeUp .7s 1.6s forwards}
.talk .t{font-family:var(--mono);font-size:10px;letter-spacing:.22em;color:#77777b;margin-bottom:12px}
.talk .chips{display:flex;gap:10px;flex-wrap:wrap}
.tchip{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-decoration:none;color:#fff;border:1px solid #2c2c2e;background:transparent;padding:11px 16px;display:inline-flex;align-items:center;gap:8px;transition:border-color .2s,background .2s,transform .2s}
.tchip:hover{border-color:var(--red);background:var(--red);transform:translateY(-2px)}
.tchip i{width:7px;height:7px;border-radius:50%;background:var(--red)}
.tchip:hover i{background:#fff}

/* —— WIZARD —— */
#wiz{position:fixed;inset:0;z-index:60;display:none;flex-direction:column;color:var(--black)}
body.wizopen #wiz{display:flex}

.wtop{flex:none;padding:clamp(64px,9vh,86px) var(--pad) 0}
.wrail{display:flex;gap:6px;max-width:940px;margin:0 auto 14px}
.wrail i{flex:1;height:2px;background:var(--line);transition:background .35s}
.wrail i.done{background:rgba(11,11,12,.35)}
.wrail i.now{background:var(--red)}
.wmeta{max-width:940px;margin:0 auto;display:flex;justify-content:space-between;align-items:baseline;gap:16px;font-family:var(--mono);font-size:10px;letter-spacing:.2em;color:var(--grey)}
.wback{font-family:var(--mono);font-size:10px;letter-spacing:.18em;color:var(--grey);border-bottom:1px solid var(--line);padding-bottom:2px;transition:color .2s,border-color .2s}
.wback:hover{color:var(--red);border-color:var(--red)}
.wback[hidden]{display:none}
/* Carried in from a /pricing tier card. A red rule rather than a filled box,
   so it states the context without becoming a second heading. */
.wctx{max-width:940px;margin:12px auto 0;font-family:var(--mono);font-size:11px;letter-spacing:.08em;line-height:1.6;color:#4a4a4e;border-left:2px solid var(--red);padding:2px 0 2px 12px}
.wctx[hidden]{display:none}

.wbody{flex:1;overflow-y:auto;padding:clamp(26px,4vh,44px) var(--pad) clamp(90px,12vh,120px)}
.wstep{max-width:940px;margin:0 auto}
.wstep[hidden]{display:none}
.wstep .q{font-family:var(--display);font-weight:900;font-stretch:110%;font-size:clamp(28px,4vw,50px);line-height:1.08;letter-spacing:-.015em;margin-bottom:10px}
.wstep .q:focus{outline:none}
.wstep .hint{font-weight:300;font-size:15px;line-height:1.6;color:#5a5a5e;max-width:52ch;margin-bottom:26px}
body.wizopen .wstep:not([hidden]){animation:stepSlide .42s cubic-bezier(.16,1,.3,1)}
@keyframes stepSlide{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
body.wizopen.goback .wstep:not([hidden]){animation-name:stepSlideBack}
@keyframes stepSlideBack{from{opacity:0;transform:translateY(-18px)}to{opacity:1;transform:none}}

/* fields */
.fgroup{display:flex;flex-direction:column;gap:7px;margin-bottom:16px}
.fgroup label{font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;color:#5a5a5e}
.fgroup label b{color:var(--red);font-weight:500}
.fin{background:var(--white);border:1px solid var(--line);padding:15px 16px;font-size:16px;outline:none;transition:border-color .2s,box-shadow .2s;border-radius:0;width:100%;max-width:520px}
.fin::placeholder{color:#b6b6b3}
.fin:focus{border-color:var(--red);box-shadow:4px 4px 0 rgba(227,0,27,.12)}
.fin.err{border-color:var(--red);animation:shake .4s}
@keyframes shake{0%,100%{transform:none}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
textarea.fin{resize:vertical;min-height:150px;line-height:1.6;max-width:720px}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:14px;max-width:720px}

/* chips */
.fl{font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;color:#5a5a5e;margin-bottom:10px}
.chipset{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.chipset.err{animation:shake .4s}
.chipset.err .chip{border-color:var(--red)}
.chip{font-family:var(--mono);font-size:11px;letter-spacing:.08em;border:1px solid var(--line);background:var(--white);padding:11px 15px;transition:background .18s,border-color .18s,color .18s,transform .18s,box-shadow .18s;user-select:none}
.chip:hover{border-color:var(--red);transform:translateY(-2px);box-shadow:3px 3px 0 rgba(227,0,27,.14)}
.chip[aria-pressed="true"]{background:var(--red);border-color:var(--red);color:#fff;animation:pop .3s cubic-bezier(.34,1.56,.64,1)}
@keyframes pop{0%{transform:scale(.9)}100%{transform:scale(1)}}
#otherwrap[hidden]{display:none}

/* cards — the 1px-gap-on-a-line-coloured-bed device the rest of the site uses */
.cards{display:grid;gap:1px;background:var(--line);border:1px solid var(--line);margin-bottom:8px}
@media (min-width:760px){.cards.svc{grid-template-columns:1fr 1fr}.cards.plans{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}}
.card{background:var(--white);padding:clamp(20px,2.4vw,28px);display:flex;flex-direction:column;gap:10px;position:relative;transition:background .2s}
.card:hover{background:#fffdfd}
.card[data-on="1"]{background:#fff5f6}
.card[data-on="1"]::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--red)}
.card .cn{font-family:var(--display);font-weight:800;font-stretch:106%;font-size:clamp(17px,1.7vw,21px);letter-spacing:-.01em}
.card .cl{font-weight:300;font-size:14px;line-height:1.55;color:#4a4a4d;flex:1}
.card .cnote{font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;color:var(--grey)}
.card .cfig{font-family:var(--display);font-weight:900;font-stretch:110%;font-size:clamp(24px,2.6vw,34px);letter-spacing:-.02em;line-height:1}
.card .cfig span{font-family:var(--body);font-weight:400;font-size:13px;letter-spacing:0;color:var(--grey);margin-left:6px}
.card .cbill{font-family:var(--mono);font-size:9.5px;letter-spacing:.1em;color:var(--grey);min-height:12px}
.card .feat{font-family:var(--mono);font-size:9.5px;letter-spacing:.1em;color:var(--red)}
.cacts{display:flex;align-items:center;gap:14px;margin-top:4px;flex-wrap:wrap}
.know{font-family:var(--mono);font-size:10px;letter-spacing:.16em;color:var(--grey);border-bottom:1px solid var(--line);padding-bottom:2px;transition:color .2s,border-color .2s}
.know:hover{color:var(--red);border-color:var(--red)}
.pick{font-family:var(--body);font-weight:600;font-size:14px;background:var(--black);color:#fff;padding:12px 20px;display:inline-flex;align-items:center;gap:9px;transition:background .2s,transform .18s}
.pick:hover{background:var(--red);transform:translateY(-2px)}
.cards.err{animation:shake .4s;outline:1px solid var(--red)}

/* footer actions */
.wact{display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin-top:26px}
.nextbtn{font-family:var(--body);font-weight:600;font-size:15px;background:var(--red);color:#fff;padding:15px 26px;display:inline-flex;align-items:center;gap:10px;transition:transform .18s,box-shadow .18s}
.nextbtn .ar{display:inline-block;transition:transform .18s}
.nextbtn:hover{transform:translateY(-2px);box-shadow:4px 4px 0 var(--black)}
.nextbtn:hover .ar{transform:translateX(6px)}
.nextbtn:disabled{opacity:.6;cursor:default;transform:none;box-shadow:none}
.wstatus{font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:var(--grey)}
.wstatus.bad{color:var(--red)}
.wnote{margin-top:14px;font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;color:var(--grey)}

/* review */
.rev{border-top:1px solid var(--line);max-width:720px}
.revrow{display:grid;grid-template-columns:160px 1fr auto;gap:16px;align-items:baseline;padding:15px 0;border-bottom:1px solid var(--line)}
.revrow dt{font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;color:var(--grey)}
.revrow dd{font-size:15px;line-height:1.55;white-space:pre-wrap;overflow-wrap:anywhere}
.revrow .edit{font-family:var(--mono);font-size:9.5px;letter-spacing:.16em;color:var(--grey);border-bottom:1px solid var(--line);padding-bottom:2px;transition:color .2s,border-color .2s;justify-self:end}
.revrow .edit:hover{color:var(--red);border-color:var(--red)}
@media (max-width:640px){.revrow{grid-template-columns:1fr auto}.revrow dt{grid-column:1/-1}}

/* know-more modal */
#sheet{position:fixed;inset:0;z-index:140;display:none}
#sheet.on{display:block}
#sheet .scrim{position:absolute;inset:0;background:rgba(11,11,12,.55);opacity:0;transition:opacity .3s}
#sheet.on .scrim{opacity:1}
#sheet .panel{position:absolute;left:50%;top:50%;transform:translate(-50%,-46%);width:min(560px,calc(100% - 32px));max-height:82vh;overflow-y:auto;background:var(--white);border:1px solid var(--line);box-shadow:14px 14px 0 rgba(11,11,12,.12);padding:clamp(24px,3vw,34px);opacity:0;transition:opacity .3s,transform .3s cubic-bezier(.16,1,.3,1)}
#sheet.on .panel{opacity:1;transform:translate(-50%,-50%)}
#sheet h3{font-family:var(--display);font-weight:900;font-stretch:110%;font-size:clamp(22px,2.4vw,30px);letter-spacing:-.015em;margin-bottom:8px;padding-right:40px}
#sheet .slead{font-weight:300;font-size:15px;line-height:1.6;color:#4a4a4d;margin-bottom:20px}
#sheet .sfig{font-family:var(--display);font-weight:900;font-stretch:110%;font-size:clamp(28px,3vw,40px);letter-spacing:-.02em;line-height:1}
#sheet .sfig span{font-family:var(--body);font-weight:400;font-size:14px;letter-spacing:0;color:var(--grey);margin-left:7px}
#sheet .sbill{font-family:var(--mono);font-size:10px;letter-spacing:.1em;color:var(--grey);margin-top:6px}
#sheet .sgroup{margin-top:22px;border-top:1px solid var(--line);padding-top:18px}
#sheet .sgt{font-family:var(--mono);font-size:9.5px;letter-spacing:.2em;color:var(--grey);margin-bottom:11px}
#sheet ul{list-style:none;display:flex;flex-direction:column;gap:8px}
#sheet li{font-size:14.5px;line-height:1.5;display:flex;gap:10px;align-items:baseline}
#sheet li::before{content:"";flex:none;width:5px;height:5px;background:var(--red);transform:translateY(-2px)}
#sheet li b{font-weight:500;color:var(--grey);font-size:12px;font-family:var(--mono);letter-spacing:.06em}
#sheet .sclose{position:absolute;top:16px;right:16px;font-family:var(--mono);font-size:16px;line-height:1;color:var(--grey);padding:8px;transition:color .2s}
#sheet .sclose:hover{color:var(--red)}
#sheet .sact{margin-top:24px}
@media (max-width:640px){
  #sheet .panel{left:0;top:auto;bottom:0;transform:translateY(20px);width:100%;max-height:88vh;box-shadow:none;border-left:none;border-right:none;border-bottom:none}
  #sheet.on .panel{transform:none}
}

/* success */
#done{position:fixed;inset:0;z-index:150;background:var(--paper);display:none;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:40px var(--pad)}
#done.on{display:flex}
#done svg{width:84px;height:84px;margin-bottom:24px}
#done circle{fill:none;stroke:var(--red);stroke-width:2.5;stroke-dasharray:264;stroke-dashoffset:264}
#done.on circle{animation:draw 1s .2s forwards cubic-bezier(.7,0,.3,1)}
#done path{fill:none;stroke:var(--red);stroke-width:3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:48;stroke-dashoffset:48}
#done.on path{animation:draw .5s .9s forwards}
@keyframes draw{to{stroke-dashoffset:0}}
#done h2{font-family:var(--display);font-weight:900;font-stretch:110%;font-size:clamp(28px,3.4vw,46px);letter-spacing:-.015em;margin-bottom:14px}
#done p{font-weight:300;font-size:16px;color:#4a4a4d;max-width:44ch;line-height:1.65;margin-bottom:28px}
#done .dacts{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
#done a{font-family:var(--mono);font-size:11px;letter-spacing:.14em;text-decoration:none;padding:13px 20px;border:1px solid var(--line);background:var(--white);transition:background .2s,border-color .2s,color .2s,transform .18s}
#done a:hover{border-color:var(--red);transform:translateY(-2px)}
#done a.primary{background:var(--red);border-color:var(--red);color:#fff}

footer{position:relative;z-index:3;border-top:1px solid #1d1d1f;padding:16px var(--pad);display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;font-family:var(--mono);font-size:10px;color:var(--grey);letter-spacing:.12em}
body.wizopen footer{display:none}

@media (max-width:900px){
  #intro{padding:100px var(--pad) 70px}
  h1{font-size:clamp(34px,9.6vw,52px)}
  .frow{grid-template-columns:1fr}
  nav{background:rgba(11,11,12,.85);backdrop-filter:blur(8px);border-bottom:1px solid #1d1d1f;padding:12px var(--pad)}
  body.wizopen nav{background:rgba(250,250,248,.9);border-bottom:1px solid var(--line)}
  body.wizopen nav button.back{background:var(--black)}
  nav .logo{padding:5px 10px}
  nav .logo img{height:16px}
  .wtop{padding-top:74px}
}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01s!important;transition-duration:.01s!important;animation-delay:0s!important;transition-delay:0s!important}
  h1 .w,.sub,.rule,.step,.talk,.cta{opacity:1!important;transform:none!important;filter:none!important}
  #cdot,#cring{display:none}
  body.wizopen #intro{display:none}
}
`;

/* ------------------------------------------------------------------ parts -- */

const chipset = (id: string, items: string[], single: boolean) =>
  `<div class="chipset" id="${id}"${single ? " data-single" : ""} role="group">` +
  items
    .map(
      (t) =>
        `<button type="button" class="chip" data-h data-v="${esc(t)}" aria-pressed="false">${esc(
          t.toUpperCase(),
        )}</button>`,
    )
    .join("") +
  `</div>`;

const rail = () =>
  `<div class="wrail" id="wrail" role="progressbar" aria-valuemin="1" aria-valuemax="${TOTAL_STEPS}" aria-valuenow="1" aria-label="Brief progress">` +
  Array.from({ length: TOTAL_STEPS }, () => "<i></i>").join("") +
  `</div>`;

/** The figure block, from the server-formatted cell for the default cycle. */
function figure(plan: PricingPlanView, ccy: string) {
  const cell = plan.cells[ccy]?.monthly;
  if (!cell) return "";
  return (
    `<div class="cfig" data-fig>${esc(cell.fig)}<span data-per>${esc(cell.per)}</span></div>` +
    `<div class="cbill" data-bill>${esc(cell.billTotal)}</div>`
  );
}

function planCard(family: string, plan: PricingPlanView, ccy: string) {
  const feat = plan.featured ? `<div class="feat">◆ MOST CHOSEN</div>` : "";
  return `
    <div class="card" data-plan="${esc(plan.slug)}" data-family="${esc(family)}">
      ${feat}
      <div class="cn">${esc(plan.name)}</div>
      ${figure(plan, ccy)}
      <div class="cl">${esc(plan.blurb)}</div>
      <div class="cacts">
        <button type="button" class="pick" data-h data-pick="${esc(plan.slug)}">Choose ${esc(plan.name)}</button>
        <button type="button" class="know" data-h data-know="${esc(family)}:${esc(plan.slug)}">Know more</button>
      </div>
    </div>`;
}

/* ------------------------------------------------------------------- html -- */

export function startHtml(view: PricingView): string {
  const ccy = view.active;

  const serviceCards = view.families
    .map((f) => {
      const copy = SERVICE_COPY[f.id];
      const from = f.plans[0]?.cells[ccy]?.monthly;
      const fromLine = from
        ? `<div class="cnote">FROM ${esc(from.fig)}${esc(from.per === "one-time" ? " ONE-TIME" : " / MONTH")}</div>`
        : "";
      return `
      <div class="card" data-service="${esc(f.id)}">
        <div class="cn">${esc(FAMILY_LABELS[f.id])}</div>
        ${fromLine}
        <div class="cl">${esc(copy.lead)}</div>
        <div class="cnote">${esc(copy.note)}</div>
        <div class="cacts">
          <button type="button" class="pick" data-h data-svc="${esc(f.id)}">Select</button>
          <button type="button" class="know" data-h data-know="${esc(f.id)}:">Know more</button>
        </div>
      </div>`;
    })
    .join("");

  const planGroups = view.families
    .map(
      (f) => `
      <div class="cards plans" data-plans="${esc(f.id)}" hidden>
        ${f.plans.map((p) => planCard(f.id, p, ccy)).join("")}
      </div>`,
    )
    .join("");

  const cycleChips = chipset(
    "wcycle",
    BILLING_CYCLES.map((c) => c.label),
    true,
  );

  /* Every cycle's figures for every plan, so switching a cycle is a lookup
     rather than arithmetic — a client-side rounding difference could otherwise
     show a number the server would never have rendered. */
  const payload = {
    active: ccy,
    cycleIds: BILLING_CYCLES.map((c) => c.id),
    cycleLabels: Object.fromEntries(BILLING_CYCLES.map((c) => [c.id, c.label])),
    families: Object.fromEntries(
      view.families.map((f) => [
        f.id,
        {
          label: FAMILY_LABELS[f.id],
          cycles: f.cycles,
          lead: SERVICE_COPY[f.id].lead,
          plans: f.plans.map((p) => ({
            slug: p.slug,
            name: p.name,
            blurb: p.blurb,
            oneTime: p.oneTime,
            inheritsFrom: p.inheritsFrom ?? "",
            includes: p.includes,
            cells: p.cells[ccy] ?? {},
          })),
        },
      ]),
    ),
  };

  return String.raw`

<div id="bgfade"></div>
<div id="cdot"></div><div id="cring"></div>

<nav>
  <!-- Real alt text, so a crawler counting missing alts is satisfied, while
       the anchor's aria-label is what a screen reader announces — nothing is
       said twice. -->
  <a class="logo" href="/" data-h aria-label="ADMIRATE home"><img src="${LOGO}" alt="ADMIRATE" width="213" height="46" decoding="async"></a>
  <a class="back" href="/" data-h>← BACK TO SITE</a>
</nav>

<main>
  <section id="intro">
    <div class="dots"></div>
    <div class="glow"></div>
    <div class="inner">
      <div class="eb">// START A PROJECT</div>
      <h1>
        <span class="w" style="--d:.15s">Tell</span>
        <span class="w" style="--d:.28s">us</span>
        <span class="w" style="--d:.42s">everything<span class="dot">.</span></span>
      </h1>
      <p class="sub">Seven short questions — about <b>two minutes</b>. You'll pick a service and a plan as you go, and we'll have read all of it before we call.</p>
      <div class="rule"></div>

      <div class="steps">
        <div class="step"><b>01</b> YOU BUILD THE BRIEF</div>
        <div class="step"><b>02</b> WE CALL WITHIN ONE WORKING DAY</div>
        <div class="step"><b>03</b> PLAN + QUOTE IN YOUR INBOX</div>
      </div>

      <div class="cta">
        <button type="button" class="startbtn" id="startbtn" data-h>Start Your Project <span class="ar">→</span></button>
      </div>

      <div class="talk">
        <div class="t">PREFER TALKING FIRST?</div>
        <div class="chips">
          <a class="tchip" href="https://wa.me/918374494954" target="_blank" rel="noopener noreferrer" data-h><i></i>WHATSAPP US</a>
          <a class="tchip" href="mailto:essentials@admirate.in" data-h><i></i>ESSENTIALS@ADMIRATE.IN</a>
        </div>
      </div>
    </div>
  </section>
</main>

<!-- ——————————————————————————— the wizard ——————————————————————————— -->
<div id="wiz" aria-label="Project brief">
  <div class="wtop">
    ${rail()}
    <div class="wmeta">
      <span id="wcount">STEP 01 / ${TOTAL_STEPS}</span>
      <button type="button" class="wback" id="wback" data-h hidden>← BACK</button>
    </div>
    <p class="wctx" id="wctx" hidden></p>
  </div>

  <div class="wbody">

    <section class="wstep" data-step="1" aria-labelledby="q1">
      <h2 class="q" id="q1" tabindex="-1">What's your brand called?</h2>
      <p class="hint">However it's written on the sign, the invoice or the app store.</p>
      <div class="fgroup">
        <label for="f-brand">BRAND / COMPANY <b>*</b></label>
        <input class="fin" id="f-brand" name="brand" type="text" autocomplete="organization" maxlength="120">
      </div>
      <div class="wact">
        <button type="button" class="nextbtn" data-next data-h>Next <span class="ar">→</span></button>
        <div class="wstatus" data-status></div>
      </div>
    </section>

    <section class="wstep" data-step="2" aria-labelledby="q2" hidden>
      <h2 class="q" id="q2" tabindex="-1">What industry are you in?</h2>
      <p class="hint">It changes how we write, what we shoot, and which channels are worth your money.</p>
      ${chipset("windustry", INDUSTRIES, true)}
      <div class="fgroup" id="otherwrap" hidden>
        <label for="f-other">WHICH INDUSTRY? <b>*</b></label>
        <input class="fin" id="f-other" type="text" maxlength="60">
      </div>
      <div class="wact">
        <button type="button" class="nextbtn" data-next data-h>Next <span class="ar">→</span></button>
        <div class="wstatus" data-status></div>
      </div>
    </section>

    <section class="wstep" data-step="3" aria-labelledby="q3" hidden>
      <h2 class="q" id="q3" tabindex="-1">What do you need from us?</h2>
      <p class="hint">Pick the closest fit. Nothing here is binding — you can say more in a moment.</p>
      <div class="cards svc" id="wsvc">
        ${serviceCards}
        <div class="card" data-service="other">
          <div class="cn">Something else</div>
          <div class="cl">Branding, logo design, packaging, video, print, campaigns, collaterals, booking systems, reels.</div>
          <div class="cnote">QUOTED PER PROJECT.</div>
          <div class="cacts">
            <button type="button" class="pick" data-h data-svc="other">Select</button>
          </div>
        </div>
      </div>
      <div class="wact"><div class="wstatus" data-status></div></div>
    </section>

    <section class="wstep" data-step="4" aria-labelledby="q4" hidden>
      <h2 class="q" id="q4" tabindex="-1">Choose your plan.</h2>
      <p class="hint" id="planhint">Every tier includes the one below it. Prices are what you'd actually be invoiced.</p>

      <div id="planpane">
        <div id="cyclewrap">
          <div class="fl">BILLING CYCLE</div>
          ${cycleChips}
        </div>
        ${planGroups}
      </div>

      <div id="scopepane" hidden>
        <div class="fl">WHAT DO YOU NEED? — TAP ALL THAT APPLY</div>
        ${chipset("wscope", SCOPE_CHIPS, false)}
        <div class="fl">BUDGET — MONTHLY, OR ONE-OFF FOR A BUILD</div>
        ${chipset("wbudget", BUDGETS, true)}
        <div class="wact">
          <button type="button" class="nextbtn" data-next data-h>Next <span class="ar">→</span></button>
        </div>
      </div>

      <div class="wact"><div class="wstatus" data-status></div></div>
    </section>

    <section class="wstep" data-step="5" aria-labelledby="q5" hidden>
      <h2 class="q" id="q5" tabindex="-1">Tell us a little more about your project.</h2>
      <p class="hint">Optional — but whatever you write here, we'll have studied before the call.</p>
      <div class="fgroup">
        <textarea class="fin" id="f-notes" rows="6" maxlength="2000" placeholder="Goals, expectations, timelines, competitors, references, or anything you'd like us to know."></textarea>
      </div>
      <div class="fl">TIMELINE — OPTIONAL</div>
      ${chipset("wtime", TIMELINES, true)}
      <div class="wact">
        <button type="button" class="nextbtn" data-next data-h>Next <span class="ar">→</span></button>
        <div class="wstatus" data-status></div>
      </div>
    </section>

    <section class="wstep" data-step="6" aria-labelledby="q6" hidden>
      <h2 class="q" id="q6" tabindex="-1">How do we reach you?</h2>
      <p class="hint">One call, within one working day. No mailing list, no drip sequence.</p>
      <div class="frow">
        <div class="fgroup">
          <label for="f-name">YOUR NAME <b>*</b></label>
          <input class="fin" id="f-name" type="text" autocomplete="name" maxlength="100">
        </div>
        <div class="fgroup">
          <label for="f-email">EMAIL <b>*</b></label>
          <input class="fin" id="f-email" type="email" autocomplete="email">
        </div>
      </div>
      <div class="fgroup">
        <label for="f-phone">PHONE / WHATSAPP</label>
        <input class="fin" id="f-phone" type="tel" autocomplete="tel" maxlength="20">
      </div>
      <div class="wact">
        <button type="button" class="nextbtn" data-next data-h>Review <span class="ar">→</span></button>
        <div class="wstatus" data-status></div>
      </div>
    </section>

    <section class="wstep" data-step="7" aria-labelledby="q7" hidden>
      <h2 class="q" id="q7" tabindex="-1">Does this look right?</h2>
      <p class="hint">Change anything you like — nothing has been sent yet.</p>
      <dl class="rev" id="wrev"></dl>
      <div class="wact">
        <button type="button" class="nextbtn" id="wsubmit" data-h>Submit Project <span class="ar">→</span></button>
        <div class="wstatus" data-status></div>
      </div>
      <div class="wnote">// WE REPLY WITHIN ONE WORKING DAY. NO SPAM, NO NEWSLETTERS.</div>
      <div class="talk" style="opacity:1;animation:none">
        <div class="t" style="color:var(--grey)">RATHER JUST TALK?</div>
        <div class="chips">
          <a class="tchip" style="color:var(--black);border-color:var(--line)" href="https://wa.me/918374494954" target="_blank" rel="noopener noreferrer" data-h><i></i>WHATSAPP US</a>
          <a class="tchip" style="color:var(--black);border-color:var(--line)" href="mailto:essentials@admirate.in" data-h><i></i>ESSENTIALS@ADMIRATE.IN</a>
        </div>
      </div>
    </section>

  </div>
</div>

<!-- know more -->
<div id="sheet" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
  <div class="scrim" data-close></div>
  <div class="panel">
    <button type="button" class="sclose" data-close data-h aria-label="Close">✕</button>
    <h3 id="sheetTitle"></h3>
    <p class="slead" id="sheetLead"></p>
    <div id="sheetBody"></div>
    <div class="sact" id="sheetAct"></div>
  </div>
</div>

<!-- success -->
<div id="done" role="status" aria-live="polite">
  <svg viewBox="0 0 90 90" aria-hidden="true"><circle cx="45" cy="45" r="42"/><path d="M28 46l12 12 22-26"/></svg>
  <h2>You're all set.</h2>
  <p>Your project request has been sent successfully. Our team will review it and get back to you shortly with the next steps.</p>
  <div class="dacts">
    <a class="primary" href="/services" data-h>SEE OUR WORK</a>
    <a href="/" data-h>BACK TO HOME</a>
  </div>
</div>

<footer>
  <div>© 2026 ADMIRATE.IN</div>
  <div>${NAP_HTML}</div><div>${LEGAL_HTML}</div>
  <div>MADE TO CONVERT</div>
</footer>

<script type="application/json" id="wizdata">${JSON.stringify(payload).replace(
    /</g,
    "\\u003c",
  )}</script>
`;
}
