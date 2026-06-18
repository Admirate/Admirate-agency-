"use client";

import { motion } from "framer-motion";
import { clientLogo } from "@/lib/cdn";

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

function AutoCarousel() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex animate-marquee">
        {[1, 2].map((setIndex) => (
          <div key={setIndex} className="flex shrink-0 items-center">
            {clients.map((client, i) => (
              <div
                key={`${setIndex}-${i}`}
                className="flex-shrink-0 mx-6 sm:mx-10 flex items-center justify-center h-16"
              >
                <img
                  src={client.logo}
                  alt={client.name}
                  className="h-14 max-w-[140px] sm:max-w-[170px] object-contain"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
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

      <AutoCarousel />
    </motion.section>
  );
}
