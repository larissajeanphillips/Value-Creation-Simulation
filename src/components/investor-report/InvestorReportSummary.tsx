/**
 * InvestorReportSummary Component
 * 
 * Professional investor report styled after major equity research reports.
 * Features:
 * - Investment rating (Buy/Hold/Sell) with price target
 * - Sectioned financial metrics (Valuation, Growth, Profitability, Cash Flow)
 * - Consensus estimates table
 * - Analyst commentary
 * - Market outlook
 */

import React, { useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Award,
  BarChart3,
  DollarSign,
  Target,
  Activity,
  ArrowUpCircle,
  ArrowDownCircle,
  MinusCircle,
  Quote,
  Clock,
  Building2,
  History,
  ArrowRight,
  HelpCircle,
  LineChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGameStore, useCurrentTeam, useTeamRank } from '@/stores/gameStore';
import { MagnaLogo } from '../MagnaLogo';
import { generateAnalystQuotes, MARKET_GROWTH_RATES, type AnalystQuote } from './analystQuotes';
import type { FinancialMetrics, RoundNumber } from '@/types/game';

// =============================================================================
// Types
// =============================================================================

type Rating = 'BUY' | 'HOLD' | 'SELL';

interface ConsensusEstimate {
  metric: string;
  consensus: string;
  actual: string;
  consensusValue: number;
  actualValue: number;
  difference: number;
}

// Wall Street consensus estimates by round (what analysts expected)
// Based on market conditions each year
const WALL_STREET_CONSENSUS: Record<RoundNumber, {
  revenueGrowth: number;  // Expected revenue growth from baseline
  ebitMargin: number;     // Expected EBIT margin
  epsGrowth: number;      // Expected EPS growth from baseline
  fcfGrowth: number;      // Expected FCF growth from baseline
}> = {
  1: { // FY2026 - Business as Usual - Modest growth expected
    revenueGrowth: 0.02,
    ebitMargin: 0.049,
    epsGrowth: 0.02,
    fcfGrowth: 0.015,
  },
  2: { // FY2027 - Business as Usual - Continued growth expected
    revenueGrowth: 0.035,
    ebitMargin: 0.050,
    epsGrowth: 0.04,
    fcfGrowth: 0.03,
  },
  3: { // FY2028 - Cost Pressures - Analysts expect margin compression
    revenueGrowth: 0.01,
    ebitMargin: 0.045,
    epsGrowth: -0.05,
    fcfGrowth: -0.08,
  },
  4: { // FY2029 - Recession - Analysts expect decline
    revenueGrowth: -0.10,
    ebitMargin: 0.035,
    epsGrowth: -0.25,
    fcfGrowth: -0.30,
  },
  5: { // FY2030 - Recovery - Analysts expect rebound
    revenueGrowth: 0.08,
    ebitMargin: 0.052,
    epsGrowth: 0.15,
    fcfGrowth: 0.12,
  },
};

// =============================================================================
// Constants
// =============================================================================

const BASELINE_REVENUE = 42836;
const BASELINE_EBIT = 2116;
const BASELINE_FCF = 1561;
const BASELINE_STOCK_PRICE = 49.29;
const SHARES_OUTSTANDING = 288; // millions

// =============================================================================
// Helper Functions
// =============================================================================

