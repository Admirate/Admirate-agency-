"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import LineMask from "@/components/ui/line-mask";
import MagneticButton from "@/components/ui/MagneticButton";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(20, "Phone number is too long").optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;
type SubmitStatus = "idle" | "loading" | "success" | "error";

const InputField = ({
  id,
  label,
  type = "text",
  placeholder,
  register,
  error,
}: {
  id: keyof ContactFormData;
  label: string;
  type?: string;
  placeholder: string;
  register: ReturnType<typeof useForm<ContactFormData>>["register"];
  error?: string;
}) => (
  <div className="group relative border-b border-[var(--c-ink)]/15 focus-within:border-[var(--c-ink)] transition-colors duration-300">
    <label
      htmlFor={id}
      className="eyebrow block mb-2 text-[var(--c-mute)] group-focus-within:text-[var(--c-ink)] transition-colors"
    >
      {label}
    </label>
    <input
      id={id}
      type={type}
      {...register(id)}
      placeholder={placeholder}
      className="w-full bg-transparent text-[var(--c-ink)] text-xl sm:text-2xl font-editorial italic font-normal placeholder:text-[var(--c-mute)]/60 placeholder:italic outline-none pb-4"
    />
    {error && (
      <p className="absolute -bottom-6 left-0 text-xs text-[var(--c-red)]">
        {error}
      </p>
    )}
  </div>
);

const ContactSection = () => {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        setStatus("error");
        setStatusMessage(result.error || "Something went wrong.");
        return;
      }

      setStatus("success");
      setStatusMessage(result.message || "Thanks — we'll be in touch soon.");
      reset();
    } catch {
      setStatus("error");
      setStatusMessage("Network error. Please try again.");
    }
  };

  return (
    <section
      id="contact"
      className="relative min-h-svh w-full bg-[var(--c-ink)] text-[var(--c-paper)] overflow-hidden bg-grain"
      aria-label="Contact"
    >
      {/* Ambient red glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[15%] top-1/3 w-[60vw] h-[60vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(255,13,13,0.22), rgba(255,13,13,0.06) 35%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pt-28 sm:pt-36 pb-12">
        {/* Top meta */}
        <div className="flex items-start justify-between mb-16 sm:mb-24">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[var(--c-red)] animate-pulse-dot" />
            <span className="eyebrow text-white/70">(09 / 09) — Get in touch</span>
          </div>
          <span className="eyebrow text-white/40 hidden sm:inline">
            Available for new work · 2026 / 27
          </span>
        </div>

        {/* Dramatic headline */}
        <h2 className="h-display text-[clamp(2.5rem,9vw,9rem)] mb-16 sm:mb-24">
          <LineMask as="span" className="block">
            Let&apos;s build
          </LineMask>
          <LineMask as="span" delay={140} className="block">
            something{" "}
            <span className="font-editorial italic font-normal text-[var(--c-red)]">
              worth
            </span>
          </LineMask>
          <LineMask as="span" delay={280} className="block">
            <span className="font-editorial italic font-normal">admiring.</span>
          </LineMask>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-7 space-y-10"
          >
            <InputField
              id="name"
              label="01 — Your name"
              placeholder="Jane Doe"
              register={register}
              error={errors.name?.message}
            />
            <InputField
              id="email"
              label="02 — Email"
              type="email"
              placeholder="jane@brand.com"
              register={register}
              error={errors.email?.message}
            />
            <InputField
              id="phone"
              label="03 — Phone (optional)"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              register={register}
              error={errors.phone?.message}
            />

            <div className="group relative border-b border-[var(--c-ink)]/15 focus-within:border-white transition-colors duration-300">
              <label
                htmlFor="message"
                className="eyebrow block mb-2 text-[var(--c-mute)] group-focus-within:text-white transition-colors"
              >
                04 — Tell us about the project
              </label>
              <textarea
                id="message"
                rows={4}
                {...register("message")}
                placeholder="A brand to launch, a site to build, a campaign to run…"
                className="w-full bg-transparent text-white text-xl sm:text-2xl font-editorial italic font-normal placeholder:text-white/30 placeholder:italic outline-none pb-4 resize-none"
              />
              {errors.message && (
                <p className="absolute -bottom-6 left-0 text-xs text-[var(--c-red)]">
                  {errors.message.message}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-6">
              <MagneticButton>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group relative inline-flex items-center gap-3 rounded-full bg-[var(--c-red)] text-white px-8 py-4 text-sm font-semibold tracking-wide overflow-hidden disabled:opacity-60"
                >
                  <span className="relative z-10">
                    {status === "loading" ? "Sending…" : "Send enquiry"}
                  </span>
                  <span className="relative z-10 inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                    →
                  </span>
                  <span className="absolute inset-0 translate-y-full bg-white text-[var(--c-ink)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                </button>
              </MagneticButton>

              <a
                href="https://wa.me/918374494954"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold tracking-wide text-white/80 link-underline"
              >
                or message us on WhatsApp
              </a>
            </div>

            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-green-300"
              >
                {statusMessage}
              </motion.p>
            )}
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-[var(--c-red)]"
              >
                {statusMessage}
              </motion.p>
            )}
          </form>

          {/* Side meta */}
          <aside className="lg:col-span-5 lg:pl-8 lg:border-l lg:border-white/10 space-y-12">
            <div>
              <p className="eyebrow text-white/40 mb-3">Direct line</p>
              <a
                href="mailto:essentials@admirate.in"
                className="block text-2xl sm:text-3xl font-editorial italic text-white link-underline"
              >
                essentials@admirate.in
              </a>
            </div>
            <div>
              <p className="eyebrow text-white/40 mb-3">Office</p>
              <p className="text-base sm:text-lg text-white/80 leading-relaxed">
                Hyderabad, India
                <br />
                17.3850° N, 78.4867° E
              </p>
            </div>
            <div>
              <p className="eyebrow text-white/40 mb-3">Follow</p>
              <div className="flex flex-col gap-2">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-white/80 link-underline w-fit"
                >
                  Instagram ↗
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-white/80 link-underline w-fit"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="relative z-10 border-t border-white/10 mt-16 overflow-hidden">
        <div className="flex w-max animate-marquee-slow whitespace-nowrap py-8">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="flex items-center">
              {Array.from({ length: 6 }).map((__, j) => (
                <span key={`${idx}-${j}`} className="flex items-center">
                  <span className="text-[clamp(2rem,6vw,5rem)] font-editorial italic px-10 text-white">
                    Available for new work
                  </span>
                  <span className="text-[var(--c-red)] text-3xl">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <span className="eyebrow text-white/40">© ADMIRATE · 2026</span>
        <span className="eyebrow text-white/40">
          Designed & built in-house · Hyderabad
        </span>
      </div>
    </section>
  );
};

export default ContactSection;
