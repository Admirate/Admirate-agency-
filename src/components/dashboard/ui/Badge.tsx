import type { ReactNode } from "react";

type Tone = "neutral" | "active" | "paused" | "brand";

const TONES: Record<Tone, string> = {
  neutral: "bg-warm text-muted border-line",
  active: "bg-brand/5 text-brand border-brand/20",
  paused: "bg-warm text-muted border-line",
  brand: "bg-brand text-white border-transparent",
};

const Badge = ({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) => (
  <span
    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium whitespace-nowrap ${TONES[tone]}`}
  >
    {children}
  </span>
);

export default Badge;
