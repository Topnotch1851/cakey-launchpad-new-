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

// Static, GPU-cheap fallback that mirrors the hero's gold-glow atmosphere.
// This is what mobile / reduced-motion / save-data users see permanently,
// and what desktop users see for the brief moment before idle-mount.
function SplineFallback({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <div
        className="h-full w-full"
        style={{
          background:
            "radial-gradient(60% 60% at 70% 50%, oklch(0.78 0.12 82 / 0.12), transparent 75%)",
        }}
      />
    </div>
  );
}

/**
 * Decide whether this device should run the 3D scene at all.
 * We refuse on:
 *   - viewports below the lg breakpoint (1024px) — mobile + small tablets
 *   - coarse pointers (touch) — usually correlates with weaker GPUs
 *   - prefers-reduced-motion
 *   - Save-Data hint
 *   - navigator.deviceMemory < 4 GB (Chrome / Edge only — heuristic)
 */
function shouldUseSpline(): boolean {
  if (typeof window === "undefined") return false;

  const desktop = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
  if (!desktop.matches) return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  type ConnectionLike = { saveData?: boolean };
  type NavigatorWithHints = Navigator & {
    deviceMemory?: number;
    connection?: ConnectionLike;
  };
  const nav = navigator as NavigatorWithHints;

  if (nav.connection?.saveData === true) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;

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
