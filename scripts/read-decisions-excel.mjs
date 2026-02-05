/**
 * Read decision card data from Excel.
 * Columns: A=decision#, F=name, G=detail.
 * Grow back: AA, Y, Z, AB, AC. Optimize: AF, AG, AE, AH. Sustain: AK, AL, AJ, AM.
 * Excel row 1 = headers, rows 2-76 = 75 cards.
 */
import XLSX from 'xlsx';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
// Prefer Desktop Decisions.xlsx if present (user's latest), else project Excel
const desktopExcel = join(process.env.USERPROFILE || '', 'OneDrive - McKinsey & Company', 'Desktop', 'Decisions.xlsx');
const projectExcel = join(projectRoot, '260127 TSR decisions_v2.8_LP.xlsx');
const excelPath = existsSync(desktopExcel) ? desktopExcel : projectExcel;
console.log('Reading:', excelPath);

const wb = XLSX.read(readFileSync(excelPath), { type: 'buffer' });
console.log('Sheet names:', wb.SheetNames);

// Use sheet named "Decisions" (exact) for the 75 cards
let sheetName = wb.SheetNames.find(s => s === 'Decisions') || wb.SheetNames.find(s => /^Decisions$/i.test(s)) || wb.SheetNames[0];
let ws = wb.Sheets[sheetName];
let rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
console.log('Using sheet:', sheetName, 'rows:', rows.length);

const headers = rows[0];
console.log('Column indices 0-40 labels:');
for (let c = 0; c <= 40; c++) {
  console.log(c, String(headers[c] ?? '').slice(0, 50));
}

// Column indices: A=0, F=5, G=6, Y=24, Z=25, AA=26, AB=27, AC=28, AE=30, AF=31, AG=32, AH=33, AJ=35, AK=36, AL=37, AM=38
const col = {
  decisionNumber: 0,   // A
  name: 5,             // F
  detail: 6,           // G
  revenue1Year: 24,    // Y
  fiveYearGrowth: 25,  // Z
  investmentGrow: 26,  // AA
  investmentPeriodGrow: 27,  // AB
  ebitMargin: 28,      // AC
  implCostOpt: 30,     // AE
  investmentOpt: 31,   // AF
  investmentPeriodOpt: 32,  // AG
  annualCostOpt: 33,   // AH
  implCostSust: 35,    // AJ
  investmentSust: 36,  // AK
  investmentPeriodSust: 37,  // AL
  annualCostSust: 38,  // AM
};

// Find Lever column for category (Grow/Optimize/Sustain)
let leverCol = -1;
for (let c = 0; c < headers.length; c++) {
  const h = String(headers[c] || '').toLowerCase();
  if (h.includes('lever') || h === 'category' || h === 'pillar') {
    leverCol = c;
    break;
  }
}
console.log('\nLever column index:', leverCol);
if (leverCol >= 0) console.log('Lever header:', headers[leverCol]);

console.log('\n--- First 3 data rows (raw) ---');
for (let r = 1; r <= Math.min(3, rows.length - 1); r++) {
  const row = rows[r];
  const num = row[col.decisionNumber];
  const name = row[col.name];
  const lever = leverCol >= 0 ? row[leverCol] : '';
  console.log({ row: r + 1, num, name: String(name).slice(0, 40), lever });
  if (num >= 1 && num <= 5) {
    console.log('  Grow metrics:', { investment: row[col.investmentGrow], revenue1Year: row[col.revenue1Year], fiveYearGrowth: row[col.fiveYearGrowth], period: row[col.investmentPeriodGrow], ebit: row[col.ebitMargin] });
  } else if (num >= 6 && num <= 10) {
    console.log('  Optimize metrics:', { investment: row[col.investmentOpt], period: row[col.investmentPeriodOpt], impl: row[col.implCostOpt], annual: row[col.annualCostOpt] });
  } else if (num >= 11 && num <= 15) {
    console.log('  Sustain metrics:', { investment: row[col.investmentSust], period: row[col.investmentPeriodSust], impl: row[col.implCostSust], annual: row[col.annualCostSust] });
  }
}

