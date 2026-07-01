"use client";

import { useState, useEffect, useCallback } from "react";

const testimonials = [
  {
    quote: "The team at Admirate didn't just design our website — they understood our entire brand and made every touchpoint reflect it. The results speak for themselves.",
    name: "Director, Patil Group",
  },
  {
    quote: "Working with Admirate felt less like hiring an agency and more like having a creative partner who actually cared about the outcome.",
    name: "Founder, Our Sacred Space",
  },
  {
    quote: "Our social media went from an afterthought to one of our strongest acquisition channels within three months of working together.",
    name: "Marketing Lead, Avvent Global",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const handleGoSlide = useCallback((n: number) => {
    setCurrent(n);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="testimonials"
      style={{ padding: "clamp(80px,10vw,140px) var(--pad)", background: "var(--paper)" }}
    >
      <div className="mx-auto mb-14" style={{ maxWidth: "var(--maxw)" }}>
        <div className="eyebrow fade-up">
          <span style={{ color: "var(--ink)" }}>05</span> What Clients Say
        </div>
        <h2 className="h2 fade-up">Words from the brands we&apos;ve built with.</h2>
      </div>

      <div className="fade-up relative overflow-hidden mx-auto" style={{ maxWidth: "var(--maxw)" }}>
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${current * 100}%)`,
            transitionTimingFunction: "var(--ease)",
          }}
        >
          {testimonials.map((t, i) => (
            <div key={i} className="min-w-full pr-8" style={{ boxSizing: "border-box" }}>
              <blockquote
                className="font-disp font-semibold mb-7"
                style={{
                  fontStretch: "expanded",
                  fontSize: "clamp(20px, 3vw, 38px)",
                  lineHeight: 1.15,
                  letterSpacing: "-.025em",
                  color: "var(--ink)",
                  maxWidth: "32ch",
                }}
              >
                <span style={{ color: "var(--red)" }}>&ldquo;</span>
                {t.quote}
                <span style={{ color: "var(--red)" }}>&rdquo;</span>
              </blockquote>
              <div className="flex items-center gap-3.5">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: "var(--red)" }} />
                <div className="font-mono text-[10px] tracking-[.12em] uppercase" style={{ color: "var(--grey)" }}>
                  {t.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className="h-[2px] border-none transition-all duration-250"
              style={{
                background: i === current ? "var(--red)" : "var(--hair)",
                width: i === current ? 32 : 20,
                cursor: "pointer",
              }}
              onClick={() => handleGoSlide(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
