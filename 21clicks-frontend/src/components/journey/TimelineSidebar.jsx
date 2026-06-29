import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import { truncate } from "../../utils/helpers.js";

function ChoiceLogItem({ step, choice }) {
  return (
    <div className="flex gap-3 items-start py-3 border-b border-[rgba(255,255,255,0.05)] last:border-0">
      <span
        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
        style={{
          background: "rgba(184,106,77,0.2)",
          border: "1px solid rgba(184,106,77,0.4)",
          color: "var(--color-accent)",
          fontFamily: "var(--font-display)",
        }}
      >
        {step}
      </span>
      <p
        className="text-xs leading-relaxed"
        style={{ color: "var(--color-text-secondary)", fontFamily: "var(--font-serif)", fontSize: "0.8rem" }}
      >
        {truncate(choice, 80)}
      </p>
    </div>
  );
}

/**
 * Desktop: collapsible left rail.
 * Mobile: hidden by default, toggled via the floating button.
 */
export default function TimelineSidebar({ choices = [] }) {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex relative h-full">
        <AnimatePresence initial={false}>
          {open && (
            <motion.aside
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden shrink-0"
              aria-label="Your story journey so far"
            >
              <div
                className="w-60 h-full glass-panel rounded-[var(--radius-card)] p-4 overflow-y-auto"
                style={{ minHeight: 0 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <History size={14} style={{ color: "var(--color-accent)" }} />
                  <h2
                    className="text-xs uppercase tracking-widest font-semibold"
                    style={{ color: "var(--color-accent)" }}
                  >
                    Your Journey
                  </h2>
                </div>

                {choices.length === 0 ? (
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    Your choices will appear here as you decide.
                  </p>
                ) : (
                  choices.map(({ step, choice }) => (
                    <ChoiceLogItem key={step} step={step} choice={choice} />
                  ))
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Toggle button */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Collapse journey sidebar" : "Expand journey sidebar"}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: "var(--color-bg-secondary)",
            border: "1px solid rgba(184,106,77,0.3)",
          }}
        >
          {open ? (
            <ChevronLeft size={14} style={{ color: "var(--color-accent)" }} />
          ) : (
            <ChevronRight size={14} style={{ color: "var(--color-accent)" }} />
          )}
        </button>
      </div>

      {/* Mobile: floating drawer */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="View journey timeline"
          className="fixed bottom-6 left-4 z-50 glass-panel rounded-xl px-3 py-2 flex items-center gap-2 text-xs font-semibold"
          style={{ color: "var(--color-accent)", border: "1px solid rgba(184,106,77,0.35)" }}
        >
          <History size={12} />
          Journey ({choices.length})
        </button>

        <AnimatePresence>
          {open && choices.length > 0 && (
            <>
              {/* Scrim */}
              <motion.div
                key="scrim"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-40"
                style={{ background: "rgba(11,11,15,0.7)" }}
              />
              {/* Drawer */}
              <motion.aside
                key="drawer"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 280 }}
                className="fixed bottom-0 left-0 right-0 z-50 glass-panel rounded-t-2xl p-6 max-h-[60vh] overflow-y-auto"
                aria-label="Journey timeline"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-sm uppercase tracking-widest"
                    style={{ color: "var(--color-accent)", fontFamily: "var(--font-display)" }}
                  >
                    Your Journey
                  </h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-xs"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    Close
                  </button>
                </div>
                {choices.map(({ step, choice }) => (
                  <ChoiceLogItem key={step} step={step} choice={choice} />
                ))}
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
