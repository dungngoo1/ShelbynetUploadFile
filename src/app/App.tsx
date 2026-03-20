import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { NavLink, Outlet } from "react-router-dom";
import { WalletPanel } from "@/features/wallet/components/WalletPanel";
import { SystemStatusCard } from "@/features/system/components/SystemStatusCard";

const navItems = [
  { to: "/", label: "Upload" },
  { to: "/verify", label: "Verify" },
  { to: "/history", label: "History" },
];

type ThemeMode = "light" | "dark";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem("shelby-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function App() {
  const { wallets, connected } = useWallet();
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("shelby-theme", theme);
  }, [theme]);

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div className="hero-copy-block">
          <p className="eyebrow">Shelby Testnet Storage</p>
          <h1>Verifiable Decentralized File Uploader</h1>
          <p className="hero-copy">
            A cleaner browser workflow for wallet-based uploads, metadata
            inspection, and object verification across Shelby testnet storage.
          </p>

          <div className="hero-metrics">
            <div className="metric-pill">
              <span className="metric-label">Mode</span>
              <strong>{theme === "light" ? "Light" : "Dark"}</strong>
            </div>
            <div className="metric-pill">
              <span className="metric-label">Wallets</span>
              <strong>{wallets?.length ?? 0} detected</strong>
            </div>
            <div className="metric-pill">
              <span className="metric-label">Session</span>
              <strong>{connected ? "Connected" : "Guest"}</strong>
            </div>
          </div>

          <div className="hero-actions">
            <button
              type="button"
              className="secondary-button theme-toggle"
              onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}
            >
              {theme === "light" ? "Dark mode" : "Light mode"}
            </button>
          </div>
        </div>

        <WalletPanel />
      </header>

      <section className="utility-grid">
        <div className="warning-banner">
          Shelbynet is a developer network and may be wiped. Use this app for
          test workflows, verification demos, and SDK feedback rather than long-term
          durable storage.
        </div>
        <SystemStatusCard walletDetected={Boolean(wallets?.length)} />
      </section>

      <nav className="main-nav" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "nav-link nav-link-active" : "nav-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  );
}
