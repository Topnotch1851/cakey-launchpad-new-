"use client";

import Link from "next/link";

/**
 * Frontend-only diagnostic page.
 * Original Supabase auth lookup removed (no backend in this build).
 */
export default function WhoAmI() {
  const userId: string | null = null;
  const email: string | null = null;
  const roles: { role: string }[] = [];
  const isAdmin = false;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-6 py-16">
      <div>
        <h1 className="font-display text-3xl font-semibold">Who am I?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Diagnostic view of the current session and assigned roles.
        </p>
        <p className="mt-2 text-xs text-amber-300">
          Frontend-only build: authentication is not wired. Showing empty state.
        </p>
      </div>

      <div className="space-y-4">
        <Field label="User ID" value={userId ?? "—"} mono />
        <Field label="Email" value={email ?? "—"} />
        <Field
          label="Roles"
          value={roles.length > 0 ? roles.map((r) => r.role).join(", ") : "(none)"}
        />
        <Field label="isAdmin" value={isAdmin ? "true" : "false"} highlight={isAdmin} />
      </div>

      <div className="flex flex-wrap gap-2 pt-4">
        <Link
          href="/admin"
          className="rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Go to admin
        </Link>
        <Link
          href="/auth"
          className="rounded-xl border border-border bg-background/60 px-4 py-2 text-sm"
        >
          Sign in / switch account
        </Link>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
  highlight,
}: {
  label: string;
  value: string;
  mono?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-1 break-all text-sm ${mono ? "font-mono" : ""} ${
          highlight ? "text-accent font-semibold" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
