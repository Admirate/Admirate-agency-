// @ts-nocheck

import { optimized } from "@/lib/cdn";

export default function initServices(){
let _dead=false, _rafId=0, _curRaf=0;
const _winListeners=[];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Below 600px tall the CSS drops the sticky-scrub and lets the sections flow
   (landscape phones, SE-class screens). The scrub writes would fight those
   pinned states, so they're switched off here too. */
const staticScrub = reduced || matchMedia('(max-height: 600px)').matches;
requestAnimationFrame(()=>{ if(!_dead) document.body.classList.add('ready'); });
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- section activation + dots + logos recognition test ---------- */
const secs=[...document.querySelectorAll('.sec')];
const dotsBox=document.getElementById('dots');
secs.forEach((s,i)=>{
  const b=document.createElement('button');
  b.setAttribute('aria-label','Go to section '+(i+1));
  b.addEventListener('click',()=>s.scrollIntoView({behavior:reduced?'auto':'smooth'}));
  dotsBox.appendChild(b);
});
const dots=[...dotsBox.children];
const tiles=[...document.querySelectorAll('.ltile')];
let recogIv=null, recogI=0;
function startRecog(){
  stopRecog();
  if(reduced) return;
  recogI=0;
  recogIv=setInterval(()=>{
    tiles.forEach((t,i)=>t.classList.toggle('focus', i===recogI));
    recogI=(recogI+1)%tiles.length;
  },600);
}
function stopRecog(){
  if(recogIv){clearInterval(recogIv);recogIv=null;}
  tiles.forEach(t=>t.classList.remove('focus'));
}
const ioS=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('active');
      if(e.target.id==='logos') startRecog();
    } else {
      if(e.target.id!=='hero') e.target.classList.remove('active');
      if(e.target.id==='logos') stopRecog();
    }
  });
},{threshold:.35});
secs.forEach(s=>ioS.observe(s));
let lastDot=-1;
function updateDots(){
  const mid=Y+VH/2;
  let cur=0;
  secs.forEach((sc,i)=>{const g=GEOMAP[sc.id];if(g&&mid>=g.top&&mid<g.top+g.h)cur=i;});
  if(cur!==lastDot){lastDot=cur;dots.forEach((d,j)=>d.classList.toggle('on',j===cur));}
}

/* ---------- custom cursor ---------- */
const dot=document.getElementById('cdot'), ring=document.getElementById('cring');
const finePointer = matchMedia('(pointer:fine)').matches;
function bindHover(scope){
  scope.querySelectorAll('[data-h]').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('hovering'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('hovering'));
  });
}
if(dot && finePointer && !reduced){
  let mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my;
  const _onMove=e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';};
  addEventListener('mousemove',_onMove); _winListeners.push(['mousemove',_onMove]);
  (function cur(){ if(_dead)return; rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.left=rx+'px';ring.style.top=ry+'px';_curRaf=requestAnimationFrame(cur);})();
  bindHover(document);
}

/* ---------- hero parallax ---------- */
const heroinner=document.getElementById('heroinner');
if(!reduced && finePointer){
  document.getElementById('hero').addEventListener('mousemove',e=>{
    const x=e.clientX/innerWidth-.5, y=e.clientY/innerHeight-.5;
    heroinner.style.transform=`translate(${-x*10}px,${-y*8}px)`;
  });
}

/* ---------- background morph ---------- */
const bg=document.getElementById('bgfade');
const zones=[...document.querySelectorAll('[data-bg]')].map(el=>({el,c:el.dataset.bg,t:0}));
function hex2rgb(h){h=h.replace('#','');return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];}
function mix(a,b,t){const A=hex2rgb(a),B=hex2rgb(b);return `rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')})`;}
function bgMorph(mid){
  let cur=zones[0],next=null,t=0;
  for(let i=0;i<zones.length;i++){
    if(mid>=zones[i].t){cur=zones[i];next=zones[i+1]||null;}
  }
  if(next){const win=VH*0.5;t=seg(mid,next.t-win,next.t+win*0.2);}
  bg.style.backgroundColor=next?mix(cur.c,next.c,t):cur.c;
}

/* ---------- drifting light ---------- */
const orb=document.getElementById('lightorb');
function orbTick(p){
  const x=50+Math.sin(p*Math.PI*3)*26;
  const y=18+p*64;
  const rn=(Math.sin(p*Math.PI*5)+1)/2;
  const c=`rgba(${Math.round(227*rn+255*(1-rn))},${Math.round(0*rn+250*(1-rn))},${Math.round(27*rn+248*(1-rn))},${0.16+rn*0.1})`;
  orb.style.left=x+'%';orb.style.top=y+'%';
  orb.style.background=`radial-gradient(circle, ${c}, transparent 70%)`;
}

