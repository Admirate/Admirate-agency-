"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { clientLogo } from "@/lib/cdn";

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

      {/* Infinite marquee */}
      <div className="relative max-w-[1000px] mx-auto overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {/* First set */}
          {clients.map((client, i) => (
            <div
              key={`a-${i}`}
              className="flex-shrink-0 mx-6 sm:mx-8 flex items-center justify-center h-12 sm:h-16"
            >
              <Image
                src={client.logo}
                alt={client.name}
                width={120}
                height={60}
                className="h-12 sm:h-16 max-w-[130px] sm:max-w-[170px] object-contain"
              />
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {clients.map((client, i) => (
            <div
              key={`b-${i}`}
              className="flex-shrink-0 mx-6 sm:mx-8 flex items-center justify-center h-12 sm:h-16"
            >
              <Image
                src={client.logo}
                alt={client.name}
                width={120}
                height={60}
                className="h-12 sm:h-16 max-w-[130px] sm:max-w-[170px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
