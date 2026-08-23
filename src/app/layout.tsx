import type { Metadata } from "next";
import "./globals.css";
import { CurrencyProvider } from "@/hooks/useCurrency";

export const metadata: Metadata = {
  title: "Soroban DeFi Analytics",
  description:
    "Real-time TVL, volume, and liquidity pool metrics across protocols built on Stellar Soroban.",
  keywords: ["Soroban", "Stellar", "DeFi", "analytics", "TVL", "DEX"],
  openGraph: {
    title: "Soroban DeFi Analytics",
    description:
      "Real-time metrics across Soroswap, Phoenix DEX, Blend Capital and more.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">
        <CurrencyProvider>{children}</CurrencyProvider>
      </body>
    </html>
  );
}
