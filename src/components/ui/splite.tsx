"use client";

import { Suspense, lazy, useEffect, useRef, useState } from "react";

// Lazy reference: the Spline runtime + react wrapper (~hundreds of KB) plus
// the .splinecode binary (~1.3 MB) are only fetched when this component is
// actually rendered. If `<Spline>` never mounts, none of it is downloaded.
const Spline = lazy(() => import("@splinetool/react-spline"));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

// Empty placeholder shown for the brief moment between page paint and the
// Spline runtime mounting. No decoration — the hero section's own background
// is the only thing visible here.
function SplineFallback({ className }: { className?: string }) {
  return <div className={className} aria-hidden />;
}

/**
 * The 3D scene ships to every device.  The only opt-out is the accessibility
 * contract: when the user has explicitly told the OS they don't want motion,
 * we honour that.  Everyone else gets the robot — idle-mounted so it can't
 * block first paint, and with the binary prefetched from <head> so the
 * runtime fetch hits the browser cache.
 */
function shouldUseSpline(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return true;
}

/** Run a callback when the browser is idle, with a hard timeout fallback. */
function whenIdle(cb: () => void): () => void {
  type IdleWindow = Window & {
    requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    cancelIdleCallback?: (id: number) => void;
  };
  const w = window as IdleWindow;

  if (typeof w.requestIdleCallback === "function") {
    const id = w.requestIdleCallback(cb, { timeout: 2500 });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(cb, 1500);
  return () => window.clearTimeout(id);
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (!shouldUseSpline()) return;

    let isVisible = false;
    let hasLoaded = document.readyState === "complete";
    let hasUserIntent = false;
    let cancelIdle: (() => void) | undefined;
    let fallbackTimer: number | undefined;
    let cancelled = false;

    const tryMount = () => {
      if (cancelled || mountedRef.current || !isVisible || !hasLoaded || !hasUserIntent) return;
      cancelIdle = whenIdle(() => {
        if (!cancelled && isVisible && document.visibilityState === "visible") {
          mountedRef.current = true;
          setShouldMount(true);
        }
      });
    };

    const onLoad = () => {
      hasLoaded = true;
      tryMount();
    };

    const onUserIntent = () => {
      hasUserIntent = true;
      tryMount();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        mountedRef.current = false;
        setShouldMount(false);
        return;
      }
      tryMount();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (!isVisible) {
          mountedRef.current = false;
          setShouldMount(false);
          return;
        }
        tryMount();
      },
      { rootMargin: "160px 0px", threshold: 0.01 },
    );

    const node = rootRef.current;
    if (node) observer.observe(node);

    window.addEventListener("load", onLoad, { once: true });
    window.addEventListener("pointermove", onUserIntent, { once: true, passive: true });
    window.addEventListener("pointerdown", onUserIntent, { once: true, passive: true });
    window.addEventListener("touchstart", onUserIntent, { once: true, passive: true });
    window.addEventListener("scroll", onUserIntent, { once: true, passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    fallbackTimer = window.setTimeout(onUserIntent, 4500);
    tryMount();

    return () => {
      cancelled = true;
      cancelIdle?.();
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      observer.disconnect();
      window.removeEventListener("load", onLoad);
      window.removeEventListener("pointermove", onUserIntent);
      window.removeEventListener("pointerdown", onUserIntent);
      window.removeEventListener("touchstart", onUserIntent);
      window.removeEventListener("scroll", onUserIntent);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  if (!shouldMount) {
    return <div ref={rootRef} className={className} aria-hidden />;
  }

  return (
    <div ref={rootRef} className={className} aria-hidden>
      <Suspense fallback={<SplineFallback className="h-full w-full" />}>
        <Spline scene={scene} className="h-full w-full" renderOnDemand />
      </Suspense>
    </div>
  );
}
