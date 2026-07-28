/**
 * PRICING — the rate card, in the visitor's own currency.
 *
 * This is the one page whose markup is a function of fetched data rather than
 * a static constant, so it exports `pricingHtml(view)` where the other pages
 * export an `XYZ_HTML`. Its role, location and relationship to RawPage are
 * otherwise unchanged.
 *
 * Every figure in the markup is already formatted by the server. The embedded
 * JSON payload carries the same figures for every currency and cycle, so the
 * client switches by swapping strings rather than by doing arithmetic — which
 * means the number a visitor sees after clicking can never disagree with the
 * number the server rendered.
 *
 * DESIGN NOTE — why this is not a pricing grid.
 *
 * The page has one job: let someone find their number and believe it. So the
 * price is set at display scale and everything else gets out of its way. The
 * tiers are columns divided by hairlines rather than bordered, rounded,
 * shadowed cards — the same 1px-gap-on-a-line-coloured-bed device the digital
 * page already uses for its card grid. A bordered card with a badge is the
 * default pricing block every site ships; it would have been the one element
 * here that could belong to anybody.
 *
 * Set-pieces:
 *   BILLING   the eyebrow states how you are charged before you read the
 *             price, so "monthly" or "one-time" is never a surprise
 *   FLOOD     the most-chosen tier is a black panel that floods red as the
 *             section arrives. Red is an accent everywhere else on this site;
 *             this is the one place it becomes a surface, and it reuses the
 *             scaleX-from-left wipe the nav and close rows already use
 *   MATRIX    the comparison table, collapsed; on a phone it shows one plan
 *             column at a time behind tier chips rather than scrolling sideways
 */

import { NAP_HTML, LEGAL_HTML } from "@/lib/seo";
import { BILLING_CYCLES } from "@/lib/pricing";

const esc = (value: string) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * One rendered price, in one currency, on one cycle. Built by the server.
 *
 * The billing line is split into its two parts rather than shipped as one
 * pre-composed string with an `<em>` in it. That keeps every field plain text,
 * so the client can set all of them with `textContent` and never `innerHTML` —
 * which matters because `fig` and the rest are built from
 * `pricing_currencies.symbol`, an administrator-editable column. A symbol
 * containing markup would otherwise be a stored-XSS path from the dashboard
 * onto a public page.
 */
export type PriceCell = {
  /** Headline: the per-month equivalent, or the one-time price. */
  fig: string;
  /** "/month", or "one-time". */
  per: string;
  /** "₹15,30,000 billed annually", or "" on monthly. */
  billTotal: string;
  /** "save ₹2,70,000", or "" where there is nothing to save. */
  billSaving: string;
  /** "+18% GST · ₹1,77,000 incl.", or "" where no rate is claimed. */
  tax: string;
};

export type PricingPlanView = {
  id: string;
  slug: string;
  name: string;
  blurb: string;
  featured: boolean;
  oneTime: boolean;
  /** currency code -> cycle id -> cell. One-time plans use the "monthly" key. */
  cells: Record<string, Record<string, PriceCell>>;
};

export type PricingFamilyView = {
  id: "retainer" | "website" | "care";
  /** States the billing model, not a position in a sequence. */
  eyebrow: string;
  title: string;
  lead: string;
  /** Stated under the heading where a family has a blanket inclusion. */
  note?: string;
  bg: string;
  dark?: boolean;
  /** Website is one-time, so it gets no billing-cycle control. */
  cycles: boolean;
  service: string;
  plans: PricingPlanView[];
  features: { label: string; values: Record<string, string> }[];
};

export type PricingView = {
  active: string;
  currencies: {
    code: string;
    symbol: string;
    label: string;
    derived: boolean;
  }[];
  families: PricingFamilyView[];
};

