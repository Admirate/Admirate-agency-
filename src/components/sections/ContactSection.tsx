"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import styles from "./ContactSection.module.css";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be under 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(20, "Phone number is too long").optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be under 2000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const [note, setNote] = useState("Opens WhatsApp with your message pre-filled.");
  const [sending, setSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const submit = useCallback(
    async (data: ContactFormData) => {
      setSending(true);
      try {
        await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } catch {
        // WhatsApp remains the primary path even if this fails
      }

      const text = `Hi Admirate, I'd like to start a project.%0A%0AName: ${encodeURIComponent(data.name)}%0AEmail: ${encodeURIComponent(data.email)}${data.phone ? `%0APhone: ${encodeURIComponent(data.phone)}` : ""}%0A%0A${encodeURIComponent(data.message)}`;
      window.open(`https://wa.me/918374494954?text=${text}`, "_blank");

      setNote("Opening WhatsApp…");
      setSending(false);
      reset();
    },
    [reset]
  );

  return (
    <section id="contact" className={styles.contact}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <div className="eyebrow fade-up">
            <span className="idx">07</span> Get in Touch
          </div>
          <h2 className="h2 fade-up">Tell us what you&apos;re building.</h2>
          <p className="lead fade-up" style={{ marginTop: "16px" }}>
            Have a project in mind? Let&apos;s talk. We&apos;ll get back to you within 24 hours.
          </p>
          <div className={`${styles.details} fade-up`}>
            <div className={styles.row}>
              <span>✉</span>
              <span>hello@admirate.in</span>
            </div>
            <div className={styles.row}>
              <span>📞</span>
              <span>+91 83744 94954</span>
            </div>
            <div className={styles.row}>
              <span>📍</span>
              <span>India</span>
            </div>
          </div>
          <a
            href="https://wa.me/918374494954"
            className="btn-red fade-up"
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginTop: "24px", width: "fit-content" }}
          >
            Chat on WhatsApp
            <svg viewBox="0 0 24 24" stroke="#fff" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <form className={`${styles.form} fade-up`} onSubmit={handleSubmit(submit)} noValidate>
          <div className={styles.field}>
            <label htmlFor="f-name">Name</label>
            <input id="f-name" type="text" placeholder="Your name" {...register("name")} />
            {errors.name && <p className={styles.error}>{errors.name.message}</p>}
          </div>
          <div className={styles.field}>
            <label htmlFor="f-email">Email</label>
            <input id="f-email" type="email" placeholder="your@email.com" {...register("email")} />
            {errors.email && <p className={styles.error}>{errors.email.message}</p>}
          </div>
          <div className={styles.field}>
            <label htmlFor="f-phone">Phone (optional)</label>
            <input id="f-phone" type="tel" placeholder="+91" {...register("phone")} />
            {errors.phone && <p className={styles.error}>{errors.phone.message}</p>}
          </div>
          <div className={styles.field}>
            <label htmlFor="f-msg">Message</label>
            <textarea id="f-msg" placeholder="Tell us about your project…" {...register("message")} />
            {errors.message && <p className={styles.error}>{errors.message.message}</p>}
          </div>
          <button type="submit" className="btn-red" disabled={sending} style={{ width: "100%", justifyContent: "center" }}>
            {sending ? "Sending..." : "Send via WhatsApp"}
            <svg viewBox="0 0 24 24" stroke="#fff" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <div className={styles.note}>{note}</div>
        </form>
      </div>
    </section>
  );
}
