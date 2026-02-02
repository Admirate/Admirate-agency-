'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function AdvertisingSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const weWorkRef = useRef<HTMLHeadingElement>(null)
  const edgeRef = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        // Match the feel of the hero ("More than ideas / SOMETHING MORE / deliberate")
        scrollTrigger: {
          trigger: sectionRef.current as Element,
          start: 'top 70%',
          toggleActions: 'play none none none',
          once: true,
          invalidateOnRefresh: true,
        },
        // Slightly quicker than the hero so it feels snappy when scrolled into view
        defaults: { ease: 'power1.out', duration: 0.7 }
      })

      // Sequential, soft fade/slide-in like the hero texts
      tl.from(headlineRef.current, { y: 24, autoAlpha: 0 })
        .from(subRef.current, { y: 28, autoAlpha: 0 }, '>-0.1')
        .from(lineRef.current, {
          scaleX: 0,
          transformOrigin: 'center center',
          duration: 0.6,
        }, '>-0.1')
        .from(weWorkRef.current, { y: 18, autoAlpha: 0 }, '>-0.05')
        .from(edgeRef.current, { y: 18, autoAlpha: 0 }, '>-0.05')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="min-h-[70svh] md:min-h-[70vh] md:h-[70vh] bg-white relative overflow-hidden flex items-center justify-center py-2 md:py-12 mt-0 md:mt-0 mb-24 md:mb-32">

      {/* Left Side Decorative Element */}
      <motion.div
        className="absolute left-0 top-[60%] transform -translate-y-1/2 z-10"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
      >
        <Image
          src="/left@72x.png"
          alt="Left Decoration"
          width={1000}
          height={1100}
          className="object-contain -rotate-3 md:rotate-0"
        />
      </motion.div>

      {/* Right Side Decorative Element */}
      <motion.div
        className="absolute right-0 top-[60%] transform -translate-y-1/2 z-10"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
      >
        <Image
          src="/left@72x.png"
          alt="Right Decoration"
          width={1000}
          height={1100}
          className="object-contain scale-x-[-1] rotate-3 md:rotate-0"
        />
      </motion.div>

      {/* Main Content */}
      <div className="text-center max-w-4xl px-4 sm:px-6 md:px-8 z-10">
        {/* ADVERTISING IS */}
        <h1 
          ref={headlineRef}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-red-500 mb-1 sm:mb-2"
          style={{ fontFamily: "'Integral CF', sans-serif" }}
        >
          ADVERTISING IS
        </h1>

        {/* PART BUSINESS, PART INSTINCT. */}
        <h2 
          ref={subRef}
          className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium text-red-500 mb-4 sm:mb-6 md:mb-8"
          style={{ fontFamily: "'Integral CF', sans-serif" }}
        >
          PART BUSINESS, PART INSTINCT.
        </h2>

        {/* Horizontal Line */}
        <div
          ref={lineRef}
          className="w-24 sm:w-32 md:w-48 h-px bg-black mx-auto mb-4 sm:mb-6 md:mb-8"
          style={{ transformOrigin: 'center' }}
        />

        {/* WE WORK */}
        <h3 
          ref={weWorkRef}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium text-gray-900 mb-1 sm:mb-2"
          style={{ fontFamily: "'Integral CF', sans-serif" }}
        >
          WE WORK
        </h3>

        {/* AT THAT EDGE */}
        <h4 
          ref={edgeRef}
          className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium text-gray-900"
          style={{ fontFamily: "'Integral CF', sans-serif" }}
        >
          AT THAT EDGE
        </h4>
      </div>
    </section>
  )
}
