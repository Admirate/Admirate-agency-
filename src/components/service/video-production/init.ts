// @ts-nocheck

/**
 * VIDEO PRODUCTION page engine.
 *
 * The set-piece is the showreel. It loops muted as ambience while it is on
 * screen and commits to sound only when asked, so the section is alive before
 * anyone touches it but never starts talking on its own.
 *
 * The transport under the frame is custom because the browser's own controls
 * would drop a grey pill into a page that has none — so progress, timecode and
 * seeking are wired here rather than delegated.
 */
export default function initVideo() {
let _dead=false,_rafId=0;
const _win=[],_els=[],_timers=[],_obs=[];

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_M=matchMedia('(max-width:768px)').matches;

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const on=(el,t,h,o)=>{ if(!el) return; el.addEventListener(t,h,o); _els.push([el,t,h]); };
const pad=(n,w)=>String(Math.floor(n)).padStart(w,'0');

const secs=[...document.querySelectorAll('[data-bg]')];
const bg=document.getElementById('vbg');
const line=document.getElementById('vline');
const rail=document.getElementById('vrail');

/* ---------- rail ---------- */
if(rail && secs.length){
  rail.innerHTML=secs.map((s,i)=>`<button type="button" data-i="${i}"><i></i></button>`).join('');
  [...rail.children].forEach((b,i)=>b.setAttribute('aria-label',secs[i].dataset.label||('Section '+(i+1))));
  on(rail,'click',e=>{
    const b=e.target.closest('button'); if(!b) return;
    const s=secs[+b.dataset.i];
    if(s) s.scrollIntoView({behavior:reduced?'auto':'smooth'});
  });
}
const railBtns=rail?[...rail.children]:[];

/* ---------- geometry, measured rather than read per frame ---------- */
let Y=scrollY,dirty=true,VH=innerHeight,DOCH=1;
let TOPS=[],lastSec=-1;

const offTop=el=>{ let y=0,n=el; while(n){ y+=n.offsetTop; n=n.offsetParent; } return y; };

function measure(){
  VH=innerHeight;
  DOCH=document.documentElement.scrollHeight;
  TOPS=secs.map(offTop);
  dirty=true;
}

function render(){
  if(line) line.style.width=clamp(Y/(DOCH-VH||1),0,1)*100+'%';
  const mid=Y+VH*0.5;
  let cur=0;
  for(let i=0;i<TOPS.length;i++){ if(mid>=TOPS[i]) cur=i; }
  if(cur!==lastSec){
    lastSec=cur;
    railBtns.forEach((b,j)=>b.classList.toggle('on',j===cur));
    const surface=secs[cur]&&secs[cur].dataset.bg;
    if(bg&&surface) bg.style.backgroundColor=surface;
    if(rail) rail.classList.toggle('ondark',secs[cur].classList.contains('dark')||surface==='#0B0B0C');
  }
}

const onScroll=()=>{ dirty=true; };
addEventListener('scroll',onScroll,{passive:true}); _win.push(['scroll',onScroll]);

const onResize=()=>measure();
addEventListener('resize',onResize,{passive:true}); _win.push(['resize',onResize]);

/* Orientation change reports the old viewport for a beat on iOS, so remeasure
   once it has settled rather than immediately. */
const onOrient=()=>{ _timers.push(setTimeout(measure,250)); };
addEventListener('orientationchange',onOrient,{passive:true}); _win.push(['orientationchange',onOrient]);

const onVis=()=>{ if(!document.hidden) measure(); };
on(document,'visibilitychange',onVis);

const onLoad=()=>{ _timers.push(setTimeout(measure,300)); };
addEventListener('load',onLoad,{once:true}); _win.push(['load',onLoad]);

/* ---------- reveal ---------- */
if(reduced){
  secs.forEach(s=>s.classList.add('in'));
}else{
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  },{threshold:0.1,rootMargin:'0px 0px -8% 0px'});
  secs.forEach(s=>io.observe(s));
  _obs.push(io);
  /* The hero is already on screen at mount, so the observer would not fire
     for it until the first scroll. */
  if(secs[0]) secs[0].classList.add('in');
}

