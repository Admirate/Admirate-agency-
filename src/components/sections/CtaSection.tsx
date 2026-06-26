"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import LineMask from "@/components/ui/line-mask";
import { asset } from "@/lib/cdn";

const CtaSection = () => {
  return (
    <section
      className="relative py-28 sm:py-40 bg-[var(--c-paper)] overflow-hidden"
      aria-label="Intro call CTA"
    >
      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="relative flex items-center justify-center min-h-[420px] sm:min-h-[520px]">
          {/* Left laptop */}
          <motion.div
            initial={{ opacity: 0, x: -80, rotate: -14 }}
            whileInView={{ opacity: 0.9, x: 0, rotate: -8 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[25%] lg:-translate-x-[18%] w-[340px] lg:w-[480px] pointer-events-none"
          >
            <Image
              src={asset("left laptop.webp")}
              alt=""
              width={500}
              height={350}
              className="w-full h-auto"
            />
          </motion.div>

          {/* Right laptop */}
          <motion.div
            initial={{ opacity: 0, x: 80, rotate: 14 }}
            whileInView={{ opacity: 0.9, x: 0, rotate: 8 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-[25%] lg:translate-x-[18%] w-[340px] lg:w-[480px] pointer-events-none"
          >
            <Image
              src={asset("right laptop.webp")}
              alt=""
              width={500}
              height={350}
              className="w-full h-auto"
            />
          </motion.div>

          {/* Center editorial CTA */}
          <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
              className="flex items-center justify-center gap-3 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--c-red)] animate-pulse-dot" />
              <span className="eyebrow">Free 30-minute intro call</span>
            </motion.div>

            <h2 className="h-display text-[clamp(2.25rem,7vw,6rem)] text-[var(--c-ink)] mb-8">
              <LineMask as="span" className="block">
                Tell us what
              </LineMask>
              <LineMask as="span" delay={140} className="block">
                <span className="font-editorial italic font-normal text-[var(--c-red)]">
                  you&apos;re building.
                </span>
              </LineMask>
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg sm:text-xl text-[var(--c-ink)]/70 leading-relaxed mb-10"
            >
              We bring clarity, direction, and design that holds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8"
            >
              <MagneticButton>
                <a
                  href="#contact"
                  className="group relative inline-flex items-center gap-3 rounded-full bg-[var(--c-ink)] text-[var(--c-paper)] px-8 py-4 text-sm font-semibold tracking-wide overflow-hidden"
                >
                  <span className="relative z-10">Book intro call</span>
                  <span className="relative z-10 inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                    →
                  </span>
                  <span className="absolute inset-0 translate-y-full bg-[var(--c-red)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                </a>
              </MagneticButton>
              <a
                href="https://wa.me/918374494954"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold tracking-wide text-[var(--c-ink)] link-underline"
              >
                or WhatsApp us
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
