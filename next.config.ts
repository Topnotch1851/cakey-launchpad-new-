import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  // Browser preview / cross-origin dev (Cascade proxy)
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // Security headers (production)
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // The Spline scene is immutable — long-cache it on the CDN + browser.
      // If you ever replace the asset, change the filename (e.g. scene-v2.splinecode) to bust caches.
      {
        source: "/scene.splinecode",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          { key: "Content-Type", value: "application/octet-stream" },
        ],
      },
    ];
  },
};

export default nextConfig;
