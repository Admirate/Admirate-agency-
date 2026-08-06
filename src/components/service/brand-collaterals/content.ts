/**
 * BRAND COLLATERALS — a page about physical things, built with depth and light.
 *
 * Set-pieces unique to this page:
 *   RANGE  a two-column index of everything the brand hands over, ordered by
 *          what moves business first, each row wiping red under the cursor
 *   WALL   a rolling shelf of the pieces themselves, drawn in CSS rather than
 *          photographed — a brochure, a profile, a carton, a sign — so the
 *          page can show the range without waiting on a photo shoot
 *
 * Print partners, materials and lead times are stated nowhere: the repository
 * records none of them, and they are exactly the detail a client is held to.
 */

import { HERO_KEYWORD_CSS, heroKeyword } from "@/components/shared/hero-keyword";
import { JOURNAL_CSS, journalLinks } from "@/components/shared/journal-links";
import {
  SERVICE_PROSE_CSS,
  serviceProse,
} from "@/components/shared/service-prose";
import { NAP_HTML, LEGAL_HTML } from "@/lib/seo";
import { asset } from "@/lib/cdn";

const LOGO = asset("admirate logo.webp");

export const COLLAT_CSS = String.raw`
:root{
  --white:#FFFFFF;--paper:#FAFAF8;--warm:#FBF7F1;--black:#0B0B0C;--red:#E3001B;
  --grey:#8A8A8E;--line:#E9E9E6;--pad:clamp(24px,6vw,96px);
  --display:var(--font-display),'Archivo',sans-serif;--body:var(--font-body),'Inter',sans-serif;--mono:var(--font-mono),'IBM Plex Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:auto}
body{font-family:var(--body);background:var(--warm);color:var(--black);overflow-x:hidden;-webkit-font-smoothing:antialiased}
body.smopen{overflow:hidden}
::selection{background:var(--red);color:var(--white)}

#cbg{position:fixed;inset:0;z-index:-2;background:var(--warm);transition:background-color .7s cubic-bezier(.4,0,.2,1)}
#cline{position:fixed;top:0;left:0;height:2px;width:0;background:var(--red);z-index:200}
#crail{position:fixed;left:clamp(14px,2.4vw,34px);top:50%;transform:translateY(-50%);z-index:120;display:flex;flex-direction:column;gap:14px}
#crail button{padding:0;border:none;background:none;cursor:pointer;display:flex;align-items:center}
#crail i{display:block;width:18px;height:1px;background:rgba(11,11,12,.25);transition:width .35s cubic-bezier(.16,1,.3,1),background .35s}
#crail.ondark i{background:rgba(255,255,255,.3)}
#crail button.on i,#crail.ondark button.on i{width:38px;background:var(--red)}

.cs{position:relative;z-index:1;padding:clamp(96px,14vh,150px) var(--pad) clamp(70px,11vh,120px)}
.cs.dark{color:var(--white)}
.ch{font-family:var(--display);font-weight:800;font-stretch:106%;font-size:clamp(27px,4.6vw,60px);line-height:1.05;letter-spacing:-.026em;max-width:17ch}
.ch em{font-style:normal;color:var(--red)}
.cp{font-size:clamp(15px,1.4vw,18px);line-height:1.7;color:#4a4a4e;max-width:56ch;margin-top:18px}
.cs.dark .cp{color:#a4a4a8}
.up{opacity:0;transform:translateY(26px);transition:opacity .8s,transform .8s cubic-bezier(.16,1,.3,1)}
.cs.in .up{opacity:1;transform:none;transition-delay:var(--d,0s)}

/* ============ 1 — HERO ============ */
#chero{min-height:100svh;display:grid;grid-template-columns:1.1fr .9fr;gap:clamp(28px,5vw,76px);align-items:center}
#chero .crumb{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--grey);margin-bottom:clamp(20px,3.4vh,34px);display:flex;gap:10px;flex-wrap:wrap}
#chero .crumb a{color:var(--grey);text-decoration:none;transition:color .25s}
#chero .crumb a:hover{color:var(--red)}
#chero .crumb b{color:var(--black);font-weight:500}
#chero h1{font-family:var(--display);font-weight:900;font-stretch:114%;font-size:clamp(40px,7.8vw,110px);line-height:.9;letter-spacing:-.035em;text-transform:uppercase}
#chero h1 .wd{display:inline-block;white-space:nowrap}
#chero h1 .l{display:inline-block;overflow:hidden;vertical-align:bottom}
#chero h1 .l i{display:inline-block;font-style:normal;transform:translateY(102%);animation:cr .95s cubic-bezier(.16,1,.3,1) forwards;animation-delay:var(--d,0s)}
@keyframes cr{to{transform:none}}
#chero h1 u{text-decoration:none;color:var(--red)}
/* a card resting at an angle, catching light */
#chero .cardwrap{display:flex;justify-content:center;perspective:1100px}
#chero .bizcard{
  width:min(78%,300px);aspect-ratio:1.72;border-radius:5px;position:relative;
  background:linear-gradient(135deg,#141417,#0b0b0c);
  box-shadow:0 34px 62px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.07);
  transform:rotateX(46deg) rotateZ(-19deg);
  animation:hover 8s ease-in-out infinite;
  display:flex;align-items:center;justify-content:center;
}
@keyframes hover{0%,100%{transform:rotateX(46deg) rotateZ(-19deg) translateY(0)}50%{transform:rotateX(42deg) rotateZ(-16deg) translateY(-16px)}}
/* The real mark, not a letter standing in for it. The asset is a red glyph
   beside a near-black wordmark, so on a card this dark the wordmark would
   simply disappear — brightness(0) flattens every visible pixel to black and
   invert(1) lifts it to white, leaving the alpha alone. That is also how the
   mark would actually be printed here: one colour, white ink on black stock. */
#chero .bizcard .mk{display:block;width:min(58%,168px);height:auto;filter:brightness(0) invert(1);opacity:.94}
#chero .bizcard::after{
  content:"";position:absolute;inset:0;border-radius:5px;pointer-events:none;
  background:linear-gradient(118deg,transparent 38%,rgba(255,255,255,.16) 50%,transparent 62%);
}
#chero .shadow{width:min(60%,230px);height:16px;margin:26px auto 0;border-radius:50%;background:rgba(11,11,12,.16);filter:blur(11px)}

/* ============ 2 — THE RANGE ============ */
#range .rgrid{margin-top:clamp(30px,5vh,52px);display:grid;grid-template-columns:1fr 1fr;column-gap:clamp(24px,4vw,64px);border-top:1px solid var(--line)}
.drow{display:flex;align-items:baseline;gap:clamp(12px,1.8vw,22px);padding:clamp(14px,2vh,21px) clamp(6px,1vw,14px);border-bottom:1px solid var(--line);position:relative;overflow:hidden}
.drow::before{content:"";position:absolute;inset:0;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .45s cubic-bezier(.16,1,.3,1)}
.drow:hover::before{transform:scaleX(1)}
.drow>*{position:relative;z-index:1;transition:color .3s}
.drow .dn{font-family:var(--mono);font-size:10.5px;letter-spacing:.16em;color:var(--red);flex:0 0 auto}
.drow .dt{font-family:var(--display);font-weight:800;font-stretch:106%;text-transform:uppercase;font-size:clamp(17px,2vw,26px);letter-spacing:-.012em;transition:transform .45s cubic-bezier(.16,1,.3,1)}
.drow .dd{margin-left:auto;font-family:var(--mono);font-size:9.5px;letter-spacing:.14em;color:var(--grey);white-space:nowrap}
.drow:hover .dn,.drow:hover .dd{color:rgba(255,255,255,.85)}
.drow:hover .dt{color:#fff;transform:translateX(clamp(4px,.8vw,10px))}

/* ============ 3 — THE WALL (scrolling examples) ============ */
#cwall .mq{margin-top:clamp(30px,5vh,52px);overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent);mask-image:linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)}
#cwall .mqtrack{display:flex;width:max-content;animation:mqx 58s linear infinite}
#cwall .mq:hover .mqtrack{animation-play-state:paused}
.mqset{display:flex;gap:clamp(14px,2vw,24px);padding-right:clamp(14px,2vw,24px)}
@keyframes mqx{to{transform:translateX(-50%)}}
.ocase{flex:0 0 auto;width:clamp(172px,19vw,224px)}
.oart{aspect-ratio:1;background:#141417;border:1px solid rgba(255,255,255,.12);border-radius:8px;display:grid;place-items:center;transition:transform .45s cubic-bezier(.16,1,.3,1),border-color .35s}
.ocase:hover .oart{transform:translateY(-6px);border-color:rgba(227,0,27,.6)}
.olbl{margin-top:10px;text-align:center;font-family:var(--mono);font-size:9.5px;letter-spacing:.18em;color:#9a9a9e;transition:color .3s}
.ocase:hover .olbl{color:#fff}
.oart .amk{color:var(--red);font-family:var(--display);font-weight:900;font-stretch:114%}
/* the objects */
.ob-broch{width:58%;aspect-ratio:3/4;background:#FAFAF8;border-radius:2px;position:relative;box-shadow:0 10px 26px rgba(0,0,0,.4)}
.ob-broch::before{content:"";position:absolute;inset:0 auto 0 33.3%;width:1px;background:rgba(11,11,12,.14)}
.ob-broch::after{content:"";position:absolute;inset:0 auto 0 66.6%;width:1px;background:rgba(11,11,12,.14)}
.ob-broch i{position:absolute;top:0;left:0;right:0;height:26%;background:var(--red);border-radius:2px 2px 0 0}
.ob-prof{width:52%;aspect-ratio:3/4;background:#FAFAF8;border-radius:2px 4px 4px 2px;position:relative;box-shadow:0 10px 26px rgba(0,0,0,.4);display:grid;place-items:center}
.ob-prof::before{content:"";position:absolute;top:0;bottom:0;left:0;width:9%;background:var(--black);border-radius:2px 0 0 2px}
.ob-prof .amk{font-size:26px;color:var(--black)}
.ob-prof .amk u{text-decoration:none;color:var(--red)}
.ob-cat{width:56%;aspect-ratio:3/4;background:#FAFAF8;border-radius:2px;box-shadow:0 10px 26px rgba(0,0,0,.4);display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:7%;padding:12%}
.ob-cat i{background:#d9d9d5;border-radius:1px}
.ob-cat i:last-child{background:var(--red)}
.ob-post{width:46%;aspect-ratio:2/3;background:var(--black);border:1px solid rgba(255,255,255,.2);border-radius:2px;box-shadow:0 10px 26px rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center;overflow:hidden}
.ob-post .amk{font-size:64px;line-height:.72;color:#fff}
.ob-post .amk u{text-decoration:none;color:var(--red)}
.ob-fly{width:50%;aspect-ratio:3/4;background:#FAFAF8;border-radius:2px;position:relative;overflow:hidden;box-shadow:0 10px 26px rgba(0,0,0,.4)}
.ob-fly::before{content:"";position:absolute;top:-30%;right:-30%;width:70%;height:70%;background:var(--red);transform:rotate(45deg)}
.ob-fly i{position:absolute;left:12%;bottom:16%;right:34%;height:5%;background:rgba(11,11,12,.2);border-radius:2px;box-shadow:0 -12px 0 rgba(11,11,12,.2),0 -24px 0 rgba(11,11,12,.2)}
.ob-card{width:64%;aspect-ratio:17/10;background:#FAFAF8;border-radius:3px;box-shadow:0 10px 26px rgba(0,0,0,.4);display:flex;align-items:center;gap:10%;padding:0 10%}
.ob-card .amk{font-size:22px;color:var(--black)}
.ob-card .amk u{text-decoration:none;color:var(--red)}
.ob-card i{flex:1;height:4px;background:rgba(11,11,12,.18);border-radius:2px;box-shadow:0 9px 0 rgba(11,11,12,.18)}
.ob-pack{width:50%;aspect-ratio:1;background:#FAFAF8;border-radius:2px;position:relative;box-shadow:0 10px 26px rgba(0,0,0,.4);display:grid;place-items:center}
.ob-pack::before{content:"";position:absolute;top:0;left:0;right:0;height:16%;background:#eceae6;border-bottom:1px solid rgba(11,11,12,.12);border-radius:2px 2px 0 0}
.ob-pack .amk{font-size:30px;color:var(--black)}
.ob-pack .amk u{text-decoration:none;color:var(--red)}
.ob-sign{width:70%;aspect-ratio:16/6;background:#0a0a0c;border:1px solid rgba(255,255,255,.28);border-radius:6px;display:grid;place-items:center;box-shadow:0 0 34px rgba(227,0,27,.28)}
.ob-sign span{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:15px;letter-spacing:.06em;color:#fff}
.ob-sign span u{text-decoration:none;color:var(--red)}
.ob-event{width:72%;aspect-ratio:16/9;background:#FAFAF8;border-radius:2px;box-shadow:0 10px 26px rgba(0,0,0,.4);display:grid;place-items:center;position:relative;overflow:hidden}
.ob-event .rep{font-family:var(--display);font-weight:900;font-size:11px;letter-spacing:6px;line-height:2.4;color:rgba(11,11,12,.35);text-align:center;white-space:nowrap}
.ob-event .rep u{text-decoration:none;color:var(--red)}
.ob-deck{width:72%;aspect-ratio:16/9;background:#FAFAF8;border-radius:3px;box-shadow:0 10px 26px rgba(0,0,0,.4);position:relative;padding:9%}
.ob-deck b{display:block;width:62%;height:12%;background:var(--black);border-radius:2px}
.ob-deck i{display:block;width:78%;height:6%;background:rgba(11,11,12,.18);border-radius:2px;margin-top:9%}
.ob-deck i+i{width:58%}
.ob-deck s{position:absolute;right:9%;bottom:10%;width:12%;aspect-ratio:1;background:var(--red);border-radius:2px}
.ob-stat{width:52%;aspect-ratio:3/4;background:#FAFAF8;border-radius:2px;box-shadow:0 10px 26px rgba(0,0,0,.4);position:relative;padding:10%}
.ob-stat .amk{font-size:17px;color:var(--black)}
.ob-stat .amk u{text-decoration:none;color:var(--red)}
.ob-stat i{display:block;height:4.5%;background:rgba(11,11,12,.16);border-radius:2px;margin-top:8%}
.ob-stat i:nth-child(3){width:82%}
.ob-stat i:nth-child(4){width:64%}
.ob-stat i:nth-child(5){width:74%}
.ob-mix{position:relative;width:58%;aspect-ratio:1}
.ob-mix i{position:absolute;background:#FAFAF8;border-radius:2px;box-shadow:0 10px 26px rgba(0,0,0,.4)}
.ob-mix i:nth-child(1){inset:16% 26% 22% 0;transform:rotate(-7deg);background:#eceae6}
.ob-mix i:nth-child(2){inset:8% 12% 14% 12%;transform:rotate(3deg)}
.ob-mix i:nth-child(3){inset:0 0 6% 26%;transform:rotate(9deg);display:grid;place-items:center}
.ob-mix .amk{font-size:24px;color:var(--black)}
.ob-mix .amk u{text-decoration:none;color:var(--red)}

/* ============ 4 — HELD IN HAND ============ */
#cproof .plist{margin-top:clamp(30px,5vh,52px);border-top:1px solid var(--line)}
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

/* ============ 5 — CLOSE ============ */
#cclose .nlist{margin-top:clamp(26px,4vh,46px);border-top:1px solid rgba(255,255,255,.14)}
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
#cclose .cta{margin-top:clamp(40px,7vh,78px)}
#cclose .cta h2{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(34px,6.4vw,92px);line-height:.96;letter-spacing:-.03em;text-transform:uppercase;color:#fff}
#cclose .cta h2 em{font-style:normal;color:var(--red)}
#cclose .csub{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--grey);margin-top:16px}
#cclose .btns{display:flex;gap:13px;flex-wrap:wrap;margin-top:clamp(24px,4vh,40px)}
.cbtn{display:inline-flex;align-items:center;gap:10px;min-height:48px;padding:0 clamp(20px,2.4vw,32px);border-radius:999px;font-family:var(--body);font-weight:600;font-size:14.5px;text-decoration:none;transition:transform .25s,background .25s,border-color .25s}
.cbtn .ar{transition:transform .25s}
.cbtn:hover .ar{transform:translateX(4px)}
.cbtn.red{background:var(--red);color:#fff}
.cbtn.red:hover{background:#c40017;transform:translateY(-2px)}
.cbtn.gh{border:1px solid rgba(255,255,255,.26);color:#fff}
.cbtn.gh:hover{border-color:#fff;background:rgba(255,255,255,.06);transform:translateY(-2px)}
#cclose footer{margin-top:clamp(42px,7vh,80px);padding-top:20px;border-top:1px solid rgba(255,255,255,.14);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;color:#66666a}

a:focus-visible,button:focus-visible{outline:2px solid var(--red);outline-offset:3px;border-radius:4px}

@media (max-width:768px){
  #crail{display:none}
  #chero{grid-template-columns:1fr;gap:40px;min-height:auto;padding-top:clamp(96px,15vh,130px)}
  #chero .cardwrap{order:-1}
  #range .rgrid{grid-template-columns:1fr}
  .prow{grid-template-columns:auto minmax(0,1fr);row-gap:7px}
  .prow .pt{grid-column:2;justify-self:start}
}
@media (max-width:480px){ #chero h1{font-size:clamp(34px,11.5vw,52px)} }
@media (max-height:600px){
  #chero{min-height:auto}
}
@media (prefers-reduced-motion:reduce){
  *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
  .up{opacity:1;transform:none}
  #chero h1 .l i{transform:none;animation:none}
  #chero .bizcard{animation:none}
  #cwall .mqtrack{animation:none}
  #cwall .mq{overflow-x:auto;-webkit-mask-image:none;mask-image:none}
}
${JOURNAL_CSS}
${HERO_KEYWORD_CSS}
${SERVICE_PROSE_CSS}
`;

