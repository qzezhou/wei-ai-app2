// ==================== 首页渲染 ====================
import { get, save, stageInfo, DAILY_GOAL, addMood } from './store.js?v=6';
import { buildRobotSVG } from './robot.js?v=6';
import { QUIPS, IDLE_QUIPS } from './gacha-data.js?v=6';

const DREAMS = [
  '我梦见自己变成了一个 {tag}，在数据的海洋里游泳…',
  '昨晚梦到 {tag} 在跟我打招呼，说它想被更多人理解。',
  '梦里我终于搞懂了 {tag}，醒来就忘了……',
  '我梦见 {tag} 开了个派对，所有知识点都来了。',
  '梦到自己在教别人 {tag}，教着教着自己也懂了。',
  '梦见 {tag} 变成了一只小动物，可爱但很难懂。'
];
const TAG_LABELS = {
  neuralnet:'神经网络', weights:'权重', training:'训练', loss:'损失函数',
  deep:'深度学习', data:'训练数据', model:'模型', ai:'AI', neuron:'神经元',
  activation:'激活函数', cnn:'卷积网络', rnn:'循环网络', backprop:'反向传播',
  lr:'学习率', overfit:'过拟合', regular:'正则化', dataset:'数据集', batch:'批次',
  epoch:'轮次', word2vec:'词向量', bert:'BERT', gpt:'GPT', moe:'混合专家',
  quant:'量化', distill:'知识蒸馏', context:'上下文', kvcache:'KV缓存',
  dpo:'对齐', cot:'思维链', multiagent:'多智能体', embodied:'具身智能', agi:'AGI',
  prompt:'提示词', translate:'翻译', resume:'简历', meeting:'会议纪要',
  math:'数学', learncode:'编程', email:'邮件', brainstorm:'头脑风暴',
  decision:'决策', todo:'任务管理', codepit:'编程避坑', api:'API', debug:'调试',
  speak:'口语', notes:'笔记', flashcard:'卡片', plan:'计划', review:'复盘',
  security:'安全', testdata:'测试数据', research:'调研', proposal:'方案',
  explain:'科普', anki:'Anki', debate:'辩论', workflow:'工作流',
  fallacy:'思维谬误', vocab:'AI术语', puzzle:'谜题'
};

function pickBubble() {
  const s = get();
  const c = s.chat;
  if (c.lastTag && QUIPS[c.lastTag]) {
    const arr = QUIPS[c.lastTag];
    c.idx = (c.idx + 1) % arr.length;
    save();
    return arr[c.idx];
  }
  return IDLE_QUIPS[Math.floor(Math.random() * IDLE_QUIPS.length)];
}

// 做梦：根据已消化卡片数量生成梦话
function dreamText() {
  const s = get();
  if (s.digestedIds.length === 0 && s.seenIds.length === 0) {
    return '我做了一个关于数据的梦，醒来什么都不记得了…';
  }
  const tpl = DREAMS[Math.floor(Math.random() * DREAMS.length)];
  return tpl.replace('{tag}', '知识');
}

