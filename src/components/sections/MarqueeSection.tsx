const marqueeItems = [
  "Visual Identity",
  "Social Media",
  "Web Development",
  "Video Production",
  "Creative Campaigns",
  "Editorial Design",
  "Brand Strategy",
  "Digital Advertising",
];

export default function MarqueeSection() {
  return (
    <div
      className="overflow-hidden py-4"
      style={{ background: "var(--ink)" }}
      aria-hidden="true"
    >
      <div
        className="flex items-center w-max"
        style={{ animation: "scroll-left 22s linear infinite" }}
      >
        {[0, 1].map((setIndex) =>
          marqueeItems.map((item, i) => (
            <div
              key={`${setIndex}-${i}`}
              className="font-mono text-[11px] tracking-[.18em] uppercase whitespace-nowrap inline-flex items-center"
              style={{ color: "rgba(255,255,255,.35)" }}
            >
              <span className="px-7">{item}</span>
              <span className="text-[8px] leading-none" style={{ color: "var(--red)" }}>
                ✦
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
