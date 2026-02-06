/**
 * DecisionCard Component
 * 
 * Displays a single investment decision card with:
 * - Front: Name, cost, brief description, category badge
 * - Back (expanded): Full narrative, impact details, guiding principle
 * - States: available, selected, disabled
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Settings, 
  Shield, 
  Check,
  ChevronRight,
  Clock,
  DollarSign,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Decision } from '@/types/game';

/** When disabled due to affordability, show "Exceeds available funds" so users know why they can't purchase. */
export type DisabledReason = 'affordability' | 'submitted';

interface DecisionCardProps {
  decision: Decision;
  isSelected: boolean;
  isDisabled: boolean;
  /** Optional reason for disabled state; when 'affordability', card shows "Exceeds available funds". */
  disabledReason?: DisabledReason;
  onToggle: () => void;
  className?: string;
}

const CATEGORY_CONFIG = {
  grow: {
    label: 'Grow',
    icon: TrendingUp,
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-400',
    accentColor: 'emerald',
  },
  optimize: {
    label: 'Optimize',
    icon: Settings,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-400',
    accentColor: 'blue',
  },
  sustain: {
    label: 'Sustain',
    icon: Shield,
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-400',
    accentColor: 'amber',
  },
};

export const DecisionCard: React.FC<DecisionCardProps> = ({
  decision,
  isSelected,
  isDisabled,
  disabledReason,
  onToggle,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const config = CATEGORY_CONFIG[decision.category];
  const CategoryIcon = config.icon;
  
  const handleCardClick = () => {
    if (!isDisabled) {
      onToggle();
    }
  };
  
  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(true);
  };
  
  // Total investment: from CSV/metrics (column G for grow, etc.) when available, else decision.cost
  const displayInvestment =
    decision.growMetrics?.investmentsTotal ??
    decision.optimizeMetrics?.investment ??
    decision.sustainMetrics?.investment ??
    decision.cost;
  // Sustain: some cards have no total investment but have implementation cost + annual savings (show as —)
  const hasSustainMetrics = decision.category === 'sustain' && decision.sustainMetrics;
  const showTotalInvestmentAsDash =
    hasSustainMetrics &&
    (decision.sustainMetrics!.investment === 0 || decision.sustainMetrics!.investment == null) &&
    (decision.sustainMetrics!.implementationCost > 0 || decision.sustainMetrics!.annualCost > 0);
  // Investment period: from CSV/metrics when present (so card matches source), else backend durationYears
  const investmentPeriodYears =
    decision.growMetrics?.investmentPeriod ??
    decision.optimizeMetrics?.investmentPeriod ??
    decision.sustainMetrics?.investmentPeriod ??
    decision.durationYears;
  // In-year investment: from CSV/metrics (column I) when present, else total / period
  const inYearFromMetrics =
    decision.growMetrics?.inYearInvestment ??
    decision.optimizeMetrics?.inYearInvestment ??
    decision.sustainMetrics?.inYearInvestment;
  const perYearInvestment =
    inYearFromMetrics ??
    (investmentPeriodYears > 0 ? Math.round(displayInvestment / investmentPeriodYears) : displayInvestment);
  // Impact summary for the card (shows per-year when multi-year)
  const impactSummary = getImpactSummary(decision, displayInvestment, investmentPeriodYears);

  return (
    <>
      {/* Card */}
      <div
        onClick={handleCardClick}
        className={cn(
          "relative rounded-2xl p-5 cursor-pointer transition-all duration-200",
          "border-2 group",
          // Base styles
          "bg-white shadow-sm",
          // Disabled state: muted look but investment amount stays visible so users know why they can't purchase
          isDisabled && !isSelected && [
            "cursor-not-allowed",
            "border-slate-200 bg-slate-50",
            "opacity-90",
          ],
          // Available state
          !isDisabled && !isSelected && [
            "border-slate-200 hover:border-slate-300",
            "hover:shadow-md",
          ],
          // Selected state
          isSelected && [
            config.borderColor,
            `bg-${config.accentColor}-50`,
            "shadow-lg",
          ],
          className
        )}
      >
        {/* Decision Number - Top right, formatted nicely */}
        <span className="absolute top-2 right-3 text-xs text-slate-400 font-normal">
          Decision #{decision.decisionNumber}
        </span>
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className={cn(
            "absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center",
            `bg-${config.accentColor}-500`
          )}>
            <Check className="w-5 h-5 text-white" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold mb-3",
          config.bgColor,
          config.textColor
        )}>
          <CategoryIcon className="w-4 h-4" />
          {config.label}
        </div>
        
        {/* Name */}
        <h3 className="font-semibold text-slate-800 text-lg mb-2 leading-snug">
          {decision.name}
        </h3>
        
        {/* Investment: total, period, in-year (front of card). Sustain also shows Implementation cost & Annual savings when present. */}
        <div className={cn(
          "mb-3",
          isDisabled && !isSelected && "rounded-xl bg-white/80 p-3 border border-slate-200"
        )}>
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="w-5 h-5 text-slate-700" />
            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total investment</span>
            {showTotalInvestmentAsDash ? (
              <span className="text-xl font-bold text-slate-500">—</span>
            ) : (
              <span className="text-xl font-bold text-slate-800">${displayInvestment}M</span>
            )}
          </div>
          <div className="text-sm text-slate-600 pl-6 space-y-0.5">
            <p>
              <span className="text-slate-500">Investment period: </span>
              <span className="font-medium text-slate-700">{investmentPeriodYears} year{investmentPeriodYears !== 1 ? 's' : ''}</span>
            </p>
            <p>
              <span className="text-slate-500">In-year investment: </span>
              <span className="font-medium text-slate-700">
                {showTotalInvestmentAsDash ? '—' : `$${typeof perYearInvestment === 'number' ? perYearInvestment : displayInvestment}M${investmentPeriodYears > 1 ? ' per year' : ''}`}
              </span>
            </p>
            {hasSustainMetrics && (decision.sustainMetrics!.implementationCost > 0 || decision.sustainMetrics!.annualCost > 0) && (
              <>
                <p>
                  <span className="text-slate-500">Implementation cost: </span>
                  <span className="font-medium text-slate-700">
                    {decision.sustainMetrics!.implementationCost > 0 ? `$${decision.sustainMetrics!.implementationCost}M` : '—'}
                  </span>
                </p>
                <p>
                  <span className="text-slate-500">Annual savings: </span>
                  <span className="font-medium text-slate-700">
                    {decision.sustainMetrics!.annualCost > 0 ? `$${decision.sustainMetrics!.annualCost}M` : '—'}
                  </span>
                </p>
              </>
            )}
          </div>
          {isDisabled && !isSelected && disabledReason === 'affordability' && (
            <p className="mt-2 pt-2 border-t border-slate-200 text-sm font-medium text-amber-700">
              Exceeds available funds — cannot select
            </p>
          )}
        </div>
        
        {/* Business case summary (front of card: Excel column G brief, else first sentence of narrative) */}
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Business case</p>
        <p className="text-base text-slate-600 line-clamp-3 mb-4">
          {decision.brief?.trim() || (decision.narrative.split('.')[0]?.trim() ? `${decision.narrative.split('.')[0].trim()}.` : decision.narrative)}
        </p>
        
        {/* Impact Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {impactSummary.map((impact, i) => (
            <span 
              key={i}
              className="px-2 py-1 bg-slate-100 rounded text-sm font-medium text-slate-700"
            >
              {impact}
            </span>
          ))}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-200">
          <div className="flex items-center gap-1 text-sm text-slate-700">
            <Clock className="w-4 h-4" />
            <span className="font-medium">{investmentPeriodYears} year{investmentPeriodYears > 1 ? 's' : ''}</span> investment period
          </div>
          
          <button
            onClick={handleExpandClick}
            className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-800 transition-colors"
          >
            View business case
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Expanded Modal */}
      {isExpanded && (
        <DecisionModal
          decision={decision}
          config={config}
          isSelected={isSelected}
          isDisabled={isDisabled}
          onToggle={onToggle}
          onClose={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

// =============================================================================
// Decision Modal (Expanded View)
// =============================================================================

interface DecisionModalProps {
  decision: Decision;
  config: typeof CATEGORY_CONFIG['grow'];
  isSelected: boolean;
  isDisabled: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const DecisionModal: React.FC<DecisionModalProps> = ({
  decision,
  config,
  isSelected,
  isDisabled,
  onToggle,
  onClose,
}) => {
  const CategoryIcon = config.icon;
  const displayInvestment =
    decision.growMetrics?.investmentsTotal ??
    decision.optimizeMetrics?.investment ??
    decision.sustainMetrics?.investment ??
    decision.cost;
  const investmentPeriodYears =
    decision.growMetrics?.investmentPeriod ??
    decision.optimizeMetrics?.investmentPeriod ??
    decision.sustainMetrics?.investmentPeriod ??
    decision.durationYears;
  const inYearFromMetrics =
    decision.growMetrics?.inYearInvestment ??
    decision.optimizeMetrics?.inYearInvestment ??
    decision.sustainMetrics?.inYearInvestment;
  const perYearInvestment =
    inYearFromMetrics ??
    (investmentPeriodYears > 0 ? Math.round(displayInvestment / investmentPeriodYears) : displayInvestment);
  const sustainNoTotalInvestment =
    decision.category === 'sustain' &&
    decision.sustainMetrics &&
    (decision.sustainMetrics.investment === 0 || decision.sustainMetrics.investment == null) &&
    (decision.sustainMetrics.implementationCost > 0 || decision.sustainMetrics.annualCost > 0);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: name + investment up top in big font */}
        <div className={cn(
          "p-6 border-b border-slate-200",
          `bg-${config.accentColor}-50`
        )}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-semibold",
                config.bgColor,
                config.textColor
              )}>
                <CategoryIcon className="w-5 h-5" />
                {config.label}
              </div>
              <span className="text-sm text-slate-400">Decision #{decision.decisionNumber}</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-slate-700" />
            </button>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            {decision.name}
          </h2>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Total investment</span>
                {sustainNoTotalInvestment ? (
                  <span className="text-3xl font-bold text-slate-500">—</span>
                ) : (
                  <span className="text-3xl font-bold text-slate-800">${displayInvestment}M</span>
                )}
                <span className="text-slate-500 font-medium">over {investmentPeriodYears} year{investmentPeriodYears > 1 ? 's' : ''}</span>
              </div>
              <p className="text-base text-slate-600">
                <span className="text-slate-500">In-year investment: </span>
                <span className="font-semibold text-slate-700">
                  {sustainNoTotalInvestment ? '—' : `$${perYearInvestment}M${investmentPeriodYears > 1 ? ' per year' : ' this year'}`}
                </span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Business case (verbatim from Excel) – top of back so it’s read first */}
          <div>
            <h4 className="text-base font-semibold text-slate-700 uppercase tracking-wide mb-1">
              Business case
            </h4>
            <p className="text-sm text-slate-500 mb-2">
              Modeled assumptions; actual outcomes may differ.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-line">
              {decision.narrative?.trim() || 'No business case detail available for this card.'}
            </p>
          </div>
          
          {/* Expected outcomes (from business case model) */}
          <div>
            <h4 className="text-base font-semibold text-slate-700 uppercase tracking-wide mb-1">
              Expected outcomes
            </h4>
            <p className="text-sm text-slate-500 mb-3">
              Values from the business case model; real-world results will vary.
            </p>
            {decision.category === 'grow' && decision.growMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <DetailItem 
                  label="Revenue 1 year" 
                  value={`$${decision.growMetrics.revenue1Year}M`} 
                />
                <DetailItem 
                  label="5-year growth" 
                  value={`${decision.growMetrics.fiveYearGrowth}% y-o-y`} 
                />
                <DetailItem 
                  label="EBIT margin" 
                  value={`${decision.growMetrics.ebitMargin}%`} 
                />
                <div className="col-span-2 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="text-sm text-emerald-700 mb-1">Investments (total)</div>
                  <div className="text-emerald-800 text-2xl font-bold">
                    ${decision.growMetrics.investmentsTotal}M
                  </div>
                </div>
                <DetailItem 
                  label="Investment period" 
                  value={`${decision.growMetrics.investmentPeriod} year${decision.growMetrics.investmentPeriod > 1 ? 's' : ''}`} 
                />
                <DetailItem 
                  label="In-year investment" 
                  value={`$${decision.growMetrics.inYearInvestment ?? Math.round(decision.growMetrics.investmentsTotal / decision.growMetrics.investmentPeriod)}M per year`} 
                />
              </div>
            )}
            {decision.category === 'grow' && !decision.growMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <DetailItem 
                  label="Investments (total)" 
                  value={`$${decision.cost}M`} 
                />
                <DetailItem 
                  label="Investment period" 
                  value={`${decision.durationYears} year${decision.durationYears > 1 ? 's' : ''}`} 
                />
              </div>
            )}
            {decision.category === 'optimize' && decision.optimizeMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <DetailItem 
                  label="Annual cost savings" 
                  value={`$${decision.optimizeMetrics.annualCost}M`} 
                />
                <DetailItem 
                  label="Implementation cost" 
                  value={`$${decision.optimizeMetrics.implementationCost}M`} 
                />
                <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="text-sm text-blue-700 mb-1">Investments</div>
                  <div className="text-blue-800 text-2xl font-bold">
                    ${decision.optimizeMetrics.investment}M
                  </div>
                </div>
                <DetailItem 
                  label="Investment period" 
                  value={`${decision.optimizeMetrics.investmentPeriod} year${decision.optimizeMetrics.investmentPeriod > 1 ? 's' : ''}`} 
                />
              </div>
            )}
            {decision.category === 'optimize' && !decision.optimizeMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <DetailItem 
                  label="Annual cost savings" 
                  value={decision.recurringBenefit ? `$${decision.recurringBenefit}M` : '—'} 
                />
                <DetailItem 
                  label="Implementation cost" 
                  value={decision.recurringBenefit ? `${(decision.cost / decision.recurringBenefit).toFixed(1)}x annual savings` : `$${decision.cost}M`} 
                />
                <DetailItem 
                  label="Investment period" 
                  value={`${decision.durationYears} year${decision.durationYears > 1 ? 's' : ''}`} 
                />
              </div>
            )}
            {decision.category === 'sustain' && decision.sustainMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <DetailItem 
                  label="Total investment ($M)" 
                  value={
                    (decision.sustainMetrics.investment === 0 || decision.sustainMetrics.investment == null) &&
                    (decision.sustainMetrics.implementationCost > 0 || decision.sustainMetrics.annualCost > 0)
                      ? '—'
                      : `$${decision.sustainMetrics.investment}M`
                  } 
                />
                <DetailItem 
                  label="Investment period (yrs)" 
                  value={`${decision.sustainMetrics.investmentPeriod} year${decision.sustainMetrics.investmentPeriod > 1 ? 's' : ''}`} 
                />
                <DetailItem 
                  label="In-year investment ($M)" 
                  value={
                    sustainNoTotalInvestment
                      ? '—'
                      : decision.sustainMetrics.inYearInvestment != null
                        ? `$${decision.sustainMetrics.inYearInvestment}M`
                        : `$${Math.round((decision.sustainMetrics.investment ?? 0) / Math.max(1, decision.sustainMetrics.investmentPeriod))}M`
                  } 
                />
                <DetailItem 
                  label="Implementation cost ($M)" 
                  value={decision.sustainMetrics.implementationCost > 0 ? `$${decision.sustainMetrics.implementationCost}M` : '—'} 
                />
                <DetailItem 
                  label="Annual savings ($M)" 
                  value={decision.sustainMetrics.annualCost > 0 ? `$${decision.sustainMetrics.annualCost}M` : '—'} 
                />
              </div>
            )}
            {decision.category === 'sustain' && !decision.sustainMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <DetailItem 
                  label="Investments (total)" 
                  value={`$${decision.cost}M`} 
                />
                <DetailItem 
                  label="Investment period" 
                  value={`${decision.durationYears} year${decision.durationYears > 1 ? 's' : ''}`} 
                />
                <div className="col-span-2 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="text-sm text-amber-700 mb-1">No incremental cash flow created</div>
                  <div className="text-amber-800 text-base font-medium">
                    Protects against losing business-as-usual revenue
                  </div>
                </div>
                <div className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="text-sm text-slate-700 mb-1">Revenue Protection</div>
                  <div className="text-slate-800 text-lg font-semibold">
                    Avoids {decision.revenueImpact ? `${Math.abs(decision.revenueImpact * 100).toFixed(1)}%` : '0.1%'} core revenue loss compared to previous period
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 px-4 bg-slate-100 text-slate-700 rounded-xl font-semibold text-lg hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              if (!isDisabled) {
                onToggle();
                onClose();
              }
            }}
            disabled={isDisabled && !isSelected}
            className={cn(
              "flex-1 py-4 px-4 rounded-xl font-semibold text-lg transition-colors",
              isSelected
                ? "bg-red-600 text-white hover:bg-red-500"
                : isDisabled
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : `bg-${config.accentColor}-600 text-white hover:bg-${config.accentColor}-500`
            )}
          >
            {isSelected ? 'Remove Selection' : isDisabled ? 'Cannot Afford' : 'Select Investment'}
          </button>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// Helper Components