export const PRICING_CSS = String.raw`
:root{
  --white:#FFFFFF;--paper:#FAFAF8;--black:#0B0B0C;--red:#E3001B;
  --grey:#8A8A8E;--line:#E9E9E6;--pad:clamp(24px,6vw,96px);
  --display:'Archivo',sans-serif;--body:'Inter',sans-serif;--mono:'IBM Plex Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:auto}
body{font-family:var(--body);background:var(--paper);color:var(--black);overflow-x:hidden;-webkit-font-smoothing:antialiased}
body.smopen{overflow:hidden}
::selection{background:var(--red);color:var(--white)}

#pgbg{position:fixed;inset:0;z-index:-2;background:var(--paper);transition:background-color .7s cubic-bezier(.4,0,.2,1)}
#pgline{position:fixed;top:0;left:0;height:2px;width:0;background:var(--red);z-index:200}
#pgrail{position:fixed;left:clamp(14px,2.4vw,34px);top:50%;transform:translateY(-50%);z-index:120;display:flex;flex-direction:column;gap:14px}
#pgrail button{padding:0;border:none;background:none;cursor:pointer;display:flex;align-items:center}
#pgrail i{display:block;width:18px;height:1px;background:rgba(11,11,12,.25);transition:width .35s cubic-bezier(.16,1,.3,1),background .35s}
#pgrail.ondark i{background:rgba(255,255,255,.3)}
#pgrail button.on i,#pgrail.ondark button.on i{width:38px;background:var(--red)}

.pgs{position:relative;z-index:1;padding:clamp(96px,14vh,150px) var(--pad) clamp(70px,11vh,120px)}
.pgs.dark{color:var(--white)}

/* The mono eyebrow is load-bearing on this page: it names the billing model,
   so you know whether a figure is monthly or once before you read it. */
.pgeb{
  font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--red);
  display:flex;align-items:center;gap:12px;margin-bottom:16px;
}
.pgeb::after{content:"";flex:1;height:1px;background:var(--line);max-width:120px}
.pgs.dark .pgeb::after{background:rgba(255,255,255,.18)}

.pgh{font-family:var(--display);font-weight:800;font-stretch:106%;font-size:clamp(28px,4.8vw,62px);line-height:1.04;letter-spacing:-.028em;max-width:17ch}
.pgh em{font-style:normal;color:var(--red)}
.pgp{font-size:clamp(15px,1.4vw,18px);line-height:1.7;color:#4a4a4e;max-width:56ch;margin-top:18px}
.pgs.dark .pgp{color:#a4a4a8}
.pgnote{
  font-family:var(--mono);font-size:11px;letter-spacing:.1em;color:#6a6a6e;
  margin-top:16px;padding-left:14px;border-left:2px solid var(--red);
}
.pgs.dark .pgnote{color:#8a8a8e}
.up{opacity:0;transform:translateY(26px);transition:opacity .8s,transform .8s cubic-bezier(.16,1,.3,1)}
.pgs.in .up{opacity:1;transform:none;transition-delay:var(--d,0s)}

/* ============ 1 — TOP BAND ============
   A compact header, not a full-height hero: the page's job is the prices, so
   nothing stands between the top of the page and the first rate. The title is
   centred and the currency control sits out of the way at the right, where it
   is findable without competing for the middle of the page. */
#ptop{padding-bottom:clamp(20px,3vh,34px)}
#ptop .ptopbar{display:flex;justify-content:flex-end;margin-bottom:clamp(20px,3.4vh,34px)}
#ptop h1{
  font-family:var(--display);font-weight:900;font-stretch:112%;
  font-size:clamp(30px,5.6vw,78px);line-height:.94;letter-spacing:-.035em;
  text-transform:uppercase;text-align:center;
}
#ptop h1 u{text-decoration:none;color:var(--red)}
/* The first rate sits close under the header. Both carry the section padding
   by default, which stacked to roughly 200px of nothing between the title and
   the thing the page exists to show. */
#ptop + .pgs{padding-top:clamp(28px,5vh,60px)}

/* The control states what was detected before it offers the change, so an
   override reads as a correction rather than a discovery. */
.pccy{display:flex;flex-direction:column;align-items:flex-end;gap:8px;max-width:34ch}
.pccy .pccyrow{display:flex;align-items:center;gap:12px}
.pccy label{font-family:var(--mono);font-size:10.5px;letter-spacing:.22em;color:var(--grey)}
.pccy .psel{position:relative;display:inline-flex;align-items:center}
.pccy select{
  appearance:none;-webkit-appearance:none;
  font-family:var(--display);font-weight:800;font-stretch:104%;font-size:15px;letter-spacing:.01em;
  color:var(--black);background:transparent;
  border:0;border-bottom:2px solid var(--black);border-radius:0;
  padding:0 30px 7px 2px;min-height:40px;cursor:pointer;
  transition:color .25s,border-color .25s;
}
.pccy select:hover{color:var(--red);border-color:var(--red)}
.pccy .psel::after{content:"↓";position:absolute;right:6px;top:5px;font-size:13px;color:var(--red);pointer-events:none}

/* ============ 2/3/4 — FAMILY SECTIONS ============ */
.pcyc{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:clamp(28px,4.4vh,44px)}
.pcyc .pclab{font-family:var(--mono);font-size:10.5px;letter-spacing:.22em;color:var(--grey);margin-right:6px;flex:0 0 auto}
.pchip{
  font-family:var(--body);font-weight:500;font-size:13.5px;
  background:transparent;color:#5a5a5e;border:1px solid var(--line);
  border-radius:999px;padding:0 16px;min-height:40px;cursor:pointer;white-space:nowrap;
  transition:background .22s,color .22s,border-color .22s;
}
.pchip:hover{border-color:var(--black);color:var(--black)}
.pchip.on{background:var(--black);border-color:var(--black);color:#fff}
.pchip .psave{font-family:var(--mono);font-size:10px;letter-spacing:.06em;color:var(--red);margin-left:7px}
.pchip.on .psave{color:#fff}
.pgs.dark .pchip{border-color:rgba(255,255,255,.2);color:#a4a4a8}
.pgs.dark .pchip:hover{border-color:#fff;color:#fff}
.pgs.dark .pchip.on{background:#fff;border-color:#fff;color:var(--black)}
.pgs.dark .pchip.on .psave{color:var(--red)}

/* ---------- the tier cards ----------
   Solid objects with real separation, not columns ruled off inside one block.
   Each card carries its own fill so it reads as a thing you could pick up and
   compare, and the featured one is a solid slab rather than a highlighted
   cell. */
.ptiers{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:clamp(14px,1.6vw,22px);
  margin-top:clamp(30px,5vh,50px);align-items:stretch;
}
.ptier{
  position:relative;overflow:hidden;
  background:var(--white);border-radius:16px;
  padding:clamp(26px,3vw,38px) clamp(22px,2.4vw,32px) clamp(26px,2.8vw,34px);
  display:flex;flex-direction:column;gap:10px;
  box-shadow:0 1px 0 rgba(11,11,12,.06),0 18px 44px rgba(11,11,12,.06);
  transition:transform .35s cubic-bezier(.16,1,.3,1),box-shadow .35s;
}
.ptier:hover{transform:translateY(-4px);box-shadow:0 1px 0 rgba(11,11,12,.08),0 28px 64px rgba(11,11,12,.11)}
/* On the dark section the card lifts off the black rather than dissolving
   into it, so "solid" still means solid where the page is already ink. */
.pgs.dark .ptier{background:#141417;box-shadow:0 18px 44px rgba(0,0,0,.5)}
.pgs.dark .ptier:hover{box-shadow:0 28px 64px rgba(0,0,0,.62)}

/* SIGNATURE — the most-chosen tier is a solid slab that floods red as the
   section arrives. It sits on black underneath with white type from the first
   frame, so the label is legible at every point of the wipe rather than
   flashing white-on-white halfway through. Red is an accent everywhere else
   on this site; this is the one place it becomes a surface. */
.ptier.feat{background:var(--black);box-shadow:0 22px 54px rgba(227,0,27,.22)}
.ptier.feat:hover{box-shadow:0 32px 74px rgba(227,0,27,.3)}
.pgs.dark .ptier.feat{background:var(--black)}
.ptier.feat::before{
  content:"";position:absolute;inset:0;background:var(--red);
  transform:scaleX(0);transform-origin:left;
  transition:transform .9s cubic-bezier(.16,1,.3,1);
}
.pgs.in .ptier.feat::before{transform:scaleX(1);transition-delay:.34s}
.ptier.feat > *{position:relative;z-index:1}
.ptier.feat,.ptier.feat .pblurb,.ptier.feat .pbill,.ptier.feat .ptax{color:#fff}
.pgs.dark .ptier.feat .pblurb{color:rgba(255,255,255,.86)}

.ptier .ptop{display:flex;align-items:baseline;justify-content:space-between;gap:10px;min-height:20px}
.ptier h3{
  font-family:var(--display);font-weight:900;font-stretch:112%;text-transform:uppercase;
  font-size:clamp(18px,1.9vw,23px);letter-spacing:-.012em;
}
/* Earns its place by explaining the colour rather than decorating it. */
.pbadge{font-family:var(--mono);font-size:9.5px;letter-spacing:.18em;color:#fff;white-space:nowrap;opacity:.85}
.ptier .pblurb{font-size:13.5px;line-height:1.6;color:#5a5a5e;min-height:3.2em}
.pgs.dark .ptier .pblurb{color:#9a9a9e}

/* The number is the page's job, so it gets display scale and its own air.
   Sized so the widest realistic figure and its unit stay on one baseline in a
   third-width column: "AED 10,250" and "₹15,30,000" are both ten characters,
   and at any larger size the unit wraps under the number on the long tiers
   only — which reads as a broken column rather than a big price. */
.ptier .pprice{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;margin-top:clamp(12px,2vh,20px)}
.ptier .pfig{
  font-family:var(--display);font-weight:900;font-stretch:108%;
  font-size:clamp(27px,3.4vw,45px);line-height:.96;letter-spacing:-.035em;
  white-space:nowrap;
  transition:opacity .2s,transform .2s;
}
.ptier .pper{font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:var(--grey)}
.ptier.feat .pper{color:rgba(255,255,255,.7)}
.pgs.dark .ptier .pper{color:#7a7a7e}
/* A swapped figure animates so the eye is taken to what changed. */
.ptier .pfig.swap{opacity:0;transform:translateY(6px)}

.ptier .pbill{font-size:12.5px;line-height:1.55;color:#6a6a6e;margin-top:8px}
.ptier .pbill em{font-style:normal;color:var(--red);font-weight:600}
.ptier .pbill em:not(:empty)::before{content:" · ";color:#6a6a6e;font-weight:400}
.ptier.feat .pbill em,.ptier.feat .pbill em:not(:empty)::before{color:#fff}
.pgs.dark .ptier .pbill{color:#8a8a8e}
/* Tax sits directly under the figure it applies to, above the hairline rather
   than below it, so the invoice total is part of the price block and not a
   footnote to it. Prices are published exclusive — that is the number on the
   quote and the number a registered business budgets against — but nobody
   meets the inclusive figure for the first time on the invoice. */
.ptier .ptax{
  font-family:var(--mono);font-size:10.5px;letter-spacing:.04em;color:#7a7a7e;
  margin-top:10px;padding-top:10px;border-top:1px solid var(--line);min-height:1.4em;
}
.pgs.dark .ptier .ptax{color:#75757a;border-color:rgba(255,255,255,.14)}
.ptier.feat .ptax{border-color:rgba(255,255,255,.28);color:rgba(255,255,255,.82)}

.ptier .pbtn{
  position:relative;display:inline-flex;align-items:center;justify-content:space-between;gap:9px;
  min-height:48px;margin-top:auto;padding:0 18px;overflow:hidden;text-decoration:none;
  font-family:var(--body);font-weight:600;font-size:14px;
  border:1px solid var(--black);color:var(--black);
  transition:color .25s,border-color .25s;
}
/* The same wipe the nav rows use, so the button belongs to the site's motion
   vocabulary rather than inventing its own. */
.ptier .pbtn::before{
  content:"";position:absolute;inset:0;background:var(--black);
  transform:scaleX(0);transform-origin:left;
  transition:transform .42s cubic-bezier(.16,1,.3,1);
}
.ptier .pbtn:hover::before,.ptier .pbtn:focus-visible::before{transform:scaleX(1)}
.ptier .pbtn > *{position:relative;z-index:1}
.ptier .pbtn:hover,.ptier .pbtn:focus-visible{color:#fff}
.ptier .pbtn .ar{transition:transform .25s}
.ptier .pbtn:hover .ar{transform:translateX(4px)}
.ptier.feat .pbtn{border-color:#fff;color:#fff}
.ptier.feat .pbtn::before{background:#fff}
.ptier.feat .pbtn:hover,.ptier.feat .pbtn:focus-visible{color:var(--red)}
.pgs.dark .ptier .pbtn{border-color:rgba(255,255,255,.4);color:#fff}
.pgs.dark .ptier .pbtn::before{background:#fff}
.pgs.dark .ptier .pbtn:hover,.pgs.dark .ptier .pbtn:focus-visible{color:var(--black)}
.pgs.dark .ptier.feat .pbtn:hover,.pgs.dark .ptier.feat .pbtn:focus-visible{color:var(--red)}

/* ---------- comparison matrix ---------- */
.pmore{
  display:inline-flex;align-items:center;gap:10px;margin-top:clamp(26px,4vh,40px);
  background:none;border:0;cursor:pointer;padding:8px 0;min-height:44px;
  font-family:var(--mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--black);
  border-bottom:1px solid var(--black);transition:color .25s,border-color .25s,gap .25s;
}
.pmore:hover{color:var(--red);border-color:var(--red);gap:16px}
.pmore .pcar{display:inline-block;font-size:9px;transition:transform .3s}
.pmore[aria-expanded="true"] .pcar{transform:rotate(180deg)}
.pgs.dark .pmore{color:#fff;border-color:rgba(255,255,255,.4)}
.pgs.dark .pmore:hover{color:var(--red);border-color:var(--red)}

.pmatrix[hidden]{display:none}
.pmatrix{margin-top:clamp(22px,3.4vh,34px)}
.pmatrix table{width:100%;border-collapse:collapse;font-size:13.5px}
.pmatrix th,.pmatrix td{text-align:left;padding:13px clamp(8px,1.2vw,16px);border-bottom:1px solid var(--line)}
.pgs.dark .pmatrix th,.pgs.dark .pmatrix td{border-color:rgba(255,255,255,.12)}
.pmatrix thead th{
  font-family:var(--mono);font-size:10px;letter-spacing:.18em;color:var(--grey);
  text-transform:uppercase;border-bottom:1px solid var(--black);
}
.pgs.dark .pmatrix thead th{border-bottom-color:rgba(255,255,255,.4)}
.pmatrix tbody th{font-weight:400;color:#3a3a3e}
.pgs.dark .pmatrix tbody th{color:#c4c4c8}
.pmatrix td{color:#5a5a5e;text-align:center}
.pgs.dark .pmatrix td{color:#9a9a9e}
.pmatrix .yes{color:var(--red);font-size:15px}
.pmatrix .no{color:#c4c4c0}
.pgs.dark .pmatrix .no{color:#4a4a4e}
.pmatrix tbody tr:hover th,.pmatrix tbody tr:hover td{background:rgba(227,0,27,.035)}
.pgs.dark .pmatrix tbody tr:hover th,.pgs.dark .pmatrix tbody tr:hover td{background:rgba(255,255,255,.04)}

.ptabs{display:none;gap:7px;flex-wrap:wrap;margin-bottom:16px}

/* ============ 5 — FAQ ============ */
.pfaqs{margin-top:clamp(30px,5vh,52px);border-top:1px solid var(--line)}
.pfaq{border-bottom:1px solid var(--line)}
.pfaq summary{
  list-style:none;cursor:pointer;padding:clamp(16px,2.2vh,22px) 0;
  display:flex;align-items:center;gap:16px;min-height:48px;
  font-family:var(--display);font-weight:800;font-stretch:104%;
  font-size:clamp(15px,1.8vw,20px);letter-spacing:-.012em;
  transition:color .25s;
}
.pfaq summary::-webkit-details-marker{display:none}
.pfaq summary::after{content:"+";margin-left:auto;color:var(--red);font-family:var(--mono);font-size:19px;font-weight:400;transition:transform .3s}
.pfaq[open] summary::after{transform:rotate(45deg)}
.pfaq[open] summary{color:var(--red)}
.pfaq summary:hover{color:var(--red)}
.pfaq p{font-size:14.5px;line-height:1.75;color:#5a5a5e;max-width:66ch;padding-bottom:clamp(16px,2.2vh,22px)}

/* ============ 6 — CLOSE ============ */
#pclose .cta h2{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(34px,6.6vw,96px);line-height:.94;letter-spacing:-.034em;text-transform:uppercase;color:#fff}
#pclose .cta h2 em{font-style:normal;color:var(--red)}
#pclose .csub{font-family:var(--mono);font-size:11px;letter-spacing:.2em;color:var(--grey);margin-top:18px}
#pclose .btns{display:flex;gap:13px;flex-wrap:wrap;margin-top:clamp(24px,4vh,40px)}
.pgbtn{display:inline-flex;align-items:center;gap:10px;min-height:50px;padding:0 clamp(20px,2.4vw,32px);border-radius:999px;font-family:var(--body);font-weight:600;font-size:14.5px;text-decoration:none;transition:transform .25s,background .25s,border-color .25s}
.pgbtn .ar{transition:transform .25s}
.pgbtn:hover .ar{transform:translateX(4px)}
.pgbtn.red{background:var(--red);color:#fff}
.pgbtn.red:hover{background:#c40017;transform:translateY(-2px)}
.pgbtn.gh{border:1px solid rgba(255,255,255,.26);color:#fff}
.pgbtn.gh:hover{border-color:#fff;background:rgba(255,255,255,.06);transform:translateY(-2px)}
#pclose footer{margin-top:clamp(42px,7vh,80px);padding-top:20px;border-top:1px solid rgba(255,255,255,.14);display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;font-family:var(--mono);font-size:10.5px;letter-spacing:.2em;color:#66666a}
#pclose footer a{color:inherit}

a:focus-visible,button:focus-visible,select:focus-visible,summary:focus-visible{outline:2px solid var(--red);outline-offset:3px}

@media (max-width:980px){
  .ptiers{grid-template-columns:1fr;max-width:560px}
  .ptier .pblurb{min-height:0}
  .ptier .pbtn{margin-top:14px}
}
@media (max-width:768px){
  #pgrail{display:none}
  .ptiers{max-width:none}
  /* The control leads on a phone, where there is no room beside the title. */
  #ptop .ptopbar{justify-content:flex-start}
  .pccy{align-items:flex-start;max-width:none}
  /* A twenty-one-row, four-column table cannot be read on a phone. The chips
     appear and the table shows one plan column at a time, so the layout is
     always "feature | value" — no sideways scrolling, no crushed type. */
  .ptabs{display:flex}
  .pmatrix td{text-align:right}
  .pmatrix th,.pmatrix td{padding:12px 4px}
  .pmatrix [data-col]{display:none}
  .pmatrix [data-col].show{display:table-cell}
}
@media (max-width:560px){
  /* The hand-placed break balances two long lines on a wide screen; on a phone
     it forces a fourth line and the stack goes ragged. Let it wrap. */
  #ptop h1 br{display:none}
  #ptop h1{font-size:clamp(28px,8.6vw,40px)}
  .pgeb::after{display:none}
}
@media (prefers-reduced-motion:reduce){
  *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
  .up{opacity:1;transform:none}
  #pgbg{transition:none}
  /* The flood is the section's one animated moment. Reduced motion gets the
     end state — a red panel — rather than a black one that never fills. */
  .ptier.feat::before{transform:scaleX(1)}
  .ptier .pfig.swap{opacity:1;transform:none}
}
`;

