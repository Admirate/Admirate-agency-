// @ts-nocheck

/** Scroll progress bar + reveal-on-scroll. Shared by the index and the article pages. */
function initCommon() {
  const _dead = { v: false };
  const topline = document.getElementById("topline");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onScroll = () => {
    if (!topline) return;
    const doc = document.documentElement;
    const max = doc.scrollHeight - innerHeight;
    topline.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  };
  onScroll();
  addEventListener("scroll", onScroll, { passive: true });

  const rises = [...document.querySelectorAll(".rise")];
  let io = null;
  if (reduced) {
    rises.forEach((el) => el.classList.add("vis"));
  } else {
    io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    rises.forEach((el) => io.observe(el));
  }

  return () => {
    _dead.v = true;
    removeEventListener("scroll", onScroll);
    try {
      if (io) io.disconnect();
    } catch (e) {}
  };
}

/** Blog index: topic filter chips over the post grid. */
export function initBlogs() {
  const stopCommon = initCommon();

  const filters = document.getElementById("filters");
  const cards = [...document.querySelectorAll(".pcard")];
  const empty = document.getElementById("empty");

  const onFilter = (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;

    const f = chip.dataset.f;
    filters
      .querySelectorAll(".chip")
      .forEach((c) => c.classList.toggle("on", c === chip));

    let shown = 0;
    cards.forEach((c) => {
      const match = f === "all" || c.dataset.tag === f;
      c.classList.toggle("hide", !match);
      if (match) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  };
  if (filters) filters.addEventListener("click", onFilter);

  return () => {
    stopCommon();
    if (filters) filters.removeEventListener("click", onFilter);
  };
}

/** Article page: just the shared progress bar + reveals. */
export function initPost() {
  return initCommon();
}
