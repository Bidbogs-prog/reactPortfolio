import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import { RegisterProvider } from "@/lib/register";
import { AgentProvider } from "@/lib/agent/agent-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RegisterProvider>
      <BrowserRouter>
        <AgentProvider>
          <App />
        </AgentProvider>
      </BrowserRouter>
    </RegisterProvider>
  </StrictMode>
);
