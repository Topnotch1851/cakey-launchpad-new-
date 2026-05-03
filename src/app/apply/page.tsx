"use client";

import Link from "next/link";
import { useState, type FormEvent, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { ArrowLeft, CheckCircle2, Loader2, FileText, Copy, Check } from "lucide-react";
import { submitApplication } from "@/server/applications.functions";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";

export default function ApplyPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fd = new FormData(e.currentTarget);
    const teamWallets = String(fd.get("teamWallets") || "")
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    const documentUrls = String(fd.get("documentUrls") || "")
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      const res = await submitApplication({
        data: {
          projectName: String(fd.get("projectName") || ""),
          contactEmail: String(fd.get("contactEmail") || ""),
          website: String(fd.get("website") || ""),
          twitter: String(fd.get("twitter") || ""),
          telegram: String(fd.get("telegram") || ""),
          description: String(fd.get("description") || ""),
          tokenSymbol: String(fd.get("tokenSymbol") || ""),
          tokenSupply: fd.get("tokenSupply") ? Number(fd.get("tokenSupply")) : null,
          tokenChain: String(fd.get("tokenChain") || ""),
          teamWallets,
          documentUrls,
        },
      });
      if (res.ok) {
        setTrackingCode(res.trackingCode);
        setDone(true);
      } else {
        setError("error" in res && res.error ? String(res.error) : "Submission failed.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed. Check your fields and try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />
      <section className="relative isolate pt-36 pb-24">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-40" />

        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="mt-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              <FileText className="h-3 w-3" /> Project application
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
              Apply to <span className="text-gradient">launch on Cakey</span>
            </h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Share your tokenomics, team wallets, and key documents. Our trust engine will review and respond.
            </p>
          </div>

          {done ? (
            <div className="glass mt-10 flex items-start gap-3 rounded-2xl p-6">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-accent" />
              <div className="flex-1">
                <h2 className="font-display text-lg font-semibold">Application received</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  We&apos;ll reach out at your contact email after review. Typical turnaround is 5–7 business days.
                </p>
                {trackingCode && (
                  <div className="mt-5 rounded-xl border border-border bg-background/40 p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">Your tracking code</p>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="flex-1 rounded-lg bg-background/60 px-3 py-2 font-mono text-sm">{trackingCode}</code>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(trackingCode);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 1500);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-background/60"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Save this code. Track your review progress at{" "}
                      <Link
                        href={`/status?code=${encodeURIComponent(trackingCode)}`}
                        className="text-accent hover:underline"
                      >
                        /status
                      </Link>
                      .
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="glass mt-10 space-y-6 rounded-2xl p-6 sm:p-8">
              <Section title="Project">
                <Field label="Project name" name="projectName" required maxLength={120} />
                <Field label="Contact email" name="contactEmail" type="email" required />
                <Field label="Website" name="website" type="url" placeholder="https://" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Twitter / X" name="twitter" placeholder="@handle" />
                  <Field label="Telegram" name="telegram" placeholder="@channel" />
                </div>
                <FieldArea
                  label="Description"
                  name="description"
                  required
                  minLength={20}
                  maxLength={2000}
                  placeholder="What does your project do? Who is it for?"
                />
              </Section>

              <Section title="Tokenomics">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field label="Token symbol" name="tokenSymbol" placeholder="CAKE" maxLength={16} />
                  <Field label="Total supply" name="tokenSupply" type="number" placeholder="1000000000" />
                  <Field label="Chain" name="tokenChain" placeholder="Ethereum, Base…" />
                </div>
              </Section>

              <Section title="Team & docs">
                <FieldArea
                  label="Team wallet addresses (one per line)"
                  name="teamWallets"
                  placeholder="0xabc...&#10;0xdef..."
                />
                <FieldArea
                  label="Document URLs (whitepaper, audit, deck — one per line)"
                  name="documentUrls"
                  placeholder="https://..."
                />
              </Section>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_20px_60px_-20px_var(--primary)] transition-transform hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Submitting…" : "Submit application"}
              </button>
            </form>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{title}</h3>
      {children}
    </div>
  );
}

type FieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; name: string };

function Field({ label, name, type = "text", ...rest }: FieldProps) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <input
        name={name}
        type={type}
        {...rest}
        className="w-full rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
      />
    </label>
  );
}

type FieldAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; name: string };

function FieldArea({ label, name, ...rest }: FieldAreaProps) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <textarea
        name={name}
        rows={4}
        {...rest}
        className="w-full rounded-xl border border-border bg-background/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
      />
    </label>
  );
}
