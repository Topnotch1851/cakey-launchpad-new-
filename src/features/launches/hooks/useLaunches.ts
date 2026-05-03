"use client";

import { useQuery, queryOptions } from "@tanstack/react-query";
import { listLaunches, type LaunchSummary } from "@/server/launches.functions";

export type Launch = LaunchSummary;

export const launchesQueryOptions = (params: { status: string; q: string }) =>
  queryOptions({
    queryKey: ["launches", params.status, params.q],
    staleTime: 30_000,
    queryFn: async () => {
      const res = await listLaunches({
        data: {
          status: params.status as "all" | "upcoming" | "live" | "ended" | "cancelled",
          search: params.q,
        },
      });
      return res.ok ? res.launches : [];
    },
  });

export function useLaunches(params: { status: string; q: string }) {
  return useQuery(launchesQueryOptions(params));
}
