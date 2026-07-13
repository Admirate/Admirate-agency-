// @ts-nocheck

export default function initStart(){
let _dead=false, _rafId=0, _curRaf=0;
const _winListeners=[];
const _timers=[];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
requestAnimationFrame(()=>{ if(!_dead) document.body.classList.add('ready'); });
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);

/* ---------- custom cursor ---------- */
const dot=document.getElementById('cdot'), ring=document.getElementById('cring');
const finePointer=matchMedia('(pointer:fine)').matches;
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

/* ---------- the scroll animation: ink → paper morph + intro parallax exit ----------
   Geometry is cached in measure() and a frame only renders when scroll marked it
   dirty — no layout reads per frame. */
const bg=document.getElementById('bgfade');
const topline=document.getElementById('topline');
const introInner=document.getElementById('introInner');
const formsec=document.getElementById('formsec');
const INK=[11,11,12], PAPER=[250,250,248];
let Y=scrollY, dirty=true, VH=innerHeight, DOCH=1, FTOP=0;
function measure(){
  VH=innerHeight;
  DOCH=document.documentElement.scrollHeight;
  FTOP=formsec.offsetTop;
  dirty=true;
}
function render(){
  topline.style.width=(clamp(Y/((DOCH-VH)||1),0,1)*100)+'%';
  /* Morph across the boundary: starts halfway down the intro, lands as the form arrives. */
  const t=seg(Y+VH*0.5, FTOP-VH*0.55, FTOP+VH*0.15);
  bg.style.backgroundColor=`rgb(${INK.map((v,i)=>Math.round(v+(PAPER[i]-v)*t)).join(',')})`;
  /* The intro drifts up and fades as you leave it. */
  const e=seg(Y,0,VH*0.85);
  introInner.style.transform=`translateY(${-e*70}px)`;
  introInner.style.opacity=1-e*0.9;
}

const _onScroll=()=>{dirty=true;};
addEventListener('scroll',_onScroll,{passive:true}); _winListeners.push(['scroll',_onScroll]);
const _onResize=()=>{measure();};
addEventListener('resize',_onResize,{passive:true}); _winListeners.push(['resize',_onResize]);
const _onOrient=()=>{_timers.push(setTimeout(measure,250));};
addEventListener('orientationchange',_onOrient,{passive:true}); _winListeners.push(['orientationchange',_onOrient]);
const _onVis=()=>{if(!document.hidden) measure();};
document.addEventListener('visibilitychange',_onVis);
const _onLoad=()=>{_timers.push(setTimeout(measure,300));};
addEventListener('load',_onLoad,{once:true});

measure();

function loop(){
  if(_dead) return;
  if(!reduced && !document.hidden && dirty){ dirty=false; Y=scrollY; render(); }
  _rafId=requestAnimationFrame(loop);
}
_rafId=requestAnimationFrame(loop);

/* ---------- form card: staggered build when it enters ---------- */
const fcard=document.getElementById('fcard');
let fio=null;
if(reduced){ fcard.classList.add('inview'); }
else{
  fio=new IntersectionObserver(es=>{
    es.forEach(e=>{ if(e.isIntersecting){ fcard.classList.add('inview'); fio.unobserve(fcard); } });
  },{threshold:.2});
  fio.observe(fcard);
}

/* ---------- chips ---------- */
const SVC=['Branding','Logo design','Websites','Packaging','Social media','Video production','Print ads','Brand collaterals','Booking systems','Chatbots','Campaigns','Reels & shorts'];
const BUD=['UNDER ₹50K','₹50K–2L','₹2–5L','₹5L+','NOT SURE YET'];
const TIME=['ASAP','THIS MONTH','THIS QUARTER','FLEXIBLE'];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fillChips(id,arr){
  const box=document.getElementById(id);
  box.innerHTML=arr.map(t=>`<button type="button" class="chip" data-h data-v="${esc(t)}">${esc(t.toUpperCase())}</button>`).join('');
  box.addEventListener('click',e=>{
    const c=e.target.closest('.chip'); if(!c)return;
    if(box.hasAttribute('data-single')){
      /* Single-select: clicking the active chip clears it, any other chip replaces it. */
      [...box.children].forEach(x=>x.classList.toggle('on', x===c && !c.classList.contains('on')));
    } else c.classList.toggle('on');
  });
}
fillChips('svc',SVC); fillChips('budget',BUD); fillChips('time',TIME);
if(dot && finePointer && !reduced) bindHover(document.getElementById('brief'));

/* ---------- submit ---------- */
const form=document.getElementById('brief');
const status=document.getElementById('fstatus');
const F=id=>document.getElementById(id);
const picked=id=>[...document.getElementById(id).querySelectorAll('.chip.on')].map(c=>c.dataset.v);

const _onSubmit=async e=>{
  e.preventDefault();
  ['f-name','f-email','f-brief'].forEach(id=>F(id).classList.remove('err'));
  status.className='fstatus'; status.textContent='';

  const name=F('f-name').value.trim();
  const email=F('f-email').value.trim();
  const brief=F('f-brief').value.trim();
  const bad=[];
  /* Mirrors the zod schema on /api/contact so the user never round-trips to fail. */
  if(name.length<2) bad.push('f-name');
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) bad.push('f-email');
  if(brief.length<10) bad.push('f-brief');
  if(bad.length){
    bad.forEach(id=>F(id).classList.add('err'));
    status.classList.add('bad');
    status.textContent='// FILL THE MARKED FIELDS FIRST.';
    return;
  }

  const btn=form.querySelector('.sendbtn');
  btn.disabled=true;
  status.textContent='// SENDING…';

  try{
    const res=await fetch('/api/contact',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      /* `brief` is the API's `message`; `services` must go as a real array. */
      body:JSON.stringify({
        name, email, message:brief,
        company:F('f-co').value.trim(),
        phone:F('f-phone').value.trim(),
        services:picked('svc'),
        budget:picked('budget')[0]||'',
        timeline:picked('time')[0]||'',
      }),
    });
    if(_dead) return;
    if(!res.ok){
      const data=await res.json().catch(()=>({}));
      btn.disabled=false;
      status.classList.add('bad');
      status.textContent='// '+String(data.error||'COULD NOT SEND. TRY WHATSAPP ABOVE.').toUpperCase();
      return;
    }
  }catch{
    if(_dead) return;
    btn.disabled=false;
    status.classList.add('bad');
    status.textContent='// NETWORK ERROR. TRY WHATSAPP ABOVE.';
    return;
  }

  /* Only now — a failed save must never show the success card. */
  status.textContent='';
  btn.disabled=false;
  fcard.classList.add('sent');
};
form.addEventListener('submit',_onSubmit);

const _onAgain=()=>{
  fcard.classList.remove('sent');
  form.reset();
  document.querySelectorAll('.chip.on').forEach(c=>c.classList.remove('on'));
};
document.getElementById('again').addEventListener('click',_onAgain);

function cleanup(){
  _dead=true;
  cancelAnimationFrame(_rafId); cancelAnimationFrame(_curRaf);
  _timers.forEach(clearTimeout);
  try{ if(fio) fio.disconnect(); }catch(e){}
  document.removeEventListener('visibilitychange',_onVis);
  _winListeners.forEach(([t,h])=>removeEventListener(t,h));
  document.body.classList.remove('ready','hovering');
}
return cleanup;
}
