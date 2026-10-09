# 第二三批落地计划（挑战标签 + 养成深化）

## 范围
- 第二批：挑战标签（限时挑战、每日谜题、综合小考）
- 第三批：心情值 + 小游戏 + 做梦 + 成就系统

## 实施步骤

### 第二批：挑战标签
1. **store.js**：加 `challenge:{bestScore:0, dailyDate:'', dailyDone:false}` + 每日谜题在 rollover 重置
2. **content.js**：追加 15 道每日谜题库（`puzzle` 分类，硬一点）
3. **index.html**：加第 5 个 tab「挑战」+ `page-challenge`（3 个模式入口卡片）+ 挑战弹窗结构
4. **新建 `js/challenge.js`**：
   - 限时挑战：60s 倒计时，从已消化卡随机出题，答对+1，结束显示得分+最高分，破纪录提示
   - 每日谜题：按日期从谜题库取 1 题，答对给 50 碎片，当天只能答 1 次
   - 综合小考：digested≥20 解锁，出 10 题，按正确率给 xp（全对+50）
5. **main.js**：pages 加 challenge，switchTab 渲染，初始化 challenge
6. **style.css**：挑战页样式、倒计时、得分弹窗

### 第三批：养成深化
7. **store.js**：加 `mood:100`、`moodDate`、`achievements:{}`、`dreamIdx`；rollover 里心情每天 -10（下限 0）
8. **home.js**：
   - 心情条显示在机器人下方
   - 做梦气泡：根据最近学的 tag 从梦境模板里挑一句
   - 两个小游戏入口按钮 → 弹窗
9. **新建 `js/achievements.js`**：定义 10 个成就（连胜7/收集50/抽SSR/挑战10分/谜题首通/心情满/全勤等），导出 `checkAchievements(event, data)`
10. **main.js**：在 digest/gacha/challenge 事件里调用成就检查；成就弹窗
11. **小游戏**（放 home.js）：
    - 猜数字：1-100，给"大了/小了"，猜对 +15 心情
    - 石头剪刀布：三选一，赢+10/平+5/输+0
12. **index.html**：心情条、小游戏按钮、梦境气泡、成就弹窗、小游戏弹窗
13. **style.css**：心情条、小游戏弹窗、成就弹窗样式
14. **联调验证**：全流程跑通无报错

## 验证
1. 挑战页 3 模式可玩、计分/奖励正确
2. 心情值显示、衰减、小游戏回升正常
3. 成就解锁有弹窗、可在成就墙查看
4. 控制台 0 报错
