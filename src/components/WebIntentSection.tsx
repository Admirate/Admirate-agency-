'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projectImages = [
  {
    desktopSrc: "/Hitex@72x-100.jpg",
    mobileSrc: "/Hitex-mobile@72x-100.jpg",
    title: "Hitex",
    link: "https://hitex.co.in",
    category: "Website",
  },
  {
    desktopSrc: "/hope-trust.jpg",
    mobileSrc: "/Hope-mobile@72x-100.jpg",
    title: "Hope Trust",
    link: "https://hopetrust.netlify.app",
    category: "Website",
  },
  {
    desktopSrc: "/Patil-goup1@72x-100.jpg",
    mobileSrc: "/Patil-mobile@72x-100.jpg",
    title: "Patil Group",
    link: "https://patilgroup.com",
    category: "Website",
  },
  {
    desktopSrc: "/Sacred-space@72x-100.jpg",
    mobileSrc: "/Sacred-mobile@72x-100.jpg",
    title: "Our Sacred Space",
    link: "https://oursacredspace.netlify.app",
    category: "Website",
  },
  {
    desktopSrc: "/south-glass@72x-100.jpg",
    mobileSrc: "/south-mobile@72x-100.jpg",
    title: "South Glass",
    link: "https://southglass.in",
    category: "Website",
  },
];

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

    let ctx: gsap.Context
    let resizeTimeout: NodeJS.Timeout

    const setupAnimation = () => {
      // Kill existing ScrollTriggers for this section
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === section) st.kill()
      })

      const isSmallScreen = window.innerWidth < 1024

      // Get stacked position - different for mobile/desktop
      const getStackedTop = (index: number) => {
        if (isSmallScreen) {
          return 1 + (index * 0.8) // Tighter stacking on mobile
        }
        return 5 + (index * 1.5) // More spacing on desktop
      }
      
      // Set initial positions
      cards.forEach((card, index) => {
        card.style.top = index === 0 ? `${getStackedTop(0)}%` : '120%'
      })

      // Scroll distance
      const scrollDistance = (cards.length + 1) * window.innerHeight

      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          onUpdate: (self) => {
            const progress = self.progress
            
            // Fixed positioning
            if (progress > 0 && progress < 1) {
              content.style.position = 'fixed'
              content.style.top = '0'
              content.style.bottom = 'auto'
            } else if (progress <= 0) {
              content.style.position = 'absolute'
              content.style.top = '0'
              content.style.bottom = 'auto'
            } else {
              content.style.position = 'absolute'
              content.style.top = 'auto'
              content.style.bottom = '0'
            }

            // Animation progress (finish at 85%)
            const animationProgress = Math.min(progress / 0.85, 1)

            // Animate cards
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
                const eased = 1 - Math.pow(1 - cardProgress, 3)
                cardTop = 120 - (eased * (120 - getStackedTop(index)))
              }
              
              card.style.top = `${cardTop}%`
            })
          },
        })
      }, section)

      ScrollTrigger.refresh()
    }

    // Initial setup with delay
    const initTimer = setTimeout(setupAnimation, 100)

    // Handle resize
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        ctx?.revert()
        setupAnimation()
      }, 200)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(initTimer)
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
      ctx?.revert()
    }
  }, [])

  const scrollHeight = (projectImages.length + 1) * 100

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#e8e8e8]"
      style={{ height: `${scrollHeight}vh` }}
    >
      {/* Content wrapper */}
      <div
        ref={contentRef}
        className="w-full h-[100svh] left-0 right-0"
        style={{ position: "absolute", top: 0 }}
      >
        <div className="h-full w-full flex flex-col lg:flex-row">
          {/* Text Section */}
          <div className="flex-shrink-0 lg:flex-shrink lg:w-[40%] xl:w-[35%] flex flex-col justify-start lg:justify-center px-4 sm:px-6 lg:px-12 xl:px-16 pt-4 pb-2 lg:py-0 relative z-10">
            {/* Vertical text - desktop only */}
            <div className="hidden lg:block absolute left-6 top-1/2 transform -translate-y-1/2 -rotate-90 origin-center">
              <span
                className="text-xs tracking-[0.3em] text-black/60 uppercase"
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
              >
                Web Intent
              </span>
            </div>

            <div className="lg:pl-8">
              {/* Title - responsive sizing */}
              <h2
                className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-[0.95] tracking-tight"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <span className="text-red-500">WEB</span>{" "}
                <span className="text-black lg:hidden">WITH INTENT</span>
                <span className="text-black hidden lg:inline">WITH</span>
                <br className="hidden lg:block" />
                <span className="text-black hidden lg:inline">INTENT</span>
              </h2>

              {/* Dots */}
              <div className="flex space-x-1.5 lg:space-x-2 mt-3 lg:mt-8">
                {projectImages.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-red-500"
                  />
                ))}
              </div>

              {/* Subtitle - desktop only */}
              <p
                className="hidden lg:block mt-8 text-base text-black/60 max-w-sm leading-relaxed"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Crafting digital experiences that drive results. Scroll to
                explore our work.
              </p>
            </div>
          </div>

          {/* Cards Section */}
          <div className="flex-1 lg:w-[60%] xl:w-[65%] relative overflow-hidden">
            <div className="absolute inset-2 sm:inset-3 lg:inset-8">
              {projectImages.map((project, index) => (
                <div
                  key={project.desktopSrc}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  className="absolute left-0 right-0 aspect-[2/3] lg:aspect-[16/10] rounded-xl lg:rounded-2xl overflow-hidden shadow-xl lg:shadow-2xl cursor-pointer group"
                  onClick={() => window.open(project.link, "_blank")}
                  style={{ zIndex: index + 1 }}
                >
                  <picture>
                    {/* Desktop image */}
                    <source
                      media="(min-width: 1024px)"
                      srcSet={project.desktopSrc}
                    />

                    {/* Mobile fallback */}
                    <Image
                      src={project.mobileSrc}
                      alt={project.title}
                      fill
                      className="object-cover lg:transition-transform lg:duration-700 lg:group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 65vw"
                      priority={index < 2}
                    />
                  </picture>

                  {/* Gradient overlay - always visible on mobile, hover on desktop */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:from-black/70 lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:duration-500" />

                  {/* Project info - always visible on mobile, hover on desktop */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8 lg:translate-y-full lg:group-hover:translate-y-0 lg:transition-transform lg:duration-500">
                    <div className="flex items-end lg:items-center justify-between">
                      <div>
                        <h3
                          className="text-white text-base sm:text-lg lg:text-2xl font-semibold"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {project.title}
                        </h3>
                        <span className="text-white/70 text-xs lg:text-sm mt-0.5 lg:mt-1 inline-block">
                          {project.category}
                        </span>
                      </div>

                      {/* View button */}
                      <div className="text-white text-xs lg:text-sm font-medium flex items-center gap-1 lg:gap-2 bg-white/20 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none px-3 py-1.5 lg:px-0 lg:py-0 rounded-full lg:rounded-none uppercase tracking-wider">
                        <span className="lg:inline">View</span>
                        <span className="hidden lg:inline"> Project</span>
                        <svg
                          className="w-3 h-3 lg:w-4 lg:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                            className="lg:hidden"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                            className="hidden lg:block"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Category tag */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-6 lg:right-6">
                    <span className="bg-white/90 backdrop-blur-sm text-black text-[10px] sm:text-xs px-2 py-1 lg:px-3 lg:py-1.5 rounded-full font-medium">
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
  );
}
