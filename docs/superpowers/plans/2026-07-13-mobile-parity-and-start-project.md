# Mobile Parity + Start-a-Project Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/` and `/services` render on mobile exactly as the supplied HTML files do, and move the contact form off the landing page into a new `/start-project` brief page backed by four new database columns.

**Architecture:** The public pages are not JSX. Each is a raw HTML string + raw CSS string + an imperative `init.ts`, mounted through `RawPage.tsx` (`dangerouslySetInnerHTML` + a `useEffect` that runs `init()` and returns a cleanup fn). Editing a page means editing those strings. Both `init.ts` files get the same render-engine swap: cached geometry read once in `measure()`, a `dirty` flag set on scroll, and a `render()` that does zero layout reads per frame.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Supabase (`@supabase/ssr`), zod, Tailwind v4 (dashboard only — the public pages are hand-written CSS).

**Spec:** `docs/superpowers/specs/2026-07-13-mobile-parity-and-start-project-design.md`

## Global Constraints

- **No test runner exists in this repo.** There is no test framework and no `test` script in `package.json`. Do **not** add one — it is out of scope. Every task is verified with `npx tsc --noEmit`, `npm run lint`, `npm run build`, and named browser checks at named viewports.
- **`reactStrictMode: false`** is deliberate (`next.config.ts:8`). The imperative page code must initialise exactly once per mount. Do not re-enable Strict Mode.
- Both public `init.ts` files start with `// @ts-nocheck`. Keep it. They are ported imperative code, not idiomatic TS.
- Every `init()` must return a `cleanup()` that cancels rAF, clears timers, disconnects observers and removes window listeners. `RawPage` calls it on unmount. Adding a listener without removing it in `cleanup()` is a leak.
- Brand tokens are fixed: `--red:#E3001B`, `--black:#0B0B0C`, `--paper:#FAFAF8`, `--white:#FFFFFF`, `--line:#E9E9E6`, `--grey:#8A8A8E`.
- Mobile breakpoint is **`max-width:768px`** (matches the supplied files). `IS_M` in JS must use the same value.
- Keep the `@media (max-height:600px)` blocks and the `staticScrub` flag on both pages.
- The pill nav (`shared/nav.ts`) stays on `/` and `/services`. Do not port the files' plain `<nav>` to those pages.
- Branch: `new-design-v3`. Commit after every task.

---

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `src/components/services/init.ts` | Services engine: cached geometry, dirty gating, mobile damping | 1 |
| `src/components/services/content.ts` | Services CSS: 768px mobile layer | 2 |
| `src/components/landing/content.ts` | Landing CSS+HTML: services grid, logos full, contact removed | 3 |
| `src/components/landing/init.ts` | Landing engine + svcgrid build; contact-form JS removed | 4 |
| `supabase/migrations/0001_brief_fields.sql` | Schema: 4 new columns (new file) | 5 |
| `src/types/database.ts` | Types for the 4 new columns | 5 |
| `src/app/api/contact/route.ts` | zod schema accepts the brief fields | 5 |
| `src/components/start/content.ts` | Start-project CSS + HTML (new file) | 6 |
| `src/components/start/init.ts` | Start-project chips, validation, submit, scroll morph (new file) | 6 |
| `src/components/start/StartClient.tsx` | RawPage wrapper (new file) | 6 |
| `src/app/start-project/page.tsx` | Route + metadata (new file) | 6 |
| `src/components/shared/nav.ts` | Default `ctaHref` → `/start-project` | 7 |
| `src/components/landing/LandingClient.tsx` | Nav `ctaHref` → `/start-project` | 7 |
| `src/app/sitemap.ts` | Add `/start-project` | 7 |
| `src/app/dashboard/page.tsx` | Render company / services / budget / timeline | 7 |

---

# PHASE A — Services page (lowest risk: no markup changes)

## Task 1: Services render engine

The current loop calls `getBoundingClientRect()` per section per frame **and** repaints the background gradient and light-orb every frame. Replace with cached geometry + event-gated frames + mobile damping.

**Files:**
- Modify: `src/components/services/init.ts`

**Interfaces:**
- Produces: `measure()`, `render()`, `P(id)`, and the module-scope vars `Y, dirty, VH, DOCH, AMPF, IS_M, lastZone, GEOMAP`. Task 4 mirrors this exact shape in `landing/init.ts` — keep the names identical across both files.

- [ ] **Step 1: Replace `updateDots()` to read cached geometry**

At `src/components/services/init.ts:53-58`, replace:

```js
function updateDots(){
  const mid=innerHeight/2;
  let cur=0;
  secs.forEach((s,i)=>{const r=s.getBoundingClientRect();if(r.top<=mid&&r.bottom>mid)cur=i;});
  dots.forEach((d,j)=>d.classList.toggle('on',j===cur));
}
```

with (note: `GEOMAP`, `Y`, `VH`, `lastDot` are declared in Step 3 — this function is hoisted and only ever called from `render()`, which runs after `measure()`):

```js
let lastDot=-1;
function updateDots(){
  const mid=Y+VH/2;
  let cur=0;
  secs.forEach((sc,i)=>{const g=GEOMAP[sc.id];if(g&&mid>=g.top&&mid<g.top+g.h)cur=i;});
  if(cur!==lastDot){lastDot=cur;dots.forEach((d,j)=>d.classList.toggle('on',j===cur));}
}
```

- [ ] **Step 2: Make `bgMorph` take a cached midpoint**

At `src/components/services/init.ts:88` the zones map is built. Change it to carry a cached top (`t`), filled by `measure()`:

