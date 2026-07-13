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
.idx{position:absolute;bottom:26px;left:var(--pad);font-family:var(--mono);font-size:10px;letter-spacing:.26em;color:var(--grey);z-index:6}
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
.fixlabel{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--grey);margin-top:10px}
.fixlabel b{color:var(--red);font-weight:500}

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
.wstep .wnum{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--red);margin-bottom:10px}
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

/* ============ S5 CLIENT WEBSITES (full) ============ */
.cgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(14px,2vw,24px);width:min(1040px,100%)}
.csite{text-align:left;background:var(--white);border:1px solid var(--line);border-radius:8px;overflow:hidden;box-shadow:5px 5px 0 rgba(11,11,12,.05);opacity:0;transform:translateY(30px);transition:opacity .6s cubic-bezier(.2,.8,.2,1),transform .6s cubic-bezier(.2,.8,.2,1),box-shadow .3s,border-color .3s;padding:0;display:block;width:100%}
.sec.active .csite{opacity:1;transform:none;transition-delay:calc(var(--i)*90ms + .2s),calc(var(--i)*90ms + .2s),0s,0s}
.csite:hover{box-shadow:9px 9px 0 rgba(227,0,27,.16);border-color:var(--red);transform:translateY(-4px)}
.csite .cchrome{display:flex;gap:6px;padding:9px 12px;border-bottom:1px solid var(--line);background:#FBFBFA}
.csite .cchrome i{width:7px;height:7px;border-radius:50%;background:#DDD}
.csite .cchrome i:first-child{background:var(--red)}
.csite .cthumb{aspect-ratio:16/11;position:relative;display:flex;align-items:center;justify-content:center;overflow:hidden}
.v1 .cthumb{background:linear-gradient(150deg,#151517,#3b0009)}
.v2 .cthumb{background:linear-gradient(150deg,var(--red),#7e000f)}
.v3 .cthumb{background:linear-gradient(150deg,#f2f2ee,#fff)}
.v4 .cthumb{background:linear-gradient(150deg,#0e0e10,#26262a)}
.csite .cthumb .cwm{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(13px,1.7vw,20px);color:#fff;letter-spacing:.01em;text-align:center;line-height:1.15;padding:0 10px}
.v3 .cthumb .cwm{color:#111}
.cshot{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top center}
.csite .cthumb::after{content:"OPEN CASE →";position:absolute;left:50%;bottom:12px;transform:translate(-50%,8px);font-family:var(--mono);font-size:9px;letter-spacing:.18em;color:#fff;opacity:0;transition:opacity .3s,transform .3s;z-index:2;text-shadow:0 1px 6px rgba(0,0,0,.6)}
.v3 .cthumb::after{color:#111;text-shadow:none}
.csite.hasshot .cthumb::after{color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.6)}
.csite:hover .cthumb::after{opacity:1;transform:translate(-50%,0)}
.csite .cfoot{padding:11px 14px;font-family:var(--mono);font-size:10px;letter-spacing:.08em;color:var(--grey);display:flex;justify-content:space-between;gap:8px}
.csite .cfoot b{color:var(--black);font-weight:500}
.csite .cfoot span{text-align:right}

/* client overlay */
.cwin{position:fixed;inset:0;z-index:300;display:none;align-items:center;justify-content:center;padding:clamp(16px,3vw,40px)}
.cwin.openw{display:flex}
.cbk{position:absolute;inset:0;background:rgba(11,11,12,.72);backdrop-filter:blur(6px);opacity:0;transition:opacity .4s}
.cwin.show .cbk{opacity:1}
.cpanel{position:relative;background:var(--white);border-radius:12px;width:min(1020px,100%);max-height:88svh;overflow:auto;display:flex;gap:clamp(20px,3vw,44px);padding:clamp(20px,3vw,40px);opacity:0;transform:translateY(34px) scale(.96);transition:opacity .5s cubic-bezier(.16,1,.3,1),transform .5s cubic-bezier(.16,1,.3,1)}
.cwin.show .cpanel{opacity:1;transform:none}
.cmedia{flex:1 1 480px;min-width:0}
.bwin{background:#fff;border:1px solid var(--line);border-radius:8px;overflow:hidden;box-shadow:0 24px 60px rgba(11,11,12,.18)}
.bwin .cchrome{display:flex;align-items:center;gap:7px;padding:9px 12px;border-bottom:1px solid var(--line);background:#FBFBFA}
.bwin .cchrome i{width:8px;height:8px;border-radius:50%;background:#DDD}
.bwin .cchrome i:first-child{background:var(--red)}
.bwin .curl{flex:1;background:#F0F0ED;border-radius:4px;padding:4px 10px;font-family:var(--mono);font-size:10px;color:#555;white-space:nowrap;overflow:hidden}
.bbody{padding:18px;aspect-ratio:16/10.5}
.bhd{height:34%;border-radius:6px;position:relative;overflow:hidden;margin-bottom:13px;transform:translateX(-26px);opacity:0;transition:transform .6s .25s cubic-bezier(.2,.8,.2,1),opacity .6s .25s}
.cwin.show .bhd{transform:none;opacity:1}
.bhd::after{content:attr(data-t);position:absolute;left:14px;bottom:11px;font-family:var(--display);font-weight:900;color:#fff;font-size:clamp(13px,1.6vw,19px);z-index:2;text-shadow:0 1px 8px rgba(0,0,0,.55)}
.cpanel.v1 .bhd{background:linear-gradient(150deg,#151517,#3b0009)}
.cpanel.v2 .bhd{background:linear-gradient(150deg,var(--red),#7e000f)}
.cpanel.v3 .bhd{background:linear-gradient(150deg,#e9e9e4,#fff)}.cpanel.v3 .bhd::after{color:#111;text-shadow:none}
.cpanel.v4 .bhd{background:linear-gradient(150deg,#0e0e10,#26262a)}
.cpanel.hasshot .bhd::after{color:#fff;text-shadow:0 1px 8px rgba(0,0,0,.55)}
.bln{height:8px;background:#EFEFEC;border-radius:4px;margin-bottom:8px;transform:scaleX(0);transform-origin:left;transition:transform .5s cubic-bezier(.7,0,.3,1) .45s}
.cwin.show .bln{transform:scaleX(1)}
.cwin.show .bln:nth-of-type(2){transition-delay:.55s}
.cwin.show .bln:nth-of-type(3){transition-delay:.65s}
.bln:nth-of-type(3){width:60%}
.bcta{display:inline-block;margin-top:6px;background:var(--red);color:#fff;font-family:var(--mono);font-size:10px;letter-spacing:.12em;padding:9px 16px;border-radius:3px;transform:scale(0);transition:transform .4s .8s cubic-bezier(.34,1.56,.64,1)}
.cwin.show .bcta{transform:scale(1)}
.ctext{flex:1 1 300px;min-width:260px;display:flex;flex-direction:column}
.ctag{font-family:var(--mono);font-size:10px;letter-spacing:.2em;color:var(--red);margin-bottom:10px}
.ctext h3{font-family:var(--display);font-weight:900;font-stretch:110%;font-size:clamp(24px,3vw,38px);letter-spacing:-.01em;margin-bottom:12px}
.ctext .cdesc{font-weight:300;font-size:15px;color:#4a4a4d;line-height:1.65;margin-bottom:18px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px}
.chips span{font-family:var(--mono);font-size:10px;letter-spacing:.1em;border:1px solid var(--line);padding:7px 12px;border-radius:20px;color:#3a3a3d}
.cvisit{align-self:flex-start;font-family:var(--body);font-weight:600;font-size:14px;text-decoration:none;background:var(--black);color:#fff;padding:13px 22px;display:inline-flex;gap:9px;align-items:center;transition:transform .18s,box-shadow .18s}
.cvisit:hover{transform:translateY(-2px);box-shadow:4px 4px 0 var(--red)}
.cctrl{margin-top:auto;padding-top:26px;display:flex;gap:10px}
.cbtn{width:40px;height:40px;border:1px solid var(--line);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:16px;color:var(--black);transition:border-color .25s,background .25s,color .25s}
.cbtn:hover{border-color:var(--red);background:var(--red);color:#fff}
.cclose{position:absolute;top:14px;right:14px;width:38px;height:38px;border-radius:50%;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:15px;transition:border-color .25s,background .25s,color .25s;background:var(--white);z-index:3}
.cclose:hover{border-color:var(--red);background:var(--red);color:#fff}

/* ============ S6 SOCIAL (scrub) ============ */
#social{height:220vh}
.mgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;width:min(920px,100%,calc((100svh - 340px)*1.7));perspective:1200px}
.mcol{display:flex;flex-direction:column;gap:14px;will-change:transform}
.mcard{background:var(--white);border:1px solid var(--line);border-radius:6px;aspect-ratio:4/4.6;position:relative;overflow:hidden;opacity:0;transform:rotateX(14deg) translateY(50px);transition:opacity .7s cubic-bezier(.2,.8,.2,1),transform .7s cubic-bezier(.2,.8,.2,1);box-shadow:4px 4px 0 rgba(11,11,12,.05);will-change:transform}
.sec.active .mcard{opacity:1;transform:none;transition-delay:calc(var(--i)*90ms + .15s)}
/* padding-bottom reserves the strip the .rprog scrubber sits in, so a title that
   wraps to two lines can't run underneath it. */
.mcard .mhd{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:13px 13px 24px;color:#fff}
.mcard .mhd::before{content:"";position:absolute;inset:0;z-index:0}
.mcard.g1 .mhd::before{background:linear-gradient(160deg,#1c1c1e,#3b0009)}
.mcard.g2 .mhd::before{background:linear-gradient(160deg,var(--red),#7e000f)}
.mcard.g3 .mhd::before{background:linear-gradient(160deg,#f2f2ee,#fff)}
.mcard.g3 .mhd{color:#111}
.mcard.g4 .mhd::before{background:linear-gradient(160deg,#0e0e10,#26262a)}
.mcard .mhd *{position:relative;z-index:1}
.mcard .mtag{font-family:var(--mono);font-size:9px;letter-spacing:.16em;opacity:.85;margin-bottom:5px}
.mcard .mttl{font-family:var(--display);font-weight:800;font-size:14px;text-transform:uppercase}
.mcard .sticker{position:absolute;top:11px;right:11px;z-index:1;background:#fff;color:var(--red);font-family:var(--mono);font-size:9px;letter-spacing:.1em;padding:5px 9px;border-radius:20px;transform:rotate(6deg)}
.mcard.g3 .sticker{background:var(--black);color:#fff}
.mcard .play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.15);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;z-index:1;animation:ppulse 2s ease-in-out infinite}
.mcard .play::after{content:"";border-style:solid;border-width:7px 0 7px 12px;border-color:transparent transparent transparent #fff;margin-left:3px}
@keyframes ppulse{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,.35)}50%{box-shadow:0 0 0 12px rgba(255,255,255,0)}}
.mcard .rprog{position:absolute;left:11px;right:11px;bottom:11px;height:2.5px;background:rgba(255,255,255,.25);border-radius:2px;overflow:hidden;z-index:1}
.mcard .rprog i{display:block;height:100%;width:40%;background:#fff;animation:rp 3.2s linear infinite}
@keyframes rp{from{transform:translateX(-110%)}to{transform:translateX(260%)}}
.sbars{position:absolute;top:11px;left:11px;right:44px;display:flex;gap:5px;z-index:1}
.sbars i{flex:1;height:2.5px;background:rgba(255,255,255,.3);border-radius:2px;overflow:hidden;position:relative}
.sbars i::after{content:"";position:absolute;inset:0;background:#fff;transform:scaleX(0);transform-origin:left}
.sbars i:nth-child(1)::after{animation:sf1 6s linear infinite}
.sbars i:nth-child(2)::after{animation:sf2 6s linear infinite}
.sbars i:nth-child(3)::after{animation:sf3 6s linear infinite}
@keyframes sf1{0%{transform:scaleX(0)}30%{transform:scaleX(1)}100%{transform:scaleX(1)}}
@keyframes sf2{0%,30%{transform:scaleX(0)}63%{transform:scaleX(1)}100%{transform:scaleX(1)}}
@keyframes sf3{0%,63%{transform:scaleX(0)}96%{transform:scaleX(1)}100%{transform:scaleX(1)}}

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
#cta{position:relative;background:var(--black);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 var(--pad);overflow:hidden}
.ghost{position:absolute;top:50%;left:0;transform:translateY(-50%);white-space:nowrap;font-family:var(--display);font-weight:900;font-stretch:115%;font-size:clamp(110px,20vw,260px);color:transparent;-webkit-text-stroke:1px #1c1c1e;pointer-events:none;user-select:none}
.ghost span{display:inline-block;animation:tick 46s linear infinite}
@keyframes tick{to{transform:translateX(-50%)}}
#cta>*:not(.ghost):not(footer){position:relative;z-index:1}
#cta h2{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(28px,5vw,64px);text-transform:uppercase;line-height:1.1;margin-bottom:18px;letter-spacing:-.01em}
#cta h2 em{font-style:normal;color:var(--red)}
#cta p{font-family:var(--mono);font-size:11px;color:#9a9a9e;margin-bottom:42px;letter-spacing:.12em}
.btns{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
.btn{font-family:var(--body);font-weight:600;font-size:15px;text-decoration:none;padding:17px 28px;display:inline-flex;align-items:center;gap:10px;transition:transform .18s,box-shadow .18s}
.btn .ar{display:inline-block;transition:transform .18s}
.btn:hover{transform:translateY(-2px)}
.btn:hover .ar{transform:translateX(6px)}
.btn.dark{background:var(--white);color:var(--black)}
.btn.dark:hover{box-shadow:4px 4px 0 var(--red)}
.btn.red{background:var(--red);color:#fff}
.btn.red:hover{box-shadow:4px 4px 0 var(--white)}
#cta footer{position:absolute;bottom:0;left:0;right:0;z-index:1;border-top:1px solid #1d1d1f;padding:18px var(--pad);display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;font-family:var(--mono);font-size:10px;color:#77777b;letter-spacing:.12em}

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
  #social{height:190vh}

  .full,.scrub .stage{padding-right:calc(var(--pad) + 30px)}
  .lgrid{grid-template-columns:repeat(4,minmax(78px,120px));gap:12px}
  .cgrid{grid-template-columns:repeat(2,1fr);width:min(720px,100%)}
  .mgrid{width:min(680px,100%)}
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
  .full .idx{position:static;margin-top:34px}

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

  .cpanel{flex-direction:column;max-height:90svh}
  .cmedia,.ctext{flex:0 0 auto;min-width:0}
  .cctrl{margin-top:24px}

  /* Four columns of two cards each is 8 cards deep on a 2-col grid — far taller
     than the stage. Show one card per column so the grid stays 2x2. */
  .mgrid{grid-template-columns:repeat(2,1fr);width:min(420px,100%);gap:12px}
  .mcol .mcard + .mcard{display:none}

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
  .cgrid{grid-template-columns:repeat(2,1fr);gap:12px}
  .csite .cfoot{flex-direction:column;gap:3px}
  .csite .cfoot span{text-align:left}
  .mgrid{width:min(300px,100%)}
  .citem{width:clamp(120px,40vw,150px)}
  .shelfring{display:none}
  .comp{height:min(100%,300px);padding:16px}
  .comp .ccta{padding:10px 16px;font-size:10px}
  .sq{width:22px;height:22px}
  #consist h2{font-size:clamp(23px,6.4vw,32px)}
  .ctext h3{font-size:26px}
  .cpanel{padding:20px}
  .cclose{top:10px;right:10px;width:34px;height:34px}
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
  #social{height:170vh}

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
  .idx{position:static;margin-top:26px}
  #scrollhint{display:none}

  /* the JS paints these; without it they'd be blank/transparent */
  #bgfade,#lightorb,#topline,.gdot{display:none}
  #hero,#eye,#logos,#clients,#social,#consist{background:var(--paper)}
  #web,#collat{background:var(--black)}

  /* pinned end-states */
  .rise,.ltile,.ltile .lf,.mcard,.citem,.csite,.sq{opacity:1!important;transform:none!important;clip-path:none!important}
  .fixseg i{transform:scaleX(1)!important}
  .mcol{transform:none!important}
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
  .mcol .mcard + .mcard{display:none}
  .lgrid{grid-template-columns:repeat(4,minmax(70px,110px))}
  .cgrid{grid-template-columns:repeat(4,1fr)}
}

@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01s!important;transition-duration:.01s!important;animation-iteration-count:1!important;transition-delay:0s!important}
  #lightorb,#grain,.lightband,#cdot,#cring,#dots{display:none}
  .scrub{height:auto!important}
  .scrub .stage{position:static;height:auto;padding:80px var(--pad)}
  .full{height:auto;min-height:70vh;padding-top:90px;padding-bottom:90px}
  .stagewrap,.duo{flex:none;height:auto;padding:20px 0 0}
  .full,.scrub .stage{padding:80px var(--pad)}
  .rise,#hero h1 .w,#hero .tag,#hero .sub,#hero .rule,#scrollhint,.ltile,.ltile .lf,.mcard,.citem,.sq,.wstep,.wcomp,.fix,.csite{opacity:1!important;transform:none!important;filter:none!important;clip-path:none!important;animation:none!important}
  .wcomp{position:static;margin-bottom:20px}
  .wstep{position:static;margin-bottom:20px}
  #bgfade{display:none}
  #eye,#logos,#social,#consist,#hero,#clients{background:var(--paper)}
  #web,#collat{background:var(--black)}
}
`;

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
          <div class="fixlabel">FIXATION <b id="fixno">01</b> / 04</div>
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
    <div class="idx">02 — 09</div>
  </div>
</section>

<!-- S3 LOGOS (full) -->
<section id="logos" class="sec full" data-bg="#FFFFFF">
  <div class="shead">
    <div class="eb rise" style="--rd:0s">IDENTITY</div>
    <h2 class="rise" style="--rd:.1s">Logos built to be recognised in half a second.</h2>
    <p class="rise" style="--rd:.2s">A mark has to work small on a phone screen and huge on a hoarding, in colour and in a single flat black. These are the shapes we design to survive both.</p>
    <div class="stopchip rise" style="--rd:.3s"><i></i>RECOGNITION TEST — 0.5s / MARK</div>
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
  <div class="idx">03 — 09</div>
</section>

<!-- S4 WEBSITES (scrub) -->
<section id="web" class="sec scrub onblack" data-bg="#0B0B0C">
  <div class="stage">
    <div class="shead">
      <div class="eb rise" style="--rd:0s">DIGITAL</div>
      <h2 class="rise" style="--rd:.1s">Websites that load like a handshake.</h2>
    </div>
    <div class="duo">
      <div class="duotext">
        <div class="wsteps">
          <div class="wstep on"><div class="wnum">01</div><h3>A homepage that gets to the point</h3><p>One clear promise above the fold, one clear next step — no scavenger hunt to find what you offer.</p></div>
          <div class="wstep"><div class="wnum">02</div><h3>Booking &amp; enquiry, built in</h3><p>Calendars, forms and chat — wired directly into the pages, not bolted on as an afterthought.</p></div>
          <div class="wstep"><div class="wnum">03</div><h3>Fast on the connection your customer has</h3><p>Lightweight by default, so it still feels instant on an average phone, an average network, an average day.</p></div>
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
    <div class="idx">04 — 09</div>
  </div>
</section>

<!-- S5 CLIENT WEBSITES (full) -->
<section id="clients" class="sec full" data-bg="#F2F1ED">
  <div class="shead">
    <div class="eb rise" style="--rd:0s">CLIENT WEBSITES</div>
    <h2 class="rise" style="--rd:.1s">Sites we've shipped, ready to open.</h2>
    <p class="rise" style="--rd:.2s">Tap any build to open the case — what the client needed, what we made, and the live link.</p>
  </div>
  <div class="stagewrap">
    <div class="cgrid" id="cgrid"></div>
  </div>
  <div class="idx">05 — 09</div>
</section>

<!-- S6 SOCIAL (scrub) -->
<section id="social" class="sec scrub" data-bg="#FBF7F1">
  <div class="stage">
    <div class="shead">
      <div class="eb rise" style="--rd:0s">SOCIAL CREATIVES</div>
      <h2 class="rise" style="--rd:.1s">Creatives that actually ship — not just get planned.</h2>
      <p class="rise" style="--rd:.2s">This is where real client work lands as projects go out the door — posts, reel covers and campaign creative that carry your identity into every feed.</p>
    </div>
    <div class="stagewrap">
      <div class="mgrid" id="mgrid">
        <div class="mcol" data-amp="120">
          <div class="mcard g1" style="--i:0" data-h><div class="mhd"><div class="mtag">CAMPAIGN</div><div class="mttl">Launch Post</div></div><span class="sticker">NEW</span></div>
          <div class="mcard g3" style="--i:4" data-h><div class="mhd"><div class="mtag">CAROUSEL</div><div class="mttl">How It Works</div></div></div>
        </div>
        <div class="mcol" data-amp="-80">
          <div class="mcard g2" style="--i:1" data-h><div class="mhd"><div class="mtag">REEL</div><div class="mttl">Behind the Scenes</div></div><div class="play"></div><div class="rprog"><i></i></div></div>
          <div class="mcard g4" style="--i:5" data-h><div class="sbars"><i></i><i></i><i></i></div><div class="mhd"><div class="mtag">STORY</div><div class="mttl">Product Drop</div></div></div>
        </div>
        <div class="mcol" data-amp="160">
          <div class="mcard g4" style="--i:2" data-h><div class="mhd"><div class="mtag">PROMO</div><div class="mttl">Weekend Offer</div></div><span class="sticker">-20%</span></div>
          <div class="mcard g2" style="--i:6" data-h><div class="mhd"><div class="mtag">QUOTE</div><div class="mttl">Client Feedback</div></div></div>
        </div>
        <div class="mcol" data-amp="-110">
          <div class="mcard g3" style="--i:3" data-h><div class="mhd"><div class="mtag">TEASER</div><div class="mttl">Coming Soon</div></div></div>
          <div class="mcard g1" style="--i:7" data-h><div class="mhd"><div class="mtag">EVENT</div><div class="mttl">Save the Date</div></div><span class="sticker">RSVP</span></div>
        </div>
      </div>
    </div>
    <div class="idx">06 — 09</div>
  </div>
</section>

<!-- S7 COLLATERALS (full) -->
<section id="collat" class="sec full onblack" data-bg="#0B0B0C">
  <div class="shead">
    <div class="eb rise" style="--rd:0s">BRAND COLLATERALS</div>
    <h2 class="rise" style="--rd:.1s">The physical proof of a strong identity.</h2>
    <p class="rise" style="--rd:.2s">Business cards, brand guidelines, packaging, merch — the things people hold in their hands, carrying the same face your brand shows everywhere else.</p>
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
  <div class="idx">07 — 09</div>
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
  <div class="idx">08 — 09</div>
</section>

<!-- S9 CTA + FOOTER -->
<section id="cta" class="sec full">
  <div class="ghost"><span>ADMIRATE — ADMIRATE — ADMIRATE — ADMIRATE — ADMIRATE — ADMIRATE — </span></div>
  <h2 class="rise" style="--rd:0s">The journey starts<br>with <em>one click.</em></h2>
  <p class="rise" style="--rd:.14s">// LESS FLUFF — MORE LEADS. TELL US YOUR GOAL.</p>
  <div class="btns rise" style="--rd:.28s">
    <a class="btn dark" href="/" data-h>Back to home <span class="ar">→</span></a>
    <a class="btn red" href="/#contact" data-h>Start your project <span class="ar">→</span></a>
  </div>
  <footer>
    <div>© 2026 ADMIRATE.IN</div>
    <div>MADE TO CONVERT</div>
  </footer>
</section>

<!-- CLIENT OVERLAY -->
<div class="cwin" id="cwin" role="dialog" aria-modal="true">
  <div class="cbk" id="cbk"></div>
  <div class="cpanel" id="cpanel">
    <button class="cclose" id="cclose" data-h aria-label="Close">✕</button>
    <div class="cmedia">
      <div class="bwin">
        <div class="cchrome"><i></i><i></i><i></i><div class="curl" id="curl"></div></div>
        <div class="bbody">
          <div class="bhd" id="bhd" data-t=""></div>
          <div class="bln"></div><div class="bln"></div><div class="bln"></div>
          <span class="bcta" id="bcta"></span>
        </div>
      </div>
    </div>
    <div class="ctext">
      <div class="ctag" id="ctag"></div>
      <h3 id="cname"></h3>
      <p class="cdesc" id="cdesc"></p>
      <div class="chips" id="cchips"></div>
      <a class="cvisit" href="#" id="cvisit" target="_blank" rel="noopener noreferrer" data-h>Visit site <span>→</span></a>
      <div class="cctrl">
        <button class="cbtn" id="cprev" data-h aria-label="Previous">‹</button>
        <button class="cbtn" id="cnext" data-h aria-label="Next">›</button>
      </div>
    </div>
  </div>
</div>

`;
