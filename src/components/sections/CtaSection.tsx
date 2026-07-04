import styles from "./CtaSection.module.css";

export default function CtaSection() {
  return (
    <section id="cta-banner" className={styles.banner}>
      <div className={styles.inner}>
        <h2 className="h2" style={{ color: "#fff", marginBottom: "20px" }}>
          Ready to build something
          <br />
          worth seeing?
        </h2>
        <p>Let&apos;s talk about your brand. We&apos;ll get back to you within 24 hours.</p>
        <a href="#contact" className="btn-red" style={{ marginTop: "36px" }}>
          Start a Project
          <svg viewBox="0 0 24 24" stroke="#fff" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </section>
  );
}