```js
const zones=[...document.querySelectorAll('[data-bg]')].map(el=>({el,c:el.dataset.bg,t:0}));
```

Then at `init.ts:91-99`, replace `bgMorph()` with a version that takes `mid` and reads `z.t` instead of `z.el.offsetTop`:

```js
function bgMorph(mid){
  let cur=zones[0],next=null,t=0;
  for(let i=0;i<zones.length;i++){
    if(mid>=zones[i].t){cur=zones[i];next=zones[i+1]||null;}
  }
  if(next){const win=VH*0.5;t=seg(mid,next.t-win,next.t+win*0.2);}
  bg.style.backgroundColor=next?mix(cur.c,next.c,t):cur.c;
}
```

- [ ] **Step 3: Replace the master rAF block with the cached engine**

Replace the whole block at `src/components/services/init.ts:277-332` (from `/* ---------- master rAF ---------- */` down to and including `if(staticScrub){updateDots();}`) with:

```js
/* ---------- render engine: cached geometry, event-gated frames ----------
   The old loop read getBoundingClientRect() per section per frame and
   repainted the bg gradient + orb every frame. Geometry is now measured once
   (and on resize), and a frame is only rendered when scroll marked it dirty.
   On mobile the gradient interpolation is dropped for a per-zone colour swap
   — a phone repaints a full-viewport gradient far too slowly to do it live. */
const topline=document.getElementById('topline');
let Y=scrollY, dirty=true, VH=innerHeight, DOCH=1, AMPF=1, IS_M=false, lastZone=-1;
const GEOMAP={};
function measure(){
  VH=innerHeight;
  DOCH=document.documentElement.scrollHeight;
  secs.forEach(el=>{GEOMAP[el.id]={top:el.offsetTop,h:el.offsetHeight};});
  zones.forEach(z=>{z.t=z.el.offsetTop;});
  IS_M=matchMedia('(max-width:768px)').matches;
  AMPF=IS_M?0.45:1;
  buildGaze();
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
    fixEls[i].classList.toggle('on',pe>=fp);
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

  /* social parallax — damped on mobile, where the full throw reads as jitter */
  const psc=P('social');
  cols.forEach(c=>{c.style.transform=`translateY(${(0.5-psc)*2*parseFloat(c.dataset.amp)*AMPF}px)`;});
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
```

- [ ] **Step 4: Remove the now-dead `progressOf`**

`progressOf()` was defined at `init.ts:278-281` inside the block just replaced, so it is already gone. Confirm no callers remain:

Run: `npx rg "progressOf" src/components/services/init.ts`
Expected: no output.

- [ ] **Step 5: Remove `_onVis` in cleanup**

In `cleanup()` (`init.ts`, near the end), add the document listener removal. The window ones are already handled by the `_winListeners` loop:

```js
function cleanup(){
  _dead=true;
  cancelAnimationFrame(_rafId); cancelAnimationFrame(_curRaf);
  try{ioS.disconnect();}catch(e){}
  try{stopRecog();}catch(e){}
  document.removeEventListener('visibilitychange',_onVis);
  _winListeners.forEach(([t,h])=>removeEventListener(t,h));
  document.body.style.overflow='';
  document.body.classList.remove('ready','hovering');
}
```

- [ ] **Step 6: Typecheck and build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all three exit 0. (`init.ts` is `@ts-nocheck`, so `tsc` will not flag the imperative code — the build is what proves it compiles and the page still renders.)

- [ ] **Step 7: Browser check**

Run: `npm run dev`, open `http://localhost:3000/services`.

- Desktop (≥1024px): background still interpolates smoothly between sections; the light-orb still drifts; the gaze dot still tracks the path in `#eye`; the browser mock still cycles three states in `#web`.
- DevTools device toolbar at **390×844**: background now *steps* per section instead of interpolating; the social cards' parallax throw is visibly gentler.
- Resize the window: nothing jumps or mis-measures (this proves `measure()` is re-running).

- [ ] **Step 8: Commit**

```bash
git add src/components/services/init.ts
git commit -m "perf(services): cache geometry, gate frames on scroll, damp mobile parallax"
```

---

## Task 2: Services mobile CSS layer

**Files:**
- Modify: `src/components/services/content.ts`

**Interfaces:**
- Consumes: `IS_M` from Task 1 uses `max-width:768px`. The CSS breakpoint added here **must** be the same value or the JS and CSS will disagree about what "mobile" means.

- [ ] **Step 1: Add the mobile layer**

In `src/components/services/content.ts`, insert a new block **after** the `@media (max-width:640px)` block (which ends at line 434) and **before** the `/* ---------- SHORT VIEWPORTS ---------- */` comment at line 436:

```css
/* ---------- MOBILE (matches admirate-design-mobile-v2.html) ----------
   Single-hand rhythm: sections settle rather than land mid-scrub. The bg is
   faded in CSS per section instead of being repainted per frame (see IS_M in
   init.ts), and the light-orb — a 900px blurred radial — is dropped outright:
   it is the single most expensive thing on the page to composite on a phone. */
@media (max-width:768px){
  html{scroll-snap-type:y proximity;scroll-behavior:smooth}
  .sec{scroll-snap-align:start}
  .full{scroll-snap-stop:always}

  #bgfade{transition:background-color .6s ease}
  #lightorb{display:none}

  /* The dot rail stays on mobile — the supplied design keeps it, just smaller.
     (It was previously hidden below 900px.) */
  #dots{display:flex;right:7px;gap:9px}
  #dots button{width:5px;height:5px}
  #dots button.on{height:16px}

  /* Human-length scrubs: same choreography over less travel. */
  #eye{height:200vh}
  #web{height:220vh}
  #social{height:170vh}

  /* Let the logo grid breathe past one screen; snap still lands on its top. */
  #logos{height:auto;min-height:100svh}
}
```

