import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useUploadBlobs } from "@shelby-protocol/react";
import { Card } from "@/shared/ui/Card";
import {
  addDaysToMicros,
  defaultBlobName,
  formatBytes,
  truncateAddress,
} from "@/shared/lib/blob";
import { UploadResult } from "@/features/upload/components/UploadResult";
import { env } from "@/shared/config/env";

type LatestUpload = {
  account: string;
  blobName: string;
  fileSize: number;
  expirationMicros: number;
};

export function UploadPage() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [blobName, setBlobName] = useState("");
  const [expirationDays, setExpirationDays] = useState(7);
  const [localError, setLocalError] = useState<string | null>(null);
  const [latestUpload, setLatestUpload] = useState<LatestUpload | null>(null);

  const uploadBlobs = useUploadBlobs({
    onSuccess: () => {
      setLocalError(null);
    },
    onError: (error) => {
      setLocalError(error.message);
    },
  });

  const connectedAccount = account?.address?.toString() ?? "";
  const uploadReady = Boolean(
    connectedAccount && selectedFile && blobName && env.shelbyApiKey,
  );

  const expirationMicros = useMemo(
    () => addDaysToMicros(expirationDays),
    [expirationDays],
  );

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;

    if (nextFile && nextFile.size > 10 * 1024 * 1024) {
      setSelectedFile(null);
      setLocalError("Please keep the MVP upload under 10 MB per file.");
      return;
    }

    setSelectedFile(nextFile);
    if (nextFile) {
      setBlobName(defaultBlobName(nextFile));
      setLocalError(null);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!connectedAccount) {
      setLocalError("Connect an Aptos wallet before uploading.");
      return;
    }

    if (!selectedFile) {
      setLocalError("Choose a file first.");
      return;
    }

    if (!env.shelbyApiKey) {
      setLocalError("Missing VITE_SHELBY_API_KEY in .env.");
      return;
    }

    if (!blobName.trim()) {
      setLocalError("Blob name is required.");
      return;
    }

    if (expirationDays < 1 || expirationDays > 30) {
      setLocalError("Expiration must stay between 1 and 30 days for this MVP.");
      return;
    }

    setLocalError(null);

    const blobData = new Uint8Array(await selectedFile.arrayBuffer());

    await uploadBlobs.mutateAsync({
      signer: {
        account: connectedAccount,
        signAndSubmitTransaction,
      },
      blobs: [
        {
          blobName: blobName.trim(),
          blobData,
        },
      ],
      expirationMicros,
    });

    setLatestUpload({
      account: connectedAccount,
      blobName: blobName.trim(),
      fileSize: selectedFile.size,
      expirationMicros,
    });
  }

  return (
    <div className="page-grid page-grid-feature">
      <Card
        title="Upload a file"
        description="Store one file on Shelby testnet through the wallet-driven browser flow."
      >
        <div className="feature-intro">
          <div className="metric-strip">
            <div className="metric-strip-item">
              <span>Account</span>
              <strong>
                {connectedAccount
                  ? truncateAddress(connectedAccount, 10, 6)
                  : "Wallet required"}
              </strong>
            </div>
            <div className="metric-strip-item">
              <span>Limit</span>
              <strong>10 MB</strong>
            </div>
            <div className="metric-strip-item">
              <span>Default expiry</span>
              <strong>7 days</strong>
            </div>
          </div>
        </div>

        <form className="form-stack" onSubmit={(event) => void handleSubmit(event)}>
          <label className="field field-file-picker">
            <span>File</span>
            <input type="file" onChange={handleFileChange} />
          </label>

          {selectedFile ? (
            <div className="inline-summary">
              <strong>{selectedFile.name}</strong>
              <span>{formatBytes(selectedFile.size)}</span>
            </div>
          ) : (
            <div className="empty-panel">Select an image, document, or small asset to continue.</div>
          )}

          <label className="field">
            <span>Blob name</span>
            <input
              value={blobName}
              onChange={(event) => setBlobName(event.target.value)}
              placeholder="example.png"
            />
          </label>

          <label className="field">
            <span>Expiration in days</span>
            <input
              type="number"
              min={1}
              max={30}
              value={expirationDays}
              onChange={(event) => setExpirationDays(Number(event.target.value))}
            />
          </label>

          <div className="helper-block">
            <div className="helper-text">
              Upload requires an expiration value and currently targets short-lived
              MVP testnet usage.
            </div>
            <div className="helper-text">
              Recommended files: images, documents, and lightweight media under 10 MB.
            </div>
          </div>

          {localError ? <p className="status-error">{localError}</p> : null}
          {uploadBlobs.isSuccess ? (
            <p className="status-success">Upload transaction and blob flow completed.</p>
          ) : null}

          <button className="primary-button" type="submit" disabled={!uploadReady || uploadBlobs.isPending}>
            {uploadBlobs.isPending ? "Uploading..." : "Upload to Shelby"}
          </button>
        </form>
      </Card>

      {latestUpload ? (
        <UploadResult {...latestUpload} />
      ) : (
        <Card
          title="Upload result"
          description="Your latest object details will appear here after a successful upload."
        >
          <div className="empty-panel empty-panel-tall">
            No upload yet. Connect a wallet, choose a file, and send your first
            object to Shelby testnet.
          </div>
        </Card>
      )}
    </div>
  );
}
