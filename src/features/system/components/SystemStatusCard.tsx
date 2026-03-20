import { Card } from "@/shared/ui/Card";
import { env } from "@/shared/config/env";

type SystemStatusCardProps = {
  walletDetected: boolean;
};

export function SystemStatusCard({ walletDetected }: SystemStatusCardProps) {
  return (
    <Card
      title="System status"
      description="This panel helps explain missing configuration instead of failing silently."
    >
      <ul className="status-list">
        <li>
          Shelby API key: <strong>{env.shelbyApiKey ? "Configured" : "Missing"}</strong>
        </li>
        <li>
          Aptos API key: <strong>{env.aptosTestnetApiKey ? "Configured" : "Optional / Missing"}</strong>
        </li>
        <li>
          Browser wallet detected: <strong>{walletDetected ? "Yes" : "No"}</strong>
        </li>
      </ul>
      {!env.shelbyApiKey ? (
        <p className="status-warning">
          Add `VITE_SHELBY_API_KEY` to `.env` before testing upload and query
          flows.
        </p>
      ) : null}
    </Card>
  );
}
