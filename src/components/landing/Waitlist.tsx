"use client";

import { useCallback, useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useJoinWaitlist } from "@/features/waitlist/hooks/useJoinWaitlist";
import { useAnalytics } from "@/hooks/useAnalytics";
import {
  EVM_ADDRESS_RE,
  SOLANA_BASE58_RE,
  type WaitlistResult,
} from "@/features/waitlist/schemas";

const easeCinematic = [0.22, 1, 0.36, 1] as const;

// Wallet UI is heavy (Wagmi + RainbowKit ~hundreds of KB).  Defer it so the
// initial homepage paint doesn't include any wallet bytes.
const WaitlistWalletUI = dynamic(
  () => import("@/components/wallet/WaitlistWalletUI"),
  {
    ssr: false,
    loading: () => (
      <button
        type="button"
        disabled
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card/40 px-6 py-3.5 text-sm font-medium text-foreground opacity-60"
      >
        Loading wallet…
      </button>
    ),
  },
);

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"investor" | "team">("investor");
  const [wallet, setWallet] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const track = useAnalytics();
  const joinMutation = useJoinWaitlist();

  // Inline format check on the paste field. uses the same regexes as the
  // server schema so users see the mismatch before clicking submit.
  const walletInvalid =
    wallet.length > 0 &&
    !EVM_ADDRESS_RE.test(wallet) &&
    !SOLANA_BASE58_RE.test(wallet);

  const emailLooksValid = email.length > 0 && email.includes("@");
  const canSubmit = !submitting && (emailLooksValid || (wallet.length > 0 && !walletInvalid));

  const finishSuccess = (result: WaitlistResult, source: string) => {
    if (result.ok) {
      setSubmitted(true);
      // `position` is nullish in the schema. guard so we don't render "#null".
      setPosition(typeof result.position === "number" ? result.position : null);
      track("waitlist_form_submit", {
        role,
        source,
        position: result.position ?? null,
      });
    } else {
      setError(result.error);
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const hasEmail = email.length > 0;
    const hasWallet = wallet.length > 0;

    if (!hasEmail && !hasWallet) {
      setError("Enter an email, or paste / connect a wallet.");
      return;
    }
    if (hasEmail && !emailLooksValid) {
      setError("Please enter a valid email.");
      return;
    }
    if (hasWallet && walletInvalid) {
      setError("Wallet format doesn't look right. Use 0x… or a Solana base58 address.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await joinMutation.mutateAsync({
        email: hasEmail ? email : null,
        role,
        walletAddress: hasWallet ? wallet : null,
        source: "landing_form",
      });
      finishSuccess(res, "form");
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
         
        console.error(err);
      }
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // One-click "Connect wallet to join" path.  Sends ONLY the connected
  // wallet. no email, no manual fields.  Shares the success/error state
  // with the main form so both surfaces flip to the same confirmation UI.
  const onJoinWithWallet = useCallback(
    async (address: string) => {
      setError(null);
      try {
        const res = await joinMutation.mutateAsync({
          email: null,
          role,
          walletAddress: address,
          source: "landing_connect",
        });
        finishSuccess(res, "connect");
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
           
          console.error(err);
        }
        setError("Something went wrong. Please try again.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [role, joinMutation],
  );

  return (
    <section id="waitlist" className="relative isolate overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 60% at 50% 30%, oklch(0.72 0.14 78 / 0.06), transparent 78%)",
        }}
      />

      <div className="mx-auto w-full max-w-3xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: easeCinematic }}
          className="text-center"
        >
          <span className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-accent backdrop-blur sm:text-xs sm:tracking-[0.2em]">
            <span className="whitespace-nowrap">Early access. 500 spots</span>
          </span>
          <h2 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            Join the{" "}
            <span className="text-accent">trust layer</span> waitlist.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
            Priority project access, founding-member allocation perks, and early insurance pool
            participation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.12, ease: easeCinematic }}
          className="relative mt-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl p-px"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.14 78 / 0.32), oklch(0.82 0.11 82 / 0.18), transparent 65%)",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          {submitted ? (
            <div className="relative flex flex-col items-center justify-center rounded-2xl border border-accent/30 bg-card/40 p-8 text-center backdrop-blur-xl">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/40 bg-accent/10">
                <CheckCircle2 className="h-7 w-7 text-accent" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold">You&apos;re on the list</h3>
              {position !== null && (
                <p className="mt-3 font-display text-base text-foreground/90">
                  You&apos;re{" "}
                  <span className="font-display text-2xl font-semibold text-accent">
                    #{position.toLocaleString()}
                  </span>{" "}
                  in the queue.
                </p>
              )}
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                We&apos;ll be in touch. Founding members get priority access and
                early insurance-pool allocation.
              </p>
              <a
                href="https://twitter.com/intent/tweet?text=I%20just%20joined%20the%20%40cakey_ai%20waitlist%20%E2%80%94%20launchpad%20with%20on-chain%20trust%20scoring%2C%20commitment%20locks%2C%20and%20an%20insurance%20pool.%20Join%20me%3A&url=https%3A%2F%2Fcakeylaunch.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track("waitlist_share_click", { channel: "twitter" })}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background/40 px-5 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-card/60"
              >
                Share &amp; move up the list
              </a>
            </div>
          ) : (
            <div className="relative flex flex-col gap-5 rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl sm:p-6">
              {/*
                MAIN FORM
                Email + manual wallet paste both live here, both optional,
                handled together by the single Join Waitlist button.
              */}
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {(["investor", "team"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition-colors ${
                        role === r
                          ? "border-accent/50 bg-accent/10 text-accent"
                          : "border-border bg-background/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {r === "team" ? "Project team" : r}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email-input" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Email <span className="ml-1 normal-case tracking-normal text-muted-foreground/70">(optional)</span>
                  </label>
                  <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@protocol.xyz"
                    className="w-full rounded-xl border border-border bg-background/60 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="wallet-input" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Wallet <span className="ml-1 normal-case tracking-normal text-muted-foreground/70">(optional, paste any EVM 0x… or Solana address)</span>
                  </label>
                  <input
                    id="wallet-input"
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value.trim())}
                    placeholder="0x… or Solana address"
                    className="w-full rounded-xl border border-border bg-background/60 px-4 py-3.5 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 sm:text-sm"
                  />
                  {walletInvalid && (
                    <p className="text-[11px] text-amber-400/90">
                      Wallet format doesn&apos;t look right. Use 0x + 40 hex chars or a Solana base58 address (32-44 chars). Or leave blank.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_14px_40px_-22px_oklch(0.72_0.14_78/0.5)] transition-colors hover:bg-primary-glow disabled:opacity-60 disabled:hover:bg-primary"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Joining…
                    </>
                  ) : (
                    <>Join waitlist</>
                  )}
                </button>

                <p className="text-center text-[11px] text-muted-foreground">
                  Enter an email, paste a wallet, or both. We&apos;ll keep one record per signup.
                </p>
              </form>

              {/* Visual divider. same canvas, just a typographic OR */}
              <div className="relative flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
                <span className="h-px flex-1 bg-border/60" />
                <span>or</span>
                <span className="h-px flex-1 bg-border/60" />
              </div>

              {/*
                SECONDARY PATH. wallet-only signup.
                Opens the wallet modal; on a fresh connection, auto-submits
                the address through the same server action.
              */}
              <div className="flex flex-col gap-2">
                <WaitlistWalletUI onJoinWithWallet={onJoinWithWallet} disabled={submitting} />
                <p className="text-center text-[11px] text-muted-foreground">
                  Connect a wallet to join with one click. no email needed.
                </p>
              </div>

              {error && (
                <p className="text-center text-xs text-destructive" role="alert">
                  {error}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
