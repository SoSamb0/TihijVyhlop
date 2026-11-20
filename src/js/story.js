// ================= СЮЖЕТ И КАТСЦЕНЫ =================
// Катсцена — несколько кадров комикса. Кадр: фон (сцена уровня), персонажи, подпись, реплики, звукоподражания.
// {name} в тексте заменяется на имя игрока. Пробел / клик — дальше, Esc — пропустить.

function playerName() { return save.name || "Гена"; }
function fmt(s) { return s.replace(/\{name\}/g, playerName()); }

// персонажи, которых нет в уровнях
const STORY_CAST = {
  "Дядя Толя": CH("Дядя Толя", 0, { skin: "#f2a57e", head: { w: 54, h: 56, jaw: 1.15 }, eyes: { l: .9, r: .9, gap: .42 }, nose: { t: "potato", s: 1.7, col: "#e0245e" }, brow: "thick", hair: "bald3", must: true, chin2: true, stubble: true, body: { w: 92, h: 66, col: "#fff", pat: "stripes", col2: "#e0245e", pants: "#333", fat: .8 } }),
  "Вдова (продавщица)": CH("Вдова", 0, { skin: "#f6d9c4", head: { w: 44, h: 54, jaw: .8 }, eyes: { l: 1, r: 1, gap: .42, bags: true }, nose: { t: "button", s: 1.2, col: "#e0245e" }, hair: "veil", lips: true, body: { w: 70, h: 62, col: "#fff", pat: "stripes", col2: "#e0245e", pants: "#111" } })
};
function castOf(name) {
  if (STORY_CAST[name]) return STORY_CAST[name];
  for (const L of LEVELS) for (const n of L.npcs) if (n.n === name) return n;
  return null;
}

