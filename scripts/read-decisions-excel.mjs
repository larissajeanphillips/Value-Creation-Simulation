/**
 * Read decision card data from Excel "Decision card comparison.xlsx" (Desktop) Decisions tab.
 * Columns: A = decision #, B = lever, F = decision name, G = brief (front), H = detail (back), K = round.
 * Metrics: V–AK (indices 21–36) — Grow V–AA, Optimize AB–AF, Sustain AG–AK (In-Year columns are derived, not read).
 *
 * Validation: expects ~EXPECTED_SOURCE_ROWS rows from source; update when source structure changes.
 */
import XLSX from 'xlsx';

/** Expected total rows in Excel (including header). Update when source format changes. */
const EXPECTED_SOURCE_ROWS = 1199;
/** Tolerance: fail if rows < expected * (1 - tolerance/100). */
const EXPECTED_SOURCE_ROWS_TOLERANCE_PCT = 10;
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Prefer "Decision card comparison.xlsx" on Desktop, then fallbacks
const desktopComparison = join(
  process.env.USERPROFILE || '',
  'OneDrive - McKinsey & Company',
  'Desktop',
  'Decision card comparison.xlsx'
);
const desktopDecisions = join(
  process.env.USERPROFILE || '',
  'OneDrive - McKinsey & Company',
  'Desktop',
  'Decisions.xlsx'
);
const projectExcel = join(projectRoot, 'Cards-In-Game.xlsx');

const excelPath = existsSync(desktopComparison)
  ? desktopComparison
  : existsSync(desktopDecisions)
    ? desktopDecisions
    : projectExcel;
console.log('Reading:', excelPath);

const wb = XLSX.read(readFileSync(excelPath), { type: 'buffer' });
const sheetName =
  wb.SheetNames.find((s) => s === 'Decisions') ||
  wb.SheetNames.find((s) => /^Decisions$/i.test(s)) ||
  wb.SheetNames[0];
const ws = wb.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
console.log('Using sheet:', sheetName, 'rows:', rows.length);

const headers = rows[0];

// Decision card comparison.xlsx: A=0, B=1, F=5, G=6, H=7, K=10; V–AK = 21–36 (metrics)
// Excel headers: V=[Grow] Total Investment, W=Investment period, X=In-Year, Y=Revenue 1 year, Z=5-year growth %, AA=EBIT margin %
//                AB=[Optimize] Total, AC=period, AD=In-Year, AE=Implementation cost, AF=Annual cost savings
//                AG=[Sustain] Total, AH=period, AI=In-Year, AJ=Implementation cost, AK=Annual cost savings
const col = {
  decisionNumber: 0,   // A
  lever: 1,            // B
  name: 5,             // F - Decision Name
  brief: 6,             // G - Decision Brief (front of card)
  detail: 7,           // H - Decision Detail (back of card)
  round: 10,           // K - Round shown
  // Grow: V–AA (indices 21–26); 23 = In-Year Investment
  investmentsTotal: 21,
  investmentPeriodGrow: 22,
  inYearGrow: 23,
  revenue1Year: 24,
  fiveYearGrowth: 25,
  ebitMargin: 26,
  // Optimize: AB–AF (indices 27–31); 29 = In-Year Investment
  investmentOpt: 27,
  investmentPeriodOpt: 28,
  inYearOpt: 29,
  implCostOpt: 30,
  annualCostOpt: 31,
  // Sustain: AG–AK (indices 32–36); 34 = In-Year Investment
  investmentSust: 32,
  investmentPeriodSust: 33,
  inYearSust: 34,
  implCostSust: 35,
  annualCostSust: 36,
};

function toNum(v) {
  if (v === undefined || v === null || v === '') return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}
/** If value is in 0–1 range (e.g. 0.05 for 5%), return as percentage 5; else treat as already percentage. */
function toPercent(v) {
  const n = toNum(v);
  if (n === undefined) return undefined;
  if (n > 0 && n <= 1) return Math.round(n * 1000) / 10; // 0.05 -> 5, 0.11 -> 11
  return Math.round(n * 10) / 10; // already percent: 5 -> 5, 11 -> 11
}
function cleanStr(v) {
  if (v === undefined || v === null) return '';
  return String(v).trim();
}

