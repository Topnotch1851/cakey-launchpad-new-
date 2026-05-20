import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, base, arbitrum, optimism, polygon } from "wagmi/chains";
import { env } from "@/lib/env";

const projectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error(
    "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is required. " +
      "Set it in .env.local (development) and in the Vercel project " +
      "environment variables (production / preview / development).",
  );
}

export const wagmiConfig = getDefaultConfig({
  appName: "Cakey AI Launchpad",
  projectId,
  chains: [mainnet, base, arbitrum, optimism, polygon],
  ssr: true,
});
