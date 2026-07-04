"use client";

import { useEffect, useState } from "react";
import styles from "./ProcessSection.module.css";

const STEPS = [
  { n: "01", title: "Discover", body: "We learn your brand, goals, audience, and the gap between where you are and where you want to be." },
  { n: "02", title: "Strategise", body: "Every creative decision grounded in positioning, messaging, and a plan that makes sense for your category." },
  { n: "03", title: "Design", body: "Multiple directions explored before we commit — you see real options, not a single first draft." },
  { n: "04", title: "Execute", body: "From final files to live campaigns — everything produced in-house with full quality control." },
  { n: "05", title: "Scale", body: "We track what works and build on it — your brand grows stronger with every round of work." },
];

const STEP_ICONS = [
  <svg key="1" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>,
  <svg key="2" viewBox="0 0 24 24"><path d="M9 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" /><path d="M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
  <svg key="3" viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>,
  <svg key="4" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>,
  <svg key="5" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
];

export default function ProcessSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    async function run() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      document.querySelectorAll<HTMLElement>("[data-step-idx]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 68%",
          onEnter: () => setActive(parseInt(el.dataset.stepIdx || "0")),
        });
      });
    }
    run();
  }, []);

  return (
    <section id="process" className={styles.process}>
      <div className={styles.bgNum}>{STEPS[active].n}</div>
      <div className={styles.head}>
        <div className="eyebrow fade-up" style={{ color: "rgba(255,255,255,.35)" }}>
          <span className="idx" style={{ color: "rgba(255,255,255,.6)" }}>
            04
          </span>{" "}
          How We Work
        </div>
        <h2 className="h2 fade-up" style={{ color: "#fff" }}>
          Process that removes
          <br />
          guesswork.
        </h2>
      </div>

      <div className={styles.trackWrap}>
        <div className={styles.trackLine}>
          {STEPS.map((_, i) => (
            <div key={i} className={`${styles.node} ${i <= active ? styles.nodeActive : ""}`}>
              <div className={styles.dot} />
              {i < STEPS.length - 1 && <div className={styles.seg} />}
            </div>
          ))}
        </div>

        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              data-step-idx={i}
              className={`${styles.step} ${i === active ? styles.stepActive : ""} fade-up`}
              onClick={() => setActive(i)}
              role="button"
              tabIndex={0}
              aria-label={`Step ${s.n}: ${s.title}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActive(i);
              }}
            >
              <div className={styles.stepN}>{s.n}</div>
              <div className={styles.stepIco}>{STEP_ICONS[i]}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
