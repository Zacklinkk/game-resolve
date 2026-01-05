import React, { useState, useEffect } from 'react';
import { AlertOctagon, ExternalLink, Cpu, HardDrive, Server, Globe } from 'lucide-react';
import { AIProvider, AIConfig, Language } from '../types';

interface Props {
  onStart: (config: AIConfig) => void;
}

export const StartScreen: React.FC<Props> = ({ onStart }) => {
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [apiKey, setApiKey] = useState('');
  const [endpointId, setEndpointId] = useState(''); 
  const [rememberKeys, setRememberKeys] = useState(true);
  const [language, setLanguage] = useState<Language>('zh');

  useEffect(() => {
    const savedProvider = localStorage.getItem('game_provider') as AIProvider;
    if (savedProvider) setProvider(savedProvider);
    
    const savedLang = localStorage.getItem('game_language') as Language;
    if (savedLang) setLanguage(savedLang);

    const savedGeminiKey = localStorage.getItem('gemini_api_key');
    const savedVolcanoKey = localStorage.getItem('volcano_api_key');
    const savedVolcanoEndpoint = localStorage.getItem('volcano_endpoint_id');

    if (savedProvider === 'gemini' && savedGeminiKey) setApiKey(savedGeminiKey);
    if (savedProvider === 'volcano') {
      if (savedVolcanoKey) setApiKey(savedVolcanoKey);
      if (savedVolcanoEndpoint) setEndpointId(savedVolcanoEndpoint);
    }
  }, []);

  useEffect(() => {
    setApiKey('');
    setEndpointId('');
    if (provider === 'gemini') {
      const saved = localStorage.getItem('gemini_api_key');
      if (saved) setApiKey(saved);
    } else if (provider === 'volcano') {
      const savedKey = localStorage.getItem('volcano_api_key');
      const savedEndpoint = localStorage.getItem('volcano_endpoint_id');
      if (savedKey) setApiKey(savedKey);
      if (savedEndpoint) setEndpointId(savedEndpoint);
    }
  }, [provider]);

  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
    localStorage.setItem('game_language', newLang);
  };

  const handleStart = () => {
    if (provider === 'gemini' && !apiKey) return;
    if (provider === 'volcano' && (!apiKey || !endpointId)) return;
    
    if (rememberKeys) {
      localStorage.setItem('game_provider', provider);
      if (provider === 'gemini') localStorage.setItem('gemini_api_key', apiKey);
      else if (provider === 'volcano') {
        localStorage.setItem('volcano_api_key', apiKey);
        localStorage.setItem('volcano_endpoint_id', endpointId);
      }
    }
    
    onStart({
      provider,
      apiKey,
      endpointId,
      language
    });
  };

  const clearCache = () => {
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('volcano_api_key');
    localStorage.removeItem('volcano_endpoint_id');
    localStorage.removeItem('game_provider');
    setApiKey('');
    setEndpointId('');
    alert(language === 'zh' ? '本地密钥缓存已清除' : 'Local cache cleared');
  };

  const isReady = () => {
    if (provider === 'gemini') return !!apiKey;
    if (provider === 'volcano') return !!apiKey && !!endpointId;
    if (provider === 'local') return true;
    return false;
  };

  const T = {
    title: language === 'zh' ? "行动代号：绝对决心" : "OPERATION: ABSOLUTE RESOLVE",
    subtitle: language === 'zh' ? "目标：米拉弗洛雷斯宫 // 日期：2026年1月3日" : "TARGET: MIRAFLORES // DATE: JAN 3, 2026",
    log: language === 'zh' ? "事件日志：" : "EVENT LOG:",
    logContent: language === 'zh' 
      ? "凌晨 02:01。美军特种部队已突破外围防线。“绝对决心行动”已经开始。"
      : "02:01 AM. US Special Forces have breached the perimeter. Operation Absolute Resolve has begun.",
    localMode: language === 'zh'
      ? ">> 模式：离线模拟\n>> 状态：已挂载本地事件库\n>> 警告：体验不如 AI 实时生成丰富。"
      : ">> MODE: OFFLINE SIMULATION\n>> STATUS: LOCAL DB MOUNTED\n>> WARNING: LIMITED NARRATIVE VARIANCE.",
    apiKeyLabel: (p: string) => `${p} API Key`,
    getKey: language === 'zh' ? "获取免费密钥" : "Get Free Key",
    remember: language === 'zh' ? "记住密钥" : "Remember Key",
    clear: language === 'zh' ? "清除缓存" : "Clear Cache",
    init: language === 'zh' ? "初始化序列" : "INITIALIZE SEQUENCE",
    wait: language === 'zh' ? "等待参数配置" : "AWAITING CONFIG",
    secret: language === 'zh' ? "密级：绝密" : "CLASSIFIED: TOP SECRET"
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-stone-950 text-stone-300 relative overflow-hidden p-4">
      <div className="absolute inset-0 z-0">
        <img src="https://picsum.photos/seed/war/1920/1080" className="w-full h-full object-cover painting-filter opacity-30 grayscale" alt="Background" />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="z-10 max-w-2xl w-full bg-stone-900/90 border border-stone-700 p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-sm relative">
        
        {/* Language Toggle */}
        <button 
          onClick={toggleLanguage}
          className="absolute top-4 right-4 flex items-center gap-2 text-xs font-tech text-stone-500 hover:text-amber-500 border border-stone-700 px-2 py-1 bg-black/50"
        >
          <Globe size={12} /> {language === 'zh' ? "CN / EN" : "EN / CN"}
        </button>

        <div className="text-center mb-6 border-b border-stone-700 pb-6">
          <h1 className="font-title text-3xl md:text-5xl text-amber-600 mb-2 drop-shadow-lg tracking-tight">{T.title}</h1>
          <p className="font-tech text-red-500 uppercase tracking-[0.1em] text-xs md:text-sm">{T.subtitle}</p>
        </div>

        <div className="flex gap-2 mb-6 border-b border-stone-800 pb-1">
          <button onClick={() => setProvider('gemini')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-tech uppercase transition-colors border-b-2 ${provider === 'gemini' ? 'text-amber-500 border-amber-500 bg-amber-900/10' : 'text-stone-500 border-transparent hover:text-stone-300'}`}>
            <Cpu size={14} /> Gemini
          </button>
          <button onClick={() => setProvider('volcano')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-tech uppercase transition-colors border-b-2 ${provider === 'volcano' ? 'text-blue-500 border-blue-500 bg-blue-900/10' : 'text-stone-500 border-transparent hover:text-stone-300'}`}>
            <Server size={14} /> Volcano
          </button>
          <button onClick={() => setProvider('local')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-tech uppercase transition-colors border-b-2 ${provider === 'local' ? 'text-green-500 border-green-500 bg-green-900/10' : 'text-stone-500 border-transparent hover:text-stone-300'}`}>
            <HardDrive size={14} /> Local
          </button>
        </div>

        <div className="space-y-6 font-serif text-lg leading-relaxed text-stone-400 mb-8 min-h-[80px]">
           {provider === 'local' ? (
             <p className="text-green-700/80 font-mono text-sm border border-green-900/30 p-4 bg-black/40 whitespace-pre-wrap">{T.localMode}</p>
           ) : (
             <p><strong className="text-white">{T.log}</strong> {T.logContent}</p>
           )}
        </div>

        <div className="space-y-4">
          {provider === 'gemini' && (
            <div className="animate-fade-in">
              <div className="flex justify-between items-end mb-2">
                <label className="block font-tech text-xs text-stone-500 uppercase">{T.apiKeyLabel('Google')}</label>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="flex items-center gap-1 font-tech text-xs text-amber-600 hover:text-amber-400 underline">
                  {T.getKey} <ExternalLink size={10} />
                </a>
              </div>
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="AI Studio Key..." className="w-full bg-black/50 border border-stone-600 p-3 text-stone-200 font-mono focus:border-amber-600 focus:outline-none transition-colors" />
            </div>
          )}

          {provider === 'volcano' && (
            <div className="space-y-3 animate-fade-in">
              <div>
                <label className="block font-tech text-xs text-stone-500 uppercase mb-2">{T.apiKeyLabel('Volcano')}</label>
                <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Volcano Key..." className="w-full bg-black/50 border border-stone-600 p-3 text-stone-200 font-mono focus:border-blue-600 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block font-tech text-xs text-stone-500 uppercase mb-2">Endpoint ID</label>
                <input type="text" value={endpointId} onChange={(e) => setEndpointId(e.target.value)} placeholder="ep-202xxx..." className="w-full bg-black/50 border border-stone-600 p-3 text-stone-200 font-mono focus:border-blue-600 focus:outline-none transition-colors" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
             {provider !== 'local' && (
                <label className="flex items-center gap-2 cursor-pointer text-xs font-tech text-stone-500 hover:text-stone-300">
                  <input type="checkbox" checked={rememberKeys} onChange={(e) => setRememberKeys(e.target.checked)} className="accent-amber-600" />
                  {T.remember}
                </label>
             )}
             {provider !== 'local' && (
                <button onClick={clearCache} className="text-[10px] text-red-900/50 hover:text-red-500 font-tech uppercase">{T.clear}</button>
             )}
          </div>

          <button onClick={handleStart} disabled={!isReady()} className={`w-full py-4 font-title text-xl uppercase tracking-widest border transition-all duration-300 mt-2 ${isReady() ? provider === 'volcano' ? 'bg-blue-900/30 border-blue-700 text-blue-400 hover:bg-blue-800 hover:text-white' : provider === 'local' ? 'bg-green-900/30 border-green-700 text-green-400 hover:bg-green-800 hover:text-white' : 'bg-amber-900/30 border-amber-700 text-amber-500 hover:bg-amber-800 hover:text-white' : 'bg-stone-800/30 border-stone-800 text-stone-600 cursor-not-allowed'}`}>
            {isReady() ? T.init : T.wait}
          </button>
        </div>

        <div className="mt-6 flex justify-between items-center text-xs text-stone-600 font-tech">
           <span className="flex items-center gap-1"><AlertOctagon size={12}/> {T.secret}</span>
        </div>
      </div>
    </div>
  );
};