const FAQS = [
  {
    q: "Why are prices shown without tax?",
    a: "Because it is the number on the quote, and because most of our clients are registered businesses who reclaim the tax as input credit — the pre-tax figure is what they budget against. The rate and the tax-inclusive total sit under every price, so nothing on the invoice is new information.",
  },
  {
    q: "What does a retainer month include?",
    a: "The output in the comparison table, planned, made and published inside that month. Unused output does not roll forward — a retainer buys a steady drumbeat, not a bank of credits.",
  },
  {
    q: "How do the longer billing cycles work?",
    a: "You pay for the span up front and the rate drops: 5% on a quarter, 10% on six months, 15% on a year. We lead with the per-month equivalent so the cycles compare honestly, with the full amount and the saving underneath.",
  },
  {
    q: "Can we change tier later?",
    a: "Yes, at the end of any cycle, in either direction. Most clients open on Launch and move up once there is enough happening to warrant it. We will tell you when we think you have outgrown a tier — and when you have not.",
  },
  {
    q: "Are prices in other currencies exact?",
    a: "Dirham and rupee prices are ours and they are fixed. Dollar, pound and euro prices convert daily from the dirham rate at European Central Bank reference rates and round up, so read those as indicative. The contract figure is confirmed in writing before anything starts.",
  },
  {
    q: "Is a website build really one payment?",
    a: "The build is. Hosting, updates and ongoing changes are what Website Care covers, and every retainer tier already includes website maintenance — so you are never paying for the same thing twice.",
  },
];

