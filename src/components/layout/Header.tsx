"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { asset } from "@/lib/cdn";

const navLinks = [
  { num: "01", label: "Work", href: "#work" },
  { num: "02", label: "Services", href: "#services" },
  { num: "03", label: "About", href: "#about" },
  { num: "04", label: "Contact", href: "#contact" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleNavClick = () => setIsOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled
            ? "bg-[var(--c-paper)]/80 backdrop-blur-md border-b border-[var(--c-line)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src={asset("admirate logo.webp")}
              alt="Admirate"
              width={140}
              height={36}
              className="h-7 sm:h-8 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group inline-flex items-baseline gap-1.5 text-sm font-semibold tracking-wide text-[var(--c-ink)] hover:text-[var(--c-red)] transition-colors duration-300"
              >
                <span className="text-[10px] tracking-[0.2em] text-[var(--c-mute)] group-hover:text-[var(--c-red)]/70 transition-colors">
                  {link.num}
                </span>
                <span className="link-underline">{link.label}</span>
              </a>
            ))}
          </nav>

          <button
            className="md:hidden flex flex-col gap-1.5 p-2 relative z-50"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((p) => !p)}
          >
            <span
              className={`block w-6 h-px bg-[var(--c-ink)] transition-all duration-300 ${
                isOpen ? "rotate-45 translate-y-1.5 bg-white" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-[var(--c-ink)] transition-all duration-300 ${
                isOpen ? "-rotate-45 -translate-y-px bg-white" : ""
              }`}
            />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[var(--c-ink)] text-[var(--c-paper)] md:hidden flex flex-col"
          >
            <div className="flex-1 flex flex-col justify-center px-8 pt-24">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={handleNavClick}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.15 + i * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-baseline gap-4 py-3 border-b border-white/10"
                >
                  <span className="text-xs tracking-[0.2em] text-white/40">
                    {link.num}
                  </span>
                  <span className="text-4xl font-editorial italic">
                    {link.label}
                  </span>
                </motion.a>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="px-8 pb-10 flex items-center justify-between text-xs tracking-[0.2em] text-white/60"
            >
              <span>© ADMIRATE · 2026</span>
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-red)] animate-pulse-dot" />
                Open for work
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
