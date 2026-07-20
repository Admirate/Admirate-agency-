// @ts-nocheck

/**
 * DIGITAL page engine.
 *
 * Two set-pieces:
 *   RACE   two load bars run on demand, counting elapsed time. Deliberately no
 *          conversion or bounce percentages — the repo holds no such data, and
 *          an invented "you lose N% of visitors" is a claim on a public page
 *          the studio would have to defend. Elapsed seconds are the honest
 *          version, and they make the point without inventing anything.
 *   BUILD  a browser assembles a page in four scroll-driven stages.
 */
export default function initDigital() {
let _dead=false,_rafId=0,_raceRaf=0;
const _win=[],_els=[],_timers=[],_obs=[];

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const IS_M=matchMedia('(max-width:768px)').matches;
const staticScrub=reduced||IS_M||matchMedia('(max-height:600px)').matches;

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);
const on=(el,t,h,o)=>{ if(!el) return; el.addEventListener(t,h,o); _els.push([el,t,h]); };

const secs=[...document.querySelectorAll('[data-bg]')];
const bg=document.getElementById('dgbg');
const line=document.getElementById('dgline');
const rail=document.getElementById('dgrail');
const build=document.getElementById('build');
const bsteps=[...document.querySelectorAll('.bstep')];
const bprog=[...document.querySelectorAll('.bprog i')];
const bels=[...document.querySelectorAll('#bview .el')];
const bview=document.getElementById('bview');
const bload=document.getElementById('bload');
const bmeter=document.getElementById('bmeter');

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
let TOPS=[],BTOP=0,BH=1,lastSec=-1,lastStage=-1;
const offTop=el=>{ let y=0,n=el; while(n){ y+=n.offsetTop; n=n.offsetParent; } return y; };

function measure(){
  VH=innerHeight;
  DOCH=document.documentElement.scrollHeight;
  TOPS=secs.map(offTop);
  if(build){ BTOP=offTop(build); BH=build.offsetHeight||1; }
  dirty=true;
}

/* Elements appear cumulatively: 2 by stage 0, then 4, 5, all six dressed. */
const STAGE_ELS=[2,4,5,6];
function setStage(i,p){
  if(bload) bload.style.width=(clamp(p,0,1)*100).toFixed(0)+'%';
  if(bmeter) bmeter.textContent=(clamp(p,0,1)*100).toFixed(0)+'%';
  if(i===lastStage) return;
  lastStage=i;
  bsteps.forEach((s,j)=>s.classList.toggle('on',j===i));
  bprog.forEach((b,j)=>b.classList.toggle('on',j<=i));
  const show=STAGE_ELS[i]||0;
  bels.forEach((el,j)=>el.classList.toggle('on',j<show));
  if(bview) bview.classList.toggle('done',i>=3);
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

  if(!staticScrub && build){
    const p=seg(Y,BTOP,BTOP+BH-VH);
    const t=seg(p,0.06,0.94);
    setStage(Math.min(3,Math.floor(t*4)),t);
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
  bels.forEach(el=>el.classList.add('on'));
  bsteps.forEach(s=>s.classList.add('on'));
  if(bview) bview.classList.add('done');
  if(bload) bload.style.width='100%';
  if(bmeter) bmeter.textContent='100%';
}else{
  setStage(0,0);
}

/* ---------- SET PIECE: the load race ---------- */
const go=document.getElementById('rgo');
const bf=document.getElementById('rbf'), bs=document.getElementById('rbs');
const mf=document.getElementById('rmsf'), ms=document.getElementById('rmss');
const nf=document.getElementById('rnf'), ns=document.getElementById('rns');

if(go && bf && bs){
  /* Illustrative durations, labelled as such in the copy — not measurements of
     any particular site. */
  const FAST=900, SLOW=5200, TOTAL=SLOW;

  const paint=(el,ms2,dur)=>{ el.style.width=(clamp(ms2/dur,0,1)*100)+'%'; };

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
      if(mf) mf.textContent=(Math.min(e,FAST)/1000).toFixed(1)+'s';
      if(ms) ms.textContent=(Math.min(e,SLOW)/1000).toFixed(1)+'s';
      if(nf && e>=FAST && !nf.textContent) nf.textContent='// READABLE. THE VISITOR IS ALREADY READING.';
      if(ns && e<SLOW && !ns.textContent) ns.textContent='// STILL BLANK.';
      if(e<TOTAL){ _raceRaf=requestAnimationFrame(step); }
      else{
        if(ns) ns.textContent='// ARRIVED — LONG AFTER THE DECISION WAS MADE.';
        go.disabled=false;
        go.innerHTML='Run it again <span>→</span>';
      }
    })();
  };
  on(go,'click',run);
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
  cancelAnimationFrame(_raceRaf);
  _timers.forEach(clearTimeout);
  _obs.forEach(o=>{ try{ o.disconnect(); }catch(e){} });
  _win.forEach(([t,h])=>removeEventListener(t,h));
  _els.forEach(([el,t,h])=>{ try{ el.removeEventListener(t,h); }catch(e){} });
};
}
