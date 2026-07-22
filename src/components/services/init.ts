// @ts-nocheck

import { initShowcase } from "@/components/shared/showcase";

export default function initServices(){
let _dead=false, _rafId=0, _curRaf=0;
const _winListeners=[];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Below 600px tall the CSS drops the sticky-scrub and lets the sections flow
   (landscape phones, SE-class screens). The scrub writes would fight those
   pinned states, so they're switched off here too. */
const staticScrub = reduced || matchMedia('(max-height: 600px)').matches;
requestAnimationFrame(()=>{ if(!_dead) document.body.classList.add('ready'); });
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- section activation + dots + logos recognition test ---------- */
const secs=[...document.querySelectorAll('.sec')];
const dotsBox=document.getElementById('dots');
secs.forEach((s,i)=>{
  const b=document.createElement('button');
  b.setAttribute('aria-label','Go to section '+(i+1));
  b.addEventListener('click',()=>s.scrollIntoView({behavior:reduced?'auto':'smooth'}));
  dotsBox.appendChild(b);
});
const dots=[...dotsBox.children];
const tiles=[...document.querySelectorAll('.ltile')];
let recogIv=null, recogI=0;
function startRecog(){
  stopRecog();
  if(reduced) return;
  recogI=0;
  recogIv=setInterval(()=>{
    tiles.forEach((t,i)=>t.classList.toggle('focus', i===recogI));
    recogI=(recogI+1)%tiles.length;
  },600);
}
function stopRecog(){
  if(recogIv){clearInterval(recogIv);recogIv=null;}
  tiles.forEach(t=>t.classList.remove('focus'));
}
const ioS=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('active');
      if(e.target.id==='logos') startRecog();
    } else {
      if(e.target.id!=='hero') e.target.classList.remove('active');
      if(e.target.id==='logos') stopRecog();
    }
  });
},{threshold:.35});
secs.forEach(s=>ioS.observe(s));
let lastDot=-1;
function updateDots(){
  const mid=Y+VH/2;
  let cur=0;
  secs.forEach((sc,i)=>{const g=GEOMAP[sc.id];if(g&&mid>=g.top&&mid<g.top+g.h)cur=i;});
  if(cur!==lastDot){lastDot=cur;dots.forEach((d,j)=>d.classList.toggle('on',j===cur));}
}

/* ---------- custom cursor ---------- */
const dot=document.getElementById('cdot'), ring=document.getElementById('cring');
const finePointer = matchMedia('(pointer:fine)').matches;
function bindHover(scope){
  scope.querySelectorAll('[data-h]').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
  });
}
if(dot && finePointer && !reduced){
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  const _onMove=e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';};
  addEventListener('mousemove',_onMove); _winListeners.push(['mousemove',_onMove]);
  (function cur(){ if(_dead)return; rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.left=rx+'px';ring.style.top=ry+'px';_curRaf=requestAnimationFrame(cur);})();
  bindHover(document);
}

/* ---------- hero parallax ---------- */
const heroinner=document.getElementById('heroinner');
if(!reduced && finePointer){
  document.getElementById('hero').addEventListener('mousemove',e=>{
    const x=e.clientX/innerWidth-.5, y=e.clientY/innerHeight-.5;
    heroinner.style.transform=`translate(${-x*10}px,${-y*8}px)`;
  });
}

