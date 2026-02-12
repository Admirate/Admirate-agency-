'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projectImages = [
  { 
    src: '/patilgroup1.jpeg', 
    alt: 'Patil Group', 
    link: 'https://patilgroup.com',
    title: 'Patil Group',
    category: 'Website'
  },
  { 
    src: '/southglass1.jpeg', 
    alt: 'Web Design Project 2', 
    link: 'https://southglass.in',
    title: 'South Glass',
    category: 'Web Design'
  },
  { 
    src: '/oss1.jpeg', 
    alt: 'Web Design Project 3', 
    link: 'https://oursacredspace.netlify.app',
    title: 'Our Sacred Space',
    category: 'Website'
  },
  { 
    src: '/sportex1.jpeg', 
    alt: 'Sportex Website', 
    link: 'https://sportex.in',
    title: 'Sportex',
    category: 'Website'
  },
  { 
    src: '/hopetrust1.jpeg', 
    alt: 'Web Design Project 5', 
    link: 'https://hopetrust.netlify.app',
    title: 'Hope Trust',
    category: 'Website'
  },
]

export default function WebIntentSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]

    if (!section || !content || cards.length === 0) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Get stacked position for each card (slight offset)
    const getStackedTop = (index: number) => 5 + (index * 1.5)
    
    // Set initial positions
    cards.forEach((card, index) => {
      card.style.top = index === 0 ? `${getStackedTop(0)}%` : '120%'
    })

    // Add extra scroll distance: cards animation + 1 extra screen to hold last card
    const scrollDistance = (cards.length + 1) * window.innerHeight

    let ctx = gsap.context(() => {
      // Create the ScrollTrigger without using pin
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: () => `+=${scrollDistance}`,
        onUpdate: (self) => {
          const progress = self.progress
          
          // Manual fixed positioning logic
          if (progress > 0 && progress < 1) {
            // During scroll - fixed
            content.style.position = 'fixed'
            content.style.top = '0'
            content.style.bottom = 'auto'
          } else if (progress <= 0) {
            // Before section - absolute at top
            content.style.position = 'absolute'
            content.style.top = '0'
            content.style.bottom = 'auto'
          } else {
            // After section - absolute at bottom
            content.style.position = 'absolute'
            content.style.top = 'auto'
            content.style.bottom = '0'
          }

          // Scale progress so card animations finish at 85%, leaving 15% for last card to stay visible
          const animationProgress = Math.min(progress / 0.85, 1)

          // Animate cards based on progress
          cards.forEach((card, index) => {
            if (index === 0) {
              card.style.top = `${getStackedTop(0)}%`
              return
            }

            const cardStart = (index - 1) / (cards.length - 1)
            const cardEnd = index / (cards.length - 1)

            let cardTop: number
            if (animationProgress < cardStart) {
              cardTop = 120
            } else if (animationProgress >= cardEnd) {
              cardTop = getStackedTop(index)
            } else {
              const cardProgress = (animationProgress - cardStart) / (cardEnd - cardStart)
              // Smooth easing
              const eased = 1 - Math.pow(1 - cardProgress, 3)
              cardTop = 120 - (eased * (120 - getStackedTop(index)))
            }
            
            card.style.top = `${cardTop}%`
          })
        },
      })
    }, section)

    // Refresh after a short delay
    const timer = setTimeout(() => ScrollTrigger.refresh(), 100)

    return () => {
      clearTimeout(timer)
      ctx.revert()
    }
  }, [])

  // Extra 100vh added so last card stays visible before next section
  const scrollHeight = (projectImages.length + 1) * 100

  return (
    <section 
      ref={sectionRef} 
      className="relative bg-[#e8e8e8]"
      style={{ height: `${scrollHeight}vh` }}
    >
      {/* Content - manually positioned */}
      <div 
        ref={contentRef}
        className="w-full h-screen left-0 right-0"
        style={{ position: 'absolute', top: 0 }}
      >
        <div className="h-full w-full flex flex-col lg:flex-row">
          
          {/* Left Side - Text */}
          <div className="lg:w-[40%] xl:w-[35%] h-auto lg:h-full flex flex-col justify-center px-6 md:px-12 lg:px-16 py-8 lg:py-0 relative z-10">
            
            {/* Vertical text */}
            <div className="hidden lg:block absolute left-6 top-1/2 transform -translate-y-1/2 -rotate-90 origin-center">
              <span 
                className="text-xs tracking-[0.3em] text-black/60 uppercase"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                Web Intent
              </span>
            </div>

            <div className="lg:pl-8">
              <h2 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-[0.95] tracking-tight"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span className="text-red-500">WEB</span>{' '}
                <span className="text-black">WITH</span>
                <br />
                <span className="text-black">INTENT</span>
              </h2>

              <div className="flex space-x-2 mt-6 lg:mt-8">
                {projectImages.map((_, index) => (
                  <div key={index} className="w-2.5 h-2.5 rounded-full bg-red-500" />
                ))}
              </div>

              <p 
                className="mt-6 lg:mt-8 text-sm md:text-base text-black/60 max-w-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Crafting digital experiences that drive results. Scroll to explore our work.
              </p>
            </div>
          </div>

          {/* Right Side - Cards */}
          <div className="lg:w-[60%] xl:w-[65%] h-[60vh] lg:h-full relative overflow-hidden">
            <div className="absolute inset-4 lg:inset-8">
              {projectImages.map((project, index) => (
                <div
                  key={project.src}
                  ref={(el) => { cardsRef.current[index] = el }}
                  className="absolute left-0 right-0 h-[88%] rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
                  onClick={() => window.open(project.link, '_blank')}
                  style={{ zIndex: index + 1 }}
                >
                  <Image
                    src={project.src}
                    alt={project.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    priority={index < 2}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white text-xl lg:text-2xl font-semibold" style={{ fontFamily: "'Inter', sans-serif" }}>
                          {project.title}
                        </h3>
                        <span className="text-white/70 text-sm mt-1 inline-block">{project.category}</span>
                      </div>
                      <div className="text-white text-sm font-medium flex items-center gap-2 uppercase tracking-wider">
                        View Project
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 lg:top-6 lg:right-6">
                    <span className="bg-white/90 backdrop-blur-sm text-black text-xs px-3 py-1.5 rounded-full font-medium">
                      {project.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
