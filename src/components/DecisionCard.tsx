/**
 * DecisionCard Component
 * 
 * Displays a single investment decision card with:
 * - Front: Name, cost, brief description, category badge
 * - Back (expanded): Full narrative, impact details, guiding principle
 * - States: available, selected, disabled, risky
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Settings, 
  Shield, 
  AlertTriangle,
  Check,
  ChevronRight,
  Clock,
  DollarSign,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Decision } from '@/types/game';

interface DecisionCardProps {
  decision: Decision;
  isSelected: boolean;
  isDisabled: boolean;
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
  
  // Impact summary for the card
  const impactSummary = getImpactSummary(decision);
  
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
          // Disabled state
          isDisabled && !isSelected && [
            "opacity-50 cursor-not-allowed",
            "border-slate-200",
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
        
        {/* Risky Badge */}
        {decision.isRisky && (
          <div className="absolute top-8 right-3 flex items-center gap-1 px-2 py-1 bg-red-100 rounded-full">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-600">Risky</span>
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
        
        {/* Cost */}
        <div className="flex items-center gap-1.5 mb-3">
          <DollarSign className="w-5 h-5 text-slate-700" />
          <span className="text-xl font-bold text-slate-800">{decision.cost}M</span>
        </div>
        
        {/* Brief Description */}
        <p className="text-base text-slate-600 line-clamp-3 mb-4">
          {decision.narrative.split('.')[0]}.
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
            {decision.durationYears} year{decision.durationYears > 1 ? 's' : ''} investment
          </div>
          
          <button
            onClick={handleExpandClick}
            className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-slate-800 transition-colors"
          >
            Details
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
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
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
              {/* Decision Number in Modal */}
              <span className="text-sm text-slate-400">Decision #{decision.decisionNumber}</span>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-slate-700" />
            </button>
          </div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            {decision.name}
          </h2>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-6 h-6 text-slate-700" />
              <span className="text-3xl font-bold text-slate-800">{decision.cost}M</span>
            </div>
            
            {decision.isRisky && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-base font-semibold text-red-600">Risky Investment</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Narrative */}
          <div>
            <h4 className="text-base font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Investment Overview
            </h4>
            <p className="text-slate-700 text-lg leading-relaxed">
              {decision.narrative}
            </p>
          </div>
          
          {/* Key Metrics Grid - Category Specific */}
          <div>
            <h4 className="text-base font-semibold text-slate-700 uppercase tracking-wide mb-3">
              Key Metrics
            </h4>
            {decision.category === 'grow' && decision.growMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <DetailItem 
                  label="Revenue Year 1" 
                  value={`$${decision.growMetrics.revenue1Year}M`} 
                />
                <DetailItem 
                  label="5-Year Growth" 
                  value={`${decision.growMetrics.fiveYearGrowth}% y-o-y`} 
                />
                <div className="col-span-2 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <div className="text-sm text-emerald-700 mb-1">Investment (total)</div>
                  <div className="text-emerald-800 text-2xl font-bold">
                    ${decision.growMetrics.investmentsTotal}M
                  </div>
                </div>
                <DetailItem 
                  label="Investment Period" 
                  value={`${decision.growMetrics.investmentPeriod} year${decision.growMetrics.investmentPeriod > 1 ? 's' : ''}`} 
                />
                <DetailItem 
                  label="EBIT Margin" 
                  value={`${decision.growMetrics.ebitMargin}%`} 
                />
              </div>
            )}
            {decision.category === 'grow' && !decision.growMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <DetailItem 
                  label="Investment (total)" 
                  value={`$${decision.cost}M`} 
                />
                <DetailItem 
                  label="Investment Period" 
                  value={`${decision.durationYears} year${decision.durationYears > 1 ? 's' : ''}`} 
                />
              </div>
            )}
            {decision.category === 'optimize' && decision.optimizeMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <DetailItem 
                  label="Implementation Cost" 
                  value={`$${decision.optimizeMetrics.implementationCost}M`} 
                />
                <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="text-sm text-blue-700 mb-1">Investment</div>
                  <div className="text-blue-800 text-2xl font-bold">
                    ${decision.optimizeMetrics.investment}M
                  </div>
                </div>
                <DetailItem 
                  label="Investment Period" 
                  value={`${decision.optimizeMetrics.investmentPeriod} year${decision.optimizeMetrics.investmentPeriod > 1 ? 's' : ''}`} 
                />
                <DetailItem 
                  label="Annual Cost" 
                  value={`$${decision.optimizeMetrics.annualCost}M`} 
                />
              </div>
            )}
            {decision.category === 'optimize' && !decision.optimizeMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <DetailItem 
                  label="Implementation Cost" 
                  value={decision.recurringBenefit ? `${(decision.cost / decision.recurringBenefit).toFixed(1)}x annual savings` : `$${decision.cost}M`} 
                />
                <DetailItem 
                  label="Investment Period" 
                  value={`${decision.durationYears} year${decision.durationYears > 1 ? 's' : ''}`} 
                />
                <DetailItem 
                  label="Annual Cost Savings" 
                  value={decision.recurringBenefit ? `$${decision.recurringBenefit}M` : '—'} 
                />
              </div>
            )}
            {decision.category === 'sustain' && decision.sustainMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <DetailItem 
                  label="Implementation Cost" 
                  value={`$${decision.sustainMetrics.implementationCost}M`} 
                />
                <div className="col-span-2 bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="text-sm text-amber-700 mb-1">Investment (total)</div>
                  <div className="text-amber-800 text-2xl font-bold">
                    ${decision.sustainMetrics.investment}M
                  </div>
                </div>
                <DetailItem 
                  label="Investment Period" 
                  value={`${decision.sustainMetrics.investmentPeriod} year${decision.sustainMetrics.investmentPeriod > 1 ? 's' : ''}`} 
                />
                <DetailItem 
                  label="Annual Cost" 
                  value={`$${decision.sustainMetrics.annualCost}M`} 
                />
              </div>
            )}
            {decision.category === 'sustain' && !decision.sustainMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <DetailItem 
                  label="Investment (total)" 
                  value={`$${decision.cost}M`} 
                />
                <DetailItem 
                  label="Investment Period" 
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

function getImpactSummary(decision: Decision): string[] {
  const impacts: string[] = [];
  
  if (decision.category === 'grow') {
    // Growth-specific metrics
    impacts.push(`$${decision.cost}M invest`);
    if (decision.revenueImpact) {
      impacts.push(`${(decision.revenueImpact * 100).toFixed(1)}% growth`);
    }
    if (decision.recurringBenefit) {
      impacts.push(`$${decision.recurringBenefit}M rev`);
    }
  } else if (decision.category === 'optimize') {
    // Optimize-specific metrics
    if (decision.cogsImpact) {
      impacts.push(`COGS -${Math.abs(decision.cogsImpact * 100).toFixed(0)}%`);
    }
    if (decision.recurringBenefit) {
      impacts.push(`$${decision.recurringBenefit}M savings`);
    }
  } else if (decision.category === 'sustain') {
    // Sustain-specific metrics
    impacts.push(`$${decision.cost}M invest`);
    impacts.push('Protects revenue');
    if (decision.riskPrevention) {
      impacts.push('Risk Shield');
    }
  }
  
  return impacts.slice(0, 3);
}

DecisionCard.displayName = 'DecisionCard';
