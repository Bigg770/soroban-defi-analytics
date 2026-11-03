export interface VolumeTvlRow {
  date: string;
  tvl?: number;
  volume?: number;
  [key: string]: unknown;
}

export function formatHistoricalTvlCsv(rows: VolumeTvlRow[]): string {
  const headers = ["Date", "TVL (USD)", "Volume (USD)"];
  const escapeCsv = (val: unknown): string => {
    const str = val === null || val === undefined ? "" : String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      [
        escapeCsv(row.date),
        escapeCsv(row.tvl ?? 0),
        escapeCsv(row.volume ?? 0),
      ].join(",")
    );
  }
  return lines.join("\n");
}

export function downloadHistoricalTvlCsv(
  rows: VolumeTvlRow[],
  filename: string = "soroban-historical-tvl-volume.csv"
): void {
  if (typeof window === "undefined" || !rows?.length) return;
  const csvContent = formatHistoricalTvlCsv(rows);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
