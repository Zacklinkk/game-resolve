# 本地模式事件库整合文档

## 概述

本文档描述了如何将临时文件夹中的200个事件库和规则引擎整合到游戏的本地模式中。

## 架构设计

### 文件结构

```
services/
├── localData.ts              # 主集成点和API
├── localDataExtended.ts      # 完整200事件库（第一部分）
├── gameRules.ts              # 规则引擎（触发器和结局判定）
├── extendedEventData.ts      # 事件数据类型定义
├── geminiService.ts          # Gemini AI服务
├── knowledgeBase.ts          # 知识库
└── README.md                 # 服务层文档

临时/services/
├── localData.ts              # 原始完整事件库（8000+行）
└── gameRules.ts              # 原始规则引擎
```

### 核心组件

#### 1. localData.ts
主要职责：
- 导出统一的事件库接口
- 管理游戏上下文状态
- 提供事件查询和选择API

关键函数：
```typescript
// 更新游戏上下文
updateGameContext(turnNumber, stats, choiceId, currentEventId, flags)

// 获取下一个事件（基于规则引擎）
getNextLocalEvent(currentEventId, playerChoiceId, defaultNextEventId)

// 根据ID获取事件
getLocalEventById(eventId)

// 根据阶段获取随机事件
getRandomEventByPhase(phase)
```

#### 2. gameRules.ts
主要职责：
- 检查支线任务触发条件
- 判断隐藏结局条件
- 动态事件选择逻辑
- 统计数据计算和边界检查

核心功能：
- **支线任务触发器**：基于回合数、统计数据和标志位
- **隐藏结局检测**：5种结局（真正幸存者、流亡者、囚徒、烈士、军阀）
- **统计数据管理**：自动应用增量并进行边界检查（0-100）

#### 3. localDataExtended.ts
主要职责：
- 存储完整的200个事件数据
- 提供事件查询和转换函数
- 阶段映射逻辑

事件结构：
```typescript
interface ExtendedEventData {
  id: string;              // 事件ID (evt_1 到 evt_200)
  phase: string;           // 阶段标识
  narrative: string;       // 叙事文本
  newsTicker: string;      // 新闻滚动条
  location: string;        // 地点
  time: string;            // 时间
  options: Option[];       // 选项数组
}
```

## 事件库内容

### 事件分类

1. **主线剧情** (Events 1-42, 81-100, 181-200)
   - 开局政治博弈
   - 宫殿围攻
   - 最终对决和结局

2. **逃亡追捕** (Events 43-80)
   - 逃离加拉加斯
   - 丛林生存
   - 国际追捕

3. **支线任务** (Events 101-160)
   - 比特币劫案 (101-110)
   - 核按钮 (111-120)
   - 神秘联系人 (121-130)
   - 真相与谎言 (131-140)
   - 各类遭遇 (141-160)

4. **角色发展** (Events 161-180)
   - 与妻子西莉亚的关系
   - 副总统德尔西的忠诚
   - 保镖、将军、儿子等关键NPC
   - 心理状态演变

5. **结局序列** (Events 181-200)
   - 最后一战
   - 多种结局分支

### 结局系统

#### 四种主要结局

1. **流亡者 (THE EXILE)**
   - 条件：个人安全度 > 60，军队忠诚度 > 20
   - 事件ID：evt_183 / END_EXILE
   - 结果：在异国他乡度过余生

2. **囚徒 (THE PRISONER)**
   - 条件：个人安全度 < 10 或军队忠诚度 < 20
   - 事件ID：evt_184 / END_PRISON
   - 结果：在美国超级监狱度过余生

3. **不朽图腾 (THE IMMORTAL)**
   - 条件：军队忠诚度 > 50，选择战斗到底
   - 事件ID：evt_182 / END_MARTYR
   - 结果：战死，成为传奇

4. **丛林之王 (THE WARLORD)**
   - 条件：军队忠诚度 > 40，丛林生存 > 5次
   - 事件ID：evt_185 / END_WARLORD
   - 结果：在丛林建立军阀帝国

#### 隐藏结局

5. **真正幸存者 (TRUE SURVIVOR)**
   - 条件：
     - 获得比特币 ✓
     - 获得核按钮 ✓
     - 民众支持度 > 60
     - 军队忠诚度 > 50
     - 个人安全度 > 70
     - 回合数 > 50
   - 事件ID：evt_190 / END_TRUE_SURVIVOR
   - 结果：奇迹般重返权力

## 规则引擎详解

### 支线任务触发机制

触发条件示例：
```typescript
// 比特币劫案 (15%概率)
if (turnNumber >= 20 && 
    currentEventId在[evt_40..evt_60]范围 &&
    未获得比特币 &&
    随机数 < 0.15) {
  触发 evt_101
}

// 核按钮 (12%概率)
if (turnNumber >= 25 &&
    currentEventId在[evt_50..evt_70]范围 &&
    未获得核按钮 &&
    军队忠诚度 > 40 &&
    随机数 < 0.12) {
  触发 evt_111
}
```

