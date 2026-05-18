import { z } from "zod";

/**
 * Strict role union.  `null`/missing is allowed for unspecified.
 */
export const waitlistRoleSchema = z.enum(["investor", "team", "other"]);
export type WaitlistRole = z.infer<typeof waitlistRoleSchema>;

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Email is too short.")
  .max(254, "Email is too long.")
  .email("Enter a valid email.");

// Accept EVM (`0x` + 40 hex chars) or Solana (32-byte base58, typically 32-44 chars).
// The connect-wallet button currently autofills EVM via Wagmi, but pasting a
// Solana address by hand is supported because the marketing copy claims Solana
// behavioural scoring.  Casing is preserved (Solana is case-sensitive).
//
// Exported so the client form can validate inline without re-declaring the
// regexes (single source of truth — server and client can never drift).
export const EVM_ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/u;
export const SOLANA_BASE58_RE = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/u;

export function isValidWalletAddress(value: string): boolean {
  return EVM_ADDRESS_RE.test(value) || SOLANA_BASE58_RE.test(value);
}

const walletSchema = z
  .string()
  .trim()
  .refine(isValidWalletAddress, {
    message: "Wallet must be a 0x EVM address or a Solana base58 address.",
  });

const sourceSchema = z.string().trim().max(64);

export const waitlistInputSchema = z
  .object({
    // Both identifiers are individually optional now.  The refinement below
    // enforces that at least one is present, matching the DB check constraint
    // `waitlist_signups_email_or_wallet`.
    email: emailSchema.nullish(),
    role: waitlistRoleSchema.nullish(),
    walletAddress: walletSchema.nullish(),
    source: sourceSchema.nullish(),
  })
  .refine(
    (data) => Boolean(data.email) || Boolean(data.walletAddress),
    { message: "Provide an email or a wallet address.", path: ["email"] },
  );

export type WaitlistInput = z.infer<typeof waitlistInputSchema>;

export const waitlistResultSchema = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true), id: z.string().uuid(), position: z.number().nullish() }),
  z.object({ ok: z.literal(false), error: z.string() }),
]);
export type WaitlistResult = z.infer<typeof waitlistResultSchema>;
