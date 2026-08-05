import {
  POSTS,
  readingMinutes,
  type Post,
  type Block,
} from "@/components/blogs/posts";
import { blogImage, optimized } from "@/lib/cdn";
import { AUTHOR } from "@/lib/author";

/**
 * Post artwork, run through Next's image optimizer.
 *
 * The source files are print-scale (one packaging shot is 3624x2417) and are
 * displayed in a 380px card, so serving them raw would cost several MB on the
 * index alone. `w` must be one of Next's configured deviceSizes and `q` one of
 * `images.qualities` — see lib/cdn.ts `optimized`.
 */
const thumbSrc = (p: Post) => optimized(blogImage(p.img), 640);
const heroSrc = (p: Post) => optimized(blogImage(p.imgHero ?? p.img), 1200);

const esc = (s: string) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c] as string)
  );

/**
 * Body copy, with internal links.
 *
 * Post bodies are escaped, which meant they could not contain a link at all —
 * so nothing in the journal ever pointed at /services or /start-project, and a
 * search engine had no path from an article to the pages that actually sell.
 * This escapes first, then turns our own `[text](/path)` syntax back into an
 * anchor.
 *
 * Only root-relative paths survive: an off-site URL or a "javascript:" href is
 * left as plain text. Escaping-then-unescaping a known-good shape is safe;
 * allowing arbitrary hrefs from content would not be.
 */
const INTERNAL_HREF = /^\/[A-Za-z0-9\-._~/#?=&;]*$/;

const inline = (s: string) =>
  esc(s).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text, href) =>
    INTERNAL_HREF.test(href) ? `<a href="${href}" data-h>${text}</a>` : text
  );

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/* Shared by the index and the article pages. */
import { NAP_HTML, LEGAL_HTML } from "@/lib/seo";

