import { creative, optimized } from "@/lib/cdn";
import {
  CREATIVES,
  TRENDS_SLIDES,
  type Creative,
} from "@/components/shared/creatives";
import { showcaseCss, SHOWCASE_HTML } from "@/components/shared/showcase";
import { FOOTER_CSS, footerHtml } from "@/components/shared/footer";

export const SERVICES_CSS = String.raw`
:root{
  --white:#FFFFFF;
  --paper:#FAFAF8;
  --ivory:#FBF7F1;
  --black:#0B0B0C;
  --red:#E3001B;
  --grey:#8A8A8E;
  --line:#E9E9E6;
  --pad:clamp(24px,6vw,96px);
  --display:'Archivo',sans-serif;
  --body:'Inter',sans-serif;
  --mono:'IBM Plex Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:auto}
body{font-family:var(--body);background:var(--paper);color:var(--black);overflow-x:hidden;-webkit-font-smoothing:antialiased}
::selection{background:var(--red);color:var(--white)}
button{font:inherit;background:none;border:none;cursor:pointer}

/* ============ GLOBAL LAYERS ============ */
#bgfade{position:fixed;inset:0;z-index:0;background:var(--paper);will-change:background-color}
#lightorb{position:fixed;left:50%;top:40%;width:min(72vw,900px);height:min(72vw,900px);transform:translate(-50%,-50%);border-radius:50%;filter:blur(70px);opacity:.5;pointer-events:none;z-index:1;will-change:background}
#grain{position:fixed;inset:0;z-index:2;pointer-events:none;opacity:.028;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
#topline{position:fixed;top:0;left:0;height:2px;width:0;background:var(--red);z-index:200}
#dots{position:fixed;right:clamp(12px,2vw,24px);top:50%;transform:translateY(-50%);z-index:120;display:flex;flex-direction:column;gap:12px;mix-blend-mode:difference}
#dots button{width:6px;height:6px;border-radius:6px;background:rgba(255,255,255,.45);padding:0;transition:height .3s,background .3s}
#dots button.on{height:20px;background:var(--red)}
@media (pointer:fine){
  #cdot{position:fixed;top:0;left:0;width:7px;height:7px;border-radius:50%;background:var(--red);z-index:400;pointer-events:none;transform:translate(-50%,-50%)}
  #cring{position:fixed;top:0;left:0;width:30px;height:30px;border-radius:50%;border:1.5px solid rgba(227,0,27,.5);z-index:399;pointer-events:none;transform:translate(-50%,-50%) scale(1);transition:transform .25s cubic-bezier(.2,.8,.2,1),border-color .25s}
  body.hovering #cring{transform:translate(-50%,-50%) scale(1.9);border-color:var(--red)}
}
@media (pointer:coarse){#cdot,#cring{display:none}}

/* ============ SECTION TEMPLATE ============ */
.sec{position:relative;z-index:3}
/* min-height rather than height — see the landing sheet: the slide fills the
   viewport when its content fits and grows when it doesn't, so it can never
   crop itself. overflow:hidden stays for the horizontal decor. */
.full{min-height:100svh;overflow:hidden;display:flex;flex-direction:column;padding:clamp(84px,12vh,120px) calc(var(--pad) + 44px) 64px var(--pad)}
.scrub{position:relative}
.scrub .stage{position:sticky;top:0;height:100svh;overflow:hidden;display:flex;flex-direction:column;padding:clamp(84px,12vh,120px) calc(var(--pad) + 44px) 64px var(--pad)}
.shead{position:relative;z-index:6;max-width:900px;margin-bottom:clamp(14px,2.8vh,30px);flex:0 0 auto}
.eb{font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--red);margin-bottom:16px;display:flex;align-items:center;gap:12px}
.eb::before{content:"";width:22px;height:1px;background:var(--red)}
.shead h2{font-family:var(--display);font-weight:800;font-stretch:106%;font-size:clamp(26px,3.4vw,46px);line-height:1.14;letter-spacing:-.02em}
.shead p{font-weight:400;font-size:clamp(14px,1.4vw,17px);color:#4a4a4d;line-height:1.6;margin-top:14px;max-width:58ch}
.onblack .shead h2{color:rgba(255,255,255,.96)}
.onblack .shead p{color:#b6b6b9}
.stagewrap{flex:1;min-height:0;width:100%;display:flex;flex-direction:column;align-items:center;justify-content:center}
.duo{flex:1;min-height:0;width:100%;display:flex;align-items:center;gap:clamp(30px,5vw,80px)}
.duotext{flex:0 0 clamp(270px,30vw,400px)}
.duomedia{flex:1;display:flex;align-items:center;justify-content:center;min-width:0;height:100%}
.rise{opacity:0;transform:translateY(26px);transition:opacity .7s cubic-bezier(.2,.8,.2,1),transform .7s cubic-bezier(.2,.8,.2,1)}
.sec.active .rise{opacity:1;transform:none;transition-delay:var(--rd,0s)}
.float{animation:idle 6s ease-in-out infinite alternate}
@keyframes idle{from{transform:translateY(-6px)}to{transform:translateY(6px)}}

/* ============ S1 HERO ============ */
#hero{display:flex;flex-direction:column;justify-content:center;padding:120px var(--pad) 0}
#hero .grid-bg{position:absolute;inset:0;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:110px 110px;opacity:.4;pointer-events:none}
#hero .orbit{position:absolute;top:50%;right:5%;width:46vmin;height:46vmin;border:1px dashed #DEDEDA;border-radius:50%;transform:translateY(-50%);pointer-events:none;animation:orb 44s linear infinite}
#hero .orbit::after{content:"";position:absolute;top:-4px;left:50%;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:var(--red)}
@keyframes orb{to{transform:translateY(-50%) rotate(360deg)}}
#hero .inner{position:relative;z-index:1;will-change:transform}
#hero .tag{font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--red);margin-bottom:28px;opacity:0}
body.ready #hero .tag{animation:fadeUp .7s .1s forwards}
@keyframes fadeUp{to{opacity:1;transform:none}}
#hero h1{font-family:var(--display);font-weight:900;font-stretch:110%;font-size:clamp(36px,7.2vw,104px);line-height:1.02;letter-spacing:-.015em;max-width:15ch}
#hero h1 .w{display:inline-block;opacity:0;transform:translateY(46px) scale(.94);filter:blur(10px)}
body.ready #hero h1 .w{animation:wIn .9s forwards cubic-bezier(.16,1,.3,1);animation-delay:var(--d,0s)}
@keyframes wIn{to{opacity:1;transform:none;filter:blur(0)}}
#hero .accent{color:var(--red)}
#hero .mv i{display:inline-block;font-style:normal}
body.ready #hero .mv i{animation:mvfloat 3.6s ease-in-out 1.6s infinite alternate}
@keyframes mvfloat{from{transform:translateY(-5px) rotate(-.6deg)}to{transform:translateY(5px) rotate(.6deg)}}
#hero .sub{max-width:640px;margin-top:28px;font-weight:300;font-size:clamp(17px,2vw,24px);line-height:1.6;color:#2c2c2f;opacity:0;transform:translateY(16px)}
body.ready #hero .sub{animation:fadeUp .9s .95s forwards}
#hero .sub b{font-weight:700}
#hero .rule{width:56px;height:2px;background:var(--red);margin:34px 0 0;transform:scaleX(0);transform-origin:left}
body.ready #hero .rule{animation:ruleIn .6s 1.25s forwards cubic-bezier(.7,0,.3,1)}
@keyframes ruleIn{to{transform:scaleX(1)}}
#scrollhint{margin-top:46px;font-family:var(--mono);font-size:9px;letter-spacing:.34em;color:var(--grey);opacity:0}
body.ready #scrollhint{animation:fadeUp .7s 1.7s forwards}
#scrollhint .line{width:1px;height:28px;background:#DADAD6;margin-top:8px;position:relative;overflow:hidden}
#scrollhint .line i{position:absolute;left:0;top:-100%;width:100%;height:100%;background:var(--red);animation:fall 1.7s cubic-bezier(.7,0,.3,1) infinite}
@keyframes fall{to{top:100%}}

/* ============ S2 EYE (scrub) ============ */
#eye{height:280vh}
.comp{position:relative;background:var(--white);border:1px solid var(--line);border-radius:8px;padding:clamp(18px,2.4vw,28px);box-shadow:14px 14px 0 rgba(11,11,12,.05);height:min(100%,480px);aspect-ratio:4/5;width:auto;max-width:100%}
.comp .clogo{width:34px;height:34px;border-radius:50%;background:var(--red);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:900;color:#fff;font-size:16px}
.comp .chl{margin-top:20px}
.comp .chl i{display:block;height:clamp(13px,1.8vw,20px);background:#151517;border-radius:3px;margin-bottom:9px}
.comp .chl i:nth-child(2){width:74%}
.comp .cimg{margin-top:18px;height:34%;border-radius:6px;background:linear-gradient(135deg,#1c1c1e,#3b0009);position:relative;overflow:hidden}
.comp .cimg::after{content:"";position:absolute;right:-22px;bottom:-22px;width:90px;height:90px;border-radius:50%;background:var(--red);opacity:.9}
.comp .ccta{margin-top:20px;display:inline-block;background:var(--red);color:#fff;font-family:var(--mono);font-size:11px;letter-spacing:.14em;padding:12px 22px;border-radius:3px}
.comp.done .ccta{animation:ctapulse 1.6s ease-in-out infinite}
@keyframes ctapulse{0%,100%{box-shadow:0 0 0 0 rgba(227,0,27,.35)}50%{box-shadow:0 0 0 11px rgba(227,0,27,0)}}
.gaze{position:absolute;inset:0;pointer-events:none;overflow:visible}
.gaze .trail{fill:none;stroke:rgba(227,0,27,.16);stroke-width:9;stroke-linecap:round}
.gaze .main{fill:none;stroke:var(--red);stroke-width:2.5;stroke-linecap:round;stroke-dasharray:8 10;opacity:.9}
.gdot{position:absolute;width:14px;height:14px;border-radius:50%;background:var(--red);box-shadow:0 0 0 6px rgba(227,0,27,.15);transform:translate(-50%,-50%);will-change:left,top}
.fix{display:none}
.duotext p{font-weight:400;font-size:clamp(14px,1.4vw,17px);color:#4a4a4d;line-height:1.65}
.onblack .duotext p{color:#a8a8ab}
.fixcount{margin-top:28px}
.fixtrack{display:flex;gap:8px;align-items:center}
.fixseg{flex:1;height:3px;background:rgba(11,11,12,.12);border-radius:2px;overflow:hidden;position:relative}
.onblack .fixseg{background:rgba(255,255,255,.12)}
.fixseg i{position:absolute;inset:0;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .45s cubic-bezier(.7,0,.3,1)}
.fixseg.on i{transform:scaleX(1)}

/* ============ S3 LOGOS (full) ============ */
.stopchip{font-family:var(--mono);font-size:10px;letter-spacing:.22em;color:var(--grey);display:flex;align-items:center;gap:9px}
.stopchip i{width:8px;height:8px;border-radius:50%;background:var(--red);animation:blink 1.2s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.lgrid{display:grid;grid-template-columns:repeat(4,minmax(96px,150px));gap:clamp(12px,1.8vw,20px)}
.ltile{aspect-ratio:1;background:var(--white);border:1px solid var(--line);position:relative;overflow:hidden;clip-path:inset(100% 0 0 0);transition:clip-path .7s cubic-bezier(.16,1,.3,1),box-shadow .3s,border-color .3s,transform .3s;box-shadow:5px 5px 0 rgba(11,11,12,.05)}
.sec.active .ltile{clip-path:inset(0 0 0 0);transition-delay:calc(var(--i)*70ms + .2s),0s,0s,0s}
.ltile::before{content:"";position:absolute;inset:7px;border:1.5px solid var(--red);opacity:0;transition:opacity .25s;z-index:3;pointer-events:none}
.ltile.focus{border-color:var(--red);box-shadow:9px 9px 0 rgba(227,0,27,.18);transform:translateY(-3px)}
.ltile.focus::before{opacity:1}
.ltile .lf{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transform:translateY(24px);transition:opacity .6s cubic-bezier(.2,.8,.2,1),transform .6s cubic-bezier(.2,.8,.2,1)}
.sec.active .ltile .lf{opacity:1;transform:none;transition-delay:calc(var(--i)*70ms + .4s)}
.ltile .mk{font-family:var(--display);font-weight:900;font-stretch:110%;font-size:clamp(18px,2.2vw,28px);animation:idle var(--dur,6s) ease-in-out var(--del,0s) infinite alternate;transition:transform .3s}
.ltile.focus .mk{transform:scale(1.08)}
.ltile:nth-child(3n) .mk span{color:var(--red)}
.ltile:nth-child(4){background:var(--black)}.ltile:nth-child(4) .mk span{color:#fff}
.ltile .construct{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .3s;z-index:2}
.ltile:hover .construct,.ltile.focus .construct{opacity:1}
.ltile .construct circle,.ltile .construct line{stroke:#C9C9C4;stroke-width:1;fill:none;stroke-dasharray:4 5;animation:dashmove 14s linear infinite}
.ltile:nth-child(4) .construct circle,.ltile:nth-child(4) .construct line{stroke:#3a3a3d}
.ltile .construct circle:nth-child(2){stroke:rgba(227,0,27,.5)}
@keyframes dashmove{to{stroke-dashoffset:-90}}

/* ============ S4 WEBSITES (scrub) ============ */
#web{height:320vh}
.wsteps{position:relative;min-height:180px}
.wstep{position:absolute;inset:0;opacity:0;transform:translateY(16px);transition:opacity .5s,transform .5s cubic-bezier(.2,.8,.2,1)}
.wstep.on{opacity:1;transform:none}
.wstep h3{font-family:var(--display);font-weight:700;font-size:clamp(19px,2.3vw,26px);line-height:1.2;margin-bottom:10px;letter-spacing:-.01em;color:#fff}
.wstep p{font-weight:300;font-size:15px;color:#b0b0b3;line-height:1.6;max-width:36ch}
.wticks{display:flex;gap:8px;margin-top:26px}
.wticks i{width:34px;height:3px;background:#2c2c2e;border-radius:2px;overflow:hidden;position:relative}
.wticks i b{position:absolute;inset:0;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .4s}
.wticks i.on b{transform:scaleX(1)}
.browser{background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 44px 100px rgba(0,0,0,.5);position:relative;width:min(640px,100%,calc((100svh - 330px)*1.45))}
.wchrome{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid #eee;background:#FBFBFA;position:relative}
.wchrome i{width:9px;height:9px;border-radius:50%;background:#DDD;flex:0 0 auto}
.wchrome i:first-child{background:var(--red)}
.urlbar{flex:1;background:#F0F0ED;border-radius:5px;padding:5px 12px;font-family:var(--mono);font-size:10.5px;color:#555;white-space:nowrap;overflow:hidden}
.loadbar{position:absolute;left:0;bottom:-1px;height:2.5px;width:100%;overflow:hidden;z-index:3}
.loadbar i{display:block;height:100%;width:100%;background:var(--red);transform:scaleX(0);transform-origin:left}
.browser.loading .loadbar i{animation:loadzip .65s cubic-bezier(.6,0,.2,1) forwards}
@keyframes loadzip{0%{transform:scaleX(0);opacity:1}80%{transform:scaleX(1);opacity:1}100%{transform:scaleX(1);opacity:0}}
.comps{position:relative;aspect-ratio:16/10.5}
.wcomp{position:absolute;inset:0;padding:20px 22px;background:#fff;clip-path:inset(0 0 100% 0);transition:clip-path .7s cubic-bezier(.7,0,.3,1)}
.wcomp.on{clip-path:inset(0 0 0% 0)}
.wcomp .whd{height:32%;border-radius:6px;background:linear-gradient(135deg,#151517,#2b0006);position:relative;overflow:hidden;margin-bottom:14px;transform:translateX(-30px);opacity:0;transition:transform .6s .35s cubic-bezier(.2,.8,.2,1),opacity .6s .35s}
.wcomp.on .whd{transform:none;opacity:1}
.wcomp .whd::after{content:attr(data-t);position:absolute;left:16px;bottom:12px;font-family:var(--display);font-weight:900;color:#fff;font-size:clamp(14px,1.8vw,20px)}
.wcomp .whd .sheen{position:absolute;inset:0;background:linear-gradient(115deg,transparent 42%,rgba(255,255,255,.13) 50%,transparent 58%);background-size:250% 100%;animation:sweep 3.5s linear infinite}
@keyframes sweep{from{background-position:120% 0}to{background-position:-120% 0}}
.wcomp .wln{height:9px;background:#EFEFEC;border-radius:4px;margin-bottom:9px;transform:scaleX(0);transform-origin:left;transition:transform .5s cubic-bezier(.7,0,.3,1) .55s}
.wcomp.on .wln{transform:scaleX(1)}
.wcomp.on .wln:nth-of-type(2){transition-delay:.65s}
.wcomp.on .wln:nth-of-type(3){transition-delay:.75s}
.wcomp .wln:nth-of-type(3){width:62%}
.wcomp .wcta{position:absolute;right:22px;bottom:20px;background:var(--red);color:#fff;font-family:var(--mono);font-size:10px;letter-spacing:.14em;padding:10px 18px;border-radius:3px;transform:scale(0);transition:transform .4s .9s cubic-bezier(.34,1.56,.64,1)}
.wcomp.on .wcta{transform:scale(1)}
.wcomp .chipstat{position:absolute;left:22px;bottom:20px;border:1px solid var(--red);color:var(--red);font-family:var(--mono);font-size:10px;letter-spacing:.12em;padding:9px 14px;border-radius:3px;transform:translateY(14px);opacity:0;transition:transform .45s 1.1s cubic-bezier(.2,.8,.2,1),opacity .45s 1.1s}
.wcomp.on .chipstat{transform:none;opacity:1}
.wcomp.c2 .whd{background:linear-gradient(135deg,var(--red),#7e000f)}
.wcomp.c3 .whd{background:#f0f0ec}.wcomp.c3 .whd::after{color:#111}

/* ============ S5 CLIENT WEBSITES (full) ============
   The whole component — styles, markup and engine — lives in
   shared/showcase.ts, because /services/digital carries the same section. All
   this page supplies is the selector it uses to mark a section revealed.

   It replaces four gradient tiles that carried nothing but the client's name in
   type, plus a modal that repeated them. */
${showcaseCss(".sec.active")}

/* ============ VIDEO PRODUCTION (scrub) ============
   Ported from the landing page's #tv section. The scrub is driven by P('tv') in
   init.ts, exactly as it is there — this page already runs the same cached-
   geometry engine, so the animation code came across unchanged. */
.objcap{font-family:var(--display);font-weight:900;font-stretch:115%;font-size:clamp(28px,5vw,64px);text-transform:uppercase;letter-spacing:-.01em;color:var(--black);text-align:center;line-height:1}
.onblack .objcap{color:var(--white)}
#tv{height:260vh}
.tvframe{width:min(560px,84vw);background:var(--black);border-radius:16px;padding:clamp(12px,2vw,22px);box-shadow:10px 10px 0 rgba(227,0,27,.1);position:relative}
.screen{position:relative;aspect-ratio:16/9;background:#111;border-radius:8px;overflow:hidden}
.scanlines{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 1px,transparent 1px 3px);animation:scan 8s linear infinite;pointer-events:none;z-index:5}
@keyframes scan{to{background-position:0 120px}}
.staticflk{position:absolute;inset:0;background:#fff;opacity:0;z-index:6;pointer-events:none;animation:flick 4s steps(1) infinite}
@keyframes flick{0%,96%{opacity:0}97%{opacity:.06}98%{opacity:0}99%{opacity:.09}100%{opacity:0}}
.rec{position:absolute;top:12px;left:14px;z-index:7;font-family:var(--mono);font-size:11px;color:#fff;letter-spacing:.12em}
.rec i{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--red);margin-right:6px;animation:blink 1s steps(1) infinite}
.chan{position:absolute;top:10px;right:14px;z-index:7;font-family:var(--mono);font-size:12px;color:#0f0;text-shadow:0 0 6px rgba(0,255,0,.6)}
.tcode{position:absolute;bottom:10px;right:14px;z-index:7;font-family:var(--mono);font-size:11px;color:#0f0;text-shadow:0 0 6px rgba(0,255,0,.6);letter-spacing:.06em}
.frame{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;opacity:0;transition:opacity .4s;padding:20px;text-align:center}
.frame.on{opacity:1}
.frame h3{font-family:var(--display);font-weight:900;font-stretch:110%;color:#fff;font-size:clamp(19px,3vw,32px);text-transform:uppercase;letter-spacing:-.01em}
.frame .chip2{font-family:var(--mono);font-size:10px;color:#fff;border:1px solid var(--red);padding:5px 10px;letter-spacing:.14em}
.frame.f1{background:linear-gradient(135deg,#1a1a1c,#2b0006)}
.frame.f2{background:linear-gradient(135deg,#E3001B,#7e000f)}
.frame.f3{background:#f2f2ef}.frame.f3 h3{color:var(--black)}.frame.f3 .chip2{color:var(--black);border-color:var(--black)}
.tvbar{height:4px;background:#2a2a2c;margin-top:12px;border-radius:3px;overflow:hidden}
.tvbar i{display:block;height:100%;width:0;background:var(--red)}

/* ============ SOCIAL MEDIA / REELS (scrub) ============
   Ported from the landing page's #reels section, and placed immediately before
   the social-creatives grid below. Driven by P('reels') in init.ts. */
#reels{height:280vh}
.phone{height:min(62svh,540px);aspect-ratio:9/18.5;background:#161618;border-radius:34px;border:3px solid #2c2c2f;padding:10px;position:relative;will-change:transform;box-shadow:0 26px 70px rgba(227,0,27,.12)}
.notch{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:36%;height:18px;background:#000;border-radius:12px;z-index:8}
.pscreen{position:relative;width:100%;height:100%;border-radius:24px;overflow:hidden;background:#000}
.rstatus{position:absolute;top:0;left:0;right:0;z-index:7;display:flex;justify-content:space-between;padding:8px 14px 0;font-family:var(--mono);font-size:9px;color:#fff;pointer-events:none}
.tabbar{position:absolute;bottom:0;left:0;right:0;z-index:7;display:flex;justify-content:space-around;align-items:center;padding:9px 8px 11px;background:linear-gradient(transparent,rgba(0,0,0,.7));pointer-events:none}
.tabbar svg{width:18px;height:18px;fill:none;stroke:#bbb;stroke-width:1.8}
.tabbar .active svg{stroke:var(--red);filter:drop-shadow(0 0 5px rgba(227,0,27,.7))}
.reeltrack{position:absolute;inset:0;will-change:transform}
.reel{position:absolute;left:0;width:100%;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:16px 14px 52px;color:#fff}
.reel.r1{top:0;background:linear-gradient(160deg,#26262a 40%,#3b0009)}
.reel.r2{top:100%;background:linear-gradient(200deg,#E3001B,#5c000b)}
.reel.r3{top:200%;background:linear-gradient(160deg,#0e0e10,#26262a 60%,#001)}
.vidfx{position:absolute;inset:0;background:linear-gradient(115deg,transparent 42%,rgba(255,255,255,.07) 50%,transparent 58%);background-size:250% 100%;animation:sweep 3.8s linear infinite;pointer-events:none}
.ruser{position:absolute;top:32px;left:12px;display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:10px}
.avatar{width:24px;height:24px;border-radius:50%;background:var(--red);display:inline-flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:800;font-size:12px;color:#fff;border:1.5px solid #fff}
.follow{border:1px solid rgba(255,255,255,.7);padding:3px 9px;font-size:8px;letter-spacing:.16em;transition:background .35s,border-color .35s}
.reel.live .follow{background:var(--red);border-color:var(--red)}
.reel .rtag{font-family:var(--mono);font-size:8px;letter-spacing:.18em;color:#fff;border:1px solid rgba(255,255,255,.5);padding:4px 8px;align-self:flex-start;margin-bottom:9px}
.reel .rh{font-family:var(--display);font-weight:900;font-size:16px;text-transform:uppercase;margin-bottom:5px;line-height:1.1;max-width:80%;letter-spacing:-.01em}
.reel .rc{font-size:11px;color:#e6e6e8;line-height:1.5;max-width:76%;font-weight:400}
.reel .rhash{font-family:var(--mono);font-size:9px;color:var(--red);margin-top:7px}
.reel.r2 .rhash{color:#fff}
.stack{position:absolute;right:8px;bottom:106px;display:flex;flex-direction:column;gap:13px;align-items:center;z-index:3}
.sicon{width:32px;text-align:center;transform:scale(0);transition:transform .4s cubic-bezier(.34,1.56,.64,1)}
.reel.live .sicon{transform:scale(1)}
.reel.live .sicon:nth-child(1){transition-delay:.12s}
.reel.live .sicon:nth-child(2){transition-delay:.26s}
.reel.live .sicon:nth-child(3){transition-delay:.4s}
.sicon svg{width:24px;height:24px;fill:#fff;filter:drop-shadow(0 2px 8px rgba(0,0,0,.5))}
.sicon.hrt svg{fill:var(--red)}
.sicon .cnt{display:block;font-family:var(--mono);font-size:8px;color:#fff;margin-top:3px}
.likes{position:absolute;right:20px;bottom:136px;pointer-events:none;z-index:2}
.likes i{position:absolute;bottom:0;right:0;font-size:12px;font-style:normal;color:var(--red);opacity:0;text-shadow:0 0 6px rgba(0,0,0,.4)}
.reel.live .likes i{animation:riseheart 2.2s linear infinite;animation-delay:var(--d)}
@keyframes riseheart{
  0%{opacity:0;transform:translate(0,0) scale(.7)}
  15%{opacity:1}
  100%{opacity:0;transform:translate(var(--x),-130px) scale(1.15)}
}
.mrow{display:flex;align-items:center;gap:8px;margin-top:10px}
.vinyl{width:18px;height:18px;flex:0 0 18px;border-radius:50%;background:conic-gradient(#3a3a3d,#111,#3a3a3d,#111,#3a3a3d);border:2px solid #555;position:relative;animation:spin 3s linear infinite}
.vinyl::after{content:"";position:absolute;inset:35%;border-radius:50%;background:var(--red)}
@keyframes spin{to{transform:rotate(360deg)}}
.mticker{flex:1;overflow:hidden;white-space:nowrap;font-family:var(--mono);font-size:9px;color:#ddd}
.mticker span{display:inline-block;animation:tick 9s linear infinite}
.pbar{position:absolute;right:5px;top:12%;bottom:12%;width:3px;background:#2c2c2f;border-radius:2px;z-index:6}
.pbar i{display:block;width:100%;height:0;background:var(--red);border-radius:2px}

/* ============ S6 SOCIAL (full) ============
   Real client creatives, held still. This was a 220vh pinned scrub whose only
   job was to slide the four columns against each other; with that motion gone
   the extra scroll height had nothing to drive, so the section flows normally
   and simply grows to fit the work. The cards keep their native proportions
   (--ar: 1 for the square posts, .8 for the 4:5 ones) rather than being forced
   into one ratio — a cropped creative is a misrepresented creative. */
.mgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;width:min(1040px,100%);perspective:1200px}
.mcol{display:flex;flex-direction:column;gap:14px}
.mcard{background:var(--white);border:1px solid var(--line);border-radius:6px;aspect-ratio:var(--ar,1);position:relative;overflow:hidden;opacity:0;transform:rotateX(14deg) translateY(50px);transition:opacity .7s cubic-bezier(.2,.8,.2,1),transform .7s cubic-bezier(.2,.8,.2,1);box-shadow:4px 4px 0 rgba(11,11,12,.05);will-change:transform}
.sec.active .mcard{opacity:1;transform:none;transition-delay:calc(var(--i)*70ms + .15s)}
.mcard img{display:block;width:100%;height:100%;object-fit:cover}

/* ============ S7 COLLATERALS (full) ============ */
.shelfwrap{position:relative}
.shelfring{position:absolute;left:50%;top:44%;width:62vmin;height:62vmin;transform:translate(-50%,-50%);border:1px dashed #2a2a2c;border-radius:50%;pointer-events:none;animation:orb 60s linear infinite reverse}
.lightband{position:absolute;top:-16%;bottom:-4%;width:200px;background:linear-gradient(100deg,transparent,rgba(255,255,255,.09),transparent);transform:skewX(-16deg);pointer-events:none;animation:band 7s ease-in-out infinite;z-index:4}
@keyframes band{0%{left:-24%}55%{left:110%}100%{left:110%}}
.shelf{position:relative;display:flex;gap:clamp(20px,3vw,44px);perspective:1400px;flex-wrap:wrap;justify-content:center;will-change:transform;transition:transform .4s cubic-bezier(.2,.8,.2,1)}
.citem{width:clamp(140px,17vw,200px);opacity:0;transform:translateY(40px) rotateY(var(--ry,0deg));transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform .8s cubic-bezier(.2,.8,.2,1)}
.sec.active .citem{opacity:1;transform:rotateY(0deg);transition-delay:calc(var(--i)*120ms + .2s)}
.citem .obj{animation:idle var(--dur,6s) ease-in-out var(--del,0s) infinite alternate}
.ccard{aspect-ratio:1.58;border-radius:10px;background:linear-gradient(135deg,#fff,#ececea);position:relative;box-shadow:0 24px 50px rgba(0,0,0,.45);margin-bottom:14px;overflow:hidden}
.ccard::before{content:"";position:absolute;left:14px;top:14px;width:26px;height:26px;border-radius:50%;background:var(--red)}
.ccard::after{content:"ADMIRATE";position:absolute;left:14px;bottom:14px;font-family:var(--display);font-weight:900;font-size:11px;letter-spacing:.06em;color:#111}
.cbook{aspect-ratio:.72;border-radius:4px;background:#111;border:1px solid #2a2a2c;position:relative;margin-bottom:14px;box-shadow:0 24px 50px rgba(0,0,0,.45)}
.cbook::before{content:"";position:absolute;inset:14px;border:1px solid #E3001B55}
.cbook::after{content:"BRAND\A GUIDE";white-space:pre;position:absolute;left:18px;bottom:18px;font-family:var(--display);font-weight:900;font-size:13px;color:#fff;line-height:1.15}
.cbag{aspect-ratio:.85;border-radius:6px 6px 2px 2px;background:var(--red);position:relative;margin-bottom:14px;box-shadow:0 24px 50px rgba(0,0,0,.45)}
.cbag::before{content:"";position:absolute;top:-14px;left:22%;width:56%;height:26px;border:5px solid var(--red);border-bottom:none;border-radius:14px 14px 0 0}
.cbag::after{content:"A";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:900;font-size:40px;color:#fff;opacity:.9}
.clabel{font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:#9a9a9e;text-align:center}

/* ============ S8 CONSISTENCY (full) ============ */
#consist{justify-content:center;align-items:center}
.cwrap{max-width:980px;margin:0 auto;text-align:center;width:100%}
.swrow{display:flex;justify-content:center;gap:10px;margin-bottom:clamp(36px,6vh,64px);flex-wrap:wrap}
.sq{width:clamp(20px,3vw,32px);height:clamp(20px,3vw,32px);border-radius:6px;animation:wander var(--wd,7s) ease-in-out infinite alternate;transition:transform 1s cubic-bezier(.16,1,.3,1)}
@keyframes wander{from{transform:translate(var(--sx),var(--sy)) rotate(var(--srot))}to{transform:translate(calc(var(--sx) * -.6),calc(var(--sy) * -.7)) rotate(calc(var(--srot) * -1))}}
.sec.active .sq{animation:none;transform:none;border-radius:4px}
.sq:nth-child(1){background:#2b2b2e}.sq:nth-child(2){background:#c9c9c6}.sq:nth-child(3){background:var(--red)}
.sq:nth-child(4){background:#2b2b2e}.sq:nth-child(5){background:var(--red)}.sq:nth-child(6){background:#111}
.sq:nth-child(7){background:#c9c9c6}.sq:nth-child(8){background:var(--red)}
#consist h2{font-family:var(--display);font-weight:900;font-stretch:108%;font-size:clamp(25px,4.4vw,56px);line-height:1.18;letter-spacing:-.01em}
#consist h2 em{font-style:normal;color:var(--red);position:relative}
#consist h2 em::after{content:"";position:absolute;left:0;right:0;bottom:-8px;height:4px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .6s cubic-bezier(.7,0,.3,1) 1.05s}
#consist.active h2 em::after{transform:scaleX(1)}
#consist p{margin-top:26px;font-weight:300;font-size:clamp(15px,1.6vw,19px);color:#4a4a4d;max-width:52ch;margin-left:auto;margin-right:auto;line-height:1.65}

/* ============ S9 CTA + FOOTER ============ */
/* The closing section is now only a carrier for shared/footer.ts, which
   brings its own surface, padding and layout. The CTA headline, buttons and
   footer strip that used to be styled here went with the markup. */
#cta{background:var(--black);color:#fff}
@keyframes tick{to{transform:translateX(-50%)}}

/* ============================================================
   RESPONSIVE
   Every section here is a 100svh slide with overflow:hidden. On a phone the
   headings wrap to three or four lines and the grids need more rows, so the
   content simply doesn't fit the slide any more — and overflow:hidden crops it
   without a scrollbar to warn you. Below the desktop breakpoint the .full
   sections therefore grow to their natural height, and the sticky .scrub stages
   (which must stay exactly one viewport tall for the scrub maths to work) get
   their media capped in svh instead.
   ============================================================ */

/* ---------- TABLET ---------- */
@media (max-width:1024px){
  /* Less scroll travel per scrub — coarser input, same choreography. */
  #eye{height:240vh}
  #web{height:270vh}

  .full,.scrub .stage{padding-right:calc(var(--pad) + 30px)}
  .lgrid{grid-template-columns:repeat(4,minmax(78px,120px));gap:12px}
  .mgrid{width:min(760px,100%)}
  .comp{height:min(52svh,420px)}
  .citem{width:clamp(120px,20vw,170px)}
  .shead p{font-size:14.5px}
}

/* ---------- TABLET / PHONE ---------- */
@media (max-width:900px){
  #dots{display:none}
  #hero .orbit{display:none}

  /* .full already grows rather than crops (see the base rule); on touch it just
     needs roomier padding and the grid left at its natural height. */
  .full{padding:clamp(104px,14vh,124px) var(--pad) 72px}
  .full .stagewrap{flex:0 0 auto;padding-top:clamp(18px,3vh,30px)}

  /* Scrub stages must stay exactly one viewport tall — the scrub progress is
     measured against it — so they keep height:100svh and shrink their media. */
  .scrub .stage{padding:clamp(84px,11vh,104px) var(--pad) 40px}
  .duo{flex-direction:column;justify-content:center;gap:clamp(16px,3vh,24px);align-items:flex-start}
  .duotext{flex:0 0 auto;width:100%}
  .duomedia{width:100%;flex:1;min-height:0}

  .comp{height:min(100%,340px);max-height:100%}
  .duotext p{font-size:14px;line-height:1.55}
  .fixcount{margin-top:18px}
  .wsteps{min-height:132px}
  .wstep p{font-size:13.5px}
  .wstep h3{font-size:18px}
  .wticks{margin-top:16px}
  .browser{width:min(560px,100%)}


  /* Two columns on a phone. Nothing is hidden any more — the section flows, so
     it can be as tall as the work is. */
  .mgrid{grid-template-columns:repeat(2,1fr);width:min(460px,100%);gap:12px}

  .lgrid{grid-template-columns:repeat(4,minmax(64px,100px));gap:10px}
  .shelf{gap:clamp(16px,4vw,32px)}
}

/* ---------- PHONE ---------- */
@media (max-width:640px){
  .full,.scrub .stage{padding-left:var(--pad);padding-right:var(--pad)}
  .shead h2{font-size:clamp(24px,6.4vw,32px)}
  .shead p{font-size:14px}
  .eb{font-size:10px;letter-spacing:.2em}

  #hero{padding:104px var(--pad) 0}
  #hero .sub{font-size:16px;margin-top:20px}
  #scrollhint{margin-top:30px}

  .lgrid{grid-template-columns:repeat(2,minmax(96px,132px));gap:12px}
  .mgrid{width:min(340px,100%);gap:10px}
  .citem{width:clamp(120px,40vw,150px)}
  .shelfring{display:none}
  .comp{height:min(100%,300px);padding:16px}
  .comp .ccta{padding:10px 16px;font-size:10px}
  .sq{width:22px;height:22px}
  #consist h2{font-size:clamp(23px,6.4vw,32px)}
}

/* ---------- MOBILE (matches admirate-design-mobile-v2.html) ----------
   Single-hand rhythm: sections settle rather than land mid-scrub. The bg is
   faded in CSS per section instead of being repainted per frame (see IS_M in
   init.ts), and the light-orb — a 900px blurred radial — is dropped outright:
   it is the single most expensive thing on the page to composite on a phone. */
@media (max-width:768px){
  html{scroll-snap-type:y proximity;scroll-behavior:smooth}
  .sec{scroll-snap-align:start}
  .full{scroll-snap-stop:always}

  #bgfade{transition:background-color .6s ease}
  #lightorb{display:none}

  /* The dot rail stays on mobile — the supplied design keeps it, just smaller.
     (The 900px block above hides it; this re-declares it below 768px.) */
  #dots{display:flex;right:7px;gap:9px}
  #dots button{width:5px;height:5px}
  #dots button.on{height:16px}

  /* Human-length scrubs: same choreography over less travel. */
  #eye{height:200vh}
  #web{height:220vh}
  #tv{height:220vh}
  #reels{height:240vh}

  .tvframe{width:min(430px,90vw)}
  .phone{height:min(64svh,480px)}

  /* Let the logo grid breathe past one screen; snap still lands on its top. */
  #logos{height:auto;min-height:100svh}
}

/* ---------- SHORT VIEWPORTS ----------
   See the landing sheet: below 600px tall there isn't enough room for a heading,
   a paragraph and a device mock inside one sticky slide, so the scrub is
   abandoned and the sections flow normally. The scrub JS is off here (see the
   staticScrub flag in init.ts), so anything it would have animated — and
   anything it would have painted, like the morphing background — is pinned
   by hand. */
@media (max-height:600px){
  .scrub{height:auto!important}
  /* position:relative (not static) un-sticks the stage while keeping it the
     containing block for its absolute children. overflow stays hidden: with
     height:auto it can no longer crop its content, so hidden now only contains
     the decor that bleeds sideways. */
  .scrub .stage{position:relative;height:auto;padding:76px var(--pad) 50px}
  .full{min-height:0;padding:80px var(--pad) 56px}
  .stagewrap{flex:none;height:auto}
  .duo{flex:none;height:auto;flex-direction:column;align-items:flex-start;gap:20px}
  .duotext{flex:0 0 auto;width:100%}
  .duomedia{width:100%;height:auto;justify-content:flex-start}
  #scrollhint{display:none}

  /* the JS paints these; without it they'd be blank/transparent */
  #bgfade,#lightorb,#topline,.gdot{display:none}
  #hero,#eye,#logos,#clients,#social,#consist,#tv{background:var(--paper)}
  #web,#collat,#reels{background:var(--black)}

  /* The ported mocks, sized for a short screen. .objcap is a decorative
     oversized caption — it is the first thing to go when height is scarce. */
  .objcap{display:none}
  .tvframe{width:min(380px,100%)}
  .phone{height:min(82svh,330px)}

  /* pinned end-states */
  .rise,.ltile,.ltile .lf,.mcard,.citem,.bframe,.cside,.sq{opacity:1!important;transform:none!important;clip-path:none!important}
  /* The reel action icons start at scale(0) and are only revealed by .reel.live,
     which the (disabled) scrub would have set — pin them or they never appear. */
  .sicon{transform:none!important;opacity:1!important}
  .fixseg i{transform:scaleX(1)!important}
  .wsteps{min-height:0}
  .wstep{position:static;opacity:1!important;transform:none!important;margin-bottom:14px}
  .comps{aspect-ratio:auto}
  .wcomp{position:static;clip-path:none!important;margin-bottom:12px;padding:16px}
  .wcomp .whd{transform:none!important;opacity:1!important;height:80px}
  .wcomp .wln{transform:scaleX(1)!important}
  .wcomp .wcta,.wcomp .chipstat{position:static;transform:none!important;opacity:1!important;display:inline-block;margin-top:10px}

  .comp{height:auto;width:min(260px,100%);aspect-ratio:4/5}
  .browser{width:min(440px,100%)}
  .mgrid{grid-template-columns:repeat(4,1fr);width:min(560px,100%)}
  .lgrid{grid-template-columns:repeat(4,minmax(70px,110px))}
}

/* ============ CROSS-LINK OUT ============
   Each service section now has a page of its own, so this page is the trailer
   and the link below is the way into the feature. Sits inside .shead, after the
   heading, on all six. */
.svmore{
  display:inline-flex;align-items:center;gap:9px;margin-top:16px;
  font-family:var(--mono);font-size:10.5px;letter-spacing:.18em;
  color:var(--red);text-decoration:none;
  border-bottom:1px solid rgba(227,0,27,.38);padding-bottom:4px;
  transition:gap .25s,border-color .25s,opacity .25s;
}
.svmore:hover{gap:15px;border-color:var(--red)}
.svmore .ar{transition:transform .25s}
.svmore:hover .ar{transform:translateX(3px)}

@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01s!important;transition-duration:.01s!important;animation-iteration-count:1!important;transition-delay:0s!important}
  #lightorb,#grain,.lightband,#cdot,#cring,#dots{display:none}
  .scrub{height:auto!important}
  .scrub .stage{position:static;height:auto;padding:80px var(--pad)}
  .full{height:auto;min-height:70vh;padding-top:90px;padding-bottom:90px}
  .stagewrap,.duo{flex:none;height:auto;padding:20px 0 0}
  .full,.scrub .stage{padding:80px var(--pad)}
  .rise,#hero h1 .w,#hero .tag,#hero .sub,#hero .rule,#scrollhint,.ltile,.ltile .lf,.mcard,.citem,.sq,.wstep,.wcomp,.fix,.bframe,.cside,.sicon{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important;animation:none!important}
  /* The scrub is off, so the bg never gets painted — pin the two ported
     sections' own backgrounds, as the sections above already do. */
  #tv{background:var(--paper)}
  #reels{background:var(--black)}
  .wcomp{position:static;margin-bottom:20px}
  .wstep{position:static;margin-bottom:20px}
  #bgfade{display:none}
  #eye,#logos,#social,#consist,#hero,#clients{background:var(--paper)}
  #web,#collat{background:var(--black)}
}

/* ---- site footer (shared/footer.ts) ---- */
${FOOTER_CSS}
`;

