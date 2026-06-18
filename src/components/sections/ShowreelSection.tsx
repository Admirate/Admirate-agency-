"use client";

import { motion } from "framer-motion";
import { video } from "@/lib/cdn";

export default function ShowreelSection() {
  return (
    <section className="bg-white">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full overflow-hidden"
      >
        <video
          src={video("finalvideotoupdateonnewdesign.mp4")}
          muted
          loop
          playsInline
          autoPlay
          className="w-full h-auto"
        />
      </motion.div>
    </section>
  );
}
