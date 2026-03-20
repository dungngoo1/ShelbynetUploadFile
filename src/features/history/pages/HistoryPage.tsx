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

export function HistoryPage() {
  const { account } = useWallet();
  const connectedAccount = account?.address?.toString();

  const { data, isLoading, error } = useAccountBlobs({
    account: connectedAccount ?? "0x0",
    pagination: {
      limit: 25,
      offset: 0,
    },
    enabled: Boolean(connectedAccount),
  });

  return (
    <div className="page-grid page-grid-history">
      <Card
        title="Account history"
        description="Review the current wallet namespace and the latest blobs returned by Shelby."
      >
        <div className="metric-strip">
          <div className="metric-strip-item">
            <span>Account</span>
            <strong>
              {connectedAccount
                ? truncateAddress(connectedAccount, 10, 6)
                : "Connect wallet"}
            </strong>
          </div>
          <div className="metric-strip-item">
            <span>Visible items</span>
            <strong>{data?.length ?? 0}</strong>
          </div>
        </div>

        {!connectedAccount ? (
          <div className="empty-panel empty-panel-tall">
            Connect a wallet to load account history.
          </div>
        ) : null}
        {connectedAccount && isLoading ? <p>Loading blobs...</p> : null}
        {connectedAccount && error ? (
          <p className="status-error">{error.message}</p>
        ) : null}
        {connectedAccount && !isLoading && !error && !data?.length ? (
          <div className="empty-panel empty-panel-tall">
            No blobs found for this account yet.
          </div>
        ) : null}
      </Card>

      <Card
        title="Recent blobs"
        description="Open the stored object directly or jump to the filtered explorer result for that exact object name."
      >
        {connectedAccount && data?.length ? (
          <ul className="history-list">
            {data.map((blob) => {
              const blobSuffix = blob.blobNameSuffix || extractBlobNameSuffix(blob.name.toString());

              return (
                <li key={blob.name.toString()} className="history-item history-item-rich">
                  <div className="history-content">
                    <strong className="history-name">{blobSuffix}</strong>
                    <p>{formatBytes(blob.size)}</p>
                  </div>
                  <div className="history-actions">
                    <a
                      className="text-link-button"
                      href={buildBlobUrl(connectedAccount, blobSuffix)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open blob
                    </a>
                    <a
                      className="text-link-button"
                      href={buildExplorerUrl(connectedAccount, blobSuffix)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Explorer
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="empty-panel empty-panel-tall">
            Your recent blobs will appear here after you upload from the connected account.
          </div>
        )}
      </Card>
    </div>
  );
}