/**
 * Real client creatives for #social, laid out as four independent columns.
 *
 * The object names and true aspect ratios live in shared/creatives.ts, which
 * /services/design also reads. What stays here is the arrangement: which
 * creative sits in which column, in what order.
 *
 * The split is what makes the four columns come out roughly level in height (a
 * 4:5 card is 1.25x the height of a square at the same width) — it is not
 * simply 4/4/3/3 down the list, so it is spelled out rather than generated.
 *
 * The five "Design Trends 2026" slides are ADMIRATE's own carousel. They lead
 * separate columns rather than being stacked together, so the set reads as work
 * in the grid instead of a block of house marketing bolted onto the end.
 */
const CREATIVE_COLS: Creative[][] = [
  [TRENDS_SLIDES[0], CREATIVES.adivaram, CREATIVES.handloom, TRENDS_SLIDES[4]],
  [
    TRENDS_SLIDES[1],
    CREATIVES.parkinsons,
    CREATIVES.sastriyaYoga,
    CREATIVES.ms,
    CREATIVES.one,
  ],
  [
    TRENDS_SLIDES[2],
    CREATIVES.veganMarket,
    CREATIVES.one72,
    CREATIVES.artboard1copy,
    CREATIVES.f172,
  ],
  [
    TRENDS_SLIDES[3],
    CREATIVES.artboard1at100,
    CREATIVES.artboard6at100,
    CREATIVES.artboard1at72,
    CREATIVES.findYourGame,
  ],
];

