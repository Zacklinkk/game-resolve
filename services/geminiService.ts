// THIS FILE REPLACES geminiService.ts - It is now the central AI controller
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, TurnData, AIConfig } from '../types';
import { getSystemPrompt } from '../constants';
import { 
  LOCAL_EVENT_LIBRARY, 
  getLocalEventById, 
  getNextLocalEvent,
  updateGameContext 
} from './localData';
import { getKnowledgeBase } from './knowledgeBase';

let aiConfig: AIConfig | null = null;
let googleAI: GoogleGenAI | null = null;

export const initializeAI = (config: AIConfig) => {
  aiConfig = config;
  if (config.provider === 'gemini' && config.apiKey) {
    googleAI = new GoogleGenAI({ apiKey: config.apiKey });
  }
};

// --- GEMINI IMPLEMENTATION ---
const generateGeminiTurn = async (gameState: GameState, playerChoiceText: string | null): Promise<TurnData> => {
  if (!googleAI) throw new Error("Gemini API Key missing");
  const model = "gemini-3-flash-preview";
  const context = buildContext(gameState, playerChoiceText);
  const systemPrompt = getSystemPrompt(gameState.language);

  try {
    const response = await googleAI.models.generateContent({
      model: model,
      contents: context,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            narrative: { type: Type.STRING },
            newsTicker: { type: Type.STRING },
            location: { type: Type.STRING },
            time: { type: Type.STRING },
            statsDelta: {
              type: Type.OBJECT,
              properties: {
                publicSupport: { type: Type.NUMBER },
                militaryLoyalty: { type: Type.NUMBER },
                securityLevel: { type: Type.NUMBER },
                panic: { type: Type.NUMBER }
              }
            },
            isGameOver: { type: Type.BOOLEAN },
            endingType: { type: Type.STRING, enum: ["victory", "death", "prison", "exile"] },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ["aggressive", "diplomatic", "stealth", "desperate"] },
                  risk: { type: Type.STRING, enum: ["low", "medium", "high", "extreme"] },
                  outcome: {
                    type: Type.OBJECT,
                    properties: {
                      narrative: { type: Type.STRING },
                      statsDelta: {
                        type: Type.OBJECT,
                        properties: {
                          publicSupport: { type: Type.NUMBER },
                          militaryLoyalty: { type: Type.NUMBER },
                          securityLevel: { type: Type.NUMBER },
                          panic: { type: Type.NUMBER }
                        }
                      },
                      isGameOver: { type: Type.BOOLEAN },
                      endingType: { type: Type.STRING, enum: ["victory", "death", "prison", "exile"] }
                    }
                  }
                },
                required: ["id", "text", "type", "risk"]
              }
            }
          },
          required: ["narrative", "newsTicker", "location", "time", "options", "isGameOver"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Gemini returned empty");
    return JSON.parse(jsonText) as TurnData;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(`Gemini Error: ${error.message || "Unknown error"}`);
  }
};

