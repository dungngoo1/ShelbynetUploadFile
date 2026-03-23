import { FormEvent, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Card } from "@/shared/ui/Card";
import { VerifyResult } from "@/features/verify/components/VerifyResult";
import { env } from "@/shared/config/env";

type VerificationTarget = {
  account: string;
  blobName: string;
};

export function VerifyPage() {
  const { account: connectedWallet } = useWallet();
  const [account, setAccount] = useState("");
  const [blobName, setBlobName] = useState("");
  const [submitted, setSubmitted] = useState<VerificationTarget | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connectedAccount = connectedWallet?.address?.toString() ?? "";

  function handleUseConnectedWallet() {
    if (!connectedAccount) return;
    setAccount(connectedAccount);
    setError(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedAccount = account.trim();
    const trimmedBlobName = blobName.trim();

    if (!trimmedAccount || !trimmedBlobName) {
      setError("Account and blob name are both required.");
      return;
    }

    if (!env.shelbyApiKey) {
      setError("Missing VITE_SHELBY_API_KEY in .env.");
      return;
    }

    setError(null);
    setSubmitted({ account: trimmedAccount, blobName: trimmedBlobName });
  }

  return (
    <div className="page-stack page-stack-compact">
      <div className="page-grid page-grid-feature page-grid-dashboard page-grid-tight page-grid-single-main">
        <Card
          title="Proof Inspector"
          description="Resolve a known object and inspect what Shelby metadata returns."
        >
          <form className="form-stack form-stack-tight" onSubmit={handleSubmit}>
            <label className="field">
              <span>Owner account</span>
              <input
                value={account}
                onChange={(event) => setAccount(event.target.value)}
                placeholder="0x..."
              />
            </label>

            {connectedAccount ? (
              <button
                type="button"
                className="secondary-button inline-action-button"
                onClick={handleUseConnectedWallet}
              >
                Use connected wallet
              </button>
            ) : null}

            <label className="field">
              <span>Blob name</span>
              <input
                value={blobName}
                onChange={(event) => setBlobName(event.target.value)}
                placeholder="example.png"
              />
            </label>

            {error ? <p className="status-error">{error}</p> : null}

            <button className="primary-button primary-button-glow" type="submit">
              Verify object
            </button>
          </form>
        </Card>

        {submitted ? (
          <VerifyResult {...submitted} />
        ) : (
          <Card
            title="Verification output"
            description="Metadata response appears here after a valid lookup."
          >
            <div className="empty-panel empty-panel-tall proof-preview-empty proof-preview-empty-compact">
              <div>
                <strong>Ready for lookup</strong>
                <p>Submit an object key to inspect its metadata and object URL.</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
