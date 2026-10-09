// ==================== 抽卡 + 背包 ====================
import { get, draw, equip, stageInfo } from './store.js?v=6';
import { PARTS, RARITY, SLOTS, SLOT_ORDER } from './gacha-data.js?v=6';
import { buildRobotSVG } from './robot.js?v=6';

function toast(msg) { window.dispatchEvent(new CustomEvent('toast', { detail: msg })); }

export function renderGacha() {
  const s = get();
  document.getElementById('ticket-count').textContent = s.gacha.tickets;
  document.getElementById('shard-count').textContent = s.gacha.shards;
  document.getElementById('inv-preview').innerHTML = buildRobotSVG(stageInfo().idx, s.gacha.equipped);

  const inv = document.getElementById('inventory');
  inv.innerHTML = '';
  SLOT_ORDER.forEach(slot => {
    const owned = PARTS.filter(p => p.slot === slot && (s.gacha.inventory[p.id] || 0) > 0);
    if (owned.length === 0) return;
    const group = document.createElement('div');
    group.className = 'inv-slot-group';
    group.innerHTML = `<h4>${SLOTS[slot]}</h4>`;
    const grid = document.createElement('div');
    grid.className = 'inv-items';
    owned.forEach(p => {
      const item = document.createElement('button');
      item.className = `inv-item r-${p.rarity}` + (s.gacha.equipped[slot] === p.id ? ' equipped' : '');
      item.innerHTML = `<span class="cnt">×${s.gacha.inventory[p.id]}</span>${p.icon}<small>${p.name}</small>`;
      item.addEventListener('click', () => {
        equip(slot, p.id);
        renderGacha();
      });
      grid.appendChild(item);
    });
    group.appendChild(grid);
    inv.appendChild(group);
  });
}

function showDraw(result) {
  const overlay = document.getElementById('gacha-overlay');
  const door = overlay.querySelector('.light-door');
  const card = document.getElementById('draw-card');
  const { part, isNew, gainedShards } = result;

  card.className = 'draw-card';
  card.classList.add(`r-${part.rarity}`);
  document.getElementById('draw-rarity').textContent = part.rarity;
  document.getElementById('draw-rarity').className = `draw-rarity rarity-${part.rarity}`;
  document.getElementById('draw-icon').textContent = part.icon;
  document.getElementById('draw-name').textContent = part.name;
  document.getElementById('draw-slot').textContent = `${RARITY[part.rarity].name} · ${SLOTS[part.slot]}`;
  const dup = document.getElementById('draw-dup');
  dup.hidden = isNew;
  dup.textContent = isNew ? '' : `重复装备，转化为 ✨ ${gainedShards} 碎片`;
  // 成就：首次抽卡 / SSR
  window.dispatchEvent(new CustomEvent('achievement', { detail: { type: 'gacha', data: { rarity: part.rarity } } }));
  document.getElementById('draw-ok').hidden = true;
  card.classList.remove('show');

  overlay.hidden = false;
  door.classList.remove('go');
  void door.offsetWidth;
  door.classList.add('go');

  setTimeout(() => {
    card.classList.add('show');
    document.getElementById('draw-ok').hidden = false;
  }, 1450);
}

export function initGacha() {
  document.getElementById('btn-draw').addEventListener('click', () => {
    const result = draw(PARTS);
    if (!result) { toast('抽卡券不够，完成今日 10 张再来！'); return; }
    showDraw(result);
  });
  document.getElementById('draw-ok').addEventListener('click', () => {
    document.getElementById('gacha-overlay').hidden = true;
    renderGacha();
  });
}
