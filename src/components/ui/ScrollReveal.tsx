"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollReveal() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      document.querySelectorAll(".fade-up").forEach((el) => el.classList.add("vis"));
      return;
    }

    const triggers: ScrollTrigger[] = [];

    const createReveals = () => {
      document.querySelectorAll<HTMLElement>(".fade-up:not(.vis)").forEach((el) => {
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () => el.classList.add("vis"),
        });
        triggers.push(st);
      });
    };

    const timer = setTimeout(createReveals, 300);

    return () => {
      clearTimeout(timer);
      triggers.forEach((st) => st.kill());
    };
  }, []);

  return null;
}
