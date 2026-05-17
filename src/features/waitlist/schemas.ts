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

const walletSchema = z
  .string()
  .trim()
  .regex(/^0x[a-fA-F0-9]{40}$/u, "Wallet must be a 0x EVM address.");

const sourceSchema = z.string().trim().max(64);

export const waitlistInputSchema = z.object({
  email: emailSchema,
  role: waitlistRoleSchema.nullish(),
  walletAddress: walletSchema.nullish(),
  source: sourceSchema.nullish(),
});

export type WaitlistInput = z.infer<typeof waitlistInputSchema>;

export const waitlistResultSchema = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true), id: z.string().uuid(), position: z.number().nullish() }),
  z.object({ ok: z.literal(false), error: z.string() }),
]);
export type WaitlistResult = z.infer<typeof waitlistResultSchema>;
