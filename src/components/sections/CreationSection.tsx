"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const LOGO_007 =
  "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/website%20assets/007%20logo.png";
const STATS_007 =
  "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/website%20assets/007%20stats.png";

const posters = [
  {
    src: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/website%20assets/skyfall.png",
    alt: "Skyfall - Directed by Sam Mendes",
  },
  {
    src: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/website%20assets/die%20anopther%20day.png",
    alt: "Die Another Day - Starring Pierce Brosnan",
  },
  {
    src: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/website%20assets/skyfall%202.png",
    alt: "Skyfall 007",
  },
];

export default function CreationSection() {
  return (
    <section className="relative w-full min-h-auto lg:min-h-[969px] overflow-hidden bg-black">

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-16">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center text-white text-2xl sm:text-3xl md:text-[40px] font-bold font-lato leading-[108.21%] mb-6 sm:mb-8"
        >
          Our Own creation
        </motion.h2>

        {/* Logo + Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8 sm:mb-10"
        >
          {/* 007 Logo */}
          <div className="w-[130px] sm:w-[170px] md:w-[200px] flex-shrink-0">
            <Image
              src={LOGO_007}
              alt="007 Logo"
              width={300}
              height={150}
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Stats / Profile info */}
          <div className="w-[200px] sm:w-[260px] md:w-[300px] flex-shrink-0">
            <Image
              src={STATS_007}
              alt="the007page Instagram profile - 538 posts, 44.2K followers, 6 following"
              width={420}
              height={160}
              className="w-full h-auto object-contain"
            />
          </div>
        </motion.div>

        {/* Poster grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
          {posters.map((poster, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.7,
                delay: 0.2 + i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative aspect-[3/4] rounded-xl overflow-hidden group"
            >
              <Image
                src={poster.src}
                alt={poster.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
