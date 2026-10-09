// ==================== 启动与串联 ====================
import { get, save, rollover, useFreeze, dropStreak } from './store.js?v=6';
import { ensureFeed, updateBars, toggleReview } from './feed.js?v=6';
import { renderHome, bumpRobot, startGuessNumber, guessNumber, playRPS } from './home.js?v=6';
import { renderGacha, initGacha } from './gacha.js?v=6';
import { renderDex, initDex } from './dex.js?v=6';
import { renderChallenge, initChallenge } from './challenge.js?v=6';
import { checkAchievements, ACHIEVEMENTS } from './achievements.js?v=6';

const pages = ['home', 'feed', 'challenge', 'dex', 'gacha'];
let rewardGoGacha = false;

function switchTab(tab) {
  pages.forEach(p => {
    document.getElementById(`page-${p}`).hidden = p !== tab;
  });
  document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  if (tab === 'home') renderHome();
  if (tab === 'feed') ensureFeed();
  if (tab === 'challenge') renderChallenge();
  if (tab === 'dex') renderDex();
  if (tab === 'gacha') renderGacha();
}

// ---------- Toast ----------
let toastTimer;
window.addEventListener('toast', (e) => {
  const el = document.getElementById('toast');
  el.textContent = e.detail;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2400);
});

// ---------- 成就解锁 ----------
let achToastTimer;
window.addEventListener('achievement', (e) => {
  const { type, data } = e.detail || {};
  const newly = checkAchievements(type, data);
  if (newly.length === 0) return;
  const a = newly[0];
  document.getElementById('ach-toast-icon').textContent = a.icon;
  document.getElementById('ach-toast-name').textContent = a.name;
  const toast = document.getElementById('ach-toast');
  toast.hidden = false;
  clearTimeout(achToastTimer);
  achToastTimer = setTimeout(() => { toast.hidden = true; }, 3000);
});

function showAchievements() {
  const s = get();
  const list = document.getElementById('ach-list');
  list.innerHTML = ACHIEVEMENTS.map(a => {
    const got = !!s.achievements[a.id];
    return `<div class="ach-item ${got ? '' : 'locked'}">
      <div class="ach-icon">${a.icon}</div>
      <div class="ach-name">${a.name}</div>
      <div class="ach-desc">${a.desc}</div>
    </div>`;
  }).join('');
  document.getElementById('ach-modal').hidden = false;
}

// ---------- 消化事件：升级 / 领奖 ----------
window.addEventListener('digest', (e) => {
  const { result } = e.detail;
  const s = get();
  updateBars();
  window.dispatchEvent(new CustomEvent('achievement', { detail: { type: 'digest', data: result } }));
  if (result.completed) {
    let text = `连续打卡 <b>${s.streak.count}</b> 天！获得 🎟️ 抽卡券 × 1，机器人饱得打了个嗝～`;
    if (result.levelUp) text += `<br>等等——它进化成了「<b>${result.levelName}</b>」！`;
    document.getElementById('reward-emoji').textContent = '🎟️';
    document.getElementById('reward-title').textContent = '今日目标达成！';
    document.getElementById('reward-text').innerHTML = text;
    document.getElementById('reward-ok').textContent = '去抽卡 →';
    rewardGoGacha = true;
    document.getElementById('reward-modal').hidden = false;
  } else if (result.levelUp) {
    window.dispatchEvent(new CustomEvent('toast', { detail: `进化！机器人成为「${result.levelName}」` }));
    bumpRobot();
  }
});

// ---------- 引导 ----------
function startOnboardingCheck() {
  const s = get();
  if (!s.onboarded) document.getElementById('onboarding').hidden = false;
}
document.getElementById('onb-start').addEventListener('click', () => {
  const s = get();
  s.robotName = (document.getElementById('onb-name').value || '小铁').trim().slice(0, 6);
  s.onboarded = true;
  save();
  document.getElementById('onboarding').hidden = true;
  afterOnboarding();
  if (!s.tutorialDone) startTutorial();
});

