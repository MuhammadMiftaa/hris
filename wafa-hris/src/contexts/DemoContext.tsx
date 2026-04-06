import React, { createContext, useContext, useState, useCallback } from "react";

const DEMO_KEY = "run_demo";

interface DemoContextType {
  isDemo: boolean;
  startDemo: () => void;
  stopDemo: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemo, setIsDemo] = useState(
    () => localStorage.getItem(DEMO_KEY) === "true",
  );

  const startDemo = useCallback(() => {
    localStorage.setItem(DEMO_KEY, "true");
    setIsDemo(true);
  }, []);

  const stopDemo = useCallback(() => {
    localStorage.removeItem(DEMO_KEY);
    setIsDemo(false);
  }, []);

  return (
    <DemoContext.Provider value={{ isDemo, startDemo, stopDemo }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within DemoProvider");
  return ctx;
}
