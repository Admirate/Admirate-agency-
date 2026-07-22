// @ts-nocheck

import { optimized } from "@/lib/cdn";

/**
 * CLIENT WEBSITES — one browser frame, one rail, shared by /services and
 * /services/digital.
 *
 * The section has to prove the studio ships real websites, so it shows real
 * websites. One large browser frame holds an actual screenshot of the live
 * page; a rail switches which site is loaded. Picking a client retypes the
 * domain in the address bar and sweeps a load bar under it — the section
 * behaves like the thing it is showing. Hovering the frame scrolls the page
 * inside it, so what you get is the site, not a thumbnail of it.
 *
 * Shared rather than ported, the way nav.ts is. The service pages deliberately
 * share no section grammar (see registry.ts), but this is one component doing
 * one job in two places, and it carries a seeded roster, a dashboard fetch, an
 * XSS guard on client-supplied URLs and a per-image pan measurement. Two copies
 * of that would drift, and the copy that drifted would be the one nobody looked
 * at again.
 *
 * The hosts differ in exactly one way — what marks the section as revealed —
 * so `showcaseCss` takes that selector rather than assuming it: /services uses
 * `.sec.active`, the service pages use `.dgs.in`.
 */

export type ShowcaseClient = {
  name: string;
  tag: string;
  url: string;
  shot: string;
  desc: string;
  chips: string[];
  href?: string;
};

/* Copy written from the live sites, not invented: Patil Group is railway
   infrastructure (it was previously described as real estate, which it is
   not). Replaced at runtime by /api/portfolio when the dashboard has any
   projects in it. */
export const SHOWCASE_CLIENTS: ShowcaseClient[] = [
  {
    name: "SPORTEX",
    tag: "Sports expo",
    url: "sportex.in",
    shot: "/shots/sportex.jpeg",
    desc: "India's largest sports, fitness and wellness expo. Built to hold up under launch-week traffic, with visitor registration and exhibitor enquiries on one clean path.",
    chips: ["WEB", "EVENT", "REGISTRATION"],
  },
  {
    name: "PATIL GROUP",
    tag: "Railway infrastructure",
    url: "patilgroup.com",
    shot: "/shots/patil.jpeg",
    desc: "The world's largest sleeper manufacturer, fifty years on the job. A corporate site that carries the scale of the work without raising its voice.",
    chips: ["WEB", "CORPORATE", "PROJECTS"],
  },
  {
    name: "HOPE TRUST INDIA",
    tag: "Mental health & rehab",
    url: "hopetrustindia.com",
    shot: "/shots/hopetrust.jpeg",
    desc: "Addiction and mental-health care. This site had to work for someone reaching out at their lowest — clear programmes, honest copy, a therapist one click away.",
    chips: ["WEB", "BRAND", "CONTENT"],
  },
  {
    name: "OUR SACRED SPACE",
    tag: "Arts & culture venue",
    url: "oursacredspace.com",
    shot: "/shots/oss.jpeg",
    desc: "Art, movement and mindful living. A venue whose calendar is the product — events, classes and workshops up front, and booking a space never more than one click away.",
    chips: ["WEB", "EVENTS", "BOOKINGS"],
  },
  {
    name: "SOUTH GLASS",
    tag: "Premium glass",
    url: "southglass.in",
    shot: "/shots/southglass.jpeg",
    desc: "Glass and facades, established 2014. A technical product made to feel premium — product ranges, finishes, and a quote request that actually converts.",
    chips: ["IDENTITY", "WEB", "QUOTES"],
  },
];

/**
 * @param reveal Selector the host sets once the section is on screen — the
 *   component's entrance hangs off it. `.sec.active` on /services, `.dgs.in`
 *   on a service page.
 */
