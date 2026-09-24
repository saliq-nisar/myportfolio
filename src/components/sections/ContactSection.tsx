"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { profile } from "@/data/profile";

const EMAIL = profile.email;
const PHONE = profile.phone;
const LINKEDIN = profile.linkedin;

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name || "a visitor"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <section
      id="contact"
      aria-label="Contact"
      className="mx-auto max-w-2xl px-6 py-20 text-center sm:py-28 lg:py-36"
    >
      <div>
        <span className="font-mono text-xs tracking-[0.3em] text-muted uppercase">
          Contact
        </span>
        <h2 className="mt-3 font-display text-4xl font-semibold text-foreground sm:text-5xl">
          Let&apos;s Build Something Useful.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-muted">
          I&apos;m always interested in working on challenging products,
          solving real problems, and building experiences that people enjoy
          using.
        </p>
      </div>

      <div>
        <div className="mt-8 flex flex-col items-center gap-2 text-sm">
          <a
            href={`mailto:${EMAIL}`}
            className="text-foreground/80 transition-colors hover:text-accent"
          >
            {EMAIL}
          </a>
          <a
            href={`tel:${PHONE}`}
            className="text-foreground/80 transition-colors hover:text-accent"
          >
            {PHONE}
          </a>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/80 transition-colors hover:text-accent"
          >
            LinkedIn
          </a>
        </div>

        <a
          href={`mailto:${EMAIL}`}
          className="mt-8 inline-block rounded-full bg-accent px-8 py-3 font-mono text-sm font-semibold text-background transition-opacity hover:opacity-90"
        >
          Start a Conversation
        </a>
      </div>

      <div>
        <details className="card mx-auto mt-16 max-w-md rounded-xl p-5 text-left">
          <summary className="cursor-pointer font-mono text-xs tracking-wide text-muted">
            Prefer a form? Click to expand.
          </summary>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
            <input
              required
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-border bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-accent/60"
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-border bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-accent/60"
            />
            <textarea
              required
              rows={3}
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="rounded-lg border border-border bg-white/[0.03] px-3 py-2 text-sm text-foreground outline-none focus:border-accent/60"
            />
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="rounded-full border border-border px-6 py-2 font-mono text-xs font-medium text-foreground transition-colors hover:border-accent/60"
            >
              Send Message
            </motion.button>
            <AnimatePresence>
              {sent && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-mono text-xs text-accent"
                >
                  Opening your email client…
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </details>
      </div>
    </section>
  );
}
