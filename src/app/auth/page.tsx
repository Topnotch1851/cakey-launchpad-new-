"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { isCurrentUserAdmin, signIn, signUp } from "@/features/auth/services";
import { useAudience } from "@/features/audience/hooks/useAudience";

export default function AuthPage() {
  const router = useRouter();
  const { audience } = useAudience();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
        if (await isCurrentUserAdmin()) {
          router.push("/admin");
          return;
        }
        router.push(
          audience === "founder"
            ? "/team"
            : audience === "investor"
              ? "/portfolio"
              : "/welcome",
        );
      } else {
        const data = await signUp(email, password, `${window.location.origin}/welcome`);
        if (data.session) {
          router.push("/welcome");
        } else {
          setInfo("Check your email to confirm your account, then sign in.");
          setMode("signin");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <section className="relative isolate flex min-h-screen items-center justify-center px-6 pt-24 pb-12">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-40" />

        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="glass mt-6 rounded-2xl p-6 sm:p-8">
            <div className="flex gap-1 rounded-xl border border-border bg-background/30 p-1">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setMode(m);
                    setError(null);
                    setInfo(null);
                  }}
                  className={cn(
                    "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    mode === m
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m === "signin" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            <h1 className="mt-6 font-display text-2xl font-semibold">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Sign in to access your dashboard."
                : "Sign up to track launches, submit projects, and manage your portfolio."}
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min 8 chars)"
                className="w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              {error && <p className="text-xs text-destructive">{error}</p>}
              {info && <p className="text-xs text-emerald-400">{info}</p>}
              <button
                type="submit"
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_20px_60px_-20px_var(--primary)] disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                {mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