/** A feature cell: ticks and dashes are symbols and need an accessible label. */
const cell = (value: string) => {
  if (value === "✓")
    return `<span class="yes" role="img" aria-label="Included">✓</span>`;
  if (value === "—")
    return `<span class="no" role="img" aria-label="Not included">—</span>`;
  return esc(value);
};

const tierCard = (
  plan: PricingPlanView,
  family: PricingFamilyView,
  active: string,
) => {
  const c = plan.cells[active]?.monthly;
  /* A plan with no figure in this currency is omitted upstream rather than
     rendered at zero, so this is a belt-and-braces guard only. */
  if (!c) return "";

  const cycleParam = family.cycles ? "&cycle=monthly" : "";
  const href = `/start-project?service=${encodeURIComponent(family.service)}&plan=${encodeURIComponent(plan.slug)}${cycleParam}`;

  return `<article class="ptier${plan.featured ? " feat" : ""}" data-plan="${esc(plan.id)}">
      <div class="ptop">
        <h3>${esc(plan.name)}</h3>
        ${plan.featured ? `<span class="pbadge">MOST CHOSEN</span>` : ""}
      </div>
      <p class="pblurb">${esc(plan.blurb)}</p>
      <div class="pprice">
        <strong class="pfig" data-fig>${esc(c.fig)}</strong>
        <span class="pper" data-per>${esc(c.per)}</span>
      </div>
      <p class="pbill"><span data-bill>${esc(c.billTotal)}</span><em data-save>${esc(c.billSaving)}</em></p>
      <p class="ptax" data-tax>${esc(c.tax)}</p>
      <a class="pbtn" href="${esc(href)}" data-cta data-base="${esc(href.split("&cycle=")[0])}" data-h><span>Start with ${esc(plan.name)}</span> <span class="ar">→</span></a>
    </article>`;
};

