/**
 * Standalone Value Creation Challenge Scoreboard
 * 
 * This is a standalone deployment of the scoreboard display
 * designed for big screen presentations.
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
import { RefreshCw, TrendingUp, TrendingDown, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

// API URL - configure via environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Types
interface ScoreboardTeam {
  teamId: number;
  teamName: string;
  currentStockPrice: number;
  cumulativeTSR: number;
  stockPricesByRound: Record<number, number>;
}

interface ScoreboardData {
  success: boolean;
  currentRound: number;
  status: string;
  scenario: {
    type: string;
    narrative: string;
    eventTriggered: boolean;
    eventDescription?: string;
  };
  teams: ScoreboardTeam[];
}

// Team colors for the chart lines
const TEAM_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#06b6d4',
  '#84cc16', '#a855f7', '#10b981', '#6366f1', '#f59e0b',
  '#0ea5e9', '#d946ef', '#64748b', '#78716c', '#71717a',
];

// Year labels for rounds
const ROUND_LABELS: Record<number, string> = {
  1: 'FY26', 2: 'FY27', 3: 'FY28', 4: 'FY29', 5: 'FY30',
};

// Scenario headlines for the news ticker
const SCENARIO_HEADLINES: Record<string, string> = {
  business_as_usual: 'Markets stable as automotive sector maintains steady growth trajectory',
  cost_pressure: 'BREAKING: Input costs surge 15-20%; suppliers face margin squeeze across the board',
  recession: 'BREAKING: Economic downturn confirmed; vehicle sales down 20-25% YTD as consumer confidence plummets',
  recovery: 'MARKETS RALLY: Recovery underway as pent-up demand drives automotive sector rebound',
};

/**
 * Main App Component
 */
