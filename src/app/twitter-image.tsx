/**
 * Twitter Card image — same artwork as OG. Config constants are declared
 * inline (not re-exported) because Next.js 16 + Turbopack must read them
 * statically from each route file.
 */
import OgImage from "./opengraph-image";

export const runtime = "edge";
export const alt = "Cakey AI Launchpad. Intelligent trust for token launches";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default OgImage;
