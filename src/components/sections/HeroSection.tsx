"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import LineMask from "@/components/ui/line-mask";
import { video } from "@/lib/cdn";

type Float = {
  src: string;
  label: string;
  positionClass: string;
  depth: number;
  rotate: number;
  delay: number;
};

const floats: Float[] = [
  {
    src: video("asset1.mp4"),
    label: "Visual Identity",
    positionClass:
      "top-[14%] left-[2%] xl:left-[3%] w-[170px] h-[215px] xl:w-[200px] xl:h-[250px] 2xl:w-[220px] 2xl:h-[275px]",
    depth: 18,
    rotate: -5,
    delay: 0.6,
  },
  {
    src: video("asset 2.mp4"),
    label: "Social Media",
    positionClass:
      "top-[14%] right-[2%] xl:right-[3%] w-[170px] h-[215px] xl:w-[200px] xl:h-[250px] 2xl:w-[220px] 2xl:h-[275px]",
    depth: -16,
    rotate: 4,
    delay: 0.72,
  },
  {
    src: video("asset 3.mp4"),
    label: "Web",
    positionClass:
      "bottom-[14%] left-[2%] xl:left-[3%] w-[170px] h-[215px] xl:w-[200px] xl:h-[250px] 2xl:w-[220px] 2xl:h-[275px]",
    depth: 20,
    rotate: 6,
    delay: 0.84,
  },
  {
    src: video("asset 4.mp4"),
    label: "Branding",
    positionClass:
      "bottom-[14%] right-[2%] xl:right-[3%] w-[170px] h-[215px] xl:w-[200px] xl:h-[250px] 2xl:w-[220px] 2xl:h-[275px]",
    depth: -18,
    rotate: -4,
    delay: 0.96,
  },
];

const FloatThumb = ({
  float,
  mouseX,
  mouseY,
}: {
  float: Float;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) => {
  const x = useTransform(mouseX, [-0.5, 0.5], [-float.depth, float.depth]);
  const y = useTransform(mouseY, [-0.5, 0.5], [-float.depth, float.depth]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, delay: float.delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ x, y, rotate: float.rotate }}
      className={`absolute rounded-2xl overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.35)] ring-1 ring-black/5 will-change-transform ${float.positionClass}`}
    >
      <video
        src={float.src}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
        <span className="text-[10px] uppercase tracking-[0.18em] text-white/90 font-semibold">
          {float.label}
        </span>
      </div>
    </motion.div>
  );
};

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const sx = useSpring(mouseX, { stiffness: 80, damping: 20, mass: 0.6 });
  const sy = useSpring(mouseY, { stiffness: 80, damping: 20, mass: 0.6 });
  const glowLeft = useTransform(sx, [-0.5, 0.5], ["20%", "60%"]);
  const glowTop = useTransform(sy, [-0.5, 0.5], ["10%", "60%"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative h-svh w-full overflow-hidden bg-[var(--c-paper)] bg-grain"
      aria-label="Hero"
    >
      {/* Soft red ambient glow that follows the cursor */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -z-0 hidden md:block"
        style={{
          width: 720,
          height: 720,
          left: glowLeft,
          top: glowTop,
          background:
            "radial-gradient(circle at center, rgba(255,13,13,0.18), rgba(255,13,13,0.05) 35%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Floating thumbnails (xl+ only, around perimeter) */}
      <div aria-hidden="true" className="absolute inset-0 hidden xl:block">
        {floats.map((f) => (
          <FloatThumb key={f.label} float={f} mouseX={sx} mouseY={sy} />
        ))}
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Top meta row */}
        <div className="flex items-start justify-end px-6 sm:px-10 lg:px-16 pt-24 sm:pt-28 lg:pt-32 max-w-[1440px] w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden md:flex items-center gap-3 eyebrow"
          >
            <span>(01 / 09)</span>
          </motion.div>
        </div>

        {/* Centered headline block */}
        <div className="flex-1 flex flex-col items-center justify-center text-center min-h-0">
          <h1 className="h-display text-[clamp(2.75rem,9vw,8.5rem)] text-[var(--c-ink)] px-6 sm:px-10 lg:px-16">
            <LineMask as="span" className="block">
              Advertising,
            </LineMask>
            <LineMask as="span" delay={140} className="block">
              done the{" "}
              <span className="font-editorial italic font-normal text-[var(--c-red)]">
                right way.
              </span>
            </LineMask>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-8 max-w-xl text-base sm:text-lg text-[var(--c-mute)] leading-relaxed px-6 sm:px-10 lg:px-16"
          >
            We design brands, build websites, produce content, and run campaigns
            engineered to move business — not just metrics.
          </motion.p>
        </div>

        {/* Marquee — pinned to bottom of hero, never clipped */}
        <div className="shrink-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.1 }}
            className="relative w-full border-t border-b border-[var(--c-line)] py-3 sm:py-4 overflow-hidden"
          >
            <div className="flex w-max animate-marquee-slow whitespace-nowrap">
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={idx} className="flex items-center">
                  {[
                    "Branding",
                    "Web Development",
                    "Social Media",
                    "Video & Film",
                    "Creative Strategy",
                    "Campaigns",
                    "Editorial Design",
                  ].map((w) => (
                    <span key={`${idx}-${w}`} className="flex items-center">
                      <span className="text-[clamp(1.25rem,3.5vw,2.5rem)] font-editorial italic px-6 sm:px-8 text-[var(--c-ink)]">
                        {w}
                      </span>
                      <span className="text-[var(--c-red)] text-xl">✦</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
