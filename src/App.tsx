/**
 * App Component
 * 
 * Main application entry point for the Value Creation Simulation.
 * Handles routing between screens based on URL and game state:
 * 
 * Routes (requires backend server):
 * - / - Team interface (default)
 * - /admin - Facilitator control panel
 * - /demo - Player demo (no backend). /demo/admin - Facilitator admin walkthrough. /demo/admin/links - Facilitator demo links.
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
import { MagnaLogo } from '@/components/MagnaLogo';
import { MacroEnvironmentDisplay } from '@/components/MacroEnvironmentDisplay';
import { DisplayHub } from '@/components/DisplayHub';
import { ScoreboardDisplay } from '@/components/ScoreboardDisplay';
import { DebriefDisplay } from '@/components/debrief/DebriefDisplay';
import { GamePrimer } from '@/components/GamePrimer';
import { DemoLinksPage } from '@/components/DemoLinksPage';
import { DemoPlayerPage } from '@/components/DemoPlayerPage';
import { DemoAdminPage } from '@/components/DemoAdminPage';

// =============================================================================
// ACCESS CODE - Change this to control who can access the app
// =============================================================================
const ACCESS_CODE = 'magna2026';

type Route = 'team' | 'admin' | 'demo' | 'demo-player' | 'demo-admin' | 'display-hub' | 'display-round' | 'display-scoreboard' | 'display-debrief';

/**
 * Determines the route based on current URL
 * Called both for initial render and URL changes
 */
function getRouteFromURL(): { route: Route; displayRound: number } {
  const path = window.location.pathname;
  const hash = window.location.hash;
  
  // /display routes - check if path starts with /display
  if (path.startsWith('/display')) {
    // /display/scoreboard
    if (path === '/display/scoreboard' || path === '/display/scoreboard/') {
      return { route: 'display-scoreboard', displayRound: 1 };
    }
    // /display/debrief
    if (path === '/display/debrief' || path === '/display/debrief/') {
      return { route: 'display-debrief', displayRound: 1 };
    }
    // /display/1-5 - Round displays
    const roundMatch = path.match(/^\/display\/(\d)\/?$/);
    if (roundMatch) {
      const roundNum = parseInt(roundMatch[1], 10);
      if (roundNum >= 1 && roundNum <= 5) {
        return { route: 'display-round', displayRound: roundNum };
      }
    }
    
    // /display or /display/ - Display hub
    if (path === '/display' || path === '/display/') {
      return { route: 'display-hub', displayRound: 1 };
    }
  }
  
  // Hash-based display routes (fallback)
  if (hash.startsWith('#display')) {
    if (hash === '#display/scoreboard') {
      return { route: 'display-scoreboard', displayRound: 1 };
    }
    const hashRoundMatch = hash.match(/^#display\/(\d)$/);
    if (hashRoundMatch) {
      const roundNum = parseInt(hashRoundMatch[1], 10);
      if (roundNum >= 1 && roundNum <= 5) {
        return { route: 'display-round', displayRound: roundNum };
      }
    }
    if (hash === '#display') {
      return { route: 'display-hub', displayRound: 1 };
    }
  }
  
  // /admin or #admin - Admin/Facilitator mode
  if (path === '/admin' || path === '/admin/' || hash === '#admin' ||
      path === '/live-admin' || path === '/live-admin/' || hash === '#live-admin') {
    return { route: 'admin', displayRound: 1 };
  }

  // /demo/admin/links - Facilitator demo links page (list of all demo/display links)
  if (path === '/demo/admin/links' || path === '/demo/admin/links/') {
    return { route: 'demo', displayRound: 1 };
  }

  // /demo/admin and /demo/admin/walkthrough - Admin walkthrough (Dashboard → Framework → Scoreboard → Agenda)
  if (
    path === '/demo/admin' ||
    path === '/demo/admin/' ||
    path === '/demo/admin/walkthrough' ||
    path === '/demo/admin/walkthrough/'
  ) {
    return { route: 'demo-admin', displayRound: 1 };
  }

  // /demo or /demo/player (legacy) - Player click-through demo
  if (path === '/demo' || path === '/demo/' || path === '/demo/player' || path === '/demo/player/') {
    return { route: 'demo-player', displayRound: 1 };
  }

  // Everything else defaults to team interface
  return { route: 'team', displayRound: 1 };
}

function App() {
  // Initialize route from URL synchronously using initializer function
  // This ensures getRouteFromURL() is called exactly once on mount
  const [routeState, setRouteState] = useState(() => {
    return getRouteFromURL();
  });
  const route = routeState.route;
  const displayRound = routeState.displayRound;
  
  // Wrapper to update both route and displayRound together
  const updateRoute = (newRoute: { route: Route; displayRound: number }) => {
    setRouteState(newRoute);
  };
  
  // Handle URL changes (back/forward navigation)
  useEffect(() => {
    const handleRouteChange = () => {
      const newRoute = getRouteFromURL();
      console.log('[App] Route change detected:', newRoute);
      updateRoute(newRoute);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);
  
  // Demo pages - no password
  if (route === 'demo') {
    return <DemoLinksPage />;
  }
  if (route === 'demo-admin') {
    return <DemoAdminPage />;
  }
  if (route === 'demo-player') {
    return <DemoPlayerPage />;
  }

  // Scoreboard display - no password required for easy AV team access
  if (route === 'display-scoreboard') {
    return <ScoreboardDisplay />;
  }
  
  // Display hub - no password required (it's just a navigation page)
  if (route === 'display-hub') {
    return <DisplayHub />;
  }

  // Debrief display - no password required; shows after game ends
  if (route === 'display-debrief') {
    return <DebriefDisplay />;
  }
  
  // Round environment displays - protected by access code
  if (route === 'display-round') {
    return (
      <AccessGate accessCode={ACCESS_CODE}>
        <MacroEnvironmentDisplay
          round={displayRound}
          showNavigation={true}
          onRoundChange={(r) => {
            updateRoute({ route: 'display-round', displayRound: r });
            // Update URL to match
            window.history.pushState({}, '', `/display/${r}`);
          }}
        />
      </AccessGate>
    );
  }
  
  // Main app - wrap in AccessGate, requires backend
  return (
    <AccessGate accessCode={ACCESS_CODE}>
      {route === 'admin' ? <AdminPanel /> : <TeamInterface />}
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
  const hasPrimerShown = useGameStore((s) => s.hasPrimerShown);
  const setPrimerShown = useGameStore((s) => s.setPrimerShown);
  const teamName = useGameStore((s) => s.teamName);
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
  
  // Handle connection error
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
            The game server is not currently running. Please contact the facilitator to start the game.
          </p>
          
          <button
            onClick={() => window.location.reload()}
            className="block w-full px-6 py-4 bg-magna-red text-white rounded-xl font-semibold text-lg hover:bg-magna-red-dark transition-colors shadow-lg shadow-magna-red/20"
          >
            Retry Connection
          </button>
          
          <p className="text-slate-700 text-sm mt-6">
            If you're a facilitator, make sure the backend server is running.
          </p>
        </div>
      </div>
    );
  }
  
  // Handle primer completion
  const handlePrimerContinue = () => {
    setPrimerShown(true);
  };
  
  // Determine which screen to show
  const renderScreen = () => {
    // Not joined yet - show team selection
    if (!hasJoinedGame) {
      return <TeamSelection />;
    }
    
    // Joined but haven't seen primer yet - show primer page
    if (!hasPrimerShown && gameStatus === 'lobby') {
      return (
        <GamePrimer 
          teamName={teamName || 'Your Team'} 
          onContinue={handlePrimerContinue} 
        />
      );
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
