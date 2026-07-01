"use client";

const clients = [
  "Seniors for Change",
  "Hitex Sports Expo",
  "Patil Group",
  "Hope Trust India",
  "South Glass",
  "Our Sacred Space",
  "Avvent Global",
  "Valucor",
];

export default function ClientsSection() {
  return (
    <section
      id="clients"
      className="overflow-hidden"
      style={{ padding: "clamp(60px,8vw,100px) var(--pad)", background: "var(--hair-2)" }}
    >
      <div className="mx-auto mb-11" style={{ maxWidth: "var(--maxw)" }}>
        <div className="eyebrow fade-up">
          <span style={{ color: "var(--ink)" }}>06</span> Clients
        </div>
        <h2
          className="h2 fade-up"
          style={{ fontSize: "clamp(22px, 3vw, 36px)" }}
        >
          Brands that chose to do it right.
        </h2>
      </div>

      {/* Text marquee */}
      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 10%, #000 90%, transparent)",
        }}
      >
        <div
          className="flex items-center gap-16 w-max"
          style={{ animation: "scroll-left 26s linear infinite" }}
        >
          {[0, 1].map((setIndex) =>
            clients.map((name, i) => (
              <span
                key={`${setIndex}-${i}`}
                className="font-disp font-bold whitespace-nowrap transition-colors duration-250 hover:text-[var(--ink)]"
                style={{
                  fontStretch: "expanded",
                  fontSize: "clamp(15px, 2vw, 22px)",
                  letterSpacing: "-.01em",
                  color: "var(--grey)",
                  cursor: "default",
                }}
              >
                {name}
              </span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
