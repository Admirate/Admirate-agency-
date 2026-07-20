// @ts-nocheck

import { OBJECT_COUNT } from "./content";

/**
 * BRAND COLLATERALS page engine.
 *
 * SHELF is the scroll set-piece: one object at a time rises and settles under
 * the light as the section is scrubbed.
 *
 * PRESS is a pointer set-piece: a draggable divider between a colour as
 * approved on screen and the same ink on stock. It is keyboard-operable as
 * well — it carries role="slider", so arrow keys have to move it or the
 * control is a lie to anyone not using a mouse.
 */
export default function initCollaterals() {
let _dead=false,_rafId=0;
const _win=[],_els=[],_timers=[],_obs=[];

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_M=matchMedia('(max-width:768px)').matches;
const staticScrub=reduced||IS_M||matchMedia('(max-height:600px)').matches;

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);
const on=(el,t,h,o)=>{ if(!el) return; el.addEventListener(t,h,o); _els.push([el,t,h]); };

const secs=[...document.querySelectorAll('[data-bg]')];
const bg=document.getElementById('cbg');
const line=document.getElementById('cline');
const rail=document.getElementById('crail');
const shelf=document.getElementById('shelf');
const ssteps=[...document.querySelectorAll('.sstep')];
const sprog=[...document.querySelectorAll('.sprog i')];
const objs=[...document.querySelectorAll('.obj')];

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
let TOPS=[],STOP=0,SH=1,lastSec=-1,lastObj=-1;
const offTop=el=>{ let y=0,n=el; while(n){ y+=n.offsetTop; n=n.offsetParent; } return y; };

function measure(){
  VH=innerHeight;
  DOCH=document.documentElement.scrollHeight;
  TOPS=secs.map(offTop);
  if(shelf){ STOP=offTop(shelf); SH=shelf.offsetHeight||1; }
  dirty=true;
}

function setObj(i){
  if(i===lastObj) return;
  lastObj=i;
  ssteps.forEach((s,j)=>s.classList.toggle('on',j===i));
  sprog.forEach((p,j)=>p.classList.toggle('on',j<=i));
  objs.forEach((o,j)=>o.classList.toggle('on',j===i));
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
    /* #shelf carries no .dark class (it is not a .cs section), so the rail is
       told by the surface it is actually over. */
    if(rail) rail.classList.toggle('ondark',secs[cur].classList.contains('dark')||surface==='#0B0B0C');
  }

  if(!staticScrub && shelf){
    const p=seg(Y,STOP,STOP+SH-VH);
    const t=seg(p,0.06,0.94);
    setObj(Math.min(OBJECT_COUNT-1,Math.floor(t*OBJECT_COUNT)));
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

if(staticScrub){
  ssteps.forEach(s=>s.classList.add('on'));
  objs.forEach(o=>o.classList.add('on'));
}else{
  setObj(0);
}

/* ---------- SET PIECE: screen vs press ---------- */
const sw=document.getElementById('swatch');
const handle=document.getElementById('shandle');
if(sw && handle){
  const prn=sw.querySelector('.prn');
  let x=50;

  const apply=()=>{
    if(prn) prn.style.setProperty('--x',x+'%');
    handle.style.left=x+'%';
    sw.setAttribute('aria-valuenow',Math.round(x));
  };

  const fromEvent=e=>{
    const r=sw.getBoundingClientRect();
    const cx=(e.touches&&e.touches[0]?e.touches[0].clientX:e.clientX);
    x=clamp(((cx-r.left)/r.width)*100,0,100);
    apply();
  };

  let dragging=false;
  on(sw,'pointerdown',e=>{
    dragging=true;
    /* Capture so a fast drag that leaves the element keeps tracking, and so the
       matching pointerup always arrives here to clear the flag. */
    try{ sw.setPointerCapture(e.pointerId); }catch(err){}
    fromEvent(e);
  });
  on(sw,'pointermove',e=>{ if(dragging) fromEvent(e); });
  on(sw,'pointerup',e=>{
    dragging=false;
    try{ sw.releasePointerCapture(e.pointerId); }catch(err){}
  });
  on(sw,'pointercancel',()=>{ dragging=false; });

  on(sw,'keydown',e=>{
    const k=e.key;
    if(k!=='ArrowLeft'&&k!=='ArrowRight'&&k!=='Home'&&k!=='End') return;
    e.preventDefault();
    if(k==='ArrowLeft') x=clamp(x-4,0,100);
    else if(k==='ArrowRight') x=clamp(x+4,0,100);
    else if(k==='Home') x=0;
    else x=100;
    apply();
  });

  apply();
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
