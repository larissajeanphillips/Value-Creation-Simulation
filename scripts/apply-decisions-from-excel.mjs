/**
 * Apply decisions_from_excel_export.json to backend/config/decisions.ts
 * Updates name, narrative, cost, and growMetrics/optimizeMetrics/sustainMetrics for each decision by decisionNumber.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const jsonPath = join(root, 'decisions_from_excel_export.json');
const tsPath = join(root, 'backend', 'config', 'decisions.ts');

const excel = JSON.parse(readFileSync(jsonPath, 'utf8'));
const byNum = {};
for (const row of excel) byNum[row.decisionNumber] = row;

let content = readFileSync(tsPath, 'utf8');

function escapeTsStr(s) {
  if (s == null) return "''";
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
}

function formatGrowMetrics(g) {
  if (!g) return null;
  const a = g.investmentsTotal, b = g.revenue1Year, c = g.fiveYearGrowth, d = g.investmentPeriod, e = g.ebitMargin;
  if (a === undefined && b === undefined) return null;
  return `growMetrics: {
      revenue1Year: ${b ?? 0},
      fiveYearGrowth: ${c ?? 0},
      investmentsTotal: ${a ?? 0},
      investmentPeriod: ${d ?? 0},
      ebitMargin: ${e ?? 0},
    }`;
}

function formatOptimizeMetrics(o) {
  if (!o) return null;
  const a = o.implementationCost, b = o.investment, c = o.investmentPeriod, d = o.annualCost;
  return `optimizeMetrics: {
      implementationCost: ${a ?? 0},
      investment: ${b ?? 0},
      investmentPeriod: ${c ?? 0},
      annualCost: ${d ?? 0},
    }`;
}

function formatSustainMetrics(s) {
  if (!s) return null;
  const a = s.implementationCost, b = s.investment, c = s.investmentPeriod, d = s.annualCost;
  return `sustainMetrics: {
      implementationCost: ${a ?? 0},
      investment: ${b ?? 0},
      investmentPeriod: ${c ?? 0},
      annualCost: ${d ?? 0},
    }`;
}

// Match each decision block: from "  {" through "  }," (top-level decision object)
// We match by decisionNumber and replace name, narrative, cost, and the metrics block.
const decisionBlockRegex = /\{\s*\n\s*id:\s*'([^']+)',\s*\n\s*decisionNumber:\s*(\d+),[\s\S]*?name:\s*'[^']*(?:''[^']*)*',\s*\n\s*narrative:\s*'[^']*(?:''[^']*)*',\s*\n\s*cost:\s*[\d.]+,[\s\S]*?(growMetrics|optimizeMetrics|sustainMetrics):\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\},/g;

let match;
const replacements = [];
while ((match = decisionBlockRegex.exec(content)) !== null) {
  const fullBlock = match[0];
  const id = match[1];
  const num = parseInt(match[2], 10);
  const data = byNum[num];
  if (!data) continue;
  const name = escapeTsStr(data.name);
  const narrative = escapeTsStr(data.detail);
  const cost = data.cost ?? 0;
  let newMetrics = '';
  if (data.grow) newMetrics = formatGrowMetrics(data.grow);
  else if (data.optimize) newMetrics = formatOptimizeMetrics(data.optimize);
  else if (data.sustain) newMetrics = formatSustainMetrics(data.sustain);
  if (!newMetrics) continue;
  // Replace name, narrative, cost, and metrics block within this decision
  const nameNarrCostRegex = /name:\s*'[^']*(?:''[^']*)*',\s*\n\s*narrative:\s*'[^']*(?:''[^']*)*',\s*\n\s*cost:\s*[\d.]+,/;
  const metricsRegex = /(growMetrics|optimizeMetrics|sustainMetrics):\s*\{[^}]*(?:\{[^}]*\}[^}])*\},/;
  let newBlock = fullBlock.replace(nameNarrCostRegex, `name: ${name},\n    narrative: ${narrative},\n    cost: ${cost},`);
  newBlock = newBlock.replace(metricsRegex, newMetrics + ',');
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
console.log('Applied', replacements.length, 'decision updates to', tsPath);