export const showcaseCss = (reveal: string) => String.raw`
.showcase{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(230px,.85fr);gap:clamp(20px,2.8vw,40px);width:min(1120px,100%);align-items:start}

/* ---- the browser ---- */
.bframe{position:relative;background:var(--white);border:1px solid var(--line);border-radius:10px;overflow:hidden;box-shadow:0 26px 60px rgba(11,11,12,.13),6px 6px 0 rgba(11,11,12,.05);opacity:0;transform:translateY(26px);transition:opacity .7s cubic-bezier(.2,.8,.2,1),transform .7s cubic-bezier(.2,.8,.2,1)}
${reveal} .bframe{opacity:1;transform:none;transition-delay:.2s}
.bbar{position:relative;display:flex;align-items:center;gap:10px;padding:10px 12px;border-bottom:1px solid var(--line);background:#FBFBFA}
.bdots{display:flex;gap:6px;flex:0 0 auto}
.bdots i{width:8px;height:8px;border-radius:50%;background:#DDD}
.bdots i:first-child{background:var(--red)}
.baddr{flex:1;min-width:0;display:flex;align-items:center;background:#F0F0ED;border-radius:5px;padding:6px 11px;font-family:var(--mono);font-size:11px;color:#55555a;white-space:nowrap;overflow:hidden}
.baddr b{font-weight:400;color:#2a2a2e}
/* The caret only blinks while the domain is being typed — it is a state, not decoration. */
.bcaret{width:1px;height:12px;background:var(--red);margin-left:2px;opacity:0;flex:0 0 1px}
.bframe.loading .bcaret{opacity:1;animation:bcar .66s steps(2) infinite}
@keyframes bcar{50%{opacity:0}}
.bgo{flex:0 0 auto;width:27px;height:27px;border-radius:5px;display:flex;align-items:center;justify-content:center;color:var(--grey);text-decoration:none;font-size:13px;transition:background .2s,color .2s}
.bgo:hover{background:var(--red);color:#fff}
.bload{position:absolute;left:0;bottom:-1px;height:2px;width:100%;background:var(--red);transform:scaleX(0);transform-origin:left;opacity:0}
.bframe.loading .bload{animation:bload .9s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes bload{0%{opacity:1;transform:scaleX(0)}72%{opacity:1;transform:scaleX(.92)}100%{opacity:0;transform:scaleX(1)}}

.bview{position:relative;aspect-ratio:16/10;overflow:hidden;background:#EFEFEC}
/* --pan is how far this particular shot can travel inside the frame. JS measures
   it per image, so a dashboard-supplied screenshot of any height still lands
   flush at the bottom instead of over- or under-scrolling. */
/* The captures include the browser's own scrollbar down their right edge. The
   extra width pushes that strip past the frame instead of showing it.
   max-width:none is required — Tailwind's preflight sets img{max-width:100%}
   globally from globals.css, which silently clamps the overhang back to zero. */
/* --pandur is set per shot in measurePan(), so the pan holds a constant speed
   across screenshots of very different heights. 7s is the fallback only. */
.bview img{position:absolute;top:0;left:0;width:calc(100% + 18px);max-width:none;height:auto;display:block;opacity:0;transition:opacity .5s ease,transform var(--pandur,7s) linear}
.bview img.in{opacity:1}
@media (hover:hover){
  .bframe:hover .bview img.in{transform:translateY(var(--pan,0px))}
}
.bhint{position:absolute;right:11px;bottom:10px;z-index:2;font-family:var(--mono);font-size:9px;letter-spacing:.16em;color:#fff;background:rgba(11,11,12,.55);backdrop-filter:blur(4px);padding:5px 10px;border-radius:20px;opacity:0;transition:opacity .35s;pointer-events:none}
${reveal} .bframe .bhint{opacity:1;transition-delay:1.2s}
${reveal} .bframe:hover .bhint{opacity:0;transition-delay:0s}
@media (pointer:coarse){.bhint{display:none}}

/* ---- the client rail ---- */
.cside{display:flex;flex-direction:column;gap:18px;opacity:0;transform:translateY(26px);transition:opacity .7s cubic-bezier(.2,.8,.2,1),transform .7s cubic-bezier(.2,.8,.2,1)}
${reveal} .cside{opacity:1;transform:none;transition-delay:.32s}
.crail{display:flex;flex-direction:column;border-top:1px solid var(--line)}
.cli{position:relative;width:100%;text-align:left;background:none;padding:13px 14px 13px 17px;border-bottom:1px solid var(--line);display:flex;flex-direction:column;gap:3px;transition:background .25s}
.cli::before{content:"";position:absolute;left:0;top:-1px;bottom:-1px;width:2px;background:var(--red);transform:scaleY(0);transform-origin:top;transition:transform .35s cubic-bezier(.2,.8,.2,1)}
.cli.on::before{transform:scaleY(1)}
.cli:hover{background:rgba(11,11,12,.03)}
.cln{font-family:var(--display);font-weight:800;font-stretch:106%;font-size:14px;letter-spacing:.02em;text-transform:uppercase;color:var(--grey);transition:color .25s}
.cli.on .cln,.cli:hover .cln{color:var(--black)}
.cls{font-family:var(--mono);font-size:10px;letter-spacing:.11em;color:var(--grey);transition:color .25s}
.cli.on .cls{color:var(--red)}

.cdesc{font-weight:300;font-size:14px;line-height:1.62;color:#4a4a4d}
.chips{display:flex;flex-wrap:wrap;gap:7px}
.chips span{font-family:var(--mono);font-size:9.5px;letter-spacing:.1em;border:1px solid var(--line);padding:6px 10px;border-radius:20px;color:#3a3a3d}
.cvisit{align-self:flex-start;font-family:var(--body);font-weight:600;font-size:13.5px;text-decoration:none;background:var(--black);color:#fff;padding:12px 18px;display:inline-flex;gap:8px;align-items:center;transition:transform .18s,box-shadow .18s}
.cvisit .ar{transition:transform .18s}
.cvisit:hover{transform:translateY(-2px);box-shadow:4px 4px 0 var(--red)}
.cvisit:hover .ar{transform:translate(2px,-2px)}
.cli:focus-visible,.bgo:focus-visible,.cvisit:focus-visible{outline:2px solid var(--red);outline-offset:2px}

/* ---- responsive, carried with the component rather than left to the host ---- */
@media (max-width:1024px){
  .showcase{grid-template-columns:minmax(0,1.5fr) minmax(200px,1fr);width:min(880px,100%)}
}
@media (max-width:900px){
  /* Frame over rail. The rail turns into a two-up row of tabs so all the
     clients stay reachable without a scroll. */
  .showcase{grid-template-columns:1fr;width:min(620px,100%)}
  .crail{display:grid;grid-template-columns:1fr 1fr}
  .cli{padding-left:15px}
}
@media (max-width:640px){
  .showcase{gap:16px}
  .cln{font-size:12.5px}
  .cls{font-size:9px;letter-spacing:.08em}
  .baddr{font-size:10px}
}
@media (max-height:600px){
  .showcase{grid-template-columns:minmax(0,1.6fr) minmax(190px,1fr);width:min(760px,100%)}
}
@media (prefers-reduced-motion:reduce){
  /* The entrance is pinned open rather than played, and the frame does not pan. */
  .bframe,.cside{opacity:1!important;transform:none!important}
  .bview img{transform:none!important;transition:none!important}
}
`;