export const BLOGS_CSS = String.raw`
:root{
  --white:#FFFFFF;
  --paper:#FAFAF8;
  --black:#0B0B0C;
  --red:#E3001B;
  --grey:#8A8A8E;
  --line:#E9E9E6;
  --pad:clamp(24px,6vw,96px);
  --display:'Archivo',sans-serif;
  --body:'Inter',sans-serif;
  --mono:'IBM Plex Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:auto}
body{font-family:var(--body);background:var(--paper);color:var(--black);overflow-x:hidden;-webkit-font-smoothing:antialiased}
::selection{background:var(--red);color:var(--white)}
button{font:inherit;background:none;border:none;cursor:pointer}

#topline{position:fixed;top:0;left:0;height:2px;width:0;background:var(--red);z-index:200}
#grain{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:.026;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

.wrap{max-width:1180px;margin:0 auto;padding:0 var(--pad);position:relative;z-index:2}
.eb{font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--red);margin-bottom:16px;display:flex;align-items:center;gap:12px}
.eb::before{content:"";width:22px;height:1px;background:var(--red)}
.rise{opacity:0;transform:translateY(26px);transition:opacity .7s cubic-bezier(.2,.8,.2,1),transform .7s cubic-bezier(.2,.8,.2,1)}
.rise.vis{opacity:1;transform:none;transition-delay:var(--rd,0s)}

/* ============ INDEX HEAD ============ */
.bhead{position:relative;padding:clamp(120px,17vh,170px) 0 clamp(36px,6vh,60px);overflow:hidden}
.bhead .grid-bg{position:absolute;inset:0;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:110px 110px;opacity:.4;pointer-events:none}
.bhead .glow{position:absolute;top:-40%;right:-10%;width:52vw;height:52vw;max-width:760px;background:radial-gradient(circle,rgba(227,0,27,.07),transparent 62%);pointer-events:none;animation:gdrift 24s ease-in-out infinite alternate}
@keyframes gdrift{from{transform:translate(0,0) scale(1)}to{transform:translate(-6%,8%) scale(1.12)}}
.bhead h1{font-family:var(--display);font-weight:900;font-stretch:110%;font-size:clamp(34px,6vw,78px);line-height:1.02;letter-spacing:-.015em;text-transform:uppercase;max-width:14ch}
.bhead h1 em{font-style:normal;color:var(--red)}
.bhead .bsub{margin-top:20px;font-weight:300;font-size:clamp(17px,1.9vw,22px);color:#2c2c2f;line-height:1.55;max-width:52ch}
.bhead .rule{width:56px;height:2px;background:var(--red);margin-top:28px}

/* ============ FILTERS ============ */
.filters{display:flex;flex-wrap:wrap;gap:8px;padding-bottom:clamp(26px,4vh,40px)}
.chip{font-family:var(--mono);font-size:10px;letter-spacing:.16em;padding:9px 15px;border:1px solid var(--line);border-radius:999px;color:#4a4a4d;background:var(--white);transition:border-color .2s,background .2s,color .2s,transform .18s}
.chip:hover{border-color:var(--red);color:var(--red);transform:translateY(-1px)}
.chip.on{background:var(--black);border-color:var(--black);color:#fff}
.chip.on:hover{background:var(--red);border-color:var(--red);color:#fff}

/* ============ POST GRID ============ */
.pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(16px,2.4vw,28px);padding-bottom:clamp(60px,10vh,110px)}
.pcard{display:flex;flex-direction:column;background:var(--white);border:1px solid var(--line);border-radius:10px;overflow:hidden;text-decoration:none;color:inherit;box-shadow:6px 6px 0 rgba(11,11,12,.05);transition:box-shadow .3s,border-color .3s,transform .3s,opacity .5s}
.pcard:hover{box-shadow:10px 10px 0 rgba(227,0,27,.16);border-color:var(--red);transform:translateY(-4px)}
.pcard.hide{display:none}
/* The artwork is mixed stock — flat white-background vectors next to dark
   photographs. The gradient that used to *be* the thumbnail is now a scrim laid
   over the image: it pulls every card back toward the brand palette so the grid
   reads as one set, and it guarantees the white tag chip has something dark to
   sit on regardless of what the photo does in that corner. The post's "v" still
   selects which scrim, so the four treatments stay meaningful. */
.pthumb{aspect-ratio:16/9;position:relative;display:flex;align-items:flex-end;padding:16px;overflow:hidden;background:#151517}
.pthumb img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s cubic-bezier(.2,.8,.2,1)}
.pcard:hover .pthumb img{transform:scale(1.04)}
/* Two layers, and the order matters. The first is a bottom-up darkening carried
   by every card — it is what the tag chip sits on, so the chip stays legible
   even where the art goes white in that corner. The second is the brand tint,
   kept deliberately light: enough to bind a white-background vector and a warm
   desk photograph into one grid, not enough to flatten either into a monochrome
   wash. An earlier pass ran the tint at ~.6 and the packaging shot came out as
   a solid red rectangle. */
.pthumb .scrim{position:absolute;inset:0}
.pthumb.v1 .scrim{background:linear-gradient(180deg,transparent 45%,rgba(11,11,12,.62)),linear-gradient(150deg,rgba(21,21,23,.3),rgba(59,0,9,.34))}
.pthumb.v2 .scrim{background:linear-gradient(180deg,transparent 45%,rgba(11,11,12,.62)),linear-gradient(150deg,rgba(227,0,27,.26),rgba(126,0,15,.34))}
.pthumb.v3 .scrim{background:linear-gradient(180deg,transparent 45%,rgba(11,11,12,.62))}
.pthumb.v4 .scrim{background:linear-gradient(180deg,transparent 45%,rgba(11,11,12,.62)),linear-gradient(150deg,rgba(14,14,16,.3),rgba(38,38,42,.34))}
.pthumb .ptag{position:relative;z-index:1;font-family:var(--mono);font-size:9px;letter-spacing:.18em;color:#fff;border:1px solid rgba(255,255,255,.55);padding:5px 10px;border-radius:999px}
.pbody{padding:20px 20px 22px;display:flex;flex-direction:column;flex:1}
.pcard h2{font-family:var(--display);font-weight:800;font-stretch:104%;font-size:clamp(17px,1.6vw,21px);line-height:1.24;letter-spacing:-.01em;margin-bottom:10px}
.pcard .pex{font-weight:300;font-size:14px;color:#4a4a4d;line-height:1.6;flex:1}
.pmeta{display:flex;align-items:center;gap:10px;margin-top:18px;font-family:var(--mono);font-size:10px;letter-spacing:.1em;color:var(--grey)}
.pmeta .dot{width:3px;height:3px;border-radius:50%;background:#cfcfcb}
.pmore{margin-top:14px;font-family:var(--mono);font-size:10px;letter-spacing:.16em;color:var(--red);display:inline-flex;align-items:center;gap:7px}
.pmore .ar{transition:transform .2s}
.pcard:hover .pmore .ar{transform:translateX(4px)}
.empty{grid-column:1/-1;text-align:center;padding:60px 0;font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--grey)}

/* ============ ARTICLE ============ */
.ahead{position:relative;padding:clamp(120px,17vh,170px) 0 clamp(28px,4vh,44px);overflow:hidden}
.ahead .grid-bg{position:absolute;inset:0;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:110px 110px;opacity:.4;pointer-events:none}
.crumb{font-family:var(--mono);font-size:10px;letter-spacing:.16em;color:var(--grey);text-decoration:none;display:inline-flex;align-items:center;gap:8px;margin-bottom:22px;transition:color .2s}
.crumb:hover{color:var(--red)}
.crumb .ar{transition:transform .2s}
.crumb:hover .ar{transform:translateX(-3px)}
.article{max-width:760px}
.article h1{font-family:var(--display);font-weight:900;font-stretch:108%;font-size:clamp(28px,4.4vw,54px);line-height:1.06;letter-spacing:-.015em;margin-bottom:22px}
.ameta{display:flex;flex-wrap:wrap;align-items:center;gap:10px;font-family:var(--mono);font-size:10px;letter-spacing:.14em;color:var(--grey)}
.ameta .atag{color:var(--red);border:1px solid var(--red);padding:5px 10px;border-radius:999px}
.ameta .dot{width:3px;height:3px;border-radius:50%;background:#cfcfcb}
.ameta .aby{color:var(--black)}
/* Author card. Only rendered when lib/author.ts names someone. */
.abio{margin-top:clamp(34px,5vh,56px);padding:clamp(22px,3vw,30px);background:var(--paper,#FAFAF8);border-left:2px solid var(--red)}
.abname{font-family:var(--display);font-weight:800;font-size:clamp(16px,1.6vw,19px);letter-spacing:-.01em}
.abrole{font-family:var(--mono);font-size:10px;letter-spacing:.18em;color:var(--grey);margin-top:5px;text-transform:uppercase}
.abtext{font-size:14.5px;line-height:1.65;color:#4a4a4d;margin-top:12px;max-width:60ch}
/* Taller than the card thumb, and scrimmed far more lightly — here the artwork
   is the point, not a texture behind a label. */
.abanner{height:clamp(200px,34vh,380px);border-radius:10px;position:relative;overflow:hidden;margin:clamp(26px,4vh,40px) 0 0;background:#151517}
.abanner img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.abanner .scrim{position:absolute;inset:0}
.abanner.v1 .scrim{background:linear-gradient(150deg,rgba(21,21,23,.3),rgba(59,0,9,.4))}
.abanner.v2 .scrim{background:linear-gradient(150deg,rgba(227,0,27,.28),rgba(126,0,15,.42))}
.abanner.v3 .scrim{background:linear-gradient(180deg,transparent 55%,rgba(11,11,12,.28))}
.abanner.v4 .scrim{background:linear-gradient(150deg,rgba(14,14,16,.3),rgba(38,38,42,.4))}

.abody{max-width:720px;padding:clamp(34px,6vh,56px) 0 clamp(50px,8vh,80px)}
.abody p{font-size:clamp(16px,1.15vw,18px);line-height:1.75;color:#2c2c2f;margin-bottom:22px}
.abody p:first-of-type{font-size:clamp(18px,1.35vw,21px);line-height:1.65;color:#151517}
.abody h2{font-family:var(--display);font-weight:800;font-stretch:104%;font-size:clamp(20px,2.2vw,28px);line-height:1.2;letter-spacing:-.01em;margin:clamp(30px,5vh,46px) 0 16px;padding-top:4px;position:relative}
.abody h2::before{content:"";position:absolute;top:-14px;left:0;width:28px;height:2px;background:var(--red)}
.abody ul{margin:0 0 24px;padding:0;list-style:none}
.abody li{position:relative;padding-left:24px;margin-bottom:11px;font-size:clamp(15px,1.1vw,17px);line-height:1.65;color:#3a3a3d}
.abody li::before{content:"";position:absolute;left:2px;top:.62em;width:7px;height:7px;border-radius:1px;background:var(--red)}
.abody blockquote{margin:clamp(26px,4vh,38px) 0;padding:22px 26px;border-left:3px solid var(--red);background:var(--white);border-radius:0 8px 8px 0;box-shadow:6px 6px 0 rgba(11,11,12,.05)}
.abody blockquote p{margin:0;font-family:var(--display);font-weight:700;font-stretch:104%;font-size:clamp(17px,1.7vw,22px);line-height:1.38;letter-spacing:-.01em;color:var(--black)}
/* In-body links. Underlined rather than colour-only, so they are still
   identifiable as links without relying on colour vision. */
.abody a{color:var(--black);text-decoration:underline;text-decoration-color:var(--red);text-underline-offset:3px;text-decoration-thickness:2px;transition:color .2s,background .2s}
.abody a:hover{color:var(--red)}
.abody a:focus-visible{outline:2px solid var(--red);outline-offset:2px}

/* article footer nav */
.anext{border-top:1px solid var(--line);padding:clamp(30px,5vh,48px) 0;display:flex;gap:20px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.anext .nlabel{font-family:var(--mono);font-size:10px;letter-spacing:.18em;color:var(--grey);margin-bottom:8px}
.anext .ntitle{font-family:var(--display);font-weight:800;font-size:clamp(17px,1.8vw,22px);line-height:1.25;letter-spacing:-.01em;max-width:22ch}
.anext a{text-decoration:none;color:inherit;transition:color .2s}
.anext a:hover .ntitle{color:var(--red)}

/* ============ CTA ============ */
.bcta{background:var(--black);color:#fff;position:relative;overflow:hidden;padding:clamp(56px,9vh,90px) 0;text-align:center}
.bcta .ghost{position:absolute;top:50%;left:0;transform:translateY(-50%);white-space:nowrap;font-family:var(--display);font-weight:900;font-stretch:115%;font-size:clamp(90px,16vw,200px);color:transparent;-webkit-text-stroke:1px #1c1c1e;pointer-events:none;user-select:none}
.bcta .ghost span{display:inline-block;animation:tick 46s linear infinite}
@keyframes tick{to{transform:translateX(-50%)}}
.bcta h2{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(24px,4vw,50px);text-transform:uppercase;line-height:1.1;margin-bottom:16px;letter-spacing:-.01em;position:relative;z-index:1}
.bcta h2 em{font-style:normal;color:var(--red)}
.bcta p{font-family:var(--mono);font-size:11px;color:#9a9a9e;margin-bottom:34px;letter-spacing:.12em;position:relative;z-index:1}
.btns{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;position:relative;z-index:1}
.btn{font-family:var(--body);font-weight:600;font-size:15px;text-decoration:none;padding:16px 26px;display:inline-flex;align-items:center;gap:10px;transition:transform .18s,box-shadow .18s}
.btn .ar{display:inline-block;transition:transform .18s}
.btn:hover{transform:translateY(-2px)}
.btn:hover .ar{transform:translateX(6px)}
.btn.dark{background:var(--white);color:var(--black)}
.btn.dark:hover{box-shadow:4px 4px 0 var(--red)}
.btn.red{background:var(--red);color:#fff}
.btn.red:hover{box-shadow:4px 4px 0 var(--white)}
footer.bfoot{border-top:1px solid var(--line);padding:18px var(--pad);display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;font-family:var(--mono);font-size:10px;color:var(--grey);letter-spacing:.12em;background:var(--paper)}

/* ============ RESPONSIVE ============ */
@media (max-width:980px){
  .pgrid{grid-template-columns:repeat(2,1fr)}
  .bhead h1{max-width:none}
}
@media (max-width:640px){
  .pgrid{grid-template-columns:1fr;gap:16px}
  .bhead{padding-top:clamp(104px,15vh,140px)}
  .bhead .bsub{font-size:16px;margin-top:16px}
  .filters{gap:6px}
  .chip{padding:8px 12px;font-size:9.5px;letter-spacing:.12em}
  .pcard{box-shadow:4px 4px 0 rgba(11,11,12,.05)}
  .pcard h2{font-size:19px}
  .pbody{padding:18px 18px 20px}

  .ahead{padding-top:clamp(104px,15vh,140px)}
  .article h1{font-size:clamp(26px,7.4vw,34px)}
  .ameta{gap:8px;font-size:9.5px}
  .abody p{font-size:16px;line-height:1.7}
  .abody p:first-of-type{font-size:17.5px}
  .abody h2{font-size:21px}
  .abody blockquote{padding:18px 20px}
  .abody blockquote p{font-size:17px}
  /* Stack the "next up" link above the CTA rather than squeezing them side by
     side — the button would otherwise wrap under a half-width title. */
  .anext{flex-direction:column;align-items:flex-start;gap:24px}
  .anext .ntitle{max-width:none}
  .anext .btn{width:100%;justify-content:center}

  .bcta{padding:clamp(48px,8vh,70px) 0}
  .btns{flex-direction:column;align-items:stretch;padding:0 var(--pad)}
  .btn{justify-content:center}
  footer.bfoot{flex-direction:column;gap:6px}
}
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.01s!important;animation-iteration-count:1!important;transition-duration:.01s!important;transition-delay:0s!important}
  .rise{opacity:1!important;transform:none!important}
  #grain,#topline{display:none}
}
`;

