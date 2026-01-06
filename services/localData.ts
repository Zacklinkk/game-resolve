import { TurnData, GamePhase, PlayerStats } from '../types';
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
// 转换日期: 2026-01-05T10:02:51.491Z
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
const RAW_EVENTS = [
  // =========================================================================
  // BATCH 1: POLITICAL PRELUDE (Events 1-20)
  // =========================================================================
  
  // Event 1: The Executive Order
  {
    id: "evt_1",
    phase: "POLITICAL",
    narrative: "2025年初的加拉加斯，热浪中夹杂着不安。白宫刚刚发布了行政命令14157号，特朗普总统宣布将'特兰·德·阿拉瓜'（Tren de Aragua）列为外国恐怖组织，并暗示其与你的政府有直接联系。这是一份宣战书。你在米拉弗洛雷斯宫的办公室里，看着电视上鲁比奥国务卿那张冷酷的脸，他正在称你为'西半球的毒瘤'。副总统德尔西·罗德里格斯推门而入，手里拿着一份刚收到的外交照会。",
    newsTicker: "BREAKING: 美国签署EO 14157，宣布针对拉美贩毒集团的'国家紧急状态'。",
    location: "Miraflores Palace, President's Office",
    time: "Jan 15, 2025, 10:00 AM",
    options: [
      {
        id: "opt_001_a",
        text: "在国家电视台发表激烈演说，焚烧行政命令副本。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_2",
        outcome: {
          narrative: "火焰在镜头前跳动。你称美国为'衰落的帝国'。支持者在广场上欢呼，但华尔街的债券交易员们开始疯狂抛售委内瑞拉债务。你赢得了面子，输掉了里子。",
          statsDelta: { publicSupport: 10, internationalStance: -20 }
        }
      },
      {
        id: "opt_001_b",
        text: "通过秘密渠道联系卡特中心，试图缓和局势。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_3",
        outcome: {
          narrative: "信使被派往亚特兰大。但回应是冰冷的。鲁比奥已经封锁了所有软着陆的可能。你的示弱被解读为恐惧。",
          statsDelta: { internationalStance: 5, militaryLoyalty: -5 }
        }
      },
      {
        id: "opt_001_c",
        text: "命令SEBIN（情报局）秘密监控所有美国外交人员。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_2",
        outcome: {
          narrative: "监控网络启动了。你发现了几次异常的深夜会面，地点都在反对派控制的东区。美国人正在编织一张网。",
          statsDelta: { personalSecurity: 5, internationalStance: -5 }
        }
      }
    ]
  },

  // Event 2: The Cartel Designation
  {
    id: "evt_2",
    phase: "POLITICAL",
    narrative: "局势急转直下。美国财政部正式将'太阳卡特尔'（Cartel de los Soles）指定为全球恐怖组织，并直接点名你为首领。这不再是制裁，这是刑事指控的前奏。军队内部开始骚动，一些被列入名单的将军正在疯狂转移资产。你的国防部长帕德里诺请求紧急会面，他的眼神闪烁不定。",
    newsTicker: "US TREASURY: 正式制裁'太阳卡特尔'，指控委内瑞拉高层参与毒品恐怖主义。",
    location: "Fuerte Tiuna Military Base",
    time: "Jul 25, 2025, 02:30 PM",
    options: [
      {
        id: "opt_002_a",
        text: "召开高级将领会议，要求全员签署'忠诚血誓'。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_4",
        outcome: {
          narrative: "在摄像头前，将军们一个个走上台签字。但这更像是一场表演。你看到了他们眼中的恐惧，而不是忠诚。恐惧是把双刃剑。",
          statsDelta: { militaryLoyalty: 10, personalSecurity: -5 }
        }
      },
      {
        id: "opt_002_b",
        text: "允许部分被制裁军官'退休'并离境，以换取军队稳定。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_5",
        outcome: {
          narrative: "这是一种危险的妥协。几名少将带着数百万美元逃往了迪拜。军队内部出现了权力真空，但也清除了部分潜在的叛徒。",
          statsDelta: { militaryLoyalty: -10, personalSecurity: 5 }
        }
      },
      {
        id: "opt_002_c",
        text: "动用SEBIN反情报处，监控所有少将以上军官的通讯。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_4",
        outcome: {
          narrative: "监听记录堆满了你的办公桌。抱怨、恐惧、贪婪。你掌握了他们的把柄，这让你睡得安稳了一点，虽然只有一点。",
          statsDelta: { personalSecurity: 15, militaryLoyalty: -5 }
        }
      }
    ]
  },

  // Event 3: The Shadow of Tren de Aragua
  {
    id: "evt_3",
    phase: "POLITICAL",
    narrative: "虽然你一直否认与'特兰·德·阿拉瓜'黑帮有关，但这个组织已经失控。他们的首领'尼奥·格雷罗'（Niño Guerrero）从地下渠道发来信息：如果不提供庇护，他将向美国DEA提供'有趣的证据'。与此同时，美国以此为借口，声称任何针对该帮派的打击都属于'反恐战争'范畴。",
    newsTicker: "REPORT: 跨国黑帮'特兰·德·阿拉瓜'在美墨边境制造骚乱，美方誓言报复。",
    location: "Safehouse, Miranda State",
    time: "Sep 10, 2025, 11:45 PM",
    options: [
      {
        id: "opt_003_a",
        text: "发动'解放行动'，突袭托科龙监狱残余势力，以此向美国示好。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_6",
        outcome: {
          narrative: "突袭很血腥。你向世界展示了打击犯罪的决心，但帮派认为这是背叛。街头的犯罪率飙升，作为对你的报复。",
          statsDelta: { internationalStance: 10, publicSupport: -15, personalSecurity: -10 }
        }
      },
      {
        id: "opt_003_b",
        text: "秘密接见尼奥·格雷罗，达成互不侵犯协议。",
        type: "desperate",
        risk: "extreme",
        nextEventId: "evt_5",
        outcome: {
          narrative: "魔鬼的交易。帮派同意为你做一些'脏活'，打击反对派。但这进一步坐实了美国对你'毒品国家'的指控。",
          statsDelta: { personalSecurity: 10, internationalStance: -20 }
        }
      },
      {
        id: "opt_003_c",
        text: "无视威胁，加强总统府周边的安保。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_4",
        outcome: {
          narrative: "你选择了龟缩。问题没有解决，只是被推迟了。帮派的怒火在积累，美国人的耐心在消磨。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 4: The Election Aftermath
  {
    id: "evt_4",
    phase: "POLITICAL",
    narrative: "2024年大选的余波仍未平息。虽然CNE宣布你获胜，但全世界都知道埃德蒙多·冈萨雷斯拿到了多数票。反对派领袖玛丽亚·科里娜·马查多正在全境组织抗议。而在华盛顿，新任战争部长彼得·海格塞斯在福克斯新闻上公开表示：'外交手段已死，现在是清理后院的时候了。'",
    newsTicker: "FOX NEWS: 战争部长海格塞斯称'委内瑞拉不仅是独裁问题，更是国家安全威胁'。",
    location: "Miraflores Palace, Balcony",
    time: "Nov 05, 2025, 06:00 PM",
    options: [
      {
        id: "opt_004_a",
        text: "下令逮捕马查多和冈萨雷斯。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_7",
        outcome: {
          narrative: "SEBIN特工冲进了反对派总部。冈萨雷斯逃入了西班牙大使馆，马查多转入地下。国际社会的谴责如雪片般飞来。你切断了最后的回头路。",
          statsDelta: { publicSupport: -20, internationalStance: -30, personalSecurity: 5 }
        }
      },
      {
        id: "opt_004_b",
        text: "宣布在圣诞节前发放特别津贴，试图收买民心。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_6",
        outcome: {
          narrative: "印钞机全速运转。通货膨胀进一步恶化，但穷人暂时拿到了火腿和面包。这能让你撑过这个圣诞节，但明年呢？",
          statsDelta: { publicSupport: 10, militaryLoyalty: -5 }
        }
      },
      {
        id: "opt_004_c",
        text: "通过中间人向美国提议：重新进行有限度的选举审核。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_5",
        outcome: {
          narrative: "软弱的信号。华盛顿甚至没有回复。而在国内，你的核心圈子开始怀疑你的意志。难道老大要投降了？",
          statsDelta: { militaryLoyalty: -15, internationalStance: 5 }
        }
      }
    ]
  },

  // Event 5: The Colombian Connection
  {
    id: "evt_5",
    phase: "POLITICAL",
    narrative: "情报显示，美国特种部队正在哥伦比亚边境集结，名义上是'联合反毒演习'。实际上，他们在搭建一个模拟米拉弗洛雷斯宫的训练场。哥伦比亚左翼总统虽然表面中立，但显然无力阻止美军的行动。边境走私者报告说，看到了黑鹰直升机在低空盘旋。",
    newsTicker: "INTELLIGENCE: 美军在哥伦比亚瓜希拉省建立'前沿作战基地'。",
    location: "Western Border Region",
    time: "Dec 01, 2025, 08:00 AM",
    options: [
      {
        id: "opt_005_a",
        text: "向边境增派两个装甲师，进行针锋相对的演习。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_8",
        outcome: {
          narrative: "坦克履带碾过尘土。这是一场昂贵的展示。卫星照片显示，你的坦克大多年久失修，半数趴窝。美国人看清了你的虚实。",
          statsDelta: { militaryLoyalty: 5, internationalStance: -10 }
        }
      },
      {
        id: "opt_005_b",
        text: "资助ELN（民族解放军）游击队骚扰美军基地。",
        type: "stealth",
        risk: "extreme",
        nextEventId: "evt_9",
        outcome: {
          narrative: "几发迫击炮弹落入了美军营地。没有人员伤亡，但这给了海格塞斯完美的借口：'这是国家恐怖主义行为'。",
          statsDelta: { personalSecurity: -10, internationalStance: -25 }
        }
      },
      {
        id: "opt_005_c",
        text: "向联合国安理会提交'入侵预警'。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_6",
        outcome: {
          narrative: "俄罗斯代表在安理会发了言，中国投了弃权票。文件被归档。世界很忙，没人关心加勒比海的小摩擦。",
          statsDelta: { internationalStance: 5 }
        }
      }
    ]
  },

  // Event 6: The Grid Hack
  {
    id: "evt_6",
    phase: "POLITICAL",
    narrative: "12月15日，古里大坝。控制室的屏幕突然全部变红。这不是普通的故障，这是一种名为'Zeus'的军用级恶意软件。全国60%的地区陷入停电。医院备用电源耗尽，地铁停运。这不仅是破坏，这是一种测试——测试你的应急响应能力。",
    newsTicker: "BLACKOUT: 委内瑞拉大规模停电，政府指责'帝国主义网络恐怖袭击'。",
    location: "National Electric Corporation HQ",
    time: "Dec 15, 2025, 07:15 PM",
    options: [
      {
        id: "opt_006_a",
        text: "宣布全国进入战时状态，实施宵禁。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_10",
        outcome: {
          narrative: "军车驶上街头。宵禁暂时压制了抢劫，但也让城市变得像一座巨大的监狱。民众的怒火在黑暗中积聚。",
          statsDelta: { publicSupport: -15, personalSecurity: 5 }
        }
      },
      {
        id: "opt_006_b",
        text: "请求华为的技术团队进行紧急修复。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_7",
        outcome: {
          narrative: "中国工程师展现了惊人的效率。电力在48小时内恢复了。但这笔账单很贵——你又抵押了未来五年的石油产出。",
          statsDelta: { internationalStance: 10, publicSupport: 5 }
        }
      },
      {
        id: "opt_006_c",
        text: "切断所有对外互联网连接，防止后续攻击。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_8",
        outcome: {
          narrative: "物理断网有效阻止了攻击，但也让经济活动彻底停摆。整个国家倒退回了前数字时代。",
          statsDelta: { publicSupport: -20, personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 7: The Christmas Crisis
  {
    id: "evt_7",
    phase: "POLITICAL",
    narrative: "圣诞节前夕，通货膨胀率达到了惊人的350%。商店货架空空如也。即便是有'祖国卡'的忠诚支持者也领不到 promised 的火腿。街头出现了零星的暴动。而在迈阿密，流亡者社区正在举行盛大的集会，呼吁'2026年是自由之年'。",
    newsTicker: "ECONOMY: 玻利瓦尔币汇率崩盘，黑市美元价格突破新高。",
    location: "Downtown Caracas",
    time: "Dec 24, 2025, 05:00 PM",
    options: [
      {
        id: "opt_007_a",
        text: "强行征收私营企业的库存物资进行分发。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_11",
        outcome: {
          narrative: "国民卫队砸开了仓库的大门。这在短期内平息了饥饿，但彻底摧毁了仅存的商业信心。商家们关门逃离，明年将没有任何物资。",
          statsDelta: { publicSupport: 15, internationalStance: -10 }
        }
      },
      {
        id: "opt_007_b",
        text: "发表电视讲话，呼吁'革命的牺牲精神'。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_10",
        outcome: {
          narrative: "空洞的口号在空荡荡的餐桌前回响。人们关掉了电视。绝望比愤怒更可怕，因为它无声无息。",
          statsDelta: { publicSupport: -10 }
        }
      },
      {
        id: "opt_007_c",
        text: "从伊朗紧急空运燃油和食品。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_9",
        outcome: {
          narrative: "伊朗的运输机突破了封锁。物资不多，但聊胜于无。这进一步巩固了你'流氓国家轴心'的地位。",
          statsDelta: { internationalStance: -15, publicSupport: 5 }
        }
      }
    ]
  },

  // Event 8: The Defector
  {
    id: "evt_8",
    phase: "POLITICAL",
    narrative: "12月28日，震惊全国的消息。曾是你心腹的SEBIN副局长在巴拿马现身，并在CNN上接受了专访。他展示了米拉弗洛雷斯宫的地下结构图，以及你与'太阳卡特尔'洗钱的证据。这是致命的一击。他在直播中看着镜头说：'尼古拉斯，是时候结束了。'",
    newsTicker: "BREAKING: 前情报高官叛逃美国，誓言揭露'马杜罗政权'核心机密。",
    location: "Miraflores Palace, Situation Room",
    time: "Dec 28, 2025, 09:00 PM",
    options: [
      {
        id: "opt_008_a",
        text: "声称他是精神病患者，证据全是伪造的。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_12",
        outcome: {
          narrative: "老套的宣传战。信你的人不需要解释，不信你的人不听解释。但军队内部的疑虑在加深。",
          statsDelta: { militaryLoyalty: -5 }
        }
      },
      {
        id: "opt_008_b",
        text: "清洗SEBIN内部，逮捕所有与他有关联的人员。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_13",
        outcome: {
          narrative: "一场清洗风暴席卷了情报机构。效率下降了，人人自危。你可能抓住了几个同谋，但更多的人因为恐惧而动了叛逃的念头。",
          statsDelta: { personalSecurity: 10, militaryLoyalty: -15 }
        }
      },
      {
        id: "opt_008_c",
        text: "立刻更换宫殿安保协议和地下掩体密码。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_10",
        outcome: {
          narrative: "亡羊补牢。你改变了所有的例行程序。虽然麻烦，但这可能在几天后救你一命。",
          statsDelta: { personalSecurity: 20 }
        }
      }
    ]
  },

  // Event 9: The Last Warning
  {
    id: "evt_9",
    phase: "POLITICAL",
    narrative: "2026年新年钟声敲响前，美国国务院发布了《委内瑞拉过渡框架》。这一次，没有含糊其辞。文中明确列出：只要你在位，制裁就不会解除；如果你和平下台，可以保证你家人的安全。这是一份诱降书。你的妻子席莉亚看着窗外的烟花，握紧了你的手。",
    newsTicker: "US STATE DEPT: 发布'后马杜罗时代'过渡计划，提供免责诱饵。",
    location: "Miraflores Palace, Private Residence",
    time: "Dec 31, 2025, 11:55 PM",
    options: [
      {
        id: "opt_009_a",
        text: "在新年贺词中回应：'委内瑞拉永远不会投降'。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_14",
        outcome: {
          narrative: "你选择了硬刚。烟花升空，映照着你疲惫但坚定的脸庞。大西洋彼岸，行动代号'委内瑞拉：resolve'被批准执行。",
          statsDelta: { publicSupport: 5, internationalStance: -20 }
        }
      },
      {
        id: "opt_009_b",
        text: "秘密试探美方底线，询问流亡地点的选项。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_12",
        outcome: {
          narrative: "软弱的信号被截获了。这没有换来宽大，反而让美方确信你已是强弩之末。进攻计划被加速。",
          statsDelta: { militaryLoyalty: -10 }
        }
      },
      {
        id: "opt_009_c",
        text: "与古巴和俄罗斯大使共进新年晚餐，展示盟友支持。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_11",
        outcome: {
          narrative: "一张照片传遍了世界。你并不孤单，至少表面上如此。这让五角大楼的鹰派稍微犹豫了一下。",
          statsDelta: { internationalStance: 10 }
        }
      }
    ]
  },

  // Event 10: The Calm Before the Storm
  {
    id: "evt_10",
    phase: "POLITICAL",
    narrative: "1月1日，加拉加斯出奇的安静。街上没有车，店铺关门。这是一种死寂。情报显示，加勒比海上的美军'硫磺岛'号两栖攻击舰突然实施了无线电静默。你的军事直觉告诉你，有什么东西正在逼近。帕德里诺将军建议进入一级战备，但他自己却把家人送往了玛格丽塔岛。",
    newsTicker: "ALERT: 美军南方司令部宣布加勒比海域'通讯演习'。",
    location: "Ministry of Defense",
    time: "Jan 01, 2026, 10:00 AM",
    options: [
      {
        id: "opt_010_a",
        text: "批准一级战备，并在主要建筑顶部署防空导弹。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_15",
        outcome: {
          narrative: "士兵们进入了战壕。防空雷达全功率运转。这是一种威慑，也是一种邀请。既然要来，那就来吧。",
          statsDelta: { personalSecurity: 10, militaryLoyalty: 5 }
        }
      },
      {
        id: "opt_010_b",
        text: "分散指挥结构，授权各军区独立作战。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_13",
        outcome: {
          narrative: "化整为零。这能防止被一次性斩首，但也意味着你失去了对军队的直接控制权。军阀化的风险在增加。",
          statsDelta: { militaryLoyalty: -10, personalSecurity: 15 }
        }
      },
      {
        id: "opt_010_c",
        text: "再次呼吁联合国秘书长介入调停。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_12",
        outcome: {
          narrative: "秘书长发出了'深切关注'的声明。除此之外，一无所有。外交途径已经彻底堵死。",
          statsDelta: { internationalStance: 5 }
        }
      }
    ]
  },
  
  // Event 11: The Food Riots
  {
    id: "evt_11",
    phase: "POLITICAL",
    narrative: "1月2日，佩塔雷贫民窟爆发了大规模抢粮骚乱。这次不一样，有人在分发武器。甚至有报道称，看到了说着英语的蒙面人在指挥暴徒。Colectivos民兵试图维持秩序，但遭到了火力压制。内乱是入侵的最佳掩护。",
    newsTicker: "CHAOS: 加拉加斯贫民窟爆发武装骚乱，政府失去控制。",
    location: "Petare District",
    time: "Jan 02, 2026, 02:00 PM",
    options: [
      {
        id: "opt_011_a",
        text: "派遣FAES特警部队进行武力镇压。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_16",
        outcome: {
          narrative: "枪声响彻贫民窟。暴乱被压下去了，但遍地尸体。CNN直播了这一幕，称其为'马杜罗对自己人民的大屠杀'。",
          statsDelta: { publicSupport: -25, internationalStance: -20 }
        }
      },
      {
        id: "opt_011_b",
        text: "试图收买暴乱领袖，承诺给予特权。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_14",
        outcome: {
          narrative: "钱撒下去了。枪声稀疏了一些。但这只是饮鸩止渴。你展示了软弱，更多的暴乱将在明天爆发。",
          statsDelta: { publicSupport: -5, personalSecurity: 5 }
        }
      },
      {
        id: "opt_011_c",
        text: "指责这是CIA策划的破坏行动，呼吁民众不要上当。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_13",
        outcome: {
          narrative: "真相确实如此，但在饥饿面前，真相并不重要。你的声音被淹没在愤怒的浪潮中。",
          statsDelta: { publicSupport: -10 }
        }
      }
    ]
  },

  // Event 12: The Blackout Returns
  {
    id: "evt_12",
    phase: "POLITICAL",
    narrative: "1月2日傍晚，电力再次切断。这一次，连备用发电机都出现了故障。显然有内鬼破坏了线路。黑暗中，各种谣言满天飞：'马杜罗已经逃跑了'，'美军已经登陆了'。恐惧像瘟疫一样蔓延。",
    newsTicker: "RUMOR: 社交媒体疯传总统专机已离开加拉加斯。",
    location: "Miraflores Palace",
    time: "Jan 02, 2026, 06:00 PM",
    options: [
      {
        id: "opt_012_a",
        text: "在烛光下进行全国直播，证明自己还在。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_15",
        outcome: {
          narrative: "这一幕充满了悲剧色彩。你坐在昏暗的办公室里，像一个被围困的国王。支持者感动了，但敌人看出了你的窘迫。",
          statsDelta: { publicSupport: 10, internationalStance: -5 }
        }
      },
      {
        id: "opt_012_b",
        text: "启用军用加密通讯频道，指挥各地驻军。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_14",
        outcome: {
          narrative: "只有少数指挥官回应了。通讯网络不仅被破坏，还被干扰了。你正在失去对国家的感知。",
          statsDelta: { militaryLoyalty: -5 }
        }
      },
      {
        id: "opt_012_c",
        text: "命令秘密警察逮捕散布谣言者。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_13",
        outcome: {
          narrative: "抓了几个人，但这无法阻止谣言。反而在黑暗中制造了更多的恐怖氛围。",
          statsDelta: { publicSupport: -10 }
        }
      }
    ]
  },

  // Event 13: The Sky Above
  {
    id: "evt_13",
    phase: "POLITICAL",
    narrative: "夜幕降临。防空雷达显示有多个高空目标正在接近，信号特征疑似B-1B'枪骑兵'轰炸机。但它们在领空边缘徘徊，像是在等待什么。这是一场神经战。年轻的雷达操作员手在发抖。是开火示警，还是保持静默？",
    newsTicker: "DEFENSE: 委空军雷达锁定多个不明飞行物接近领空。",
    location: "Air Defense Command",
    time: "Jan 02, 2026, 09:00 PM",
    options: [
      {
        id: "opt_013_a",
        text: "发射S-300导弹进行警告射击。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_17",
        outcome: {
          narrative: "导弹升空了，但在半空中自爆。对方使用了极其先进的电子干扰。你暴露了火力位置，而对方毫发无损。这不仅仅是示威，这是侦查。",
          statsDelta: { militaryLoyalty: -5, internationalStance: -10 }
        }
      },
      {
        id: "opt_013_b",
        text: "保持雷达静默，通过光学设备观察。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_16",
        outcome: {
          narrative: "你没有上当。没有开机就没有暴露。但这让你在战术上变成了瞎子。轰炸机在头顶盘旋，如同达摩克利斯之剑。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_013_c",
        text: "向国际民航组织投诉美国危害飞行安全。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_14",
        outcome: {
          narrative: "文书工作。在这个夜晚显得如此荒谬。没人会理会。",
          statsDelta: { internationalStance: 0 }
        }
      }
    ]
  },

  // Event 14: The Family Decision
  {
    id: "evt_14",
    phase: "POLITICAL",
    narrative: "还有几个小时就是1月3日。情报局长报告，美军特种部队的通讯量激增。这不再是演习。你看着身边的家人：席莉亚，还有孩子们。现在是最后的机会。一架加满油的飞机停在拉卡尔洛塔基地，飞行员是古巴人。",
    newsTicker: "EXCLUSIVE: 消息人士称马杜罗家人已秘密转移。",
    location: "Miraflores Palace, Living Quarters",
    time: "Jan 02, 2026, 10:30 PM",
    options: [
      {
        id: "opt_014_a",
        text: "送走家人，自己独自留下。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_18",
        outcome: {
          narrative: "告别很简短。眼泪被忍住了。飞机起飞了，消失在夜空中。你没有了后顾之忧，但也更加孤独。现在，你没有任何软肋了。",
          statsDelta: { personalSecurity: -5, militaryLoyalty: 10 }
        }
      },
      {
        id: "opt_014_b",
        text: "全家一起留下，'我们将死在一起'。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_18",
        outcome: {
          narrative: "这是一个疯狂的决定。你的家人成为了人质，也是动力。这会让接下来的战斗更加惨烈，也更加悲剧。",
          statsDelta: { publicSupport: 5, personalSecurity: -20 }
        }
      },
      {
        id: "opt_014_c",
        text: "一起登上飞机，立刻流亡。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_19",
        outcome: {
          narrative: "你走向了停机坪。引擎在轰鸣。但在最后一刻，你停下了脚步。如果不战而逃，你就坐实了懦夫的骂名。你回到了宫殿，但这几分钟的犹豫已经被卫队看在眼里。",
          statsDelta: { militaryLoyalty: -20 }
        }
      }
    ]
  },

  // Event 15: The Cyber Strike
  {
    id: "evt_15",
    phase: "POLITICAL",
    narrative: "1月2日 11:15 PM。互联网彻底断开。不是物理切断，而是路由表被篡改。国家域名.ve被从根服务器上抹去。所有的政府网站变成了404，或者被替换成了美国司法部的悬赏海报。这是一场数字斩首。你与世界的连接只剩下红色的军用电话。",
    newsTicker: "CYBER: 委内瑞拉政府网站全线瘫痪，页面显示美国司法部通缉令。",
    location: "Cyber Command Center",
    time: "Jan 02, 2026, 11:15 PM",
    options: [
      {
        id: "opt_015_a",
        text: "切换到模拟无线电广播，继续发声。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_17",
        outcome: {
          narrative: "老式的无线电波穿透了数字铁幕。你的声音沙哑但真实。在这个高科技战争的夜晚，模拟信号成了最后的救命稻草。",
          statsDelta: { publicSupport: 5 }
        }
      },
      {
        id: "opt_015_b",
        text: "命令黑客团队对美国金融机构发动报复性攻击。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_18",
        outcome: {
          narrative: "蚍蜉撼树。你的反击如同石沉大海，反而暴露了更多的节点位置，招致了更猛烈的回击。",
          statsDelta: { internationalStance: -10 }
        }
      },
      {
        id: "opt_015_c",
        text: "静默待机，保存电子设备。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_16",
        outcome: {
          narrative: "你关闭了所有屏幕。黑暗中，你思考着。数字世界已经沦陷，接下来的战斗将在物理世界进行。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 16: The Traitor General
  {
    id: "evt_16",
    phase: "POLITICAL",
    narrative: "1月3日 00:30 AM。负责首都防空的加西亚将军失联了。半小时后，他的部队撤离了西部高地的防空阵地。这是一个致命的缺口。通往米拉弗洛雷斯宫的空中走廊被打开了。背叛，终于发生了。",
    newsTicker: "INTEL: 加拉加斯西部防空网络出现不明原因'维护停机'。",
    location: "Situation Room",
    time: "Jan 03, 2026, 00:30 AM",
    options: [
      {
        id: "opt_016_a",
        text: "派遣卫队紧急接管阵地。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_19",
        outcome: {
          narrative: "来不及了。卫队还在路上，天空已经传来了引擎的轰鸣声。你只能眼睁睁看着那个缺口成为你的死穴。",
          statsDelta: { militaryLoyalty: -10, personalSecurity: -15 }
        }
      },
      {
        id: "opt_016_b",
        text: "调整剩余防空火力，封锁缺口。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_18",
        outcome: {
          narrative: "其他部队勉强覆盖了部分区域。但防御网已经不再严密。每个人都在猜忌，下一个背叛的是谁？",
          statsDelta: { militaryLoyalty: -5 }
        }
      },
      {
        id: "opt_016_c",
        text: "撤离宫殿，前往备用指挥所。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_17",
        outcome: {
          narrative: "这可能是最理智的决定。但离开象征权力的宫殿，本身就是一种失败。你犹豫了。",
          statsDelta: { personalSecurity: 10, publicSupport: -5 }
        }
      }
    ]
  },

  // Event 17: The Infiltration
  {
    id: "evt_17",
    phase: "POLITICAL",
    narrative: "1月3日 01:00 AM。宫殿外围的传感器被触发。不是大部队，是小股渗透者。可能是三角洲部队的先遣侦察组，也可能是特兰·德·阿拉瓜的杀手。他们在寻找这里的弱点，或者标记激光制导目标。",
    newsTicker: "ALERT: 总统府周边发现可疑武装人员活动。",
    location: "Miraflores Palace Perimeter",
    time: "Jan 03, 2026, 01:00 AM",
    options: [
      {
        id: "opt_017_a",
        text: "发射照明弹，暴露他们。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_19",
        outcome: {
          narrative: "白光照亮了夜空。几个人影迅速散开。紧接着，一发狙击子弹击碎了你身边的玻璃。他们已经就位了。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_017_b",
        text: "派出狙击手进行反猎杀。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_18",
        outcome: {
          narrative: "一场无声的猫鼠游戏。你的卫队击毙了一名渗透者。检查尸体发现，他是哥伦比亚人，装备着美军通讯器。",
          statsDelta: { militaryLoyalty: 5 }
        }
      },
      {
        id: "opt_017_c",
        text: "紧闭大门，固守待援。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_20",
        outcome: {
          narrative: "你选择了被动防御。这给了他们充足的时间去布置炸药和信标。危险正在逼近门槛。",
          statsDelta: { personalSecurity: -5 }
        }
      }
    ]
  },

  // Event 18: The Final Call
  {
    id: "evt_18",
    phase: "POLITICAL",
    narrative: "1月3日 01:30 AM。红色电话最后一次响起。这次不是国务院，是特朗普本人。声音傲慢而直接：'尼古拉斯，演出结束了。你有10分钟走出大门，举起双手。否则，上帝保佑你。' 电话挂断了。这10分钟，比一生还要漫长。",
    newsTicker: "URGENT: 白宫战情室会议结束，总统下令执行'决定性行动'。",
    location: "Miraflores Palace, President's Office",
    time: "Jan 03, 2026, 01:30 AM",
    options: [
      {
        id: "opt_018_a",
        text: "摔掉电话，命令全军开火。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_20",
        outcome: {
          narrative: "没有退路了。你按下了警报按钮。刺耳的警报声划破了加拉加斯的夜空。战争开始了。",
          statsDelta: { militaryLoyalty: 10, internationalStance: -20 }
        }
      },
      {
        id: "opt_018_b",
        text: "试图回拨，争取更多时间。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_19",
        outcome: {
          narrative: "忙音。只有忙音。美国人已经切断了线路。你的软弱只换来了对方的轻蔑。",
          statsDelta: { publicSupport: -5 }
        }
      },
      {
        id: "opt_018_c",
        text: "与妻子拥抱，整理衣着，准备迎接命运。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_20",
        outcome: {
          narrative: "你整理了绶带。即便面对毁灭，也要保持尊严。这是你最后的倔强。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 19: The First Strike
  {
    id: "evt_19",
    phase: "POLITICAL",
    narrative: "1月3日 01:45 AM。加拉加斯以东30公里。巨大的火球腾空而起。那是主要的防空雷达站。没有导弹轨迹，可能是隐形战机，也可能是内部破坏。无论是什么，这意味着美军已经取得了制空权。城市的灯光开始熄灭，真正的黑暗降临了。",
    newsTicker: "BREAKING: 加拉加斯东部发生剧烈爆炸，目击者称火光冲天。",
    location: "Miraflores Palace, Balcony",
    time: "Jan 03, 2026, 01:45 AM",
    options: [
      {
        id: "opt_019_a",
        text: "撤入地下掩体'La Roca'。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_20",
        outcome: {
          narrative: "你离开了阳台。防爆门在你身后关闭。地面上的世界与你隔绝了。你安全了，但也成了瓮中之鳖。",
          statsDelta: { personalSecurity: 20 }
        }
      },
      {
        id: "opt_019_b",
        text: "留在指挥室，亲自指挥防御。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_20",
        outcome: {
          narrative: "如果你要死，就死在岗位上。这对士气是巨大的鼓舞，但一颗钻地弹就能结束一切。",
          statsDelta: { militaryLoyalty: 15, personalSecurity: -20 }
        }
      },
      {
        id: "opt_019_c",
        text: "启动'焦土计划'，炸毁关键桥梁阻断美军。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_20",
        outcome: {
          narrative: "疯狂的举动。你正在摧毁自己的首都。但这也许能拖延美军地面部队的推进。",
          statsDelta: { publicSupport: -20, personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 20: Operation Venezuela: Resolve
  {
    id: "evt_20",
    phase: "POLITICAL",
    narrative: "1月3日 02:00 AM。天空被撕裂了。不是雷声，是音爆。150架战机同时进入领空。低空传来密集的旋翼声——第160特种作战航空团。'委内瑞拉：resolve行动'正式开始。这不是演习，不是威胁，这是审判。你看着雷达屏幕上密密麻麻的红点，深吸了一口气。",
    newsTicker: "WAR: 美军发动全面进攻，代号'委内瑞拉：resolve'。",
    location: "Miraflores Palace",
    time: "Jan 03, 2026, 02:00 AM",
    options: [
      {
        id: "opt_020_a",
        text: "进入下一阶段：围攻 (SIEGE)。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_21",
        outcome: {
          narrative: "政治博弈结束了。现在是战争时间。祝你好运，总统先生。",
          statsDelta: {}
        }
      },
      {
        id: "opt_020_b",
        text: "进入下一阶段：围攻 (SIEGE)。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_21",
        outcome: {
          narrative: "政治博弈结束了。现在是战争时间。祝你好运，总统先生。",
          statsDelta: {}
        }
      },
      {
        id: "opt_020_c",
        text: "进入下一阶段：围攻 (SIEGE)。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_21",
        outcome: {
          narrative: "政治博弈结束了。现在是战争时间。祝你好运，总统先生。",
          statsDelta: {}
        }
      }
    ]
  },

  // =========================================================================
  // BATCH 2: THE SIEGE BEGINS (Events 21-40)
  // =========================================================================

  // Event 21: The First Bomb
  {
    id: "evt_21",
    phase: "SIEGE",
    narrative: "02:01 AM。没有预警警报。B-2幽灵轰炸机投下的GBU-57巨型钻地弹直接命中了Fuerte Tiuna的地下指挥中心。几公里外的你也感受到了地面的剧烈震颤。那是你的军队大脑被物理抹除的感觉。紧接着，宫殿的电力系统彻底熔断，备用电源在一阵火花中报废。真正的黑暗降临了。",
    newsTicker: "ATTACK: 加拉加斯发生里氏4.0级震感的剧烈爆炸，疑为美军空袭。",
    location: "Miraflores Palace, Main Hall",
    time: "Jan 03, 2026, 02:01 AM",
    options: [
      {
        id: "opt_021_a",
        text: "命令卫队点燃火把照明。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_23",
        outcome: {
          narrative: "火光摇曳。虽然看清了路，但这让宫殿成为了更明显的热成像目标。这是一个中世纪式的错误。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_021_b",
        text: "全员佩戴夜视仪，保持灯火管制。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_22",
        outcome: {
          narrative: "绿色的视野。士兵们在黑暗中摸索。虽然行动迟缓，但至少掩盖了你们的位置。",
          statsDelta: { personalSecurity: 5, militaryLoyalty: 5 }
        }
      },
      {
        id: "opt_021_c",
        text: "向各个哨位大喊口令，确认存活情况。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_24",
        outcome: {
          narrative: "你的喊声在空旷的大厅回荡。回应稀稀落落。恐慌开始蔓延。",
          statsDelta: { militaryLoyalty: -5 }
        }
      }
    ]
  },

  // Event 22: The Drone Swarm
  {
    id: "evt_22",
    phase: "SIEGE",
    narrative: "02:03 AM。一种奇怪的嗡嗡声充斥着空气。窗外的天空布满了红点。那是数以百计的小型自杀式无人机，像蝗虫一样扑向宫殿的防空阵地。每一声爆炸都代表挺机枪或一名防空兵的消失。这是'蜂群战术'，你的S-300毫无用武之地。",
    newsTicker: "WAR: 美军使用新型无人机蜂群瘫痪委内瑞拉防空网。",
    location: "Miraflores Palace, East Wing",
    time: "Jan 03, 2026, 02:03 AM",
    options: [
      {
        id: "opt_022_a",
        text: "命令士兵使用突击步枪对空射击。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_25",
        outcome: {
          narrative: "徒劳的抵抗。子弹如雨点般落下，反而伤到了自己人。无人机依旧在收割生命。",
          statsDelta: { militaryLoyalty: -10 }
        }
      },
      {
        id: "opt_022_b",
        text: "撤离所有露天哨位，退守室内。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_23",
        outcome: {
          narrative: "明智的选择。外围阵地沦陷了，但有生力量保存了下来。你们放弃了外壳，守住了核心。",
          statsDelta: { militaryLoyalty: 5, personalSecurity: 5 }
        }
      },
      {
        id: "opt_022_c",
        text: "启动电子干扰车。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_24",
        outcome: {
          narrative: "干扰生效了片刻。一部分无人机坠落了。但紧接着，一发反辐射导弹精确摧毁了干扰车。",
          statsDelta: { personalSecurity: -5 }
        }
      }
    ]
  },

  // Event 23: The Broadcast
  {
    id: "evt_23",
    phase: "SIEGE",
    narrative: "02:05 AM。所有的军用频道突然被切断，取而代之的是一个清晰的美国口音广播，用完美的西班牙语循环播放：'玻利瓦尔的子孙们，不要为毒枭送命。放下武器，回家去。委内瑞拉：resolve行动只针对罪犯。' 这是一种心理战毒药，你看到年轻士兵的眼神动摇了。",
    newsTicker: "PSYOPS: 美军接管委内瑞拉军用频段，进行劝降广播。",
    location: "Command Post",
    time: "Jan 03, 2026, 02:05 AM",
    options: [
      {
        id: "opt_023_a",
        text: "当场枪毙一名试图丢掉武器的士兵。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_26",
        outcome: {
          narrative: "枪声让所有人战栗。恐惧暂时压倒了理智。他们不敢跑了，但他们看着你的眼神充满了仇恨。",
          statsDelta: { militaryLoyalty: 5, publicSupport: -20, personalSecurity: -10 }
        }
      },
      {
        id: "opt_023_b",
        text: "发表激情演讲，承诺战后每人奖励一套房子。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_25",
        outcome: {
          narrative: "在这个即将毁灭的夜晚，承诺显得如此苍白。没人相信明天，他们只在乎今晚能不能活。",
          statsDelta: { militaryLoyalty: -5 }
        }
      },
      {
        id: "opt_023_c",
        text: "关闭所有无线电，依靠传令兵通讯。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_24",
        outcome: {
          narrative: "切断了毒源，也切断了指挥链。信息传递变得极其缓慢，但至少队伍没有立刻溃散。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 24: The Little Birds
  {
    id: "evt_24",
    phase: "SIEGE",
    narrative: "02:08 AM。低沉的旋翼声就在窗外。是第160特种团的MH-6'小鸟'直升机。它们像黑色的幽灵悬停在宫殿的阳台外，搭载的狙击手正在透过窗户寻找高价值目标。那是死神的眼睛。",
    newsTicker: "SIGHTING: 美军特种直升机出现在总统府上空。",
    location: "Presidential Suite",
    time: "Jan 03, 2026, 02:08 AM",
    options: [
      {
        id: "opt_024_a",
        text: "拉上厚重的防弹窗帘。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_27",
        outcome: {
          narrative: "窗帘挡住了视线，但也挡住了你观察敌情的机会。子弹击打在防弹玻璃上的声音像冰雹一样密集。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_024_b",
        text: "使用RPG火箭筒隔窗盲射。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_28",
        outcome: {
          narrative: "火箭弹飞出窗外，击中了一架直升机的旋翼。巨大的爆炸。残骸坠入花园。这是一次胜利，但也暴露了你确切的位置。AC-130正在调转炮口。",
          statsDelta: { militaryLoyalty: 15, personalSecurity: -20 }
        }
      },
      {
        id: "opt_024_c",
        text: "匍匐离开房间，转移至走廊。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_25",
        outcome: {
          narrative: "你在地毯上爬行，姿态狼狈。红色的激光点在墙上晃动，寻找着你的头部。你逃过了第一轮狙杀。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 25: The Roof Breach
  {
    id: "evt_25",
    phase: "SIEGE",
    narrative: "02:10 AM。头顶传来一声巨响，紧接着是混凝土碎裂的声音。他们炸开了屋顶。突击队正在通过索降进入三楼。那是你的私人图书馆位置。敌人已经在房子里了。",
    newsTicker: "UPDATE: 美军特种部队成功突入米拉弗洛雷斯宫。",
    location: "Third Floor Corridor",
    time: "Jan 03, 2026, 02:10 AM",
    options: [
      {
        id: "opt_025_a",
        text: "引爆三楼预埋的定向雷。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_29",
        outcome: {
          narrative: "轰鸣声中，三楼变成了废墟。几名突击队员可能阵亡了，但整个宫殿的结构也摇摇欲坠。灰尘呛得你无法呼吸。",
          statsDelta: { personalSecurity: -5, militaryLoyalty: 10 }
        }
      },
      {
        id: "opt_025_b",
        text: "封锁楼梯间，部署机枪阵地。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_28",
        outcome: {
          narrative: "你的卫队构筑了交叉火力网。突击队被压制在楼梯口。但这只是暂时的，他们正在呼叫空中支援。",
          statsDelta: { militaryLoyalty: 5 }
        }
      },
      {
        id: "opt_025_c",
        text: "放弃上层建筑，全员撤退至一楼。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_27",
        outcome: {
          narrative: "收缩防线。你让出了大半个宫殿。这让敌人的搜索范围变大了，也让你被压缩在更小的空间里。",
          statsDelta: { personalSecurity: 5, militaryLoyalty: -5 }
        }
      }
    ]
  },

  // Event 26: The Angel of Death
  {
    id: "evt_26",
    phase: "SIEGE",
    narrative: "02:12 AM。AC-130'空中炮艇'开始在宫殿上空绕圈。105mm榴弹炮的每一发炮弹都像是上帝的重锤，精准地敲掉宫殿的塔楼和火力点。震动让墙上的玻利瓦尔画像掉在地上摔得粉碎。",
    newsTicker: "ATTACK: AC-130炮艇机对加拉加斯市中心目标进行持续火力打击。",
    location: "Ground Floor",
    time: "Jan 03, 2026, 02:12 AM",
    options: [
      {
        id: "opt_026_a",
        text: "躲在承重墙角落下祈祷。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_30",
        outcome: {
          narrative: "你在尘土中瑟瑟发抖。作为一个唯物主义者，你此刻却希望上帝真的存在。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_026_b",
        text: "命令肩扛式导弹手尝试锁定空中的阴影。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_29",
        outcome: {
          narrative: "没有热诱弹，导弹根本无法锁定。AC-130发现了发射点，一串25mm机炮瞬间将你的导弹小组撕成了碎片。",
          statsDelta: { militaryLoyalty: -10 }
        }
      },
      {
        id: "opt_026_c",
        text: "通过地下电缆向外界发送求救信号。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_28",
        outcome: {
          narrative: "信号发出去了。但谁能来救你？俄罗斯人？中国人？他们都在看着卫星直播。没人会为了你和AC-130对抗。",
          statsDelta: { internationalStance: -5 }
        }
      }
    ]
  },

  // Event 27: The Cyber Attack Part 2
  {
    id: "evt_27",
    phase: "SIEGE",
    narrative: "02:15 AM。宫殿内的电子锁系统突然全部失效。所有的门都自动打开了。不仅仅是门，连安保摄像头的控制权也被夺走了。屏幕上显示着：'We see you'。这是NSA的网络战小组。",
    newsTicker: "CYBER: 总统府内部安防系统据称被黑客完全接管。",
    location: "Security Room",
    time: "Jan 03, 2026, 02:15 AM",
    options: [
      {
        id: "opt_027_a",
        text: "物理破坏所有电子锁，手动锁死大门。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_31",
        outcome: {
          narrative: "枪托砸烂了控制面板。门被卡死了。但这挡不住破门炸药，只能拖延几秒钟。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_027_b",
        text: "打爆所有摄像头。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_30",
        outcome: {
          narrative: "玻璃碎片飞溅。你让NSA变成了瞎子，但也让自己失去了监控能力。现在是真正的盲人摸象。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_027_c",
        text: "利用开启的大门设置陷阱。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_29",
        outcome: {
          narrative: "你在一扇开启的门后放置了手雷。这种小把戏对付特种部队可能太幼稚了，但也许能制造混乱。",
          statsDelta: { militaryLoyalty: 5 }
        }
      }
    ]
  },

  // Event 28: The Gas Attack
  {
    id: "evt_28",
    phase: "SIEGE",
    narrative: "02:18 AM。通风管道里传来了嘶嘶声。不是毒气，是高浓度的催泪瓦斯和CS气体。瞬间，整个一楼充满了白色的烟雾。眼睛刺痛，呼吸困难。这是要把你们像老鼠一样熏出来。",
    newsTicker: "TACTIC: 美军使用非致命性气体驱散守军。",
    location: "Main Corridor",
    time: "Jan 03, 2026, 02:18 AM",
    options: [
      {
        id: "opt_028_a",
        text: "戴上防毒面具，继续坚守。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_32",
        outcome: {
          narrative: "视野受限，呼吸沉重。但你们还在。这种顽强让进攻方感到意外。",
          statsDelta: { militaryLoyalty: 5, personalSecurity: -5 }
        }
      },
      {
        id: "opt_028_b",
        text: "打破窗户通风，哪怕暴露位置。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_31",
        outcome: {
          narrative: "新鲜空气进来了，子弹也跟着进来了。几名卫兵倒在窗前。这是用血换空气。",
          statsDelta: { militaryLoyalty: -10, personalSecurity: -10 }
        }
      },
      {
        id: "opt_028_c",
        text: "趁着烟雾撤向地下掩体入口。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_33",
        outcome: {
          narrative: "烟雾成了最好的掩护。你们跌跌撞撞地摸到了暗门。这是撤退的最佳时机。",
          statsDelta: { personalSecurity: 15 }
        }
      }
    ]
  },

  // Event 29: The Delta Force
  {
    id: "evt_29",
    phase: "SIEGE",
    narrative: "02:20 AM。正门被定向爆破轰开。四名全副武装的三角洲特种部队成员突入大厅。他们的动作如行云流水，精准点射，Double Tap。你的前卫部队在10秒内被肃清。这就是世界上最顶尖的杀人机器。",
    newsTicker: "BREAKING: 美军地面部队突破总统府正门。",
    location: "Grand Foyer",
    time: "Jan 03, 2026, 02:20 AM",
    options: [
      {
        id: "opt_029_a",
        text: "命令敢死队发起自杀式冲锋。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_34",
        outcome: {
          narrative: "惨烈的肉搏。几名忠诚的卫兵冲了上去，换来的是精准的爆头。但这确实阻滞了敌人的推进速度。",
          statsDelta: { militaryLoyalty: -10, personalSecurity: 5 }
        }
      },
      {
        id: "opt_029_b",
        text: "引爆大厅的装饰石柱制造路障。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_33",
        outcome: {
          narrative: "巨大的石柱倒塌，封锁了正门入口。三角洲部队被迫寻找侧路。你赢得了宝贵的几分钟。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_029_c",
        text: "从二楼回廊投掷燃烧弹。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_32",
        outcome: {
          narrative: "火焰在大厅燃烧。热浪逼退了突击队。宫殿开始起火，这也意味着你们被困在火海中。",
          statsDelta: { personalSecurity: -5 }
        }
      }
    ]
  },

  // Event 30: The Wife
  {
    id: "evt_30",
    phase: "SIEGE",
    narrative: "02:22 AM。混乱中，你发现妻子席莉亚不见了。回头看，她正蹲在地上收集散落的文件，试图烧毁它们。那是关于海外账户和'太阳卡特尔'的账本。如果这些落入美国人手中，你们将永无翻身之日。",
    newsTicker: "RUMOR: 美军搜查队正在寻找关键情报文件。",
    location: "Private Office",
    time: "Jan 03, 2026, 02:22 AM",
    options: [
      {
        id: "opt_030_a",
        text: "冲过去帮她一起烧。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_34",
        outcome: {
          narrative: "火盆吞噬了纸张。你们在火光中对视。这是犯罪证据的销毁，也是过去的告别。",
          statsDelta: { personalSecurity: -10, internationalStance: 5 }
        }
      },
      {
        id: "opt_030_b",
        text: "强行把她拖走，'命比钱重要！'",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_33",
        outcome: {
          narrative: "她尖叫着被你拖向暗门。文件散落一地。美国人会得到它们，但至少你保住了她的人。",
          statsDelta: { personalSecurity: 5, internationalStance: -20 }
        }
      },
      {
        id: "opt_030_c",
        text: "命令卫兵留下来销毁文件，自己带妻子先走。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_32",
        outcome: {
          narrative: "这是领导者的冷酷。卫兵敬了个礼，知道自己是弃子。你带着妻子逃离了。",
          statsDelta: { militaryLoyalty: -15, personalSecurity: 15 }
        }
      }
    ]
  },

  // Event 31: The Jammer
  {
    id: "evt_31",
    phase: "SIEGE",
    narrative: "02:25 AM。你的私人通讯器响了。是帕德里诺将军。'总统先生，他们封锁了所有频段，但我用备用线路联系到了第4装甲师的一个营，他们距离宫殿只有5公里。' 这可能是最后的援军。但美军的AH-64阿帕奇直升机正在那一带猎杀。",
    newsTicker: "BATTLE: 加拉加斯街头出现小规模坦克交火。",
    location: "Secure Corridor",
    time: "Jan 03, 2026, 02:25 AM",
    options: [
      {
        id: "opt_031_a",
        text: "命令坦克营强行突击，冲击宫殿外围。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_35",
        outcome: {
          narrative: "自杀式冲锋。几辆T-72坦克在街道上燃烧。但它们确实吸引了美军的空中火力，减轻了宫殿的压力。",
          statsDelta: { militaryLoyalty: -10, personalSecurity: 10 }
        }
      },
      {
        id: "opt_031_b",
        text: "让他们分散隐蔽，等待你突围后再汇合。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_36",
        outcome: {
          narrative: "理智的决定。保留了最后的机动力量。这可能是你逃出加拉加斯的唯一希望。",
          statsDelta: { personalSecurity: 5, militaryLoyalty: 5 }
        }
      },
      {
        id: "opt_031_c",
        text: "告诉帕德里诺：'保护好你自己'。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_34",
        outcome: {
          narrative: "这是一种遗言。帕德里诺沉默了。也许他会因此而感念旧情，也许他会立刻投降。",
          statsDelta: { militaryLoyalty: 0 }
        }
      }
    ]
  },

  // Event 32: The Betrayal
  {
    id: "evt_32",
    phase: "SIEGE",
    narrative: "02:27 AM。你的贴身卫队队长突然调转枪口，指着你的头。'对不起，尼古拉斯。美国人承诺给我绿卡和一千万美元。' 他的手在抖，显然他也很害怕。周围的几个卫兵也举起了枪，对峙局面形成。",
    newsTicker: "CHAOS: 总统府内部传出密集枪声，疑似发生内讧。",
    location: "Bolivar Hall",
    time: "Jan 03, 2026, 02:27 AM",
    options: [
      {
        id: "opt_032_a",
        text: "拔出镀金手枪，与他决斗。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_37",
        outcome: {
          narrative: "砰！他倒下了，眉心中弹。你也没想到自己还能开枪。其他叛变者被这股狠劲震慑，放下了枪。",
          statsDelta: { personalSecurity: 5, militaryLoyalty: 10 }
        }
      },
      {
        id: "opt_032_b",
        text: "拿出瑞士银行的黑卡，'我给你两千万'。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_36",
        outcome: {
          narrative: "贪婪战胜了恐惧。他收下了卡，枪口垂下。'快走，这卡最好能刷得出来。' 忠诚是可以购买的，只是价格问题。",
          statsDelta: { personalSecurity: 10, publicSupport: -5 }
        }
      },
      {
        id: "opt_032_c",
        text: "席莉亚突然扑向他，为你挡枪。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_35",
        outcome: {
          narrative: "混乱中，席莉亚被推倒。你趁机撞开了卫队长。忠诚的卫兵击毙了叛徒。你活下来了，但妻子受了伤。",
          statsDelta: { personalSecurity: 5, militaryLoyalty: 5 }
        }
      }
    ]
  },

  // Event 33: The Bunker Door
  {
    id: "evt_33",
    phase: "SIEGE",
    narrative: "02:28 AM。终于到了'La Roca'地下掩体的入口。这是一扇厚重的钛合金防爆门，需要视网膜扫描。扫描仪发出红光——'Access Denied'（访问拒绝）。该死，那个叛逃的情报局长修改了权限！身后的脚步声越来越近。",
    newsTicker: "UPDATE: 美军正在逐层清理总统府，逼近核心区域。",
    location: "Bunker Entrance",
    time: "Jan 03, 2026, 02:28 AM",
    options: [
      {
        id: "opt_033_a",
        text: "使用C4炸药强行破门。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_38",
        outcome: {
          narrative: "巨大的爆炸震耳欲聋。门被炸开了一个口子。警报声大作，但这已经不重要了。你们钻了进去。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_033_b",
        text: "尝试使用备用机械密码锁。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_37",
        outcome: {
          narrative: "手指在颤抖。左三圈，右两圈... '咔嚓'。机械结构的可靠性拯救了你。门开了。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_033_c",
        text: "放弃掩体，转向仆人通道逃生。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_36",
        outcome: {
          narrative: "你转身冲向厨房区域。那里有一条通往后街的垃圾运送通道。肮脏，但可能没人把守。",
          statsDelta: { personalSecurity: 15, publicSupport: -5 }
        }
      }
    ]
  },

  // Event 34: The Flashbang
  {
    id: "evt_34",
    phase: "SIEGE",
    narrative: "02:29 AM。你正准备进入通道，一枚圆柱体滚到了脚边。'Flashbang!'（震撼弹）。白光和巨响瞬间剥夺了你的感官。耳鸣，眩晕。你瘫倒在地，模糊中看到几个戴着防毒面具的身影冲了过来。",
    newsTicker: "BREAKING: 总统府核心区发生爆炸，特种部队呼叫后送。",
    location: "Kitchen Corridor",
    time: "Jan 03, 2026, 02:29 AM",
    options: [
      {
        id: "opt_034_a",
        text: "盲目向四周扫射。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_39",
        outcome: {
          narrative: "冲锋枪吐出火舌。你可能击中了什么，也可能只是打中了墙壁。一只有力的手按住了你的枪管，枪托重重砸在你脸上。",
          statsDelta: { personalSecurity: -30 }
        }
      },
      {
        id: "opt_034_b",
        text: "蜷缩身体，装死。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_38",
        outcome: {
          narrative: "战术靴踢了你一脚。确认目标存活。他们把你像死猪一样拖了起来。你被捕了...或者还有转机？",
          statsDelta: { personalSecurity: -20 }
        }
      },
      {
        id: "opt_034_c",
        text: "大喊'我有炸弹背心！'。",
        type: "desperate",
        risk: "extreme",
        nextEventId: "evt_37",
        outcome: {
          narrative: "这是一个疯狂的谎言。美军瞬间散开，甚至有人想要撤退。这给了你几秒钟的喘息。",
          statsDelta: { personalSecurity: 10, internationalStance: -10 }
        }
      }
    ]
  },

  // Event 35: The Secret Exit
  {
    id: "evt_35",
    phase: "SIEGE",
    narrative: "02:30 AM。如果你还在移动，你已经接近了'La Roca'隧道的深处。这里原本是查韦斯为核战争准备的。墙上挂着旧时代的标语。头顶的爆炸声变得沉闷。你暂时安全了，但你知道，出口可能已经被海豹突击队封锁。",
    newsTicker: "INTEL: 目标人物可能进入地下掩体系统。",
    location: "La Roca Tunnel, Sector A",
    time: "Jan 03, 2026, 02:30 AM",
    options: [
      {
        id: "opt_035_a",
        text: "给出口的守卫打电话确认安全。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_40",
        outcome: {
          narrative: "电话通了，但是是一个美国人的声音：'Hello, Mr. President. We are waiting.' 出口被占领了。",
          statsDelta: { personalSecurity: -20 }
        }
      },
      {
        id: "opt_035_b",
        text: "不联系，直接从备用的通风井爬出去。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_39",
        outcome: {
          narrative: "通风井狭窄且布满灰尘。你像个矿工一样攀爬。避开了出口的伏击，但体力透支。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_035_c",
        text: "在隧道里布设阔剑地雷。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_38",
        outcome: {
          narrative: "追兵会付出代价的。爆炸声在隧道里回荡，可能会导致坍塌，把你埋在里面。",
          statsDelta: { militaryLoyalty: 5, personalSecurity: -5 }
        }
      }
    ]
  },

  // Event 36: The Looting
  {
    id: "evt_36",
    phase: "SIEGE",
    narrative: "02:30 AM。如果你在后街。宫殿的防御已经崩溃，周围的贫民窟民众开始冲进宫殿外围抢劫。他们搬走家具、画作，甚至试图拆下镀金的大门。混乱是你最好的伪装。",
    newsTicker: "CHAOS: 米拉弗洛雷斯宫周边发生大规模抢劫事件。",
    location: "Palace Exterior",
    time: "Jan 03, 2026, 02:30 AM",
    options: [
      {
        id: "opt_036_a",
        text: "混入抢劫人群，假装是暴徒。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_40",
        outcome: {
          narrative: "你扛着一幅不知名的油画，低着头。美军无人机扫过人群，把你识别为普通抢劫者。你混出去了。",
          statsDelta: { personalSecurity: 20, publicSupport: -10 }
        }
      },
      {
        id: "opt_036_b",
        text: "试图组织人群抵抗美军。",
        type: "diplomatic",
        risk: "extreme",
        nextEventId: "evt_39",
        outcome: {
          narrative: "没人听你的。他们只在乎手里的战利品。甚至有人认出了你，眼神变得贪婪——把你交给美国人能换更多钱。",
          statsDelta: { personalSecurity: -20, publicSupport: -15 }
        }
      },
      {
        id: "opt_036_c",
        text: "抢一辆摩托车独自逃离。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_38",
        outcome: {
          narrative: "你推倒了一个年轻人，抢走了他的破旧摩托车。在引擎的轰鸣声中，你冲入了加拉加斯的夜色。",
          statsDelta: { personalSecurity: 15 }
        }
      }
    ]
  },

  // Event 37: The K-9 Unit
  {
    id: "evt_37",
    phase: "SIEGE",
    narrative: "02:30 AM。隧道深处。你听到了狗叫声。是美军军犬。它们嗅到了你的气味。这种比利时马利诺犬是完美的追踪机器。你跑不过它们。",
    newsTicker: "TACTIC: 美军投入K-9部队搜寻地下设施。",
    location: "La Roca Tunnel, Sector B",
    time: "Jan 03, 2026, 02:30 AM",
    options: [
      {
        id: "opt_037_a",
        text: "撒下胡椒粉和化学清洁剂干扰嗅觉。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_40",
        outcome: {
          narrative: "清洁剂的气味刺鼻。狗开始打喷嚏，失去了方向。这一招很土，但很有效。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_037_b",
        text: "准备匕首，近身搏斗。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_39",
        outcome: {
          narrative: "黑影扑了上来。你被扑倒，手臂被咬穿。虽然你刺死了狗，但剧痛和流血让你几乎晕厥。",
          statsDelta: { personalSecurity: -30 }
        }
      },
      {
        id: "opt_037_c",
        text: "涉水通过地下河段。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_38",
        outcome: {
          narrative: "冰冷的污水没过胸口。气味被水隔断了。你在黑暗的水流中漂流，远离了追兵。",
          statsDelta: { personalSecurity: 15 }
        }
      }
    ]
  },

  // Event 38: The Chopper Overhead
  {
    id: "evt_38",
    phase: "SIEGE",
    narrative: "02:30 AM。如果你在地面逃亡。一架AH-6小鸟直升机在头顶盘旋，探照灯像上帝之眼一样扫视街道。你躲在一辆燃烧的公交车后面。心跳声比直升机旋翼声还要大。",
    newsTicker: "SEARCH: 美军空中力量正在封锁加拉加斯西部街区。",
    location: "West Caracas Streets",
    time: "Jan 03, 2026, 02:30 AM",
    options: [
      {
        id: "opt_038_a",
        text: "保持不动，利用热源掩护。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_40",
        outcome: {
          narrative: "公交车的火焰干扰了红外成像。探照灯移开了。你像变色龙一样融化在背景中。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_038_b",
        text: "跑进旁边的小巷。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_39",
        outcome: {
          narrative: "你一动，光柱就跟了过来。机枪子弹打在脚后跟。你狼狈地滚进了下水道口。差点就死了。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_038_c",
        text: "向直升机开枪。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_39",
        outcome: {
          narrative: "愚蠢的举动。你暴露了自己。一枚火箭弹在你身边爆炸。世界变成了一片嗡嗡声。",
          statsDelta: { personalSecurity: -50 }
        }
      }
    ]
  },

  // Event 39: The Capture Point
  {
    id: "evt_39",
    phase: "SIEGE",
    narrative: "02:30 AM。所有的路口都被封锁了。前面是美军的史崔克装甲车，后面是追兵。你被困在了一个死胡同里。身边只剩下最后一名保镖。他看着你，眼神复杂。是战死，还是投降？",
    newsTicker: "BREAKING: 美军地面指挥官报告'已包围主要目标'。",
    location: "Dead End Alley",
    time: "Jan 03, 2026, 02:30 AM",
    options: [
      {
        id: "opt_039_a",
        text: "举手投降，保留性命。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_106",
        outcome: {
          narrative: "你丢掉了手枪。装甲车上的机枪指着你。一群大兵冲上来把你按倒。扎带勒紧了手腕。一切都结束了。",
          statsDelta: { personalSecurity: -100, publicSupport: -50 }
        }
      },
      {
        id: "opt_039_b",
        text: "试图翻墙逃入居民楼。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_40",
        outcome: {
          narrative: "你爬上了墙头。一发橡胶子弹击中了你的背部。你摔进了院子里。痛得无法呼吸，但你还在跑。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_039_c",
        text: "吞下藏在领口的氰化物。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "END_MARTYR",
        outcome: {
          narrative: "这是最后的解脱。世界变黑了。你没有给美国人审判你的机会。你成为了永远的烈士。",
          statsDelta: { publicSupport: 100 }
        }
      }
    ]
  },

  // Event 40: The Tunnel End
  {
    id: "evt_40",
    phase: "SIEGE",
    narrative: "02:30 AM。你看到了'La Roca'隧道出口的微光。那里是'23 de Enero'贫民窟的深处。那是你的地盘。如果能冲出去，那里有数千名武装民兵。这是从地狱到天堂的最后一百米。",
    newsTicker: "INTEL: 目标人物可能正试图进入反政府武装控制区。",
    location: "Tunnel Exit",
    time: "Jan 03, 2026, 02:30 AM",
    options: [
      {
        id: "opt_040_a",
        text: "冲刺！不顾一切地冲刺！",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_41",
        outcome: {
          narrative: "肺部像在燃烧。你冲出了出口，跌倒在垃圾堆里。周围响起了友军的西班牙语欢呼声。你活下来了。",
          statsDelta: { personalSecurity: 20, militaryLoyalty: 10 }
        }
      },
      {
        id: "opt_040_b",
        text: "先侦察出口是否有埋伏。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_42",
        outcome: {
          narrative: "你扔了一块石头。没有枪声。看起来是安全的。小心驶得万年船。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_040_c",
        text: "等待接应人员发信号。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_41",
        outcome: {
          narrative: "三声手电筒闪光。是自己人。你从阴影中走出来，被粗糙的大手拥抱。安全了。",
          statsDelta: { personalSecurity: 15 }
        }
      }
    ]
  },

  // =========================================================================
  // BATCH 3: RAT RUN IN THE SLUMS (Events 41-60)
  // =========================================================================

  // Event 41: Welcome to the Barrio
  {
    id: "evt_41",
    phase: "ESCAPE",
    narrative: "02:35 AM。'23 de Enero'贫民窟的空气中混合着垃圾焚烧和火药的味道。这里的房屋像积木一样堆叠在山上，卫星地图在这里毫无作用。迎接你的是'La Piedrita'集体的领袖，一个叫'El Chino'的独眼男人。他手里拿着一把镀金的AK-47，那是你两年前送给他的。",
    newsTicker: "INTEL: 美军第75游骑兵团正在包围加拉加斯西区贫民窟。",
    location: "Barrio 23 de Enero",
    time: "Jan 03, 2026, 02:35 AM",
    options: [
      {
        id: "opt_041_a",
        text: "拥抱他，称他为'革命的兄弟'。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_42",
        outcome: {
          narrative: "在这个时刻，旧日的恩惠换来了救命的忠诚。他把你拉进了阴影里。'只要我还活着，美国佬就别想带走你。'",
          statsDelta: { personalSecurity: 10, militaryLoyalty: 5 }
        }
      },
      {
        id: "opt_041_b",
        text: "要求他立刻提供车辆和护送。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_43",
        outcome: {
          narrative: "你依然试图保持总统的威严。他皱了皱眉，但还是照做了。这种命令式的语气在此时此地很危险。",
          statsDelta: { publicSupport: -5 }
        }
      },
      {
        id: "opt_041_c",
        text: "给他一张写着瑞士账户密码的纸条。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_42",
        outcome: {
          narrative: "金钱交易。最纯粹，也最脆弱。他收下了纸条，眼中的狂热被贪婪取代。你买到了服务，但失去了敬意。",
          statsDelta: { personalSecurity: 5, publicSupport: -10 }
        }
      }
    ]
  },

  // Event 42: The Motorcade
  {
    id: "evt_42",
    phase: "ESCAPE",
    narrative: "02:40 AM。二十辆摩托车组成的护送队。每辆车上都坐着两个手持乌兹冲锋枪的蒙面人。你在中间，戴着头盔。引擎声在狭窄的巷道里轰鸣。这是一场死亡飞车，目标是穿过美军的封锁线到达东部的圣奥古斯丁区。",
    newsTicker: "SIGHTING: 加拉加斯西区出现大量武装摩托车队活动。",
    location: "Narrow Alleyways",
    time: "Jan 03, 2026, 02:40 AM",
    options: [
      {
        id: "opt_042_a",
        text: "命令全速冲卡。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_43",
        outcome: {
          narrative: "速度是唯一的防御。摩托车在台阶上飞驰。风声呼啸，掩盖了远处的螺旋桨声。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_042_b",
        text: "分散队形，化整为零。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_44",
        outcome: {
          narrative: "车队散开了。你变成了一滴水融入了大海。这降低了被集火的风险，但一旦遇到伏击，你将孤立无援。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_042_c",
        text: "走地下排水渠路线。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_55",
        outcome: {
          narrative: "放弃了速度，选择了隐蔽。排水渠里满是污秽，但至少避开了天空中的无人机。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 43: The Drone Strike
  {
    id: "evt_43",
    phase: "ESCAPE",
    narrative: "02:42 AM。'地狱火'导弹来袭。没有声音，直到爆炸发生。前方的三辆摩托车瞬间化为火球。冲击波把你掀翻在地。美军的MQ-9死神无人机一直在头顶盯着你们。所有的热源都是目标。",
    newsTicker: "STRIKE: 美军无人机精准打击加拉加斯西区移动目标。",
    location: "Hillside Road",
    time: "Jan 03, 2026, 02:42 AM",
    options: [
      {
        id: "opt_043_a",
        text: "弃车，跑进路边的民房。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_44",
        outcome: {
          narrative: "你踢开了一扇门。屋里的一家人惊恐地看着你。屋顶挡住了热成像。暂时安全了。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_043_b",
        text: "扶起摩托车继续跑。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_46",
        outcome: {
          narrative: "你是疯子。第二枚导弹落在你身后十米处。弹片划破了你的夹克。你在火焰中冲了出去。",
          statsDelta: { personalSecurity: -20 }
        }
      },
      {
        id: "opt_043_c",
        text: "躲在燃烧的残骸旁装死。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_45",
        outcome: {
          narrative: "这是一个大胆的赌博。无人机盘旋了一圈，确认目标已摧毁，然后飞走了。你闻着烤肉的味道，活了下来。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 44: The Safehouse
  {
    id: "evt_44",
    phase: "ESCAPE",
    narrative: "02:45 AM。你躲进了一栋名为'Block 7'的公寓楼。这里是Colectivos的核心据点。墙上画着查韦斯的巨幅画像。El Chino把你带到了14楼的一个公寓。窗外可以看到燃烧的米拉弗洛雷斯宫。",
    newsTicker: "SEARCH: 美军开始对贫民窟进行网格化搜索。",
    location: "Block 7 Apartment",
    time: "Jan 03, 2026, 02:45 AM",
    options: [
      {
        id: "opt_044_a",
        text: "利用这里的高频电台联系外界。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_47",
        outcome: {
          narrative: "电台信号可能会被三角定位。但你需要知道还有谁活着。你发出了加密呼叫。",
          statsDelta: { internationalStance: 5, personalSecurity: -10 }
        }
      },
      {
        id: "opt_044_b",
        text: "命令手下封锁楼道，准备死守。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_46",
        outcome: {
          narrative: "这座楼变成了堡垒。每一层都部署了枪手。但这只是把这里变成了更大的靶子。",
          statsDelta: { militaryLoyalty: 5 }
        }
      },
      {
        id: "opt_044_c",
        text: "换上平民衣服，准备随时转移。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_50",
        outcome: {
          narrative: "你脱下了昂贵的防弹西装，换上了脏兮兮的T恤和牛仔裤。现在你看起来像个码头工人。",
          statsDelta: { personalSecurity: 15 }
        }
      }
    ]
  },

  // Event 45: The Traitor Within
  {
    id: "evt_45",
    phase: "ESCAPE",
    narrative: "02:48 AM。你在走廊里休息。忽然听到隔壁房间有人在低声打电话：'是的，他在我这。我要五百万。不，是美金。' 是那个给你带路的小混混。悬赏令起作用了。",
    newsTicker: "REWARD: 美国国务院宣布悬赏金额提升至5000万美元。",
    location: "Block 7 Corridor",
    time: "Jan 03, 2026, 02:48 AM",
    options: [
      {
        id: "opt_045_a",
        text: "冲进去杀了他。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_47",
        outcome: {
          narrative: "你没有犹豫。用消音手枪解决了他。电话那头还在喂喂喂。你挂断了电话。位置暴露了，快跑。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_045_b",
        text: "悄悄离开，反锁房门。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_46",
        outcome: {
          narrative: "你把他锁在了里面。等美军来的时候，只会找到一个被困住的告密者。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_045_c",
        text: "给他更多的钱策反他。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_46",
        outcome: {
          narrative: "你推门进去，把一袋钻石扔在桌上。'这比美国人给的多，而且是现货。' 他动摇了。但这依然是个隐患。",
          statsDelta: { personalSecurity: -10 }
        }
      }
    ]
  },

  // Event 46: The Checkpoint
  {
    id: "evt_46",
    phase: "ESCAPE",
    narrative: "02:52 AM。你必须穿过Av. Sucre大道。美军游骑兵已经设立了临时检查站。史崔克装甲车的探照灯封锁了路面。任何移动物体都会被.50机枪撕碎。",
    newsTicker: "BLOCKADE: 美军封锁加拉加斯所有主要交通干道。",
    location: "Av. Sucre",
    time: "Jan 03, 2026, 02:52 AM",
    options: [
      {
        id: "opt_046_a",
        text: "制造声东击西的爆炸。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_48",
        outcome: {
          narrative: "一颗手雷在街角爆炸。装甲车调转了枪口。你趁机冲过了马路。子弹在脚边激起火花。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_046_b",
        text: "从地下水道穿越。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_55",
        outcome: {
          narrative: "又是下水道。但这是唯一的安全通道。你在恶臭中匍匐前进，头顶是装甲车的轰鸣。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_046_c",
        text: "混在一群逃难的难民中。",
        type: "desperate",
        risk: "extreme",
        nextEventId: "evt_50",
        outcome: {
          narrative: "你抱着一个不知谁家的孩子，低着头走过检查站。大兵看了一眼你的脏脸，挥手放行。这是你人生中最漫长的十秒。",
          statsDelta: { personalSecurity: 20, publicSupport: 5 }
        }
      }
    ]
  },

  // Event 47: The Rooftops
  {
    id: "evt_47",
    phase: "ESCAPE",
    narrative: "02:55 AM。地面太危险了。你爬上了屋顶。贫民窟的屋顶是相连的，像一片波浪起伏的铁皮海洋。你在晾衣绳和卫星锅之间跳跃。月光下，你是一个孤独的跑酷者。",
    newsTicker: "TACTIC: 无人机正在扫描屋顶区域。",
    location: "Rooftops",
    time: "Jan 03, 2026, 02:55 AM",
    options: [
      {
        id: "opt_047_a",
        text: "快速奔跑，拉开距离。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_48",
        outcome: {
          narrative: "你在铁皮屋顶上狂奔，声音像打雷一样响。这引起了注意。一架小鸟直升机正在转向这边。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_047_b",
        text: "匍匐前进，利用女儿墙掩护。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_49",
        outcome: {
          narrative: "慢，但是稳。你避开了空中的视线。只是膝盖被磨破了，血渗了出来。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_047_c",
        text: "跳进一家人的阳台躲避。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_49",
        outcome: {
          narrative: "你跳进了一个阳台。那是反对派支持者的家，墙上挂着冈萨雷斯的海报。尴尬的对视。",
          statsDelta: { personalSecurity: -5 }
        }
      }
    ]
  },

  // Event 48: The Sniper
  {
    id: "evt_48",
    phase: "ESCAPE",
    narrative: "03:00 AM。一声枪响。你身边的水箱被打爆了，水花四溅。是狙击手。他在高处，配备了热成像瞄准镜。你被压制在一个矮墙后面，不敢露头。",
    newsTicker: "BATTLE: 美军狙击手控制了贫民窟制高点。",
    location: "Rooftop Water Tank",
    time: "Jan 03, 2026, 03:00 AM",
    options: [
      {
        id: "opt_048_a",
        text: "扔出头盔诱骗开火。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_51",
        outcome: {
          narrative: "砰！头盔被击飞。你知道了他的射击间隔。就是现在，跑！",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_048_b",
        text: "呼叫Colectivos用RPG压制。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_52",
        outcome: {
          narrative: "一枚火箭弹击中了狙击手所在的塔楼。威胁解除了，但你也暴露了自己的指挥位置。",
          statsDelta: { militaryLoyalty: 5, personalSecurity: -5 }
        }
      },
      {
        id: "opt_048_c",
        text: "一直等到他转移目标。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_49",
        outcome: {
          narrative: "你等了二十分钟。每一秒都是煎熬。直到他去射击另一组民兵，你才敢动。",
          statsDelta: { personalSecurity: 0 }
        }
      }
    ]
  },

  // Event 49: The Civilian
  {
    id: "evt_49",
    phase: "ESCAPE",
    narrative: "03:05 AM。你跳进一个小巷，踩到了什么东西。是一个受伤的老妇人，被流弹击中了腿。她认出了你，抓住了你的裤脚。'总统先生，救救我。'",
    newsTicker: "CASUALTIES: 贫民窟交火造成大量平民伤亡。",
    location: "Back Alley",
    time: "Jan 03, 2026, 03:05 AM",
    options: [
      {
        id: "opt_049_a",
        text: "停下来为她包扎。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_50",
        outcome: {
          narrative: "你撕下衬衫为她止血。这耽误了五分钟。但这有人看到了，也许明天这会成为一个传说。",
          statsDelta: { publicSupport: 20, personalSecurity: -10 }
        }
      },
      {
        id: "opt_049_b",
        text: "给她一叠钱，然后离开。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_50",
        outcome: {
          narrative: "钱止不住血。她绝望地看着你离开。你保住了时间，丢掉了良心。",
          statsDelta: { publicSupport: -10, personalSecurity: 5 }
        }
      },
      {
        id: "opt_049_c",
        text: "为了不暴露，捂住她的嘴直到她昏迷。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_51",
        outcome: {
          narrative: "残酷的必要之恶。你是个怪物，但你是个活着的怪物。",
          statsDelta: { publicSupport: -50, personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 50: The Identity
  {
    id: "evt_50",
    phase: "ESCAPE",
    narrative: "03:10 AM。你的脸太容易辨认了，甚至你的胡子都是标志性的。在一家废弃的理发店里，你看着镜子里的自己。这把剪刀可以改变一切。",
    newsTicker: "SEARCH: 美军分发总统面部特征识别卡。",
    location: "Abandoned Barbershop",
    time: "Jan 03, 2026, 03:10 AM",
    options: [
      {
        id: "opt_050_a",
        text: "剃掉那标志性的胡子。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_51",
        outcome: {
          narrative: "胡须落地。镜子里的人看起来陌生而苍老。你不再是那个强人领袖，只是一个疲惫的大叔。完美的伪装。",
          statsDelta: { personalSecurity: 20, publicSupport: -5 }
        }
      },
      {
        id: "opt_050_b",
        text: "只戴上墨镜和帽子。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_52",
        outcome: {
          narrative: "不够彻底。任何熟悉你的人还是能一眼认出。这是自欺欺人。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_050_c",
        text: "毁容以彻底改变容貌。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_53",
        outcome: {
          narrative: "你用烫红的刀片划过脸颊。剧痛。现在的你看起来像个黑帮打手。没人能认出你了，连你自己都认不出。",
          statsDelta: { personalSecurity: 30, publicSupport: -10 }
        }
      }
    ]
  },

  // Event 51: The Broadcast Van
  {
    id: "evt_51",
    phase: "ESCAPE",
    narrative: "03:15 AM。一辆美军的PSYOP（心理战）悍马车停在广场上，大喇叭正在播放：'马杜罗已经抛弃了你们。他带着黄金逃跑了。举报他的人将获得自由。' 周围的民众开始窃窃私语。",
    newsTicker: "PSYOPS: 美军在占领区进行心理战广播。",
    location: "Plaza Catia",
    time: "Jan 03, 2026, 03:15 AM",
    options: [
      {
        id: "opt_051_a",
        text: "绕开广场。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_54",
        outcome: {
          narrative: "你压低帽檐，钻进小巷。谎言在传播，但你无力反驳。活下去才是反击。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_051_b",
        text: "向车辆投掷燃烧瓶。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_53",
        outcome: {
          narrative: "火焰吞噬了悍马车。广播戛然而止。民众欢呼。你证明了抵抗还在继续。",
          statsDelta: { publicSupport: 10, personalSecurity: -10 }
        }
      },
      {
        id: "opt_051_c",
        text: "站出来大喊'我在通过！'。",
        type: "desperate",
        risk: "extreme",
        nextEventId: "evt_52",
        outcome: {
          narrative: "这是找死。车顶机枪立刻转向你。幸好你的卫兵把你扑倒了。勇敢，但愚蠢。",
          statsDelta: { personalSecurity: -20, publicSupport: 5 }
        }
      }
    ]
  },

  // Event 52: The Journalist
  {
    id: "evt_52",
    phase: "ESCAPE",
    narrative: "03:18 AM。你撞见了一个正在拍摄战况的半岛电视台记者。他认出了你，惊呆了。摄像机的红灯在闪烁。这是向世界发声的机会，也是暴露坐标的风险。",
    newsTicker: "MEDIA: 外国记者在战区活动，试图寻找独家新闻。",
    location: "Ruined Storefront",
    time: "Jan 03, 2026, 03:18 AM",
    options: [
      {
        id: "opt_052_a",
        text: "接受简短采访，谴责侵略。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_54",
        outcome: {
          narrative: "这几十秒的画面将在几分钟后传遍全球。你看起来狼狈但未屈服。这是最好的宣传，但这也会引来导弹。",
          statsDelta: { internationalStance: 20, personalSecurity: -15 }
        }
      },
      {
        id: "opt_052_b",
        text: "砸烂摄像机，威胁他闭嘴。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_53",
        outcome: {
          narrative: "没有影像流出。记者吓坏了。安全第一。",
          statsDelta: { personalSecurity: 10, internationalStance: -5 }
        }
      },
      {
        id: "opt_052_c",
        text: "没收他的防弹衣和卫星电话。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_55",
        outcome: {
          narrative: "你抢劫了记者。这很不体面，但防弹衣可能救你一命。电话让你恢复了通讯。",
          statsDelta: { personalSecurity: 15, internationalStance: -10 }
        }
      }
    ]
  },

  // Event 53: The Hunger
  {
    id: "evt_53",
    phase: "ESCAPE",
    narrative: "03:20 AM。肾上腺素消退后，极度的饥饿和脱水袭来。你已经一天没吃东西了。路边有一个被炸了一半的小卖部，里面可能还有水。但那里也是狙击手的理想诱饵区。",
    newsTicker: "STATUS: 逃亡总统可能面临补给短缺。",
    location: "Bombed Bodega",
    time: "Jan 03, 2026, 03:20 AM",
    options: [
      {
        id: "opt_053_a",
        text: "冒险进去拿水。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_56",
        outcome: {
          narrative: "你拿到了两瓶可乐。就在你转身时，子弹击碎了身边的货架。是用命换来的糖分。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_053_b",
        text: "忍着，继续赶路。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_55",
        outcome: {
          narrative: "嘴唇干裂，视线模糊。意志力在支撑着肉体。你避开了陷阱，但体能在下降。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_053_c",
        text: "派手下去拿。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_54",
        outcome: {
          narrative: "手下去了。手下倒下了。没能拿到水。你失去了一个护卫，依然口渴。",
          statsDelta: { militaryLoyalty: -20 }
        }
      }
    ]
  },

  // Event 54: The Arms Dealer
  {
    id: "evt_54",
    phase: "ESCAPE",
    narrative: "03:22 AM。你遇到了'El Ruso'，一个当地的军火贩子。他有一辆防弹的丰田陆地巡洋舰和一车库的毒刺导弹。但他不做慈善。他看着你手上的百达翡丽手表，笑了。",
    newsTicker: "CRIME: 黑市军火商在战乱中大发横财。",
    location: "Hidden Garage",
    time: "Jan 03, 2026, 03:22 AM",
    options: [
      {
        id: "opt_054_a",
        text: "用手表换一辆车。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_58",
        outcome: {
          narrative: "交易达成。那是你最喜欢的手表，但现在它只是一张车票。你又有轮子了。",
          statsDelta: { personalSecurity: 20 }
        }
      },
      {
        id: "opt_054_b",
        text: "强行征用他的库存。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_56",
        outcome: {
          narrative: "火拼。你的人杀了他，抢了车。但枪声引来了美军。这辆车现在是个烫手山芋。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_054_c",
        text: "向他购买情报：哪里有包围圈缺口？",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_57",
        outcome: {
          narrative: "他指了一条路。'往南走，那边的游骑兵刚刚撤换防。' 这条情报比导弹更有价值。",
          statsDelta: { personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 55: The Sewer Rat
  {
    id: "evt_55",
    phase: "ESCAPE",
    narrative: "03:25 AM。如果你选择了下水道线。这里又黑又臭，老鼠在脚边窜动。但这里通向城市边缘的Guaire河。只要不被沼气熏死，或者被暴涨的河水冲走。",
    newsTicker: "SEARCH: 美军工兵正在检查城市地下管网。",
    location: "Main Sewer Line",
    time: "Jan 03, 2026, 03:25 AM",
    options: [
      {
        id: "opt_055_a",
        text: "点燃打火机照明。",
        type: "desperate",
        risk: "extreme",
        nextEventId: "evt_56",
        outcome: {
          narrative: "轰！积聚的沼气被引燃。一场小型的爆炸。你的眉毛被烧光了，但至少吓退了老鼠。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_055_b",
        text: "摸黑前进。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_57",
        outcome: {
          narrative: "你滑倒了好几次，满身污秽。但这层污泥成了最好的伪装色。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_055_c",
        text: "寻找地面出口透气。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_56",
        outcome: {
          narrative: "你推开了一个井盖。正好是一个美军哨所的脚下。你赶紧盖上。差点就自投罗网。",
          statsDelta: { personalSecurity: -5 }
        }
      }
    ]
  },

  // Event 56: The Bounty Hunters
  {
    id: "evt_56",
    phase: "ESCAPE",
    narrative: "03:28 AM。三个穿着战术背心的便衣挡住了去路。不是美军，是'黑水'（或者现在的名字）的私人承包商。他们是为了那5000万悬赏来的。他们不想要尸体，要活的。",
    newsTicker: "MERCENARIES: 私人军事承包商加入搜捕行动。",
    location: "Industrial Yard",
    time: "Jan 03, 2026, 03:28 AM",
    options: [
      {
        id: "opt_056_a",
        text: "提出双倍价钱反向雇佣。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_58",
        outcome: {
          narrative: "他们犹豫了。'先给钱。' 你没有那么多现金。谈判破裂。枪战开始。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_056_b",
        text: "先发制人，开枪。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_59",
        outcome: {
          narrative: "你击倒了一个。另外两个找掩体还击。你趁着火力压制跑进了仓库。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_056_c",
        text: "制造噪音引来附近的美军。",
        type: "stealth",
        risk: "extreme",
        nextEventId: "evt_57",
        outcome: {
          narrative: "驱虎吞狼。美军来了，把他们当成了武装分子。双方交火。你趁乱溜走。",
          statsDelta: { personalSecurity: 15 }
        }
      }
    ]
  },

  // Event 57: The Old Friend
  {
    id: "evt_57",
    phase: "ESCAPE",
    narrative: "03:30 AM。你敲开了一扇门。这是以前的一个工会领袖的家。他曾经是你最坚定的支持者。他打开门，看到了狼狈的你。他的眼神里有震惊，也有一丝...犹豫。他身后，电视上正播放着你的通缉令。",
    newsTicker: "REWARD: 通缉令在电视上循环播放。",
    location: "Safe Apartment",
    time: "Jan 03, 2026, 03:30 AM",
    options: [
      {
        id: "opt_057_a",
        text: "请求他藏匿你一小时。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_59",
        outcome: {
          narrative: "他让你进来了。给了你一杯水。但他去厨房打电话的时间有点太长了。直觉告诉你不对劲。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_057_b",
        text: "只是要一点食物，然后立刻走。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_58",
        outcome: {
          narrative: "拿了一块面包。你看到了他想报警的手。你转身离开了。信任在5000万美元面前一文不值。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_057_c",
        text: "绑架他作为人质。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_59",
        outcome: {
          narrative: "你把他捆了起来。这很讽刺，你绑架了自己的支持者。但这保证了他不会报警。",
          statsDelta: { personalSecurity: 10, publicSupport: -20 }
        }
      }
    ]
  },

  // Event 58: The Trap
  {
    id: "evt_58",
    phase: "ESCAPE",
    narrative: "03:32 AM。前面的路被铁丝网封锁了。看起来是个死胡同。突然，探照灯亮起。'放下武器！' 是委内瑞拉反对派的民兵。他们穿着自制的制服，看起来比美军更狂热。他们想亲手抓住独裁者。",
    newsTicker: "MILITIA: 反对派民兵在街头设立私设检查站。",
    location: "Blocked Street",
    time: "Jan 03, 2026, 03:32 AM",
    options: [
      {
        id: "opt_058_a",
        text: "声称自己也是逃兵。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_60",
        outcome: {
          narrative: "你的伪装起作用了。他们踢了你一脚，放你走了。'滚吧，懦夫。'",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_058_b",
        text: "强行冲卡。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_59",
        outcome: {
          narrative: "枪林弹雨。你受了伤，但冲了过去。这帮乌合之众的枪法比美军差远了。",
          statsDelta: { personalSecurity: -15 }
        }
      },
      {
        id: "opt_058_c",
        text: "呼叫美军位置，借刀杀人。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_60",
        outcome: {
          narrative: "你向空中鸣枪引来美军。美军以为遇到抵抗，扫平了民兵哨所。你从侧翼溜走。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 59: The Extraction Plan
  {
    id: "evt_59",
    phase: "ESCAPE",
    narrative: "03:35 AM。终于联系上了'Frente Bolivariano'的残余部队。他们在Guaire河畔有一艘走私用的快艇。那是离开加拉加斯市区的唯一途径。但河岸边可能有美军的巡逻队。",
    newsTicker: "UPDATE: 美军正在封锁Guaire河沿岸。",
    location: "Riverbank",
    time: "Jan 03, 2026, 03:35 AM",
    options: [
      {
        id: "opt_059_a",
        text: "快速登船。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_60",
        outcome: {
          narrative: "引擎轰鸣。快艇冲出芦苇荡。子弹击打在水面上。这是一场赌博。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_059_b",
        text: "先清理岸边的观察哨。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_61",
        outcome: {
          narrative: "你悄无声息地解决了两个哨兵。登船过程很安静。安全离岸。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_059_c",
        text: "等待雾气变浓再行动。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_61",
        outcome: {
          narrative: "多等了十分钟。雾气确实来了，但美军的巡逻艇也来了。错过了最佳时机。",
          statsDelta: { personalSecurity: -10 }
        }
      }
    ]
  },

  // Event 60: The Siege of 23 de Enero
  {
    id: "evt_60",
    phase: "ESCAPE",
    narrative: "03:40 AM。美军决定不再玩猫鼠游戏。他们开始强攻贫民窟。史崔克装甲车推倒了简易房，黑鹰直升机在屋顶索降士兵。整个街区变成了一个巨大的战场。你被夹在中间，无路可退。无论你是不是总统，现在你只是这场屠杀中的一个幸存者。",
    newsTicker: "WAR: 美军发起总攻，试图彻底清剿贫民窟反抗势力。",
    location: "Center of Barrio",
    time: "Jan 03, 2026, 03:40 AM",
    options: [
      {
        id: "opt_060_a",
        text: "加入战斗，与民兵共存亡。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_61",
        outcome: {
          narrative: "你拿起了AK-47。这是一种解脱。在战斗中，你找回了年轻时的热血。但这无助于逃生。",
          statsDelta: { militaryLoyalty: 20, personalSecurity: -20 }
        }
      },
      {
        id: "opt_060_b",
        text: "利用混乱，向东突围。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_61",
        outcome: {
          narrative: "让别人去死吧。你利用战斗造成的混乱掩护，穿过了封锁线。冷酷，但有效。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_060_c",
        text: "躲入地下室，等待战火平息。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_61",
        outcome: {
          narrative: "你躲了起来。上面的爆炸声持续了一整夜。当你出来时，世界已经变了。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // =========================================================================
  // BATCH 4: JUNGLE SURVIVAL (Events 61-80)
  // =========================================================================

  // Event 61: Into the Green
  {
    id: "evt_61",
    phase: "ESCAPE",
    narrative: "1月4日 05:30 AM。黎明。你站在埃尔阿维拉山脉的半山腰。回头望去，加拉加斯正在燃烧。滚滚黑烟遮蔽了日出。城市已经沦陷，现在你是这片原始丛林里的猎物。前面是茫茫绿海，后面是世界上最强大的军队。",
    newsTicker: "BREAKING: 美军宣布'完全控制'加拉加斯市区，开始清剿周边残余势力。",
    location: "El Ávila National Park Edge",
    time: "Jan 04, 2026, 05:30 AM",
    options: [
      {
        id: "opt_061_a",
        text: "向着大海方向前进，寻找船只。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_62",
        outcome: {
          narrative: "大海意味着自由，也意味着美军的航母战斗群。你选择了最快的路，也是最险的路。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_061_b",
        text: "深入丛林腹地，利用地形隐蔽。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_63",
        outcome: {
          narrative: "你钻进了密林。树冠遮住了天空，也遮住了无人机的视线。这里是游击队的天然主场。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_061_c",
        text: "在显眼处留下误导性的痕迹。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_62",
        outcome: {
          narrative: "你把一件外套扔在往南的小路上，自己往北走。希望能骗过那些追踪犬。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 62: The Mosquitoes
  {
    id: "evt_62",
    phase: "ESCAPE",
    narrative: "1月4日 08:00 AM。湿热。这是丛林给你的第一个下马威。成千上万的蚊子包围了你。它们不仅仅是烦人，这里是登革热和疟疾的疫区。你的脸上已经被叮满了包，每一次抓挠都可能导致感染。",
    newsTicker: "STATUS: 目标区域环境恶劣，存在热带病风险。",
    location: "Dense Jungle",
    time: "Jan 04, 2026, 08:00 AM",
    options: [
      {
        id: "opt_062_a",
        text: "使用随身携带的驱蚊剂。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_64",
        outcome: {
          narrative: "化学气味很刺鼻。蚊子散去了，但这股味道在丛林里能飘出两公里远。军犬会喜欢的。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_062_b",
        text: "用泥浆涂满全身。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_63",
        outcome: {
          narrative: "像电影里的施瓦辛格一样。泥浆干结后既能防蚊，又能掩盖热信号。原始，但有效。",
          statsDelta: { personalSecurity: 15 }
        }
      },
      {
        id: "opt_062_c",
        text: "忍受叮咬，快速通过湿地区域。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_64",
        outcome: {
          narrative: "你的意志力惊人。但高烧的风险在增加。你的身体正在成为病毒的培养皿。",
          statsDelta: { personalSecurity: -10 }
        }
      }
    ]
  },

  // Event 63: The Patrol
  {
    id: "evt_63",
    phase: "ESCAPE",
    narrative: "1月4日 10:15 AM。前方传来树枝折断的声音。你趴在灌木丛中。一支六人的巡逻队走过。他们穿着没有标志的丛林迷彩，手持M4卡宾枪，脸上涂着伪装油彩。是绿色贝雷帽。他们距离你不到五米。",
    newsTicker: "SIGHTING: 美军特种部队在埃尔阿维拉山区进行搜索。",
    location: "Mountain Trail",
    time: "Jan 04, 2026, 10:15 AM",
    options: [
      {
        id: "opt_063_a",
        text: "屏住呼吸，直到他们离开。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_65",
        outcome: {
          narrative: "一只虫子爬过你的鼻尖，你一动不动。他们走过去了。你的心脏狂跳，但这不仅是恐惧，还有肾上腺素的快感。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_063_b",
        text: "制造声响引开他们。",
        type: "diplomatic",
        risk: "extreme",
        nextEventId: "evt_64",
        outcome: {
          narrative: "你扔了一块石头。一名士兵立刻警觉，举枪瞄准。他们开始向声源包抄。弄巧成拙。",
          statsDelta: { personalSecurity: -20 }
        }
      },
      {
        id: "opt_063_c",
        text: "从背后偷袭最后的士兵夺取装备。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_66",
        outcome: {
          narrative: "疯狂的想法。你冲了出去。虽然你解决了一个，但立刻被其他人火力压制。你中弹了，被迫滚下山坡。",
          statsDelta: { personalSecurity: -30, militaryLoyalty: 5 }
        }
      }
    ]
  },

  // Event 64: The Hunger II
  {
    id: "evt_64",
    phase: "ESCAPE",
    narrative: "1月4日 01:00 PM。饥饿再次袭来。这里到处是植物，但大多数都有毒。你看到了一只色彩斑斓的蜥蜴，还有一丛不知名的野果。曾经只吃特供食品的总统，现在面临最原始的抉择。",
    newsTicker: "STATUS: 目标人物可能面临严重的食物短缺。",
    location: "Deep Jungle",
    time: "Jan 04, 2026, 01:00 PM",
    options: [
      {
        id: "opt_064_a",
        text: "生吃蜥蜴。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_66",
        outcome: {
          narrative: "口感恶心，带着腥味。但蛋白质就是蛋白质。你的胃在翻腾，但这让你有了继续走的力气。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_064_b",
        text: "尝试那些红色的野果。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_70",
        outcome: {
          narrative: "酸甜可口。半小时后，腹痛如绞。你中毒了。轻微的麻痹感在舌尖蔓延。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_064_c",
        text: "继续忍耐，寻找水源。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_65",
        outcome: {
          narrative: "水比食物更重要。你忍住了饥饿，找到了一条溪流。清凉的山泉让你恢复了神智。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 65: The Satellite Phone
  {
    id: "evt_65",
    phase: "ESCAPE",
    narrative: "1月4日 03:30 PM。你包里的海事卫星电话还有最后一格电。这是联系俄罗斯大使馆或者古巴情报局的唯一机会。但开机就意味着向NSA广播你的GPS坐标。在这个荒无人烟的山区，信号会像灯塔一样耀眼。",
    newsTicker: "INTEL: 正在监控所有加密卫星频段信号。",
    location: "High Ridge",
    time: "Jan 04, 2026, 03:30 PM",
    options: [
      {
        id: "opt_065_a",
        text: "开机一分钟，发送求救代码。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_71",
        outcome: {
          narrative: "代码发出去了。'坐标43-A，请求撤离'。几分钟后，天空中出现了无人机的嗡嗡声。他们听到了。",
          statsDelta: { internationalStance: 10, personalSecurity: -20 }
        }
      },
      {
        id: "opt_065_b",
        text: "把电话拆掉，扔进深谷。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_67",
        outcome: {
          narrative: "彻底切断了与外界的联系。你现在是一个幽灵。没人能找到你，也没人能救你。",
          statsDelta: { personalSecurity: 15 }
        }
      },
      {
        id: "opt_065_c",
        text: "仅用来查看GPS定位，不发射信号。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_66",
        outcome: {
          narrative: "确认了位置。你距离海岸还有30公里。这很危险，被动接收也可能被三角定位。",
          statsDelta: { personalSecurity: -5 }
        }
      }
    ]
  },

  // Event 66: The Snake
  {
    id: "evt_66",
    phase: "ESCAPE",
    narrative: "1月4日 05:45 PM。你在穿越一片草丛时，脚踝传来一阵剧痛。是一条矛头蝮蛇（Fer-de-lance）。它就在那里，冷冷地看着你。毒液已经注入。这种蛇的毒素会引起坏死和出血。",
    newsTicker: "STATUS: 丛林环境对逃亡者构成生命威胁。",
    location: "Tall Grass",
    time: "Jan 04, 2026, 05:45 PM",
    options: [
      {
        id: "opt_066_a",
        text: "立刻用刀切开伤口放血。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_69",
        outcome: {
          narrative: "血流如注。你可能切断了小动脉。但这似乎排出了一些毒素。你包扎了伤口，脸色苍白。",
          statsDelta: { personalSecurity: -15 }
        }
      },
      {
        id: "opt_066_b",
        text: "寻找草药进行敷治。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_70",
        outcome: {
          narrative: "你凭着记忆找了一些草药嚼碎敷上。心理作用大于实际效果。伤口开始肿胀发黑。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_066_c",
        text: "用鞋带做止血带，减缓毒素扩散。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_67",
        outcome: {
          narrative: "标准的急救措施。腿麻木了，但你还能走。必须在24小时内找到抗毒血清，或者截肢。",
          statsDelta: { personalSecurity: -5 }
        }
      }
    ]
  },

  // Event 67: The Guerrilla Camp
  {
    id: "evt_67",
    phase: "ESCAPE",
    narrative: "1月4日 08:00 PM。夜幕降临，你看到远处有火光。走近一看，是一个隐蔽的营地。挂着ELN（民族解放军）的红黑旗帜。这些人是你的盟友，但在这个混乱的时刻，他们也可能是把你卖给美国人的赏金猎人。",
    newsTicker: "INTEL: ELN游击队在边境地区活动频繁。",
    location: "Guerrilla Camp",
    time: "Jan 04, 2026, 08:00 PM",
    options: [
      {
        id: "opt_067_a",
        text: "举起双手，表明身份。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_68",
        outcome: {
          narrative: "哨兵惊讶地看着你。几支AK-47指着你的头。'指挥官，看我们抓到了谁。' 语气里听不出是惊喜还是嘲讽。",
          statsDelta: { personalSecurity: 0, militaryLoyalty: 5 }
        }
      },
      {
        id: "opt_067_b",
        text: "偷取他们的食物和药品，然后溜走。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_69",
        outcome: {
          narrative: "你像个小偷一样摸进了帐篷。拿到了抗生素和罐头。就在离开时，踩到了干树枝。枪声响起，你狂奔入林。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_067_c",
        text: "以总统名义命令他们护送。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_68",
        outcome: {
          narrative: "你大步走进去。'士兵们，保护你们的总统！' 这种气场震慑住了他们。指挥官敬了个礼。赌赢了。",
          statsDelta: { militaryLoyalty: 20, personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 68: The Interrogation
  {
    id: "evt_68",
    phase: "ESCAPE",
    narrative: "1月4日 09:30 PM。在ELN的帐篷里。指挥官'El Tigre'给你倒了一杯咖啡。他盯着你，把一把左轮手枪拍在桌上。'美国人给五千万。总统先生，给我一个不扣动扳机的理由。' 气氛凝固了。",
    newsTicker: "RUMOR: 地方武装势力可能正试图与美军谈判。",
    location: "Command Tent",
    time: "Jan 04, 2026, 09:30 PM",
    options: [
      {
        id: "opt_068_a",
        text: "承诺重建后给他国防部长的职位。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_72",
        outcome: {
          narrative: "权力的诱惑。他的眼神亮了。'成交。但如果你骗我，我会亲自割了你的喉咙。' 暂时的盟友。",
          statsDelta: { militaryLoyalty: 10, personalSecurity: 10 }
        }
      },
      {
        id: "opt_068_b",
        text: "威胁说身上有定位芯片，美军马上就会轰炸这里。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_69",
        outcome: {
          narrative: "他犹豫了，看了看天空。恐惧占据了上风。'滚吧，立刻离开我的营地。' 你被赶了出来，但保住了命。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_068_c",
        text: "夺枪反杀。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_71",
        outcome: {
          narrative: "你扑向了手枪。他也动了。扭打中枪响了。子弹击穿了帐篷。整个营地炸锅了。你趁乱逃入黑夜。",
          statsDelta: { personalSecurity: -10 }
        }
      }
    ]
  },

  // Event 69: The Rain
  {
    id: "evt_69",
    phase: "ESCAPE",
    narrative: "1月5日 00:00 AM。热带风暴来了。暴雨像瀑布一样倾泻而下。气温骤降。浑身湿透的你在泥泞中颤抖。这是失温的前兆。但暴雨也冲刷了你的足迹和气味，让猎犬失去了作用。",
    newsTicker: "WEATHER: 热带风暴登陆委内瑞拉北部沿海，阻碍空中搜索。",
    location: "Muddy Slope",
    time: "Jan 05, 2026, 00:00 AM",
    options: [
      {
        id: "opt_069_a",
        text: "挖掘一个散兵坑躲避。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_70",
        outcome: {
          narrative: "你把自己埋在泥里。像个死人一样。体温在流失，但你在暴雨的咆哮中获得了一丝安全感。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_069_b",
        text: "继续赶路，利用雨声掩护。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_71",
        outcome: {
          narrative: "你在雨中跌跌撞撞。几次滑倒差点摔下悬崖。但你在一夜之间走了平时两天的路程。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_069_c",
        text: "寻找岩洞生火取暖。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_71",
        outcome: {
          narrative: "你找到了一个小洞穴。生火很难，烟雾很大。虽然暖和了，但热成像仪在雨夜里能清晰地看到这个热点。",
          statsDelta: { personalSecurity: -10 }
        }
      }
    ]
  },

  // Event 70: The Fever
  {
    id: "evt_70",
    phase: "ESCAPE",
    narrative: "1月5日 04:00 AM。高烧。39度。伤口感染或者登革热。你开始说胡话。在闪电的光影中，你看到了查韦斯的幽灵。他穿着标志性的红色贝雷帽，站在树下看着你。'尼古拉斯，你为什么毁了这一切？'",
    newsTicker: "STATUS: 逃亡者身体状况极度恶化。",
    location: "Delirium Dream",
    time: "Jan 05, 2026, 04:00 AM",
    options: [
      {
        id: "opt_070_a",
        text: "对着幻觉大喊：'我尽力了！'",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_71",
        outcome: {
          narrative: "你的喊声惊起了飞鸟。幻觉消失了。你独自一人在雨中哭泣。精神崩溃的边缘。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_070_b",
        text: "咬破嘴唇，用疼痛保持清醒。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_72",
        outcome: {
          narrative: "血腥味让你回到了现实。这不是鬼魂，是你的软弱在作祟。站起来，活下去。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_070_c",
        text: "向神祈祷。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_73",
        outcome: {
          narrative: "你念诵着儿时的经文。内心的平静暂时压制了身体的痛苦。也许神真的在听。",
          statsDelta: { personalSecurity: 0 }
        }
      }
    ]
  },

  // Event 71: The Chopper Hunt
  {
    id: "evt_71",
    phase: "ESCAPE",
    narrative: "1月5日 07:00 AM。雨停了。MH-60黑鹰直升机来了。这次是低空搜索。旋翼的气流吹开了树冠。探照灯在树林间扫射。扩音器里传出声音：'出来吧，我们需要医疗援助吗？'",
    newsTicker: "SEARCH: 美军直升机在低空盘旋，缩小包围圈。",
    location: "River Valley",
    time: "Jan 05, 2026, 07:00 AM",
    options: [
      {
        id: "opt_071_a",
        text: "跳进河里，潜水躲避。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_73",
        outcome: {
          narrative: "你在浑浊的河水里憋气。直到肺部快要爆炸。直升机飞走了。你浮出水面，大口喘息。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_071_b",
        text: "用反光镜发出投降信号。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_78",
        outcome: {
          narrative: "你受够了。你拿出了镜子。闪光引起了注意。直升机开始悬停。绳梯放了下来。但这真的是你想的吗？在最后一刻，你又缩了回去。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_071_c",
        text: "躲进倒塌的树干下。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_72",
        outcome: {
          narrative: "你挤进了腐烂的木头缝隙里。无数的蚂蚁爬到了你身上。你咬牙忍受。直到轰鸣声远去。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 72: The Betrayer in the Woods
  {
    id: "evt_72",
    phase: "ESCAPE",
    narrative: "1月5日 10:00 AM。你身边只剩下最后一个随从，名叫何塞。他一直在照顾你。但他现在的眼神变了。他在摆弄手里的GPS设备，那是你之前以为坏掉的。他在给谁发信号？",
    newsTicker: "INTEL: 收到来自目标区域的可疑短频信号。",
    location: "Forest Clearing",
    time: "Jan 05, 2026, 10:00 AM",
    options: [
      {
        id: "opt_072_a",
        text: "质问他。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_78",
        outcome: {
          narrative: "他崩溃了。'我的家人在迈阿密！他们逼我的！' 他举起了枪。你不得不先开枪。枪声响彻丛林。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_072_b",
        text: "趁他不备，用石头砸晕他。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_73",
        outcome: {
          narrative: "这很残酷。你从背后袭击了他。拿走了GPS，发现确实有一条发出的坐标信息。你把他留在了那里。现在你真的孤身一人了。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_072_c",
        text: "假装没看见，利用他作为诱饵。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_78",
        outcome: {
          narrative: "你让他走在前面，故意把他带向悬崖边。当直升机来时，他们只会看到他。冷血的策略。",
          statsDelta: { personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 73: The River Crossing
  {
    id: "evt_73",
    phase: "ESCAPE",
    narrative: "1月5日 01:00 PM。图伊河挡住了去路。暴雨过后河水暴涨，浑浊湍急。这里可能有鳄鱼。但这河通向加勒比海。对岸看起来更安全。",
    newsTicker: "GEOGRAPHY: 目标人物可能试图渡过图伊河。",
    location: "Rio Tuy Bank",
    time: "Jan 05, 2026, 01:00 PM",
    options: [
      {
        id: "opt_073_a",
        text: "寻找浅滩涉水。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_74",
        outcome: {
          narrative: "水流很急。你几乎被冲走。当你爬上岸时，发现一只鞋子被冲走了。光着一只脚在丛林里走是自杀。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_073_b",
        text: "砍伐竹子做筏。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_74",
        outcome: {
          narrative: "这花了两个小时。但你是干爽地过河的。筏子顺流而下了一段，帮你节省了体力。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_073_c",
        text: "游过去。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_75",
        outcome: {
          narrative: "你跳进水里。就在河中央，你感觉有什么东西碰了你的腿。你拼命划水。上岸后发现裤腿被撕烂了，有齿痕。",
          statsDelta: { personalSecurity: -10 }
        }
      }
    ]
  },

  // Event 74: The Supply Drop
  {
    id: "evt_74",
    phase: "ESCAPE",
    narrative: "1月5日 03:30 PM。你在树上看到一个挂着的降落伞包。是美军的补给箱，可能是误投的。里面有MRE口粮、净水片，甚至可能有卫星电话。但这看起来太像一个诱饵了。",
    newsTicker: "TRAP: 美军在丛林区域部署诱饵补给箱。",
    location: "Hanging Supply Crate",
    time: "Jan 05, 2026, 03:30 PM",
    options: [
      {
        id: "opt_074_a",
        text: "爬上去拿。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_78",
        outcome: {
          narrative: "当你触碰箱子的瞬间，触发了一枚闪光弹。你的眼睛瞎了十分钟。不仅没拿到东西，还暴露了位置。",
          statsDelta: { personalSecurity: -20 }
        }
      },
      {
        id: "opt_074_b",
        text: "在下面等待，看是否有动物或者其他人触发。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_75",
        outcome: {
          narrative: "一只猴子爬了上去。没事。你这才小心翼翼地过去。拿到了一包牛肉干。救命的蛋白质。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_074_c",
        text: "无视它，绕道走。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_75",
        outcome: {
          narrative: "你是对的。那是给贪婪者的陷阱。你继续挨饿，但你依然自由。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 75: The Village
  {
    id: "evt_75",
    phase: "ESCAPE",
    narrative: "1月5日 06:00 PM。一个小村庄出现在视野中。几间茅草屋，炊烟袅袅。这是你几天来第一次看到文明。你需要食物和鞋子。但这里的农民可能支持反对派，也可能只是单纯想赚赏金。",
    newsTicker: "REPORT: 农村地区民众被鼓励举报可疑人员。",
    location: "Remote Village",
    time: "Jan 05, 2026, 06:00 PM",
    options: [
      {
        id: "opt_075_a",
        text: "持枪闯入，强行征收物资。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_78",
        outcome: {
          narrative: "你踢开门。一家人惊恐地缩在角落。你抢走了食物和靴子。你是个强盗，但你是个活着的强盗。",
          statsDelta: { personalSecurity: 10, publicSupport: -20 }
        }
      },
      {
        id: "opt_075_b",
        text: "敲门乞讨，利用同情心。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_76",
        outcome: {
          narrative: "老农妇认出了你。她没有报警，而是给了你一碗热汤。'上帝保佑你，孩子。' 在这地狱里，善意依然存在。",
          statsDelta: { personalSecurity: 15, publicSupport: 5 }
        }
      },
      {
        id: "opt_075_c",
        text: "偷走晾衣绳上的衣服和后院的鸡。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_77",
        outcome: {
          narrative: "不告而取。你得手了。在村外的树林里，你烤了一只鸡。这是世界上最美味的晚餐。",
          statsDelta: { personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 76: The Doctor
  {
    id: "evt_76",
    phase: "ESCAPE",
    narrative: "1月5日 07:00 PM。那户农家告诉你，村里有个赤脚医生。你的腿伤已经化脓，高烧不退。你需要抗生素。医生是个年轻人，看起来受过教育。",
    newsTicker: "HEALTH: 逃亡总统可能有严重的健康问题。",
    location: "Village Clinic",
    time: "Jan 05, 2026, 07:00 PM",
    options: [
      {
        id: "opt_076_a",
        text: "用枪指着他治疗。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_77",
        outcome: {
          narrative: "他在枪口下颤抖着为你清创。虽然包扎好了，但他看你的眼神充满了恐惧。一旦你离开，他就会报警。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_076_b",
        text: "给他承诺未来的卫生部长职位。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_77",
        outcome: {
          narrative: "他是个理想主义者。他相信了你。不仅给你治伤，还给了你一些止痛药。'为了委内瑞拉。'",
          statsDelta: { personalSecurity: 15, publicSupport: 5 }
        }
      },
      {
        id: "opt_076_c",
        text: "偷点药自己处理。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_78",
        outcome: {
          narrative: "你拿错了药。那是兽用的抗生素。副作用让你呕吐了一整晚，但奇迹般地退烧了。",
          statsDelta: { personalSecurity: 0 }
        }
      }
    ]
  },

  // Event 77: The Russian Mercenaries
  {
    id: "evt_77",
    phase: "ESCAPE",
    narrative: "1月5日 10:00 PM。你在林子里遇到了几个说俄语的人。他们穿着破旧的迷彩服，装备精良。是瓦格纳集团的残部。他们本该撤离，但被困在了这里。领头的叫伊万，他认出了你。",
    newsTicker: "INTEL: 发现俄罗斯私人军事武装在冲突区域活动。",
    location: "Mercenary Bivouac",
    time: "Jan 05, 2026, 10:00 PM",
    options: [
      {
        id: "opt_077_a",
        text: "雇佣他们护送你到海岸。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_79",
        outcome: {
          narrative: "你需要支付天价。你许诺了石油开采权。伊万笑了：'如果能活着出去，我们就是亿万富翁。' 你有了一支精锐卫队。",
          statsDelta: { militaryLoyalty: 15, personalSecurity: 20 }
        }
      },
      {
        id: "opt_077_b",
        text: "请求他们提供通讯设备联系普京。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_78",
        outcome: {
          narrative: "电话接通了莫斯科。那边很冷淡。'这是你的战争，尼古拉斯。' 电话挂断了。瓦格纳的人开始用异样的眼光看你。",
          statsDelta: { internationalStance: -20, personalSecurity: -10 }
        }
      },
      {
        id: "opt_077_c",
        text: "避开他们，这些人只认钱。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_78",
        outcome: {
          narrative: "明智。如果美军出价更高，他们会毫不犹豫地把你绑起来送过去。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 78: The Ambush
  {
    id: "evt_78",
    phase: "ESCAPE",
    narrative: "1月6日 02:00 AM。如果你没有瓦格纳的护送。你发现前方的小路上有绊线。是美军海豹突击队设置的伏击圈。他们就在附近等待猎物上钩。",
    newsTicker: "TACTIC: 美军特种部队在撤离路线上设置伏击点。",
    location: "Choke Point",
    time: "Jan 06, 2026, 02:00 AM",
    options: [
      {
        id: "opt_078_a",
        text: "绕道攀爬陡峭的岩壁。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_79",
        outcome: {
          narrative: "指甲断裂，手指流血。你在黑暗的悬崖上攀爬。这几乎不可能，但你做到了。你绕过了死神。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_078_b",
        text: "投掷石块触发诡雷。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_80",
        outcome: {
          narrative: "爆炸引发了混乱。海豹突击队开火了。你在混乱中狂奔。几发子弹擦过头皮。极其惊险。",
          statsDelta: { personalSecurity: -15 }
        }
      },
      {
        id: "opt_078_c",
        text: "原地等待，直到他们换班。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_79",
        outcome: {
          narrative: "你在蚊虫中趴了四个小时。直到黎明前最黑暗的时刻，他们松懈了。你像鬼魂一样溜了过去。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 79: The Cave
  {
    id: "evt_79",
    phase: "ESCAPE",
    narrative: "1月6日 05:00 AM。你找到了一个隐蔽的海蚀洞，就在海岸悬崖上方。里面有淡水滴落，还有前人留下的篝火痕迹。这里是最后的避难所，前面就是大海。",
    newsTicker: "SEARCH: 搜索范围已扩大至北部海岸线。",
    location: "Sea Cave",
    time: "Jan 06, 2026, 05:00 AM",
    options: [
      {
        id: "opt_079_a",
        text: "生火烤干衣服。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_80",
        outcome: {
          narrative: "温暖。久违的温暖。烟雾顺着洞口飘向大海。希望没人注意。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_079_b",
        text: "在洞口设置警报装置。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_81",
        outcome: {
          narrative: "用枯枝和钓鱼线做的简易警报。这让你能睡个安稳觉。你需要恢复体力。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_079_c",
        text: "立刻下山寻找船只。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_80",
        outcome: {
          narrative: "没有休息。你继续前进。体力透支严重，但你离目标更近了。",
          statsDelta: { personalSecurity: -5 }
        }
      }
    ]
  },

  // Event 80: The Coast
  {
    id: "evt_80",
    phase: "ESCAPE",
    narrative: "1月6日 06:00 AM。你站在沙滩上。加勒比海的波浪拍打着礁石。海平线上，可以看到美国海军驱逐舰的灰色轮廓。封锁线依然严密。你需要一艘船，或者奇迹。",
    newsTicker: "BLOCKADE: 美军第四舰队封锁委内瑞拉领海。",
    location: "Caribbean Coast",
    time: "Jan 06, 2026, 06:00 AM",
    options: [
      {
        id: "opt_080_a",
        text: "进入下一阶段：国际博弈 (INTERNATIONAL)。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_81",
        outcome: {
          narrative: "丛林生存结束了。现在是大海的挑战，以及更复杂的国际政治。活下来只是第一步。",
          statsDelta: {}
        }
      },
      {
        id: "opt_080_b",
        text: "进入下一阶段：国际博弈 (INTERNATIONAL)。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_81",
        outcome: {
          narrative: "丛林生存结束了。现在是大海的挑战，以及更复杂的国际政治。活下来只是第一步。",
          statsDelta: {}
        }
      },
      {
        id: "opt_080_c",
        text: "进入下一阶段：国际博弈 (INTERNATIONAL)。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_81",
        outcome: {
          narrative: "丛林生存结束了。现在是大海的挑战，以及更复杂的国际政治。活下来只是第一步。",
          statsDelta: {}
        }
      }
    ]
  },

  // =========================================================================
  // BATCH 5: INTERNATIONAL GAMBIT (Events 81-100)
  // =========================================================================

  // Event 81: The Fisherman's Bargain
  {
    id: "evt_81",
    phase: "INTERNATIONAL",
    narrative: "1月6日 07:00 AM。你在海滩上遇到了'老何塞'，一个皮肤像树皮一样的老渔夫。他正准备出海。他认出了你，眼神复杂。他的船很破，但也许能混过封锁线。",
    newsTicker: "BLOCKADE: 美军海警队加强对沿海渔船的盘查。",
    location: "Fishing Village Beach",
    time: "Jan 06, 2026, 07:00 AM",
    options: [
      {
        id: "opt_081_a",
        text: "拿出最后一块金条作为船资。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_83",
        outcome: {
          narrative: "金子在阳光下闪耀。老何塞咬了一口金条，点了点头。'上船吧，我们要去捕鲨鱼。'",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_081_b",
        text: "用枪威胁他开船。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_82",
        outcome: {
          narrative: "他沉默地发动了引擎。但在海上，一个不情愿的船长比风暴更危险。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_081_c",
        text: "诉诸爱国情怀，'为了玻利瓦尔'。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_82",
        outcome: {
          narrative: "他吐了一口唾沫。'玻利瓦尔不能当饭吃。' 但他还是让你上船了，'看在你父亲的份上'。",
          statsDelta: { publicSupport: 5 }
        }
      }
    ]
  },

  // Event 82: The Engine Trouble
  {
    id: "evt_82",
    phase: "INTERNATIONAL",
    narrative: "1月6日 09:00 AM。离岸5海里。老何塞的船引擎突然熄火了。他修了半天，摇了摇头。'没油了，或者气缸爆了。' 你们在海上漂流，像个活靶子。",
    newsTicker: "STATUS: 目标可能已被困在近海区域。",
    location: "Coastal Waters",
    time: "Jan 06, 2026, 09:00 AM",
    options: [
      {
        id: "opt_082_a",
        text: "帮忙修理引擎。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_83",
        outcome: {
          narrative: "你以前是公交车司机，懂点机械。满手油污的你奇迹般地修好了它。老何塞对你刮目相看。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_082_b",
        text: "用船上的无线电呼救。",
        type: "desperate",
        risk: "extreme",
        nextEventId: "evt_89",
        outcome: {
          narrative: "有人回应了。但不确定是海警还是走私贩。这是一个巨大的赌注。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_082_c",
        text: "划桨。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_83",
        outcome: {
          narrative: "这是徒劳的。但在烈日下暴晒两小时后，引擎神奇地冷却并重新启动了。",
          statsDelta: { personalSecurity: -5 }
        }
      }
    ]
  },

  // Event 83: The Drone Patrol
  {
    id: "evt_83",
    phase: "INTERNATIONAL",
    narrative: "1月6日 11:00 AM。一架MQ-4C'人鱼海神'无人机在头顶盘旋。它的摄像头可以看清你甲板上的鱼。你躲在鱼网下面，甚至不敢呼吸。",
    newsTicker: "SURVEILLANCE: 美军无人机对可疑船只进行识别。",
    location: "Open Sea",
    time: "Jan 06, 2026, 11:00 AM",
    options: [
      {
        id: "opt_083_a",
        text: "装作在整理渔网。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_84",
        outcome: {
          narrative: "你拉起恶臭的渔网，把鱼内脏涂在身上。无人机盘旋了两圈，把你判定为普通渔民。飞走了。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_083_b",
        text: "躲进船舱底。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_84",
        outcome: {
          narrative: "船舱里全是死鱼和柴油味。你呕吐了，但避开了视线。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_083_c",
        text: "用镜子反射阳光干扰摄像头。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_89",
        outcome: {
          narrative: "这简直是自杀行为。无人机立刻锁定了这艘'有敌意行为'的渔船。海警队正在赶来。",
          statsDelta: { personalSecurity: -20 }
        }
      }
    ]
  },

  // Event 84: The Narco Sub
  {
    id: "evt_84",
    phase: "INTERNATIONAL",
    narrative: "1月6日 02:00 PM。老何塞把你带到了一个约定坐标。浮出水面的是一艘半潜式毒品潜艇。这是一种玻纤制的棺材，满载着可卡因。船长'El Fantasma'同意带你一程，条件是你得忍受幽闭和随时可能沉没的风险。",
    newsTicker: "CRIME: 贩毒集团利用战乱加大毒品运输力度。",
    location: "Rendezvous Point Alpha",
    time: "Jan 06, 2026, 02:00 PM",
    options: [
      {
        id: "opt_084_a",
        text: "登上潜艇。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_86",
        outcome: {
          narrative: "你钻进了狭窄的舱口。里面充满了汗臭和尿骚味。老何塞的船离开了。你现在在海面下一米处。",
          statsDelta: { personalSecurity: 10, internationalStance: -10 }
        }
      },
      {
        id: "opt_084_b",
        text: "拒绝登船，坚持坐渔船。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_85",
        outcome: {
          narrative: "太危险了。你选择了天空。老何塞叹了口气，'那你得加钱'。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_084_c",
        text: "威胁船长交出通讯设备。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_89",
        outcome: {
          narrative: "在毒贩的地盘撒野？几支枪指着你。你差点被扔进海里喂鲨鱼。",
          statsDelta: { personalSecurity: -15 }
        }
      }
    ]
  },

  // Event 85: The Destroyer
  {
    id: "evt_85",
    phase: "INTERNATIONAL",
    narrative: "1月6日 05:00 PM。如果你还在渔船上。前方出现了一座大山——美国海军'法拉格特'号驱逐舰。它正在拦截所有船只。扩音器声如雷贯耳：'前方渔船，停船接受检查！'",
    newsTicker: "BLOCKADE: 美军驱逐舰拦截多艘试图突围的船只。",
    location: "US Navy Checkpoint",
    time: "Jan 06, 2026, 05:00 PM",
    options: [
      {
        id: "opt_085_a",
        text: "跳海，游向附近的礁石。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_90",
        outcome: {
          narrative: "你在检查队登船前跳了下去。海水冰冷。你在波涛中挣扎，看着老何塞被捕。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_085_b",
        text: "藏在双层船底的隔舱里。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_87",
        outcome: {
          narrative: "美国大兵穿着靴子在头顶走来走去。狗叫了几声。他们没发现这个用来藏毒品的暗格。你躲过一劫。",
          statsDelta: { personalSecurity: 15 }
        }
      },
      {
        id: "opt_085_c",
        text: "假装是哑巴弱智船员。",
        type: "diplomatic",
        risk: "extreme",
        nextEventId: "evt_89",
        outcome: {
          narrative: "你流着口水，眼神呆滞。大兵嫌弃地推开了你。'只是个傻子。' 这种羞辱救了你的命。",
          statsDelta: { personalSecurity: 5, publicSupport: -20 }
        }
      }
    ]
  },

  // Event 86: The Claustrophobia
  {
    id: "evt_86",
    phase: "INTERNATIONAL",
    narrative: "1月6日 08:00 PM。潜艇里。氧气浑浊。你感到胸闷气短。身边的毒贩在吸食自己的货物来提神。船长看着声呐，脸色苍白。'有东西在跟踪我们。'",
    newsTicker: "INTEL: 怀疑有不明潜航器试图穿越封锁线。",
    location: "Submersible Interior",
    time: "Jan 06, 2026, 08:00 PM",
    options: [
      {
        id: "opt_086_a",
        text: "保持冷静，检查氧气洗涤器。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_88",
        outcome: {
          narrative: "你发现洗涤器堵塞了。清理后，空气好了很多。恐慌是比缺氧更快的杀手。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_086_b",
        text: "要求浮出水面换气。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_89",
        outcome: {
          narrative: "船长拒绝了。'上去就是死。' 你们在窒息的边缘徘徊。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_086_c",
        text: "也吸一口'提神'。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_88",
        outcome: {
          narrative: "白色粉末让你瞬间亢奋。恐惧消失了，取而代之的是疯狂的自信。但这让你的判断力下降。",
          statsDelta: { personalSecurity: -10 }
        }
      }
    ]
  },

  // Event 87: The Storm at Sea
  {
    id: "evt_87",
    phase: "INTERNATIONAL",
    narrative: "1月7日 00:00 AM。一场加勒比风暴席卷了海面。渔船像树叶一样颠簸。巨浪试图吞噬一切。美军的封锁线因为风暴而松动了，但大自然比美军更无情。",
    newsTicker: "WEATHER: 强热带风暴导致海上能见度降至零。",
    location: "Stormy Seas",
    time: "Jan 07, 2026, 00:00 AM",
    options: [
      {
        id: "opt_087_a",
        text: "把自己绑在桅杆上。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_90",
        outcome: {
          narrative: "像奥德修斯一样。你没被甩出去，但被海水呛得半死。船体受损严重，但还在浮着。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_087_b",
        text: "帮忙掌舵，顶风航行。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_91",
        outcome: {
          narrative: "与天斗。你全神贯注地控制着方向。风暴把你们推向了深海，也推离了封锁区。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_087_c",
        text: "扔掉重物，包括武器。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_90",
        outcome: {
          narrative: "为了浮力，必须舍弃。金条、枪支都沉入了海底。你现在手无寸铁，但船轻快了许多。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 88: The Torpedo
  {
    id: "evt_88",
    phase: "INTERNATIONAL",
    narrative: "1月7日 02:00 AM。潜艇内。声呐发出了急促的报警声。'鱼雷！' 船长大喊。美军核潜艇发现了这个嘈杂的半潜船。一枚Mk-48鱼雷正在以此为目标。",
    newsTicker: "WAR: 美军潜艇在加勒比海域进行实弹拦截。",
    location: "Deep Water",
    time: "Jan 07, 2026, 02:00 AM",
    options: [
      {
        id: "opt_088_a",
        text: "紧急抛载，全速上浮。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_89",
        outcome: {
          narrative: "潜艇像软木塞一样冲出海面。鱼雷在深处爆炸。冲击波震裂了船壳。你们浮上来了，但也暴露了。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_088_b",
        text: "关闭引擎，静默。",
        type: "stealth",
        risk: "extreme",
        nextEventId: "evt_90",
        outcome: {
          narrative: "死一般的寂静。鱼雷擦肩而过。它是被更深处的大型目标吸引走的。运气，纯粹的运气。",
          statsDelta: { personalSecurity: 15 }
        }
      },
      {
        id: "opt_088_c",
        text: "释放诱饵声纳。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_91",
        outcome: {
          narrative: "毒贩居然有这种高级货。诱饵生效了。鱼雷在两公里外爆炸。你们趁机逃离。",
          statsDelta: { personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 89: The Interception
  {
    id: "evt_89",
    phase: "INTERNATIONAL",
    narrative: "1月7日 05:00 AM。你们被迫浮出水面。一艘美国海警队的快速反应巡逻艇（Fast Response Cutter）高速驶来。探照灯锁定了你们。'这是美国海岸警卫队，立刻停船！'",
    newsTicker: "BREAKING: 海岸警卫队拦截了一艘可疑走私船只。",
    location: "International Waters Edge",
    time: "Jan 07, 2026, 05:00 AM",
    options: [
      {
        id: "opt_089_a",
        text: "加速冲向公海。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_92",
        outcome: {
          narrative: "机枪子弹扫过甲板。船身千疮百孔。但在最后一刻，你们进入了国际水域。海警队停止了追击...暂时。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_089_b",
        text: "举白旗投降，申请庇护。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_94",
        outcome: {
          narrative: "你举起了双手。这不是你想要的结局，但至少不是死刑。你被带上了警卫队的船。",
          statsDelta: { personalSecurity: 100 }
        }
      },
      {
        id: "opt_089_c",
        text: "把毒品扔下海制造障碍。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_92",
        outcome: {
          narrative: "成包的可卡因漂浮在海面上。海警队忙于捞取证物。这给了你宝贵的逃跑时间。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 90: The Oil Rig
  {
    id: "evt_90",
    phase: "INTERNATIONAL",
    narrative: "1月7日 08:00 AM。燃油耗尽。你们漂流到了一个巨大的海上平台附近。这是一座属于特立尼达和多巴哥的废弃石油钻井平台。上面似乎有人类活动的迹象。",
    newsTicker: "SIGHTING: 废弃钻井平台附近发现不明船只。",
    location: "Abandoned Oil Rig",
    time: "Jan 07, 2026, 08:00 AM",
    options: [
      {
        id: "opt_090_a",
        text: "登上去寻找燃油和补给。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_93",
        outcome: {
          narrative: "你爬上了生锈的梯子。这里被一群加勒比海盗占据着。他们有油，也有枪。",
          statsDelta: { personalSecurity: 0 }
        }
      },
      {
        id: "opt_090_b",
        text: "在平台下躲避卫星侦察。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_91",
        outcome: {
          narrative: "巨大的阴影提供了完美的掩护。你在这里休息，钓鱼充饥。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_090_c",
        text: "拆卸平台设备修船。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_92",
        outcome: {
          narrative: "你找到了一些有用的零件。船修好了。但拆卸时的噪音引来了海盗。",
          statsDelta: { personalSecurity: -5 }
        }
      }
    ]
  },

  // Event 91: The Satellite Call
  {
    id: "evt_91",
    phase: "INTERNATIONAL",
    narrative: "1月7日 12:00 PM。你终于在一个相对安全的区域打开了卫星电话。你必须做出选择：是打给莫斯科，北京，还是哈瓦那？每个选择都有代价。",
    newsTicker: "DIPLOMACY: 大国之间就委内瑞拉局势进行秘密磋商。",
    location: "High Seas",
    time: "Jan 07, 2026, 12:00 PM",
    options: [
      {
        id: "opt_091_a",
        text: "呼叫莫斯科，请求核潜艇接应。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_96",
        outcome: {
          narrative: "普京的接线员要求你提供只有你知道的铀矿坐标。这是一笔交易。'喀山'号核潜艇将在24小时内到达。",
          statsDelta: { internationalStance: 10, personalSecurity: 5 }
        }
      },
      {
        id: "opt_091_b",
        text: "呼叫北京，请求人道主义救援。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_95",
        outcome: {
          narrative: "北京很谨慎。他们不会派军舰，但附近有一艘悬挂巴拿马旗的'中远'货轮。这是最安全的顺风车。",
          statsDelta: { internationalStance: 15, personalSecurity: 10 }
        }
      },
      {
        id: "opt_091_c",
        text: "呼叫哈瓦那，请求政治庇护。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_97",
        outcome: {
          narrative: "古巴兄弟很热情，但他们自己也被封锁了。他们只能提供一条走私路线的情报。",
          statsDelta: { internationalStance: 5 }
        }
      }
    ]
  },

  // Event 92: The Pirate King
  {
    id: "evt_92",
    phase: "INTERNATIONAL",
    narrative: "1月7日 03:00 PM。你被海盗包围了。领头的是个叫'黑胡子'的特立尼达人。他认出了你。'这就是那个身价五千万的总统？看起来像个落汤鸡。'",
    newsTicker: "CRIME: 加勒比海盗活动日益猖獗。",
    location: "Pirate Waters",
    time: "Jan 07, 2026, 03:00 PM",
    options: [
      {
        id: "opt_092_a",
        text: "提议给他一亿美元，战后支付。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_93",
        outcome: {
          narrative: "他大笑。'我不信期票。' 但他没杀你，只是把你关进了笼子，准备拍卖。",
          statsDelta: { personalSecurity: -20 }
        }
      },
      {
        id: "opt_092_b",
        text: "单挑。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_95",
        outcome: {
          narrative: "你用藏在袖子里的刀划破了他的喉咙。海盗们震惊了。海盗法典：杀人者偿命...或者成为新船长？",
          statsDelta: { personalSecurity: -10, militaryLoyalty: 10 }
        }
      },
      {
        id: "opt_092_c",
        text: "透露美国CIA卧底的位置。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_93",
        outcome: {
          narrative: "你撒谎说船上有CIA追踪器。海盗们吓坏了，把你扔回了小船，像躲瘟疫一样逃走了。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 93: The Fever Returns
  {
    id: "evt_93",
    phase: "INTERNATIONAL",
    narrative: "1月7日 06:00 PM。海上的暴晒和脱水加重了病情。你开始出现败血症的症状。如果不进行治疗，你将在到达目的地前死去。",
    newsTicker: "HEALTH: 目标生命体征可能正在消失。",
    location: "Open Sea",
    time: "Jan 07, 2026, 06:00 PM",
    options: [
      {
        id: "opt_093_a",
        text: "冒险靠近特立尼达海岸求医。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_94",
        outcome: {
          narrative: "这是一个拥有引渡条约的国家。你刚上岸就被警察发现了。但至少你进了医院。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_093_b",
        text: "用海水清洗伤口，自生自灭。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_95",
        outcome: {
          narrative: "剧痛让你昏厥。醒来时，伤口似乎结痂了。盐是最好的防腐剂。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_093_c",
        text: "服用海盗留下的过期抗生素。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_96",
        outcome: {
          narrative: "药效还在。你活下来了，虽然肝脏可能受损。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 94: The CIA Deal
  {
    id: "evt_94",
    phase: "INTERNATIONAL",
    narrative: "1月7日 09:00 PM。你的卫星电话响了。是一个美国号码。'总统先生，这是最后的出价。去佛罗里达养老，或者在海上喂鱼。我们知道你的位置。'",
    newsTicker: "DIPLOMACY: 美国务院重申对委内瑞拉前总统的起诉。",
    location: "Satellite Phone",
    time: "Jan 07, 2026, 09:00 PM",
    options: [
      {
        id: "opt_094_a",
        text: "同意谈判，争取宽大处理。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_100",
        outcome: {
          narrative: "你累了。你不想死了。你同意了坐标。一架黑鹰直升机正在飞来接你。这是投降，也是解脱。",
          statsDelta: { personalSecurity: 50 }
        }
      },
      {
        id: "opt_094_b",
        text: "大骂一通，挂断电话。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_98",
        outcome: {
          narrative: "哪怕死，也要站着死。你扔掉了电话。美军的导弹将在十分钟内到达。跑！",
          statsDelta: { personalSecurity: -20, publicSupport: 10 }
        }
      },
      {
        id: "opt_094_c",
        text: "假装同意，设置诱饵。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_95",
        outcome: {
          narrative: "你把电话绑在一个浮标上。直升机去抓浮标了。你趁机全速逃离。",
          statsDelta: { personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 95: The Cargo Ship
  {
    id: "evt_95",
    phase: "INTERNATIONAL",
    narrative: "1月8日 00:00 AM。你看到了那艘'中远'货轮。巨大的船体像一座移动的岛屿。它是你通往自由的方舟。但怎么上去是个问题。",
    newsTicker: "SHIPPING: 国际航运因加勒比海危机受到干扰。",
    location: "Near Cargo Ship",
    time: "Jan 08, 2026, 00:00 AM",
    options: [
      {
        id: "opt_095_a",
        text: "发射信号弹求救。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_99",
        outcome: {
          narrative: "船员发现了你。绳梯放了下来。船长是中国人，他什么都没问，只给了你一件大衣。",
          statsDelta: { personalSecurity: 20 }
        }
      },
      {
        id: "opt_095_b",
        text: "偷偷攀爬锚链。",
        type: "stealth",
        risk: "extreme",
        nextEventId: "evt_96",
        outcome: {
          narrative: "极其危险。你差点滑下去。但你成功混上了甲板，藏在集装箱缝隙里。",
          statsDelta: { personalSecurity: 15 }
        }
      },
      {
        id: "opt_095_c",
        text: "撞击船体引起注意。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_98",
        outcome: {
          narrative: "你的小船碎了。你落水了。幸好水手把你捞了上来。太狼狈了。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 96: The Submarine Rendezvous
  {
    id: "evt_96",
    phase: "INTERNATIONAL",
    narrative: "1月8日 03:00 AM。按照坐标，海面上浮出了一个巨大的黑色物体。是俄罗斯'亚森-M'级核潜艇。舱盖打开，几个特种兵向你招手。这是最高级别的撤离。",
    newsTicker: "ALERT: 北约声纳侦测到俄罗斯潜艇活动。",
    location: "Rendezvous Point Bravo",
    time: "Jan 08, 2026, 03:00 AM",
    options: [
      {
        id: "opt_096_a",
        text: "登上潜艇，前往莫斯科。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_100",
        outcome: {
          narrative: "你进入了钢铁巨兽的腹中。'欢迎上船，同志。' 伏特加的味道。你安全了，但你也永远欠了俄国人。",
          statsDelta: { personalSecurity: 100, internationalStance: 20 }
        }
      },
      {
        id: "opt_096_b",
        text: "要求潜艇攻击追来的美舰。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_98",
        outcome: {
          narrative: "舰长拒绝了。'你想引发第三次世界大战吗？' 他差点把你踢下去。",
          statsDelta: { internationalStance: -10 }
        }
      },
      {
        id: "opt_096_c",
        text: "犹豫不决，怀疑是陷阱。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_97",
        outcome: {
          narrative: "潜艇不可能久留。它下潜了。你错过了最强的顺风车。",
          statsDelta: { personalSecurity: -20 }
        }
      }
    ]
  },

  // Event 97: The Cuban Trawler
  {
    id: "evt_97",
    phase: "INTERNATIONAL",
    narrative: "1月8日 06:00 AM。一艘不起眼的古巴渔船靠近了你。船长是个老革命，叼着雪茄。'卡斯特罗从未忘记朋友。' 船上没有导弹，只有朗姆酒和兄弟情义。",
    newsTicker: "DIPLOMACY: 古巴重申支持委内瑞拉主权。",
    location: "Cuban Waters Edge",
    time: "Jan 08, 2026, 06:00 AM",
    options: [
      {
        id: "opt_097_a",
        text: "上船，前往哈瓦那。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_100",
        outcome: {
          narrative: "船很慢，但很稳。你喝了一口朗姆酒，看着日出。自由的味道。",
          statsDelta: { personalSecurity: 80 }
        }
      },
      {
        id: "opt_097_b",
        text: "以此为跳板去墨西哥。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_98",
        outcome: {
          narrative: "古巴只是中转站。你的目标更远。船长同意送你一程。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_097_c",
        text: "拒绝上船，继续流亡。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_98",
        outcome: {
          narrative: "你不想连累古巴。你选择了继续孤独的航行。这种高尚可能会害死你。",
          statsDelta: { internationalStance: 10 }
        }
      }
    ]
  },

  // Event 98: The Final Blockade
  {
    id: "evt_98",
    phase: "INTERNATIONAL",
    narrative: "1月8日 09:00 AM。无论你怎么逃，美军的包围圈都在缩小。前方是最后一层封锁线。几艘驱逐舰和无数的无人机。这里是插翅难飞的死地。",
    newsTicker: "BREAKING: 美军宣布海上封锁线已完成合围。",
    location: "The Last Line",
    time: "Jan 08, 2026, 09:00 AM",
    options: [
      {
        id: "opt_098_a",
        text: "全速冲击，哪怕玉石俱焚。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_100",
        outcome: {
          narrative: "你的船冲向了驱逐舰。这是一种自杀式的冲锋。机炮响了。你的船起火了。你要么死，要么成为传奇。",
          statsDelta: { publicSupport: 50, personalSecurity: -100 }
        }
      },
      {
        id: "opt_098_b",
        text: "升白旗，谈判。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_100",
        outcome: {
          narrative: "你停船了。扩音器喊话让你双手抱头。这不丢人。你活到了谈判桌前。",
          statsDelta: { personalSecurity: 50 }
        }
      },
      {
        id: "opt_098_c",
        text: "潜入水中，做最后的挣扎。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_99",
        outcome: {
          narrative: "你跳海了。抱着一块木板。也许洋流会把你带出去，也许鲨鱼会先找到你。",
          statsDelta: { personalSecurity: -20 }
        }
      }
    ]
  },

  // Event 99: The Miracle
  {
    id: "evt_99",
    phase: "INTERNATIONAL",
    narrative: "1月8日 12:00 PM。就在你绝望的时候，一艘神秘的潜艇或者货轮（取决于之前的选择）突然出现在迷雾中，挡在了你和美舰之间。这是不可能的奇迹，或者是大国的最后博弈。",
    newsTicker: "MYSTERY: 冲突海域出现信号异常，双方对峙。",
    location: "The Miracle Zone",
    time: "Jan 08, 2026, 12:00 PM",
    options: [
      {
        id: "opt_099_a",
        text: "抓住机会，登上救援船。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_100",
        outcome: {
          narrative: "你爬上去了。美舰没有开火，显然他们不想引发核战争。你赢了。",
          statsDelta: { personalSecurity: 100 }
        }
      },
      {
        id: "opt_099_b",
        text: "怀疑是幻觉，继续漂流。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_100",
        outcome: {
          narrative: "你错过了机会。迷雾散去，什么都没有。只剩下你和无尽的大海。",
          statsDelta: { personalSecurity: -50 }
        }
      },
      {
        id: "opt_099_c",
        text: "向美舰开火，掩护救援船撤离。",
        type: "diplomatic",
        risk: "extreme",
        nextEventId: "evt_100",
        outcome: {
          narrative: "你牺牲了自己。救援船（可能是带着你家人的）逃走了。你被美军捕获，但你笑了。",
          statsDelta: { publicSupport: 100, personalSecurity: 0 }
        }
      }
    ]
  },

  // Event 100: The Crossroads
  {
    id: "evt_100",
    phase: "INTERNATIONAL",
    narrative: "1月9日。命运的分岔路口。根据你之前的选择和属性，你的结局已经注定。你要走向哪条路？",
    newsTicker: "FINAL: '委内瑞拉：resolve'行动宣告结束，委内瑞拉局势进入新阶段。",
    location: "Endpoint",
    time: "Jan 09, 2026",
    options: [
      {
        id: "opt_100_a",
        text: "接受政治庇护，流亡海外 (THE EXILE)。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_101",
        outcome: {
          narrative: "飞机起飞了。你最后看了一眼加拉加斯。你活下来了，但也失去了一切。",
          statsDelta: { personalSecurity: 20 }
        }
      },
      {
        id: "opt_100_b",
        text: "不幸被捕，面临审判 (THE PRISONER)。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_106",
        outcome: {
          narrative: "手铐冰冷。闪光灯刺眼。你的余生将在铁窗后度过。",
          statsDelta: { publicSupport: -20 }
        }
      },
      {
        id: "opt_100_c",
        text: "遁入丛林，武装割据 (THE WARLORD)。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_111",
        outcome: {
          narrative: "只要还有枪，战争就没有结束。欢迎来到绿色的地狱。",
          statsDelta: { militaryLoyalty: 10 }
        }
      },
      {
        id: "opt_100_d",
        text: "壮烈牺牲，成为图腾 (THE MARTYR)。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_116",
        outcome: {
          narrative: "你选择了死亡。但你的名字将永远活在反抗者的心中。",
          statsDelta: { publicSupport: 50 }
        }
      }
    ]
  },

  // =========================================================================
  // BATCH 6: JUDGMENT & DIVERGENCE (Events 101-120)
  // =========================================================================

  // --- PATH A: THE EXILE (流亡线) ---
  
  // Event 101: The Cold Welcome
  {
    id: "evt_101",
    phase: "ENDING",
    narrative: "1月10日。莫斯科/哈瓦那/安卡拉。飞机降落在异国的军用机场。没有红地毯，没有仪仗队。只有几辆黑色的轿车和一群面无表情的情报官员。你不再是总统，你是一个烫手的政治包袱，或者一张有待榨取的牌。",
    newsTicker: "BREAKING: 确认委内瑞拉前领导人已抵达第三国寻求庇护。",
    location: "Secret Airbase",
    time: "Jan 10, 2026",
    options: [
      {
        id: "opt_101_a",
        text: "要求以国家元首礼遇接待。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_102",
        outcome: {
          narrative: "接待官员冷笑了一声。'在这里，只有客人和囚犯的区别。请上车。' 你被塞进了一辆防弹车，失去了最后的尊严。",
          statsDelta: { internationalStance: -10, personalSecurity: 5 }
        }
      },
      {
        id: "opt_101_b",
        text: "保持低调，感谢庇护。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_102",
        outcome: {
          narrative: "你的谦卑赢得了一点尊重。'我们会保证你的安全，但也请你保持安静。' 这是一个金丝笼的开始。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_101_c",
        text: "试图联系媒体曝光行踪。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_104",
        outcome: {
          narrative: "手机被没收了。'为了你的安全，暂时切断通讯。' 你不仅流亡了，还失声了。",
          statsDelta: { personalSecurity: -5 }
        }
      }
    ]
  },

  // Event 102: The Gilded Cage
  {
    id: "evt_102",
    phase: "ENDING",
    narrative: "1月20日。你被安置在郊外的一座别墅里。高墙电网，警卫森严。这是保护，也是监禁。除了园丁和厨师，你见不到任何人。电视里播放着加拉加斯成立过渡政府的新闻。",
    newsTicker: "WORLD: 委内瑞拉成立临时过渡委员会，获多国承认。",
    location: "Secure Villa",
    time: "Jan 20, 2026",
    options: [
      {
        id: "opt_102_a",
        text: "整日酗酒，沉溺过去。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_105",
        outcome: {
          narrative: "酒精麻痹了痛苦，也摧毁了健康。守卫看着醉醺醺的你，眼神里充满了轻蔑。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_102_b",
        text: "开始撰写回忆录，'揭露真相'。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_103",
        outcome: {
          narrative: "笔是你最后的武器。你记录下每一个背叛者的名字。这让你的东道主感到紧张，也感到有价值。",
          statsDelta: { internationalStance: 5 }
        }
      },
      {
        id: "opt_102_c",
        text: "密谋策划反攻复国。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_104",
        outcome: {
          narrative: "你试图收买守卫传递信件。信件直接交到了情报局长桌上。'他还是不安分。'",
          statsDelta: { personalSecurity: -20 }
        }
      }
    ]
  },

  // Event 103: The Interview
  {
    id: "evt_103",
    phase: "ENDING",
    narrative: "2月15日。经过漫长的谈判，当局允许一位西方知名记者进入别墅采访。这是你向世界发声的机会，也是西方世界把你当作珍稀动物展览的机会。",
    newsTicker: "MEDIA: 独家专访：流亡中的独裁者打破沉默。",
    location: "Villa Library",
    time: "Feb 15, 2026",
    options: [
      {
        id: "opt_103_a",
        text: "痛哭流涕，扮演受害者。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_105",
        outcome: {
          narrative: "表演很拙劣。西方媒体称其为'鳄鱼的眼泪'。但这确实引起了一些左翼人士的同情。",
          statsDelta: { internationalStance: 5 }
        }
      },
      {
        id: "opt_103_b",
        text: "言辞犀利，抨击美帝国主义。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_104",
        outcome: {
          narrative: "还是那个强硬的马杜罗。采访播出后，美国向你的庇护国施加了外交压力。",
          statsDelta: { personalSecurity: -10, publicSupport: 5 }
        }
      },
      {
        id: "opt_103_c",
        text: "爆料关于CIA的秘密交易。",
        type: "diplomatic",
        risk: "extreme",
        nextEventId: "evt_104",
        outcome: {
          narrative: "这触碰了红线。采访录音被当局扣押了。你因为'违反庇护协议'被加强了看管。",
          statsDelta: { personalSecurity: -15 }
        }
      }
    ]
  },

  // Event 104: The Asset
  {
    id: "evt_104",
    phase: "ENDING",
    narrative: "3月1日。情报局长亲自来访。'总统先生，我们需要你脑子里的东西。' 委内瑞拉的防空网漏洞、秘密账户密码、潜伏特工名单。这是一场交易：用情报换取继续生存的权利。",
    newsTicker: "INTEL: 庇护国情报机构频繁接触委内瑞拉前高层。",
    location: "Interrogation Room (Villa)",
    time: "Mar 01, 2026",
    options: [
      {
        id: "opt_104_a",
        text: "全盘托出，换取更好的待遇。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_121",
        outcome: {
          narrative: "你出卖了所有人。作为回报，你的红酒档次提高了，还能看卫星电视。但你彻底成了叛徒。",
          statsDelta: { personalSecurity: 20, militaryLoyalty: -100 }
        }
      },
      {
        id: "opt_104_b",
        text: "提供半真半假的情报。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_121",
        outcome: {
          narrative: "危险的游戏。一旦被发现撒谎，后果严重。但这让你保留了一丝尊严。",
          statsDelta: { personalSecurity: 0 }
        }
      },
      {
        id: "opt_104_c",
        text: "拒绝合作，'我不是间谍'。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_105",
        outcome: {
          narrative: "局长面无表情地离开了。第二天，别墅的暖气停了，食物变成了冷面包。这就是代价。",
          statsDelta: { personalSecurity: -20 }
        }
      }
    ]
  },

  // Event 105: The Long Winter
  {
    id: "evt_105",
    phase: "ENDING",
    narrative: "2026年冬。北国的冬天漫长而寒冷。或者热带的雨季潮湿难耐。你被世界遗忘了。新闻里不再有你的名字。偶尔有关于委内瑞拉经济复苏的报道，那里的人们似乎过得更好了。这是对你最大的惩罚：无关紧要。",
    newsTicker: "ECONOMY: 委内瑞拉石油产量恢复至战前水平。",
    location: "Villa Garden",
    time: "Dec 25, 2026",
    options: [
      {
        id: "opt_105_a",
        text: "进入分支：流亡者的余生 (THE EXILE)。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_121",
        outcome: {
          narrative: "故事还在继续，但舞台已经不在你脚下。你只能作为一个旁观者，看着历史的车轮滚滚向前。",
          statsDelta: {}
        }
      }
    ]
  },

  // --- PATH B: THE PRISONER (囚徒线) ---

  // Event 106: The Orange Jumpsuit
  {
    id: "evt_106",
    phase: "ENDING",
    narrative: "1月10日。佛罗里达/关塔那摩。如果你被捕了，你现在穿着橙色囚服，手脚戴着镣铐。镁光灯闪烁，你像动物一样被展示。这是美国司法部的胜利游行。你被剥夺了名字，只剩下一个编号：Detainee 1492。",
    newsTicker: "JUSTICE: 尼古拉斯·马杜罗抵达美国本土，面临毒品恐怖主义指控。",
    location: "Federal Detention Center",
    time: "Jan 10, 2026",
    options: [
      {
        id: "opt_106_a",
        text: "对着镜头高喊'我是合法总统'。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_107",
        outcome: {
          narrative: "你的声音被警卫的推搡打断。这一幕被反复播放，不仅没有显示权威，反而显得滑稽。",
          statsDelta: { publicSupport: -10 }
        }
      },
      {
        id: "opt_106_b",
        text: "低头避开镜头，保留隐私。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_107",
        outcome: {
          narrative: "你试图隐藏自己的脸。这被解读为羞愧和认罪。你的支持者感到失望。",
          statsDelta: { publicSupport: -5 }
        }
      },
      {
        id: "opt_106_c",
        text: "微笑，甚至向记者挥手。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_107",
        outcome: {
          narrative: "诡异的微笑。这让人觉得你疯了，或者是胸有成竹。这张照片成为了《时代》周刊的封面。",
          statsDelta: { internationalStance: 5 }
        }
      }
    ]
  },

  // Event 107: The Interrogation Room
  {
    id: "evt_107",
    phase: "ENDING",
    narrative: "1月15日。没有窗户的房间。空调开得很低，冷得刺骨。坐在对面的是CIA高级探员和联邦检察官。桌上放着一堆文件。'我们不需要你认罪，证据已经足够把你关一万年。我们需要的是名字。'",
    newsTicker: "TRIAL: 检方称掌握大量证据，将在法庭上展示。",
    location: "Interrogation Room",
    time: "Jan 15, 2026",
    options: [
      {
        id: "opt_107_a",
        text: "要求见律师，保持沉默。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_109",
        outcome: {
          narrative: "这是你的权利。审讯陷入僵局。他们不能对你动刑，但他们可以让你在单独监禁里发疯。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_107_b",
        text: "供出俄罗斯和伊朗的联络人。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_108",
        outcome: {
          narrative: "检察官笑了。这是他们想要的。作为交换，也许能给你换一个有窗户的牢房。",
          statsDelta: { internationalStance: -20, personalSecurity: 10 }
        }
      },
      {
        id: "opt_107_c",
        text: "反过来给他们上政治课。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_109",
        outcome: {
          narrative: "你滔滔不绝地讲了三小时玻利瓦尔主义。探员们听得想睡觉。这是一种精神胜利。",
          statsDelta: { publicSupport: 5 }
        }
      }
    ]
  },

  // Event 108: The Plea Deal
  {
    id: "evt_108",
    phase: "ENDING",
    narrative: "2月10日。检察官提出了一份协议：承认贩毒指控，供出所有卡特尔成员，以此换取免除死刑（如果适用）和在联邦证人保护计划下的最低安保监狱服刑。这是一张通往'舒适'余生的门票。",
    newsTicker: "RUMOR: 辩护律师团队正与检方讨论认罪协议。",
    location: "Attorney Meeting Room",
    time: "Feb 10, 2026",
    options: [
      {
        id: "opt_108_a",
        text: "签署协议。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_126",
        outcome: {
          narrative: "你签字了。世界震惊了。'马杜罗投降了'。你保住了命，但摧毁了自己的神话。",
          statsDelta: { publicSupport: -100, personalSecurity: 100 }
        }
      },
      {
        id: "opt_108_b",
        text: "撕碎协议，要求公开审判。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_109",
        outcome: {
          narrative: "你要把法庭变成你的讲坛。这很有种，但风险极高。你会死在监狱里。",
          statsDelta: { publicSupport: 20 }
        }
      },
      {
        id: "opt_108_c",
        text: "拖延时间，等待国际局势变化。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_109",
        outcome: {
          narrative: "检察官失去了耐心。交易取消。现在是硬碰硬的时候了。",
          statsDelta: { personalSecurity: -10 }
        }
      }
    ]
  },

  // Event 109: The Trial of the Century
  {
    id: "evt_109",
    phase: "ENDING",
    narrative: "5月1日。纽约南区联邦法院。全世界的目光都集中在这里。控方展示了成吨的证据：录音、账本、证人。你的前亲信们一个个上台指证你。你在被告席上，看着曾经的部下变成你的掘墓人。",
    newsTicker: "TRIAL: 庭审进入关键阶段，前情报局长出庭作证。",
    location: "Courtroom",
    time: "May 01, 2026",
    options: [
      {
        id: "opt_109_a",
        text: "在法庭上咆哮，指责这是政治迫害。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_110",
        outcome: {
          narrative: "法官多次敲锤警告。你被法警强行带离。但这正是你想要的画面——一个不屈的斗士。",
          statsDelta: { publicSupport: 30, internationalStance: -10 }
        }
      },
      {
        id: "opt_109_b",
        text: "冷静质询证人，揭露他们的腐败。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_110",
        outcome: {
          narrative: "你不仅是被告，也是律师。你让几个证人哑口无言。法庭剧般的精彩反击。",
          statsDelta: { publicSupport: 10 }
        }
      },
      {
        id: "opt_109_c",
        text: "保持沉默，像个雕像。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_110",
        outcome: {
          narrative: "无声的抗议。你的眼神空洞。人们开始遗忘那个曾经叱咤风云的独裁者。",
          statsDelta: { publicSupport: -10 }
        }
      }
    ]
  },

  // Event 110: The Verdict
  {
    id: "evt_110",
    phase: "ENDING",
    narrative: "8月20日。陪审团做出裁决。这毫无悬念。所有罪名成立。你被判处终身监禁，外加150年刑期。你将在科罗拉多州的ADX Florence超级监狱度过余生。那里被称为'落基山脉的恶魔岛'。",
    newsTicker: "BREAKING: 尼古拉斯·马杜罗被判处终身监禁，不得假释。",
    location: "Courtroom",
    time: "Aug 20, 2026",
    options: [
      {
        id: "opt_110_a",
        text: "进入分支：囚徒的岁月 (THE PRISONER)。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_126",
        outcome: {
          narrative: "铁门关上了。世界从此只有23小时的禁闭和1小时的放风。故事在这里画上了句号，或者是逗号？",
          statsDelta: {}
        }
      }
    ]
  },

  // --- PATH C: THE JUNGLE WARLORD (丛林线) ---

  // Event 111: The New Command
  {
    id: "evt_111",
    phase: "ENDING",
    narrative: "1月15日。委内瑞拉南部丛林。你没有逃走，也没有死。你集结了残余的忠诚部队、ELN游击队和不想投降的军人。你现在不再是总统，你是'玻利瓦尔解放阵线'的最高指挥官。丛林是你的新宫殿。",
    newsTicker: "SECURITY: 委内瑞拉南部仍有零星武装冲突，政府军展开清剿。",
    location: "Jungle Base Camp",
    time: "Jan 15, 2026",
    options: [
      {
        id: "opt_111_a",
        text: "发表《丛林宣言》，号召持久战。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_112",
        outcome: {
          narrative: "视频在暗网上流传。虽然很多人嘲笑你，但对于那些绝望的死硬派来说，你是唯一的希望。",
          statsDelta: { militaryLoyalty: 20, publicSupport: 5 }
        }
      },
      {
        id: "opt_111_b",
        text: "实行严格的军事管制，清洗动摇者。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_113",
        outcome: {
          narrative: "行刑队在黎明处决了逃兵。恐惧维持了纪律。你正在变成真正的军阀。",
          statsDelta: { militaryLoyalty: 10, personalSecurity: -5 }
        }
      },
      {
        id: "opt_111_c",
        text: "建立丛林农场，准备长期生存。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_112",
        outcome: {
          narrative: "深挖洞，广积粮。这不再是逃亡，而是割据。你在地图上抹去了一块区域，那是你的王国。",
          statsDelta: { personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 112: The Narco Economy
  {
    id: "evt_112",
    phase: "ENDING",
    narrative: "3月10日。理想不能当饭吃。武器、药品、忠诚，都需要钱。而在丛林里，唯一硬通货就是可卡因。哥伦比亚的毒枭派人来接洽：'合作，或者开战。'",
    newsTicker: "CRIME: 委内瑞拉南部发现大规模非法可卡因加工厂。",
    location: "Coca Plantation",
    time: "Mar 10, 2026",
    options: [
      {
        id: "opt_112_a",
        text: "全面接管毒品贸易，以此养战。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_114",
        outcome: {
          narrative: "你成了真正的'毒王'。美元源源不断地流入。装备更新了，但你彻底堕落了。革命的旗帜上沾满了白粉。",
          statsDelta: { personalSecurity: 20, internationalStance: -20 }
        }
      },
      {
        id: "opt_112_b",
        text: "拒绝贩毒，只征收'革命税'。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_113",
        outcome: {
          narrative: "一种虚伪的道德。你收保护费，让别人去脏手。但这无法满足日益增长的开支。部队在挨饿。",
          statsDelta: { militaryLoyalty: -10 }
        }
      },
      {
        id: "opt_112_c",
        text: "黑吃黑，抢劫毒枭。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_114",
        outcome: {
          narrative: "你发动了突袭。抢了一大笔钱，但也惹怒了整个拉美的黑帮。现在不仅美军要杀你，毒贩也要杀你。",
          statsDelta: { personalSecurity: -30, militaryLoyalty: 15 }
        }
      }
    ]
  },

  // Event 113: The Betrayal Within
  {
    id: "evt_113",
    phase: "ENDING",
    narrative: "5月20日。悬赏金已经涨到了一亿美元。即使是最忠诚的卫士，看着你的眼神也变了。在一次夜间巡逻中，你的副手试图在你的水里下毒。",
    newsTicker: "INTEL: 反政府武装内部可能出现分裂。",
    location: "Commander's Tent",
    time: "May 20, 2026",
    options: [
      {
        id: "opt_113_a",
        text: "识破阴谋，当众处决副手。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_115",
        outcome: {
          narrative: "你亲手开枪。血溅在每个人脸上。没人敢说话。但这种忠诚是脆弱的。你不敢睡觉了。",
          statsDelta: { personalSecurity: -10, militaryLoyalty: 5 }
        }
      },
      {
        id: "opt_113_b",
        text: "饶他一命，把他赶出丛林。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_114",
        outcome: {
          narrative: "仁慈？不，是软弱。他一出丛林就向美军报告了你的坐标。空袭即将到来。",
          statsDelta: { personalSecurity: -20 }
        }
      },
      {
        id: "opt_113_c",
        text: "建立轮换的贴身卫队制度。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_115",
        outcome: {
          narrative: "互不信任，互相监督。这就是独裁者的生存之道。哪怕在丛林里。",
          statsDelta: { personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 114: The Raid
  {
    id: "evt_114",
    phase: "ENDING",
    narrative: "7月4日。美军为了庆祝独立日，发动了'雷霆行动'。特种部队突袭了你的营地。不再是猫鼠游戏，是正面的围剿。AC-130在头顶画圈，地面是游骑兵的包围圈。",
    newsTicker: "WAR: 美军对委内瑞拉南部反叛势力发动斩首行动。",
    location: "Jungle Battleground",
    time: "Jul 04, 2026",
    options: [
      {
        id: "opt_114_a",
        text: "指挥部队死战，突围。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_115",
        outcome: {
          narrative: "伤亡惨重。你身边的人一个个倒下。你再一次逃脱了，但这支部队已经名存实亡。",
          statsDelta: { militaryLoyalty: -50, personalSecurity: 5 }
        }
      },
      {
        id: "opt_114_b",
        text: "抛弃大部队，独自潜逃。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_131",
        outcome: {
          narrative: "你利用部下作为掩护。你活下来了，光杆司令。丛林之王的梦碎了。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_114_c",
        text: "设置陷阱，与敌同归于尽。",
        type: "desperate",
        risk: "extreme",
        nextEventId: "END_MARTYR",
        outcome: {
          narrative: "巨大的爆炸。你和二十名游骑兵同归于尽。这是你最后的胜利。",
          statsDelta: { publicSupport: 100 }
        }
      }
    ]
  },

  // Event 115: The Legend
  {
    id: "evt_115",
    phase: "ENDING",
    narrative: "2026年底。你依然在丛林里。你变成了传说，或者鬼魂。有人说你死了，有人说你还在指挥战斗。你成为了亚马逊雨林的一部分，一个永不愈合的伤口。",
    newsTicker: "MYSTERY: 关于马杜罗下落的传言不绝于耳。",
    location: "Deep Jungle",
    time: "Dec 31, 2026",
    options: [
      {
        id: "opt_115_a",
        text: "进入分支：丛林之王 (THE WARLORD)。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_131",
        outcome: {
          narrative: "只要你还拿着枪，战争就没有结束。欢迎来到你的黑暗王国。",
          statsDelta: {}
        }
      }
    ]
  },

  // --- PATH D: THE MARTYR (图腾线) ---

  // Event 116: The Death
  {
    id: "evt_116",
    phase: "ENDING",
    narrative: "1月XX日。如果你在之前的战斗中死亡。不论是自杀、战死还是被暗杀。你的尸体被美军展示，或者被埋在无名之地。但对于你的支持者来说，肉体的消亡只是神化的开始。",
    newsTicker: "BREAKING: 尼古拉斯·马杜罗被确认死亡。",
    location: "Morgue / Grave",
    time: "Jan XX, 2026",
    options: [
      {
        id: "opt_116_a",
        text: "死得壮烈（如战斗中阵亡）。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_117",
        outcome: {
          narrative: "那张你手持AK-47倒下的照片成为了图腾。切·格瓦拉式的结局。",
          statsDelta: { publicSupport: 80 }
        }
      },
      {
        id: "opt_116_b",
        text: "死得悲情（如自杀或被害）。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_117",
        outcome: {
          narrative: "人们把你描绘成受害者，一个被帝国主义逼死的殉道者。",
          statsDelta: { publicSupport: 30 }
        }
      },
      {
        id: "opt_116_c",
        text: "死得神秘（尸体未找到）。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_119",
        outcome: {
          narrative: "没有尸体，就没有死亡。'他还会回来的'。",
          statsDelta: { publicSupport: 20 }
        }
      }
    ]
  },

  // Event 117: The Graffiti
  {
    id: "evt_117",
    phase: "ENDING",
    narrative: "2月。加拉加斯的墙壁上开始出现你的头像涂鸦。'Maduro Vive'（马杜罗活着）。美军每次粉刷，第二天又会出现更多。你的脸成了反抗占领的符号。",
    newsTicker: "SOCIETY: 委内瑞拉街头出现大量反美涂鸦。",
    location: "Caracas Slums",
    time: "Feb 2026",
    options: [
      {
        id: "opt_117_a",
        text: "你的名字成为口号。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_118",
        outcome: {
          narrative: "抗议者高喊着你的名字。你比生前更受欢迎，因为死人不会犯错。",
          statsDelta: { publicSupport: 10 }
        }
      }
    ]
  },

  // Event 118: The Cult
  {
    id: "evt_118",
    phase: "ENDING",
    narrative: "6月。在某些贫民窟，神龛里开始供奉你的照片，旁边是查韦斯和耶稣。'圣尼古拉斯'。一种混合了政治和宗教的狂热正在滋生。",
    newsTicker: "RELIGION: 委内瑞拉底层出现对前领导人的崇拜现象。",
    location: "Home Shrine",
    time: "Jun 2026",
    options: [
      {
        id: "opt_118_a",
        text: "神话化。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_120",
        outcome: {
          narrative: "你从政治家变成了神祗。这对你的家人是种保护，也是种负担。",
          statsDelta: { publicSupport: 20 }
        }
      }
    ]
  },

  // Event 119: The Conspiracy
  {
    id: "evt_119",
    phase: "ENDING",
    narrative: "9月。关于你没死的阴谋论甚嚣尘上。有人说你死了，有人说你还在古巴，有人说你在丛林。每当电力故障或发生袭击，人们就说是你干的。你是这个国家挥之不去的幽灵。",
    newsTicker: "RUMOR: 目击者声称看到貌似马杜罗的人。",
    location: "Social Media",
    time: "Sep 2026",
    options: [
      {
        id: "opt_119_a",
        text: "永远的恐惧。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_120",
        outcome: {
          narrative: "新政府睡不安稳。只要这传言还在，他们就永远无法彻底统治。",
          statsDelta: {}
        }
      }
    ]
  },

  // Event 120: The Legacy
  {
    id: "evt_120",
    phase: "ENDING",
    narrative: "2026年底。无论真相如何，你已经赢得了另一种胜利：不朽。只要委内瑞拉还存在贫穷和反美情绪，你的旗帜就会被一次次举起。",
    newsTicker: "HISTORY: 委内瑞拉动荡的一年回顾。",
    location: "History Book",
    time: "Dec 31, 2026",
    options: [
      {
        id: "opt_120_a",
        text: "进入分支：不朽图腾 (THE MARTYR)。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_136",
        outcome: {
          narrative: "肉体归于尘土，精神化为图腾。你在烈火中永生。",
          statsDelta: {}
        }
      }
    ]
  },

  // =========================================================================
  // BATCH 7: THE AFTERMATH - EXILE & PRISON (Events 121-140)
  // =========================================================================

  // --- EXTENDED PATH A: THE EXILE (流亡者生活细节) ---

  // Event 121: The Secret Visitor
  {
    id: "evt_121",
    phase: "ENDING",
    narrative: "2027年春。你在莫斯科郊外的别墅已经住了一年。虽然衣食无忧，但这种被软禁的生活让你窒息。一天深夜，一个自称来自中国的商人秘密造访，带来了一个诱人的提议。",
    newsTicker: "BUSINESS: 中国企业加大在拉美投资力度。",
    location: "Villa Study",
    time: "Mar 15, 2027",
    options: [
      {
        id: "opt_121_a",
        text: "接受资助，成为其在拉美的秘密代理人。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_122",
        outcome: {
          narrative: "你获得了一大笔秘密资金。虽然只是个傀儡，但至少有了重新介入局势的筹码。",
          statsDelta: { internationalStance: 10, personalSecurity: 5 }
        }
      },
      {
        id: "opt_121_b",
        text: "拒绝提议，担心是陷阱。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_123",
        outcome: {
          narrative: "商人礼貌地离开了。几天后，你的安保级别突然被降低了。也许你拒绝了不该拒绝的人。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_121_c",
        text: "向东道主情报局汇报此事。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_123",
        outcome: {
          narrative: "你的忠诚得到了回报。情报局查出那是个双面间谍。你获得了一次去歌剧院看戏的奖励。",
          statsDelta: { personalSecurity: 15 }
        }
      }
    ]
  },

  // Event 122: The Shadow Cabinet
  {
    id: "evt_122",
    phase: "ENDING",
    narrative: "2027年夏。利用秘密资金，你开始在海外组建'流亡政府'。这是一群同样流亡的政客、落魄的军官和投机分子。你们在加密聊天软件上开会，幻想重返米拉弗洛雷斯宫。",
    newsTicker: "POLITICS: 委内瑞拉海外反对派声称将组建新联盟。",
    location: "Encrypted Chat Room",
    time: "Jul 10, 2027",
    options: [
      {
        id: "opt_122_a",
        text: "发布'新玻利瓦尔宣言'。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_124",
        outcome: {
          narrative: "宣言在社交媒体上引起了一阵波澜，随后被各种猫猫狗狗的视频淹没。互联网是有记忆的，也是健忘的。",
          statsDelta: { publicSupport: 5 }
        }
      },
      {
        id: "opt_122_b",
        text: "策划针对现政府官员的暗杀。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_125",
        outcome: {
          narrative: "行动失败了。刺客被捕并供出了你。现在庇护国面临着引渡你的巨大压力。",
          statsDelta: { internationalStance: -20, personalSecurity: -30 }
        }
      },
      {
        id: "opt_122_c",
        text: "专注于洗钱和资产转移。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_124",
        outcome: {
          narrative: "既然回不去了，不如过好日子。你在瑞士的账户数字在增加，但你的政治生命在枯萎。",
          statsDelta: { personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 123: The Hobby
  {
    id: "evt_123",
    phase: "ENDING",
    narrative: "2027年秋。无聊正在吞噬你。为了保持理智，你需要找点事做。园艺？绘画？还是沉迷于网络游戏？",
    newsTicker: "LIFESTYLE: 心理学家指出流亡政客易患抑郁症。",
    location: "Villa Garden",
    time: "Oct 05, 2027",
    options: [
      {
        id: "opt_123_a",
        text: "潜心研究萨尔萨舞。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_124",
        outcome: {
          narrative: "你确实很有天赋。甚至教起了别墅的厨师跳舞。这让你找回了一点曾经作为'公交车司机'的快乐。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_123_b",
        text: "匿名在推特上与黑粉对喷。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_124",
        outcome: {
          narrative: "这是你新的战场。你用小号痛骂帝国主义走狗。虽然没人知道是你，但心里爽多了。",
          statsDelta: {}
        }
      },
      {
        id: "opt_123_c",
        text: "学习俄语/土耳其语。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_124",
        outcome: {
          narrative: "语言是融入的桥梁。看守们对你的态度好转了，甚至偶尔会和你聊聊家常。",
          statsDelta: { personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 124: The Betrayal (Again)
  {
    id: "evt_124",
    phase: "ENDING",
    narrative: "2028年。国际局势突变。庇护国为了改善与美国的关系，正在考虑将你作为筹码。你敏锐地察觉到了风向的变化。",
    newsTicker: "DIPLOMACY: 美俄/美土关系出现缓和迹象。",
    location: "Villa Living Room",
    time: "Feb 2028",
    options: [
      {
        id: "opt_124_a",
        text: "先下手为强，逃往另一个国家。",
        type: "desperate",
        risk: "extreme",
        nextEventId: "evt_125",
        outcome: {
          narrative: "这几乎是不可能的任务。你在机场被拦截。现在你被关进了真正的监狱。",
          statsDelta: { personalSecurity: -50 }
        }
      },
      {
        id: "opt_124_b",
        text: "通过媒体公开喊话，寻求国际支持。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_125",
        outcome: {
          narrative: "你把自己塑造成大国博弈的受害者。这让庇护国很难堪，但也暂时保住了你。",
          statsDelta: { internationalStance: 5 }
        }
      },
      {
        id: "opt_124_c",
        text: "交出最后的秘密账户，买命。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_125",
        outcome: {
          narrative: "这笔钱足够买下一个小岛。你用它换取了继续留下的许可。但你现在真的是一无所有了。",
          statsDelta: { personalSecurity: 20 }
        }
      }
    ]
  },

  // Event 125: The Sunset
  {
    id: "evt_125",
    phase: "ENDING",
    narrative: "2030年。五年过去了。你老了，胖了，也累了。加拉加斯似乎已经是上辈子的记忆。你偶尔会梦见那个炎热的午后，如果你做出了不同的选择……",
    newsTicker: "HISTORY: 回顾委内瑞拉政变五周年。",
    location: "Villa Balcony",
    time: "Jan 2030",
    options: [
      {
        id: "opt_125_a",
        text: "平静地接受命运。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_181",
        outcome: {
          narrative: "你是一个幸存者。在这个乱世，活着就是最大的胜利。哪怕是苟且偷生。",
          statsDelta: {}
        }
      }
    ]
  },

  // --- EXTENDED PATH B: THE PRISONER (监狱风云) ---

  // Event 126: The New Roommate
  {
    id: "evt_126",
    phase: "ENDING",
    narrative: "2026年秋。ADX Florence。你被转移到了普通戒备区（相对而言）。你的狱友是一个墨西哥贩毒集团的前头目。他对你这位'同行'很感兴趣。",
    newsTicker: "PRISON: 联邦监狱管理局否认前总统在狱中享有特权。",
    location: "Cell Block C",
    time: "Oct 10, 2026",
    options: [
      {
        id: "opt_126_a",
        text: "与他结盟，寻求庇护。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_127",
        outcome: {
          narrative: "黑帮的规矩你懂。你成了他在政治话题上的'导师'，他保你在放风时不被人捅刀子。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_126_b",
        text: "保持距离，孤傲高冷。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_128",
        outcome: {
          narrative: "这激怒了他。第二天你的饭菜里被人吐了口水。监狱里没有总统，只有强弱。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_126_c",
        text: "向狱警打小报告。",
        type: "stealth",
        risk: "extreme",
        nextEventId: "evt_128",
        outcome: {
          narrative: "你是'告密者'（Snitch）。这是死罪。你在浴室里被几个犯人围殴，断了两根肋骨。",
          statsDelta: { personalSecurity: -30 }
        }
      }
    ]
  },

  // Event 127: The Library
  {
    id: "evt_127",
    phase: "ENDING",
    narrative: "2027年。你申请在监狱图书馆工作。这里是你唯一能接触到书籍和（受控）新闻的地方。你开始研读法律，试图为自己的上诉寻找漏洞。",
    newsTicker: "LEGAL: 马杜罗律师团队再次提起上诉。",
    location: "Prison Library",
    time: "Mar 2027",
    options: [
      {
        id: "opt_127_a",
        text: "成为'狱中律师'，帮狱友写申诉状。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_129",
        outcome: {
          narrative: "你因为帮一个黑帮老大减刑了两年而赢得了尊重。现在没人敢动你了。",
          statsDelta: { personalSecurity: 20 }
        }
      },
      {
        id: "opt_127_b",
        text: "撰写狱中书简，偷运出去出版。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_128",
        outcome: {
          narrative: "书稿被查获。你被关了两个月禁闭。但部分手稿流出，被左翼媒体奉为经典。",
          statsDelta: { publicSupport: 10, personalSecurity: -10 }
        }
      },
      {
        id: "opt_127_c",
        text: "潜心研究美国宪法，寻找制度漏洞。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_129",
        outcome: {
          narrative: "这是一种智力游戏。你发现美国法律充满了矛盾，这让你感到一种讽刺的快感。",
          statsDelta: {}
        }
      }
    ]
  },

  // Event 128: The Riot
  {
    id: "evt_128",
    phase: "ENDING",
    narrative: "2027年冬。监狱爆发暴乱。两个帮派火拼。作为高价值囚犯，你成了双方都想争夺（或者杀掉）的目标。警报声大作，催泪瓦斯弥漫。",
    newsTicker: "BREAKING: ADX Florence监狱发生严重骚乱。",
    location: "Common Area",
    time: "Dec 15, 2027",
    options: [
      {
        id: "opt_128_a",
        text: "躲在床底下祈祷。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_129",
        outcome: {
          narrative: "很不体面，但很有效。当防暴队冲进来时，你毫发无伤。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_128_b",
        text: "站出来试图调停冲突。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_130",
        outcome: {
          narrative: "你以为你还是总统吗？一颗流弹（或者磨尖的牙刷）击中了你的肩膀。你倒在血泊中。",
          statsDelta: { personalSecurity: -20 }
        }
      },
      {
        id: "opt_128_c",
        text: "趁乱挟持狱警试图越狱。",
        type: "desperate",
        risk: "extreme",
        nextEventId: "evt_130",
        outcome: {
          narrative: "这是一个疯狂的想法。还没走出那个区，你就被狙击手锁定了。这不仅是越狱失败，是自杀。",
          statsDelta: { personalSecurity: -50 }
        }
      }
    ]
  },

  // Event 129: The Interview (Prison Edition)
  {
    id: "evt_129",
    phase: "ENDING",
    narrative: "2028年。好莱坞想拍一部关于你的电影。制片人来探监，想买下你的故事版权。西恩·潘可能会演你。",
    newsTicker: "ENTERTAINMENT: 好莱坞筹拍委内瑞拉政治惊悚片。",
    location: "Visitation Room",
    time: "May 2028",
    options: [
      {
        id: "opt_129_a",
        text: "同意授权，但要求修改剧本。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_130",
        outcome: {
          narrative: "你需要把自己描绘成悲剧英雄。这笔版权费可以留给你的家人。",
          statsDelta: { publicSupport: 5 }
        }
      },
      {
        id: "opt_129_b",
        text: "愤怒拒绝，痛骂好莱坞。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_130",
        outcome: {
          narrative: "电影还是拍了，把你描绘成一个小丑。你什么都没得到，除了愤怒。",
          statsDelta: { publicSupport: -5 }
        }
      },
      {
        id: "opt_129_c",
        text: "要求西恩·潘亲自来谈。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_130",
        outcome: {
          narrative: "他真的来了。你们聊了很久。这成了监狱里的谈资。",
          statsDelta: { internationalStance: 5 }
        }
      }
    ]
  },
  // Event 130: The Long Sentence
  {
    id: "evt_130",
    phase: "ENDING",
    narrative: "2030年。你已经适应了这种生活。铁窗，点名，放风。外面的世界在变化，火星移民，人工智能，新的战争。但这里时间是静止的。你是一个活着的化石。",
    newsTicker: "USA: 监狱改革法案未能通过。",
    location: "Cell 1492",
    time: "Jan 2030",
    options: [
      {
        id: "opt_130_a",
        text: "在回忆录中忏悔。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_182",
        outcome: {
          narrative: "你写下了最后一个字。这是你的版本。历史会怎么写，那是历史的事。",
          statsDelta: {}
        }
      }
    ]
  },

  // --- EXTENDED PATH C: THE WARLORD (丛林与游击队细节) ---

  // Event 131: The Malaria
  {
    id: "evt_131",
    phase: "ENDING",
    narrative: "2026年雨季。丛林最大的敌人不是美军，是蚊子。你感染了疟疾。高烧让你产生幻觉。你看到查韦斯在向你招手，看到加拉加斯在燃烧。",
    newsTicker: "HEALTH: 亚马逊地区爆发疟疾疫情。",
    location: "Jungle Hammock",
    time: "Aug 2026",
    options: [
      {
        id: "opt_131_a",
        text: "坚持用草药治疗，拒绝求援。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_132",
        outcome: {
          narrative: "你的意志力惊人，或者只是运气好。你挺过来了，但身体虚弱了很多。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_131_b",
        text: "派人去城镇偷抗生素。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_132",
        outcome: {
          narrative: "药物拿到了，但两个手下被抓了。他们可能供出了营地的位置。",
          statsDelta: { personalSecurity: 10, militaryLoyalty: -5 }
        }
      },
      {
        id: "opt_131_c",
        text: "向无国界医生组织求助。",
        type: "diplomatic",
        risk: "extreme",
        nextEventId: "evt_133",
        outcome: {
          narrative: "医生来了，治好了你。但她回去后被CIA盘问。这是一个巨大的人情债，也是隐患。",
          statsDelta: { personalSecurity: 10, internationalStance: 5 }
        }
      }
    ]
  },

  // Event 132: The Child Soldiers
  {
    id: "evt_132",
    phase: "ENDING",
    narrative: "2027年。兵员枯竭。你的队伍里开始出现越来越多的娃娃兵。看着这些抱着AK-47还没枪高的孩子，你感到一阵恶心，或者是麻木？",
    newsTicker: "HUMAN RIGHTS: 联合国谴责委内瑞拉武装组织招募儿童兵。",
    location: "Training Ground",
    time: "Jan 2027",
    options: [
      {
        id: "opt_132_a",
        text: "为了生存，扩招娃娃兵。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_134",
        outcome: {
          narrative: "他们是最忠诚的杀手，也是最廉价的炮灰。你彻底失去了道德底线。",
          statsDelta: { militaryLoyalty: 10, internationalStance: -20 }
        }
      },
      {
        id: "opt_132_b",
        text: "严禁招募未成年人。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_133",
        outcome: {
          narrative: "兵力不足导致几次战斗失利。但你保留了作为革命者的一丝底色。",
          statsDelta: { militaryLoyalty: -10, publicSupport: 5 }
        }
      },
      {
        id: "opt_132_c",
        text: "建立'青年近卫军'学校。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_134",
        outcome: {
          narrative: "洗脑教育从娃娃抓起。这比直接给枪更可怕，也更有效。",
          statsDelta: { militaryLoyalty: 15 }
        }
      }
    ]
  },

  // Event 133: The Hostage
  {
    id: "evt_133",
    phase: "ENDING",
    narrative: "2027年夏。巡逻队抓到了两个误入丛林的美国游客（或者是伪装的特工？）。这是烫手山芋，也是巨大的筹码。",
    newsTicker: "BREAKING: 两名美国公民在委内瑞拉失踪。",
    location: "Jungle Prison",
    time: "Jun 2027",
    options: [
      {
        id: "opt_133_a",
        text: "公开处决，向美国示威。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_135",
        outcome: {
          narrative: "视频震惊世界。美军发动了报复性轰炸。你损失惨重，但成为了恐怖象征。",
          statsDelta: { internationalStance: -30, militaryLoyalty: 5 }
        }
      },
      {
        id: "opt_133_b",
        text: "索要巨额赎金。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_134",
        outcome: {
          narrative: "谈判进行了很久。最终你拿到了钱，放了人。这是生意，不是战争。",
          statsDelta: { personalSecurity: 15 }
        }
      },
      {
        id: "opt_133_c",
        text: "释放他们，展示善意。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_135",
        outcome: {
          narrative: "美国人被放回去了。这可能缓和了局势，也可能暴露了位置。部下对此很不满。",
          statsDelta: { militaryLoyalty: -10, internationalStance: 10 }
        }
      }
    ]
  },

  // Event 134: The Gold Mine
  {
    id: "evt_134",
    phase: "ENDING",
    narrative: "2028年。毒品生意不好做了。你把目光投向了脚下的土地——非法金矿。这是一个更加血腥、破坏环境但暴利的行业。",
    newsTicker: "ENV: 亚马逊雨林因非法采矿遭受不可逆破坏。",
    location: "Illegal Mine",
    time: "Feb 2028",
    options: [
      {
        id: "opt_134_a",
        text: "大力开发金矿，无视环境。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_135",
        outcome: {
          narrative: "河流变成了水银色。你富有，但你也毁灭了你的藏身之地。",
          statsDelta: { personalSecurity: 20 }
        }
      },
      {
        id: "opt_134_b",
        text: "与土著部落合作开采。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_135",
        outcome: {
          narrative: "分利给土著，换取他们的支持和向导。这是可持续的发展。",
          statsDelta: { publicSupport: 10 }
        }
      },
      {
        id: "opt_134_c",
        text: "抢夺其他帮派的矿场。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_135",
        outcome: {
          narrative: "丛林黑帮火并。你赢了，但树敌更多。",
          statsDelta: { militaryLoyalty: 5, personalSecurity: -10 }
        }
      }
    ]
  },

  // Event 135: The King of Nothing
  {
    id: "evt_135",
    phase: "ENDING",
    narrative: "2030年。你是这片丛林的王。你有军队，有金钱，有女人。但你永远走不出这片绿色的地狱。你统治着一片废墟和一群亡命之徒。",
    newsTicker: "REPORT: 委内瑞拉南部已成法外之地。",
    location: "Jungle Palace",
    time: "Jan 2030",
    options: [
      {
        id: "opt_135_a",
        text: "继续统治，直到死去。",
        type: "aggressive",
        risk: "low",
        nextEventId: "END_WARLORD",
        outcome: {
          narrative: "这就是你的归宿。现代版的《黑暗之心》。库尔兹上校，就是你。",
          statsDelta: {}
        }
      }
    ]
  },

  // --- EXTENDED PATH D: THE MARTYR (图腾线细节，多为回忆与回响) ---

  // Event 136: The Anniversary
  {
    id: "evt_136",
    phase: "ENDING",
    narrative: "2027年1月。你去世一周年。加拉加斯爆发了大规模游行。虽然政府禁止，但人们还是走上街头，举着你的照片。警察发射了催泪瓦斯。",
    newsTicker: "UNREST: 加拉加斯爆发纪念前总统的骚乱。",
    location: "Bolivar Square",
    time: "Jan 10, 2027",
    options: [
      {
        id: "opt_136_a",
        text: "（作为精神）看着这一切。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_137",
        outcome: {
          narrative: "你的死比你的生更有力量。鲜血浇灌了反抗的花朵。",
          statsDelta: { publicSupport: 20 }
        }
      }
    ]
  },

  // Event 137: The Book
  {
    id: "evt_137",
    phase: "ENDING",
    narrative: "2028年。一本名为《未竟的革命》的书在地下流传。作者匿名，据说汇编了你生前的演讲和思想。这成了反抗军的圣经。",
    newsTicker: "CULTURE: 禁书《未竟的革命》在拉美青年中流行。",
    location: "University Campus",
    time: "May 2028",
    options: [
      {
        id: "opt_137_a",
        text: "思想的火种。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_138",
        outcome: {
          narrative: "思想是杀不死的。你已经不仅仅是一个人，你是一种主义。",
          statsDelta: { publicSupport: 30 }
        }
      }
    ]
  },

  // Event 138: The Song
  {
    id: "evt_138",
    phase: "ENDING",
    narrative: "2029年。一首民谣在安第斯山区流行起来。歌词讲述了一个为了人民对抗巨人的英雄故事。虽然没提名字，但每个人都知道唱的是谁。",
    newsTicker: "MUSIC: 抗议歌曲登上拉美排行榜。",
    location: "Radio Station",
    time: "Sep 2029",
    options: [
      {
        id: "opt_138_a",
        text: "民谣的传说。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_139",
        outcome: {
          narrative: "艺术让传说永恒。你变成了罗宾汉，变成了切·格瓦拉。",
          statsDelta: { publicSupport: 20 }
        }
      }
    ]
  },

  // Event 139: The Statue
  {
    id: "evt_139",
    phase: "ENDING",
    narrative: "2035年。政权更迭。新政府为了安抚民意，默许在你的家乡为你立了一座铜像。铜像上的你指着北方，目光坚定。",
    newsTicker: "POLITICS: 委内瑞拉政治和解进程迈出新一步。",
    location: "Home Town Square",
    time: "Jan 2035",
    options: [
      {
        id: "opt_139_a",
        text: "铜像的注视。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_140",
        outcome: {
          narrative: "你最终还是回到了这片土地。以一种沉默而永恒的方式。",
          statsDelta: { publicSupport: 50 }
        }
      }
    ]
  },

  // Event 140: The Eternal Flame
  {
    id: "evt_140",
    phase: "ENDING",
    narrative: "2050年。历史书上关于你的评价依然两极分化。暴君？英雄？也许两者都是。但没有人能绕过你的名字。你是那个时代的烙印。",
    newsTicker: "HISTORY: 21世纪拉美政治人物回顾。",
    location: "Museum",
    time: "Jan 2050",
    options: [
      {
        id: "opt_140_a",
        text: "进入分支：历史的尘埃 (THE MARTYR)。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "END_GAME",
        outcome: {
          narrative: "故事结束了。也是新的开始。只要有人反抗压迫，你就活着。",
          statsDelta: {}
        }
      }
    ]
  },

  // =========================================================================
  // BATCH 8: SIDE QUESTS & OPPORTUNITIES (Events 141-160)
  // =========================================================================
  // These events can be triggered during the main escape phases.

  // Event 141: The Lost Gold
  {
    id: "evt_141",
    phase: "SIDE_QUEST",
    narrative: "传闻在玻利瓦尔城的一个废弃防空洞里，藏着一批未登记的黄金储备。那是查韦斯时代留下的应急资金。你现在的路线正好经过附近。",
    newsTicker: "RUMOR: 寻宝猎人涌向委内瑞拉南部。",
    location: "Abandoned Bunker",
    time: "Anytime",
    options: [
      {
        id: "opt_141_a",
        text: "冒险去取黄金。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_142",
        outcome: {
          narrative: "你找到了黄金，但也触发了警报。你不得不背着沉重的金条逃跑，这拖慢了你的速度。",
          statsDelta: { personalSecurity: -10, internationalStance: 20 }
        }
      },
      {
        id: "opt_141_b",
        text: "放弃黄金，安全第一。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_142",
        outcome: {
          narrative: "贪婪是陷阱。你选择继续赶路。后来听说去那里的人都被美军无人机炸死了。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_141_c",
        text: "派亲信去取，自己等待。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_142",
        outcome: {
          narrative: "亲信回来了，带回了一半黄金。另一半呢？他说丢了。你看着他的眼睛，知道他在撒谎。",
          statsDelta: { internationalStance: 10, militaryLoyalty: -10 }
        }
      }
    ]
  },

  // Event 142: The Hacker Collective
  {
    id: "evt_142",
    phase: "SIDE_QUEST",
    narrative: "一个自称'玻利瓦尔之眼'的黑客组织联系了你。他们声称可以瘫痪加拉加斯部分地区的监控系统2小时，助你通过。但他们要价不菲。",
    newsTicker: "CYBER: 委内瑞拉国家电网遭受网络攻击。",
    location: "Encrypted Terminal",
    time: "Anytime",
    options: [
      {
        id: "opt_142_a",
        text: "支付比特币雇佣他们。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_143",
        outcome: {
          narrative: "监控真的黑了。你像幽灵一样穿过了封锁线。金钱万岁。",
          statsDelta: { personalSecurity: 20, internationalStance: -10 }
        }
      },
      {
        id: "opt_142_b",
        text: "拒绝交易，担心是钓鱼。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_143",
        outcome: {
          narrative: "你靠自己潜行。虽然慢，但安全。后来证实那个黑客组织确实被CIA渗透了。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_142_c",
        text: "威胁他们：'帮我，否则杀全家'。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_143",
        outcome: {
          narrative: "黑客们屈服了，但也报复了你。他们在你的逃亡路线上留下了数字痕迹。",
          statsDelta: { personalSecurity: -15 }
        }
      }
    ]
  },

  // Event 143: The Old Friend
  {
    id: "evt_143",
    phase: "SIDE_QUEST",
    narrative: "你路过一个农场。农场主是你当年的工会战友，曾一起罢工抗议。他现在已经退休。他认出了你。",
    newsTicker: "SOCIETY: 农村地区民众对前总统态度复杂。",
    location: "Rural Farm",
    time: "Anytime",
    options: [
      {
        id: "opt_143_a",
        text: "请求留宿和补给。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_144",
        outcome: {
          narrative: "他犹豫了一下，还是让你进来了。'为了当年的情义，但明天一早你必须走。'",
          statsDelta: { personalSecurity: 10, publicSupport: 5 }
        }
      },
      {
        id: "opt_143_b",
        text: "杀人灭口，抢夺物资。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_144",
        outcome: {
          narrative: "你变了。为了生存，你杀了老友。你得到了一辆皮卡和食物，但也失去了一部分灵魂。",
          statsDelta: { personalSecurity: 15, publicSupport: -20 }
        }
      },
      {
        id: "opt_143_c",
        text: "只讨口水喝，立刻离开。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_144",
        outcome: {
          narrative: "你不愿连累他。他塞给你一袋玉米饼，眼含热泪。'保重，尼古拉斯。'",
          statsDelta: { publicSupport: 10 }
        }
      }
    ]
  },

  // Event 144: The Arms Dealer
  {
    id: "evt_144",
    phase: "SIDE_QUEST",
    narrative: "在一个边境小镇，你遇到了一个俄罗斯军火贩子。他手里有一批原本要卖给哥伦比亚游击队的单兵防空导弹。如果你有这些，就不怕无人机了。",
    newsTicker: "SECURITY: 黑市上出现大量流散的便携式防空导弹。",
    location: "Border Tavern",
    time: "Anytime",
    options: [
      {
        id: "opt_144_a",
        text: "用最后的珠宝交换导弹。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_145",
        outcome: {
          narrative: "有了毒刺导弹，你的腰杆硬了。你也顺便打下了一架追踪的侦察机。",
          statsDelta: { personalSecurity: 20, internationalStance: -10 }
        }
      },
      {
        id: "opt_144_b",
        text: "试图黑吃黑。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_145",
        outcome: {
          narrative: "俄罗斯人的保镖不是吃素的。一番枪战后，你不得不狼狈逃窜，还挂了彩。",
          statsDelta: { personalSecurity: -20 }
        }
      },
      {
        id: "opt_144_c",
        text: "拒绝交易，'这太招摇了'。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_145",
        outcome: {
          narrative: "你选择了低调。导弹虽然好，但背着它就像背着个靶子。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 145: The Journalist
  {
    id: "evt_145",
    phase: "SIDE_QUEST",
    narrative: "你发现一个西方女记者正在跟踪你的队伍。她想拿到独家新闻。杀了她？还是利用她？",
    newsTicker: "MEDIA: 战地记者在委内瑞拉失联。",
    location: "Jungle Camp",
    time: "Anytime",
    options: [
      {
        id: "opt_145_a",
        text: "扣押她为人质。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_146",
        outcome: {
          narrative: "她成了你的护身符。美军不敢随意轰炸。但这激怒了国际舆论。",
          statsDelta: { personalSecurity: 10, internationalStance: -20 }
        }
      },
      {
        id: "opt_145_b",
        text: "接受采访，向世界喊话。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_146",
        outcome: {
          narrative: "报道发出了。有人同情你，有人嘲笑你。但这至少证明你还活着，还在战斗。",
          statsDelta: { publicSupport: 10, personalSecurity: -5 }
        }
      },
      {
        id: "opt_145_c",
        text: "没收器材，驱逐她。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_146",
        outcome: {
          narrative: "你放了她，但毁了她的相机。她回去后写了一篇关于你'人性尚存'的文章。",
          statsDelta: { internationalStance: 5 }
        }
      }
    ]
  },

  // Event 146: The Traitor's Cache
  {
    id: "evt_146",
    phase: "SIDE_QUEST",
    narrative: "你在审问一名俘虏时得知，前国防部长在逃跑前埋藏了一批机密文件，里面有关于美军行动计划的详细情报（他是内鬼）。找到它可能扭转局势。",
    newsTicker: "INTEL: 委内瑞拉军方高层叛逃细节曝光。",
    location: "Secret Coordinates",
    time: "Anytime",
    options: [
      {
        id: "opt_146_a",
        text: "偏离路线去寻找文件。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_147",
        outcome: {
          narrative: "你找到了！文件显示美军将在三天后封锁边境。这个情报救了你的命。",
          statsDelta: { personalSecurity: 20 }
        }
      },
      {
        id: "opt_146_b",
        text: "认为是陷阱，不予理会。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_147",
        outcome: {
          narrative: "你继续赶路。后来得知那里确实埋了地雷。有时候多疑是种美德。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_146_c",
        text: "把坐标卖给俄罗斯人。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_147",
        outcome: {
          narrative: "俄罗斯人去取了文件，并给了你一笔情报费。借刀杀人，顺便赚钱。",
          statsDelta: { internationalStance: 10 }
        }
      }
    ]
  },

  // Event 147: The Disease
  {
    id: "evt_147",
    phase: "SIDE_QUEST",
    narrative: "你的队伍里爆发了登革热。几个重要保镖倒下了。缺医少药，士气低落。",
    newsTicker: "HEALTH: 热带疾病困扰交战双方。",
    location: "Makeshift Camp",
    time: "Anytime",
    options: [
      {
        id: "opt_147_a",
        text: "抛弃病号，轻装前进。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_148",
        outcome: {
          narrative: "冷酷的决定。队伍速度快了，但每个人都心寒。下次生病的可能是他们。",
          statsDelta: { militaryLoyalty: -20, personalSecurity: 5 }
        }
      },
      {
        id: "opt_147_b",
        text: "停下来休整，寻找草药。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_148",
        outcome: {
          narrative: "耽误了两天行程。美军追兵更近了。但你赢得了部下的死忠。",
          statsDelta: { militaryLoyalty: 20, personalSecurity: -10 }
        }
      },
      {
        id: "opt_147_c",
        text: "抢劫附近的诊所。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_148",
        outcome: {
          narrative: "你们抢到了药。但也杀死了唯一的医生。当地人现在恨透了你们。",
          statsDelta: { publicSupport: -20, personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 148: The Dog
  {
    id: "evt_148",
    phase: "SIDE_QUEST",
    narrative: "一只流浪狗开始跟着你的队伍。它看起来很饿，但很警觉。它能察觉到远处的动静。",
    newsTicker: "STORY: 战区里的动物故事。",
    location: "Roadside",
    time: "Anytime",
    options: [
      {
        id: "opt_148_a",
        text: "收养它，分它食物。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_149",
        outcome: {
          narrative: "它成了最好的哨兵。在一次夜袭中，它的叫声救了所有人。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_148_b",
        text: "赶走它，怕它叫声暴露。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_149",
        outcome: {
          narrative: "它走了。几天后你看到它的尸体在路边。心里有一丝愧疚。",
          statsDelta: {}
        }
      },
      {
        id: "opt_148_c",
        text: "把它变成食物。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_149",
        outcome: {
          narrative: "在极度饥饿面前，人性是奢侈品。大家都吃饱了，但没人说话。",
          statsDelta: { personalSecurity: 5, publicSupport: -10 }
        }
      }
    ]
  },

  // Event 149: The Crypto Wallet
  {
    id: "evt_149",
    phase: "SIDE_QUEST",
    narrative: "你的财务顾问在死前给了你一个U盘，说是包含了国家石油币（Petro）的私钥。如果能解开，价值连城。",
    newsTicker: "ECONOMY: 委内瑞拉石油币暴跌后归零。",
    location: "Safehouse",
    time: "Anytime",
    options: [
      {
        id: "opt_149_a",
        text: "尝试找专家解密。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_150",
        outcome: {
          narrative: "解开了！里面虽然不是石油币，是很多比特币。这是意外之财。",
          statsDelta: { internationalStance: 20 }
        }
      },
      {
        id: "opt_149_b",
        text: "扔掉它，那就是个骗局。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_150",
        outcome: {
          narrative: "你把它扔进了河里。后来新闻报道那个U盘里有CIA植入的定位木马。你真走运。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_149_c",
        text: "一直带在身上备用。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_150",
        outcome: {
          narrative: "它成了个护身符。也许有一天它能买下你的自由，也许永远不能。",
          statsDelta: {}
        }
      }
    ]
  },

  // Event 150: The Double Body
  {
    id: "evt_150",
    phase: "SIDE_QUEST",
    narrative: "你的情报官找来了一个和你长得极像的人。替身。在关键时刻，他可以替你去死，或者引开追兵。",
    newsTicker: "INTEL: 关于马杜罗替身的传闻从未停止。",
    location: "Secret Bunker",
    time: "Anytime",
    options: [
      {
        id: "opt_150_a",
        text: "启用替身，让他穿上你的衣服向南走。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_151",
        outcome: {
          narrative: "替身吸引了所有火力，被导弹炸碎了。新闻报道'马杜罗已死'。你获得了宝贵的隐身时间。",
          statsDelta: { personalSecurity: 50, publicSupport: -10 }
        }
      },
      {
        id: "opt_150_b",
        text: "不忍心牺牲无辜，拒绝使用。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_151",
        outcome: {
          narrative: "你给了他一笔钱让他回家。他后来在审判中为你作证，说你还有人性。",
          statsDelta: { publicSupport: 10 }
        }
      },
      {
        id: "opt_150_c",
        text: "把他留在身边混淆视听。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_151",
        outcome: {
          narrative: "两个马杜罗让刺客很困惑。一次狙击中，他确实替你挡了子弹。",
          statsDelta: { personalSecurity: 20 }
        }
      }
    ]
  },

  // Event 151: The Ancient Ruins
  {
    id: "evt_151",
    phase: "SIDE_QUEST",
    narrative: "在丛林深处，你们发现了一处未被标记的古代遗迹。这里地形复杂，易守难攻，而且似乎有神秘的信号屏蔽磁场。",
    newsTicker: "SCIENCE: 亚马逊深处发现未知磁场异常。",
    location: "Jungle Ruins",
    time: "Anytime",
    options: [
      {
        id: "opt_151_a",
        text: "以此为基地休整。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_152",
        outcome: {
          narrative: "美军的无人机在这里失去了信号。你们获得了难得的安宁。古人的智慧救了你。",
          statsDelta: { personalSecurity: 20 }
        }
      },
      {
        id: "opt_151_b",
        text: "搜寻文物倒卖。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_152",
        outcome: {
          narrative: "你们挖出了一些金器。但这似乎触怒了某种东西。那天晚上，三个士兵离奇失踪。",
          statsDelta: { internationalStance: 10, militaryLoyalty: -10 }
        }
      },
      {
        id: "opt_151_c",
        text: "立刻离开，敬畏鬼神。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_152",
        outcome: {
          narrative: "你们绕过了遗迹。虽然累，但心里踏实。",
          statsDelta: {}
        }
      }
    ]
  },

  // Event 152: The Satphone
  {
    id: "evt_152",
    phase: "SIDE_QUEST",
    narrative: "通讯官修好了一部旧的卫星电话。只有一格信号，电池只能维持5分钟。这可能是最后一次联系外界的机会。",
    newsTicker: "TECH: 冲突地区通讯依然中断。",
    location: "Mountain Peak",
    time: "Anytime",
    options: [
      {
        id: "opt_152_a",
        text: "打给普京/习近平求援。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_153",
        outcome: {
          narrative: "电话接通了，但只有忙音。或者只是秘书的敷衍。大国不会为了一个弃子冒险。",
          statsDelta: { internationalStance: -5 }
        }
      },
      {
        id: "opt_152_b",
        text: "打给家人报平安。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_153",
        outcome: {
          narrative: "听到妻子的声音让你泪流满面。但这通电话被NSA定位了。快跑！",
          statsDelta: { personalSecurity: -20, publicSupport: 5 }
        }
      },
      {
        id: "opt_152_c",
        text: "打给CNN爆料。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_153",
        outcome: {
          narrative: "你向世界直播了自己的位置和宣言。极其大胆，也极其危险。",
          statsDelta: { internationalStance: 10, personalSecurity: -30 }
        }
      }
    ]
  },

  // Event 153: The Mercy
  {
    id: "evt_153",
    phase: "SIDE_QUEST",
    narrative: "你抓到了一个落单的美国大兵。他受了伤，只有19岁，看着你的眼神充满了恐惧。杀了他是政治正确，放了他是人性光辉。",
    newsTicker: "WAR: 美军一名士兵在行动中失踪。",
    location: "Jungle Trail",
    time: "Anytime",
    options: [
      {
        id: "opt_153_a",
        text: "处决他，录制视频。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_154",
        outcome: {
          narrative: "残忍。这激怒了整个美国。三角洲部队发誓要剥了你的皮。",
          statsDelta: { internationalStance: -50, militaryLoyalty: 10 }
        }
      },
      {
        id: "opt_153_b",
        text: "给他包扎，放他走。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_154",
        outcome: {
          narrative: "他一瘸一拐地走了。后来他没有供出你们的藏身处。甚至在书里写你是'绅士'。",
          statsDelta: { publicSupport: 10, personalSecurity: 5 }
        }
      },
      {
        id: "opt_153_c",
        text: "让他加入你们（斯德哥尔摩综合征）。",
        type: "desperate",
        risk: "extreme",
        nextEventId: "evt_154",
        outcome: {
          narrative: "这太疯狂了，但他居然同意了。一个美国大兵成了马杜罗的保镖。魔幻现实主义。",
          statsDelta: { militaryLoyalty: -5, publicSupport: 5 }
        }
      }
    ]
  },

  // Event 154: The Drug Sub
  {
    id: "evt_154",
    phase: "SIDE_QUEST",
    narrative: "在海岸线，你发现了一艘搁浅的半潜式毒品走私船（Narco-sub）。它还能修好，空间虽然狭窄，但能避开雷达。",
    newsTicker: "CRIME: 新型毒品潜艇技术令海岸警卫队头疼。",
    location: "Hidden Cove",
    time: "Anytime",
    options: [
      {
        id: "opt_154_a",
        text: "修好它，尝试潜航出境。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_155",
        outcome: {
          narrative: "幽闭恐惧症的地狱。但它真的让你穿过了封锁线，直达古巴海域。",
          statsDelta: { personalSecurity: 40 }
        }
      },
      {
        id: "opt_154_b",
        text: "拆卸零件，修补通讯设备。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_155",
        outcome: {
          narrative: "废物利用。你修好了发电机，至少今晚有电了。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_154_c",
        text: "把它装满炸药，做成漂雷。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_155",
        outcome: {
          narrative: "它炸伤了一艘靠近的巡逻艇。巨大的烟花。这给你争取了逃跑时间。",
          statsDelta: { personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 155: The Birthday
  {
    id: "evt_155",
    phase: "SIDE_QUEST",
    narrative: "今天是你或者你妻子的生日。在逃亡路上，大家几乎忘了。只有一块干面包和一根蜡烛。",
    newsTicker: "LIFESTYLE: 总统家人的奢华生活已成往事。",
    location: "Safehouse",
    time: "Anytime",
    options: [
      {
        id: "opt_155_a",
        text: "举行简短的庆祝仪式。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_156",
        outcome: {
          narrative: "大家唱起了生日歌。在那一刻，你们不是亡命徒，是一家人。士气大振。",
          statsDelta: { militaryLoyalty: 10 }
        }
      },
      {
        id: "opt_155_b",
        text: "严禁任何声音，保持静默。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_156",
        outcome: {
          narrative: "理智的选择。但妻子眼里的光熄灭了。生存压倒了生活。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_155_c",
        text: "回忆往昔的盛大派对。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_156",
        outcome: {
          narrative: "回忆让现实更痛苦。有人开始哭泣。士气低落。",
          statsDelta: { militaryLoyalty: -5 }
        }
      }
    ]
  },

  // Event 156: The Storm
  {
    id: "evt_156",
    phase: "SIDE_QUEST",
    narrative: "一场巨大的热带风暴来袭。暴雨如注，洪水泛滥。美军的飞机停飞了，但你的路也断了。",
    newsTicker: "WEATHER: 加勒比海遭遇强飓风袭击。",
    location: "Open Field",
    time: "Anytime",
    options: [
      {
        id: "opt_156_a",
        text: "冒雨强行军，利用天气掩护。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_157",
        outcome: {
          narrative: "这是一场赌博。两个人被洪水冲走了。但你们奇迹般地穿过了原本把守严密的关卡。",
          statsDelta: { personalSecurity: 20, militaryLoyalty: -10 }
        }
      },
      {
        id: "opt_156_b",
        text: "寻找山洞避雨，等待天晴。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_157",
        outcome: {
          narrative: "你们躲过了风暴，也躲过了机会。天晴后，无人机又回来了。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_156_c",
        text: "利用洪水制作木筏漂流。",
        type: "stealth",
        risk: "medium",
        nextEventId: "evt_157",
        outcome: {
          narrative: "顺流而下，一日千里。虽然惊险，但速度极快。",
          statsDelta: { personalSecurity: 15 }
        }
      }
    ]
  },

  // Event 157: The Miracle
  {
    id: "evt_157",
    phase: "SIDE_QUEST",
    narrative: "在一座小教堂里，神父认出了你。他没有报警，而是让你在忏悔室躲藏。他说这是上帝的旨意。",
    newsTicker: "RELIGION: 教会呼吁各方保持克制。",
    location: "Village Church",
    time: "Anytime",
    options: [
      {
        id: "opt_157_a",
        text: "真诚忏悔自己的罪行。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_158",
        outcome: {
          narrative: "你哭了。神父给了你祝福和食物。心灵的救赎有时候比防弹衣更重要。",
          statsDelta: { publicSupport: 5 }
        }
      },
      {
        id: "opt_157_b",
        text: "利用教堂作为联络点。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_158",
        outcome: {
          narrative: "这是亵渎。但很有效。你成功发出了信号。神父如果知道会气死的。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_157_c",
        text: "怀疑神父是间谍，绑架他。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_158",
        outcome: {
          narrative: "你疯了。村民们拿着锄头包围了你们。你不得不开枪突围。",
          statsDelta: { publicSupport: -30, personalSecurity: -10 }
        }
      }
    ]
  },

  // Event 158: The Old Poster
  {
    id: "evt_158",
    phase: "SIDE_QUEST",
    narrative: "在一面残墙上，你看到一张自己十年前竞选总统的海报。那时的你意气风发，承诺给人民带来幸福。现在海报破败不堪，上面满是弹孔。",
    newsTicker: "HISTORY: 委内瑞拉十年变迁。",
    location: "Ruins",
    time: "Anytime",
    options: [
      {
        id: "opt_158_a",
        text: "撕下海报，带在身边。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_159",
        outcome: {
          narrative: "勿忘初心。或者是勿忘耻辱。这成了你的动力。",
          statsDelta: { militaryLoyalty: 5 }
        }
      },
      {
        id: "opt_158_b",
        text: "在海报上写下新的誓言。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_159",
        outcome: {
          narrative: "有人拍下了这张海报传到网上。'他还活着，还没认输'。",
          statsDelta: { publicSupport: 10 }
        }
      },
      {
        id: "opt_158_c",
        text: "无视它，匆匆离开。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_159",
        outcome: {
          narrative: "过去已死。重要的是现在。你不想被回忆绊住脚。",
          statsDelta: {}
        }
      }
    ]
  },

  // Event 159: The Black Market
  {
    id: "evt_159",
    phase: "SIDE_QUEST",
    narrative: "你需要抗生素、电池和假护照。唯一的渠道是边境的黑市。那里鱼龙混杂，CIA密探、毒贩、难民混在一起。",
    newsTicker: "ECONOMY: 边境黑市贸易繁荣。",
    location: "Border Town",
    time: "Anytime",
    options: [
      {
        id: "opt_159_a",
        text: "乔装打扮亲自去交易。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_160",
        outcome: {
          narrative: "你戴着假发和眼镜。心跳到了嗓子眼。交易成功了，没人认出那个胖子是总统。",
          statsDelta: { personalSecurity: 10 }
        }
      },
      {
        id: "opt_159_b",
        text: "派手下去，远程指挥。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_160",
        outcome: {
          narrative: "手下被黑吃黑了。东西没买到，钱也没了。这就是黑市。",
          statsDelta: { internationalStance: -5 }
        }
      },
      {
        id: "opt_159_c",
        text: "抢劫黑市商人。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_160",
        outcome: {
          narrative: "你得到了一切物资。但也引来了黑帮的追杀。现在全世界都在追杀你。",
          statsDelta: { personalSecurity: -15, internationalStance: 10 }
        }
      }
    ]
  },

  // Event 160: The Crossroads (Again)
  {
    id: "evt_160",
    phase: "SIDE_QUEST",
    narrative: "支线任务结束。你站在一个新的路口。所有的机遇和风险都已过去，前方是最后的主线。你准备好了吗？",
    newsTicker: "STATUS: 目标人物动向不明。",
    location: "Checkpoint",
    time: "Anytime",
    options: [
      {
        id: "opt_160_a",
        text: "回归主线，继续逃亡。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_161",
        outcome: {
          narrative: "带着新的伤疤和战利品，你继续前行。",
          statsDelta: {}
        }
      }
    ]
  },

  // =========================================================================
  // BATCH 9: CHARACTER DEVELOPMENT & BONDS (Events 161-180)
  // =========================================================================
  // Focusing on relationships, loyalty, and betrayal.

  // Event 161: Cilia's Doubt
  {
    id: "evt_161",
    phase: "CHARACTER",
    narrative: "深夜的藏身处。你的妻子，'第一战士'西利亚·弗洛雷斯，看起来异常憔悴。她一直是你最坚定的支持者，但今晚她崩溃了。'尼古拉斯，我们真的能活着出去吗？为了孩子，也许我们应该投降。'",
    newsTicker: "RUMOR: 第一夫人健康状况堪忧。",
    location: "Safehouse Bedroom",
    time: "Anytime",
    options: [
      {
        id: "opt_161_a",
        text: "严厉斥责她的软弱。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_162",
        outcome: {
          narrative: "你用革命的大道理压倒了她。她不再说话，但眼神里充满了恐惧和疏离。你赢了辩论，输了爱人。",
          statsDelta: { militaryLoyalty: 5, personalSecurity: -5 }
        }
      },
      {
        id: "opt_161_b",
        text: "温柔地安慰，承诺带她去俄罗斯。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_162",
        outcome: {
          narrative: "你抱住她，画了一个美好的大饼。这给了她暂时的希望。在这个时刻，谎言是必要的。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_161_c",
        text: "安排她单独撤离。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_163",
        outcome: {
          narrative: "这很危险，但也许是唯一的活路。她拒绝离开你，但你看到了她眼中的感动。",
          statsDelta: { personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 162: Delcy's Advice
  {
    id: "evt_162",
    phase: "CHARACTER",
    narrative: "德尔西·罗德里格斯，你的副总统，也是最聪明的谋士。她拿着卫星电话走过来，面色凝重。'总统，有人提议用您的人头换取对其余人的特赦。我想听听您的看法。'",
    newsTicker: "INTEL: 政府高层就是否投降产生分歧。",
    location: "Command Post",
    time: "Anytime",
    options: [
      {
        id: "opt_162_a",
        text: "怀疑她在试探，拔枪相向。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_164",
        outcome: {
          narrative: "气氛凝固了。她冷静地看着你的枪口。'如果您不再信任我，就开枪吧。' 你犹豫了，放下了枪。信任出现了裂痕。",
          statsDelta: { militaryLoyalty: -10 }
        }
      },
      {
        id: "opt_162_b",
        text: "坦诚相待，讨论可能性。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_163",
        outcome: {
          narrative: "你们像老朋友一样分析局势。她实际上已经拒绝了那个提议，只是想确认你的决心。",
          statsDelta: { militaryLoyalty: 10 }
        }
      },
      {
        id: "opt_162_c",
        text: "命令她去处决提议者。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_164",
        outcome: {
          narrative: "她照做了。那个提议投降的军官消失了。她证明了忠诚，用鲜血。",
          statsDelta: { militaryLoyalty: 15, internationalStance: -5 }
        }
      }
    ]
  },

  // Event 163: The Bodyguard
  {
    id: "evt_163",
    phase: "CHARACTER",
    narrative: "你的贴身保镖何塞。他跟了你十年，挡过两次子弹。在一次休息时，你发现他在偷偷看一张照片——那是他在美国的女儿。",
    newsTicker: "STORY: 每一个士兵背后都有一个家庭。",
    location: "Jungle Camp",
    time: "Anytime",
    options: [
      {
        id: "opt_163_a",
        text: "装作没看见。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_165",
        outcome: {
          narrative: "有些事不需要说破。每个人都有软肋。",
          statsDelta: {}
        }
      },
      {
        id: "opt_163_b",
        text: "质问他是否会被收买。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_164",
        outcome: {
          narrative: "他惊恐地跪下发誓效忠。但这伤害了他的自尊。一颗怀疑的种子种下了。",
          statsDelta: { personalSecurity: -5 }
        }
      },
      {
        id: "opt_163_c",
        text: "承诺事成之后送他去团聚。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_165",
        outcome: {
          narrative: "他感激涕零。现在他有了为你挡第三次子弹的理由。",
          statsDelta: { personalSecurity: 15 }
        }
      }
    ]
  },

  // Event 164: The General's Call
  {
    id: "evt_164",
    phase: "CHARACTER",
    narrative: "帕德里诺·洛佩斯将军，国防部长。他一直在两边下注。现在他打来电话：'总统，我不确定我还能控制住下面的部队多久。美军给的价码太高了。'",
    newsTicker: "MILITARY: 军队内部哗变风险增加。",
    location: "Satphone Call",
    time: "Anytime",
    options: [
      {
        id: "opt_164_a",
        text: "痛骂他是叛徒。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_166",
        outcome: {
          narrative: "电话挂断了。十分钟后，他的部队撤离了防线。你的侧翼暴露了。",
          statsDelta: { militaryLoyalty: -30 }
        }
      },
      {
        id: "opt_164_b",
        text: "许诺给他未来的国防部终身职位。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_165",
        outcome: {
          narrative: "利益交换。暂时稳住了他。但他随时可能反咬一口。",
          statsDelta: { militaryLoyalty: 5 }
        }
      },
      {
        id: "opt_164_c",
        text: "暗示你也掌握着他腐败的证据。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_166",
        outcome: {
          narrative: "这是讹诈。他沉默了。'好吧，我再坚持24小时。' 恐惧有时比利益更有效。",
          statsDelta: { militaryLoyalty: 10 }
        }
      }
    ]
  },

  // Event 165: The Son
  {
    id: "evt_165",
    phase: "CHARACTER",
    narrative: "尼古拉斯托（你的儿子）。他在社交媒体上发布了一张在迪拜开豪车的旧照片，配文'想念过去'。这立刻引起了公愤，也暴露了你们可能的资金流向。",
    newsTicker: "SCANDAL: 总统之子炫富引发网络声讨。",
    location: "Internet",
    time: "Anytime",
    options: [
      {
        id: "opt_165_a",
        text: "公开断绝父子关系。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_167",
        outcome: {
          narrative: "大义灭亲。民众为你鼓掌，但你的心在滴血。",
          statsDelta: { publicSupport: 20 }
        }
      },
      {
        id: "opt_165_b",
        text: "私下勒令他删除并闭嘴。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_166",
        outcome: {
          narrative: "照片删了，但截图已经满天飞。这是一个公关灾难。",
          statsDelta: { publicSupport: -10 }
        }
      },
      {
        id: "opt_165_c",
        text: "无视，'这是敌人的P图'。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_166",
        outcome: {
          narrative: "死鸭子嘴硬。只有死忠粉才会信。你的信誉再次受损。",
          statsDelta: { publicSupport: -5 }
        }
      }
    ]
  },

  // Event 166: The Cuban Doctor
  {
    id: "evt_166",
    phase: "CHARACTER",
    narrative: "随队的古巴医生玛丽亚。她负责照顾你的健康，也负责向哈瓦那汇报。你发现她在记录你的每一次情绪波动。",
    newsTicker: "INTEL: 古巴情报网深入委内瑞拉高层。",
    location: "Medical Tent",
    time: "Anytime",
    options: [
      {
        id: "opt_166_a",
        text: "收买她，让她只报喜不报忧。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_168",
        outcome: {
          narrative: "她接受了你的金表。哈瓦那收到的报告是'总统精神状态极佳'。这有助于保持古巴的支持。",
          statsDelta: { internationalStance: 5 }
        }
      },
      {
        id: "opt_166_b",
        text: "赶走她，不再信任古巴人。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_167",
        outcome: {
          narrative: "这是与古巴决裂的信号。你失去了医疗保障，也失去了最后的一条退路。",
          statsDelta: { internationalStance: -20, personalSecurity: -10 }
        }
      },
      {
        id: "opt_166_c",
        text: "假装不知情，演戏给她看。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_168",
        outcome: {
          narrative: "人生如戏。你每天在她面前表演坚定。哈瓦那对你更有信心了。",
          statsDelta: { internationalStance: 10 }
        }
      }
    ]
  },

  // Event 167: The Mystic
  {
    id: "evt_167",
    phase: "CHARACTER",
    narrative: "你一直迷信。你的私人灵媒从印度赶来，声称看到了'星象的剧变'。他说你需要进行一次献祭仪式来扭转国运。",
    newsTicker: "CULTURE: 总统府内的神秘主义色彩。",
    location: "Secret Altar",
    time: "Anytime",
    options: [
      {
        id: "opt_167_a",
        text: "进行仪式，寻求心理安慰。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_169",
        outcome: {
          narrative: "烟雾缭绕。你感觉好多了。虽然战局没变，但你的心态稳了。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_167_b",
        text: "斥责迷信，将其赶走。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_168",
        outcome: {
          narrative: "你突然变得唯物主义了。灵媒诅咒着离开了。部下觉得你终于清醒了。",
          statsDelta: { militaryLoyalty: 5 }
        }
      },
      {
        id: "opt_167_c",
        text: "询问关于未来的具体预言。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_169",
        outcome: {
          narrative: "他说你会'死于水，生于火'。这让你在过河时格外紧张。",
          statsDelta: { personalSecurity: -5 }
        }
      }
    ]
  },

  // Event 168: The Chef
  {
    id: "evt_168",
    phase: "CHARACTER",
    narrative: "你的私人大厨还在跟随你。在这个只能吃罐头的时候，他居然用野菜和死蛇做出了国宴的味道。这是一种荒诞的坚持。",
    newsTicker: "LIFESTYLE: 战火中的美食。",
    location: "Campfire",
    time: "Anytime",
    options: [
      {
        id: "opt_168_a",
        text: "赞赏他的手艺，分给士兵吃。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_170",
        outcome: {
          narrative: "一顿热饭收买了人心。大家都说你是'仁慈的父亲'。",
          statsDelta: { militaryLoyalty: 10, publicSupport: 5 }
        }
      },
      {
        id: "opt_168_b",
        text: "独享美食，保持尊卑。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_169",
        outcome: {
          narrative: "士兵们看着你吃。眼神里有了恨意。这是在自掘坟墓。",
          statsDelta: { militaryLoyalty: -10 }
        }
      },
      {
        id: "opt_168_c",
        text: "让他教大家野外生存烹饪。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_170",
        outcome: {
          narrative: "非常实用的技能。部队的生存率提高了。",
          statsDelta: { personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 169: The Ghost of Chavez
  {
    id: "evt_169",
    phase: "CHARACTER",
    narrative: "梦境。或者是高烧时的幻觉。乌戈·查韦斯站在你面前。他穿着标志性的红衬衫。'尼古拉斯，你把我的国家弄成什么样了？'",
    newsTicker: "HISTORY: 查韦斯遗产的阴影。",
    location: "Dream",
    time: "Anytime",
    options: [
      {
        id: "opt_169_a",
        text: "辩解：'我是被逼的，全是美国的错'。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_171",
        outcome: {
          narrative: "查韦斯摇头叹息。你连在梦里都不敢承担责任。",
          statsDelta: { publicSupport: -5 }
        }
      },
      {
        id: "opt_169_b",
        text: "忏悔：'我尽力了，但我失败了'。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_170",
        outcome: {
          narrative: "他拍了拍你的肩膀。'活下去。' 你醒来时满脸泪水，但心里轻松了。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_169_c",
        text: "反驳：'这已经是新时代了，老头子'。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_171",
        outcome: {
          narrative: "你推倒了雕像。在潜意识里，你终于走出了他的阴影，成为了你自己。",
          statsDelta: { personalSecurity: 10, publicSupport: -10 }
        }
      }
    ]
  },

  // Event 170: The Driver
  {
    id: "evt_170",
    phase: "CHARACTER",
    narrative: "你曾经也是个公交车司机。现在开车的司机是个年轻人，技术生疏。车在泥坑里熄火了。追兵就在后面。",
    newsTicker: "BACKGROUND: 从司机到总统的传奇。",
    location: "Muddy Road",
    time: "Anytime",
    options: [
      {
        id: "opt_170_a",
        text: "推开他，亲自驾驶。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_172",
        outcome: {
          narrative: "肌肉记忆还在。你挂挡，轰油门，车冲了出去。'看看，这才叫开车！' 你找回了久违的掌控感。",
          statsDelta: { personalSecurity: 10, publicSupport: 5 }
        }
      },
      {
        id: "opt_170_b",
        text: "辱骂他，威胁要枪毙他。",
        type: "aggressive",
        risk: "high",
        nextEventId: "evt_171",
        outcome: {
          narrative: "他吓得手抖，车彻底坏了。你们不得不弃车步行。愚蠢的暴怒。",
          statsDelta: { personalSecurity: -10 }
        }
      },
      {
        id: "opt_170_c",
        text: "下车推车，以此激励众人。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_172",
        outcome: {
          narrative: "总统亲自推车，满身泥浆。这画面要是被拍下来，绝对是最佳宣传。",
          statsDelta: { publicSupport: 15 }
        }
      }
    ]
  },

  // Event 171: The Propaganda Minister
  {
    id: "evt_171",
    phase: "CHARACTER",
    narrative: "豪尔赫·罗德里格斯，你的宣传部长。他建议制造一个假新闻，声称美军轰炸了一所孤儿院，以此博取国际同情。",
    newsTicker: "MEDIA: 战争迷雾中的虚假信息战。",
    location: "Strategy Room",
    time: "Anytime",
    options: [
      {
        id: "opt_171_a",
        text: "同意计划，'兵不厌诈'。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_173",
        outcome: {
          narrative: "世界震惊了。反战游行在华盛顿爆发。但如果真相败露，你将万劫不复。",
          statsDelta: { internationalStance: 20, publicSupport: 10 }
        }
      },
      {
        id: "opt_171_b",
        text: "拒绝底线，'我们不是禽兽'。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_172",
        outcome: {
          narrative: "你保留了底线。豪尔赫有些失望，但你的良心是干净的。",
          statsDelta: { publicSupport: 5 }
        }
      },
      {
        id: "opt_171_c",
        text: "真的去炸一所孤儿院嫁祸。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_173",
        outcome: {
          narrative: "这是反人类罪。你彻底堕落成了恶魔。哪怕是为了生存。",
          statsDelta: { internationalStance: -50, personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 172: The Old Woman
  {
    id: "evt_172",
    phase: "CHARACTER",
    narrative: "在一个村庄，一个满脸皱纹的老妇人拦住了你的车。她是你早年的支持者，但她的孙子因为缺药死了。她手里拿着一个烂番茄。",
    newsTicker: "SOCIETY: 民众的愤怒与失望。",
    location: "Village Road",
    time: "Anytime",
    options: [
      {
        id: "opt_172_a",
        text: "让保镖驱散她。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_174",
        outcome: {
          narrative: "保镖推倒了她。番茄砸在了地上。这像是一个隐喻。你推倒了你的人民。",
          statsDelta: { publicSupport: -20 }
        }
      },
      {
        id: "opt_172_b",
        text: "下车，任由她砸。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_173",
        outcome: {
          narrative: "番茄砸在你的脸上。你没有擦。你看着她，说'对不起'。全场寂静。这是一种赎罪。",
          statsDelta: { publicSupport: 20 }
        }
      },
      {
        id: "opt_172_c",
        text: "给她钱，作为补偿。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_174",
        outcome: {
          narrative: "她把钱扔回给你。'钱买不回命'。最尴尬的时刻。",
          statsDelta: { publicSupport: -10 }
        }
      }
    ]
  },

  // Event 173: The Dog (Revisit)
  {
    id: "evt_173",
    phase: "CHARACTER",
    narrative: "如果你之前收养了那只狗。它现在生病了，走不动了。带着它是个累赘。杀了它还是丢下它？",
    newsTicker: "STORY: 忠诚的代价。",
    location: "Forest Path",
    time: "Anytime",
    options: [
      {
        id: "opt_173_a",
        text: "背着它走。",
        type: "diplomatic",
        risk: "high",
        nextEventId: "evt_175",
        outcome: {
          narrative: "你背着一条狗逃亡。这看起来很傻，但士兵们看你的眼神变了。那是尊敬。",
          statsDelta: { militaryLoyalty: 15, personalSecurity: -5 }
        }
      },
      {
        id: "opt_173_b",
        text: "含泪结束它的痛苦。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_174",
        outcome: {
          narrative: "枪响了。你杀死了唯一绝对忠诚于你的朋友。心如死灰。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_173_c",
        text: "给它留点食物，听天由命。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_174",
        outcome: {
          narrative: "你没有回头。这就是战争，不断地抛弃。",
          statsDelta: {}
        }
      }
    ]
  },

  // Event 174: The Enemy Commander
  {
    id: "evt_174",
    phase: "CHARACTER",
    narrative: "你通过无线电截获了美军前线指挥官的通话。他听起来也很疲惫，他在抱怨这也是一场'该死的政治战争'。",
    newsTicker: "WAR: 美军士兵厌战情绪上升。",
    location: "Radio Intercept",
    time: "Anytime",
    options: [
      {
        id: "opt_174_a",
        text: "尝试与他直接对话。",
        type: "diplomatic",
        risk: "extreme",
        nextEventId: "evt_175",
        outcome: {
          narrative: "两个敌对的指挥官聊了几句。'各为其主'。他故意放慢了包围速度。战士之间的默契。",
          statsDelta: { personalSecurity: 20 }
        }
      },
      {
        id: "opt_174_b",
        text: "录音并公开，打击美军士气。",
        type: "aggressive",
        risk: "medium",
        nextEventId: "evt_175",
        outcome: {
          narrative: "那个指挥官被撤职了。换来了一个更冷酷的屠夫。适得其反。",
          statsDelta: { personalSecurity: -20 }
        }
      },
      {
        id: "opt_174_c",
        text: "静默监听，获取情报。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_176",
        outcome: {
          narrative: "知己知彼。你避开了一个陷阱。",
          statsDelta: { personalSecurity: 10 }
        }
      }
    ]
  },

  // Event 175: The Mirror
  {
    id: "evt_175",
    phase: "CHARACTER",
    narrative: "你在溪边洗脸。看着水中的倒影。胡子拉碴，满脸污垢，眼神凶狠。你已经认不出自己了。那个曾经在工会演讲的热血青年去哪了？",
    newsTicker: "PSYCH: 权力的腐蚀与人性的异化。",
    location: "Stream",
    time: "Anytime",
    options: [
      {
        id: "opt_175_a",
        text: "刮掉胡子，找回那个'公交司机'。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_176",
        outcome: {
          narrative: "你刮掉了标志性的胡子。这是一次重生。你感觉轻松了。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_175_b",
        text: "咆哮，打碎水中的倒影。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_176",
        outcome: {
          narrative: "你恨现在的自己。但这股恨意支撑着你活下去。",
          statsDelta: { militaryLoyalty: 5 }
        }
      },
      {
        id: "opt_175_c",
        text: "长时间的凝视，直到麻木。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_176",
        outcome: {
          narrative: "我不存在。我只是一个求生的机器。",
          statsDelta: {}
        }
      }
    ]
  },

  // Event 176: The Diary
  {
    id: "evt_176",
    phase: "CHARACTER",
    narrative: "你一直在写日记。这是你最后的遗产。如果现在被捕，这本日记会被公开。里面写了什么？",
    newsTicker: "HISTORY: 独裁者日记通常是畅销书。",
    location: "Tent",
    time: "Anytime",
    options: [
      {
        id: "opt_176_a",
        text: "满篇的谎言和自我美化。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_177",
        outcome: {
          narrative: "为了后世的名声。即使输了，也要输得漂亮。",
          statsDelta: { publicSupport: 5 }
        }
      },
      {
        id: "opt_176_b",
        text: "赤裸裸的真相和忏悔。",
        type: "desperate",
        risk: "medium",
        nextEventId: "evt_177",
        outcome: {
          narrative: "如果这被公开，你将不再是神，而是一个充满缺陷的人。这也许更动人。",
          statsDelta: { publicSupport: 10, internationalStance: 5 }
        }
      },
      {
        id: "opt_176_c",
        text: "烧掉它，不留只言片语。",
        type: "stealth",
        risk: "low",
        nextEventId: "evt_178",
        outcome: {
          narrative: "尘归尘，土归土。让后人去猜吧。",
          statsDelta: {}
        }
      }
    ]
  },

  // Event 177: The Last Cigar
  {
    id: "evt_177",
    phase: "CHARACTER",
    narrative: "你只剩最后一根古巴雪茄了。这是卡斯特罗当年送给你的。一直舍不得抽。",
    newsTicker: "LIFESTYLE: 最后的奢侈。",
    location: "Hilltop",
    time: "Anytime",
    options: [
      {
        id: "opt_177_a",
        text: "点燃它，享受最后的宁静。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "evt_178",
        outcome: {
          narrative: "烟雾中，你看到了过去的荣光。哪怕明天是末日，今晚你是国王。",
          statsDelta: { personalSecurity: 5 }
        }
      },
      {
        id: "opt_177_b",
        text: "把它送给那个年轻的哨兵。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_178",
        outcome: {
          narrative: "传承。小伙子受宠若惊。他会为你死战到底。",
          statsDelta: { militaryLoyalty: 20 }
        }
      },
      {
        id: "opt_177_c",
        text: "掰碎它，'戒烟了'。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_179",
        outcome: {
          narrative: "一种决绝的姿态。告别过去，专注于生存。",
          statsDelta: { personalSecurity: 5 }
        }
      }
    ]
  },

  // Event 178: The Nightmare
  {
    id: "evt_178",
    phase: "CHARACTER",
    narrative: "你梦见自己坐在海牙国际法庭的被告席上。法官是特朗普。陪审团是你死去的人民。",
    newsTicker: "PSYCH: 压力下的潜意识投射。",
    location: "Dream",
    time: "Anytime",
    options: [
      {
        id: "opt_178_a",
        text: "在梦中大声辩护。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_179",
        outcome: {
          narrative: "你在梦话中喊出了口号。惊醒了身边的保镖。",
          statsDelta: { militaryLoyalty: 5 }
        }
      },
      {
        id: "opt_178_b",
        text: "在梦中接受审判。",
        type: "desperate",
        risk: "low",
        nextEventId: "evt_179",
        outcome: {
          narrative: "深深的负罪感。你醒来时一身冷汗，感到虚弱。",
          statsDelta: { personalSecurity: -5 }
        }
      }
    ]
  },

  // Event 179: The Sunrise
  {
    id: "evt_179",
    phase: "CHARACTER",
    narrative: "黎明。太阳照常升起，照耀在安第斯山脉上。无论你是谁，这景色依然壮丽。这可能是你最后一次看日出。",
    newsTicker: "NATURE: 委内瑞拉依然美丽。",
    location: "Mountain Top",
    time: "Anytime",
    options: [
      {
        id: "opt_179_a",
        text: "感叹江山如画。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_180",
        outcome: {
          narrative: "为了这片土地，一切牺牲都是值得的。爱国主义再次充盈胸膛。",
          statsDelta: { publicSupport: 5 }
        }
      },
      {
        id: "opt_179_b",
        text: "诅咒这残酷的世界。",
        type: "aggressive",
        risk: "low",
        nextEventId: "evt_180",
        outcome: {
          narrative: "愤怒。纯粹的愤怒。这是你的燃料。",
          statsDelta: { militaryLoyalty: 5 }
        }
      }
    ]
  },

  // Event 180: The Final Decision
  {
    id: "evt_180",
    phase: "CHARACTER",
    narrative: "角色篇章结束。你更加了解自己了吗？前面就是终点线。所有的铺垫都已完成。去面对你的命运吧。",
    newsTicker: "STATUS: 故事即将进入尾声。",
    location: "Endpoint",
    time: "Anytime",
    options: [
      {
        id: "opt_180_a",
        text: "迎接最终结局。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_181",
        outcome: {
          narrative: "深呼吸。大幕拉开。",
          statsDelta: {}
        }
      }
    ]
  },

  // =========================================================================
  // BATCH 10: THE GRAND FINALE (Events 181-200)
  // =========================================================================
  // The final convergence points leading to the 4 main endings.

  // Event 181: The Last Stand (Military Check)
  {
    id: "evt_181",
    phase: "ENDING_SEQUENCE",
    narrative: "最终时刻。无论你在哪里（丛林、海上、城市），美军的主力部队已经锁定了你。这是最后的包围圈。你的身边还有多少人？",
    newsTicker: "BREAKING: '委内瑞拉：resolve'行动进入最后收网阶段。",
    location: "Last Stronghold",
    time: "The End",
    options: [
      {
        id: "opt_181_a",
        text: "依托残部死战到底（需军队忠诚度 > 50）。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "evt_182",
        outcome: {
          narrative: "士兵们没有逃跑。他们为你筑起了一道血肉长城。激烈的交火持续了整整一夜。",
          statsDelta: { militaryLoyalty: 10 }
        }
      },
      {
        id: "opt_181_b",
        text: "尝试单独突围（需个人安全度 > 60）。",
        type: "stealth",
        risk: "high",
        nextEventId: "evt_183",
        outcome: {
          narrative: "你丢下了所有人，像狐狸一样穿过了封锁线。这是生存的本能。",
          statsDelta: { personalSecurity: 10, militaryLoyalty: -50 }
        }
      },
      {
        id: "opt_181_c",
        text: "举白旗投降（无条件）。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "evt_184",
        outcome: {
          narrative: "为了避免屠杀，你走出了掩体。战争结束了。",
          statsDelta: { publicSupport: -20, personalSecurity: -100 }
        }
      }
    ]
  },

  // Event 182: The Martyr's Path (Pre-condition)
  {
    id: "evt_182",
    phase: "ENDING_SEQUENCE",
    narrative: "弹药耗尽。身边的人一个个倒下。美军劝降的声音在回荡。你手里握着最后一颗手雷和一把手枪。你想怎么结束？",
    newsTicker: "WAR: 目标区域发生剧烈爆炸。",
    location: "Burning Ruins",
    time: "The End",
    options: [
      {
        id: "opt_182_a",
        text: "像阿连德一样战斗到最后一刻。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "END_MARTYR",
        outcome: {
          narrative: "你冲了出去，扣动了扳机。密集的子弹穿透了你的身体。你倒在血泊中，成为了传奇。",
          statsDelta: { publicSupport: 100 }
        }
      },
      {
        id: "opt_182_b",
        text: "拉响手雷与敌人同归于尽。",
        type: "aggressive",
        risk: "extreme",
        nextEventId: "END_MARTYR",
        outcome: {
          narrative: "一声巨响。没有俘虏，只有碎片。这是最暴烈的告别。",
          statsDelta: { publicSupport: 80 }
        }
      }
    ]
  },

  // Event 183: The Exile's Path (Pre-condition)
  {
    id: "evt_183",
    phase: "ENDING_SEQUENCE",
    narrative: "你到达了预定的撤离点。一架没有任何标识的黑色直升机正在盘旋。或者是那艘半潜船。这是通往自由（流亡）的最后一步。",
    newsTicker: "MYSTERY: 不明飞行物飞越边境。",
    location: "Extraction Point",
    time: "The End",
    options: [
      {
        id: "opt_183_a",
        text: "登上载具，永远离开祖国。",
        type: "diplomatic",
        risk: "medium",
        nextEventId: "END_EXILE",
        outcome: {
          narrative: "随着高度上升，加拉加斯的灯火变成了遥远的星光。再见，委内瑞拉。",
          statsDelta: { personalSecurity: 100 }
        }
      },
      {
        id: "opt_183_b",
        text: "犹豫了，不想离开。",
        type: "desperate",
        risk: "high",
        nextEventId: "evt_184",
        outcome: {
          narrative: "犹豫就是死亡。载具离开了。美军赶到了。你错过了机会。",
          statsDelta: { personalSecurity: -50 }
        }
      }
    ]
  },

  // Event 184: The Prisoner's Path (Pre-condition)
  {
    id: "evt_184",
    phase: "ENDING_SEQUENCE",
    narrative: "你被戴上了手铐和头套。被推搡着上了一辆装甲车。没有英雄主义，只有冰冷的现实。你听到了周围士兵的欢呼声。",
    newsTicker: "BREAKING: 任务完成。目标已被捕获。",
    location: "Military Transport",
    time: "The End",
    options: [
      {
        id: "opt_184_a",
        text: "保持沉默，维护尊严。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "END_PRISON",
        outcome: {
          narrative: "你挺直了腰杆。即使作为囚犯，你也是前总统。",
          statsDelta: { publicSupport: 10 }
        }
      },
      {
        id: "opt_184_b",
        text: "向士兵求饶。",
        type: "desperate",
        risk: "low",
        nextEventId: "END_PRISON",
        outcome: {
          narrative: "恐惧击溃了你。士兵们嘲笑你。这一幕被记录下来，成为了笑柄。",
          statsDelta: { publicSupport: -50, personalSecurity: -20 }
        }
      }
    ]
  },

  // Event 185: The Warlord's Path (Pre-condition)
  {
    id: "evt_185",
    phase: "ENDING_SEQUENCE",
    narrative: "（如果在丛林线存活）美军撤退了。他们无法在丛林里彻底消灭你。你看着周围幸存的部下，虽然衣衫褴褛，但眼神狂热。",
    newsTicker: "ANALYSIS: 委内瑞拉南部可能陷入长期游击战。",
    location: "Deep Jungle",
    time: "The End",
    options: [
      {
        id: "opt_185_a",
        text: "宣布建立'丛林共和国'。",
        type: "aggressive",
        risk: "high",
        nextEventId: "END_WARLORD",
        outcome: {
          narrative: "你没有输。你只是换了一个统治的方式。这里是法外之地，你是这里的王。",
          statsDelta: { militaryLoyalty: 50 }
        }
      }
    ]
  },

  // --- ENDING DEFINITIONS (Pseudo-events for logic handling) ---
  
  // END_EXILE
  {
    id: "END_EXILE",
    phase: "ENDING",
    narrative: "结局达成：流亡者 (THE EXILE)。\n你在异国他乡度过了余生。虽然衣食无忧，但你永远失去了权力。每当夜深人静，你都会想起那个失去的国家。你是历史的弃儿，也是幸运的幸存者。",
    newsTicker: "GAME OVER: 流亡结局达成。",
    location: "Foreign Villa",
    time: "Epilogue",
    options: []
  },

  // END_PRISON
  {
    id: "END_PRISON",
    phase: "ENDING",
    narrative: "结局达成：囚徒 (THE PRISONER)。\n你在美国的超级监狱里度过了余生。你成为了法律和正义的战利品。你的名字偶尔出现在新闻里，但很快就被遗忘。你在铁窗后看着世界变迁。",
    newsTicker: "GAME OVER: 囚徒结局达成。",
    location: "ADX Florence",
    time: "Epilogue",
    options: []
  },

  // END_MARTYR
  {
    id: "END_MARTYR",
    phase: "ENDING",
    narrative: "结局达成：不朽图腾 (THE IMMORTAL)。\n你的肉体消亡了，但你的精神成为了反抗的图腾。你的头像被印在T恤、旗帜和墙壁上。你是查韦斯之后的又一个神话。你在死亡中获得了永生。",
    newsTicker: "GAME OVER: 图腾结局达成。",
    location: "History",
    time: "Epilogue",
    options: []
  },

  // END_WARLORD
  {
    id: "END_WARLORD",
    phase: "ENDING",
    narrative: "结局达成：丛林之王 (THE WARLORD)。\n你没有死，也没有逃。你在亚马逊丛林里建立了自己的毒品和军火帝国。政府军不敢进来，美军不想进来。你是这片绿色地狱的主宰，一个活着的恐怖传说。",
    newsTicker: "GAME OVER: 军阀结局达成。",
    location: "The Jungle",
    time: "Epilogue",
    options: []
  },

  // Event 190: Secret Ending (Easter Egg)
  {
    id: "evt_190",
    phase: "ENDING_SEQUENCE",
    narrative: "（如果集齐了所有比特币、核按钮、并且国际支持度极高）\n你不仅逃脱了，你还在几年后通过大选（或者政变）奇迹般地回到了米拉弗洛雷斯宫。这简直是好莱坞都不敢拍的剧本。",
    newsTicker: "IMPOSSIBLE: 马杜罗重返加拉加斯。",
    location: "Presidential Palace",
    time: "2030",
    options: [
      {
        id: "opt_190_a",
        text: "向世界宣布：'我回来了'。",
        type: "diplomatic",
        risk: "low",
        nextEventId: "END_TRUE_SURVIVOR",
        outcome: {
          narrative: "这是真正的委内瑞拉：resolve。游戏结束？不，游戏才刚刚开始。",
          statsDelta: { publicSupport: 100, internationalStance: 100, militaryLoyalty: 100, personalSecurity: 100 }
        }
      }
    ]
  }

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
    isGameOver: (event as any).isEnding || event.id.startsWith('END_') || event.phase === 'ENDING' || event.phase === 'ENDING_SEQUENCE' || false,
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

console.log(`本地事件库已加载: ${LOCAL_EVENT_LIBRARY.length} 个事件`);
