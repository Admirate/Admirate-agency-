 'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

export default function IdentitiesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const ySide = useTransform(scrollYProgress, [0, 0.85, 1], [60, -60, -60])
  const yTitle = useTransform(scrollYProgress, [0, 0.85, 1], [-90, 120, 120])
  const yImage = useTransform(scrollYProgress, [0, 0.85, 1], [40, -40, -40])

  return (
    <section ref={sectionRef} className="min-h-[70svh] md:min-h-[70vh] md:h-[70vh] bg-white relative overflow-hidden md:overflow-hidden py-2 md:py-12 mt-0 md:mt-0">

      {/* IDENTITIES text on left side - vertical (desktop only) */}
      <motion.div
        style={{ y: ySide, willChange: 'transform' }}
        className="hidden lg:block absolute left-8 top-1/2 transform -translate-y-1/2 -rotate-90 origin-center"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <span className="text-sm text-black tracking-[0.3em]" style={{ fontFamily: "'Integral CF', sans-serif", fontWeight: 700 }}>
          IDENTITIES
        </span>
      </motion.div>

      <div className="container mx-auto px-4 md:px-8 py-0 md:py-6 overflow-visible md:overflow-visible">
        
        {/* Mobile Layout - Text Left, Image Right */}
        <div className="block md:hidden relative h-[400px] pt-4">
          {/* Text Content - Left Side */}
          <motion.div
            style={{ y: yTitle, willChange: 'transform' }}
            className="absolute left-4 -top-4 z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold leading-tight text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
              <span className="text-red-500">IDENTITIES</span>
              <br />
              BUILT TO
              <br />
              STAY
            </h2>
          </motion.div>

          {/* Image on Right Edge */}
          <motion.div
            style={{ y: yImage, willChange: 'transform' }}
            className="absolute right-0 top-1/2 transform -translate-y-1/2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="relative h-[250px] w-[150px]">
              <Image
                src="/mobileartbopad.png"
                alt="3D Identity Design Showcase"
                fill
                className="object-contain scale-x-[-1] rotate-180"
                sizes="150px"
              />
            </div>
          </motion.div>
        </div>

        {/* Desktop Layout - Side by Side */}
        <div className="hidden md:grid grid-cols-2 gap-8 lg:gap-16 items-start h-full pt-6 overflow-visible">
          
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            {/* Main Title */}
            <motion.div
              style={{ y: yTitle, willChange: 'transform' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="text-red-500">IDENTITIES</span>
                <br />
                BUILT TO
                <br />
                STAY
              </h2>
            </motion.div>
          </div>

          {/* Right Side - Artboard Image */}
          <motion.div
            style={{ y: yImage, willChange: 'transform' }}
            className="relative overflow-visible"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="relative h-[350px] lg:h-[600px] w-full overflow-visible">
              <Image
                src="/artboard.png"
                alt="3D Identity Design Showcase"
                fill
                className="object-contain rotate-0 scale-80 translate-x-4"
                sizes="50vw"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}


