// @ts-nocheck

import { FLASH_MARKS } from "./content";

/**
 * IDENTITY page engine.
 *
 * Two set-pieces are unique to this page:
 *   - the recognition test (#half), which shows a mark for 500ms and then asks
 *     the visitor to pick it out of four — the section's argument, playable;
 *   - the anatomy scrub (#anat), which strips the construction grid away in
 *     three stages as the section is scrolled through.
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
/* The anatomy scrub is pinned by CSS only above 768px and above 600px tall;
   below either it flows, so the scrub writes must not run. */
const staticScrub=reduced||IS_M||matchMedia('(max-height:600px)').matches;

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);
const on=(el,t,h,o)=>{ if(!el) return; el.addEventListener(t,h,o); _els.push([el,t,h]); };

/* ---------- cursor ---------- */
const cur=document.getElementById('idcur');
if(cur && finePointer && !reduced){
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  const move=e=>{mx=e.clientX;my=e.clientY;};
  addEventListener('mousemove',move); _win.push(['mousemove',move]);
  (function ring(){ if(_dead)return; rx+=(mx-rx)*.18; ry+=(my-ry)*.18;
    cur.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    _curRaf=requestAnimationFrame(ring); })();
  document.querySelectorAll('[data-h]').forEach(el=>{
    on(el,'mouseenter',()=>document.body.classList.add('idhover'));
    on(el,'mouseleave',()=>document.body.classList.remove('idhover'));
  });
}else if(cur){ cur.style.display='none'; }

/* ---------- elements ---------- */
const secs=[...document.querySelectorAll('[data-bg]')];
const bg=document.getElementById('idbg');
const line=document.getElementById('idline');
const rail=document.getElementById('idrail');
const anat=document.getElementById('anat');
const asteps=[...document.querySelectorAll('.astep')];
const aprog=[...document.querySelectorAll('.aprog i')];
const gridEls=['ag1','ag2','ag3','ag4','ag5'].map(id=>document.getElementById(id));
const dimEls=['ad1','ad2'].map(id=>document.getElementById(id));

/* ---------- rail ---------- */
if(rail && secs.length){
  /* Only the section index is interpolated; the label is set as text, never as
     markup, so a data-label can never inject an attribute. */
  rail.innerHTML=secs.map((s,i)=>`<button type="button" data-i="${i}"><i></i></button>`).join('');
  [...rail.children].forEach((b,i)=>{
    b.setAttribute('aria-label',secs[i].dataset.label||('Section '+(i+1)));
  });
  on(rail,'click',e=>{
    const b=e.target.closest('button'); if(!b) return;
    const s=secs[+b.dataset.i]; if(s) s.scrollIntoView({behavior:reduced?'auto':'smooth'});
  });
}
const railBtns=rail?[...rail.children]:[];

/* ---------- cached geometry ---------- */
let Y=scrollY,dirty=true,VH=innerHeight,DOCH=1;
let TOPS=[],HS=[],ATOP=0,AH=1,lastSec=-1,lastStage=-1;

const offTop=el=>{ let y=0,n=el; while(n){ y+=n.offsetTop; n=n.offsetParent; } return y; };

function measure(){
  VH=innerHeight;
  DOCH=document.documentElement.scrollHeight;
  TOPS=secs.map(offTop);
  HS=secs.map(s=>s.offsetHeight);
  if(anat){ ATOP=offTop(anat); AH=anat.offsetHeight||1; }
  dirty=true;
}

/* ---------- anatomy stages ----------
   0 — full construction grid + dimensions
   1 — outer geometry only
   2 — grid gone, mark stands alone */
function setStage(i){
  if(i===lastStage) return;
  lastStage=i;
  asteps.forEach((s,j)=>s.classList.toggle('on',j===i));
  aprog.forEach((p,j)=>p.classList.toggle('on',j<=i));
  gridEls.forEach((g,j)=>{
    if(!g) return;
    const show=i===0 ? true : (i===1 ? j<2 : false);
    g.classList.toggle('on',show);
  });
  dimEls.forEach(d=>d && d.classList.toggle('on',i===0));
}