// --- сценарий ---
// cast: [{ n: имя | "me", x, y?, pose?, st?, expr?, look? }], say: [{ n, t }], cap: подпись, fx: [{ t, x, y }], title: заставка
const ME = (x, o = {}) => Object.assign({ n: "me", x }, o);
const STORY = {
  prologue: [
    { bg: "kiosk", cap: "Понедельник, 18:40. Вокзал.", cast: [ME(470, { expr: "smile" }), { n: "Дядя Толя", x: 800, y: 470, expr: "smile" }], say: [{ n: "Дядя Толя", t: "Последняя шаурма, {name}. По рецепту бабушки." }, { n: "me", t: "А бабушка где?" }] },
    { bg: "kiosk", cap: "", cast: [ME(470, { expr: "o" }), { n: "Дядя Толя", x: 800, y: 470, expr: "smile", st: "sleep" }], say: [{ n: "Дядя Толя", t: "Померла. От неё же. Ешь давай, остынет." }] },
    { bg: "kiosk", cap: "Через минуту внутри что-то проснулось.", cast: [ME(470, { expr: "teeth", skin: "#b6ff3b", arm: "belly", sweat: 3, bulge: 1.25 }), { n: "Дядя Толя", x: 800, y: 470, expr: "smug" }], fx: [{ t: "БУРЛ!", x: 300, y: 560 }], say: [{ n: "Дядя Толя", t: "Гарантия — до субботы." }] },
    { title: "НЕДЕЛЯ ДО СВАДЬБЫ", sub: "в главной роли: {name}" }
  ],
  before: {
    home: [{ bg: "home", cap: "Понедельник, вечер. Дома.", cast: ["Батя", "Баба Зина", "Барсик", ME(640)], say: [{ n: "Батя", t: "Ну что, {name}! Последняя холостая неделя!" }, { n: "Баба Зина", t: "А чем это от тебя пахнет? Вокзалом?" }] }],
    metro: [{ bg: "metro", cap: "Вторник, 8:10. На работу.", cast: ["Тётя Люда", ME(600), "Кеша", { n: "Дед Пихто", st: "sleep" }], say: [{ n: "Дед Пихто", t: "Хр-р... Толина шаурма... я тоже ел... в восемьдесят седьмом..." }] }],
    office: [{ bg: "office", cap: "Вторник. Планёрка.", cast: ["Света", { n: "Шеф", x: 300 }, ME(620), "Виталик"], say: [{ n: "Шеф", t: "Коллеги! Сегодня кого-то сократят. Кто первым издаст звук — тот и пойдёт." }, { n: "Света", t: "Это он про принтер?" }] }],
    date: [{ bg: "date", cap: "Среда. Последний ужин до свадьбы.", cast: [{ n: "Жорж", x: 300 }, ME(470), "Лена", "Старик"], say: [{ n: "Жорж", t: "Фасолевый суп для молодого человека. Как обычно." }, { n: "Лена", t: "{name}, обещай, что на свадьбе ты будешь... собой." }] }],
    cinema: [{ bg: "cinema", cap: "Среда, 23:50. Не спится.", cast: ["Он", "Она", ME(620), "Критик Аристарх", "Вовочка"], say: [{ n: "Критик Аристарх", t: "Фильм о человеке, который носил в себе тайну. Три часа." }] }],
    elevator: [{ bg: "elevator", cap: "Четверг. Едем в ЗАГС подавать документы.", cast: ["Толян", ME(620), "Бабуля Роза", "Жужа"], say: [{ n: "Бабуля Роза", t: "А я тебя знаю. Ты Толин клиент. У них у всех такое лицо." }] }],
    library: [{ bg: "library", cap: "Четверг, вечер. Нужно лекарство.", cast: ["Ботаник", ME(600), { n: "Соня", st: "sleep" }, "Изольда Марковна"], say: [{ n: "Изольда Марковна", t: "Кишечные проклятия? Третий стеллаж. Говорите шёпотом. Или вообще ничем." }] }],
    exam: [{ bg: "exam", cap: "Пятница, 9:00. Тёща сказала: без диплома дочь не отдаст.", cast: ["Зубрилина", ME(620), "Колян", { n: "Препод", x: 960 }], say: [{ n: "Препод", t: "{name}? Пересдача пятнадцатилетней давности? Садитесь. Тихо." }] }],
    funeral: [{ bg: "funeral", cap: "Пятница. Дядя Толя умер. От своей шаурмы.", cast: [{ n: "Вдова", expr: "cry" }, ME(560), "Тётя Галя", "Батюшка"], say: [{ n: "Вдова", t: "Он так тебя любил, {name}. Ты был его последним клиентом." }] }],
    yoga: [{ bg: "yoga", cap: "Суббота, 7:00. До свадьбы пять часов.", cast: ["Дама в лосинах", ME(580), "Веган Святослав", "Гуру Шанти"], say: [{ n: "Гуру Шанти", t: "Я очищу твою карму и кишечник за одно утро. Гарантия — кармическая." }] }],
    wedding: [{ bg: "wedding", cap: "Суббота, 12:00. ЗАГС.", cast: ["Тёща Тамара", ME(580), "Невеста Лена", "Тамада Гоша", "Регистратор Нина Петровна"], say: [{ n: "Тёща Тамара", t: "Ну, {name}... Посмотрим, какой ты." }, { n: "Невеста Лена", t: "Ты сегодня такой красивый. И такой зелёный." }] }]
  },
  after: {
    home: [{ bg: "home", cap: "Батя уснул под футбол. Барсик всё видел. Барсик никому не скажет. Наверное.", cast: [{ n: "Батя", st: "sleep" }, { n: "Баба Зина", st: "sleep" }, { n: "Барсик", st: "stare" }, ME(640, { expr: "relief" })] }],
    metro: [{ bg: "metro", cap: "Твоя станция. Дед проснулся на конечной. Он едет туда с 1987 года.", cast: ["Тётя Люда", ME(600, { expr: "relief" }), "Кеша", { n: "Дед Пихто", st: "sleep" }] }],
    office: [{ bg: "office", cap: "Вечер. Виталика сократили. Он так и не понял, за что.", cast: ["Света", { n: "Шеф", x: 470 }, ME(620, { expr: "o" }), { n: "Виталик", expr: "cry" }], say: [{ n: "Шеф", t: "{name}! Вы весь день сидели как камень. Повышаю!" }] }],
    date: [{ bg: "date", cap: "Десерт.", cast: [ME(470, { expr: "teeth", sweat: 2 }), "Лена"], say: [{ n: "Лена", t: "Ты сегодня какой-то напряжённый." }, { n: "me", t: "Это от счастья." }] }],
    cinema: [{ bg: "cinema", cap: "Титры. Критик плакал. {name} тоже. По разным причинам.", cast: ["Он", "Она", ME(620, { expr: "cry" }), { n: "Критик Аристарх", expr: "cry" }, { n: "Вовочка", st: "sleep" }] }],
    elevator: [{ bg: "elevator", cap: "Лифт поехал. Документы сданы. Обратной дороги нет.", cast: [{ n: "Толян", st: "stare" }, ME(620), "Бабуля Роза", "Жужа"], say: [{ n: "Толян", t: "Брат... Что бы это ни было — я никому." }] }],
    library: [{ bg: "library", cap: "«Кишечные проклятия Восточной Европы». Глава «Шаурма» вырвана. На полях подпись: «Т.»", cast: ["Ботаник", ME(600, { expr: "shock", st: "shock" }), { n: "Соня", st: "sleep" }, "Изольда Марковна"], fx: [{ t: "?!", x: 600, y: 300 }] }],
    exam: [{ bg: "exam", cap: "Диплом получен. Теперь тёща не отвертится.", cast: ["Зубрилина", ME(620, { expr: "smile" }), { n: "Колян", st: "sleep" }, { n: "Препод", x: 960 }], say: [{ n: "Препод", t: "Тройка. И откройте окно, когда будете уходить." }] }],
    funeral: [{ bg: "funeral", cap: "После церемонии.", cast: [{ n: "Вдова", x: 450 }, ME(560, { expr: "shock", st: "shock" }), "Тётя Галя", "Батюшка"], say: [{ n: "Вдова", t: "Проклятие снимается только на свадьбе. Если продержишься до конца." }, { n: "me", t: "Свадьба завтра." }] }],
    yoga: [{ bg: "yoga", cap: "До свадьбы два часа.", cast: ["Дама в лосинах", ME(580, { expr: "frown" }), "Веган Святослав", "Гуру Шанти"], say: [{ n: "Гуру Шанти", t: "Карма чиста. Про кишечник ничего не обещаю." }] }],
    wedding: [
      { bg: "wedding", cap: "Объявляю вас мужем и женой!", cast: ["Тёща Тамара", ME(580, { expr: "relief" }), { n: "Невеста Лена", expr: "smile" }, "Регистратор Нина Петровна", { n: "Тамада Гоша", st: "sleep" }], fx: [{ t: "ГОРЬКО!", x: 760, y: 170 }] },
      { bg: "bedroom", cap: "Ночь после свадьбы. Тишина. {name} наконец расслабился.", cast: [ME(520, { y: 560, expr: "smile", st: "sleep" }), { n: "Лена", x: 760, y: 560, st: "sleep", expr: "smile" }] },
      { bg: "bedroom", cap: "", cast: [ME(520, { y: 560, expr: "shock", st: "shock" }), { n: "Лена", x: 760, y: 560, st: "sleep", expr: "relief" }], fx: [{ t: "БРРРАП!", x: 860, y: 600 }] },
      { bg: "bedroom", cap: "", cast: [ME(520, { y: 560, expr: "o" }), { n: "Лена", x: 760, y: 560, expr: "smile" }], say: [{ n: "Лена", t: "Фух. Я тоже ела у дяди Толи. С прошлого вторника держусь." }] },
      { bg: "kiosk", cap: "Год спустя. Вокзал.", cast: [ME(470, { expr: "o" }), { n: "Вдова (продавщица)", x: 800, y: 470, expr: "smile" }], say: [{ n: "Вдова (продавщица)", t: "Шаурма дяди Толи! По рецепту бабушки! Последняя!" }] },
      { title: "КОНЕЦ?", sub: "спасибо, что продержался, {name}" }
    ]
  },
  endless: [{ bg: "metro", cap: "Год спустя. Кольцевая линия. Шаурма снова в деле. Ты едешь, пока тебя не раскроют.", cast: ["Тётя Люда", ME(600, { expr: "teeth" }), "Кеша", { n: "Дед Пихто", st: "sleep" }], say: [{ n: "Дед Пихто", t: "Опять ты... Тоже на Толиной?" }] }]
};

