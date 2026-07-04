"use client";

import { useEffect } from "react";

export function useScrollReveal(selector = ".fade-up") {
  useEffect(() => {
    async function run() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          onEnter: () => el.classList.add("vis"),
        });
      });
    }
    run();
  }, [selector]);
}

export function useParallax(selector: string, opts: { yPercent: number; trigger?: string }) {
  useEffect(() => {
    async function run() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      gsap.to(selector, {
        yPercent: opts.yPercent,
        ease: "none",
        scrollTrigger: {
          trigger: opts.trigger || selector,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }
    run();
  }, [selector, opts.yPercent, opts.trigger]);
}
