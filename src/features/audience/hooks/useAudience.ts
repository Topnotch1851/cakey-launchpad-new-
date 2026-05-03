"use client";

import { useAudienceStore, type Audience } from "@/stores/audienceStore";

export function useAudience() {
  const audience = useAudienceStore((s) => s.audience);
  const setAudience = useAudienceStore((s) => s.setAudience);
  const clear = useAudienceStore((s) => s.clear);
  return { audience, setAudience, clear };
}

export type { Audience };
