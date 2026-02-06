/**
 * Import decision cards from CSV and write full Decision[] to public/decisions.json.
 * Single source of truth: both frontend (demo) and backend (live) use this file.
 *
 * Strict column mapping only — no calculations for display. Map CSV columns directly:
 * A=Round, B=Decision#, C=Lever, D=Name, E=Brief, F=Detail; G–L Grow (front G,H,I; back J,K,L);
 * M–Q Optimize (front M,N,O; back P,Q); R–V Sustain (front R,S,T; back U,V). In-year from CSV column.
 *
 * Run from project root: node scripts/import-decisions-from-csv.mjs [path/to/decisions.csv]
 * Or set DECISIONS_CSV_PATH to override default decision_cards_export.csv.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const csvPath = process.argv[2] || process.env.DECISIONS_CSV_PATH || join(root, 'decision_cards_export.csv');
const outDir = join(root, 'public');
const outPath = join(outDir, 'decisions.json');

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
const COL = {
  round: 0,
  decisionNumber: 1,
  lever: 2,
  name: 3,
  brief: 4,
  detail: 5,
  growTotal: 6,
  growPeriod: 7,
  growInYear: 8,
  growRevenue1Year: 9,
  growFiveYearGrowth: 10,
  growEbitMargin: 11,
  optTotal: 12,
  optPeriod: 13,
  optInYear: 14,
  optImplCost: 15,
  optAnnualCost: 16,
  sustTotal: 17,
  sustPeriod: 18,
  sustInYear: 19,
  sustImplCost: 20,
  sustAnnualCost: 21,
};

/** Parse number; strip commas, treat " - " / " -   " as empty, use absolute value for negatives (investments). */
function toNum(v) {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim().replace(/,/g, '');
  if (s === '' || /^[\s\-]+$/.test(s)) return undefined;
  const n = Number(s);
  if (Number.isNaN(n)) return undefined;
  return n < 0 ? Math.abs(n) : n;
}

function toPercent(v) {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim().replace(/%/g, '').replace(/,/g, '');
  if (s === '' || /^[\s\-]+$/.test(s)) return undefined;
  const n = Number(s);
  if (Number.isNaN(n)) return undefined;
  if (n > 0 && n <= 1) return Math.round(n * 1000) / 10;
  return Math.round(n * 10) / 10;
}

function cleanStr(v) {
  if (v === undefined || v === null) return '';
  return String(v).trim();
}

// Detect format: header row has "Round" / "Lever" / "Name (front" (legacy with header) vs numeric # (legacy no header) vs "ID,Category" (alternate)
const headerRow = rows[0] || [];
const firstCol = String(headerRow[0] || '').trim();
const secondCol = String(headerRow[1] || '').trim();
const thirdCol = String(headerRow[2] || '').trim();
const hasLegacyHeader = firstCol === 'Round' || thirdCol === 'Lever' || (headerRow[3] && String(headerRow[3]).includes('Name'));
const hasIdCategoryHeader = firstCol === 'ID' && secondCol === 'Category';
const dataRows = hasIdCategoryHeader ? rows.slice(1) : hasLegacyHeader ? rows.slice(1) : (toNum(headerRow[COL.decisionNumber]) !== undefined ? rows : rows.slice(1));

const COL_ALT = {
  id: 0,
  category: 1,
  subcategory: 2,
  name: 3,
  narrative: 4,
  cost: 5,
  impactMagnitude: 6,
  roundIntroduced: 7,
  type: 8,
  guidingPrinciple: 9,
  durationYears: 10,
  rampUpYears: 11,
  oneTimeBenefit: 12,
  revenueImpact: 13,
  recurringBenefit: 17,
};

const GUIDING_PRINCIPLES = {
  grow: '1. Grow profitably',
  optimize: '2. Optimize the base',
  sustain: '3. Stay flexible',
};

function parsePct(v) {
  if (v === undefined || v === null || v === '') return undefined;
  const s = String(v).trim().replace(/%/g, '');
  const n = Number(s);
  if (Number.isNaN(n)) return undefined;
  return n <= 1 && n > 0 ? n : n / 100;
}

const decisions = [];

