'use client'

import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function DesignSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const sideLeftRef = useRef<HTMLSpanElement>(null)
  const sideRightRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const base: gsap.plugins.ScrollTriggerInstanceVars = {
        trigger: sectionRef.current as Element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        invalidateOnRefresh: true,
      }

      gsap.fromTo(titleRef.current, { y: -120 }, { y: 120, ease: 'none', scrollTrigger: { ...base } })
      gsap.fromTo(subRef.current, { y: -60 }, { y: 160, ease: 'none', scrollTrigger: { ...base } })
      gsap.fromTo(sideLeftRef.current, { y: 80 }, { y: -80, ease: 'none', scrollTrigger: { ...base } })
      gsap.fromTo(sideRightRef.current, { y: -80 }, { y: 80, ease: 'none', scrollTrigger: { ...base } })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="min-h-[70svh] md:min-h-[70vh] md:h-[70vh] bg-white relative overflow-hidden flex items-center justify-center py-4 md:py-0 mt-0 md:mt-0 mb-0 md:mb-0">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/design%20that%20moves%20with%20you.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Centered overlay content (GSAP-parallaxed text) */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {/* Vertical side labels */}
        <span
          ref={sideLeftRef}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] sm:text-xs tracking-[0.3em] text-black select-none"
          style={{ willChange: 'transform' }}
          aria-hidden="true"
        >
          DESIGN
        </span>
        <span
          ref={sideRightRef}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 rotate-90 text-[10px] sm:text-xs tracking-[0.3em] text-black select-none"
          style={{ willChange: 'transform' }}
          aria-hidden="true"
        >
          DESIGN
        </span>

        {/* Headline */}
        <h2
          ref={titleRef}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-8xl 2xl:text-9xl font-black text-red-500 uppercase leading-none text-center"
          style={{ willChange: 'transform', fontFamily: "'Integral CF', sans-serif" }}
        >
          DESIGN
        </h2>
        {/* Subhead */}
        <p
          ref={subRef}
          className="mt-2 sm:mt-3 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl italic uppercase tracking-wide text-black text-center"
          style={{ willChange: 'transform', fontFamily: "'Instrument Serif', serif" }}
        >
          THAT MOVES WITH YOU
        </p>
      </div>
    </section>
  )
}
