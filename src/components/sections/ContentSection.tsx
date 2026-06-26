"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import Folder from "@/components/ui/Folder";
import LineMask from "@/components/ui/line-mask";
import { asset } from "@/lib/cdn";

const ADMIRATE_LOGO = asset("admirate logo.webp");

const posts = [
  { image: asset("southglass creative.png"), alt: "South Glass — Makar Sankranti" },
  { image: asset("hopetrust creative.png"), alt: "Hope Trust — It's Nothing campaign" },
  { image: asset("sportex creativer.png"), alt: "HITEX SportExpo" },
];

const InstagramCard = ({
  post,
  index,
  isCenter,
}: {
  post: (typeof posts)[number];
  index: number;
  isCenter: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    className={`bg-white rounded-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)] overflow-hidden w-[280px] sm:w-[320px] lg:w-[380px] flex-shrink-0 ring-1 ring-[var(--c-line)] ${
      isCenter ? "lg:scale-110 lg:z-10" : "lg:scale-100"
    }`}
  >
    <div className="flex items-center justify-between px-3 py-2.5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-gray-200 flex items-center justify-center p-1 relative">
          <Image src={ADMIRATE_LOGO} alt="Admirate" width={32} height={32} className="object-contain w-full h-full" />
        </div>
        <span className="text-xs font-semibold text-gray-900">Admirate</span>
      </div>
      <span className="text-[10px] font-semibold text-white bg-[var(--c-red)] rounded px-2.5 py-0.5 uppercase tracking-wide">
        Follow
      </span>
    </div>

    <div className="relative w-full aspect-square bg-gray-100">
      <Image
        src={post.image}
        alt={post.alt}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 280px, 380px"
      />
    </div>

    <div className="px-3 pt-2.5 pb-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3.5">
          <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
          <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </div>
        <svg className="w-5 h-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
        </svg>
      </div>
      <div className="flex items-center gap-1.5">
        <svg className="w-3 h-3 text-[var(--c-red)]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
        <span className="text-xs text-gray-900 font-semibold">362 likes</span>
      </div>
    </div>
  </motion.div>
);

const ContentSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const w = el.querySelector("div")?.clientWidth || 280;
    el.scrollBy({ left: dir === "left" ? -(w + 24) : w + 24, behavior: "smooth" });
    setTimeout(checkScroll, 400);
  };

  return (
    <section
      className="relative py-28 sm:py-40 bg-[var(--c-paper)] overflow-hidden"
      aria-label="Creative playground"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16 sm:mb-24">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-8">
              <span className="block w-10 h-px bg-[var(--c-ink)]" />
              <span className="eyebrow">Creative playground — 07</span>
            </div>
            <h2 className="h-display text-[clamp(2.5rem,8vw,7rem)] text-[var(--c-ink)]">
              <LineMask as="span" className="block">
                Made for the
              </LineMask>
              <LineMask as="span" delay={120} className="block">
                <span className="font-editorial italic font-normal text-[var(--c-red)]">
                  feed.
                </span>
              </LineMask>
            </h2>
          </div>
          <div className="lg:col-span-4">
            <p className="text-base sm:text-lg text-[var(--c-ink)]/70 leading-relaxed max-w-md">
              Social posts, reels, and creative campaigns — designed to live
              natively where audiences already spend their time.
            </p>
          </div>
        </div>

        {/* Cards row */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            disabled={!canLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none lg:hidden"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center disabled:opacity-0 disabled:pointer-events-none lg:hidden"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 lg:gap-10 overflow-x-auto lg:overflow-visible scrollbar-hide snap-x snap-mandatory lg:snap-none px-2 lg:px-0 items-center scroll-smooth lg:justify-center"
          >
            {posts.map((post, i) => (
              <InstagramCard key={i} post={post} index={i} isCenter={i === 1} />
            ))}
          </div>
        </div>

        {/* Folder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mt-44 sm:mt-56"
        >
          <div className="flex items-center gap-3 mb-12">
            <span className="block w-10 h-px bg-[var(--c-ink)]" />
            <span className="eyebrow">Inside the studio</span>
          </div>
          <Folder
            color="#FF0D0D"
            size={2}
            className="sm:scale-[1.4] lg:scale-[1.7]"
            items={[
              <Image
                key="creative-1"
                src="https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/creatives/1@72x-100.jpg"
                alt="Admirate creative 1"
                fill
                className="object-cover"
              />,
              <Image
                key="creative-2"
                src="https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/creatives/3a.jpg"
                alt="Admirate creative 2"
                fill
                className="object-cover"
              />,
              <Image
                key="creative-3"
                src="https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/creatives/5.jpg"
                alt="Admirate creative 3"
                fill
                className="object-cover"
              />,
            ]}
          />
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-20 sm:mt-24"
        >
          <p className="font-editorial italic text-2xl sm:text-3xl text-[var(--c-ink)]/60 mb-8">
            More inside the folder.
          </p>
          <MagneticButton>
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-3 rounded-full bg-[var(--c-ink)] text-[var(--c-paper)] px-8 py-4 text-sm font-semibold tracking-wide overflow-hidden"
              aria-label="Connect with us"
            >
              <span className="relative z-10">Connect with us</span>
              <span className="relative z-10 inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                →
              </span>
              <span className="absolute inset-0 translate-y-full bg-[var(--c-red)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
};

export default ContentSection;