/* --i drives the reveal stagger, so it counts across the row, not down a column. */
const MGRID_HTML = CREATIVE_COLS.map(
  (col, ci) =>
    `<div class="mcol">${col
      .map(
        (c, ri) =>
          `<div class="mcard" style="--i:${ri * CREATIVE_COLS.length + ci};--ar:${c.ar}" data-h><img src="${optimized(
            creative(c.file)
          )}" alt="${c.alt}" loading="lazy" decoding="async"></div>`
      )
      .join("")}</div>`
).join("");

export const SERVICES_HTML = String.raw`

<div id="bgfade"></div>
<div id="lightorb"></div>
<div id="grain"></div>
<div id="topline"></div>
<div id="cdot"></div><div id="cring"></div>
<div id="dots"></div>

<!-- S1 HERO -->
<section id="hero" class="sec full active" data-bg="#FAFAF8">
  <div class="grid-bg"></div>
  <div class="orbit"></div>
  <div class="inner" id="heroinner">
    <div class="tag">// OUR DESIGN WORK</div>
    <h1>
      <span class="w" style="--d:.15s">Design</span>
      <span class="w" style="--d:.25s">that</span>
      <span class="w mv" style="--d:.35s"><i>moves</i></span>
      <span class="w" style="--d:.45s">with</span>
      <span class="w accent" style="--d:.55s">you.</span>
    </h1>
    <p class="sub">Across <b>logos</b>, <b>websites</b>, <b>social creatives</b> — and every other collateral your brand needs to show up looking like itself, everywhere.</p>
    <div class="rule"></div>
    <div id="scrollhint">SCROLL<div class="line"><i></i></div></div>
  </div>