// --- VOLCANO ENGINE (DOUBAO) IMPLEMENTATION ---
const generateVolcanoTurn = async (gameState: GameState, playerChoiceText: string | null): Promise<TurnData> => {
  if (!aiConfig?.apiKey || !aiConfig?.endpointId) throw new Error("Volcano credentials missing");

  const context = buildContext(gameState, playerChoiceText);
  const systemPrompt = getSystemPrompt(gameState.language);
  
  const messages = [
    { role: "system", content: systemPrompt + "\n\nIMPORTANT: Return ONLY raw JSON. No Markdown." },
    { role: "user", content: context }
  ];

  try {
    const response = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${aiConfig.apiKey}`
      },
      body: JSON.stringify({
        model: aiConfig.endpointId, 
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" } 
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Volcano API Status ${response.status}: ${err}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    
    if (!content) throw new Error("Volcano returned empty content");
    
    try {
      return JSON.parse(content) as TurnData;
    } catch (e) {
      const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned) as TurnData;
    }
  } catch (error: any) {
    console.error("Volcano API Error:", error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
       throw new Error("Connection Failed (CORS/Network). Check console.");
    }
    throw error;
  }
};

// --- SILICONFLOW IMPLEMENTATION ---
const generateSiliconFlowTurn = async (gameState: GameState, playerChoiceText: string | null): Promise<TurnData> => {
  if (!aiConfig?.apiKey) throw new Error("SiliconFlow API Key missing");

  const context = buildContext(gameState, playerChoiceText);
  const systemPrompt = getSystemPrompt(gameState.language);
  
  const messages = [
    { role: "system", content: systemPrompt + "\n\nIMPORTANT: Return ONLY raw JSON. No Markdown." },
    { role: "user", content: context }
  ];

  // Default to Qwen/Qwen2.5-72B-Instruct if no modelId is provided (backward compatibility)
  const modelToUse = aiConfig.modelId || "Qwen/Qwen2.5-72B-Instruct";

  try {
    const response = await fetch("https://api.siliconflow.cn/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${aiConfig.apiKey}`
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`SiliconFlow API Status ${response.status}: ${err}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;
    
    if (!content) throw new Error("SiliconFlow returned empty content");
    
    try {
      return JSON.parse(content) as TurnData;
    } catch (e) {
      const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned) as TurnData;
    }
  } catch (error: any) {
    console.error("SiliconFlow API Error:", error);
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
       throw new Error("Connection Failed (CORS/Network). Check console.");
    }
    throw error;
  }
};

// --- LOCAL MODE IMPLEMENTATION (Enhanced with Rule Engine) ---
let localGameFlags: Record<string, any> = {};
let lastEventId = 'evt_1';
let lastSelectedOption: any = null;

const generateLocalTurn = async (gameState: GameState, playerChoiceText: string | null): Promise<TurnData> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 首次调用，返回第一个事件
  if (gameState.turnNumber === 1) {
    const firstEvent = getLocalEventById('evt_1');
    if (firstEvent) {
      lastEventId = 'evt_1';
      lastSelectedOption = null;
      return { ...firstEvent.data };
    }
  }
  
  // 获取当前事件，找到玩家选择的选项
  const currentEvent = getLocalEventById(lastEventId);
  let selectedOption: any = null;
  let outcomeNarrative = '';
  let outcomeStatsDelta: any = {};
  
  if (currentEvent && playerChoiceText) {
    // 根据选项文本找到对应的选项
    selectedOption = currentEvent.data.options?.find(
      (opt: any) => opt.text === playerChoiceText
    );
    
    if (selectedOption?.outcome) {
      outcomeNarrative = selectedOption.outcome.narrative || '';
      outcomeStatsDelta = selectedOption.outcome.statsDelta || {};
    }
  }
  
  // 更新游戏上下文
  updateGameContext(
    gameState.turnNumber,
    gameState.stats,
    playerChoiceText || '',
    lastEventId,
    localGameFlags
  );
  
  // 使用智能规则引擎选择下一个事件
  const defaultNextId = selectedOption?.nextEventId || 
    `evt_${parseInt(lastEventId.replace('evt_', '')) + 1}`;
  
  const nextEventId = getNextLocalEvent(
    lastEventId,
    playerChoiceText || '',
    defaultNextId
  );
  
  const nextEvent = getLocalEventById(nextEventId);
  
  if (!nextEvent) {
    // 如果找不到事件，尝试返回结局
    const endingEvent = getLocalEventById('evt_183'); // 默认流亡者结局
    if (endingEvent) {
      // 即使是结局，也要展示上一个选择的outcome
      const endingData = { ...endingEvent.data };
      if (outcomeNarrative) {
        endingData.narrative = `**【选择结果】** ${outcomeNarrative}\n\n---\n\n${endingData.narrative}`;
      }
      return endingData;
    }
    
    return {
      narrative: gameState.language === 'zh' 
        ? "本地事件库已耗尽。游戏结束。" 
        : "Local event library exhausted. Game Over.",
      newsTicker: "SIMULATION END",
      location: "UNKNOWN",
      time: "??:??",
      options: [],
      statsDelta: {},
      isGameOver: true,
      endingType: 'exile'
    };
  }
  
  lastEventId = nextEventId;
  lastSelectedOption = selectedOption;
  
  // 构建返回数据，将outcome整合进去
  const turnData = { ...nextEvent.data };
  
  // 将选择的outcome narrative添加到新事件叙事的开头
  if (outcomeNarrative) {
    turnData.narrative = `**【选择结果】** ${outcomeNarrative}\n\n---\n\n${turnData.narrative}`;
  }
  
  // 使用选项的statsDelta，而不是事件级别的
  if (Object.keys(outcomeStatsDelta).length > 0) {
    turnData.statsDelta = {
      publicSupport: outcomeStatsDelta.publicSupport || 0,
      militaryLoyalty: outcomeStatsDelta.militaryLoyalty || 0,
      securityLevel: outcomeStatsDelta.personalSecurity || outcomeStatsDelta.securityLevel || 0,
      panic: outcomeStatsDelta.panic || 0,
      // 保留其他可能的字段
      internationalStance: outcomeStatsDelta.internationalStance || 0
    };
  }
  
  return turnData;
};

// --- CONTEXT BUILDER ---
const buildContext = (gameState: GameState, playerChoiceText: string | null) => {
  const isEn = gameState.language === 'en';
  const kb = getKnowledgeBase(gameState.language);

  // Doom Clock Logic: Force phase shift based on turn
  let doomInstruction = "";
  if (gameState.turnNumber <= 5) {
    doomInstruction = isEn 
      ? "PHASE 1: PERIMETER BREACH. The outer defenses are failing. Create tension."
      : "阶段 1：外围突破。防线正在崩溃。制造紧张感。";
  } else if (gameState.turnNumber <= 15) {
    doomInstruction = isEn
      ? "PHASE 2: THE SIEGE. The enemy is INSIDE the building. Combat is imminent."
      : "阶段 2：围攻。敌人已经进入大楼。战斗迫在眉睫。";
  } else {
    doomInstruction = isEn
      ? "PHASE 3: HUNTED. You are on the run. Every second counts."
      : "阶段 3：猎杀。你在逃亡中。分秒必争。";
  }

  return `
    === KNOWLEDGE BASE ===
    ${kb}
    ======================

    === GAME STATE ===
    - Turn: ${gameState.turnNumber}
    - Phase: ${gameState.phase}
    - Stats: Public=${gameState.stats.publicSupport}, Army=${gameState.stats.militaryLoyalty}, Security=${gameState.stats.securityLevel}, Panic=${gameState.stats.panic}
    
    === DOOM CLOCK INSTRUCTION ===
    ${doomInstruction}

    === HISTORY ===
    Last Turn: Player chose "${playerChoiceText || (isEn ? "START GAME" : "游戏开始")}"
    
    === TASK ===
    1. Acknowledge the RESULT of the last choice immediately.
    2. Advance the plot according to the DOOM CLOCK phase.
    3. Provide 3-4 distinct options for what to do NEXT.
  `;
};

// --- MAIN EXPORT ---
export const generateNextTurn = async (gameState: GameState, playerChoiceText: string | null): Promise<TurnData> => {
  if (!aiConfig) throw new Error("AI Service not initialized");

  switch (aiConfig.provider) {
    case 'gemini':
      return generateGeminiTurn(gameState, playerChoiceText);
    case 'volcano':
      return generateVolcanoTurn(gameState, playerChoiceText);
    case 'siliconflow':
      return generateSiliconFlowTurn(gameState, playerChoiceText);
    case 'local':
      return generateLocalTurn(gameState, playerChoiceText);
    default:
      throw new Error("Unknown Provider");
  }
};