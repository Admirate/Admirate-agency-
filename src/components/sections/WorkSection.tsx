"use client";

import { useEffect, useState } from "react";
import styles from "./WorkSection.module.css";

type Project = {
  n: string;
  client: string;
  title: string;
  tags: string[];
  url: string;
  screenshot: string;
};

const FALLBACK_PROJECTS: Project[] = [
  { n: "01", client: "Hitex Sports Expo", title: "Sportex", tags: ["Web", "Brand", "Event"], url: "https://sportex.in", screenshot: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fsportex.in%2F?w=1200" },
  { n: "02", client: "Patil Group", title: "Patil Group", tags: ["Real Estate", "Web", "Campaign"], url: "https://patilgroup.com", screenshot: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fpatilgroup.com%2F?w=1200" },
  { n: "03", client: "Hope Trust India", title: "Hope Trust", tags: ["NGO", "Brand", "Digital"], url: "https://hopetrustindia.com", screenshot: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fhopetrustindia.com%2F?w=1200" },
  { n: "04", client: "South Glass", title: "South Glass", tags: ["Identity", "Web"], url: "https://southglass.in", screenshot: "https://s0.wp.com/mshots/v1/https%3A%2F%2Fsouthglass.in%2F?w=1200" },
  { n: "05", client: "Our Sacred Space", title: "Sacred Space", tags: ["Wellness", "Brand", "Social"], url: "https://oursacredspace.in", screenshot: "https://s0.wp.com/mshots/v1/https%3A%2F%2Foursacredspace.in%2F?w=1200" },
];

export default function WorkSection() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/portfolio");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setProjects(
            data.map(
              (
                p: { image_url: string; title: string; tags: string[]; external_url: string },
                i: number
              ) => ({
                n: String(i + 1).padStart(2, "0"),
                client: p.title,
                title: p.title,
                tags: p.tags,
                url: p.external_url,
                screenshot: p.image_url,
              })
            )
          );
        }
      } catch {
        // keep fallback
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="work" className={styles.work}>
      <div className={styles.head}>
        <div>
          <div className="eyebrow fade-up">
            <span className="idx">03</span> Selected Work
          </div>
          <h2 className="h2 fade-up">Projects that moved the needle.</h2>
        </div>
      </div>
      <div className={styles.list}>
        {projects.map((p) => (
          <a key={p.n} className={`${styles.item} fade-up`} href={p.url} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.shot}
              src={p.screenshot}
              alt=""
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className={styles.num}>{p.n}</span>
            <div className={styles.left}>
              <div className={styles.client}>{p.client}</div>
              <div className={styles.title}>{p.title}</div>
              <div className={styles.tags}>
                {p.tags.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.arrow}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7M7 7h10v10" />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
