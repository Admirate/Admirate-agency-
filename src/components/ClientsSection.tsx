'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
const clients = [
  { src: '/logo1.png', alt: 'Client Logo 1' },
  { src: '/logo2.png', alt: 'Client Logo 2' },
  { src: '/logo3.png', alt: 'Client Logo 3' },
  { src: '/logo4.png', alt: 'Client Logo 4' },
  { src: '/logo5.png', alt: 'Client Logo 5' },
  { src: '/logo6.png', alt: 'Client Logo 6' },
  { src: '/logo7.png', alt: 'Client Logo 7' },
  { src: '/logo8.png', alt: 'Client Logo 8' },
  { src: '/logo9.png', alt: 'Client Logo 9' },
]

// Duplicate clients for seamless looping in the marquee (desktop / tablet)
const marqueeClients = [...clients, ...clients]

export default function ClientsSection() {
  const enlargedLogos = ['/logo3.png', '/logo5.png', '/logo6.png', '/logo7.png']
  const [currentIndex, setCurrentIndex] = useState(0)

  // Mobile: auto-advance a single centered logo so all clients are clearly visible
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % clients.length)
    }, 1500)

    return () => clearInterval(intervalId)
  }, [])

  return (
    <section className="min-h-[50svh] md:min-h-[50vh] bg-black relative overflow-hidden flex items-center justify-center py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center space-y-8 md:space-y-12">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight text-white mb-2 sm:mb-3 md:mb-4"
              style={{
                fontFamily:
                  'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              THOSE WE&apos;VE BUILT FOR
            </h2>
            <p
              className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-red-500 font-medium"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              People who believe in thoughtful work.
            </p>
          </motion.div>

          {/* Desktop / tablet: one-line infinite marquee of logos */}
          <div className="relative mt-4 md:mt-6 hidden md:block">
            <div className="overflow-hidden">
              <div className="clients-marquee flex items-center gap-4 sm:gap-6 md:gap-8 whitespace-nowrap">
                {marqueeClients.map((client, index) => {
                  const isEnlarged = enlargedLogos.includes(client.src)
                  return (
                    <motion.div
                      key={`${client.src}-${index}`}
                      className="relative flex-shrink-0 w-32 h-20 sm:w-36 sm:h-22 md:w-40 md:h-24 lg:w-48 lg:h-28 xl:w-52 xl:h-32 bg-black rounded-xl border border-gray-700/80 shadow-[0_0_18px_rgba(0,0,0,0.8)] flex items-center justify-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                      <div
                        className={
                          'relative ' + (isEnlarged ? 'w-[96%] h-[88%]' : 'w-[80%] h-[70%]')
                        }
                      >
                        <Image
                          src={client.src}
                          alt={client.alt}
                          fill
                          className="object-contain filter brightness-125"
                          sizes="(max-width: 640px) 120px, (max-width: 1024px) 160px, 192px"
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Mobile: single centered logo auto-carousel so every logo is visible */}
          <div className="mt-4 md:mt-6 block md:hidden">
            <div className="relative mx-auto w-40 h-24 sm:w-48 sm:h-28">
              <AnimatePresence mode="wait">
                <motion.div
                  key={clients[currentIndex].src}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -10 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0 bg-black rounded-xl border border-gray-700/80 shadow-[0_0_18px_rgba(0,0,0,0.8)] flex items-center justify-center"
                >
                  <div
                    className={
                      'relative w-[90%] h-[80%]' +
                      (enlargedLogos.includes(clients[currentIndex].src)
                        ? ' md:w-[96%] md:h-[88%]'
                        : '')
                    }
                  >
                    <Image
                      src={clients[currentIndex].src}
                      alt={clients[currentIndex].alt}
                      fill
                      className="object-contain filter brightness-125"
                      sizes="(max-width: 640px) 160px, 192px"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Line */}
          <motion.div
            className="w-full max-w-4xl mx-auto h-px bg-gray-800"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            viewport={{ once: true }}
          />
        </div>
      </div>
    </section>
  )
}
