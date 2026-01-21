import React, { useState, useEffect, useRef } from 'react';
import { AlertOctagon, ExternalLink, Cpu, HardDrive, Server, Globe, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { AIProvider, AIConfig, Language } from '../types';
import { audioManager } from '../services/audioManager';

interface Props {
  onStart: (config: AIConfig) => void;
}

export const StartScreen: React.FC<Props> = ({ onStart }) => {
  const [provider, setProvider] = useState<AIProvider>('gemini');
  const [apiKey, setApiKey] = useState('');
  const [endpointId, setEndpointId] = useState(''); 
  const [modelId, setModelId] = useState('Qwen/Qwen2.5-72B-Instruct');
  const [rememberKeys, setRememberKeys] = useState(true);
  const [language, setLanguage] = useState<Language>('en');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  const modelOptions = [
    { value: "Qwen/Qwen2.5-72B-Instruct", label: "Qwen2.5-72B-Instruct (均衡)" },
    { value: "Qwen/Qwen3-235B-A22B-Instruct-2507", label: "Qwen3-235B-Instruct (深度-慢)" },
    { value: "deepseek-ai/DeepSeek-V3.2", label: "DeepSeek-V3.2 (性价比高)" }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Initialize menu music on mount - play on ANY interaction
  useEffect(() => {
    let audioElement: HTMLAudioElement | null = null;
    let hasPlayed = false;

    const startMusic = () => {
      if (hasPlayed || audioElement) return;
      hasPlayed = true;

      const basePath = (window as any).__BASE_PATH__ || '/';
      audioElement = new Audio(basePath + 'audio/menu_music.mp3');
      audioElement.loop = true;
      audioElement.volume = 0.4;

      // Add to DOM to keep it alive
      document.body.appendChild(audioElement);

      audioElement.play().then(() => {
        console.log('Menu music playing automatically');
      }).catch(error => {
        console.warn('Audio play failed:', error);
      });
    };

    // Listen for ANY user interaction
    const events = ['click', 'keydown', 'touchstart', 'mousedown'];
    events.forEach(event => {
      document.addEventListener(event, startMusic, { once: true, capture: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, startMusic, { capture: true });
      });
      if (audioElement && audioElement.parentNode) {
        audioElement.pause();
        audioElement.parentNode.removeChild(audioElement);
        audioElement = null;
      }
    };
  }, []);

  useEffect(() => {
    const savedProvider = localStorage.getItem('game_provider') as AIProvider;
    if (savedProvider) setProvider(savedProvider);
    
    const savedLang = localStorage.getItem('game_language') as Language;
    if (savedLang) setLanguage(savedLang);

    const savedGeminiKey = localStorage.getItem('gemini_api_key');
    const savedVolcanoKey = localStorage.getItem('volcano_api_key');
    const savedVolcanoEndpoint = localStorage.getItem('volcano_endpoint_id');
    const savedSiliconFlowKey = localStorage.getItem('siliconflow_api_key');
    const savedSiliconFlowModel = localStorage.getItem('siliconflow_model_id');

    if (savedProvider === 'gemini' && savedGeminiKey) setApiKey(savedGeminiKey);
    if (savedProvider === 'volcano') {
      if (savedVolcanoKey) setApiKey(savedVolcanoKey);
      if (savedVolcanoEndpoint) setEndpointId(savedVolcanoEndpoint);
    }
    if (savedProvider === 'siliconflow') {
      if (savedSiliconFlowKey) setApiKey(savedSiliconFlowKey);
      if (savedSiliconFlowModel) setModelId(savedSiliconFlowModel);
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
    } else if (provider === 'siliconflow') {
      const saved = localStorage.getItem('siliconflow_api_key');
      const savedModel = localStorage.getItem('siliconflow_model_id');
      if (saved) setApiKey(saved);
      if (savedModel) setModelId(savedModel);
    }
  }, [provider]);

  const toggleLanguage = () => {
    const newLang = language === 'zh' ? 'en' : 'zh';
    setLanguage(newLang);
    localStorage.setItem('game_language', newLang);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioManager.setVolume(0.4);
      audioManager.resume();
    } else {
      audioManager.setVolume(0);
      audioManager.pause();
    }
    setIsMuted(!isMuted);
  };

  const handleStart = () => {
    if (provider === 'gemini' && !apiKey) return;
    if (provider === 'volcano' && (!apiKey || !endpointId)) return;
    if (provider === 'siliconflow' && !apiKey) return;
    
    if (rememberKeys) {
      localStorage.setItem('game_provider', provider);
      if (provider === 'gemini') localStorage.setItem('gemini_api_key', apiKey);
      else if (provider === 'volcano') {
        localStorage.setItem('volcano_api_key', apiKey);
        localStorage.setItem('volcano_endpoint_id', endpointId);
      } else if (provider === 'siliconflow') {
        localStorage.setItem('siliconflow_api_key', apiKey);
        localStorage.setItem('siliconflow_model_id', modelId);
      }
    }
    
    onStart({
      provider,
      apiKey,
      endpointId,
      modelId: provider === 'siliconflow' ? modelId : undefined,
      language
    });
  };

  const clearCache = () => {
    localStorage.removeItem('gemini_api_key');
    localStorage.removeItem('volcano_api_key');
    localStorage.removeItem('volcano_endpoint_id');
    localStorage.removeItem('siliconflow_api_key');
    localStorage.removeItem('siliconflow_model_id');
    localStorage.removeItem('game_provider');
    setApiKey('');
    setEndpointId('');
    setModelId('Qwen/Qwen2.5-72B-Instruct');
    alert(language === 'zh' ? '本地密钥缓存已清除' : 'Local cache cleared');
  };

  const isReady = () => {
    if (provider === 'gemini') return !!apiKey;
    if (provider === 'volcano') return !!apiKey && !!endpointId;
    if (provider === 'siliconflow') return !!apiKey;
    if (provider === 'local') return true;
    return false;
  };

  const T = {
    title: language === 'zh' ? "委内瑞拉：resolve" : "VENEZUELA: RESOLVE",
    subtitle: language === 'zh' ? "目标：米拉弗洛雷斯宫 // 日期：2026年1月3日" : "TARGET: MIRAFLORES // DATE: JAN 3, 2026",
    log: language === 'zh' ? "加密日志：" : "ENCRYPTED LOG:",
    logContent: language === 'zh' 
      ? "凌晨 02:01。美军特种部队已突破外围防线。“委内瑞拉：resolve行动”已经开始。"
      : "02:01 AM. US Special Forces have breached the perimeter. Operation Venezuela: Resolve has begun.",
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
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-stone-950 text-stone-300 relative overflow-y-auto p-4 custom-scrollbar">
      <div className="absolute inset-0 z-0 fixed">
        <img src={`${(window as any).__BASE_PATH__ || ''}images/caracas_war_background.png`} className="w-full h-full object-cover opacity-60" alt="War Background" onError={(e) => {
          // Fallback to original placeholder if image fails
          (e.target as HTMLImageElement).src = "https://picsum.photos/seed/war/1920/1080";
        }} />
        {/* 轻微的暗化遮罩，让背景可见 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30"></div>
        {/* 网格遮罩 - 增强军事风格 */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(255,0,0,0.01),rgba(255,0,0,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none"></div>
      </div>

      <div className="z-10 max-w-2xl w-full bg-stone-900/90 border border-stone-700 p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] backdrop-blur-sm relative my-4">

        {/* Top Controls */}
        <div className="flex justify-between items-center mb-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-xs font-tech text-stone-500 hover:text-amber-500 border border-stone-700 px-2 py-1 bg-black/50 z-20"
          >
            <Globe size={12} /> {language === 'zh' ? "CN / EN" : "EN / CN"}
          </button>

          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            className="flex items-center gap-2 text-xs font-tech text-stone-500 hover:text-amber-500 border border-stone-700 px-2 py-1 bg-black/50 z-20"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
          </button>
        </div>

        <div className="text-center mb-4 md:mb-6 border-b border-stone-700 pb-4 md:pb-6 mt-2 md:mt-0">
          <h1 className="font-title text-3xl md:text-5xl text-amber-600 mb-2 drop-shadow-lg tracking-tight glitch-text" data-text={T.title}>{T.title}</h1>
          <p className="font-tech text-red-500 uppercase tracking-[0.1em] text-[10px] md:text-sm animate-pulse">{T.subtitle}</p>
        </div>

        <div className="flex gap-2 mb-6 border-b border-stone-800 pb-1 overflow-x-auto custom-scrollbar">
          <button onClick={() => setProvider('local')} className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2 text-sm font-tech uppercase transition-colors border-b-2 ${provider === 'local' ? 'text-green-500 border-green-500 bg-green-900/10' : 'text-stone-500 border-transparent hover:text-stone-300'}`}>
            <HardDrive size={14} /> Local
          </button>
          <button onClick={() => setProvider('gemini')} className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2 text-sm font-tech uppercase transition-colors border-b-2 ${provider === 'gemini' ? 'text-amber-500 border-amber-500 bg-amber-900/10' : 'text-stone-500 border-transparent hover:text-stone-300'}`}>
            <Cpu size={14} /> Gemini
          </button>
          <button onClick={() => setProvider('siliconflow')} className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2 text-sm font-tech uppercase transition-colors border-b-2 ${provider === 'siliconflow' ? 'text-purple-500 border-purple-500 bg-purple-900/10' : 'text-stone-500 border-transparent hover:text-stone-300'}`}>
            <Cpu size={14} /> 硅基流动
          </button>
          <button onClick={() => setProvider('volcano')} className={`flex-1 min-w-[80px] flex items-center justify-center gap-2 py-2 text-sm font-tech uppercase transition-colors border-b-2 ${provider === 'volcano' ? 'text-blue-500 border-blue-500 bg-blue-900/10' : 'text-stone-500 border-transparent hover:text-stone-300'}`}>
            <Server size={14} /> 字节豆包
          </button>
        </div>

        <div className="space-y-6 font-serif text-lg leading-relaxed text-stone-400 mb-8 min-h-[80px]">
           {provider === 'local' ? (
             <p className="text-green-700/80 font-mono text-sm border border-green-900/30 p-4 bg-black/40 whitespace-pre-wrap">{T.localMode}</p>
           ) : (
             <p><strong className="text-amber-700">{T.log}</strong> {T.logContent}</p>
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

          {provider === 'siliconflow' && (
            <div className="animate-fade-in space-y-4">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block font-tech text-xs text-stone-500 uppercase">{T.apiKeyLabel('SiliconFlow')}</label>
                  <a href="https://cloud.siliconflow.cn/i/B3VyeiyN" target="_blank" rel="noreferrer" className="flex items-center gap-1 font-tech text-xs text-purple-500 hover:text-purple-400 underline">
                    {T.getKey} (送2000万Tokens) <ExternalLink size={10} />
                  </a>
                </div>
                <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." className="w-full bg-black/50 border border-stone-600 p-3 text-stone-200 font-mono focus:border-purple-600 focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block font-tech text-xs text-stone-500 uppercase mb-2">{language === 'zh' ? '选择模型' : 'Select Model'}</label>
                <div className="relative" ref={modelDropdownRef}>
                  <div 
                    onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                    className="w-full bg-black/50 border border-stone-600 p-3 text-stone-200 font-mono hover:border-purple-500 cursor-pointer flex justify-between items-center transition-colors group"
                  >
                    <span>{modelOptions.find(opt => opt.value === modelId)?.label}</span>
                    <ChevronDown size={16} className={`text-stone-500 group-hover:text-purple-500 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {isModelDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-stone-900 border border-purple-900/50 shadow-xl z-50 animate-fade-in max-h-60 overflow-y-auto">
                      {modelOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setModelId(option.value);
                            setIsModelDropdownOpen(false);
                          }}
                          className={`p-3 font-mono cursor-pointer transition-colors border-l-2 ${
                            modelId === option.value 
                              ? 'bg-purple-900/20 text-purple-300 border-purple-500' 
                              : 'text-stone-400 border-transparent hover:bg-stone-800 hover:text-stone-200 hover:border-stone-600'
                          }`}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
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

          <button onClick={handleStart} disabled={!isReady()} className={`w-full py-4 font-title text-xl uppercase tracking-widest border transition-all duration-300 mt-2 ${isReady() ? provider === 'volcano' ? 'bg-blue-900/30 border-blue-700 text-blue-400 hover:bg-blue-800 hover:text-white' : provider === 'local' ? 'bg-green-900/30 border-green-700 text-green-400 hover:bg-green-800 hover:text-white' : provider === 'siliconflow' ? 'bg-purple-900/30 border-purple-700 text-purple-400 hover:bg-purple-800 hover:text-white' : 'bg-amber-900/30 border-amber-700 text-amber-500 hover:bg-amber-800 hover:text-white' : 'bg-stone-800/30 border-stone-800 text-stone-600 cursor-not-allowed'}`}>
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