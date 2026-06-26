"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { asset } from "@/lib/cdn";
import LineMask from "@/components/ui/line-mask";

const features = [
  {
    icon: asset("icon1.webp"),
    title: "End-to-end thinking",
    description: "From first idea to final output, handled with intent.",
  },
  {
    icon: asset("icon2.webp"),
    title: "Long-term partnerships",
    description: "Not one-off work, but relationships that compound.",
  },
  {
    icon: asset("icon3.webp"),
    title: "Chosen by brands",
    description: "Teams that trust us to shape how they're seen.",
  },
  {
    icon: asset("icon4.webp"),
    title: "Never first try",
    description: "Every direction explored before the final call.",
  },
];

const stats = [
  { value: 30, suffix: "+", label: "Brands shaped" },
  { value: 120, suffix: "+", label: "Projects shipped" },
  { value: 8, suffix: "y", label: "Years in craft" },
  { value: 100, suffix: "%", label: "In-house team" },
];

const Counter = ({
  value,
  suffix,
  duration = 1800,
}: {
  value: number;
  suffix: string;
  duration?: number;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {n}
      <span className="text-[var(--c-red)]">{suffix}</span>
    </span>
  );
};

const AboutSection = () => {
  return (
    <section
      id="about"
      className="relative py-28 sm:py-40 bg-[var(--c-paper)]"
      aria-label="About"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-12 sm:mb-16"
        >
          <span className="block w-10 h-px bg-[var(--c-ink)]" />
          <span className="eyebrow">Philosophy — 03</span>
        </motion.div>

        {/* Manifesto headline */}
        <h2 className="h-display text-[clamp(2.5rem,9vw,9rem)] text-[var(--c-ink)] mb-16 sm:mb-24 max-w-[1100px]">
          <LineMask as="span" className="block">
            Most agencies chase{" "}
          </LineMask>
          <LineMask as="span" delay={120} className="block">
            <span className="font-editorial italic font-normal">attention.</span>
          </LineMask>
          <LineMask as="span" delay={260} className="block">
            We engineer{" "}
          </LineMask>
          <LineMask as="span" delay={400} className="block">
            <span className="font-editorial italic font-normal text-[var(--c-red)]">
              outcomes.
            </span>
          </LineMask>
        </h2>

        {/* Two-column manifesto body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-24 sm:mb-32">
          <div className="lg:col-span-7 lg:col-start-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-xl sm:text-2xl text-[var(--c-ink)] leading-snug max-w-2xl"
            >
              From websites and social to campaigns and brand systems —
              every decision is made with one purpose: removing friction in the
              customer journey and helping businesses{" "}
              <span className="text-[var(--c-red)]">grow.</span>
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 text-base text-[var(--c-mute)] leading-relaxed max-w-xl"
            >
              Good design is important. Clear strategy is essential. Together
              they create work worth admiring — and worth investing in.
            </motion.p>
          </div>
        </div>

        {/* Stat counters */}
        <div className="border-y border-[var(--c-line)] grid grid-cols-2 lg:grid-cols-4 divide-x divide-[var(--c-line)] mb-24 sm:mb-32">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="py-10 px-6 sm:px-8"
            >
              <p className="text-5xl sm:text-6xl lg:text-7xl font-lato font-black tracking-tighter text-[var(--c-ink)] leading-none mb-3">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="eyebrow text-[var(--c-mute)]">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Brand video block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[16/9] sm:aspect-[16/8] rounded-3xl overflow-hidden bg-[var(--c-paper-soft)] mb-24 sm:mb-32"
        >
          <video
            src={asset("admirate logo animated.mp4")}
            muted
            loop
            playsInline
            autoPlay
            className="w-full h-full object-cover"
          />
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--c-red)] animate-pulse-dot" />
            <span className="eyebrow text-white drop-shadow">A film by ADMIRATE</span>
          </div>
        </motion.div>

        {/* Principles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="border-t border-[var(--c-ink)] pt-6 group"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="eyebrow text-[var(--c-mute)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="relative w-10 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
                  <Image
                    src={feature.icon}
                    alt=""
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-lato leading-tight text-[var(--c-ink)] mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-[var(--c-ink)]/65 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
