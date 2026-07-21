// @ts-nocheck

import { REEL_COUNT } from "./content";

/**
 * SOCIAL MEDIA page engine.
 *
 * The one moving part of its own is the hero phone, which advances a reel
 * every 3.4s on a timer rather than on scroll — it is meant to play while the
 * visitor reads the headline beside it. Under reduced motion it holds on the
 * first reel with the bar already full.
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

/* ---------- hero phone ---------- */
if(hreel && !reduced){
  let i=0;
  const tick=()=>{
    if(_dead) return;
    /* Skip the advance while the tab is hidden, so returning to it does not
       land mid-transition on a reel the visitor never saw start. */
    if(!document.hidden){
      i=(i+1)%REEL_COUNT;
      hreel.style.transform=`translateY(${-i*100}%)`;
      if(hreelBar) hreelBar.style.width=((i+1)/REEL_COUNT)*100+'%';
    }
    _timers.push(setTimeout(tick,3400));
  };
  if(hreelBar) hreelBar.style.width=(100/REEL_COUNT)+'%';
  _timers.push(setTimeout(tick,3400));
}else if(hreelBar){
  hreelBar.style.width='100%';
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
};
}
