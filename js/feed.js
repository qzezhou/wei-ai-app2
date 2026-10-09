// ==================== 竖滑信息流 ====================
import { CARDS, CATEGORIES, cardById } from './content.js?v=6';
import { get, markSeen, digest, DAILY_GOAL, addWrong, removeWrong } from './store.js?v=6';
import { createQuizSlide } from './quiz.js?v=6';

const track = () => document.getElementById('feed-track');
const placedQuiz = new Set();
let queue = [];
let cardsSinceQuiz = 0;
let reviewMode = false;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function refillQueue() {
  const s = get();
  if (reviewMode) {
    // 复习模式：只取错题
    const wrongs = s.wrongIds.map(id => cardById[id]).filter(Boolean);
    queue = shuffle(wrongs);
    return;
  }
  const undigested = CARDS.filter(c => !s.digestedIds.includes(c.id));
  const digested = CARDS.filter(c => s.digestedIds.includes(c.id));
  // 未消化优先，消化过的作为复习内容兜底
  queue = shuffle(undigested).concat(shuffle(digested));
}

function pickQuizTarget() {
  const s = get();
  return s.seenIds
    .map(id => cardById[id])
    .find(c => c && !s.digestedIds.includes(c.id) && !placedQuiz.has(c.id));
}

function makeCardSlide(card) {
  const slide = document.createElement('div');
  slide.className = 'slide';
  slide.dataset.card = card.id;
  slide.innerHTML = `
    <div class="k-card">
      <div class="k-cat ${card.cat}">${CATEGORIES[card.cat]}</div>
      <div class="k-emoji">${card.emoji}</div>
      <h2 class="k-title">${card.title}</h2>
      <p class="k-body">${card.body}</p>
    </div>
    <div class="slide-hint">上滑 ↑</div>`;
  return slide;
}

function appendSlide() {
  const t = track();
  // 每 3 张知识卡插 1 道测验
  if (cardsSinceQuiz >= 3) {
    const target = pickQuizTarget();
    if (target) {
      placedQuiz.add(target.id);
      t.appendChild(createQuizSlide(target, (card) => {
        placedQuiz.delete(card.id);
        if (reviewMode) removeWrong(card.id);
        const result = digest(card.id);
        if (result.xp) {
          const s = get();
          s.chat.lastTag = card.tag;
          updateBars();
          window.dispatchEvent(new CustomEvent('digest', { detail: { card, result } }));
        }
      }, (card) => {
        addWrong(card.id);
        updateBars();
      }));
      cardsSinceQuiz = 0;
      return;
    }
  }
  if (queue.length === 0) refillQueue();
  const card = queue.shift();
  t.appendChild(makeCardSlide(card));
  cardsSinceQuiz++;
}

export function updateBars() {
  const s = get();
  const done = Math.min(s.daily.digestedCount, DAILY_GOAL);
  const pct = done / DAILY_GOAL * 100;
  const fill = document.getElementById('feed-progress-fill');
  if (fill) fill.style.width = pct + '%';
  const count = document.getElementById('feed-count');
  if (count) count.textContent = `今日 ${s.daily.digestedCount}/${DAILY_GOAL}`;
  const rv = document.getElementById('review-count');
  if (rv) rv.textContent = `错题 ${s.wrongIds.length}`;
}

// 复习模式开关
export function toggleReview() {
  reviewMode = !reviewMode;
  const btn = document.getElementById('review-btn');
  if (btn) {
    btn.classList.toggle('active', reviewMode);
    btn.textContent = reviewMode ? '✓ 只刷错题' : '只刷错题';
  }
  // 清空当前信息流并重建
  const t = track();
  if (t) {
    t.innerHTML = '';
    placedQuiz.clear();
    cardsSinceQuiz = 0;
    queue = [];
    if (reviewMode && get().wrongIds.length === 0) {
      t.innerHTML = '<div class="review-empty">还没有错题，去正常刷题吧～</div>';
    } else {
      while (t.children.length < 6) appendSlide();
    }
  }
  return reviewMode;
}

// 无限加载 + 标记已看
let io;
export function ensureFeed() {
  const t = track();
  if (t.dataset.inited) { updateBars(); return; }
  t.dataset.inited = '1';
  refillQueue();
  while (t.children.length < 6) appendSlide();

  t.addEventListener('scroll', () => {
    if (t.scrollHeight - t.scrollTop - t.clientHeight < 1200) {
      while (t.scrollHeight - t.scrollTop - t.clientHeight < 1600) appendSlide();
    }
  }, { passive: true });

  io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio > 0.6) {
        const id = e.target.dataset.card;
        if (id) markSeen(id);
      }
    });
  }, { root: t, threshold: [0.6] });

  const mo = new MutationObserver(() => {
    t.querySelectorAll('.slide[data-card]').forEach(el => {
      if (!el.dataset.obs) { el.dataset.obs = '1'; io.observe(el); }
    });
  });
  mo.observe(t, { childList: true });
  // 初始已存在的卡片也要观察
  t.querySelectorAll('.slide[data-card]').forEach(el => {
    if (!el.dataset.obs) { el.dataset.obs = '1'; io.observe(el); }
  });

  updateBars();
}

export function resetFeedPosition() {
  const t = track();
  if (t) t.scrollTop = 0;
}