/* ---------- EYE gaze scrub ---------- */
const sEye=document.getElementById('eye');
const comp=document.getElementById('comp');
const gsvg=document.getElementById('gazesvg'),gpath=document.getElementById('gazepath'),gtrail=document.getElementById('gazetrail'),gdot=document.getElementById('gdot');
const fixEls=[1,2,3,4].map(n=>document.getElementById('fx'+n));
const anchors=[['fx1a',.5,.5],['fx2a',.5,.45],['fx3a',.5,.5],['fx4a',.5,.5]];
const fixno=document.getElementById('fixno');
let plen=0;
function buildGaze(){
  const cr=comp.getBoundingClientRect();
  gsvg.setAttribute('viewBox',`0 0 ${cr.width} ${cr.height}`);
  const pts=anchors.map(([id,fx,fy])=>{
    const r=document.getElementById(id).getBoundingClientRect();
    return [r.left-cr.left+r.width*fx, r.top-cr.top+r.height*fy];
  });
  const d=`M ${pts[0][0]} ${pts[0][1]} C ${pts[0][0]+90} ${pts[0][1]+10}, ${pts[1][0]-110} ${pts[1][1]-40}, ${pts[1][0]} ${pts[1][1]} S ${pts[2][0]-60} ${pts[2][1]-70}, ${pts[2][0]} ${pts[2][1]} S ${pts[3][0]+70} ${pts[3][1]-80}, ${pts[3][0]} ${pts[3][1]}`;
  gpath.setAttribute('d',d);gtrail.setAttribute('d',d);
  plen=gpath.getTotalLength();
  gpath.style.strokeDasharray=plen;
  gtrail.style.strokeDasharray=plen;
  fixEls.forEach((f,i)=>{f.style.left=pts[i][0]+'px';f.style.top=pts[i][1]+'px';});
}
buildGaze();
/* measure() rebuilds the gaze path on resize — see the render engine below. */
const FIXP=[.1,.42,.7,.94];
const fixsegs=[0,1,2,3].map(n=>document.getElementById('fs'+n));

/* ---------- WEB scrub ---------- */
const sWeb=document.getElementById('web');
const browser=document.getElementById('browser');
const urlbar=document.getElementById('urlbar');
const URLS=['admirate.in/your-homepage','admirate.in/book-a-slot','admirate.in/lightning-fast'];
const wcomps=[...document.querySelectorAll('.wcomp')];
const wsteps=[...document.querySelectorAll('.wstep')];
const wticks=[...document.querySelectorAll('.wticks i')];
let lastWi=0;

/* ---------- CLIENT SHOWCASE ---------- */
/* One browser frame, one rail. Copy here is written from the live sites, not
   invented: Patil Group is railway infrastructure (it was previously described
   as real estate, which it is not).
   If /api/portfolio returns projects (managed from the dashboard's Portfolio
   page), they replace this seeded roster. */
let CLIENTS=[
  {name:'SPORTEX', tag:'Sports expo', url:'sportex.in', shot:'/shots/sportex.jpeg',
   desc:"India's largest sports, fitness and wellness expo. Built to hold up under launch-week traffic, with visitor registration and exhibitor enquiries on one clean path.",
   chips:['WEB','EVENT','REGISTRATION']},
  {name:'PATIL GROUP', tag:'Railway infrastructure', url:'patilgroup.com', shot:'/shots/patil.jpeg',
   desc:"The world's largest sleeper manufacturer, fifty years on the job. A corporate site that carries the scale of the work without raising its voice.",
   chips:['WEB','CORPORATE','PROJECTS']},
  {name:'HOPE TRUST INDIA', tag:'Mental health & rehab', url:'hopetrustindia.com', shot:'/shots/hopetrust.jpeg',
   desc:'Addiction and mental-health care. This site had to work for someone reaching out at their lowest — clear programmes, honest copy, a therapist one click away.',
   chips:['WEB','BRAND','CONTENT']},
  {name:'SOUTH GLASS', tag:'Premium glass', url:'southglass.in', shot:'/shots/southglass.jpeg',
   desc:'Glass and facades, established 2014. A technical product made to feel premium — product ranges, finishes, and a quote request that actually converts.',
   chips:['IDENTITY','WEB','QUOTES']},
];

