'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'

export default function ContactSection() {
  const [message, setMessage] = useState('')

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message || 'Hello! I would like to discuss a project with you.')
    window.open(`https://wa.me/918374494954?text=${encodedMessage}`, '_blank')
  }

  return (
    <section className="relative overflow-hidden mt-0">
      {/* Contact Content */}
      <div className="bg-gray-100 py-1 md:py-12 mt-0 md:mt-0">
        <div className="container mx-auto px-4 md:px-8 py-1 md:py-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Left Side - Text Content */}
          <div className="space-y-8">
            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium leading-tight text-black" style={{ fontFamily: "'Inter', sans-serif" }}>
                DO YOU WANT
                <br />
                TO <span className="text-red-500">TRUST US</span>
                <br />
                WITH YOURS?
              </h2>
            </motion.div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="space-y-4">
            {/* Message Input */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Drop us a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 px-4 md:px-6 py-3 md:py-4 text-base md:text-lg text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleWhatsAppClick()
                    }
                  }}
                  suppressHydrationWarning
                />
                <button
                  onClick={handleWhatsAppClick}
                  className="bg-green-500 hover:bg-green-600 text-white p-3 md:p-4 transition-colors duration-300"
                  suppressHydrationWarning
                >
                  <FaWhatsapp size={20} className="md:w-6 md:h-6" />
                </button>
              </div>
            </motion.div>
            {/* Footer bar - keep directly after the input on mobile */}
            <div className="block md:hidden">
              <div className="bg-red-500 rounded-xl py-3 mt-3">
                <p 
                  className="text-white text-xs font-medium text-center"
                  style={{ 
                    textTransform: 'none',
                    fontVariant: 'normal',
                    fontFeatureSettings: 'normal',
                    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                >
                  you won&apos;t get a bot named Alex.
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Contact Bar (desktop only) */}
      <motion.div
        className="hidden md:block bg-red-500 py-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-8">
          <div className="flex justify-center items-center">
            <p 
              className="text-white text-lg font-medium text-center normal-case" 
              style={{ 
                textTransform: 'none',
                fontVariant: 'normal',
                fontFeatureSettings: 'normal',
                fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
            >
              you won&apos;t get a bot named Alex.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
