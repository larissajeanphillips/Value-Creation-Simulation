/**
 * useFinancials Hook
 * 
 * Provides financial metrics calculated by the BAU engine
 * Currently returns mock data - will be connected to backend calculation engine
 */

import { useMemo } from 'react';
import type { FinancialMetrics } from '@/components/FinancialDashboard';
import { useGameStore } from '@/stores/gameStore';

/**
 * Hook to get current financial metrics
 * 
 * TODO: Connect to backend BAU engine calculation
 * For now, returns baseline (Round 0 / 2025) values
 */
export function useFinancials(): FinancialMetrics {
  const gameState = useGameStore((s) => s.gameState);
  const currentRound = gameState?.currentRound || 0;
  
  // TODO: Replace with actual backend calculation
  // This should call the BAU engine and get real-time calculations
  // based on current round, decisions, and scenarios
  
  const metrics = useMemo((): FinancialMetrics => {
    // Round 0 / 2025 Baseline values (from BAU engine verification)
    if (currentRound === 0 || currentRound === 1) {
      return {
        sharePrice: 52.27,              // Matches Excel BAU calculation
        enterpriseValue: 23201.01,      // NPV of all 10-year FCF
        baselineRevenue: 42836,         // FY 2025 revenue
        baselineEBITDA: 3738,           // Calculated from baseline
        baselineEBIT: 2116,             // Calculated from baseline
        baselineFCF: 1611,              // Year 1 (2026) FCF from BAU
        baselineROIC: 0.1018,           // 10.18% ROIC Year 1
      };
    }
    
    // Future rounds: These will be calculated by backend
    // based on cumulative decisions and scenarios
    // For now, just return baseline (placeholder)
    return {
      sharePrice: 52.27,
      enterpriseValue: 23201.01,
      baselineRevenue: 42836,
      baselineEBITDA: 3738,
      baselineEBIT: 2116,
      baselineFCF: 1611,
      baselineROIC: 0.1018,
    };
  }, [currentRound]);
  
  return metrics;
}

/**
 * Hook to check if financials are loading
 * 
 * TODO: Implement loading state when fetching from backend
 */
export function useFinancialsLoading(): boolean {
  // For now, always false since we're using mock data
  // Will return true when making API calls
  return false;
}