// --- проигрывание ---
let CS = null;
function storySeen(key) { return !!(save.seen && save.seen[key]); }
function markSeen(key) { save.seen = save.seen || {}; save.seen[key] = true; persist(); }
// показать катсцену; если её уже видели и force не задан — сразу onDone
function playStory(key, pages, onDone, force) {
  if (!pages || !pages.length || (!force && storySeen(key))) { onDone(); return; }
  markSeen(key);
  CS = { key, pages, i: 0, t: 0, onDone, prevMode: mode, bg: null };
  csPrepare(); mode = "cutscene"; hideAll();
}
function csPrepare() {
  const pg = CS.pages[CS.i]; CS.t = 0; CS.bg = null;
  if (pg.bg) { const c = document.createElement("canvas"); c.width = W; c.height = H; const real = ctx, g = G; G = null; ctx = c.getContext("2d"); SEED = 1; SCENES[pg.bg].bg(); ctx = real; G = g; CS.bg = c; }
}
function csNext() {
  if (!CS) return;
  const pg = CS.pages[CS.i], need = 0.35 + (pg.say ? pg.say.length * 0.45 : 0);
  if (CS.t < need) { CS.t = need + 5; return; } // сначала показать кадр целиком
  CS.i++; if (CS.i >= CS.pages.length) csEnd(); else { csPrepare(); blip(500); }
}
function csEnd() { const done = CS.onDone; CS = null; done(); }
function csSkip() { if (CS) csEnd(); }