</section>

<!-- S2 EYE (scrub) -->
<section id="eye" class="sec scrub" data-bg="#F5F4F0">
  <div class="stage">
    <div class="shead">
      <div class="eb rise" style="--rd:0s">EYE-LEVEL DESIGN</div>
      <h2 class="rise" style="--rd:.1s">Every placement is deliberate.</h2>
      <a class="svmore rise" style="--rd:.2s" href="/services/design" data-h>EXPLORE DESIGN <span class="ar">→</span></a>
    </div>
    <div class="duo">
      <div class="duotext">
        <p class="rise" style="--rd:.2s">Our advertising is so precise it comes down to the detail of your eye — where it lands first, where it travels, where it finally rests. Logo, headline, image, action: each placed on that exact path. Nothing sits anywhere by accident.</p>
        <div class="fixcount rise" style="--rd:.3s">
          <div class="fixtrack">
            <div class="fixseg" id="fs0"><i></i></div>
            <div class="fixseg" id="fs1"><i></i></div>
            <div class="fixseg" id="fs2"><i></i></div>
            <div class="fixseg" id="fs3"><i></i></div>
          </div>
        </div>
      </div>
      <div class="duomedia">
        <div class="comp" id="comp">
          <div class="clogo" id="fx1a">A</div>
          <div class="chl" id="fx2a"><i></i><i></i></div>
          <div class="cimg" id="fx3a"></div>
          <span class="ccta" id="fx4a">START NOW →</span>
          <svg class="gaze" id="gazesvg" preserveAspectRatio="none"><path class="trail" id="gazetrail" d=""/><path class="main" id="gazepath" d=""/></svg>
          <div class="gdot" id="gdot"></div>
          <div class="fix" id="fx1"></div>
          <div class="fix" id="fx2"></div>
          <div class="fix" id="fx3"></div>
          <div class="fix" id="fx4"></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- S3 LOGOS (full) -->
