import { useEffect, useState } from "react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Buffer } from "buffer";
import "@/styles.css";

type RootAppModule = {
  RootApp: React.ComponentType;
};

if (!("Buffer" in globalThis)) {
  globalThis.Buffer = Buffer;
}

function BootApp() {
  const [RootComponent, setRootComponent] =
    useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    import("@/app/RootApp")
      .then((module: RootAppModule) => {
        if (!mounted) return;
        setRootComponent(() => module.RootApp);
      })
      .catch((bootError: unknown) => {
        console.error("Boot import failed:", bootError);
        if (!mounted) return;
        const message =
          bootError instanceof Error ? bootError.message : String(bootError);
        setError(message);
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <main className="fatal-screen">
        <div className="fatal-card">
          <p className="eyebrow">Boot Error</p>
          <h1>The app could not start</h1>
          <p>
            The route tree was not mounted because a module import failed during
            startup.
          </p>
          <pre>{error}</pre>
        </div>
      </main>
    );
  }

  if (!RootComponent) {
    return (
      <main className="fatal-screen">
        <div className="fatal-card">
          <p className="eyebrow">Booting</p>
          <h1>Loading application</h1>
          <p>Initializing router, providers, and Shelby client modules.</p>
        </div>
      </main>
    );
  }

  return <RootComponent />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BootApp />
  </React.StrictMode>,
);
