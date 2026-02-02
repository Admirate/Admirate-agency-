 'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'

const gridImages = [
  { src: '/pic1.png', alt: 'Social media design 1' },
  { src: '/pic2.jpg', alt: 'Social media design 2' },
  { src: '/pic3.png', alt: 'Social media design 3' },
  { src: '/pic4.jpg', alt: 'Social media design 4' },
  { src: '/pic5.jpg', alt: 'Social media design 5' },
  { src: '/pic6.png', alt: 'Social media design 6' },
  { src: '/pic7.png', alt: 'Social media design 7' },
  { src: '/pic8.jpg', alt: 'Social media design 8' },
  { src: '/pic9.png', alt: 'Social media design 9' },
  { src: '/pic10.jpg', alt: 'Social media design 10' },
  { src: '/pic11.png', alt: 'Social media design 11' },
  { src: '/pic12.png', alt: 'Social media design 12' },
  { src: '/pic13.png', alt: 'Social media design 13' },
  { src: '/pic14.jpg', alt: 'Social media design 14' },
  { src: '/pic15.jpg', alt: 'Social media design 15' },
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
    <section ref={sectionRef} className="min-h-fit bg-white relative overflow-visible py-8 md:py-16 lg:py-20">

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
          <div className="flex justify-between items-center px-12 lg:px-16 xl:px-20 gap-8 lg:gap-12">
            {/* Left Side - Grid of social images */}
            <motion.div
              style={{ y: yLeftImage, willChange: 'transform' }}
              className="flex-1 grid grid-cols-5 gap-3 lg:gap-4 xl:gap-5"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {gridImages.map((image) => (
                <div
                  key={image.src}
                  className="relative w-full aspect-square rounded-lg overflow-hidden"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 20vw, 180px"
                  />
                </div>
              ))}
            </motion.div>

            {/* Right Side - Text Content */}
            <div className="flex-shrink-0 w-auto pr-4">
              {/* Main Title */}
              <motion.div
                style={{ y: yTitle, willChange: 'transform' }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold leading-tight text-black whitespace-nowrap" style={{ fontFamily: "'Inter', sans-serif" }}>
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
      <div className="lg:hidden flex flex-col justify-start items-center py-4 px-4 md:px-8">
        {/* Mobile Title */}
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="text-red-500">SOCIALS</span> THAT
            <br />
            CREATE IMPACT
          </h2>
        </motion.div>

        {/* Mobile Grid of images (3 per row on mobile, 5 on tablet) */}
        <motion.div
          style={{ y: yMobileImage, willChange: 'transform' }}
          className="w-full max-w-5xl mx-auto grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {gridImages.map((image) => (
            <div
              key={image.src}
              className="relative w-full aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 33vw, 20vw"
              />
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
