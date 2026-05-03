"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  FileWarning,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Loader2,
  Plus,
  Trash2,
  Copy,
  Check,
} from "lucide-react";
import { submitInsuranceClaim, getInsuranceClaimStatus } from "@/server/claims.functions";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Footer";
import { cn } from "@/lib/utils";

const INCIDENT_TYPES = [
  { value: "liquidity_drain", label: "Liquidity drained" },
  { value: "lock_breach", label: "Lock / vesting breached" },
  { value: "rug_pull", label: "Rug pull" },
  { value: "contract_exploit", label: "Smart contract exploit" },
  { value: "team_abandonment", label: "Team abandoned project" },
  { value: "other", label: "Other covered failure" },
] as const;

type StatusKey = "submitted" | "under_review" | "approved" | "paid" | "rejected" | "evidence_requested";

const STATUS_META: Record<
  string,
  { label: string; tone: string; icon: React.ComponentType<{ className?: string }>; desc: string }
> = {
  submitted: {
    label: "Submitted",
    tone: "border-sky-400/40 bg-sky-400/10 text-sky-300",
    icon: FileWarning,
    desc: "Your claim has been received and queued for review.",
  },
  under_review: {
    label: "Under review",
    tone: "border-amber-400/40 bg-amber-400/10 text-amber-300",
    icon: Clock,
    desc: "We're verifying on-chain evidence and matching it against pool coverage rules.",
  },
  approved: {
    label: "Approved",
    tone: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    icon: CheckCircle2,
    desc: "Approved. Payout will be settled directly to your wallet.",
  },
  paid: {
    label: "Paid",
    tone: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
    icon: CheckCircle2,
    desc: "Compensation has been transferred from the protection pool.",
  },
  rejected: {
    label: "Rejected",
    tone: "border-destructive/40 bg-destructive/10 text-destructive",
    icon: XCircle,
    desc: "This claim is not covered by the pool's current rules.",
  },
};
const STEPS = ["submitted", "under_review", "approved", "paid"];
const STEP_FIELDS = [
  ["claimantEmail", "walletAddress"],
  ["projectName", "incidentType", "incidentDate", "claimAmountUsd"],
  ["description", "evidenceUrls", "txHashes"],
] as const;

type FormState = {
  claimantEmail: string;
  walletAddress: string;
  projectName: string;
  projectSlug: string;
  incidentType: (typeof INCIDENT_TYPES)[number]["value"];
  incidentDate: string;
  claimAmountUsd: string;
  description: string;
  evidenceUrls: string[];
  txHashes: string[];
};

const EMPTY: FormState = {
  claimantEmail: "",
  walletAddress: "",
  projectName: "",
  projectSlug: "",
  incidentType: "liquidity_drain",
  incidentDate: "",
  claimAmountUsd: "",
  description: "",
  evidenceUrls: [""],
  txHashes: [""],
};

