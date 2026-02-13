'use client'

import { motion } from 'framer-motion'

const SERVICES = [
  "Social media management.",
  "Websites that work, not just look good.",
  "Video production — brand films, campaigns, reels.",
  "Packaging design & product visuals.",
  "Digital advertising.",
  "Print advertising.",
  "Strategy, execution, & everything in between.",
]

export default function ServicesIntro() {
  return (
    <section className="relative bg-white py-12 sm:py-16 md:py-24 overflow-hidden">
      {/* Left Red Bar - responsive sizing */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 bg-red-500 w-8 sm:w-12 md:w-[63px] h-40 sm:h-52 md:h-[283px]" />

      {/* Right Red Bar - responsive sizing */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-red-500 w-8 sm:w-12 md:w-[63px] h-40 sm:h-52 md:h-[283px]" />

      <div className="container mx-auto px-12 sm:px-16 md:px-20 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Side - Main Title */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2
              className="leading-tight text-4xl sm:text-5xl md:text-5xl lg:text-6xl"
              style={{
                fontFamily: "'Integral CF', sans-serif",
                fontWeight: 400,
              }}
            >
              <span style={{ color: "#F00" }}>ADVERTISING,</span>
              <br />
              <span style={{ color: "#000" }}>DONE THE</span>
              <br />
              <span style={{ color: "#000" }}>RIGHT WAY.</span>
            </h2>
          </motion.div>

          {/* Right Side - Services List with Fade-in Animation */}
          <div
            className="space-y-1 sm:space-y-2 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              lineHeight: 1.2,
            }}
          >
            {SERVICES.map((service, index) => (
              <motion.p
                key={index}
                initial={{ color: "#E5E7EB" }} // grey visible from start
                whileInView={{ color: "#000000" }} // becomes black one by one
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                viewport={{ once: true, margin: "-50px" }}
              >
                {service}
              </motion.p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
