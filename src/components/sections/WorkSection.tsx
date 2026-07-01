"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  num: string;
  client: string;
  title: string;
  tags: string[];
  url: string;
  screenshot: string;
};

const fallbackProjects: Project[] = [
  {
    num: "01",
    client: "Hitex Sports Expo",
    title: "Sportex",
    tags: ["Web", "Brand", "Event"],
    url: "https://sportex.in",
    screenshot: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fsportex.in%2F?w=1200",
  },
  {
    num: "02",
    client: "Patil Group",
    title: "Patil Group",
    tags: ["Real Estate", "Web", "Campaign"],
    url: "https://patilgroup.com",
    screenshot: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fpatilgroup.com%2F?w=1200",
  },
  {
    num: "03",
    client: "Hope Trust India",
    title: "Hope Trust",
    tags: ["NGO", "Brand", "Digital"],
    url: "https://hopetrustindia.com",
    screenshot: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fhopetrustindia.com%2F?w=1200",
  },
  {
    num: "04",
    client: "South Glass",
    title: "South Glass",
    tags: ["Identity", "Web"],
    url: "https://southglass.in",
    screenshot: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fsouthglass.in%2F?w=1200",
  },
  {
    num: "05",
    client: "Our Sacred Space",
    title: "Sacred Space",
    tags: ["Wellness", "Brand", "Social"],
    url: "https://oursacredspace.in",
    screenshot: "https://s0.wp.com/mshots/v1/https%3A%2F%2Foursacredspace.in%2F?w=1200",
  },
];

export default function WorkSection() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.length > 0) {
          setProjects(
            data.map((p: { image_url: string; title: string; tags: string[]; external_url: string }, i: number) => ({
              num: String(i + 1).padStart(2, "0"),
              client: p.title,
              title: p.title,
              tags: p.tags,
              url: p.external_url,
              screenshot: p.image_url,
            }))
          );
        }
      } catch {
        // Fall back to hardcoded
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    document.querySelectorAll(".work-item").forEach((item, i) => {
      const speed = 0.03 + i * 0.015;
      const wLeft = item.querySelector(".w-left");
      if (wLeft) {
        gsap.to(wLeft, {
          yPercent: -(speed * 100),
          ease: "none",
          scrollTrigger: { trigger: item, start: "top bottom", end: "bottom top", scrub: true },
        });
      }
    });
  }, [projects]);

  return (
    <section
      id="work"
      style={{ padding: "clamp(80px,10vw,140px) var(--pad)", background: "var(--paper)" }}
    >
      <div className="mx-auto mb-14" style={{ maxWidth: "var(--maxw)" }}>
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="eyebrow fade-up">
              <span style={{ color: "var(--ink)" }}>03</span> Selected Work
            </div>
            <h2 className="h2 fade-up">Projects that moved the needle.</h2>
          </div>
        </div>
      </div>

      <div className="mx-auto" style={{ maxWidth: "var(--maxw)" }}>
        {projects.map((project, i) => (
          <a
            key={i}
            className="work-item fade-up relative flex items-center gap-6 py-7 overflow-hidden transition-[padding-left] duration-300 hover:pl-[10px] group"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              borderBottom: "1px solid var(--hair)",
              ...(i === 0 ? { borderTop: "1px solid var(--hair)" } : {}),
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="absolute top-0 right-0 h-full w-[55%] object-cover object-left-top z-0 pointer-events-none opacity-0 transition-opacity duration-[450ms] group-hover:opacity-[.15]"
              style={{
                maskImage: "linear-gradient(to right, transparent, #000 50%)",
                WebkitMaskImage: "linear-gradient(to right, transparent, #000 50%)",
              }}
              src={project.screenshot}
              alt=""
              loading="lazy"
              decoding="async"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />

            <span
              className="font-mono text-[10px] tracking-[.14em] z-[1] shrink-0 w-6 text-right"
              style={{ color: "var(--grey)" }}
            >
              {project.num}
            </span>

            <div className="w-left z-[1] flex-1 min-w-0" style={{ willChange: "transform" }}>
              <div className="font-mono text-[10px] tracking-[.14em] uppercase mb-1" style={{ color: "var(--red)" }}>
                {project.client}
              </div>
              <div
                className="font-disp font-extrabold leading-none"
                style={{
                  fontStretch: "expanded",
                  fontSize: "clamp(18px, 2.8vw, 36px)",
                  letterSpacing: "-.025em",
                }}
              >
                {project.title}
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[9.5px] tracking-[.1em] uppercase px-[10px] py-1 rounded-sm"
                    style={{ color: "var(--grey)", border: "1px solid var(--hair)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="z-[1] w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-250 group-hover:bg-[var(--ink)] group-hover:border-[var(--ink)]"
              style={{ border: "1px solid var(--hair)" }}
            >
              <svg
                className="w-[14px] h-[14px] transition-colors duration-250 group-hover:stroke-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--grey)"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
