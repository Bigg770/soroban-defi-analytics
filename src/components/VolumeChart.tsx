"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Download, Loader2 } from "lucide-react";
import type { VolumeDataPoint } from "@/services/sorobanApi";
import { downloadCsv, buildCsvFilename } from "@/utils/exportCsv";

interface VolumeChartProps {
  data: VolumeDataPoint[];
}

const COLORS = {
  soroswap: "#6366f1",
  phoenix: "#f59e0b",
  blend: "#10b981",
};

const formatUSD = (value: number) => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl p-3 shadow-xl text-sm min-w-[160px]">
      <p className="text-slate-400 font-medium mb-2">
        {label ? formatDate(label) : ""}
      </p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex justify-between items-center gap-4 mb-1">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ background: entry.color }}
            />
            <span className="text-slate-300 capitalize">{entry.name}</span>
          </span>
          <span className="font-semibold text-slate-100">
            {formatUSD(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function VolumeChart({ data }: VolumeChartProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    // Brief loading state so the user gets visual feedback
    setTimeout(() => {
      downloadCsv(data, buildCsvFilename());
      setIsExporting(false);
    }, 300);
  };

  return (
    <div className="card w-full min-w-0 overflow-hidden animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="section-title mb-0">30-Day Volume Trends</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Daily trading volume by protocol (USD)
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExport}
            disabled={isExporting}
            aria-label="Export chart data as CSV"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                       bg-slate-700/60 text-slate-300 border border-slate-600/50
                       hover:bg-slate-600/60 hover:text-slate-100
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-800
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors cursor-pointer"
          >
            {isExporting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Download size={14} />
            )}
            <span>{isExporting ? "Exporting…" : "Export CSV"}</span>
          </button>
          <span className="badge-slate shrink-0">Last 30 days</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        >
          <defs>
            {Object.entries(COLORS).map(([key, color]) => (
              <linearGradient
                key={key}
                id={`gradient-${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={{ stroke: "#334155" }}
            tickLine={false}
            interval={4}
          />

          <YAxis
            tickFormatter={formatUSD}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={56}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            wrapperStyle={{ paddingTop: "16px", fontSize: "12px" }}
            formatter={(value) => (
              <span style={{ color: "#cbd5e1", textTransform: "capitalize" }}>
                {value}
              </span>
            )}
          />

          {Object.entries(COLORS).map(([key, color]) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${key})`}
              dot={false}
              activeDot={{ r: 4, stroke: color, strokeWidth: 2, fill: "#1e293b" }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