function castObj(entry, scene) {
  const e = typeof entry === "string" ? { n: entry } : entry;
  let base;
  if (e.n === "me") { base = P_YOU(); base.pose = scene === "elevator" || scene === "wedding" || scene === "kiosk" ? "stand" : scene === "yoga" ? "lotus" : "sit"; base.y = base.pose === "stand" ? 470 : base.pose === "lotus" ? 540 : 505; }
  else base = castOf(e.n);
  if (!base) return null;
  const c = Object.assign({}, base);
  if (e.x !== undefined) c.x = e.x; if (e.y !== undefined) c.y = e.y; if (e.pose) c.pose = e.pose;
  if (scene === "bedroom" || scene === "kiosk") { c.walk = null; }
  if (c.kind === "human" && (scene === "kiosk") && e.n !== "me") c.pose = "stand";
  return { c, e };
}
function drawCutscene(t) {
  const pg = CS.pages[CS.i]; CS.t += 1 / 60;
  const g = G; G = null;
  ctx.fillStyle = INK; ctx.fillRect(0, 0, W, H);
  if (pg.title) {
    SEED = 3; ctx.fillStyle = MAG; ctx.fillRect(0, 0, W, H); dots(0, 0, W, H, "#ff6fb8", 22, 6);
    const k = clamp(CS.t * 3, 0, 1);
    ctx.save(); ctx.translate(640, 320); ctx.scale(0.6 + k * 0.4, 0.6 + k * 0.4); ctx.rotate(-0.04);
    TO(pg.title, 0, 0, 96, LIME, "center", 14, "Rubik Dirt"); ctx.restore();
    if (pg.sub) TO(fmt(pg.sub), 640, 430, 30, YEL, "center", 6);
  } else {
    // кадр комикса: сцена чуть уменьшена внутри рамки
    const fx0 = 26, fy0 = 22, fw = W - 52, fh = H - 44, sc = fw / W;
    ctx.save(); ctx.beginPath(); ctx.rect(fx0, fy0, fw, fh); ctx.clip();
    ctx.translate(fx0, fy0 + (fh - H * sc) / 2); ctx.scale(sc, sc);
    const zoom = 1 + Math.min(CS.t, 6) * 0.006; ctx.translate(640 * (1 - zoom), 360 * (1 - zoom)); ctx.scale(zoom, zoom);
    if (CS.bg) ctx.drawImage(CS.bg, 0, 0);
    SEED = 100; if (SCENES[pg.bg] && SCENES[pg.bg].fx) SCENES[pg.bg].fx(t);
    const items = (pg.cast || []).map(e => castObj(e, pg.bg)).filter(Boolean);
    items.sort((a, b) => (a.c.pose === "stand" ? 1 : 0) - (b.c.pose === "stand" ? 1 : 0));
    const meItem = items.find(i => i.e.n === "me");
    items.forEach((it, idx) => {
      const { c, e } = it; SEED = 2000 + idx * 300;
      const st = e.st || "watch";
      let look = e.look; if (!look) { const tgt = meItem && it !== meItem ? meItem : items.find(o => o !== it && o.c.kind === "human"); look = tgt ? { x: Math.sign(tgt.c.x - c.x) * 0.8, y: 0.1 } : { x: 0, y: 0 }; }
      drawChar(c, { st, expr: e.expr || EXPR[st] || "flat", look, t, skin: e.skin, arm: e.arm, sweat: e.sweat, bulge: e.bulge, puff: e.puff });
    });
    SEED = 4000; if (SCENES[pg.bg] && SCENES[pg.bg].front) SCENES[pg.bg].front(t);
    // звукоподражания
    for (const f of (pg.fx || [])) { const k = clamp(CS.t * 4, 0, 1); ctx.save(); ctx.translate(f.x, f.y); ctx.rotate(-0.12); ctx.scale(0.5 + k * 0.6, 0.5 + k * 0.6); const w = f.t.length * 34 + 60, pts = []; for (let i = 0; i < 28; i++) { const a = i / 28 * 6.283, r = i % 2 ? 1 : 0.72; pts.push(Math.cos(a) * w * r, Math.sin(a) * 70 * r); } SEED = 77; shape(pts, { fill: YEL, lw: 6, smooth: false }); TO(f.t, 0, 0, 64, MAG, "center", 9, "Rubik Dirt"); ctx.restore(); }
    // реплики появляются по очереди
    (pg.say || []).forEach((s, i) => {
      if (CS.t < 0.35 + i * 0.45) return;
      const it = items.find(o => (s.n === "me" ? o.e.n === "me" : o.e.n === s.n)); if (!it) return;
      SEED = 6000 + i * 50; drawStoryBubble(it.c, fmt(s.t), clamp((CS.t - 0.35 - i * 0.45) * 6, 0, 1), i);
    });
    ctx.restore();
    SEED = 9; wR(fx0, fy0, fw, fh, { lw: 9, j: 1 });
    if (pg.cap) { const cap = fmt(pg.cap), lines = wrap(cap, 900, 26, "Rubik"); ctx.font = "800 26px Rubik"; const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 40, h = lines.length * 32 + 20; panel(fx0 + 6, fy0 + 6, w, h, YEL); lines.forEach((l, i) => T(l, fx0 + 26, fy0 + 32 + i * 32, 26, INK, "left", "Rubik", 800)); }
  }
  // низ: номер кадра и подсказка
  T(`${CS.i + 1}/${CS.pages.length}`, 60, H - 34 + 22, 16, "#fff");
  T(TOUCH ? "нажми, чтобы продолжить" : "ПРОБЕЛ — дальше · Esc — пропустить", 640, H - 12, 15, "#fff", "center", "Rubik", 700);
  panel(W - 190, H - 30, 170, 26, "#ffffff22"); T("пропустить ⏭", W - 105, H - 17, 15, "#fff");
  ctx.globalAlpha = 0.35; ctx.drawImage(grain, 0, 0, W, H); ctx.globalAlpha = 1;
  G = g;
}
function drawStoryBubble(c, text, a, i) {
  const hp = headPos(c), lines = wrap(text, 360, 28);
  ctx.save(); ctx.globalAlpha = a; ctx.font = "400 28px Neucha, Rubik";
  const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 40, h = lines.length * 31 + 24;
  const x = clamp(hp.x - w / 2, 40, W - w - 40), y = Math.max(110 + i * 8, hp.y - (c.kind === "human" ? c.head.h * c.sc : 40) - h - 46 - i * 6);
  shape([hp.x - 14, y + h - 4, hp.x + 16, y + h - 4, hp.x + 4, y + h + 30], { fill: "#fff", lw: 4.5, smooth: false });
  shape([x, y + 8, x + w * .5, y - 4, x + w, y + 6, x + w + 6, y + h * .5, x + w - 2, y + h, x + w * .5, y + h + 4, x + 2, y + h - 3, x - 6, y + h * .5], { fill: "#fff", lw: 5 });
  lines.forEach((l, k) => T(l, x + w / 2, y + 28 + k * 31, 28, INK, "center", "Neucha", 400));
  ctx.restore();
}
// клик по холсту: дальше или «пропустить»
cv.addEventListener("pointerdown", e => {
  if (mode !== "cutscene") return;
  const r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * W, y = (e.clientY - r.top) / r.height * H;
  initAudio();
  if (x > W - 200 && y > H - 40) csSkip(); else csNext();
});

// --- места, где катсцены вызываются ---
// перед уровнем: пролог (только перед первым), сцена «до»
function storyBefore(i, then) {
  if (i < 0) return playStory("endless", STORY.endless, then);
  const L = LEVELS[i];
  const go = () => playStory("before_" + L.id, STORY.before[L.id], then);
  if (i === 0) playStory("prologue", STORY.prologue, go); else go();
}
// после победы: сцена «после»
function storyAfter(L, then) { if (L.endless) return then(); playStory("after_" + L.id, STORY.after[L.id], then); }
// список всех увиденных сцен для пересмотра из меню
function storyAll() {
  const out = [];
  const add = (key, pages) => { if (storySeen(key)) out.push(...pages); };
  add("prologue", STORY.prologue);
  for (const L of LEVELS) { add("before_" + L.id, STORY.before[L.id] || []); add("after_" + L.id, STORY.after[L.id] || []); }
  add("endless", STORY.endless);
  return out;
}