- [ ] **Step 2: Verify the 900px rule no longer wins over the dot rail**

`@media (max-width:900px)` at line 371 contains `#dots{display:none}`. The new 768px block comes **later in source order** and re-declares `display:flex`, so at ≤768px the dots return, and between 769–900px they stay hidden. Confirm the source order is right:

Run: `npx rg -n "#dots\{display" src/components/services/content.ts`
Expected: the `display:none` line number is **lower** than the `display:flex` line number.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 4: Browser check**

`npm run dev` → `http://localhost:3000/services`, DevTools device toolbar:

- **390×844 (portrait phone):** dot rail visible on the right, small; scrolling settles section-by-section; background steps cleanly; no horizontal scrollbar.
- **844×390 (landscape phone):** the `max-height:600px` escape hatch takes over — sections flow, scrub is off, nothing is cropped. **This is the regression to watch: confirm the heading, paragraph and device mock are all fully visible in `#eye`.**
- **Desktop:** unchanged — dot rail, orb and smooth background morph all still present.

- [ ] **Step 5: Commit**

```bash
git add src/components/services/content.ts
git commit -m "feat(services): mobile layer — scroll-snap, cheap bg fade, shorter scrubs, dots restored"
```

---

# PHASE B — Landing page

## Task 3: Landing markup + CSS (services grid, logos full, contact removed)

This is the **highest-risk task in the plan** — it deletes the scrubbing services list, which is a live design element. Verify on desktop before moving on.

**Files:**
- Modify: `src/components/landing/content.ts`

**Interfaces:**
- Produces: `<div class="svcgrid" id="svcgrid">` — Task 4 fills it. `#logos .tile` elements now carry `--i`, `--dx`, `--dr` and are animated by CSS on `.sec.active`, **not** by JS.

- [ ] **Step 1: Replace the services scrub CSS with the grid CSS**

In `src/components/landing/content.ts`, replace the whole `/* ============ S3 SERVICES ============ */` block (lines 125–142, from `#services{height:240vh;...}` through `.svctrack i{...}`) with:

```css
/* ============ S3 SERVICES ============ */
#services{background:var(--paper)}
#services::before{content:"";position:absolute;inset:-40%;background-image:radial-gradient(#EBEBE7 1.2px,transparent 1.2px);background-size:34px 34px;opacity:.4;animation:dotdrift 50s linear infinite;pointer-events:none}
@keyframes dotdrift{to{transform:translate(68px,68px)}}
#services .stagewrap{padding-top:clamp(150px,22vh,200px)}
.svcgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(12px,1.6vw,18px);width:min(1000px,calc(100% - 2*var(--pad)))}
.svcblock{opacity:0;transform:translateY(26px) scale(.96);transition:opacity .55s cubic-bezier(.2,.8,.2,1),transform .55s cubic-bezier(.2,.8,.2,1)}
.sec.active .svcblock{opacity:1;transform:none;transition-delay:calc(var(--i)*50ms + .15s)}
.svcin{height:100%;background:var(--white);border:1px solid var(--line);box-shadow:5px 5px 0 rgba(11,11,12,.05);padding:clamp(14px,1.6vw,20px);display:flex;flex-direction:column;gap:12px;transition:background .25s,border-color .25s,box-shadow .25s,transform .25s;cursor:default}
.svcin:hover{background:var(--red);border-color:var(--red);box-shadow:7px 7px 0 rgba(11,11,12,.85);transform:translateY(-4px)}
.srow{display:flex;align-items:center;justify-content:space-between}
.svcblock .n{font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:var(--red);transition:color .25s}
.svcblock .ico{width:22px;height:22px;color:var(--red);transition:color .25s,transform .35s cubic-bezier(.34,1.56,.64,1)}
.svcblock .ico svg{width:100%;height:100%;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.svcblock .nm{font-family:var(--display);font-weight:800;font-stretch:106%;font-size:clamp(12px,1.25vw,16px);letter-spacing:.02em;text-transform:uppercase;color:var(--black);transition:color .25s;line-height:1.25}
.svcin:hover .n,.svcin:hover .nm{color:#fff}
.svcin:hover .ico{color:#fff;transform:rotate(-8deg) scale(1.12)}
```

- [ ] **Step 2: Make the logo tiles CSS-animated instead of scrubbed**

Replace the `.tile` rule at `content.ts:154-156` (`#logos{height:200vh;...}` and `.tile{...}`) with:

```css
/* ---- S4 LOGOS ---- */
#logos{background:var(--white)}
#logos .grid{display:grid;grid-template-columns:repeat(3,minmax(104px,168px));gap:clamp(12px,2vw,22px)}
.tile{aspect-ratio:1;background:var(--white);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:800;font-size:clamp(17px,2.2vw,27px);box-shadow:5px 5px 0 rgba(11,11,12,.05);opacity:0;transform:translateX(var(--dx,-130px)) rotate(var(--dr,-7deg)) scale(.82);transition:box-shadow .25s,border-color .25s,opacity .65s cubic-bezier(.16,1,.3,1),transform .65s cubic-bezier(.16,1,.3,1)}
.sec.active .tile{opacity:1;transform:none;transition-delay:0s,0s,calc(var(--i)*85ms + .15s),calc(var(--i)*85ms + .15s)}
```

