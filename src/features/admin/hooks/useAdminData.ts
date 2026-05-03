"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminListApplications,
  adminUpdateApplicationStatus,
  adminListWaitlist,
  type WaitlistRow,
} from "@/server/admin.functions";
import {
  adminListClaims,
  adminGetClaimHistory,
  adminUpdateClaimStatus,
} from "@/server/admin-claims.functions";
import { getAdminAnalytics } from "@/server/analytics.functions";

export type { WaitlistRow };

export function useWaitlist(enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "waitlist"],
    enabled,
    staleTime: 30_000,
    queryFn: () => adminListWaitlist(),
  });
}

export function useAdminApplications(enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "applications"],
    enabled,
    staleTime: 30_000,
    queryFn: async () => {
      const res = await adminListApplications();
      if (!res.ok) throw new Error("Failed");
      return res.applications;
    },
  });
}

export function useUpdateApplicationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; status: string; note: string | null }) => {
      const res = await adminUpdateApplicationStatus({ data: input });
      if (!res.ok) throw new Error("Failed");
      return input;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "applications"] });
    },
  });
}

export function useAdminClaims(enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "claims"],
    enabled,
    staleTime: 30_000,
    queryFn: async () => {
      const res = await adminListClaims();
      if (!res.ok) throw new Error("Failed to load claims");
      return res.claims;
    },
  });
}

export function useClaimHistory(claimId: string | null) {
  return useQuery({
    queryKey: ["admin", "claim-history", claimId],
    enabled: !!claimId,
    staleTime: 30_000,
    queryFn: async () => {
      const res = await adminGetClaimHistory({ data: { claimId: claimId! } });
      if (!res.ok) throw new Error("Failed to load history");
      return res.history;
    },
  });
}

export function useUpdateClaimStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      id: string;
      status: "submitted" | "under_review" | "evidence_requested" | "approved" | "rejected" | "paid";
      note: string | null;
    }) => {
      const res = await adminUpdateClaimStatus({ data: input });
      if (!res.ok) throw new Error("Failed");
      return input;
    },
    onSuccess: (input) => {
      qc.invalidateQueries({ queryKey: ["admin", "claims"] });
      qc.invalidateQueries({ queryKey: ["admin", "claim-history", input.id] });
    },
  });
}

export function useAdminAnalytics(range: { from: string; to: string }, enabled: boolean) {
  return useQuery({
    queryKey: ["admin", "analytics", range.from, range.to],
    enabled,
    staleTime: 30_000,
    queryFn: () => getAdminAnalytics({ data: { from: range.from, to: range.to } }),
  });
}
