"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { asset } from "@/lib/cdn";
import HoverImageReveal from "@/components/ui/HoverImageReveal";

type Project = {
  image: string;
  name: string;
  tags: string[];
  url: string;
};

const fallbackProjects: Project[] = [
  {
    image: asset("sportex 1.png"),
    name: "Hitex Sports expo",
    tags: ["Social media", "Web Development"],
    url: "https://sportex.in/",
  },
  {
    image: asset("screencapture-patilgroup-netlify-app-2026-02-13-12_39_01 1.png"),
    name: "Patil group",
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

export default function WorkSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (!res.ok) return;

        const data = await res.json();
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
    };

    fetchProjects();
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"]
  });

  const backgroundColor = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], ["#ffffff", "#0a0a0a", "#0a0a0a", "#ffffff"]);
  const textColor = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], ["#000000", "#ffffff", "#ffffff", "#000000"]);
  const subtitleColor = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], ["#6b7280", "#a1a1aa", "#a1a1aa", "#6b7280"]);
  const borderColor = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], ["#f3f4f6", "#27272a", "#27272a", "#f3f4f6"]);

  return (
    <motion.section 
      id="work" 
      ref={containerRef}
      style={{ backgroundColor, color: textColor }}
      className="py-20 sm:py-28"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 sm:mb-16"
        >
          <motion.span style={{ color: subtitleColor }} className="text-base sm:text-[20px] font-normal font-lato leading-[108.21%] mb-4 block">
            • Our Work
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-[48px] font-bold font-lato leading-[108.21%] mb-4">
            Work built around real business needs.
          </h2>
          <motion.p style={{ color: subtitleColor }} className="font-lato font-normal text-base sm:text-[20px] leading-[108.21%]">
            A selection of websites, campaigns, social media, videos, and brand assets created for growing businesses.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((project, i) => (
            <motion.a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className={`group cursor-pointer ${i === projects.length - 1 && projects.length % 2 !== 0 ? "md:col-span-2 md:mx-auto md:w-full md:max-w-[calc(50%-1rem)]" : ""}`}
            >
              <motion.div style={{ borderColor }} className="relative w-full aspect-[648/736] rounded-2xl overflow-hidden border bg-gray-100/5 mb-4">
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 ease-out">
                    <svg className="w-6 h-6 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-lato z-10 cursor-pointer">
                  <HoverImageReveal text={project.name} imageSrc={project.image} />
                </h3>
                <div className="flex gap-3">
                  {project.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      style={{ color: subtitleColor }}
                      className="text-xs sm:text-sm font-inter"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
