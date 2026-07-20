// @ts-nocheck

import { FIXATIONS } from "./content";

/**
 * DESIGN page engine.
 *
 * GAZE is the set-piece: a dot travels the composition along the four fixation
 * points as the section is scrolled, drawing its own trail, lighting each
 * element only when the eye reaches it. The order is the section's argument, so
 * it is driven by real scroll position rather than a timed loop — the reader
 * controls the pace at which the claim is made.
 *
 * Cached geometry, dirty-flag rAF, and a cleanup() that removes everything.
 */
export default function initDesign() {
let _dead=false,_rafId=0;
const _win=[],_els=[],_timers=[],_obs=[];

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_M=matchMedia('(max-width:768px)').matches;
const staticScrub=reduced||IS_M||matchMedia('(max-height:600px)').matches;

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);
const on=(el,t,h,o)=>{ if(!el) return; el.addEventListener(t,h,o); _els.push([el,t,h]); };

/* ---------- elements ---------- */
const secs=[...document.querySelectorAll('[data-bg]')];
const bg=document.getElementById('dgbg');
const line=document.getElementById('dgline');
const rail=document.getElementById('dgrail');
const gaze=document.getElementById('gaze');
const gsteps=[...document.querySelectorAll('.gstep')];
const gprog=[...document.querySelectorAll('.gprog i')];
const gdot=document.getElementById('gdot');
const glive=document.getElementById('glive');
const gtrail=document.getElementById('gtrail');
const gfix=FIXATIONS.map((_,i)=>document.getElementById('gfix'+i));
const cels=[...document.querySelectorAll('.comp .cel')];

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

/* ---------- gaze path ----------
   The svg is viewBox "0 0 100 75" with preserveAspectRatio="none", so an x
   percentage maps straight onto the x axis and a y percentage scales by .75. */
const P=FIXATIONS.map(f=>({x:f.x,y:f.y*0.75}));
const fullD=P.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' ');
if(gtrail) gtrail.setAttribute('d',fullD);

/** Length-proportional position along the polyline for t in 0..1. */
function pointAt(t){
  const segs=P.length-1;
  const raw=clamp(t,0,1)*segs;
  const i=Math.min(segs-1,Math.floor(raw));
  const f=raw-i;
  return {
    x:P[i].x+(P[i+1].x-P[i].x)*f,
    y:P[i].y+(P[i+1].y-P[i].y)*f,
    idx:i,
    f,
  };
}

function drawGaze(t){
  const at=pointAt(t);
  /* the drawn portion: every completed vertex, then the partial leg */
  let d='M'+P[0].x+' '+P[0].y;
  for(let i=1;i<=at.idx;i++) d+=' L'+P[i].x+' '+P[i].y;
  d+=' L'+at.x+' '+at.y;
  if(glive) glive.setAttribute('d',d);
  if(gdot){
    gdot.style.left=at.x+'%';
    gdot.style.top=(at.y/0.75)+'%';
  }
  /* A fixation counts as reached once the dot is on or past it. */
  const reached=at.f>0.55?at.idx+1:at.idx;
  gfix.forEach((el,i)=>el && el.classList.toggle('on',i<=reached));
  cels.forEach(c=>{
    const f=+c.dataset.f;
    c.classList.toggle('hit',f<=reached);
  });
  return reached;
}

let lastStep=-1;
function setStep(i){
  if(i===lastStep) return;
  lastStep=i;
  gsteps.forEach((s,j)=>s.classList.toggle('on',j===i));
  gprog.forEach((p,j)=>p.classList.toggle('on',j<=i));
}

/* ---------- cached geometry ---------- */
let Y=scrollY,dirty=true,VH=innerHeight,DOCH=1;
let TOPS=[],GTOP=0,GH=1,lastSec=-1;
const offTop=el=>{ let y=0,n=el; while(n){ y+=n.offsetTop; n=n.offsetParent; } return y; };

function measure(){
  VH=innerHeight;
  DOCH=document.documentElement.scrollHeight;
  TOPS=secs.map(offTop);
  if(gaze){ GTOP=offTop(gaze); GH=gaze.offsetHeight||1; }
  dirty=true;
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

  if(!staticScrub && gaze){
    /* Hold briefly at each end so the first and last fixations are readable
       rather than flashing past as the section enters and leaves. */
    const p=seg(Y,GTOP,GTOP+GH-VH);
    const t=seg(p,0.08,0.92);
    setStep(drawGaze(t));
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
}else{
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  },{threshold:.1,rootMargin:'0px 0px -8% 0px'});
  secs.forEach(s=>io.observe(s));
  _obs.push(io);
  if(secs[0]) secs[0].classList.add('in');
}

/* Where the scrub cannot run, the composition is shown complete rather than
   frozen at fixation one, and every step is readable. */
if(staticScrub){
  if(glive) glive.setAttribute('d',fullD);
  gfix.forEach(el=>el && el.classList.add('on'));
  cels.forEach(c=>c.classList.add('hit'));
  gsteps.forEach(s=>s.classList.add('on'));
}else{
  drawGaze(0);
  setStep(0);
}

/* ---------- SET PIECE: hierarchy toggle ---------- */
const tog=document.getElementById('htog');
const demo=document.getElementById('hdemo');
const cap=document.getElementById('hcap');
const CAPS={
  shout:'// FOUR ELEMENTS COMPETING. NOTHING WINS.',
  order:'// ONE ENTRY POINT. THE REST SUPPORTS IT.',
};
if(tog && demo){
  on(tog,'click',e=>{
    const b=e.target.closest('button'); if(!b||_dead) return;
    const m=b.dataset.m;
    [...tog.children].forEach(c=>c.classList.toggle('on',c===b));
    demo.classList.remove('shout','order');
    demo.classList.add(m);
    if(cap) cap.textContent=CAPS[m]||'';
  });
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
