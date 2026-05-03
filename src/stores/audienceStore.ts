import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Audience = "investor" | "founder";

interface AudienceState {
  audience: Audience | null;
  setAudience: (a: Audience) => void;
  clear: () => void;
}

export const useAudienceStore = create<AudienceState>()(
  persist(
    (set) => ({
      audience: null,
      setAudience: (a) => set({ audience: a }),
      clear: () => set({ audience: null }),
    }),
    {
      name: "cakey:audience",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.localStorage : (undefined as any),
      ),
    },
  ),
);
