/**
 * SimplifiedFinancialsModal Component
 * 
 * Displays professional financial statements after each round.
 * Uses Magna International's actual 2023 & 2024 financials as baseline.
 * Formatted to match consolidated financial statement style.
 */

import React, { useMemo, useState } from 'react';
import { X, FileText, Wallet, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGameStore, useCurrentTeam } from '@/stores/gameStore';

// =============================================================================
// Types
// =============================================================================

interface SimplifiedFinancialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

type StatementTab = 'income' | 'balance' | 'cashflow';

interface FinancialLineItem {
  label: string;
  note?: string;
  values: (number | string | null)[];
  isSectionHeader?: boolean;
  isSubHeader?: boolean;
  isBold?: boolean;
  isTotal?: boolean;
  isSubtotal?: boolean;
  indent?: number;
  format?: 'currency' | 'currencyDollar' | 'percent' | 'shares' | 'eps';
  isBlankRow?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;
}

// =============================================================================
// Actual Magna 2023 Financials
// =============================================================================

const BASELINE_2023 = {
  // Income Statement
  sales: 42797,
  cogs: 37185,
  sga: 2050,
  depreciation: 1436,
  amortization: 88,
  interestExpense: 156,
  equityIncome: -112,
  otherExpense: 388,
  incomeBeforeTaxes: 1606,
  incomeTaxes: 320,
  netIncome: 1286,
  netIncomeNCI: -73,
  netIncomeMagna: 1213,
  epsBasic: 4.24,
  epsDiluted: 4.23,
  sharesBasic: 286.2,
  sharesDiluted: 286.6,
  
  // Balance Sheet
  cash: 1198,
  accountsReceivable: 7881,
  inventories: 4606,
  prepaidExpenses: 352,
  currentAssets: 14037,
  investments: 1273,
  fixedAssets: 9618,
  operatingLeaseAssets: 1744,
  intangibleAssets: 876,
  goodwill: 2767,
  otherAssets: 1319,
  deferredTaxAssets: 621,
  totalAssets: 32255,
  
  shortTermBorrowing: 511,
  accountsPayable: 7842,
  otherAccruedLiabilities: 2626,
  accruedSalaries: 912,
  incomeTaxesPayable: 125,
  longTermDebtCurrent: 819,
  operatingLeaseCurrent: 399,
  currentLiabilities: 13234,
  longTermDebt: 4175,
  operatingLeaseLiabilities: 1319,
  employeeBenefitLiabilities: 591,
  otherLongTermLiabilities: 475,
  deferredTaxLiabilities: 184,
  totalLiabilities: 19978,
  
  commonShares: 3354,
  contributedSurplus: 125,
  retainedEarnings: 9303,
  aocl: -898,
  shareholdersEquityMagna: 11884,
  nci: 393,
  totalEquity: 12277,
  
  // Cash Flow
  cashFromOperations: 3149,
  fixedAssetAdditions: -2500,
  cashUsedInvesting: -4503,
  dividendsPaid: -522,
  cashFromFinancing: 1337,
};

// =============================================================================
// Actual Magna 2024 Financials
// =============================================================================

