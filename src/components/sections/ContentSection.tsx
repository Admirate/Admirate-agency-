"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import Folder from "@/components/ui/Folder";
import { asset } from "@/lib/cdn";

const ADMIRATE_LOGO = asset("admirate logo.webp");

const posts = [
  {
    image: asset("southglass creative.png"),
    alt: "South Glass - Makar Sankranti",
  },
  {
    image: asset("hopetrust creative.png"),
    alt: "It's Nothing - What you dismiss matters",
  },
  {
    image: asset("sportex creativer.png"),
    alt: "HITEX SportExpo",
  },
];

const InstagramCard = ({
  post,
  index,
  isCenter,
}: {
  post: (typeof posts)[number];
  index: number;
  isCenter: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{
      duration: 0.7,
      delay: index * 0.15,
      ease: [0.16, 1, 0.3, 1],
    }}
    className={`bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] overflow-hidden w-[280px] sm:w-[320px] md:w-[360px] lg:w-[396px] flex-shrink-0 ${
      isCenter ? "lg:scale-110 lg:z-10" : "lg:scale-100"
    }`}
  >
    {/* Instagram Header */}
    <div className="flex items-center justify-between px-3 py-2.5">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-gray-200 flex items-center justify-center p-1 relative">
          <Image
            src={ADMIRATE_LOGO}
            alt="Admirate"
            width={32}
            height={32}
            className="object-contain w-full h-full"
          />
        </div>
        <span className="text-xs font-semibold font-inter text-gray-900">
          Admirate
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold font-inter text-white bg-blue-500 rounded px-2.5 py-0.5 uppercase tracking-wide">
          Follow
        </span>
        <svg
          className="w-4 h-4 text-gray-900"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="19" r="1.5" />
        </svg>
      </div>
    </div>

    {/* Post Image */}
    <div className="relative w-full aspect-square bg-gray-100">
      <Image
        src={post.image}
        alt={post.alt}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 280px, (max-width: 1024px) 300px, 320px"
      />
    </div>

    {/* Instagram Actions */}
    <div className="px-3 pt-2.5 pb-1">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3.5">
          {/* Heart */}
          <svg
            className="w-5 h-5 text-gray-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
            />
          </svg>
          {/* Comment */}
          <svg
            className="w-5 h-5 text-gray-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
            />
          </svg>
          {/* Share */}
          <svg
            className="w-5 h-5 text-gray-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
            />
          </svg>
        </div>
        {/* Bookmark */}
        <svg
          className="w-5 h-5 text-gray-900"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"
          />
        </svg>
      </div>

      {/* Likes */}
      <div className="flex items-center gap-1.5 mb-1">
        <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
        <span className="text-xs font-inter text-gray-900 font-semibold">
          362 likes
        </span>
      </div>

      {/* Caption */}
      <p className="text-[10px] font-inter text-gray-900 pb-2.5">
        <span className="font-semibold">Admirate creators</span>{" "}
        <span className="text-blue-900">#hashtag</span>{" "}
        <span className="text-blue-900">#loremipsum</span>
      </p>
    </div>
  </motion.div>
);

export default function ContentSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("div")?.clientWidth || 280;
    el.scrollBy({
      left: direction === "left" ? -cardWidth - 24 : cardWidth + 24,
      behavior: "smooth",
    });
    setTimeout(checkScroll, 400);
  };

  return (
    <section className="py-20 sm:py-28 bg-white overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Cards row */}
        <div className="relative flex justify-center items-center gap-6 lg:gap-10">
          {/* Decorative orange curves - left */}
          <svg
            className="absolute left-[28%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-20 h-40 hidden lg:block"
            viewBox="0 0 80 160"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M60 10 C20 40, 20 120, 60 150"
              stroke="#F97316"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M70 10 C30 40, 30 120, 70 150"
              stroke="#F97316"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
          </svg>

          {/* Decorative orange curves - right */}
          <svg
            className="absolute right-[28%] top-1/2 -translate-y-1/2 translate-x-1/2 w-20 h-40 hidden lg:block"
            viewBox="0 0 80 160"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M20 10 C60 40, 60 120, 20 150"
              stroke="#F97316"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M10 10 C50 40, 50 120, 10 150"
              stroke="#F97316"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
          </svg>

          {/* Left arrow - mobile/tablet only */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition disabled:opacity-0 disabled:pointer-events-none lg:hidden"
            aria-label="Scroll left"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right arrow - mobile/tablet only */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition disabled:opacity-0 disabled:pointer-events-none lg:hidden"
            aria-label="Scroll right"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Mobile: horizontal scroll, Desktop: flex row */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 lg:gap-10 overflow-x-auto lg:overflow-visible scrollbar-hide snap-x snap-mandatory lg:snap-none px-4 lg:px-0 items-center scroll-smooth"
          >
            {posts.map((post, i) => (
              <InstagramCard
                key={i}
                post={post}
                index={i}
                isCenter={i === 1}
              />
            ))}
          </div>
        </div>

        {/* Folder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mt-64 sm:mt-72"
        >
          <Folder
            color="#DC2626"
            size={2}
            className="sm:scale-[1.5] lg:scale-[2.5]"
            items={[
              <Image
                key="creative-1"
                src="https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/creatives/1@72x-100.jpg"
                alt="Admirate creative 1"
                fill
                className="object-cover"
              />,
              <Image
                key="creative-2"
                src="https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/creatives/3a.jpg"
                alt="Admirate creative 2"
                fill
                className="object-cover"
              />,
              <Image
                key="creative-3"
                src="https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/creatives/5.jpg"
                alt="Admirate creative 3"
                fill
                className="object-cover"
              />,
            ]}
          />
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mt-14 sm:mt-16"
        >
          <p className="text-gray-600 font-inter text-base sm:text-lg italic mb-6">
            To view more of our content
          </p>
          <MagneticButton>
            <a
              href="#contact"
              className="relative inline-flex items-center justify-center px-8 py-3 bg-gray-900 text-white text-sm sm:text-base font-medium font-inter rounded-md overflow-hidden group"
              tabIndex={0}
              aria-label="Connect with us"
            >
              <span className="relative z-10 transition-colors duration-300">
                Connect with us
              </span>
              <span className="absolute inset-0 z-0 bg-red-600 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
            </a>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
