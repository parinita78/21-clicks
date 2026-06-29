import { motion, AnimatePresence } from "framer-motion";
import { X, ScrollText } from "lucide-react";

export default function SummaryModal({ open, onClose, summary, theme, category }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80]"
            style={{ background: "rgba(11,11,15,0.75)", backdropFilter: "blur(6px)" }}
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            role="dialog"
            aria-modal="true"
            aria-label="Story so far"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-[90] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-lg glass-panel rounded-[var(--radius-modal)] p-7"
              style={{ border: "1px solid rgba(184,106,77,0.3)" }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(184,106,77,0.15)", border: "1px solid rgba(184,106,77,0.3)" }}
                  >
                    <ScrollText size={16} style={{ color: "var(--color-accent)" }} />
                  </div>
                  <div>
                    <h2
                      className="text-base font-semibold"
                      style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
                    >
                      Story So Far
                    </h2>
                    {theme && category && (
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                        {theme.label} · {category.label}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close summary"
                  className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.06)]"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Copper divider */}
              <div
                className="h-px mb-5"
                style={{ background: "linear-gradient(to right, var(--color-accent), transparent)" }}
              />

              {/* Summary text */}
              <div className="max-h-72 overflow-y-auto pr-1">
                {summary ? (
                  <p
                    className="leading-relaxed text-sm"
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: "var(--color-text-primary)",
                      fontSize: "1rem",
                      lineHeight: "1.8",
                    }}
                  >
                    {summary}
                  </p>
                ) : (
                  <p className="text-sm italic" style={{ color: "var(--color-text-secondary)" }}>
                    Your story summary will appear here after a few decisions have been made.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
