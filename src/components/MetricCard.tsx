"use client";
import { useCurrency } from "@/hooks/useCurrency";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { ProtocolMetric } from "@/services/sorobanApi";
import clsx from "clsx";

interface MetricCardProps {
  metric: ProtocolMetric;
}

const CATEGORY_COLORS: Record<ProtocolMetric["category"], string> = {
  DEX: "text-indigo-400 bg-indigo-900/30 border-indigo-800/40",
  Lending: "text-emerald-400 bg-emerald-900/30 border-emerald-800/40",
  Yield: "text-amber-400 bg-amber-900/30 border-amber-800/40",
  Bridge: "text-sky-400 bg-sky-900/30 border-sky-800/40",
};


export default function MetricCard({ metric }: MetricCardProps) {
  const { formatValue } = useCurrency();
  const isPositive = metric.change24h > 0;
  const isNeutral = metric.change24h === 0;

  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  const trendColor = isNeutral
    ? "text-slate-400"
    : isPositive
    ? "text-green-400"
    : "text-red-400";

  return (
    <div className="card hover:border-slate-600 transition-colors duration-200 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-indigo-400 leading-tight">
            {metric.name}
          </h2>
          <span
            className={clsx(
              "inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
              CATEGORY_COLORS[metric.category]
            )}
          >
            {metric.category}
          </span>
        </div>
        <div className={clsx("flex items-center gap-1 text-sm font-medium", trendColor)}>
          <TrendIcon className="w-4 h-4" />
          <span>
            {isPositive ? "+" : ""}
            {metric.change24h.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* TVL */}
      <div className="mb-3">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-0.5">
          Total Value Locked
        </p>
        <p className="text-2xl font-bold text-slate-100 tabular-nums">
          {formatValue(metric.tvl)}
        </p>
      </div>

      {/* Volume + APY row */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700">
        <div>
          <p className="text-xs text-slate-500 mb-0.5">24h Volume</p>
          <p className="text-sm font-semibold text-slate-300 tabular-nums">
            {formatValue(metric.volume24h)}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-900/40 text-green-400 border border-green-800/40 rounded-full text-sm font-semibold">
          {metric.apy}% APY
        </span>
      </div>
    </div>
  );
}