Leave the following `.tile:hover`, `.tile span`, `.tile .dot` and `:nth-child` rules (lines 157–161) exactly as they are.

- [ ] **Step 3: Delete all contact-section CSS**

Delete the whole `/* ============ S9 CONTACT ============ */` block — `content.ts:274-305`, from the comment through `.cnote.bad{color:var(--red)}`.

- [ ] **Step 4: Purge contact + services-scrub selectors from the responsive blocks**

These selectors no longer exist. Remove every reference to them across the media queries:

- `@media (max-width:1024px)`: delete `#services{height:210vh}`, `#logos{height:175vh}`, `.svcline{...}`, `.cwrap{...}`.
- `@media (max-width:900px)`: delete `.cwrap{...}`, `.cform{...}`, and the `#services .svcbox{...}` rule.
- `@media (max-width:640px)`: delete `.svcline{...}`, `.svcmeta{...}`, `.svccount{...}`, `.cform{...}`, `.cfield textarea{...}`, `.cleft h2{...}`.
- `@media (max-height:600px)`: delete `#contact{min-height:0}`, `#services{height:auto!important}`, `#services .svcbox{...}`, `.svclist{...}`, `.svcline{...}`, `.svcmeta{display:none}`.
- `@media (prefers-reduced-motion:reduce)`: delete `#contact{height:auto}`, `#services{height:auto!important}`, `#services .svcbox{...}`, `.svclist{...}`, `.svcline{...}`, `.svcmeta{display:none}`. Add `.svcblock` to the existing pinned-end-state list so the grid is visible with motion off:

```css
  .rise,.tile,.wnav,.wcards .c,.svcblock{opacity:1!important;transform:none!important}
```

Do the same in `@media (max-height:600px)` — add `.svcblock` to its pinned list:

```css
  .rise,.tile,.wnav,.wcards .c,.svcblock{opacity:1!important;transform:none!important}
```

Verify nothing is left behind:

Run: `npx rg -n "svcline|svcbox|svclist|svcmeta|svccount|svctrack|cwrap|cleft|cform|cfield|csend|cerr|#contact" src/components/landing/content.ts`
Expected: **no output.**

- [ ] **Step 5: Add the mobile layer**

Insert **after** the `@media (max-width:640px)` block and **before** the `/* ---------- SHORT VIEWPORTS ---------- */` comment:

```css
/* ---------- MOBILE (matches admirate-landing-mobile-v3.html) ---------- */
@media (max-width:768px){
  html{scroll-snap-type:y proximity;scroll-behavior:smooth}
  .sec{scroll-snap-align:start}
  .full{scroll-snap-stop:always}

  #terminal{width:92vw;font-size:13px}
  .stagewrap{padding-top:clamp(126px,20vh,166px);gap:clamp(12px,2vh,18px)}
  #services .stagewrap{padding-top:clamp(126px,20vh,166px)}

  /* Two-up service blocks, laid out as a row so the label reads beside the icon. */
  .svcgrid{grid-template-columns:1fr 1fr;gap:10px;width:calc(100% - 2*var(--pad))}
  .svcin{flex-direction:row;align-items:center;gap:9px;padding:10px 12px}
  .srow{gap:8px;justify-content:flex-start}
  .svcblock .n{font-size:9px}
  .svcblock .ico{width:15px;height:15px}
  .svcblock .nm{font-size:10px;letter-spacing:.01em}

  #logos .grid{grid-template-columns:repeat(2,minmax(0,132px))}

  /* Human-length scrubs. */
  #tv{height:220vh}
  #web{height:230vh}
  #reels{height:240vh}

  .browser{width:min(450px,92vw)}
  .tvframe{width:min(430px,90vw)}
  .phone{height:min(64svh,480px)}
}

@media (max-width:400px){
  .svcin{padding:9px 10px}
  .svcblock .nm{font-size:9.5px}
  #logos .grid{grid-template-columns:repeat(2,1fr);gap:10px}
  .tvframe,.browser{width:94vw}
  .objcap{font-size:22px}
  .phone{height:min(62svh,440px)}
}
```

- [ ] **Step 6: Rewrite the services + logos sections in the HTML**

In `LANDING_HTML`, replace the `<!-- S3 SERVICES -->` section (lines 521–537) with:

```html
<!-- S3 SERVICES -->
<section id="services" class="sec full">
  <div class="shead">
    <div class="eb rise" style="--rd:0s">SERVICES — WHAT WE MAKE</div>
    <h2 class="light rise" style="--rd:.12s">Everything your brand needs to be seen.</h2>
  </div>
  <div class="stagewrap">
    <div class="svcgrid" id="svcgrid"></div>
  </div>
  <div class="idx">03 — 09</div>
</section>
```

Replace the `<!-- S4 LOGOS (scrub) -->` section (lines 539–558) with:

```html
<!-- S4 LOGOS -->
<section id="logos" class="sec full">
  <div class="shead">
    <div class="eb rise" style="--rd:0s">01 / IDENTITY</div>
    <h2 class="light rise" style="--rd:.12s">Logos &amp;<br>brand identity</h2>
  </div>
  <div class="stagewrap">
    <div class="grid">
      <div class="tile" style="--i:0;--dx:-130px;--dr:-7deg"><span>A<span class="dot">.</span></span></div>
      <div class="tile" style="--i:1;--dx:130px;--dr:7deg"><span>KO</span></div>
      <div class="tile" style="--i:2;--dx:-130px;--dr:-7deg"><span>▲RC</span></div>
      <div class="tile" style="--i:3;--dx:130px;--dr:7deg"><span>NEXA</span></div>
      <div class="tile" style="--i:4;--dx:-130px;--dr:-7deg"><span>Ø</span></div>
      <div class="tile" style="--i:5;--dx:130px;--dr:7deg"><span>M/8</span></div>
    </div>
  </div>
  <div class="idx">04 — 09</div>
</section>
```

