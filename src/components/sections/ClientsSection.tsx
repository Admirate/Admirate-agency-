"use client";

import { motion } from "framer-motion";
import { clientLogo } from "@/lib/cdn";
import LineMask from "@/components/ui/line-mask";

const clients = [
  { name: "AA", logo: clientLogo("AA Logo.webp") },
  { name: "Avvent Global", logo: clientLogo("avvent global logo.webp") },
  { name: "Seniors For Change", logo: clientLogo("EUI LOGO.webp") },
  { name: "Hitex", logo: clientLogo("hitex logo.webp") },
  { name: "Hope Trust", logo: clientLogo("hopetrust logo.webp") },
  { name: "OSS", logo: clientLogo("osslogo.png") },
  { name: "Patil Group", logo: clientLogo("patilgroup logo.webp") },
  { name: "South Glass", logo: clientLogo("southglass logo.webp") },
  { name: "Valucor Packaging", logo: clientLogo("valucorlogogogo.png") },
];

const Marquee = ({
  reverse = false,
  speedClass = "animate-marquee",
}: {
  reverse?: boolean;
  speedClass?: string;
}) => (
  <div className="relative w-full overflow-hidden">
    <div
      className={`flex w-max ${speedClass}`}
      style={{ animationDirection: reverse ? "reverse" : "normal" }}
    >
      {[0, 1].map((set) => (
        <div key={set} className="flex shrink-0 items-center">
          {clients.map((client, i) => (
            <div
              key={`${set}-${i}`}
              className="flex items-center justify-center px-10 sm:px-14 lg:px-16"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="h-12 sm:h-14 lg:h-16 max-w-[170px] object-contain transition-transform duration-500 hover:scale-110"
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const ClientsSection = () => {
  return (
    <section
      className="relative py-24 sm:py-32 bg-[var(--c-paper)] border-y border-[var(--c-line)]"
      aria-label="Clients"
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 mb-14 sm:mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-10 h-px bg-[var(--c-ink)]" />
              <span className="eyebrow">Selected clients · 2018 — 2026</span>
            </div>
            <h2 className="h-display text-[clamp(2rem,6vw,5rem)] text-[var(--c-ink)]">
              <LineMask as="span" className="block">
                Trusted by brands
              </LineMask>
              <LineMask as="span" delay={120} className="block">
                <span className="font-editorial italic font-normal">
                  that move{" "}
                </span>
                <span className="font-editorial italic font-normal text-[var(--c-red)]">
                  carefully.
                </span>
              </LineMask>
            </h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-8 lg:items-end"
          >
            <div>
              <p className="text-6xl sm:text-7xl font-lato font-black tracking-tighter text-[var(--c-ink)] leading-none">
                30<span className="text-[var(--c-red)]">+</span>
              </p>
              <p className="eyebrow mt-2 text-[var(--c-mute)]">
                Brands served
              </p>
            </div>
            <p className="max-w-xs text-base text-[var(--c-ink)]/70 leading-relaxed lg:text-right">
              From early-stage challengers to established institutions — built
              with the same standard of care.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="space-y-8">
        <Marquee speedClass="animate-marquee" />
        <Marquee reverse speedClass="animate-marquee-slow" />
      </div>
    </section>
  );
};

export default ClientsSection;
