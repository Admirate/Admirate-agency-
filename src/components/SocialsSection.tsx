 'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

const gridImages = [
  { src: '/pic2.jpg', alt: 'Social media design 1' },
  { src: '/pic7.jpg', alt: 'Social media design 2' },
  { src: '/pic4.jpg', alt: 'Social media design 3' },
  { src: '/pic5.png', alt: 'Social media design 4' },
  { src: '/pic8.jpg', alt: 'Social media design 5' },
  { src: '/pic9.jpg', alt: 'Social media design 6' },
  { src: '/pic10.jpg', alt: 'Social media design 7' },
  { src: '/pic11.png', alt: 'Social media design 8' },
]

export default function SocialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const yBackground = useTransform(scrollYProgress, [0, 1], [80, -80])
  const yLeftImage = useTransform(scrollYProgress, [0, 1], [-100, 120])
  const ySideLabel = useTransform(scrollYProgress, [0, 1], [60, -60])
  const yTitle = useTransform(scrollYProgress, [0, 1], [-80, 120])
  const yMobileImage = useTransform(scrollYProgress, [0, 1], [60, -60])

  return (
    <section ref={sectionRef} className="min-h-[55svh] md:min-h-[70vh] md:h-[70vh] bg-white relative overflow-hidden py-2 md:py-12 mt-0 md:mt-0 mb-0 md:mb-0">

      {/* Background Long Design Element */}
      <motion.div
        style={{ y: yBackground, willChange: 'transform', width: '1400px', height: '100%', right: '480px' }}
        className="absolute top-0 z-0 opacity-100 rotate-180"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 0.8, x: 0 }}
        transition={{ duration: 1.2, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Image
          src="/long@72x.png"
          alt="Background Long Design"
          width={1400}
          height={1200}
          className="object-cover w-full h-full"
        />
      </motion.div>

      {/* Desktop Layout - Grid on Left, Text on Right */}
      <div className="hidden lg:block">
        {/* CREATIVES text on right side */}
        <motion.div
          style={{ y: ySideLabel, willChange: 'transform' }}
          className="hidden md:block absolute right-8 top-1/3 transform -translate-y-1/2 rotate-90 origin-center z-30"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="text-sm text-black tracking-[0.3em]" style={{ fontFamily: "'Integral CF', sans-serif", fontWeight: 700 }}>
            CREATIVES
          </span>
        </motion.div>

        {/* Desktop Content Container */}
        <div className="relative z-20">
          <div className="flex justify-between items-start h-screen pt-10 px-16 gap-12">
            {/* Left Side - Grid of social images */}
            <motion.div
              style={{ y: yLeftImage, willChange: 'transform' }}
              className="w-1/2 grid grid-cols-3 gap-3"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {gridImages.map((image) => (
                <div
                  key={image.src}
                  className="relative w-full h-36 sm:h-40 rounded overflow-hidden"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 45vw, 240px"
                  />
                </div>
              ))}
            </motion.div>

            {/* Right Side - Text Content */}
            <div className="w-1/2 pr-4 space-y-8">
              {/* Main Title */}
              <motion.div
                style={{ y: yTitle, willChange: 'transform' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <span className="text-red-500">SOCIALS</span>
                  <br />
                  THAT CREATE
                  <br />
                  IMPACT
                </h2>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout - Centered with Image Below */}
      <div className="lg:hidden flex flex-col justify-start items-center min-h-[55svh] py-2 md:py-0 px-4 md:px-8 pt-2">
        {/* Mobile Title */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-4xl font-bold leading-tight text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="text-red-500">SOCIALS</span> THAT
            <br />
            CREATE IMPACT
          </h2>
        </motion.div>

        {/* Mobile Grid of images (2 per row) */}
        <motion.div
          style={{ y: yMobileImage, willChange: 'transform' }}
          className="w-full max-w-xl mx-auto grid grid-cols-2 gap-3 sm:gap-3"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {gridImages.map((image) => (
            <div
              key={image.src}
              className="relative w-full h-36 sm:h-40 rounded overflow-hidden"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 45vw, 240px"
              />
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
