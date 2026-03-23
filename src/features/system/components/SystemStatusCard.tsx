import { Card } from "@/shared/ui/Card";
import { env } from "@/shared/config/env";

type SystemStatusCardProps = {
  walletDetected: boolean;
};

export function SystemStatusCard({ walletDetected }: SystemStatusCardProps) {
  const statuses = [
    {
      label: "Shelby API key",
      value: env.shelbyApiKey ? "Configured" : "Missing",
    },
    {
      label: "Aptos API key",
      value: env.aptosTestnetApiKey ? "Configured" : "Optional",
    },
    {
      label: "Wallet extension",
      value: walletDetected ? "Detected" : "Not found",
    },
  ];

  return (
    <Card
      title="Runtime readiness"
      description="A quick check so configuration issues are visible before you test Shelby flows."
    >
      <div className="status-stack">
        {statuses.map((status) => (
          <div key={status.label} className="status-row-panel">
            <span>{status.label}</span>
            <strong>{status.value}</strong>
          </div>
        ))}
      </div>
      {!env.shelbyApiKey ? (
        <p className="status-warning">
          Add `VITE_SHELBY_API_KEY` to `.env` before testing upload, verify, and history queries.
        </p>
      ) : null}
    </Card>
  );
}
