"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useVelocity, useSpring, useTransform } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import { video } from "@/lib/cdn";

const cards = [
  {
    video: video("asset1.mp4"),
    title: "Visual Identity",
    description: "Built to be seen—simple, consistent & recognizable.",
  },
  {
    video: video("asset 2.mp4"),
    title: "Social Media",
    description: "System-led content visuals, reels & posts built with intent.",
  },
  {
    video: video("asset 3.mp4"),
    title: "Web Development",
    description: "System-led content visuals, reels & posts built with intent.",
  },
  {
    video: video("asset 4.mp4"),
    title: "Branding",
    description: "Crafting identities that stand out and tell your story.",
  },
];

export default function HeroSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Skew on scroll
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const skewVelocity = useTransform(smoothVelocity, [-1000, 1000], [4, -4]);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.clientWidth || 300;
    const scrollAmount = cardWidth + 16;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 400);
  };

  return (
    <section className="pt-28 sm:pt-32 pb-10 px-6 sm:px-10 lg:px-16 max-w-[1440px] mx-auto">
      {/* Top content row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10 sm:mb-14"
      >
        <h1 className="text-4xl sm:text-5xl md:text-[64px] font-bold leading-[108.21%] tracking-tight font-lato text-black">
          Advertising,
          <br />
          done the <span className="text-red-600">right way</span>
        </h1>

        <MagneticButton className="self-start lg:self-auto">
          <a
            href="#contact"
            className="group flex items-center gap-4 lg:gap-6"
          >
            <div className="flex flex-col items-end">
              <span className="text-xl sm:text-2xl lg:text-[36px] font-normal font-lato leading-[108.21%] text-black pb-1">
                Book a Free Intro Call
              </span>
              <div className="relative pb-2">
                <span className="text-xl sm:text-2xl lg:text-[36px] font-normal font-lato leading-[108.21%] text-black">
                  WhatsApp Us
                </span>
                {/* Red dot and pill underline */}
                <div className="absolute bottom-0 right-0 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-600" />
                  <span className="w-10 sm:w-16 h-1.5 sm:h-2 rounded-full bg-red-600 transition-all duration-300 group-hover:w-16 sm:group-hover:w-20" />
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
              <svg
                className="absolute w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[150%]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <svg
                className="absolute w-full h-full -translate-x-[150%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </MagneticButton>
      </motion.div>

      {/* Video carousel */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition disabled:opacity-0 disabled:pointer-events-none"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition disabled:opacity-0 disabled:pointer-events-none"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          data-cursor="drag"
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
        >
          {cards.map((card, i) => (
            <motion.div
              key={i}
              
              style={{ skewX: skewVelocity }}
              className="relative flex-shrink-0 w-[300px] sm:w-[340px] lg:w-[363px] h-[400px] sm:h-[430px] lg:h-[449px] rounded-[24px] overflow-hidden snap-start group bg-[#D9D9D9] cursor-pointer origin-bottom"
            >
              <video
                src={card.video}
                muted
                loop
                playsInline
                autoPlay
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Dark overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-400" />

              {/* Plus icon → X icon on hover */}
              <div className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center z-10">
                {/* Plus (default) */}
                <svg
                  className="w-6 h-6 text-gray-900/70 group-hover:opacity-0 group-hover:rotate-45 transition-all duration-300 absolute"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {/* X (on hover) */}
                <svg
                  className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 absolute"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              {/* Text overlay on hover */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                <h3 className="text-white text-xl sm:text-2xl font-bold font-integral mb-2">
                  {card.title}
                </h3>
                <p className="text-white/80 text-sm font-inter leading-relaxed">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
