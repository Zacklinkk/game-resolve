import { Language } from '../types';

const KB_ZH = `
=== 战术与环境素材库 (中文版) ===

【当前局势：2026年1月3日 "绝对决心"行动】
- **敌方配置**: 美军南方司令部 (SOUTHCOM)。主力为第75游骑兵团（占领机场）、三角洲部队（抓捕高价值目标）、网络战司令部（切断全国电力与互联网）。
- **我方劣势**: 俄制 S-300VM 防空系统已被黑客瘫痪；苏-30MK2 战机无法起飞；米拉弗洛雷斯宫已被激光制导标记。

【关键NPC反应模式】
1. **国防部长帕德里诺 (Padrino López)**:
   - *忠诚时*: "我的部队正在死守Fuerte Tiuna基地，但我需要您授权使用重武器。"
   - *动摇时*: "总统先生，美方承诺只要您投降，他们会保证您的生命安全...为了国家，请考虑一下。"
2. **第一夫人西莉亚 (Cilia Flores)**:
   - *反应*: 正在销毁文件，比你更冷静，不断催促通过秘密地道撤离到 "1月23日区" (23 de Enero) 的贫民窟。

【地理节点 (随剧情推进使用)】
1. **米拉弗洛雷斯宫 - 总统办公室 (起点)**: 充满了历史文件，此时窗户已被震碎。
2. **宫殿地下掩体 (中期)**: 绰号"拉岩石"(La Roca)，冷战时期修建，空气循环系统可能被破坏。
3. **直升机停机坪 (撤离点)**: 位于楼顶，极度危险，暴露在美军狙击手视野下。
4. **加拉加斯下水道/地铁 (逃亡路线)**: 肮脏，黑暗，但能避开热成像无人机。

【新闻/舆论素材 (用于 NewsTicker)】
- *西方视角 (CNN/Reuters)*: "美国务院呼吁委军方协助恢复宪法秩序" / "独裁者已失去对首都的控制"
- *官方喉舌 (Telesur)*: "帝国主义的懦弱袭击无法动摇玻利瓦尔的意志" / "最高指挥部正在有序组织反击"
- *社媒恐慌 (X/Twitter)*: "#CaracasExplosion 我家窗户都在震动！看到直升机了！" / "听说帕德里诺已经跑了？"

【武器与感官细节 (用于 Narrative)】
- **声音**: AC-130 盘旋的低频嗡嗡声；远处防空炮的沉闷撞击声；近处玻璃碎裂声；加密无线电的静噪嘴。
- **气味**: 催泪瓦斯（辛辣）；烧焦的纸张；陈旧的空调霉味；血腥味。
- **物品**: 镀金的 AK-47（纯装饰用）；加密卫星电话（信号微弱）；应急威士忌。
`;

const KB_EN = `
=== TACTICAL KNOWLEDGE BASE (ENGLISH) ===

【Current Situation: Jan 3, 2026 "Operation Absolute Resolve"】
- **Enemy Forces**: US Southern Command (SOUTHCOM). 75th Rangers (Airport seizure), Delta Force (HVT Capture), Cyber Command (Grid/Net blackout).
- **Disadvantages**: Russian S-300VM air defense hacked/offline; Su-30MK2 fighters grounded; Miraflores Palace painted by laser designators.

【Key NPC Profiles】
1. **Vladimir Padrino López (Defense Minister)**:
   - *Loyal*: "My troops are holding Fuerte Tiuna, but I need authorization for heavy weapons."
   - *Wavering*: "Mr. President, the Americans promised safety if you surrender... for the nation, please consider."
2. **Cilia Flores (First Lady)**:
   - *Action*: Shredding documents. Colder than you. Urging escape via tunnels to "23 de Enero" slums.

【Key Locations (Progression)】
1. **Miraflores Palace - Oval Office (Start)**: Historic papers blowing in wind from shattered windows.
2. **The Bunker "La Roca" (Mid-Game)**: Cold War era, air filtration might be compromised.
3. **Helipad (Extraction)**: Rooftop, extremely dangerous, exposed to snipers.
4. **Caracas Sewers/Metro (Escape)**: Filthy, dark, shields against thermal drones.

【News Ticker Sources】
- *Western (CNN/Reuters)*: "State Dept calls for restoration of constitutional order" / "Dictator loses control of capital"
- *State Media (Telesur)*: "Imperialist cowardly attacks cannot shake Bolivarian will" / "High Command organizing counter-attack"
- *Social Media (X/Twitter)*: "#CaracasExplosion Windows shaking! Saw helos!" / "Rumors Padrino has fled?"

【Sensory Details】
- **Sounds**: Low hum of AC-130s; distant thud of AA guns; crunching glass; static squelch of encrypted radio.
- **Smells**: Tear gas (acrid); burning paper; stale AC mold; metallic scent of blood.
- **Items**: Gold-plated AK-47 (ceremonial); Encrypted Sat-Phone (weak signal); Emergency Whiskey.
`;

export const getKnowledgeBase = (lang: Language) => {
  return lang === 'en' ? KB_EN : KB_ZH;
};