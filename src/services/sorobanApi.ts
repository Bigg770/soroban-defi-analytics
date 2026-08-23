// ─────────────────────────────────────────────────────────────
//  sorobanApi.ts  –  Mock data service for Soroban DeFi metrics
//  In production, replace fetch calls with real RPC / Indexer
//  endpoints (e.g. Soroswap Subgraph, Blend API, Mercury, etc.)
// ─────────────────────────────────────────────────────────────

export interface ProtocolMetric {
  id: string;
  name: string;
  category: "DEX" | "Lending" | "Yield" | "Bridge";
  tvl: number;
  volume24h: number;
  apy: number;
  change24h: number; // % TVL change in last 24 h
  logoUrl?: string;
}

export interface LiquidityPool {
  id: string;
  protocol: string;
  pair: string;
  token0: string;
  token1: string;
  tvl: number;
  volume24h: number;
  fee: number; // basis points
  apy: number;
}

export interface VolumeDataPoint {
  date: string; // ISO date string
  soroswap: number;
  phoenix: number;
  blend: number;
  total: number;
}

export interface DashboardSummary {
  totalTVL: number;
  totalVolume24h: number;
  activeProtocols: number;
  activePools: number;
  tvlChange24h: number;
}

// ─── Simulated delay to mimic network latency ────────────────
const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

// ─── Protocol Metrics ────────────────────────────────────────
export const fetchProtocolMetrics = async (): Promise<ProtocolMetric[]> => {
  await delay(120);
  return [
    {
      id: "soroswap",
      name: "Soroswap DEX",
      category: "DEX",
      tvl: 1_250_000,
      volume24h: 340_000,
      apy: 12.5,
      change24h: 3.2,
    },
    {
      id: "phoenix",
      name: "Phoenix DEX",
      category: "DEX",
      tvl: 890_000,
      volume24h: 210_000,
      apy: 9.8,
      change24h: -1.4,
    },
    {
      id: "blend",
      name: "Blend Capital",
      category: "Lending",
      tvl: 2_100_000,
      volume24h: 520_000,
      apy: 15.2,
      change24h: 7.1,
    },
    {
      id: "aqua",
      name: "Aquarius",
      category: "Yield",
      tvl: 640_000,
      volume24h: 98_000,
      apy: 8.4,
      change24h: 0.9,
    },
  ];
};

// ─── Liquidity Pools ─────────────────────────────────────────
export const fetchLiquidityPools = async (): Promise<LiquidityPool[]> => {
  await delay(150);
  return [
    {
      id: "soroswap-xlm-usdc",
      protocol: "Soroswap DEX",
      pair: "XLM / USDC",
      token0: "XLM",
      token1: "USDC",
      tvl: 620_000,
      volume24h: 185_000,
      fee: 30,
      apy: 14.2,
    },
    {
      id: "soroswap-xlm-eth",
      protocol: "Soroswap DEX",
      pair: "XLM / ETH",
      token0: "XLM",
      token1: "ETH",
      tvl: 410_000,
      volume24h: 95_000,
      fee: 30,
      apy: 10.8,
    },
    {
      id: "phoenix-xlm-usdt",
      protocol: "Phoenix DEX",
      pair: "XLM / USDT",
      token0: "XLM",
      token1: "USDT",
      tvl: 510_000,
      volume24h: 130_000,
      fee: 20,
      apy: 9.1,
    },
    {
      id: "phoenix-btc-usdc",
      protocol: "Phoenix DEX",
      pair: "BTC / USDC",
      token0: "BTC",
      token1: "USDC",
      tvl: 380_000,
      volume24h: 80_000,
      fee: 25,
      apy: 7.6,
    },
    {
      id: "blend-xlm-supply",
      protocol: "Blend Capital",
      pair: "XLM Supply",
      token0: "XLM",
      token1: "—",
      tvl: 1_050_000,
      volume24h: 310_000,
      fee: 0,
      apy: 15.2,
    },
    {
      id: "aqua-xlm-aqua",
      protocol: "Aquarius",
      pair: "XLM / AQUA",
      token0: "XLM",
      token1: "AQUA",
      tvl: 640_000,
      volume24h: 98_000,
      fee: 10,
      apy: 8.4,
    },
  ];
};

// ─── 30-day Volume History ────────────────────────────────────
export const fetchVolumeHistory = async (): Promise<VolumeDataPoint[]> => {
  await delay(100);

  const base = new Date("2026-07-08");
  const seed = [
    [180, 95, 280, 555],
    [210, 110, 310, 630],
    [195, 102, 295, 592],
    [230, 125, 340, 695],
    [260, 140, 370, 770],
    [245, 132, 355, 732],
    [275, 148, 390, 813],
    [295, 160, 420, 875],
    [280, 152, 405, 837],
    [310, 170, 445, 925],
    [325, 178, 460, 963],
    [300, 165, 435, 900],
    [340, 185, 480, 1005],
    [360, 195, 510, 1065],
    [335, 182, 490, 1007],
    [350, 190, 500, 1040],
    [375, 200, 525, 1100],
    [355, 192, 508, 1055],
    [390, 212, 545, 1147],
    [410, 220, 570, 1200],
    [395, 215, 555, 1165],
    [420, 228, 585, 1233],
    [440, 238, 610, 1288],
    [415, 225, 590, 1230],
    [455, 245, 630, 1330],
    [470, 252, 650, 1372],
    [448, 242, 625, 1315],
    [490, 260, 670, 1420],
    [510, 272, 695, 1477],
    [340, 210, 520, 1070],
  ];

  return seed.map(([soroswap, phoenix, blend, total], i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return {
      date: d.toISOString().split("T")[0],
      soroswap: soroswap * 1_000,
      phoenix: phoenix * 1_000,
      blend: blend * 1_000,
      total: total * 1_000,
    };
  });
};

// ─── Dashboard Summary ────────────────────────────────────────
export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  await delay(80);
  return {
    totalTVL: 4_880_000,
    totalVolume24h: 1_168_000,
    activeProtocols: 4,
    activePools: 6,
    tvlChange24h: 4.3,
  };
};

export const fetchXlmPrice = async (): Promise<number> => {
  await delay(50);

  // Mocked XLM/USD exchange rate.
  // Example: 1 XLM = $0.135 USD
  return 0.135;
};