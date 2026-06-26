"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

const LineMask = ({ children, delay = 0, className = "", as: Tag = "span" }: Props) => {
  const ref = useRef<HTMLElement>(null);
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

  const TagEl = Tag as keyof React.JSX.IntrinsicElements;

  return (
    <TagEl
      ref={ref as React.RefObject<HTMLElement>}
      className={`reveal-mask ${inView ? "in-view" : ""} ${className}`}
    >
      <span style={{ animationDelay: `${delay}ms` }}>{children}</span>
    </TagEl>
  );
};

export default LineMask;
