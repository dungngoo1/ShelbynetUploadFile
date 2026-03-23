import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useAccountBlobs } from "@shelby-protocol/react";
import { Card } from "@/shared/ui/Card";
import {
  buildBlobUrl,
  buildExplorerUrl,
  extractBlobNameSuffix,
  formatBytes,
  truncateAddress,
} from "@/shared/lib/blob";

function getMediaKind(name: string) {
  if (/\.(png|jpg|jpeg|gif|webp|avif|svg)$/i.test(name)) return "image" as const;
  if (/\.(mp4|webm|mov|m4v)$/i.test(name)) return "video" as const;
  if (/\.(mp3|wav|ogg|m4a|flac)$/i.test(name)) return "audio" as const;
  return "file" as const;
}

type PreviewAsset = {
  name: string;
  url: string;
  size: number;
  kind: "image" | "video" | "audio" | "file";
};

export function HistoryPage() {
  const { account } = useWallet();
  const connectedAccount = account?.address?.toString();
  const [previewErrors, setPreviewErrors] = useState<Record<string, boolean>>({});
  const [selectedPreview, setSelectedPreview] = useState<PreviewAsset | null>(null);

  const { data, isLoading, error } = useAccountBlobs({
    account: connectedAccount ?? "0x0",
    pagination: {
      limit: 25,
      offset: 0,
    },
    enabled: Boolean(connectedAccount),
  });

  return (
    <>
      <div className="page-stack page-stack-compact">
        <section className="dashboard-strip dashboard-strip-compact">
          <div className="dashboard-stat-card anim-fade-up">
            <span>Namespace</span>
            <strong>
              {connectedAccount
                ? truncateAddress(connectedAccount, 10, 6)
                : "Connect wallet"}
            </strong>
          </div>
          <div className="dashboard-stat-card anim-fade-up anim-delay-1">
            <span>Objects</span>
            <strong>{data?.length ?? 0}</strong>
          </div>
          <div className="dashboard-stat-card anim-fade-up anim-delay-2">
            <span>Mode</span>
            <strong>Marketplace grid</strong>
          </div>
        </section>

        <Card
          title="Recent assets"
          description="Large asset cards with preview, direct blob access, and explorer handoff."
        >
          {!connectedAccount ? (
            <div className="empty-panel empty-panel-tall">Connect a wallet to load account history.</div>
          ) : null}
          {connectedAccount && isLoading ? <p>Loading blobs...</p> : null}
          {connectedAccount && error ? <p className="status-error">{error.message}</p> : null}

          {connectedAccount && !isLoading && !error && data?.length ? (
            <div className="vault-grid vault-grid-marketplace vault-grid-rich">
              {data.map((blob, index) => {
                const blobSuffix = blob.blobNameSuffix || extractBlobNameSuffix(blob.name.toString());
                const blobUrl = buildBlobUrl(connectedAccount, blobSuffix);
                const explorerUrl = buildExplorerUrl(connectedAccount, blobSuffix);
                const mediaKind = getMediaKind(blobSuffix);
                const canPreview = mediaKind !== "file" && !previewErrors[blobSuffix];

                return (
                  <article
                    key={blob.name.toString()}
                    className="vault-card vault-card-rich vault-card-market anim-fade-up"
                    style={{ animationDelay: `${80 + index * 35}ms` }}
                  >
                    <button
                      type="button"
                      className="vault-preview-shell vault-preview-button"
                      onClick={() => {
                        if (!canPreview) return;
                        setSelectedPreview({
                          name: blobSuffix,
                          url: blobUrl,
                          size: blob.size,
                          kind: mediaKind,
                        });
                      }}
                    >
                      {mediaKind === "image" && !previewErrors[blobSuffix] ? (
                        <img
                          className="vault-preview-image"
                          src={blobUrl}
                          alt={blobSuffix}
                          loading="lazy"
                          onError={() =>
                            setPreviewErrors((current) => ({
                              ...current,
                              [blobSuffix]: true,
                            }))
                          }
                        />
                      ) : (
                        <div className={`vault-preview-fallback vault-preview-fallback-${mediaKind}`}>
                          <span>
                            {mediaKind === "video"
                              ? "Play"
                              : mediaKind === "audio"
                                ? "Audio"
                                : blobSuffix.slice(0, 1).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="vault-card-top vault-card-top-overlay">
                        <span className="vault-card-badge">Indexed</span>
                        <span className="vault-card-size">{formatBytes(blob.size)}</span>
                      </div>
                      {canPreview ? <div className="vault-preview-cta">Preview</div> : null}
                    </button>

                    <div className="vault-card-body vault-card-body-market">
                      <strong className="vault-card-name">{blobSuffix}</strong>
                      <p className="vault-card-subtitle">Proof-ready object in your connected Shelby namespace.</p>
                    </div>
                    <div className="vault-card-actions vault-card-actions-market">
                      <a className="text-link-button" href={blobUrl} target="_blank" rel="noreferrer">
                        Open blob
                      </a>
                      <a className="text-link-button" href={explorerUrl} target="_blank" rel="noreferrer">
                        Explorer
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}

          {connectedAccount && !isLoading && !error && !data?.length ? (
            <div className="empty-panel empty-panel-tall">
              Your recent blobs will appear here after you upload from the connected account.
            </div>
          ) : null}
        </Card>
      </div>

      {selectedPreview ? (
        <div className="media-modal-backdrop" onClick={() => setSelectedPreview(null)}>
          <div className="media-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="media-modal-close"
              onClick={() => setSelectedPreview(null)}
            >
              Close
            </button>
            <div className="media-modal-frame">
              {selectedPreview.kind === "image" ? (
                <img src={selectedPreview.url} alt={selectedPreview.name} className="media-modal-image" />
              ) : null}
              {selectedPreview.kind === "video" ? (
                <video src={selectedPreview.url} className="media-modal-video" controls autoPlay playsInline />
              ) : null}
              {selectedPreview.kind === "audio" ? (
                <div className="media-modal-audio-shell">
                  <div className="media-modal-audio-art">Audio</div>
                  <audio src={selectedPreview.url} className="media-modal-audio" controls autoPlay />
                </div>
              ) : null}
            </div>
            <div className="media-modal-meta">
              <strong>{selectedPreview.name}</strong>
              <span>{formatBytes(selectedPreview.size)}</span>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