// =============================================================================

const DetailItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
    <div className="text-sm text-slate-700 mb-1">{label}</div>
    <div className="text-slate-800 text-lg font-semibold">{value}</div>
  </div>
);

// =============================================================================
// Helper Functions
// =============================================================================

function getImpactSummary(
  decision: Decision,
  totalInvestment?: number,
  periodYears?: number
): string[] {
  const impacts: string[] = [];
  const total = totalInvestment ?? decision.cost;
  const period = periodYears ?? decision.durationYears;
  const perYear = period > 1 && period > 0 ? Math.round(total / period) : total;
  const investLabel = period > 1 ? `$${perYear}M/yr` : `$${total}M invest`;

  if (decision.category === 'grow') {
    impacts.push(investLabel);
    if (decision.revenueImpact) {
      impacts.push(`${(decision.revenueImpact * 100).toFixed(1)}% growth`);
    }
    if (decision.recurringBenefit) {
      impacts.push(`$${decision.recurringBenefit}M rev`);
    }
  } else if (decision.category === 'optimize') {
    if (decision.cogsImpact) {
      impacts.push(`COGS -${Math.abs(decision.cogsImpact * 100).toFixed(0)}%`);
    }
    if (decision.recurringBenefit) {
      impacts.push(`$${decision.recurringBenefit}M savings`);
    }
  } else if (decision.category === 'sustain') {
    impacts.push(investLabel);
    impacts.push('Protects revenue');
    if (decision.riskPrevention) {
      impacts.push('Risk Shield');
    }
  }

  return impacts.slice(0, 3);
}

DecisionCard.displayName = 'DecisionCard';
