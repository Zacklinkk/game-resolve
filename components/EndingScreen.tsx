import React from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { TurnData, AIProvider } from '../types';

interface Props {
  data: TurnData;
  turnCount: number;
  provider?: AIProvider;
}

export const EndingScreen: React.FC<Props> = ({ data, turnCount, provider }) => {
  const isVictory = data.endingType === 'victory';
  
  // Detect language based on first char of narrative (crude but effective for display)
  const isEn = /[a-zA-Z]/.test(data.narrative.slice(0, 5));

  const TITLES_ZH: Record<string, string> = {
    victory: "胜利：主权捍卫者",
    death: "结局：烈士",
    prison: "结局：囚徒",
    exile: "结局：流亡幽灵"
  };

  const TITLES_EN: Record<string, string> = {
    victory: "VICTORY: SOVEREIGNTY DEFENDED",
    death: "ENDING: MARTYR",
    prison: "ENDING: PRISONER",
    exile: "ENDING: GHOST IN EXILE"
  };

  const map = isEn ? TITLES_EN : TITLES_ZH;
  const title = data.endingType ? (map[data.endingType] || data.endingType.toUpperCase()) : "GAME OVER";

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-black text-stone-200 relative z-50 overflow-y-auto p-4">
      <div className="max-w-3xl text-center p-6 md:p-8 border-y-2 border-stone-800 bg-stone-950/90 backdrop-blur-xl">
        <h2 className={`font-title text-2xl md:text-5xl mb-4 ${isVictory ? 'text-green-600' : 'text-red-700'}`}>
          {title}
        </h2>
        
        <div className="w-16 md:w-24 h-1 bg-stone-800 mx-auto mb-4 md:mb-6"></div>

        <p className="font-serif text-base md:text-xl italic text-stone-400 mb-6 md:mb-8 leading-relaxed">
          "{data.narrative}"
        </p>

        <div className="font-tech text-xs md:text-sm text-stone-600 mb-6 md:mb-8 flex flex-col md:flex-row justify-center gap-2 md:gap-8">
          <p>{isEn ? "TURNS SURVIVED" : "坚持轮数"}: <span className="text-stone-300">{turnCount}</span></p>
          <p>{isEn ? "STATUS" : "最终状态"}: <span className="text-stone-300">{data.endingType}</span></p>
        </div>

        {provider === 'local' && (
          <div className="mb-8 p-4 bg-purple-900/10 border border-purple-500/30 rounded text-sm text-stone-300">
             <p className="mb-2 text-purple-400 font-bold">{isEn ? "Want infinite possibilities?" : "想要无限的剧情可能性？"}</p>
             <p className="mb-3">{isEn ? "Try the Online Generation Mode powered by SiliconFlow AI." : "邀请您体验由硅基流动 AI 驱动的在线生成模式。"}</p>
             <a 
               href="https://cloud.siliconflow.cn/i/B3VyeiyN" 
               target="_blank" 
               rel="noreferrer"
               className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded transition-colors font-tech text-xs tracking-wider"
             >
               {isEn ? "GET FREE API KEY" : "获取免费 API 密钥"} <ExternalLink size={12} />
             </a>
          </div>
        )}

        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 mx-auto px-6 py-2 border border-stone-700 text-stone-400 hover:text-white hover:border-white transition-colors uppercase font-tech tracking-widest"
        >
          <RefreshCw size={16} /> {isEn ? "REINITIALIZE" : "重新初始化"}
        </button>
      </div>
    </div>
  );
};