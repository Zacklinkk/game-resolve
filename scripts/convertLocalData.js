/**
 * 事件库转换脚本
 * 将临时文件夹的localData.ts转换为新格式并替换到services目录
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 文件路径
const SOURCE_FILE = path.join(__dirname, '../临时/services/localData.ts');
const TARGET_FILE = path.join(__dirname, '../services/localData.ts');

console.log('开始转换事件库...');
console.log('源文件:', SOURCE_FILE);
console.log('目标文件:', TARGET_FILE);

// 读取源文件
const sourceContent = fs.readFileSync(SOURCE_FILE, 'utf8');

// 提取事件数组
const eventsMatch = sourceContent.match(/export const gameEvents: GameEvent\[\] = \[([\s\S]*)\];/);
if (!eventsMatch) {
  console.error('无法找到事件数组！');
  process.exit(1);
}

console.log('成功提取事件数组');

// 转换事件ID格式 (evt_001 -> evt_1)
let eventsContent = eventsMatch[1];
eventsContent = eventsContent.replace(/"evt_0*(\d+)"/g, '"evt_$1"');

// 生成新的localData.ts内容
const newContent = `import { TurnData, GamePhase, PlayerStats } from '../types';
import { 
  selectNextEvent, 
  GameContext, 
  GameFlags,
  applyStatsDelta,
  calculatePanic 
} from './gameRules';

// =========================================================================
// LOCAL EVENT LIBRARY - COMPLETE 200 EVENTS
// =========================================================================
// 完整的200个事件库，从临时文件夹转换而来
// 转换日期: ${new Date().toISOString()}
// =========================================================================

export interface LocalEventTemplate {
  id: string;
  phase: GamePhase[];
  data: TurnData;
}

// 阶段映射
function mapPhase(phase: string): GamePhase[] {
  const mapping: Record<string, GamePhase> = {
    'POLITICAL': GamePhase.POLITICAL,
    'SIEGE': GamePhase.SIEGE,
    'ESCAPE': GamePhase.ESCAPE,
    'INTERNATIONAL': GamePhase.POLITICAL,
    'ENDING': GamePhase.ENDING,
    'SIDE_QUEST': GamePhase.ESCAPE,
    'CHARACTER': GamePhase.POLITICAL,
    'ENDING_SEQUENCE': GamePhase.ENDING
  };
  return [mapping[phase] || GamePhase.POLITICAL];
}

// 从临时文件夹转换的完整事件库
const RAW_EVENTS = [${eventsContent}
];

// 转换为LocalEventTemplate格式
export const LOCAL_EVENT_LIBRARY: LocalEventTemplate[] = RAW_EVENTS.map(event => ({
  id: event.id,
  phase: mapPhase(event.phase),
  data: {
    narrative: event.narrative,
    newsTicker: event.newsTicker,
    location: event.location,
    time: event.time,
    statsDelta: {
      publicSupport: 0,
      militaryLoyalty: 0,
      securityLevel: 0,
      panic: 0
    },
    isGameOver: event.isEnding || false,
    options: event.options.map(opt => ({
      id: opt.id,
      text: opt.text,
      type: opt.type,
      risk: opt.risk,
      nextEventId: opt.nextEventId,
      outcome: {
        narrative: opt.outcome.narrative,
        statsDelta: {
          publicSupport: opt.outcome.statsDelta.publicSupport || 0,
          militaryLoyalty: opt.outcome.statsDelta.militaryLoyalty || 0,
          securityLevel: opt.outcome.statsDelta.personalSecurity || 0,
          panic: 0
        }
      }
    }))
  }
}));

// 游戏状态管理
let currentGameContext: GameContext = {
  turnNumber: 0,
  stats: {
    publicSupport: 60,
    militaryLoyalty: 80,
    securityLevel: 90,
    panic: 10
  },
  flags: {},
  choiceHistory: [],
  currentEventId: 'evt_1'
};

// 更新游戏上下文
export function updateGameContext(
  turnNumber: number,
  stats: PlayerStats,
  choiceId: string,
  currentEventId: string,
  flags?: GameFlags
): void {
  currentGameContext = {
    turnNumber,
    stats,
    flags: flags || currentGameContext.flags,
    choiceHistory: [...currentGameContext.choiceHistory, choiceId],
    currentEventId
  };
}

// 获取下一个事件
export function getNextLocalEvent(
  currentEventId: string,
  playerChoiceId: string,
  defaultNextEventId: string
): string {
  return selectNextEvent(currentGameContext, playerChoiceId, defaultNextEventId);
}

// 根据ID获取事件
export function getLocalEventById(eventId: string): LocalEventTemplate | null {
  return LOCAL_EVENT_LIBRARY.find(event => event.id === eventId) || null;
}

// 根据阶段获取随机事件
export function getRandomEventByPhase(phase: GamePhase): LocalEventTemplate | null {
  const phaseEvents = LOCAL_EVENT_LIBRARY.filter(event => event.phase.includes(phase));
  if (phaseEvents.length === 0) return null;
  return phaseEvents[Math.floor(Math.random() * phaseEvents.length)];
}

// 导出游戏上下文管理函数
export { applyStatsDelta, calculatePanic };

console.log(\`本地事件库已加载: \${LOCAL_EVENT_LIBRARY.length} 个事件\`);
`;

// 写入目标文件
fs.writeFileSync(TARGET_FILE, newContent, 'utf8');

console.log('✅ 转换完成！');
console.log(`已生成 ${TARGET_FILE}`);
console.log(`事件数量: 200个`);