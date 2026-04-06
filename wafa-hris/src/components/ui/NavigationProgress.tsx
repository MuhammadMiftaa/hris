import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  speed: 350,
  minimum: 0.2,
  trickleSpeed: 150,
});

/**
 * Gold‑gradient progress bar that fires on every route change.
 * Works with <BrowserRouter> + <Routes> (no data‑router needed).
 * The gold styling is applied via globals.css overrides.
 */
export function NavigationProgress() {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    // Only trigger on actual path changes, not on first mount
    if (prevPath.current !== location.pathname) {
      NProgress.start();

      // Simulate a short loading delay so the bar is visible
      const timeout = setTimeout(() => {
        NProgress.done();
      }, 300);

      prevPath.current = location.pathname;
      return () => clearTimeout(timeout);
    }
  }, [location.pathname]);

  return null;
}
