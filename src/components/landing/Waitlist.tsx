"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useJoinWaitlist } from "@/features/waitlist/hooks/useJoinWaitlist";
import { useAnalytics } from "@/hooks/useAnalytics";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"investor" | "team">("investor");
  const { address } = useAccount();
  const wallet = address ?? "";
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
        setError(res.error);
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
            "radial-gradient(50% 60% at 50% 30%, oklch(0.62 0.22 295 / 0.25), transparent 70%)",
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
            <span className="text-gradient">trust layer</span> waitlist.
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
          {/* Gradient border frame */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl p-px"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.62 0.22 295 / 0.6), oklch(0.82 0.16 210 / 0.4), transparent 60%)",
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
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_20px_60px_-20px_var(--primary)] transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
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
                <ConnectButton.Custom>
                  {({ openConnectModal, openAccountModal, account, mounted }) => (
                    <button
                      type="button"
                      onClick={account ? openAccountModal : openConnectModal}
                      disabled={!mounted}
                      className="rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs font-medium hover:bg-card"
                    >
                      {account ? "Connected" : "Connect wallet"}
                    </button>
                  )}
                </ConnectButton.Custom>
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
