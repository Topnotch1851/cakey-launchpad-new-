"use client";

import { useMemo, useState } from "react";
import { Download, Loader2, Search, FileText } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import {
  useWaitlist,
  useAdminApplications,
  useUpdateApplicationStatus,
} from "@/features/admin/hooks/useAdminData";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = ["submitted", "under_review", "approved", "rejected"] as const;

export default function AdminPage() {
  // Frontend-only build: assume admin true so UI is reachable.
  const isAdmin = true;

  const [tab, setTab] = useState<"waitlist" | "applications">("waitlist");
  const [filter, setFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { data: rows = [], isPending: waitlistPending } = useWaitlist(isAdmin);
  const { data: apps = [], isPending: appsPending } = useAdminApplications(isAdmin);
  const updateStatusMutation = useUpdateApplicationStatus();
  const loadingRows = waitlistPending || appsPending;

  const filteredWaitlist = useMemo(
    () =>
      rows.filter((r) => {
        if (roleFilter && r.role !== roleFilter) return false;
        if (
          filter &&
          !r.email.toLowerCase().includes(filter.toLowerCase()) &&
          !r.wallet_address?.toLowerCase().includes(filter.toLowerCase())
        ) {
          return false;
        }
        return true;
      }),
    [rows, filter, roleFilter],
  );

  const filteredApps = useMemo(
    () =>
      apps.filter((a) => {
        if (statusFilter && a.status !== statusFilter) return false;
        if (
          filter &&
          !a.project_name.toLowerCase().includes(filter.toLowerCase()) &&
          !a.contact_email.toLowerCase().includes(filter.toLowerCase())
        ) {
          return false;
        }
        return true;
      }),
    [apps, filter, statusFilter],
  );

  const updateStatus = async (id: string, status: (typeof STATUS_OPTIONS)[number]) => {
    const note = window.prompt("Optional public note for the applicant:") || null;
    try {
      await updateStatusMutation.mutateAsync({ id, status, note });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed";
      alert(msg);
    }
  };

  const exportCsv = () => {
    if (tab === "waitlist") {
      const headers = ["email", "role", "wallet_address", "source", "created_at"];
      const csv = [
        headers.join(","),
        ...filteredWaitlist.map((r) =>
          headers
            .map((h) => `"${String((r as Record<string, unknown>)[h] ?? "").replace(/"/g, '""')}"`)
            .join(","),
        ),
      ].join("\n");
      download(csv, `cakey-waitlist-${new Date().toISOString().slice(0, 10)}.csv`);
    } else {
      const headers = ["project_name", "contact_email", "status", "status_note", "tracking_code", "created_at"];
      const csv = [
        headers.join(","),
        ...filteredApps.map((r) =>
          headers
            .map((h) => `"${String((r as Record<string, unknown>)[h] ?? "").replace(/"/g, '""')}"`)
            .join(","),
        ),
      ].join("\n");
      download(csv, `cakey-applications-${new Date().toISOString().slice(0, 10)}.csv`);
    }
  };

  return (
    <DashboardShell
      eyebrow="Cakey admin"
      title={tab === "waitlist" ? "Waitlist" : "Applications"}
      description={
        tab === "waitlist"
          ? `${filteredWaitlist.length} of ${rows.length} waitlist entries`
          : `${filteredApps.length} of ${apps.length} project applications`
      }
      actions={
        <div className="flex gap-2">
          <TabBtn active={tab === "waitlist"} onClick={() => setTab("waitlist")}>
            Waitlist
          </TabBtn>
          <TabBtn active={tab === "applications"} onClick={() => setTab("applications")}>
            <FileText className="h-3.5 w-3.5" /> Applications
          </TabBtn>
        </div>
      }
    >
      <div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder={tab === "waitlist" ? "Search email or wallet…" : "Search project or email…"}
              className="w-full rounded-xl border border-border bg-background/40 py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          {tab === "waitlist" ? (
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border border-border bg-background/40 px-3 py-2.5 text-sm"
            >
              <option value="">All roles</option>
              <option value="investor">Investor</option>
              <option value="team">Project team</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-border bg-background/40 px-3 py-2.5 text-sm"
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace("_", " ")}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={exportCsv}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>

        <div className="glass mt-6 overflow-x-auto rounded-2xl">
          {loadingRows ? (
            <div className="flex items-center justify-center p-10">
              <Loader2 className="h-5 w-5 animate-spin text-accent" />
            </div>
          ) : tab === "waitlist" ? (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Wallet</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filteredWaitlist.map((r) => (
                  <tr key={r.id} className="border-b border-border/50 last:border-b-0 hover:bg-card/30">
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.role ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {r.wallet_address ? `${r.wallet_address.slice(0, 6)}…${r.wallet_address.slice(-4)}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{r.source ?? "—"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                  </tr>
                ))}
                {filteredWaitlist.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                      No entries match.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Project</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((a) => (
                  <tr key={a.id} className="border-b border-border/50 last:border-b-0 hover:bg-card/30">
                    <td className="px-4 py-3 font-medium">{a.project_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.contact_email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                          a.status === "approved" && "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
                          a.status === "rejected" && "border-destructive/40 bg-destructive/10 text-destructive",
                          a.status === "under_review" && "border-amber-400/40 bg-amber-400/10 text-amber-300",
                          a.status === "submitted" && "border-sky-400/40 bg-sky-400/10 text-sky-300",
                        )}
                      >
                        {a.status?.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {a.token_symbol || "—"} / {a.token_chain || "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={a.status}
                        onChange={(e) => updateStatus(a.id, e.target.value as (typeof STATUS_OPTIONS)[number])}
                        className="rounded-lg border border-border bg-background/40 px-2 py-1 text-xs"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                      No applications match.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium",
        active ? "border-accent/50 bg-accent/15 text-accent" : "border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function download(csv: string, name: string) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