const matrix = (family: PricingFamilyView) => {
  const slugs = family.plans.map((p) => p.slug);
  const featured = family.plans.find((p) => p.featured) ?? family.plans[0];

  return `<div class="pmatrix" id="mx-${family.id}" hidden>
      <div class="ptabs" role="tablist" aria-label="${esc(family.title)} plan columns">
        ${family.plans
          .map(
            (p) =>
              `<button type="button" class="pchip${p.slug === featured?.slug ? " on" : ""}" role="tab" aria-selected="${p.slug === featured?.slug}" data-tab="${esc(p.slug)}">${esc(p.name)}</button>`,
          )
          .join("\n        ")}
      </div>
      <table>
        <thead>
          <tr>
            <th scope="col">Feature</th>
            ${family.plans
              .map(
                (p) =>
                  `<th scope="col" data-col="${esc(p.slug)}"${p.slug === featured?.slug ? ' class="show"' : ""}>${esc(p.name)}</th>`,
              )
              .join("\n            ")}
          </tr>
        </thead>
        <tbody>
          ${family.features
            .map(
              (row) => `<tr>
            <th scope="row">${esc(row.label)}</th>
            ${slugs
              .map(
                (slug) =>
                  `<td data-col="${esc(slug)}"${slug === featured?.slug ? ' class="show"' : ""}>${cell(row.values[slug] ?? "—")}</td>`,
              )
              .join("")}
          </tr>`,
            )
            .join("\n          ")}
        </tbody>
      </table>
    </div>`;
};

