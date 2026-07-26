// @ts-nocheck

import { clientLogo } from "@/lib/cdn";
import { CLIENT_LOGOS } from "@/components/shared/clients";
import { renderClientGrid } from "@/components/landing/clientGrid.mjs";
import { initFooter } from "@/components/shared/footer";

export default function initLanding(){
let _dead=false, _rafId=0;
const _winListeners=[];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Below 600px tall the CSS drops the sticky-scrub and lets the sections flow
   (landscape phones, SE-class screens). The scrub writes would fight those
   pinned states, so they're switched off here too. The loader still runs —
   it's gated on `reduced` alone. */
const staticScrub = reduced || matchMedia('(max-height: 600px)').matches;

/* The loader is a first-impression, not a page transition. The pill nav's links
   are real <a> hrefs, so coming back to / is a full document load and used to
   replay the whole boot sequence every time. app/layout.tsx decides this before
   the first paint and marks the document; we only read its verdict here so the
   two can never disagree. Mark the tab as booted now, so the *next* arrival
   skips — but a reload still plays (layout.tsx overrides on nav type 'reload').
   Storage can throw in private mode; if it does we simply always play, which is
   the old behaviour. */
const skipLoader = document.documentElement.classList.contains('no-loader');
try{ sessionStorage.setItem('adm:booted','1'); }catch(e){}

if(!skipLoader) document.body.classList.add('locked');

/* ---------- content fills ---------- */
const words = 'BRANDING — LOGO DESIGN — WEBSITES — PACKAGING — SOCIAL MEDIA — VIDEO PRODUCTION — PRINT ADS — BRAND COLLATERALS — BOOKING SYSTEMS — CHATBOTS — ';
document.getElementById('tickTrack').textContent = (words + words).repeat(2);
/* Client marks. The shared registry also feeds the identity page; this page
   maps it once into a static grid. `inv` identifies the white Zythum artwork,
   while `scale` corrects source files with unusually generous empty padding. */
const clientGrid = document.getElementById('clientGrid');
clientGrid.innerHTML = renderClientGrid(CLIENT_LOGOS, clientLogo);

/* ---------- hero: per-letter split ---------- */
const h1words=[...document.querySelectorAll('#hero h1 .w')];
let base=0.18;
h1words.forEach(w=>{
  if(w.classList.contains('mark')){ w.style.setProperty('--d',base+'s'); base+=0.16; return; }
  const text=w.textContent; w.textContent=''; w.classList.add('split');
  [...text].forEach(ch=>{
    const s=document.createElement('span'); s.className='ch'; s.textContent=ch;
    s.style.animationDelay=base+'s'; base+=0.026; w.appendChild(s);
  });
  base+=0.05;
});

/* ---------- loader ---------- */
const loader = document.getElementById('loader');
const lines = [...document.querySelectorAll('#terminal .ln')];
const bar = document.getElementById('bar');
const _timers=[];
const wait=ms=>new Promise(r=>_timers.push(setTimeout(r,ms)));
function typeLine(el, speed){
  return new Promise(res=>{
    const t = el.dataset.text; const span = document.createElement('span');
    span.className='txt'; el.appendChild(span); el.classList.add('typing');
    let i=0; const iv=setInterval(()=>{
      if(_dead){clearInterval(iv);return;}
      span.textContent = t.slice(0,++i);
      if(i>=t.length){clearInterval(iv);el.classList.remove('typing');res();}
    }, speed);
  });
}
async function boot(){
  /* Already hidden by CSS — drop it outright and let the hero play immediately,
     rather than running finish()'s curtain-open on a curtain nobody saw. */
  if(skipLoader){
    if(loader && loader.parentNode) loader.remove();
    document.body.classList.remove('locked');
    document.body.classList.add('loaded');
    return;
  }
  if(reduced){ finish(); return; }
  await wait(380);
  if(_dead) return;
  await typeLine(lines[0], 34);
  await typeLine(lines[1], 18);
  await typeLine(lines[2], 26);
  loader.classList.add('glitch');
  await wait(540);
  await typeLine(lines[3], 24);
  bar.classList.add('show');
  requestAnimationFrame(()=>bar.classList.add('fill'));
  await wait(1150);
  if(_dead) return;
  finish();
}
function finish(){
  loader.classList.add('open');
  document.body.classList.remove('locked');
  document.body.classList.add('loaded');
  _timers.push(setTimeout(()=>{ if(loader && loader.parentNode) loader.remove(); }, 1100));
}
boot();

/* ---------- in-page anchor scrolling ---------- */
const _onAnchor=e=>{
  const a=e.target.closest('a[href^="#"]');
  if(!a) return;
  const id=a.getAttribute('href').slice(1);
  if(!id) return;
  const target=document.getElementById(id);
  if(!target) return;
  e.preventDefault();
  target.scrollIntoView({behavior: reduced?'auto':'smooth'});
};
document.addEventListener('click',_onAnchor);

/* ---------- intro word split + replay ---------- */
const introP = document.getElementById('introTxt');
(function splitWords(node){
  [...node.childNodes].forEach(n=>{
    if(n.nodeType===3){
      const frag=document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part=>{
        if(/^\s+$/.test(part)||part===''){frag.appendChild(document.createTextNode(part));}
        else{const s=document.createElement('span');s.className='w';s.textContent=part;frag.appendChild(s);}
      });
      node.replaceChild(frag,n);
    } else if(n.nodeType===1){ n.classList.add('w'); }
  });
})(introP);
const introWords=[...introP.querySelectorAll(':scope > .w')];
let introTimers=[];
function playIntro(){
  stopIntro(false);
  introWords.forEach((w,i)=>introTimers.push(setTimeout(()=>{ w.classList.add('on'); }, i*38)));
}
function stopIntro(clear=true){
  introTimers.forEach(clearTimeout); introTimers=[];
  if(clear) introWords.forEach(w=>w.classList.remove('on'));
}

