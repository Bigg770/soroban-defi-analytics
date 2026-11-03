import type { VolumeDataPoint } from "@/services/sorobanApi";

/**
 * Formats VolumeDataPoint rows into CSV text with the required header columns:
 * date,soroswap_volume,phoenix_volume,blend_volume,total_volume
 */
export function formatCsvContent(data: VolumeDataPoint[]): string {
  const header =
    "date,soroswap_volume,phoenix_volume,blend_volume,total_volume\n";

  const rows = data
    .map(
      (r) =>
        `${r.date},${r.soroswap},${r.phoenix},${r.blend},${r.total}`
    )
    .join("\n");

  return header + rows;
}

/**
 * Triggers a client-side CSV download of historical pool volume data.
 * Called from a "use client" component — do not import in Server Components.
 *
 * @param data     Array of VolumeDataPoint returned by fetchVolumeHistory()
 * @param filename Desired file name, e.g. "soroban-tvl-2026-08-07.csv"
 */
export function downloadCsv(data: VolumeDataPoint[], filename: string): void {
  const csvContent = formatCsvContent(data);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
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

/**
 * Returns a filename string in the format: soroban-tvl-YYYY-MM-DD.csv
 */
export function buildCsvFilename(): string {
  const date = new Date().toISOString().split("T")[0];
  return `soroban-tvl-${date}.csv`;
}
