"use client";

import { useEffect, useState, useCallback } from "react";

const WATCHLIST_KEY = "cakey:watchlist";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WATCHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [slugs, setSlugs] = useState<string[]>([]);

  useEffect(() => {
    setSlugs(read());
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugs((cur) => {
      const next = cur.filter((s) => s !== slug);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const add = useCallback((slug: string) => {
    setSlugs((cur) => {
      if (cur.includes(slug)) return cur;
      const next = [...cur, slug];
      if (typeof window !== "undefined") {
        window.localStorage.setItem(WATCHLIST_KEY, JSON.stringify(next));
      }
      return next;
    });
  }, []);

  return { slugs, add, remove };
}
