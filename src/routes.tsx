import type { RouteRecord } from "vite-react-ssg";
import App from "./App";
import HomePage from "@/pages/home";
import WritingsPage from "@/pages/writings";
import WritingPostPage from "@/pages/writing-post";
import NotFoundPage from "@/pages/not-found";
import { writings } from "@/lib/writings";

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "writings", element: <WritingsPage /> },
      {
        path: "writings/:slug",
        element: <WritingPostPage />,
        // Tells the SSG which dynamic paths to prerender.
        getStaticPaths: () => writings.map((w) => `/writings/${w.slug}`),
      },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