const familySection = (family: PricingFamilyView, view: PricingView) => {
  const cycleControl = family.cycles
    ? `<div class="pcyc up" style="--d:.16s" role="group" aria-label="Billing cycle">
      <span class="pclab">BILLING</span>
      ${BILLING_CYCLES.map(
        (c) =>
          `<button type="button" class="pchip${c.id === "monthly" ? " on" : ""}" data-cycle="${c.id}" aria-pressed="${c.id === "monthly"}">${esc(c.label)}${c.discountPct ? `<span class="psave">−${c.discountPct}%</span>` : ""}</button>`,
      ).join("\n      ")}
    </div>`
    : "";

  return `
<section class="pgs${family.dark ? " dark" : ""}" id="fam-${family.id}" data-bg="${family.bg}" data-label="${esc(family.title)}" data-family="${family.id}">
  <p class="pgeb up">${esc(family.eyebrow)}</p>
  <h2 class="pgh up" style="--d:.06s">${family.title}</h2>
  <p class="pgp up" style="--d:.1s">${esc(family.lead)}</p>
  ${family.note ? `<p class="pgnote up" style="--d:.13s">${esc(family.note)}</p>` : ""}
  ${cycleControl}
  <div class="ptiers up" style="--d:.2s">
    ${family.plans.map((p) => tierCard(p, family, view.active)).join("\n    ")}
  </div>
  <button type="button" class="pmore up" style="--d:.26s" aria-expanded="false" aria-controls="mx-${family.id}">Compare what's included <span class="pcar">▼</span></button>
  ${matrix(family)}
</section>`;
};

