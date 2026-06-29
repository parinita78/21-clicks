import { motion } from "framer-motion";
import clsx from "clsx";

/**
 * Primary / secondary / ghost button variants.
 * All interactions handled via Framer's whileHover / whileTap.
 */
export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  icon: Icon = null,
  ...rest
}) {
  const base =
    "inline-flex items-center justify-center gap-2 font-sans font-semibold tracking-wide rounded-xl transition-colors focus-visible:outline-offset-4 select-none";

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    xl: "px-10 py-5 text-lg",
  };

  const variants = {
    primary:
      "bg-[var(--color-accent)] text-[var(--color-bg-primary)] hover:bg-[var(--color-accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed",
    secondary:
      "glass-panel border border-[rgba(184,106,77,0.4)] text-[var(--color-text-primary)] hover:border-[var(--color-accent)] hover:bg-[rgba(184,106,77,0.08)] disabled:opacity-40 disabled:cursor-not-allowed",
    ghost:
      "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[rgba(255,255,255,0.06)] disabled:opacity-40 disabled:cursor-not-allowed",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      transition={{ duration: 0.15 }}
      className={clsx(base, sizes[size], variants[variant], className)}
      {...rest}
    >
      {loading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading…</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={size === "lg" || size === "xl" ? 20 : 16} />}
          {children}
        </>
      )}
    </motion.button>
  );
}
