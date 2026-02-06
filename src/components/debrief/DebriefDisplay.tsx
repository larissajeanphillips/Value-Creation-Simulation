/**
 * DebriefDisplay Component
 *
 * Container for the debrief on the display route. Fetches GET /api/results/final.
 * Shows loading or "Debrief available after game ends" when no data.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, BookOpen } from 'lucide-react';
import { DebriefContent } from './DebriefContent';
import { MagnaLogo } from '@/components/MagnaLogo';
import type { FinalResults } from '@/types/game';

const API_BASE = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const DebriefDisplay: React.FC = () => {
  const [finalResults, setFinalResults] = useState<FinalResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinalResults = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/api/results/final`);
      if (response.ok) {
        const data = await response.json();
        setFinalResults(data);
      } else {
        setFinalResults(null);
        setError(response.status === 404 ? 'Game not finished yet' : 'Failed to load results');
      }
    } catch (err) {
      setFinalResults(null);
      setError('Could not connect to the game server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinalResults();
  }, [fetchFinalResults]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-8">
        <MagnaLogo variant="white" size="xl" className="mb-8" />
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-slate-400 text-lg">Loading debrief...</p>
      </div>
    );
  }

  if (error || !finalResults) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-8">
        <MagnaLogo variant="white" size="xl" className="mb-8" />
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-md text-center">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Debrief</h2>
          <p className="text-slate-400 mb-4">
            {error === 'Game not finished yet'
              ? 'Debrief is available after the game ends. Finish all 5 rounds to see main lessons and round-by-round insights.'
              : error ?? 'No results available.'}
          </p>
          <button
            type="button"
            onClick={fetchFinalResults}
            className="rounded-lg bg-amber-500 px-4 py-2 font-medium text-slate-900 hover:bg-amber-400 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-800/50">
        <MagnaLogo variant="white" size="md" />
        <span className="text-slate-400 text-sm">Game Debrief</span>
      </header>
      <main className="flex-1 overflow-hidden">
        <DebriefContent finalResults={finalResults} variant="display" />
      </main>
    </div>
  );
};

DebriefDisplay.displayName = 'DebriefDisplay';
