import { useMemo, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { copyText } from "@/shared/lib/clipboard";
import { truncateAddress } from "@/shared/lib/blob";

type WalletVisual = {
  accentClass: string;
  fallbackLabel: string;
};

function getWalletVisual(name: string): WalletVisual {
  const normalized = name.toLowerCase();

  if (normalized.includes("petra")) return { accentClass: "wallet-option-petra", fallbackLabel: "P" };
  if (normalized.includes("google")) return { accentClass: "wallet-option-google", fallbackLabel: "G" };
  if (normalized.includes("apple")) return { accentClass: "wallet-option-apple", fallbackLabel: "A" };
  if (normalized.includes("okx")) return { accentClass: "wallet-option-okx", fallbackLabel: "O" };
  if (normalized.includes("nightly")) return { accentClass: "wallet-option-nightly", fallbackLabel: "N" };
  if (normalized.includes("martian")) return { accentClass: "wallet-option-martian", fallbackLabel: "M" };

  return { accentClass: "wallet-option-generic", fallbackLabel: name.slice(0, 1).toUpperCase() };
}

export function WalletPanel() {
  const { account, connected, wallet, wallets, connect, disconnect } = useWallet();
  const walletOptions = useMemo(() => wallets ?? [], [wallets]);
  const [selectedWallet, setSelectedWallet] = useState("");
  const [copied, setCopied] = useState(false);
  const [brokenIcons, setBrokenIcons] = useState<Record<string, boolean>>({});

  const effectiveWallet = selectedWallet || walletOptions[0]?.name || "";
  const connectedAddress = account?.address?.toString() ?? "";

  async function handleCopy() {
    if (!connectedAddress) return;
    const success = await copyText(connectedAddress);
    if (!success) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  if (connected) {
    return (
      <aside className="wallet-panel wallet-panel-connected wallet-panel-polished wallet-panel-compact">
        <div className="wallet-connected-bar">
          <div className="wallet-chip">Connected</div>
          <strong>{wallet?.name ?? "Aptos Wallet"}</strong>
        </div>
        <div className="wallet-copy-box">
          <span>{truncateAddress(connectedAddress, 10, 6)}</span>
          <button type="button" className="secondary-button wallet-copy-button" onClick={() => void handleCopy()}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <button type="button" className="primary-button wallet-primary-action" onClick={disconnect}>
          Disconnect
        </button>
      </aside>
    );
  }

  return (
    <aside className="wallet-panel wallet-panel-form wallet-panel-polished wallet-panel-compact">
      {walletOptions.length ? (
        <>
          <div className="wallet-option-grid wallet-option-grid-compact wallet-option-grid-rich">
            {walletOptions.map((availableWallet) => {
              const visual = getWalletVisual(availableWallet.name);
              const isSelected = effectiveWallet === availableWallet.name;
              const canUseIcon = Boolean((availableWallet as { icon?: string }).icon) && !brokenIcons[availableWallet.name];

              return (
                <button
                  key={availableWallet.name}
                  type="button"
                  className={
                    isSelected
                      ? `wallet-option wallet-option-compact wallet-option-rich ${visual.accentClass} wallet-option-selected`
                      : `wallet-option wallet-option-compact wallet-option-rich ${visual.accentClass}`
                  }
                  onClick={() => setSelectedWallet(availableWallet.name)}
                >
                  <span className="wallet-option-icon wallet-option-icon-real wallet-option-icon-image">
                    {canUseIcon ? (
                      <img
                        src={(availableWallet as { icon?: string }).icon}
                        alt={availableWallet.name}
                        className="wallet-option-provider-image"
                        onError={() =>
                          setBrokenIcons((current) => ({
                            ...current,
                            [availableWallet.name]: true,
                          }))
                        }
                      />
                    ) : (
                      <span className="wallet-generic-icon">{visual.fallbackLabel}</span>
                    )}
                  </span>
                  <span className="wallet-option-copy">
                    <strong>{availableWallet.name}</strong>
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="primary-button wallet-primary-action"
            disabled={!effectiveWallet}
            onClick={() => void connect(effectiveWallet)}
          >
            Connect wallet
          </button>
        </>
      ) : (
        <div className="wallet-empty-state">No Aptos wallet detected.</div>
      )}
    </aside>
  );
}
