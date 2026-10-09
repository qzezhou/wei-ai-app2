# 《喂！AI》第一批落地计划（新题型 + 新内容 + 复习模式）

## 范围
只做第一批：① 新题型（判断/填空/图片）② 思维谬误 + AI英语术语主题包 ③ 答错记录 + 复习模式

## 高效执行步骤（每步先想好再动手）

### 步骤 1：扩展 quiz 结构 + 重写 quiz.js
**改动文件**：`js/quiz.js`
- quiz 增加可选 `type` 字段：`choice`(默认) / `tf` / `fill` / `image`
- `createQuizSlide(card, onCorrect, onWrong)` 按 type 分支渲染
  - choice：现有 4 选 1
  - tf：两个大按钮「对」「错」，a 为 0 或 1
  - fill：输入框 + 提交，匹配 `quiz.answer`（trim + 小写比较），支持 `quiz.alt` 备用答案数组
  - image：题上方显示 `quiz.img`，其余同 choice
- 答错时调用 `onWrong?.(card)`，供记录错题
- 答对逻辑统一：`onCorrect?.(card)`，显示解析

### 步骤 2：feed.js 记录错题
**改动文件**：`js/feed.js`
- `createQuizSlide` 调用时传 `onWrong` 回调，把 cardId 存进 state.wrongIds（去重）
- import 加 `get, save`，答错时 push 到 wrongIds

### 步骤 3：store.js 加 wrongIds
**改动文件**：`js/store.js`
- freshState 加 `wrongIds: []`
- merge 时保留（Object.assign 已有）
- 导出 `addWrong(cardId)` 和 `removeWrong(cardId)` 两个函数

### 步骤 4：复习模式（投喂页加开关）
**改动文件**：`js/feed.js`、`index.html`
- 投喂页顶部加一个「只刷错题」切换按钮（toggle）
- refillQueue 里：如果复习模式开启，queue 只取 wrongIds 对应的卡片
- 复习模式下答对，从 wrongIds 移除

### 步骤 5：新内容写入 content.js
**改动文件**：`js/content.js`
- CATEGORIES 加 `fallacy:'思维谬误'`、`vocab:'AI英语'`
- 追加思维谬误 12 张（用 tf 或 choice 题型）
- 追加 AI 英语术语 20 张（choice 题型，中英对照）
- 一次性整块写入，减少编辑次数

### 步骤 6：index.html 加复习按钮 + style.css 新题型样式
- 投喂页进度条旁加「只刷错题」按钮
- CSS：判断题按钮、填空输入框、图片题容器、复习模式高亮

### 步骤 7：联调验证
- 浏览器清缓存加载
- 验证：选择题/判断题/填空题/图片题 4 种都能正常作答
- 验证：答错后 wrongIds 记录，复习模式只出错题，答对后移除
- 验证：控制台无报错

## 文件清单
- `js/quiz.js` — 重写，支持 4 题型 + onWrong 回调
- `js/store.js` — 加 wrongIds + 增删函数
- `js/feed.js` — 记录错题 + 复习模式队列
- `js/content.js` — 加分类 + 32 张新卡
- `index.html` — 复习模式按钮
- `css/style.css` — 新题型 + 复习按钮样式

## 验证标准
1. 4 种题型均可正常作答、答对触发 digest、答错记录 wrongIds
2. 复习模式开启后只刷错题，答对从错题本移除
3. 新卡片正常出现在信息流和图鉴
4. 控制台 0 报错，`[hidden]` 规则不失效
