import styles from "./MarqueeSection.module.css";

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
  const repeated = [...marqueeItems, ...marqueeItems];
  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        {repeated.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <span className={styles.gem}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