export const SHOWCASE_HTML = String.raw`
<div class="showcase">
  <div class="bframe" id="bframe">
    <div class="bbar">
      <span class="bdots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="baddr"><b id="baddr"></b><em class="bcaret" aria-hidden="true"></em></span>
      <a class="bgo" id="bgo" target="_blank" rel="noopener noreferrer" data-h aria-label="Open this site in a new tab">↗</a>
      <span class="bload" aria-hidden="true"></span>
    </div>
    <div class="bview">
      <img id="bshot" alt="">
      <span class="bhint" aria-hidden="true">HOVER TO SCROLL THE PAGE</span>
    </div>
  </div>

  <aside class="cside">
    <div class="crail" id="crail"></div>
    <p class="cdesc" id="cdesc"></p>
    <div class="chips" id="cchips"></div>
    <a class="cvisit" id="cvisit" target="_blank" rel="noopener noreferrer" data-h>Open <span id="cvisitd"></span> <span class="ar">↗</span></a>
  </aside>
</div>`;

/**
 * Drives the showcase. Returns a cleanup that stops every timer and detaches
 * every listener, so a host can call it from its own teardown.
 *
 * @param onRailRendered Called with the rail element each time it is rebuilt.
 *   /services uses it to re-bind its custom cursor to the new buttons; a page
 *   without one passes nothing.
 */
