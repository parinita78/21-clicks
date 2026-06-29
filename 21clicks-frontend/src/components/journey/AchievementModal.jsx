import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import * as Icons from "lucide-react";
import Button from "../common/Button.jsx";

export default function AchievementModal({ achievement, onClose }) {
  const LucideIcon = achievement ? (Icons[achievement.icon] || Icons.Star) : Icons.Star;

  return (
    <AnimatePresence>
      {achievement && (
        <>
          {/* Backdrop */}
          <motion.div
            key="ach-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110]"
            style={{ background: "rgba(11,11,15,0.7)", backdropFilter: "blur(8px)" }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="ach-modal"
            role="alertdialog"
            aria-label={`Achievement unlocked: ${achievement?.title}`}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          >
            <div
              className="relative w-full max-w-xs text-center glass-panel rounded-[var(--radius-modal)] p-8"
              style={{ border: "1px solid rgba(184,106,77,0.5)" }}
            >
              {/* Glow burst behind icon */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3 w-48 h-48 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(184,106,77,0.35) 0%, transparent 70%)",
                }}
                aria-hidden="true"
              />

              {/* Dismiss */}
              <button
                onClick={onClose}
                aria-label="Dismiss achievement"
                className="absolute top-4 right-4 p-1 rounded-lg transition-opacity opacity-50 hover:opacity-100"
                style={{ color: "var(--color-text-secondary)" }}
              >
                <X size={16} />
              </button>

              {/* Badge */}
              <motion.div
                initial={{ rotate: -15, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="relative w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "radial-gradient(circle, rgba(184,106,77,0.25) 0%, rgba(184,106,77,0.08) 100%)",
                  border: "2px solid rgba(184,106,77,0.6)",
                  boxShadow: "0 0 32px rgba(184,106,77,0.4)",
                }}
              >
                <LucideIcon size={36} style={{ color: "var(--color-accent-hover)" }} />
              </motion.div>

              {/* Label */}
              <p
                className="text-xs uppercase tracking-widest mb-1"
                style={{ color: "var(--color-accent)" }}
              >
                Achievement Unlocked
              </p>
              <h3
                className="text-2xl mb-1"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--color-text-primary)",
                  lineHeight: 1.2,
                }}
              >
                {achievement?.title}
              </h3>
              <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
                {achievement?.subtitle}
              </p>

              <Button variant="primary" onClick={onClose} size="sm" className="mx-auto" icon={Sparkles}>
                Continue the Story
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
