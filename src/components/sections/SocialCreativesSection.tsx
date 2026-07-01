"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { creative } from "@/lib/cdn";

gsap.registerPlugin(ScrollTrigger);

type Creative = {
  image: string;
  platform: string;
  client: string;
  title: string;
  tags: string[];
  size: "sq" | "land";
};

const creatives: Creative[] = [
  { image: creative("1@72x-100.jpg"), platform: "instagram", client: "Hitex Sports Expo", title: "Event launch post", tags: ["1:1", "Event"], size: "sq" },
  { image: creative("3a.jpg"), platform: "instagram", client: "Hope Trust India", title: "Awareness post", tags: ["1:1", "Mental Health"], size: "sq" },
  { image: creative("5.jpg"), platform: "instagram", client: "Hitex Sports Expo", title: "Sportex editorial banner", tags: ["2:1", "Banner"], size: "land" },
  { image: creative("1@72x-100.jpg"), platform: "instagram", client: "Hitex Sports Expo", title: "Carousel — frame 1", tags: ["1:1", "Carousel"], size: "sq" },
  { image: creative("3a.jpg"), platform: "instagram", client: "South Glass", title: "Lunar New Year", tags: ["1:1", "Festive"], size: "sq" },
  { image: creative("5.jpg"), platform: "instagram", client: "Hope Trust India", title: "New Year's carousel", tags: ["1:1", "Carousel"], size: "sq" },
  { image: creative("3a.jpg"), platform: "instagram", client: "Hope Trust India", title: "Motivation post", tags: ["1:1", "Carousel"], size: "sq" },
  { image: creative("1@72x-100.jpg"), platform: "instagram", client: "South Glass", title: "Christmas post", tags: ["1:1", "Festive"], size: "land" },
];

const platforms = ["all", "instagram", "linkedin", "facebook"];
const tabs = ["Feed Posts", "Reels Covers", "Stories", "Carousels"];

