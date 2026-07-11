// @ts-nocheck

export default function initLanding(){
let _dead=false, _rafId=0;
const _winListeners=[];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.body.classList.add('locked');

/* ---------- content fills ---------- */
const words = 'BRANDING — LOGO DESIGN — WEBSITES — PACKAGING — SOCIAL MEDIA — VIDEO PRODUCTION — PRINT ADS — BRAND COLLATERALS — BOOKING SYSTEMS — CHATBOTS — ';
document.getElementById('tickTrack').textContent = (words + words).repeat(2);
const row1 = ['HITEX SPORTS EXPO','PATIL GROUP','HOPE TRUST INDIA','SOUTH GLASS','OUR SACRED SPACE','SAMYOGA STUDIO'];
const row2 = ['AVVENT GLOBAL','VALUCOR','ZYTHUM','EUI','SPORTEX','AA'];
function fill(id, arr){ document.getElementById(id).innerHTML = arr.map(n=>`<span class="mk">${n}</span>`).join(''); }
fill('m1',row1); fill('m1b',row1); fill('m2',row2); fill('m2b',row2);

/* ---------- hero: per-letter split ---------- */
const h1words=[...document.querySelectorAll('#hero h1 .w')];
let base=0.18;
h1words.forEach(w=>{
  if(w.classList.contains('mark')){ w.style.setProperty('--d',base+'s'); base+=0.16; return; }
  const text=w.textContent; w.textContent=''; w.classList.add('split');
  [...text].forEach(ch=>{
    const s=document.createElement('span'); s.className='ch'; s.textContent=ch;
    s.style.animationDelay=base+'s'; base+=0.026; w.appendChild(s);
  });
  base+=0.05;
});

/* ---------- loader ---------- */
const loader = document.getElementById('loader');
const lines = [...document.querySelectorAll('#terminal .ln')];
const bar = document.getElementById('bar');
const _timers=[];
const wait=ms=>new Promise(r=>_timers.push(setTimeout(r,ms)));
function typeLine(el, speed){
  return new Promise(res=>{
    const t = el.dataset.text; const span = document.createElement('span');
    span.className='txt'; el.appendChild(span); el.classList.add('typing');
    let i=0; const iv=setInterval(()=>{
      if(_dead){clearInterval(iv);return;}
      span.textContent = t.slice(0,++i);
      if(i>=t.length){clearInterval(iv);el.classList.remove('typing');res();}
    }, speed);
  });
}
async function boot(){
  if(reduced){ finish(); return; }
  await wait(380);
  if(_dead) return;
  await typeLine(lines[0], 34);
  await typeLine(lines[1], 18);
  await typeLine(lines[2], 26);
  loader.classList.add('glitch');
  await wait(540);
  await typeLine(lines[3], 24);
  bar.classList.add('show');
  requestAnimationFrame(()=>bar.classList.add('fill'));
  await wait(1150);
  if(_dead) return;
  finish();
}
function finish(){
  loader.classList.add('open');
  document.body.classList.remove('locked');
  document.body.classList.add('loaded');
  _timers.push(setTimeout(()=>{ if(loader && loader.parentNode) loader.remove(); }, 1100));
}
boot();

/* ---------- in-page anchor scrolling ---------- */
const _onAnchor=e=>{
  const a=e.target.closest('a[href^="#"]');
  if(!a) return;
  const id=a.getAttribute('href').slice(1);
  if(!id) return;
  const target=document.getElementById(id);
  if(!target) return;
  e.preventDefault();
  target.scrollIntoView({behavior: reduced?'auto':'smooth'});
};
document.addEventListener('click',_onAnchor);

/* ---------- intro word split + replay ---------- */
const introP = document.getElementById('introTxt');
(function splitWords(node){
  [...node.childNodes].forEach(n=>{
    if(n.nodeType===3){
      const frag=document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part=>{
        if(/^\s+$/.test(part)||part===''){frag.appendChild(document.createTextNode(part));}
        else{const s=document.createElement('span');s.className='w';s.textContent=part;frag.appendChild(s);}
      });
      node.replaceChild(frag,n);
    } else if(n.nodeType===1){ n.classList.add('w'); }
  });
})(introP);
const introWords=[...introP.querySelectorAll(':scope > .w')];
let introTimers=[];
function playIntro(){
  stopIntro(false);
  introWords.forEach((w,i)=>introTimers.push(setTimeout(()=>{ w.classList.add('on'); }, i*38)));
}
function stopIntro(clear=true){
  introTimers.forEach(clearTimeout); introTimers=[];
  if(clear) introWords.forEach(w=>w.classList.remove('on'));
}

