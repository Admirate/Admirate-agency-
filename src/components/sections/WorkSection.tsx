"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { asset } from "@/lib/cdn";
import LineMask from "@/components/ui/line-mask";

type Project = {
  image: string;
  name: string;
  tags: string[];
  url: string;
};

const fallbackProjects: Project[] = [
  {
    image: asset("sportex 1.png"),
    name: "Hitex Sports Expo",
    tags: ["Social media", "Web Development"],
    url: "https://sportex.in/",
  },
  {
    image: asset("screencapture-patilgroup-netlify-app-2026-02-13-12_39_01 1.png"),
    name: "Patil Group",
    tags: ["Logo Refinement", "Web Development"],
    url: "https://patilgroup.com/",
  },
  {
    image: asset("Home 1.png"),
    name: "Hope Trust",
    tags: ["Social media", "Web Development"],
    url: "https://hopetrustindia.com/",
  },
  {
    image: asset("south glass 1.png"),
    name: "South Glass",
    tags: ["Web Development"],
    url: "https://southglass.in/",
  },
  {
    image: asset("oss website.png"),
    name: "Our Sacred Space",
    tags: ["Web Development"],
    url: "https://oursacredspace.in/",
  },
];

const ProjectRow = ({ project, index }: { project: Project; index: number }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const isEven = index % 2 === 0;

  return (
    <motion.a
      ref={ref}
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="group block border-t border-white/10 py-10 sm:py-14"
    >
      <div className="grid grid-cols-12 gap-6 items-center">
        {/* Index + name */}
        <div className={`col-span-12 lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
          <div className="flex items-baseline gap-5">
            <span className="eyebrow text-white/40 shrink-0">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="h-display text-[clamp(1.75rem,4.5vw,4rem)] text-white">
              <span className="font-editorial italic font-normal">
                {project.name}
              </span>
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-5 pl-12 sm:pl-16">
            {project.tags.map((tag, i) => (
              <span key={tag} className="flex items-center gap-3 text-xs tracking-[0.18em] uppercase text-white/60">
                {i > 0 && <span className="text-[var(--c-red)]">·</span>}
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Image — browser frame mockup */}
        <div className={`col-span-12 lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
          <motion.div
            style={{ y: imageY }}
            className="relative w-full rounded-xl overflow-hidden bg-white shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 h-9 bg-neutral-100 border-b border-neutral-200">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              <div className="ml-4 flex-1 max-w-[280px] truncate rounded-md bg-white px-3 py-1 text-[10px] sm:text-xs text-neutral-500 font-mono">
                {project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </div>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-[var(--c-red)] animate-pulse-dot" />
            </div>

            {/* Screenshot — full top visible */}
            <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />

              <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 text-[11px] tracking-[0.18em] uppercase text-[var(--c-ink)] opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                View case
                <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                  ↗
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.a>
  );
};

const WorkSection = () => {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (data && data.length > 0) {
          setProjects(
            data.map((p: { image_url: string; title: string; tags: string[]; external_url: string }) => ({
              image: p.image_url,
              name: p.title,
              tags: p.tags,
              url: p.external_url,
            }))
          );
        }
      } catch {
        // Silently fall back to hardcoded projects
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      id="work"
      className="relative py-28 sm:py-40 bg-[var(--c-ink)] text-white bg-grain"
      aria-label="Selected work"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16 sm:mb-24">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="block w-10 h-px bg-white/40" />
              <span className="eyebrow text-white/60">Selected work — 04</span>
            </div>
            <h2 className="h-display text-[clamp(2.5rem,8vw,7rem)] text-white">
              <LineMask as="span" className="block">
                Work built for
              </LineMask>
              <LineMask as="span" delay={120} className="block">
                <span className="font-editorial italic font-normal text-[var(--c-red)]">
                  real outcomes.
                </span>
              </LineMask>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-md">
              A selection of websites, campaigns, social, and brand systems
              shipped for businesses that take growth seriously.
            </p>
          </div>
        </div>

        {/* Project list */}
        <div>
          {projects.map((p, i) => (
            <ProjectRow key={`${p.name}-${i}`} project={p} index={i} />
          ))}
          <div className="border-t border-white/10" />
        </div>

        <div className="mt-16 sm:mt-20 flex items-center justify-between">
          <span className="eyebrow text-white/40">
            Showing {projects.length} of {projects.length}
          </span>
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 text-sm font-semibold tracking-wide text-white"
          >
            <span className="link-underline">Start your project</span>
            <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