export function pricingHtml(view: PricingView): string {
  /* The full multi-currency, multi-cycle payload, already formatted. The client
     swaps strings from this rather than recalculating, so a figure can never
     drift between what the server rendered and what a click produces.
     `<` is escaped because a "</script>" in any string would close the tag
     early and spill the rest of the payload into the document as markup. */
  const payload = JSON.stringify({
    active: view.active,
    plans: Object.fromEntries(
      view.families.flatMap((f) =>
        f.plans.map((p) => [
          p.id,
          { slug: p.slug, oneTime: p.oneTime, service: f.service, cells: p.cells },
        ]),
      ),
    ),
  }).replace(/</g, "\\u003c");

  return String.raw`
<div id="pgbg"></div>
<div id="pgline"></div>
<div id="pgrail" role="navigation" aria-label="Section"></div>
<script type="application/json" id="pgdata">${payload}</script>

<!-- 1 — TOP BAND -->
<section class="pgs" id="ptop" data-bg="#FAFAF8" data-label="Pricing">
  <div class="ptopbar">
    <div class="pccy">
      <span class="pccyrow">
        <label for="pccysel">SHOW PRICES IN</label>
        <span class="psel">
          <select id="pccysel" name="currency">
            ${view.currencies
              .map(
                (c) =>
                  `<option value="${esc(c.code)}"${c.code === view.active ? " selected" : ""}>${esc(c.label)}</option>`,
              )
              .join("\n            ")}
          </select>
        </span>
      </span>
    </div>
  </div>
  <!-- Broken by hand into two balanced lines. Left to wrap on its own it
       split 1/3/2 words and the lockup read as ragged rather than set.
       The space before the <br> is load-bearing: the phone breakpoint hides
       the break, and without it "plans" and "for" collide into "PLANSFOR". -->
  <h1>Affordable plans <br>for every budget<u>.</u></h1>
</section>
${view.families.map((f) => familySection(f, view)).join("\n")}

<!-- 5 — FAQ -->
<section class="pgs" id="pfaq" data-bg="#FFFFFF" data-label="Questions">
  <p class="pgeb up">BEFORE YOU ASK</p>
  <h2 class="pgh up" style="--d:.06s">The questions that actually <em>come up</em>.</h2>
  <div class="pfaqs up" style="--d:.12s">
    ${FAQS.map(
      (f) => `<details class="pfaq">
      <summary>${esc(f.q)}</summary>
      <p>${esc(f.a)}</p>
    </details>`,
    ).join("\n    ")}
  </div>
</section>

<!-- 6 — CLOSE -->
<section class="pgs dark" id="pclose" data-bg="#0B0B0C" data-label="Start">
  <div class="cta">
    <h2 class="up">You've got the<br>number. Now the <em>work</em>.</h2>
    <p class="csub up" style="--d:.12s">// TELL US THE GOAL. WE REPLY WITHIN ONE WORKING DAY.</p>
    <div class="btns up" style="--d:.22s">
      <a class="pgbtn gh" href="/services" data-h>All services <span class="ar">→</span></a>
      <a class="pgbtn red" href="/start-project" data-h>Start your project <span class="ar">→</span></a>
    </div>
  </div>
  <footer><div>© 2026 ADMIRATE.IN</div><div>${NAP_HTML}</div><div>${LEGAL_HTML}</div><div>PRICES EXCLUDE TAX</div></footer>
</section>
`;
}
