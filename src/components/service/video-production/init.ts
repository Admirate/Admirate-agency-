// @ts-nocheck

import { SCENE_COUNT, RATIO_SPECS } from "./content";

/**
 * VIDEO PRODUCTION page engine.
 *
 * TIMELINE is the set-piece: scroll drives a playhead across a real track, the
 * timecode counts in frames, and scenes cut as the head crosses each clip. The
 * clip widths are the flex values in the markup, so the playhead and the clips
 * cannot disagree — both are read from the laid-out DOM once, in measure().
 */
export default function initVideo() {
let _dead=false,_rafId=0;
const _win=[],_els=[],_timers=[],_obs=[];

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_M=matchMedia('(max-width:768px)').matches;
const staticScrub=reduced||IS_M||matchMedia('(max-height:600px)').matches;

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);
const on=(el,t,h,o)=>{ if(!el) return; el.addEventListener(t,h,o); _els.push([el,t,h]); };
const pad=(n,w)=>String(Math.floor(n)).padStart(w,'0');

const secs=[...document.querySelectorAll('[data-bg]')];
const bg=document.getElementById('vbg');
const line=document.getElementById('vline');
const rail=document.getElementById('vrail');
const tl=document.getElementById('tl');
const scenes=[...document.querySelectorAll('.mon .scene')];
const clips=[...document.querySelectorAll('.track .clip')];
const play=document.getElementById('play');
const tcode=document.getElementById('tcode');

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
let TOPS=[],TLTOP=0,TLH=1,lastSec=-1,lastScene=-1;
/* Clip boundaries as fractions of the track, read once from layout. */
let BOUNDS=[];
const offTop=el=>{ let y=0,n=el; while(n){ y+=n.offsetTop; n=n.offsetParent; } return y; };

function measure(){
  VH=innerHeight;
  DOCH=document.documentElement.scrollHeight;
  TOPS=secs.map(offTop);
  if(tl){ TLTOP=offTop(tl); TLH=tl.offsetHeight||1; }
  if(clips.length){
    const total=clips.reduce((a,c)=>a+c.offsetWidth,0)||1;
    let acc=0;
    BOUNDS=clips.map(c=>{ acc+=c.offsetWidth; return acc/total; });
  }
  dirty=true;
}

/** The whole film is 48 seconds; timecode is displayed at 24fps. */
const DUR=48;
function setPlayhead(t){
  if(play) play.style.left=(t*100)+'%';
  if(tcode){
    const s=t*DUR;
    tcode.textContent='TC '+pad(s/60,2)+':'+pad(s%60,2)+':'+pad((s%1)*24,2);
  }
  let i=0;
  for(let j=0;j<BOUNDS.length;j++){ if(t>=BOUNDS[j]) i=Math.min(BOUNDS.length-1,j+1); }
  if(i!==lastScene){
    lastScene=i;
    scenes.forEach((s,j)=>s.classList.toggle('on',j===i));
    clips.forEach((c,j)=>c.classList.toggle('on',j===i));
  }
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

  if(!staticScrub && tl){
    const p=seg(Y,TLTOP,TLTOP+TLH-VH);
    setPlayhead(seg(p,0.05,0.95));
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
  scenes.forEach(s=>s.classList.add('on'));
}else{
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  },{threshold:.1,rootMargin:'0px 0px -8% 0px'});
  secs.forEach(s=>io.observe(s));
  _obs.push(io);
  if(secs[0]) secs[0].classList.add('in');
}

if(staticScrub){
  /* The track is hidden at this size and the scenes stack, so every scene is
     shown and the timecode reports the full running length rather than 0. */
  scenes.forEach(s=>s.classList.add('on'));
  if(tcode) tcode.textContent='TC 00:48:00';
}else{
  setPlayhead(0);
}

/* ---------- SET PIECE: ratio recut ---------- */
const tabs=document.getElementById('rtabs');
const frame=document.getElementById('rframe');
const rcap=document.getElementById('rcap');
if(tabs && frame){
  const rt=frame.querySelector('.rt');
  on(tabs,'click',e=>{
    const b=e.target.closest('button'); if(!b||_dead) return;
    const spec=RATIO_SPECS.find(r=>r.k===b.dataset.k); if(!spec) return;
    [...tabs.children].forEach(c=>c.classList.toggle('on',c===b));
    frame.style.width=spec.w+'%';
    frame.style.aspectRatio=(spec.w/spec.h).toFixed(4);
    if(rt) rt.style.fontSize=spec.fs+'px';
    if(rcap) rcap.textContent=spec.cap;
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