// ---------- 新手教程 ----------
const TUT_STEPS = [
  { icon:'🤖', title:'欢迎来到《喂！AI》', body:'这里没有无脑短视频，只有一口一个的 AI 知识。<br/>刷着刷着，你的小机器人就从铁疙瘩长成超级 AI。' },
  { icon:'🏠', title:'首页：你的机器人伙伴', body:'这里住着你的机器人。每天消化 <b>10 张</b>知识卡就能打卡，🔥连胜越长越有成就感，还能拿抽卡券。' },
  { icon:'🍜', title:'投喂：像刷短视频一样学', body:'上下滑动刷知识卡，每 3~4 张会弹一道选择题。<b>答对才算真消化</b>，答错不扣血，看解析继续。' },
  { icon:'📖', title:'图鉴：点亮你的知识收藏', body:'学过的卡片会在这里点亮，没学的显示剪影。点已收集的卡片可以随时回看复习。' },
  { icon:'🎁', title:'扭蛋：给机器人换装', body:'完成每日目标送抽卡券，抽出各种稀有度的装备给机器人穿上。SSR 会闪光哦～准备好了就开始吧！' }
];
function startTutorial() {
  const el = document.getElementById('tutorial');
  const dots = document.getElementById('tut-dots');
  dots.innerHTML = TUT_STEPS.map((_, i) => `<span class="${i === 0 ? 'active' : ''}"></span>`).join('');
  let idx = 0;
  const show = () => {
    const step = TUT_STEPS[idx];
    document.getElementById('tut-step').textContent = `${idx + 1} / ${TUT_STEPS.length}`;
    document.getElementById('tut-icon').textContent = step.icon;
    document.getElementById('tut-title').textContent = step.title;
    document.getElementById('tut-body').innerHTML = step.body;
    dots.querySelectorAll('span').forEach((d, i) => d.classList.toggle('active', i === idx));
    document.getElementById('tut-next').textContent = idx === TUT_STEPS.length - 1 ? '开始投喂 🚀' : '下一步 →';
  };
  const finish = () => {
    el.hidden = true;
    const s = get(); s.tutorialDone = true; save();
  };
  document.getElementById('tut-next').onclick = () => {
    if (idx < TUT_STEPS.length - 1) { idx++; show(); }
    else { finish(); switchTab('feed'); }
  };
  document.getElementById('tut-skip').onclick = finish;
  el.hidden = false;
  show();
}
// 已完成引导但没看教程的老用户，也补一次教程
function maybeShowTutorial() {
  const s = get();
  if (s.onboarded && !s.tutorialDone) startTutorial();
}

// ---------- 断签补签 ----------
function checkBrokenStreak() {
  const s = get();
  const broken = rollover();
  if (!broken) return;
  document.getElementById('freeze-available').textContent = s.streak.freezeCards;
  document.getElementById('freeze-streak').textContent = s.streak.count;
  document.getElementById('freeze-use').style.display = s.streak.freezeCards > 0 ? '' : 'none';
  document.getElementById('freeze-modal').hidden = false;
}
document.getElementById('freeze-use').addEventListener('click', () => {
  if (useFreeze()) window.dispatchEvent(new CustomEvent('toast', { detail: '🧊 补签成功，连胜保住了！' }));
  document.getElementById('freeze-modal').hidden = true;
  renderHome();
});
document.getElementById('freeze-decline').addEventListener('click', () => {
  dropStreak();
  document.getElementById('freeze-modal').hidden = true;
  renderHome();
});

// ---------- 奖励弹窗 ----------
document.getElementById('reward-ok').addEventListener('click', () => {
  document.getElementById('reward-modal').hidden = true;
  if (rewardGoGacha) { rewardGoGacha = false; switchTab('gacha'); }
});

// ---------- 导航与跳转 ----------
document.querySelectorAll('.tab').forEach(b => {
  b.addEventListener('click', () => switchTab(b.dataset.tab));
});
document.getElementById('go-feed').addEventListener('click', () => switchTab('feed'));
document.getElementById('ticket-hint').addEventListener('click', () => switchTab('gacha'));
document.getElementById('review-btn').addEventListener('click', () => toggleReview());

// ---------- 小游戏与成就 ----------
document.getElementById('btn-guess').addEventListener('click', startGuessNumber);
document.getElementById('gn-submit').addEventListener('click', guessNumber);
document.getElementById('gn-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') guessNumber(); });
document.getElementById('btn-rps').addEventListener('click', () => { document.getElementById('mini-rps').hidden = false; });
document.querySelectorAll('.rps-btn').forEach(b => b.addEventListener('click', () => playRPS(b.dataset.rps)));
document.getElementById('btn-achievements').addEventListener('click', showAchievements);

// ---------- 启动 ----------
function afterOnboarding() {
  checkBrokenStreak();
  renderHome();
  updateBars();
  maybeShowTutorial();
}

function boot() {
  initGacha();
  initDex();
  initChallenge();
  startOnboardingCheck();
  if (get().onboarded) afterOnboarding();
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js?v=6').catch(() => {});
  }
}
boot();
