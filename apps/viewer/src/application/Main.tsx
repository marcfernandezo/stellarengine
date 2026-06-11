import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/application/App";
import '@/components/hud/styles/main.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)