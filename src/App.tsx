/**
 * App Component
 * 
 * Main application entry point for the Value Creation Challenge.
 * Handles routing between screens based on URL and game state:
 * 
 * Demo Routes (no backend required, each visitor gets fresh game):
 * - / - Player demo (direct start)
 * - /admin - Admin demo (direct start)
 * 
 * Live Routes (requires backend server):
 * - /live - Live multiplayer team interface
 * - /live-admin - Live facilitator control panel
 * 
 * Display Routes (for big screen presentation):
 * - /display - Display Hub - landing page for AV teams
 * - /display/scoreboard - Live scoreboard (auto-updates)
 * - /display/1 through /display/5 - Round macro environment displays
 * 
 * Team Interface States:
 * - Team Selection (not joined)
 * - Lobby (joined, game not started)
 * - Decision Screen (active round)
 * - Round Results (round ended)
 * - Final Results (game finished)
 */

import React, { useEffect, useState, useRef } from 'react';
import { useGameStore, useGameStatus } from '@/stores/gameStore';
import { useSocket } from '@/hooks/useSocket';
import { AccessGate } from '@/components/AccessGate';
import { TeamSelection } from '@/components/TeamSelection';
import { Lobby } from '@/components/Lobby';
import { DecisionScreen } from '@/components/DecisionScreen';
import { RoundResults } from '@/components/RoundResults';
import { FinalResults } from '@/components/FinalResults';
import { AdminPanel } from '@/components/admin';
import { RoundCountdown } from '@/components/RoundCountdown';
import { DemoApp } from '@/demo';
import { MagnaLogo } from '@/components/MagnaLogo';
import { MacroEnvironmentDisplay } from '@/components/MacroEnvironmentDisplay';
import { DisplayHub } from '@/components/DisplayHub';
import { ScoreboardDisplay } from '@/components/ScoreboardDisplay';

// =============================================================================
// ACCESS CODE - Change this to control who can access the app
// =============================================================================
const ACCESS_CODE = 'magna2026';

type Route = 'demo-player' | 'demo-admin' | 'live-team' | 'live-admin' | 'display-hub' | 'display-round' | 'display-scoreboard';

/**
 * Determines the route based on current URL
 * Called both for initial render and URL changes
 */
function getRouteFromURL(): { route: Route; displayRound: number } {
  const path = window.location.pathname;
  const hash = window.location.hash;
  const fullPath = path + hash;
  
  // /display/scoreboard - Big screen live scoreboard
  if (fullPath.includes('/display/scoreboard') || fullPath.includes('#display/scoreboard')) {
    return { route: 'display-scoreboard', displayRound: 1 };
  }
  
  // /display/1-5 - Big screen round macro environment display
  const roundMatch = fullPath.match(/display\/(\d)/);
  if (roundMatch) {
    const roundNum = parseInt(roundMatch[1], 10);
    if (roundNum >= 1 && roundNum <= 5) {
      return { route: 'display-round', displayRound: roundNum };
    }
  }
  
  // /display - Display hub (landing page for AV teams)
  if (path === '/display' || path === '/display/' || hash === '#display' || hash.startsWith('#display')) {
    return { route: 'display-hub', displayRound: 1 };
  }
  
  // /admin or #admin - Admin demo mode
  if (path === '/admin' || hash === '#admin') {
    return { route: 'demo-admin', displayRound: 1 };
  }
  
  // /live-admin - Live admin mode (requires backend)
  if (path === '/live-admin' || hash === '#live-admin') {
    return { route: 'live-admin', displayRound: 1 };
  }
  
  // /live - Live multiplayer mode (requires backend)
  if (path === '/live' || hash === '#live') {
    return { route: 'live-team', displayRound: 1 };
  }
  
  // Everything else defaults to player demo mode
  return { route: 'demo-player', displayRound: 1 };
}

