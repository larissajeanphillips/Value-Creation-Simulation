/**
 * FacilitatorAgenda Component
 * 
 * Minute-by-minute agenda for facilitators with sample scripts.
 * Displays the full 120-minute session structure.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  ChevronDown, 
  ChevronRight,
  FileText,
  MessageSquare,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  MapPin,
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
        script: 'Good morning everyone. Before we get started, I want to remind you why we\'re here. Value creation is how we measure success—for our shareholders, our employees, and our customers. All year, we\'ve talked about disciplined capital allocation, operational excellence, and strategic positioning. Today, you\'ll experience firsthand the trade-offs and decisions that create—or destroy—shareholder value. This simulation puts you in the CEO seat. You\'ll have to balance short-term results with long-term positioning. The decisions you make will have real consequences in the game, just like they do in our business.',
      },
      {
        id: 'intro-2',
        activity: 'Introduce the Magna Value Creation Simulation explaining that we will challenge teams to put themselves in the CEO seat and make the decisions required to meet or beat Magna\'s Business Plan',
        speaker: 'Swamy',
        duration: 3,
        startMinute: 3,
        endMinute: 6,
        script: 'Now, let me introduce the Magna Value Creation Simulation. Over the next two hours, you and your team will step into the role of Magna\'s executive leadership. You\'ll face real market scenarios—some good, some tough—and make capital allocation decisions that determine your share price. Your mission is simple: maximize shareholder value over five simulated years. But as you\'ll see, simple doesn\'t mean easy. Every decision has trade-offs. Every investment has risk. And the market will judge your performance round after round. Phil will walk you through the mechanics. Good luck.',
      },
    ],
  },
  {
    id: 'overview',
    title: 'Challenge Overview',
    duration: 13,
    startMinute: 6,
    endMinute: 19,
    color: 'purple',
    items: [
      {
        id: 'overview-0',
        activity: 'Role Types & Decision Ownership\n• Growth Officer – owns Grow decisions\n• COO – owns Sustain decisions\n• Transformation Officer – owns Optimize decisions\n• CFO – enters decisions, ultimate accountability for results',
        speaker: 'Phil',
        duration: 3,
        startMinute: 6,
        endMinute: 9,
        script: 'Before we dive into the mechanics, let me explain how decisions work in this simulation. Each team has four key roles that mirror real executive accountability. Your Growth Officer owns decisions in the Grow category—these drive revenue growth through new products, markets, and capabilities. Your COO owns the Sustain decisions—these protect against risks and ensure business continuity. Your Transformation Officer owns the Optimize decisions—these improve margins and operational efficiency. And critically, your CFO enters all decisions into the system and has ultimate ownership accountability for results. In real life, the CFO is the one who stands up in front of investors and explains your performance. Same here. Discuss as a team, but the CFO submits and owns the outcome.',
      },
      {
        id: 'overview-1',
        activity: 'Objective: Understand business decisions and tradeoffs to drive EPS and growth\n• Drivers of growth\n• Alignment of strategy and execution',
        speaker: 'Phil',
        duration: 2,
        startMinute: 9,
        endMinute: 11,
        script: 'Thank you, Swamy. Let me explain what we\'re trying to accomplish today. The goal of this challenge is simple: help you experience firsthand the business decisions and trade-offs that drive earnings per share and growth. You\'ll feel the tension between investing for the future and delivering results today. You\'ll see how strategic choices add up over time. And you\'ll see why getting strategy and execution aligned is so critical. Every decision you make will impact multiple levers: revenue growth, margins, capital efficiency, and ultimately, your share price.',
      },
      {
        id: 'overview-2',
        activity: 'Structure: 5 scenarios, 10 min time constraints',
        speaker: 'Phil',
        duration: 1,
        startMinute: 11,
        endMinute: 12,
        script: 'Here\'s how the challenge works. You\'ll play through 5 rounds, each representing a fiscal year. Each round has a different market scenario—some stable, some turbulent. For each round, you\'ll have exactly 10 minutes to discuss as a team and submit your capital allocation decisions. When time runs out, decisions lock automatically. No extensions, no exceptions. Just like in real business, indecision is a decision.',
      },
      {
        id: 'overview-3',
        activity: 'Rules: fixed capital pool, limited decisions per round',
        speaker: 'Phil',
        duration: 3,
        startMinute: 12,
        endMinute: 15,
        script: 'Now for the rules. Each round, you\'ll have a fixed pool of capital to allocate. You cannot spend more than you have. You must choose from a set of investment options across different categories: growth initiatives, operational improvements, M&A opportunities, and shareholder returns. You cannot select all options—you must prioritize. Some investments take time to pay off. Others deliver immediate results but may limit future flexibility. Read the decision cards carefully. The details matter. And remember: you\'re competing against every other team in this room. Your relative performance determines the winner.',
      },
      {
        id: 'overview-4',
        activity: 'Scoring: Winner has highest Share Price by end of Round 5',
        speaker: 'Phil',
        duration: 1,
        startMinute: 15,
        endMinute: 16,
        script: 'Scoring is straightforward. The winning team is the one with the highest share price at the end of Round 5. Share price is calculated based on your earnings growth, return on invested capital, and strategic positioning. We\'ll show rankings after each round, so you\'ll always know where you stand. But don\'t get too focused on short-term rankings—sometimes the best strategy requires patience.',
      },
      {
        id: 'overview-5',
        activity: 'Q&A',
        speaker: 'Phil',
        duration: 3,
        startMinute: 16,
        endMinute: 19,
        script: 'Before we begin, does anyone have questions about the rules or mechanics? [PAUSE FOR QUESTIONS] Common questions: Yes, decisions are final once submitted. No, you cannot change allocations after the timer ends. Yes, you can see what decisions other teams made—but only after the round ends. Any other questions? [PAUSE] Great. Let\'s begin Round 1.',
      },
    ],
  },
  {
    id: 'rounds',
    title: 'Rounds',
    duration: 85,
    startMinute: 19,
    endMinute: 104,
    color: 'emerald',
    items: [
      // Round 1
      {
        id: 'round-1-header',
        activity: 'Round 1: Business as usual',
        speaker: '',
        duration: 16,
        startMinute: 19,
        endMinute: 35,
        notes: 'section-header',
      },
      {
        id: 'round-1-setup',
        activity: 'Scenario introduction & market context',
        speaker: 'Phil',
        duration: 2,
        startMinute: 19,
        endMinute: 21,
        script: 'The year is FY26. The automotive market has stabilized. After years of supply chain disruptions and semiconductor shortages, we\'re finally operating in a more predictable environment. Vehicle demand is steady—nothing extraordinary, but solid. This is "business as usual." Your decisions today will set the foundation for everything that follows. You have a fixed capital pool to allocate across growth initiatives, operational improvements, and shareholder returns. You have 10 minutes to make your capital allocation decisions.',
      },
      {
        id: 'round-1-decision',
        activity: 'Team discussion & capital allocation',
        speaker: 'Teams',
        duration: 10,
        startMinute: 21,
        endMinute: 31,
        script: '[FACILITATOR: Walk the room. Listen to team discussions. Note interesting debates for later debrief. Announce time remaining at 5 minutes, 2 minutes, and 30 seconds.]',
      },
      {
        id: 'round-1-lock',
        activity: 'Decisions locked',
        speaker: 'Phil',
        duration: 1,
        startMinute: 31,
        endMinute: 32,
        script: 'Time! Decisions are now locked. If you didn\'t submit, your capital remains unallocated—which is rarely the optimal choice. Let\'s see how the market responds to your decisions.',
      },
      {
        id: 'round-1-results',
        activity: 'Results & recap reading',
        speaker: 'Phil',
        duration: 3,
        startMinute: 32,
        endMinute: 35,
        script: 'Let\'s look at the results from Round 1. [SHOW SCOREBOARD] You can see how each team\'s share price has moved based on their capital allocation decisions. Some of you invested heavily in growth. Others focused on operational efficiency. A few returned capital to shareholders. All valid strategies—but the market is starting to differentiate. Notice how [HIGHEST TEAM] has taken an early lead. Let\'s see if they can maintain it as conditions change. On to Round 2.',
      },
      // Round 2
      {
        id: 'round-2-header',
        activity: 'Round 2: Business as usual',
        speaker: '',
        duration: 16,
        startMinute: 35,
        endMinute: 51,
        notes: 'section-header',
      },
      {
        id: 'round-2-setup',
        activity: 'Scenario introduction',
        speaker: 'Phil',
        duration: 2,
        startMinute: 35,
        endMinute: 37,
        script: 'The year is now FY27. The good news: conditions remain favorable. Technology investments are progressing as expected. OEM order books are healthy, and those who invested in advanced capabilities last round may be starting to see early returns. Look around the room—some teams made very different decisions in Round 1. The market hasn\'t differentiated yet, but it will. You have 10 minutes. Your decisions are due when the timer ends.',
      },
      {
        id: 'round-2-decision',
        activity: 'Team discussion & capital allocation',
        speaker: 'Teams',
        duration: 10,
        startMinute: 37,
        endMinute: 47,
        script: '[FACILITATOR: Continue walking the room. Listen for teams adjusting strategy based on Round 1 results. Note if any teams are doubling down vs. pivoting. Announce time remaining at 5 minutes, 2 minutes, and 30 seconds.]',
      },
      {
        id: 'round-2-lock',
        activity: 'Decisions locked',
        speaker: 'Phil',
        duration: 1,
        startMinute: 47,
        endMinute: 48,
        script: 'Time! Decisions are locked. Two rounds down, three to go. The foundation you\'re building now will matter when conditions get tougher.',
      },
      {
        id: 'round-2-results',
        activity: 'Results & recap',
        speaker: 'Phil',
        duration: 3,
        startMinute: 48,
        endMinute: 51,
        script: 'Round 2 results are in. [SHOW SCOREBOARD] The pack is starting to spread. Some early investments are beginning to pay dividends, while others are still in build mode. Look at the gap between the top and bottom performers—it\'s widening. For those in the lead: don\'t get complacent. For those trailing: there\'s still time, but the clock is ticking. Here\'s what you need to know about Round 3: the environment is about to change. Cost pressures are coming.',
      },
      // Round 3
      {
        id: 'round-3-header',
        activity: 'Round 3: Cost pressures',
        speaker: '',
        duration: 16,
        startMinute: 51,
        endMinute: 67,
        notes: 'section-header',
      },
      {
        id: 'round-3-setup',
        activity: 'Scenario introduction',
        speaker: 'Phil',
        duration: 2,
        startMinute: 51,
        endMinute: 53,
        script: 'Round 3. The year is FY28. And the environment has changed. Costs are rising significantly—steel, aluminum, and key commodities are up 15 to 20 percent. Energy costs have spiked. Labor markets are tight. But here\'s the real pressure: your OEM customers aren\'t absorbing these costs. They\'re demanding price reductions. This is the squeeze that separates good companies from great ones. You have 10 minutes to navigate this challenge.',
      },
      {
        id: 'round-3-decision',
        activity: 'Team discussion & capital allocation',
        speaker: 'Teams',
        duration: 10,
        startMinute: 53,
        endMinute: 63,
        script: '[FACILITATOR: This round tests operational discipline. Watch for teams that panic vs. stay strategic. Note teams that protect margins vs. those that try to grow through the pressure. Announce time remaining at 5 minutes, 2 minutes, and 30 seconds.]',
      },
      {
        id: 'round-3-lock',
        activity: 'Decisions locked',
        speaker: 'Phil',
        duration: 1,
        startMinute: 63,
        endMinute: 64,
        script: 'Decisions locked. Cost pressures test your operational resilience. Let\'s see who maintained discipline and who got squeezed.',
      },
      {
        id: 'round-3-results',
        activity: 'Results & recap',
        speaker: 'Phil',
        duration: 3,
        startMinute: 64,
        endMinute: 67,
        script: 'Round 3 results. [SHOW SCOREBOARD] Cost pressures have shaken up the rankings. Some teams that invested in operational excellence earlier are now reaping the benefits—their margins held up better than competitors. Others saw their profits squeezed by the rising costs. This is a common pattern in business: the best time to prepare for a storm is when the sun is shining. Now, I have to warn you: Round 4 will test you even further. The scenario you\'re about to face will require you to adapt quickly.',
      },
      // Round 4
      {
        id: 'round-4-header',
        activity: 'Round 4: Recession',
        speaker: '',
        duration: 20,
        startMinute: 67,
        endMinute: 87,
        notes: 'section-header',
      },
      {
        id: 'round-4-setup',
        activity: 'Scenario introduction',
        speaker: 'Phil',
        duration: 2,
        startMinute: 67,
        endMinute: 69,
        script: 'Round 4. FY29. The market shows signs of cooling, but nothing dramatic. Consumer confidence has softened. Some OEMs are adjusting production forecasts downward. It feels like a typical cyclical adjustment. Begin your deliberations... [NOTE: After 2 minutes, interrupt with the recession announcement using the item below.]',
      },
      {
        id: 'round-4-decision-1',
        activity: 'Team discussion & capital allocation',
        speaker: 'Teams',
        duration: 2,
        startMinute: 69,
        endMinute: 71,
        script: '[FACILITATOR: Let teams start deliberating normally. They think this is a standard round. After 2 minutes, you will interrupt with the recession announcement. Watch for initial strategies that are about to be disrupted.]',
      },
      {
        id: 'round-4-recession',
        activity: 'Recession announcement is made and teams must re-calibrate decisions',
        speaker: 'Phil',
        duration: 2,
        startMinute: 71,
        endMinute: 73,
        script: 'STOP! Everyone, stop what you\'re doing. I have breaking news. [PAUSE FOR DRAMATIC EFFECT] The economy has just entered a recession. Vehicle sales are collapsing—down 20 to 25 percent from peak. OEMs are canceling programs. Credit markets are tightening. Several of your smaller competitors are facing bankruptcy. This changes everything. The decisions you were about to make? You need to reconsider them. Your capital allocation must now account for a dramatically different environment. The timer continues. You have 10 more minutes to recalibrate your strategy. Go!',
      },
      {
        id: 'round-4-decision-2',
        activity: 'Team discussion & capital allocation',
        speaker: 'Teams',
        duration: 10,
        startMinute: 73,
        endMinute: 83,
        script: '[FACILITATOR: Watch for how teams respond to the shock. Some will panic. Some will see opportunity. Note the different crisis management styles. Announce time remaining at 5 minutes, 2 minutes, and 30 seconds.]',
      },
      {
        id: 'round-4-lock',
        activity: 'Decisions locked',
        speaker: 'Phil',
        duration: 1,
        startMinute: 83,
        endMinute: 84,
        script: 'Decisions locked. The recession tests not just your strategy, but your ability to adapt under pressure. Some of you protected cash. Some saw acquisition opportunities. Let\'s see who read the situation correctly.',
      },
      {
        id: 'round-4-results',
        activity: 'Results & recap',
        speaker: 'Phil',
        duration: 3,
        startMinute: 84,
        endMinute: 87,
        script: 'Round 4 results—the recession round. [SHOW SCOREBOARD] This round separated the strong from the weak. Look at the share prices—some teams lost real value, while others held steady or even gained. In a real recession, companies with strong balance sheets survive. Companies that overextended get hurt. Notice how teams with financial flexibility had more options. Those who bet everything on growth got caught. One round left. The recovery is coming. The question is: are you positioned to capture it?',
      },
      // Round 5
      {
        id: 'round-5-header',
        activity: 'Round 5: Recovery',
        speaker: '',
        duration: 17,
        startMinute: 87,
        endMinute: 104,
        notes: 'section-header',
      },
      {
        id: 'round-5-setup',
        activity: 'Final scenario introduction',
        speaker: 'Phil',
        duration: 2,
        startMinute: 87,
        endMinute: 89,
        script: 'Final round. Round 5. The year is FY30. The storm has passed. The economy is recovering. Consumer confidence is rebounding. OEMs are ramping production back up. Pent-up demand is creating opportunities across every segment. But not everyone is positioned to capture it. The teams that maintained their capabilities through the downturn are now positioned to win. This is your final allocation—your last chance to shape Magna\'s trajectory. You have 10 minutes.',
      },
      {
        id: 'round-5-decision',
        activity: 'Final team discussion & capital allocation',
        speaker: 'Teams',
        duration: 10,
        startMinute: 89,
        endMinute: 99,
        script: '[FACILITATOR: Final round energy! This is where winners are made. Watch for aggressive plays from trailing teams and defensive moves from leaders. Note teams going for M&A opportunities. Announce time remaining at 5 minutes, 2 minutes, 1 minute, and final countdown from 10 seconds.]',
      },
      {
        id: 'round-5-lock',
        activity: 'Decisions locked',
        speaker: 'Phil',
        duration: 1,
        startMinute: 99,
        endMinute: 100,
        script: 'Final decisions are LOCKED! That\'s it—five years of capital allocation decisions are done. Now we see who created the most shareholder value.',
      },
      {
        id: 'round-5-results',
        activity: 'Final results & recap',
        speaker: 'Phil',
        duration: 4,
        startMinute: 100,
        endMinute: 104,
        script: 'Alright, let\'s see the final results. [SHOW FINAL SCOREBOARD - BUILD SUSPENSE] In fifth place... [TEAM NAME] with a share price of [X]. Fourth place... [TEAM NAME]. Third place... [TEAM NAME]. In second place... [TEAM NAME] with a share price of [X]. And the winner of the Value Creation Simulation... [PAUSE] [TEAM NAME] with a final share price of [X]! [APPLAUSE] Congratulations. But before we celebrate, let\'s talk about what we learned today.',
      },
    ],
  },
  {
    id: 'takeaways',
    title: 'Takeaways & Debrief',
    duration: 14,
    startMinute: 104,
    endMinute: 118,
    color: 'amber',
    items: [
      {
        id: 'takeaways-1',
        activity: 'Simulation Takeaways: Overall TSR results & patterns',
        speaker: 'Phil',
        duration: 7,
        startMinute: 104,
        endMinute: 111,
        script: 'Let\'s look at what drove the results today. [SHOW ANALYTICS DASHBOARD] Looking across all teams, a few clear patterns stand out. First, balance matters. Teams that went all-in on any single strategy—whether aggressive growth or pure cost-cutting—generally underperformed. The winners invested in the future while keeping operational discipline. Second, timing matters. Early investments in capabilities paid off when things got tough. Teams that waited until the recession to cut costs were already behind. Third, adaptability matters. The recession round showed who could pivot fast versus who was stuck in their strategy. Look at these numbers: [SHOW TSR BREAKDOWN]. The gap between the top and bottom teams is [X]%. That\'s the difference between creating value and destroying it. Every decision you made—or didn\'t make—contributed to that gap.',
      },
      {
        id: 'takeaways-2',
        activity: 'Simulation Debrief: Discussion on trade-offs & lessons',
        speaker: 'Phil',
        duration: 7,
        startMinute: 111,
        endMinute: 118,
        script: 'Now I want to hear from you. What surprised you? [PAUSE - TAKE 2-3 RESPONSES] What was the toughest trade-off you faced? [PAUSE - TAKE 2-3 RESPONSES] Winning team: what was your strategy? Walk us through it. [PAUSE - LET WINNING TEAM EXPLAIN] For a team that struggled: where do you think it went wrong? [PAUSE - BE SUPPORTIVE, FOCUS ON LEARNING] Here\'s what I want you to take back to your jobs: These aren\'t hypothetical decisions. Every quarter, Magna\'s leadership faces the same trade-offs. Growth versus margins. Short-term versus long-term. Defense versus offense. The difference is, in the real world, you don\'t get five rounds—you get one shot. The discipline and thinking you practiced today is exactly what we need every day.',
      },
    ],
  },
  {
    id: 'closing',
    title: 'Closing',
    duration: 5,
    startMinute: 118,
    endMinute: 123,
    color: 'slate',
    items: [
      {
        id: 'closing-1',
        activity: 'Closing messages & reflections',
        speaker: 'Swamy',
        duration: 5,
        startMinute: 118,
        endMinute: 123,
        script: 'Thank you all for your energy today. I saw great strategic thinking, good debate, and real learning happening in this room. Let me leave you with three things. First, value creation is a choice. Every day, every decision, you\'re either creating value or destroying it. We compressed years into hours today, but the principles are the same. Second, we win as a team. The best-performing groups today weren\'t dominated by one voice—they used different perspectives and made better decisions because of it. That\'s how we need to operate across Magna. Third, the real challenge starts tomorrow. Take what you learned today and use it. Ask yourself: Is this decision creating long-term value? Am I balancing growth with discipline? Am I adapting to change or sticking to old plans? Congratulations to our winners. Thank you all for your time today. Now let\'s go create value.',
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
  
  // Session timer state
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  /**
   * Timer effect - updates elapsed time every second when running
   */
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerRunning && sessionStartTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - sessionStartTime) / 1000);
        setElapsedSeconds(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, sessionStartTime]);

  /**
   * Start the session timer
   */
  const startTimer = useCallback(() => {
    if (!sessionStartTime) {
      setSessionStartTime(Date.now());
    } else {
      // Resume from pause - adjust start time to account for elapsed
      setSessionStartTime(Date.now() - elapsedSeconds * 1000);
    }
    setIsTimerRunning(true);
  }, [sessionStartTime, elapsedSeconds]);

  /**
   * Pause the session timer
   */
  const pauseTimer = useCallback(() => {
    setIsTimerRunning(false);
  }, []);

  /**
   * Reset the session timer
   */
  const resetTimer = useCallback(() => {
    setIsTimerRunning(false);
    setSessionStartTime(null);
    setElapsedSeconds(0);
  }, []);

  /**
   * Get elapsed minutes for agenda positioning
   */
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  /**
   * Find the current agenda section and item based on elapsed time
   */
  const getCurrentAgendaPosition = useCallback(() => {
    let currentSection: AgendaSection | null = null;
    let currentItem: AgendaItem | null = null;
    let nextItem: AgendaItem | null = null;

    for (const section of AGENDA_DATA) {
      if (elapsedMinutes >= section.startMinute && elapsedMinutes < section.endMinute) {
        currentSection = section;
        
        for (let i = 0; i < section.items.length; i++) {
          const item = section.items[i];
          if (item.notes === 'section-header') continue;
          
          if (elapsedMinutes >= item.startMinute && elapsedMinutes < item.endMinute) {
            currentItem = item;
            // Find next non-header item
            for (let j = i + 1; j < section.items.length; j++) {
              if (section.items[j].notes !== 'section-header') {
                nextItem = section.items[j];
                break;
              }
            }
            break;
          }
        }
        break;
      }
    }

    // If past last section, mark as complete
    if (elapsedMinutes >= 120) {
      return {
        currentSection: AGENDA_DATA[AGENDA_DATA.length - 1],
        currentItem: null,
        nextItem: null,
        isComplete: true,
      };
    }

    return { currentSection, currentItem, nextItem, isComplete: false };
  }, [elapsedMinutes]);

  const agendaPosition = getCurrentAgendaPosition();

  /**
   * Format seconds as MM:SS or HH:MM:SS
   */
  const formatElapsedTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Check if an item is currently active based on elapsed time
   */
  const isItemActive = (item: AgendaItem): boolean => {
    if (!isTimerRunning && elapsedSeconds === 0) return false;
    return elapsedMinutes >= item.startMinute && elapsedMinutes < item.endMinute;
  };

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
            Minute-by-minute guide for running the Value Creation Simulation
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
                          <th className="text-left py-3 px-2 font-medium text-slate-600" style={{ width: '75%' }}>
                            What Happens
                          </th>
                          <th className="text-left py-3 px-1 font-medium text-slate-600" style={{ width: '10%' }}>
                            Speaker
                          </th>
                          <th className="text-center py-3 px-1 font-medium text-slate-600" style={{ width: '5%' }}>
                            Min
                          </th>
                          <th className="text-center py-3 px-1 font-medium text-slate-600" style={{ width: '5%' }}>
                            Start
                          </th>
                          <th className="text-center py-3 px-1 font-medium text-slate-600" style={{ width: '5%' }}>
                            End
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.items.map((item) => {
                          const isRoundHeader = item.notes === 'section-header';
                          const isScenarioIntro = isScenarioIntroItem(item.id);
                          const roundNumber = isScenarioIntro ? getRoundFromItemId(item.id) : null;
                          const isActive = !isRoundHeader && isItemActive(item);
                          
                          return (
                            <tr
                              key={item.id}
                              className={cn(
                                "border-b border-slate-100 last:border-0 transition-colors",
                                isRoundHeader && "bg-slate-50",
                                isActive && "bg-emerald-50 border-l-4 border-l-emerald-500"
                              )}
                            >
                              <td className={cn(
                                "py-3 px-2",
                                isRoundHeader && "font-semibold text-slate-800"
                              )}>
                                {isActive && (
                                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full mb-2">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                    NOW
                                  </div>
                                )}
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
                              <td className="py-3 px-1">
                                {item.speaker && (
                                  <div className="flex items-center gap-1">
                                    <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                    <span className={cn(
                                      "text-xs",
                                      item.speaker === 'Teams' 
                                        ? 'text-emerald-600 font-medium' 
                                        : 'text-slate-700'
                                    )}>
                                      {item.speaker}
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-1 text-center text-xs">
                                {!isRoundHeader && (
                                  <span className="text-slate-700">
                                    {item.duration}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-1 text-center font-mono text-xs text-slate-600">
                                {!isRoundHeader && item.startMinute}
                              </td>
                              <td className="py-3 px-1 text-center font-mono text-xs text-slate-600">
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
