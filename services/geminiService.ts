// THIS FILE REPLACES geminiService.ts - It is now the central AI controller
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, TurnData, AIConfig } from '../types';
import { getSystemPrompt } from '../constants';
import { LOCAL_EVENT_LIBRARY } from './localData';
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
                  risk: { type: Type.STRING, enum: ["low", "medium", "high", "extreme"] }
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

// --- LOCAL MODE IMPLEMENTATION ---
const generateLocalTurn = async (gameState: GameState, playerChoiceText: string | null): Promise<TurnData> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const suitableEvents = LOCAL_EVENT_LIBRARY.filter(e => e.phase.includes(gameState.phase));
  
  if (suitableEvents.length === 0) {
    return {
      narrative: "Local DB exhausted. Game Over. (Extend localData.ts)",
      newsTicker: "SIMULATION END",
      location: "UNKNOWN",
      time: "??:??",
      options: [],
      statsDelta: {},
      isGameOver: true,
      endingType: 'death'
    };
  }

  const randomEvent = suitableEvents[Math.floor(Math.random() * suitableEvents.length)];
  return { ...randomEvent.data };
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
    case 'local':
      return generateLocalTurn(gameState, playerChoiceText);
    default:
      throw new Error("Unknown Provider");
  }
};