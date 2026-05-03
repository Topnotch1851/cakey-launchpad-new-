"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { ArrowLeft, ShieldCheck, Lock, Sparkles, ArrowRight, Loader2, Link2 } from "lucide-react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { getWaitlistByWallet, linkWalletToWaitlist } from "@/server/waitlist.functions";

export default function EarlyAccessPage() {
  const { address, isConnected } = useAccount();
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [linkEmail, setLinkEmail] = useState("");
  const [linking, setLinking] = useState(false);
  const [linkMsg, setLinkMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!address) {
      setEligible(null);
      setRole(null);
      return;
    }
    setChecking(true);
    getWaitlistByWallet({ data: { wallet: address } })
      .then((res) => {
        if (res.ok) {
          setEligible(res.eligible);
          setRole(res.role);
        }
      })
      .finally(() => setChecking(false));
  }, [address]);

  const onLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !linkEmail.includes("@")) return;
    setLinking(true);
    setLinkMsg(null);
    const res = await linkWalletToWaitlist({ data: { email: linkEmail, wallet: address } });
    if (res.ok) {
      setLinkMsg("Wallet linked. You're in.");
      const r = await getWaitlistByWallet({ data: { wallet: address } });
      if (r.ok) {
        setEligible(r.eligible);
        setRole(r.role);
      }
    } else {
      setLinkMsg(res.error || "Could not link.");
    }
    setLinking(false);
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />
      <section className="relative isolate pt-36 pb-24">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-40" />

        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              <Sparkles className="h-3 w-3" /> Early access
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
              Step inside the <span className="text-gradient">trust layer</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Connect the wallet you used when joining the waitlist to unlock the early access panel.
            </p>
          </div>

          <div className="glass mt-10 rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col items-center gap-4">
              <ConnectButton />
              {isConnected && (
                <p className="text-xs text-muted-foreground">
                  Connected as <code className="text-foreground">{address?.slice(0, 6)}…{address?.slice(-4)}</code>
                </p>
              )}
            </div>

            {isConnected && checking && (
              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Checking waitlist…
              </div>
            )}

            {isConnected && !checking && eligible === false && (
              <div className="mt-8 border-t border-border pt-8">
                <h2 className="font-display text-lg font-semibold">Link your waitlist email</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  This wallet isn&apos;t on the waitlist yet. Enter the email you used to sign up and we&apos;ll
                  link it permanently.
                </p>
                <form onSubmit={onLink} className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="email"
                    value={linkEmail}
                    onChange={(e) => setLinkEmail(e.target.value)}
                    placeholder="you@protocol.xyz"
                    className="flex-1 rounded-xl border border-border bg-background/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <button
                    type="submit"
                    disabled={linking}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                  >
                    {linking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                    Link wallet
                  </button>
                </form>
                {linkMsg && <p className="mt-3 text-xs text-muted-foreground">{linkMsg}</p>}
                <p className="mt-3 text-xs text-muted-foreground">
                  Not on the waitlist at all? <Link href="/" className="underline">Join here</Link>.
                </p>
              </div>
            )}

            {isConnected && eligible && (
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Tile icon={ShieldCheck} label="Trust score" value="Verified" />
                <Tile icon={Lock} label="Allocation tier" value={role === "team" ? "Builder" : "Founding"} />
                <Tile icon={Sparkles} label="Insurance pool" value="Eligible" />
                <Link
                  href="/apply"
                  className="group sm:col-span-3 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/40 px-5 py-3 text-sm font-medium hover:bg-card/70"
                >
                  Apply to launch <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}

            {!isConnected && (
              <p className="mt-8 text-center text-xs text-muted-foreground">
                Connect your wallet above to check eligibility.
              </p>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Tile({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-4">
      <Icon className="h-5 w-5 text-accent" />
      <div className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display text-lg font-semibold">{value}</div>
    </div>
  );
}
