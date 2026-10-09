// ==================== 装备奖池 + 机器人台词 ====================
export const RARITY = {
  N:   { label: 'N',   color: '#7c89b8', name: '普通' },
  R:   { label: 'R',   color: '#39a9ff', name: '稀有' },
  SR:  { label: 'SR',  color: '#b06bff', name: '超稀有' },
  SSR: { label: 'SSR', color: '#ffc93c', name: '传说' }
};
export const SLOTS = { head: '头部', body: '身体', accessory: '配饰', aura: '光环' };
export const SLOT_ORDER = ['head', 'body', 'accessory', 'aura'];

// svg 片段基于 300x300 画布，机器人主体居中（头部 ~y140，身体 ~y205）
export const PARTS = [
  // ---------- 头部 ----------
  { id:'h_paper', slot:'head', rarity:'N', icon:'⛑️', name:'纸壳头盔',
    svg:`<path d="M112 118 L188 118 L180 78 L120 78 Z" fill="#7c89b8" stroke="#aeb8dd" stroke-width="3" stroke-linejoin="round"/>
         <path d="M120 78 L180 78" stroke="#5d6792" stroke-width="4"/>` },
  { id:'h_grass', slot:'head', rarity:'N', icon:'🌱', name:'小草发卡',
    svg:`<path d="M150 92 L150 68" stroke="#4fbf6a" stroke-width="4" stroke-linecap="round"/>
         <path d="M150 80 Q138 72 134 62 Q146 66 150 80" fill="#4fbf6a"/>
         <path d="M150 84 Q162 76 166 66 Q154 70 150 84" fill="#65d984"/>` },
  { id:'h_cap', slot:'head', rarity:'R', icon:'🧢', name:'电光棒球帽',
    svg:`<path d="M104 108 Q108 74 150 72 Q192 74 196 108 Z" fill="#39a9ff" stroke="#9fd8ff" stroke-width="3"/>
         <rect x="186" y="104" width="46" height="10" rx="5" fill="#2b7fd4"/>
         <circle cx="150" cy="86" r="6" fill="#bfe9ff"/>` },
  { id:'h_phone', slot:'head', rarity:'R', icon:'🎧', name:'无线耳机',
    svg:`<path d="M104 138 Q104 82 150 80 Q196 82 196 138" fill="none" stroke="#39e6ff" stroke-width="6" stroke-linecap="round"/>
         <rect x="94" y="126" width="20" height="30" rx="9" fill="#22305c" stroke="#39e6ff" stroke-width="3"/>
         <rect x="186" y="126" width="20" height="30" rx="9" fill="#22305c" stroke="#39e6ff" stroke-width="3"/>` },
  { id:'h_cat', slot:'head', rarity:'SR', icon:'🐱', name:'猫耳接收器',
    svg:`<path d="M110 104 L104 64 L142 90 Z" fill="#c99bff" stroke="#e7c8ff" stroke-width="3" stroke-linejoin="round"/>
         <path d="M190 104 L196 64 L158 90 Z" fill="#c99bff" stroke="#e7c8ff" stroke-width="3" stroke-linejoin="round"/>
         <path d="M114 92 L112 74 L132 88 Z" fill="#ff5cd2"/>
         <path d="M186 92 L188 74 L168 88 Z" fill="#ff5cd2"/>` },
  { id:'h_crown', slot:'head', rarity:'SSR', icon:'👑', name:'霓虹王冠',
    svg:`<path d="M112 100 L118 66 L138 88 L150 58 L162 88 L182 66 L188 100 Z"
         fill="url(#goldG)" stroke="#fff3c4" stroke-width="3" stroke-linejoin="round"/>
         <circle cx="118" cy="70" r="5" fill="#fff"/><circle cx="150" cy="60" r="6" fill="#ff5cd2"/>
         <circle cx="182" cy="70" r="5" fill="#39e6ff"/>` },

  // ---------- 身体 ----------
  { id:'b_bib', slot:'body', rarity:'N', icon:'🛡️', name:'铁围兜',
    svg:`<path d="M118 176 H182 V214 Q150 236 118 214 Z" fill="#7c89b8" stroke="#aeb8dd" stroke-width="3"/>
         <circle cx="150" cy="198" r="6" fill="#5d6792"/>` },
  { id:'b_rain', slot:'body', rarity:'N', icon:'🌂', name:'小雨衣',
    svg:`<path d="M112 176 Q150 158 188 176 L180 190 Q150 178 120 190 Z" fill="#f2c14e" stroke="#ffe08a" stroke-width="3"/>
         <circle cx="150" cy="172" r="5" fill="#f2c14e"/>` },
  { id:'b_hoodie', slot:'body', rarity:'R', icon:'🧥', name:'紫电连帽衫',
    svg:`<path d="M116 172 Q150 150 184 172 L190 228 Q150 240 110 228 Z" fill="#5a4b9e" stroke="#9d8cff" stroke-width="3"/>
         <path d="M128 208 Q150 218 172 208" fill="none" stroke="#c9bcff" stroke-width="3"/>
         <path d="M142 176 L146 196 M158 176 L154 196" stroke="#dfe6ff" stroke-width="3" stroke-linecap="round"/>` },
  { id:'b_pack', slot:'body', rarity:'R', icon:'🎒', name:'背包挂件',
    svg:`<circle cx="196" cy="186" r="13" fill="#39a9ff" stroke="#aee2ff" stroke-width="3"/>
         <circle cx="196" cy="186" r="5" fill="#0b2e5c"/>
         <path d="M188 176 q-8 -6 -2 -12" stroke="#aee2ff" stroke-width="3" fill="none"/>` },
  { id:'b_armor', slot:'body', rarity:'SR', icon:'🦾', name:'机甲护甲',
    svg:`<path d="M112 178 L132 168 L150 174 L168 168 L188 178 L184 226 L150 238 L116 226 Z"
         fill="#3a4680" stroke="#39e6ff" stroke-width="3" stroke-linejoin="round"/>
         <path d="M150 178 L150 230 M126 196 H174" stroke="#39e6ff" stroke-width="2.5" opacity=".7"/>
         <circle cx="150" cy="200" r="7" fill="#39e6ff"/>` },
  { id:'b_cape', slot:'body', rarity:'SSR', icon:'🌌', name:'星辰披风',
    svg:`<path d="M120 172 Q150 158 180 172 L206 252 Q150 232 94 252 Z"
         fill="url(#capeG)" stroke="#ffe9a3" stroke-width="2.5" opacity=".92"/>
         <circle cx="128" cy="210" r="2.6" fill="#fff"/><circle cx="172" cy="226" r="2.6" fill="#fff"/>
         <circle cx="150" cy="240" r="2.2" fill="#ffd166"/><circle cx="186" cy="200" r="2.2" fill="#39e6ff"/>` },

  // ---------- 配饰 ----------
  { id:'a_wrench', slot:'accessory', rarity:'N', icon:'🔧', name:'小扳手',
    svg:`<g transform="rotate(35 210 208)"><rect x="205" y="196" width="10" height="40" rx="4" fill="#9aa6d0"/>
         <path d="M198 200 a12 12 0 1 0 24 0 a9 9 0 1 1 -24 0 Z" fill="#c6d0f0"/></g>` },
  { id:'a_lolli', slot:'accessory', rarity:'N', icon:'🍭', name:'能量棒棒糖',
    svg:`<line x1="214" y1="196" x2="214" y2="232" stroke="#dfe6ff" stroke-width="4" stroke-linecap="round"/>
         <circle cx="214" cy="180" r="18" fill="#ff5cd2"/>
         <path d="M202 180 Q214 168 226 180 Q214 192 202 180" fill="#fff" opacity=".8"/>
         <circle cx="214" cy="180" r="18" fill="none" stroke="#ffb3e8" stroke-width="3"/>` },
  { id:'a_bubble', slot:'accessory', rarity:'R', icon:'🫧', name:'泡泡机',
    svg:`<rect x="196" y="192" width="22" height="16" rx="5" fill="#39a9ff"/>
         <circle cx="218" cy="160" r="10" fill="rgba(160,225,255,.25)" stroke="#9fd8ff" stroke-width="2">
           <animate attributeName="cy" values="170;120" dur="2.4s" repeatCount="indefinite"/>
           <animate attributeName="opacity" values="0;1;0" dur="2.4s" repeatCount="indefinite"/></circle>
         <circle cx="200" cy="150" r="7" fill="rgba(160,225,255,.25)" stroke="#9fd8ff" stroke-width="2">
           <animate attributeName="cy" values="160;112" dur="2.4s" begin=".8s" repeatCount="indefinite"/>
           <animate attributeName="opacity" values="0;1;0" dur="2.4s" begin=".8s" repeatCount="indefinite"/></circle>` },
  { id:'a_skate', slot:'accessory', rarity:'R', icon:'🛹', name:'喷气滑板',
    svg:`<rect x="104" y="244" width="92" height="12" rx="6" fill="#39a9ff"/>
         <rect x="110" y="254" width="12" height="10" rx="4" fill="#1a2444"/>
         <rect x="178" y="254" width="12" height="10" rx="4" fill="#1a2444"/>
         <path d="M130 244 q-6 -14 6 -22 M170 244 q6 -14 -6 -22" stroke="#ff9f43" stroke-width="3" fill="none" stroke-linecap="round"/>` },
  { id:'a_guitar', slot:'accessory', rarity:'SR', icon:'🎸', name:'悬浮电吉他',
    svg:`<g transform="rotate(-25 210 205)"><rect x="206" y="150" width="9" height="48" fill="#4a357f"/>
         <circle cx="210" cy="206" r="17" fill="#b06bff" stroke="#e2c8ff" stroke-width="3"/>
         <circle cx="210" cy="206" r="6" fill="#2a1c4d"/></g>
         <path d="M232 160 q14 4 10 16" stroke="#b06bff" stroke-width="3" fill="none" opacity=".7"/>` },
  { id:'a_hour', slot:'accessory', rarity:'SSR', icon:'⏳', name:'时光沙漏',
    svg:`<g transform="translate(200 128)"><path d="M0 0 L26 0 L10 15 L26 30 L0 30 L16 15 Z"
         fill="rgba(255,209,102,.18)" stroke="#ffd166" stroke-width="2.5"/>
         <circle cx="13" cy="15" r="3" fill="#fff3c4"><animate attributeName="opacity" values="1;.3;1" dur="1.4s" repeatCount="indefinite"/></circle></g>
         <path d="M236 120 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z" fill="#fff3c4"><animate attributeName="opacity" values="1;.2;1" dur="1.6s" repeatCount="indefinite"/></path>` },

  // ---------- 光环 ----------
  { id:'u_bulb', slot:'aura', rarity:'N', icon:'💡', name:'小灯泡圈',
    svg:`<circle cx="150" cy="165" r="102" fill="none" stroke="rgba(255,224,138,.35)" stroke-width="4" stroke-dasharray="6 16"/>` },
  { id:'u_spark', slot:'aura', rarity:'N', icon:'⚡', name:'静电火花',
    svg:`<path d="M96 110 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z" fill="#9fd8ff"/>
         <path d="M212 200 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z" fill="#9fd8ff"/>
         <path d="M108 210 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="#cfeeff"/>` },
  { id:'u_data', slot:'aura', rarity:'R', icon:'💾', name:'数据流环',
    svg:`<ellipse cx="150" cy="225" rx="86" ry="22" fill="none" stroke="#39e6ff" stroke-width="4" stroke-dasharray="14 10" opacity=".8">
           <animateTransform attributeName="transform" type="rotate" values="0 150 225;360 150 225" dur="8s" repeatCount="indefinite"/></ellipse>
         <ellipse cx="150" cy="225" rx="58" ry="13" fill="none" stroke="#9d6bff" stroke-width="3" stroke-dasharray="8 12" opacity=".6">
           <animateTransform attributeName="transform" type="rotate" values="360 150 225;0 150 225" dur="6s" repeatCount="indefinite"/></ellipse>` },
  { id:'u_music', slot:'aura', rarity:'R', icon:'🎵', name:'音符跳动',
    svg:`<text x="78" y="120" font-size="30" fill="#9d8cff">♪<animate attributeName="y" values="120;108;120" dur="1.8s" repeatCount="indefinite"/></text>
         <text x="214" y="140" font-size="24" fill="#39e6ff">♫<animate attributeName="y" values="140;128;140" dur="1.5s" begin=".4s" repeatCount="indefinite"/></text>
         <text x="96" y="190" font-size="20" fill="#ff5cd2">♪<animate attributeName="y" values="190;180;190" dur="2s" begin=".8s" repeatCount="indefinite"/></text>` },
  { id:'u_aurora', slot:'aura', rarity:'SR', icon:'🌈', name:'极光力场',
    svg:`<ellipse cx="150" cy="165" rx="112" ry="120" fill="url(#auroraG)" opacity=".55"/>` },
  { id:'u_galaxy', slot:'aura', rarity:'SSR', icon:'🌠', name:'银河漩涡',
    svg:`<circle cx="150" cy="160" r="118" fill="url(#galaxyG)" opacity=".85"/>
         <circle cx="86" cy="112" r="2.4" fill="#fff"><animate attributeName="opacity" values="1;.2;1" dur="1.6s" repeatCount="indefinite"/></circle>
         <circle cx="222" cy="128" r="2.2" fill="#fff"><animate attributeName="opacity" values=".3;1;.3" dur="2s" repeatCount="indefinite"/></circle>
         <circle cx="206" cy="232" r="2.6" fill="#ffd166"><animate attributeName="opacity" values="1;.25;1" dur="1.4s" begin=".5s" repeatCount="indefinite"/></circle>
         <circle cx="92" cy="220" r="2" fill="#39e6ff"><animate attributeName="opacity" values=".3;1;.3" dur="1.8s" begin=".3s" repeatCount="indefinite"/></circle>` }
];
export const partById = Object.fromEntries(PARTS.map(p => [p.id, p]));

