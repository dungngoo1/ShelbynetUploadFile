import { PropsWithChildren, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { Network } from "@aptos-labs/ts-sdk";
import { ShelbyClient } from "@shelby-protocol/sdk/browser";
import { ShelbyClientProvider } from "@shelby-protocol/react";
import { env } from "@/shared/config/env";

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  const [shelbyClient] = useState(
    () =>
      new ShelbyClient({
        network: Network.SHELBYNET,
        apiKey: env.shelbyApiKey || undefined,
      }),
  );

  return (
    <AptosWalletAdapterProvider
      autoConnect={false}
      dappConfig={{
        network: Network.TESTNET,
        aptosApiKeys: env.aptosTestnetApiKey
          ? { testnet: env.aptosTestnetApiKey }
          : undefined,
      }}
      onError={(error) => {
        console.error("Wallet connection error:", error);
      }}
    >
      <QueryClientProvider client={queryClient}>
        <ShelbyClientProvider client={shelbyClient}>
          {children}
        </ShelbyClientProvider>
      </QueryClientProvider>
    </AptosWalletAdapterProvider>
  );
}