<section id="logos" class="sec full" data-bg="#FFFFFF">
  <div class="shead">
    <div class="eb rise" style="--rd:0s">IDENTITY</div>
    <h2 class="rise" style="--rd:.1s">Logos built to be recognised in half a second.</h2>
    <p class="rise" style="--rd:.2s">A mark has to work small on a phone screen and huge on a hoarding, in colour and in a single flat black. These are the shapes we design to survive both.</p>
    <div class="stopchip rise" style="--rd:.3s"><i></i>RECOGNITION TEST — 0.5s / MARK</div>
    <a class="svmore rise" style="--rd:.38s" href="/services/identity" data-h>EXPLORE IDENTITY <span class="ar">→</span></a>
  </div>
  <div class="stagewrap">
      <div class="lgrid">
        <div class="ltile" style="--i:0" data-h><svg class="construct" viewBox="0 0 100 100" preserveAspectRatio="none"><circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="22"/><line x1="0" y1="50" x2="100" y2="50"/><line x1="50" y1="0" x2="50" y2="100"/></svg><div class="lf"><div class="mk" style="--dur:5.4s"><span>A<span style="color:var(--red)">.</span></span></div></div></div>
        <div class="ltile" style="--i:1" data-h><svg class="construct" viewBox="0 0 100 100" preserveAspectRatio="none"><circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="22"/><line x1="0" y1="50" x2="100" y2="50"/><line x1="50" y1="0" x2="50" y2="100"/></svg><div class="lf"><div class="mk" style="--dur:6.6s;--del:.5s"><span>KO</span></div></div></div>
        <div class="ltile" style="--i:2" data-h><svg class="construct" viewBox="0 0 100 100" preserveAspectRatio="none"><circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="22"/><line x1="0" y1="50" x2="100" y2="50"/><line x1="50" y1="0" x2="50" y2="100"/></svg><div class="lf"><div class="mk" style="--dur:4.8s;--del:1s"><span>▲RC</span></div></div></div>
        <div class="ltile" style="--i:3" data-h><svg class="construct" viewBox="0 0 100 100" preserveAspectRatio="none"><circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="22"/><line x1="0" y1="50" x2="100" y2="50"/><line x1="50" y1="0" x2="50" y2="100"/></svg><div class="lf"><div class="mk" style="--dur:7s;--del:.3s"><span>NEXA</span></div></div></div>
        <div class="ltile" style="--i:4" data-h><svg class="construct" viewBox="0 0 100 100" preserveAspectRatio="none"><circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="22"/><line x1="0" y1="50" x2="100" y2="50"/><line x1="50" y1="0" x2="50" y2="100"/></svg><div class="lf"><div class="mk" style="--dur:5.8s;--del:1.4s"><span>Ø</span></div></div></div>
        <div class="ltile" style="--i:5" data-h><svg class="construct" viewBox="0 0 100 100" preserveAspectRatio="none"><circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="22"/><line x1="0" y1="50" x2="100" y2="50"/><line x1="50" y1="0" x2="50" y2="100"/></svg><div class="lf"><div class="mk" style="--dur:6.2s;--del:.8s"><span>M/8</span></div></div></div>
        <div class="ltile" style="--i:6" data-h><svg class="construct" viewBox="0 0 100 100" preserveAspectRatio="none"><circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="22"/><line x1="0" y1="50" x2="100" y2="50"/><line x1="50" y1="0" x2="50" y2="100"/></svg><div class="lf"><div class="mk" style="--dur:5s;--del:1.2s"><span>H+</span></div></div></div>
        <div class="ltile" style="--i:7" data-h><svg class="construct" viewBox="0 0 100 100" preserveAspectRatio="none"><circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="22"/><line x1="0" y1="50" x2="100" y2="50"/><line x1="50" y1="0" x2="50" y2="100"/></svg><div class="lf"><div class="mk" style="--dur:6.8s;--del:.2s"><span>QI</span></div></div></div>
      </div>
  </div>