// Build export: one row per decision (rows 2–76 = up to 75 cards)
const dataWithLever = [];
for (let r = 1; r < rows.length; r++) {
  const row = rows[r];
  const num = toNum(row[col.decisionNumber]);
  if (num === undefined || num === '') continue;

  let lever = cleanStr(row[col.lever] ?? '');
  if (!lever && num) {
    if (num <= 25) lever = 'Grow';
    else if (num <= 50) lever = 'Optimize';
    else lever = 'Sustain';
  }

  const rec = {
    excelRow: r + 1,
    decisionNumber: num,
    name: cleanStr(row[col.name]),
    brief: cleanStr(row[col.brief]),
    detail: cleanStr(row[col.detail]),
    lever,
    introducedYear: toNum(row[col.round]) ?? (num <= 15 ? 1 : num <= 30 ? 2 : num <= 45 ? 3 : num <= 60 ? 4 : 5),
  };

  if (lever && lever.toLowerCase().includes('grow')) {
    const inv = toNum(row[col.investmentsTotal]);
    const rev1 = toNum(row[col.revenue1Year]);
    const fiveYr = toNum(row[col.fiveYearGrowth]);
    const period = toNum(row[col.investmentPeriodGrow]);
    const ebit = toNum(row[col.ebitMargin]);
    const inYear = toNum(row[col.inYearGrow]);
    rec.cost = inv !== undefined ? Math.round(Math.abs(inv)) : undefined;
    rec.grow = {
      investmentsTotal: inv !== undefined ? Math.round(Math.abs(inv)) : undefined,
      investmentPeriod: period,
      inYearInvestment: inYear !== undefined ? Math.round(Math.abs(inYear) * 100) / 100 : undefined,
      revenue1Year: rev1 !== undefined ? Math.round(rev1) : undefined,
      fiveYearGrowth: toPercent(row[col.fiveYearGrowth]),
      ebitMargin: toPercent(row[col.ebitMargin]),
    };
  } else if (lever && lever.toLowerCase().includes('optim')) {
    const inv = toNum(row[col.investmentOpt]);
    const period = toNum(row[col.investmentPeriodOpt]);
    const impl = toNum(row[col.implCostOpt]);
    const annual = toNum(row[col.annualCostOpt]);
    const inYear = toNum(row[col.inYearOpt]);
    rec.cost = inv !== undefined ? Math.round(Math.abs(inv)) : (impl !== undefined ? Math.round(Math.abs(impl)) : undefined);
    rec.optimize = {
      implementationCost: impl !== undefined ? Math.round(impl * 100) / 100 : undefined,
      investment: inv !== undefined ? Math.round(Math.abs(inv)) : undefined,
      investmentPeriod: period,
      inYearInvestment: inYear !== undefined ? Math.round(Math.abs(inYear) * 100) / 100 : undefined,
      annualCost: annual !== undefined ? Math.round(annual * 100) / 100 : undefined,
    };
  } else if (lever && lever.toLowerCase().includes('sustain')) {
    const inv = toNum(row[col.investmentSust]);
    const period = toNum(row[col.investmentPeriodSust]);
    const impl = toNum(row[col.implCostSust]);
    const annual = toNum(row[col.annualCostSust]);
    const inYear = toNum(row[col.inYearSust]);
    rec.cost = inv !== undefined ? Math.round(Math.abs(inv)) : (impl !== undefined ? Math.round(Math.abs(impl)) : undefined);
    rec.sustain = {
      implementationCost: impl !== undefined ? Math.round(impl * 100) / 100 : undefined,
      investment: inv !== undefined ? Math.round(Math.abs(inv)) : undefined,
      investmentPeriod: period,
      inYearInvestment: inYear !== undefined ? Math.round(Math.abs(inYear) * 100) / 100 : undefined,
      annualCost: annual !== undefined ? Math.round(annual * 100) / 100 : undefined,
    };
  }

  dataWithLever.push(rec);
}

writeFileSync(
  join(projectRoot, 'decisions_from_excel_export.json'),
  JSON.stringify(dataWithLever, null, 2)
);
console.log('Wrote decisions_from_excel_export.json with', dataWithLever.length, 'rows');

// Validation: check row count vs expected
const minRows = Math.floor(EXPECTED_SOURCE_ROWS * (1 - EXPECTED_SOURCE_ROWS_TOLERANCE_PCT / 100));
const sourceValid = rows.length >= minRows;
const validationStatus = sourceValid ? 'PASS' : 'FAIL (missing chunks)';
console.log(
  `Pulled ${rows.length} rows from Excel (expected ~${EXPECTED_SOURCE_ROWS}). Data records extracted: ${dataWithLever.length}. Validation: ${validationStatus}`
);
if (!sourceValid) {
  process.exit(1);
}
