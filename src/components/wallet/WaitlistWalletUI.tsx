"use client";

import { useEffect } from "react";
import { WagmiProvider, useAccount } from "wagmi";
import { RainbowKitProvider, ConnectButton, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "@/lib/wagmi";

/**
 * Self-contained wallet island.
 *
 * Mounts its own Wagmi + RainbowKit providers so the wallet bundle (heavy:
 * ~hundreds of KB combined) doesn't ship with marketing pages that never
 * render this component.  Loaded via `next/dynamic({ ssr: false })` from the
 * waitlist form.
 *
 * Reuses the QueryClient from the parent provider tree — wagmi v2 will pick it up.
 */

type Props = {
  /** Called whenever the connected address changes (including null on disconnect). */
  onChange: (address: string | null) => void;
};

function WalletButton({ onChange }: Props) {
  const { address } = useAccount();

  useEffect(() => {
    onChange(address ?? null);
  }, [address, onChange]);

  return (
    <ConnectButton.Custom>
      {({ openConnectModal, openAccountModal, account, mounted }) => (
        <button
          type="button"
          onClick={account ? openAccountModal : openConnectModal}
          disabled={!mounted}
          className="rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs font-medium hover:bg-card"
        >
          {account ? "Connected" : "Connect wallet"}
        </button>
      )}
    </ConnectButton.Custom>
  );
}

export default function WaitlistWalletUI(props: Props) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "oklch(0.72 0.14 78)",
          accentColorForeground: "white",
          borderRadius: "large",
          overlayBlur: "small",
        })}
      >
        <WalletButton {...props} />
      </RainbowKitProvider>
    </WagmiProvider>
  );
}