/* ---------- showreel ---------- */
const rwrap=document.getElementById('rwrap');
const rvid=document.getElementById('rvid');
const rov=document.getElementById('rov');
const rprog=document.getElementById('rprog');
const rtc=document.getElementById('rtc');

if(rvid && rwrap){
  const bar=rprog?rprog.firstElementChild:null;
  const tc=s=>'TC '+pad(s/60,2)+':'+pad(s%60,2)+':'+pad((s%1)*24,2);
  /* Ambience and the real viewing are the same element in two modes. `armed`
     is which one we are in — it gates every handler below so the muted loop
     never drives the transport, and the transport never fights the loop. */
  let armed=false;

  const ambient=()=>{
    armed=false;
    rwrap.classList.remove('playing');
    rvid.muted=true; rvid.loop=true;
    if(rov) rov.setAttribute('aria-label','Play the showreel with sound');
  };

  /* The loop runs only where it is welcome: a phone on cellular should not
     pull the file uncommanded, and reduced motion means reduced motion. */
  if(!reduced && !IS_M){
    const vio=new IntersectionObserver(es=>{
      es.forEach(e=>{
        if(e.isIntersecting){ if(!armed) rvid.play().catch(()=>{}); }
        else rvid.pause();
      });
    },{threshold:0.25});
    vio.observe(rvid);
    _obs.push(vio);
  }

  /* The overlay both starts the reel and resumes it, so a paused film always
     has a focusable control rather than only a clickable frame. */
  on(rov,'click',()=>{
    if(!armed){
      armed=true;
      rvid.muted=false; rvid.loop=false; rvid.currentTime=0;
      rov.setAttribute('aria-label','Resume the showreel');
    }
    rvid.play().catch(()=>{});
  });

  /* Once committed, the frame itself is the pause target — the overlay is not
     in the way any more, so the click lands on the video. */
  on(rvid,'click',()=>{ if(armed && !rvid.paused) rvid.pause(); });

  on(rvid,'play',()=>{ if(armed) rwrap.classList.add('playing'); });
  on(rvid,'pause',()=>{ if(armed) rwrap.classList.remove('playing'); });

  on(rvid,'timeupdate',()=>{
    if(!armed) return;
    if(rtc) rtc.textContent=tc(rvid.currentTime||0);
    if(bar&&rvid.duration) bar.style.width=((rvid.currentTime/rvid.duration)*100)+'%';
  });

  /* Back to ambience at the end, so the section is never left on a dead frame. */
  on(rvid,'ended',()=>{
    ambient();
    rvid.currentTime=0;
    if(bar) bar.style.width='0%';
    if(rtc) rtc.textContent='TC 00:00:00';
    if(!reduced && !IS_M) rvid.play().catch(()=>{});
  });

  on(rprog,'click',e=>{
    const d=rvid.duration;
    if(!armed || !d) return;
    const r=rprog.getBoundingClientRect();
    rvid.currentTime=clamp((e.clientX-r.left)/r.width,0,1)*d;
  });
}

measure();

function loop(){
  if(_dead) return;
  if(!document.hidden && dirty){ dirty=false; Y=scrollY; render(); }
  _rafId=requestAnimationFrame(loop);
}
_rafId=requestAnimationFrame(loop);

return function cleanup(){
  _dead=true;
  cancelAnimationFrame(_rafId);
  _timers.forEach(clearTimeout);
  _obs.forEach(o=>{ try{ o.disconnect(); }catch(e){} });
  _win.forEach(([t,h])=>removeEventListener(t,h));
  _els.forEach(([el,t,h])=>{ try{ el.removeEventListener(t,h); }catch(e){} });
  /* The element outlives this init on a client-side route change, so stop it
     rather than leaving a detached video decoding in the background. */
  try{ if(rvid) rvid.pause(); }catch(e){}
};
}
