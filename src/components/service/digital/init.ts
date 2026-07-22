// @ts-nocheck

/**
 * DIGITAL page engine.
 *
 * RACE is the one set-piece: two load bars run on demand, counting elapsed
 * time. Deliberately no conversion or bounce percentages — the repo holds no
 * such data, and an invented "you lose N% of visitors" is a claim on a public
 * page the studio would have to defend. Elapsed seconds are the honest
 * version, and they make the point without inventing anything.
 *
 * The journey diagram draws itself from CSS off the section's `.in` class.
 *
 * THE WORK is the shared client showcase (shared/showcase.ts) — it owns its
 * own listeners and teardown, so all this page does is start it and stop it.
 */
import { initShowcase } from "@/components/shared/showcase";

export default function initDigital() {
let _dead=false,_rafId=0,_raceRaf=0;
const _win=[],_els=[],_timers=[],_obs=[];

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const on=(el,t,h,o)=>{ if(!el) return; el.addEventListener(t,h,o); _els.push([el,t,h]); };

const secs=[...document.querySelectorAll('[data-bg]')];
const bg=document.getElementById('dgbg');
const line=document.getElementById('dgline');
const rail=document.getElementById('dgrail');

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
    if(rail) rail.classList.toggle('ondark',secs[cur].classList.contains('dark'));
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

/* ---------- SET PIECE: the race ---------- */
const go=document.getElementById('rgo');
const bf=document.getElementById('rbf'),bs=document.getElementById('rbs');
const mf=document.getElementById('rmsf'),ms=document.getElementById('rmss');
const nf=document.getElementById('rnf'),ns=document.getElementById('rns');

if(go && bf && bs){
  const FAST=900,SLOW=5200,TOTAL=SLOW;
  const paint=(el,ms2,dur)=>{ el.style.width=clamp(ms2/dur,0,1)*100+'%'; };
  const run=()=>{
    if(_dead) return;
    go.disabled=true;
    if(nf) nf.textContent='';
    if(ns) ns.textContent='';
    const t0=performance.now();
    (function step(now){
      if(_dead) return;
      const e=(now||performance.now())-t0;
      paint(bf,Math.min(e,FAST),FAST);
      paint(bs,Math.min(e,SLOW),SLOW);
      if(mf) mf.textContent=(Math.min(e,FAST)/1e3).toFixed(1)+'s';
      if(ms) ms.textContent=(Math.min(e,SLOW)/1e3).toFixed(1)+'s';
      if(nf && e>=FAST && !nf.textContent) nf.textContent='// READABLE. THE VISITOR IS ALREADY READING.';
      if(ns && e<SLOW && !ns.textContent) ns.textContent='// STILL BLANK.';
      if(e<TOTAL){
        _raceRaf=requestAnimationFrame(step);
      }else{
        if(ns) ns.textContent='// ARRIVED — LONG AFTER THE DECISION WAS MADE.';
        go.disabled=false;
        go.innerHTML='Run it again <span>→</span>';
      }
    })();
  };
  on(go,'click',run);
}

measure();

function loop(){
  if(_dead) return;
  if(!document.hidden && dirty){ dirty=false; Y=scrollY; render(); }
  _rafId=requestAnimationFrame(loop);
}
_rafId=requestAnimationFrame(loop);

/* This page has no custom cursor, so the rail needs no re-binding when the
   dashboard roster replaces it. */
const stopShowcase=initShowcase();

return function cleanup(){
  _dead=true;
  cancelAnimationFrame(_rafId);
  cancelAnimationFrame(_raceRaf);
  stopShowcase();
  _timers.forEach(clearTimeout);
  _obs.forEach(o=>{ try{ o.disconnect(); }catch(e){} });
  _win.forEach(([t,h])=>removeEventListener(t,h));
  _els.forEach(([el,t,h])=>{ try{ el.removeEventListener(t,h); }catch(e){} });
};
}
