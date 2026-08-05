import { getPost } from "@/components/blogs/posts";

/**
 * "More on this" — the return half of the internal linking.
 *
 * The six service pages deliberately share no section grammar or stylesheet,
 * and this does not break that: it is one row of text, styled in `currentColor`
 * so it reads correctly against a dark close section and a light one without
 * either page having to know which it is.
 *
 * It exists because equity was only ever flowing one way. The journal argues
 * for the services, but nothing pointed back, so the posts were near-orphans
 * and the service pages got no topical reinforcement from the writing that
 * supports them. Two links is the whole intervention — a long list of "related
 * reading" is a link farm with better manners, and dilutes the two that matter.
 *
 * Anchor text is the post's real title, read from POSTS rather than retyped, so
 * a retitled post can never leave a stale anchor behind pointing at it.
 */

const esc = (value: string) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Explicit colours, not `currentColor`.
 *
 * The first version inherited, on the assumption that the close section's text
 * colour would contrast with whatever it sat on. It does not: these sections
 * carry `.dark` (which sets white text) while their background is painted by a
 * JS-driven layer on scroll, so before that fires the row was white-on-paper
 * and effectively invisible.
 *
 * No single grey can fix it either — passing 4.5:1 against both #FAFAF8 and
 * #0B0B0C is arithmetically impossible. So this borrows the value the page
 * footers in these very sections already use, and puts the links in brand red,
 * which carries on both. Legible in every state, dark background or not.
 */
export const JOURNAL_CSS = String.raw`
.svcj{margin-top:clamp(28px,4vh,48px);padding-top:20px;border-top:1px solid rgba(128,128,132,.32);font-family:var(--mono,'IBM Plex Mono',monospace);font-size:11px;letter-spacing:.1em;line-height:1.9;color:#78787c}
.svcj b{font-weight:400;letter-spacing:.2em;margin-right:10px;text-transform:uppercase}
.svcj a{color:var(--red,#E3001B);text-decoration:none;border-bottom:1px solid rgba(227,0,27,.42);padding-bottom:1px;transition:border-color .2s}
.svcj a:hover{border-bottom-color:var(--red,#E3001B)}
.svcj span{margin:0 10px}
`;

/**
 * Renders the row for a service page. Unknown slugs are dropped rather than
 * rendered as a dead anchor, and an empty set renders nothing at all — a
 * heading with no links under it is worse than no heading.
 */
export function journalLinks(...slugs: string[]): string {
  const links = slugs
    .map((slug) => ({ slug, post: getPost(slug) }))
    .filter((entry) => entry.post)
    .map(
      ({ slug, post }) =>
        `<a href="/blogs/${esc(slug)}" data-h>${esc(post!.title)}</a>`,
    );

  if (!links.length) return "";

  return `<p class="svcj"><b>More on this</b>${links.join("<span>·</span>")}</p>`;
}
