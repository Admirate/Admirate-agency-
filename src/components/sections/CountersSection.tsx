"use client";

import { useEffect, useRef } from "react";
import styles from "./CountersSection.module.css";

type Counter = {
  target: number | null;
  suffix: string;
  label: string;
  text?: string;
};

const COUNTERS: Counter[] = [
  { target: 10, suffix: "+", label: "Brands worked with" },
  { target: 50, suffix: "+", label: "Projects delivered" },
  { target: null, suffix: "", label: "At your service", text: "Experts" },
  { target: 98, suffix: "%", label: "Client retention rate" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;

    (async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const gsap = (await import("gsap")).default;
      gsap.registerPlugin(ScrollTrigger);

      const st = ScrollTrigger.create({
        trigger: el,
        start: "top 82%",
        once: true,
        onEnter: () => {
          const start = Date.now();
          const dur = 1800;
          const tick = () => {
            const p = Math.min((Date.now() - start) / dur, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * ease) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          tick();
        },
      });
      cleanup = () => st.kill();
    })();

    return () => cleanup?.();
  }, [target, suffix]);

  return (
    <div ref={ref} className={styles.val}>
      0
    </div>
  );
}

export default function CountersSection() {
  return (
    <section id="counters" className={styles.counters}>
      <div className={styles.grid}>
        {COUNTERS.map((c, i) => (
          <div key={i} className={`${styles.item} fade-up`}>
            {c.target !== null ? (
              <AnimatedCounter target={c.target} suffix={c.suffix} />
            ) : (
              <div className={`${styles.val} ${styles.text}`}>{c.text}</div>
            )}
            <div className={styles.label}>{c.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
