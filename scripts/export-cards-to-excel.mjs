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

// Build rows matching what is shown on the cards (front + back)
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
  if (row.grow) {
    r['[Grow] Revenue 1 year ($M)'] = row.grow.revenue1Year ?? '';
    r['[Grow] 5-year growth (%)'] = row.grow.fiveYearGrowth ?? '';
    r['[Grow] Investment period (yrs)'] = row.grow.investmentPeriod ?? '';
    r['[Grow] EBIT margin (%)'] = row.grow.ebitMargin ?? '';
    r['[Grow] Investments total ($M)'] = row.grow.investmentsTotal ?? '';
  } else {
    r['[Grow] Revenue 1 year ($M)'] = '';
    r['[Grow] 5-year growth (%)'] = '';
    r['[Grow] Investment period (yrs)'] = '';
    r['[Grow] EBIT margin (%)'] = '';
    r['[Grow] Investments total ($M)'] = '';
  }
  if (row.optimize) {
    r['[Optimize] Investment ($M)'] = row.optimize.investment ?? '';
    r['[Optimize] Investment period (yrs)'] = row.optimize.investmentPeriod ?? '';
    r['[Optimize] Implementation cost ($M)'] = row.optimize.implementationCost ?? '';
    r['[Optimize] Annual cost savings ($M)'] = row.optimize.annualCost ?? '';
  } else {
    r['[Optimize] Investment ($M)'] = '';
    r['[Optimize] Investment period (yrs)'] = '';
    r['[Optimize] Implementation cost ($M)'] = '';
    r['[Optimize] Annual cost savings ($M)'] = '';
  }
  if (row.sustain) {
    r['[Sustain] Investment ($M)'] = row.sustain.investment ?? '';
    r['[Sustain] Investment period (yrs)'] = row.sustain.investmentPeriod ?? '';
    r['[Sustain] Implementation cost ($M)'] = row.sustain.implementationCost ?? '';
    r['[Sustain] Annual cost savings ($M)'] = row.sustain.annualCost ?? '';
  } else {
    r['[Sustain] Investment ($M)'] = '';
    r['[Sustain] Investment period (yrs)'] = '';
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
  { wch: 14 },  // Investment
  { wch: 18 }, { wch: 16 }, { wch: 20 }, { wch: 14 }, { wch: 22 },  // Grow
  { wch: 18 }, { wch: 22 }, { wch: 24 }, { wch: 26 },                 // Optimize
  { wch: 18 }, { wch: 22 }, { wch: 24 }, { wch: 26 },                 // Sustain
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Cards in game');

const desktop = join(process.env.USERPROFILE || '', 'OneDrive - McKinsey & Company', 'Desktop');
const outPath = join(desktop, 'Cards-In-Game.xlsx');
XLSX.writeFile(wb, outPath);

console.log('Wrote:', outPath);
console.log('75 rows: one per decision card. Columns match what is shown on the card front and back.');
