import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, base, arbitrum, optimism, polygon } from "wagmi/chains";
import { env } from "@/lib/env";

/**
 * WalletConnect requires a real project ID issued from cloud.walletconnect.com.
 * We expose `isWalletConnectConfigured` so the wallet island can render a
 * disabled state with a useful message instead of letting RainbowKit throw
 * (which previously bubbled up to the root ErrorBoundary and nuked the page).
 */
const rawProjectId = env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
export const isWalletConnectConfigured = Boolean(rawProjectId);

if (!isWalletConnectConfigured && typeof window !== "undefined") {

  console.warn(
    "[wagmi] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is missing. " +
      "Wallet connection will be disabled. Set the env var in Vercel " +
      "(Project Settings → Environment Variables) and redeploy.",
  );
}

export const wagmiConfig = getDefaultConfig({
  appName: "Cakey AI Launchpad",
  // RainbowKit requires a non-empty string. We pass a deterministic sentinel
  // so the call doesn't crash, but the UI gates on `isWalletConnectConfigured`
  // and never actually invokes the WC handshake when it's a sentinel.
  projectId: rawProjectId ?? "cakey-missing-projectid-sentinel",
  chains: [mainnet, base, arbitrum, optimism, polygon],
  ssr: true,
});
