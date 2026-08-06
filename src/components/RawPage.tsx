"use client";

import { useEffect } from "react";
import { mincss } from "@/lib/mincss";

type InitFn = () => (() => void) | void;

/**
 * Minified once per stylesheet, not once per render.
 *
 * Every page here passes a module-level constant, so the cache is bounded by
 * the number of pages and the keys are strings that were never going to be
 * collected anyway. Without it the transform would re-run on the client at
 * hydration for a result the server had already computed.
 */
const cache = new Map<string, string>();

const minified = (css: string) => {
  let out = cache.get(css);
  if (out === undefined) {
    out = mincss(css);
    cache.set(css, out);
  }
  return out;
};

/**
 * Renders a page that was authored as a self-contained HTML document.
 *
 * The original markup, stylesheet and imperative script are preserved verbatim:
 *  - `css`  is injected as a <style> that mounts/unmounts with this component,
 *           so the two pages' identically-named selectors never collide, and
 *           neither leaks into the Tailwind-styled dashboard. It is minified on
 *           the way in (see lib/mincss.ts): this stylesheet is a runtime string,
 *           so no part of the build pipeline ever sees it, and it was shipping
 *           inside the document with every authoring comment intact.
 *  - `html` is injected as static markup that the script then drives directly
 *           (the script works off getElementById / querySelector, exactly as
 *           it did in the standalone file).
 *  - `init` runs after the markup is in the DOM and returns a cleanup function
 *           that stops animation loops and detaches listeners on unmount.
 */
export default function RawPage({
  css,
  html,
  init,
}: {
  css: string;
  html: string;
  init: InitFn;
}) {
  useEffect(() => {
    const cleanup = init();
    return () => {
      if (typeof cleanup === "function") cleanup();
    };
    // Run once on mount — the script owns the DOM from here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: minified(css) }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