/* The thumbnail carries the post title as its alt, the same string the article
   hero already uses (see `heroSrc` below). It was empty, which is the right
   call for decoration but wrong here: this is the artwork *for* the article,
   it is the only version of it Google Images ever sees on this route, and a
   listing of twelve unlabelled images is what an audit counts as twelve
   missing alts. The title repeating in the adjacent <h2> is not a problem —
   the anchor is one stop for a screen reader, so it is announced once. */
const card = (p: Post, i: number) => `
  <a class="pcard rise" style="--rd:${(i % 3) * 0.08}s" href="/blogs/${p.slug}" data-tag="${esc(p.tag)}" data-h>
    <span class="pthumb ${p.v}">
      <img src="${esc(thumbSrc(p))}" alt="${esc(p.title)}" width="640" height="360" loading="${
        i < 3 ? "eager" : "lazy"
      }" decoding="async">
      <span class="scrim"></span>
      <span class="ptag">${esc(p.tag)}</span>
    </span>
    <span class="pbody">
      <h2>${esc(p.title)}</h2>
      <span class="pex">${esc(p.excerpt)}</span>
      <span class="pmeta">
        <time datetime="${esc(p.date)}">${fmtDate(p.date)}</time><span class="dot"></span><span>${readingMinutes(p)} MIN READ</span>
      </span>
      <span class="pmore">READ <span class="ar">→</span></span>
    </span>
  </a>`;

