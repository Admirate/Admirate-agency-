// @ts-nocheck

import { REEL_COUNT } from "./content";

/**
 * SOCIAL MEDIA page engine.
 *
 * The one moving part of its own is the hero phone, and it runs in one of two
 * modes:
 *
 *   scrub  the hero is pinned (see `#shero .spin` in content.ts) and its extra
 *          height is spent dragging the reel track under the screen, so the
 *          reels advance with the visitor's scroll rather than on a clock —
 *          the same handling the landing page gives its #reels section
 *   timer  the hero is an ordinary one-viewport section and a reel advances
 *          every 3.4s, which is what the page did everywhere before
 *
 * Which one applies is a media query, not a one-time reading, so rotating a
 * tablet or dragging a window across the breakpoint switches cleanly instead of
 * leaving a scrub transform stranded on an unpinned hero. Under reduced motion
 * it is always `timer`, which in that case holds on the first reel with the bar
 * already full.
 *
 * The route diagram draws itself from CSS off the section's `.in` class, and
 * the work strip is a marquee, so neither needs a frame of JavaScript.
 */
export default function initSocial() {
let _dead=false,_rafId=0;
const _win=[],_els=[],_timers=[],_obs=[];

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const on=(el,t,h,o)=>{ if(!el) return; el.addEventListener(t,h,o); _els.push([el,t,h]); };

const secs=[...document.querySelectorAll('[data-bg]')];
const bg=document.getElementById('smbg');
const line=document.getElementById('smline');
const rail=document.getElementById('smrail');
const hreel=document.getElementById('hreel');
const hreelBar=document.getElementById('hreelbar');
const fone=hreel?hreel.closest('.fone'):null;
const hero=document.getElementById('shero');

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
let heroTop=0,heroH=1;

const offTop=el=>{ let y=0,n=el; while(n){ y+=n.offsetTop; n=n.offsetParent; } return y; };

function measure(){
  VH=innerHeight;
  DOCH=document.documentElement.scrollHeight;
  TOPS=secs.map(offTop);
  /* Held separately from TOPS because the scrub needs the hero's height as
     well as its top, and it is the one section whose height is scroll
     distance rather than content. */
  if(hero){ heroTop=offTop(hero); heroH=hero.offsetHeight; }
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
    if(rail) rail.classList.toggle('ondark',secs[cur].classList.contains('dark'));
  }
  renderHero();
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

/* ---------- hero phone ---------- */
/* Mirrors the media queries that pin `#shero` in content.ts. If that breakpoint
   moves, this has to move with it — a scrubbing phone on an unpinned hero would
   scroll its reels past in the fraction of a screen the hero now occupies. */
const scrubMQ=matchMedia('(min-width:901px) and (min-height:601px)');

let heroMode=null,scrubbing=false,heroTimer=0;

const stopTimer=()=>{ if(heroTimer){ clearTimeout(heroTimer); heroTimer=0; } };

function startTimer(){
  stopTimer();
  if(hreel) hreel.style.transform='translateY(0%)';
  /* Reduced motion holds on the first reel with the bar already full, rather
     than advancing on any clock at all. */
  if(reduced){ if(hreelBar) hreelBar.style.width='100%'; return; }
  let i=0;
  if(hreelBar) hreelBar.style.width=(100/REEL_COUNT)+'%';
  const tick=()=>{
    if(_dead) return;
    /* Skip the advance while the tab is hidden, so returning to it does not
       land mid-transition on a reel the visitor never saw start. */
    if(!document.hidden){
      i=(i+1)%REEL_COUNT;
      hreel.style.transform=`translateY(${-i*100}%)`;
      if(hreelBar) hreelBar.style.width=((i+1)/REEL_COUNT)*100+'%';
    }
    heroTimer=setTimeout(tick,3400);
  };
  heroTimer=setTimeout(tick,3400);
}

/* One reel per screen of pinned scroll: with three reels the track travels two
   of its own heights over the hero's spare height. */
function renderHero(){
  if(!scrubbing||!hreel) return;
  const pr=clamp((Y-heroTop)/((heroH-VH)||1),0,1);
  hreel.style.transform=`translateY(${-pr*(REEL_COUNT-1)*100}%)`;
  if(hreelBar) hreelBar.style.width=(pr*100)+'%';
  /* The slow counter-rotation the landing phone makes as it is scrolled past.
     Kept small — the phone is beside a headline here, not centred on a stage. */
  if(fone) fone.style.transform=`rotate(${(1.6-3.2*pr).toFixed(2)}deg)`;
}

function setHeroMode(){
  if(!hreel) return;
  const mode=(scrubMQ.matches&&!reduced)?'scrub':'timer';
  if(mode===heroMode) return;
  heroMode=mode;
  scrubbing=mode==='scrub';
  if(fone) fone.classList.toggle('scrubbing',scrubbing);
  if(scrubbing){
    stopTimer();
    renderHero();
  }else{
    /* Drop the scrub's leftovers before the timer takes over, or the phone
       keeps whatever rotation it was pinned at. */
    if(fone) fone.style.transform='';
    startTimer();
  }
}

const onScrubMQ=()=>{ measure(); setHeroMode(); dirty=true; };
on(scrubMQ,'change',onScrubMQ);

measure();
setHeroMode();

function loop(){
  if(_dead) return;
  if(!document.hidden && dirty){ dirty=false; Y=scrollY; render(); }
  _rafId=requestAnimationFrame(loop);
}
_rafId=requestAnimationFrame(loop);

return function cleanup(){
  _dead=true;
  cancelAnimationFrame(_rafId);
  /* The reel timer re-arms itself each tick, so it is held on its own handle
     rather than accumulating one entry per tick in _timers for the lifetime of
     the page. */
  stopTimer();
  _timers.forEach(clearTimeout);
  _obs.forEach(o=>{ try{ o.disconnect(); }catch(e){} });
  _win.forEach(([t,h])=>removeEventListener(t,h));
  _els.forEach(([el,t,h])=>{ try{ el.removeEventListener(t,h); }catch(e){} });
};
}