/* Everything the brand hands over, in order of what moves business first. */
const RANGE = [
  { t: "Brochures", d: "THE PITCH, IN PRINT" },
  { t: "Company Profiles", d: "WHO YOU ARE, BOUND" },
  { t: "Catalogues", d: "THE FULL RANGE, ORGANISED" },
  { t: "Posters", d: "ONE MESSAGE, LARGE" },
  { t: "Flyers", d: "IN HAND, IN SECONDS" },
  { t: "Visiting Cards", d: "THE BRAND, POCKET-SIZED" },
  { t: "Packaging", d: "THE SHELF MOMENT" },
  { t: "Signage", d: "READ AT A GLANCE" },
  { t: "Event Branding", d: "THE VENUE, TAKEN OVER" },
  { t: "Presentation Decks", d: "THE ROOM, WON" },
  { t: "Stationery", d: "EVERY LETTER ON-BRAND" },
  { t: "Marketing Material", d: "EVERYTHING IN BETWEEN" },
];

/* The pieces themselves, drawn in CSS. `art` is the object; `lbl` names it. */
const WALL = [
  { art: `<div class="ob-broch"><i></i></div>`, lbl: "BROCHURES" },
  { art: `<div class="ob-prof"><span class="amk">A<u>.</u></span></div>`, lbl: "COMPANY PROFILES" },
  { art: `<div class="ob-cat"><i></i><i></i><i></i><i></i></div>`, lbl: "CATALOGUES" },
  { art: `<div class="ob-post"><span class="amk">A<u>.</u></span></div>`, lbl: "POSTERS" },
  { art: `<div class="ob-fly"><i></i></div>`, lbl: "FLYERS" },
  { art: `<div class="ob-card"><span class="amk">A<u>.</u></span><i></i></div>`, lbl: "VISITING CARDS" },
  { art: `<div class="ob-pack"><span class="amk">A<u>.</u></span></div>`, lbl: "PACKAGING" },
  { art: `<div class="ob-sign"><span>ADMIRATE<u>.</u></span></div>`, lbl: "SIGNAGE" },
  {
    art: `<div class="ob-event"><span class="rep">A<u>.</u> A<u>.</u> A<u>.</u> A<u>.</u><br>A<u>.</u> A<u>.</u> A<u>.</u> A<u>.</u><br>A<u>.</u> A<u>.</u> A<u>.</u> A<u>.</u></span></div>`,
    lbl: "EVENT BRANDING",
  },
  { art: `<div class="ob-deck"><b></b><i></i><i></i><s></s></div>`, lbl: "PRESENTATION DECKS" },
  { art: `<div class="ob-stat"><span class="amk">A<u>.</u></span><i></i><i></i><i></i></div>`, lbl: "STATIONERY" },
  { art: `<div class="ob-mix"><i></i><i></i><i><span class="amk">A<u>.</u></span></i></div>`, lbl: "MARKETING MATERIAL" },
];