</section>

<!-- S4 WEBSITES (scrub) -->
<section id="web" class="sec scrub onblack" data-bg="#0B0B0C">
  <div class="stage">
    <div class="shead">
      <div class="eb rise" style="--rd:0s">DIGITAL</div>
      <h2 class="rise" style="--rd:.1s">Websites that load like a handshake.</h2>
      <a class="svmore rise" style="--rd:.2s" href="/services/digital" data-h>EXPLORE DIGITAL <span class="ar">→</span></a>
    </div>
    <div class="duo">
      <div class="duotext">
        <div class="wsteps">
          <div class="wstep on"><h3>A homepage that gets to the point</h3><p>One clear promise above the fold, one clear next step — no scavenger hunt to find what you offer.</p></div>
          <div class="wstep"><h3>Booking &amp; enquiry, built in</h3><p>Calendars, forms and chat — wired directly into the pages, not bolted on as an afterthought.</p></div>
          <div class="wstep"><h3>Fast on the connection your customer has</h3><p>Lightweight by default, so it still feels instant on an average phone, an average network, an average day.</p></div>
        </div>
        <div class="wticks"><i class="on"><b></b></i><i><b></b></i><i><b></b></i></div>
      </div>
      <div class="duomedia">
        <div class="browser float" id="browser" data-h>
          <div class="wchrome"><i></i><i></i><i></i><div class="urlbar" id="urlbar">admirate.in/your-homepage</div><div class="loadbar"><i></i></div></div>
          <div class="comps">
            <div class="wcomp c1 on"><div class="whd" data-t="YOUR BRAND, LOUD."><div class="sheen"></div></div><div class="wln"></div><div class="wln"></div><div class="wln"></div><span class="wcta">GET A QUOTE</span></div>
            <div class="wcomp c2"><div class="whd" data-t="BOOK A SLOT."><div class="sheen"></div></div><div class="wln"></div><div class="wln"></div><div class="wln"></div><span class="wcta">SEE CALENDAR</span></div>
            <div class="wcomp c3"><div class="whd" data-t="INSTANT. ALWAYS."><div class="sheen"></div></div><div class="wln"></div><div class="wln"></div><div class="wln"></div><span class="wcta">START NOW</span><span class="chipstat">⚡ 0.9s LOAD</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- S5 CLIENT WEBSITES (full) -->