export function renderHome() {
  const s = get();
  const st = stageInfo();

  document.getElementById('streak-count').textContent = s.streak.count;
  document.getElementById('freeze-count').textContent = s.streak.freezeCards;

  const stage = document.getElementById('robot-stage');
  stage.innerHTML = buildRobotSVG(st.idx, s.gacha.equipped);

  document.getElementById('robot-name').innerHTML =
    `${s.robotName} <span class="lv">Lv.${st.lv} ${st.name}</span>`;

  document.getElementById('xp-fill').style.width = st.pct + '%';
  document.getElementById('xp-label').textContent =
    st.nextNeed ? `数据能量 ${s.xp}（距下一形态 ${st.nextNeed - s.xp}）` : `数据能量 ${s.xp} · 最终形态达成`;

  const done = Math.min(s.daily.digestedCount, DAILY_GOAL);
  const R = 52, C = 2 * Math.PI * R;
  document.getElementById('ring-fg').style.strokeDashoffset = C * (1 - done / DAILY_GOAL);
  document.getElementById('daily-count').textContent = s.daily.digestedCount;
  document.getElementById('daily-hint').textContent = done >= DAILY_GOAL ? '今日已达标 🎉' : '今日消化';

  document.getElementById('bubble-text').textContent = pickBubble();

  // 心情条
  const moodBar = document.getElementById('mood-fill');
  if (moodBar) moodBar.style.width = s.mood + '%';
  const moodLabel = document.getElementById('mood-label');
  if (moodLabel) {
    moodLabel.textContent = s.mood >= 80 ? '心情超好 😆' : s.mood >= 50 ? '心情不错 🙂' : s.mood >= 20 ? '有点无聊 😐' : '快闷坏了 😢';
  }

  // 梦话
  const dreamEl = document.getElementById('dream-text');
  if (dreamEl) dreamEl.textContent = dreamText();

  const hint = document.getElementById('ticket-hint');
  hint.hidden = s.gacha.tickets <= 0;
  document.getElementById('ticket-count-home').textContent = s.gacha.tickets;
}

export function bumpRobot() {
  const stage = document.getElementById('robot-stage');
  stage.classList.remove('bump');
  void stage.offsetWidth;
  stage.classList.add('bump');
}

// ==================== 小游戏 ====================
function openMini(id) { document.getElementById(id).hidden = false; }
function closeMini(id) { document.getElementById(id).hidden = true; }

// 猜数字
let gnTarget = 0, gnTries = 0;
export function startGuessNumber() {
  gnTarget = Math.floor(Math.random() * 100) + 1;
  gnTries = 0;
  openMini('mini-guess');
  document.getElementById('gn-result').textContent = '我想好了一个 1~100 的数字，来猜猜看！';
  document.getElementById('gn-input').value = '';
  document.getElementById('gn-tries').textContent = '0';
}
export function guessNumber() {
  const input = document.getElementById('gn-input');
  const v = parseInt(input.value, 10);
  if (isNaN(v) || v < 1 || v > 100) { document.getElementById('gn-result').textContent = '输入 1~100 的数字！'; return; }
  gnTries++;
  document.getElementById('gn-tries').textContent = gnTries;
  const r = document.getElementById('gn-result');
  if (v === gnTarget) {
    addMood(15);
    r.textContent = `🎉 猜对了！就是 ${gnTarget}，用了 ${gnTries} 次。心情 +15`;
    window.dispatchEvent(new CustomEvent('achievement', { detail: { type: 'mood' } }));
  } else if (v < gnTarget) r.textContent = '小了，往大猜 ↑';
  else r.textContent = '大了，往小猜 ↓';
  input.value = '';
  renderHome();
}

// 石头剪刀布
const RPS = ['石头', '剪刀', '布'];
const RPS_EMOJI = { '石头': '✊', '剪刀': '✌️', '布': '🖐️' };
export function playRPS(player) {
  const ai = RPS[Math.floor(Math.random() * 3)];
  const result = document.getElementById('rps-result');
  let moodGain = 0, text = '';
  if (player === ai) { moodGain = 5; text = `平局！你出${RPS_EMOJI[player]}，我出${RPS_EMOJI[ai]}。心情 +5`; }
  else if ((player === '石头' && ai === '剪刀') || (player === '剪刀' && ai === '布') || (player === '布' && ai === '石头')) {
    moodGain = 10; text = `你赢了！你出${RPS_EMOJI[player]}，我出${RPS_EMOJI[ai]}。心情 +10`;
  } else {
    text = `我赢了！你出${RPS_EMOJI[player]}，我出${RPS_EMOJI[ai]}。心情不变`;
  }
  if (moodGain > 0) { addMood(moodGain); window.dispatchEvent(new CustomEvent('achievement', { detail: { type: 'mood' } })); }
  result.textContent = text;
  renderHome();
}
