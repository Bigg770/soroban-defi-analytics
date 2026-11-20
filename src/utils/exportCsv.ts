import type { VolumeDataPoint } from "@/services/sorobanApi";

export function downloadCsv(data: VolumeDataPoint[], filename: string): void {
  const header = "date,soroswap_volume,phoenix_volume,blend_volume,total_volume\n";
  const rows = data.map((r) => `${r.date},${r.soroswap},${r.phoenix},${r.blend},${r.total}`).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.setAttribute("aria-label", `Download ${filename}`);
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function buildCsvFilename(): string {
  const date = new Date().toISOString().split('T')[0];
  return `soroban-tvl-${date}.csv`;
}