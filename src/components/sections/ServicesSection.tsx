import styles from "./ServicesSection.module.css";

const SERVICES = [
  { n: "01", name: "Visual Identity", body: "Logos, systems, and guidelines that make brands recognisable anywhere." },
  { n: "02", name: "Social Media", body: "Content, strategy and creatives that build presence across every platform." },
  { n: "03", name: "Web Development", body: "Fast, beautiful websites built for conversion and crafted with care." },
  { n: "04", name: "Video Production", body: "Reels, ads, and branded films that stop the scroll and tell the story." },
  { n: "05", name: "Creative Campaigns", body: "Big ideas executed with strategy — from concept to final delivery." },
  { n: "06", name: "Editorial Design", body: "Catalogues, lookbooks, reports — print and digital, crafted to impress." },
  { n: "07", name: "Brand Strategy", body: "Positioning, messaging, and direction that gives every decision clarity." },
  { n: "08", name: "Digital Advertising", body: "Paid campaigns on Meta, Google, and beyond — built to perform." },
];

const ICONS = [
  <svg key="1" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 3v2M12 19v2M3 12h2M19 12h2" /></svg>,
  <svg key="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  <svg key="3" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>,
  <svg key="4" viewBox="0 0 24 24"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>,
  <svg key="5" viewBox="0 0 24 24"><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>,
  <svg key="6" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>,
  <svg key="7" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.4" /></svg>,
  <svg key="8" viewBox="0 0 24 24"><polyline points="3 17 9 11 13 15 21 7" /><polyline points="15 7 21 7 21 13" /></svg>,
];

export default function ServicesSection() {
  return (
    <section id="services" className={styles.services}>
      <div className={styles.head}>
        <div className="eyebrow fade-up" style={{ color: "rgba(255,255,255,.35)" }}>
          <span className="idx" style={{ color: "rgba(255,255,255,.6)" }}>
            02
          </span>{" "}
          What We Do
        </div>
        <h2 className="h2 fade-up" style={{ color: "#fff", maxWidth: "16ch" }}>
          Every service your brand needs.
        </h2>
      </div>
      <div className={styles.grid}>
        {SERVICES.map((s, i) => (
          <div key={s.n} className={`${styles.card} fade-up`}>
            <div className={styles.top}>
              <span className={styles.num}>{s.n}</span>
              <span className={styles.ico}>{ICONS[i]}</span>
            </div>
            <h3>{s.name}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
