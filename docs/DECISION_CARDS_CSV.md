# Decision Cards CSV – Single Source of Truth

Decision card content (names, briefs, detail, and metrics) is driven by a single CSV file. Both the **demo** (frontend) and the **live game** (backend) read from the JSON generated from this CSV.

## How to update decision cards

1. **Replace the CSV**  
   Put your updated export at `decision_cards_export.csv` in the project root, or pass its path when running the script (see below).

2. **Run the import script** (from project root):
   ```bash
   node scripts/import-decisions-from-csv.mjs
   ```
   To use a specific CSV file (e.g. on your Desktop):
   ```bash
   node scripts/import-decisions-from-csv.mjs "C:\Users\You\Desktop\decisions.csv"
   ```
   You can also set `DECISIONS_CSV_PATH` to your file path.
   This writes `public/decisions.json`, which the frontend (demo) and backend (live) both use.

3. **Use the app**  
   Restart the backend if it’s running, and refresh the frontend. Demo and live game will show the exact data from your CSV.

Alternatively, provide a screenshot and we can align the CSV or generated JSON to match.

## CSV format

- **Row 1**: Optional header. If column B (Decision#) of the first row is a number, the first row is treated as data; otherwise it’s skipped as header.
- **One row per decision.** Columns (0-based index):

| Col | Letter | Content |
|-----|--------|--------|
| 0 | A | Round (1–5) |
| 1 | B | Decision# (1–75) |
| 2 | C | Lever: Grow, Optimize, or Sustain |
| 3 | D | Name (card title) |
| 4 | E | Brief (one sentence, front of card) |
| 5 | F | Detail (full narrative, back of card) |
| 6–11 | G–L | **Grow**: Total inv, Period (yrs), In-year, Revenue 1yr, 5yr growth %, EBIT margin % |
| 12–16 | M–Q | **Optimize**: Total, Period, In-year, Impl cost, Annual cost |
| 17–21 | R–V | **Sustain**: Total, Period, In-year, Impl cost, Annual cost |

- Use **quoted fields** if a value contains commas (e.g. `"Brief text, with comma"`).
- Total investment by category: column G (Grow), column M (Optimize), column R (Sustain).

## Output

- **`public/decisions.json`** – Full array of decision objects (Decision shape). Consumed by:
  - Frontend demo: `GET /decisions.json`
  - Backend: read at startup for `getDecisionsForRound()` and `getDecisionById()`.
