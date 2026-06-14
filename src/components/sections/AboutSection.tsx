"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { asset } from "@/lib/cdn";

const features = [
  {
    icon: asset("icon1.webp"),
    title: "End to end thinking",
    description: "From first idea to final output, handled with intent.",
  },
  {
    icon: asset("icon2.webp"),
    title: "Long term partnerships",
    description: "Not one off work, but relationships that continue.",
  },
  {
    icon: asset("icon3.webp"),
    title: "Chosen by brands",
    description: "Teams that trusted us to build how they are seen.",
  },
  {
    icon: asset("icon4.webp"),
    title: "Nothing first try",
    description: "Every direction explored before the final call.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="text-sm font-inter text-gray-500 mb-4 block">
            • Who we are
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-[48px] font-bold font-lato leading-[108.21%] text-black text-center mb-4">
            Where strategy meets
            <br />
            design that actually performs
          </h2>
          <p className="text-black font-lato font-normal text-lg sm:text-[24px] leading-[108.21%]">
            From social to websites, everything built with intent
          </p>
        </motion.div>

        {/* Video block */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[1309px] mx-auto h-[300px] sm:h-[400px] lg:h-[518px] rounded-none mb-16 sm:mb-20 overflow-hidden bg-[#D9D9D9]"
        >
          <video
            src={asset("admirate logo animated.mp4")}
            muted
            loop
            playsInline
            autoPlay
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="border-l border-gray-200 pl-6"
            >
              <div className="mb-5 h-14 w-14 relative">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={56}
                  height={56}
                  className="object-contain"
                />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-[32px] font-bold font-lato leading-[108.21%] text-black mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base lg:text-[24px] font-normal font-lato leading-[108.21%] text-black">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
