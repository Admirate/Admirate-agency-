'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const collagesSets = [
  [
    { src: '/collage1.png', alt: 'Web Design 1', link: 'https://patilgroup.com' },
    { src: '/collage2.png', alt: 'Web Design 2', link: 'https://patilgroup.com' },
    { src: '/collage3.png', alt: 'Web Design 3', link: 'https://patilgroup.com' },
  ],
  [
    { src: '/collage4.png', alt: 'Web Design 4', link: 'https://southglass.in' },
    { src: '/collage5.jpg', alt: 'Web Design 5', link: 'https://southglass.in' },
    { src: '/collage6.png', alt: 'Web Design 6', link: 'https://southglass.in' },
  ]
]

export default function WebIntentSection() {
  const [currentSetIndex, setCurrentSetIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSetIndex((prev) => (prev + 1) % collagesSets.length)
    }, 4000) // Change every 4 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="h-[100svh] min-h-[100svh] md:min-h-[70vh] md:h-[70vh] bg-gray-200 relative overflow-hidden py-4 md:py-12 mt-0 md:mt-0 mb-0 md:mb-0">

      <div className="container mx-auto px-4 md:px-8 py-4 md:py-6">
        <div className="grid lg:grid-cols-2 gap-4 md:gap-8 lg:gap-16 items-center md:items-start min-h-[50vh] md:min-h-[calc(100vh-4rem)] md:h-full">
          
          {/* Left Side - Text Content */}
          <div className="space-y-4 md:space-y-8">
            {/* WEB WITH INTENT text on left side */}
            <motion.div
              className="hidden lg:block absolute left-8 top-1/2 transform -translate-y-1/2 -rotate-90 origin-center"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <span className="text-sm text-black tracking-[0.3em]" style={{ fontFamily: "'Integral CF', sans-serif", fontWeight: 700 }}>
                WEB INTENT
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                <span className="text-red-500">WEB</span> WITH
                <br />
                INTENT
              </h2>
            </motion.div>

            {/* Carousel indicators */}
            <motion.div
              className="flex space-x-2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {collagesSets.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSetIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    currentSetIndex === index ? 'bg-red-500' : 'bg-red-300'
                  }`}
                  suppressHydrationWarning
                />
              ))}
            </motion.div>
          </div>

          {/* Right Side - Carousel */}
          <motion.div
            className="relative h-[400px] md:h-[900px] w-full"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSetIndex}
                className="absolute inset-0 flex justify-center items-center gap-6"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {collagesSets[currentSetIndex].map((collage, index) => (
                  <motion.div
                    key={collage.src}
                    className="relative flex-1 h-full min-w-[200px] md:min-w-[250px] cursor-pointer"
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => window.open(collage.link, '_blank')}
              >
                <Image
                      src={collage.src}
                      alt={collage.alt}
                  fill
                      className="object-cover"
                      sizes="(max-width: 900px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
