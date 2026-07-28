// @ts-nocheck

/**
 * PRICING page engine.
 *
 * Everything this file does to a price is a string swap. The figures for every
 * currency, plan and billing cycle were formatted by the server and embedded in
 * #pgdata, so switching currency or cycle reads from that payload rather than
 * recalculating — a client-side rounding difference could otherwise show a
 * number the server would never have rendered.
 *
 * No network request is made and no navigation occurs on a switch. The currency
 * choice is written to a cookie so it survives the next visit.
 */
export default function initPricing() {
let _dead=false,_rafId=0;
const _win=[],_els=[],_timers=[],_obs=[];

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const on=(el,t,h,o)=>{ if(!el) return; el.addEventListener(t,h,o); _els.push([el,t,h]); };

const secs=[...document.querySelectorAll('[data-bg]')];
const bg=document.getElementById('pgbg');
const line=document.getElementById('pgline');
const rail=document.getElementById('pgrail');

/* ---------- embedded price payload ---------- */
let DATA={active:'',plans:{}};
try{
  const node=document.getElementById('pgdata');
  if(node) DATA=JSON.parse(node.textContent||'{}');
}catch(e){
  /* A malformed payload must not take the page down: the server-rendered
     figures are already in the DOM and stay correct. Only switching breaks. */
  console.error('Pricing payload unreadable:',e);
}
let CCY=DATA.active||'';

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
    if(rail) rail.classList.toggle('ondark',secs[cur].classList.contains('dark')||surface==='#0B0B0C');
  }
}

const onScroll=()=>{ dirty=true; };
addEventListener('scroll',onScroll,{passive:true}); _win.push(['scroll',onScroll]);

const onResize=()=>measure();
addEventListener('resize',onResize,{passive:true}); _win.push(['resize',onResize]);

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
  if(secs[0]) secs[0].classList.add('in');
}

/* ---------- price painting ----------
   One function drives every tier card. It is called on load for the sections
   whose cycle is not monthly (there are none, but the invariant is cheap), on
   every cycle change, and on every currency change — so there is exactly one
   code path that can put a figure on screen. */
const CYCLE_BY_FAMILY={};

function paint(scope){
  const cards=(scope||document).querySelectorAll('.ptier[data-plan]');

  cards.forEach(card=>{
    const plan=DATA.plans&&DATA.plans[card.dataset.plan];
    if(!plan) return;

    const section=card.closest('[data-family]');
    const family=section?section.dataset.family:'';
    /* One-time plans have a single cell stored under the monthly key — there
       is nothing to bill quarterly about a build that happens once. */
    const cycle=plan.oneTime?'monthly':(CYCLE_BY_FAMILY[family]||'monthly');
    const cell=plan.cells&&plan.cells[CCY]&&plan.cells[CCY][cycle];
    if(!cell) return;

    const fig=card.querySelector('[data-fig]');
    const per=card.querySelector('[data-per]');
    const bill=card.querySelector('[data-bill]');
    const save=card.querySelector('[data-save]');
    const tax=card.querySelector('[data-tax]');
    const cta=card.querySelector('[data-cta]');

    /* Every field is textContent. None of these strings is ever parsed as
       markup, which is why the billing line arrives pre-split rather than as
       one string with an <em> in it — the currency symbol inside them comes
       from an administrator-editable column. */
    if(fig){
      const changed=fig.textContent!==cell.fig;
      fig.textContent=cell.fig;
      /* The figure is the only thing on the card worth animating, and it is
         animated only when it actually changed — switching from AED annual to
         AED annual should not flicker. Two frames: one to paint the offset
         state, one to release it, so the transition has something to run from.
         paint() is only ever called from a control, never on load, so this
         cannot fight the section's own entrance reveal. */
      if(changed && !reduced){
        fig.classList.add('swap');
        requestAnimationFrame(()=>requestAnimationFrame(()=>fig.classList.remove('swap')));
      }
    }
    if(per) per.textContent=cell.per;
    if(bill) bill.textContent=cell.billTotal||'';
    if(save) save.textContent=cell.billSaving||'';
    if(tax) tax.textContent=cell.tax||'';
    if(cta&&cta.dataset.base){
      cta.setAttribute('href',plan.oneTime?cta.dataset.base:cta.dataset.base+'&cycle='+cycle);
    }
  });
}

/* ---------- currency ---------- */
const sel=document.getElementById('pccysel');
if(sel){
  on(sel,'change',()=>{
    CCY=sel.value;
    /* A year, so the choice survives the gap between researching and buying.
       Lax rather than Strict: the visitor may arrive from a search result or a
       proposal link, and the currency they picked should still apply. */
    try{
      document.cookie='admirate_ccy='+encodeURIComponent(CCY)+
        ';path=/;max-age=31536000;samesite=lax'+(location.protocol==='https:'?';secure':'');
    }catch(e){}
    paint();
    _timers.push(setTimeout(measure,60));
  });
}

/* ---------- billing cycle ---------- */
document.querySelectorAll('[data-family]').forEach(section=>{
  const family=section.dataset.family;
  const group=section.querySelector('.pcyc');
  if(!group) return;

  CYCLE_BY_FAMILY[family]='monthly';

  on(group,'click',e=>{
    const btn=e.target.closest('[data-cycle]');
    if(!btn) return;

    CYCLE_BY_FAMILY[family]=btn.dataset.cycle;
    group.querySelectorAll('[data-cycle]').forEach(b=>{
      const isOn=b===btn;
      b.classList.toggle('on',isOn);
      b.setAttribute('aria-pressed',isOn?'true':'false');
    });
    paint(section);
    _timers.push(setTimeout(measure,60));
  });
});

/* ---------- comparison matrix ---------- */
document.querySelectorAll('.pmore').forEach(btn=>{
  const table=document.getElementById(btn.getAttribute('aria-controls'));
  if(!table) return;

  on(btn,'click',()=>{
    const open=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded',open?'false':'true');
    table.hidden=open;
    /* The page got taller or shorter, so the rail and the progress line have
       to be told before the next scroll event. */
    measure();
  });
});

/* Tier chips: on a phone the table shows one plan column at a time. The chips
   exist in the markup at every width but are only displayed below 768px, so
   this listener is harmless on a desktop where every column is already shown. */
document.querySelectorAll('.ptabs').forEach(tabs=>{
  const wrap=tabs.closest('.pmatrix');
  if(!wrap) return;

  on(tabs,'click',e=>{
    const btn=e.target.closest('[data-tab]');
    if(!btn) return;

    const slug=btn.dataset.tab;
    tabs.querySelectorAll('[data-tab]').forEach(b=>{
      const isOn=b===btn;
      b.classList.toggle('on',isOn);
      b.setAttribute('aria-selected',isOn?'true':'false');
    });
    wrap.querySelectorAll('[data-col]').forEach(c=>{
      c.classList.toggle('show',c.dataset.col===slug);
    });
    measure();
  });
});

/* A <details> changing height moves everything below it. */
document.querySelectorAll('.pfaq').forEach(d=>{
  on(d,'toggle',()=>measure());
});

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
