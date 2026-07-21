// @ts-nocheck

import { STAGE_COUNT } from "./content";

/**
 * IDENTITY page engine.
 *
 * One set-piece is unique to this page: the philosophy scrub (#anat), which
 * steps through three stages as the section is scrolled — the mark picked out
 * of noise, echoed once it is gone, then left standing alone.
 *
 * A ring cursor trails the pointer on fine-pointer devices, widening over
 * anything marked data-h.
 *
 * Same discipline as the other public pages: geometry cached in measure(),
 * scroll only sets `dirty`, render() writes without reading, and cleanup()
 * tears down every rAF, timer, observer and listener.
 */
export default function initIdentity() {
let _dead=false,_rafId=0,_curRaf=0;
const _win=[],_els=[],_timers=[],_obs=[];

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_M=matchMedia('(max-width:768px)').matches;
const finePointer=matchMedia('(pointer:fine)').matches;
/* The philosophy scrub is pinned by CSS only above 768px and above 600px tall;
   below either it flows, so the scrub writes must not run. */
const staticScrub=reduced||IS_M||matchMedia('(max-height:600px)').matches;

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);
const on=(el,t,h,o)=>{ if(!el) return; el.addEventListener(t,h,o); _els.push([el,t,h]); };

/* ---------- ring cursor ---------- */
const cur=document.getElementById('idcur');
if(cur && finePointer && !reduced){
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  const move=e=>{ mx=e.clientX; my=e.clientY; };
  addEventListener('mousemove',move); _win.push(['mousemove',move]);
  (function ring(){
    if(_dead) return;
    /* Trails rather than tracks — the lag is the effect. */
    rx+=(mx-rx)*0.18; ry+=(my-ry)*0.18;
    cur.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    _curRaf=requestAnimationFrame(ring);
  })();
  document.querySelectorAll('[data-h]').forEach(el=>{
    on(el,'mouseenter',()=>document.body.classList.add('idhover'));
    on(el,'mouseleave',()=>document.body.classList.remove('idhover'));
  });
}else if(cur){
  cur.style.display='none';
}

const secs=[...document.querySelectorAll('[data-bg]')];
const bg=document.getElementById('idbg');
const line=document.getElementById('idline');
const rail=document.getElementById('idrail');
const anat=document.getElementById('anat');
const asteps=[...document.querySelectorAll('.astep')];
const aprog=[...document.querySelectorAll('.aprog i')];

/* ---------- rail ---------- */
if(rail && secs.length){
  rail.innerHTML=secs.map((s,i)=>`<button type="button" data-i="${i}"><i></i></button>`).join('');
  [...rail.children].forEach((b,i)=>{
    b.setAttribute('aria-label',secs[i].dataset.label||('Section '+(i+1)));
  });
  on(rail,'click',e=>{
    const b=e.target.closest('button'); if(!b) return;
    const s=secs[+b.dataset.i];
    if(s) s.scrollIntoView({behavior:reduced?'auto':'smooth'});
  });
}
const railBtns=rail?[...rail.children]:[];

/* ---------- geometry, measured rather than read per frame ---------- */
let Y=scrollY,dirty=true,VH=innerHeight,DOCH=1;
let TOPS=[],ATOP=0,AH=1,lastSec=-1,lastStage=-1;

const offTop=el=>{ let y=0,n=el; while(n){ y+=n.offsetTop; n=n.offsetParent; } return y; };

function measure(){
  VH=innerHeight;
  DOCH=document.documentElement.scrollHeight;
  TOPS=secs.map(offTop);
  if(anat){ ATOP=offTop(anat); AH=anat.offsetHeight||1; }
  dirty=true;
}

function setStage(i){
  if(i===lastStage) return;
  lastStage=i;
  asteps.forEach((s,j)=>s.classList.toggle('on',j===i));
  aprog.forEach((p,j)=>p.classList.toggle('on',j<=i));
  if(anat) anat.setAttribute('data-stage',String(i));
}

function render(){
  if(line) line.style.width=clamp(Y/(DOCH-VH||1),0,1)*100+'%';
  const mid=Y+VH*0.5;
  let cur2=0;
  for(let i=0;i<TOPS.length;i++){ if(mid>=TOPS[i]) cur2=i; }
  if(cur2!==lastSec){
    lastSec=cur2;
    railBtns.forEach((b,j)=>b.classList.toggle('on',j===cur2));
    const surface=secs[cur2]&&secs[cur2].dataset.bg;
    if(bg&&surface) bg.style.backgroundColor=surface;
    if(rail) rail.classList.toggle('ondark',secs[cur2].classList.contains('dark')||surface==='#0B0B0C');
  }
  if(!staticScrub && anat){
    /* Split the pinned run evenly across the stages. */
    const p=seg(Y,ATOP,ATOP+AH-VH);
    setStage(Math.min(STAGE_COUNT-1,Math.floor(p*STAGE_COUNT)));
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
setStage(0);

/* Where the scrub does not run, every stage is shown at once. */
if(staticScrub) asteps.forEach(s=>s.classList.add('on'));

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
  cancelAnimationFrame(_curRaf);
  _timers.forEach(clearTimeout);
  _obs.forEach(o=>{ try{ o.disconnect(); }catch(e){} });
  _win.forEach(([t,h])=>removeEventListener(t,h));
  _els.forEach(([el,t,h])=>{ try{ el.removeEventListener(t,h); }catch(e){} });
  document.body.classList.remove('idhover');
};
}
