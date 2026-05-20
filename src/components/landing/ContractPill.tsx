"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface Props {
  symbol: string;
  address: string;
  status?: string;
}

/** Display the address as `0x1234…abcd` while copying the full value. */
function shorten(addr: string): string {
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ContractPill({ symbol, address, status = "TBA" }: Props) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore. clipboard may be blocked in some contexts
    }
  };

  return (
    <div
      className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border bg-card/50 px-3 py-2 font-mono text-[11px] text-muted-foreground backdrop-blur"
      title={address}
    >
      <span className="text-accent">{symbol}</span>
      <span>{shorten(address)}</span>
      <span className="ml-1 rounded-md border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wider">
        {status}
      </span>
      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Copied" : "Copy contract address"}
        title={copied ? "Copied" : "Copy address"}
        className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-md border border-border bg-card/60 text-muted-foreground transition-[transform,background-color,color] duration-[140ms] ease-[var(--ease-out-strong)] hover:bg-card hover:text-foreground active:scale-[0.92]"
      >
        {copied ? (
          <Check className="h-3 w-3 text-accent" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </button>
    </div>
  );
}
