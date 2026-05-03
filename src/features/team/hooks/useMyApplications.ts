"use client";

import { useQuery } from "@tanstack/react-query";
import { listMyApplications } from "@/server/team.functions";

export type Application = {
  id: string;
  project_name: string;
  contact_email: string;
  status: string;
  status_note: string | null;
  token_chain: string | null;
  token_symbol: string | null;
  created_at: string;
  tracking_code: string;
  website: string | null;
};

export function useMyApplications(enabled: boolean) {
  return useQuery({
    queryKey: ["team", "my-applications"],
    enabled,
    staleTime: 30_000,
    queryFn: async () => {
      const res = await listMyApplications();
      if (!res.ok) return [] as Application[];
      return res.applications as Application[];
    },
  });
}