function App() {
  // Initialize route from URL synchronously to avoid flash of wrong content
  const initialRoute = getRouteFromURL();
  const [route, setRoute] = useState<Route>(initialRoute.route);
  const [displayRound, setDisplayRound] = useState<number>(initialRoute.displayRound);
  
  // Handle URL changes (back/forward navigation)
  useEffect(() => {
    const handleRouteChange = () => {
      const newRoute = getRouteFromURL();
      setRoute(newRoute.route);
      setDisplayRound(newRoute.displayRound);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);
  
  // Display routes - all protected by access code
  if (route === 'display-hub' || route === 'display-scoreboard' || route === 'display-round') {
    let displayContent: React.ReactNode;
    
    if (route === 'display-hub') {
      displayContent = <DisplayHub />;
    } else if (route === 'display-scoreboard') {
      displayContent = <ScoreboardDisplay />;
    } else {
      displayContent = (
        <MacroEnvironmentDisplay
          round={displayRound}
          showNavigation={true}
          onRoundChange={(r) => {
            setDisplayRound(r);
            // Update URL to match
            window.history.pushState({}, '', `/display/${r}`);
          }}
        />
      );
    }
    
    return (
      <AccessGate accessCode={ACCESS_CODE}>
        {displayContent}
      </AccessGate>
    );
  }
  
  // Demo modes - no backend required, each visitor gets their own fresh game
  if (route === 'demo-player') {
    return <DemoApp startMode="player" />;
  }
  
  if (route === 'demo-admin') {
    return <DemoApp startMode="admin" />;
  }
  
  // Live modes - wrap in AccessGate, requires backend
  return (
    <AccessGate accessCode={ACCESS_CODE}>
      {route === 'live-admin' ? <AdminPanel /> : <TeamInterface />}
    </AccessGate>
  );
}

/**
 * TeamInterface - The main player-facing interface
 */
function TeamInterface() {
  // Initialize socket connection
  const { isConnected, isConnecting, error } = useSocket();
  
  // Game state
  const hasJoinedGame = useGameStore((s) => s.hasJoinedGame);
  const gameStatus = useGameStatus();
  const availableDecisions = useGameStore((s) => s.availableDecisions);
  const currentRound = useGameStore((s) => s.gameState?.currentRound);
  
  // Countdown overlay state - shown on top of blurred decision screen
  const [showCountdownOverlay, setShowCountdownOverlay] = useState(false);
  const prevStatusRef = useRef<string | null>(null);
  const prevRoundRef = useRef<number | null>(null);
  const hasShownCountdownForRound = useRef<number | null>(null);
  
  // Log connection status changes
  useEffect(() => {
    if (isConnected) {
      console.log('[App] Connected to game server');
    }
  }, [isConnected]);
  
  // Detect when a new round starts and trigger countdown overlay
  useEffect(() => {
    const wasNotActive = prevStatusRef.current !== 'active';
    const isNowActive = gameStatus === 'active';
    const isNewRound = currentRound !== null && currentRound !== hasShownCountdownForRound.current;
    
    // Show countdown overlay when:
    // 1. Game becomes active (transition from non-active to active)
    // 2. OR it's a new round we haven't shown countdown for yet
    if (isNowActive && availableDecisions.length > 0 && (wasNotActive || isNewRound)) {
      // Only show if we haven't already shown for this round
      if (hasShownCountdownForRound.current !== currentRound) {
        setShowCountdownOverlay(true);
        hasShownCountdownForRound.current = currentRound ?? null;
      }
    }
    
    // Hide countdown when leaving active state
    if (gameStatus === 'lobby' || gameStatus === 'results' || gameStatus === 'finished') {
      setShowCountdownOverlay(false);
    }
    
    prevStatusRef.current = gameStatus;
    prevRoundRef.current = currentRound ?? null;
  }, [gameStatus, availableDecisions.length, currentRound]);
  
  // Handle countdown completion - just hide the overlay
  const handleCountdownComplete = () => {
    setShowCountdownOverlay(false);
  };
  
  // Handle connection error - offer demo mode as fallback
  if (error && !isConnected && !isConnecting) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-8">
        <div className="bg-white border border-slate-200 shadow-lg rounded-2xl p-8 max-w-lg text-center">
          {/* Magna Header */}
          <div className="flex items-center justify-center mb-6">
            <MagnaLogo variant="color" size="md" />
          </div>
          
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Game Server Unavailable</h2>
          <p className="text-slate-600 text-lg mb-6">
            The live game server is not currently running. You can try the demo mode to explore the game experience.
          </p>
          
          <div className="space-y-3">
            <a
              href="/"
              className="block w-full px-6 py-4 bg-magna-red text-white rounded-xl font-semibold text-lg hover:bg-magna-red-dark transition-colors shadow-lg shadow-magna-red/20"
            >
              Try Demo Mode
            </a>
            
            <button
              onClick={() => window.location.reload()}
              className="block w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-medium text-lg hover:bg-slate-200 transition-colors"
            >
              Retry Connection
            </button>
          </div>
          
          <p className="text-slate-700 text-sm mt-6">
            If you're a facilitator, make sure the backend server is running.
          </p>
        </div>
      </div>
    );
  }
  
  // Determine which screen to show
  const renderScreen = () => {
    // Not joined yet - show team selection
    if (!hasJoinedGame) {
      return <TeamSelection />;
    }
    
    // Game finished - show final results
    if (gameStatus === 'finished') {
      return <FinalResults />;
    }
    
    // Round results - show results screen
    if (gameStatus === 'results') {
      return <RoundResults />;
    }
    
    // Active or paused round - show decision screen with countdown overlay on top
    if ((gameStatus === 'active' || gameStatus === 'paused') && availableDecisions.length > 0) {
      return (
        <div className="relative">
          {/* Decision screen - always rendered, blurred when countdown is showing */}
          <div className={showCountdownOverlay ? 'blur-sm pointer-events-none' : ''}>
            <DecisionScreen isCountdownShowing={showCountdownOverlay} />
          </div>
          
          {/* Countdown overlay on top */}
          {showCountdownOverlay && (
            <div className="fixed inset-0 z-50">
              <RoundCountdown
                round={currentRound || 1}
                onComplete={handleCountdownComplete}
              />
            </div>
          )}
        </div>
      );
    }
    
    // Lobby - waiting for game to start
    return <Lobby />;
  };
  
  return (
    <div className="min-h-screen bg-slate-100">
      {renderScreen()}
      
      {/* Admin Link (subtle, bottom right) */}
      <a
        href="#admin"
        className="fixed bottom-4 right-4 text-slate-400 hover:text-slate-600 text-sm transition-colors"
      >
        Admin
      </a>
    </div>
  );
}

export default App;
