// ==================== 测验题幻灯片（支持 choice/tf/fill/image 四种题型）====================
const XP_FLAVOR = ['+10 能量！机器人满足地打了个嗝', '+10 能量！它的天线亮了一下', '+10 能量！知识正在变成它的肌肉', '+10 能量！它觉得自己又聪明了一克'];

function wrongMark(card, slide, onWrong) {
  if (slide.dataset.wronged) return;
  slide.dataset.wronged = '1';
  onWrong?.(card);
}

function showCorrect(box, card, slide, onCorrect) {
  box.querySelector('.q-why').classList.add('show');
  box.querySelector('.q-xp').classList.add('show');
  const hint = box.querySelector('.slide-hint');
  if (hint) hint.textContent = '上滑继续 ↑';
  onCorrect?.(card);
}

function renderChoice(box, card, slide, onCorrect, onWrong) {
  const opts = card.quiz.opts;
  const optsWrap = box.querySelector('.q-opts');
  let locked = false;
  opts.forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'q-opt';
    btn.textContent = `${'ABCD'[i]}. ${text}`;
    btn.addEventListener('click', () => {
      if (locked) return;
      if (i === card.quiz.a) {
        locked = true;
        btn.classList.add('correct');
        [...optsWrap.children].forEach((b, j) => { if (j !== i) b.classList.add('dim'); });
        showCorrect(box, card, slide, onCorrect);
      } else {
        btn.classList.add('wrong', 'dim');
        btn.disabled = true;
        wrongMark(card, slide, onWrong);
      }
    });
    optsWrap.appendChild(btn);
  });
}

function renderTF(box, card, slide, onCorrect, onWrong) {
  const optsWrap = box.querySelector('.q-opts');
  let locked = false;
  ['对', '错'].forEach((text, i) => {
    const btn = document.createElement('button');
    btn.className = 'q-opt q-opt-tf';
    btn.textContent = text;
    btn.addEventListener('click', () => {
      if (locked) return;
      if (i === card.quiz.a) {
        locked = true;
        btn.classList.add('correct');
        [...optsWrap.children].forEach((b, j) => { if (j !== i) b.classList.add('dim'); });
        showCorrect(box, card, slide, onCorrect);
      } else {
        btn.classList.add('wrong', 'dim');
        btn.disabled = true;
        wrongMark(card, slide, onWrong);
      }
    });
    optsWrap.appendChild(btn);
  });
}

function renderFill(box, card, slide, onCorrect, onWrong) {
  const optsWrap = box.querySelector('.q-opts');
  optsWrap.innerHTML = `
    <input class="q-fill" type="text" placeholder="输入你的答案…" autocomplete="off" />
    <button class="q-opt q-fill-submit">提交答案</button>
    <div class="q-fill-msg"></div>`;
  const input = optsWrap.querySelector('.q-fill');
  const submit = optsWrap.querySelector('.q-fill-submit');
  const msg = optsWrap.querySelector('.q-fill-msg');
  let locked = false;

  const accept = (val) => {
    const v = val.trim().toLowerCase();
    const answers = [card.quiz.answer, ...(card.quiz.alt || [])].map(a => String(a).trim().toLowerCase());
    return answers.some(a => a === v);
  };

  const check = () => {
    if (locked) return;
    if (!input.value.trim()) { msg.textContent = '先写个答案再提交～'; msg.className = 'q-fill-msg show'; return; }
    if (accept(input.value)) {
      locked = true;
      submit.classList.add('correct');
      submit.textContent = '答对了 ✓';
      input.disabled = true;
      msg.textContent = '';
      showCorrect(box, card, slide, onCorrect);
    } else {
      msg.textContent = '不对哦，再想想～';
      msg.className = 'q-fill-msg show wrong';
      wrongMark(card, slide, onWrong);
    }
  };
  submit.addEventListener('click', check);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') check(); });
}

function renderImage(box, card, slide, onCorrect, onWrong) {
  const imgWrap = document.createElement('div');
  imgWrap.className = 'q-image';
  imgWrap.innerHTML = `<img src="${card.quiz.img}" alt="" />`;
  box.querySelector('.q-title').before(imgWrap);
  renderChoice(box, card, slide, onCorrect, onWrong);
}

export function createQuizSlide(card, onCorrect, onWrong) {
  const slide = document.createElement('div');
  slide.className = 'slide';
  slide.dataset.quiz = card.id;

  const type = card.quiz.type || 'choice';
  const badge = type === 'tf' ? '✦ 判断题 ✦' : type === 'fill' ? '✦ 填空题 ✦' : type === 'image' ? '✦ 看图题 ✦' : '✦ 消化测验 ✦';

  const box = document.createElement('div');
  box.className = 'q-card';
  box.innerHTML = `
    <div class="q-badge">${badge}</div>
    <div class="q-title">${card.quiz.q}</div>
    <div class="q-opts"></div>
    <div class="q-why"><b>解析：</b>${card.quiz.why}</div>
    <div class="q-xp">${XP_FLAVOR[Math.floor(Math.random() * XP_FLAVOR.length)]}</div>
    <div class="slide-hint">答对后上滑继续 ↑</div>`;

  if (type === 'tf') renderTF(box, card, slide, onCorrect, onWrong);
  else if (type === 'fill') renderFill(box, card, slide, onCorrect, onWrong);
  else if (type === 'image') renderImage(box, card, slide, onCorrect, onWrong);
  else renderChoice(box, card, slide, onCorrect, onWrong);

  slide.appendChild(box);
  return slide;
}