const bframe=document.getElementById('bframe'), bshot=document.getElementById('bshot');
const baddr=document.getElementById('baddr'), bgo=document.getElementById('bgo');
const crail=document.getElementById('crail');
const cdesc=document.getElementById('cdesc'), cchips=document.getElementById('cchips');
const cvisit=document.getElementById('cvisit'), cvisitd=document.getElementById('cvisitd');
let ci=-1, typeTimer=0, loadTimer=0;

const hrefOf=c=>c.href||('https://'+c.url);

function renderRail(){
  crail.innerHTML=CLIENTS.map((c,i)=>
    `<button class="cli" data-i="${i}" data-h aria-pressed="false">
      <span class="cln">${esc(c.name)}</span>
      <span class="cls">${esc(c.tag)}</span>
    </button>`).join('');
  if(dot && finePointer && !reduced) bindHover(crail);
}

/* The shot is taller than the frame; --pan is exactly how far it may travel so it
   comes to rest flush with its own bottom edge rather than over-scrolling. */
function measurePan(){
  const view=bshot.parentElement;
  if(!view || !bshot.naturalWidth) return;
  /* Read the height the image actually renders at, so the CSS that widens it to
     crop the scrollbar is accounted for rather than guessed around. */
  const imgH=bshot.getBoundingClientRect().height;
  bframe.style.setProperty('--pan', `-${Math.max(0, Math.round(imgH-view.clientHeight))}px`);
}

/* Typing the domain is the section's one flourish: the frame navigates, like the
   thing it is showing. Under reduced motion it simply appears. */
function typeUrl(text){
  clearInterval(typeTimer);
  if(reduced){ baddr.textContent=text; return; }
  baddr.textContent='';
  let i=0;
  typeTimer=setInterval(()=>{
    if(_dead){clearInterval(typeTimer);return;}
    baddr.textContent=text.slice(0,++i);
    if(i>=text.length) clearInterval(typeTimer);
  },26);
}

function selectClient(i){
  if(i===ci) return;
  ci=(i+CLIENTS.length)%CLIENTS.length;
  const c=CLIENTS[ci];

  [...crail.children].forEach((b,j)=>{
    b.classList.toggle('on',j===ci);
    b.setAttribute('aria-pressed',j===ci?'true':'false');
  });

  typeUrl(c.url);
  if(!reduced){
    bframe.classList.remove('loading');
    void bframe.offsetWidth;
    bframe.classList.add('loading');
    clearTimeout(loadTimer);
    loadTimer=setTimeout(()=>{ if(!_dead) bframe.classList.remove('loading'); },950);
  }

  bshot.classList.remove('in');
  bshot.alt=c.name+' website';
  /* Print-scale screenshots go through Next's optimizer rather than down the wire. */
  bshot.src=c.shot?optimized(c.shot,1200):'';

  cdesc.textContent=c.desc;
  cchips.innerHTML=c.chips.map(x=>`<span>${esc(x)}</span>`).join('');
  cvisit.href=hrefOf(c);
  cvisitd.textContent=c.url;
  bgo.href=hrefOf(c);
}

bshot.addEventListener('load',()=>{ measurePan(); bshot.classList.add('in'); });
bshot.addEventListener('error',()=>{ bshot.classList.remove('in'); });

crail.addEventListener('click',e=>{
  const b=e.target.closest('.cli');
  if(b) selectClient(+b.dataset.i);
});

renderRail();
selectClient(0);