/* ---------- render ---------- */
function render(){
  if(line) line.style.width=(clamp(Y/((DOCH-VH)||1),0,1)*100)+'%';

  const mid=Y+VH*0.5;
  let cur2=0;
  for(let i=0;i<TOPS.length;i++){ if(mid>=TOPS[i]) cur2=i; }
  if(cur2!==lastSec){
    lastSec=cur2;
    railBtns.forEach((b,j)=>b.classList.toggle('on',j===cur2));
    const surface=secs[cur2] && secs[cur2].dataset.bg;
    if(bg && surface) bg.style.backgroundColor=surface;
    if(rail) rail.classList.toggle('ondark',secs[cur2].classList.contains('dark')||surface==='#0B0B0C');
  }

  if(!staticScrub && anat){
    /* The section is 320vh tall and pinned; map the scrolled portion onto the
       three stages, with the last one holding until the section releases. */
    const p=seg(Y,ATOP,ATOP+AH-VH);
    setStage(p<0.34?0:(p<0.68?1:2));
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
  setStage(0);
  asteps.forEach(s=>s.classList.add('on'));
}else{
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
  },{threshold:.1,rootMargin:'0px 0px -8% 0px'});
  secs.forEach(s=>io.observe(s));
  _obs.push(io);
  if(secs[0]) secs[0].classList.add('in');
  setStage(0);
}
/* Below the pin breakpoint every stage is shown at once — the CSS un-hides
   them, and this keeps the grid from being stuck in stage 0's state. */
if(staticScrub){
  asteps.forEach(s=>s.classList.add('on'));
  gridEls.forEach(g=>g && g.classList.add('on'));
}

/* ---------- SET PIECE: the half-second recognition test ---------- */
const flash=document.getElementById('flash');
const shot=document.getElementById('hshot');
const opts=document.getElementById('hopts');
const playBtn=document.getElementById('hplay');
const res=document.getElementById('hres');
const prompt=document.getElementById('hprompt');
const timer=document.getElementById('htimer');

if(flash && shot && opts && playBtn && res){
  /* The real mark is always the answer; the decoys are category-generic on
     purpose — the difficulty *is* the argument the section is making. */
  const shuffle=a=>{ const b=a.slice(); for(let i=b.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [b[i],b[j]]=[b[j],b[i]]; } return b; };

  const reset=()=>{
    flash.classList.remove('lit','running');
    if(timer) timer.style.width='';
    opts.hidden=true;
    opts.innerHTML='';
    res.textContent='';
    if(prompt) prompt.style.opacity='';
  };

  const ask=()=>{
    if(_dead) return;
    const items=shuffle([
      {svg:FLASH_MARKS.real,real:true},
      ...FLASH_MARKS.decoys.map(s=>({svg:s,real:false})),
    ]);
    opts.hidden=false;
    opts.innerHTML=items.map((it,i)=>
      `<button type="button" class="opt" data-real="${it.real?'1':'0'}" aria-label="Option ${i+1}">
         <span style="display:inline-block;width:26px;height:26px;vertical-align:middle;color:currentColor">${it.svg}</span>
       </button>`).join('');
    res.textContent='// WHICH ONE DID YOU SEE?';
  };

  const onPick=e=>{
    const b=e.target.closest('.opt'); if(!b||_dead) return;
    const right=b.dataset.real==='1';
    [...opts.children].forEach(c=>{
      c.classList.add(c.dataset.real==='1'?'right':'wrong');
      c.disabled=true;
    });
    res.textContent=right
      ? '// CORRECT — THAT IS WHAT A MARK IS FOR.'
      : '// NOT QUITE. HALF A SECOND IS ALL YOU GET.';
    playBtn.disabled=false;
    playBtn.textContent='Run it again';
  };
  on(opts,'click',onPick);

  const run=()=>{
    if(_dead) return;
    reset();
    playBtn.disabled=true;
    shot.innerHTML=FLASH_MARKS.real;
    shot.style.color='#FFFFFF';
    res.textContent='// WATCH…';
    /* Two frames before lighting it, so the transition actually runs rather
       than being collapsed into the same style recalculation. */
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(_dead) return;
      flash.classList.add('lit','running');
      _timers.push(setTimeout(()=>{
        if(_dead) return;
        flash.classList.remove('lit');
        shot.innerHTML='';
        _timers.push(setTimeout(ask,260));
      },500));
    }));
  };
  on(playBtn,'click',run);
}

/* ---------- loop ---------- */
measure();
function loop(){
  if(_dead) return;
  if(!document.hidden && dirty){ dirty=false; Y=scrollY; render(); }
  _rafId=requestAnimationFrame(loop);
}
_rafId=requestAnimationFrame(loop);

/* ---------- cleanup ---------- */
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
