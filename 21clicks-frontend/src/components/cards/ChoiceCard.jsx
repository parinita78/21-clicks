import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";

const CARD_LETTERS = ["A", "B", "C", "D"];

export default function ChoiceCard({ option, index, onSelect, disabled }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={!disabled ? { y: -4, scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={() => !disabled && onSelect(option)}
      onKeyDown={(e) => !disabled && (e.key === "Enter" || e.key === " ") && onSelect(option)}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label={`Choice ${CARD_LETTERS[index]}: ${option}`}
      aria-disabled={disabled}
      className={clsx(
        "glass-panel rounded-[var(--radius-card)] p-5 flex gap-4 items-start",
        "transition-all duration-250 select-none",
        !disabled
          ? "cursor-pointer hover:border-[rgba(184,106,77,0.5)] hover:bg-[rgba(184,106,77,0.06)] hover:shadow-[0_0_20px_rgba(184,106,77,0.18)]"
          : "opacity-50 cursor-not-allowed"
      )}
    >
      {/* Letter badge */}
      <span
        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mt-0.5"
        style={{
          background: "rgba(184,106,77,0.15)",
          border: "1px solid rgba(184,106,77,0.35)",
          color: "var(--color-accent-hover)",
          fontFamily: "var(--font-display)",
        }}
        aria-hidden="true"
      >
        {CARD_LETTERS[index]}
      </span>

      {/* Choice text */}
      <p
        className="flex-1 text-sm leading-relaxed"
        style={{ fontFamily: "var(--font-serif)", color: "var(--color-text-primary)", fontSize: "0.95rem" }}
      >
        {option}
      </p>

      {/* Arrow — slides in on hover via group */}
      <ArrowRight
        size={16}
        className="shrink-0 mt-1 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
        style={{ color: "var(--color-accent)" }}
        aria-hidden="true"
      />
    </motion.div>
  );
}
