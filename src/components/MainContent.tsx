'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function MainContent() {
  const [isMobile, setIsMobile] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const h1Ref = useRef<HTMLHeadingElement>(null)
  const h2Ref = useRef<HTMLHeadingElement>(null)
  const lineLeftRef = useRef<HTMLDivElement>(null)
  const lineRightRef = useRef<HTMLDivElement>(null)
  const linesGroupRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Play a slow, sequential intro for the hero texts on mount (not scroll-linked)
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power1.out', duration: 1.0 }
      })

      tl.from(h1Ref.current, { y: 24, autoAlpha: 0 })
        .from(h2Ref.current, { y: 28, autoAlpha: 0 }, '>-0.1')
        .from([lineLeftRef.current, lineRightRef.current], { scaleX: 0, transformOrigin: 'center', duration: 0.9 }, '>-0.1')
        .from(labelRef.current, { y: 18, autoAlpha: 0, duration: 1.1 }, '>-0.05')
        .add(() => {
          // Enable parallax only after the intro finishes
          const base: gsap.plugins.ScrollTriggerInstanceVars = {
            trigger: heroRef.current as Element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
          }

          gsap.fromTo(h1Ref.current, { y: -60 }, { y: 80, ease: 'none', immediateRender: false, scrollTrigger: { ...base } })
          gsap.fromTo(h2Ref.current, { y: -120 }, { y: 160, ease: 'none', immediateRender: false, scrollTrigger: { ...base } })
          gsap.fromTo(linesGroupRef.current, { y: -90 }, { y: 120, ease: 'none', immediateRender: false, scrollTrigger: { ...base } })
        })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <motion.main 
      className="h-[100svh] min-h-[100svh] md:min-h-[80vh] md:h-[80vh] bg-white relative overflow-hidden py-0 md:py-12 mb-0 md:mb-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* ADMIRATE Logo at top center - Desktop */}
      <motion.div
        className="hidden lg:block absolute top-12 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Image
          src="/redadmiratelogo.png"
          alt="ADMIRATE"
          width={300}
          height={90}
          className="lg:w-[350px] lg:h-[105px] xl:w-[400px] xl:h-[120px] object-contain"
          priority
        />
      </motion.div>

      {/* ADMIRATE Logo - Tablet only */}
      <motion.div
        className="hidden md:block lg:hidden absolute top-6 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Image
          src="/redadmiratelogo.png"
          alt="ADMIRATE"
          width={160}
          height={48}
          className="w-[160px] h-auto object-contain"
          priority
        />
      </motion.div>

      {/* ADMIRATE Logo at top center - Mobile */}
      <motion.div
        className="block md:hidden absolute top-4 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Image
          src="/redadmiratelogo.png"
          alt="ADMIRATE"
          width={100}
          height={30}
          className="object-contain"
          priority
        />
      </motion.div>

      {/* Top Left Decorative Element - Desktop Only */}
      <motion.div
        className="hidden md:block absolute top-0 left-0 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Image
          src="/top left@72x.png"
          alt="Top Left Decoration"
          width={600}
          height={600}
          className="object-contain"
        />
      </motion.div>

      {/* Top Right Decorative Element - Desktop Only */}
      <motion.div
        className="hidden md:block absolute top-0 right-0 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Image
          src="/top right@72x.png"
          alt="Top Right Decoration"
          width={600}
          height={600}
          className="object-contain"
        />
      </motion.div>

      {/* Mobile Top Left Decorative Element */}
      <motion.div
        className="block md:hidden absolute top-0 left-0 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Image
          src="/top left@72x.png"
          alt="Top Left Decoration"
          width={180}
          height={180}
          className="object-contain"
        />
      </motion.div>

      {/* Mobile Top Right Decorative Element */}
      <motion.div
        className="block md:hidden absolute top-0 right-0 z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Image
          src="/top right@72x.png"
          alt="Top Right Decoration"
          width={180}
          height={180}
          className="object-contain"
        />
      </motion.div>



      {/* ADMIRATE text on left side - Desktop */}
      <motion.div
        className="hidden md:block absolute left-8 top-1/2 transform -translate-y-1/2 -rotate-90 origin-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <span className="text-sm text-black tracking-[0.3em]" style={{ fontFamily: "'Integral CF', sans-serif", fontWeight: 700 }}>
          ADMIRATE
        </span>
      </motion.div>

      {/* ADMIRATE text on right side - Desktop */}
      <motion.div
        className="hidden md:block absolute right-8 top-1/2 transform -translate-y-1/2 rotate-90 origin-center"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <span className="text-sm text-black tracking-[0.3em]" style={{ fontFamily: "'Integral CF', sans-serif", fontWeight: 700 }}>
          ADMIRATE
        </span>
      </motion.div>


      {/* Main Content - Center with sequential intro */}
      <div ref={heroRef} className="flex items-center justify-center min-h-screen py-2 md:py-0 md:h-screen">
        <motion.div
          className="text-center max-w-md md:max-w-4xl px-4 md:px-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: isMobile ? 2.0 : 0.3 }}
        >
          {/* More than ideas */}
          <h1 
            ref={h1Ref}
            style={{ fontFamily: "'Instrument Serif', serif", willChange: 'transform' }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-gray-800 mb-2 sm:mb-3 md:mb-4"
          >
            More than ideas
          </h1>

          {/* SOMETHING MORE */}
          <h2 
            ref={h2Ref}
            style={{ fontFamily: "'Integral CF', sans-serif", willChange: 'transform' }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-black mb-3 sm:mb-4 md:mb-6 leading-tight font-black"
          >
            SOMETHING MORE
          </h2>

          {/* deliberate with lines */}
          <div
            ref={linesGroupRef}
            className="flex items-center justify-center space-x-3 sm:space-x-4 md:space-x-8"
            style={{ willChange: 'transform' }}
          >
            <div ref={lineLeftRef} className="h-px bg-black flex-1 max-w-8 sm:max-w-12 md:max-w-32" />
            <h3 
              ref={labelRef}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-gray-800 italic whitespace-nowrap"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              deliberate
            </h3>
            <div ref={lineRightRef} className="h-px bg-black flex-1 max-w-8 sm:max-w-12 md:max-w-32" />
          </div>
        </motion.div>
      </div>
    </motion.main>
  )
}
