"use client";

import { useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    num: "01",
    icon: <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>,
    title: "Discover",
    description: "We learn your brand, goals, audience, and the gap between where you are and where you want to be.",
  },
  {
    num: "02",
    icon: <svg viewBox="0 0 24 24"><path d="M9 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" /><path d="M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
    title: "Strategise",
    description: "Every creative decision grounded in positioning, messaging, and a plan that makes sense for your category.",
  },
  {
    num: "03",
    icon: <svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>,
    title: "Design",
    description: "Multiple directions explored before we commit — you see real options, not a single first draft.",
  },
  {
    num: "04",
    icon: <svg viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
    title: "Execute",
    description: "From final files to live campaigns — everything produced in-house with full quality control.",
  },
  {
    num: "05",
    icon: <svg viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
    title: "Scale",
    description: "We track what works and build on it — your brand grows stronger with every round of work.",
  },
];

export default function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0);

  const handleSetActive = useCallback((index: number) => {
    setActiveStep(index);
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const triggers: ScrollTrigger[] = [];
    const stepEls = document.querySelectorAll(".proc-step");
    stepEls.forEach((s, i) => {
      const st = ScrollTrigger.create({
        trigger: s,
        start: "top 68%",
        onEnter: () => handleSetActive(i),
      });
      triggers.push(st);
    });

    return () => triggers.forEach((st) => st.kill());
  }, [handleSetActive]);

  return (
    <section
      id="process"
      className="relative overflow-hidden"
      style={{ padding: "clamp(80px,10vw,140px) var(--pad)", background: "var(--ink)" }}
    >
      {/* Background number */}
      <div
        className="absolute z-0 pointer-events-none select-none font-disp font-black"
        style={{
          right: "-2%",
          bottom: "-10%",
          fontStretch: "expanded",
          fontSize: "clamp(200px, 28vw, 420px)",
          lineHeight: 1,
          letterSpacing: "-.06em",
          color: "rgba(255,255,255,.025)",
          transition: "opacity .4s",
        }}
      >
        {steps[activeStep].num}
      </div>

      {/* Header */}
      <div className="relative z-[1] mx-auto mb-[72px]" style={{ maxWidth: "var(--maxw)" }}>
        <div className="eyebrow fade-up" style={{ color: "rgba(255,255,255,.35)" }}>
          <span style={{ color: "rgba(255,255,255,.6)" }}>04</span> How We Work
        </div>
        <h2 className="h2 fade-up" style={{ color: "#fff" }}>
          Process that removes<br />guesswork.
        </h2>
      </div>

      {/* Progress track (desktop) */}
      <div className="proc-desktop relative z-[1] mx-auto" style={{ maxWidth: "var(--maxw)" }}>
        <div className="flex items-center gap-0 mb-14">
          {steps.map((_, i) => (
            <div key={i} className="flex items-center" style={{ flex: i < steps.length - 1 ? 1 : 0 }}>
              <div
                className="w-[10px] h-[10px] rounded-full shrink-0 z-[1] transition-all duration-400"
                style={{
                  background: i <= activeStep ? "var(--red)" : "rgba(255,255,255,.2)",
                  border: `2px solid ${i <= activeStep ? "var(--red)" : "rgba(255,255,255,.15)"}`,
                  transform: i <= activeStep ? "scale(1.3)" : "scale(1)",
                }}
              />
              {i < steps.length - 1 && (
                <div className="flex-1 h-px relative overflow-hidden" style={{ background: "rgba(255,255,255,.1)" }}>
                  <div
                    className="absolute inset-0 origin-left transition-transform duration-500"
                    style={{
                      background: "var(--red)",
                      transform: i < activeStep ? "scaleX(1)" : "scaleX(0)",
                      transitionTimingFunction: "var(--ease)",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-5 gap-0">
          {steps.map((step, i) => (
            <div
              key={i}
              className="proc-step fade-up pr-7 last:pr-0 transition-opacity duration-400"
              style={{
                opacity: i === activeStep ? 1 : 0.45,
                cursor: "pointer",
                willChange: "transform",
              }}
              onClick={() => handleSetActive(i)}
              role="button"
              tabIndex={0}
              aria-label={`Step ${step.num}: ${step.title}`}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleSetActive(i); }}
            >
              <div
                className="font-mono text-[10px] tracking-[.18em] mb-4 transition-all duration-400"
                style={{
                  color: "var(--red)",
                  opacity: i === activeStep ? 1 : 0,
                  transform: i === activeStep ? "none" : "translateY(6px)",
                }}
              >
                {step.num}
              </div>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mb-5 transition-all duration-400 [&>svg]:w-[18px] [&>svg]:h-[18px] [&>svg]:fill-none [&>svg]:stroke-current [&>svg]:stroke-[1.6] [&>svg]:stroke-linecap-round [&>svg]:stroke-linejoin-round"
                style={{
                  border: `1px solid ${i === activeStep ? "var(--red)" : "rgba(255,255,255,.1)"}`,
                  background: i === activeStep ? "rgba(227,30,36,.12)" : "transparent",
                  color: i === activeStep ? "var(--red)" : "rgba(255,255,255,.3)",
                }}
              >
                {step.icon}
              </div>
              <h3
                className="font-disp font-extrabold text-white mb-2.5 leading-none"
                style={{
                  fontStretch: "expanded",
                  fontSize: "clamp(16px, 1.8vw, 22px)",
                  letterSpacing: "-.02em",
                }}
              >
                {step.title}
              </h3>
              <p
                className="text-[13px] leading-[1.6] transition-colors duration-400"
                style={{ color: i === activeStep ? "rgba(255,255,255,.65)" : "rgba(255,255,255,.38)" }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile steps */}
      <div className="proc-mobile relative z-[1] mx-auto grid grid-cols-1 gap-8" style={{ maxWidth: "var(--maxw)", display: "none" }}>
        {steps.map((step, i) => (
          <div key={i} className="fade-up">
            <div className="font-mono text-[10px] tracking-[.18em] mb-4" style={{ color: "var(--red)" }}>
              {step.num}
            </div>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-5 [&>svg]:w-[18px] [&>svg]:h-[18px] [&>svg]:fill-none [&>svg]:stroke-current [&>svg]:stroke-[1.6]"
              style={{ border: "1px solid var(--red)", background: "rgba(227,30,36,.12)", color: "var(--red)" }}
            >
              {step.icon}
            </div>
            <h3
              className="font-disp font-extrabold text-white mb-2.5 leading-none"
              style={{ fontStretch: "expanded", fontSize: "clamp(16px, 1.8vw, 22px)", letterSpacing: "-.02em" }}
            >
              {step.title}
            </h3>
            <p className="text-[13px] leading-[1.6]" style={{ color: "rgba(255,255,255,.65)" }}>
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
