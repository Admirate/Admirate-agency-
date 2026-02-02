'use client'

import { motion } from 'framer-motion'

export default function VideoSection() {
  return (
    <section className="min-h-[70svh] md:h-screen md:min-h-screen relative overflow-hidden flex items-center justify-center py-4 md:py-0">

      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/finalvideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* Content */}
      <div className="relative z-20 text-center">
        {/* Glass Container */}
        <motion.div
          className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-2xl mx-4 sm:mx-6 md:mx-0"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          {/* Main Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="text-red-500">VIDEOS</span>
            <br />
            THAT TELL
            <br />
            STORIES
          </h2>
        </motion.div>
      </div>
    </section>
  )
}
