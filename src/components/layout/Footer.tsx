import styles from "./Footer.module.css";

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.logo}>ADMIRATE</div>
        <p className={styles.copy}>
          &copy; {year} Admirate. Advertising, done the right way.
        </p>
        <ul className={styles.links}>
          {footerLinks.map((l) => (
            <li key={l.label}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
