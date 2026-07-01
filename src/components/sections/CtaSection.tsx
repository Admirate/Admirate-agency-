"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CtaSection() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.to(".cta-px-bg", {
      yPercent: -35,
      xPercent: 10,
      ease: "none",
      scrollTrigger: { trigger: "#cta-banner", start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.to(".cta-banner-inner", {
      yPercent: -6,
      ease: "none",
      scrollTrigger: { trigger: "#cta-banner", start: "top bottom", end: "bottom top", scrub: true },
    });
  }, []);

  return (
    <section
      id="cta-banner"
      className="relative overflow-hidden text-center"
      style={{ padding: "clamp(80px,10vw,120px) var(--pad)", background: "var(--ink)" }}
    >
      <div
        className="cta-px-bg absolute pointer-events-none"
        style={{
          inset: "-30%",
          background: "radial-gradient(ellipse 50% 60% at 30% 50%, rgba(227,30,36,.18) 0%, transparent 65%)",
          willChange: "transform",
        }}
        aria-hidden="true"
      />

      <div className="cta-banner-inner fade-up mx-auto" style={{ maxWidth: 700 }}>
        <h2 className="h2 mb-5" style={{ color: "#fff" }}>
          Ready to build something worth seeing?
        </h2>
        <p className="mb-9" style={{ color: "rgba(255,255,255,.45)", fontSize: "clamp(15px,1.6vw,18px)" }}>
          Let&apos;s talk about your brand. We&apos;ll get back to you within 24 hours.
        </p>
        <a href="#contact" className="btn-red">
          Start a Project
          <svg viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
