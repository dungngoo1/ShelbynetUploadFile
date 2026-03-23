import { useBlobMetadata } from "@shelby-protocol/react";
import { Card } from "@/shared/ui/Card";
import { KeyValueList } from "@/shared/ui/KeyValueList";
import {
  buildBlobUrl,
  buildExplorerUrl,
  extractBlobNameSuffix,
  formatBytes,
} from "@/shared/lib/blob";

type VerifyResultProps = {
  account: string;
  blobName: string;
};

export function VerifyResult({ account, blobName }: VerifyResultProps) {
  const { data, isLoading, error } = useBlobMetadata({
    account,
    name: blobName,
  });

  if (isLoading) {
    return (
      <Card title="Verification output" description="Querying Shelby metadata for the requested object.">
        <p>Loading metadata...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Verification output" description="The metadata query returned an error.">
        <p className="status-error">{error.message}</p>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card title="Verification output" description="No metadata was returned for the submitted account and blob name.">
        <p>Blob not found.</p>
      </Card>
    );
  }

  const resolvedName = data.blobNameSuffix || blobName || extractBlobNameSuffix(blobName);
  const blobUrl = buildBlobUrl(account, resolvedName);
  const explorerUrl = buildExplorerUrl(account, resolvedName);

  return (
    <Card title="Verification output" description="This panel confirms the object can be resolved through Shelby metadata lookup.">
      <KeyValueList
        items={[
          { label: "Name", value: resolvedName, copyValue: resolvedName },
          { label: "Owner", value: account, copyValue: account },
          { label: "Size", value: formatBytes(data.size), copyValue: String(data.size) },
          {
            label: "Created",
            value: new Date(data.creationMicros / 1000).toLocaleString(),
          },
          {
            label: "Expires",
            value: new Date(data.expirationMicros / 1000).toLocaleString(),
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
