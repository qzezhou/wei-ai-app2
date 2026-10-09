// ==================== 成就系统 ====================
import { get, unlockAchievement } from './store.js?v=6';

export const ACHIEVEMENTS = [
  { id: 'streak7', icon: '🔥', name: '一周不断', desc: '连续打卡 7 天' },
  { id: 'streak30', icon: '🌋', name: '月度铁人', desc: '连续打卡 30 天' },
  { id: 'digest50', icon: '📚', name: '博学', desc: '消化 50 张知识卡' },
  { id: 'digest100', icon: '🎓', name: '学霸', desc: '消化 100 张知识卡' },
  { id: 'challenge10', icon: '⚡', name: '极速大脑', desc: '限时挑战得分 ≥ 10' },
  { id: 'dailyPuzzle', icon: '🧩', name: '谜题达人', desc: '完成每日谜题' },
  { id: 'quizFull', icon: '💯', name: '满分', desc: '综合小考全对' },
  { id: 'ssr', icon: '✨', name: '欧皇', desc: '抽到 SSR 装备' },
  { id: 'mood100', icon: '😊', name: '开心果', desc: '心情值达到 100' },
  { id: 'firstGacha', icon: '🎰', name: '初来乍到', desc: '第一次扭蛋' }
];

// 检查成就，返回新解锁的列表
export function checkAchievements(event, data) {
  const s = get();
  const newly = [];

  const tryUnlock = (id) => { if (unlockAchievement(id)) newly.push(ACHIEVEMENTS.find(a => a.id === id)); };

  if (event === 'digest') {
    if (s.digestedIds.length >= 50) tryUnlock('digest50');
    if (s.digestedIds.length >= 100) tryUnlock('digest100');
    if (s.streak.count >= 7) tryUnlock('streak7');
    if (s.streak.count >= 30) tryUnlock('streak30');
  }
  if (event === 'gacha') {
    tryUnlock('firstGacha');
    if (data?.rarity === 'SSR') tryUnlock('ssr');
  }
  if (event === 'challenge') {
    if (data?.score >= 10) tryUnlock('challenge10');
  }
  if (event === 'dailyPuzzle') tryUnlock('dailyPuzzle');
  if (event === 'quiz') {
    if (data?.correct === 10) tryUnlock('quizFull');
  }
  if (event === 'mood') {
    if (s.mood >= 100) tryUnlock('mood100');
  }

  return newly;
}
