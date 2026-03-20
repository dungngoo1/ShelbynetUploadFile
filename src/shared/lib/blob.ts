const SHELBY_API_BASE = "https://api.shelbynet.shelby.xyz/shelby/v1/blobs";
const SHELBY_EXPLORER_BASE = "https://explorer.shelby.xyz/shelbynet/account";

export function extractBlobNameSuffix(name: string) {
  if (!name) return "";
  if (!name.startsWith("@")) return name;

  const slashIndex = name.indexOf("/");
  if (slashIndex === -1) return name;
  return name.slice(slashIndex + 1);
}

export function buildBlobUrl(account: string, name: string) {
  const suffix = extractBlobNameSuffix(name);
  return `${SHELBY_API_BASE}/${account}/${encodeURIComponent(suffix)}`;
}

export function buildExplorerUrl(account: string, name?: string) {
  const suffix = name ? extractBlobNameSuffix(name) : "";
  const baseUrl = `${SHELBY_EXPLORER_BASE}/${account}/blobs`;
  return suffix ? `${baseUrl}?name=${encodeURIComponent(suffix)}` : baseUrl;
}

export function truncateAddress(value: string, head = 6, tail = 4) {
  if (value.length <= head + tail) return value;
  return `${value.slice(0, head)}...${value.slice(-tail)}`;
}

export function defaultBlobName(file: File) {
  return file.name.trim().replace(/\s+/g, "-");
}

export function addDaysToMicros(days: number) {
  return Date.now() * 1000 + days * 24 * 60 * 60 * 1_000_000;
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