const BASELINE_2024 = {
  // Income Statement
  sales: 42836,
  cogs: 37037,
  sga: 2061,
  depreciation: 1510,
  amortization: 112,
  interestExpense: 211,
  equityIncome: -101,
  otherExpense: 464,
  incomeBeforeTaxes: 1542,
  incomeTaxes: 446,
  netIncome: 1096,
  netIncomeNCI: -87,
  netIncomeMagna: 1009,
  epsBasic: 3.52,
  epsDiluted: 3.52,
  sharesBasic: 286.8,
  sharesDiluted: 286.9,
  
  // Balance Sheet
  cash: 1247,
  accountsReceivable: 7376,
  inventories: 4151,
  prepaidExpenses: 344,
  currentAssets: 13118,
  investments: 1045,
  fixedAssets: 9584,
  operatingLeaseAssets: 1941,
  intangibleAssets: 738,
  goodwill: 2674,
  otherAssets: 1120,
  deferredTaxAssets: 819,
  totalAssets: 31039,
  
  shortTermBorrowing: 271,
  accountsPayable: 7194,
  otherAccruedLiabilities: 2572,
  accruedSalaries: 867,
  incomeTaxesPayable: 192,
  longTermDebtCurrent: 708,
  operatingLeaseCurrent: 293,
  currentLiabilities: 12097,
  longTermDebt: 4134,
  operatingLeaseLiabilities: 1662,
  employeeBenefitLiabilities: 533,
  otherLongTermLiabilities: 396,
  deferredTaxLiabilities: 277,
  totalLiabilities: 19099,
  
  commonShares: 3359,
  contributedSurplus: 149,
  retainedEarnings: 9598,
  aocl: -1584,
  shareholdersEquityMagna: 11522,
  nci: 418,
  totalEquity: 11940,
  
  // Cash Flow
  cashFromOperations: 3634,
  fixedAssetAdditions: -2178,
  cashUsedInvesting: -2592,
  dividendsPaid: -539,
  cashFromFinancing: -999,
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Formats number with parentheses for negatives, no dollar sign
 */
function formatAmount(value: number | null): string {
  if (value === null || value === undefined || isNaN(value)) return '';
  if (value === 0) return '—';
  
  const absValue = Math.abs(value).toLocaleString('en-US', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  });
  
  return value < 0 ? `(${absValue})` : absValue;
}

/**
 * Formats number with dollar sign prefix
 */
function formatDollarAmount(value: number | null): string {
  if (value === null || value === undefined || isNaN(value)) return '';
  if (value === 0) return '$ —';
  
  const absValue = Math.abs(value).toLocaleString('en-US', { 
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  });
  
  return value < 0 ? `$ (${absValue})` : `$ ${absValue}`;
}

/**
 * Formats EPS values
 */
function formatEPS(value: number | null): string {
  if (value === null || value === undefined || isNaN(value)) return '';
  return `$ ${value.toFixed(2)}`;
}

/**
 * Formats share counts
 */
function formatShares(value: number | null): string {
  if (value === null || value === undefined || isNaN(value)) return '';
  return value.toFixed(1);
}

/**
 * Gets formatted value based on format type
 */
function getFormattedValue(value: number | string | null, format?: string): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  
  switch (format) {
    case 'currencyDollar':
      return formatDollarAmount(value);
    case 'eps':
      return formatEPS(value);
    case 'shares':
      return formatShares(value);
    case 'currency':
    default:
      return formatAmount(value);
  }
}

// =============================================================================
// Main Component
// =============================================================================

