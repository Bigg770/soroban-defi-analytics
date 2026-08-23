"use client";
import { Activity, Github, ExternalLink } from "lucide-react";
import { useCurrency, type Currency } from "@/hooks/useCurrency";
import type { DashboardSummary } from "@/services/sorobanApi";

interface HeaderProps {
  summary: DashboardSummary;
}



const StatPill = ({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) => (
  <div className="flex flex-col items-center px-4 py-2 bg-slate-800/60 border border-slate-700 rounded-lg">
    <span className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
      {label}
    </span>
    <span
      className={`text-sm font-bold tabular-nums ${
        positive === undefined
          ? "text-slate-100"
          : positive
          ? "text-green-400"
          : "text-red-400"
      }`}
    >
      {value}
    </span>
  </div>
);

export default function Header({ summary }: HeaderProps) {
  const { currency, setCurrency, formatValue } = useCurrency();
  return (
    <header className="border-b border-slate-700/60 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient leading-none">
                Soroban DeFi Analytics
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time metrics across Stellar Soroban protocols
              </p>
            </div>
          </div>
          <div
            className="flex items-center rounded-lg bg-slate-800 border border-slate-700 p-0.5"
            role="group"
            aria-label="Currency"
          >
            {(["USD", "XLM"] as Currency[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCurrency(option)}
                aria-pressed={currency === option}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  currency === option
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-slate-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Live indicator */}
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-900/30 border border-green-800/40 rounded-full text-xs text-green-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
              Live
            </span>

            <a
              href="https://github.com/your-org/soroban-defi-analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-lg text-xs text-slate-300 hover:text-slate-100 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-2">
          <StatPill
            label="Total TVL"
            value={formatValue(summary.totalTVL)}
          />
          <StatPill
            label="24h Volume"
            value={formatValue(summary.totalVolume24h)}
          />
          <StatPill
            label="TVL Change"
            value={`+${summary.tvlChange24h}%`}
            positive={summary.tvlChange24h >= 0}
          />
          <StatPill
            label="Protocols"
            value={String(summary.activeProtocols)}
          />
          <StatPill
            label="Active Pools"
            value={String(summary.activePools)}
          />
        </div>
      </div>
    </header>
  );
}
