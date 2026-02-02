'use client'

import { motion } from 'framer-motion'
import BlurText from '@/components/ui/BlurText'

const SERVICES = [
  "Social media management.",
  "Websites that work, not just look good.",
  "Video production — brand films, campaigns, reels.",
  "Packaging design & product visuals.",
  "Digital advertising.",
  "Print advertising.",
  "Strategy, execution, & everything in between.",
]

export default function ServicesIntro() {
  return (
    <section className="relative bg-white py-12 sm:py-16 md:py-24 overflow-hidden">
      {/* Left Red Bar - responsive sizing */}
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-red-500 w-8 sm:w-12 md:w-[63px] h-40 sm:h-52 md:h-[283px]"
      />
      
      {/* Right Red Bar - responsive sizing */}
      <div 
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-red-500 w-8 sm:w-12 md:w-[63px] h-40 sm:h-52 md:h-[283px]"
      />

      <div className="container mx-auto px-12 sm:px-16 md:px-20 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 xl:gap-16 items-center">
          
          {/* Left Side - Main Title */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h2 
              className="leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
              style={{ 
                fontFamily: "'Integral CF', sans-serif",
                fontWeight: 400,
              }}
            >
              <span style={{ color: '#F00' }}>
                ADVERTISING,
              </span>
              <br />
              <span style={{ color: '#000' }}>DONE THE</span>
              <br />
              <span style={{ color: '#000' }}>RIGHT WAY.</span>
            </h2>
          </motion.div>

          {/* Right Side - Services List with BlurText Animation */}
          <div 
            className="space-y-1 sm:space-y-2 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              color: '#000',
              lineHeight: 1.4,
            }}
          >
            {SERVICES.map((service, index) => (
              <BlurText
                key={index}
                text={service}
                delay={80}
                animateBy="words"
                direction="top"
                threshold={0.2}
                stepDuration={0.3}
                className=""
                animationFrom={{ filter: 'blur(8px)', opacity: 0, y: -20 }}
                animationTo={[
                  { filter: 'blur(4px)', opacity: 0.5, y: -5 },
                  { filter: 'blur(0px)', opacity: 1, y: 0 }
                ]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
