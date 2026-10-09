// ==================== 挑战页（限时挑战 / 每日谜题 / 综合小考）====================
import { get, save, setBestScore, completeDaily, setBestQuiz } from './store.js?v=6';
import { CARDS, cardById } from './content.js?v=6';
import { createQuizSlide } from './quiz.js?v=6';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 今日谜题：按日期取固定一道
export function todayPuzzle() {
  const puzzles = CARDS.filter(c => c.cat === 'puzzle');
  const d = new Date();
  const seed = d.getFullYear() * 1000 + (d.getMonth() + 1) * 40 + d.getDate();
  return puzzles[seed % puzzles.length];
}

function openModal() { document.getElementById('challenge-modal').hidden = false; }
function closeModal() { document.getElementById('challenge-modal').hidden = true; document.getElementById('challenge-body').innerHTML = ''; }

// 渲染挑战首页
export function renderChallenge() {
  const s = get();
  const digested = s.digestedIds.length;
  document.getElementById('ch-best').textContent = s.challenge.bestScore;
  document.getElementById('ch-best-quiz').textContent = s.challenge.bestQuiz;
  document.getElementById('ch-daily-status').textContent = s.challenge.dailyDone ? '✓ 今日已完成' : '今日未完成';
}

// ---------- 限时挑战 ----------
let timedTimer = null;
export function startTimed() {
  const s = get();
  if (s.digestedIds.length === 0) {
    window.dispatchEvent(new CustomEvent('toast', { detail: '先去消化几张卡片再来挑战～' }));
    return;
  }
  openModal();
  const body = document.getElementById('challenge-body');
  let score = 0, timeLeft = 60;
  body.innerHTML = `
    <div class="ch-header">
      <span class="ch-timer">⏱️ <b id="ch-time">60</b>s</span>
      <span class="ch-score">得分 <b id="ch-score">0</b></span>
    </div>
    <div id="ch-quiz-area"></div>`;

  const area = body.querySelector('#ch-quiz-area');
  const pool = shuffle(s.digestedIds.map(id => cardById[id]).filter(Boolean));
  let idx = 0;

  const nextQuiz = () => {
    if (idx >= pool.length) idx = 0; // 用完了循环
    const card = pool[idx++];
    area.innerHTML = '';
    area.appendChild(createQuizSlide(card, () => { score++; body.querySelector('#ch-score').textContent = score; setTimeout(nextQuiz, 400); },
      () => { setTimeout(nextQuiz, 400); }));
  };
  nextQuiz();

  timedTimer = setInterval(() => {
    timeLeft--;
    body.querySelector('#ch-time').textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timedTimer);
      endTimed(score);
    }
  }, 1000);
}

function endTimed(score) {
  const isRecord = setBestScore(score);
  window.dispatchEvent(new CustomEvent('achievement', { detail: { type: 'challenge', data: { score } } }));
  const body = document.getElementById('challenge-body');
  body.innerHTML = `
    <div class="ch-result">
      <div class="ch-result-emoji">${score >= 15 ? '🏆' : score >= 8 ? '🎉' : '💪'}</div>
      <h2>限时挑战结束</h2>
      <div class="ch-result-score">得分 <b>${score}</b></div>
      <div class="ch-result-best">${isRecord ? '🌟 新纪录！' : `最高分 ${get().challenge.bestScore}`}</div>
      <button class="btn-primary" id="ch-again">再来一局</button>
      <button class="btn-ghost" id="ch-close">返回</button>
    </div>`;
  body.querySelector('#ch-again').onclick = startTimed;
  body.querySelector('#ch-close').onclick = closeModal;
}

// ---------- 每日谜题 ----------
export function startDaily() {
  const s = get();
  if (s.challenge.dailyDone) {
    window.dispatchEvent(new CustomEvent('toast', { detail: '今日谜题已完成，明天再来～' }));
    return;
  }
  openModal();
  const card = todayPuzzle();
  const body = document.getElementById('challenge-body');
  body.innerHTML = `<div class="ch-header"><span class="ch-daily-tag">🎯 今日谜题 · 答对得 50 碎片</span></div><div id="ch-quiz-area"></div>`;
  body.querySelector('#ch-quiz-area').appendChild(
    createQuizSlide(card, () => {
      completeDaily();
      const b = document.getElementById('challenge-body');
      b.innerHTML = `<div class="ch-result"><div class="ch-result-emoji">🧩</div><h2>谜题破解！</h2><div class="ch-result-score">获得 <b>50</b> 碎片</div><button class="btn-primary" id="ch-close">收下</button></div>`;
      b.querySelector('#ch-close').onclick = closeModal;
      window.dispatchEvent(new CustomEvent('achievement', { detail: { type: 'dailyPuzzle' } }));
    }, () => {})
  );
}

// ---------- 综合小考 ----------
export function startQuiz() {
  const s = get();
  if (s.digestedIds.length < 20) {
    window.dispatchEvent(new CustomEvent('toast', { detail: `需先消化 20 张卡（当前 ${s.digestedIds.length}）` }));
    return;
  }
  openModal();
  const body = document.getElementById('challenge-body');
  const cards = shuffle(s.digestedIds.map(id => cardById[id]).filter(Boolean)).slice(0, 10);
  let cur = 0, correct = 0;

  const show = () => {
    body.innerHTML = `<div class="ch-header"><span class="ch-timer">第 <b>${cur + 1}</b> / 10 题</span><span class="ch-score">答对 <b id="q-correct">${correct}</b></span></div><div id="ch-quiz-area"></div>`;
    body.querySelector('#ch-quiz-area').appendChild(
      createQuizSlide(cards[cur], () => { correct++; cur++; cur < cards.length ? show() : endQuiz(correct); },
        () => { cur++; cur < cards.length ? show() : endQuiz(correct); })
    );
  };
  show();
}

function endQuiz(correct) {
  const rate = correct / 10;
  const xp = rate >= 1 ? 50 : rate >= 0.8 ? 30 : rate >= 0.5 ? 15 : 0;
  if (xp > 0) { const s = get(); s.xp += xp; save(); }
  const isRecord = setBestQuiz(correct);
  window.dispatchEvent(new CustomEvent('achievement', { detail: { type: 'quiz', data: { correct } } }));
  const body = document.getElementById('challenge-body');
  body.innerHTML = `
    <div class="ch-result">
      <div class="ch-result-emoji">${correct >= 9 ? '🏆' : correct >= 6 ? '🎉' : '📚'}</div>
      <h2>小考结束</h2>
      <div class="ch-result-score">答对 <b>${correct}</b> / 10</div>
      <div class="ch-result-best">${xp > 0 ? `获得 ${xp} 能量` : '再接再厉～'} ${isRecord ? '· 新纪录！' : ''}</div>
      <button class="btn-primary" id="ch-again">再考一次</button>
      <button class="btn-ghost" id="ch-close">返回</button>
    </div>`;
  body.querySelector('#ch-again').onclick = startQuiz;
  body.querySelector('#ch-close').onclick = closeModal;
}

// 入口绑定
export function initChallenge() {
  document.getElementById('ch-timed-btn').addEventListener('click', startTimed);
  document.getElementById('ch-daily-btn').addEventListener('click', startDaily);
  document.getElementById('ch-quiz-btn').addEventListener('click', startQuiz);
  document.getElementById('challenge-modal').addEventListener('click', (e) => {
    if (e.target.id === 'challenge-modal') { clearInterval(timedTimer); closeModal(); }
  });
}
