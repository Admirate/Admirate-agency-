/**
 * The keyword line inside a service page's H1.
 *
 * Every service page had a title targeting "<service> in Hyderabad" and an H1
 * that shared not one word with it — "BUILT TO BE KNOWN", "SITES THAT EARN
 * THEIR KEEP". The slogans are the best writing on the site and are not worth
 * losing, but the H1 is a strong relevance signal and all six were spending it
 * on copy that names neither the service nor the city.
 *
 * So the slogan keeps the H1 and the keyword joins it underneath, inside the
 * same heading, at caption size.
 *
 * Visible, deliberately. A keyword hidden behind `display:none`, a zero-height
 * box or off-screen positioning is cloaking — it is the oldest trick Google
 * penalises for, and it would put a manual action on the six pages that matter
 * most. This reads as a subtitle to a human because that is exactly what it is.
 */

const esc = (value: string) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Resets almost everything, because it lives inside a heading set at up to
 * 120px with a stretched display face and negative tracking. Inheriting any of
 * that would make a caption unreadable.
 */
export const HERO_KEYWORD_CSS = String.raw`
.h1kw{
  display:block;margin-top:clamp(14px,2vh,22px);
  font-family:var(--mono,'IBM Plex Mono',monospace);
  font-size:clamp(10px,1.05vw,12.5px);font-weight:400;font-stretch:normal;
  letter-spacing:.2em;line-height:1.7;text-transform:uppercase;
  color:var(--red,#E3001B);max-width:34ch;
}
.ids.dark .h1kw,.dark .h1kw{color:var(--red,#E3001B)}
`;

export const heroKeyword = (text: string) =>
  `<span class="h1kw">${esc(text)}</span>`;
