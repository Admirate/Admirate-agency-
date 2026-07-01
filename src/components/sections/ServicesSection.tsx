"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    num: "01",
    icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2" /></svg>,
    title: "Visual Identity",
    description: "Logos, systems, and guidelines that make brands recognisable anywhere.",
  },
  {
    num: "02",
    icon: <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    title: "Social Media",
    description: "Content, strategy and creatives that build presence across every platform.",
  },
  {
    num: "03",
    icon: <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
    title: "Web Development",
    description: "Fast, beautiful websites built for conversion and crafted with care.",
  },
  {
    num: "04",
    icon: <svg viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>,
    title: "Video Production",
    description: "Reels, ads, and branded films that stop the scroll and tell the story.",
  },
  {
    num: "05",
    icon: <svg viewBox="0 0 24 24"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>,
    title: "Creative Campaigns",
    description: "Big ideas executed with strategy — from concept to final delivery.",
  },
  {
    num: "06",
    icon: <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
    title: "Editorial Design",
    description: "Catalogues, lookbooks, reports — print and digital, crafted to impress.",
  },
  {
    num: "07",
    icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" /></svg>,
    title: "Brand Strategy",
    description: "Positioning, messaging, and direction that gives every decision clarity.",
  },
  {
    num: "08",
    icon: <svg viewBox="0 0 24 24"><polyline points="3 17 9 11 13 15 21 7" /><polyline points="15 7 21 7 21 13" /></svg>,
    title: "Digital Advertising",
    description: "Paid campaigns on Meta, Google, and beyond — built to perform.",
  },
];

export default function ServicesSection() {
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const triggers: ScrollTrigger[] = [];
    const t1 = gsap.to(".services-px-grid", {
      yPercent: -20, ease: "none",
      scrollTrigger: { trigger: "#services", start: "top bottom", end: "bottom top", scrub: true },
    });
    if (t1.scrollTrigger) triggers.push(t1.scrollTrigger);

    const t2 = gsap.to(".services-head", {
      yPercent: -6, ease: "none",
      scrollTrigger: { trigger: "#services", start: "top bottom", end: "bottom top", scrub: true },
    });
    if (t2.scrollTrigger) triggers.push(t2.scrollTrigger);

    return () => triggers.forEach((st) => st.kill());
  }, []);

  return (
    <section
      id="services"
      className="relative overflow-hidden"
      style={{ padding: "clamp(80px,10vw,140px) var(--pad)", background: "var(--ink)" }}
    >
      <div
        className="services-px-grid absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          willChange: "transform",
        }}
        aria-hidden="true"
      />

      <div className="services-head relative z-[1] mx-auto mb-16" style={{ maxWidth: "var(--maxw)" }}>
        <div className="eyebrow fade-up" style={{ color: "rgba(255,255,255,.35)" }}>
          <span style={{ color: "rgba(255,255,255,.6)" }}>02</span> What We Do
        </div>
        <h2 className="h2 fade-up" style={{ color: "#fff", maxWidth: "16ch" }}>
          Every service your brand needs.
        </h2>
      </div>

      {/* Grid uses gap:1px + bg color trick for clean single-pixel borders */}
      <div
        className="svc-grid relative z-[1] mx-auto grid"
        style={{
          maxWidth: "var(--maxw)",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "1px",
          background: "rgba(255,255,255,.08)",
          border: "1px solid rgba(255,255,255,.08)",
        }}
      >
        {services.map((svc, i) => (
          <div
            key={i}
            className="fade-up p-7 transition-colors duration-300 hover:bg-white/[.04]"
            style={{ background: "var(--ink)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono text-[10px] tracking-[.14em]" style={{ color: "rgba(255,255,255,.25)" }}>
                {svc.num}
              </span>
              <div
                className="[&>svg]:w-[22px] [&>svg]:h-[22px] [&>svg]:block [&>svg]:fill-none [&>svg]:stroke-current [&>svg]:stroke-[1.5] [&>svg]:stroke-linecap-round [&>svg]:stroke-linejoin-round [&>svg]:transition-transform [&>svg]:duration-350 hover:[&>svg]:scale-[1.12]"
                style={{ color: "var(--red)" }}
              >
                {svc.icon}
              </div>
            </div>
            <h3
              className="font-disp font-bold text-[15px] text-white mb-2"
              style={{ fontStretch: "expanded", letterSpacing: "-.01em" }}
            >
              {svc.title}
            </h3>
            <p className="text-[13px] leading-[1.55]" style={{ color: "rgba(255,255,255,.38)" }}>
              {svc.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
