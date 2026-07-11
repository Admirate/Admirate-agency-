"use client";

import { useEffect } from "react";

type InitFn = () => (() => void) | void;

/**
 * Renders a page that was authored as a self-contained HTML document.
 *
 * The original markup, stylesheet and imperative script are preserved verbatim:
 *  - `css`  is injected as a <style> that mounts/unmounts with this component,
 *           so the two pages' identically-named selectors never collide, and
 *           neither leaks into the Tailwind-styled dashboard.
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
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