/* ---------- background morph ---------- */
const bg=document.getElementById('bgfade');
const zones=[...document.querySelectorAll('[data-bg]')].map(el=>({el,c:el.dataset.bg,t:0}));
function hex2rgb(h){h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function mix(a,b,t){const A=hex2rgb(a),B=hex2rgb(b);return `rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')})`;}
function bgMorph(mid){
  let cur=zones[0],next=null,t=0;
  for(let i=0;i<zones.length;i++){
    if(mid>=zones[i].t){cur=zones[i];next=zones[i+1]||null;}
  }
  if(next){const win=VH*0.5;t=seg(mid,next.t-win,next.t+win*0.2);}
  bg.style.backgroundColor=next?mix(cur.c,next.c,t):cur.c;
}

/* ---------- drifting light ---------- */
const orb=document.getElementById('lightorb');
function orbTick(p){
  const x=50+Math.sin(p*Math.PI*3)*26;
  const y=18+p*64;
  const rn=(Math.sin(p*Math.PI*5)+1)/2;
  const c=`rgba(${Math.round(227*rn+255*(1-rn))},${Math.round(0*rn+250*(1-rn))},${Math.round(27*rn+248*(1-rn))},${0.16+rn*0.1})`;
  orb.style.left=x+'%';orb.style.top=y+'%';
  orb.style.background=`radial-gradient(circle, ${c}, transparent 70%)`;
}

/* ---------- EYE gaze scrub ---------- */
const sEye=document.getElementById('eye');
const comp=document.getElementById('comp');
const gsvg=document.getElementById('gazesvg'),gpath=document.getElementById('gazepath'),gtrail=document.getElementById('gazetrail'),gdot=document.getElementById('gdot');
const fixEls=[1,2,3,4].map(n=>document.getElementById('fx'+n));
const anchors=[['fx1a',.5,.5],['fx2a',.5,.45],['fx3a',.5,.5],['fx4a',.5,.5]];
let plen=0;
function buildGaze(){
  const cr=comp.getBoundingClientRect();
  gsvg.setAttribute('viewBox',`0 0 ${cr.width} ${cr.height}`);
  const pts=anchors.map(([id,fx,fy])=>{
    const r=document.getElementById(id).getBoundingClientRect();
    return [r.left-cr.left+r.width*fx, r.top-cr.top+r.height*fy];
  });
  const d=`M ${pts[0][0]} ${pts[0][1]} C ${pts[0][0]+90} ${pts[0][1]+10}, ${pts[1][0]-110} ${pts[1][1]-40}, ${pts[1][0]} ${pts[1][1]} S ${pts[2][0]-60} ${pts[2][1]-70}, ${pts[2][0]} ${pts[2][1]} S ${pts[3][0]+70} ${pts[3][1]-80}, ${pts[3][0]} ${pts[3][1]}`;
  gpath.setAttribute('d',d);gtrail.setAttribute('d',d);
  plen=gpath.getTotalLength();
  gpath.style.strokeDasharray=plen;
  gtrail.style.strokeDasharray=plen;
  fixEls.forEach((f,i)=>{f.style.left=pts[i][0]+'px';f.style.top=pts[i][1]+'px';});
}
buildGaze();
/* measure() rebuilds the gaze path on resize — see the render engine below. */
const FIXP=[.1,.42,.7,.94];
const fixsegs=[0,1,2,3].map(n=>document.getElementById('fs'+n));

/* ---------- WEB scrub ---------- */
const sWeb=document.getElementById('web');
const browser=document.getElementById('browser');
const urlbar=document.getElementById('urlbar');
const URLS=['admirate.in/your-homepage','admirate.in/book-a-slot','admirate.in/lightning-fast'];
const wcomps=[...document.querySelectorAll('.wcomp')];
const wsteps=[...document.querySelectorAll('.wstep')];
const wticks=[...document.querySelectorAll('.wticks i')];
let lastWi=0;

/* ---------- CLIENT SHOWCASE ----------
   Styles, markup and engine all live in shared/showcase.ts, which
   /services/digital renders as well. All this page adds is its custom cursor:
   the rail is rebuilt when the dashboard roster arrives, so the replacement
   buttons have to be re-bound to it. */
const stopShowcase = initShowcase({
  onRailRendered: rail => { if(dot && finePointer && !reduced) bindHover(rail); },
});
/* ---------- SOCIAL card tilts ----------
   The columns used to be scrubbed up and down against scroll. They are static
   now — the only motion left here is the pointer-driven tilt below. */
if(!reduced && finePointer){
  document.querySelectorAll('.mcard').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='';});
  });
  const shelf=document.getElementById('shelf');
  document.getElementById('collat').addEventListener('mousemove',e=>{
    const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
    shelf.style.transform=`rotateY(${x*5}deg) rotateX(${-y*3.5}deg)`;
  });
}

/* ---------- VIDEO PRODUCTION + REELS ----------
   Both sections are ported from the landing page. They are driven by the same
   cached-geometry engine below (P('tv') / P('reels')), so the scrub code is the
   landing page's, unchanged. */
const frames=[...document.querySelectorAll('.frame')];
const chan=document.getElementById('chan'), tvprog=document.getElementById('tvprog'), tcode=document.getElementById('tcode');
const phone=document.getElementById('phone'), track=document.getElementById('reeltrack'), pprog=document.getElementById('pprog');
const reelsEls=[...document.querySelectorAll('.reel')];
const viewTargets=[214000,489000,1200000];
const fmt=n=>n>=1e6?(n/1e6).toFixed(1)+'M':Math.round(n/1000)+'K';

/* The like counter rolls up when a reel becomes the live one. */
let cntRaf=null, lastLive=-1;
function tween(el,target){
  if(cntRaf)cancelAnimationFrame(cntRaf);
  const t0=performance.now(), D=650;
  (function step(t){
    if(_dead)return;
    const p=Math.min(1,(t-t0)/D), e=1-Math.pow(1-p,3);
    el.textContent=fmt(target*e);
    if(p<1)cntRaf=requestAnimationFrame(step);
  })(t0);
}

/* ---------- render engine: cached geometry, event-gated frames ----------
   The old loop read getBoundingClientRect() per section per frame and
   repainted the bg gradient + orb every frame. Geometry is now measured once
   (and on resize), and a frame is only rendered when scroll marked it dirty.
   On mobile the gradient interpolation is dropped for a per-zone colour swap
   — a phone repaints a full-viewport gradient far too slowly to do it live. */
