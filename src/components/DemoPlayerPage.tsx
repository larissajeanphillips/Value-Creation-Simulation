/**
 * DemoPlayerPage - Click-through demo of player/team screens (no backend, no access code).
 * Steps: Team Selection → Lobby → Game Primer → Decision → Round Results → Final Results.
 */

import React, { useState, useLayoutEffect } from 'react';
import { DemoProvider } from '@/components/demo/DemoContext';
import { DemoNavBar } from '@/components/demo/DemoNavBar';
import { useGameStore, useGameStatus } from '@/stores/gameStore';
import { TeamSelection } from '@/components/TeamSelection';
import { Lobby } from '@/components/Lobby';
import { GamePrimer } from '@/components/GamePrimer';
import { DecisionScreen } from '@/components/DecisionScreen';
import { RoundResults } from '@/components/RoundResults';
import { FinalResults } from '@/components/FinalResults';
import { applyPlayerDemoStep } from '@/data/demoState';

const PLAYER_DEMO_STEPS = 6;

export function DemoPlayerPage() {
  const [step, setStep] = useState(0);

  useLayoutEffect(() => {
    applyPlayerDemoStep(step);
  }, [step]);

  const hasJoinedGame = useGameStore((s) => s.hasJoinedGame);
  const hasPrimerShown = useGameStore((s) => s.hasPrimerShown);
  const setPrimerShown = useGameStore((s) => s.setPrimerShown);
  const teamName = useGameStore((s) => s.teamName);
  const gameStatus = useGameStatus();
  const availableDecisions = useGameStore((s) => s.availableDecisions);

  const handlePrimerContinue = () => {
    setPrimerShown(true);
  };

  const handlePrev = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  const handleNext = () => {
    setStep((s) => Math.min(PLAYER_DEMO_STEPS - 1, s + 1));
  };

  function renderScreen() {
    if (!hasJoinedGame) {
      return <TeamSelection />;
    }
    if (!hasPrimerShown && gameStatus === 'lobby') {
      return (
        <GamePrimer
          teamName={teamName || 'Your Team'}
          onContinue={handlePrimerContinue}
        />
      );
    }
    if (gameStatus === 'finished') {
      return <FinalResults />;
    }
    if (gameStatus === 'results') {
      return <RoundResults />;
    }
    if ((gameStatus === 'active' || gameStatus === 'paused') && availableDecisions.length > 0) {
      return <DecisionScreen isCountdownShowing={false} />;
    }
    return <Lobby />;
  }

  return (
    <DemoProvider>
      <div className="min-h-screen bg-slate-100 pb-20">
        {renderScreen()}
      </div>
      <DemoNavBar
        currentStep={step}
        totalSteps={PLAYER_DEMO_STEPS}
        onPrev={handlePrev}
        onNext={handleNext}
        backHref="/demo/admin"
        backLabel="Back to demo"
      />
    </DemoProvider>
  );
}