- [ ] **Step 7: Delete the contact section and renumber**

Delete the whole `<!-- S9 CONTACT -->` section (lines 710–753).

Point the CTA button at the new page — in the `<!-- S10 CTA -->` section change:

```html
    <a class="btn red" href="#contact">Start your project <span class="ar">→</span></a>
```

to:

```html
    <a class="btn red" href="/start-project">Start your project <span class="ar">→</span></a>
```

Renumber every `.idx` from `— 10` to `— 09`, and renumber the sections after the deleted contact section. Final sequence, in document order:

| Section | idx |
|---|---|
| `#hero` | (none) |
| `#intro` | `02 — 09` |
| `#services` | `03 — 09` |
| `#logos` | `04 — 09` |
| `#tv` | `05 — 09` |
| `#web` | `06 — 09` |
| `#reels` | `07 — 09` |
| `#brands` | `08 — 09` |
| `#cta` | (none) |

Verify:

Run: `npx rg -n "— 10" src/components/landing/content.ts`
Expected: **no output.**

- [ ] **Step 8: Build**

Run: `npm run build`
Expected: exit 0. The page will render with an **empty** services grid until Task 4 fills it — that is expected at this point.

- [ ] **Step 9: Commit**

```bash
git add src/components/landing/content.ts
git commit -m "feat(landing): services icon grid, logos as full section, contact form removed"
```

---

## Task 4: Landing engine + services grid build

**Files:**
- Modify: `src/components/landing/init.ts`

**Interfaces:**
- Consumes: `#svcgrid` from Task 3; the existing `SVC` (12 names) and `SVCICON` (name → SVG paths) constants already in this file at `init.ts:226-228`.
- Produces: the same engine shape as Task 1 (`measure`, `render`, `P`, `GEOMAP`, `IS_M`, `AMPF`).

- [ ] **Step 1: Delete the contact-form block**

Remove `src/components/landing/init.ts:114-190` in full — the `/* ---------- contact form ---------- */` section: `cform`, `cnote`, `csend`, `csendLabel`, `FIELDS`, `IDLE_NOTE`, `setErr()`, `validate()`, the `FIELDS.forEach` input listeners, `_onSubmit`, and the `cform.addEventListener('submit',_onSubmit)` line.

Verify:

Run: `npx rg -n "cform|csend|setErr|validate\(|IDLE_NOTE" src/components/landing/init.ts`
Expected: **no output.**

- [ ] **Step 2: Build the services grid instead of the scrub list**

Replace the `svclist.innerHTML = ...` line and the `svcLines` / `svcno` / `svcprog` / `sSvc` consts (`init.ts:227` and `229-232`) with a grid build. Keep the `SVC` and `SVCICON` consts exactly as they are — only the template and the target element change:

```js
const svcgrid=document.getElementById('svcgrid');
svcgrid.innerHTML=SVC.map((n,i)=>`<div class="svcblock" style="--i:${i}"><div class="svcin"><div class="srow"><span class="n">${String(i+1).padStart(2,'0')}</span><span class="ico"><svg viewBox="0 0 24 24">${SVCICON[n]}</svg></span></div><div class="nm">${n.toUpperCase()}</div></div></div>`).join('');
```

Also delete the `const svclist=document.getElementById('svclist');` line at `init.ts:227`.

- [ ] **Step 3: Delete the logos tile scrub and the services scrub from `tick2`**

In `tick2()`, delete the `/* services: rolling index */` block (`init.ts:278-290`) and the `/* logos: tiles fly in... */` block (`init.ts:292-299`) in full. Both are CSS-driven now (`.sec.active .svcblock` / `.sec.active .tile`).

Also delete the now-unused `const sLogos=document.getElementById('logos'),` line and the `const tiles=[...document.querySelectorAll('.tile')];` line.

Verify:

Run: `npx rg -n "svcLines|svcno|svcprog|sSvc|sLogos|svclist" src/components/landing/init.ts`
Expected: **no output.**

- [ ] **Step 4: Swap in the cached engine**

Replace the remainder of the scrub engine — `progressOf()` (`init.ts:217-221`), `updateDots()` (`init.ts:263-271`), and the `tick2()` / `_rafId` / `if(staticScrub)` block (`init.ts:273-336`) — with:

