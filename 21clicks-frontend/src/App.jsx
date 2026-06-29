import { RouterProvider } from "react-router-dom";
import { StoryProvider } from "./context/StoryContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import router from "./routes/router.jsx";

export default function App() {
  return (
    <StoryProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </StoryProvider>
  );
}
