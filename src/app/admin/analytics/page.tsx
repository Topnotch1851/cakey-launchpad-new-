"use client";

import { useMemo, useState } from "react";
import { Download, Loader2, Calendar } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { useAdminAnalytics } from "@/features/admin/hooks/useAdminData";

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}
function isoFromDay(s: string, end = false) {
  return new Date(s + (end ? "T23:59:59.999Z" : "T00:00:00.000Z")).toISOString();
}

export default function AdminAnalyticsPage() {
  const isAdmin = true; // frontend-only build
  const today = new Date();
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const [from, setFrom] = useState(isoDay(monthAgo));
  const [to, setTo] = useState(isoDay(today));

  const { data, isFetching: loadingData } = useAdminAnalytics(
    { from: isoFromDay(from), to: isoFromDay(to, true) },
    isAdmin,
  );

  const max = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, ...data.series.map((s) => Math.max(s.hero, s.waitlist, s.apps)));
  }, [data]);

  const exportCsv = (kind: "events" | "waitlist" | "applications") => {
    if (!data) return;
    let headers: string[] = [];
    let rows: Array<Record<string, unknown>> = [];
    if (kind === "events") {
      headers = ["event_name", "created_at", "properties"];
      rows = data.events as Array<Record<string, unknown>>;
    } else if (kind === "waitlist") {
      headers = ["email", "role", "created_at"];
      rows = data.waitlist as Array<Record<string, unknown>>;
    } else {
      headers = ["project_name", "status", "created_at"];
      rows = data.applications as Array<Record<string, unknown>>;
    }
    const csv = [
      headers.join(","),
      ...rows.map((r) =>
        headers.map((h) => `"${String(r[h] ?? "").replace(/"/g, '""').replace(/\n/g, " ")}"`).join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cakey-${kind}-${from}_${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardShell
      eyebrow="Cakey admin"
      title="Analytics"
      description="CTA clicks, waitlist signups, and applications."
      actions={
        <div className="flex flex-wrap items-center gap-2 glass rounded-xl p-2">
          <Calendar className="ml-2 h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg border border-border bg-background/40 px-3 py-1.5 text-sm"
          />
          <span className="text-muted-foreground">to</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg border border-border bg-background/40 px-3 py-1.5 text-sm"
          />
          <div className="flex gap-1">
            {[7, 30, 90].map((n) => (
              <button
                key={n}
                onClick={() => {
                  const t = new Date();
                  setFrom(isoDay(new Date(t.getTime() - n * 86400000)));
                  setTo(isoDay(t));
                }}
                className="rounded-lg border border-border px-2 py-1 text-xs hover:bg-card/70"
              >
                {n}d
              </button>
            ))}
          </div>
        </div>
      }
    >
      {loadingData || !data ? (
        <div className="mt-2 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Hero CTA clicks" value={data.summary.heroClicks} accent="from-primary to-accent" />
            <Stat label="Waitlist submits" value={data.summary.waitlistSubmits} accent="from-emerald-400 to-cyan-400" />
            <Stat label="Waitlist rows" value={data.summary.waitlistRows} accent="from-sky-400 to-indigo-400" />
            <Stat label="Applications" value={data.summary.applications} accent="from-amber-400 to-rose-400" />
          </div>

          <div className="glass mt-6 rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Daily activity</h2>
              <div className="flex gap-3 text-xs">
                <Legend color="from-primary to-accent" label="Hero clicks" />
                <Legend color="from-emerald-400 to-cyan-400" label="Waitlist" />
                <Legend color="from-amber-400 to-rose-400" label="Applications" />
              </div>
            </div>
            <div className="flex h-48 items-end gap-1 overflow-x-auto">
              {data.series.map((d) => (
                <div key={d.date} className="flex flex-1 min-w-[18px] flex-col items-center gap-0.5">
                  <div className="flex h-full w-full flex-col-reverse items-stretch gap-px">
                    <div
                      title={`Hero ${d.hero}`}
                      className="rounded-t bg-gradient-to-t from-primary to-accent"
                      style={{ height: `${(d.hero / max) * 100}%`, minHeight: d.hero ? 2 : 0 }}
                    />
                    <div
                      title={`Waitlist ${d.waitlist}`}
                      className="bg-gradient-to-t from-emerald-400 to-cyan-400"
                      style={{ height: `${(d.waitlist / max) * 100}%`, minHeight: d.waitlist ? 2 : 0 }}
                    />
                    <div
                      title={`Apps ${d.apps}`}
                      className="bg-gradient-to-t from-amber-400 to-rose-400"
                      style={{ height: `${(d.apps / max) * 100}%`, minHeight: d.apps ? 2 : 0 }}
                    />
                  </div>
                  <span className="hidden text-[9px] text-muted-foreground sm:block">{d.date.slice(5)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => exportCsv("events")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Download className="h-4 w-4" /> Events CSV
            </button>
            <button
              onClick={() => exportCsv("waitlist")}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-card/70"
            >
              <Download className="h-4 w-4" /> Waitlist CSV
            </button>
            <button
              onClick={() => exportCsv("applications")}
              className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-card/70"
            >
              <Download className="h-4 w-4" /> Applications CSV
            </button>
          </div>

          <div className="mt-6 glass rounded-2xl p-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Recent events
            </h3>
            <div className="mt-3 max-h-80 overflow-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="py-2">Event</th>
                    <th className="py-2">When</th>
                    <th className="py-2">Properties</th>
                  </tr>
                </thead>
                <tbody>
                  {data.events.slice(0, 100).map((e, i) => (
                    <tr key={i} className="border-t border-border/40">
                      <td className="py-2 font-medium">{e.event_name}</td>
                      <td className="py-2 text-muted-foreground">{new Date(e.created_at).toLocaleString()}</td>
                      <td className="py-2 font-mono text-[10px] text-muted-foreground truncate max-w-md">
                        {JSON.stringify(e.properties)}
                      </td>
                    </tr>
                  ))}
                  {data.events.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-muted-foreground">
                        No events in this range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardShell>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-2 bg-gradient-to-r ${accent} bg-clip-text font-display text-4xl font-semibold text-transparent`}>
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground">
      <span className={`h-2 w-3 rounded-sm bg-gradient-to-r ${color}`} /> {label}
    </span>
  );
}