function App() {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Check for stored PIN on mount
  useEffect(() => {
    const storedPin = sessionStorage.getItem('scoreboardPin');
    if (storedPin) {
      setPin(storedPin);
      // Auto-authenticate with stored PIN
      authenticateWithPin(storedPin);
    }
  }, []);

  /**
   * Authenticate with admin PIN
   */
  const authenticateWithPin = async (pinToUse: string) => {
    setIsAuthenticating(true);
    setAuthError(null);
    
    try {
      const response = await fetch(`${API_URL}/admin/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinToUse }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        sessionStorage.setItem('scoreboardPin', pinToUse);
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'Invalid PIN');
      }
    } catch {
      setAuthError('Connection error. Please check the API URL.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim()) {
      authenticateWithPin(pin.trim());
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen 
      pin={pin} 
      setPin={setPin} 
      onSubmit={handleSubmit}
      error={authError}
      isLoading={isAuthenticating}
    />;
  }

  return <Scoreboard />;
}

/**
 * Login Screen Component
 */
interface LoginScreenProps {
  pin: string;
  setPin: (pin: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
  isLoading: boolean;
}

function LoginScreen({ pin, setPin, onSubmit, error, isLoading }: LoginScreenProps) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 rounded-xl p-8 w-full max-w-md border border-slate-700">
        <div className="flex flex-col items-center mb-6">
          <img 
            src="/magna-logo-white.png" 
            alt="Magna" 
            className="h-10 mb-4"
          />
          <h1 className="text-xl font-semibold text-white">
            Value Creation Challenge
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Scoreboard Display
          </p>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-slate-300 mb-2">
              Admin PIN
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                id="pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter admin PIN"
                className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
          
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={isLoading || !pin.trim()}
            className="w-full py-3 px-4 bg-magna-red hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? 'Connecting...' : 'View Scoreboard'}
          </button>
        </form>
        
        <p className="mt-6 text-xs text-slate-500 text-center">
          Connect to: {API_URL}
        </p>
      </div>
    </div>
  );
}

/**
 * Main Scoreboard Component
 */
function Scoreboard() {
  const [data, setData] = useState<ScoreboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Fetch scoreboard data from API
   */
  const fetchData = useCallback(async () => {
    const pin = sessionStorage.getItem('scoreboardPin');
    if (!pin) return;
    
    try {
      const response = await fetch(
        `${API_URL}/admin/scoreboard?pin=${encodeURIComponent(pin)}`
      );
      const result = await response.json();
      
      if (result.success) {
        setData(result);
        setLastUpdated(new Date());
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial fetch and polling every 3 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);
  
  // Build chart data from teams
  const chartData = buildChartData(data?.teams || [], data?.currentRound || 1);
  
  // Get headline for news ticker
  const headline = data?.scenario
    ? (data.scenario.eventDescription || SCENARIO_HEADLINES[data.scenario.type] || 'Market conditions evolving...')
    : 'Waiting for game to start...';
  
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header with news ticker */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <img 
              src="/magna-logo-white.png" 
              alt="Magna" 
              className="h-6"
            />
            <div className="h-6 w-px bg-slate-700" />
            <h1 className="text-lg font-semibold text-white">
              Value Creation Challenge Scoreboard
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              Round {data?.currentRound || 1} of 5
            </span>
            <button
              onClick={fetchData}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </button>
          </div>
        </div>
        
        {/* News Ticker */}
        <div className="bg-magna-red text-white px-6 py-2 overflow-hidden">
          <div className="flex items-center gap-4">
            <span className="font-bold uppercase text-xs tracking-wider bg-white/20 px-2 py-0.5 rounded">
              Market Update
            </span>
            <p className="text-sm font-medium whitespace-nowrap">
              {headline}
            </p>
          </div>
        </div>
      </header>
      
      {/* Error Banner */}
      {error && (
        <div className="bg-red-900/50 border-b border-red-800 px-6 py-2 text-red-200 text-sm">
          {error}
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 flex p-6 gap-6 overflow-hidden">
        {/* Left Side - Leaderboard */}
        <div className="w-80 flex-shrink-0 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-700/50 border-b border-slate-700">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Team Leaderboard
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {data?.teams && data.teams.length > 0 ? (
              <table className="w-full">
                <thead className="sticky top-0 bg-slate-800">
                  <tr className="text-xs text-slate-400 uppercase tracking-wider">
                    <th className="text-left px-4 py-2 w-12">#</th>
                    <th className="text-left px-4 py-2">Team</th>
                    <th className="text-right px-4 py-2">Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {data.teams.map((team, index) => (
                    <TeamRow
                      key={team.teamId}
                      team={team}
                      rank={index + 1}
                      color={TEAM_COLORS[index % TEAM_COLORS.length]}
                    />
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>No teams yet</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Side - Chart */}
        <div className="flex-1 bg-slate-800 rounded-xl border border-slate-700 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Stock Price History
            </h2>
            <span className="text-xs text-slate-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
          
          <div className="flex-1 min-h-0">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis
                    dataKey="round"
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    tickFormatter={(value) => ROUND_LABELS[value] || `R${value}`}
                    ticks={[1, 2, 3, 4, 5]}
                    domain={[1, 5]}
                  />
                  <YAxis
                    stroke="#64748b"
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
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
                  {data?.teams.map((team, index) => (
                    <Line
                      key={team.teamId}
                      type="monotone"
                      dataKey={team.teamName}
                      stroke={TEAM_COLORS[index % TEAM_COLORS.length]}
                      strokeWidth={3}
                      dot={{ r: 4, fill: TEAM_COLORS[index % TEAM_COLORS.length] }}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                <p>Chart data will appear after Round 1 completes</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-slate-800 border-t border-slate-700 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Value Creation Challenge</span>
          <span>Display optimized for large screens</span>
        </div>
      </footer>
    </div>
  );
}

/**
 * Single team row in the leaderboard
 */
interface TeamRowProps {
  team: ScoreboardTeam;
  rank: number;
  color: string;
}

function TeamRow({ team, rank, color }: TeamRowProps) {
  const tsrPercent = (team.cumulativeTSR * 100).toFixed(1);
  const isPositive = team.cumulativeTSR >= 0;
  
  return (
    <tr className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
      <td className="px-4 py-3">
        <div
          className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm",
            rank === 1 && "bg-yellow-500/20 text-yellow-400",
            rank === 2 && "bg-slate-400/20 text-slate-300",
            rank === 3 && "bg-amber-600/20 text-amber-500",
            rank > 3 && "bg-slate-600/30 text-slate-400"
          )}
        >
          {rank}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <span className="font-medium text-white truncate max-w-[120px]">
            {team.teamName}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex flex-col items-end">
          <span className="font-mono font-semibold text-white">
            ${team.currentStockPrice.toFixed(2)}
          </span>
          <span className={cn(
            "text-xs flex items-center gap-0.5",
            isPositive ? "text-emerald-400" : "text-red-400"
          )}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {isPositive ? '+' : ''}{tsrPercent}%
          </span>
        </div>
      </td>
    </tr>
  );
}

/**
 * Build chart data from team stock prices
 */
function buildChartData(
  teams: ScoreboardTeam[],
  currentRound: number
): Array<Record<string, number | string | undefined>> {
  if (teams.length === 0) return [];
  
  const data: Array<Record<string, number | string | undefined>> = [];
  const totalRounds = 5;
  
  for (let round = 1; round <= totalRounds; round++) {
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

export default App;