const CTA = `
<section class="bcta">
  <div class="ghost"><span>ADMIRATE — ADMIRATE — ADMIRATE — ADMIRATE — ADMIRATE — ADMIRATE — </span></div>
  <h2>The journey starts<br>with <em>one click.</em></h2>
  <p>// LESS FLUFF — MORE LEADS. TELL US YOUR GOAL.</p>
  <div class="btns">
    <a class="btn dark" href="/services" data-h>See our designs <span class="ar">→</span></a>
    <a class="btn red" href="/start-project" data-h>Start your project <span class="ar">→</span></a>
  </div>
</section>
<footer class="bfoot">
  <div>© 2026 ADMIRATE.IN</div>
  <div>${NAP_HTML}</div><div>${LEGAL_HTML}</div>
  <div>MADE TO CONVERT</div>
</footer>`;

export const blogsIndexHtml = () => {
  const tags = [...new Set(POSTS.map((p) => p.tag))];

  return String.raw`
<div id="grain"></div>
<div id="topline"></div>

<header class="bhead">
  <div class="grid-bg"></div>
  <div class="glow"></div>
  <div class="wrap">
    <div class="eb rise">JOURNAL</div>
    <h1 class="rise" style="--rd:.08s">Notes from the <em>work.</em></h1>
    <p class="bsub rise" style="--rd:.16s">What we've learned building brands, sites and campaigns that have to earn their keep — written for the people who have to sign them off.</p>
    <div class="rule rise" style="--rd:.24s"></div>
  </div>
</header>

<div class="wrap">
  <div class="filters rise" style="--rd:.3s" id="filters" role="group" aria-label="Filter posts by topic">
    <button class="chip on" data-f="all">ALL</button>
    ${tags.map((t) => `<button class="chip" data-f="${esc(t)}">${esc(t)}</button>`).join("\n    ")}
  </div>

  <div class="pgrid" id="pgrid">
    ${POSTS.map(card).join("\n")}
    <div class="empty" id="empty" hidden>NO POSTS IN THIS TOPIC YET</div>
  </div>
</div>

${CTA}
`;
};

