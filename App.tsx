import React, { useState, useEffect } from 'react';
import { GameState, GamePhase, TurnData, AIConfig, Language } from './types';
import { INITIAL_STATS } from './constants';
import { initializeAI, generateNextTurn } from './services/geminiService';
import { StartScreen } from './components/StartScreen';
import { GameUI } from './components/GameUI';
import { EndingScreen } from './components/EndingScreen';
import { AlertTriangle, RefreshCw, Power } from 'lucide-react';

const LOADING_TEXTS_ZH = [
  "正在建立加密卫星连接...",
  "同步加拉加斯战术地图...",
  "计算地缘政治蝴蝶效应...",
  "解密敌方通讯频道...",
  "加载历史决策树...",
  "分析公众情绪数据...",
  "渲染战术模拟层..."
];

const LOADING_TEXTS_EN = [
  "ESTABLISHING ENCRYPTED SAT-LINK...",
  "SYNCING TACTICAL MAPS...",
  "CALCULATING GEOPOLITICAL BUTTERFLY EFFECT...",
  "DECRYPTING ENEMY CHANNELS...",
  "LOADING DECISION TREES...",
  "ANALYZING PUBLIC SENTIMENT...",
  "RENDERING TACTICAL LAYER..."
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    turnNumber: 0,
    phase: GamePhase.POLITICAL,
    stats: INITIAL_STATS,
    history: [],
    currentTurnData: null,
    isLoading: false,
    error: null,
    language: 'zh'
  });

  const [hasStarted, setHasStarted] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<AIConfig | null>(null);
  
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("");

  const texts = gameState.language === 'zh' ? LOADING_TEXTS_ZH : LOADING_TEXTS_EN;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (gameState.isLoading) {
      setLoadingProgress(0);
      setLoadingText(texts[0]);
      
      interval = setInterval(() => {
        setLoadingProgress(prev => {
          const remaining = 100 - prev;
          const increment = Math.max(0.1, Math.random() * (remaining / 10)); 
          const next = prev + increment;
          
          if (next > 20 && next < 25) setLoadingText(texts[1]);
          if (next > 40 && next < 45) setLoadingText(texts[2]);
          if (next > 60 && next < 65) setLoadingText(texts[3]);
          if (next > 80 && next < 85) setLoadingText(texts[4]);
          
          return next >= 95 ? 95 : next;
        });
      }, 200);
    } else {
      setLoadingProgress(100);
    }
    return () => clearInterval(interval);
  }, [gameState.isLoading, gameState.language]);

  const handleStart = async (config: AIConfig) => {
    try {
      setCurrentConfig(config);
      initializeAI(config);
      setHasStarted(true);
      
      // Ensure fresh state on start
      const cleanState = {
        turnNumber: 0,
        phase: GamePhase.POLITICAL,
        stats: INITIAL_STATS,
        history: [],
        currentTurnData: null,
        isLoading: true,
        error: null,
        language: config.language
      };
      setGameState(cleanState);
      
      const firstTurn = await generateNextTurn({ ...cleanState, turnNumber: 1 }, null);
      
      setGameState(prev => ({
        ...prev,
        turnNumber: 1,
        currentTurnData: firstTurn,
        isLoading: false
      }));
    } catch (e: any) {
      console.error("Initialization Error:", e);
      let errorMessage = config.language === 'zh' ? "连接建立失败" : "Connection Failed";
      if (e.message && e.message.includes("fetch")) {
        errorMessage = config.language === 'zh' ? "网络连接错误 (CORS/Network)" : "Network Error (CORS)";
      } else if (e.message) {
        errorMessage = e.message;
      }
      setGameState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  };

  const handleOptionSelect = async (optionId: string, text: string) => {
    if (gameState.isLoading) return;

    const newHistory = [
      ...gameState.history,
      {
        turn: gameState.turnNumber,
        narrativeSummary: gameState.currentTurnData?.narrative.slice(0, 100) || "",
        choiceMade: text
      }
    ];

    let nextPhase = gameState.phase;
    if (gameState.turnNumber > 10) nextPhase = GamePhase.SIEGE;
    if (gameState.turnNumber > 25) nextPhase = GamePhase.ESCAPE;

    const currentStatsDelta = gameState.currentTurnData?.statsDelta || {};
    const nextStats = {
      publicSupport: Math.max(0, Math.min(100, gameState.stats.publicSupport + (currentStatsDelta.publicSupport || 0))),
      militaryLoyalty: Math.max(0, Math.min(100, gameState.stats.militaryLoyalty + (currentStatsDelta.militaryLoyalty || 0))),
      securityLevel: Math.max(0, Math.min(100, gameState.stats.securityLevel + (currentStatsDelta.securityLevel || 0))),
      panic: Math.max(0, Math.min(100, gameState.stats.panic + (currentStatsDelta.panic || 0))),
    };

    setGameState(prev => ({
      ...prev,
      isLoading: true,
      history: newHistory,
      phase: nextPhase,
      stats: nextStats,
      error: null
    }));

    try {
      const nextTurnData = await generateNextTurn({
        ...gameState,
        turnNumber: gameState.turnNumber + 1,
        history: newHistory,
        stats: nextStats,
        phase: nextPhase
      }, text);

      setGameState(prev => ({
        ...prev,
        turnNumber: prev.turnNumber + 1,
        currentTurnData: nextTurnData,
        isLoading: false
      }));
    } catch (e: any) {
      console.error("Turn Generation Error:", e);
      let errorMessage = gameState.language === 'zh' ? "通讯中断" : "Signal Lost";
      if (e.message) errorMessage = e.message;
      setGameState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  };

  const handleReboot = () => {
    setGameState(prev => ({ 
      ...prev, 
      error: null, 
      isLoading: false, 
      turnNumber: 0, 
      history: [], 
      currentTurnData: null,
      stats: INITIAL_STATS,
      phase: GamePhase.POLITICAL
    }));
    setHasStarted(false); 
  };

  const handleRetryAction = async () => {
    if (!currentConfig) return;

    setGameState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Scenario A: Initialization failed (Turn 0/1 transition)
      if (gameState.turnNumber === 0) {
         const firstTurn = await generateNextTurn({ ...gameState, language: currentConfig.language, turnNumber: 1 }, null);
         setGameState(prev => ({
            ...prev,
            turnNumber: 1,
            currentTurnData: firstTurn,
            isLoading: false
         }));
      } 
      // Scenario B: Mid-game turn failed
      else {
        const lastHistoryItem = gameState.history[gameState.history.length - 1];
        const lastChoiceText = lastHistoryItem ? lastHistoryItem.choiceMade : null;
        
        // Note: The stats and phase were already updated optimistically before the error occurred.
        // We calculate target turn number based on current state logic.
        // If error happened during turn 2->3 generation, turnNumber is 2, history has 2 items. Target is 3.
        
        const nextTurnData = await generateNextTurn({
            ...gameState,
            turnNumber: gameState.turnNumber + 1
        }, lastChoiceText);

        setGameState(prev => ({
            ...prev,
            turnNumber: prev.turnNumber + 1,
            currentTurnData: nextTurnData,
            isLoading: false
        }));
      }
    } catch (e: any) {
      console.error("Retry Error:", e);
      let errorMessage = gameState.language === 'zh' ? "通讯中断" : "Signal Lost";
      if (e.message) errorMessage = e.message;
      setGameState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  };

  if (gameState.error) {
    const isEn = gameState.language === 'en';
    return (
      <div className="h-screen w-full bg-stone-950 flex flex-col items-center justify-center text-red-500 font-tech p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#ff000010_3px)] pointer-events-none"></div>
        <AlertTriangle size={64} className="mb-6 animate-pulse" />
        <h2 className="text-3xl uppercase tracking-widest mb-4 border-b-2 border-red-800 pb-2">CRITICAL ERROR</h2>
        <p className="text-xl text-red-400 mb-8 text-center max-w-2xl bg-black/50 p-4 border border-red-900/50 font-mono">
          {gameState.error}
        </p>
        
        <div className="flex gap-4">
          <button 
            onClick={handleRetryAction}
            className="flex items-center gap-2 px-8 py-3 bg-amber-900/20 border border-amber-600 text-amber-500 hover:bg-amber-800 hover:text-white transition-all uppercase tracking-widest text-sm"
          >
            <RefreshCw size={16} /> {isEn ? "RETRY CONNECTION" : "重试连接"}
          </button>
          
          <button 
            onClick={handleReboot}
            className="flex items-center gap-2 px-8 py-3 bg-red-900/20 border border-red-600 hover:bg-red-800 hover:text-white transition-all uppercase tracking-widest text-sm"
          >
            <Power size={16} /> {isEn ? "REBOOT SYSTEM" : "重启系统"}
          </button>
        </div>
      </div>
    );
  }

  if (!hasStarted) {
    return <StartScreen onStart={handleStart} />;
  }

  if (gameState.isLoading) {
    return (
      <div className="h-screen w-full bg-stone-950 flex flex-col items-center justify-center text-amber-600 font-tech relative overflow-hidden z-50">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,rgba(245,158,11,0.03)_2px,rgba(245,158,11,0.03)_4px)] opacity-30"></div>
        <div className="absolute top-0 w-full h-1 bg-amber-900/50"></div>
        <div className="absolute bottom-0 w-full h-1 bg-amber-900/50"></div>
        
        <div className="relative z-10 flex flex-col items-center w-full max-w-md px-4">
           <div className="w-16 h-16 border-4 border-amber-900/30 border-t-amber-500 rounded-full animate-spin mb-8 shadow-[0_0_30px_rgba(245,158,11,0.2)]"></div>
           
           <h2 className="text-2xl tracking-[0.2em] mb-2 animate-pulse">{gameState.language === 'zh' ? "正在演算战术推演..." : "RUNNING TACTICAL SIM"}</h2>
           <p className="text-xs text-amber-800 uppercase tracking-widest mb-6">PROCESSING TENSORS</p>

           <div className="w-full h-4 bg-stone-900 border border-amber-900/50 relative overflow-hidden mb-2">
              <div 
                className="h-full bg-amber-600 shadow-[0_0_10px_rgba(217,119,6,0.5)] transition-all duration-200 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(0,0,0,0.5)_3px)] opacity-30"></div>
           </div>

           <div className="flex justify-between w-full font-mono text-xs text-amber-500/80">
             <span>{loadingText}</span>
             <span>{Math.floor(loadingProgress)}%</span>
           </div>
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-amber-900/5 to-transparent animate-[scan_3s_linear_infinite] pointer-events-none"></div>
      </div>
    );
  }

  if (gameState.currentTurnData?.isGameOver) {
    return <EndingScreen data={gameState.currentTurnData} turnCount={gameState.turnNumber} provider={currentConfig?.provider} />;
  }

  return (
    <>
      {gameState.currentTurnData && (
        <GameUI 
          turnData={gameState.currentTurnData} 
          stats={gameState.stats}
          turnNumber={gameState.turnNumber}
          onOptionSelect={handleOptionSelect}
          language={gameState.language}
          allowCustomInput={currentConfig?.provider !== 'local'}
        />
      )}
      <style>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </>
  );
};

export default App;