const topline=document.getElementById('topline');
let Y=scrollY, dirty=true, VH=innerHeight, DOCH=1, IS_M=false, AMPF=1, lastZone=-1;
const GEOMAP={};
function measure(){
  VH=innerHeight;
  DOCH=document.documentElement.scrollHeight;
  secs.forEach(el=>{GEOMAP[el.id]={top:el.offsetTop,h:el.offsetHeight};});
  zones.forEach(z=>{z.t=z.el.offsetTop;});
  IS_M=matchMedia('(max-width:768px)').matches;
  /* The phone's full tilt throw reads as jitter on a small screen. */
  AMPF=IS_M?0.45:1;
  buildGaze();
  dirty=true;
}
const P=id=>{const g=GEOMAP[id];return g?clamp((Y-g.top)/((g.h-VH)||1),0,1):0;};

function render(){
  const gp=clamp(Y/((DOCH-VH)||1),0,1);
  topline.style.width=(gp*100)+'%';
  updateDots();

  const mid=Y+VH*0.5;
  if(IS_M){
    let zi=0;
    for(let i=0;i<zones.length;i++){ if(mid>=zones[i].t) zi=i; }
    if(zi!==lastZone){ lastZone=zi; bg.style.backgroundColor=zones[zi].c; }
  } else {
    bgMorph(mid);
    orbTick(gp);
  }

  /* eye */
  const pe=P('eye');
  gpath.style.strokeDashoffset=(1-pe)*plen;
  gtrail.style.strokeDashoffset=(1-pe)*plen;
  if(plen>0){
    const pt=gpath.getPointAtLength(pe*plen);
    gdot.style.left=pt.x+'px';gdot.style.top=pt.y+'px';
    gdot.style.opacity=pe>0.02?1:0;
  }
  FIXP.forEach((fp,i)=>{
    fixEls[i].classList.toggle('on',pe>=fp); // hidden but keeps JS clean
    fixsegs[i].classList.toggle('on',pe>=fp);
  });
  comp.classList.toggle('done',pe>=FIXP[3]);

  /* web */
  const pw=P('web');
  const wi=Math.min(2,Math.floor(pw*3));
  if(wi!==lastWi){
    lastWi=wi;
    urlbar.textContent=URLS[wi];
    browser.classList.remove('loading');
    void browser.offsetWidth;
    browser.classList.add('loading');
  }
  wcomps.forEach((c,i)=>c.classList.toggle('on',i===wi));
  wsteps.forEach((s,i)=>s.classList.toggle('on',i===wi));
  wticks.forEach((t,i)=>t.classList.toggle('on',i<=wi));

  /* video: scenes by thirds, channel, timecode, bar */
  const pt=P('tv');
  const idxT=Math.min(2, Math.floor(pt*3));
  frames.forEach((f,i)=>f.classList.toggle('on', i===idxT));
  chan.textContent='CH 0'+(idxT+1);
  const secsT=pt*30, ss=String(Math.floor(secsT)).padStart(2,'0'), ff=String(Math.floor((secsT%1)*24)).padStart(2,'0');
  tcode.textContent=`TC 00:${ss}:${ff}`;
  tvprog.style.width=(pt*100)+'%';

  /* reels: track scroll, tilt (damped on mobile), live per card, counters */
  const pr=P('reels');
  track.style.transform=`translateY(${-pr*200}%)`;
  phone.style.transform=`rotate(${(2.5-5*pr)*AMPF}deg)`;
  pprog.style.height=(pr*100)+'%';
  reelsEls.forEach((reel,i)=>{
    const c=[0,0.5,1][i];
    const near=1-clamp(Math.abs(pr-c)/0.18,0,1);
    const isLive = near>0.55;
    reel.classList.toggle('live', isLive);
    if(isLive && lastLive!==i){ lastLive=i; tween(reel.querySelector('.cv'), viewTargets[i]); }
    if(!isLive && lastLive===i){ lastLive=-1; }
  });
}

const _onScroll=()=>{dirty=true;};
addEventListener('scroll',_onScroll,{passive:true}); _winListeners.push(['scroll',_onScroll]);
const _onResize=()=>{measure();};
addEventListener('resize',_onResize,{passive:true}); _winListeners.push(['resize',_onResize]);
const _onOrient=()=>{setTimeout(measure,250);};
addEventListener('orientationchange',_onOrient,{passive:true}); _winListeners.push(['orientationchange',_onOrient]);
const _onVis=()=>{if(!document.hidden) measure();};
document.addEventListener('visibilitychange',_onVis);
const _onLoad=()=>setTimeout(measure,300);
addEventListener('load',_onLoad,{once:true});

measure();

function raf(){
  if(_dead)return;
  if(!staticScrub && !document.hidden && dirty){ dirty=false; Y=scrollY; render(); }
  _rafId=requestAnimationFrame(raf);
}
_rafId=requestAnimationFrame(raf);
if(staticScrub){ Y=scrollY; updateDots(); }

function cleanup(){
  _dead=true;
  cancelAnimationFrame(_rafId); cancelAnimationFrame(_curRaf);
  if(cntRaf)cancelAnimationFrame(cntRaf);
  stopShowcase();
  try{ioS.disconnect();}catch(e){}
  try{stopRecog();}catch(e){}
  document.removeEventListener('visibilitychange',_onVis);
  _winListeners.forEach(([t,h])=>removeEventListener(t,h));
  document.body.style.overflow='';
  document.body.classList.remove('ready','hovering');
}
return cleanup;
}
