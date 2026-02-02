/**
 * ScoreboardDisplay Component
 * 
 * Standalone full-screen scoreboard for big screen display.
 * Designed for unattended presentation - no navigation controls.
 * Auto-refreshes data every 3 seconds.
 * 
 * Access via: /display/scoreboard
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Trophy, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MagnaLogo } from './MagnaLogo';

// Team colors for the chart lines
const TEAM_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#06b6d4',
  '#84cc16', '#a855f7', '#10b981', '#6366f1', '#f59e0b',
  '#0ea5e9', '#d946ef', '#64748b', '#78716c', '#71717a',
];

// Year labels for rounds
const ROUND_LABELS: Record<number, string> = {
  1: 'FY26',
  2: 'FY27',
  3: 'FY28',
  4: 'FY29',
  5: 'FY30',
};

// Scenario info for display
const SCENARIO_INFO: Record<string, { label: string; color: string }> = {
  business_as_usual: { label: 'Business as Usual', color: 'bg-emerald-500' },
  cost_pressure: { label: 'Cost Pressures', color: 'bg-amber-500' },
  recession: { label: 'Recession', color: 'bg-red-500' },
  recovery: { label: 'Recovery', color: 'bg-blue-500' },
};

interface TeamData {
  teamId: number;
  teamName: string;
  currentStockPrice: number;
  cumulativeTSR: number;
  stockPricesByRound: Record<number, number>;
}

interface ScoreboardState {
  teams: TeamData[];
  currentRound: number;
  scenarioType: string;
  gameStatus: string;
}

export const ScoreboardDisplay: React.FC = () => {
  const [data, setData] = useState<ScoreboardState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [connectionError, setConnectionError] = useState(false);
  
  // Fetch scoreboard data from API
  const fetchData = useCallback(async () => {
    try {
      // Try to fetch from the backend API
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/admin/scoreboard`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setData({
            teams: result.data.teams || [],
            currentRound: result.data.currentRound || 1,
            scenarioType: result.data.scenario?.type || 'business_as_usual',
            gameStatus: result.data.gameStatus || 'lobby',
          });
          setConnectionError(false);
        }
      } else {
        setConnectionError(true);
      }
    } catch (error) {
      console.log('Scoreboard fetch error (backend may not be running):', error);
      setConnectionError(true);
    }
    
    setIsLoading(false);
    setLastUpdated(new Date());
  }, []);
  
  // Initial fetch and polling
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);
  
  // Build chart data
  const chartData = buildChartData(data?.teams || [], data?.currentRound || 1);
  
  // Get scenario display info
  const scenarioDisplay = data?.scenarioType 
    ? SCENARIO_INFO[data.scenarioType] || SCENARIO_INFO.business_as_usual
    : SCENARIO_INFO.business_as_usual;
  
  // Show waiting state if no connection
  if (connectionError || !data) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center">
        <MagnaLogo variant="white" size="lg" />
        <h1 className="text-3xl font-bold mt-8 mb-4">Value Creation Challenge</h1>
        <div className="text-slate-400 text-xl mb-8">Scoreboard</div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Waiting for Game</h2>
          <p className="text-slate-400">
            The scoreboard will appear once the game server is running and teams have joined.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-sm">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            Checking for connection...
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex items-center gap-6">
            <MagnaLogo variant="white" size="sm" />
            <div className="h-8 w-px bg-slate-700" />
            <div>
              <h1 className="text-xl font-bold text-white">
                Value Creation Challenge
              </h1>
              <p className="text-slate-400 text-sm">Live Scoreboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Scenario Badge */}
            <div className={cn(
              "px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2",
              scenarioDisplay.color
            )}>
              <span>{ROUND_LABELS[data.currentRound]}</span>
              <span className="text-white/60">•</span>
              <span>{scenarioDisplay.label}</span>
            </div>
            
            {/* Round Indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <div
                  key={r}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all",
                    r <= data.currentRound 
                      ? "bg-white" 
                      : "bg-slate-600"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex p-6 gap-6 overflow-hidden">
        {/* Left Side - Leaderboard */}
        <div className="w-96 flex-shrink-0 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
          <div className="px-6 py-4 bg-slate-700/50 border-b border-slate-700 flex items-center gap-3">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">
              Team Rankings
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {data.teams.length > 0 ? (
              <table className="w-full">
                <thead className="sticky top-0 bg-slate-800">
                  <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-700">
                    <th className="text-left px-6 py-3 w-16">Rank</th>
                    <th className="text-left px-4 py-3">Team</th>
                    <th className="text-right px-6 py-3">Stock Price</th>
                    <th className="text-right px-6 py-3">TSR</th>
                  </tr>
                </thead>
                <tbody>
                  {data.teams.map((team, index) => (
                    <tr 
                      key={team.teamId}
                      className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center font-bold",
                          index === 0 && "bg-yellow-500/20 text-yellow-400",
                          index === 1 && "bg-slate-400/20 text-slate-300",
                          index === 2 && "bg-amber-600/20 text-amber-500",
                          index > 2 && "bg-slate-600/30 text-slate-400"
                        )}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: TEAM_COLORS[index % TEAM_COLORS.length] }}
                          />
                          <span className="font-medium text-white truncate max-w-[140px]">
                            {team.teamName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-mono font-semibold text-white text-lg">
                          ${team.currentStockPrice.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={cn(
                          "flex items-center justify-end gap-1 font-medium",
                          team.cumulativeTSR >= 0 ? "text-emerald-400" : "text-red-400"
                        )}>
                          {team.cumulativeTSR >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {team.cumulativeTSR >= 0 ? '+' : ''}
                          {(team.cumulativeTSR * 100).toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 p-8">
                <p>Waiting for teams to join...</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Side - Chart */}
        <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">
              Stock Price Performance
            </h2>
            <span className="text-sm text-slate-500">
              Updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
          
          <div className="flex-1 min-h-0">
            {chartData.length > 0 && data.teams.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="round"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 14 }}
                    tickFormatter={(value) => ROUND_LABELS[value] || `R${value}`}
                    ticks={[1, 2, 3, 4, 5]}
                    domain={[1, 5]}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 14 }}
                    tickFormatter={(value) => `$${value}`}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f1f5f9',
                    }}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Stock Price']}
                    labelFormatter={(label) => ROUND_LABELS[label] || `Round ${label}`}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    formatter={(value) => <span className="text-slate-300 text-sm">{value}</span>}
                  />
                  {data.teams.map((team, index) => (
                    <Line
                      key={team.teamId}
                      type="monotone"
                      dataKey={team.teamName}
                      stroke={TEAM_COLORS[index % TEAM_COLORS.length]}
                      strokeWidth={3}
                      dot={{ r: 5, fill: TEAM_COLORS[index % TEAM_COLORS.length] }}
                      activeDot={{ r: 7 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <div className="text-center">
                  <p className="text-lg mb-2">Chart will appear after Round 1 completes</p>
                  <p className="text-sm">Stock prices are calculated when each round ends</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 px-8 py-3">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Live • Auto-updating every 3 seconds</span>
          </div>
          <span>Value Creation Challenge</span>
        </div>
      </footer>
    </div>
  );
};

/**
 * Build chart data from team stock prices
 */
function buildChartData(
  teams: TeamData[],
  currentRound: number
): Array<Record<string, number | string | undefined>> {
  if (teams.length === 0) return [];
  
  const data: Array<Record<string, number | string | undefined>> = [];
  
  for (let round = 1; round <= 5; round++) {
    const roundData: Record<string, number | string | undefined> = { round };
    
    if (round <= currentRound) {
      for (const team of teams) {
        const price = team.stockPricesByRound[round];
        if (price !== undefined) {
          roundData[team.teamName] = price;
        }
      }
    }
    
    data.push(roundData);
  }
  
  return data;
}

ScoreboardDisplay.displayName = 'ScoreboardDisplay';