// Output full 75 rows as JSON for verification
const data = [];
for (let r = 1; r <= 75 && r < rows.length; r++) {
  const row = rows[r];
  const num = toNum(row[col.decisionNumber]);
  const lever = leverCol >= 0 ? String(row[leverCol] || '').trim().toLowerCase() : inferLever(num);
  data.push({
    excelRow: r + 1,
    decisionNumber: num,
    name: cleanStr(row[col.name]),
    detail: cleanStr(row[col.detail]),
    lever,
    grow: num >= 1 && num <= 25 ? {
      investment: toNum(row[col.investmentGrow]),
      revenue1Year: toNum(row[col.revenue1Year]),
      fiveYearGrowth: toNum(row[col.fiveYearGrowth]),
      investmentPeriod: toNum(row[col.investmentPeriodGrow]),
      ebitMargin: toNum(row[col.ebitMargin]),
    } : undefined,
    optimize: num >= 26 && num <= 50 ? {
      investment: toNum(row[col.investmentOpt]),
      investmentPeriod: toNum(row[col.investmentPeriodOpt]),
      implementationCost: toNum(row[col.implCostOpt]),
      annualCost: toNum(row[col.annualCostOpt]),
    } : undefined,
    sustain: num >= 51 && num <= 75 ? {
      investment: toNum(row[col.investmentSust]),
      investmentPeriod: toNum(row[col.investmentPeriodSust]),
      implementationCost: toNum(row[col.implCostSust]),
      annualCost: toNum(row[col.annualCostSust]),
    } : undefined,
  });
}

function toNum(v) {
  if (v === undefined || v === null || v === '') return undefined;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}
function cleanStr(v) {
  if (v === undefined || v === null) return '';
  return String(v).trim();
}
function inferLever(num) {
  if (num >= 1 && num <= 25) return 'grow';
  if (num >= 26 && num <= 50) return 'optimize';
  if (num >= 51 && num <= 75) return 'sustain';
  return '';
}

// Current code uses: Grow 1-5,16-20,..., Optimize 6-10,21-25,..., Sustain 11-15,26-30,...
// So decision numbers in Excel might be 1-75 in order and Lever column tells category. Re-output with category from Lever.
const dataWithLever = [];
for (let r = 1; r <= 75 && r < rows.length; r++) {
  const row = rows[r];
  const num = toNum(row[col.decisionNumber]);
  let lever = leverCol >= 0 ? String(row[leverCol] || '').trim() : '';
  if (!lever && num) {
    if (num <= 25) lever = 'Grow';
    else if (num <= 50) lever = 'Optimize';
    else lever = 'Sustain';
  }
  const rec = {
    excelRow: r + 1,
    decisionNumber: num,
    name: cleanStr(row[col.name]),
    detail: cleanStr(row[col.detail]),
    lever,
  };
  if (lever && lever.toLowerCase().includes('grow')) {
    const inv = toNum(row[col.investmentGrow]);
    const rev1 = toNum(row[col.revenue1Year]);
    const fiveYr = toNum(row[col.fiveYearGrowth]);
    const period = toNum(row[col.investmentPeriodGrow]);
    const ebit = toNum(row[col.ebitMargin]);
    rec.cost = inv !== undefined ? Math.round(Math.abs(inv)) : undefined;
    rec.grow = {
      investmentsTotal: inv !== undefined ? Math.round(Math.abs(inv)) : undefined,
      revenue1Year: rev1,
      fiveYearGrowth: fiveYr !== undefined ? Math.round(fiveYr * 1000) / 10 : undefined,
      investmentPeriod: period,
      ebitMargin: ebit !== undefined ? Math.round(ebit * 1000) / 10 : undefined,
    };
  } else if (lever && lever.toLowerCase().includes('optim')) {
    const inv = toNum(row[col.investmentOpt]);
    const period = toNum(row[col.investmentPeriodOpt]);
    const impl = toNum(row[col.implCostOpt]);
    const annual = toNum(row[col.annualCostOpt]);
    rec.cost = inv !== undefined ? Math.round(Math.abs(inv)) : (impl !== undefined ? Math.round(impl) : undefined);
    rec.optimize = {
      investment: inv !== undefined ? Math.round(Math.abs(inv)) : impl,
      investmentPeriod: period,
      implementationCost: impl !== undefined ? Math.round(impl * 100) / 100 : undefined,
      annualCost: annual !== undefined ? Math.round(annual * 100) / 100 : undefined,
    };
  } else if (lever && lever.toLowerCase().includes('sustain')) {
    const inv = toNum(row[col.investmentSust]);
    const period = toNum(row[col.investmentPeriodSust]);
    const impl = toNum(row[col.implCostSust]);
    const annual = toNum(row[col.annualCostSust]);
    rec.cost = inv !== undefined ? Math.round(Math.abs(inv)) : (impl !== undefined ? Math.round(impl) : undefined);
    rec.sustain = {
      investment: inv !== undefined ? Math.round(Math.abs(inv)) : impl,
      investmentPeriod: period,
      implementationCost: impl !== undefined ? Math.round(impl * 100) / 100 : undefined,
      annualCost: annual !== undefined ? Math.round(annual * 100) / 100 : undefined,
    };
  }
  dataWithLever.push(rec);
}

import { writeFileSync } from 'fs';
writeFileSync(join(projectRoot, 'decisions_from_excel_export.json'), JSON.stringify(dataWithLever, null, 2));
console.log('\nWrote decisions_from_excel_export.json with', dataWithLever.length, 'rows');
