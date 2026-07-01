"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be under 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(20, "Phone number is too long").optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message must be under 2000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

type SubmitStatus = "idle" | "loading" | "success" | "error";

const inputStyle = {
  background: "#fff",
  border: "1px solid var(--hair)",
  borderRadius: 2,
  color: "var(--ink)",
  fontFamily: "var(--body)",
};

export default function ContactSection() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const handleFormSubmit = useCallback(async (data: ContactFormData) => {
    setStatus("loading");
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch {
      // Save silently, WhatsApp is primary action
    }

    const text = `Hi, I'm ${data.name}.%0A%0AEmail: ${data.email}${data.phone ? `%0APhone: ${data.phone}` : ""}%0A%0A${encodeURIComponent(data.message)}`;
    window.open(`https://wa.me/918374494954?text=${text}`, "_blank");

    setStatus("success");
    setStatusMessage("Message sent! We'll get back to you soon.");
    reset();
  }, [reset]);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--red)";
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--hair)";
  };

  return (
    <section
      id="contact"
      style={{ padding: "clamp(80px,10vw,140px) var(--pad)", background: "var(--paper)" }}
    >
      <div
        className="con-inner mx-auto grid items-start gap-20"
        style={{ maxWidth: "var(--maxw)", gridTemplateColumns: "1fr 1fr" }}
      >
        {/* Left */}
        <div>
          <div className="eyebrow fade-up">
            <span style={{ color: "var(--ink)" }}>07</span> Get in Touch
          </div>
          <h2 className="h2 fade-up">Tell us what you&apos;re building.</h2>
          <p className="lead fade-up mt-4">
            Have a project in mind? Let&apos;s talk. We&apos;ll get back to you within 24 hours.
          </p>

          <div className="fade-up mt-8 flex flex-col gap-4">
            <a href="mailto:hello@admirate.in" className="flex items-center gap-3 group">
              <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="var(--grey)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
              <span className="text-sm transition-colors duration-200 group-hover:text-[var(--red)]" style={{ color: "var(--ink-2)" }}>hello@admirate.in</span>
            </a>
            <a href="tel:+918374494954" className="flex items-center gap-3 group">
              <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="var(--grey)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
              </svg>
              <span className="text-sm transition-colors duration-200 group-hover:text-[var(--red)]" style={{ color: "var(--ink-2)" }}>+91 83744 94954</span>
            </a>
            <div className="flex items-center gap-3">
              <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="var(--grey)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="text-sm" style={{ color: "var(--ink-2)" }}>India</span>
            </div>
          </div>

          <div className="fade-up mt-8">
            <a
              href="https://wa.me/918374494954"
              className="btn-red"
              target="_blank"
              rel="noopener noreferrer"
              style={{ width: "fit-content" }}
            >
              Chat on WhatsApp
              <svg viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Right - Form */}
        <form
          className="fade-up flex flex-col gap-[18px]"
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-name" className="font-mono text-[9.5px] tracking-[.15em] uppercase" style={{ color: "var(--grey)" }}>
              Name
            </label>
            <input
              id="f-name"
              type="text"
              placeholder="Your name"
              {...register("name")}
              className="px-3.5 py-3 text-sm outline-none transition-colors duration-250"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {errors.name && <p className="text-xs" style={{ color: "var(--red)" }}>{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-email" className="font-mono text-[9.5px] tracking-[.15em] uppercase" style={{ color: "var(--grey)" }}>
              Email
            </label>
            <input
              id="f-email"
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              className="px-3.5 py-3 text-sm outline-none transition-colors duration-250"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {errors.email && <p className="text-xs" style={{ color: "var(--red)" }}>{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-phone" className="font-mono text-[9.5px] tracking-[.15em] uppercase" style={{ color: "var(--grey)" }}>
              Phone (optional)
            </label>
            <input
              id="f-phone"
              type="tel"
              placeholder="+91"
              {...register("phone")}
              className="px-3.5 py-3 text-sm outline-none transition-colors duration-250"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {errors.phone && <p className="text-xs" style={{ color: "var(--red)" }}>{errors.phone.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-msg" className="font-mono text-[9.5px] tracking-[.15em] uppercase" style={{ color: "var(--grey)" }}>
              Message
            </label>
            <textarea
              id="f-msg"
              placeholder="Tell us about your project…"
              {...register("message")}
              className="px-3.5 py-3 text-sm outline-none transition-colors duration-250 resize-y"
              style={{ ...inputStyle, minHeight: 130 }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            {errors.message && <p className="text-xs" style={{ color: "var(--red)" }}>{errors.message.message}</p>}
          </div>

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-red w-full justify-center disabled:opacity-50"
          >
            {status === "loading" ? "Sending..." : "Send via WhatsApp"}
            <svg viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <p className="font-mono text-[10px] tracking-[.08em] text-center" style={{ color: "var(--grey)" }}>
            Opens WhatsApp with your message pre-filled.
          </p>

          {status === "success" && (
            <p className="font-mono text-[10px] tracking-[.08em] text-center" style={{ color: "var(--grey)" }}>
              {statusMessage}
            </p>
          )}
          {status === "error" && (
            <p className="font-mono text-[10px] tracking-[.08em] text-center" style={{ color: "var(--red)" }}>
              {statusMessage}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
