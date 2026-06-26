"use client";

import { motion } from "framer-motion";
import { video } from "@/lib/cdn";

const ShowreelSection = () => {
  return (
    <section
      className="relative bg-[var(--c-ink)] text-white"
      aria-label="Showreel"
    >
      {/* Top meta bar */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-20 sm:pt-28 pb-10 flex items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <span className="block w-10 h-px bg-white/40" />
            <span className="eyebrow text-white/60">Showreel — 2026</span>
          </div>
          <h2 className="h-display text-[clamp(1.75rem,4.5vw,4rem)] text-white">
            <span className="font-editorial italic font-normal">
              A year in motion.
            </span>
          </h2>
        </div>
        <span className="eyebrow text-white/40 hidden sm:inline">
          01:42 · MUTED · CC ↓
        </span>
      </div>

      {/* Video */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full overflow-hidden"
      >
        <video
          src={video("finalvideotoupdateonnewdesign.mp4")}
          muted
          loop
          playsInline
          autoPlay
          className="w-full h-auto block"
        />
      </motion.div>

      {/* Bottom meta */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-10 flex items-start justify-between gap-6">
        <span className="eyebrow text-white/40">
          Direction · Design · Production — In-house
        </span>
        <span className="eyebrow text-white/40">
          ADMIRATE Studio
        </span>
      </div>
    </section>
  );
};

export default ShowreelSection;
