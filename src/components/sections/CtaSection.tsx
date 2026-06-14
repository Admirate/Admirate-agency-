"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";

export default function CtaSection() {
  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden">
      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="relative flex items-center justify-center min-h-[400px] sm:min-h-[450px] md:min-h-[500px]">
          {/* Left laptop */}
          <motion.div 
            initial={{ opacity: 0, x: -100, rotate: -15 }}
            whileInView={{ opacity: 1, x: 0, rotate: -8 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[45%] sm:-translate-x-[30%] lg:-translate-x-[25%] w-[280px] sm:w-[340px] md:w-[420px] lg:w-[500px]"
          >
            <Image
              src="https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/website%20assets/left%20laptop.webp"
              alt="Laptop showcasing work"
              width={500}
              height={350}
              className="w-full h-auto"
              priority
            />
          </motion.div>

          {/* Right laptop */}
          <motion.div 
            initial={{ opacity: 0, x: 100, rotate: 15 }}
            whileInView={{ opacity: 1, x: 0, rotate: 8 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[45%] sm:translate-x-[30%] lg:translate-x-[25%] w-[280px] sm:w-[340px] md:w-[420px] lg:w-[500px]"
          >
            <Image
              src="https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/website%20assets/right%20laptop.webp"
              alt="Laptop showcasing work"
              width={500}
              height={350}
              className="w-full h-auto"
              priority
            />
          </motion.div>

          {/* Center content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 text-center px-4 max-w-lg"
          >
            <span className="text-sm font-inter text-gray-500 mb-4 block">
              • Free intro call
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[48px] font-bold font-lato leading-[108.21%] text-black text-center mb-4">
              Tell us what are you building
            </h2>
            <p className="text-black font-lato font-normal text-base sm:text-lg lg:text-[24px] leading-[108.21%] text-center mb-8">
              We bring clarity, direction, and design that holds
            </p>
            <MagneticButton>
              <a
                href="#contact"
                className="inline-block w-[180px] sm:w-[208px] h-[44px] sm:h-[48px] leading-[44px] sm:leading-[48px] bg-black text-white text-base sm:text-lg lg:text-[24px] font-normal font-lato rounded-lg hover:bg-gray-900 transition-colors duration-300 text-center"
              >
                Connect with us
              </a>
            </MagneticButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
