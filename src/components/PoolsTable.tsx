"use client";
import { useCurrency } from "@/hooks/useCurrency";
import type { LiquidityPool } from "@/services/sorobanApi";

interface PoolsTableProps {
  pools: LiquidityPool[];
}


export default function PoolsTable({ pools }: PoolsTableProps) {
  const { formatValue } = useCurrency();
  return (
    <div className="card animate-fade-in">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="section-title mb-0">Liquidity Pools</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Top pools by total value locked
          </p>
        </div>
        <span className="badge-slate">{pools.length} pools</span>
      </div>

      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              {["Pool", "Protocol", "TVL", "24h Volume", "Fee", "APY"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60">
            {pools.map((pool, i) => (
              <tr
                key={pool.id}
                className="hover:bg-slate-700/30 transition-colors duration-100"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Pair */}
                <td className="px-6 py-3.5 font-semibold text-slate-100 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      <span className="w-6 h-6 rounded-full bg-indigo-600/70 border border-slate-800 flex items-center justify-center text-[10px] font-bold">
                        {pool.token0[0]}
                      </span>
                      {pool.token1 !== "—" && (
                        <span className="w-6 h-6 rounded-full bg-amber-600/70 border border-slate-800 flex items-center justify-center text-[10px] font-bold">
                          {pool.token1[0]}
                        </span>
                      )}
                    </div>
                    {pool.pair}
                  </div>
                </td>

                {/* Protocol */}
                <td className="px-6 py-3.5 text-slate-400 whitespace-nowrap">
                  {pool.protocol}
                </td>

                {/* TVL */}
                <td className="px-6 py-3.5 font-semibold text-slate-100 tabular-nums whitespace-nowrap">
                  {formatValue(pool.tvl)}
                </td>

                {/* Volume */}
                <td className="px-6 py-3.5 text-slate-300 tabular-nums whitespace-nowrap">
                  {formatValue(pool.volume24h)}
                </td>

                {/* Fee */}
                <td className="px-6 py-3.5 text-slate-400 tabular-nums whitespace-nowrap">
                  {pool.fee > 0 ? `${(pool.fee / 100).toFixed(2)}%` : "—"}
                </td>

                {/* APY */}
                <td className="px-6 py-3.5 whitespace-nowrap">
                  <span className="badge-green">{pool.apy}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
