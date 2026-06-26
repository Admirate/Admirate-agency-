"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { asset } from "@/lib/cdn";
import LineMask from "@/components/ui/line-mask";

type Service = {
  number: string;
  title: string;
  italic?: string;
  description: string;
  capabilities: string[];
  media: { type: "image" | "video"; src: string };
};

const services: Service[] = [
  {
    number: "01",
    title: "Visual",
    italic: "Identity",
    description:
      "Brand systems built to last — logo, typography, voice, motion. Designed to stay recognizable as your business scales.",
    capabilities: ["Logo Design", "Brand System", "Guidelines", "Motion Identity"],
    media: { type: "image", src: asset("visual identity.webp") },
  },
  {
    number: "02",
    title: "Web",
    italic: "Development",
    description:
      "Fast, considered websites engineered for performance and conversion. Editorial design meets technical craft.",
    capabilities: ["Strategy", "Web Design", "Development", "Analytics"],
    media: { type: "image", src: asset("webdevelopment image.webp") },
  },
  {
    number: "03",
    title: "Social",
    italic: "Media",
    description:
      "System-led content that strengthens brand and supports business goals. Reels, posts, and creative campaigns built with intent.",
    capabilities: ["Content", "Reels", "Strategy", "Conversions"],
    media: { type: "image", src: asset("socail media image.webp") },
  },
  {
    number: "04",
    title: "Video",
    italic: "& Film",
    description:
      "Stories that capture attention and communicate clearly — from short-form social cuts to brand films.",
    capabilities: ["Shoots", "Reels", "Edits", "Direction"],
    media: {
      type: "image",
      src: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/website%20assets/asset5.webp",
    },
  },
  {
    number: "05",
    title: "Editorial",
    italic: "Design",
    description:
      "Brochures, decks, reports, and print designed with editorial discipline. Information rendered with intent.",
    capabilities: ["Brochures", "Decks", "Reports", "Print"],
    media: {
      type: "video",
      src: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/videos/finalvideo.mp4",
    },
  },
];

const ServicePanel = ({
  service,
  index,
}: {
  service: Service;
  index: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const mediaY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const numberY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="relative w-full flex items-center py-20 sm:py-28 lg:min-h-svh lg:py-32"
    >
      {/* Giant outline numeral */}
      <motion.span
        aria-hidden="true"
        style={{
          y: numberY,
          WebkitTextStroke: "1px rgba(10,10,10,0.07)",
          color: "transparent",
        }}
        className={`pointer-events-none absolute select-none font-lato font-black tracking-tighter leading-none ${
          isEven ? "left-[-2vw]" : "right-[-2vw]"
        } top-[8%] text-[34vw] sm:text-[26vw] lg:text-[22vw]`}
      >
        {service.number}
      </motion.span>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center">
          {/* Media */}
          <div className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
            <div className="relative w-full aspect-[4/3] sm:aspect-[5/4] lg:aspect-[5/4] overflow-hidden rounded-3xl bg-[var(--c-paper-soft)]">
              <motion.div style={{ y: mediaY }} className="absolute inset-[-10%] w-[120%] h-[120%]">
                {service.media.type === "video" ? (
                  <video
                    src={service.media.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={service.media.src}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                )}
              </motion.div>

              {/* Corner marker */}
              <div className="absolute top-5 left-5 flex items-center gap-2 z-10">
                <span className="w-2 h-2 rounded-full bg-[var(--c-red)]" />
                <span className="eyebrow text-white drop-shadow-sm">
                  {service.number} · Service
                </span>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className={`lg:col-span-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-10 h-px bg-[var(--c-ink)]" />
              <span className="eyebrow">Capability {service.number}</span>
            </div>

            <h3 className="h-display text-[clamp(2.5rem,7vw,6rem)] text-[var(--c-ink)] mb-6">
              <LineMask as="span" className="block">
                {service.title}
              </LineMask>
              {service.italic && (
                <LineMask as="span" delay={120} className="block">
                  <span className="font-editorial italic font-normal">
                    {service.italic}
                  </span>
                </LineMask>
              )}
            </h3>

            <p className="text-lg sm:text-xl text-[var(--c-ink)]/75 leading-relaxed max-w-md mb-8">
              {service.description}
            </p>

            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {service.capabilities.map((c) => (
                <li
                  key={c}
                  className="flex items-center gap-2 text-sm text-[var(--c-ink)]"
                >
                  <span className="text-[var(--c-red)]">—</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesSection = () => {
  return (
    <section
      id="services"
      className="relative bg-[var(--c-paper)]"
      aria-label="Services"
    >
      {/* Sticky meta column */}
      <div className="sticky top-0 z-20 h-0">
        <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="absolute top-24 sm:top-28 left-6 sm:left-10 lg:left-16 hidden sm:flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--c-red)] animate-pulse-dot" />
            <span className="eyebrow">What we do — 05 capabilities</span>
          </div>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-32 sm:pt-44 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <h2 className="h-display text-[clamp(2.5rem,8vw,7.5rem)] text-[var(--c-ink)]">
              <LineMask as="span" className="block">
                Five disciplines.
              </LineMask>
              <LineMask as="span" delay={120} className="block">
                <span className="font-editorial italic font-normal text-[var(--c-red)]">
                  One studio.
                </span>
              </LineMask>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-base sm:text-lg text-[var(--c-ink)]/70 leading-relaxed">
              We operate end-to-end — strategy through execution — across the
              capabilities that move modern brands forward.
            </p>
          </div>
        </div>
      </div>

      {/* Service panels */}
      <div>
        {services.map((s, i) => (
          <ServicePanel key={s.number} service={s} index={i} />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
