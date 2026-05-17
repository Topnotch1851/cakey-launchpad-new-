"use client";

import { useCallback, useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { useJoinWaitlist } from "@/features/waitlist/hooks/useJoinWaitlist";
import { useAnalytics } from "@/hooks/useAnalytics";

// Wallet UI is heavy (Wagmi + RainbowKit ~hundreds of KB).  Defer it so initial
// homepage paint doesn't include any wallet bytes — fetched lazily after hydration.
const WaitlistWalletUI = dynamic(
  () => import("@/components/wallet/WaitlistWalletUI"),
  {
    ssr: false,
    loading: () => (
      <button
        type="button"
        disabled
        className="rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs font-medium opacity-60"
      >
        Connect wallet
      </button>
    ),
  },
);

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"investor" | "team">("investor");
  const [wallet, setWallet] = useState<string>("");
  const onWalletChange = useCallback((addr: string | null) => {
    setWallet(addr ?? "");
  }, []);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const track = useAnalytics();
  const joinMutation = useJoinWaitlist();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await joinMutation.mutateAsync({
        email,
        role,
        walletAddress: wallet || null,
        source: "landing_hero",
      });
      if (res.ok) {
        setSubmitted(true);
        track("waitlist_form_submit", { role });
      } else {
        setError("error" in res ? String((res as { error?: unknown }).error) : "Submission failed.");
      }
    } catch (err) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error(err);
      }
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-accent backdrop-blur sm:text-xs sm:tracking-[0.2em]">
            <Sparkles className="h-3 w-3 shrink-0" />
            <span className="whitespace-nowrap">Early access — 500 spots</span>
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
          transition={{ duration: 0.5, delay: 0.08 }}
          className="relative mt-10"
        >
          {/* Gradient border frame — softened so it reads as a refined edge, not a flare */}
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
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Check your inbox for confirmation. Founding members get priority.
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="relative flex flex-col gap-4 rounded-2xl border border-border bg-card/40 p-5 backdrop-blur-xl sm:p-6"
            >
              {/* Role pills */}
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

              {/* Email + submit */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@protocol.xyz"
                  className="flex-1 rounded-xl border border-border bg-background/60 px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-glow px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_14px_40px_-22px_oklch(0.72_0.14_78/0.5)] transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Joining…
                    </>
                  ) : (
                    <>
                      Join waitlist <span aria-hidden>→</span>
                    </>
                  )}
                </button>
              </div>

              {/* Wallet row */}
              <div className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background/30 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs text-muted-foreground">
                  {wallet ? (
                    <>
                      Wallet linked:{" "}
                      <code className="text-foreground">
                        {wallet.slice(0, 6)}…{wallet.slice(-4)}
                      </code>
                    </>
                  ) : (
                    "Connect wallet (optional) — auto-fills your address"
                  )}
                </div>
                <WaitlistWalletUI onChange={onWalletChange} />
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <p className="text-center text-[11px] text-muted-foreground">
                No spam. Unsubscribe anytime. Wallet not required.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
