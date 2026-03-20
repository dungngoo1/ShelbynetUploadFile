import { ReactElement, useMemo, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { truncateAddress } from "@/shared/lib/blob";

type WalletVisual = {
  accentClass: string;
  icon: ReactElement;
};

function PetraIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="wallet-svg">
      <rect width="64" height="64" rx="18" fill="#5A3FF5" />
      <path d="M18 48V24h14.5l6.5 6.2v6.1L31 44h-13Z" fill="#fff" />
      <path d="M31 24h14c6.1 0 10 4.1 10 9.5 0 3.8-1.8 6.6-5.4 8.7L41 50l-10-10 8-8h-8V24Z" fill="#fff" transform="translate(-7 0)" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="wallet-svg">
      <rect width="64" height="64" rx="16" fill="#fff" />
      <path d="M54 33c0-1.8-.2-3.1-.5-4.5H32v8.5h12.6c-.2 2.1-1.5 5.2-4.5 7.3l6.9 5.4C51.2 46 54 40.2 54 33Z" fill="#4285F4" />
      <path d="M32 55c6.1 0 11.3-2 15-5.4l-6.9-5.4c-1.8 1.3-4.3 2.3-8.1 2.3-5.9 0-10.9-3.9-12.7-9.2l-7.1 5.5C15.8 50 23.3 55 32 55Z" fill="#34A853" />
      <path d="M19.3 37.3A13.6 13.6 0 0 1 18.6 33c0-1.5.3-2.9.7-4.3l-7.1-5.5A22.9 22.9 0 0 0 10 33c0 3.7.9 7.1 2.2 9.8l7.1-5.5Z" fill="#FBBC04" />
      <path d="M32 19.5c4.8 0 8 2.1 9.8 3.8l6-5.8C43.3 13.4 38.1 11 32 11c-8.7 0-16.2 5-19.8 12.2l7.1 5.5c1.8-5.3 6.8-9.2 12.7-9.2Z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="wallet-svg">
      <rect width="64" height="64" rx="16" fill="#fff" />
      <path d="M41 34.2c0-5 4.2-7.3 4.3-7.3-2.3-3.4-5.9-3.9-7.2-4-3.1-.3-6 1.8-7.5 1.8-1.5 0-3.9-1.8-6.4-1.7-3.3 0-6.3 1.9-8 4.8-3.4 5.9-.9 14.6 2.5 19.6 1.7 2.4 3.6 5 6.2 4.9 2.5-.1 3.5-1.6 6.6-1.6s4 1.6 6.7 1.6c2.7 0 4.5-2.5 6.1-4.9 1.9-2.7 2.6-5.4 2.6-5.5-.1 0-5.9-2.3-5.9-8.7Z" fill="#111" />
      <path d="M36.4 18.5c1.3-1.6 2.2-3.8 2-6-1.9.1-4.2 1.3-5.6 2.9-1.3 1.5-2.4 3.8-2.1 5.9 2.2.2 4.4-1.1 5.7-2.8Z" fill="#111" />
    </svg>
  );
}

function OkxIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="wallet-svg">
      <rect width="64" height="64" rx="16" fill="#9AF51C" />
      <g fill="#111">
        <rect x="12" y="12" width="14" height="14" rx="2" />
        <rect x="38" y="12" width="14" height="14" rx="2" />
        <rect x="25" y="25" width="14" height="14" rx="2" />
        <rect x="12" y="38" width="14" height="14" rx="2" />
        <rect x="38" y="38" width="14" height="14" rx="2" />
      </g>
    </svg>
  );
}

function GenericIcon(label: string) {
  return (
    <div className="wallet-generic-icon" aria-hidden="true">
      {label.slice(0, 1).toUpperCase()}
    </div>
  );
}

function getWalletVisual(name: string): WalletVisual {
  const normalized = name.toLowerCase();

  if (normalized.includes("petra")) {
    return { accentClass: "wallet-option-petra", icon: <PetraIcon /> };
  }

  if (normalized.includes("google")) {
    return { accentClass: "wallet-option-google", icon: <GoogleIcon /> };
  }

  if (normalized.includes("okx")) {
    return { accentClass: "wallet-option-okx", icon: <OkxIcon /> };
  }

  if (normalized.includes("apple")) {
    return { accentClass: "wallet-option-apple", icon: <AppleIcon /> };
  }

  if (normalized.includes("nightly")) {
    return { accentClass: "wallet-option-nightly", icon: GenericIcon("N") };
  }

  if (normalized.includes("martian")) {
    return { accentClass: "wallet-option-martian", icon: GenericIcon("M") };
  }

  return { accentClass: "wallet-option-generic", icon: GenericIcon(name) };
}

async function copyToClipboard(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch (error) {
    console.error("Failed to copy wallet address:", error);
  }
}

export function WalletPanel() {
  const { account, connected, wallet, wallets, connect, disconnect } = useWallet();

  const walletOptions = useMemo(() => wallets ?? [], [wallets]);
  const [selectedWallet, setSelectedWallet] = useState("");

  const effectiveWallet = selectedWallet || walletOptions[0]?.name || "";
  const connectedAddress = account?.address?.toString() ?? "";

  if (connected) {
    return (
      <aside className="wallet-panel wallet-panel-connected wallet-panel-polished">
        <div className="wallet-chip">Wallet connected</div>
        <h2>{wallet?.name ?? "Aptos Wallet"}</h2>
        <div className="wallet-copy-box">
          <span>{truncateAddress(connectedAddress, 10, 6)}</span>
          <button
            type="button"
            className="secondary-button wallet-copy-button"
            onClick={() => void copyToClipboard(connectedAddress)}
          >
            Copy
          </button>
        </div>
        <div className="wallet-connected-actions">
          <button type="button" className="primary-button" onClick={disconnect}>
            Disconnect wallet
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside className="wallet-panel wallet-panel-form wallet-panel-polished">
      <div className="wallet-chip">Wallet access</div>
      <h2>Connect an Aptos wallet</h2>
      <p className="wallet-description">
        Pick a provider card below. The selected wallet will be used for Shelby
        upload signatures in the browser.
      </p>

      {walletOptions.length ? (
        <>
          <div className="wallet-option-grid wallet-option-grid-polished">
            {walletOptions.map((availableWallet) => {
              const visual = getWalletVisual(availableWallet.name);
              const isSelected = effectiveWallet === availableWallet.name;

              return (
                <button
                  key={availableWallet.name}
                  type="button"
                  className={isSelected ? `wallet-option ${visual.accentClass} wallet-option-selected` : `wallet-option ${visual.accentClass}`}
                  onClick={() => setSelectedWallet(availableWallet.name)}
                >
                  <span className="wallet-option-icon wallet-option-icon-real">{visual.icon}</span>
                  <span className="wallet-option-copy">
                    <strong>{availableWallet.name}</strong>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="wallet-submit-row">
            <span className="wallet-selected-label">
              Selected: <strong>{effectiveWallet}</strong>
            </span>
            <button
              type="button"
              className="primary-button"
              disabled={!effectiveWallet}
              onClick={() => void connect(effectiveWallet)}
            >
              Connect wallet
            </button>
          </div>
        </>
      ) : (
        <div className="wallet-empty-state">
          No Aptos wallet was detected in this browser. Install Petra or another
          compatible wallet extension first.
        </div>
      )}
    </aside>
  );
}