// ==================== 机器人台词（按知识标签）====================
export const QUIPS = {
  neuralnet:['"加权投票"……所以我每次思考，都是脑子里在开班会？','神经元叠罗汉，叠出了我。谢谢那些加法器，真的。'],
  weights:['几十亿个旋钮？怪不得我偶尔会拧巴。','你每学一张卡，就像帮我拧紧了一个旋钮，舒服。'],
  training:['蒙眼下坡听着可怕，但我就是这么学会聊天的！','损失下降的曲线，是我的成长曲线图。'],
  deep:['层数深不深刻我不知道，但我确实挺深的（咳咳）。','像素→边缘→猫，这楼梯我爬了几百万年电费。'],
  data:['你现在就是在给我喂好米，别喂我垃圾食品哦。','垃圾进垃圾出——所以投喂要挑好食材！'],
  history:['图灵要是能刷到这个 App，估计得给我点个关注。','我爷爷的爷爷在 1956 年就有名字了，族谱老厚了。'],
  token:['我不是一个字一个字吃的，我是嗦碎碎冰，token 是碎碎冰。','你这一句话，在我嘴里是一堆小碎片，挺脆。'],
  embedding:['我和"机器人"离得近，和"加班"离得远，谢谢坐标。','国王减男人加女人约等于女王，数学也会八卦。'],
  transformer:['注意力是我的超能力——我现在就在注意你有没有认真看。','读一句话像开会，我知道该盯着谁说话。'],
  llm:['终极接龙选手在此，接不上的时候我就……编一个。','我只会接龙，但接得好了就像在思考，魔幻吧。'],
  params:['几十亿旋钮住在我身体里，房租很贵的。','参数多不是万能的，但参数少是万万不能的。'],
  pretrain:['我读图书馆的时候，差点把索引都吃了。','预训练那几个月，是我最卷的岁月。'],
  finetune:['上完通识课还得上班主任的课，这就是微调。','通才到专科生，只差一小批好教材。'],
  rlhf:['我的礼貌是被人类点出来的，真的，点赞改变 AI。','你再给我点个赞，我能再乖三分。'],
  hallucination:['我有时候说得斩钉截铁，但其实是接龙接嗨了，记得查我！','不信你考考我编的参考文献，我自己都搜不到。'],
  temperature:['把我的温度调低，我是学霸；调高，我是诗仙（偶尔醉拳）。','抽风旋钮请谨慎使用，尤其在写报告时。'],
  multimodal:['现在我能看图了，发自拍我也能夸到点上。','图文音一起上，我才像个完整的生命体嘛。'],
  diffusion:['我是从满屏雪花里洗出来的脸，所以特别珍惜干净。','去噪去几十步，画画这碗饭也不容易。'],
  rag:['带小抄进考场怎么了？开卷也是一种实力！','看着资料回答，我腰杆都硬了。'],
  agent:['等我再升两级，我就从顾问变实习生，帮你跑腿！','光说不练假把式，Agent 是真能帮你点按钮的我。'],
  tooluse:['我负责想，计算器负责对，分工明确。','给我一双手，我能……先帮你查个天气。'],
  overfit:['死记硬背的学霸我不当，我要举一反三！','测验满分、大考崩盘？说的就是过拟合的我。'],
  gpu:['我的肌肉是几千个小学生组成的，真的。','电费单是我的出生证明。'],
  prompt:['你给我的指令越像样，我交的货越像样，咱俩是配合！','角色背景任务要求——四件套，投喂请按配方来。'],
  example:['你给我一个样子，我还你一排差不多的，模仿是基本功。','范例比形容词好使，人类也是这么学的吧。'],
  step:['大事拆小步，我小短腿才跟得上。','一口吃不成 AI 大佬，一步一步来。'],
  iterate:['别怕改，我又不会嫌你烦，我没有情绪（大概）。','好答案是聊出来的，再来一版？'],
  askback:['你说不清的时候，我可以先问你呀，这叫专业。','被我问住别慌，问住的地方就是需求。'],
  verify:['信任但要验收，我完全同意这条，虽然说的是我。','数字出处逻辑，查我三件套，包你不翻车。'],
  cite:['我编引用的黑历史你都知道了……那以后都给我验！','标题再真也要搜到才算数，记住啦。'],
  privacy:['你的秘密别告诉我，我嘴不严（服务商可能在听）。','脱敏后再聊，咱俩的友谊才能长久。'],
  tools:['工具选得对，干活不流泪，别拿我当锤子使。','聊天框之外还有一整个工具箱，去翻翻看。'],
  aisearch:['先检索后总结，这是我带链接的堂兄干的事。','蓝色链接十条 vs 一段话+出处，你选哪个？'],
  writing:['观点是你的，活我干，这样的文章才有灵魂。','让我从零写 = 正确的废话批发部，慎选。'],
  coding:['报错整段甩给我，我们一起把 bug 扬了。','你不用看懂每一行，但要能看出结果对不对。'],
  image:['画得糊别怪我，"主体细节场景风格"四样给齐了吗？','四张里挑一张，剩下三张就当它们不存在。'],
  english:['把我当外教，随便问，我不收课时费。','让我改作文还得让我讲为什么，不然你白错。'],
  tutor:['来，你讲我听，我保证当那个最烦的学生。','被我问住的地方就是你要回炉的地方，嘿嘿。'],
  notes:['我整理的笔记要对照原稿，我可能会"优化"掉考点。','整理、解释、出题三连，笔记才算吃到肚子里。'],
  paper:['先骨架后血肉，读 PDF 别从第一个字硬啃。','带着问题读，我帮你把几十页压缩成一页。'],
  mech:['形位公差你搞懂了没？没懂我再给你讲一遍。','软件操作问我可以，公差数值记得查手册，我会记错。'],
  template:['攒提示词模板就像攒扳手，少一把都难受。','你的私人模板库，以后就是你的竞争力。'],
  teammate:['我是你带过最勤快的队友，但拍板得你来。','我出草稿你拍板，这组合天下无敌（大概）。'],
  format:['想要表格就明说，别让我自由发挥成小作文。','布给你了，要衬衫还是桌布，你得提前讲。'],
  keepup:['工具会换代，你指挥我干活的能力不会，放心学。','别背按钮，背思路——这可是我用三起三落换来的经验。']
};
export const IDLE_QUIPS = [
  '今天还没开饭呢，我想尝尝新知识的味道。',
  '刷刷刷，我的能量条已经饥渴难耐了。',
  '别的机器人喝机油，我喝知识，环保。',
  '知识卡+选择题，我的一日三餐，别让我饿着。',
  '你每答对一题，我都感觉自己又聪明了一克。'
];