export function initShowcase({ onRailRendered } = {}) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );

  const bframe = document.getElementById("bframe");
  const bshot = document.getElementById("bshot");
  const baddr = document.getElementById("baddr");
  const bgo = document.getElementById("bgo");
  const crail = document.getElementById("crail");
  const cdesc = document.getElementById("cdesc");
  const cchips = document.getElementById("cchips");
  const cvisit = document.getElementById("cvisit");
  const cvisitd = document.getElementById("cvisitd");

  /* A host that does not carry the section still calls this. */
  if (!bframe || !crail) return () => {};

  let CLIENTS = SHOWCASE_CLIENTS;
  let dead = false;
  let ci = -1;
  let typeTimer = 0;
  let loadTimer = 0;

  /* Only http(s) may ever reach an href here. `external_url` arrives from the
     portfolio table, and /api/portfolio accepts writes without authentication,
     so a stored "javascript:" URL would otherwise execute on this public page
     the moment a visitor clicked the link. Anything that is not http(s) is
     refused rather than rendered — a dead link beats a script sink. */
  const hrefOf = (c) => {
    const raw = String(c.href || "https://" + String(c.url || "")).trim();
    try {
      const u = new URL(raw);
      if (u.protocol === "http:" || u.protocol === "https:") return u.href;
    } catch (e) {
      /* unparseable — fall through */
    }
    return "#";
  };

  function renderRail() {
    crail.innerHTML = CLIENTS.map(
      (c, i) =>
        `<button class="cli" data-i="${i}" data-h aria-pressed="false">
      <span class="cln">${esc(c.name)}</span>
      <span class="cls">${esc(c.tag)}</span>
    </button>`,
    ).join("");
    if (typeof onRailRendered === "function") onRailRendered(crail);
  }

  /* The shot is taller than the frame; --pan is exactly how far it may travel so
     it comes to rest flush with its own bottom edge rather than over-scrolling. */
  function measurePan() {
    const view = bshot.parentElement;
    if (!view || !bshot.naturalWidth) return;
    /* Read the height the image actually renders at, so the CSS that widens it
       to crop the scrollbar is accounted for rather than guessed around. */
    const imgH = bshot.getBoundingClientRect().height;
    const pan = Math.max(0, Math.round(imgH - view.clientHeight));
    bframe.style.setProperty("--pan", `-${pan}px`);
    /* Pan at a constant speed rather than in a constant time. The shots are real
       full-page captures and their heights differ by more than 2x, so a fixed
       duration made the tall ones race and the short ones crawl — the same
       gesture reading as a different speed per client. ~230px/s is roughly a
       human scroll; clamped so nothing is over in a blink or outstays its
       welcome. */
    bframe.style.setProperty(
      "--pandur",
      `${Math.min(16, Math.max(4, pan / 230)).toFixed(1)}s`,
    );
  }

  /* Typing the domain is the section's one flourish: the frame navigates, like
     the thing it is showing. Under reduced motion it simply appears. */
  function typeUrl(text) {
    clearInterval(typeTimer);
    if (reduced) {
      baddr.textContent = text;
      return;
    }
    baddr.textContent = "";
    let i = 0;
    typeTimer = setInterval(() => {
      if (dead) {
        clearInterval(typeTimer);
        return;
      }
      baddr.textContent = text.slice(0, ++i);
      if (i >= text.length) clearInterval(typeTimer);
    }, 26);
  }

  function selectClient(i) {
    if (i === ci) return;
    ci = (i + CLIENTS.length) % CLIENTS.length;
    const c = CLIENTS[ci];

    [...crail.children].forEach((b, j) => {
      b.classList.toggle("on", j === ci);
      b.setAttribute("aria-pressed", j === ci ? "true" : "false");
    });

    typeUrl(c.url);
    if (!reduced) {
      bframe.classList.remove("loading");
      void bframe.offsetWidth;
      bframe.classList.add("loading");
      clearTimeout(loadTimer);
      loadTimer = setTimeout(() => {
        if (!dead) bframe.classList.remove("loading");
      }, 950);
    }

    bshot.classList.remove("in");
    bshot.alt = c.name + " website";
    /* Print-scale screenshots go through Next's optimizer rather than down the wire. */
    bshot.src = c.shot ? optimized(c.shot, 1200) : "";

    cdesc.textContent = c.desc;
    cchips.innerHTML = c.chips.map((x) => `<span>${esc(x)}</span>`).join("");
    cvisit.href = hrefOf(c);
    cvisitd.textContent = c.url;
    bgo.href = hrefOf(c);
  }

  const onShotLoad = () => {
    measurePan();
    bshot.classList.add("in");
  };
  const onShotError = () => bshot.classList.remove("in");
  const onRailClick = (e) => {
    const b = e.target.closest(".cli");
    if (b) selectClient(+b.dataset.i);
  };
  /* The pan is a measurement, so anything that can change the frame's size has
     to retake it. The component owns these rather than asking the host to call
     in from its own measure() — that coupling is what made the pan silently
     stop being remeasured the moment a second page rendered the section.
     Orientation change reports the old viewport for a beat on iOS, hence the
     settle delay. */
  const onResize = () => measurePan();
  const settle = () => {
    remeasureTimer = setTimeout(measurePan, 250);
  };
  const onVis = () => {
    if (!document.hidden) measurePan();
  };
  let remeasureTimer = 0;

  bshot.addEventListener("load", onShotLoad);
  bshot.addEventListener("error", onShotError);
  crail.addEventListener("click", onRailClick);
  addEventListener("resize", onResize, { passive: true });
  addEventListener("orientationchange", settle, { passive: true });
  addEventListener("load", settle, { once: true });
  document.addEventListener("visibilitychange", onVis);

  renderRail();
  selectClient(0);

  /* Pull the dashboard-managed portfolio; keep the seeded roster if it's empty. */
  (async () => {
    try {
      const res = await fetch("/api/portfolio");
      if (!res.ok) return;
      const data = await res.json();
      if (dead || !Array.isArray(data) || data.length === 0) return;
      CLIENTS = data.map((p) => ({
        name: p.title,
        tag: (p.tags && p.tags[0]) || "Client website",
        url: String(p.external_url || "")
          .replace(/^https?:\/\//, "")
          .replace(/\/$/, ""),
        href: p.external_url,
        shot: p.image_url || "",
        desc: p.description,
        chips: (p.tags || []).map((t) => String(t).toUpperCase()),
      }));
      renderRail();
      ci = -1;
      selectClient(0);
    } catch {
      /* keep the seeded roster */
    }
  })();

  return function cleanup() {
    dead = true;
    clearInterval(typeTimer);
    clearTimeout(loadTimer);
    clearTimeout(remeasureTimer);
    bshot.removeEventListener("load", onShotLoad);
    bshot.removeEventListener("error", onShotError);
    crail.removeEventListener("click", onRailClick);
    removeEventListener("resize", onResize);
    removeEventListener("orientationchange", settle);
    removeEventListener("load", settle);
    document.removeEventListener("visibilitychange", onVis);
  };
}
