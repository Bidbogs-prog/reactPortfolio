import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes";
import "./index.css";

// SSG entry. vite-react-ssg prerenders each route to static HTML at build time
// and hydrates it on the client. Providers and layout live in the root route
// (src/App.tsx); the router is created from `routes`.
export const createRoot = ViteReactSSG({ routes });
