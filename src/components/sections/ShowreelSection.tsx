"use client";

import { motion } from "framer-motion";

export default function ShowreelSection() {
  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full aspect-video rounded-2xl overflow-hidden"
        >
          <video
            src="https://mshehtxywddtdxxkbnuu.supabase.co/storage/v1/object/public/videos/finalvideo.mp4"
            muted
            loop
            playsInline
            autoPlay
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