/* ---------- contact form -> /api/contact + WhatsApp ---------- */
const cform=document.getElementById('cform');
const cnote=document.getElementById('cnote');
const csend=document.getElementById('csend');
const csendLabel=document.getElementById('csend-label');
const FIELDS=['name','email','phone','message'];
const IDLE_NOTE='Opens WhatsApp with your message pre-filled.';

function setErr(field,msg){
  const wrap=document.getElementById('fw-'+field);
  if(!wrap) return;
  if(msg){ document.getElementById('err-'+field).textContent=msg; wrap.classList.add('bad'); }
  else wrap.classList.remove('bad');
}
/* Mirrors the zod schema on /api/contact so the user never round-trips to fail. */
function validate(v){
  const errs={};
  if(!v.name || v.name.length<2) errs.name='Name must be at least 2 characters';
  else if(v.name.length>100) errs.name='Name must be under 100 characters';
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email||'')) errs.email='Please enter a valid email address';
  if(v.phone && v.phone.length>20) errs.phone='Phone number is too long';
  if(!v.message || v.message.length<10) errs.message='Message must be at least 10 characters';
  else if(v.message.length>2000) errs.message='Message must be under 2000 characters';
  return errs;
}
FIELDS.forEach(f=>{
  const el=document.getElementById('c-'+f);
  if(el) el.addEventListener('input',()=>setErr(f,null));
});

const _onSubmit=async e=>{
  e.preventDefault();
  const data={
    name:document.getElementById('c-name').value.trim(),
    email:document.getElementById('c-email').value.trim(),
    phone:document.getElementById('c-phone').value.trim(),
    message:document.getElementById('c-message').value.trim(),
  };
  const errs=validate(data);
  FIELDS.forEach(f=>setErr(f,errs[f]||null));
  if(Object.keys(errs).length){
    cnote.textContent='Please fix the highlighted fields.';
    cnote.className='cnote bad';
    return;
  }

  csend.disabled=true;
  csendLabel.textContent='SENDING…';
  cnote.textContent='Saving your enquiry…';
  cnote.className='cnote';

  try{
    await fetch('/api/contact',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(data),
    });
  }catch{
    /* WhatsApp remains the primary path even if this fails */
  }
  if(_dead) return;

  const text=`Hi Admirate, I'd like to start a project.%0A%0AName: ${encodeURIComponent(data.name)}%0AEmail: ${encodeURIComponent(data.email)}${data.phone?`%0APhone: ${encodeURIComponent(data.phone)}`:''}%0A%0A${encodeURIComponent(data.message)}`;
  window.open(`https://wa.me/918374494954?text=${text}`,'_blank');

  cform.reset();
  csend.disabled=false;
  csendLabel.textContent='SEND VIA WHATSAPP';
  cnote.textContent='Sent. Opening WhatsApp…';
  cnote.className='cnote ok';
  _timers.push(setTimeout(()=>{
    if(_dead) return;
    cnote.textContent=IDLE_NOTE;
    cnote.className='cnote';
  },5000));
};
cform.addEventListener('submit',_onSubmit);

/* ---------- section activation + dots ---------- */
const secs=[...document.querySelectorAll('.sec')];
const dotsBox=document.getElementById('dots');
secs.forEach((s,i)=>{
  const b=document.createElement('button');
  b.setAttribute('aria-label','Go to section '+(i+1));
  b.addEventListener('click',()=>s.scrollIntoView({behavior: reduced?'auto':'smooth'}));
  dotsBox.appendChild(b);
});
const dots=[...dotsBox.children];
const ioS=new IntersectionObserver(es=>{
  es.forEach(e=>{
    const s=e.target;
    if(e.isIntersecting){
      s.classList.add('active');
      if(s.id==='intro') playIntro();
    } else {
      if(s.id!=='hero') s.classList.remove('active');
      if(s.id==='intro') stopIntro();
    }
  });
},{threshold:.4});
secs.forEach(s=>ioS.observe(s));