/* ---------- section activation + dots ---------- */
const secs=[...document.querySelectorAll('.sec')];
const dotsBox=document.getElementById('dots');
secs.forEach((s,i)=>{
  const b=document.createElement('button');
  b.setAttribute('aria-label','Go to section '+(i+1));
  b.addEventListener('click',()=>s.scrollIntoView({behavior: reduced?'auto':'smooth'}));
  dotsBox.appendChild(b);
});
const dots=[...dotsBox.children];
const ioS=new IntersectionObserver(es=>{
  es.forEach(e=>{
    const s=e.target;
    if(e.isIntersecting){
      s.classList.add('active');
      if(s.id==='intro') playIntro();
    } else {
      if(s.id!=='hero') s.classList.remove('active');
      if(s.id==='intro') stopIntro();
    }
  });
},{threshold:.4});
secs.forEach(s=>ioS.observe(s));

/* ---------- scrub engine ---------- */
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

/* The ten services, in the order they are shown. Ten is deliberate: the grid is
   5-up on desktop and 2-up on mobile, so both land on full rows.
   Every name here must have a matching key in SVCICON below. */
const SVC=['Branding','Websites','Social media','Print ads','Booking systems','Packaging','Video production','Brand collaterals','Reels & shorts','Digital automations'];
const SVCICON={'Branding': '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/>', 'Websites': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/>', 'Packaging': '<path d="M3 8l9-5 9 5-9 5-9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>', 'Social media': '<path d="M21 12a9 9 0 11-4-7.5"/><path d="M21 3v6h-6"/>', 'Video production': '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>', 'Print ads': '<path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="1"/><path d="M6 17h12v4H6z"/>', 'Brand collaterals': '<rect x="4" y="4" width="16" height="6" rx="1"/><rect x="4" y="14" width="16" height="6" rx="1"/>', 'Booking systems': '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>', 'Reels & shorts': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M16 4v16M3 9h5M16 9h5M3 15h5M16 15h5"/>', 'Digital automations': '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M13 7l-4 6h3l-1 4 4-6h-3l1-4z"/>'};
/* The grid is static once built — CSS reveals it on .sec.active. */
const svcgrid=document.getElementById('svcgrid');
svcgrid.innerHTML=SVC.map((n,i)=>`<div class="svcblock" style="--i:${i}"><div class="svcin"><div class="srow"><span class="n">${String(i+1).padStart(2,'0')}</span><span class="ico"><svg viewBox="0 0 24 24">${SVCICON[n]}</svg></span></div><div class="nm">${n.toUpperCase()}</div></div></div>`).join('');

const frames=[...document.querySelectorAll('.frame')];
const chan=document.getElementById('chan'), tvprog=document.getElementById('tvprog'), tcode=document.getElementById('tcode');
const urlbar=document.getElementById('urlbar'), wnav=document.getElementById('wnav'), whero=document.getElementById('whero');
const cards=[document.getElementById('c1'),document.getElementById('c2'),document.getElementById('c3')];
const wbtn=document.getElementById('wbtn'), livechip=document.getElementById('livechip');
const phone=document.getElementById('phone'), track=document.getElementById('reeltrack'), pprog=document.getElementById('pprog');
const reelsEls=[...document.querySelectorAll('.reel')];
const viewTargets=[214000,489000,1200000];
const URL_TXT='admirate.in/your-next-website';
function fmt(n){return n>=1e6?(n/1e6).toFixed(1)+'M':Math.round(n/1000)+'K';}

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
   Geometry is measured once (and on resize/orientation/visibility) rather than
   read per section per frame, and a frame renders only when scroll marked it
   dirty. #services and #logos are no longer driven here — CSS reveals both on
   .sec.active. */
let Y=scrollY, dirty=true, VH=innerHeight, IS_M=false, AMPF=1, lastDot=-1;
const GEOMAP={};
function measure(){
  VH=innerHeight;
  secs.forEach(el=>{GEOMAP[el.id]={top:el.offsetTop,h:el.offsetHeight};});
  IS_M=matchMedia('(max-width:768px)').matches;
  AMPF=IS_M?0.45:1;
  dirty=true;
}
const P=id=>{const g=GEOMAP[id];return g?clamp((Y-g.top)/((g.h-VH)||1),0,1):0;};

function updateDots(){
  const mid=Y+VH/2;
  let cur=0;
  secs.forEach((s,i)=>{const g=GEOMAP[s.id];if(g&&mid>=g.top&&mid<g.top+g.h)cur=i;});
  if(cur!==lastDot){lastDot=cur;dots.forEach((d,j)=>d.classList.toggle('on', j===cur));}
}

function render(){
  updateDots();

  /* video: scenes by thirds, channel, timecode, bar */
  const pt=P('tv');
  const idxT=Math.min(2, Math.floor(pt*3));
  frames.forEach((f,i)=>f.classList.toggle('on', i===idxT));
  chan.textContent='CH 0'+(idxT+1);
  const secsT=pt*30, ss=String(Math.floor(secsT)).padStart(2,'0'), ff=String(Math.floor((secsT%1)*24)).padStart(2,'0');
  tcode.textContent=`TC 00:${ss}:${ff}`;
  tvprog.style.width=(pt*100)+'%';

  /* website: staged build, scrub-linked */
  const pw=P('web');
  const t1=seg(pw,0,.15);   urlbar.textContent=URL_TXT.slice(0, Math.round(t1*URL_TXT.length));
  const t2=ease(seg(pw,.15,.30)); wnav.style.transform=`translateY(${-42*(1-t2)}px)`; wnav.style.opacity=t2;
  const t3=ease(seg(pw,.30,.55)); whero.style.clipPath=`inset(0 ${(1-t3)*100}% 0 0)`;
  cards.forEach((c,i)=>{ const tc2=ease(seg(pw,.55+i*.08,.72+i*.08)); c.style.opacity=tc2; c.style.transform=`scale(${0.75+0.25*tc2})`; });
  const t5=seg(pw,.80,1); const b=t5<0.7?(t5/0.7)*1.1:1.1-((t5-0.7)/0.3)*0.1; wbtn.style.transform=`scale(${t5===0?0:b})`;
  livechip.style.opacity=seg(pw,.92,1); livechip.style.transform=`translateY(${8*(1-seg(pw,.92,1))}px)`;

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
const _onOrient=()=>{_timers.push(setTimeout(measure,250));};
addEventListener('orientationchange',_onOrient,{passive:true}); _winListeners.push(['orientationchange',_onOrient]);
const _onVis=()=>{if(!document.hidden) measure();};
document.addEventListener('visibilitychange',_onVis);
const _onLoad=()=>{_timers.push(setTimeout(measure,300));};
addEventListener('load',_onLoad,{once:true});

measure();

function tick2(){
  if(_dead) return;
  if(!staticScrub && !document.hidden && dirty){ dirty=false; Y=scrollY; render(); }
  _rafId=requestAnimationFrame(tick2);
}
_rafId=requestAnimationFrame(tick2);
if(staticScrub){ Y=scrollY; updateDots(); }

/* The footer clock shows Hyderabad time, not the visitor's. */
const stopFooter = initFooter();

function cleanup(){
  _dead=true;
  cancelAnimationFrame(_rafId);
  if(cntRaf)cancelAnimationFrame(cntRaf);
  _timers.forEach(clearTimeout);
  try{ioS.disconnect();}catch(e){}
  try{stopIntro();}catch(e){}
  document.removeEventListener('click',_onAnchor);
  document.removeEventListener('visibilitychange',_onVis);
  _winListeners.forEach(([t,h])=>removeEventListener(t,h));
  document.body.classList.remove('locked','loaded');
}
return cleanup;
}
