import { z } from "zod";

/**
 * Frontend env schema. ONLY public vars allowed (NEXT_PUBLIC_*).
 * Adding a non-public var here is a security bug — secrets must NEVER ship to the browser.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
});

const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("[env] Invalid public env:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid public environment variables. See logs.");
}

export const env = parsed.data;
