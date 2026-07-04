"use client";

import { useEffect } from "react";
import styles from "./AboutSection.module.css";
import { asset } from "@/lib/cdn";

const CARDS = [
  { icon: "→", title: "End-to-end thinking", body: "From first idea to final output, handled with intent at every step." },
  { icon: "⌀", title: "Long-term partnerships", body: "Not one-off work, but relationships that grow with your brand." },
  { icon: "◉", title: "Chosen by brands", body: "Teams that trusted us to shape how the world sees them." },
  { icon: "◎", title: "Every direction explored", body: "Every creative angle considered before the final call is made." },
];

export default function AboutSection() {
  useEffect(() => {
    async function run() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      gsap.to(`.${styles.right}`, {
        yPercent: -8, ease: "none",
        scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom top", scrub: true },
      });
    }
    run();
  }, []);

  return (
    <section id="about" className={styles.about}>
      <div className={styles.grid}>
        <div>
          <div className="eyebrow fade-up">
            <span className="idx">01</span> Who We Are
          </div>
          <h2 className="h2 fade-up">
            Built for brands
            <br />
            that want to be seen.
          </h2>
          <div className={styles.cards}>
            {CARDS.map((c) => (
              <div key={c.title} className={`${styles.card} fade-up`}>
                <div className={styles.cardIcon}>{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.right}>
          <div className={`${styles.videoWrap} fade-up`}>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className={styles.video}
              src={asset("admirate logo animated.mp4")}
            />
          </div>
          <p className="lead fade-up" style={{ marginTop: "32px" }}>
            ADMIRATE is a strategic design and marketing agency based in India. We work with ambitious brands across identity, digital, social, and advertising — from early-stage startups to established names.
          </p>
          <p className="lead fade-up" style={{ marginTop: "16px", fontSize: "clamp(14px,1.4vw,16px)" }}>
            We don&apos;t just make things look good. We make them work — for your audience, your goals, and your bottom line.
          </p>
          <div className={`${styles.tags} fade-up`}>
            <span className={styles.tag}>admirate.in</span>
            <span className={styles.tag}>India</span>
          </div>
        </div>
      </div>
    </section>
  );
}
