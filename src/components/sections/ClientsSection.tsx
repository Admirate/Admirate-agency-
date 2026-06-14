"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const clients = [
  { name: "AA", logo: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/client%20logos/AA%20Logo.webp" },
  { name: "Avvent Global", logo: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/client%20logos/avvent%20global%20logo.webp" },
  { name: "Seniors For Change", logo: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/client%20logos/EUI%20LOGO.webp" },
  { name: "Hitex", logo: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/client%20logos/hitex%20logo.webp" },
  { name: "Hope Trust", logo: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/client%20logos/hopetrust%20logo.webp" },
  { name: "Patil Group", logo: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/client%20logos/patilgroup%20logo.webp" },
  { name: "Reroot Space", logo: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/client%20logos/reroot%20logo.webp" },
  { name: "South Glass", logo: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/client%20logos/southglass%20logo.webp" },
  { name: "Valucor Packaging", logo: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/client%20logos/VALUCOR-LOGO%201.webp" },
  { name: "Zythum", logo: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/client%20logos/zythum%20logo.webp" },
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
