/**
 * Export what is shown on the decision cards in the game to an Excel file.
 * Uses the same data synced to the game (decisions_from_excel_export.json).
 * Run from project root: node scripts/export-cards-to-excel.mjs
 */
import XLSX from 'xlsx';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const jsonPath = join(root, 'decisions_from_excel_export.json');

if (!existsSync(jsonPath)) {
  console.error('Run scripts/read-decisions-excel.mjs first to create decisions_from_excel_export.json');
  process.exit(1);
}

const data = JSON.parse(readFileSync(jsonPath, 'utf8'));

/** In-year investment: use stored value when present, else total / period. */
function inYearVal(total, period, stored) {
  if (stored != null && stored !== '') return stored;
  if (total == null || total === '' || period == null || period === '' || Number(period) <= 0) return '';
  return Math.round((Number(total) / Number(period)) * 100) / 100;
}

// Build rows: card fields first, then metrics in exact order from spec:
// Grow: Total Investment ($M), Investment period (yrs), In-Year Investment, Revenue 1 year ($M), 5-year growth (%), EBIT margin (%)
// Optimize: Total Investment ($M), Investment period (yrs), In-Year Investment, Implementation cost ($M), Annual cost savings ($M)
// Sustain: Total Investment ($M), Investment period (yrs), In-Year Investment, Implementation cost ($M), Annual cost savings ($M)
const rows = data.map((row) => {
  const brief = row.detail ? row.detail.split('.')[0] + '.' : '';
  const r = {
    'Decision #': row.decisionNumber,
    'Lever': row.lever,
    'Name (front, big)': row.name,
    'Brief (front, 1 sentence)': brief,
    'Detail (back, full)': row.detail,
    'Investment ($M)': row.cost ?? '',
  };
  // [Grow] — order per spec
  if (row.grow) {
    const total = row.grow.investmentsTotal ?? '';
    const period = row.grow.investmentPeriod ?? '';
    r['[Grow] Total Investment ($M)'] = total;
    r['[Grow] Investment period (yrs)'] = period;
    r['[Grow] In-Year Investment'] = inYearVal(total, period, row.grow.inYearInvestment);
    r['[Grow] Revenue 1 year ($M)'] = row.grow.revenue1Year ?? '';
    r['[Grow] 5-year growth (%)'] = row.grow.fiveYearGrowth ?? '';
    r['[Grow] EBIT margin (%)'] = row.grow.ebitMargin ?? '';
  } else {
    r['[Grow] Total Investment ($M)'] = '';
    r['[Grow] Investment period (yrs)'] = '';
    r['[Grow] In-Year Investment'] = '';
    r['[Grow] Revenue 1 year ($M)'] = '';
    r['[Grow] 5-year growth (%)'] = '';
    r['[Grow] EBIT margin (%)'] = '';
  }
  // [Optimize] — order per spec
  if (row.optimize) {
    const total = row.optimize.investment ?? '';
    const period = row.optimize.investmentPeriod ?? '';
    r['[Optimize] Total Investment ($M)'] = total;
    r['[Optimize] Investment period (yrs)'] = period;
    r['[Optimize] In-Year Investment'] = inYearVal(total, period, row.optimize.inYearInvestment);
    r['[Optimize] Implementation cost ($M)'] = row.optimize.implementationCost ?? '';
    r['[Optimize] Annual cost savings ($M)'] = row.optimize.annualCost ?? '';
  } else {
    r['[Optimize] Total Investment ($M)'] = '';
    r['[Optimize] Investment period (yrs)'] = '';
    r['[Optimize] In-Year Investment'] = '';
    r['[Optimize] Implementation cost ($M)'] = '';
    r['[Optimize] Annual cost savings ($M)'] = '';
  }
  // [Sustain] — order per spec
  if (row.sustain) {
    const total = row.sustain.investment ?? '';
    const period = row.sustain.investmentPeriod ?? '';
    r['[Sustain] Total Investment ($M)'] = total;
    r['[Sustain] Investment period (yrs)'] = period;
    r['[Sustain] In-Year Investment'] = inYearVal(total, period, row.sustain.inYearInvestment);
    r['[Sustain] Implementation cost ($M)'] = row.sustain.implementationCost ?? '';
    r['[Sustain] Annual cost savings ($M)'] = row.sustain.annualCost ?? '';
  } else {
    r['[Sustain] Total Investment ($M)'] = '';
    r['[Sustain] Investment period (yrs)'] = '';
    r['[Sustain] In-Year Investment'] = '';
    r['[Sustain] Implementation cost ($M)'] = '';
    r['[Sustain] Annual cost savings ($M)'] = '';
  }
  return r;
});

const ws = XLSX.utils.json_to_sheet(rows);

// Column widths for readability
ws['!cols'] = [
  { wch: 10 },  // Decision #
  { wch: 10 },  // Lever
  { wch: 45 },  // Name
  { wch: 55 },  // Brief
  { wch: 85 },  // Detail
  { wch: 14 },  // Investment ($M)
  { wch: 22 }, { wch: 20 }, { wch: 22 }, { wch: 18 }, { wch: 16 }, { wch: 14 },  // Grow
  { wch: 26 }, { wch: 22 }, { wch: 22 }, { wch: 24 }, { wch: 26 },                 // Optimize
  { wch: 26 }, { wch: 22 }, { wch: 22 }, { wch: 24 }, { wch: 26 },                 // Sustain
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Cards in game');

const desktop = join(process.env.USERPROFILE || '', 'OneDrive - McKinsey & Company', 'Desktop');
// Write to Cards-In-Game-Export.xlsx so the file is not locked if Cards-In-Game.xlsx is open
const outPath = join(desktop, 'Cards-In-Game-Export.xlsx');
XLSX.writeFile(wb, outPath);

console.log('Wrote:', outPath);
console.log('75 rows: one per decision card. Columns match what is shown on the card front and back.');
