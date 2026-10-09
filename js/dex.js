// ==================== 知识图鉴 ====================
import { CARDS, CATEGORIES } from './content.js?v=6';
import { get } from './store.js?v=6';

function openDetail(card) {
  document.getElementById('detail-emoji').textContent = card.emoji;
  document.getElementById('detail-title').textContent = card.title;
  document.getElementById('detail-body').textContent = card.body;
  const opts = card.quiz.opts.map((o, i) =>
    `${'ABCD'[i]}. ${o}${i === card.quiz.a ? ' ✅' : ''}`).join('<br>');
  document.getElementById('detail-quiz').innerHTML =
    `<b>随堂测验：</b>${card.quiz.q}<br><br>${opts}<br><br><b>解析：</b>${card.quiz.why}`;
  document.getElementById('card-modal').hidden = false;
}

export function renderDex() {
  const s = get();
  const list = document.getElementById('dex-list');
  list.innerHTML = '';

  const totalGot = CARDS.filter(c => s.digestedIds.includes(c.id)).length;
  document.getElementById('dex-total').textContent = `已点亮 ${totalGot}/${CARDS.length}`;

  Object.entries(CATEGORIES).forEach(([key, label]) => {
    const cards = CARDS.filter(c => c.cat === key);
    const got = cards.filter(c => s.digestedIds.includes(c.id)).length;
    const sec = document.createElement('div');
    sec.className = 'dex-section';
    sec.innerHTML = `<h3>${label}（${got}/${cards.length}）</h3>`;
    const grid = document.createElement('div');
    grid.className = 'dex-grid';
    cards.forEach(card => {
      const known = s.digestedIds.includes(card.id);
      const cell = document.createElement('button');
      cell.className = 'dex-cell' + (known ? '' : ' locked');
      cell.innerHTML = `<span>${card.emoji}</span>`;
      if (known) cell.addEventListener('click', () => openDetail(card));
      grid.appendChild(cell);
    });
    sec.appendChild(grid);
    list.appendChild(sec);
  });
}

export function initDex() {
  const modal = document.getElementById('card-modal');
  const close = () => { modal.hidden = true; };
  document.getElementById('detail-close').addEventListener('click', close);
  // 点击弹层背景也能关闭
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
}
