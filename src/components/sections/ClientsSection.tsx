"use client";

import styles from "./ClientsSection.module.css";
import { clientLogo } from "@/lib/cdn";

const CLIENTS = [
  { name: "Hitex Sports Expo", logo: clientLogo("hitex logo.webp") },
  { name: "Patil Group", logo: clientLogo("patilgroup logo.webp") },
  { name: "Hope Trust India", logo: clientLogo("hopetrust logo.webp") },
  { name: "South Glass", logo: clientLogo("southglass logo.webp") },
  { name: "Our Sacred Space", logo: clientLogo("osslogo.png") },
  { name: "Avvent Global", logo: clientLogo("avvent global logo.webp") },
  { name: "Valucor", logo: clientLogo("valucorlogogogo.png") },
  { name: "Zythum", logo: clientLogo("zythum logo.webp") },
  { name: "EUI", logo: clientLogo("EUI LOGO.webp") },
  { name: "AA", logo: clientLogo("AA Logo.webp") },
];

export default function ClientsSection() {
  const repeated = [...CLIENTS, ...CLIENTS];
  return (
    <section id="clients" className={styles.clients}>
      <div className={styles.head}>
        <div className="eyebrow fade-up">
          <span className="idx">06</span> Clients
        </div>
        <h2 className="h2 fade-up" style={{ fontSize: "clamp(22px,3vw,36px)" }}>
          Brands that chose to do it right.
        </h2>
      </div>
      <div className={styles.marquee}>
        <div className={styles.track}>
          {repeated.map((c, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={c.logo} alt={c.name} className={styles.logo} loading="lazy" />
          ))}
        </div>
      </div>
    </section>
  );
}
