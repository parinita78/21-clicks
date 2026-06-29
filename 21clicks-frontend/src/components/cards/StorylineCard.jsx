import { motion } from "framer-motion";
import { ChevronRight, BookOpen } from "lucide-react";
import clsx from "clsx";
import Button from "../common/Button.jsx";

export default function StorylineCard({ storyline, index, onSelect, loading }) {
  const labels = ["Path One", "Path Two", "Path Three"];
  const romanNumerals = ["I", "II", "III"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
      className={clsx(
        "glass-panel rounded-[var(--radius-card)] overflow-hidden group",
        "transition-all duration-300",
        "hover:border-[rgba(184,106,77,0.4)] hover:shadow-[0_0_24px_rgba(184,106,77,0.2)]"
      )}
      style={{
        borderTop: "2px solid var(--color-accent)",
        borderLeft: "1px solid var(--color-glass-border)",
        borderRight: "1px solid var(--color-glass-border)",
        borderBottom: "1px solid var(--color-glass-border)",
      }}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Numeral + label */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="text-3xl leading-none"
            style={{
              fontFamily: "var(--font-fantasy)",
              color: "var(--color-accent)",
              opacity: 0.8,
            }}
            aria-hidden="true"
          >
            {romanNumerals[index]}
          </span>
          <div>
            <p className="text-xs uppercase tracking-widest" style={{ color: "var(--color-accent)" }}>
              {labels[index]}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <BookOpen size={11} style={{ color: "var(--color-text-secondary)" }} />
              <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                Storyline {index + 1} of 3
              </span>
            </div>
          </div>
        </div>

        {/* Story text */}
        <p
          className="text-base leading-relaxed flex-1 mb-6"
          style={{
            fontFamily: "var(--font-serif)",
            color: "var(--color-text-primary)",
            fontSize: "1.05rem",
          }}
        >
          {storyline}
        </p>

        {/* CTA */}
        <Button
          variant="secondary"
          onClick={() => onSelect(storyline)}
          disabled={loading}
          loading={loading}
          className="w-full group-hover:border-[var(--color-accent)]"
          icon={ChevronRight}
        >
          Choose This Path
        </Button>
      </div>
    </motion.div>
  );
}
