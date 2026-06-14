"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { asset } from "@/lib/cdn";

const services = [
  {
    image: asset("webdevelopment image.webp"),
    title: "Web development",
    description:
      "We build simple, scalable websites that look sharp and work effortlessly.",
    tags: ["Analytics", "Web Design", "Development"],
  },
  {
    image: asset("socail media image.webp"),
    title: "Social Media",
    description:
      "We build simple, scalable websites that look sharp and work effortlessly.",
    tags: ["Analytics", "Web Design", "Development"],
  },
  {
    image: asset("visual identity.webp"),
    title: "Visual Identity",
    description:
      "We build simple, scalable websites that look sharp and work effortlessly.",
    tags: ["Analytics", "Web Design", "Development"],
  },
  {
    image: asset("service-video.webp"),
    title: "Video",
    description:
      "We build simple, scalable websites that look sharp and work effortlessly.",
    tags: ["Analytics", "Web Design", "Development"],
  },
  {
    image: asset("service-editorial.webp"),
    title: "Editorial design",
    description:
      "We build simple, scalable websites that look sharp and work effortlessly.",
    tags: ["Analytics", "Web Design", "Development"],
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16"
        >
          <div>
            <span className="text-base sm:text-[20px] font-normal font-lato leading-[108.21%] text-black mb-4 block">
              Services
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-[48px] font-bold font-lato leading-[108.21%] text-black">
              Clear steps for
              <br />
              <span className="text-red-600">growing brands</span>
            </h2>
          </div>
          <a
            href="#contact"
            className="group flex items-center gap-2 self-start sm:self-auto"
          >
            <span className="relative text-lg sm:text-2xl lg:text-[36px] font-normal font-lato leading-[108.21%] text-black pb-1">
              Connect with us
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-gray-900 group-hover:bg-red-600 transition-colors duration-300" />
            </span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-[30deg]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M17 7H7M17 7v10"
              />
            </svg>
          </a>
        </motion.div>

        {/* Service cards */}
        <div className="flex flex-col gap-4">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-stretch bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative w-full sm:w-[320px] md:w-[380px] lg:w-[458px] h-[240px] sm:h-[320px] md:h-[380px] lg:h-[430px] flex-shrink-0 bg-gray-200 overflow-hidden rounded-2xl sm:rounded-3xl">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  sizes="(max-width: 640px) 100vw, 360px"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center relative">
                {/* Dots icon */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-[40px] font-bold font-lato leading-[108.21%] text-black mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base lg:text-[24px] font-normal font-lato leading-[108.21%] text-black mb-4 sm:mb-5">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs sm:text-sm font-inter text-gray-600 bg-white border border-gray-200 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
