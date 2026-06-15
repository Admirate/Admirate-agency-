"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from "framer-motion";
import { clientLogo } from "@/lib/cdn";

// A simple wrap function replacing @motionone/utils
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const clients = [
  { name: "AA", logo: clientLogo("AA Logo.webp") },
  { name: "Avvent Global", logo: clientLogo("avvent global logo.webp") },
  { name: "Seniors For Change", logo: clientLogo("EUI LOGO.webp") },
  { name: "Hitex", logo: clientLogo("hitex logo.webp") },
  { name: "Hope Trust", logo: clientLogo("hopetrust logo.webp") },
  { name: "Patil Group", logo: clientLogo("patilgroup logo.webp") },
  { name: "Reroot Space", logo: clientLogo("reroot logo.webp") },
  { name: "South Glass", logo: clientLogo("southglass logo.webp") },
  { name: "Valucor Packaging", logo: clientLogo("VALUCOR-LOGO 1.webp") },
  { name: "Zythum", logo: clientLogo("zythum logo.webp") },
];

function VelocityMarquee() {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -70, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * -1 * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="relative max-w-[1000px] mx-auto overflow-hidden">
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {/* We need enough duplicates to fill the space and allow wrap seamlessly */}
        {[1, 2, 3, 4].map((setIndex) => (
          <div key={setIndex} className="flex shrink-0">
            {clients.map((client, i) => (
              <div
                key={`b-${setIndex}-${i}`}
                className="flex-shrink-0 mx-3 sm:mx-8 flex items-center justify-center h-16 sm:h-16"
              >
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={120}
                  height={60}
                  className="h-16 sm:h-16 max-w-[140px] sm:max-w-[170px] object-contain"
                />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function ClientsSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-16 sm:py-20"
    >
      <p className="text-center text-sm sm:text-base text-gray-500 font-inter italic mb-10 sm:mb-14">
        Design projects created for top brands including
      </p>

      <VelocityMarquee />
    </motion.section>
  );
}
