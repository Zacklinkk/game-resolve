import React, { useState, useEffect, useRef } from 'react';
import { TurnData, PlayerStats, Language } from '../types';
import { TypewriterText } from './TypewriterText';
import { StatBar } from './StatBar';
import { Clock, MapPin, Activity, Terminal } from 'lucide-react';

interface Props {
  turnData: TurnData;
  stats: PlayerStats;
  previousStats?: PlayerStats;
  onOptionSelect: (optionId: string, text: string) => void;
  turnNumber: number;
  language: Language;
  allowCustomInput?: boolean;
}

const TYPE_MAP_ZH: Record<string, string> = {
  aggressive: "激进手段",
  diplomatic: "政治斡旋",
  stealth: "隐秘行动",
  desperate: "绝境求生"
};

const RISK_MAP_ZH: Record<string, string> = {
  low: "低风险",
  medium: "中风险",
  high: "高风险",
  extreme: "极度危险"
};

const TYPE_MAP_EN: Record<string, string> = {
  aggressive: "ASSAULT",
  diplomatic: "DIPLOMACY",
  stealth: "STEALTH",
  desperate: "SURVIVAL"
};

const RISK_MAP_EN: Record<string, string> = {
  low: "LOW RISK",
  medium: "MED RISK",
  high: "HIGH RISK",
  extreme: "EXTREME"
};