```js
/* ---------- render engine: cached geometry, event-gated frames ---------- */
let Y=scrollY, dirty=true, VH=innerHeight, IS_M=false, AMPF=1, lastDot=-1;
const GEOMAP={};
function measure(){
  VH=innerHeight;
  secs.forEach(el=>{GEOMAP[el.id]={top:el.offsetTop,h:el.offsetHeight};});
  IS_M=matchMedia('(max-width:768px)').matches;
  AMPF=IS_M?0.45:1;
  dirty=true;
}
const P=id=>{const g=GEOMAP[id];return g?clamp((Y-g.top)/((g.h-VH)||1),0,1):0;};

function updateDots(){
  const mid=Y+VH/2;
  let cur=0;
  secs.forEach((s,i)=>{const g=GEOMAP[s.id];if(g&&mid>=g.top&&mid<g.top+g.h)cur=i;});
  if(cur!==lastDot){lastDot=cur;dots.forEach((d,j)=>d.classList.toggle('on',j===cur));}
}

function render(){
  updateDots();

  /* video: scenes by thirds, channel, timecode, bar */
  const pt=P('tv');
  const idxT=Math.min(2, Math.floor(pt*3));
  frames.forEach((f,i)=>f.classList.toggle('on', i===idxT));
  chan.textContent='CH 0'+(idxT+1);
  const secsT=pt*30, ss=String(Math.floor(secsT)).padStart(2,'0'), ff=String(Math.floor((secsT%1)*24)).padStart(2,'0');
  tcode.textContent=`TC 00:${ss}:${ff}`;
  tvprog.style.width=(pt*100)+'%';

  /* website: staged build, scrub-linked */
  const pw=P('web');
  const t1=seg(pw,0,.15);   urlbar.textContent=URL_TXT.slice(0, Math.round(t1*URL_TXT.length));
  const t2=ease(seg(pw,.15,.30)); wnav.style.transform=`translateY(${-42*(1-t2)}px)`; wnav.style.opacity=t2;
  const t3=ease(seg(pw,.30,.55)); whero.style.clipPath=`inset(0 ${(1-t3)*100}% 0 0)`;
  cards.forEach((c,i)=>{ const tc2=ease(seg(pw,.55+i*.08,.72+i*.08)); c.style.opacity=tc2; c.style.transform=`scale(${0.75+0.25*tc2})`; });
  const t5=seg(pw,.80,1); const b=t5<0.7?(t5/0.7)*1.1:1.1-((t5-0.7)/0.3)*0.1; wbtn.style.transform=`scale(${t5===0?0:b})`;
  livechip.style.opacity=seg(pw,.92,1); livechip.style.transform=`translateY(${8*(1-seg(pw,.92,1))}px)`;

  /* reels: track scroll, tilt, live per card, counters, side bar */
  const pr=P('reels');
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

function tick2(){
  if(_dead) return;
  if(!staticScrub && !document.hidden && dirty){ dirty=false; Y=scrollY; render(); }
  _rafId=requestAnimationFrame(tick2);
}
_rafId=requestAnimationFrame(tick2);
if(staticScrub){ Y=scrollY; measure(); updateDots(); }
```

- [ ] **Step 5: Remove the document listener in cleanup**

In `cleanup()`, add the `visibilitychange` removal and drop the contact-form references:

```js
function cleanup(){
  _dead=true;
  cancelAnimationFrame(_rafId);
  if(cntRaf)cancelAnimationFrame(cntRaf);
  _timers.forEach(clearTimeout);
  try{ioS.disconnect();}catch(e){}
  try{stopIntro();}catch(e){}
  document.removeEventListener('click',_onAnchor);
  document.removeEventListener('visibilitychange',_onVis);
  _winListeners.forEach(([t,h])=>removeEventListener(t,h));
  document.body.classList.remove('locked','loaded');
}
```

- [ ] **Step 6: Typecheck, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all exit 0.

- [ ] **Step 7: Browser check**

`npm run dev` → `http://localhost:3000/`

- **Desktop:** loader plays; hero letters split in; the services section now shows **12 icon blocks in a 4-col grid** that stagger in when the section activates (hover fills red, icon rotates); logo tiles fly in from alternating sides; TV/web/reels scrubs still work; **no contact section**; "Start your project" links to `/start-project` (404 until Task 6 — expected).
- **390×844:** services grid is 2-col with the icon beside the label; logos 2-col; sections snap.
- **844×390:** the `max-height:600px` hatch flows everything; the services grid and logo tiles are **visible, not stuck at opacity:0** (this is what the `.svcblock` pin in Task 3 Step 4 guards).

- [ ] **Step 8: Commit**

```bash
git add src/components/landing/init.ts
git commit -m "feat(landing): build services grid, drop scrub+contact JS, cache geometry"
```

---

# PHASE C — Start-a-Project page + data layer

## Task 5: Data layer (migration, types, API)

Do this **before** the page, so the form has a real endpoint to post to.

**Files:**
- Create: `supabase/migrations/0001_brief_fields.sql`
- Modify: `src/types/database.ts`
- Modify: `src/app/api/contact/route.ts`

**Interfaces:**
- Produces: `POST /api/contact` accepts `{name, email, phone?, message, company?, services?, budget?, timeline?}`. Task 6's form posts exactly this shape. `services` must be sent as a real JS array — a comma-joined string will be coerced and stored wrong.

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/0001_brief_fields.sql`:

```sql
-- Fields collected by the /start-project brief. All nullable/defaulted so the
-- existing contact path and every existing row keep working untouched.
ALTER TABLE contact_submissions
  ADD COLUMN IF NOT EXISTS company  TEXT,
  ADD COLUMN IF NOT EXISTS services TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS budget   TEXT,
  ADD COLUMN IF NOT EXISTS timeline TEXT;
```

- [ ] **Step 2: Run the migration against Supabase**

Paste the SQL above into the Supabase SQL editor for the project and run it.

Verify in the Supabase table editor that `contact_submissions` now has `company`, `services`, `budget`, `timeline`.

**This step is a hard gate.** If the columns are missing, every insert in Task 6 fails with `PGRST204 column not found`, and the failure surfaces as a generic 500.

- [ ] **Step 3: Extend the database types**

In `src/types/database.ts`, add the four fields to all three shapes of `contact_submissions`:

```ts
      contact_submissions: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          status: string;
          company: string | null;
          services: string[];
          budget: string | null;
          timeline: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          status?: string;
          company?: string | null;
          services?: string[];
          budget?: string | null;
          timeline?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          status?: string;
          company?: string | null;
          services?: string[];
          budget?: string | null;
          timeline?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