/* ---------- scrub engine ---------- */
function progressOf(section){
  const r = section.getBoundingClientRect();
  const total = r.height - innerHeight;
  return Math.min(1, Math.max(0, -r.top / total));
}
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);
const ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

const SVC=['Branding','Logo design','Websites','Packaging','Social media','Video production','Print ads','Brand collaterals','Booking systems','Chatbots','Campaigns','Reels & shorts'];
const svclist=document.getElementById('svclist');
const SVCICON={'Branding': '<circle cx="12" cy="12" r="8"/><path d="M12 4v16M4 12h16"/>', 'Logo design': '<path d="M12 3l3 6 6 1-4.5 4.5L17 21l-5-3-5 3 1.5-6.5L3 10l6-1z"/>', 'Websites': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18"/>', 'Packaging': '<path d="M3 8l9-5 9 5-9 5-9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>', 'Social media': '<path d="M21 12a9 9 0 11-4-7.5"/><path d="M21 3v6h-6"/>', 'Video production': '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3"/>', 'Print ads': '<path d="M6 9V3h12v6"/><rect x="4" y="9" width="16" height="8" rx="1"/><path d="M6 17h12v4H6z"/>', 'Brand collaterals': '<rect x="4" y="4" width="16" height="6" rx="1"/><rect x="4" y="14" width="16" height="6" rx="1"/>', 'Booking systems': '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>', 'Chatbots': '<rect x="4" y="5" width="16" height="12" rx="3"/><path d="M9 21l3-4M8 10h.01M16 10h.01"/>', 'Campaigns': '<path d="M3 11l14-6v14l-14-6z"/><path d="M17 9h4M7 15v4a2 2 0 002 2h1"/>', 'Reels & shorts': '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M16 4v16M3 9h5M16 9h5M3 15h5M16 15h5"/>'};
svclist.innerHTML=SVC.map((n,i)=>`<div class="svcline"><span class="n">${String(i+1).padStart(2,'0')}</span><span class="ico"><svg viewBox="0 0 24 24">${SVCICON[n]}</svg></span>${n.toUpperCase()}</div>`).join('');
const svcLines=[...svclist.children];
const svcno=document.getElementById('svcno'), svcprog=document.getElementById('svcprog');
const sSvc=document.getElementById('services');

const sLogos=document.getElementById('logos'),
      sTv=document.getElementById('tv'),
      sWeb=document.getElementById('web'),
      sReels=document.getElementById('reels');
const tiles=[...document.querySelectorAll('.tile')];
const frames=[...document.querySelectorAll('.frame')];
const chan=document.getElementById('chan'), tvprog=document.getElementById('tvprog'), tcode=document.getElementById('tcode');
const urlbar=document.getElementById('urlbar'), wnav=document.getElementById('wnav'), whero=document.getElementById('whero');
const cards=[document.getElementById('c1'),document.getElementById('c2'),document.getElementById('c3')];
const wbtn=document.getElementById('wbtn'), livechip=document.getElementById('livechip');
const phone=document.getElementById('phone'), track=document.getElementById('reeltrack'), pprog=document.getElementById('pprog');
const reelsEls=[...document.querySelectorAll('.reel')];
const viewTargets=[214000,489000,1200000];
const URL_TXT='admirate.in/your-next-website';
function fmt(n){return n>=1e6?(n/1e6).toFixed(1)+'M':Math.round(n/1000)+'K';}

let cntRaf=null, lastLive=-1;
function tween(el,target){
  if(cntRaf)cancelAnimationFrame(cntRaf);
  const t0=performance.now(), D=650;
  (function step(t){
    if(_dead)return;
    const p=Math.min(1,(t-t0)/D), e=1-Math.pow(1-p,3);
    el.textContent=fmt(target*e);
    if(p<1)cntRaf=requestAnimationFrame(step);
  })(t0);
}

/* dot highlight by viewport centre */
function updateDots(){
  const mid=innerHeight/2;
  let cur=0;
  secs.forEach((s,i)=>{
    const r=s.getBoundingClientRect();
    if(r.top<=mid && r.bottom>mid) cur=i;
  });
  dots.forEach((d,j)=>d.classList.toggle('on', j===cur));
}

function tick2(){
  if(_dead) return;
  if(reduced) return;
  updateDots();

  /* services: rolling index */
  const ps=progressOf(sSvc);
  const off=ps*(SVC.length-1);
  const rh=Math.min(innerHeight*0.12,92);
  svcLines.forEach((el,i)=>{
    const d=i-off, ad=Math.abs(d);
    const sc=Math.max(.62,1-ad*.11);
    el.style.transform=`translateY(calc(${d*rh}px - 50%)) scale(${sc})`;
    el.style.opacity=String(Math.max(.32,1-ad*.16));
    el.classList.toggle('on', ad<0.5);
  });
  svcno.textContent=String(Math.round(off)+1).padStart(2,'0');
  svcprog.style.height=(ps*100)+'%';

  /* logos: tiles fly in from alternating sides, scrubbed */
  const pl=progressOf(sLogos);
  tiles.forEach((t,i)=>{
    const s=ease(seg(pl, i*0.10, i*0.10+0.42));
    const dir=(i%2?1:-1);
    t.style.opacity=s;
    t.style.transform=`translateX(${dir*(1-s)*130}px) rotate(${dir*(1-s)*7}deg) scale(${0.82+0.18*s})`;
  });

  /* video: scenes by thirds, channel, timecode, bar */
  const pt=progressOf(sTv);
  const idxT=Math.min(2, Math.floor(pt*3));
  frames.forEach((f,i)=>f.classList.toggle('on', i===idxT));
  chan.textContent='CH 0'+(idxT+1);
  const secsT=pt*30, ss=String(Math.floor(secsT)).padStart(2,'0'), ff=String(Math.floor((secsT%1)*24)).padStart(2,'0');
  tcode.textContent=`TC 00:${ss}:${ff}`;
  tvprog.style.width=(pt*100)+'%';

  /* website: staged build, scrub-linked */
  const pw=progressOf(sWeb);
  const t1=seg(pw,0,.15);   urlbar.textContent=URL_TXT.slice(0, Math.round(t1*URL_TXT.length));
  const t2=ease(seg(pw,.15,.30)); wnav.style.transform=`translateY(${-42*(1-t2)}px)`; wnav.style.opacity=t2;
  const t3=ease(seg(pw,.30,.55)); whero.style.clipPath=`inset(0 ${(1-t3)*100}% 0 0)`;
  cards.forEach((c,i)=>{ const tc2=ease(seg(pw,.55+i*.08,.72+i*.08)); c.style.opacity=tc2; c.style.transform=`scale(${0.75+0.25*tc2})`; });
  const t5=seg(pw,.80,1); const b=t5<0.7?(t5/0.7)*1.1:1.1-((t5-0.7)/0.3)*0.1; wbtn.style.transform=`scale(${t5===0?0:b})`;
  livechip.style.opacity=seg(pw,.92,1); livechip.style.transform=`translateY(${8*(1-seg(pw,.92,1))}px)`;

  /* reels: track scroll, subtle tilt, live per card, counters, side bar */
  const pr=progressOf(sReels);
  track.style.transform=`translateY(${-pr*200}%)`;
  phone.style.transform=`rotate(${2.5-5*pr}deg)`;
  pprog.style.height=(pr*100)+'%';
  reelsEls.forEach((reel,i)=>{
    const c=[0,0.5,1][i];
    const near=1-clamp(Math.abs(pr-c)/0.18,0,1);
    const isLive = near>0.55;
    reel.classList.toggle('live', isLive);
    if(isLive && lastLive!==i){ lastLive=i; tween(reel.querySelector('.cv'), viewTargets[i]); }
    if(!isLive && lastLive===i){ lastLive=-1; }
  });

  _rafId=requestAnimationFrame(tick2);
}
_rafId=requestAnimationFrame(tick2);
if(reduced){ updateDots(); }

function cleanup(){
  _dead=true;
  cancelAnimationFrame(_rafId);
  if(cntRaf)cancelAnimationFrame(cntRaf);
  _timers.forEach(clearTimeout);
  try{ioS.disconnect();}catch(e){}
  try{stopIntro();}catch(e){}
  document.removeEventListener('click',_onAnchor);
  _winListeners.forEach(([t,h])=>removeEventListener(t,h));
  document.body.classList.remove('locked','loaded');
}
return cleanup;
}
