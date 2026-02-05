/**
 * Apply decisions_from_excel_export.json to backend/config/decisions.ts
 * Updates name, brief, narrative (detail), cost, introducedYear, and growMetrics/optimizeMetrics/sustainMetrics by decisionNumber.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const jsonPath = join(root, 'decisions_from_excel_export.json');
const tsPath = join(root, 'backend', 'config', 'decisions.ts');
const summaryPath = join(__dirname, 'last-import-summary.txt');

/** Minimum expected decision records to apply (game expects at least 75 cards). */
const EXPECTED_MIN_RECORDS = 75;

const excel = JSON.parse(readFileSync(jsonPath, 'utf8'));
console.log('Loaded', excel.length, 'records from decisions_from_excel_export.json.');
const byNum = {};
for (const row of excel) byNum[row.decisionNumber] = row;

let content = readFileSync(tsPath, 'utf8');

function escapeTsStr(s) {
  if (s == null || s === '') return "''";
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
}

function formatGrowMetrics(g) {
  if (!g) return null;
  const a = g.investmentsTotal, b = g.revenue1Year, c = g.fiveYearGrowth, d = g.investmentPeriod, e = g.ebitMargin, inYr = g.inYearInvestment;
  if (a === undefined && b === undefined) return null;
  const inYrLine = inYr !== undefined && inYr !== null ? `\n      inYearInvestment: ${inYr},` : '';
  return `growMetrics: {
      revenue1Year: ${b ?? 0},
      fiveYearGrowth: ${c ?? 0},
      investmentsTotal: ${a ?? 0},
      investmentPeriod: ${d ?? 0},${inYrLine}
      ebitMargin: ${e ?? 0},
    }`;
}

function formatOptimizeMetrics(o) {
  if (!o) return null;
  const a = o.implementationCost, b = o.investment, c = o.investmentPeriod, d = o.annualCost, inYr = o.inYearInvestment;
  const inYrLine = inYr !== undefined && inYr !== null ? `\n      inYearInvestment: ${inYr},` : '';
  return `optimizeMetrics: {
      implementationCost: ${a ?? 0},
      investment: ${b ?? 0},
      investmentPeriod: ${c ?? 0},${inYrLine}
      annualCost: ${d ?? 0},
    }`;
}

function formatSustainMetrics(s) {
  if (!s) return null;
  const a = s.implementationCost, b = s.investment, c = s.investmentPeriod, d = s.annualCost, inYr = s.inYearInvestment;
  const inYrLine = inYr !== undefined && inYr !== null ? `\n      inYearInvestment: ${inYr},` : '';
  return `sustainMetrics: {
      implementationCost: ${a ?? 0},
      investment: ${b ?? 0},
      investmentPeriod: ${c ?? 0},${inYrLine}
      annualCost: ${d ?? 0},
    }`;
}

// Match each decision block: id, decisionNumber, ... name, optional brief, narrative, cost, ... introducedYear, ... metrics
// String content allows \' via (?:[^'\\]|\\.)*
const decisionBlockRegex = /\{\s*\n\s*id:\s*'([^']+)',\s*\n\s*decisionNumber:\s*(\d+),[\s\S]*?name:\s*'(?:[^'\\]|\\.)*',\s*\n(?:\s*brief:\s*'(?:[^'\\]|\\.)*',\s*\n)?\s*narrative:\s*'(?:[^'\\]|\\.)*',\s*\n\s*cost:\s*[\d.]+,[\s\S]*?introducedYear:\s*(\d+),[\s\S]*?(growMetrics|optimizeMetrics|sustainMetrics):\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\},/g;

let match;
const replacements = [];
while ((match = decisionBlockRegex.exec(content)) !== null) {
  const fullBlock = match[0];
  const num = parseInt(match[2], 10);
  const data = byNum[num];
  if (!data) continue;
  const name = escapeTsStr(data.name);
  const narrative = escapeTsStr(data.detail);
  const cost = data.cost ?? 0;
  const introducedYear = data.introducedYear ?? 1;
  let newMetrics = '';
  if (data.grow) newMetrics = formatGrowMetrics(data.grow);
  else if (data.optimize) newMetrics = formatOptimizeMetrics(data.optimize);
  else if (data.sustain) newMetrics = formatSustainMetrics(data.sustain);
  if (!newMetrics) continue;
  // Replace name, optional brief, narrative, cost (strings may contain \')
  const nameNarrCostRegex = /name:\s*'(?:[^'\\]|\\.)*',\s*\n(?:\s*brief:\s*'(?:[^'\\]|\\.)*',\s*\n)?\s*narrative:\s*'(?:[^'\\]|\\.)*',\s*\n\s*cost:\s*[\d.]+,/;
  const nameNarrCostRepl = data.brief
    ? `name: ${name},\n    brief: ${escapeTsStr(data.brief)},\n    narrative: ${narrative},\n    cost: ${cost},`
    : `name: ${name},\n    narrative: ${narrative},\n    cost: ${cost},`;
  const metricsRegex = /(growMetrics|optimizeMetrics|sustainMetrics):\s*\{[^}]*(?:\{[^}]*\}[^}])*\},/;
  const introducedYearRegex = /introducedYear:\s*\d+,/;
  let newBlock = fullBlock.replace(nameNarrCostRegex, nameNarrCostRepl);
  newBlock = newBlock.replace(metricsRegex, newMetrics + ',');
  newBlock = newBlock.replace(introducedYearRegex, `introducedYear: ${introducedYear},`);
  replacements.push({ num, old: fullBlock, new: newBlock });
}

// Apply replacements (reverse order so positions don't shift)
replacements.sort((a, b) => b.old.length - a.old.length);
for (const { old, new: newBlock } of replacements) {
  if (content.includes(old)) {
    content = content.replace(old, newBlock);
  }
}

writeFileSync(tsPath, content);
console.log('Matched', replacements.length, 'decision blocks in backend/config/decisions.ts.');

// Validation: expect at least 75 applied (or as many as we have records for)
const expectedMin = Math.min(EXPECTED_MIN_RECORDS, excel.length);
const applyValid = replacements.length >= expectedMin;
const applyValidationStatus = applyValid ? 'PASS' : 'FAIL (missing chunks)';
console.log(
  'Applied',
  replacements.length,
  'updates; expected at least',
  expectedMin,
  '. Validation:',
  applyValidationStatus
);
if (!applyValid) {
  process.exit(1);
}

// Audit trail: one-line summary
const summaryLine = `${new Date().toISOString()} | records: ${excel.length} | replacements: ${replacements.length} | validation: ${applyValidationStatus}\n`;
writeFileSync(summaryPath, summaryLine);
