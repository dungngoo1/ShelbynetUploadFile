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
      title="Latest upload"
      description="The app re-checks metadata after upload so the result panel reflects the currently indexed Shelby object."
    >
      {isLoading ? <p>Loading metadata...</p> : null}
      {error ? <p>Metadata lookup failed: {error.message}</p> : null}
      <KeyValueList
        items={[
          { label: "Owner", value: account },
          { label: "Blob name", value: resolvedName },
          { label: "Selected file size", value: formatBytes(fileSize) },
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
          },
          {
            label: "Explorer",
            value: explorerUrl,
            href: explorerUrl,
          },
        ]}
      />
    </Card>
  );
}
