import { FormEvent, useState } from "react";
import { Card } from "@/shared/ui/Card";
import { VerifyResult } from "@/features/verify/components/VerifyResult";
import { env } from "@/shared/config/env";

type VerificationTarget = {
  account: string;
  blobName: string;
};

export function VerifyPage() {
  const [account, setAccount] = useState("");
  const [blobName, setBlobName] = useState("");
  const [submitted, setSubmitted] = useState<VerificationTarget | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    setSubmitted({
      account: trimmedAccount,
      blobName: trimmedBlobName,
    });
  }

  return (
    <div className="page-grid page-grid-feature">
      <Card
        title="Verify an object"
        description="Use an account namespace and blob name to resolve metadata from Shelby."
      >
        <div className="feature-intro">
          <div className="metric-strip">
            <div className="metric-strip-item">
              <span>Lookup type</span>
              <strong>Account + blob name</strong>
            </div>
            <div className="metric-strip-item">
              <span>Response</span>
              <strong>Metadata + links</strong>
            </div>
          </div>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label className="field">
            <span>Account address</span>
            <input
              value={account}
              onChange={(event) => setAccount(event.target.value)}
              placeholder="0x..."
            />
          </label>

          <label className="field">
            <span>Blob name</span>
            <input
              value={blobName}
              onChange={(event) => setBlobName(event.target.value)}
              placeholder="example.png"
            />
          </label>

          <div className="helper-block">
            <div className="helper-text">
              Paste the exact owner account and blob name used during upload.
            </div>
          </div>

          {error ? <p className="status-error">{error}</p> : null}

          <button className="primary-button" type="submit">
            Verify object
          </button>
        </form>
      </Card>

      {submitted ? (
        <VerifyResult {...submitted} />
      ) : (
        <Card
          title="Verification result"
          description="Results will appear after you submit a valid account and blob name."
        >
          <div className="empty-panel empty-panel-tall">
            Ready for lookup. Submit a known object key to inspect its Shelby metadata.
          </div>
        </Card>
      )}
    </div>
  );
}
