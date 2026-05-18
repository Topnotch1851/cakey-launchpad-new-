import { z } from "zod";

/**
 * Treat empty strings (e.g. `FOO=` in .env.local) as "not set" so they
 * don't trip `.min(1).optional()` validation.
 */
const emptyToUndefined = (v: unknown) =>
  typeof v === "string" && v.trim() === "" ? undefined : v;

/**
 * Public env (NEXT_PUBLIC_*) — ships to the browser.
 * Never put secrets here.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  NEXT_PUBLIC_SITE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
});

const parsedPublic = publicEnvSchema.safeParse({
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

if (!parsedPublic.success) {
   
  console.error("[env] Invalid public env:", parsedPublic.error.flatten().fieldErrors);
  throw new Error("Invalid public environment variables. See logs.");
}

export const env = parsedPublic.data;

/**
 * Server env — secrets and server-only config.
 * Accessing `serverEnv` from a client bundle will throw at build time because
 * these names don't have `NEXT_PUBLIC_` prefix and so are stripped from the client.
 */
const serverEnvSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  WAITLIST_IP_SALT: z.string().min(16).optional(),
});

type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedServerEnv: ServerEnv | null = null;

/**
 * Lazy server-env access. Only validates when first read on the server.
 * Falls back to the public Supabase URL / anon key so a single set of vars
 * can be reused if you don't want to duplicate `NEXT_PUBLIC_*` and bare names.
 */
function readServerEnv(): ServerEnv {
  if (cachedServerEnv) return cachedServerEnv;

  const raw = {
    SUPABASE_URL: process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY:
      process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    WAITLIST_IP_SALT: process.env.WAITLIST_IP_SALT,
  };

  const parsed = serverEnvSchema.safeParse(raw);
  if (!parsed.success) {
     
    console.error("[env] Invalid server env:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid server environment. See logs.");
  }

  cachedServerEnv = parsed.data;
  return cachedServerEnv;
}

// Proxy lets us validate lazily without paying the cost on cold paths that don't use Supabase.
export const serverEnv = new Proxy({} as ServerEnv, {
  get(_t, key: keyof ServerEnv) {
    return readServerEnv()[key];
  },
});