export const GameUI: React.FC<Props> = ({ turnData, stats, previousStats = stats, onOptionSelect, turnNumber, language, allowCustomInput = false }) => {
  const [typingComplete, setTypingComplete] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isEn = language === 'en';

  useEffect(() => {
    setTypingComplete(false);
    setCustomInput("");
  }, [turnData]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turnData, typingComplete]);

  const LABELS = {
    news: isEn ? "BREAKING NEWS" : "突发新闻",
    turn: isEn ? "TURN" : "第",
    turnSuffix: isEn ? "" : "轮",
    intel: isEn ? "LATEST INTEL" : "最新情报",
    sitrep: isEn ? "SITREP" : "局势报告 (SITREP)",
    stats: {
      support: isEn ? "PUBLIC SUPPORT" : "民众支持率",
      loyalty: isEn ? "ARMY LOYALTY" : "军队忠诚度",
      security: isEn ? "INTEGRITY" : "安保完整度",
      panic: isEn ? "PANIC LEVEL" : "恐慌指数"
    },
    terminal: isEn ? "COMMAND TERMINAL" : "行政指挥终端",
    customInputPlaceholder: isEn ? "ENTER CUSTOM PROTOCOL (MAX 200 CHARS)..." : "输入自定义指令 (最多200字)...",
    execute: isEn ? "EXECUTE" : "执行",
    customLabel: isEn ? "OVERRIDE" : "特别行动"
  };

  const getTypeLabel = (type: string) => (isEn ? TYPE_MAP_EN[type] : TYPE_MAP_ZH[type]) || type;
  const getRiskLabel = (risk: string) => (isEn ? RISK_MAP_EN[risk] : RISK_MAP_ZH[risk]) || risk;

  // Visual effects based on Panic level
  const handleCustomSubmit = () => {
    if (!customInput.trim() || customInput.length > 200) return;
    onOptionSelect("custom_action", customInput.trim());
  };

  const isPanicHigh = stats.panic > 70;
  const isPanicCritical = stats.panic > 90;
  
  const panicOverlayClass = isPanicCritical 
    ? "shadow-[inset_0_0_100px_rgba(220,38,38,0.5)] border-red-900/50" 
    : isPanicHigh 
      ? "shadow-[inset_0_0_50px_rgba(220,38,38,0.2)]" 
      : "";

  return (
    <div className={`h-[100dvh] w-full flex flex-col relative overflow-hidden bg-stone-950 transition-all duration-1000 ${panicOverlayClass}`}>
      
      <div className="absolute inset-0 z-0 opacity-20 transition-opacity duration-1000">
         <div 
            className={`w-full h-full bg-gradient-to-br from-stone-900 via-stone-800 to-stone-950 ${isPanicHigh ? 'from-red-950 via-stone-900' : ''}`}
            style={{
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 3px),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 3px)
              `
            }}
         />
      </div>

      <div className="z-10 bg-red-900/80 text-white text-sm py-1 font-tech overflow-hidden border-b border-red-700 flex items-center shadow-[0_0_15px_rgba(220,38,38,0.5)] flex-shrink-0">
        <div className="px-2 font-bold bg-red-800 h-full flex items-center z-20 whitespace-nowrap glitch-text" data-text={LABELS.news}>{LABELS.news}</div>
        <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] pl-4 uppercase tracking-wider">
           {turnData.newsTicker} +++ {isEn ? "AIRSPACE CLOSED" : "领空已关闭"} +++ OP: ABSOLUTE RESOLVE +++
        </div>
      </div>

      <div className="flex-1 z-10 flex flex-col md:flex-row p-2 md:p-4 gap-2 md:gap-4 overflow-hidden max-w-7xl mx-auto w-full min-h-0">
        
        <div className="flex-1 md:flex-[2] flex flex-col gap-2 md:gap-4 bg-stone-900/90 border border-stone-700 p-4 md:p-6 shadow-2xl backdrop-blur-sm relative min-h-0">
           <div className="flex justify-between items-center text-amber-500 font-tech border-b border-stone-700 pb-2 mb-2 flex-shrink-0">
              <div className="flex items-center gap-2 text-xs md:text-base">
                <MapPin size={14} className="md:w-4 md:h-4" /> <span className={isPanicHigh ? 'animate-pulse text-red-400' : ''}>{turnData.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs md:text-base">
                 <Clock size={14} className="md:w-4 md:h-4" /> {turnData.time}
              </div>
           </div>

           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" ref={scrollRef}>
              <div className="font-title text-xl md:text-2xl mb-4 text-stone-100 tracking-wide border-l-4 border-amber-700 pl-4">
                 {LABELS.turn} {turnNumber} {LABELS.turnSuffix} // <span className="text-amber-600">{LABELS.intel}</span>
              </div>
              <TypewriterText 
                text={turnData.narrative} 
                onComplete={() => setTypingComplete(true)} 
              />
           </div>
        </div>

        <div className="flex-shrink-0 md:flex-1 flex flex-col gap-2 md:gap-4 overflow-y-auto md:overflow-visible custom-scrollbar max-h-[50vh] md:max-h-none">
           
           <div className={`bg-stone-900/90 border border-stone-600 p-3 md:p-4 shadow-lg backdrop-blur-md ${isPanicHigh ? 'border-red-900/50' : ''} flex-shrink-0`}>
              <h3 className="text-stone-400 font-tech text-xs md:text-sm mb-2 md:mb-3 border-b border-stone-700 pb-1 flex items-center gap-2">
                <Activity size={14} className={isPanicHigh ? 'text-red-500 animate-bounce' : ''} /> {LABELS.sitrep}
              </h3>
              <div className="grid grid-cols-2 gap-2 md:flex md:flex-col md:space-y-4">
                <StatBar label={LABELS.stats.support} value={stats.publicSupport} previousValue={previousStats.publicSupport} icon="users" color="bg-blue-600" />
                <StatBar label={LABELS.stats.loyalty} value={stats.militaryLoyalty} previousValue={previousStats.militaryLoyalty} icon="crosshair" color="bg-green-600" />
                <StatBar label={LABELS.stats.security} value={stats.securityLevel} previousValue={previousStats.securityLevel} icon="shield" color="bg-stone-400" />
                <StatBar label={LABELS.stats.panic} value={stats.panic} previousValue={previousStats.panic} icon="alert" color={isPanicHigh ? "bg-red-500 animate-pulse" : "bg-red-900"} />
              </div>
           </div>

           <div className="flex-1 bg-black/80 border border-amber-900/50 p-3 md:p-4 flex flex-col justify-end relative min-h-0">
              <div className="absolute top-0 left-0 bg-amber-900/20 text-amber-600 text-[10px] px-2 py-1 font-tech uppercase">
                <Terminal size={10} className="inline mr-1"/> {LABELS.terminal}
              </div>
              
              <div className="space-y-2 md:space-y-3 mt-4 md:mt-6 overflow-y-auto custom-scrollbar">
                {turnData.options.map((option) => (
                  <button
                    key={option.id}
                    disabled={!typingComplete}
                    onClick={() => onOptionSelect(option.id, option.text)}
                    className={`
                      w-full text-left p-2 md:p-3 border border-stone-600 
                      transition-all duration-300 group relative overflow-hidden
                      ${typingComplete 
                        ? 'hover:border-amber-500 hover:bg-stone-800 cursor-pointer opacity-100' 
                        : 'opacity-50 cursor-not-allowed grayscale'}
                    `}
                  >
                    <div className="relative z-10 flex justify-between items-center">
                       <span className="font-serif text-stone-200 group-hover:text-white max-w-[70%] text-sm md:text-base leading-tight">{option.text}</span>
                       <div className="flex flex-col items-end gap-1 flex-shrink-0">
                         <span className={`
                           text-[10px] uppercase px-2 py-0.5 border text-center min-w-[60px]
                           ${option.risk === 'high' || option.risk === 'extreme' ? 'text-red-400 border-red-900 bg-red-900/20' : 'text-stone-400 border-stone-700'}
                         `}>
                           {getRiskLabel(option.risk)}
                         </span>
                         <span className="text-[10px] text-stone-500">{getTypeLabel(option.type)}</span>
                       </div>
                    </div>
                    <div className="absolute inset-0 bg-amber-900/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
                  </button>
                ))}

                {allowCustomInput && (
                  <div className={`mt-4 pt-4 border-t border-stone-700 ${typingComplete ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs text-amber-600 font-tech">
                        <span>{LABELS.customLabel}</span>
                        <span>{customInput.length}/200</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value.slice(0, 200))}
                          placeholder={LABELS.customInputPlaceholder}
                          disabled={!typingComplete}
                          onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                          className="flex-1 bg-stone-900/50 border border-stone-600 p-2 text-stone-200 text-sm focus:border-amber-500 focus:outline-none placeholder-stone-600 font-serif"
                        />
                        <button
                          onClick={handleCustomSubmit}
                          disabled={!typingComplete || !customInput.trim()}
                          className="bg-amber-900/20 border border-amber-700 text-amber-500 px-4 py-2 text-xs font-tech hover:bg-amber-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {LABELS.execute}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
           </div>

        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};