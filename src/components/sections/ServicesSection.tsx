"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { asset } from "@/lib/cdn";
import ScrambleText from "@/components/ui/ScrambleText";

type Service = {
  title: string;
  description: string;
  tags: string[];
  image?: string;
  video?: string;
};

const services: Service[] = [
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
      "Content built to strengthen brands, engage audiences, and support business goals.",
    tags: ["Strategy", "Content", "Conversions"],
  },
  {
    image: asset("visual identity.webp"),
    title: "Visual Identity",
    description:
      "Brand systems that stay relevant, recognizable, and consistent.",
    tags: ["Logo Design", "Brand System", "Guidelines"],
  },
  {
    image: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/website%20assets/asset5.webp",
    title: "Video",
    description:
      "Stories that capture attention and communicate clearly.",
    tags: ["Shoots", "Reels", "Edits"],
  },
  {
    video: "https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/videos/finalvideo.mp4",
    title: "Editorial design",
    description:
      "Brochures, presentations, reports, and print materials designed with clarity.",
    tags: ["Brochures", "Deck", "Print Design"],
  },
];

const ServiceCard = ({ service }: { service: Service }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  const hasVideo = !!service.video;

  return (
    <motion.div
      ref={ref}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{ opacity: 0, transform: "translateY(30px)" }}
      className="flex flex-col sm:flex-row items-stretch bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300 group"
    >
      <div className="relative w-full sm:w-[320px] md:w-[380px] lg:w-[458px] h-[240px] sm:h-[320px] md:h-[380px] lg:h-[430px] flex-shrink-0 bg-gray-200 overflow-hidden rounded-2xl sm:rounded-3xl">
        {hasVideo ? (
          <video
            src={service.video!}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <motion.div style={{ y: imageY }} className="absolute inset-[-20%] w-[140%] h-[140%]">
            <Image
              src={service.image!}
              alt={service.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, 360px"
            />
          </motion.div>
        )}
      </div>
      <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center relative">
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
              className="px-3 py-1 text-xs sm:text-sm font-inter text-gray-600 bg-white border border-gray-200 rounded-full cursor-default"
            >
              <ScrambleText text={tag} />
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

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
            <div className="relative overflow-hidden w-4 h-4 flex items-center justify-center">
              <svg
                className="absolute w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[150%] group-hover:-translate-y-[150%]"
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
              <svg
                className="absolute w-full h-full -translate-x-[150%] translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0"
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
            </div>
          </a>
        </motion.div>

        {/* Service cards */}
        <div className="flex flex-col gap-4">
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
