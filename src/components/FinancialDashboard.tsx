/**
 * Financial Dashboard Component
 * 
 * Displays key financial metrics including:
 * - Current share price
 * - Baseline financials (Revenue, EBITDA, etc.)
 * - Enterprise Value and valuation breakdown
 */

import React, { useState } from 'react';
import { TrendingUp, DollarSign, Eye, EyeOff, BarChart3, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FinancialMetrics {
  sharePrice: number;
  enterpriseValue: number;
  baselineRevenue: number;
  baselineEBITDA: number;
  baselineEBIT: number;
  baselineFCF: number;
  baselineROIC: number;
}

interface FinancialDashboardProps {
  metrics: FinancialMetrics;
  year?: number;
  className?: string;
  variant?: 'compact' | 'expanded';
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  metrics,
  year = 2025,
  className,
  variant = 'compact',
}) => {
  const [isExpanded, setIsExpanded] = useState(variant === 'expanded');

  const formatCurrency = (value: number): string => {
    return `$${value.toFixed(2)}`;
  };

  const formatMillions = (value: number): string => {
    return `$${Math.round(value).toLocaleString()}M`;
  };

  const formatPercent = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  if (variant === 'compact') {
    return (
      <div className={cn(
        "bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800",
        "border border-slate-200 dark:border-slate-700 rounded-lg p-4",
        "shadow-sm hover:shadow-md transition-all duration-200",
        className
      )}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Financial Position
            </h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 
                     dark:hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            {isExpanded ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Hide Details</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Show Details</span>
              </>
            )}
          </button>
        </div>

        {/* Always visible - Share Price */}
        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3 mb-3">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium mb-1">
                Current Share Price
              </p>
              <p className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">
                {formatCurrency(metrics.sharePrice)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-600 dark:text-slate-400">Enterprise Value</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {formatMillions(metrics.enterpriseValue)}
              </p>
            </div>
          </div>
        </div>

        {/* Expandable - Detailed Metrics */}
        {isExpanded && (
          <div className="space-y-3 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                Baseline Financials (FY {year})
              </p>
              <div className="grid grid-cols-2 gap-3">
                <MetricItem 
                  label="Revenue" 
                  value={formatMillions(metrics.baselineRevenue)}
                  color="text-blue-600 dark:text-blue-400"
                />
                <MetricItem 
                  label="EBITDA" 
                  value={formatMillions(metrics.baselineEBITDA)}
                  color="text-indigo-600 dark:text-indigo-400"
                />
                <MetricItem 
                  label="EBIT" 
                  value={formatMillions(metrics.baselineEBIT)}
                  color="text-purple-600 dark:text-purple-400"
                />
                <MetricItem 
                  label="Free Cash Flow" 
                  value={formatMillions(metrics.baselineFCF)}
                  color="text-green-600 dark:text-green-400"
                />
              </div>
            </div>
            
            <div className="bg-slate-100 dark:bg-slate-800 rounded p-2">
              <MetricItem 
                label="ROIC" 
                value={formatPercent(metrics.baselineROIC)}
                color="text-amber-600 dark:text-amber-400"
                icon={<BarChart3 className="w-3 h-3" />}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Expanded variant
  return (
    <div className={cn(
      "bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6",
      className
    )}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
          <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Financial Dashboard
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            FY {year} Baseline
          </p>
        </div>
      </div>

      {/* Share Price - Hero */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 mb-6 text-white">
        <p className="text-sm font-medium mb-2 opacity-90">Current Share Price</p>
        <p className="text-5xl font-bold mb-4">{formatCurrency(metrics.sharePrice)}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="opacity-90">Enterprise Value</span>
          <span className="font-semibold">{formatMillions(metrics.enterpriseValue)}</span>
        </div>
      </div>

      {/* Financial Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard 
          label="Revenue"
          value={formatMillions(metrics.baselineRevenue)}
          color="from-blue-500 to-blue-600"
        />
        <MetricCard 
          label="EBITDA"
          value={formatMillions(metrics.baselineEBITDA)}
          color="from-indigo-500 to-indigo-600"
        />
        <MetricCard 
          label="EBIT"
          value={formatMillions(metrics.baselineEBIT)}
          color="from-purple-500 to-purple-600"
        />
        <MetricCard 
          label="Free Cash Flow"
          value={formatMillions(metrics.baselineFCF)}
          color="from-green-500 to-green-600"
        />
      </div>

      {/* ROIC */}
      <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="font-medium text-slate-900 dark:text-slate-100">
              Return on Invested Capital
            </span>
          </div>
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
            {formatPercent(metrics.baselineROIC)}
          </span>
        </div>
      </div>
    </div>
  );
};

// Helper Components

const MetricItem: React.FC<{
  label: string;
  value: string;
  color: string;
  icon?: React.ReactNode;
}> = ({ label, value, color, icon }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-1">
      {icon}
      <span className="text-xs text-slate-600 dark:text-slate-400">{label}</span>
    </div>
    <span className={cn("text-sm font-semibold", color)}>{value}</span>
  </div>
);

const MetricCard: React.FC<{
  label: string;
  value: string;
  color: string;
}> = ({ label, value, color }) => (
  <div className={cn(
    "bg-gradient-to-br rounded-lg p-4 text-white",
    color
  )}>
    <p className="text-sm opacity-90 mb-1">{label}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default FinancialDashboard;
