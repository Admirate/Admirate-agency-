"use client";

import { motion } from "framer-motion";
import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const SERVICES = [
  "Social media management.",
  "Websites that work, not just look good.",
  "Video production — brand films, campaigns, reels.",
  "Packaging design and product visuals.",
  "Digital advertising.",
  "Print advertising.",
  "Strategy, execution, and everything in between.",
];

export default function IntroContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const listGroupRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const listItemsRef = useRef<HTMLParagraphElement[]>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power1.out", duration: 1 },
      });

      // Intro sequence (same pattern as MainContent)
      tl.from(titleRef.current, { y: 24, autoAlpha: 0 })
        .from(
          listItemsRef.current,
          { y: 28, autoAlpha: 0, stagger: 0.12 },
          ">-0.05",
        )
        .add(() => {
          // Parallax after intro completes
          const base: gsap.plugins.ScrollTriggerInstanceVars = {
            trigger: heroRef.current as Element,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          };

          gsap.fromTo(
            titleRef.current,
            { y: -60 },
            {
              y: 80,
              ease: "none",
              immediateRender: false,
              scrollTrigger: { ...base },
            },
          );

          gsap.fromTo(
            listItemsRef.current,
            { y: -90 },
            {
              y: 120,
              ease: "none",
              immediateRender: false,
              scrollTrigger: { ...base },
            },
          );

          gsap.fromTo(
            bgRef.current,
            { y: -60 },
            {
              y: 140,
              ease: "none",
              immediateRender: false,
              scrollTrigger: { ...base },
            },
          );
        });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.main
      className="h-[100svh] min-h-[100svh] md:min-h-[80vh] md:h-[95vh] bg-white relative overflow-hidden py-0 md:py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div
        ref={heroRef}
        className="relative flex items-center justify-center min-h-screen "
      >
        {/* Background */}
        <div
          ref={bgRef}
          className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none"
        >
          <Image
            src="/line-wave.jpg"
            alt="Abstract line wave"
            fill
            className="object-cover blur-[0.4px]"
            priority
          />
        </div>

        {/* Content */}
        <motion.div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h1
            ref={titleRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-red-500 mb-10"
            style={{
              fontFamily: "'Integral CF', sans-serif",
              willChange: "transform",
            }}
          >
            ADVERTISING,
            <br />
            DONE THE RIGHT WAY.
          </h1>

          <div
            ref={listGroupRef}
            className="space-y-4"
            style={{ willChange: "transform" }}
          >
            {SERVICES.map((text, i) => (
              <p
                key={i}
                ref={(el) => {
                  if (el) listItemsRef.current[i] = el;
                }}
                className="text-lg sm:text-xl md:text-2xl text-gray-800 font-medium"
                style={{ fontFamily: "'Integral CF', sans-serif" }}
              >
                {text}
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.main>
  );
}
