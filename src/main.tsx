import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DemoProvider } from "./contexts/DemoContext";
import { NavigationProgress } from "./components/ui/NavigationProgress";
import App from "./App";
import PWABadge from "./PWABadge";
import "./globals.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <DemoProvider>
          <AuthProvider>
            <NavigationProgress />
            <App />
            <PWABadge />
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: "var(--card)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                  fontSize: "14px",
                },
              }}
            />
          </AuthProvider>
        </DemoProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
