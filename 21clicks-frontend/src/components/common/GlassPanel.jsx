import clsx from "clsx";

/**
 * The foundational surface for all cards, modals, and panels in the app.
 * Thin wrapper around the `glass-panel` utility class so the exact values
 * live in index.css rather than scattered inline styles.
 */
export default function GlassPanel({
  children,
  className = "",
  interactive = false,
  selected = false,
  as: Tag = "div",
  ...rest
}) {
  return (
    <Tag
      className={clsx(
        "glass-panel rounded-[var(--radius-card)]",
        interactive && "glass-panel-interactive cursor-pointer",
        selected && "border-[var(--color-glass-border-hover)] glow-accent",
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
