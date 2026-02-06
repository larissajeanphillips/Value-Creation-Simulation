/**
 * DemoLinksPage Component
 *
 * Single page for facilitators (e.g. Phil) to explore the simulation tool.
 * Lists all display and admin links—no game start required.
 * Access via: /demo/admin/links
 */

import React from 'react';
import { ExternalLink, LayoutDashboard, BarChart3, Calendar, BookOpen, Settings, Users } from 'lucide-react';
import { MagnaLogo } from './MagnaLogo';

interface DemoLink {
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

const DEMO_LINKS: DemoLink[] = [
  {
    title: 'Display Hub',
    description: 'Main menu for big screens—scoreboard, rounds, debrief',
    path: '/display',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    title: 'Live Scoreboard',
    description: 'Real-time team rankings and stock prices',
    path: '/display/scoreboard',
    icon: <BarChart3 className="w-5 h-5" />,
  },
  {
    title: 'Round 1 (FY26)',
    description: 'Business as usual',
    path: '/display/1',
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    title: 'Round 2 (FY27)',
    description: 'Business as usual',
    path: '/display/2',
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    title: 'Round 3 (FY28)',
    description: 'Cost pressures',
    path: '/display/3',
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    title: 'Round 4 (FY29)',
    description: 'Recession',
    path: '/display/4',
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    title: 'Round 5 (FY30)',
    description: 'Recovery',
    path: '/display/5',
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    title: 'Game Debrief',
    description: 'Main lessons and round deep dive (after game ends)',
    path: '/display/debrief',
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    title: 'Admin click-through demo',
    description: 'Click through facilitator screens (no PIN, no backend)',
    path: '/demo/admin',
    icon: <Settings className="w-5 h-5" />,
  },
  {
    title: 'Live Admin (requires PIN)',
    description: 'Real facilitator control panel (access code + PIN)',
    path: '/admin',
    icon: <Settings className="w-5 h-5" />,
  },
];

export function DemoLinksPage() {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MagnaLogo variant="color" size="md" />
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Facilitator demo – Value Creation Simulation</h1>
              <p className="text-slate-500 text-sm">For Phil – click through anytime. No need to start the game.</p>
            </div>
          </div>
          <a
            href="/demo"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-sm transition-colors"
          >
            <Users className="w-4 h-4" />
            Player demo
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <p className="text-amber-800 text-sm">
            <strong>Weekend play-around:</strong> Use the links below to explore the displays and facilitator view.
            We’ll walk you through starting and running the game later.
          </p>
        </div>

        <ul className="space-y-3">
          {DEMO_LINKS.map((link) => {
            const fullUrl = `${baseUrl}${link.path}`;
            return (
              <li
                key={link.path}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                    {link.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-slate-800 hover:text-magna-red transition-colors flex items-center gap-1.5"
                    >
                      {link.title}
                      <ExternalLink className="w-4 h-4 shrink-0" />
                    </a>
                    <p className="text-slate-500 text-sm mt-0.5">{link.description}</p>
                    <code className="text-xs text-slate-400 font-mono mt-2 block break-all">{fullUrl}</code>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="text-slate-500 text-sm mt-8">
          Access code for Admin / team interface: you’ll get this when we run the live simulation.
        </p>
      </main>
    </div>
  );
}
