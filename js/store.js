// ==================== 本地状态与游戏逻辑 ====================
const KEY = 'weiai_state_v1';
export const DAILY_GOAL = 10;
export const XP_PER_CARD = 10;

// 5 阶形态所需累计能量
export const STAGES = [
  { lv: 1, name: '铁疙瘩',     need: 0 },
  { lv: 2, name: '带电小盒子', need: 80 },
  { lv: 3, name: '圆屏机器人', need: 200 },
  { lv: 4, name: '喷气智能体', need: 420 },
  { lv: 5, name: '全息 AI 生命', need: 720 }
];

function freshState() {
  return {
    version: 1,
    onboarded: false,
    tutorialDone: false,
    robotName: '小铁',
    xp: 0,
    digestedIds: [],
    seenIds: [],
    streak: { count: 0, lastDate: null, freezeCards: 0, weekKey: '' },
    daily: { date: '', digestedCount: 0, ticketClaimed: false },
    gacha: { tickets: 0, shards: 0, pity10: 0, pity50: 0, inventory: {}, equipped: { head: null, body: null, accessory: null, aura: null } },
    feed: { queue: [], pos: 0 },
    chat: { lastTag: '', idx: -1 },
    wrongIds: [],
    challenge: { bestScore: 0, dailyDate: '', dailyDone: false, bestQuiz: 0 },
    mood: 100,
    moodDate: '',
    achievements: {},
    dreamIdx: 0
  };
}

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return freshState();
    const s = JSON.parse(raw);
    return Object.assign(freshState(), s, {
      streak: Object.assign(freshState().streak, s.streak),
      daily: Object.assign(freshState().daily, s.daily),
      gacha: Object.assign(freshState().gacha, s.gacha, {
        equipped: Object.assign(freshState().gacha.equipped, s.gacha?.equipped)
      }),
      feed: Object.assign(freshState().feed, s.feed),
      chat: Object.assign(freshState().chat, s.chat)
    });
  } catch { return freshState(); }
}

export function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
export function get() { return state; }
export function resetAll() { state = freshState(); save(); }

