import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout.jsx";
import LandingPage from "../pages/LandingPage.jsx";
import ThemeSelectionPage from "../pages/ThemeSelectionPage.jsx";
import CategorySelectionPage from "../pages/CategorySelectionPage.jsx";
import PromptInputPage from "../pages/PromptInputPage.jsx";
import StorylineSelectionPage from "../pages/StorylineSelectionPage.jsx";
import StoryJourneyPage from "../pages/StoryJourneyPage.jsx";
import FinalStoryPage from "../pages/FinalStoryPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/themes", element: <ThemeSelectionPage /> },
      { path: "/categories", element: <CategorySelectionPage /> },
      { path: "/prompt", element: <PromptInputPage /> },
      { path: "/storylines", element: <StorylineSelectionPage /> },
      { path: "/journey", element: <StoryJourneyPage /> },
      { path: "/final-story", element: <FinalStoryPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

export default router;
