import { SERVICE_COPY } from "@/components/shared/service-copy";

/**
 * The written block that closes out each service page, before its closing
 * section.
 *
 * Shared rather than ported, for the same reason showcase.ts is: this is one
 * component doing one job in six places, and six copies of a stylesheet would
 * drift until only the one on the page nobody reopens was wrong. The six pages
 * still share no section grammar — their set-pieces are untouched. What they
 * share is the part that is not an experience: prose, a list, a numbered
 * process, and an FAQ that is also structured data.
 *
 * Two decisions worth knowing about:
 *
 * NOTHING HERE IS REVEALED ON SCROLL. Every other section on these pages hides
 * its contents until an IntersectionObserver marks the section `.in`. That is
 * right for a set-piece and wrong for the page's actual copy: this block exists
 * to be read, indexed and quoted, and one broken observer would mean a thousand
 * words rendered at opacity 0. It is visible from first paint, always.
 *
 * IT PLUGS INTO THE HOST ENGINE RATHER THAN CARRYING ITS OWN. The section is
 * emitted with `data-bg` and `data-label`, which is the whole contract each
 * page's init reads: it therefore paints the background, earns a rail dot and
 * announces itself exactly like a native section, with no change to any engine.
 *
 * The stylesheet is namespaced under `#svp` and `.svp*`, and every custom
 * property it reads is given a fallback, so it cannot collide with — or be
 * broken by — the six stylesheets it is appended to.
 */

const esc = (value: string) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const SERVICE_PROSE_CSS = String.raw`
/* ============ SERVICE PROSE (shared/service-prose.ts) ============ */
#svp{
  position:relative;z-index:1;
  padding:clamp(96px,14vh,150px) var(--pad,clamp(24px,6vw,96px)) clamp(70px,11vh,120px);
}
.svpin{max-width:1180px;margin:0 auto}
.svpb{margin-top:clamp(52px,8vh,96px)}
.svpb:first-child{margin-top:0}

.svpeb{
  font-family:var(--mono,'IBM Plex Mono',monospace);font-size:11px;letter-spacing:.22em;
  color:var(--red,#E3001B);text-transform:uppercase;
  display:flex;align-items:center;gap:12px;margin-bottom:18px;
}
.svpeb::before{content:"";width:22px;height:1px;background:var(--red,#E3001B);flex:0 0 22px}

.svph{
  font-family:var(--display,'Archivo',sans-serif);font-weight:800;font-stretch:106%;
  font-size:clamp(24px,3.4vw,42px);line-height:1.1;letter-spacing:-.022em;
  max-width:20ch;color:var(--black,#0B0B0C);
}
.svpp{
  font-size:clamp(15px,1.35vw,17px);line-height:1.75;color:#4a4a4e;
  max-width:64ch;margin-top:16px;
}
.svpp a{color:var(--red,#E3001B);text-decoration:none;border-bottom:1px solid rgba(227,0,27,.34);transition:border-color .2s}
.svpp a:hover{border-bottom-color:var(--red,#E3001B)}

/* ---- deliverables ---- */
.svpd{
  margin-top:clamp(26px,4vh,40px);
  display:grid;grid-template-columns:repeat(2,1fr);
  gap:0 clamp(28px,4vw,64px);
}
.svpdi{padding:20px 0;border-top:1px solid var(--line,#E9E9E6)}
.svpdi h3{
  font-family:var(--display,'Archivo',sans-serif);font-weight:700;font-size:16px;
  letter-spacing:-.008em;color:var(--black,#0B0B0C);margin-bottom:7px;
}
.svpdi p{font-size:14.5px;line-height:1.65;color:#5a5a5e}

/* ---- process ---- */
.svps{margin-top:clamp(26px,4vh,40px);list-style:none;counter-reset:svpn}
.svpsi{
  counter-increment:svpn;
  display:grid;grid-template-columns:auto minmax(0,1fr);
  gap:0 clamp(18px,2.4vw,34px);
  padding:22px 0;border-top:1px solid var(--line,#E9E9E6);
}
.svpsi::before{
  content:counter(svpn,decimal-leading-zero);
  font-family:var(--mono,'IBM Plex Mono',monospace);font-size:11px;letter-spacing:.12em;
  color:var(--red,#E3001B);padding-top:4px;
}
.svpsi h3{
  font-family:var(--display,'Archivo',sans-serif);font-weight:700;
  font-size:clamp(17px,1.9vw,21px);letter-spacing:-.012em;color:var(--black,#0B0B0C);
}
.svpwhen{
  display:inline-block;margin-left:12px;vertical-align:2px;
  font-family:var(--mono,'IBM Plex Mono',monospace);font-weight:400;font-size:10px;
  letter-spacing:.16em;text-transform:uppercase;color:var(--grey,#8A8A8E);
  border:1px solid var(--line,#E9E9E6);border-radius:999px;padding:3px 9px;
}
.svpsi p{font-size:14.5px;line-height:1.7;color:#5a5a5e;margin-top:9px;max-width:70ch}

/* ---- faq ---- */
.svpf{margin-top:clamp(26px,4vh,40px);display:grid;gap:0}
.svpq{padding:22px 0 22px clamp(16px,2vw,26px);border-top:1px solid var(--line,#E9E9E6);border-left:2px solid transparent;transition:border-left-color .3s}
.svpq:hover{border-left-color:var(--red,#E3001B)}
.svpq h3{
  font-family:var(--display,'Archivo',sans-serif);font-weight:700;
  font-size:clamp(16px,1.8vw,19px);line-height:1.35;letter-spacing:-.012em;
  color:var(--black,#0B0B0C);max-width:52ch;
}
.svpq p{font-size:14.5px;line-height:1.75;color:#5a5a5e;margin-top:10px;max-width:70ch}
.svpq a{color:var(--red,#E3001B);text-decoration:none;border-bottom:1px solid rgba(227,0,27,.34);transition:border-color .2s}
.svpq a:hover{border-bottom-color:var(--red,#E3001B)}

/* ---- on a dark surface (video production runs black throughout) ---- */
#svp.svpdark .svph,#svp.svpdark .svpdi h3,#svp.svpdark .svpsi h3,#svp.svpdark .svpq h3{color:var(--white,#fff)}
#svp.svpdark .svpp,#svp.svpdark .svpdi p,#svp.svpdark .svpsi p,#svp.svpdark .svpq p{color:#a4a4a8}
#svp.svpdark .svpdi,#svp.svpdark .svpsi,#svp.svpdark .svpq{border-top-color:rgba(255,255,255,.14)}
#svp.svpdark .svpwhen{border-color:rgba(255,255,255,.2);color:#8a8a8e}

@media (max-width:900px){
  .svpd{grid-template-columns:1fr}
  .svph{max-width:24ch}
}
@media (max-width:640px){
  .svpsi{grid-template-columns:1fr;gap:6px}
  .svpsi::before{padding-top:0}
  .svpwhen{display:block;margin:8px 0 0;width:max-content}
  .svpq{padding-left:14px}
}
`;

