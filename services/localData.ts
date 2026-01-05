import { TurnData, GamePhase } from '../types';

// This is a simplified structure for the Local Event Library.
// You can expand this file based on the prompt provided.

export interface LocalEventTemplate {
  id: string;
  phase: GamePhase[];
  data: TurnData;
}

export const LOCAL_EVENT_LIBRARY: LocalEventTemplate[] = [
  // --- POLITICAL PHASE EVENTS ---
  {
    id: "local_pol_1",
    phase: [GamePhase.POLITICAL],
    data: {
      narrative: "总统先生，国防部长的电话。他说'绝对决心'不仅仅是一次斩首行动，美军正在干扰我们的雷达网络。南方司令部的F-35战机已经越过领空。您必须立刻决定是否启动防空系统，但这会暴露我们的位置。",
      newsTicker: "突发：加拉加斯上空出现不明飞行物，防空警报响彻首都",
      location: "米拉弗洛雷斯宫 - 总统办公室",
      time: "02:15 AM",
      statsDelta: { panic: 5 },
      isGameOver: false,
      options: [
        {
          id: "opt_1",
          text: "授权发射 S-300 防空导弹，击落一切入侵者。",
          type: "aggressive",
          risk: "high",
          outcome: {
            narrative: "防空导弹划破夜空。虽然没有击中隐形战机，但巨大的爆炸声震慑了入侵者，也让市民陷入恐慌。美军的反辐射导弹正在锁定发射源。",
            statsDelta: { militaryLoyalty: 5, publicSupport: -5, panic: 10 }
          }
        },
        {
          id: "opt_2",
          text: "保持雷达静默，启用备用光纤通讯网络。",
          type: "stealth",
          risk: "low",
          outcome: {
            narrative: "您选择了沉默。敌机的轰鸣声在头顶盘旋，但没有炸弹落下。我们暂时还是幽灵。",
            statsDelta: { securityLevel: 5, panic: -5 }
          }
        },
        {
          id: "opt_3",
          text: "向联合国和盟国发出紧急求救信号。",
          type: "diplomatic",
          risk: "medium",
          outcome: {
            narrative: "外交电文发出去了，但回应寥寥。在这深夜，我们是孤独的。",
            statsDelta: { publicSupport: 5, militaryLoyalty: -5 }
          }
        }
      ]
    }
  },
  // --- SIEGE PHASE EVENTS ---
  {
    id: "local_siege_1",
    phase: [GamePhase.SIEGE],
    data: {
      narrative: "大门被爆破了！三角洲部队正在突入主楼层。卫队正在楼梯口死守，但他们的火力太猛了。我们必须撤退到地堡，或者在前厅设伏。",
      newsTicker: "目击者称总统府发生剧烈爆炸与交火",
      location: "米拉弗洛雷斯宫 - 主走廊",
      time: "03:10 AM",
      statsDelta: { securityLevel: -10 },
      isGameOver: false,
      options: [
        {
          id: "opt_1",
          text: "命令卫队使用重武器在走廊阻击。",
          type: "aggressive",
          risk: "high",
          outcome: {
            narrative: "走廊变成了绞肉机。敌人的攻势暂缓，但建筑结构受损严重。",
            statsDelta: { militaryLoyalty: -10, securityLevel: 5 }
          }
        },
        {
          id: "opt_2",
          text: "立刻撤入地下掩体，封锁防爆门。",
          type: "desperate",
          risk: "medium",
          outcome: {
            narrative: "沉重的铅门关上了。外面的枪声变得闷响。我们暂时安全，但也被困住了。",
            statsDelta: { securityLevel: 10, panic: 5 }
          }
        },
        {
          id: "opt_3",
          text: "释放催泪瓦斯，利用熟悉地形进行游击。",
          type: "stealth",
          risk: "high",
          outcome: {
            narrative: "烟雾弥漫。特种部队虽然有夜视仪，但在浓烟中也行动迟缓。",
            statsDelta: { securityLevel: 5, panic: 5 }
          }
        }
      ]
    }
  },
  // --- ESCAPE PHASE EVENTS ---
  {
    id: "local_esc_1",
    phase: [GamePhase.ESCAPE, GamePhase.CAPTURED],
    data: {
      narrative: "我们在撤离车辆中。前方是一个美军检查站。司机问是冲过去，还是弃车步行进入贫民窟。",
      newsTicker: "美军宣布封锁加拉加斯所有出城道路",
      location: "加拉加斯 - 西区高速公路",
      time: "04:20 AM",
      statsDelta: { panic: 10 },
      isGameOver: false,
      options: [
        {
          id: "opt_1",
          text: "全速冲卡！",
          type: "desperate",
          risk: "extreme",
          outcome: {
            narrative: "车辆在枪林弹雨中冲过了路障，但轮胎被打爆了。我们必须下车。",
            statsDelta: { securityLevel: -20, panic: 20 }
          }
        },
        {
          id: "opt_2",
          text: "弃车，混入贫民窟的人群中。",
          type: "stealth",
          risk: "medium",
          outcome: {
            narrative: "这里是我们的票仓。民众认出了您，并自发为您提供掩护。",
            statsDelta: { publicSupport: 10, securityLevel: 5 }
          }
        },
        {
          id: "opt_3",
          text: "联系当地帮派寻求庇护。",
          type: "diplomatic",
          risk: "high",
          outcome: {
            narrative: "帮派首领同意了，但他要价不菲。无论是金钱还是权力。",
            statsDelta: { publicSupport: -5, securityLevel: 10 }
          }
        }
      ]
    }
  }
];