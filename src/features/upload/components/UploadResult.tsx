import { useBlobMetadata } from "@shelby-protocol/react";
import { Card } from "@/shared/ui/Card";
import { KeyValueList } from "@/shared/ui/KeyValueList";
import {
  buildBlobUrl,
  buildExplorerUrl,
  extractBlobNameSuffix,
  formatBytes,
} from "@/shared/lib/blob";

type UploadResultProps = {
  account: string;
  blobName: string;
  fileSize: number;
  expirationMicros: number;
};

export function UploadResult({
  account,
  blobName,
  fileSize,
  expirationMicros,
}: UploadResultProps) {
  const { data, isLoading, error } = useBlobMetadata({
    account,
    name: blobName,
  });

  const resolvedName = data?.blobNameSuffix || blobName || extractBlobNameSuffix(blobName);
  const blobUrl = buildBlobUrl(account, resolvedName);
  const explorerUrl = buildExplorerUrl(account, resolvedName);

  return (
    <Card
      title="Latest proof snapshot"
      description="The app re-checks metadata after upload so this panel reflects the current queryable Shelby object."
    >
      {isLoading ? <p>Loading metadata...</p> : null}
      {error ? <p>Metadata lookup failed: {error.message}</p> : null}
      <KeyValueList
        items={[
          { label: "Owner", value: account, copyValue: account },
          { label: "Blob name", value: resolvedName, copyValue: resolvedName },
          { label: "Selected file size", value: formatBytes(fileSize), copyValue: String(fileSize) },
          {
            label: "Expiration",
            value: new Date(expirationMicros / 1000).toLocaleString(),
          },
          {
            label: "Metadata status",
            value: data ? "Indexed and queryable" : "Waiting or not found yet",
          },
          {
            label: "Direct object URL",
            value: blobUrl,
            href: blobUrl,
            copyValue: blobUrl,
          },
          {
            label: "Explorer",
            value: explorerUrl,
            href: explorerUrl,
            copyValue: explorerUrl,
          },
        ]}
      />
    </Card>
  );
}