const renderBlock = (b: Block): string => {
  switch (b.t) {
    // Headings stay link-free — a link inside an h2 muddies the outline a
    // crawler builds from the page.
    case "h2":
      return `<h2>${esc(b.c)}</h2>`;
    case "quote":
      return `<blockquote><p>${inline(b.c)}</p></blockquote>`;
    case "list":
      return `<ul>${b.c.map((li) => `<li>${inline(li)}</li>`).join("")}</ul>`;
    default:
      return `<p>${inline(b.c)}</p>`;
  }
};

export const postHtml = (p: Post) => {
  const i = POSTS.findIndex((x) => x.slug === p.slug);
  const next = POSTS[(i + 1) % POSTS.length];

  return String.raw`
<div id="grain"></div>
<div id="topline"></div>

<header class="ahead">
  <div class="grid-bg"></div>
  <div class="wrap">
    <a class="crumb" href="/blogs" data-h><span class="ar">←</span> ALL POSTS</a>
    <div class="article">
      <h1>${esc(p.title)}</h1>
      <div class="ameta">
        <span class="atag">${esc(p.tag)}</span>
        ${AUTHOR ? `<span class="aby">BY ${esc(AUTHOR.name.toUpperCase())}</span><span class="dot"></span>` : ""}<time datetime="${esc(p.date)}">${fmtDate(p.date)}</time><span class="dot"></span><span>${readingMinutes(p)} MIN READ</span>
      </div>
    </div>
    <div class="abanner ${p.v}">
      <img src="${esc(heroSrc(p))}" alt="${esc(p.title)}" width="1200" height="675" fetchpriority="high" decoding="async">
      <span class="scrim"></span>
    </div>
  </div>
</header>

<article class="wrap">
  <div class="abody">
    ${p.body.map(renderBlock).join("\n    ")}
  </div>

  ${
    /* The visible half of the E-E-A-T claim. Renders only when lib/author.ts is
       filled in, and from the same object the JSON-LD reads, so a reader always
       sees exactly who the markup credits. */
    AUTHOR
      ? `<aside class="abio">
    <div class="abname">${esc(AUTHOR.name)}</div>
    <div class="abrole">${esc(AUTHOR.role)}</div>
    <p class="abtext">${esc(AUTHOR.bio)}</p>
  </aside>`
      : ""
  }

  <div class="anext">
    <a href="/blogs/${next.slug}" data-h>
      <div class="nlabel">NEXT UP</div>
      <div class="ntitle">${esc(next.title)}</div>
    </a>
    <a class="btn red" href="/start-project" data-h>Start your project <span class="ar">→</span></a>
  </div>
</article>

${CTA}
`;
};