// ---------- 日期工具 ----------
export function todayStr(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function parseDate(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function daysBetween(a, b) { return Math.round((parseDate(b) - parseDate(a)) / 86400000); }
function isoWeekKey(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  t.setUTCDate(t.getUTCDate() + 4 - (t.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((t - yearStart) / 86400000) + 1) / 7);
  return `${t.getUTCFullYear()}-W${week}`;
}

// ---------- 启动时的跨天/跨周结算，返回是否断签待处理 ----------
export function rollover() {
  const today = todayStr();
  let broken = false;

  // 每周发 1 张补签卡
  const wk = isoWeekKey();
  if (state.streak.weekKey !== wk) {
    state.streak.weekKey = wk;
    state.streak.freezeCards = 1;
  }

  // 新的一天：重置每日进度
  if (state.daily.date !== today) {
    state.daily = { date: today, digestedCount: 0, ticketClaimed: false };
  }

  // 每日谜题重置
  if (state.challenge.dailyDate !== today) {
    state.challenge.dailyDate = today;
    state.challenge.dailyDone = false;
  }

  // 心情值每天衰减 10（下限 0）
  if (state.moodDate !== today) {
    if (state.moodDate) state.mood = Math.max(0, state.mood - 10);
    state.moodDate = today;
  }

  // 检查连胜：上次打卡距今 >=2 天 = 断签
  if (state.streak.lastDate) {
    const gap = daysBetween(state.streak.lastDate, today);
    if (gap >= 2) broken = true;
  }
  save();
  return broken;
}

export function useFreeze() {
  if (state.streak.freezeCards <= 0) return false;
  state.streak.freezeCards--;
  // 假装昨天打过卡，今天完成后连胜自然延续
  const t = new Date(); t.setDate(t.getDate() - 1);
  state.streak.lastDate = todayStr(t);
  save();
  return true;
}

export function dropStreak() {
  state.streak.count = 0;
  state.streak.lastDate = null;
  save();
}

// ---------- 等级/形态 ----------
export function stageInfo() {
  let idx = 0;
  STAGES.forEach((s, i) => { if (state.xp >= s.need) idx = i; });
  const cur = STAGES[idx], next = STAGES[idx + 1];
  const pct = next ? Math.min(100, Math.round((state.xp - cur.need) / (next.need - cur.need) * 100)) : 100;
  return { idx, lv: cur.lv, name: cur.name, pct, nextNeed: next ? next.need : null };
}

// ---------- 消化卡片（答对题）----------
export function digest(cardId) {
  if (state.digestedIds.includes(cardId)) return {};
  const beforeLv = stageInfo().lv;
  state.digestedIds.push(cardId);
  state.xp += XP_PER_CARD;
  state.daily.digestedCount++;

  const after = stageInfo();
  const levelUp = after.lv > beforeLv;

  let completed = false, ticket = false;
  if (state.daily.digestedCount >= DAILY_GOAL && !state.daily.ticketClaimed) {
    completed = true;
    state.daily.ticketClaimed = true;
    state.gacha.tickets++;
    ticket = true;
    const today = todayStr();
    const y = new Date(); y.setDate(y.getDate() - 1);
    if (state.streak.lastDate === todayStr(y)) state.streak.count++;
    else state.streak.count = 1;
    state.streak.lastDate = today;
  }
  save();
  return { xp: XP_PER_CARD, levelUp, levelName: after.name, completed, ticket };
}

export function markSeen(cardId) {
  if (!state.seenIds.includes(cardId)) { state.seenIds.push(cardId); save(); }
}

// ---------- 错题本 ----------
export function addWrong(cardId) {
  if (!state.wrongIds.includes(cardId)) { state.wrongIds.push(cardId); save(); }
}
export function removeWrong(cardId) {
  const i = state.wrongIds.indexOf(cardId);
  if (i >= 0) { state.wrongIds.splice(i, 1); save(); }
}

// ---------- 心情值 ----------
export function addMood(n) {
  state.mood = Math.max(0, Math.min(100, state.mood + n));
  save();
  return state.mood;
}

// ---------- 挑战记录 ----------
export function setBestScore(s) {
  if (s > state.challenge.bestScore) { state.challenge.bestScore = s; save(); return true; }
  return false;
}
export function completeDaily() {
  state.challenge.dailyDone = true;
  state.gacha.shards += 50;
  save();
}
export function setBestQuiz(s) {
  if (s > state.challenge.bestQuiz) { state.challenge.bestQuiz = s; save(); return true; }
  return false;
}

// ---------- 成就 ----------
export function unlockAchievement(id) {
  if (state.achievements[id]) return false;
  state.achievements[id] = Date.now();
  save();
  return true;
}

// ---------- 抽卡 ----------
const RARITY_WEIGHT = { N: 60, R: 25, SR: 12, SSR: 3 };
const DUP_SHARDS = { N: 5, R: 10, SR: 30, SSR: 100 };

export function draw(parts) {
  const g = state.gacha;
  if (g.tickets <= 0) return null;
  g.tickets--;
  g.pity10++; g.pity50++;

  let rarity;
  if (g.pity50 >= 50) rarity = 'SSR';
  else if (g.pity10 >= 10) rarity = Math.random() < 0.8 ? 'SR' : 'SSR';
  else {
    const r = Math.random() * 100;
    rarity = r < 60 ? 'N' : r < 85 ? 'R' : r < 97 ? 'SR' : 'SSR';
  }
  if (rarity === 'SSR') { g.pity10 = 0; g.pity50 = 0; }
  else if (rarity === 'SR') { g.pity10 = 0; }

  const pool = parts.filter((p) => p.rarity === rarity);
  const part = pool[Math.floor(Math.random() * pool.length)];
  const had = (g.inventory[part.id] || 0) > 0;
  g.inventory[part.id] = (g.inventory[part.id] || 0) + 1;
  let gainedShards = 0;
  if (had) { gainedShards = DUP_SHARDS[rarity]; g.shards += gainedShards; }
  save();
  return { part, isNew: !had, gainedShards };
}

export function equip(slot, partId) {
  state.gacha.equipped[slot] = state.gacha.equipped[slot] === partId ? null : partId;
  save();
}
