"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset } from "@/lib/cdn";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="4.5" cy="12" r="2.3" />
        <circle cx="19.5" cy="12" r="2.3" />
        <path d="M6.8 12h8.4" />
        <path d="M13 9l3 3-3 3" />
      </svg>
    ),
    title: "End-to-end thinking",
    description: "From first idea to final output, handled with intent at every step.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 13a4 4 0 0 0 5.66 0l3-3a4 4 0 1 0-5.66-5.66l-1.5 1.5" />
        <path d="M15 11a4 4 0 0 0-5.66 0l-3 3a4 4 0 1 0 5.66 5.66l1.5-1.5" />
      </svg>
    ),
    title: "Long-term partnerships",
    description: "Not one-off work, but relationships that grow with your brand.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="9" r="6" />
        <path d="M8.5 14.2L7 22l5-3 5 3-1.5-7.8" />
      </svg>
    ),
    title: "Chosen by brands",
    description: "Teams that trusted us to shape how the world sees them.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9.5" />
        <polygon points="16 8 13.8 13.8 8 16 10.2 10.2 16 8" />
      </svg>
    ),
    title: "Every direction explored",
    description: "Every creative angle considered before the final call is made.",
  },
];

export default function AboutSection() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.to(".about-px-bg", {
      yPercent: -30,
      xPercent: 5,
      ease: "none",
      scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.to(".about-left", {
      yPercent: -4,
      ease: "none",
      scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom top", scrub: true },
    });
    gsap.to(".about-right", {
      yPercent: -8,
      ease: "none",
      scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom top", scrub: true },
    });
  }, []);

  return (
    <section
      id="about"
      className="relative overflow-hidden"
      style={{ padding: "clamp(80px,10vw,140px) var(--pad)", background: "var(--paper)" }}
    >
      <div
        className="about-px-bg absolute pointer-events-none"
        style={{
          inset: "-20%",
          background: "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(227,30,36,.05) 0%, transparent 70%)",
          willChange: "transform",
        }}
        aria-hidden="true"
      />

      <div
        className="about-grid grid items-start gap-20 mx-auto"
        style={{ maxWidth: "var(--maxw)", gridTemplateColumns: "1fr 1fr" }}
      >
        {/* Left column */}
        <div className="about-left">
          <div className="eyebrow fade-up">
            <span style={{ color: "var(--ink)" }}>01</span> Who We Are
          </div>
          <h2 className="h2 fade-up">Built for brands that want to be seen.</h2>

          <div className="about-cards grid grid-cols-2 gap-5 mt-12">
            {cards.map((card, i) => (
              <div
                key={i}
                className="fade-up p-7 rounded-sm transition-all duration-300 hover:-translate-y-[3px]"
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--hair-2)",
                  borderRadius: 2,
                }}
              >
                <div className="mb-4" style={{ color: "var(--red)" }}>
                  <div className="w-7 h-7 [&>svg]:w-7 [&>svg]:h-7 [&>svg]:block [&>svg]:fill-none [&>svg]:stroke-current [&>svg]:stroke-[1.6] [&>svg]:stroke-linecap-round [&>svg]:stroke-linejoin-round [&>svg]:transition-transform [&>svg]:duration-350 hover:[&>svg]:scale-110">
                    {card.icon}
                  </div>
                </div>
                <h3
                  className="font-disp font-bold text-[14px] tracking-tight mb-2"
                  style={{ fontStretch: "expanded", letterSpacing: "-.01em" }}
                >
                  {card.title}
                </h3>
                <p className="text-[13.5px] leading-[1.55]" style={{ color: "var(--grey)" }}>
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="about-right">
          <div className="fade-up rounded-[4px] overflow-hidden leading-[0]" style={{
            background: "#0C0C0D",
            boxShadow: "0 24px 64px rgba(12,12,13,.12), 0 2px 8px rgba(12,12,13,.08)",
          }}>
            <video
              className="w-full h-auto block"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              src={asset("admirate logo animated.mp4")}
            />
          </div>

          <p className="lead fade-up mt-6">
            ADMIRATE is a strategic design and marketing agency based in India. We work with ambitious brands across identity, digital, social, and advertising — from early-stage startups to established names.
          </p>
          <p className="lead fade-up mt-4">
            We don&apos;t just make things look good. We make them work — for your audience, your goals, and your bottom line.
          </p>

          <div className="fade-up mt-7 flex flex-wrap gap-2">
            <span
              className="font-mono text-[10px] tracking-[.14em] uppercase px-4 py-2 rounded-sm"
              style={{ border: "1px solid var(--hair)", color: "var(--grey)" }}
            >
              admirate.in
            </span>
            <span
              className="font-mono text-[10px] tracking-[.14em] uppercase px-4 py-2 rounded-sm"
              style={{ border: "1px solid var(--hair)", color: "var(--grey)" }}
            >
              India
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}
