<div align="center">

# 🎮 委内瑞拉：resolve

**Venezuela: Resolve**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff.svg)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

*一款超现实的地缘政治恐怖文字冒险游戏*  
*A hyper-realistic geopolitical horror text adventure game*

</div>

---

## 📖 项目简介 / Project Overview

**行动代号：绝对决心 - 终局** 是一款基于AI驱动的互动式叙事游戏，玩家将在2026年美国军事干预行动中扮演委内瑞拉总统，面对一系列生死攸关的决策。游戏采用战术视觉小说风格，通过心理恐怖和偏执氛围营造极致的沉浸体验。

**Operation: Absolute Resolve** is an AI-driven interactive narrative game where players assume the role of the Venezuelan President during a 2026 US military intervention, facing life-or-death decisions. The game features a tactical visual novel style with psychological horror and paranoia elements for maximum immersion.

### ✨ 核心特性 / Key Features

- 🤖 **多AI引擎支持** / Multi-AI Engine Support
  - Google Gemini (推荐 / Recommended)
  - 火山引擎豆包 / Volcano Engine Doubao
  - 本地模式 (完整版) / Local Mode (Complete) - 200+ events & Smart Rules

- 🌍 **双语支持** / Bilingual Support
  - 简体中文 / Simplified Chinese
  - English

- 🎭 **动态叙事系统** / Dynamic Narrative System
  - 基于"末日时钟"的强制剧情推进机制
  - 根据玩家选择实时生成后续情节
  - 多结局系统（胜利、死亡、监禁、流亡）

- 📊 **实时状态追踪** / Real-time Stats Tracking
  - 民众支持率 / Public Support
  - 军队忠诚度 / Military Loyalty
  - 安保完整度 / Security Level
  - 恐慌指数 / Panic Level

- 🎨 **沉浸式UI设计** / Immersive UI Design
  - 军事战术风格界面
  - 打字机文本效果与加密解码动画
  - 基于恐慌值的视觉扰动效果

---

## 🚀 快速开始 / Quick Start

### 环境要求 / Prerequisites

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0

### 安装步骤 / Installation

```bash
# 1. 克隆项目
git clone <repository-url>
cd 行动代号：绝对决心---终局

# 2. 安装依赖
npm install

# 3. 配置环境变量（可选）
# 创建 .env.local 文件并添加你的API密钥
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 4. 启动开发服务器
npm run dev
```

### 首次运行 / First Run

1. 访问 `http://localhost:3000`
2. 选择AI提供商：
   - **Gemini**: 需要[Google AI Studio API Key](https://aistudio.google.com/app/apikey)（免费）
   - **Volcano**: 需要火山引擎API Key和Endpoint ID
   - **Local**: 无需API，使用预设事件库（体验受限）
3. 选择语言（中文/English）
4. 点击"初始化序列"开始游戏

---

## 🏗️ 项目结构 / Project Structure

```
行动代号：绝对决心---终局/
├── components/              # React组件
│   ├── StartScreen.tsx     # 启动界面（AI配置）
│   ├── GameUI.tsx          # 主游戏界面
│   ├── EndingScreen.tsx    # 结局界面
│   ├── TypewriterText.tsx  # 打字机文本效果
│   └── StatBar.tsx         # 状态条组件
├── services/               # 核心服务
│   ├── geminiService.ts    # AI服务控制器（多引擎）
│   ├── knowledgeBase.ts    # 游戏世界知识库
│   └── localData.ts        # 本地事件库
├── 临时/                   # 临时文件/备份
├── App.tsx                 # 主应用组件
├── types.ts                # TypeScript类型定义
├── constants.ts            # 游戏常量与提示词
├── index.tsx               # 应用入口
├── index.html              # HTML模板
├── vite.config.ts          # Vite配置
├── tsconfig.json           # TypeScript配置
├── package.json            # 项目依赖
└── README.md               # 项目文档
```

---

## 🎮 游戏机制 / Game Mechanics

### 阶段系统 / Phase System

游戏分为三个渐进式阶段：

1. **政治角力阶段 (Turn 1-5)** / Political Maneuvering
   - 外围防线突破，混乱初现
   - 网络攻击与幽灵信号

2. **军事围困阶段 (Turn 6-15)** / Military Siege
   - 敌军进入建筑内部
   - 近距离战斗与背叛

3. **逃亡与追捕阶段 (Turn 16+)** / Escape and Evasion
   - 最后一搏或逃亡尝试
   - 绝望时刻

### 决策类型 / Decision Types

- **激进手段** (Aggressive): 高风险高回报的军事行动
- **政治斡旋** (Diplomatic): 通过谈判寻求解决方案
- **隐秘行动** (Stealth): 规避直接冲突
- **绝境求生** (Desperate): 孤注一掷的选择

### 结局条件 / Ending Conditions

- ✅ **胜利** (Victory): 成功击退入侵/获得国际支持
- ☠️ **死亡** (Death): 安保指数 < 5 或被击毙
- 🔒 **监禁** (Prison): 被捕获且未遭处决
- 🌍 **流亡** (Exile): 成功逃离但失去权力
- 💔 **精神崩溃**: 恐慌指数 > 95
- ⚔️ **政变** (Coup): 军队忠诚度 < 10

---

## 🔧 技术栈 / Tech Stack

### 前端框架 / Frontend
- **React 19.2** - UI框架
- **TypeScript 5.8** - 类型安全
- **Vite 6.2** - 构建工具

### AI集成 / AI Integration
- **@google/genai 1.34** - Google Gemini API
- 火山引擎 Doubao (REST API)
- 本地事件库（无需API）

### UI库 / UI Libraries
- **Lucide React** - 图标库
- **Tailwind CSS** (内联) - 样式

---

## 🎨 设计理念 / Design Philosophy

### 叙事风格 / Narrative Style

- **心理恐怖** / Psychological Horror：通过偏执、压迫感和不确定性营造恐怖氛围
- **冷酷现实主义** / Cold Realism：避免抒情化描写，使用直接的感官数据
- **碎片化信息** / Fragmented Intel：模拟战争迷雾，信息不完整、可能失真

### 视觉设计 / Visual Design

- **军事战术美学** / Military Tactical Aesthetic
- **赛博朋克暗色调** / Cyberpunk Dark Theme
- **加密解码效果** / Decryption Animation
- **扫描线与故障艺术** / Scanlines & Glitch Art

---

## ?? 配置说明 / Configuration

### API密钥管理 / API Key Management

**方式一：环境变量 (推荐生产环境)**

```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key
```

**方式二：界面输入 (开发/测试)**

- 在启动界面直接输入API Key
- 勾选"记住密钥"可保存到localStorage

### Vite配置 / Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  define: {
    'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
  }
});
```

---

## 🧪 开发指南 / Development Guide

### 本地开发 / Local Development

```bash
# 开发模式（热重载）
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