for (let r = 0; r < dataRows.length; r++) {
  const row = dataRows[r];
  if (hasIdCategoryHeader) {
    const id = cleanStr(row[COL_ALT.id]);
    if (!id) continue;
    const catRaw = cleanStr(row[COL_ALT.category]) || 'Grow';
    const category = catRaw.toLowerCase().startsWith('grow') ? 'grow' : catRaw.toLowerCase().startsWith('optim') ? 'optimize' : 'sustain';
    const name = cleanStr(row[COL_ALT.name]) || id;
    const narrative = cleanStr(row[COL_ALT.narrative]) || name;
    const brief = narrative.split('.')[0] ? `${narrative.split('.')[0].trim()}.` : undefined;
    const cost = Math.round(Math.abs(toNum(row[COL_ALT.cost]) || 0));
    const impactMag = Math.min(5, Math.max(1, Math.round(toNum(row[COL_ALT.impactMagnitude]) || 3)));
    const introducedYear = Math.max(1, Math.min(5, Math.round(toNum(row[COL_ALT.roundIntroduced]) || 1)));
    const type = (cleanStr(row[COL_ALT.type]) || 'organic').toLowerCase().startsWith('inorg') ? 'inorganic' : 'organic';
    const guidingPrinciple = cleanStr(row[COL_ALT.guidingPrinciple]) || GUIDING_PRINCIPLES[category];
    const dur = toNum(row[COL_ALT.durationYears]);
    const durationYears = dur !== undefined ? (Math.round(dur) === 2 ? 2 : 1) : 1;
    const ramp = toNum(row[COL_ALT.rampUpYears]);
    const rampUpYears = ramp !== undefined ? Math.max(1, Math.min(3, Math.round(ramp))) : durationYears;
    const isOneTimeBenefit = String(row[COL_ALT.oneTimeBenefit] || '').toUpperCase() === 'TRUE';
    const revenueImpact = parsePct(row[COL_ALT.revenueImpact]);
    const recurringBenefit = toNum(row[COL_ALT.recurringBenefit]);
    const decisionNumber = r + 1;
    const subcategory = cleanStr(row[COL_ALT.subcategory]) || catRaw;
    let growMetrics;
    let optimizeMetrics;
    let sustainMetrics;
    if (category === 'grow') {
      const period = durationYears;
      growMetrics = {
        investmentsTotal: cost,
        investmentPeriod: period,
        inYearInvestment: period > 0 ? Math.round((cost / period) * 100) / 100 : cost,
        revenue1Year: recurringBenefit != null ? Math.round(recurringBenefit * 10) : 0,
        fiveYearGrowth: revenueImpact != null ? Math.round(revenueImpact * 1000) / 10 : 0,
        ebitMargin: 10,
      };
    } else if (category === 'optimize') {
      optimizeMetrics = {
        implementationCost: 0,
        investment: cost,
        investmentPeriod: durationYears,
        inYearInvestment: durationYears > 0 ? Math.round((cost / durationYears) * 100) / 100 : cost,
        annualCost: recurringBenefit ?? 0,
      };
    } else {
      sustainMetrics = {
        implementationCost: 0,
        investment: cost,
        investmentPeriod: durationYears,
        inYearInvestment: durationYears > 0 ? Math.round((cost / durationYears) * 100) / 100 : cost,
        annualCost: recurringBenefit ?? 0,
      };
    }
    decisions.push({
      id,
      decisionNumber,
      category,
      subcategory,
      name,
      ...(brief ? { brief } : {}),
      narrative,
      cost,
      impactMagnitude: impactMag,
      introducedYear,
      type,
      guidingPrinciple,
      durationYears,
      rampUpYears,
      isOneTimeBenefit,
      ...(revenueImpact != null ? { revenueImpact } : {}),
      ...(recurringBenefit != null ? { recurringBenefit } : {}),
      ...(growMetrics ? { growMetrics } : {}),
      ...(optimizeMetrics ? { optimizeMetrics } : {}),
      ...(sustainMetrics ? { sustainMetrics } : {}),
    });
    continue;
  }

  const num = toNum(row[COL.decisionNumber]);
  if (num === undefined) continue;

  let lever = cleanStr(row[COL.lever] || '');
  if (!lever) {
    if (num <= 25) lever = 'Grow';
    else if (num <= 50) lever = 'Optimize';
    else lever = 'Sustain';
  }
  const category = lever.toLowerCase().includes('grow') ? 'grow' : lever.toLowerCase().includes('optim') ? 'optimize' : 'sustain';
  const round = toNum(row[COL.round]);
  const introducedYear = Math.max(1, Math.min(5, round !== undefined ? Math.round(round) : (num <= 15 ? 1 : num <= 30 ? 2 : num <= 45 ? 3 : num <= 60 ? 4 : 5)));

  const id = `${category}-${introducedYear}-${num}`;
  const name = cleanStr(row[COL.name]) || `Decision ${num}`;
  const brief = cleanStr(row[COL.brief]);
  const narrative = cleanStr(row[COL.detail]) || name;
  const subcategory = lever;

  let cost = 0;
  let durationYears = 1;
  let rampUpYears = 1;
  let revenueImpact;
  let recurringBenefit;
  let growMetrics;
  let optimizeMetrics;
  let sustainMetrics;

  if (category === 'grow') {
    const total = toNum(row[COL.growTotal]);
    const period = toNum(row[COL.growPeriod]);
    const inYear = toNum(row[COL.growInYear]);
    const rev1 = toNum(row[COL.growRevenue1Year]);
    const growthPct = toPercent(row[COL.growFiveYearGrowth]);
    const ebitPct = toPercent(row[COL.growEbitMargin]);
    cost = total !== undefined ? Math.round(total) : 0;
    durationYears = period !== undefined ? Math.round(period) : 1;
    rampUpYears = durationYears;
    revenueImpact = growthPct != null ? growthPct / 100 : undefined;
    recurringBenefit = rev1 ?? undefined;
    growMetrics = {
      investmentsTotal: total !== undefined ? Math.round(total) : undefined,
      investmentPeriod: period !== undefined ? Math.round(period) : undefined,
      inYearInvestment: inYear !== undefined ? Math.round(inYear * 100) / 100 : undefined,
      revenue1Year: rev1 ?? undefined,
      fiveYearGrowth: growthPct ?? undefined,
      ebitMargin: ebitPct ?? undefined,
    };
  } else if (category === 'optimize') {
    const total = toNum(row[COL.optTotal]);
    const period = toNum(row[COL.optPeriod]);
    const inYear = toNum(row[COL.optInYear]);
    const impl = toNum(row[COL.optImplCost]);
    const annual = toNum(row[COL.optAnnualCost]);
    cost = total !== undefined ? Math.round(total) : (impl !== undefined ? Math.round(impl) : 0);
    durationYears = period !== undefined ? Math.round(period) : 1;
    rampUpYears = durationYears;
    recurringBenefit = annual !== undefined ? Math.round(annual * 100) / 100 : undefined;
    optimizeMetrics = {
      implementationCost: impl !== undefined ? Math.round(impl * 100) / 100 : undefined,
      investment: total !== undefined ? Math.round(total) : undefined,
      investmentPeriod: period !== undefined ? Math.round(period) : undefined,
      inYearInvestment: inYear !== undefined ? Math.round(inYear * 100) / 100 : undefined,
      annualCost: annual !== undefined ? Math.round(annual * 100) / 100 : undefined,
    };
  } else {
    const total = toNum(row[COL.sustTotal]);
    const period = toNum(row[COL.sustPeriod]);
    const inYear = toNum(row[COL.sustInYear]);
    const impl = toNum(row[COL.sustImplCost]);
    const annual = toNum(row[COL.sustAnnualCost]);
    cost = total !== undefined ? Math.round(total) : (impl !== undefined ? Math.round(impl) : 0);
    durationYears = period !== undefined ? Math.round(period) : 1;
    rampUpYears = durationYears;
    recurringBenefit = annual !== undefined ? Math.round(annual * 100) / 100 : undefined;
    sustainMetrics = {
      implementationCost: impl !== undefined ? Math.round(impl * 100) / 100 : undefined,
      investment: total !== undefined ? Math.round(total) : undefined,
      investmentPeriod: period !== undefined ? Math.round(period) : undefined,
      inYearInvestment: inYear !== undefined ? Math.round(inYear * 100) / 100 : undefined,
      annualCost: annual !== undefined ? Math.round(annual * 100) / 100 : undefined,
    };
  }

  decisions.push({
    id,
    decisionNumber: num,
    category,
    subcategory,
    name,
    ...(brief ? { brief } : {}),
    narrative,
    cost,
    impactMagnitude: 3,
    introducedYear,
    type: 'organic',
    guidingPrinciple: GUIDING_PRINCIPLES[category],
    durationYears,
    rampUpYears,
    isOneTimeBenefit: false,
    ...(revenueImpact != null ? { revenueImpact } : {}),
    ...(recurringBenefit != null ? { recurringBenefit } : {}),
    ...(growMetrics ? { growMetrics } : {}),
    ...(optimizeMetrics ? { optimizeMetrics } : {}),
    ...(sustainMetrics ? { sustainMetrics } : {}),
  });
}

if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}
writeFileSync(outPath, JSON.stringify(decisions, null, 2), 'utf8');
console.log('Wrote', decisions.length, 'decisions to', outPath);
console.log('Restart backend and refresh frontend to use the new data.');
