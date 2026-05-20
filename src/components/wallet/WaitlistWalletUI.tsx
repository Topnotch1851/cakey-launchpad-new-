"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { WagmiProvider, useAccount } from "wagmi";
import {
  RainbowKitProvider,
  darkTheme,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { Loader2 } from "lucide-react";
import { wagmiConfig } from "@/lib/wagmi";
import { ErrorBoundary } from "@/components/ErrorBoundary";

/**
 * Self-contained wallet "Connect & Join" button.
 *
 * Lives BELOW the main waitlist form as a separate one-click signup path.
 * The main form (email + pasted wallet) is unrelated. they share no state.
 *
 * Heavy deps (Wagmi + RainbowKit, ~hundreds of KB) are owned by this island
 * so marketing pages that don't render `<Waitlist>` still ship zero wallet
 * bytes; the wallet bundle only fetches on routes that render this.
 */

type ConnectAndJoinButtonProps = {
  /**
   * Called with the connected wallet address as soon as a fresh connection
   * is established by the user clicking this button (not on page-load
   * auto-reconnect).  Receives the unmodified address; normalisation and
   * insertion happens server-side via the server action.
   */
  onJoinWithWallet: (address: string) => Promise<void>;
  /** Disable the button (e.g. while a parallel submit is in flight). */
  disabled?: boolean;
};

function ConnectAndJoinButton({
  onJoinWithWallet,
  disabled,
}: ConnectAndJoinButtonProps) {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [submitting, setSubmitting] = useState(false);

  // Distinguishes "user just clicked this button" from "wallet was already
  // connected when the page loaded."  We only auto-submit after a click.
  const intentRef = useRef(false);

  const submit = useCallback(
    async (addr: string) => {
      if (submitting) return;
      setSubmitting(true);
      try {
        await onJoinWithWallet(addr);
      } finally {
        setSubmitting(false);
      }
    },
    [onJoinWithWallet, submitting],
  );

  // If user clicked the button without a wallet connected, the modal opens.
  // When `address` then transitions from undefined to defined, submit.
  useEffect(() => {
    if (intentRef.current && address) {
      intentRef.current = false;
      submit(address);
    }
  }, [address, submit]);

  const handleClick = () => {
    if (disabled || submitting) return;
    if (isConnected && address) {
      submit(address);
      return;
    }
    intentRef.current = true;
    openConnectModal?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || submitting}
      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card/40 px-6 py-3.5 text-sm font-medium text-foreground transition-[transform,background-color,box-shadow,border-color] duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-card/70 hover:scale-[1.02] hover:shadow-[0_8px_30px_-12px_oklch(0.72_0.14_78/0.25)] active:scale-[0.98] active:shadow-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-60 disabled:hover:bg-card/40 disabled:hover:scale-100 disabled:hover:shadow-none disabled:active:scale-100"
    >
      {submitting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> Joining with wallet…
        </>
      ) : (
        <>Connect wallet to join</>
      )}
    </button>
  );
}

/**
 * Static fallback shown when wallet connection cannot be initialized
 * (missing WC project ID, or an unexpected RainbowKit/Wagmi crash). The
 * surrounding form still works — users can join with email alone.
 */
function WalletUnavailable() {
  return (
    <button
      type="button"
      disabled
      title="Wallet connection is temporarily unavailable. Use email above to join."
      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card/30 px-6 py-3.5 text-sm font-medium text-muted-foreground opacity-70"
    >
      Wallet connection unavailable
    </button>
  );
}

export default function WaitlistWalletUI(props: ConnectAndJoinButtonProps) {
  // Fence the wallet UI behind a local ErrorBoundary so a runtime fault
  // inside RainbowKit/Wagmi (network, relay outage, etc.) only knocks out
  // the button — not the whole page.
  return (
    <ErrorBoundary fallback={<WalletUnavailable />}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "oklch(0.72 0.14 78)",
            accentColorForeground: "white",
            borderRadius: "large",
            overlayBlur: "small",
          })}
        >
          <ConnectAndJoinButton {...props} />
        </RainbowKitProvider>
      </WagmiProvider>
    </ErrorBoundary>
  );
}
