import { motion } from "framer-motion";
import { useState } from "react";
import * as Icons from "lucide-react";
import clsx from "clsx";

const FALLBACK_GRADIENTS = {
  adventure: "radial-gradient(ellipse at 30% 30%, rgba(184,106,77,0.3) 0%, rgba(11,11,15,0.8) 100%)",
  cultural: "radial-gradient(ellipse at 30% 30%, rgba(106,140,184,0.3) 0%, rgba(11,11,15,0.8) 100%)",
  entertainment: "radial-gradient(ellipse at 30% 30%, rgba(140,77,184,0.3) 0%, rgba(11,11,15,0.8) 100%)",
  knowledge: "radial-gradient(ellipse at 30% 30%, rgba(77,184,140,0.3) 0%, rgba(11,11,15,0.8) 100%)",
};

export default function ThemeCard({ theme, selected, onSelect }) {
  const [imgError, setImgError] = useState(false);
  const LucideIcon = Icons[theme.icon] || Icons.Compass;

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={() => onSelect(theme)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(theme)}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      aria-label={`Select ${theme.label} theme`}
      className={clsx(
        "glass-panel glass-panel-interactive rounded-[var(--radius-card)] overflow-hidden cursor-pointer group",
        "focus-visible:outline-[var(--color-accent-hover)]",
        selected && "border-[rgba(184,106,77,0.6)] glow-accent-strong"
      )}
    >
      {/* Image area */}
      <div className="relative h-52 overflow-hidden">
        {!imgError ? (
          <img
            src={theme.image}
            alt={`${theme.label} theme`}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: FALLBACK_GRADIENTS[theme.id] }}
          >
            <LucideIcon
              size={56}
              style={{ color: "var(--color-accent)", opacity: 0.7 }}
            />
          </div>
        )}
        {/* Bottom fade so text reads cleanly over any image */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[rgba(11,11,15,0.9)] to-transparent" />

        {/* Selected badge */}
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "var(--color-accent)" }}
            aria-hidden="true"
          >
            <Icons.Check size={14} style={{ color: "var(--color-bg-primary)" }} />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className="text-lg font-semibold mb-1.5"
          style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
        >
          {theme.label}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {theme.description}
        </p>

        {/* Accent underline that appears on hover/selection */}
        <div
          className={clsx(
            "mt-4 h-px transition-all duration-300",
            selected ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
          )}
          style={{ background: "linear-gradient(to right, var(--color-accent), transparent)" }}
        />
      </div>
    </motion.div>
  );
}
