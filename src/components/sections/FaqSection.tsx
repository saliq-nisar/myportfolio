"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RevealFade from "@/components/ui/RevealFade";
import SectionHeading from "@/components/ui/SectionHeading";
import { faq } from "@/data/faq";

function FaqRow({
  index,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const buttonId = `faq-question-${index}`;
  const panelId = `faq-answer-${index}`;

  return (
    <div className="card overflow-hidden rounded-xl">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          <span className="font-display text-base font-medium text-foreground">
            {question}
          </span>
          <span
            aria-hidden
            className={`shrink-0 font-mono text-lg text-accent transition-transform ${
              isOpen ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-muted">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="mx-auto max-w-3xl px-6 py-20 sm:py-28 lg:py-36"
    >
      <RevealFade>
        <SectionHeading eyebrow="FAQ" title="Questions, Answered." />
      </RevealFade>

      <div className="flex flex-col gap-3">
        {faq.map((item, i) => (
          <FaqRow
            key={item.question}
            index={i}
            question={item.question}
            answer={item.answer}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
          />
        ))}
      </div>
    </section>
  );
}
