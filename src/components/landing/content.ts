export const LANDING_CSS = String.raw`
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
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:auto}
body{font-family:var(--body);background:var(--white);color:var(--black);overflow-x:hidden;-webkit-font-smoothing:antialiased}
body.locked{overflow:hidden;height:100vh}
::selection{background:var(--red);color:var(--white)}

/* ============ SHARED SECTION SYSTEM ============ */
.sec{position:relative}
/* min-height rather than height: a slide fills the viewport when its content
   fits, and grows when it doesn't, so it can never crop itself vertically on a
   short or narrow screen. overflow:hidden stays to clip the horizontal decor
   (the CTA ghost text, the hero grid) that is meant to bleed. */
.full{min-height:100svh;overflow:hidden}
.shead{position:absolute;top:clamp(92px,14vh,150px);left:var(--pad);right:calc(var(--pad) + 30px);z-index:5}
.eb{font-family:var(--mono);font-size:11px;letter-spacing:.22em;color:var(--red);margin-bottom:14px}
h2.light{font-family:var(--body);font-weight:500;font-size:clamp(26px,3.4vw,46px);line-height:1.22;letter-spacing:-.008em;word-spacing:.05em;color:var(--black)}
.dark h2.light{color:var(--white)}
.rise{opacity:0;transform:translateY(24px);transition:opacity .7s,transform .7s cubic-bezier(.2,.8,.2,1)}
.sec.active .rise{opacity:1;transform:none;transition-delay:var(--rd,0s)}

/* dot nav */
#dots{position:fixed;right:clamp(12px,2vw,24px);top:50%;transform:translateY(-50%);z-index:120;display:flex;flex-direction:column;gap:12px;mix-blend-mode:difference}
#dots button{width:6px;height:6px;border-radius:6px;border:none;background:rgba(255,255,255,.45);cursor:pointer;padding:0;transition:height .3s,background .3s}
#dots button.on{height:20px;background:var(--red)}

/* ============ LOADER ============ */
#loader{position:fixed;inset:0;z-index:1000;pointer-events:none}
/* Set by the inline script in app/layout.tsx before the first paint, when the
   visitor is returning Home rather than arriving or reloading. Hiding it here
   rather than in init() is what prevents a flash of the black terminal. */
html.no-loader #loader{display:none}
#loader .half{position:absolute;left:0;width:100%;height:50.5%;background:var(--black);transition:transform .9s cubic-bezier(.76,0,.24,1)}
#loader .half.top{top:0}
#loader .half.bot{bottom:0}
#loader.open .half.top{transform:translateY(-101%)}
#loader.open .half.bot{transform:translateY(101%)}
#terminal{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:min(780px,92vw);font-family:var(--mono);font-size:clamp(17px,3.6vw,28px);color:#CFCFCF;z-index:2;transition:opacity .3s}
#loader.open #terminal{opacity:0}
#terminal .ln{white-space:nowrap;overflow:hidden;height:1.7em;line-height:1.7em}
#terminal .ln .txt{border-right:2px solid transparent}
#terminal .ln.typing .txt{border-right:2px solid var(--red)}
#terminal .ln.err .txt{color:var(--red);font-weight:500}
#terminal .ln.ok .txt{color:#fff}
#bar{margin-top:22px;height:8px;width:100%;background:#222;opacity:0}
#bar.show{opacity:1}
#bar i{display:block;height:100%;width:0;background:var(--red)}
#bar.fill i{width:100%;transition:width .6s cubic-bezier(.7,0,.3,1)}
#loader.glitch #terminal{animation:glitch .28s steps(3) 1}
@keyframes glitch{
  0%{transform:translate(-50%,-50%)}
  33%{transform:translate(calc(-50% - 6px),calc(-50% + 3px)) skewX(2deg)}
  66%{transform:translate(calc(-50% + 5px),calc(-50% - 4px)) skewX(-2deg)}
  100%{transform:translate(-50%,-50%)}
}

/* ============ S1 HERO ============ */
#hero{background:var(--paper);display:flex;flex-direction:column;justify-content:center;padding:0 var(--pad)}
#hero .grid-bg{position:absolute;inset:0;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:110px 110px;opacity:.45;pointer-events:none}
#hero .glowbg{position:absolute;top:-20%;right:-14%;width:58vw;height:58vw;max-width:840px;max-height:840px;background:radial-gradient(circle,rgba(227,0,27,.08),transparent 62%);pointer-events:none;animation:gdrift 24s ease-in-out infinite alternate}
@keyframes gdrift{from{transform:translate(0,0) scale(1)}to{transform:translate(-6%,8%) scale(1.12)}}
#hero .orbit{position:absolute;top:50%;right:5%;width:46vmin;height:46vmin;border:1px solid var(--line);border-radius:50%;transform:translateY(-50%);pointer-events:none;animation:orb 36s linear infinite}
#hero .orbit::after{content:"";position:absolute;top:-4px;left:50%;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:var(--red)}
@keyframes orb{to{transform:translateY(-50%) rotate(360deg)}}
#hero .inner{position:relative;z-index:1;max-width:1080px}
#hero h1{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(33px,6.3vw,88px);line-height:1.05;text-transform:uppercase;letter-spacing:-.01em;max-width:16ch}
#hero h1 .w{display:inline-block;opacity:0;transform:translateY(40px);filter:blur(6px)}
body.loaded #hero h1 .w{animation:riseIn .55s forwards cubic-bezier(.2,.8,.2,1);animation-delay:var(--d,0s)}
#hero h1 .w.split{opacity:1;transform:none;filter:none;animation:none!important}
.ch{display:inline-block;opacity:0;transform:translateY(.55em) rotate(6deg)}
body.loaded .ch{animation:chIn .45s forwards cubic-bezier(.2,.8,.2,1)}
@keyframes chIn{to{opacity:1;transform:none}}
@keyframes riseIn{to{opacity:1;transform:translateY(0);filter:blur(0)}}
#hero .mark{position:relative;display:inline-block}
#hero .mark svg{position:absolute;left:-2%;bottom:-7px;width:104%;height:17px;overflow:visible}
#hero .mark path{stroke:var(--red);stroke-width:5;fill:none;stroke-linecap:round;stroke-dasharray:600;stroke-dashoffset:600}
body.loaded #hero .mark path{animation:draw .5s 1.35s forwards cubic-bezier(.5,0,.3,1)}
@keyframes draw{to{stroke-dashoffset:0}}
#hero .cursor{display:inline-block;width:.12em;height:.82em;background:var(--red);margin-left:.08em;vertical-align:baseline;animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
#hero .rule{width:52px;height:2px;background:var(--red);margin:36px 0 0;transform:scaleX(0);transform-origin:left}
body.loaded #hero .rule{animation:ruleIn .5s 1.55s forwards cubic-bezier(.7,0,.3,1)}
@keyframes ruleIn{to{transform:scaleX(1)}}
#hero .sub{max-width:640px;margin-top:20px;font-weight:300;font-size:clamp(19px,2.3vw,29px);color:#232326;line-height:1.5;letter-spacing:-.01em;opacity:0}
#hero .sub b{font-weight:700}
body.loaded #hero .sub{animation:riseIn .6s 1.7s forwards}
#scrollhint{position:absolute;bottom:58px;left:50%;transform:translateX(-50%);z-index:2;text-align:center;font-family:var(--mono);font-size:9px;letter-spacing:.34em;color:var(--grey);opacity:0}
body.loaded #scrollhint{animation:riseIn .5s 2.3s forwards}
#scrollhint .line{width:1px;height:30px;background:#DADAD6;margin:8px auto 0;position:relative;overflow:hidden}
#scrollhint .line i{position:absolute;left:0;top:-100%;width:100%;height:100%;background:var(--red);animation:fall 1.7s cubic-bezier(.7,0,.3,1) infinite}
@keyframes fall{to{top:100%}}
#ticker{position:absolute;bottom:0;left:0;right:0;background:var(--red);color:#fff;font-family:var(--mono);font-size:10px;letter-spacing:.16em;padding:8px 0;overflow:hidden;white-space:nowrap;z-index:2}
#ticker .track{display:inline-block;animation:tick 28s linear infinite}
@keyframes tick{to{transform:translateX(-50%)}}

/* ============ S2 INTRO ============ */
#intro{background:var(--black);color:var(--white);display:flex;align-items:center;justify-content:center;padding:0 var(--pad)}
#intro .ring{position:absolute;top:50%;left:50%;border:1px solid rgba(255,255,255,.07);border-radius:50%;pointer-events:none}
#intro .ring.r1{width:90vmin;height:90vmin;transform:translate(-50%,-50%);animation:slowspin 90s linear infinite}
#intro .ring.r2{width:64vmin;height:64vmin;transform:translate(-50%,-50%);border-style:dashed;border-color:rgba(227,0,27,.16);animation:slowspin 70s linear infinite reverse}
@keyframes slowspin{to{transform:translate(-50%,-50%) rotate(360deg)}}
#intro .ring.r1::after{content:"";position:absolute;top:-3px;left:50%;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:var(--red);opacity:.7}
#intro .kglow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:72vmin;height:72vmin;background:radial-gradient(circle,rgba(227,0,27,.11),transparent 65%);pointer-events:none;animation:glowpulse 11s ease-in-out infinite alternate}
@keyframes glowpulse{from{opacity:.5}to{opacity:1}}
#intro .iwrap{position:relative;z-index:1;max-width:920px;text-align:center}
#intro .tag{font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--red);margin-bottom:32px}
#intro p.big{font-weight:300;font-size:clamp(21px,3.2vw,38px);line-height:1.5;letter-spacing:-.01em}
#intro p.big .w{opacity:.1;transition:opacity .4s}
#intro p.big .w.on{opacity:1}
#intro .acc{font-weight:700;color:var(--red);white-space:nowrap}
#intro .strike{position:relative;white-space:nowrap}
#intro .strike::after{content:"";position:absolute;left:-1%;top:55%;width:102%;height:1.5px;background:var(--red);transform:scaleX(0);transform-origin:left;transition:transform .5s .2s cubic-bezier(.7,0,.3,1)}
#intro .strike.on::after{transform:scaleX(1)}

/* ============ S3 SERVICES ============ */
#services{background:var(--paper)}
#services::before{content:"";position:absolute;inset:-40%;background-image:radial-gradient(#EBEBE7 1.2px,transparent 1.2px);background-size:34px 34px;opacity:.4;animation:dotdrift 50s linear infinite;pointer-events:none}
@keyframes dotdrift{to{transform:translate(68px,68px)}}
#services .stagewrap{padding-top:clamp(150px,22vh,200px)}
.svcgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(12px,1.6vw,18px);width:min(1000px,calc(100% - 2*var(--pad)))}
.svcblock{opacity:0;transform:translateY(26px) scale(.96);transition:opacity .55s cubic-bezier(.2,.8,.2,1),transform .55s cubic-bezier(.2,.8,.2,1)}
.sec.active .svcblock{opacity:1;transform:none;transition-delay:calc(var(--i)*50ms + .15s)}
.svcin{height:100%;background:var(--white);border:1px solid var(--line);box-shadow:5px 5px 0 rgba(11,11,12,.05);padding:clamp(14px,1.6vw,20px);display:flex;flex-direction:column;gap:12px;transition:background .25s,border-color .25s,box-shadow .25s,transform .25s;cursor:default}
.svcin:hover{background:var(--red);border-color:var(--red);box-shadow:7px 7px 0 rgba(11,11,12,.85);transform:translateY(-4px)}
.srow{display:flex;align-items:center;justify-content:space-between}
.svcblock .n{font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:var(--red);transition:color .25s}
.svcblock .ico{width:22px;height:22px;color:var(--red);transition:color .25s,transform .35s cubic-bezier(.34,1.56,.64,1)}
.svcblock .ico svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.svcblock .nm{font-family:var(--display);font-weight:800;font-stretch:106%;font-size:clamp(12px,1.25vw,16px);letter-spacing:.02em;text-transform:uppercase;color:var(--black);transition:color .25s;line-height:1.25}
.svcin:hover .n,.svcin:hover .nm{color:#fff}
.svcin:hover .ico{color:#fff;transform:rotate(-8deg) scale(1.12)}

/* ============ SCRUB SECTIONS ============ */
.scrub{position:relative}
.scrub .stage{position:sticky;top:0;height:100svh;overflow:hidden}
.stagewrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(14px,2.4vh,22px);padding-top:clamp(70px,11vh,110px)}
.objcap{font-family:var(--display);font-weight:900;font-stretch:115%;font-size:clamp(28px,5vw,64px);text-transform:uppercase;letter-spacing:-.01em;color:var(--black);text-align:center;line-height:1}
.dark .objcap{color:rgba(255,255,255,.12)}
.float{animation:idle 6s ease-in-out infinite alternate}
@keyframes idle{from{transform:translateY(-6px)}to{transform:translateY(6px)}}

/* ---- S4 LOGOS ---- */
#logos{background:var(--white)}
#logos .grid{display:grid;grid-template-columns:repeat(3,minmax(104px,168px));gap:clamp(12px,2vw,22px)}
.tile{aspect-ratio:1;background:var(--white);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:800;font-size:clamp(17px,2.2vw,27px);box-shadow:5px 5px 0 rgba(11,11,12,.05);opacity:0;transform:translateX(var(--dx,-130px)) rotate(var(--dr,-7deg)) scale(.82);transition:box-shadow .25s,border-color .25s,opacity .65s cubic-bezier(.16,1,.3,1),transform .65s cubic-bezier(.16,1,.3,1)}
.sec.active .tile{opacity:1;transform:none;transition-delay:0s,0s,calc(var(--i)*85ms + .15s),calc(var(--i)*85ms + .15s)}
.tile:hover{box-shadow:8px 8px 0 rgba(227,0,27,.16);border-color:var(--red)}
.tile span{color:var(--black)}
.tile .dot{color:var(--red)}
.tile:nth-child(2) span,.tile:nth-child(5) span{color:var(--red)}
.tile:nth-child(4){background:var(--black)} .tile:nth-child(4) span{color:#fff}

/* ---- S5 VIDEO ---- */
#tv{height:260vh;background:var(--paper)}
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

/* ---- S6 WEBSITE ---- */
#web{height:260vh;background:var(--white)}
.browser{width:min(640px,88vw);background:var(--white);border:1px solid var(--line);box-shadow:10px 10px 0 rgba(11,11,12,.06)}
.chrome{display:flex;align-items:center;gap:10px;padding:11px 14px;border-bottom:1px solid var(--line);background:#FBFBFA}
.chrome .b{width:10px;height:10px;border-radius:50%;background:#DCDCD8}
.chrome .b:first-child{background:var(--red)}
.urlbar{flex:1;background:#F0F0ED;border-radius:6px;padding:6px 12px;font-family:var(--mono);font-size:11px;color:#555;overflow:hidden;white-space:nowrap;min-height:26px}
.site{padding:clamp(14px,2.6vw,24px)}
.wnav{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;transform:translateY(-42px);opacity:0;will-change:transform,opacity}
.wnav .wl{font-family:var(--display);font-weight:800;font-size:14px}
.wnav .links{display:flex;gap:12px}
.wnav .links i{display:block;width:40px;height:7px;background:#E9E9E6;border-radius:4px}
.whero{height:108px;background:var(--black);margin-bottom:14px;position:relative;overflow:hidden;clip-path:inset(0 100% 0 0);will-change:clip-path}
.whero::after{content:"YOUR BRAND, LOUD.";position:absolute;inset:0;display:flex;align-items:center;padding-left:20px;font-family:var(--display);font-weight:800;color:#fff;font-size:clamp(16px,2.4vw,23px);letter-spacing:-.01em}
.whero::before{content:"";position:absolute;right:-28px;top:-28px;width:106px;height:106px;background:var(--red);border-radius:50%}
.whero .sheen{position:absolute;inset:0;background:linear-gradient(115deg,transparent 42%,rgba(255,255,255,.13) 50%,transparent 58%);background-size:250% 100%;animation:sweep 3.5s linear infinite}
@keyframes sweep{from{background-position:120% 0}to{background-position:-120% 0}}
.wcards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px}
.wcards .c{height:76px;border:1px solid var(--line);background:var(--white);position:relative;opacity:0;transform:scale(.75);will-change:transform,opacity}
.wcards .c::after{content:"";position:absolute;left:11px;bottom:11px;width:55%;height:6px;background:#E9E9E6;border-radius:4px}
.wcards .c::before{content:"";position:absolute;left:11px;top:11px;width:22px;height:22px;background:var(--red);opacity:.14}
.wfoot{display:flex;align-items:center;gap:16px}
.wbtn{display:inline-block;background:var(--red);color:#fff;font-family:var(--mono);font-size:11px;letter-spacing:.12em;padding:11px 20px;transform:scale(0);will-change:transform}
.livechip{font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:#0a8a2a;opacity:0;transform:translateY(8px);will-change:opacity,transform}
.livechip i{display:inline-block;width:7px;height:7px;border-radius:50%;background:#0a8a2a;margin-right:6px;animation:blink 1.2s steps(1) infinite}

/* ---- S7 REELS ---- */
#reels{height:280vh;background:var(--black)}
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

/* ============ S8 BRANDS ============ */
#brands{background:var(--white);display:flex;flex-direction:column;justify-content:center}
.marquee{display:flex;white-space:nowrap;overflow:hidden;border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--white)}
.marquee + .marquee{border-top:none}
.marquee .mtrack{display:flex;flex-shrink:0;animation:mq 32s linear infinite}
.marquee.rev .mtrack{animation:mqr 38s linear infinite}
.marquee:hover .mtrack{animation-play-state:paused}
@keyframes mq{to{transform:translateX(-100%)}}
@keyframes mqr{from{transform:translateX(-100%)}to{transform:translateX(0)}}
/* Real client marks, not their names set in type. They arrive at wildly different
   proportions (0.99 to 2.93 wide), so they are sized by a common height and left
   to take whatever width that gives — the standard logo-wall treatment. The
   square marks would otherwise read as tiny next to the wordmarks. */
.mk{padding:24px clamp(20px,3.2vw,40px);display:inline-flex;align-items:center;gap:clamp(20px,3.2vw,40px)}
/* Bounded by height AND width, not height alone. Height alone lets a long
   wordmark (Samyoga, 5.7:1) sprawl while a stacked mark (Seniors for Change,
   1:1, icon over two lines) shrinks to nothing. Capping both makes the set
   self-balancing: wide marks bind on width, square ones on height.
   --s then nudges any file that carries heavy empty padding (Sportex). */
.mk img{display:block;width:auto;height:auto;object-fit:contain;
  max-height:calc(clamp(34px,4vw,52px) * var(--s,1));
  max-width:calc(clamp(110px,13vw,180px) * var(--s,1))}
/* Zythum's mark is white-on-transparent and would be invisible on this white
   row. It is a single-colour mark, so inverting it yields a clean black one. */
.mk img.inv{filter:invert(1)}
.mk::after{content:"—";color:var(--red);font-family:var(--body);font-weight:700;font-size:20px}
.note{font-family:var(--mono);font-size:10px;color:var(--grey);padding:22px var(--pad) 0}

/* ============ S9 CTA ============ */
#cta{background:var(--black);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 var(--pad)}
.ghost{position:absolute;top:50%;left:0;transform:translateY(-50%);white-space:nowrap;font-family:var(--display);font-weight:900;font-stretch:115%;font-size:clamp(110px,20vw,260px);color:transparent;-webkit-text-stroke:1px #1c1c1e;pointer-events:none;user-select:none}
.ghost span{display:inline-block;animation:tick 46s linear infinite}
#cta > *:not(.ghost){position:relative;z-index:1}
#cta h2{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(28px,5vw,64px);text-transform:uppercase;line-height:1.1;margin-bottom:18px;letter-spacing:-.01em}
#cta h2 em{font-style:normal;color:var(--red)}
#cta p{font-family:var(--mono);font-size:11px;color:#9a9a9e;margin-bottom:42px;letter-spacing:.12em}
.btns{display:flex;gap:16px;justify-content:center;flex-wrap:wrap}
.btn{font-family:var(--body);font-weight:600;font-size:15px;text-decoration:none;padding:17px 28px;display:inline-flex;align-items:center;gap:10px;transition:transform .18s,box-shadow .18s;cursor:pointer;border:none}
.btn .ar{display:inline-block;transition:transform .18s}
.btn:hover{transform:translateY(-2px)}
.btn:hover .ar{transform:translateX(6px)}
.btn.dark{background:var(--white);color:var(--black)}
.btn.dark:hover{box-shadow:4px 4px 0 var(--red)}
.btn.red{background:var(--red);color:#fff}
.btn.red:hover{box-shadow:4px 4px 0 var(--white)}
#cta footer{position:absolute;bottom:0;left:0;right:0;border-top:1px solid #1d1d1f;padding:18px var(--pad);display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;font-family:var(--mono);font-size:10px;color:#77777b;letter-spacing:.12em}

/* ============================================================
   RESPONSIVE
   The scrub sections are viewport-height slides: an absolutely positioned
   .shead sitting over an absolutely positioned, centred .stagewrap. That only
   holds while the heading is short. Once headings wrap to 3-4 lines the two
   layers collide, and .stage's overflow:hidden silently crops whatever spills.
   So below the desktop breakpoint the stage becomes an ordinary flex column —
   heading on top, media in the space that's left — and each mock is capped in
   svh so it always fits the space it's given.
   ============================================================ */

/* ---------- TABLET ---------- */
@media (max-width:1024px){
  /* Shorten the scroll distance: the same animation over less travel keeps the
     pacing right on a touch device, where scrolling is coarser. */
  #tv{height:215vh}
  #web{height:215vh}
  #reels{height:235vh}

  .browser{width:min(560px,90vw)}
  .tvframe{width:min(500px,88vw)}
  .phone{height:min(56svh,470px)}
  .objcap{font-size:clamp(24px,4.6vw,44px)}
  #logos .grid{grid-template-columns:repeat(3,minmax(92px,140px));gap:14px}
  .svcgrid{gap:12px}
}

/* ---------- TABLET / PHONE: restructure the slides ---------- */
@media (max-width:900px){
  .scrub .stage{
    display:flex;flex-direction:column;
    padding:clamp(84px,11vh,104px) var(--pad) 34px;
  }
  .shead{position:static;flex:0 0 auto;margin-bottom:14px}
  .stagewrap{position:static;flex:1;min-height:0;padding-top:0;gap:clamp(10px,2vh,16px)}

  /* .full sections (#services, #logos) flow rather than centre-absolutely here,
     so the desktop stand-off that cleared the absolute .shead would just be a
     dead gap under a heading that now sits in the flow. */
  #services .stagewrap{padding-top:0}
  #services,#logos{padding:clamp(84px,11vh,104px) var(--pad) 40px}

  .objcap{font-size:clamp(22px,4.4vw,32px)}
  .phone{height:min(48svh,420px)}
  .browser{width:min(520px,100%)}
  .tvframe{width:min(460px,100%)}
  #logos .grid{grid-template-columns:repeat(3,minmax(78px,116px));gap:12px}
}

/* ---------- PHONE ---------- */
@media (max-width:640px){
  #logos .grid{grid-template-columns:repeat(2,minmax(96px,130px))}
  .wcards{grid-template-columns:1fr 1fr}
  .wcards .c:nth-child(3){display:none}
  #hero .orbit{display:none}
  h2.light{font-size:22px}

  #hero{padding:0 var(--pad) 40px}
  #hero .sub{font-size:17px;margin-top:16px}
  #hero .rule{margin-top:24px}
  #scrollhint{bottom:44px}
  #intro p.big{font-size:19px;line-height:1.45}
  #intro .tag{margin-bottom:20px}

  .phone{height:min(46svh,380px)}
  .reel .rh{font-size:14px}
  .reel .rc{font-size:10.5px}

  .mk{padding:18px 20px;gap:20px}
  .mk img{max-height:calc(32px * var(--s,1));max-width:calc(104px * var(--s,1))}
}

/* ---------- MOBILE (matches admirate-landing-mobile-v3.html) ---------- */
@media (max-width:768px){
  html{scroll-snap-type:y proximity;scroll-behavior:smooth}
  .sec{scroll-snap-align:start}
  .full{scroll-snap-stop:always}

  /* The dot rail stays on mobile, just smaller (the 640px block hides it; this
     later rule brings it back for the supplied design). */
  #dots{display:flex;right:7px;gap:9px}
  #dots button{width:5px;height:5px}
  #dots button.on{height:16px}

  #terminal{width:92vw;font-size:13px}

  /* Two-up service blocks, laid out as a row so the label reads beside the icon. */
  .svcgrid{grid-template-columns:1fr 1fr;gap:10px;width:100%}
  .svcin{flex-direction:row;align-items:center;gap:9px;padding:10px 12px}
  .srow{gap:8px;justify-content:flex-start}
  .svcblock .n{font-size:9px}
  .svcblock .ico{width:15px;height:15px}
  .svcblock .nm{font-size:10px;letter-spacing:.01em}

  #logos .grid{grid-template-columns:repeat(2,minmax(0,132px))}

  /* Human-length scrubs. */
  #tv{height:220vh}
  #web{height:230vh}
  #reels{height:240vh}

  .browser{width:min(450px,92vw)}
  .tvframe{width:min(430px,90vw)}
  .phone{height:min(64svh,480px)}
}

@media (max-width:400px){
  .svcin{padding:9px 10px}
  .svcblock .nm{font-size:9.5px}
  #logos .grid{grid-template-columns:repeat(2,1fr);gap:10px}
  .tvframe,.browser{width:94vw}
  .objcap{font-size:22px}
  .phone{height:min(62svh,440px)}
}

/* ---------- SHORT VIEWPORTS ----------
   Landscape phones and small phones (SE-class) give a slide ~280-440px of usable
   height. No amount of shrinking fits a heading, a paragraph and a device mock
   into that, so below 600px tall the sticky-scrub is abandoned: the sections
   become ordinary flowing content and the page just scrolls. The scrub JS is
   disabled to match (see the staticScrub flag in init.ts), so the built states
   have to be pinned here — otherwise the elements it would have animated stay
   stuck at their opacity:0 / scale(0) start values. */
@media (max-height:600px){
  .scrub{height:auto!important}
  /* position:relative (not static) un-sticks the stage while keeping it the
     containing block for its absolute children — static would re-parent them to
     .sec, which doesn't clip, and the #services dot field (inset:-40%, i.e. 180%
     of the stage width) would escape and drag the page sideways.
     overflow stays hidden: height:auto means it can no longer crop its content,
     so hidden now only contains the decor that bleeds sideways. */
  .scrub .stage{position:relative;height:auto;display:block;padding:76px var(--pad) 50px}
  .shead{position:static;margin-bottom:14px}
  .stagewrap{position:static;padding:18px 0 0;gap:14px}
  .full{min-height:0;padding-top:80px;padding-bottom:56px}
  #hero{min-height:100svh;padding-top:92px}
  .objcap,#scrollhint{display:none}

  /* pinned end-states — the scrub JS is off here, so anything it would have
     animated (and anything CSS only reveals on .sec.active) has to be pinned. */
  .rise,.tile,.wnav,.wcards .c,.svcblock{opacity:1!important;transform:none!important}
  .whero{clip-path:none!important}
  .wbtn,.sicon,.livechip{transform:none!important;opacity:1!important}
  #services .stagewrap{padding-top:0}

  /* the mocks, sized for a short screen */
  .phone{height:min(82svh,330px)}
  #logos .grid{grid-template-columns:repeat(3,minmax(70px,104px));gap:10px}
  .tvframe{width:min(380px,100%)}
  .browser{width:min(440px,100%)}
  .site{padding:12px}
  .whero{height:70px}
  .wcards .c{height:52px}
}

@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01s!important;animation-iteration-count:1!important;transition-duration:.01s!important;transition-delay:0s!important}
  .scrub{height:auto!important}
  .scrub .stage{position:static;height:auto;padding:90px 0}
  .stagewrap{position:static;padding:40px 20px}
  .shead{position:static;padding:0 var(--pad);margin-bottom:20px}
  .full{height:auto;min-height:70vh;padding-top:90px;padding-bottom:90px}
  #loader{display:none}
  body.locked{overflow:auto;height:auto}
  #hero h1 .w,#hero .kicker,#hero .sub,#hero .rule,#scrollhint,.ch{opacity:1;transform:none;filter:none}
  .rise,.tile,.wnav,.wcards .c,.svcblock{opacity:1!important;transform:none!important}
  .whero{clip-path:none!important}
  .wbtn,.sicon,.livechip{transform:none!important;opacity:1!important}
  #services .stagewrap{padding-top:0}
}
`;

