import { POSTS } from "@/components/blogs/posts";
import { LEGAL_DOCS } from "@/components/legal/docs";
import { SERVICE_LIST } from "@/components/service/registry";
import {
  buildSitemapGroups,
  renderSitemapContent,
} from "@/components/sitemap/catalog.mjs";

export const SITEMAP_GROUPS = buildSitemapGroups({
  services: SERVICE_LIST,
  posts: POSTS,
  legalDocs: LEGAL_DOCS,
});

export const SITEMAP_HTML = renderSitemapContent(SITEMAP_GROUPS);

/**
 * The directory follows ADMIRATE's established type and colour system, but its
 * oversized page count is unique to this route: completeness is the product.
 */
export const SITEMAP_CSS = String.raw`
:root{
  --white:#FFFFFF;
  --paper:#FAFAF8;
  --black:#0B0B0C;
  --red:#E3001B;
  --grey:#8A8A8E;
  --line:#E9E9E6;
  --pad:clamp(24px,6vw,96px);
  --display:var(--font-display),'Archivo',sans-serif;
  --body:var(--font-body),'Inter',sans-serif;
  --mono:var(--font-mono),'IBM Plex Mono',monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:var(--body);background:var(--paper);color:var(--black);overflow-x:hidden;-webkit-font-smoothing:antialiased}
::selection{background:var(--red);color:var(--white)}

.map-wrap{width:min(1440px,100%);margin:0 auto;padding-left:var(--pad);padding-right:var(--pad)}

/* The hero reads like an index cover, not a marketing banner. The count is
   calculated from the same groups below, so its large claim stays honest. */
.map-hero{position:relative;overflow:hidden;padding:clamp(132px,20vh,210px) 0 clamp(64px,10vh,110px);border-bottom:1px solid var(--line)}
.map-grid{position:absolute;inset:0;background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);background-size:clamp(72px,9vw,136px) clamp(72px,9vw,136px);opacity:.55;mask-image:linear-gradient(to bottom,#000,transparent)}
.map-hero-inner{position:relative;z-index:1}
.map-kicker{display:flex;align-items:center;gap:12px;font-family:var(--mono);font-size:11px;letter-spacing:.24em;color:var(--red);margin-bottom:20px}
.map-kicker::before{content:"";width:24px;height:1px;background:var(--red)}
.map-title-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:end;gap:clamp(26px,5vw,76px)}
.map-hero h1{font-family:var(--display);font-weight:900;font-stretch:112%;font-size:clamp(54px,9.5vw,142px);line-height:.84;letter-spacing:-.045em;text-transform:uppercase}
.map-hero h1 em{font-style:normal;color:var(--red)}
.map-count{display:flex;flex-direction:column;align-items:flex-end;padding-bottom:.08em;font-family:var(--mono);text-transform:uppercase}
.map-count strong{font-family:var(--display);font-size:clamp(64px,10vw,152px);font-weight:900;line-height:.68;letter-spacing:-.07em;color:var(--black)}
.map-count span{margin-top:18px;font-size:10px;letter-spacing:.22em;color:var(--grey)}
.map-intro{margin-top:clamp(28px,4vw,46px);max-width:59ch;font-size:clamp(16px,1.5vw,20px);font-weight:300;line-height:1.65;color:#454549}

/* The four groups are categories, not steps, so headings are intentionally
   unnumbered. Rules do the organising without inventing an order. */
.map-groups{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0;padding-top:clamp(50px,8vh,90px);padding-bottom:clamp(76px,11vh,130px)}
.map-group{min-width:0;padding:clamp(28px,4vw,48px);border-top:1px solid var(--line)}
.map-group:nth-child(odd){border-right:1px solid var(--line)}
.map-group h2{font-family:var(--display);font-size:clamp(24px,3vw,38px);font-weight:800;letter-spacing:-.025em;text-transform:uppercase;margin-bottom:22px}
.map-group ul{list-style:none}
.map-group li{border-top:1px solid var(--line)}
.map-group li:last-child{border-bottom:1px solid var(--line)}
.map-group a{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:15px 2px;color:var(--black);text-decoration:none;font-size:clamp(14px,1.2vw,17px);line-height:1.4;transition:color .2s,padding .2s}
.map-group a span{min-width:0}
.map-group a b{font-family:var(--mono);font-size:14px;font-weight:400;color:var(--grey);transition:color .2s,transform .2s;flex:none}
.map-group a:hover{color:var(--red);padding-left:8px}
.map-group a:hover b{color:var(--red);transform:translate(2px,-2px)}
.map-group a:focus-visible{outline:2px solid var(--red);outline-offset:4px;border-radius:2px}

@media (max-width:760px){
  .map-hero{padding-top:120px}
  .map-title-row{grid-template-columns:1fr}
  .map-count{align-items:flex-start;padding:0}
  .map-count strong{font-size:72px}
  .map-count span{margin-top:12px}
  .map-groups{grid-template-columns:1fr}
  .map-group{padding:30px 0}
  .map-group:nth-child(odd){border-right:0}
  .map-group:first-child{border-top:0}
  .map-group a{padding-top:14px;padding-bottom:14px}
}
@media (prefers-reduced-motion:reduce){
  .map-group a,.map-group a b{transition:none}
  .map-group a:hover b{transform:none}
}
`;
