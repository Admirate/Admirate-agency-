"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Canvas particles
    if (!prefersReduced && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        let w = 0, h = 0;
        const resize = () => {
          w = canvas.width = canvas.offsetWidth;
          h = canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

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
              ctx!.beginPath();
              ctx!.arc(this.x, this.y, this.r, 0, Math.PI * 2);
              ctx!.fillStyle = this.red
                ? `rgba(227,30,36,${this.a})`
                : `rgba(255,255,255,${this.a})`;
              ctx!.fill();
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

        const particles = Array.from({ length: 110 }, createParticle);
        let animId: number;
        const loop = () => {
          ctx.clearRect(0, 0, w, h);
          particles.forEach((p) => p.draw());
          animId = requestAnimationFrame(loop);
        };
        animId = requestAnimationFrame(loop);

        return () => {
          cancelAnimationFrame(animId);
          window.removeEventListener("resize", resize);
        };
      }
    }
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      document.querySelectorAll(".hero-eyebrow, .hero-sub, .hero-actions, #scrollHint").forEach((el) => {
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "none";
      });
      document.querySelectorAll(".hero-headline .line span").forEach((el) => {
        (el as HTMLElement).style.transform = "none";
      });
      return;
    }

    const timer = setTimeout(() => {
      gsap.to(".hero-eyebrow", { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out" });
      gsap.to(".hero-headline .line span", { y: "0%", duration: 1.1, delay: 0.45, stagger: 0.12, ease: "power4.out" });
      gsap.to(".hero-sub", { opacity: 1, duration: 1, delay: 0.95, ease: "power2.out" });
      gsap.to(".hero-actions", { opacity: 1, y: 0, duration: 0.8, delay: 1.3, ease: "power2.out" });
      gsap.to("#scrollHint", { opacity: 1, duration: 0.8, delay: 1.85, ease: "power2.out" });
    }, 100);

    const parallaxInner = gsap.to(".hero-inner", {
      yPercent: -22,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
    });
    const parallaxBloom = gsap.to(".hero-bloom", {
      yPercent: -14,
      scale: 1.15,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
    });
    const parallaxCanvas = gsap.to("#hero-canvas", {
      yPercent: -8,
      ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true },
    });

    return () => {
      clearTimeout(timer);
      parallaxInner.scrollTrigger?.kill();
      parallaxBloom.scrollTrigger?.kill();
      parallaxCanvas.scrollTrigger?.kill();
    };
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex items-center justify-center text-center overflow-hidden"
      style={{ minHeight: "100svh", background: "#0C0C0D" }}
    >
      <canvas
        ref={canvasRef}
        id="hero-canvas"
        className="absolute inset-0 w-full h-full"
        style={{ willChange: "transform" }}
      />
      <div
        className="hero-bloom absolute pointer-events-none"
        style={{
          width: 640,
          height: 640,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(227,30,36,.12) 0%, transparent 70%)",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          willChange: "transform",
        }}
      />

      <div className="hero-inner relative z-[1]" style={{ padding: `0 var(--pad)`, willChange: "transform" }}>
        <div
          className="hero-eyebrow font-mono text-[11px] tracking-[.18em] uppercase mb-7"
          style={{ color: "rgba(255,255,255,.4)", opacity: 0, transform: "translateY(14px)" }}
        >
          Strategic Design & Marketing
        </div>

        <div className="hero-headline mb-6">
          <span className="line overflow-hidden block">
            <span
              className="block font-disp font-black leading-[.92] text-white"
              style={{
                fontStretch: "expanded",
                fontSize: "clamp(40px, 8.5vw, 110px)",
                letterSpacing: "-.04em",
                transform: "translateY(100%)",
              }}
            >
              Advertising,
            </span>
          </span>
          <span className="line overflow-hidden block">
            <span
              className="block font-disp font-black leading-[.92] text-white"
              style={{
                fontStretch: "expanded",
                fontSize: "clamp(40px, 8.5vw, 110px)",
                letterSpacing: "-.04em",
                transform: "translateY(100%)",
              }}
            >
              done the <span style={{ color: "var(--red)" }}>right</span>
            </span>
          </span>
          <span className="line overflow-hidden block">
            <span
              className="block font-disp font-black leading-[.92] text-white"
              style={{
                fontStretch: "expanded",
                fontSize: "clamp(40px, 8.5vw, 110px)",
                letterSpacing: "-.04em",
                transform: "translateY(100%)",
              }}
            >
              way.
            </span>
          </span>
        </div>

        <p
          className="hero-sub mx-auto mb-9"
          style={{
            fontSize: "clamp(15px, 1.6vw, 19px)",
            color: "rgba(255,255,255,.45)",
            maxWidth: "40ch",
            opacity: 0,
          }}
        >
          We build brands that people remember — across identity, digital, and everything in between.
        </p>

        <div
          className="hero-actions flex gap-6 justify-center items-center flex-wrap"
          style={{ opacity: 0, transform: "translateY(12px)" }}
        >
          <a
            href="#work"
            className="font-mono text-[11.5px] tracking-[.14em] uppercase inline-flex items-center gap-[7px] pb-[2px] transition-colors duration-250"
            style={{
              color: "rgba(255,255,255,.85)",
              borderBottom: "1px solid rgba(255,255,255,.35)",
            }}
          >
            View Work
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="#contact"
            className="font-mono text-[11.5px] tracking-[.14em] uppercase inline-flex items-center gap-[7px] pb-[2px] transition-colors duration-250"
            style={{
              color: "rgba(255,255,255,.5)",
              borderBottom: "1px solid rgba(255,255,255,.18)",
            }}
          >
            Start a Project
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <div
        id="scrollHint"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
      >
        <span className="font-mono text-[9px] tracking-[.2em] uppercase" style={{ color: "rgba(255,255,255,.25)" }}>
          Scroll
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,.3)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-bounce"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </div>
    </section>
  );
}