### 添加新事件 / Adding New Events

编辑 `services/localData.ts`：

```typescript
export const LOCAL_EVENT_LIBRARY: LocalEventTemplate[] = [
  {
    id: "your_event_id",
    phase: [GamePhase.POLITICAL],
    data: {
      narrative: "你的叙事文本...",
      newsTicker: "新闻标题...",
      location: "当前位置",
      time: "当前时间",
      statsDelta: { /* 状态变化 */ },
      isGameOver: false,
      options: [ /* 选项数组 */ ]
    }
  }
];
```

### 自定义知识库 / Customizing Knowledge Base

编辑 `services/knowledgeBase.ts` 以添加更多战术素材：

```typescript
const KB_ZH = `
=== 新章节 ===
【新NPC】
- 名字：角色描述
【新地点】
- 地点名：详细描述
`;
```

---

## 🐛 常见问题 / FAQ

### Q: API连接失败怎么办？

**A**: 检查以下项：
1. API Key是否正确
2. 网络连接是否正常
3. 是否存在CORS问题（尝试使用Volcano引擎）
4. 查看浏览器控制台的详细错误信息

### Q: 本地模式和AI模式有什么区别？

**A**: 
- **AI模式**：无限可能性，由大语言模型实时生成独一无二的剧情。
- **本地模式**：包含200+精心编写的剧本事件和智能规则引擎，提供完整且经过平衡性测试的游戏体验，无需联网或API Key。

### Q: 如何切换语言？

**A**: 在启动界面点击右上角的"CN / EN"按钮即可切换。

### Q: 游戏会保存进度吗？

**A**: 目前不支持进度保存，每次会话独立。未来版本可能添加存档功能。

---

## 🎯 路线图 / Roadmap

- [ ] 存档系统 / Save System
- [ ] 更多AI模型支持（OpenAI, Claude等）
- [ ] 成就系统 / Achievement System
- [ ] 多人模式（回合制决策）/ Multiplayer Mode
- [ ] 移动端适配 / Mobile Optimization
- [ ] Steam Workshop风格的社区事件库

---

## 📄 许可证 / License

本项目为私有项目，未开放源代码授权。

This is a private project. All rights reserved.

---

## 🙏 致谢 / Acknowledgments

- Google AI Studio for Gemini API
- 火山引擎 for Doubao Model
- React & Vite communities
- All playtesters and contributors

---

<div align="center">

**⚠️ 内容警告 / Content Warning**

本游戏包含战争、暴力、心理压力等成人主题，建议18岁以上玩家游玩。

This game contains mature themes including war, violence, and psychological stress.  
Recommended for players 18+.

---

**Made with 💀 by the Dev Team**

</div>
