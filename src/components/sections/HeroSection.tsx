"use client";

import { useEffect, useRef } from "react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (prefersReduced || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };

    type Particle = {
      x: number; y: number; vx: number; vy: number;
      r: number; a: number; red: boolean;
      reset: () => void; draw: () => void;
    };

    const createParticle = (): Particle => {
      const p: Particle = {
        x: 0, y: 0, vx: 0, vy: 0, r: 0, a: 0, red: false,
        reset() {
          this.x = Math.random() * w;
          this.y = Math.random() * h;
          this.vx = (Math.random() - 0.5) * 0.4;
          this.vy = (Math.random() - 0.5) * 0.4;
          this.r = 0.3 + Math.random() * 0.65;
          this.a = 0.03 + Math.random() * 0.07;
          this.red = Math.random() < 0.1;
        },
        draw() {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          ctx.fillStyle = this.red
            ? `rgba(227,30,36,${this.a})`
            : `rgba(255,255,255,${this.a})`;
          ctx.fill();
          this.x += this.vx;
          this.y += this.vy;
          if (this.x < -5 || this.x > w + 5 || this.y < -5 || this.y > h + 5) {
            this.reset();
          }
        },
      };
      p.reset();
      return p;
    };

    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 110 }, createParticle);

    let animId: number;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => p.draw());
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  useEffect(() => {
    async function run() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        gsap.set(
          [`.${styles.eyebrow}`, `.${styles.sub}`, `.${styles.actions}`, `.${styles.scrollHint}`],
          { opacity: 1, y: 0 }
        );
        gsap.set(`.${styles.line} > span`, { y: "0%" });
        return;
      }

      gsap.to(`.${styles.eyebrow}`, { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out" });
      gsap.to(`.${styles.line} > span`, { y: "0%", duration: 1.1, delay: 0.45, stagger: 0.12, ease: "power4.out" });
      gsap.to(`.${styles.sub}`, { opacity: 1, duration: 1, delay: 0.95, ease: "power2.out" });
      gsap.to(`.${styles.actions}`, { opacity: 1, y: 0, duration: 0.8, delay: 1.3, ease: "power2.out" });
      gsap.to(`.${styles.scrollHint}`, { opacity: 1, duration: 0.8, delay: 1.85, ease: "power2.out" });

      gsap.to(`.${styles.inner}`, {
        yPercent: -22, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(`.${styles.bloom}`, {
        yPercent: -14, scale: 1.15, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(`.${styles.canvas}`, {
        yPercent: -8, ease: "none",
        scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
      });
    }
    run();
  }, []);

  return (
    <section id="hero" className={styles.hero}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.bloom} />
      <div className={styles.inner}>
        <div className={styles.eyebrow}>Strategic Design &amp; Marketing</div>
        <div className={styles.headline}>
          <span className={styles.line}>
            <span>Advertising,</span>
          </span>
          <span className={styles.line}>
            <span>
              done the <span className={styles.red}>right</span>
            </span>
          </span>
          <span className={styles.line}>
            <span>way.</span>
          </span>
        </div>
        <p className={styles.sub}>
          We build brands that people remember — across identity, digital, and everything in between.
        </p>
        <div className={styles.actions}>
          <a href="#work" className={`${styles.link} ${styles.linkPrimary}`}>
            View Work
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#contact" className={styles.link}>
            Start a Project
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
      <div className={styles.scrollHint}>
        <span>Scroll</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.3)" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