export const SimplifiedFinancialsModal: React.FC<SimplifiedFinancialsModalProps> = ({
  isOpen,
  onClose,
  className,
}) => {
  const team = useCurrentTeam();
  const gameState = useGameStore((s) => s.gameState);
  const roundResults = useGameStore((s) => s.lastRoundResults);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<StatementTab>('income');
  
  const currentRound = roundResults?.round || gameState?.currentRound || 1;
  const currentYear = 2024 + currentRound;
  
  // Build Income Statement data (3 columns: 2023, 2024, Current)
  const incomeStatementData = useMemo((): FinancialLineItem[] => {
    if (!team) return [];
    
    const metrics = team.metrics;
    
    const currentSales = metrics.revenue;
    const currentCOGS = Math.abs(metrics.cogs);
    const currentSGA = Math.abs(metrics.sga);
    const currentDepreciation = Math.abs(metrics.depreciation);
    const currentAmortization = Math.abs(metrics.amortization);
    const currentEBIT = metrics.ebit;
    const currentTaxes = Math.abs(metrics.cashTaxes);
    const currentNetIncome = currentEBIT - currentTaxes;
    const currentEPS = currentNetIncome / BASELINE_2024.sharesBasic;
    
    return [
      { label: 'Sales', values: [BASELINE_2023.sales, BASELINE_2024.sales, currentSales], format: 'currencyDollar', isBold: true },
      { label: 'Costs and expenses', values: [null, null, null], isSubHeader: true },
      { label: 'Cost of goods sold', values: [BASELINE_2023.cogs, BASELINE_2024.cogs, currentCOGS], indent: 1 },
      { label: 'Selling, general and administrative', values: [BASELINE_2023.sga, BASELINE_2024.sga, currentSGA], indent: 1 },
      { label: 'Depreciation', values: [BASELINE_2023.depreciation, BASELINE_2024.depreciation, currentDepreciation], indent: 1 },
      { label: 'Amortization of acquired intangible assets', values: [BASELINE_2023.amortization, BASELINE_2024.amortization, currentAmortization], indent: 1 },
      { label: 'Interest expense, net', note: '16', values: [BASELINE_2023.interestExpense, BASELINE_2024.interestExpense, BASELINE_2024.interestExpense], indent: 1 },
      { label: 'Equity income', values: [BASELINE_2023.equityIncome, BASELINE_2024.equityIncome, BASELINE_2024.equityIncome], indent: 1 },
      { label: 'Other expense, net', note: '4', values: [BASELINE_2023.otherExpense, BASELINE_2024.otherExpense, 0], indent: 1 },
      { label: 'Income from operations before income taxes', values: [BASELINE_2023.incomeBeforeTaxes, BASELINE_2024.incomeBeforeTaxes, currentEBIT], isBold: true, borderTop: true },
      { label: 'Income taxes', note: '12', values: [BASELINE_2023.incomeTaxes, BASELINE_2024.incomeTaxes, currentTaxes], indent: 1 },
      { label: 'Net income', values: [BASELINE_2023.netIncome, BASELINE_2024.netIncome, currentNetIncome], isBold: true, borderTop: true },
      { label: 'Income attributable to non-controlling interests', values: [BASELINE_2023.netIncomeNCI, BASELINE_2024.netIncomeNCI, 0], indent: 1 },
      { label: 'Net income attributable to Magna International Inc.', values: [BASELINE_2023.netIncomeMagna, BASELINE_2024.netIncomeMagna, currentNetIncome], isBold: true, borderTop: true, format: 'currencyDollar' },
      { label: '', values: [null, null, null], isBlankRow: true },
      { label: 'Earnings per Common Share:', note: '5', values: [null, null, null], isSubHeader: true },
      { label: 'Basic', values: [BASELINE_2023.epsBasic, BASELINE_2024.epsBasic, currentEPS], indent: 1, format: 'eps' },
      { label: 'Diluted', values: [BASELINE_2023.epsDiluted, BASELINE_2024.epsDiluted, currentEPS], indent: 1, format: 'eps' },
      { label: '', values: [null, null, null], isBlankRow: true },
      { label: 'Weighted average number of Common Shares outstanding [in millions]:', note: '5', values: [null, null, null], isSubHeader: true },
      { label: 'Basic', values: [BASELINE_2023.sharesBasic, BASELINE_2024.sharesBasic, BASELINE_2024.sharesBasic], indent: 1, format: 'shares' },
      { label: 'Diluted', values: [BASELINE_2023.sharesDiluted, BASELINE_2024.sharesDiluted, BASELINE_2024.sharesDiluted], indent: 1, format: 'shares' },
    ];
  }, [team]);
  
  // Build Balance Sheet data (3 columns: 2023, 2024, Current)
  const balanceSheetData = useMemo((): FinancialLineItem[] => {
    if (!team) return [];
    
    const metrics = team.metrics;
    const currentCash = metrics.endingCash;
    const cashDiff = currentCash - BASELINE_2024.cash;
    
    return [
      { label: 'ASSETS', values: [null, null, null], isSectionHeader: true },
      { label: 'Current assets', values: [null, null, null], isSubHeader: true },
      { label: 'Cash and cash equivalents', note: '6', values: [BASELINE_2023.cash, BASELINE_2024.cash, currentCash], indent: 1, format: 'currencyDollar' },
      { label: 'Accounts receivable', values: [BASELINE_2023.accountsReceivable, BASELINE_2024.accountsReceivable, BASELINE_2024.accountsReceivable], indent: 1 },
      { label: 'Inventories', note: '8', values: [BASELINE_2023.inventories, BASELINE_2024.inventories, BASELINE_2024.inventories], indent: 1 },
      { label: 'Prepaid expenses and other', values: [BASELINE_2023.prepaidExpenses, BASELINE_2024.prepaidExpenses, BASELINE_2024.prepaidExpenses], indent: 1 },
      { label: '', values: [BASELINE_2023.currentAssets, BASELINE_2024.currentAssets, BASELINE_2024.currentAssets + cashDiff], isBold: true, borderTop: true },
      { label: 'Investments', note: '9', values: [BASELINE_2023.investments, BASELINE_2024.investments, BASELINE_2024.investments], indent: 1 },
      { label: 'Fixed assets, net', note: '10', values: [BASELINE_2023.fixedAssets, BASELINE_2024.fixedAssets, BASELINE_2024.fixedAssets], indent: 1 },
      { label: 'Operating lease right-of-use assets', note: '17', values: [BASELINE_2023.operatingLeaseAssets, BASELINE_2024.operatingLeaseAssets, BASELINE_2024.operatingLeaseAssets], indent: 1 },
      { label: 'Intangible assets, net', note: '13', values: [BASELINE_2023.intangibleAssets, BASELINE_2024.intangibleAssets, BASELINE_2024.intangibleAssets], indent: 1 },
      { label: 'Goodwill', note: '11', values: [BASELINE_2023.goodwill, BASELINE_2024.goodwill, BASELINE_2024.goodwill], indent: 1 },
      { label: 'Other assets', note: '14, 18', values: [BASELINE_2023.otherAssets, BASELINE_2024.otherAssets, BASELINE_2024.otherAssets], indent: 1 },
      { label: 'Deferred tax assets', note: '12', values: [BASELINE_2023.deferredTaxAssets, BASELINE_2024.deferredTaxAssets, BASELINE_2024.deferredTaxAssets], indent: 1 },
      { label: '', values: [BASELINE_2023.totalAssets, BASELINE_2024.totalAssets, BASELINE_2024.totalAssets + cashDiff], isBold: true, borderTop: true, format: 'currencyDollar' },
      { label: '', values: [null, null, null], isBlankRow: true },
      { label: 'LIABILITIES AND SHAREHOLDERS\' EQUITY', values: [null, null, null], isSectionHeader: true },
      { label: 'Current liabilities', values: [null, null, null], isSubHeader: true },
      { label: 'Short-term borrowing', values: [BASELINE_2023.shortTermBorrowing, BASELINE_2024.shortTermBorrowing, BASELINE_2024.shortTermBorrowing], indent: 1, format: 'currencyDollar' },
      { label: 'Accounts payable', values: [BASELINE_2023.accountsPayable, BASELINE_2024.accountsPayable, BASELINE_2024.accountsPayable], indent: 1 },
      { label: 'Other accrued liabilities', note: '15', values: [BASELINE_2023.otherAccruedLiabilities, BASELINE_2024.otherAccruedLiabilities, BASELINE_2024.otherAccruedLiabilities], indent: 1 },
      { label: 'Accrued salaries and wages', values: [BASELINE_2023.accruedSalaries, BASELINE_2024.accruedSalaries, BASELINE_2024.accruedSalaries], indent: 1 },
      { label: 'Income taxes payable', values: [BASELINE_2023.incomeTaxesPayable, BASELINE_2024.incomeTaxesPayable, BASELINE_2024.incomeTaxesPayable], indent: 1 },
      { label: 'Long-term debt due within one year', note: '16', values: [BASELINE_2023.longTermDebtCurrent, BASELINE_2024.longTermDebtCurrent, BASELINE_2024.longTermDebtCurrent], indent: 1 },
      { label: 'Current portion of operating lease liabilities', note: '17', values: [BASELINE_2023.operatingLeaseCurrent, BASELINE_2024.operatingLeaseCurrent, BASELINE_2024.operatingLeaseCurrent], indent: 1 },
      { label: '', values: [BASELINE_2023.currentLiabilities, BASELINE_2024.currentLiabilities, BASELINE_2024.currentLiabilities], isBold: true, borderTop: true },
      { label: 'Long-term debt', note: '16', values: [BASELINE_2023.longTermDebt, BASELINE_2024.longTermDebt, BASELINE_2024.longTermDebt], indent: 1 },
      { label: 'Operating lease liabilities', note: '17', values: [BASELINE_2023.operatingLeaseLiabilities, BASELINE_2024.operatingLeaseLiabilities, BASELINE_2024.operatingLeaseLiabilities], indent: 1 },
      { label: 'Long-term employee benefit liabilities', note: '18', values: [BASELINE_2023.employeeBenefitLiabilities, BASELINE_2024.employeeBenefitLiabilities, BASELINE_2024.employeeBenefitLiabilities], indent: 1 },
      { label: 'Other long-term liabilities', note: '19', values: [BASELINE_2023.otherLongTermLiabilities, BASELINE_2024.otherLongTermLiabilities, BASELINE_2024.otherLongTermLiabilities], indent: 1 },
      { label: 'Deferred tax liabilities', note: '12', values: [BASELINE_2023.deferredTaxLiabilities, BASELINE_2024.deferredTaxLiabilities, BASELINE_2024.deferredTaxLiabilities], indent: 1 },
      { label: '', values: [BASELINE_2023.totalLiabilities, BASELINE_2024.totalLiabilities, BASELINE_2024.totalLiabilities], isBold: true, borderTop: true },
      { label: '', values: [null, null, null], isBlankRow: true },
      { label: 'Shareholders\' equity', values: [null, null, null], isSubHeader: true },
      { label: 'Common Shares', note: '20', values: [BASELINE_2023.commonShares, BASELINE_2024.commonShares, BASELINE_2024.commonShares], indent: 1 },
      { label: 'Contributed surplus', values: [BASELINE_2023.contributedSurplus, BASELINE_2024.contributedSurplus, BASELINE_2024.contributedSurplus], indent: 1 },
      { label: 'Retained earnings', values: [BASELINE_2023.retainedEarnings, BASELINE_2024.retainedEarnings, BASELINE_2024.retainedEarnings + (metrics.operatingFCF - BASELINE_2024.cashFromOperations)], indent: 1 },
      { label: 'Accumulated other comprehensive loss', note: '21', values: [BASELINE_2023.aocl, BASELINE_2024.aocl, BASELINE_2024.aocl], indent: 1 },
      { label: '', values: [BASELINE_2023.shareholdersEquityMagna, BASELINE_2024.shareholdersEquityMagna, metrics.equityValue], isBold: true, borderTop: true },
      { label: 'Non-controlling interests', values: [BASELINE_2023.nci, BASELINE_2024.nci, BASELINE_2024.nci], indent: 1 },
      { label: '', values: [BASELINE_2023.totalEquity, BASELINE_2024.totalEquity, metrics.equityValue + BASELINE_2024.nci], isBold: true, borderTop: true },
      { label: '', values: [BASELINE_2023.totalAssets, BASELINE_2024.totalAssets, BASELINE_2024.totalAssets + cashDiff], isBold: true, format: 'currencyDollar' },
    ];
  }, [team]);
  
  // Build Cash Flow Statement data (3 columns: 2023, 2024, Current)
  const cashFlowData = useMemo((): FinancialLineItem[] => {
    if (!team) return [];
    
    const metrics = team.metrics;
    const currentNetIncome = metrics.ebit - Math.abs(metrics.cashTaxes);
    const currentNonCash = Math.abs(metrics.depreciation) + Math.abs(metrics.amortization);
    
    return [
      { label: 'OPERATING ACTIVITIES', values: [null, null, null], isSectionHeader: true },
      { label: 'Net income', values: [BASELINE_2023.netIncome, BASELINE_2024.netIncome, currentNetIncome], format: 'currencyDollar' },
      { label: 'Items not involving current cash flows', note: '6', values: [1642, 1857, currentNonCash], indent: 1 },
      { label: '', values: [2928, 2953, metrics.ebitda], borderTop: true },
      { label: 'Changes in operating assets and liabilities', note: '6', values: [221, 681, 0], indent: 1 },
      { label: 'Cash provided from operating activities', values: [BASELINE_2023.cashFromOperations, BASELINE_2024.cashFromOperations, metrics.operatingFCF], isBold: true, borderTop: true },
      { label: '', values: [null, null, null], isBlankRow: true },
      { label: 'INVESTMENT ACTIVITIES', values: [null, null, null], isSectionHeader: true },
      { label: 'Fixed asset additions', values: [BASELINE_2023.fixedAssetAdditions, BASELINE_2024.fixedAssetAdditions, metrics.capex], indent: 1 },
      { label: 'Increase in investments, other assets and intangible assets', values: [-562, -617, 0], indent: 1 },
      { label: 'Acquisitions', note: '7', values: [-1504, -86, 0], indent: 1 },
      { label: 'Increase in public and private equity investments', values: [-11, -12, 0], indent: 1 },
      { label: 'Net cash inflow (outflow) from disposal of facilities', note: '4', values: [-48, 82, 0], indent: 1 },
      { label: 'Proceeds from dispositions', values: [122, 219, 0], indent: 1 },
      { label: 'Cash used for investing activities', values: [BASELINE_2023.cashUsedInvesting, BASELINE_2024.cashUsedInvesting, metrics.capex], isBold: true, borderTop: true },
      { label: '', values: [null, null, null], isBlankRow: true },
      { label: 'FINANCING ACTIVITIES', values: [null, null, null], isSectionHeader: true },
      { label: 'Issues of debt', note: '16', values: [2083, 778, 0], indent: 1 },
      { label: 'Issue of Common Shares on exercise of stock options', values: [20, 30, 0], indent: 1 },
      { label: 'Contributions to subsidiaries by non-controlling interests', values: [11, 0, 0], indent: 1 },
      { label: 'Tax withholdings on vesting of equity awards', values: [-11, -8, 0], indent: 1 },
      { label: 'Dividends paid to non-controlling interests', values: [-74, -46, 0], indent: 1 },
      { label: '(Decrease) increase in short-term borrowings', values: [487, -182, 0], indent: 1 },
      { label: 'Repurchase of Common Shares', note: '20', values: [-13, -207, 0], indent: 1 },
      { label: 'Dividends', values: [BASELINE_2023.dividendsPaid, BASELINE_2024.dividendsPaid, 0], indent: 1 },
      { label: 'Repayments of debt', note: '16', values: [-644, -815, 0], indent: 1 },
      { label: 'Cash (used for) provided from financing activities', values: [BASELINE_2023.cashFromFinancing, BASELINE_2024.cashFromFinancing, 0], isBold: true, borderTop: true },
      { label: 'Effect of exchange rate changes on cash and cash equivalents', values: [-19, -4, 0], indent: 1 },
      { label: 'Net increase (decrease) in cash and cash equivalents', values: [-36, 49, metrics.endingCash - metrics.beginningCash], isBold: true, borderTop: true },
      { label: 'Cash and cash equivalents, beginning of year', values: [1234, 1198, metrics.beginningCash], indent: 1 },
      { label: 'Cash and cash equivalents, end of year', note: '6', values: [BASELINE_2023.cash, BASELINE_2024.cash, metrics.endingCash], isBold: true, borderTop: true, format: 'currencyDollar' },
    ];
  }, [team]);
  
  // Don't render if not open
  if (!isOpen) return null;
  
  // Get current statement data based on active tab
  const getCurrentData = (): { title: string; subtitle: string; data: FinancialLineItem[] } => {
    switch (activeTab) {
      case 'income':
        return {
          title: 'CONSOLIDATED STATEMENTS OF INCOME',
          subtitle: '[U.S. dollars in millions, except per share figures]',
          data: incomeStatementData,
        };
      case 'balance':
        return {
          title: 'CONSOLIDATED BALANCE SHEETS',
          subtitle: '[U.S. dollars in millions, except shares issued]',
          data: balanceSheetData,
        };
      case 'cashflow':
        return {
          title: 'CONSOLIDATED STATEMENTS OF CASH FLOWS',
          subtitle: '[U.S. dollars in millions]',
          data: cashFlowData,
        };
    }
  };
  
  const currentStatement = getCurrentData();
  const columnYears = ['2023', '2024', String(currentYear)];
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={cn(
        "relative bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col",
        className
      )}>
        {/* Header with Tabs */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
          {/* Title Row */}
          <div className="px-8 py-4 flex items-center justify-between border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Consolidated Financial Statements</h2>
              <p className="text-sm text-slate-600">
                Magna International Inc. • Comparing 2023, 2024, and FY{currentYear}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="px-8 py-3 flex items-center gap-2 bg-slate-50">
            <button
              onClick={() => setActiveTab('income')}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                activeTab === 'income'
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              )}
            >
              <FileText className="w-4 h-4" />
              Income Statement
            </button>
            
            <button
              onClick={() => setActiveTab('balance')}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                activeTab === 'balance'
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              )}
            >
              <Wallet className="w-4 h-4" />
              Balance Sheet
            </button>
            
            <button
              onClick={() => setActiveTab('cashflow')}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all",
                activeTab === 'cashflow'
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              )}
            >
              <TrendingUp className="w-4 h-4" />
              Cash Flow
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-auto px-8 py-6 bg-white">
          {/* Statement Header */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              MAGNA INTERNATIONAL INC.
            </h3>
            <h4 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              {currentStatement.title}
            </h4>
            <p className="text-xs text-slate-600 mt-2">
              {currentStatement.subtitle}
            </p>
          </div>
          
          {/* Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left py-2 pr-4 font-normal text-xs text-slate-600 border-b border-slate-300 w-[46%]">
                  {activeTab === 'balance' ? 'As at December 31,' : 'Years ended December 31,'}
                </th>
                <th className="text-center py-2 px-2 font-normal text-xs text-slate-600 border-b border-slate-300 w-[6%]">
                  Note
                </th>
                {columnYears.map((year, i) => (
                  <th 
                    key={year} 
                    className={cn(
                      "text-right py-2 px-3 font-bold text-sm border-b border-slate-300 w-[16%]",
                      i === 2 && "bg-amber-50"
                    )}
                  >
                    {year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentStatement.data.map((item, rowIndex) => {
                if (item.isBlankRow) {
                  return <tr key={rowIndex} className="h-4"><td colSpan={5} /></tr>;
                }
                
                return (
                  <tr 
                    key={rowIndex}
                    className={cn(
                      item.isSectionHeader && "bg-slate-50"
                    )}
                  >
                    {/* Label */}
                    <td 
                      className={cn(
                        "py-1.5 pr-4 text-sm",
                        item.isSectionHeader && "font-bold text-slate-900 pt-4",
                        item.isSubHeader && "font-semibold text-slate-700 pt-3",
                        item.isBold && "font-bold text-slate-900",
                        item.indent === 1 && "pl-6",
                        item.borderTop && "border-t border-slate-300",
                        item.borderBottom && "border-b border-slate-300"
                      )}
                    >
                      {item.label}
                    </td>
                    
                    {/* Note */}
                    <td className={cn(
                      "py-1.5 px-2 text-center text-xs text-slate-500",
                      item.borderTop && "border-t border-slate-300"
                    )}>
                      {item.note || ''}
                    </td>
                    
                    {/* Values */}
                    {item.values.map((value, colIndex) => (
                      <td 
                        key={colIndex}
                        className={cn(
                          "py-1.5 px-3 text-right text-sm font-mono",
                          item.isSectionHeader && "font-bold",
                          item.isSubHeader && "font-semibold",
                          item.isBold && "font-bold",
                          item.borderTop && "border-t border-slate-300",
                          item.borderBottom && "border-b border-slate-300",
                          colIndex === 2 && "bg-amber-50",
                          typeof value === 'number' && value < 0 && "text-slate-900"
                        )}
                      >
                        {getFormattedValue(value, item.format)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          <p className="text-xs text-slate-500 mt-6 italic">
            See accompanying notes
          </p>
        </div>
        
        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-8 py-3 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Historical: 2023 & 2024 Annual Reports • Current: FY{currentYear} (Round {currentRound})
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

SimplifiedFinancialsModal.displayName = 'SimplifiedFinancialsModal';
