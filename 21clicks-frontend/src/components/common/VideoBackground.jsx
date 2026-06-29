import { ASSETS } from "../../config/assets.js";

/**
 * Full-screen looping video background with a dark overlay.
 * Sits behind everything else in RootLayout via z-0.
 */
export default function VideoBackground() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <video
        src={ASSETS.backgroundVideo}
        poster={ASSETS.backgroundVideoPoster}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Layered overlay: lighter in the middle so the video breathes,
          heavier at top/bottom so header and content always read cleanly. */}
      <div className="absolute inset-0 video-overlay" />
    </div>
  );
}
