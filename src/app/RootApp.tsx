import { RouterProvider } from "react-router-dom";
import { AppProviders } from "@/app/providers";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { router } from "@/app/routes";

export function RootApp() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  );
}
