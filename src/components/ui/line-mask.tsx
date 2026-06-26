"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "span" | "div";
};

const LineMask = ({ children, delay = 0, className = "", as: Tag = "span" }: Props) => {
  const ref = useRef<HTMLSpanElement | HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return Tag === "div" ? (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal-mask ${inView ? "in-view" : ""} ${className}`}
    >
      <span style={{ animationDelay: `${delay}ms` }}>{children}</span>
    </div>
  ) : (
    <span
      ref={ref as React.RefObject<HTMLSpanElement>}
      className={`reveal-mask ${inView ? "in-view" : ""} ${className}`}
    >
      <span style={{ animationDelay: `${delay}ms` }}>{children}</span>
    </span>
  );
};

export default LineMask;