export default function ClaimPage() {
  const params = useSearchParams();
  const initialCode = params.get("code") ?? "";
  const initialTab = params.get("tab");
  const [tab, setTab] = useState<"submit" | "track">(
    initialCode ? "track" : initialTab === "track" ? "track" : "submit",
  );

  return (
    <main className="relative min-h-screen overflow-hidden">
      <Nav />
      <section className="relative isolate pt-32 pb-24">
        <div aria-hidden className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
        <div aria-hidden className="absolute inset-0 -z-10 bg-grid opacity-30" />

        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Link href="/insurance" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Insurance pool
          </Link>

          <div className="mt-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              <ShieldCheck className="h-3 w-3" /> Protection pool
            </span>
            <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
              File an <span className="text-gradient">insurance claim</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Submit failure proof in three quick steps, then track your claim status with the tracking code we issue you.
            </p>
          </div>

          <div className="glass mx-auto mt-8 inline-flex w-full max-w-sm items-center gap-1 rounded-2xl p-1 sm:w-auto">
            {(["submit", "track"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                  tab === t
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t === "submit" ? "Submit a claim" : "Track a claim"}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {tab === "submit" ? <SubmitFlow onTrack={() => setTab("track")} /> : <TrackFlow initialCode={initialCode} />}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function SubmitFlow({ onTrack }: { onTrack: () => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));
  const updateList = (k: "evidenceUrls" | "txHashes", i: number, v: string) =>
    setForm((f) => {
      const arr = [...f[k]];
      arr[i] = v;
      return { ...f, [k]: arr };
    });
  const addRow = (k: "evidenceUrls" | "txHashes") => setForm((f) => ({ ...f, [k]: [...f[k], ""] }));
  const removeRow = (k: "evidenceUrls" | "txHashes", i: number) =>
    setForm((f) => ({ ...f, [k]: f[k].filter((_, idx) => idx !== i) }));

  const stepValid = useMemo(() => {
    const f = form;
    if (step === 0) return /\S+@\S+\.\S+/.test(f.claimantEmail) && f.walletAddress.trim().length >= 6;
    if (step === 1)
      return (
        f.projectName.trim().length >= 2 &&
        !!f.incidentType &&
        /^\d{4}-\d{2}-\d{2}$/.test(f.incidentDate) &&
        f.claimAmountUsd !== "" &&
        Number(f.claimAmountUsd) >= 0
      );
    if (step === 2) return f.description.trim().length >= 30;
    return true;
  }, [form, step]);

  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await submitInsuranceClaim({
        data: {
          claimantEmail: form.claimantEmail,
          walletAddress: form.walletAddress,
          projectName: form.projectName,
          projectSlug: form.projectSlug,
          incidentType: form.incidentType,
          incidentDate: form.incidentDate,
          claimAmountUsd: Number(form.claimAmountUsd) || 0,
          description: form.description,
          evidenceUrls: form.evidenceUrls.map((s) => s.trim()).filter(Boolean),
          txHashes: form.txHashes.map((s) => s.trim()).filter(Boolean),
        },
      });
      if (!res.ok) {
        setError("error" in res ? res.error : "Submission failed.");
      } else {
        setTrackingCode(res.trackingCode);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (trackingCode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 text-center"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/10 ring-1 ring-emerald-400/30">
          <CheckCircle2 className="h-6 w-6 text-emerald-300" />
        </span>
        <h2 className="mt-4 font-display text-2xl font-semibold">Claim submitted</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Save your tracking code — you&apos;ll need it to check status.
        </p>
        <div className="mx-auto mt-6 flex max-w-sm items-center gap-2 rounded-xl border border-border bg-background/40 p-3">
          <code className="flex-1 truncate text-left font-mono text-sm">{trackingCode}</code>
          <button
            type="button"
            onClick={async () => {
              await navigator.clipboard.writeText(trackingCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card/40 px-3 py-1.5 text-xs hover:border-accent/40 hover:text-accent"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onTrack}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Track this claim <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <Link
            href="/insurance"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background/40 px-4 py-2 text-sm font-medium hover:border-accent/40 hover:text-accent"
          >
            Back to insurance
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 sm:p-8">
      <ol className="flex items-center">
        {["Claimant", "Incident", "Evidence"].map((label, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                    done || current
                      ? "border-accent bg-accent/20 text-accent"
                      : "border-border bg-background/40 text-muted-foreground",
                    current && "ring-4 ring-accent/20",
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <div className={cn("mt-2 text-[11px] font-medium", done || current ? "text-foreground" : "text-muted-foreground")}>
                  {label}
                </div>
              </div>
              {i < 2 && <div className={cn("mx-2 h-0.5 flex-1 rounded-full", i < step ? "bg-accent" : "bg-border")} />}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 space-y-4">
        {step === 0 && (
          <>
            <Field label="Email">
              <input
                type="email"
                required
                value={form.claimantEmail}
                onChange={(e) => update("claimantEmail", e.target.value)}
                className={inputCls}
                placeholder="you@wallet.xyz"
              />
            </Field>
            <Field label="Wallet address (recipient of payout)">
              <input
                value={form.walletAddress}
                onChange={(e) => update("walletAddress", e.target.value)}
                className={cn(inputCls, "font-mono text-sm")}
                placeholder="0x…"
              />
            </Field>
            <p className="text-xs text-muted-foreground">
              Cakey is non-custodial. We never take control of funds — payouts settle directly to this address.
            </p>
          </>
        )}

        {step === 1 && (
          <>
            <Field label="Project name">
              <input value={form.projectName} onChange={(e) => update("projectName", e.target.value)} className={inputCls} placeholder="The launched project" />
            </Field>
            <Field label="Project slug (optional)">
              <input value={form.projectSlug} onChange={(e) => update("projectSlug", e.target.value)} className={inputCls} placeholder="e.g. cakey-launch-01" />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Incident type">
                <select
                  value={form.incidentType}
                  onChange={(e) => update("incidentType", e.target.value as FormState["incidentType"])}
                  className={inputCls}
                >
                  {INCIDENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Incident date">
                <input type="date" value={form.incidentDate} onChange={(e) => update("incidentDate", e.target.value)} className={inputCls} />
              </Field>
            </div>
            <Field label="Loss amount (USD)">
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.claimAmountUsd}
                onChange={(e) => update("claimAmountUsd", e.target.value)}
                className={inputCls}
                placeholder="0.00"
              />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <Field label="What happened? (min 30 chars)">
              <textarea
                rows={5}
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                className={cn(inputCls, "min-h-[120px]")}
                placeholder="Describe the failure event, timeline, and how you were affected."
              />
              <div className="mt-1 text-right text-[11px] text-muted-foreground">{form.description.length} / 3000</div>
            </Field>

            <ListField
              label="Evidence URLs"
              hint="Block explorer links, screenshots, post-mortems, etc."
              values={form.evidenceUrls}
              placeholder="https://etherscan.io/tx/0x…"
              onChange={(i, v) => updateList("evidenceUrls", i, v)}
              onAdd={() => addRow("evidenceUrls")}
              onRemove={(i) => removeRow("evidenceUrls", i)}
            />

            <ListField
              label="Transaction hashes"
              hint="On-chain transactions related to your loss."
              values={form.txHashes}
              placeholder="0x…"
              mono
              onChange={(i, v) => updateList("txHashes", i, v)}
              onAdd={() => addRow("txHashes")}
              onRemove={(i) => removeRow("txHashes", i)}
            />
          </>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || busy}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background/40 px-4 py-2 text-sm font-medium hover:border-accent/40 hover:text-accent disabled:opacity-40"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
        {step < STEP_FIELDS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!stepValid}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            Continue <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={!stepValid || busy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
          >
            {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Submit claim
          </button>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-background/40 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function ListField({
  label,
  hint,
  values,
  placeholder,
  mono,
  onChange,
  onAdd,
  onRemove,
}: {
  label: string;
  hint?: string;
  values: string[];
  placeholder?: string;
  mono?: boolean;
  onChange: (i: number, v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={v}
              onChange={(e) => onChange(i, e.target.value)}
              placeholder={placeholder}
              className={cn(inputCls, mono && "font-mono text-xs")}
            />
            <button
              type="button"
              onClick={() => onRemove(i)}
              disabled={values.length === 1}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/40 text-muted-foreground hover:text-destructive disabled:opacity-30"
              aria-label="Remove"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        className="mt-2 inline-flex items-center gap-1 rounded-lg border border-dashed border-border bg-background/30 px-3 py-1.5 text-xs text-muted-foreground hover:border-accent/40 hover:text-accent"
      >
        <Plus className="h-3.5 w-3.5" /> Add another
      </button>
    </div>
  );
}

type StatusResp = Awaited<ReturnType<typeof getInsuranceClaimStatus>>;

function TrackFlow({ initialCode }: { initialCode: string }) {
  const [code, setCode] = useState(initialCode);
  const [data, setData] = useState<StatusResp | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async (e?: React.FormEvent, override?: string) => {
    e?.preventDefault();
    const c = (override ?? code).trim();
    if (!c) return;
    setBusy(true);
    setError(null);
    try {
      const res = await getInsuranceClaimStatus({ data: { code: c } });
      if (!res.ok) setError(("error" in res ? res.error : null) ?? "Lookup failed");
      setData(res);
    } catch {
      setError("Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (initialCode) void lookup(undefined, initialCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode]);

  const status = data && data.ok ? data.status : null;
  const meta = status ? STATUS_META[status.status as StatusKey] ?? STATUS_META.submitted : null;
  const stepIdx = status ? STEPS.indexOf(status.status) : -1;
  const isRejected = status?.status === "rejected";

  return (
    <div>
      <form onSubmit={lookup} className="glass flex flex-col gap-2 rounded-2xl p-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Tracking code (e.g. a1b2c3d4e5f6)"
            className="w-full rounded-xl border border-border bg-background/40 py-3 pl-9 pr-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Look up
        </button>
      </form>
      {error && <p className="mt-3 text-center text-xs text-destructive">{error}</p>}

      {data && data.ok && !status && (
        <div className="glass mt-6 rounded-2xl p-6 text-center text-sm text-muted-foreground">
          No claim found for that code.
        </div>
      )}

      {status && meta && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass mt-8 rounded-2xl p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold">{status.project_name}</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Filed {new Date(status.created_at).toLocaleDateString()} · Claim ${Number(status.claim_amount_usd ?? 0).toLocaleString()}
              </p>
            </div>
            <span className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider", meta.tone)}>
              <meta.icon className="h-3.5 w-3.5" />
              {meta.label}
            </span>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">{meta.desc}</p>
          {status.status_note && (
            <div className="mt-3 rounded-xl border border-border bg-background/40 p-3 text-sm">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Note from team</span>
              <p className="mt-1">{status.status_note}</p>
            </div>
          )}

          {!isRejected && (
            <div className="mt-8">
              <div className="flex items-center">
                {STEPS.map((s, i) => {
                  const m = STATUS_META[s];
                  const done = i <= stepIdx;
                  const current = i === stepIdx;
                  return (
                    <div key={s} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center">
                        <div
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                            done ? "border-accent bg-accent/20 text-accent" : "border-border bg-background/40 text-muted-foreground",
                            current && "ring-4 ring-accent/20",
                          )}
                        >
                          <m.icon className="h-4 w-4" />
                        </div>
                        <div className={cn("mt-2 text-[11px] font-medium", done ? "text-foreground" : "text-muted-foreground")}>
                          {m.label}
                        </div>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={cn("mx-2 h-0.5 flex-1 rounded-full", i < stepIdx ? "bg-accent" : "bg-border")} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {Array.isArray(status.history) && status.history.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Updates</h3>
              <ol className="mt-3 space-y-2">
                {[...status.history].reverse().map((h, i) => {
                  const hm = STATUS_META[h.status] ?? STATUS_META.submitted;
                  return (
                    <li key={i} className="flex items-start gap-3 rounded-xl border border-border bg-background/30 p-3">
                      <hm.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{hm.label}</span>
                          <span className="text-[11px] text-muted-foreground">{new Date(h.at).toLocaleString()}</span>
                        </div>
                        {h.note && <p className="mt-0.5 text-xs text-muted-foreground">{h.note}</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </motion.div>
      )}

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Lost your code? Email <a className="underline" href="mailto:claims@cakey.ai">claims@cakey.ai</a>.
      </p>
    </div>
  );
}
