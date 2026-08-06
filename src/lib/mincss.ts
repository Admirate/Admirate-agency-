/**
 * Minifier for the page stylesheets that ship inside the HTML document.
 *
 * The public pages are authored as self-contained documents and injected by
 * components/RawPage.tsx, which means their CSS is a runtime string in a
 * `<style>` tag rather than a file. Nothing in the build pipeline ever sees it,
 * so it shipped exactly as written: 20–60 KB per document, every explanatory
 * comment included, inlined into the critical path of every page load. The
 * comments are worth keeping in the source and worth nothing to a browser.
 *
 * This runs once per stylesheet at module load — the pages are prerendered, so
 * in practice that is once at build time, not once per request.
 *
 * WHY THIS IS A TOKENIZER AND NOT A CHAIN OF REGEXES
 *
 * The first version of this file was four `.replace()` calls: park the strings
 * and url()s, strip comments, collapse whitespace, put the strings back. It
 * removed 45% of the bytes and it was catastrophically wrong — the landing page
 * went from 317 CSS rules to 13, and every page lost some.
 *
 * The reason is worth recording. The string-parking step ran before comments
 * were stripped, and these stylesheets are heavily commented in English, so an
 * apostrophe in a comment ("a slide fills the viewport when its content fits,
 * and grows when it doesn't") opened what the regex believed was a quoted
 * string. It stayed open until the next apostrophe several rules later, and
 * everything between them was parked as string content and never minified —
 * which is to say, silently deleted from the parsed stylesheet.
 *
 * That failure is invisible in a byte count (it looks like excellent
 * compression) and invisible in a build (it is valid CSS, just less of it).
 * A single left-to-right pass that knows which state it is in cannot make that
 * class of mistake, because a comment is consumed as a comment before its
 * contents are ever looked at.
 *
 * What it does: strips comments, collapses whitespace runs to one space, drops
 * whitespace adjacent to `{ } ; ,`, and drops the last `;` in a block.
 *
 * What it deliberately does not do, each being a way to break a stylesheet that
 * looks fine until one page is scrolled:
 *   - touch whitespace around `:` — risks `:is()`, `::before` and media features
 *   - touch whitespace around parentheses — `(a) and (b)` must not become
 *     `(a)and(b)`, which is not a valid media query
 *   - remove the space in a descendant combinator — `.a\n  .b` collapses to
 *     `.a .b`, never to `.a.b`, which would be a different selector
 *
 * Verified by parsing the before and after of all eleven public stylesheets
 * with the browser's own CSS engine and comparing the rule trees.
 */

const SEPARATORS = new Set(["{", "}", ";", ","]);

const isSpace = (c: string) =>
  c === " " || c === "\t" || c === "\n" || c === "\r" || c === "\f";

export function mincss(css: string): string {
  const n = css.length;
  let out = "";
  let pendingSpace = false;
  let i = 0;

  /**
   * Appends a token, resolving any whitespace that preceded it.
   *
   * The space is kept only when it sits between two things that need
   * separating — so a descendant combinator survives and the space before a
   * brace does not.
   */
  const push = (token: string) => {
    if (pendingSpace) {
      pendingSpace = false;
      if (
        out.length &&
        !SEPARATORS.has(out[out.length - 1]) &&
        !SEPARATORS.has(token[0])
      ) {
        out += " ";
      }
    }
    /* The final declaration's semicolon is optional, and dropping it here —
       rather than with a `;}` replace over the finished string — means a
       literal ";}" inside a content string can never be hit. */
    if (token === "}" && out.endsWith(";")) out = out.slice(0, -1);
    out += token;
  };

  while (i < n) {
    const c = css[i];

    /* Comment. Consumed whole, before anything inside it is interpreted —
       this is the case the regex version got wrong. */
    if (c === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      i = end === -1 ? n : end + 2;
      /* A comment separates tokens, so it leaves a space behind rather than
         welding its neighbours together. `push` drops it if it is not needed. */
      pendingSpace = true;
      continue;
    }

    /* Quoted string — copied out verbatim, escapes included. */
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n) {
        if (css[j] === "\\") {
          j += 2;
          continue;
        }
        if (css[j] === c) {
          j++;
          break;
        }
        j++;
      }
      push(css.slice(i, j));
      i = j;
      continue;
    }

    /* url(...) — verbatim too, and aware of quotes inside it, so the grain
       texture's `url("data:image/svg+xml,…")` is never rewritten. */
    if ((c === "u" || c === "U") && css.slice(i, i + 4).toLowerCase() === "url(") {
      let j = i + 4;
      let quote = "";
      while (j < n) {
        const d = css[j];
        if (quote) {
          if (d === "\\") {
            j += 2;
            continue;
          }
          if (d === quote) quote = "";
          j++;
          continue;
        }
        if (d === '"' || d === "'") {
          quote = d;
          j++;
          continue;
        }
        if (d === ")") {
          j++;
          break;
        }
        j++;
      }
      push(css.slice(i, j));
      i = j;
      continue;
    }

    if (isSpace(c)) {
      pendingSpace = true;
      i++;
      continue;
    }

    push(c);
    i++;
  }

  return out.trim();
}
