# 🚀 itch.io 上线快速检查清单

## ✅ **已完成项目**

- ✅ 创建 `itchio-release` 分支
- ✅ 默认语言改为英文
- ✅ Vite 配置使用相对路径
- ✅ 本地构建测试通过
- ✅ 生成图片提示词文档
- ✅ 生成音乐提示词文档

---

## 📋 **上线前待办事项**

### **Phase 1: 必须完成**（1-2 小时）

- [ ] **生成封面图**（630x500px）
  - 使用 [ITCHIO_ART_PROMPTS.md](ITCHIO_ART_PROMPTS.md) 中的提示词
  - 推荐工具：Midjourney / Leonardo.ai / DALL-E 3
  - 添加标题文字：VENEZUELA: RESOLVE

- [ ] **准备游戏截图**（至少 3 张）
  - 截图 1: 启动界面
  - 截图 2: 游戏主界面（含状态条）
  - 截图 3: 结局画面

- [ ] **创建 itch.io 账户**（如果没有）
  - 访问：https://itch.io/login

- [ ] **上传游戏到 itch.io**
  1. 访问：https://itch.io/game/new
  2. 填写基本信息（见下方配置清单）
  3. 上传 `dist/` 文件夹内容

### **Phase 2: 推荐完成**（2-3 小时）

- [ ] **生成主菜单音乐**
  - 使用 [ITCHIO_MUSIC_PROMPTS.md](ITCHIO_MUSIC_PROMPTS.md) Prompt 1 或 2
  - 工具：Suno.ai（免费）或 Udio

- [ ] **生成游戏过程音乐**（3 首）
  - 政治、围困、逃亡三个阶段各一首

- [ ] **创建 Favicon**（32x32px）
  - 简单的 "V" 字母图标

- [ ] **优化 itch.io 页面描述**
  - 使用 [ITCHIO_README.md](ITCHIO_README.md) 内容

### **Phase 3: 锦上添花**（可选）

- [ ] **生成背景音乐**（全部 12 首）
- [ ] **添加 UI 音效**（点击、打字机、警报）
- [ ] **录制演示视频**（2-3 分钟）
- [ ] **制作宣传 GIF**

---

## 🎮 **itch.io 页面配置清单**

### **基本信息**

| 字段 | 内容 |
|------|------|
| **Title** | VENEZUELA: RESOLVE |
| **Kind of project** | HTML |
| **Classification** | Games → Text-based |
| **Price** | Free (或 PWYW) |
| **Release date** | 今天的日期 |
| **Mature content** | ✅ 勾选 |

### **简短描述**（Short description - 150 字符）
```
A hyper-realistic geopolitical horror text adventure game. Make life-or-death
decisions as Venezuelan President during 2026 US military intervention.
```

### **完整描述**（Full description）
复制 [ITCHIO_README.md](ITCHIO_README.md) 的全部内容

### **标签**（Tags - 最多 20 个）
```
text-adventure, ai-generated, geopolitical, horror, story-rich,
choices-matter, dark, military, visual-novel, psychological,
tactical, interactive-fiction, singleplayer, atmospheric
```

### **封面图**
- 尺寸：630x500px
- 位置：点击 "Edit game" → "Cover image"

### **截图**（Screenshots）
- 数量：至少 3 张，推荐 5 张
- 尺寸：1280x720px 或更大
- 顺序：启动界面 → 游戏过程 → 结局

---

## 📤 **上传步骤详解**

### **Step 1: 创建新游戏**

1. 访问 https://itch.io/game/new
2. 填写标题：`VENEZUELA: RESOLVE`
3. 选择项目类型：**HTML**
4. 点击 "Create page"

### **Step 2: 上传游戏文件**

1. 在游戏页面点击 "**Uploads**" 标签
2. 点击 "**New release**"
3. 拖拽整个 `dist/` 文件夹到上传区域
4. 等待上传完成（可能需要几分钟）

### **Step 3: 配置页面**

1. **Metadata** 标签：
   - 填写描述
   - 添加标签
   - 勾选 Mature content

2. **Embed** 标签：
   - 自动设置（HTML 游戏无需配置）

3. **Distribution** 标签：
   - 设置价格（Free 或 PWYW）
   - 勾选 "Enable third-party sales"

4. **Analytics** 标签：
   - 启用分析（推荐）

### **Step 4: 预览和发布**

1. 点击 "**View page**" 预览游戏页面
2. 测试游戏是否正常运行
3. 点击 "**Publish**" 正式发布

---

## 🎨 **图片生成工具对比**