function calculateDerivedMetrics(
  metrics: FinancialMetrics,
  previousMetrics: FinancialMetrics | null,
  round: RoundNumber
) {
  const baseRevenue = previousMetrics?.revenue || BASELINE_REVENUE;
  const baseEbit = previousMetrics?.ebit || BASELINE_EBIT;
  const baseFcf = previousMetrics?.operatingFCF || BASELINE_FCF;
  
  const revenueGrowth = (metrics.revenue - baseRevenue) / baseRevenue;
  const ebitGrowth = (metrics.ebit - baseEbit) / baseEbit;
  const fcfGrowth = (metrics.operatingFCF - baseFcf) / baseFcf;
  const capexToSales = Math.abs(metrics.capex) / metrics.revenue;
  const fcfConversion = metrics.operatingFCF / metrics.ebitda;
  const marketGrowth = MARKET_GROWTH_RATES[round];
  const growthOverMarket = revenueGrowth - marketGrowth;
  
  // EPS calculation (simplified)
  const eps = metrics.ebit * 0.75 / SHARES_OUTSTANDING; // Assume 25% tax rate
  const priorEps = baseEbit * 0.75 / SHARES_OUTSTANDING;
  const epsGrowth = (eps - priorEps) / priorEps;
  
  // EV multiples (Enterprise Value = NPV)
  const evToEbitda = metrics.npv / metrics.ebitda;
  const evToEbit = metrics.npv / metrics.ebit;
  
  // Debt calculation: Net Debt = EV - Equity Value
  const netDebt = metrics.npv - metrics.equityValue;
  const debtToEbitda = netDebt / metrics.ebitda;
  
  return {
    revenueGrowth,
    ebitGrowth,
    fcfGrowth,
    capexToSales,
    fcfConversion,
    growthOverMarket,
    marketGrowth,
    eps,
    epsGrowth,
    evToEbitda,
    evToEbit,
    netDebt,
    debtToEbitda,
  };
}

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}B`;
  }
  return `$${value.toLocaleString()}M`;
}

function formatPercent(value: number, showSign = true): string {
  const sign = showSign && value >= 0 ? '+' : '';
  return `${sign}${(value * 100).toFixed(1)}%`;
}

function determineRating(cumulativeTSR: number, growthOverMarket: number, rank: number, totalTeams: number): Rating {
  const topThird = Math.ceil(totalTeams / 3);
  const bottomThird = totalTeams - topThird;
  
  if (rank <= topThird && cumulativeTSR > 0.05) return 'BUY';
  if (rank >= bottomThird || cumulativeTSR < -0.05) return 'SELL';
  return 'HOLD';
}

function calculatePriceTarget(currentPrice: number, rating: Rating, growthOverMarket: number): number {
  let multiplier = 1.0;
  if (rating === 'BUY') multiplier = 1.12 + (growthOverMarket * 0.5);
  else if (rating === 'HOLD') multiplier = 1.03 + (growthOverMarket * 0.3);
  else multiplier = 0.92 + (growthOverMarket * 0.2);
  
  return Math.round(currentPrice * multiplier * 100) / 100;
}

// =============================================================================
// Sub-Components
// =============================================================================

interface RatingBadgeProps {
  rating: Rating;
  priceTarget: number;
  currentPrice: number;
}

const RatingBadge: React.FC<RatingBadgeProps> = ({ rating, priceTarget, currentPrice }) => {
  const upside = ((priceTarget - currentPrice) / currentPrice) * 100;
  
  return (
    <div className="bg-white rounded-2xl border border-magna-cool-gray/20 p-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-2">
            Analyst Rating
          </div>
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center gap-2 px-5 py-3 rounded-lg font-bold text-2xl",
              rating === 'BUY' && "bg-emerald-100 text-emerald-700",
              rating === 'HOLD' && "bg-amber-100 text-amber-700",
              rating === 'SELL' && "bg-red-100 text-red-700"
            )}>
              {rating === 'BUY' && <ArrowUpCircle className="w-7 h-7" />}
              {rating === 'HOLD' && <MinusCircle className="w-7 h-7" />}
              {rating === 'SELL' && <ArrowDownCircle className="w-7 h-7" />}
              {rating}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-1">
            Price Target
          </div>
          <div className="text-4xl font-bold text-magna-carbon-black">
            ${priceTarget.toFixed(2)}
          </div>
          <div className={cn(
            "text-lg font-semibold",
            upside >= 0 ? "text-emerald-600" : "text-red-600"
          )}>
            {upside >= 0 ? '+' : ''}{upside.toFixed(1)}% upside
          </div>
        </div>
      </div>
    </div>
  );
};

interface MetricRowProps {
  label: string;
  value: string;
  change?: number;
  showChangeArrow?: boolean;
}

const MetricRow: React.FC<MetricRowProps> = ({ label, value, change, showChangeArrow = true }) => {
  const isPositive = change !== undefined ? change >= 0 : true;
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0">
      <span className="text-base text-slate-700">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg text-magna-carbon-black">{value}</span>
        {change !== undefined && showChangeArrow && (
          <span className={cn(
            "text-sm font-semibold",
            isPositive ? "text-emerald-600" : "text-red-600"
          )}>
            {isPositive ? '↑' : '↓'} {Math.abs(change * 100).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
};

interface MetricSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const MetricSection: React.FC<MetricSectionProps> = ({ title, icon, children }) => {
  return (
    <div className="bg-white rounded-xl border border-magna-cool-gray/20 p-5">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
        <span className="text-slate-600">{icon}</span>
        <h3 className="text-sm font-semibold text-magna-carbon-black uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div>{children}</div>
    </div>
  );
};

interface AnalystQuoteCardProps {
  quote: AnalystQuote;
}

const AnalystQuoteCard: React.FC<AnalystQuoteCardProps> = ({ quote }) => {
  const isQuestion = quote.type === 'question';
  const IconComponent = isQuestion ? HelpCircle : LineChart;
  
  return (
    <div className={cn(
      "rounded-lg border p-3",
      isQuestion && "border-amber-300 bg-amber-50",
      !isQuestion && quote.sentiment === 'positive' && "border-emerald-300 bg-emerald-50",
      !isQuestion && quote.sentiment === 'negative' && "border-red-300 bg-red-50",
      !isQuestion && quote.sentiment === 'neutral' && "border-slate-300 bg-slate-50"
    )}>
      <div className="flex items-start gap-2">
        <IconComponent className={cn(
          "w-4 h-4 mt-0.5 flex-shrink-0",
          isQuestion && "text-amber-600",
          !isQuestion && quote.sentiment === 'positive' && "text-emerald-600",
          !isQuestion && quote.sentiment === 'negative' && "text-red-600",
          !isQuestion && quote.sentiment === 'neutral' && "text-slate-500"
        )} />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-magna-carbon-black leading-snug mb-1">
            "{quote.quote}"
          </p>
          <div className="text-xs text-slate-500">
            {quote.analyst}, {quote.firm}
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Main Component
// =============================================================================

interface InvestorReportSummaryProps {
  className?: string;
}

export const InvestorReportSummary: React.FC<InvestorReportSummaryProps> = ({ className }) => {
  const team = useCurrentTeam();
  const teamId = useGameStore((s) => s.teamId);
  const teamName = useGameStore((s) => s.teamName);
  const gameState = useGameStore((s) => s.gameState);
  const roundResults = useGameStore((s) => s.lastRoundResults);
  const teamRank = useTeamRank();
  
  const ourResult = useMemo(() => {
    if (!roundResults || !teamId) return null;
    return roundResults.teamResults.find((r) => r.teamId === teamId);
  }, [roundResults, teamId]);
  
  const derivedMetrics = useMemo(() => {
    if (!team || !roundResults) return null;
    return calculateDerivedMetrics(team.metrics, null, roundResults.round);
  }, [team, roundResults]);
  
  const analystQuotes = useMemo(() => {
    if (!team || !roundResults || !teamRank || !gameState) return [];
    return generateAnalystQuotes(
      team.metrics, null, roundResults.round,
      team.stockPrice, BASELINE_STOCK_PRICE, teamRank, gameState.teamCount
    );
  }, [team, roundResults, teamRank, gameState]);
  
  // Calculate rating and price target
  const { rating, priceTarget } = useMemo(() => {
    if (!team || !derivedMetrics || !teamRank || !gameState) {
      return { rating: 'HOLD' as Rating, priceTarget: 50 };
    }
    const r = determineRating(team.cumulativeTSR, derivedMetrics.growthOverMarket, teamRank, gameState.teamCount);
    const pt = calculatePriceTarget(team.stockPrice, r, derivedMetrics.growthOverMarket);
    return { rating: r, priceTarget: pt };
  }, [team, derivedMetrics, teamRank, gameState]);
  
  // Consensus estimates table - Actual vs. Wall Street Expectations
  const consensusEstimates: ConsensusEstimate[] = useMemo(() => {
    if (!team || !derivedMetrics || !roundResults) return [];
    
    const round = roundResults.round;
    const consensus = WALL_STREET_CONSENSUS[round];
    
    // Calculate what Wall Street expected
    const expectedRevenue = BASELINE_REVENUE * (1 + consensus.revenueGrowth);
    const expectedEbit = expectedRevenue * consensus.ebitMargin;
    const expectedEps = expectedEbit * 0.75 / SHARES_OUTSTANDING;
    const expectedFcf = BASELINE_FCF * (1 + consensus.fcfGrowth);
    
    // Actual values
    const actualRevenue = team.metrics.revenue;
    const actualEbit = team.metrics.ebit;
    const actualEps = derivedMetrics.eps;
    const actualFcf = team.metrics.operatingFCF;
    
    return [
      { 
        metric: 'Revenue', 
        consensus: formatCurrency(expectedRevenue), 
        actual: formatCurrency(actualRevenue),
        consensusValue: expectedRevenue,
        actualValue: actualRevenue,
        difference: (actualRevenue - expectedRevenue) / expectedRevenue,
      },
      { 
        metric: 'EBIT', 
        consensus: formatCurrency(expectedEbit), 
        actual: formatCurrency(actualEbit),
        consensusValue: expectedEbit,
        actualValue: actualEbit,
        difference: (actualEbit - expectedEbit) / expectedEbit,
      },
      { 
        metric: 'EPS', 
        consensus: `$${expectedEps.toFixed(2)}`, 
        actual: `$${actualEps.toFixed(2)}`,
        consensusValue: expectedEps,
        actualValue: actualEps,
        difference: (actualEps - expectedEps) / expectedEps,
      },
      { 
        metric: 'FCF', 
        consensus: formatCurrency(expectedFcf), 
        actual: formatCurrency(actualFcf),
        consensusValue: expectedFcf,
        actualValue: actualFcf,
        difference: (actualFcf - expectedFcf) / Math.abs(expectedFcf),
      },
    ];
  }, [team, derivedMetrics, roundResults]);
  
  if (!team || !gameState || !roundResults || !derivedMetrics) {
    return (
      <div className="min-h-screen bg-magna-chrome-white flex items-center justify-center">
        <div className="text-slate-700">Loading results...</div>
      </div>
    );
  }
  
  const totalTeams = gameState.teamCount;
  const isTopThree = teamRank && teamRank <= 3;
  const fiscalYear = 2025 + roundResults.round;
  
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-b from-slate-50 to-slate-100",
      "py-8 px-4 md:px-8",
      className
    )}>
      <div className="max-w-6xl mx-auto">
        {/* Report Header - JPMorgan Style */}
        <header className="bg-magna-carbon-black text-white rounded-t-2xl p-8 mb-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MagnaLogo variant="white" size="lg" />
              </div>
              <div className="text-slate-300 text-lg">
                Automotive Technology & Manufacturing
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg text-magna-cool-gray">Equity Research</div>
              <div className="text-2xl font-semibold">Q4 FY{fiscalYear}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/20">
            <span className="bg-magna-ignition-red px-5 py-2 rounded-full text-lg font-bold">
              {teamName || `Team ${teamId}`}
            </span>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-lg font-semibold",
              isTopThree ? "bg-amber-500/20 text-amber-300" : "bg-white/10 text-white/70"
            )}>
              <Award className="w-5 h-5" />
              <span>Rank #{teamRank} of {totalTeams}</span>
            </div>
            <div className="ml-auto text-3xl font-bold">
              ${team.stockPrice.toFixed(2)}
            </div>
          </div>
        </header>
        
        {/* Rating & Price Target Bar */}
        <div className="bg-white border-x border-b border-magna-cool-gray/20 rounded-b-2xl p-6 mb-6">
          <RatingBadge rating={rating} priceTarget={priceTarget} currentPrice={team.stockPrice} />
        </div>
        
        {/* Executive Summary */}
        <section className="bg-white rounded-2xl border border-magna-cool-gray/20 p-6 mb-6">
          <h2 className="text-base font-semibold text-magna-carbon-black uppercase tracking-wide mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-magna-ignition-red" />
            Investment Thesis
          </h2>
          <div className="text-magna-carbon-black leading-relaxed space-y-3">
            <p className="text-base">
              Magna's vertically integrated platform across Complete Vehicles, Power & Vision, Seating, and Body Exteriors 
              positions the company as a differentiated Tier 1 supplier with strong cross-selling synergies.
            </p>
            <p className="text-base">
              <strong>FY{fiscalYear} Update:</strong>{' '}
              {derivedMetrics.growthOverMarket > 0.02
                ? `Management delivered revenue growth of ${formatPercent(derivedMetrics.revenueGrowth)}, outpacing market by ${formatPercent(derivedMetrics.growthOverMarket)}. This market share capture supports our constructive view.`
                : derivedMetrics.growthOverMarket > -0.01
                  ? `Revenue growth of ${formatPercent(derivedMetrics.revenueGrowth)} was in line with end-market demand, reflecting stable competitive positioning.`
                  : `Revenue growth of ${formatPercent(derivedMetrics.revenueGrowth)} lagged market trends by ${formatPercent(Math.abs(derivedMetrics.growthOverMarket))}. We are monitoring for signs of stabilization.`
              }
              {' '}
              {team.metrics.ebitMargin > 0.055
                ? `EBIT margin of ${formatPercent(team.metrics.ebitMargin, false)} reflects strong operating leverage and cost discipline.`
                : team.metrics.ebitMargin > 0.04
                  ? `EBIT margin of ${formatPercent(team.metrics.ebitMargin, false)} is consistent with management's framework.`
                  : `EBIT margin compression to ${formatPercent(team.metrics.ebitMargin, false)} warrants monitoring.`
              }
              {' '}
              {team.metrics.roic > 0.09
                ? `ROIC at ${formatPercent(team.metrics.roic, false)} remains well above cost of capital.`
                : team.metrics.roic > 0.065
                  ? `ROIC of ${formatPercent(team.metrics.roic, false)} is consistent with peer averages.`
                  : `ROIC of ${formatPercent(team.metrics.roic, false)} remains a focal point for investors.`
              }
            </p>
            <p className="text-base">
              We {rating === 'BUY' ? 'rate Overweight' : rating === 'SELL' ? 'rate Underweight' : 'maintain Neutral'} with 
              a 12-month price target of ${priceTarget.toFixed(2)}, representing {((priceTarget / team.stockPrice - 1) * 100).toFixed(0)}% {priceTarget > team.stockPrice ? 'upside' : 'downside'} from current levels.
            </p>
          </div>
        </section>
        
        {/* Key Metrics + Wall Street Expectations - Side by Side */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Key Metrics - Takes 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-magna-cool-gray/20 p-4">
            <h2 className="text-sm font-semibold text-magna-carbon-black uppercase tracking-wide mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-magna-ignition-red" />
              End of Year Performance
            </h2>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xs font-semibold text-magna-cool-gray uppercase mb-1">Revenue Growth</div>
                <div className={cn("text-lg font-bold", derivedMetrics.revenueGrowth >= 0 ? "text-emerald-600" : "text-red-600")}>
                  {formatPercent(derivedMetrics.revenueGrowth)}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-magna-cool-gray uppercase mb-1">Growth over Market</div>
                <div className={cn("text-lg font-bold", derivedMetrics.growthOverMarket >= 0.02 && derivedMetrics.growthOverMarket <= 0.04 ? "text-emerald-600" : derivedMetrics.growthOverMarket < 0.02 ? "text-amber-600" : "text-red-600")}>
                  {formatPercent(derivedMetrics.growthOverMarket)}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-magna-cool-gray uppercase mb-1">EBIT Margin</div>
                <div className="text-lg font-bold text-magna-carbon-black">{formatPercent(team.metrics.ebitMargin, false)}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-magna-cool-gray uppercase mb-1">ROIC</div>
                <div className="text-lg font-bold text-magna-carbon-black">{formatPercent(team.metrics.roic, false)}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-magna-cool-gray uppercase mb-1">CapEx to Sales</div>
                <div className="text-lg font-bold text-magna-carbon-black">{formatPercent(derivedMetrics.capexToSales, false)}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-magna-cool-gray uppercase mb-1">FCF Conversion</div>
                <div className="text-lg font-bold text-magna-carbon-black">{formatPercent(derivedMetrics.fcfConversion, false)}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-magna-cool-gray uppercase mb-1">Share Price</div>
                <div className="text-lg font-bold text-magna-carbon-black">${team.stockPrice.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-magna-cool-gray uppercase mb-1">EV/EBIT</div>
                <div className="text-lg font-bold text-magna-carbon-black">{derivedMetrics.evToEbit.toFixed(1)}x</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-magna-cool-gray uppercase mb-1">Operating FCF</div>
                <div className="text-lg font-bold text-magna-carbon-black">{formatCurrency(team.metrics.operatingFCF)}</div>
              </div>
            </div>
          </div>
          
          {/* Wall Street Expectations - Takes 1/3 width */}
          <div className="bg-white rounded-xl border border-magna-cool-gray/20 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-magna-carbon-black uppercase tracking-wide flex items-center gap-2">
                <Target className="w-4 h-4 text-magna-ignition-red" />
                vs. Wall Street
              </h2>
              {(() => {
                const beats = consensusEstimates.filter(e => e.difference > 0.001).length;
                const misses = consensusEstimates.filter(e => e.difference < -0.001).length;
                
                if (beats >= 3) {
                  return <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Beat {beats}/4</span>;
                } else if (misses >= 3) {
                  return <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">Missed {misses}/4</span>;
                } else if (beats > misses) {
                  return <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Beat {beats}/4</span>;
                } else {
                  return <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Mixed</span>;
                }
              })()}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {consensusEstimates.map((est) => {
                const isBeat = est.difference > 0.001;
                const isMiss = est.difference < -0.001;
                
                return (
                  <div key={est.metric} className="text-center py-2 bg-slate-50 rounded-lg">
                    <div className="text-xs text-magna-cool-gray mb-1">{est.metric}</div>
                    <div className="text-sm font-bold text-magna-carbon-black">{est.actual}</div>
                    <div className={cn(
                      "text-xs font-semibold",
                      isBeat && "text-emerald-600",
                      isMiss && "text-red-600",
                      !isBeat && !isMiss && "text-magna-cool-gray"
                    )}>
                      {isBeat ? `+${(est.difference * 100).toFixed(0)}%` : isMiss ? `${(est.difference * 100).toFixed(0)}%` : 'In Line'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        
        {/* Analyst Commentary + Market Outlook - Side by Side */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Analyst Commentary */}
          {analystQuotes.length > 0 && (
            <div className="bg-white rounded-xl border border-magna-cool-gray/20 p-4">
              <h2 className="text-sm font-semibold text-magna-carbon-black uppercase tracking-wide mb-3 flex items-center gap-2">
                <Quote className="w-4 h-4 text-magna-ignition-red" />
                Analyst Commentary
              </h2>
              <div className="space-y-3">
                {analystQuotes.slice(0, 2).map((quote, index) => (
                  <AnalystQuoteCard key={index} quote={quote} />
                ))}
              </div>
            </div>
          )}
          
          {/* Market Outlook */}
          <div className="bg-white rounded-xl border border-magna-cool-gray/20 p-4">
            <h2 className="text-sm font-semibold text-magna-carbon-black uppercase tracking-wide mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-magna-ignition-red" />
              Market Outlook
            </h2>
            
            {(roundResults.marketOutlook?.backwardStatements?.length > 0 || roundResults.marketOutlook?.forwardStatements?.length > 0) ? (
              <div className="space-y-4">
                {roundResults.marketOutlook?.backwardStatements?.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-magna-cool-gray uppercase mb-2 flex items-center gap-1">
                      <History className="w-3 h-3" />
                      What Happened
                    </div>
                    <ul className="space-y-2 text-sm">
                      {roundResults.marketOutlook.backwardStatements.slice(0, 2).map((statement, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-magna-ignition-red rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-magna-carbon-black">{statement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {roundResults.marketOutlook?.forwardStatements?.length > 0 && (
                  <div>
                    <div className="text-xs font-semibold text-magna-cool-gray uppercase mb-2 flex items-center gap-1">
                      <ArrowRight className="w-3 h-3" />
                      Looking Ahead
                    </div>
                    <ul className="space-y-2 text-sm">
                      {roundResults.marketOutlook.forwardStatements.slice(0, 2).map((statement, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-magna-electric-blue rounded-full mt-1.5 flex-shrink-0" />
                          <span className="text-magna-carbon-black">{statement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-magna-carbon-black text-sm">{roundResults.scenarioNarrative}</p>
            )}
          </div>
        </section>
        
        {/* Footer - Compact */}
        <footer className="text-center py-2">
          <div className="flex items-center justify-center gap-2 text-magna-cool-gray text-sm">
            <Clock className="w-4 h-4" />
            <span>Waiting for next round...</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-magna-ignition-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-magna-ignition-red rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-magna-ignition-red rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

InvestorReportSummary.displayName = 'InvestorReportSummary';