### 游戏标志位系统

```typescript
interface GameFlags {
  hasBitcoin?: boolean;           // 是否获得比特币
  hasNuclearButton?: boolean;     // 是否获得核按钮
  savedDog?: boolean;             // 是否救了狗
  metDoubleAgent?: boolean;       // 是否遇到双重间谍
  foundRuins?: boolean;           // 是否发现遗迹
  usedSatPhone?: boolean;         // 是否使用卫星电话
  releasedPrisoner?: boolean;     // 是否释放战俘
  usedNarcoSub?: boolean;         // 是否使用毒品潜艇
  visitedChurch?: boolean;        // 是否去过教堂
  metOldWoman?: boolean;          // 是否遇到老妇人
  burnedDiary?: boolean;          // 是否烧毁日记
  smokedLastCigar?: boolean;      // 是否抽了最后一支雪茄
}
```

### 统计数据管理

四项核心统计：
1. **民众支持度 (publicSupport)**: 0-100
   - 影响：结局判定、某些事件触发
   
2. **军队忠诚度 (militaryLoyalty)**: 0-100
   - 影响：战斗能力、叛变风险、结局判定
   
3. **个人安全度 (securityLevel)**: 0-100
   - 影响：被捕风险、逃脱能力、结局判定
   
4. **恐慌值 (panic)**: 0-100
   - 计算：基于军队忠诚度和个人安全度的反向关系
   - 影响：决策质量、幻觉事件触发

## 使用指南

### 在游戏中使用本地模式

1. **初始化游戏**
```typescript
import { LOCAL_EVENT_LIBRARY, updateGameContext } from './services/localData';

// 开始新游戏
const firstEvent = LOCAL_EVENT_LIBRARY.find(e => e.id === 'evt_1');
```

2. **处理玩家选择**
```typescript
import { getNextLocalEvent, applyStatsDelta } from './services/localData';

// 玩家做出选择后
const nextEventId = getNextLocalEvent(
  currentEventId,
  playerChoiceId,
  option.nextEventId
);

// 应用统计变化
const newStats = applyStatsDelta(currentStats, option.outcome.statsDelta);

// 更新游戏上下文
updateGameContext(turnNumber + 1, newStats, playerChoiceId, nextEventId, flags);
```

3. **检查结局条件**
```typescript
import { checkEndingConditions } from './services/gameRules';

const endingEventId = checkEndingConditions(gameContext);
if (endingEventId) {
  // 触发结局
  navigateToEnding(endingEventId);
}
```

## 扩展指南

### 添加新事件

1. 在 `localDataExtended.ts` 中添加新事件：
```typescript
{
  id: "evt_201",
  phase: "NEW_PHASE",
  narrative: "事件描述...",
  newsTicker: "新闻标题...",
  location: "地点",
  time: "时间",
  options: [...]
}
```

2. 如果需要新阶段，在 `types.ts` 中添加：
```typescript
export enum GamePhase {
  // ... 现有阶段
  NEW_PHASE = "NEW_PHASE_NAME"
}
```

### 添加新的支线任务触发器

在 `gameRules.ts` 的 `checkSideQuestTriggers` 函数中添加：
```typescript
if (条件1 && 条件2 && Math.random() < 概率) {
  return 'evt_新事件ID';
}
```

### 添加新的隐藏结局

在 `gameRules.ts` 的 `HIDDEN_ENDINGS` 数组中添加：
```typescript
{
  id: 'new_ending',
  name: '新结局名称',
  check: (context) => {
    return /* 检查条件 */;
  },
  eventId: 'evt_新结局事件ID',
  priority: 优先级数字
}
```

## 已知限制和未来改进

### 当前限制

1. **事件库大小**：完整的200个事件还未全部导入（仅展示了结构）
2. **性能优化**：大型事件库可能需要懒加载
3. **本地化**：目前仅支持中文，英文版需要完整翻译

### 计划改进

1. **完整导入**：将临时文件夹中所有200个事件完整导入
2. **事件编辑器**：创建可视化工具编辑事件
3. **存档系统**：保存游戏进度和标志位
4. **成就系统**：基于标志位的成就解锁
5. **多周目**：基于前一轮游戏解锁新事件

## 测试建议

### 功能测试清单

- [ ] 基本事件流转
- [ ] 统计数据变化
- [ ] 支线任务触发
- [ ] 结局判定逻辑
- [ ] 标志位系统
- [ ] 边界情况（统计数据0/100）
- [ ] 所有四种主要结局
- [ ] 隐藏结局触发

### 测试命令

```bash
# 运行开发服务器
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run type-check
```

## 贡献指南

如果要继续完善本地模式：

1. 保持事件格式统一
2. 为新事件添加详细注释
3. 测试所有分支路径
4. 更新本文档
5. 保持与AI模式的兼容性

## 联系信息

- 项目仓库：[GitHub链接]
- 问题反馈：[Issues页面]
- 讨论区：[Discussions页面]

---

*最后更新：2026-01-05*
*版本：1.0.0*