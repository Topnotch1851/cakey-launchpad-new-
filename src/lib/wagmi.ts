import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, base, arbitrum, optimism, polygon } from "wagmi/chains";
import { env } from "@/lib/env";

const projectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "cakey-dev-placeholder";

export const wagmiConfig = getDefaultConfig({
  appName: "Cakey AI Launchpad",
  projectId,
  chains: [mainnet, base, arbitrum, optimism, polygon],
  ssr: true,
});
