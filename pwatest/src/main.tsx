import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// SW registrieren (wird nur im Build aktiv)
import { registerSW } from "virtual:pwa-register";

registerSW({
  onNeedRefresh() {
    // Optional: Toast/Modal "Update verfügbar – neu laden"
  },
  onOfflineReady() {
    // Optional: Toast "App ist offline bereit"
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