| 工具 | 价格 | 质量 | 速度 | 推荐度 |
|------|------|------|------|--------|
| **Midjourney** | $10/月 | ⭐⭐⭐⭐⭐ | 快 | ⭐⭐⭐⭐⭐ |
| **Leonardo.ai** | 免费150/天 | ⭐⭐⭐⭐ | 中 | ⭐⭐⭐⭐ |
| **DALL-E 3** | $20/月 | ⭐⭐⭐⭐⭐ | 慢 | ⭐⭐⭐⭐ |
| **Stable Diffusion** | 免费 | ⭐⭐⭐ | 慢 | ⭐⭐⭐ |

**推荐**：
- **快速上手**：Leonardo.ai（免费额度足够）
- **最佳质量**：Midjourney（需要订阅）
- **预算有限**：Stable Diffusion 本地运行

---

## 🎵 **音乐生成工具对比**

| 工具 | 价格 | 时长 | 质量 | 推荐度 |
|------|------|------|------|--------|
| **Suno AI** | 免费/月费 | 2-4分钟 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Udio** | 免费/月费 | 5+分钟 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Soundraw** | $16.99/月 | 自定义 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **AIVA** | €11/月 | 循环 | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**推荐**：
- **免费使用**：Suno AI（免费版每天 2 首）
- **更长音乐**：Udio（可以生成 5+ 分钟）
- **游戏专用**：AIVA（专为游戏设计）

---

## 🔗 **有用的链接**

### **图片生成**
- Midjourney: https://www.midjourney.com
- Leonardo.ai: https://leonardo.ai
- DALL-E 3: https://openai.com/dall-e-3

### **音乐生成**
- Suno AI: https://suno.ai
- Udio: https://www.udio.com
- Soundraw: https://soundraw.io

### **素材资源**
- Freesound.org: https://freesound.org（免费音效）
- Pixabay: https://pixabay.com（免费图片）
- Unsplash: https://unsplash.com（免费照片）

### **itch.io 文档**
- 游戏发布指南: https://itch.io/docs/creators/
- HTML 游戏指南: https://itch.io/docs/creators/html5
- Butler CLI: https://itch.io/docs/butler/

---

## ⚠️ **常见问题**

### **Q1: 游戏上传后无法运行？**
**A**: 检查以下几点：
- 确保 `dist/` 文件夹内容完整上传
- 检查 `index.html` 是否在根目录
- 验证所有资源路径为相对路径（`./assets/...`）
- 浏览器控制台是否有错误信息

### **Q2: 图片显示不出来？**
**A**:
- 检查图片文件是否已上传
- 验证文件路径是否正确
- 确保使用相对路径而非绝对路径

### **Q3: 如何测试本地构建？**
**A**:
```bash
npm run build
npm run preview
# 访问 http://localhost:4173
```

### **Q4: 如何更新游戏？**
**A**:
1. 修改代码
2. 重新构建：`npm run build`
3. 在 itch.io 创建 "New release"
4. 上传新的 `dist/` 文件夹

### **Q5: 可以设置成付费游戏吗？**
**A**:
- 技术上可以
- 但需要考虑：API Key 是用户自己的
- 建议：Free + 可选捐赠（PWYW）

---

## 📊 **上线后检查清单**

发布后 24 小时内：

- [ ] 测试游戏所有功能
- [ ] 验证 AI 模式正常工作
- [ ] 检查本地模式可用
- [ ] 在社交媒体分享链接
- [ ] 在 Reddit / Discord 宣传
- [ ] 收集用户反馈
- [ ] 监控分析数据

---

## 🎯 **推广建议**

### **免费推广渠道**：
1. **Reddit**：
   - r/interactivefiction
   - r/gamedev
   - r/itchio
   - r/textadventures

2. **Discord**：
   - Interactive Fiction Discord
   - Game Dev League
   - itch.io 社区

3. **Twitter/X**：
   - 标签：#indiedev #textadventure #itchio
   - @itchio 账号（可能被转发）

4. **其他**：
   - TIGSource 论坛
   - IntFiction 论坛
   - 个人博客/网站

### **关键词优化（SEO）**：
- AI生成游戏
- 文字冒险游戏
- 地缘政治游戏
- 互动小说
- 免费网页游戏

---

## 📈 **后续改进计划**

### **Week 1-2**: 收集反馈
- 监控评论和分析
- 修复 bug
- 收集用户建议

### **Week 3-4**: 内容更新
- 添加更多本地事件
- 优化 AI 提示词
- 改进 UI/UX

### **Month 2+**: 功能扩展
- 添加存档系统
- 多语言支持完善
- 成就系统
- 移动端优化

---

## 💾 **备份重要文件**

上线前备份以下文件：
- [ ] 源代码（整个 `game-resolve/` 文件夹）
- [ ] 构建产物（`dist/` 文件夹）
- [ ] itch.io 描述和配置
- [ ] 所有生成的图片和音乐
- [ ] Git 仓库（推送到 GitHub）

---

**祝游戏上线顺利！🎉**

有问题随时询问。记住：**Done is better than perfect** - 先上线，再迭代。
