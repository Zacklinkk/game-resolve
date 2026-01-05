import React, { useState, useEffect, useRef } from 'react';
import { TurnData, PlayerStats, Language } from '../types';
import { TypewriterText } from './TypewriterText';
import { StatBar } from './StatBar';
import { Clock, MapPin, Activity, Terminal } from 'lucide-react';

interface Props {
  turnData: TurnData;
  stats: PlayerStats;
  onOptionSelect: (optionId: string, text: string) => void;
  turnNumber: number;
  language: Language;
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

export const GameUI: React.FC<Props> = ({ turnData, stats, onOptionSelect, turnNumber, language }) => {
  const [typingComplete, setTypingComplete] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isEn = language === 'en';

  useEffect(() => {
    setTypingComplete(false);
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
    terminal: isEn ? "COMMAND TERMINAL" : "行政指挥终端"
  };

  const getTypeLabel = (type: string) => (isEn ? TYPE_MAP_EN[type] : TYPE_MAP_ZH[type]) || type;
  const getRiskLabel = (risk: string) => (isEn ? RISK_MAP_EN[risk] : RISK_MAP_ZH[risk]) || risk;

  return (
    <div className="h-screen w-full flex flex-col relative overflow-hidden bg-stone-950">
      
      <div className="absolute inset-0 z-0 opacity-20 transition-opacity duration-1000">
         <img 
            src={`https://picsum.photos/seed/${turnNumber + 100}/1920/1080`} 
            alt="Atmosphere" 
            className="w-full h-full object-cover painting-filter"
         />
      </div>

      <div className="z-10 bg-red-900/80 text-white text-sm py-1 font-tech overflow-hidden border-b border-red-700 flex items-center shadow-[0_0_15px_rgba(220,38,38,0.5)]">
        <div className="px-2 font-bold bg-red-800 h-full flex items-center z-20 whitespace-nowrap">{LABELS.news}</div>
        <div className="whitespace-nowrap animate-[marquee_20s_linear_infinite] pl-4 uppercase tracking-wider">
           {turnData.newsTicker} +++ {isEn ? "AIRSPACE CLOSED" : "领空已关闭"} +++ OP: ABSOLUTE RESOLVE +++
        </div>
      </div>

      <div className="flex-1 z-10 flex flex-col md:flex-row p-4 gap-4 overflow-hidden max-w-7xl mx-auto w-full">
        
        <div className="flex-[2] flex flex-col gap-4 bg-stone-900/80 border border-stone-700 p-6 shadow-2xl backdrop-blur-sm relative">
           <div className="flex justify-between items-center text-amber-500 font-tech border-b border-stone-700 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <MapPin size={16} /> {turnData.location}
              </div>
              <div className="flex items-center gap-2">
                 <Clock size={16} /> {turnData.time}
              </div>
           </div>

           <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar" ref={scrollRef}>
              <div className="font-title text-2xl mb-4 text-stone-100 tracking-wide border-l-4 border-amber-700 pl-4">
                 {LABELS.turn} {turnNumber} {LABELS.turnSuffix} // <span className="text-amber-600">{LABELS.intel}</span>
              </div>
              <TypewriterText 
                text={turnData.narrative} 
                onComplete={() => setTypingComplete(true)} 
              />
           </div>
        </div>

        <div className="flex-1 flex flex-col gap-4">
           
           <div className="bg-stone-900/90 border border-stone-600 p-4 shadow-lg backdrop-blur-md">
              <h3 className="text-stone-400 font-tech text-sm mb-3 border-b border-stone-700 pb-1 flex items-center gap-2">
                <Activity size={14} /> {LABELS.sitrep}
              </h3>
              <div className="space-y-4">
                <StatBar label={LABELS.stats.support} value={stats.publicSupport} icon="users" color="bg-blue-600" />
                <StatBar label={LABELS.stats.loyalty} value={stats.militaryLoyalty} icon="crosshair" color="bg-green-600" />
                <StatBar label={LABELS.stats.security} value={stats.securityLevel} icon="shield" color="bg-stone-400" />
                <StatBar label={LABELS.stats.panic} value={stats.panic} icon="alert" color="bg-red-600" />
              </div>
           </div>

           <div className="flex-1 bg-black/80 border border-amber-900/50 p-4 flex flex-col justify-end relative">
              <div className="absolute top-0 left-0 bg-amber-900/20 text-amber-600 text-[10px] px-2 py-1 font-tech uppercase">
                <Terminal size={10} className="inline mr-1"/> {LABELS.terminal}
              </div>
              
              <div className="space-y-3 mt-6">
                {turnData.options.map((option) => (
                  <button
                    key={option.id}
                    disabled={!typingComplete}
                    onClick={() => onOptionSelect(option.id, option.text)}
                    className={`
                      w-full text-left p-3 border border-stone-600 
                      transition-all duration-300 group relative overflow-hidden
                      ${typingComplete 
                        ? 'hover:border-amber-500 hover:bg-stone-800 cursor-pointer opacity-100' 
                        : 'opacity-50 cursor-not-allowed grayscale'}
                    `}
                  >
                    <div className="relative z-10 flex justify-between items-center">
                       <span className="font-serif text-stone-200 group-hover:text-white max-w-[70%] text-sm md:text-base">{option.text}</span>
                       <div className="flex flex-col items-end gap-1">
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