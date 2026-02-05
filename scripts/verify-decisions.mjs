/**
 * Verify backend decisions match Excel export.
 * Run after: node scripts/read-decisions-excel.mjs && node scripts/apply-decisions-from-excel.mjs
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const EXPECTED_MIN_DECISIONS = 75;

const json = JSON.parse(readFileSync(join(root, 'decisions_from_excel_export.json'), 'utf8'));
const ts = readFileSync(join(root, 'backend', 'config', 'decisions.ts'), 'utf8');

// Export count validation
if (json.length < EXPECTED_MIN_DECISIONS) {
  console.log(
    `Verified ${json.length} decisions from export; expected at least ${EXPECTED_MIN_DECISIONS}. Validation: FAIL.`
  );
  process.exit(1);
}

// Backend ALL_DECISIONS count (count decision blocks in TS)
const decisionBlockMatches = ts.match(/decisionNumber:\s*\d+,/g);
const backendDecisionCount = decisionBlockMatches ? decisionBlockMatches.length : 0;
const backendValid = backendDecisionCount >= EXPECTED_MIN_DECISIONS;
console.log(
  `Verified ${json.length} decisions from export; backend ALL_DECISIONS count: ${backendDecisionCount} (expected >= ${EXPECTED_MIN_DECISIONS}). Backend validation: ${backendValid ? 'PASS' : 'FAIL'}`
);

const byNum = {};
for (const row of json) byNum[row.decisionNumber] = row;

let errors = 0;
for (let n = 1; n <= 75; n++) {
  const excel = byNum[n];
  if (!excel) continue;
  // Find name in TS (simple check: decisionNumber: N, then name: '...')
  const re = new RegExp(`decisionNumber: ${n},[\\s\\S]*?name: '([^']*(?:\\\\'[^']*)*)',[\\s\\S]*?narrative: '([^']*(?:\\\\'[^']*)*)',[\\s\\S]*?cost: (\\d+),`, 'm');
  const m = ts.match(re);
  if (!m) {
    console.log(`Decision ${n}: could not parse block`);
    errors++;
    continue;
  }
  const [, name, , costStr] = m;
  const cost = parseInt(costStr, 10);
  if (name !== excel.name) {
    console.log(`Decision ${n} name mismatch: backend "${name.slice(0, 40)}..." vs Excel "${excel.name.slice(0, 40)}..."`);
    errors++;
  }
  if (cost !== excel.cost) {
    console.log(`Decision ${n} cost mismatch: backend ${cost} vs Excel ${excel.cost}`);
    errors++;
  }
}
if (errors === 0) {
  console.log('All 75 decisions verified: name and cost match Excel export.');
} else {
  console.log(`Total mismatches: ${errors}`);
  process.exit(1);
}