export const LANDING_HTML = String.raw`

<!-- LOADER -->
<div id="loader">
  <div class="half top"></div>
  <div class="half bot"></div>
  <div id="terminal">
    <div class="ln" data-text="> booting admirate.in _"></div>
    <div class="ln" data-text="> loading campaign assets............ 100%"></div>
    <div class="ln err" data-text="> ERROR 404: boring_ads not found"></div>
    <div class="ln ok" data-text="> fix applied: ads_that_convert.exe ✓"></div>
    <div id="bar"><i></i></div>
  </div>
</div>

<div id="dots"></div>

<!-- S1 HERO -->
<section id="hero" class="sec full active">
  <div class="grid-bg"></div>
  <div class="glowbg"></div>
  <div class="orbit"></div>
  <div class="inner">
    <h1 id="h1">
      <span class="w">A</span> <span class="w">seriously,</span> <span class="w">seriously</span>
      <span class="w mark">creative<svg viewBox="0 0 300 22" preserveAspectRatio="none"><path d="M4 14 C 60 4, 150 20, 296 8"/></svg></span>
      <span class="w">advertising</span> <span class="w">agency.</span><span class="cursor"></span>
    </h1>
    <div class="rule"></div>
    <p class="sub">Advertising is part <b>business</b>, part <b>instinct</b>. We work at <b>that edge</b>.</p>
  </div>
  <div id="scrollhint">SCROLL<div class="line"><i></i></div></div>
  <div id="ticker"><div class="track" id="tickTrack"></div></div>
</section>

<!-- S2 INTRO -->
<section id="intro" class="sec full dark">
  <div class="ring r1"></div>
  <div class="ring r2"></div>
  <div class="kglow"></div>
  <div class="iwrap">
    <div class="tag">// WHAT IS ADMIRATE</div>
    <p class="big" id="introTxt">We're a full-stack ad agency obsessed with three things: <span class="acc">good design</span>, <span class="acc">user journeys</span> and <span class="acc">quick&nbsp;leads</span>. We build strong advertising material that moves buyers to act — not <span class="strike">social media fluff</span> that just sits there looking pretty.</p>
  </div>
</section>

<!-- S3 SERVICES -->
<section id="services" class="sec full">
  <div class="shead">
    <div class="eb rise" style="--rd:0s">SERVICES</div>
    <h2 class="light rise" style="--rd:.12s">Everything your brand needs to be seen.</h2>
  </div>
  <div class="stagewrap">
    <div class="svcgrid" id="svcgrid"></div>
  </div>
</section>

<!-- S4 LOGOS -->
<section id="logos" class="sec full">
  <div class="shead">
    <div class="eb rise" style="--rd:0s">IDENTITY</div>
    <h2 class="light rise" style="--rd:.12s">Logos &amp;<br>brand identity</h2>
  </div>
  <div class="stagewrap">
    <div class="grid">
      <div class="tile" style="--i:0;--dx:-130px;--dr:-7deg"><span>A<span class="dot">.</span></span></div>
      <div class="tile" style="--i:1;--dx:130px;--dr:7deg"><span>KO</span></div>
      <div class="tile" style="--i:2;--dx:-130px;--dr:-7deg"><span>▲RC</span></div>
      <div class="tile" style="--i:3;--dx:130px;--dr:7deg"><span>NEXA</span></div>
      <div class="tile" style="--i:4;--dx:-130px;--dr:-7deg"><span>Ø</span></div>
      <div class="tile" style="--i:5;--dx:130px;--dr:7deg"><span>M/8</span></div>
    </div>
  </div>
</section>

<!-- S5 VIDEO (scrub) -->
<section id="tv" class="sec scrub">
  <div class="stage">
    <div class="shead">
      <div class="eb rise" style="--rd:0s">VIDEO PRODUCTION</div>
      <h2 class="light rise" style="--rd:.12s">Films, ads &amp; brand stories</h2>
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

<!-- S6 WEBSITE (scrub) -->
<section id="web" class="sec scrub">
  <div class="stage">
    <div class="shead">
      <div class="eb rise" style="--rd:0s">DIGITAL</div>
      <h2 class="light rise" style="--rd:.12s">Websites, booking systems &amp; chatbots</h2>
    </div>
    <div class="stagewrap">
      <div class="objcap">Websites</div>
      <div class="browser">
        <div class="chrome">
          <div class="b"></div><div class="b"></div><div class="b"></div>
          <!-- Prefilled: the scrub types this out, but it's switched off on short
               viewports, where an empty bar would just look broken. -->
          <div class="urlbar" id="urlbar">admirate.in/your-next-website</div>
        </div>
        <div class="site">
          <div class="wnav" id="wnav"><div class="wl">BRAND<span style="color:var(--red)">.</span></div><div class="links"><i></i><i></i><i></i></div></div>
          <div class="whero" id="whero"><div class="sheen"></div></div>
          <div class="wcards"><div class="c" id="c1"></div><div class="c" id="c2"></div><div class="c" id="c3"></div></div>
          <div class="wfoot">
            <span class="wbtn" id="wbtn">BOOK A SLOT →</span>
            <span class="livechip" id="livechip"><i></i>LIVE</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- S7 REELS (scrub) -->
<section id="reels" class="sec scrub dark">
  <div class="stage">
    <div class="shead">
      <div class="eb rise" style="--rd:0s">SOCIAL MEDIA</div>
      <h2 class="light rise" style="--rd:.12s">Reels built to convert</h2>
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

<!-- S8 BRANDS -->
<section id="brands" class="sec full">
  <div class="shead">
    <div class="eb rise" style="--rd:0s">CLIENTS</div>
    <h2 class="light rise" style="--rd:.12s">Brands we've worked with</h2>
  </div>
  <div>
    <div class="marquee"><div class="mtrack" id="m1"></div><div class="mtrack" aria-hidden="true" id="m1b"></div></div>
    <div class="marquee rev"><div class="mtrack" id="m2"></div><div class="mtrack" aria-hidden="true" id="m2b"></div></div>
  </div>
</section>

<!-- S9 CTA -->
<section id="cta" class="sec full dark">
  <div class="ghost"><span>ADMIRATE — ADMIRATE — ADMIRATE — ADMIRATE — ADMIRATE — ADMIRATE — </span></div>
  <h2 class="rise" style="--rd:0s">The journey starts<br>with <em>one click.</em></h2>
  <p class="rise" style="--rd:.14s">// LESS FLUFF — MORE LEADS. TELL US YOUR GOAL.</p>
  <div class="btns rise" style="--rd:.28s">
    <a class="btn dark" href="/services">See our designs <span class="ar">→</span></a>
    <a class="btn red" href="/start-project">Start your project <span class="ar">→</span></a>
  </div>
  <footer>
    <div>© 2026 ADMIRATE.IN</div>
    <div>MADE TO CONVERT</div>
  </footer>
</section>

`;