const PROOF = [
  { n: "South Glass", t: "IDENTITY · PRINT", d: "A technical product whose collateral had to feel as premium as the claim." },
  { n: "Hope Trust India", t: "BRAND · PRINT", d: "Printed material that had to feel reassuring in the hand, not clinical." },
  { n: "Patil Group", t: "CORPORATE · COLLATERAL", d: "Corporate documents carrying fifty years of scale, quietly." },
];

const NEXT = [
  { slug: "identity", label: "Identity" },
  { slug: "design", label: "Design" },
  { slug: "social-media", label: "Social Media" },
  { slug: "digital", label: "Digital" },
  { slug: "video-production", label: "Video Production" },
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
   duplicate content, hence aria-hidden on the copy. */
const wallSet = (hidden: boolean) => `
      <div class="mqset"${hidden ? ' aria-hidden="true"' : ""}>
      ${WALL.map(
        (w) =>
          `<div class="ocase"><div class="oart">${w.art}</div><div class="olbl">${w.lbl}</div></div>`,
      ).join("\n      ")}
      </div>`;

export const COLLAT_HTML = String.raw`
<div id="cbg"></div>
<div id="cline"></div>
<div id="crail" role="navigation" aria-label="Section"></div>

<!-- 1 — HERO -->
<section class="cs" id="chero" data-bg="#FBF7F1" data-label="Collaterals">
  <div>
    <div class="crumb"><a href="/">Home</a><span>/</span><a href="/services">Services</a><span>/</span><b>Brand Collaterals</b></div>
    <h1>${heroLine("THE PHYSICAL", 0.15)}<br>${heroLine("PROOF", 0.48, true)}${heroKeyword("Brand Collaterals in Hyderabad")}</h1>
    <p class="cp">Brochures, cards, packaging, signage — everything your brand hands over, carrying the same face it shows everywhere else.</p>
  </div>
  <div>
    <div class="cardwrap"><div class="bizcard"><img class="mk" src="${LOGO}" alt="ADMIRATE" width="213" height="46" decoding="async"></div></div>
    <div class="shadow" aria-hidden="true"></div>
  </div>
</section>

<!-- 2 — THE RANGE -->
<section class="cs" id="range" data-bg="#FAFAF8" data-label="The range">
  <h2 class="ch up">Everything your brand <em>hands over</em>.</h2>
  <p class="cp up" style="--d:.08s">In order of what moves business first.</p>
  <div class="rgrid">
    ${RANGE.map(
      (r, i) =>
        `<div class="drow up" style="--d:${(0.12 + i * 0.03).toFixed(2)}s"><span class="dn">${String(
          i + 1,
        ).padStart(2, "0")}</span><span class="dt">${r.t}</span><span class="dd">${r.d}</span></div>`,
    ).join("\n    ")}
  </div>
</section>

<!-- 3 — THE WALL -->
<section class="cs dark" id="cwall" data-bg="#0B0B0C" data-label="The wall">
  <h2 class="ch up" style="color:#fff">Made to be <em>held</em>.</h2>
  <p class="cp up" style="--d:.1s;color:#a4a4a8">A rolling shelf of the pieces we produce, end to end.</p>
  <div class="mq up" style="--d:.18s">
    <div class="mqtrack">${wallSet(false)}${wallSet(true)}
    </div>
  </div>
</section>

<!-- 4 — HELD IN HAND -->
<section class="cs" id="cproof" data-bg="#FFFFFF" data-label="In hand">
  <h2 class="ch up">Brands that hold up in the <em>hand</em>.</h2>
  <div class="plist">
    ${PROOF.map(
      (p, i) => `<div class="prow up" style="--d:${(0.16 + i * 0.05).toFixed(2)}s">
      <span class="pn">${String(i + 1).padStart(2, "0")}</span>
      <span><span class="pnm">${p.n}</span><br><span class="pd">${p.d}</span></span>
      <span class="pt">${p.t}</span>
    </div>`,
    ).join("\n    ")}
  </div>
</section>

${serviceProse("brand-collaterals", { bg: "#FAFAF8", label: "Collaterals in full" })}

<!-- 6 — CLOSE -->
<section class="cs dark" id="cclose" data-bg="#0B0B0C" data-label="Close">
  <h2 class="ch up" style="--d:.08s">The rest of what we do.</h2>
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
    <h2 class="up">Let's put it<br>in their <em>hands</em>.</h2>
    <p class="csub up" style="--d:.12s">// TELL US THE GOAL. WE REPLY WITHIN ONE WORKING DAY.</p>
    <div class="btns up" style="--d:.22s">
      <a class="cbtn gh" href="/services" data-h>All services <span class="ar">→</span></a>
      <a class="cbtn red" href="/start-project?service=Brand%20Collaterals" data-h>Start your project <span class="ar">→</span></a>
    </div>
  </div>
  ${journalLinks("packaging-gets-three-seconds", "consistency-is-the-strategy")}

  <footer><div>© 2026 ADMIRATE.IN</div><div>${NAP_HTML}</div><div>${LEGAL_HTML}</div><div>MADE TO CONVERT</div></footer>
</section>
`;
