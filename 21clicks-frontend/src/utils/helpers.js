/** Estimate reading time in minutes for a block of text. */
export function readingTime(text = "") {
  const words = text.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return mins;
}

/** Count words in a string. */
export function wordCount(text = "") {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Truncate text to n chars, appending "…" if needed. */
export function truncate(text = "", n = 120) {
  if (text.length <= n) return text;
  return text.slice(0, n).trimEnd() + "…";
}

/** Copy text to clipboard; returns true if successful. */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Generate a simple download of text as a .txt file. */
export function downloadTextFile(content, filename = "my-story.txt") {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Clamp a number between min and max. */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}
