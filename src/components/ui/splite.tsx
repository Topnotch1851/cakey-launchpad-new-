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
 * The 3D hero ships to every device. We only refuse when the user or
 * the OS has explicitly opted out of heavy motion / heavy data:
 *   - prefers-reduced-motion (accessibility contract)
 *   - Save-Data connection hint (user asked the browser to save bytes)
 */
function shouldUseSpline(): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  type ConnectionLike = { saveData?: boolean };
  type NavigatorWithHints = Navigator & { connection?: ConnectionLike };
  const nav = navigator as NavigatorWithHints;
  if (nav.connection?.saveData === true) return false;

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
