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
/* The first three are the packages sold on /pricing, and they lead because
   that is where most of this traffic now arrives from. The rest are the
   one-off pieces of work that do not belong to a package. */
const SVC=['Digital retainer','Website build','Website care','Branding','Logo design','Packaging','Social media','Video production','Print ads','Brand collaterals','Booking systems','Campaigns','Reels & shorts'];
/* Bracketed around the published rate card rather than round numbers. In
   rupees the products run ₹18K–66K a month for care, ₹1.02L–2.46L a month for
   a retainer, and ₹1.38L–3.59L once for a build — so the old "₹5L+" band
   caught nothing we sell and "under ₹50K" caught only the entry care plan. */
const BUD=['UNDER ₹50K','₹50K–1.5L','₹1.5L–3L','₹3L–5L','₹5L+','NOT SURE YET'];
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

/* ---------- preselect from a service page ----------
   The six /services/<slug> pages send the visitor here as ?service=<Label>.
   Those labels are the nav's service names, which are NOT all chip labels —
   only Social Media, Video Production and Brand Collaterals happen to match.
   The rest need saying explicitly, so the map is written out rather than
   guessed at with a fuzzy comparison. An unknown value simply selects nothing. */
const SERVICE_CHIPS={
  'identity':['Branding','Logo design'],
  'design':['Campaigns','Print ads'],
  'social media':['Social media'],
  'digital':['Website build'],
  'video production':['Video production'],
  'brand collaterals':['Brand collaterals'],
};

/* ---------- arriving from /pricing ----------
   Every tier card links here as ?service=…&plan=<slug>&cycle=<id>. Until now
   only `service` was read and the other two were dropped on the floor — so
   someone who had already picked Growth on an annual cycle arrived at a blank
   form and had to say it again, and we never learned which card they clicked.

   `plan` alone is ambiguous: "launch" and "growth" are slugs in two different
   families. `service` is what disambiguates them, so the pair is resolved
   together. */
const PLAN_NAMES={launch:'Launch',growth:'Growth',scale:'Scale',enterprise:'Enterprise',care:'Care',manage:'Manage',grow:'Grow'};
const CYCLE_NAMES={monthly:'monthly',quarterly:'quarterly',biannual:'every 6 months',annual:'annually'};
/* Which package a ?service= value means, for the sentence and the chip. */
const PACKAGE_BY_SERVICE={'social media':'Digital retainer','digital':'Website build'};
/* Slugs that only exist in the care family, whatever `service` claims. */
const CARE_SLUGS=['care','manage','grow'];

try{
  const q=new URLSearchParams(location.search);
  const want=q.get('service');
  const planSlug=(q.get('plan')||'').trim().toLowerCase();
  const cycle=(q.get('cycle')||'').trim().toLowerCase();
  const box=document.getElementById('svc');

  /* A care slug wins over `service`. /pricing sends "Digital" for both the
     build and the care plans, so mapping it blindly ticked "Website build" on
     a care enquiry — the visitor would have arrived asking for a site they
     already have. */
  const isCare=CARE_SLUGS.indexOf(planSlug)>-1;
  const wanted=(!isCare&&want)?SERVICE_CHIPS[want.trim().toLowerCase()]:null;
  if(wanted&&box){
    [...box.children].forEach(c=>{ if(wanted.includes(c.dataset.v)) c.classList.add('on'); });
  }

  const planName=PLAN_NAMES[planSlug];
  if(planName&&box){
    const pkg=isCare
      ? 'Website care'
      : PACKAGE_BY_SERVICE[(want||'').trim().toLowerCase()];

    if(pkg){
      [...box.children].forEach(c=>{ if(c.dataset.v===pkg) c.classList.add('on'); });
    }

    /* Say it back, so the choice made on the pricing page is visibly carried
       rather than silently assumed. */
    const cycleName=CYCLE_NAMES[cycle];
    const line=pkg
      ? `${planName} — ${pkg}${cycleName?`, billed ${cycleName}`:''}`
      : `${planName}${cycleName?`, billed ${cycleName}`:''}`;

    const note=document.getElementById('fplan');
    if(note){
      note.textContent=`Enquiring about: ${line}`;
      note.hidden=false;
    }

    /* Seed the brief so the tier reaches us even if they never touch the box.
       Appended rather than assigned, in case the field was restored by the
       browser from a previous attempt. */
    const brief=document.getElementById('f-brief');
    if(brief&&!brief.value.trim()) brief.value=`I'm interested in ${line}.\n\n`;
  }
}catch(e){/* malformed query string — leave every chip unselected */}

