export type Language = 'zh' | 'en';

export enum GamePhase {
  POLITICAL = "POLITICAL_MANEUVERING",
  SIEGE = "MILITARY_SIEGE",
  ESCAPE = "ESCAPE_AND_EVASION",
  CAPTURED = "CAPTURED_INTERROGATION",
  ENDED = "GAME_OVER"
}

export type AIProvider = 'gemini' | 'volcano' | 'local';

export interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  endpointId?: string; // For Volcano Engine (Model Endpoint ID)
  language: Language;
}

export interface PlayerStats {
  publicSupport: number; // 0-100
  militaryLoyalty: number; // 0-100
  securityLevel: number; // 0-100: Personal safety
  panic: number; // 0-100: Affects hallucinations/clarity
}

export interface StoryOption {
  id: string;
  text: string;
  type: 'aggressive' | 'diplomatic' | 'stealth' | 'desperate';
  risk: 'low' | 'medium' | 'high' | 'extreme';
  // Optional: Used for local mode pre-calculated outcomes
  outcome?: {
    narrative: string;
    statsDelta: Partial<PlayerStats>;
    isGameOver?: boolean;
    endingType?: 'victory' | 'death' | 'prison' | 'exile';
  };
}

export interface TurnData {
  narrative: string;
  newsTicker: string;
  location: string;
  time: string;
  imageUrl?: string;
  options: StoryOption[];
  statsDelta: Partial<PlayerStats>;
  isGameOver: boolean;
  endingType?: 'victory' | 'death' | 'prison' | 'exile';
}

export interface GameState {
  turnNumber: number;
  phase: GamePhase;
  stats: PlayerStats;
  history: {
    turn: number;
    narrativeSummary: string;
    choiceMade: string;
  }[];
  currentTurnData: TurnData | null;
  isLoading: boolean;
  error: string | null;
  language: Language;
}