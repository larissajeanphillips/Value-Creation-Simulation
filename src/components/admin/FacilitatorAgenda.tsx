/**
 * FacilitatorAgenda Component
 * 
 * Minute-by-minute agenda for facilitators with sample scripts.
 * Displays the full 120-minute session structure.
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  ChevronDown, 
  ChevronRight,
  FileText,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { MagnaLogo } from '../MagnaLogo';
import { RoundScriptModal } from './RoundScriptModal';

interface FacilitatorAgendaProps {
  onBack: () => void;
}

interface AgendaItem {
  id: string;
  activity: string;
  speaker: string;
  duration: number;
  startMinute: number;
  endMinute: number;
  script?: string;
  notes?: string;
}

interface AgendaSection {
  id: string;
  title: string;
  duration: number;
  startMinute: number;
  endMinute: number;
  color: string;
  items: AgendaItem[];
}

// Full agenda data based on the detailed agenda image
const AGENDA_DATA: AgendaSection[] = [
  {
    id: 'intro',
    title: 'Intro & Context',
    duration: 6,
    startMinute: 0,
    endMinute: 6,
    color: 'blue',
    items: [
      {
        id: 'intro-1',
        activity: 'Recap key messages on value creation shared consistently in previous top management meetings and continuously throughout the year',
        speaker: 'Swamy',
        duration: 3,
        startMinute: 0,
        endMinute: 3,
        script: 'Good morning everyone. Before we dive into today\'s challenge, I want to take a moment to reinforce why we\'re here. Value creation isn\'t just a financial metric—it\'s the fundamental measure of whether we\'re fulfilling our mission to shareholders, employees, and customers. Throughout the year, we\'ve talked about the importance of disciplined capital allocation, operational excellence, and strategic positioning. Today, you\'ll experience firsthand the trade-offs and decisions that drive—or destroy—shareholder value. This simulation will put you in the CEO seat and challenge you to balance short-term performance with long-term positioning. The decisions you make will have real consequences in the game, just as they do in our business.',
      },
      {
        id: 'intro-2',
        activity: 'Introduce the Magna Value Creation Challenge explaining that we will challenge teams to put themselves in the CEO seat and make the decisions required to meet or beat Magna\'s Business Plan',
        speaker: 'Swamy',
        duration: 3,
        startMinute: 3,
        endMinute: 6,
        script: 'Now, let me introduce the Magna Value Creation Challenge. Over the next two hours, you and your teammates will step into the role of Magna\'s executive leadership team. You\'ll face real market scenarios—some favorable, some challenging—and make capital allocation decisions that will determine your company\'s share price. Your mission is simple: maximize shareholder value over five simulated fiscal years. But as you\'ll discover, simple doesn\'t mean easy. Every decision has trade-offs. Every investment has risk. And the market will judge your performance quarter after quarter. Phil will now walk you through the mechanics. Good luck—and may the best leadership team win.',
      },
    ],
  },
  {
    id: 'overview',
    title: 'Challenge Overview',
    duration: 10,
    startMinute: 6,
    endMinute: 16,
    color: 'purple',
    items: [
      {
        id: 'overview-1',
        activity: 'Objective: Understand business decisions and tradeoffs to drive EPS and growth\n• Drivers of growth\n• Alignment of strategy and execution',
        speaker: 'Phil',
        duration: 2,
        startMinute: 6,
        endMinute: 8,
        script: 'Thank you, Swamy. Let me explain what we\'re trying to accomplish today. The objective of this challenge is to help you understand—viscerally, not just intellectually—the business decisions and trade-offs that drive earnings per share and growth. You\'ll experience the tension between investing for the future and delivering results today. You\'ll see how strategic choices compound over time. And most importantly, you\'ll understand why alignment between strategy and execution is so critical. Every decision you make will impact multiple levers: revenue growth, margins, capital efficiency, and ultimately, your share price.',
      },
      {
        id: 'overview-2',
        activity: 'Structure: 5 scenarios, 10 min time constraints',
        speaker: 'Phil',
        duration: 1,
        startMinute: 8,
        endMinute: 9,
        script: 'Here\'s how the challenge works. You\'ll play through 5 rounds, each representing a fiscal year. Each round has a different market scenario—some stable, some turbulent. For each round, you\'ll have exactly 10 minutes to discuss as a team and submit your capital allocation decisions. When time runs out, decisions lock automatically. No extensions, no exceptions. Just like in real business, indecision is a decision.',
      },
      {
        id: 'overview-3',
        activity: 'Rules: fixed capital pool, limited decisions per round',
        speaker: 'Phil',
        duration: 3,
        startMinute: 9,
        endMinute: 12,
        script: 'Now for the rules. Each round, you\'ll have a fixed pool of capital to allocate. You cannot spend more than you have. You must choose from a set of investment options across different categories: growth initiatives, operational improvements, M&A opportunities, and shareholder returns. You cannot select all options—you must prioritize. Some investments take time to pay off. Others deliver immediate results but may limit future flexibility. Read the decision cards carefully. The details matter. And remember: you\'re competing against every other team in this room. Your relative performance determines the winner.',
      },
      {
        id: 'overview-4',
        activity: 'Scoring: Winner has highest Share Price by end of Round 5',
        speaker: 'Phil',
        duration: 1,
        startMinute: 12,
        endMinute: 13,
        script: 'Scoring is straightforward. The winning team is the one with the highest share price at the end of Round 5. Share price is calculated based on your earnings growth, return on invested capital, and strategic positioning. We\'ll show rankings after each round, so you\'ll always know where you stand. But don\'t get too focused on short-term rankings—sometimes the best strategy requires patience.',
      },
      {
        id: 'overview-5',
        activity: 'Q&A',
        speaker: 'Phil',
        duration: 3,
        startMinute: 13,
        endMinute: 16,
        script: 'Before we begin, does anyone have questions about the rules or mechanics? [PAUSE FOR QUESTIONS] Common questions: Yes, decisions are final once submitted. No, you cannot change allocations after the timer ends. Yes, you can see what decisions other teams made—but only after the round ends. Any other questions? [PAUSE] Great. Let\'s begin Round 1.',
      },
    ],
  },
  {
    id: 'rounds',
    title: 'Rounds',
    duration: 85,
    startMinute: 16,
    endMinute: 101,
    color: 'emerald',
    items: [
      // Round 1
      {
        id: 'round-1-header',
        activity: 'Round 1: Business as usual',
        speaker: '',
        duration: 16,
        startMinute: 16,
        endMinute: 32,
        notes: 'section-header',
      },
      {
        id: 'round-1-setup',
        activity: 'Scenario introduction & market context',
        speaker: 'Phil',
        duration: 2,
        startMinute: 16,
        endMinute: 18,
      },
      {
        id: 'round-1-decision',
        activity: 'Team discussion & capital allocation',
        speaker: 'Teams',
        duration: 10,
        startMinute: 18,
        endMinute: 28,
        script: '[FACILITATOR: Walk the room. Listen to team discussions. Note interesting debates for later debrief. Announce time remaining at 5 minutes, 2 minutes, and 30 seconds.]',
      },
      {
        id: 'round-1-lock',
        activity: 'Decisions locked',
        speaker: 'Phil',
        duration: 1,
        startMinute: 28,
        endMinute: 29,
        script: 'Time! Decisions are now locked. If you didn\'t submit, your capital remains unallocated—which is rarely the optimal choice. Let\'s see how the market responds to your decisions.',
      },
      {
        id: 'round-1-results',
        activity: 'Results & recap reading',
        speaker: 'Phil',
        duration: 3,
        startMinute: 29,
        endMinute: 32,
        script: 'Let\'s look at the results from Round 1. [SHOW SCOREBOARD] You can see how each team\'s share price has moved based on their capital allocation decisions. Some of you invested heavily in growth. Others focused on operational efficiency. A few returned capital to shareholders. All valid strategies—but the market is starting to differentiate. Notice how [HIGHEST TEAM] has taken an early lead. Let\'s see if they can maintain it as conditions change. On to Round 2.',
      },
      // Round 2
      {
        id: 'round-2-header',
        activity: 'Round 2: Business as usual',
        speaker: '',
        duration: 16,
        startMinute: 32,
        endMinute: 48,
        notes: 'section-header',
      },
      {
        id: 'round-2-setup',
        activity: 'Scenario introduction',
        speaker: 'Phil',
        duration: 2,
        startMinute: 32,
        endMinute: 34,
      },
      {
        id: 'round-2-decision',
        activity: 'Team discussion & capital allocation',
        speaker: 'Teams',
        duration: 10,
        startMinute: 34,
        endMinute: 44,
        script: '[FACILITATOR: Continue walking the room. Listen for teams adjusting strategy based on Round 1 results. Note if any teams are doubling down vs. pivoting. Announce time remaining at 5 minutes, 2 minutes, and 30 seconds.]',
      },
      {
        id: 'round-2-lock',
        activity: 'Decisions locked',
        speaker: 'Phil',
        duration: 1,
        startMinute: 44,
        endMinute: 45,
        script: 'Time! Decisions are locked. Two rounds down, three to go. The foundation you\'re building now will matter when conditions get tougher.',
      },
      {
        id: 'round-2-results',
        activity: 'Results & recap',
        speaker: 'Phil',
        duration: 3,
        startMinute: 45,
        endMinute: 48,
        script: 'Round 2 results are in. [SHOW SCOREBOARD] The pack is starting to spread. Some early investments are beginning to pay dividends, while others are still in build mode. Look at the gap between the top and bottom performers—it\'s widening. For those in the lead: don\'t get complacent. For those trailing: there\'s still time, but the clock is ticking. Here\'s what you need to know about Round 3: the environment is about to change. Cost pressures are coming.',
      },
      // Round 3
      {
        id: 'round-3-header',
        activity: 'Round 3: Cost pressures',
        speaker: '',
        duration: 13,
        startMinute: 48,
        endMinute: 61,
        notes: 'section-header',
      },
      {
        id: 'round-3-setup',
        activity: 'Scenario introduction',
        speaker: 'Phil',
        duration: 2,
        startMinute: 48,
        endMinute: 50,
      },
      {
        id: 'round-3-decision',
        activity: 'Team discussion & capital allocation',
        speaker: 'Teams',
        duration: 10,
        startMinute: 50,
        endMinute: 60,
        script: '[FACILITATOR: This round tests operational discipline. Watch for teams that panic vs. stay strategic. Note teams that protect margins vs. those that try to grow through the pressure. Announce time remaining at 5 minutes, 2 minutes, and 30 seconds.]',
      },
      {
        id: 'round-3-lock',
        activity: 'Decisions locked',
        speaker: 'Phil',
        duration: 1,
        startMinute: 60,
        endMinute: 61,
        script: 'Decisions locked. Cost pressures test your operational resilience. Let\'s see who maintained discipline and who got squeezed.',
      },
      {
        id: 'round-3-results',
        activity: 'Results & recap',
        speaker: 'Phil',
        duration: 3,
        startMinute: 61,
        endMinute: 64,
        script: 'Round 3 results. [SHOW SCOREBOARD] Cost pressures have shaken up the rankings. Some teams that invested in operational excellence earlier are now reaping the benefits—their margins held up better than competitors. Others saw their profits squeezed by the rising costs. This is a common pattern in business: the best time to prepare for a storm is when the sun is shining. Now, I have to warn you: Round 4 will test you even further. The scenario you\'re about to face will require you to adapt quickly.',
      },
      // Round 4
      {
        id: 'round-4-header',
        activity: 'Round 4: Recession',
        speaker: '',
        duration: 20,
        startMinute: 64,
        endMinute: 84,
        notes: 'section-header',
      },
      {
        id: 'round-4-setup',
        activity: 'Scenario introduction',
        speaker: 'Phil',
        duration: 2,
        startMinute: 64,
        endMinute: 66,
      },
      {
        id: 'round-4-decision-1',
        activity: 'Team discussion & capital allocation',
        speaker: 'Teams',
        duration: 2,
        startMinute: 66,
        endMinute: 68,
        script: '[FACILITATOR: Let teams start deliberating normally. They think this is a standard round. After 2 minutes, you will interrupt with the recession announcement. Watch for initial strategies that are about to be disrupted.]',
      },
      {
        id: 'round-4-recession',
        activity: 'Recession announcement is made and teams must re-calibrate decisions',
        speaker: 'Phil',
        duration: 2,
        startMinute: 68,
        endMinute: 70,
        script: 'STOP! Everyone, stop what you\'re doing. I have breaking news. [PAUSE FOR DRAMATIC EFFECT] The economy has just entered a recession. Vehicle sales are collapsing—down 20 to 25 percent from peak. OEMs are canceling programs. Credit markets are tightening. Several of your smaller competitors are facing bankruptcy. This changes everything. The decisions you were about to make? You need to reconsider them. Your capital allocation must now account for a dramatically different environment. The timer continues. You have 10 more minutes to recalibrate your strategy. Go!',
      },
      {
        id: 'round-4-decision-2',
        activity: 'Team discussion & capital allocation',
        speaker: 'Teams',
        duration: 10,
        startMinute: 70,
        endMinute: 80,
        script: '[FACILITATOR: Watch for how teams respond to the shock. Some will panic. Some will see opportunity. Note the different crisis management styles. Announce time remaining at 5 minutes, 2 minutes, and 30 seconds.]',
      },
      {
        id: 'round-4-lock',
        activity: 'Decisions locked',
        speaker: 'Phil',
        duration: 1,
        startMinute: 80,
        endMinute: 81,
        script: 'Decisions locked. The recession tests not just your strategy, but your ability to adapt under pressure. Some of you protected cash. Some saw acquisition opportunities. Let\'s see who read the situation correctly.',
      },
      {
        id: 'round-4-results',
        activity: 'Results & recap',
        speaker: 'Phil',
        duration: 3,
        startMinute: 81,
        endMinute: 84,
        script: 'Round 4 results—the recession round. [SHOW SCOREBOARD] This round separated the resilient from the fragile. Look at the share price movements—some teams lost significant value, while others held steady or even gained. In a real recession, companies with strong balance sheets and operational discipline survive. Companies that overextended get hurt. Notice how the teams that maintained financial flexibility had more options. Those who invested everything in growth found themselves exposed. One round remains. The recovery is coming. The question is: are you positioned to capture it?',
      },
      // Round 5
      {
        id: 'round-5-header',
        activity: 'Round 5: Recovery',
        speaker: '',
        duration: 17,
        startMinute: 84,
        endMinute: 101,
        notes: 'section-header',
      },
      {
        id: 'round-5-setup',
        activity: 'Final scenario introduction',
        speaker: 'Phil',
        duration: 2,
        startMinute: 84,
        endMinute: 86,
      },
      {
        id: 'round-5-decision',
        activity: 'Final team discussion & capital allocation',
        speaker: 'Teams',
        duration: 10,
        startMinute: 86,
        endMinute: 96,
        script: '[FACILITATOR: Final round energy! This is where winners are made. Watch for aggressive plays from trailing teams and defensive moves from leaders. Note teams going for M&A opportunities. Announce time remaining at 5 minutes, 2 minutes, 1 minute, and final countdown from 10 seconds.]',
      },
      {
        id: 'round-5-lock',
        activity: 'Decisions locked',
        speaker: 'Phil',
        duration: 1,
        startMinute: 96,
        endMinute: 97,
        script: 'Final decisions are LOCKED! That\'s it—five years of simulated capital allocation decisions are complete. The market will now render its final judgment on your leadership. Let\'s see who created the most shareholder value.',
      },
      {
        id: 'round-5-results',
        activity: 'Final results & recap',
        speaker: 'Phil',
        duration: 4,
        startMinute: 97,
        endMinute: 101,
        script: 'Ladies and gentlemen, the final results of the Magna Value Creation Challenge. [SHOW FINAL SCOREBOARD - BUILD SUSPENSE] In fifth place... [TEAM NAME] with a share price of [X]. In fourth place... [TEAM NAME]. In third place... [TEAM NAME]. Your runner-up, in second place... [TEAM NAME] with a share price of [X]. And your winner of the Value Creation Challenge... [PAUSE] [TEAM NAME] with a final share price of [X]! [APPLAUSE] Congratulations to our winning team. But before we celebrate, let\'s talk about what we all learned today.',
      },
    ],
  },
  {
    id: 'takeaways',
    title: 'Takeaways & Debrief',
    duration: 14,
    startMinute: 101,
    endMinute: 115,
    color: 'amber',
    items: [
      {
        id: 'takeaways-1',
        activity: 'Simulation Takeaways: Overall TSR results & patterns',
        speaker: 'Phil',
        duration: 7,
        startMinute: 101,
        endMinute: 108,
        script: 'Let\'s analyze what drove the results today. [SHOW ANALYTICS DASHBOARD] Looking across all teams, some clear patterns emerge. First, balance matters. Teams that went all-in on any single strategy—whether aggressive growth or pure cost-cutting—generally underperformed. The winners found ways to invest in the future while maintaining operational discipline. Second, timing matters. Early investments in capabilities paid off when conditions got tough. Teams that waited until the recession to cut costs were already behind. Third, adaptability matters. The recession round showed who could pivot quickly versus who was locked into their strategy. Finally, look at these numbers: [SHOW TSR BREAKDOWN]. The gap between the highest and lowest performing teams is [X]%. That\'s the difference between being a value creator and a value destroyer. Every decision you made—or didn\'t make—contributed to that gap.',
      },
      {
        id: 'takeaways-2',
        activity: 'Simulation Debrief: Discussion on trade-offs & lessons',
        speaker: 'Phil',
        duration: 7,
        startMinute: 108,
        endMinute: 115,
        script: 'Now I want to hear from you. What surprised you about this experience? [PAUSE - TAKE 2-3 RESPONSES] What was the hardest trade-off you faced? [PAUSE - TAKE 2-3 RESPONSES] For our winning team: what was your strategy? Walk us through your thinking. [PAUSE - LET WINNING TEAM EXPLAIN] For a team that struggled: where do you think things went wrong? [PAUSE - BE SUPPORTIVE, FOCUS ON LEARNING] Here\'s what I want you to take back to your day jobs: These aren\'t hypothetical decisions. Every quarter, Magna\'s leadership faces versions of these same trade-offs. Growth versus margins. Short-term versus long-term. Defense versus offense. The difference is, in the real world, you don\'t get five rounds—you get one shot. The discipline and strategic thinking you practiced today is exactly what we need every day.',
      },
    ],
  },
  {
    id: 'closing',
    title: 'Closing',
    duration: 5,
    startMinute: 115,
    endMinute: 120,
    color: 'slate',
    items: [
      {
        id: 'closing-1',
        activity: 'Closing messages & reflections',
        speaker: 'Swamy',
        duration: 5,
        startMinute: 115,
        endMinute: 120,
        script: 'Thank you all for your engagement today. What I observed was impressive strategic thinking, passionate debate, and real learning. Let me leave you with three thoughts. First, value creation is a choice. Every day, in every decision, you choose to create or destroy value. This simulation compressed years into hours, but the principles are the same. Second, we win as a team. Notice how the best-performing groups today weren\'t dominated by one voice—they leveraged diverse perspectives and made better decisions because of it. That\'s exactly how we need to operate across Magna. Third, the real challenge starts tomorrow. Take what you learned today and apply it. Ask yourself: Is this decision creating long-term value? Am I balancing growth with discipline? Am I adapting to changing conditions or clinging to outdated plans? Congratulations again to our winners, and thank you all for investing this time in becoming better leaders. Now go create value.',
      },
    ],
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; headerBg: string }> = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    headerBg: 'bg-blue-100',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    headerBg: 'bg-purple-100',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    headerBg: 'bg-emerald-100',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    headerBg: 'bg-amber-100',
  },
  slate: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-700',
    headerBg: 'bg-slate-100',
  },
};

export const FacilitatorAgenda: React.FC<FacilitatorAgendaProps> = ({ onBack }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(AGENDA_DATA.map((s) => s.id)) // All expanded by default
  );
  const [scriptModalRound, setScriptModalRound] = useState<number | null>(null);

  /**
   * Extracts the round number from an agenda item ID (e.g., 'round-1-setup' -> 1)
   */
  const getRoundFromItemId = (itemId: string): number | null => {
    const match = itemId.match(/round-(\d)-setup/);
    return match ? parseInt(match[1], 10) : null;
  };

  /**
   * Check if an item is a scenario introduction item that should be clickable
   */
  const isScenarioIntroItem = (itemId: string): boolean => {
    return itemId.includes('-setup');
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(AGENDA_DATA.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) {
      return `${mins}m`;
    }
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <MagnaLogo variant="color" size="xs" />
              <div className="flex items-center gap-2">
                <button
                  onClick={expandAll}
                  className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Collapse All
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Facilitator Agenda & Scripts
          </h1>
          <p className="text-slate-600">
            Minute-by-minute guide for running the Value Creation Challenge
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-slate-700">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Total Duration: 120 minutes</span>
            </div>
          </div>
        </div>

        {/* Timeline Overview */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Session Overview</h2>
          <div className="flex gap-1 h-8 rounded-lg overflow-hidden">
            {AGENDA_DATA.map((section) => {
              const widthPercent = (section.duration / 120) * 100;
              const colors = colorClasses[section.color] || colorClasses.slate;
              return (
                <div
                  key={section.id}
                  className={cn("relative group cursor-pointer", colors.headerBg)}
                  style={{ width: `${widthPercent}%` }}
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    {widthPercent > 8 && (
                      <span className={cn("text-xs font-medium truncate px-1", colors.text)}>
                        {section.duration}m
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                    <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {section.title} ({section.duration} min)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>0:00</span>
            <span>0:30</span>
            <span>1:00</span>
            <span>1:30</span>
            <span>2:00</span>
          </div>
        </div>

        {/* Detailed Agenda */}
        <div className="space-y-4">
          {AGENDA_DATA.map((section) => {
            const colors = colorClasses[section.color] || colorClasses.slate;
            const isExpanded = expandedSections.has(section.id);
            
            return (
              <div
                key={section.id}
                className={cn(
                  "bg-white border rounded-xl shadow-sm overflow-hidden",
                  colors.border
                )}
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 transition-colors",
                    colors.headerBg,
                    "hover:opacity-90"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {isExpanded ? (
                      <ChevronDown className={cn("w-5 h-5", colors.text)} />
                    ) : (
                      <ChevronRight className={cn("w-5 h-5", colors.text)} />
                    )}
                    <div className="text-left">
                      <h3 className={cn("text-lg font-semibold", colors.text)}>
                        {section.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-slate-600 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {section.duration} min
                        </span>
                        <span className="text-slate-400">|</span>
                        <span>{section.startMinute}:00 – {section.endMinute}:00</span>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Section Content */}
                {isExpanded && (
                  <div className="p-4 pt-0">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200">
                          <th className="text-left py-3 px-2 font-medium text-slate-600 w-[45%]">
                            What Happens
                          </th>
                          <th className="text-left py-3 px-2 font-medium text-slate-600 w-[15%]">
                            Speaker
                          </th>
                          <th className="text-center py-3 px-2 font-medium text-slate-600 w-[10%]">
                            Duration
                          </th>
                          <th className="text-center py-3 px-2 font-medium text-slate-600 w-[15%]">
                            Start
                          </th>
                          <th className="text-center py-3 px-2 font-medium text-slate-600 w-[15%]">
                            End
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.items.map((item) => {
                          const isRoundHeader = item.notes === 'section-header';
                          const isScenarioIntro = isScenarioIntroItem(item.id);
                          const roundNumber = isScenarioIntro ? getRoundFromItemId(item.id) : null;
                          
                          return (
                            <tr
                              key={item.id}
                              className={cn(
                                "border-b border-slate-100 last:border-0",
                                isRoundHeader && "bg-slate-50"
                              )}
                            >
                              <td className={cn(
                                "py-3 px-2",
                                isRoundHeader && "font-semibold text-slate-800"
                              )}>
                                <div className="whitespace-pre-line">
                                  {isScenarioIntro && roundNumber ? (
                                    <button
                                      onClick={() => setScriptModalRound(roundNumber)}
                                      className="text-left group flex items-center gap-2 hover:text-blue-600 transition-colors"
                                    >
                                      <span className="underline decoration-blue-300 decoration-2 underline-offset-2 group-hover:decoration-blue-500">
                                        {item.activity}
                                      </span>
                                      <ExternalLink className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                    </button>
                                  ) : (
                                    item.activity
                                  )}
                                </div>
                                {isScenarioIntro && roundNumber && (
                                  <div className="mt-2">
                                    <button
                                      onClick={() => setScriptModalRound(roundNumber)}
                                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-700 text-sm font-medium transition-colors"
                                    >
                                      <MessageSquare className="w-4 h-4" />
                                      View Round {roundNumber} Script
                                    </button>
                                  </div>
                                )}
                                {item.script && (
                                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center gap-2 text-blue-700 font-medium mb-1">
                                      <MessageSquare className="w-4 h-4" />
                                      Sample Script
                                    </div>
                                    <p className="text-blue-800 text-sm italic">
                                      "{item.script}"
                                    </p>
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-2">
                                {item.speaker && (
                                  <div className="flex items-center gap-1.5">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span className={cn(
                                      item.speaker === 'Teams' 
                                        ? 'text-emerald-600 font-medium' 
                                        : 'text-slate-700'
                                    )}>
                                      {item.speaker}
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-2 text-center">
                                {!isRoundHeader && (
                                  <span className="inline-flex items-center gap-1 text-slate-700">
                                    {item.duration}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-2 text-center font-mono text-slate-600">
                                {!isRoundHeader && item.startMinute}
                              </td>
                              <td className="py-3 px-2 text-center font-mono text-slate-600">
                                {!isRoundHeader && item.endMinute}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Scripts Section */}
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">Round Scripts</h2>
          </div>
          <p className="text-slate-600 mb-4">
            Click any "Scenario introduction" item above to view the full facilitator script, or use the quick links below:
          </p>
          <div className="grid grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5].map((round) => {
              const roundNames: Record<number, { name: string; color: string }> = {
                1: { name: 'Business as Usual', color: 'emerald' },
                2: { name: 'Business as Usual', color: 'emerald' },
                3: { name: 'Cost Pressures', color: 'amber' },
                4: { name: 'Recession', color: 'red' },
                5: { name: 'Recovery', color: 'blue' },
              };
              const info = roundNames[round];
              const colorStyles: Record<string, string> = {
                emerald: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700',
                amber: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700',
                red: 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700',
                blue: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700',
              };
              
              return (
                <button
                  key={round}
                  onClick={() => setScriptModalRound(round)}
                  className={cn(
                    "p-4 rounded-xl border text-center transition-colors",
                    colorStyles[info.color]
                  )}
                >
                  <div className="text-2xl font-bold mb-1">Round {round}</div>
                  <div className="text-sm opacity-80">{info.name}</div>
                </button>
              );
            })}
          </div>
        </div>
      </main>
      
      {/* Round Script Modal */}
      <RoundScriptModal
        round={scriptModalRound || 1}
        isOpen={scriptModalRound !== null}
        onClose={() => setScriptModalRound(null)}
        onChangeRound={(round) => setScriptModalRound(round)}
      />
    </div>
  );
};

FacilitatorAgenda.displayName = 'FacilitatorAgenda';
