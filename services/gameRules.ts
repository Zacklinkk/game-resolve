// =========================================================================
// GAME RULES ENGINE
// =========================================================================
// This module contains the intelligent rule engine from the temporary folder.
// It handles:
// - Side quest triggers based on player choices
// - Hidden ending conditions
// - Dynamic event branching logic
// =========================================================================

import { PlayerStats } from '../types';

export interface GameFlags {
  hasBitcoin?: boolean;
  hasNuclearButton?: boolean;
  savedDog?: boolean;
  metDoubleAgent?: boolean;
  foundRuins?: boolean;
  usedSatPhone?: boolean;
  releasedPrisoner?: boolean;
  usedNarcoSub?: boolean;
  visitedChurch?: boolean;
  metOldWoman?: boolean;
  burnedDiary?: boolean;
  smokedLastCigar?: boolean;
}

export interface GameContext {
  turnNumber: number;
  stats: PlayerStats;
  flags: GameFlags;
  choiceHistory: string[];
  currentEventId: string;
}

// =========================================================================
// SIDE QUEST TRIGGERS
// =========================================================================

export function checkSideQuestTriggers(context: GameContext): string | null {
  const { turnNumber, stats, flags, currentEventId } = context;

  // Side quests unlock after turn 20 (main escape phase)
  if (turnNumber < 20) return null;

  // Bitcoin heist trigger (Event 101-110)
  if (currentEventId.startsWith('evt_') && 
      parseInt(currentEventId.split('_')[1]) >= 40 && 
      parseInt(currentEventId.split('_')[1]) <= 60 &&
      !flags.hasBitcoin &&
      Math.random() < 0.15) {
    return 'evt_101'; // Bitcoin heist start
  }

  // Nuclear briefcase trigger (Event 111-120)
  if (currentEventId.startsWith('evt_') &&
      parseInt(currentEventId.split('_')[1]) >= 50 &&
      parseInt(currentEventId.split('_')[1]) <= 70 &&
      !flags.hasNuclearButton &&
      stats.militaryLoyalty > 40 &&
      Math.random() < 0.12) {
    return 'evt_111'; // Nuclear briefcase start
  }

  // Mysterious contacts trigger (Event 121-130)
  if (stats.securityLevel < 30 &&
      turnNumber > 30 &&
      Math.random() < 0.1) {
    return 'evt_121'; // Mysterious contact start
  }

  // Character development triggers (Event 141-160)
  if (turnNumber > 35 && Math.random() < 0.08) {
    const characterEvents = [141, 142, 143, 144, 145, 150, 151, 152, 153, 154];
    const randomEvent = characterEvents[Math.floor(Math.random() * characterEvents.length)];
    return `evt_${randomEvent}`;
  }

  return null;
}

// =========================================================================
// HIDDEN ENDING CONDITIONS
// =========================================================================

export interface EndingCondition {
  id: string;
  name: string;
  check: (context: GameContext) => boolean;
  eventId: string;
  priority: number; // Higher priority endings are checked first
}

export const HIDDEN_ENDINGS: EndingCondition[] = [
  // True Survivor - The secret best ending
  {
    id: 'true_survivor',
    name: 'True Survivor (Hidden)',
    check: (context) => {
      return (
        context.flags.hasBitcoin === true &&
        context.flags.hasNuclearButton === true &&
        context.stats.publicSupport > 60 &&
        context.stats.militaryLoyalty > 50 &&
        context.stats.securityLevel > 70 &&
        context.turnNumber > 50
      );
    },
    eventId: 'evt_190',
    priority: 100
  },
  // The Martyr - Die fighting
  {
    id: 'martyr',
    name: 'The Immortal (Martyr)',
    check: (context) => {
      return (
        context.stats.militaryLoyalty > 50 &&
        context.stats.securityLevel < 20 &&
        context.choiceHistory.filter(c => c.includes('aggressive')).length > 10
      );
    },
    eventId: 'evt_182',
    priority: 80
  },
  // The Exile - Escape successfully
  {
    id: 'exile',
    name: 'The Exile',
    check: (context) => {
      return (
        context.stats.securityLevel > 60 &&
        (context.flags.usedNarcoSub === true || context.turnNumber > 45) &&
        context.stats.militaryLoyalty > 20
      );
    },
    eventId: 'evt_183',
    priority: 70
  },
  // The Warlord - Survive in the jungle
  {
    id: 'warlord',
    name: 'The Warlord (Jungle King)',
    check: (context) => {
      return (
        context.stats.militaryLoyalty > 40 &&
        context.turnNumber > 50 &&
        context.choiceHistory.filter(c => c.includes('jungle')).length > 5 &&
        context.stats.securityLevel > 30
      );
    },
    eventId: 'evt_185',
    priority: 75
  },
  // The Prisoner - Captured
  {
    id: 'prisoner',
    name: 'The Prisoner',
    check: (context) => {
      return (
        context.stats.securityLevel < 10 ||
        (context.stats.militaryLoyalty < 20 && context.stats.securityLevel < 30)
      );
    },
    eventId: 'evt_184',
    priority: 60
  }
];

export function checkEndingConditions(context: GameContext): string | null {
  // Check for game over conditions first
  if (context.stats.securityLevel <= 0) {
    return 'END_PRISON'; // Captured/Killed
  }
  
  if (context.stats.panic >= 95) {
    return 'END_MARTYR'; // Mental breakdown / suicide
  }
  
  if (context.stats.militaryLoyalty <= 0) {
    return 'END_PRISON'; // Betrayed by own guards
  }

  // Check hidden endings in priority order
  const sortedEndings = [...HIDDEN_ENDINGS].sort((a, b) => b.priority - a.priority);
  
  for (const ending of sortedEndings) {
    if (ending.check(context)) {
      return ending.eventId;
    }
  }

  return null;
}

// =========================================================================
// DYNAMIC EVENT SELECTION
// =========================================================================

export function selectNextEvent(
  context: GameContext,
  playerChoiceId: string,
  defaultNextEventId: string
): string {
  // First check if we should trigger an ending
  const endingEvent = checkEndingConditions(context);
  if (endingEvent) return endingEvent;

  // Check for side quest triggers
  const sideQuestEvent = checkSideQuestTriggers(context);
  if (sideQuestEvent) return sideQuestEvent;

  // Use default progression
  return defaultNextEventId;
}

// =========================================================================
// STATS CALCULATION HELPERS
// =========================================================================

export function applyStatsDelta(
  currentStats: PlayerStats,
  delta: Partial<PlayerStats>
): PlayerStats {
  const newStats = { ...currentStats };

  // Apply deltas with bounds checking
  if (delta.publicSupport !== undefined) {
    newStats.publicSupport = Math.max(0, Math.min(100, 
      currentStats.publicSupport + delta.publicSupport));
  }
  
  if (delta.militaryLoyalty !== undefined) {
    newStats.militaryLoyalty = Math.max(0, Math.min(100, 
      currentStats.militaryLoyalty + delta.militaryLoyalty));
  }
  
  if (delta.securityLevel !== undefined) {
    newStats.securityLevel = Math.max(0, Math.min(100, 
      currentStats.securityLevel + delta.securityLevel));
  }
  
  if (delta.panic !== undefined) {
    newStats.panic = Math.max(0, Math.min(100, 
      currentStats.panic + delta.panic));
  }

  return newStats;
}

// Calculate panic based on other stats (inverse relationship)
export function calculatePanic(stats: PlayerStats): number {
  const avgSafety = (stats.militaryLoyalty + stats.securityLevel) / 2;
  const basePanic = 100 - avgSafety;
  return Math.max(0, Math.min(100, basePanic));
}