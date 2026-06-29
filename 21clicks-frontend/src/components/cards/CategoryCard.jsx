import { motion } from "framer-motion";
import { useState } from "react";
import * as Icons from "lucide-react";
import clsx from "clsx";

export default function CategoryCard({ category, selected, onSelect }) {
  const [imgError, setImgError] = useState(false);
  const LucideIcon = Icons[category.icon] || Icons.BookOpen;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      onClick={() => onSelect(category)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(category)}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      aria-label={`Select ${category.label} category`}
      className={clsx(
        "glass-panel glass-panel-interactive rounded-[var(--radius-card)] overflow-hidden cursor-pointer group",
        selected && "border-[rgba(184,106,77,0.6)] glow-accent"
      )}
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden">
        {!imgError ? (
          <img
            src={category.image}
            alt={category.label}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: "radial-gradient(ellipse at center, rgba(184,106,77,0.2) 0%, transparent 70%)",
            }}
          >
            <LucideIcon size={44} style={{ color: "var(--color-accent)", opacity: 0.65 }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,11,15,0.85)] to-transparent" />

        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: "var(--color-accent)" }}
          >
            <Icons.Check size={12} style={{ color: "var(--color-bg-primary)" }} />
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1.5">
          <LucideIcon size={14} style={{ color: "var(--color-accent)" }} />
          <h3
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-display)", color: "var(--color-text-primary)" }}
          >
            {category.label}
          </h3>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {category.description}
        </p>
      </div>
    </motion.div>
  );
}