export default function SocialCreativesSection() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const triggers: ScrollTrigger[] = [];
    const scDots = document.querySelectorAll(".sc-px-dot");
    if (scDots[0]) {
      const t = gsap.to(scDots[0], {
        yPercent: -40, xPercent: -5, ease: "none",
        scrollTrigger: { trigger: "#social-creatives", start: "top bottom", end: "bottom top", scrub: true },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }
    if (scDots[1]) {
      const t = gsap.to(scDots[1], {
        yPercent: -25, xPercent: 8, ease: "none",
        scrollTrigger: { trigger: "#social-creatives", start: "top bottom", end: "bottom top", scrub: true },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }
    const gridTween = gsap.to(".sc-grid", {
      yPercent: -3, ease: "none",
      scrollTrigger: { trigger: "#social-creatives", start: "top bottom", end: "bottom top", scrub: true },
    });
    if (gridTween.scrollTrigger) triggers.push(gridTween.scrollTrigger);

    return () => triggers.forEach((st) => st.kill());
  }, []);

  const filteredCreatives = activeFilter === "all"
    ? creatives
    : creatives.filter((c) => c.platform === activeFilter);

  return (
    <section
      id="social-creatives"
      className="relative overflow-hidden"
      style={{ padding: "clamp(80px,10vw,140px) var(--pad)", background: "#F2F1EC" }}
    >
      <div
        className="sc-px-dot absolute pointer-events-none"
        style={{
          top: "-10%", right: "-5%", width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(227,30,36,.07) 0%, transparent 70%)",
          willChange: "transform",
        }}
        aria-hidden="true"
      />
      <div
        className="sc-px-dot absolute pointer-events-none"
        style={{
          bottom: "-15%", left: "-8%", width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(227,30,36,.07) 0%, transparent 70%)",
          opacity: 0.6, willChange: "transform",
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="sc-header mx-auto mb-14 flex items-end justify-between gap-8 flex-wrap" style={{ maxWidth: "var(--maxw)" }}>
        <div>
          <div className="eyebrow fade-up">03b · Social Creatives</div>
          <h2 className="h2 fade-up" style={{ maxWidth: "14ch" }}>Posts that stop the scroll.</h2>
          <p className="fade-up mt-3.5" style={{ fontSize: "clamp(14px,1.5vw,17px)", color: "var(--grey)", lineHeight: 1.55, maxWidth: "36ch" }}>
            Thumb-stopping content designed for real brands — not templates.
          </p>
        </div>
        <div className="sc-filters flex gap-2 flex-wrap fade-up">
          {platforms.map((p) => (
            <button
              key={p}
              className="font-mono text-[10px] tracking-[.12em] uppercase px-4 py-2 rounded-sm transition-all duration-250"
              style={{
                border: `1px solid ${activeFilter === p ? "var(--ink)" : "var(--hair)"}`,
                background: activeFilter === p ? "var(--ink)" : "transparent",
                color: activeFilter === p ? "#fff" : "var(--grey)",
                cursor: "pointer",
              }}
              onClick={() => setActiveFilter(p)}
            >
              {p === "all" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="sc-tabs mx-auto mb-11 flex" style={{ maxWidth: "var(--maxw)", borderBottom: "1px solid var(--hair)" }}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className="font-mono text-[10px] tracking-[.14em] uppercase px-5 py-3 bg-transparent border-none relative transition-colors duration-200"
            style={{ color: activeTab === i ? "var(--ink)" : "var(--grey)", cursor: "pointer" }}
            onClick={() => setActiveTab(i)}
          >
            {tab}
            <span
              className="absolute bottom-[-1px] left-0 right-0 h-[2px] transition-transform duration-[280ms]"
              style={{
                background: "var(--red)",
                transform: activeTab === i ? "scaleX(1)" : "scaleX(0)",
                transformOrigin: "left",
              }}
            />
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        className="sc-grid mx-auto grid gap-3.5"
        style={{ maxWidth: "var(--maxw)", gridTemplateColumns: "repeat(4, 1fr)" }}
      >
        {filteredCreatives.map((item, i) => (
          <article
            key={i}
            className="fade-up vis relative overflow-hidden group transition-all duration-[400ms] hover:-translate-y-1"
            style={{
              gridColumn: item.size === "land" ? "span 2" : "span 1",
              background: "#fff",
              border: "1px solid var(--hair)",
            }}
          >
            <div
              className="w-full overflow-hidden"
              style={{ aspectRatio: item.size === "land" ? "2 / 1" : "1 / 1" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full block transition-transform duration-[600ms] group-hover:scale-[1.04]"
                style={{ objectFit: "cover" }}
                loading="lazy"
              />
            </div>

            {/* Badge */}
            <div
              className="absolute top-[10px] right-[10px] z-[2] px-[9px] py-[3px] rounded-sm"
              style={{ background: "rgba(12,12,13,.6)", backdropFilter: "blur(6px)" }}
            >
              <span className="font-mono text-[7.5px] tracking-[.14em] uppercase" style={{ color: "rgba(255,255,255,.65)" }}>
                {item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
              </span>
            </div>

            {/* Hover overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end"
              style={{ background: "linear-gradient(to top, rgba(12,12,13,.85) 0%, rgba(12,12,13,.3) 50%, transparent 100%)" }}
            >
              <div className="p-4">
                <div className="font-mono text-[8.5px] tracking-[.15em] uppercase mb-[3px]" style={{ color: "var(--red)" }}>
                  {item.client}
                </div>
                <div className="text-[12px] font-semibold text-white leading-[1.3]">
                  {item.title}
                </div>
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[7.5px] tracking-[.1em] uppercase px-[7px] py-[2px] rounded-sm"
                      style={{ color: "rgba(255,255,255,.38)", border: "1px solid rgba(255,255,255,.14)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div
        className="mx-auto mt-12 flex items-center justify-between pt-6 flex-wrap gap-4"
        style={{ maxWidth: "var(--maxw)", borderTop: "1px solid var(--hair)" }}
      >
        <div className="font-mono text-[10.5px] tracking-[.12em] uppercase" style={{ color: "var(--grey)" }}>
          <strong style={{ color: "var(--ink)", fontWeight: 500 }}>{filteredCreatives.length} creatives shown</strong> · Instagram, LinkedIn & Facebook
        </div>
        <a
          href="#contact"
          className="inline-flex items-center gap-[9px] font-mono text-[10px] tracking-[.14em] uppercase px-5 py-[11px] bg-transparent transition-all duration-250 hover:bg-[var(--ink)] hover:text-white"
          style={{ color: "var(--ink)", border: "1px solid var(--ink)", borderRadius: 1 }}
        >
          Get social creatives for your brand
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
