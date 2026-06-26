"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
} from "framer-motion";
import { asset } from "@/lib/cdn";
import LineMask from "@/components/ui/line-mask";

const LOGO_007 = asset("007 logo.png");
const STATS_007 = asset("007 stats.png");

const posters = [
  { src: asset("skyfall.png"), alt: "Skyfall — Directed by Sam Mendes" },
  { src: asset("die anopther day.png"), alt: "Die Another Day — Pierce Brosnan" },
  { src: asset("skyfall 2.png"), alt: "Skyfall 007" },
];

const CreationSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const skewVelocity = useTransform(smoothVelocity, [-1000, 1000], [4, -4]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[var(--c-ink)] text-white bg-grain"
      aria-label="Self-initiated work"
    >
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-28 sm:py-40">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16 sm:mb-20">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="block w-10 h-px bg-white/40" />
              <span className="eyebrow text-white/60">In-house — 08</span>
            </div>
            <h2 className="h-display text-[clamp(2.5rem,8vw,7rem)] text-white">
              <LineMask as="span" className="block">
                Our own
              </LineMask>
              <LineMask as="span" delay={120} className="block">
                <span className="font-editorial italic font-normal text-[var(--c-red)]">
                  obsession.
                </span>
              </LineMask>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-md">
              Self-initiated work, kept close to the craft — like{" "}
              <span className="font-editorial italic">@the007page</span>, our
              long-running tribute to one of cinema&apos;s most considered
              brands.
            </p>
          </div>
        </div>

        {/* Logo + stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-14 sm:mb-20"
        >
          <div className="w-[150px] sm:w-[200px] md:w-[240px] flex-shrink-0">
            <Image
              src={LOGO_007}
              alt="007"
              width={300}
              height={150}
              className="w-full h-auto object-contain invert"
            />
          </div>
          <div className="w-[240px] sm:w-[300px] md:w-[360px] flex-shrink-0">
            <Image
              src={STATS_007}
              alt="@the007page — 538 posts · 44.2K followers"
              width={420}
              height={160}
              className="w-full h-auto object-contain"
            />
          </div>
        </motion.div>

        {/* Poster grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 max-w-5xl mx-auto">
          {posters.map((poster, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.8,
                delay: 0.15 + i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ skewY: skewVelocity }}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden group origin-bottom"
            >
              <Image
                src={poster.src}
                alt={poster.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>

        {/* Bottom credit */}
        <div className="mt-16 sm:mt-20 flex items-center justify-between gap-6">
          <span className="eyebrow text-white/40">
            @the007page · A passion project
          </span>
          <a
            href="https://instagram.com/the007page"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 text-sm font-semibold tracking-wide text-white"
          >
            <span className="link-underline">View on Instagram</span>
            <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
              ↗
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CreationSection;