type ProseOptions = {
  /** Painted by the host engine, which reads `data-bg`. */
  bg: string;
  /** Rail label, read from `data-label`. */
  label?: string;
  /** True where the section sits on a dark surface. */
  dark?: boolean;
};

/**
 * Renders the block for one service.
 *
 * Copy is escaped except where it is authored as a sentence containing a single
 * anchor — the intros and FAQ answers — which are written in this repository and
 * are not user input. Everything a list or a heading carries is escaped.
 */
export function serviceProse(
  slug: string,
  { bg, label = "Details", dark = false }: ProseOptions,
): string {
  const c = SERVICE_COPY[slug];
  /* An unknown slug renders nothing rather than an empty shell — a heading with
     no content under it is worse than no section. */
  if (!c) return "";

  const paras = (list: string[]) =>
    list.map((p) => `<p class="svpp">${p}</p>`).join("\n      ");

  return `
<!-- SERVICE PROSE — shared/service-prose.ts -->
<section class="${dark ? "svpdark" : ""}" id="svp" data-bg="${esc(bg)}" data-label="${esc(label)}">
  <div class="svpin">

    <div class="svpb">
      <div class="svpeb">${esc(c.eyebrow)}</div>
      <h2 class="svph">${esc(c.what.h)}</h2>
      ${paras(c.what.p)}
    </div>

    <div class="svpb">
      <h2 class="svph">${esc(c.deliverables.h)}</h2>
      <p class="svpp">${c.deliverables.intro}</p>
      <div class="svpd">
        ${c.deliverables.items
          .map(
            (i) =>
              `<div class="svpdi"><h3>${esc(i.t)}</h3><p>${esc(i.d)}</p></div>`,
          )
          .join("\n        ")}
      </div>
    </div>

    <div class="svpb">
      <h2 class="svph">${esc(c.process.h)}</h2>
      <p class="svpp">${c.process.intro}</p>
      <ol class="svps">
        ${c.process.stages
          .map(
            (s) =>
              `<li class="svpsi"><div><h3>${esc(s.t)}<span class="svpwhen">${esc(
                s.when,
              )}</span></h3><p>${esc(s.d)}</p></div></li>`,
          )
          .join("\n        ")}
      </ol>
    </div>

    <div class="svpb">
      <h2 class="svph">${esc(c.who.h)}</h2>
      ${paras(c.who.p)}
    </div>

    <div class="svpb">
      <h2 class="svph">${esc(c.proof.h)}</h2>
      ${paras(c.proof.p)}
    </div>

    <div class="svpb">
      <h2 class="svph">${esc(c.faq.h)}</h2>
      <div class="svpf">
        ${c.faq.items
          .map(
            (f) =>
              `<div class="svpq"><h3>${esc(f.q)}</h3><p>${f.a}</p></div>`,
          )
          .join("\n        ")}
      </div>
    </div>

  </div>
</section>
`;
}