<section id="clients" class="sec full" data-bg="#F2F1ED">
  <div class="shead">
    <div class="eb rise" style="--rd:0s">CLIENT WEBSITES</div>
    <h2 class="rise" style="--rd:.1s">Sites we've shipped, ready to open.</h2>
    <p class="rise" style="--rd:.2s">Pick a client and their site loads here. Every one of them is live right now — open it and judge the work yourself.</p>
  </div>
  <div class="stagewrap">
    ${SHOWCASE_HTML}
  </div>
</section>

<!-- SOCIAL MEDIA / REELS (scrub) — ported from the landing page.
     Section order follows the nav's services menu: design, identity, digital
     (+ websites), social media, video production, brand collaterals. The reels
     phone opens social media and the creatives grid below continues it. -->
<section id="reels" class="sec scrub onblack" data-bg="#0B0B0C">
  <div class="stage">
    <div class="shead">
      <div class="eb rise" style="--rd:0s">SOCIAL MEDIA</div>
      <h2 class="rise" style="--rd:.1s">Reels built to convert</h2>
      <a class="svmore rise" style="--rd:.2s" href="/services/social-media" data-h>EXPLORE SOCIAL MEDIA <span class="ar">→</span></a>
    </div>
    <div class="stagewrap">
      <div class="objcap">Social Media</div>
      <div class="phone" id="phone">
        <div class="notch"></div>
        <div class="pscreen">
          <div class="reeltrack" id="reeltrack">

            <div class="reel r1">
              <div class="vidfx"></div>
              <div class="ruser"><span class="avatar">A</span><span>@admirate.in</span><span class="follow">FOLLOW</span></div>
              <div class="likes"><i style="--d:0s;--x:-14px">♥</i><i style="--d:.5s;--x:8px">♥</i><i style="--d:1s;--x:-6px">♥</i><i style="--d:1.5s;--x:12px">♥</i></div>
              <div class="stack">
                <div class="sicon hrt"><svg viewBox="0 0 24 24"><path d="M12 21s-8-5.5-8-11a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 5.5-8 11-8 11z"/></svg><span class="cnt cv">214K</span></div>
                <div class="sicon"><svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 01-8 8H5l-2 2V12a8 8 0 018-8h2a8 8 0 018 8z"/></svg><span class="cnt">3.1K</span></div>
                <div class="sicon"><svg viewBox="0 0 24 24"><path d="M3 12l18-8-6 18-3-7-9-3z"/></svg><span class="cnt">SHARE</span></div>
              </div>
              <div class="rtag">SCRIPT + SHOOT</div>
              <div class="rh">Scripted to stop thumbs</div>
              <div class="rc">Hooks written from audience data — planned, shot and directed in-house.</div>
              <div class="rhash">#hooks #brandfilm #madebyadmirate</div>
              <div class="mrow"><span class="vinyl"></span><div class="mticker"><span>♫ original audio — admirate &nbsp;&nbsp;&nbsp; ♫ original audio — admirate &nbsp;&nbsp;&nbsp;</span></div></div>
            </div>

            <div class="reel r2">
              <div class="vidfx"></div>
              <div class="ruser"><span class="avatar" style="background:#0B0B0C">A</span><span>@admirate.in</span><span class="follow">FOLLOW</span></div>
              <div class="likes"><i style="--d:.2s;--x:10px">♥</i><i style="--d:.7s;--x:-10px">♥</i><i style="--d:1.2s;--x:6px">♥</i><i style="--d:1.7s;--x:-14px">♥</i></div>
              <div class="stack">
                <div class="sicon hrt"><svg viewBox="0 0 24 24"><path d="M12 21s-8-5.5-8-11a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 5.5-8 11-8 11z"/></svg><span class="cnt cv">489K</span></div>
                <div class="sicon"><svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 01-8 8H5l-2 2V12a8 8 0 018-8h2a8 8 0 018 8z"/></svg><span class="cnt">7.8K</span></div>
                <div class="sicon"><svg viewBox="0 0 24 24"><path d="M3 12l18-8-6 18-3-7-9-3z"/></svg><span class="cnt">SHARE</span></div>
              </div>
              <div class="rtag">EDIT + MOTION</div>
              <div class="rh">Cut to the beat</div>
              <div class="rc">Captions, motion graphics and sound design — every frame earns the next.</div>
              <div class="rhash">#motiongraphics #edit #sounddesign</div>
              <div class="mrow"><span class="vinyl"></span><div class="mticker"><span>♫ original audio — admirate &nbsp;&nbsp;&nbsp; ♫ original audio — admirate &nbsp;&nbsp;&nbsp;</span></div></div>
            </div>

            <div class="reel r3">
              <div class="vidfx"></div>
              <div class="ruser"><span class="avatar">A</span><span>@admirate.in</span><span class="follow">FOLLOW</span></div>
              <div class="likes"><i style="--d:.1s;--x:-8px">♥</i><i style="--d:.6s;--x:14px">♥</i><i style="--d:1.1s;--x:-12px">♥</i><i style="--d:1.6s;--x:8px">♥</i></div>
              <div class="stack">
                <div class="sicon hrt"><svg viewBox="0 0 24 24"><path d="M12 21s-8-5.5-8-11a4.5 4.5 0 018-3 4.5 4.5 0 018 3c0 5.5-8 11-8 11z"/></svg><span class="cnt cv">1.2M</span></div>
                <div class="sicon"><svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 01-8 8H5l-2 2V12a8 8 0 018-8h2a8 8 0 018 8z"/></svg><span class="cnt">12K</span></div>
                <div class="sicon"><svg viewBox="0 0 24 24"><path d="M3 12l18-8-6 18-3-7-9-3z"/></svg><span class="cnt">SHARE</span></div>
              </div>
              <div class="rtag">DISTRIBUTE + CONVERT</div>
              <div class="rh">Built to route viewers</div>
              <div class="rc">Every reel ends with a path — profile, page, enquiry. Views become leads.</div>
              <div class="rhash">#leadgen #convert #simplejourney</div>
              <div class="mrow"><span class="vinyl"></span><div class="mticker"><span>♫ original audio — admirate &nbsp;&nbsp;&nbsp; ♫ original audio — admirate &nbsp;&nbsp;&nbsp;</span></div></div>
            </div>

          </div>
          <div class="rstatus"><span>9:41</span><span>▮▮▮ ▰▰▱</span></div>
          <div class="tabbar">
            <span><svg viewBox="0 0 24 24"><path d="M3 10l9-7 9 7v10a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1z"/></svg></span>
            <span><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/></svg></span>
            <span class="active"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M10 9l5 3-5 3z"/></svg></span>
            <span><svg viewBox="0 0 24 24"><path d="M6 3h12l2 5H4z"/><path d="M4 8h16v13H4z"/></svg></span>
            <span><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></svg></span>
          </div>
          <div class="pbar"><i id="pprog"></i></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- S6 SOCIAL (full) -->
