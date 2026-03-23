import { useMemo, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { NavLink, Outlet } from "react-router-dom";
import { WalletPanel } from "@/features/wallet/components/WalletPanel";

const navItems = [
  { to: "/", label: "Studio" },
  { to: "/verify", label: "Proof" },
  { to: "/history", label: "Vault" },
];

type ThemeMode = "light" | "dark";

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "dark";
  }

  const savedTheme = window.localStorage.getItem("shelby-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return "dark";
}

export function App() {
  const { connected } = useWallet();
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  const mockStats = useMemo(
    () => [
      { label: "Proof-ready", value: "24", tone: "pink" },
      { label: "Vault lookup", value: "< 1s", tone: "purple" },
      { label: "Explorer links", value: "Live", tone: "cyan" },
      { label: "Session mode", value: connected ? "Active" : "Guest", tone: "green" },
    ],
    [connected],
  );

  return (
    <div className="app-shell">
      <div className="shell-backdrop shell-backdrop-a" aria-hidden="true" />
      <div className="shell-backdrop shell-backdrop-b" aria-hidden="true" />
      <div className="shell-grid" aria-hidden="true" />

      <header className="topbar anim-fade-up">
        <div className="brand-lockup">
          <div className="brand-mark">S</div>
          <div>
            <p className="brand-name">ShelbyProof</p>
            <p className="brand-subtitle">Verifiable media vault on Shelbynet</p>
          </div>
        </div>

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

        <div className="topbar-actions">
          <button
            type="button"
            className="secondary-button theme-toggle"
            onClick={() =>
              setTheme((current) => (current === "light" ? "dark" : "light"))
            }
          >
            {theme === "light" ? "Dark" : "Light"}
          </button>
        </div>
      </header>

      <section className="hero-card hero-card-premium hero-card-spotlight anim-fade-up anim-delay-1">
        <div className="hero-spotlight hero-spotlight-a" aria-hidden="true" />
        <div className="hero-spotlight hero-spotlight-b" aria-hidden="true" />
        <div className="hero-copy-block">
          <p className="eyebrow">Proof-First Shelby Workspace</p>
          <h1>Upload. Prove. Share.</h1>
          <p className="hero-copy hero-copy-tight">
            A sharper browser experience for wallet-signed uploads, metadata verification,
            and shareable proof links on Shelby testnet.
          </p>

          <div className="hero-chip-row hero-chip-row-compact">
            <div className="hero-chip">Wallet-signed</div>
            <div className="hero-chip">Direct blob URLs</div>
            <div className="hero-chip">Explorer-backed</div>
          </div>

          <div className="hero-metrics hero-metrics-premium hero-metrics-compact">
            {mockStats.map((stat, index) => (
              <div
                key={stat.label}
                className={`metric-pill metric-pill-${stat.tone} anim-fade-up`}
                style={{ animationDelay: `${140 + index * 60}ms` }}
              >
                <span className="metric-label">{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-side-column hero-side-column-clean">
          <WalletPanel />
        </div>
      </section>

      <main className="page-wrap anim-fade-up anim-delay-3">
        <Outlet />
      </main>
    </div>
  );
}
