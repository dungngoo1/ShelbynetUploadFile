import { ChangeEvent, DragEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useUploadBlobs } from "@shelby-protocol/react";
import { Card } from "@/shared/ui/Card";
import {
  addDaysToMicros,
  buildBlobUrl,
  buildExplorerUrl,
  defaultBlobName,
  formatBytes,
  truncateAddress,
} from "@/shared/lib/blob";
import { UploadResult } from "@/features/upload/components/UploadResult";
import { env } from "@/shared/config/env";
import {
  listUploadRecords,
  metadataStoreLabel,
  saveUploadRecord,
  type UploadRecord,
} from "@/shared/lib/metadataStore";

type LatestUpload = {
  account: string;
  blobName: string;
  fileSize: number;
  expirationMicros: number;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

type UploadStage = "idle" | "preparing" | "signing" | "uploading" | "done";

function getMediaType(file: File) {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("audio/")) return "audio";
  return file.type || "file";
}

export function UploadPage() {
  const { account, signAndSubmitTransaction } = useWallet();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [blobName, setBlobName] = useState("");
  const [expirationDays, setExpirationDays] = useState(7);
  const [localError, setLocalError] = useState<string | null>(null);
  const [latestUpload, setLatestUpload] = useState<LatestUpload | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadStage, setUploadStage] = useState<UploadStage>("idle");
  const [uploadJournal, setUploadJournal] = useState<UploadRecord[]>([]);

  const uploadBlobs = useUploadBlobs({
    onSuccess: () => {
      setLocalError(null);
      setUploadStage("done");
    },
    onError: (error) => {
      setLocalError(error.message);
      setUploadStage("idle");
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

  const uploadSteps = [
    { key: "prepare", label: "Prepare", active: uploadStage !== "idle" },
    { key: "sign", label: "Sign", active: ["signing", "uploading", "done"].includes(uploadStage) },
    { key: "ship", label: "Upload", active: ["uploading", "done"].includes(uploadStage) },
  ];

  useEffect(() => {
    void listUploadRecords(connectedAccount || undefined, 5).then(setUploadJournal);
  }, [connectedAccount]);

  function applyNextFile(nextFile: File | null) {
    if (nextFile && nextFile.size > MAX_FILE_SIZE) {
      setSelectedFile(null);
      setBlobName("");
      setLocalError("Please keep the MVP upload under 10 MB per file.");
      setUploadStage("idle");
      return;
    }

    setSelectedFile(nextFile);

    if (nextFile) {
      setBlobName(defaultBlobName(nextFile));
      setLocalError(null);
      setUploadStage("idle");
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    applyNextFile(event.target.files?.[0] ?? null);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragActive(false);
    applyNextFile(event.dataTransfer.files?.[0] ?? null);
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragActive(true);
  }

  function handleDragLeave(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragActive(false);
  }

  function clearSelectedFile() {
    setSelectedFile(null);
    setBlobName("");
    setLocalError(null);
    setUploadStage("idle");
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

    try {
      setLocalError(null);
      setUploadStage("preparing");

      const cleanBlobName = blobName.trim();
      const blobData = new Uint8Array(await selectedFile.arrayBuffer());
      setUploadStage("signing");

      await uploadBlobs.mutateAsync({
        signer: {
          account: account?.address ?? connectedAccount,
          signAndSubmitTransaction: async (transaction) => {
            setUploadStage("signing");
            const result = await signAndSubmitTransaction(transaction);
            setUploadStage("uploading");
            return result;
          },
        },
        blobs: [
          {
            blobName: cleanBlobName,
            blobData,
          },
        ],
        expirationMicros,
      });

      setLatestUpload({
        account: connectedAccount,
        blobName: cleanBlobName,
        fileSize: selectedFile.size,
        expirationMicros,
      });

      const objectUrl = buildBlobUrl(connectedAccount, cleanBlobName);
      const explorerUrl = buildExplorerUrl(connectedAccount, cleanBlobName);

      await saveUploadRecord({
        id: `${connectedAccount}:${cleanBlobName}:${Date.now()}`,
        account: connectedAccount,
        blobName: cleanBlobName,
        fileSize: selectedFile.size,
        expirationMicros,
        objectUrl,
        explorerUrl,
        mediaType: getMediaType(selectedFile),
        createdAt: new Date().toISOString(),
      });

      setUploadJournal(await listUploadRecords(connectedAccount, 5));
    } catch {
      setUploadStage("idle");
    }
  }

  return (
    <div className="page-stack page-stack-compact">
      <section className="dashboard-strip dashboard-strip-compact">
        <div className="dashboard-stat-card anim-fade-up">
          <span>Account</span>
          <strong>
            {connectedAccount
              ? truncateAddress(connectedAccount, 10, 6)
              : "Wallet required"}
          </strong>
        </div>
        <div className="dashboard-stat-card anim-fade-up anim-delay-1">
          <span>Upload limit</span>
          <strong>10 MB</strong>
        </div>
        <div className="dashboard-stat-card anim-fade-up anim-delay-2">
          <span>Expiry</span>
          <strong>7 days</strong>
        </div>
        <div className="dashboard-stat-card anim-fade-up anim-delay-3">
          <span>Metadata store</span>
          <strong>{metadataStoreLabel()}</strong>
        </div>
      </section>

      <div className="page-grid page-grid-feature page-grid-dashboard page-grid-tight">
        <Card
          title="Upload station"
          description="One clean browser flow from file pick to proof snapshot."
        >
          <div className="upload-process-strip">
            {uploadSteps.map((step) => (
              <div key={step.key} className={step.active ? "process-chip process-chip-active" : "process-chip"}>
                {step.label}
              </div>
            ))}
          </div>

          <form className="form-stack" onSubmit={(event) => void handleSubmit(event)}>
            <label
              className={
                isDragActive
                  ? "field field-file-picker field-file-picker-active"
                  : "field field-file-picker"
              }
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <span>Asset file</span>
              <input type="file" onChange={handleFileChange} />
              <small className="drop-hint">Drag a file here or click to browse.</small>
            </label>

            {selectedFile ? (
              <div className="inline-summary inline-summary-file inline-summary-featured">
                <div>
                  <strong>{selectedFile.name}</strong>
                  <span>{formatBytes(selectedFile.size)}</span>
                </div>
                <button
                  type="button"
                  className="secondary-button inline-action-button"
                  onClick={clearSelectedFile}
                >
                  Clear
                </button>
              </div>
            ) : null}

            <div className="two-column-fields">
              <label className="field">
                <span>Blob name</span>
                <input
                  value={blobName}
                  onChange={(event) => setBlobName(event.target.value)}
                  placeholder="example.png"
                />
              </label>

              <label className="field">
                <span>Days</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={expirationDays}
                  onChange={(event) => setExpirationDays(Number(event.target.value))}
                />
              </label>
            </div>

            {uploadBlobs.isPending ? (
              <div className="helper-block helper-block-premium helper-block-live">
                <div className="helper-text">Preparing wallet signature and Shelby upload...</div>
              </div>
            ) : null}

            {localError ? <p className="status-error">{localError}</p> : null}
            {uploadBlobs.isSuccess ? (
              <p className="status-success">Upload completed and latest proof snapshot is ready.</p>
            ) : null}

            <button
              className="primary-button primary-button-glow"
              type="submit"
              disabled={!uploadReady || uploadBlobs.isPending}
            >
              {uploadBlobs.isPending ? "Uploading..." : "Upload to Shelby"}
            </button>
          </form>
        </Card>

        {latestUpload ? (
          <UploadResult {...latestUpload} />
        ) : (
          <Card
            title="Latest proof snapshot"
            description="Direct link and explorer handoff appear here after upload."
          >
            <div className="empty-panel empty-panel-tall proof-preview-empty proof-preview-empty-compact">
              <div>
                <strong>No upload yet</strong>
                <p>Choose a file and send your first proof-ready object.</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {uploadJournal.length ? (
        <Card
          title="Metadata journal"
          description="App-level records stored via Supabase when configured, or local fallback otherwise."
        >
          <div className="journal-list">
            {uploadJournal.map((record) => (
              <div key={record.id} className="journal-item">
                <div>
                  <strong>{record.blobName}</strong>
                  <p>{record.mediaType} · {formatBytes(record.fileSize)}</p>
                </div>
                <div className="journal-actions">
                  <a className="text-link-button" href={record.objectUrl} target="_blank" rel="noreferrer">
                    Object
                  </a>
                  <a className="text-link-button" href={record.explorerUrl} target="_blank" rel="noreferrer">
                    Explorer
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}