```

- [ ] **Step 4: Extend the zod schema and the insert**

In `src/app/api/contact/route.ts`, extend `contactSchema` (the four new fields are all optional, so the landing→contact path — which never sent them — is unaffected):

```ts
const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .max(20, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
  company: z.string().max(120, "Company name is too long").optional().or(z.literal("")),
  services: z.array(z.string().max(60)).max(20).optional(),
  budget: z.string().max(40).optional().or(z.literal("")),
  timeline: z.string().max(40).optional().or(z.literal("")),
});
```

And extend the insert:

```ts
    const { error } = await supabase.from("contact_submissions").insert({
      name: validated.name,
      email: validated.email,
      phone: validated.phone || null,
      message: validated.message,
      company: validated.company || null,
      services: validated.services ?? [],
      budget: validated.budget || null,
      timeline: validated.timeline || null,
    });
```

- [ ] **Step 5: Typecheck and build**

Run: `npx tsc --noEmit && npm run build`
Expected: exit 0. If `tsc` complains that `services` is not assignable, the `Insert` type in Step 3 was not saved — fix it there, not with a cast.

- [ ] **Step 6: Prove the endpoint round-trips**

With `npm run dev` running:

```bash
curl -s -X POST http://localhost:3000/api/contact \
  -H 'Content-Type: application/json' \
  -d '{"name":"Plan Test","email":"test@example.com","message":"This is a test brief of sufficient length.","company":"Oslo & Co","services":["Websites","Branding"],"budget":"₹2–5L","timeline":"ASAP"}'
```

Expected: `{"message":"Thank you! We'll get back to you soon."}`

Then open the row in the Supabase table editor and confirm **`services` is an array `{Websites,Branding}`, not the string `"Websites,Branding"`.** Delete the test row afterwards.

- [ ] **Step 7: Commit**

```bash
git add supabase/migrations/0001_brief_fields.sql src/types/database.ts src/app/api/contact/route.ts
git commit -m "feat(api): accept company, services, budget and timeline on contact submissions"
```

---

## Task 6: The `/start-project` page

**Files:**
- Create: `src/components/start/content.ts`
- Create: `src/components/start/init.ts`
- Create: `src/components/start/StartClient.tsx`
- Create: `src/app/start-project/page.tsx`

**Interfaces:**
- Consumes: `POST /api/contact` from Task 5.
- Produces: the route `/start-project`, referenced by Task 7.

- [ ] **Step 1: Create the content module**

Create `src/components/start/content.ts`. Port the `<style>` block from `admirate-start-project.html` verbatim into `START_CSS` and the `<body>` markup (everything inside `<main>`, plus `#bgfade`, `#topline`, `#cdot`, `#cring`, `nav` and `footer`) into `START_HTML`, both as `String.raw` templates.

Two required deviations from the file:

1. The file's success copy and the chip data stay as-is.
2. Change the email chip's `href` from the file's `mailto:hello@admirate.in` to **`mailto:essentials@admirate.in`** — `hello@` is not a real inbox for this business; `essentials@` is the address used everywhere else in the codebase (`api/email/send/route.ts`, the landing contact block that was just removed).

```ts
export const START_CSS = String.raw`
/* …the full <style> contents of admirate-start-project.html… */
`;

export const START_HTML = String.raw`
<div id="bgfade"></div>
<div id="topline"></div>
<div id="cdot"></div><div id="cring"></div>

<nav>
  <a class="logo" href="/" data-h>ADMIRATE<b>.</b></a>
  <a class="back" href="/" data-h>← BACK TO SITE</a>
</nav>

<main>
  <!-- …#intro and #formsec exactly as in the file… -->
</main>

<footer>
  <div>© 2026 ADMIRATE.IN</div>
  <div>MADE TO CONVERT</div>
</footer>
`;
```

- [ ] **Step 2: Create the init module**

Create `src/components/start/init.ts`. Port the file's IIFE, converting it to the codebase's cleanup convention: a `_dead` flag, a `_winListeners` array, a `_timers` array, and a returned `cleanup()`.

The submit handler replaces the file's `console.log` + `setTimeout` stub with a real call to `/api/contact`. Note `brief` maps to `message`:

```ts
// @ts-nocheck

export default function initStart(){
let _dead=false, _rafId=0, _curRaf=0;
const _winListeners=[];
const _timers=[];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
requestAnimationFrame(()=>{ if(!_dead) document.body.classList.add('ready'); });
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);

/* …cursor, bindHover, ink→paper scroll morph, fcard IntersectionObserver,
   and fillChips() — all ported from the file… */

/* submit */
const form=document.getElementById('brief');
const status=document.getElementById('fstatus');
const fcard=document.getElementById('fcard');
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
      /* `brief` is the API's `message`; `services` must go as an array. */
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
  _winListeners.forEach(([t,h])=>removeEventListener(t,h));
  document.body.classList.remove('ready','hovering');
}
return cleanup;
}
```

Unlike the file, failures are surfaced to the user rather than swallowed — the success card must never appear for a submission that did not save.

- [ ] **Step 3: Create the client wrapper**

Create `src/components/start/StartClient.tsx`, following `LandingClient.tsx`. **No pill nav** — this page ships its own `← BACK TO SITE` nav:

```tsx
"use client";

import RawPage from "@/components/RawPage";
import { START_CSS, START_HTML } from "@/components/start/content";
import initStart from "@/components/start/init";

export default function StartClient() {
  return (
    <RawPage
      css={START_CSS}
      html={START_HTML}
      init={() => initStart()}
    />
  );
}
```

- [ ] **Step 4: Create the route**

Create `src/app/start-project/page.tsx`:

```tsx
import type { Metadata } from "next";
import StartClient from "@/components/start/StartClient";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Tell us about your project — branding, websites, social, video or packaging. We reply within one working day.",
  alternates: { canonical: "/start-project" },
};

export default function StartProjectPage() {
  return <StartClient />;
}
```

- [ ] **Step 5: Typecheck, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: exit 0, and `/start-project` appears in the route list.

- [ ] **Step 6: Browser check**

`npm run dev` → `http://localhost:3000/start-project`

- Scroll: background morphs **ink → paper** as the form arrives; the intro drifts up and fades; the top progress line fills.
- Form card staggers in when it enters the viewport.
- Chips: `services` allows **multiple** selections; `budget` and `timeline` allow **one** (clicking a second deselects the first; clicking the selected one clears it).
- Submit empty → the three required fields go red and shake, status reads `// FILL THE MARKED FIELDS FIRST.`
- Submit a valid brief with 2 services + a budget + a timeline → success card draws its circle and tick.
- **Check the Supabase row: `services` is an array, `budget` and `timeline` are populated.**
- "Send another brief" resets the form and clears every chip.
- **390×844:** the two-column `.frow` collapses to one column; nav becomes the frosted bar; nothing overflows horizontally.
- Navigate away and back (`/` → `/start-project`) twice: no duplicated listeners, no console errors — this proves `cleanup()` runs.

- [ ] **Step 7: Commit**

```bash
git add src/components/start src/app/start-project
git commit -m "feat: add /start-project brief page wired to the contact API"
```

---

## Task 7: Routing cleanup + dashboard fields

Every link that pointed at the deleted `#contact` anchor is now dead. Fix them, list the page, and surface the new fields to whoever reads the inbox.

**Files:**
- Modify: `src/components/shared/nav.ts`
- Modify: `src/components/landing/LandingClient.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/dashboard/page.tsx`

- [ ] **Step 1: Repoint the nav CTA default**

In `src/components/shared/nav.ts:101`, change the default:

```ts
export const navHtml = (active: NavPage, ctaHref = "/start-project") => `
```

`ServicesClient.tsx` and the blogs clients call `navHtml("services")` / `navHtml("blogs")` with no second argument, so they pick this up automatically.

- [ ] **Step 2: Repoint the landing nav CTA**

In `src/components/landing/LandingClient.tsx:12`, the nav currently points at the deleted anchor:

```tsx
      html={navHtml("home", "#contact") + LANDING_HTML}
```

Change to:

```tsx
      html={navHtml("home", "/start-project") + LANDING_HTML}
```

- [ ] **Step 3: Verify no dead anchors remain**

Run: `npx rg -n '#contact' src/`
Expected: **no output.**

- [ ] **Step 4: Add the page to the sitemap**

In `src/app/sitemap.ts`, add an entry after the `/services` block:

```ts
    {
      url: `${baseUrl}/start-project`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
```

- [ ] **Step 5: Show the brief fields in the dashboard**

In `src/app/dashboard/page.tsx`, extend the `Submission` type (line 6):

```tsx
type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  company: string | null;
  services: string[] | null;
  budget: string | null;
  timeline: string | null;
  created_at: string;
};
```

Then, inside the card, immediately **after** the message `<p>` (line 135-137) and **before** the date `<p>`, add a details block. Every part is conditional, so the rows that predate the migration render exactly as they do today:

```tsx
                  {submission.company && (
                    <p className="text-xs text-gray-500 mt-2">
                      {submission.company}
                    </p>
                  )}

                  {submission.services && submission.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {submission.services.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {(submission.budget || submission.timeline) && (
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      {submission.budget && (
                        <span>
                          Budget: <b className="font-medium text-gray-700">{submission.budget}</b>
                        </span>
                      )}
                      {submission.timeline && (
                        <span>
                          Timeline: <b className="font-medium text-gray-700">{submission.timeline}</b>
                        </span>
                      )}
                    </div>
                  )}
```

- [ ] **Step 6: Typecheck, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all exit 0.

- [ ] **Step 7: Full-site browser check**

`npm run dev`:

- `/` — pill nav "Start" CTA → `/start-project`. CTA button "Start your project" → `/start-project`.
- `/services` — pill nav "Start" CTA → `/start-project`.
- `/blogs` — pill nav "Start" CTA → `/start-project`.
- `/start-project` — submit a brief with services, budget and timeline.
- `/dashboard` — log in, confirm the new submission shows the company line, the service chips and the budget/timeline row; confirm an **older** submission (no brief fields) still renders cleanly with none of them.
- `http://localhost:3000/sitemap.xml` — contains `/start-project`.

- [ ] **Step 8: Commit**

```bash
git add src/components/shared/nav.ts src/components/landing/LandingClient.tsx src/app/sitemap.ts src/app/dashboard/page.tsx
git commit -m "feat: route all CTAs to /start-project, list it, show brief fields in dashboard"
```

---

## Done

Final verification across the whole branch:

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Then walk `/`, `/services`, `/blogs`, `/start-project` at **390×844**, **844×390** and desktop, and `/dashboard` at desktop.
