/**
 * Read decision cards from CSV and write decisions_from_excel_export.json.
 * Use this as the source of truth so metrics on cards match the CSV exactly.
 *
 * CSV column layout (0-based index):
 *   A=0 Round, B=1 Decision#, C=2 Lever, D=3 Name, E=4 Brief, F=5 Detail (back)
 *   G–L Grow:     G=6 Total inv, H=7 Period, I=8 In-year, J=9 Revenue 1yr, K=10 5yr growth %, L=11 EBIT margin %
 *   M–Q Optimize: M=12 Total, N=13 Period, O=14 In-year, P=15 Impl cost, Q=16 Annual cost
 *   R–V Sustain:  R=17 Total, S=18 Period, T=19 In-year, U=20 Impl cost, V=21 Annual cost
 *
 * Run from project root: node scripts/read-decisions-csv.mjs
 * Then: node scripts/apply-decisions-from-excel.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const csvPath = process.env.DECISIONS_CSV_PATH || join(root, 'decision_cards_export.csv');
const outPath = join(root, 'decisions_from_excel_export.json');

if (!existsSync(csvPath)) {
  console.error('CSV not found:', csvPath);
  console.error('Place decision_cards_export.csv in project root or set DECISIONS_CSV_PATH.');
  process.exit(1);
}

const raw = readFileSync(csvPath, 'utf8');
const lines = raw.split(/\r?\n/).filter((line) => line.trim());
if (lines.length < 2) {
  console.error('CSV has no data rows.');
  process.exit(1);
}

// Parse CSV (handles quoted fields with commas)
function parseCsvLine(line) {
  const out = [];
  let i = 0;
  while (i < line.length) {
    if (line[i] === '"') {
      let end = i + 1;
      while (end < line.length) {
        const next = line.indexOf('"', end);
        if (next === -1) break;
        if (line[next + 1] === '"') {
          end = next + 2;
          continue;
        }
        out.push(line.slice(i + 1, next).replace(/""/g, '"'));
        end = next + 1;
        break;
      }
      i = end;
      if (line[i] === ',') i++;
      continue;
    }
    const comma = line.indexOf(',', i);
    if (comma === -1) {
      out.push(line.slice(i).trim());
      break;
    }
    out.push(line.slice(i, comma).trim());
    i = comma + 1;
  }
  return out;
}

const rows = lines.map(parseCsvLine);

// Column indices: A=0, B=1, ..., V=21
const COL = {
  round: 0,
  decisionNumber: 1,
  lever: 2,
  name: 3,
  brief: 4,
  detail: 5,
  // Grow G–L
  growTotal: 6,
  growPeriod: 7,
  growInYear: 8,
  growRevenue1Year: 9,
  growFiveYearGrowth: 10,
  growEbitMargin: 11,
  // Optimize M–Q
  optTotal: 12,
  optPeriod: 13,
  optInYear: 14,
  optImplCost: 15,
  optAnnualCost: 16,
  // Sustain R–V
  sustTotal: 17,
  sustPeriod: 18,
  sustInYear: 19,
  sustImplCost: 20,
  sustAnnualCost: 21,
};

function toNum(v) {
  if (v === undefined || v === null || v === '') return undefined;
  const s = String(v).trim().replace(/,/g, '');
  const n = Number(s);
  return Number.isNaN(n) ? undefined : n;
}

function toPercent(v) {
  const n = toNum(v);
  if (n === undefined) return undefined;
  if (n > 0 && n <= 1) return Math.round(n * 1000) / 10;
  return Math.round(n * 10) / 10;
}

function cleanStr(v) {
  if (v === undefined || v === null) return '';
  return String(v).trim();
}

// If first row column B (decision#) is a number, treat as data (no header); else skip first row as header
const firstColB = rows[0] && toNum(rows[0][COL.decisionNumber]);
const dataRows = firstColB !== undefined ? rows : rows.slice(1);

const records = [];
for (let r = 0; r < dataRows.length; r++) {
  const row = dataRows[r];
  const num = toNum(row[COL.decisionNumber]);
  if (num === undefined) continue;

  let lever = cleanStr(row[COL.lever] || '');
  if (!lever) {
    if (num <= 25) lever = 'Grow';
    else if (num <= 50) lever = 'Optimize';
    else lever = 'Sustain';
  }

  const round = toNum(row[COL.round]);
  const introducedYear = round !== undefined ? Math.max(1, Math.min(5, Math.round(round))) : (num <= 15 ? 1 : num <= 30 ? 2 : num <= 45 ? 3 : num <= 60 ? 4 : 5);

  const rec = {
    excelRow: r + 2,
    decisionNumber: num,
    name: cleanStr(row[COL.name]),
    brief: cleanStr(row[COL.brief]),
    detail: cleanStr(row[COL.detail]),
    lever,
    introducedYear,
  };

  if (lever.toLowerCase().includes('grow')) {
    const total = toNum(row[COL.growTotal]);
    const period = toNum(row[COL.growPeriod]);
    const inYear = toNum(row[COL.growInYear]);
    rec.cost = total !== undefined ? Math.round(Math.abs(total)) : 0;
    rec.grow = {
      investmentsTotal: total !== undefined ? Math.round(Math.abs(total)) : 0,
      investmentPeriod: period !== undefined ? Math.round(period) : 1,
      inYearInvestment: inYear !== undefined ? Math.round(inYear * 100) / 100 : undefined,
      revenue1Year: toNum(row[COL.growRevenue1Year]),
      fiveYearGrowth: toPercent(row[COL.growFiveYearGrowth]),
      ebitMargin: toPercent(row[COL.growEbitMargin]),
    };
  } else if (lever.toLowerCase().includes('optim')) {
    const total = toNum(row[COL.optTotal]);
    const period = toNum(row[COL.optPeriod]);
    const inYear = toNum(row[COL.optInYear]);
    const impl = toNum(row[COL.optImplCost]);
    const annual = toNum(row[COL.optAnnualCost]);
    rec.cost = total !== undefined ? Math.round(Math.abs(total)) : (impl !== undefined ? Math.round(Math.abs(impl)) : 0);
    rec.optimize = {
      implementationCost: impl !== undefined ? Math.round(impl * 100) / 100 : 0,
      investment: total !== undefined ? Math.round(Math.abs(total)) : 0,
      investmentPeriod: period !== undefined ? Math.round(period) : 1,
      inYearInvestment: inYear !== undefined ? Math.round(inYear * 100) / 100 : undefined,
      annualCost: annual !== undefined ? Math.round(annual * 100) / 100 : 0,
    };
  } else if (lever.toLowerCase().includes('sustain')) {
    const total = toNum(row[COL.sustTotal]);
    const period = toNum(row[COL.sustPeriod]);
    const inYear = toNum(row[COL.sustInYear]);
    const impl = toNum(row[COL.sustImplCost]);
    const annual = toNum(row[COL.sustAnnualCost]);
    rec.cost = total !== undefined ? Math.round(Math.abs(total)) : (impl !== undefined ? Math.round(Math.abs(impl)) : 0);
    rec.sustain = {
      implementationCost: impl !== undefined ? Math.round(impl * 100) / 100 : 0,
      investment: total !== undefined ? Math.round(Math.abs(total)) : 0,
      investmentPeriod: period !== undefined ? Math.round(period) : 1,
      inYearInvestment: inYear !== undefined ? Math.round(inYear * 100) / 100 : undefined,
      annualCost: annual !== undefined ? Math.round(annual * 100) / 100 : 0,
    };
  }

  records.push(rec);
}

writeFileSync(outPath, JSON.stringify(records, null, 2));
console.log('Read', dataRows.length, 'CSV rows, wrote', records.length, 'records to', outPath);
console.log('Next: node scripts/apply-decisions-from-excel.mjs');
