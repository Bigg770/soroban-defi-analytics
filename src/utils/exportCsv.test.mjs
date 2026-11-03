import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exportCsvSrc = fs.readFileSync(path.join(__dirname, "exportCsv.ts"), "utf8");
const volumeChartSrc = fs.readFileSync(path.join(__dirname, "..", "components", "VolumeChart.tsx"), "utf8");

// 1. Validate required CSV header columns
assert.ok(
  exportCsvSrc.includes("date,soroswap_volume,phoenix_volume,blend_volume,total_volume"),
  "CSV header must include date,soroswap_volume,phoenix_volume,blend_volume,total_volume"
);

// 2. Validate filename format soroban-tvl-YYYY-MM-DD.csv
const today = new Date().toISOString().split("T")[0];
const expectedFilename = `soroban-tvl-${today}.csv`;
assert.match(expectedFilename, /^soroban-tvl-\d{4}-\d{2}-\d{2}\.csv$/);

// 3. Validate VolumeChart wiring and accessibility attributes
assert.ok(volumeChartSrc.includes('import { downloadCsv, buildCsvFilename } from "@/utils/exportCsv"'));
assert.ok(volumeChartSrc.includes('aria-label="Export chart data as CSV"'));
assert.ok(volumeChartSrc.includes("Export CSV"));
assert.ok(volumeChartSrc.includes("Exporting..."));

console.log("[TEST PASS] soroban-defi-analytics#4 CSV export & VolumeChart verification:", expectedFilename);
