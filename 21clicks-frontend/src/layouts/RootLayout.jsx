import { Outlet } from "react-router-dom";
import VideoBackground from "../components/common/VideoBackground.jsx";

/**
 * Root layout — always present.
 * Renders the looping video behind everything,
 * then the current page as <Outlet />.
 */
export default function RootLayout() {
  return (
    <div className="relative min-h-screen">
      {/* Layer 0: full-screen background video + dark overlay */}
      <VideoBackground />

      {/* Layer 1: all page content */}
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
}
