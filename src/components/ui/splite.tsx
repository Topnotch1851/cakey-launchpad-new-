"use client";

import { Suspense, lazy, useEffect, useState } from "react";

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
  if (!window.matchMedia("(min-width: 768px)").matches) return false;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return false;
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) return false;
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
  const [shouldMount, setShouldMount] = useState(false);

  useEffect(() => {
    if (!shouldUseSpline()) return;
    return whenIdle(() => setShouldMount(true));
  }, []);

  if (!shouldMount) {
    return <SplineFallback className={className} />;
  }

  return (
    <Suspense fallback={<SplineFallback className={className} />}>
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}
