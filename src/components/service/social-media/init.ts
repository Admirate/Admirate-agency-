// @ts-nocheck

import { REEL_COUNT } from "./content";

/**
 * SOCIAL MEDIA page engine.
 *
 * FEED is the set-piece: the phone's reel track is translated as the section is
 * scrubbed, so the visitor advances the feed with the same gesture they would
 * use on the real thing. The hero phone runs the same track on a slow timer,
 * since there is nothing to scrub against above the fold.
 */
export default function initSocial() {
let _dead=false,_rafId=0;
const _win=[],_els=[],_timers=[],_obs=[];

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_M=matchMedia('(max-width:768px)').matches;
const staticScrub=reduced||IS_M||matchMedia('(max-height:600px)').matches;

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);
const on=(el,t,h,o)=>{ if(!el) return; el.addEventListener(t,h,o); _els.push([el,t,h]); };

const secs=[...document.querySelectorAll('[data-bg]')];
const bg=document.getElementById('smbg');
const line=document.getElementById('smline');
const rail=document.getElementById('smrail');
const feed=document.getElementById('feed');
const fsteps=[...document.querySelectorAll('.fstep')];
const fprog=[...document.querySelectorAll('.fprog i')];
const freel=document.getElementById('freel');
const freelBar=document.getElementById('freelbar');
const hreel=document.getElementById('hreel');
const hreelBar=document.getElementById('hreelbar');

/* ---------- rail ---------- */
if(rail && secs.length){
  rail.innerHTML=secs.map((s,i)=>`<button type="button" data-i="${i}"><i></i></button>`).join('');
  [...rail.children].forEach((b,i)=>b.setAttribute('aria-label',secs[i].dataset.label||('Section '+(i+1))));
  on(rail,'click',e=>{
    const b=e.target.closest('button'); if(!b) return;
    const s=secs[+b.dataset.i]; if(s) s.scrollIntoView({behavior:reduced?'auto':'smooth'});
  });
}
const railBtns=rail?[...rail.children]:[];

/* ---------- geometry ---------- */
let Y=scrollY,dirty=true,VH=innerHeight,DOCH=1;
let TOPS=[],FTOP=0,FH=1,lastSec=-1,lastStage=-1;
const offTop=el=>{ let y=0,n=el; while(n){ y+=n.offsetTop; n=n.offsetParent; } return y; };

function measure(){
  VH=innerHeight;
  DOCH=document.documentElement.scrollHeight;
  TOPS=secs.map(offTop);
  if(feed){ FTOP=offTop(feed); FH=feed.offsetHeight||1; }
  dirty=true;
}

function setStage(i){
  if(i===lastStage) return;
  lastStage=i;
  fsteps.forEach((s,j)=>s.classList.toggle('on',j===i));
  fprog.forEach((p,j)=>p.classList.toggle('on',j<=i));
  if(freel) freel.style.transform=`translateY(${-i*100}%)`;
  if(freelBar) freelBar.style.width=(((i+1)/REEL_COUNT)*100)+'%';
}

function render(){
  if(line) line.style.width=(clamp(Y/((DOCH-VH)||1),0,1)*100)+'%';

  const mid=Y+VH*0.5;
  let cur=0;
  for(let i=0;i<TOPS.length;i++){ if(mid>=TOPS[i]) cur=i; }
  if(cur!==lastSec){
    lastSec=cur;
    railBtns.forEach((b,j)=>b.classList.toggle('on',j===cur));
    const surface=secs[cur] && secs[cur].dataset.bg;
    if(bg && surface) bg.style.backgroundColor=surface;
    if(rail) rail.classList.toggle('ondark',secs[cur].classList.contains('dark'));
  }

  if(!staticScrub && feed){
    const p=seg(Y,FTOP,FTOP+FH-VH);
    const t=seg(p,0.06,0.94);
    setStage(Math.min(REEL_COUNT-1,Math.floor(t*REEL_COUNT)));
  }
}

/* ---------- listeners ---------- */
const onScroll=()=>{dirty=true;};
addEventListener('scroll',onScroll,{passive:true}); _win.push(['scroll',onScroll]);
const onResize=()=>measure();
addEventListener('resize',onResize,{passive:true}); _win.push(['resize',onResize]);
const onOrient=()=>{_timers.push(setTimeout(measure,250));};
addEventListener('orientationchange',onOrient,{passive:true}); _win.push(['orientationchange',onOrient]);
const onVis=()=>{ if(!document.hidden) measure(); };
on(document,'visibilitychange',onVis);
const onLoad=()=>{_timers.push(setTimeout(measure,300));};
addEventListener('load',onLoad,{once:true}); _win.push(['load',onLoad]);

/* ---------- reveal ---------- */
if(reduced){
  secs.forEach(s=>s.classList.add('in'));
  fsteps.forEach(s=>s.classList.add('on'));
}else{
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  },{threshold:.1,rootMargin:'0px 0px -8% 0px'});
  secs.forEach(s=>io.observe(s));
  _obs.push(io);
  if(secs[0]) secs[0].classList.add('in');
}

if(staticScrub){
  fsteps.forEach(s=>s.classList.add('on'));
  if(freelBar) freelBar.style.width='100%';
}else{
  setStage(0);
}

/* ---------- hero phone: advances on its own ----------
   There is nothing to scrub against above the fold, so the hero reel runs on a
   slow interval. Paused while the tab is hidden, and never started at all under
   reduced motion. */
if(hreel && !reduced){
  let i=0;
  const tick=()=>{
    if(_dead) return;
    if(!document.hidden){
      i=(i+1)%REEL_COUNT;
      hreel.style.transform=`translateY(${-i*100}%)`;
      if(hreelBar) hreelBar.style.width=(((i+1)/REEL_COUNT)*100)+'%';
    }
    _timers.push(setTimeout(tick,3400));
  };
  if(hreelBar) hreelBar.style.width=(100/REEL_COUNT)+'%';
  _timers.push(setTimeout(tick,3400));
}else if(hreelBar){
  hreelBar.style.width='100%';
}

/* ---------- loop ---------- */
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
