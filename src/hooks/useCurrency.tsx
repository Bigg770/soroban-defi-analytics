"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { fetchXlmPrice } from "@/services/sorobanApi";

export type Currency = "USD" | "XLM";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  xlmPrice: number;
  formatValue: (value: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "soroban-currency";

const formatCompact = (value: number, currency: Currency) => {
  if (currency === "USD") {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  }

  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M XLM`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K XLM`;
  return `${value.toFixed(0)} XLM`;
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [xlmPrice, setXlmPrice] = useState(0.135);

  useEffect(() => {
    const savedCurrency = localStorage.getItem(STORAGE_KEY);

    if (savedCurrency === "USD" || savedCurrency === "XLM") {
      setCurrencyState(savedCurrency);
    }

    fetchXlmPrice().then(setXlmPrice);
  }, []);

  const setCurrency = (nextCurrency: Currency) => {
    setCurrencyState(nextCurrency);
    localStorage.setItem(STORAGE_KEY, nextCurrency);
  };

  const formatValue = useMemo(
    () => (usdValue: number) => {
      const convertedValue =
        currency === "XLM" ? usdValue / xlmPrice : usdValue;

      return formatCompact(convertedValue, currency);
    },
    [currency, xlmPrice]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        xlmPrice,
        formatValue,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }

  return context;
}