if(dot && finePointer && !reduced) bindHover(document.getElementById('brief'));

/* ---------- submit ---------- */
const form=document.getElementById('brief');
const status=document.getElementById('fstatus');
const F=id=>document.getElementById(id);
const picked=id=>[...document.getElementById(id).querySelectorAll('.chip.on')].map(c=>c.dataset.v);

const FIELDS=['f-name','f-email','f-phone','f-co','f-brief'];

const _onSubmit=async e=>{
  e.preventDefault();
  FIELDS.forEach(id=>{ F(id).classList.remove('err'); F(id).removeAttribute('aria-invalid'); });
  document.getElementById('svc').classList.remove('err');
  status.className='fstatus'; status.textContent='';

  const name=F('f-name').value.trim();
  const email=F('f-email').value.trim();
  const phone=F('f-phone').value.trim();
  const company=F('f-co').value.trim();
  const brief=F('f-brief').value.trim();
  const services=picked('svc');

  /* Every rule the zod schema on /api/contact enforces, checked here first so
     nothing round-trips only to come back as a generic failure. The upper
     bounds matter as much as the lower ones: the server caps the brief at 2000
     characters and the company at 120, and before this a long brief was
     accepted by the form and rejected by the API.

     Each rule carries its own message. The form has no placeholders any more,
     so "fill the marked fields" no longer tells anyone what was wrong with
     what they typed. */
  const problems=[];
  const fail=(id,msg)=>problems.push({id,msg});

  if(name.length<2) fail('f-name','YOUR NAME NEEDS AT LEAST 2 CHARACTERS.');
  else if(name.length>100) fail('f-name','YOUR NAME IS OVER 100 CHARACTERS.');

  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fail('f-email','THAT EMAIL DOES NOT LOOK RIGHT.');

  /* Optional, but validated when filled — the server only checks its length,
     so "asdf" would have been stored as a phone number. */
  if(phone){
    if(phone.length>20) fail('f-phone','THAT PHONE NUMBER IS TOO LONG.');
    else if(!/^\+?[\d\s()-]{7,}$/.test(phone)) fail('f-phone','THAT PHONE NUMBER DOES NOT LOOK RIGHT.');
  }

  if(company.length>120) fail('f-co','COMPANY NAME IS OVER 120 CHARACTERS.');

  if(brief.length<10) fail('f-brief','TELL US A LITTLE MORE — 10 CHARACTERS MINIMUM.');
  else if(brief.length>2000) fail('f-brief','THE BRIEF IS OVER 2000 CHARACTERS. TRIM IT AND WE WILL ASK THE REST.');

  /* The one addition beyond the server's rules. An enquiry naming nothing it
     needs cannot be routed or quoted, and the chips are one tap. */
  if(!services.length) fail('svc','PICK AT LEAST ONE THING YOU NEED.');

  if(problems.length){
    problems.forEach(({id})=>{
      const el=F(id);
      el.classList.add('err');
      if(id!=='svc') el.setAttribute('aria-invalid','true');
    });
    status.classList.add('bad');
    /* The first problem, named. Listing all of them at once buries the one
       the visitor is about to fix. */
    status.textContent='// '+problems[0].msg;
    const first=F(problems[0].id);
    if(first&&first.focus) first.focus({preventScroll:false});
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
