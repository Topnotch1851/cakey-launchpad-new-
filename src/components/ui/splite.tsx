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

// Static, GPU-cheap fallback that holds the visual weight of the missing 3D
// scene. Mobile / reduced-motion / save-data users see this permanently;
// desktop users see it for the brief moment before idle-mount.
// Two stacked radial gradients suggest depth + ambient light without
// pretending to be content.
function SplineFallback({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <div
        className="relative h-full w-full"
        style={{
          backgroundImage: [
            // Warm core glow where the robot would sit
            "radial-gradient(45% 55% at 70% 55%, oklch(0.78 0.12 82 / 0.22), transparent 70%)",
            // Cool deep falloff from the corners
            "radial-gradient(80% 80% at 50% 50%, oklch(0.12 0 0 / 0.6), transparent 75%)",
          ].join(", "),
        }}
      />
    </div>
  );
}

/**
 * Decide whether this device should run the 3D scene at all.
 *
 * Refuse when:
 *   - viewport is mobile-sized (<768px) — WebGL + a 1.3MB binary on a phone
 *     is the difference between a working site and Lighthouse timing out.
 *     Mobile users see the static gradient fallback and the headline/CTAs.
 *   - prefers-reduced-motion (accessibility contract)
 *   - Save-Data connection hint (user asked the browser to save bytes)
 *   - effectiveType is 2g/3g/slow-2g (low-bandwidth networks)
 */
function shouldUseSpline(): boolean {
  if (typeof window === "undefined") return false;

  // Mobile breakpoint matches Tailwind `md`. Phones never load the WebGL bundle.
  if (window.matchMedia("(max-width: 767px)").matches) return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  type ConnectionLike = { saveData?: boolean; effectiveType?: string };
  type NavigatorWithHints = Navigator & { connection?: ConnectionLike };
  const conn = (navigator as NavigatorWithHints).connection;
  if (conn?.saveData === true) return false;
  if (conn?.effectiveType && /^(slow-2g|2g|3g)$/.test(conn.effectiveType)) return false;

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