/* Pull the dashboard-managed portfolio; keep the seeded roster if it's empty. */
(async ()=>{
  try{
    const res=await fetch('/api/portfolio');
    if(!res.ok) return;
    const data=await res.json();
    if(_dead || !Array.isArray(data) || data.length===0) return;
    CLIENTS=data.map(p=>({
      name:p.title,
      tag:(p.tags&&p.tags[0])||'Client website',
      url:String(p.external_url||'').replace(/^https?:\/\//,'').replace(/\/$/,''),
      href:p.external_url,
      shot:p.image_url||'',
      desc:p.description,
      chips:(p.tags||[]).map(t=>String(t).toUpperCase()),
    }));
    renderRail();
    ci=-1;
    selectClient(0);
  }catch{
    /* keep the seeded roster */
  }
})();

/* ---------- SOCIAL card tilts ----------
   The columns used to be scrubbed up and down against scroll. They are static
   now — the only motion left here is the pointer-driven tilt below. */
if(!reduced && finePointer){
  document.querySelectorAll('.mcard').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`rotateY(${x*10}deg) rotateX(${-y*10}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='';});
  });
  const shelf=document.getElementById('shelf');
  document.getElementById('collat').addEventListener('mousemove',e=>{
    const x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
    shelf.style.transform=`rotateY(${x*5}deg) rotateX(${-y*3.5}deg)`;
  });
}

/* ---------- render engine: cached geometry, event-gated frames ----------
   The old loop read getBoundingClientRect() per section per frame and
   repainted the bg gradient + orb every frame. Geometry is now measured once
   (and on resize), and a frame is only rendered when scroll marked it dirty.
   On mobile the gradient interpolation is dropped for a per-zone colour swap
   — a phone repaints a full-viewport gradient far too slowly to do it live. */
const topline=document.getElementById('topline');
let Y=scrollY, dirty=true, VH=innerHeight, DOCH=1, IS_M=false, lastZone=-1;
const GEOMAP={};
function measure(){
  VH=innerHeight;
  DOCH=document.documentElement.scrollHeight;
  secs.forEach(el=>{GEOMAP[el.id]={top:el.offsetTop,h:el.offsetHeight};});
  zones.forEach(z=>{z.t=z.el.offsetTop;});
  IS_M=matchMedia('(max-width:768px)').matches;
  buildGaze();
  measurePan();
  dirty=true;
}
const P=id=>{const g=GEOMAP[id];return g?clamp((Y-g.top)/((g.h-VH)||1),0,1):0;};

function render(){
  const gp=clamp(Y/((DOCH-VH)||1),0,1);
  topline.style.width=(gp*100)+'%';
  updateDots();

  const mid=Y+VH*0.5;
  if(IS_M){
    let zi=0;
    for(let i=0;i<zones.length;i++){ if(mid>=zones[i].t) zi=i; }
    if(zi!==lastZone){ lastZone=zi; bg.style.backgroundColor=zones[zi].c; }
  } else {
    bgMorph(mid);
    orbTick(gp);
  }

  /* eye */
  const pe=P('eye');
  gpath.style.strokeDashoffset=(1-pe)*plen;
  gtrail.style.strokeDashoffset=(1-pe)*plen;
  if(plen>0){
    const pt=gpath.getPointAtLength(pe*plen);
    gdot.style.left=pt.x+'px';gdot.style.top=pt.y+'px';
    gdot.style.opacity=pe>0.02?1:0;
  }
  let fi=0;
  FIXP.forEach((fp,i)=>{
    fixEls[i].classList.toggle('on',pe>=fp); // hidden but keeps JS clean
    fixsegs[i].classList.toggle('on',pe>=fp);
    if(pe>=fp)fi=i;
  });
  fixno.textContent=String(fi+1).padStart(2,'0');
  comp.classList.toggle('done',pe>=FIXP[3]);

  /* web */
  const pw=P('web');
  const wi=Math.min(2,Math.floor(pw*3));
  if(wi!==lastWi){
    lastWi=wi;
    urlbar.textContent=URLS[wi];
    browser.classList.remove('loading');
    void browser.offsetWidth;
    browser.classList.add('loading');
  }
  wcomps.forEach((c,i)=>c.classList.toggle('on',i===wi));
  wsteps.forEach((s,i)=>s.classList.toggle('on',i===wi));
  wticks.forEach((t,i)=>t.classList.toggle('on',i<=wi));

}

const _onScroll=()=>{dirty=true;};
addEventListener('scroll',_onScroll,{passive:true}); _winListeners.push(['scroll',_onScroll]);
const _onResize=()=>{measure();};
addEventListener('resize',_onResize,{passive:true}); _winListeners.push(['resize',_onResize]);
const _onOrient=()=>{setTimeout(measure,250);};
addEventListener('orientationchange',_onOrient,{passive:true}); _winListeners.push(['orientationchange',_onOrient]);
const _onVis=()=>{if(!document.hidden) measure();};
document.addEventListener('visibilitychange',_onVis);
const _onLoad=()=>setTimeout(measure,300);
addEventListener('load',_onLoad,{once:true});

measure();

function raf(){
  if(_dead)return;
  if(!staticScrub && !document.hidden && dirty){ dirty=false; Y=scrollY; render(); }
  _rafId=requestAnimationFrame(raf);
}
_rafId=requestAnimationFrame(raf);
if(staticScrub){ Y=scrollY; updateDots(); }

function cleanup(){
  _dead=true;
  cancelAnimationFrame(_rafId); cancelAnimationFrame(_curRaf);
  clearInterval(typeTimer); clearTimeout(loadTimer);
  try{ioS.disconnect();}catch(e){}
  try{stopRecog();}catch(e){}
  document.removeEventListener('visibilitychange',_onVis);
  _winListeners.forEach(([t,h])=>removeEventListener(t,h));
  document.body.style.overflow='';
  document.body.classList.remove('ready','hovering');
}
return cleanup;
}
