"use client";

import { useEffect, useState } from "react";
import styles from "./SocialCreativesSection.module.css";
import { creative } from "@/lib/cdn";

type Creative = {
  client: string;
  badge: string;
  title: string;
  tags: string[];
  span: "sq" | "land";
  img: string;
};

// NOTE: only 3 distinct creative assets currently exist in Supabase storage;
// they're reused across the 8 documented slots below. Swap in more distinct
// assets under the "creatives" bucket to give every card a unique image.
const CARDS: Creative[] = [
  { client: "Hitex Sports Expo", badge: "Instagram", title: "Event launch post", tags: ["1:1", "Event"], span: "sq", img: creative("1@72x-100.jpg") },
  { client: "Hope Trust India", badge: "Instagram", title: "Awareness post", tags: ["1:1", "Mental Health"], span: "sq", img: creative("3a.jpg") },
  { client: "Hitex Sports Expo", badge: "Instagram", title: "Sportex editorial banner", tags: ["2:1", "Banner"], span: "land", img: creative("5.jpg") },
  { client: "Hitex Sports Expo", badge: "Instagram", title: "Carousel — frame 1", tags: ["1:1", "Carousel"], span: "sq", img: creative("1@72x-100.jpg") },
  { client: "South Glass", badge: "Instagram", title: "Lunar New Year", tags: ["1:1", "Festive"], span: "sq", img: creative("3a.jpg") },
  { client: "Hope Trust India", badge: "Instagram", title: "Carousel — frame 1", tags: ["1:1", "Carousel"], span: "sq", img: creative("5.jpg") },
  { client: "Hope Trust India", badge: "Instagram", title: "Carousel — frame 2", tags: ["1:1", "Carousel"], span: "sq", img: creative("1@72x-100.jpg") },
  { client: "South Glass", badge: "Instagram", title: "Christmas post", tags: ["1:1", "Festive"], span: "land", img: creative("3a.jpg") },
];

const TABS = ["Feed Posts", "Reels Covers"];
const FILTERS = ["All", "Instagram", "LinkedIn", "Facebook"];

export default function SocialCreativesSection() {
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function run() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      document.querySelectorAll<HTMLElement>("[data-sc-card]").forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(card, { opacity: 1, y: 0, duration: 0.6, delay: (i % 4) * 0.07, ease: "power3.out" }),
        });
      });
    }
    run();
  }, []);

  const filtered = filter === "All"
    ? CARDS
    : CARDS.filter((c) => c.badge.toLowerCase() === filter.toLowerCase());

  return (
    <section id="social-creatives" className={styles.section}>
      <div className={styles.header}>
        <div>
          <div className="eyebrow fade-up">03b · Social Creatives</div>
          <h2 className="h2 fade-up">
            Posts that stop
            <br />
            the scroll.
          </h2>
          <p className={`${styles.sub} fade-up`}>
            Thumb-stopping content designed for real brands — not templates.
          </p>
        </div>
        <div className={`${styles.filterRow} fade-up`}>
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.tabs}>
        {TABS.map((t, i) => (
          <button
            key={t}
            className={`${styles.tab} ${activeTab === i ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(i)}
          >
            {t}
          </button>
        ))}
        <div className={styles.tabLine} />
      </div>

      <div className={styles.grid}>
        {filtered.map((c, i) => (
          <article
            key={i}
            data-sc-card
            className={`${styles.card} ${styles[`span_${c.span}`]}`}
            style={{ opacity: 0, transform: "translateY(24px)" }}
          >
            <div className={styles.vis}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt={c.title} loading="lazy" />
            </div>
            <div className={styles.badge}>
              <span>{c.badge}</span>
            </div>
            <div className={styles.overlay}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 3h6v6M10 14L21 3" />
                <path d="M9 21H3V3" />
              </svg>
            </div>
            <div className={styles.meta}>
              <div className={styles.metaClient}>{c.client}</div>
              <div className={styles.metaTitle}>{c.title}</div>
              <div className={styles.metaTags}>
                {c.tags.map((t) => (
                  <span key={t} className={styles.metaTag}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.cta}>
        <div className={styles.ctaTxt}>
          <strong>{filtered.length} creatives shown</strong> · Instagram, LinkedIn &amp; Facebook
        </div>
        <a href="#contact" className={styles.ctaBtn}>
          Get social creatives for your brand
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