<section id="social" class="sec full" data-bg="#FBF7F1">
  <div class="shead">
    <div class="eb rise" style="--rd:0s">SOCIAL CREATIVES</div>
    <h2 class="rise" style="--rd:.1s">Creatives that actually ship — not just get planned.</h2>
    <p class="rise" style="--rd:.2s">This is where real client work lands as projects go out the door — posts, reel covers and campaign creative that carry your identity into every feed.</p>
  </div>
  <div class="stagewrap">
    <div class="mgrid" id="mgrid">${MGRID_HTML}</div>
  </div>
</section>

<!-- VIDEO PRODUCTION (scrub) — ported from the landing page -->
<section id="tv" class="sec scrub" data-bg="#F5F4F0">
  <div class="stage">
    <div class="shead">
      <div class="eb rise" style="--rd:0s">VIDEO PRODUCTION</div>
      <h2 class="rise" style="--rd:.1s">Films, ads &amp; brand stories</h2>
      <a class="svmore rise" style="--rd:.2s" href="/services/video-production" data-h>EXPLORE VIDEO PRODUCTION <span class="ar">→</span></a>
    </div>
    <div class="stagewrap">
      <div class="objcap">Video Production</div>
      <div class="tvframe">
        <div class="screen">
          <div class="frame f1 on"><h3>The Hook</h3><div class="chip2">SCENE 01 — STOP THE SCROLL</div></div>
          <div class="frame f2"><h3>The Story</h3><div class="chip2">SCENE 02 — YOUR BRAND ON FILM</div></div>
          <div class="frame f3"><h3>The Ask</h3><div class="chip2">SCENE 03 — CLEAR CALL TO ACTION</div></div>
          <div class="scanlines"></div>
          <div class="staticflk"></div>
          <div class="rec"><i></i>REC</div>
          <div class="chan" id="chan">CH 01</div>
          <div class="tcode" id="tcode">TC 00:00:00</div>
        </div>
        <div class="tvbar"><i id="tvprog"></i></div>
      </div>
    </div>
  </div>
</section>

<!-- S7 COLLATERALS (full) -->
<section id="collat" class="sec full onblack" data-bg="#0B0B0C">
  <div class="shead">
    <div class="eb rise" style="--rd:0s">BRAND COLLATERALS</div>
    <h2 class="rise" style="--rd:.1s">The physical proof of a strong identity.</h2>
    <p class="rise" style="--rd:.2s">Business cards, brand guidelines, packaging, merch — the things people hold in their hands, carrying the same face your brand shows everywhere else.</p>
    <a class="svmore rise" style="--rd:.3s" href="/services/brand-collaterals" data-h>EXPLORE BRAND COLLATERALS <span class="ar">→</span></a>
  </div>
  <div class="stagewrap">
    <div class="shelfwrap">
      <div class="shelfring"></div>
      <div class="lightband"></div>
      <div class="shelf" id="shelf">
        <div class="citem" style="--ry:-10deg;--i:0"><div class="obj" style="--dur:5.6s"><div class="ccard"></div></div><div class="clabel">BUSINESS CARD</div></div>
        <div class="citem" style="--ry:8deg;--i:1"><div class="obj" style="--dur:6.6s;--del:.6s"><div class="cbook"></div></div><div class="clabel">BRAND GUIDELINES</div></div>
        <div class="citem" style="--ry:-6deg;--i:2"><div class="obj" style="--dur:4.9s;--del:1.1s"><div class="cbag"></div></div><div class="clabel">PACKAGING</div></div>
        <div class="citem" style="--ry:9deg;--i:3"><div class="obj" style="--dur:6.1s;--del:.3s"><div class="ccard" style="background:linear-gradient(135deg,#1c1c1e,#000)"></div></div><div class="clabel" style="color:#e8e8ea">STATIONERY SET</div></div>
      </div>
    </div>
  </div>
</section>

<!-- S8 CONSISTENCY (full) -->
<section id="consist" class="sec full" data-bg="#FFFFFF">
  <div class="cwrap">
    <div class="swrow">
      <span class="sq" style="--sx:-140px;--sy:-60px;--srot:-40deg;--wd:6s"></span>
      <span class="sq" style="--sx:120px;--sy:80px;--srot:35deg;--wd:7.4s"></span>
      <span class="sq" style="--sx:-90px;--sy:70px;--srot:-25deg;--wd:5.4s"></span>
      <span class="sq" style="--sx:160px;--sy:-90px;--srot:50deg;--wd:8s"></span>
      <span class="sq" style="--sx:-160px;--sy:40px;--srot:20deg;--wd:6.8s"></span>
      <span class="sq" style="--sx:70px;--sy:-70px;--srot:-45deg;--wd:5.8s"></span>
      <span class="sq" style="--sx:-60px;--sy:90px;--srot:30deg;--wd:7s"></span>
      <span class="sq" style="--sx:140px;--sy:60px;--srot:-30deg;--wd:6.4s"></span>
    </div>
    <div class="eb rise" style="--rd:0s;justify-content:center">WHY IT WORKS</div>
    <h2 class="rise" style="--rd:.12s">One brand. Every platform.<br>Zero confusion with <em>anyone else's</em>.</h2>
    <p class="rise" style="--rd:.24s">Your logo, your site, your reels and your print all speak the same visual language — one that looks nothing like your competitors'. That consistency is what makes people recognise you before they've even read your name.</p>
  </div>
</section>

<!-- S9 CTA + FOOTER -->
<section id="cta" class="sec">
  ${footerHtml()}
</section>

<!-- CLIENT OVERLAY -->
`;
