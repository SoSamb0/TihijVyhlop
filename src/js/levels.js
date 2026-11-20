// ================= УРОВНИ =================
const P_YOU = () => CH("Ты", 0, { skin: "#ffc9a3", head: { w: 52, h: 60, jaw: 1.12, skull: .82 }, eyes: { l: 1.15, r: .85, gap: .4, dy: 3 }, nose: { t: "potato", s: 1.5 }, brow: "thick", hair: "bald3", teeth: "buck", ears: 1.3, body: { w: 72, h: 62, col: LIME, pants: PUR, fat: .68 } });
const LEVELS = [
  {
    id: "home", hard: 0.9, em: "🛋️", name: "Диван у телика", skulls: 1, base: 34, surface: 0.6, surfName: "мягкий диван", g0: 0.9, sp: [13, 17], spT: [8, 10],
    stink: 1.3, decay: 0.09, wind: () => 0, closed: true, vents: [{ x: 165, w: 140, k: 1.6, name: "форточка" }], focus: { x: 1090, y: 330 }, tint: 900, px: 640,
    rule: "Обучение. Телик орёт, диван глушит. Облако гони влево, к форточке.",
    intro: "Понедельник. Ты только что съел шаурму дяди Толи. Батя празднует твою последнюю холостую неделю, баба Зина дремлет. Или уже не дремлет — с обеда никто не проверял.",
    win: "Серия кончилась. Ты выжил. Баба Зина, кстати, тоже — проверили.", lose: "Семья пересмотрела завещание. Квартиру получил Барсик.",
    tips: ["Слабый залп ничего не выпускает: держи пробел подольше.", "Баба Зина иногда включает слуховой аппарат (🦻) и слышит ВСЁ.", "Барсик сидит между тобой и бабой Зиной: подгони облако к нему — и виноват кот."],
    npcs: [
      CH("Батя", 255, { skin: "#f2a57e", head: { w: 56, h: 52, jaw: 1.2, skull: .85 }, eyes: { l: .8, r: .9, gap: .4, bags: true, vein: true }, nose: { t: "potato", s: 1.6, col: "#e0245e" }, brow: "uni", must: true, hair: "comb", hairC: "#3a2616", stubble: true, chin2: true, body: { w: 96, h: 66, pat: "mayka", pants: "#2b4a8a", fat: .78 }, prop: "beer", hear: 1.0, beh: { watch: .75, phone: .1, stare: .15 } }),
      CH("Баба Зина", 450, { skin: "#f6d9c4", head: { w: 46, h: 52, jaw: .95 }, eyes: { l: .8, r: .8, gap: .42, bags: true }, nose: { t: "hook", s: 1.3 }, brow: "thin", hair: "scarf", hairC: MAG, glasses: true, wart: true, teeth: "gap", aid: { every: [15, 21], dur: 5 }, body: { w: 78, h: 60, col: PUR, pat: "dots", col2: YEL, pants: "#5a3a2a", fat: .7 }, hear: 0.7, beh: { sleep: .6, watch: .3, stare: .1 } }),
      CH("Барсик", 545, { kind: "cat", y: 452, hear: 1.3, sm: 0.15, scape: true, beh: { sleep: .5, watch: .2, stare: .3 } })
    ],
    events: [
      { name: "Смех за кадром", icon: "😂", amb: 22, dur: [2, 3], every: [6, 9], warn: 1.5, snd: "laugh" },
      { name: "Реклама на полную", icon: "📺", amb: 30, dur: [5, 7], every: [15, 21], warn: 3, snd: "ads" },
      { name: "ГОООЛ!", icon: "⚽", amb: 46, dur: [2.5, 3.5], every: [17, 25], warn: 2.5, snd: "crowd" }
    ]
  },
  {
    id: "metro", hard: 1.03, em: "🚇", name: "Метро в час пик", skulls: 2, base: 46, surface: 0.9, surfName: "пластиковое сиденье", g0: 1.0, sp: [15, 19], spT: [7.5, 9.5],
    stink: 0.9, decay: 0.08, wind: () => 28, closed: true, vents: [], focus: { x: 640, y: 250 }, tint: 400, px: 600,
    rule: "Сквозняк тянет облако вправо. На остановке тихо, зато двери открыты: всё вылетает влево.",
    intro: "Вторник, утро. Час пик. 47 человек на квадратный метр, а внутри тебя — шаурма. Отступать некуда.",
    win: "Твоя станция. Ты выходишь героем. Сзади кто-то потерял сознание, но это не доказать.", lose: "Тебя сняли и выложили в «Подслушано в метро». 40 тысяч лайков. Мама тоже лайкнула.",
    tips: ["Кеша в наушниках глухой, но на остановке он их снимает.", "Тётя Люда — сплетница: если что заметит, насторожит весь вагон.", "Дед Пихто спит справа. Сквозняк сам несёт облако к нему."],
    npcs: [
      CH("Тётя Люда", 395, { skin: "#f2a57e", head: { w: 56, h: 54, jaw: 1.15 }, eyes: { l: 1.1, r: 1.1, gap: .4 }, nose: { t: "pig", s: 1.2 }, brow: "thin", hair: "afro", hairC: "#c2185b", lips: true, chin2: true, earring: true, gossip: true, body: { w: 92, h: 64, col: MAG, pat: "dots", col2: YEL, pants: "#333", fat: .76 }, prop: "bags", hear: 1.15, beh: { stare: .4, watch: .4, phone: .2 } }),
      CH("Кеша", 800, { skin: "#e8d08a", head: { w: 42, h: 60, jaw: .7 }, eyes: { l: .7, r: .7, gap: .45, bags: true }, nose: { t: "long", s: 1 }, hair: "spikes", hairC: CYAN, hp: true, body: { w: 62, h: 66, col: INK, pants: "#555", fat: .5 }, hear: 0.9, beh: { phone: .8, watch: .15, stare: .05 } }),
      CH("Дед Пихто", 990, { skin: "#d9a98a", head: { w: 48, h: 54, jaw: 1.0 }, eyes: { l: .9, r: .9, gap: .42, bags: true }, nose: { t: "potato", s: 1.7, col: "#c2185b" }, brow: "thick", hair: "ushanka", hairC: "#6b4a2a", beard: true, beardC: "#e8e8e8", scape: true, body: { w: 78, h: 62, col: "#6b7a3a", pat: "hatch", pants: "#3a3a3a" }, hear: 0.6, beh: { sleep: .75, watch: .15, stare: .1 } })
    ],
    events: [
      { name: "Остановка: ТИШИНА, двери", icon: "🚪", amb: -36, dur: [4.5, 5.5], every: [13, 17], warn: 3, snd: "brakes", calm: true, tint: 1500, doors: true, wind: -170, open: true },
      { name: "Объявление", icon: "📢", amb: 16, dur: [3, 3], every: [10, 15], warn: 1, snd: "announce" },
      { name: "Скрежет в тоннеле", icon: "⚙️", amb: 26, dur: [2, 3], every: [8, 12], warn: 1.5, snd: "screech" }
    ]
  },
  {
    id: "office", hard: 0.8, em: "💼", name: "Опенспейс", skulls: 2, base: 22, surface: 1.0, surfName: "кожзам-кресло", g0: 1.0, sp: [16, 20], spT: [7.5, 9.5],
    stink: 1.2, decay: 0.07, wind: t => Math.sin(t * 0.5) * 75, closed: true, vents: [{ x: 1165, w: 100, k: 1.4, name: "вытяжка" }], focus: { x: 640, y: 380 }, tint: 1200, px: 620,
    rule: "Кондиционер гоняет воздух туда-сюда. Начальник ходит и нюхает всё на своём пути.",
    intro: "Вторник. Квартальный отчёт и слухи о сокращениях. Один громкий звук — и ты первый в списке.",
    win: "Рабочий день окончен. Сократили Виталика. Совпадение? Лучше не думай.", lose: "Тебя не уволили. Хуже: теперь тебя зовут «Пердунов» даже в приказах.",
    tips: ["Не сиди в собственном облаке, когда мимо идёт шеф.", "Смотри на пылинки: они показывают, куда дует.", "Вытяжка справа съедает облако."],
    npcs: [
      CH("Света", 400, { skin: "#ffd9c0", head: { w: 44, h: 56, jaw: .75 }, eyes: { l: 1.2, r: 1.2, gap: .45 }, nose: { t: "button", s: 1 }, hair: "bob", hairC: YEL, lips: true, blushC: "#ff2d9566", body: { w: 68, h: 62, col: ORG, pants: "#333", fat: .55 }, hear: 1.0, beh: { watch: .45, phone: .35, stare: .2 } }),
      CH("Шеф", 200, { pose: "stand", y: 470, skin: "#e89a8a", head: { w: 58, h: 60, jaw: 1.25, skull: .8 }, eyes: { l: .6, r: .6, gap: .36, vein: true }, nose: { t: "pig", s: 1.4 }, brow: "uni", hair: "comb", hairC: "#222", chin2: true, teeth: "gold", body: { w: 96, h: 72, col: "#2b2b55", pat: "suit", col2: MAG, pants: "#1b1b3a", fat: .8 }, hear: 1.3, sm: 1.2, nosey: 4.5, walk: { a: 170, b: 1120, speed: 55 }, beh: { watch: .55, stare: .45 } }),
      CH("Виталик", 860, { skin: "#f6e0b0", head: { w: 40, h: 58, jaw: .65, skull: 1.1 }, eyes: { l: 1.3, r: 1.0, gap: .5, lazy: true }, nose: { t: "long", s: .9 }, hair: "bowl", hairC: ORG, glasses: true, teeth: "buck", ears: 1.5, scape: true, body: { w: 60, h: 62, col: LIME, pat: "stripes", col2: "#0a7", pants: "#444", fat: .5 }, hear: 0.8, beh: { phone: .6, watch: .3, stare: .1 } })
    ],
    events: [
      { name: "Принтер", icon: "🖨️", amb: 28, dur: [3.5, 5], every: [11, 16], warn: 2, snd: "printer" },
      { name: "Звонок телефона", icon: "📞", amb: 22, dur: [2.5, 4], every: [9, 13], warn: 1, snd: "ring" },
      { name: "Тишина: шеф о сокращениях", icon: "🤫", amb: -14, dur: [5, 6], every: [22, 28], warn: 3, calm: true }
    ]
  },
  {
    id: "date", hard: 1.05, em: "🍝", name: "Свидание", skulls: 3, base: 20, surface: 1.1, surfName: "деревянный стул", g0: 1.1, sp: [16, 21], spT: [7.5, 9.5],
    stink: 1.3, decay: 0.06, wind: () => 14, closed: true, vents: [], candle: 640, focus: { x: 810, y: 470 }, tint: 1000, px: 470,
    rule: "Лена смотрит тебе в лицо: нельзя долго тужиться (сила выше 55% под её взглядом). Облако можно сжечь над свечой.",
    intro: "Среда. Последний ужин с Леной перед свадьбой. Ты заказал фасолевый суп. Ты всегда принимаешь плохие решения.",
    win: "Она согласилась на четвёртое свидание. Если бы она только знала...", lose: "Она ушла. Через полгода выйдет за официанта. На свадьбе будут рассказывать про тебя.",
    tips: ["Набирай силу, пока Лена в телефоне (📱).", "Задержи облако над свечой: ПЫХ — и улик нет. Если просто пролетит мимо — не сгорит.", "У официанта Жоржа очень тонкий нюх."],
    npcs: [
      CH("Лена", 810, { skin: "#ffd9c0", head: { w: 46, h: 56, jaw: .7 }, eyes: { l: 1.3, r: 1.3, gap: .46 }, nose: { t: "button", s: .9 }, hair: "long", hairC: "#3a0a3a", lips: true, blushC: "#ff2d9566", earring: true, faceWatch: true, body: { w: 64, h: 62, col: MAG, pants: "#333", fat: .5 }, hear: 1.1, sm: 1.2, beh: { stare: .45, phone: .35, watch: .2 } }),
      CH("Жорж", 300, { pose: "stand", y: 470, skin: "#f6e0b0", head: { w: 40, h: 64, jaw: .7, tilt: -.08 }, eyes: { l: .6, r: .6, gap: .42 }, nose: { t: "hook", s: 1.8 }, brow: "thin", hair: "comb", hairC: INK, must: true, body: { w: 62, h: 76, col: "#fff", pat: "bow", pants: INK, fat: .5 }, hear: 0.9, nosey: 3.5, walk: { a: 170, b: 1150, speed: 70 }, beh: { watch: .7, stare: .3 } }),
      CH("Старик", 1090, { skin: "#d9a98a", head: { w: 46, h: 52, jaw: 1.0 }, eyes: { l: .8, r: .8, gap: .42, bags: true }, nose: { t: "potato", s: 1.5 }, hair: "bald3", glasses: true, scape: true, body: { w: 72, h: 60, col: "#6b5b45", pat: "hatch", pants: "#333" }, hear: 0.5, beh: { sleep: .6, watch: .3, stare: .1 } })
    ],
    events: [
      { name: "Скрипач у столика", icon: "🎻", amb: 40, dur: [5, 7], every: [14, 19], warn: 3, snd: "violin" },
      { name: "Разбили посуду", icon: "🍽️", amb: 48, dur: [2, 2.5], every: [11, 17], warn: 1, snd: "crash" },
      { name: "Смех за соседним столом", icon: "😂", amb: 24, dur: [2, 3], every: [8, 12], warn: 1, snd: "laugh" }
    ]
  },
  {
    id: "cinema", hard: 1.1, em: "🎬", name: "Кинотеатр", skulls: 3, base: 13, surface: 0.75, surfName: "бархатное кресло", g0: 1.1, sp: [17, 22], spT: [7, 9],
    stink: 1.2, decay: 0.07, wind: () => -22, closed: false, vents: [{ x: 150, w: 90, k: 1.2, name: "выход" }], dark: true, focus: { x: 640, y: 150 }, tint: 600, px: 620,
    rule: "Темно. Кто на тебя смотрит, видно только во время вспышек на экране.",
    intro: "Среда, полночь. Не спится. Арт-хаус про смерть, три часа, половина фильма — многозначительная тишина.",
    win: "Титры. Критик плакал. Он думает, что от фильма.", lose: "Вовочка показал на тебя пальцем. Зал аплодировал. Это была лучшая сцена фильма.",
    tips: ["Взрыв на экране — идеальное прикрытие и вспышка света.", "Вовочка-ябеда орёт на весь зал: от него подозрение ×2.", "Парочка слева занята друг другом и почти глуха."],
    npcs: [
      CH("Он", 320, { skin: "#f2a57e", head: { w: 44, h: 54, jaw: 1.0 }, eyes: { l: .8, r: .8, gap: .42 }, nose: { t: "potato", s: 1.1 }, hair: "buzz", hairC: "#222", stubble: true, body: { w: 72, h: 62, col: "#3355ff", pants: "#222" }, hear: 0.3, beh: { watch: .85, stare: .15 } }),
      CH("Она", 415, { skin: "#ffd9c0", head: { w: 40, h: 52, jaw: .75, tilt: -.15 }, eyes: { l: 1.1, r: 1.1, gap: .45 }, nose: { t: "button" }, hair: "pony", hairC: LIME, lips: true, body: { w: 60, h: 58, col: MAG, pants: "#222", fat: .5 }, hear: 0.3, beh: { watch: .85, stare: .15 } }),
      CH("Критик Аристарх", 830, { skin: "#e8d08a", head: { w: 44, h: 64, jaw: .8, skull: 1.05 }, eyes: { l: .7, r: .7, gap: .4, bags: true }, nose: { t: "hook", s: 1.5 }, brow: "thick", hair: "beret", hairC: INK, glasses: true, must: true, beard: true, beardC: "#555", body: { w: 68, h: 66, col: "#222", pants: "#111" }, hear: 1.8, beh: { watch: .7, stare: .3 } }),
      CH("Вовочка", 985, { sc: .82, skin: "#ffc9a3", head: { w: 48, h: 48, jaw: 1.1 }, eyes: { l: 1.3, r: 1.1, gap: .44 }, nose: { t: "pig", s: .9 }, hair: "spikes", hairC: ORG, teeth: "gap", ears: 1.5, snitch: true, body: { w: 58, h: 46, col: YEL, pat: "stripes", col2: "#e0245e", pants: "#225" }, hear: 1.0, sm: 2.0, beh: { watch: .6, stare: .4 } })
    ],
    events: [
      { name: "ВЗРЫВ на экране", icon: "💥", amb: 55, dur: [2.2, 3], every: [10, 15], warn: 2, snd: "boom", flash: true },
      { name: "Погоня", icon: "🏎️", amb: 30, dur: [4, 6], every: [13, 19], warn: 2, snd: "chase", flash: true },
      { name: "Драматичная тишина", icon: "🤫", amb: -12, dur: [5, 6.5], every: [15, 21], warn: 3, calm: true }
    ]
  },
  {
    id: "elevator", hard: 0.95, em: "🛗", name: "Лифт застрял", skulls: 4, base: 14, surface: 1.0, surfName: "стоишь (ноль амортизации)", g0: 1.1, sp: [17, 22], spT: [7, 9],
    stink: 1.4, decay: 0.012, wind: () => 0, closed: true, xmin: 250, xmax: 1030, vents: [], focus: { x: 640, y: 200 }, tint: 900, px: 620, standAll: true,
    rule: "Воздух не уходит: облака копятся. Выгнать их можно только когда двери приоткрываются (справа).",
    intro: "Четверг. Едешь в ЗАГС подавать документы. Лифт встал между 13 и 14 этажами. Воздух общий. Пока что.",
    win: "Лифт поехал. Ты вышел первым. Остальных откачивали минут пять.", lose: "Пожарные открыли двери и отказались заходить. Тебя оставили там до утра.",
    tips: ["Мопс Жужа идёт на запах и лает на того, кто ближе к облаку.", "Копи облако у правой стены и жди, когда двери дёрнутся.", "Чем крупнее залп, тем больше облако. А деваться ему некуда."],
    npcs: [
      CH("Толян", 410, { pose: "stand", y: 470, skin: "#e89a8a", head: { w: 44, h: 46, jaw: 1.3, skull: .8 }, eyes: { l: .55, r: .55, gap: .36 }, nose: { t: "pig", s: 1.1 }, brow: "uni", hair: "buzz", hairC: "#222", stubble: true, ears: .7, body: { w: 118, h: 80, col: "#111", pat: "mayka", pants: "#2b2b8a", fat: .7 }, hear: 1.2, beh: { phone: .5, stare: .3, watch: .2 } }),
      CH("Бабуля Роза", 800, { pose: "stand", y: 470, sc: .92, skin: "#f6d9c4", head: { w: 46, h: 50, jaw: .95 }, eyes: { l: .9, r: .9, gap: .42, bags: true }, nose: { t: "hook", s: 1.2 }, hair: "bun", hairC: "#c9a0ff", glasses: true, lips: true, wart: true, scape: true, body: { w: 76, h: 62, col: "#c2185b", pat: "dots", col2: "#fff", pants: "#5a3a2a", fat: .7 }, hear: 0.9, beh: { stare: .4, watch: .5, sleep: .1 } }),
      CH("Жужа", 930, { kind: "dog", y: 580, hear: 1.2, sm: 0.15, sniffer: true, beh: { watch: .5, stare: .4, sleep: .1 } })
    ],
    events: [
      { name: "Скрип троса", icon: "🔩", amb: 36, dur: [2, 3], every: [9, 13], warn: 1.5, snd: "screech" },
      { name: "Лифт дёрнулся!", icon: "⚠️", amb: 50, dur: [2, 2.6], every: [14, 20], warn: 2, snd: "boom" },
      { name: "Диспетчер по связи", icon: "📢", amb: 30, dur: [3, 3.5], every: [12, 17], warn: 1, snd: "announce" },
      { name: "Двери приоткрылись", icon: "🚪", amb: 6, dur: [3, 3.5], every: [13, 18], warn: 2.5, snd: "ding", vent: { x: 1030, w: 160, k: 3 }, wind: 110 }
    ]
  },
  {
    id: "library", hard: 1.15, em: "📚", name: "Библиотека", skulls: 4, base: 12, surface: 1.05, surfName: "деревянная скамья", g0: 0.9, sp: [15, 19], spT: [8, 10],
    stink: 0.95, decay: 0.08, wind: () => -16, closed: true, vents: [{ x: 170, w: 100, k: 1.5, name: "окно" }], focus: { x: 640, y: 520 }, tint: 2500, px: 600,
    rule: "Почти полная тишина. Сбросить давление можно только под кашель, часы и падающие книги.",
    intro: "Четверг, вечер. Ищешь лекарство от проклятой шаурмы. Изольда Марковна работает тут с 1974 года. Она слышала всё.",
    win: "Ты вышел незамеченным. Изольда Марковна всё равно записала тебя в чёрную книжечку.", lose: "Тебя внесли в чёрный список. Пожизненно. Изольда Марковна переживёт нас всех.",
    tips: ["Изольда Марковна слышит лучше всех. Не рискуй, когда она смотрит на тебя.", "Окно слева: лёгкий сквозняк тянет облако туда, мимо ботаника.", "Стопка книг падает громче всего: будь готов."],
    npcs: [
      CH("Ботаник", 390, { skin: "#f6e0b0", head: { w: 42, h: 64, jaw: .7, skull: 1.15 }, eyes: { l: 1.2, r: 1.2, gap: .46 }, nose: { t: "long", s: 1.1 }, hair: "comb", hairC: "#553", glasses: true, teeth: "buck", ears: 1.4, body: { w: 60, h: 62, col: LIME, pat: "stripes", col2: "#083", pants: "#444", fat: .5 }, hear: 1.0, beh: { watch: .75, stare: .25 } }),
      CH("Соня", 800, { skin: "#ffd9c0", head: { w: 46, h: 52, jaw: .9, tilt: .2 }, eyes: { l: 1, r: 1, gap: .42, bags: true }, nose: { t: "button" }, hair: "messy", hairC: CYAN, scape: true, body: { w: 68, h: 60, col: PUR, pants: "#333" }, hear: 0.5, beh: { sleep: .8, watch: .1, stare: .1 } }),
      CH("Изольда Марковна", 1075, { y: 480, skin: "#e8d0c0", head: { w: 44, h: 62, jaw: .75 }, eyes: { l: .7, r: .7, gap: .4, vein: true }, nose: { t: "hook", s: 1.6 }, brow: "thin", hair: "bun", hairC: "#8a8a9a", glasses: true, wart: true, lips: true, body: { w: 70, h: 66, col: "#4a1a6a", pat: "bow", pants: "#222", fat: .55 }, hear: 1.6, sm: 1.2, beh: { stare: .45, watch: .55 } })
    ],
    events: [
      { name: "Кто-то кашляет", icon: "😷", amb: 28, dur: [2.2, 2.8], every: [5, 7], warn: 1, snd: "cough" },
      { name: "Упала стопка книг!", icon: "📚", amb: 46, dur: [2.6, 3.2], every: [10, 14], warn: 2, snd: "crash" },
      { name: "Бьют часы", icon: "🕰️", amb: 38, dur: [3, 3.5], every: [16, 21], warn: 3, snd: "clock" }
    ]
  },
  {
    id: "exam", hard: 0.95, em: "📝", name: "Экзамен", skulls: 4, base: 9, surface: 1.1, surfName: "школьный стул", g0: 1.0, sp: [16, 20], spT: [7.5, 9.5],
    stink: 1.25, decay: 0.06, wind: () => 16, closed: true, vents: [{ x: 1165, w: 100, k: 1.5, name: "окно" }], focus: { x: 640, y: 540 }, tint: 2000, px: 620,
    rule: "Зубрилина следит за тобой почти не отрываясь и ябедничает. Препод ходит между рядами.",
    intro: "Пятница, утро. Тёща поставила условие: без диплома дочь не отдаст. Это пересдача, которую ты завалил 15 лет назад.",
    win: "Тройка! Жить можно. Недолго, но можно.", lose: "Отчислен. Не за запах — за моральный ущерб Зубрилиной. Она до сих пор ходит к психологу.",
    tips: ["Гром за окном — подарок небес.", "Колян справа списывает и ничего не замечает. Идеальный виноватый.", "Когда препод рядом — замри и не тужься."],
    npcs: [
      CH("Зубрилина", 415, { skin: "#ffd9c0", head: { w: 42, h: 54, jaw: .8 }, eyes: { l: 1.2, r: 1.2, gap: .46 }, nose: { t: "button", s: 1.1 }, brow: "thin", hair: "pigtails", hairC: "#6b3e26", glasses: true, teeth: "buck", snitch: true, body: { w: 62, h: 60, col: "#fff", pat: "bow", pants: "#225", fat: .5 }, hear: 1.1, sm: 1.6, beh: { stare: .65, watch: .35 } }),
      CH("Колян", 850, { skin: "#e89a8a", head: { w: 50, h: 50, jaw: 1.15, skull: .85 }, eyes: { l: .8, r: .6, gap: .4, bags: true }, nose: { t: "potato", s: 1.3 }, brow: "uni", hair: "cap", hairC: MAG, stubble: true, cig: false, scape: true, body: { w: 78, h: 62, col: "#333", pat: "stripes", col2: "#fff", pants: "#222" }, hear: 0.6, beh: { phone: .5, sleep: .3, watch: .2 } }),
      CH("Препод", 700, { pose: "stand", y: 470, skin: "#d9a98a", head: { w: 50, h: 62, jaw: .9 }, eyes: { l: .8, r: .8, gap: .4, bags: true, vein: true }, nose: { t: "long", s: 1.4 }, brow: "thick", hair: "bald3", must: true, mustC: "#999", glasses: true, body: { w: 78, h: 74, col: "#7c5c3c", pat: "hatch", pants: "#3a2a1a" }, hear: 1.2, sm: 1.1, nosey: 4.5, walk: { a: 180, b: 1110, speed: 42 }, beh: { stare: .4, watch: .6 } })
    ],
    events: [
      { name: "Препод кашляет", icon: "😷", amb: 28, dur: [2, 2.6], every: [7, 10], warn: 1, snd: "cough" },
      { name: "Гром за окном", icon: "⛈️", amb: 60, dur: [2.6, 3.2], every: [13, 18], warn: 2.5, snd: "thunder" },
      { name: "Ремонт у соседей", icon: "🔨", amb: 36, dur: [3.5, 5], every: [13, 18], warn: 2, snd: "drill" }
    ]
  },
  {
    id: "funeral", hard: 0.7, em: "⚰️", name: "Похороны дяди Толи", skulls: 5, base: 6, surface: 1.2, surfName: "церковная скамья", g0: 1.1, sp: [17, 21], spT: [7, 9],
    stink: 1.25, decay: 0.05, wind: () => 12, closed: true, vents: [{ x: 1195, w: 110, k: 1.6, name: "ладан" }], props: [{ n: "дядя Толя (покойник)", x: 1000, scape: true }], focus: { x: 1000, y: 460 }, tint: 700, px: 560,
    rule: "Долгие минуты молчания. Зато рядом покойник: догони облако до гроба — и виноват он. Ладан батюшки глушит запах.",
    intro: "Пятница. Дядя Толя умер — от собственной шаурмы. Он всегда говорил: «На моих похоронах не грустите». Тебе точно будет не до грусти.",
    win: "Дядю Толю похоронили. Вместе с твоей тайной. Он бы гордился.", lose: "Вдова назвала это худшим днём в своей жизни. И дело было не в дяде Толе.",
    tips: ["Оркестр играет громко и долго: копи к нему.", "Перед минутой молчания выпусти всё, что можешь.", "«Посмертные газы — научный факт»."],
    npcs: [
      CH("Вдова", 355, { skin: "#f6d9c4", head: { w: 44, h: 54, jaw: .8 }, eyes: { l: 1, r: 1, gap: .42, bags: true, vein: true }, nose: { t: "button", s: 1.2, col: "#e0245e" }, hair: "veil", lips: true, body: { w: 70, h: 62, col: "#1b1b1b", pants: "#111" }, hear: 0.7, beh: { watch: .8, stare: .2 } }),
      CH("Тётя Галя", 775, { skin: "#f2a57e", head: { w: 58, h: 54, jaw: 1.2 }, eyes: { l: .9, r: .9, gap: .4 }, nose: { t: "pig", s: 1.3 }, brow: "thick", hair: "afro", hairC: "#8a0a2a", glasses: true, lips: true, chin2: true, wart: true, gossip: true, body: { w: 94, h: 64, col: "#222", pat: "dots", col2: "#555", pants: "#111", fat: .78 }, hear: 1.6, sm: 1.2, beh: { stare: .45, watch: .55 } }),
      CH("Батюшка", 1195, { pose: "stand", y: 470, skin: "#e8c0a0", head: { w: 48, h: 58, jaw: 1.0 }, eyes: { l: .8, r: .8, gap: .42 }, nose: { t: "potato", s: 1.3 }, brow: "thick", hair: "long", hairC: "#444", beard: true, beardC: "#666", body: { w: 96, h: 78, col: "#111", pat: "cross", pants: "#111", fat: .75 }, prop: "censer", hear: 1.0, beh: { watch: .7, stare: .3 } })
    ],
    events: [
      { name: "Похоронный оркестр", icon: "🎺", amb: 46, dur: [6, 7.5], every: [13, 17], warn: 3, snd: "march" },
      { name: "Рыдания вдовы", icon: "😭", amb: 34, dur: [3, 4.5], every: [7, 10], warn: 1.5, snd: "cry" },
      { name: "МИНУТА МОЛЧАНИЯ", icon: "🤫", amb: -7, dur: [8, 9], every: [18, 22], warn: 4, calm: true, tint: 3000 }
    ]
  },
  {
    id: "yoga", hard: 1.0, em: "🧘", name: "Ретрит молчания", skulls: 5, base: 6, surface: 0.85, surfName: "коврик для йоги", g0: 1.1, sp: [17, 21], spT: [7, 9],
    stink: 1.3, decay: 0.05, wind: () => 0, closed: true, vents: [{ x: 180, w: 100, k: 1.5, name: "аромалампа" }], focus: { x: 1060, y: 420 }, tint: 2500, px: 580, lotusAll: true,
    rule: "Позы всё меняют. «Собака мордой вниз»: громкость ×1.6 и +12 давления. «Поза ребёнка»: громкость ×0.5 — твой шанс.",
    intro: "Суббота, 7 утра. До свадьбы пять часов. Гуру Шанти обещал очистить карму и кишечник за одно утро.",
    win: "Ты достиг просветления. Буквально: тебе стало очень, очень легко.", lose: "Тебя изгнали с ретрита. Карма испорчена на три перерождения. В следующей жизни ты — скунс.",
    tips: ["Почти абсолютная тишина.", "Хоровое «Ом-м-м» и гонг — единственное громкое, что тут есть.", "Аромалампа слева съедает облако."],
    npcs: [
      CH("Дама в лосинах", 350, { y: 540, pose: "lotus", skin: "#f2a57e", head: { w: 42, h: 54, jaw: .75 }, eyes: { l: 1.2, r: 1.2, gap: .46 }, nose: { t: "button" }, hair: "pony", hairC: YEL, lips: true, blushC: "#ff2d9566", body: { w: 62, h: 62, col: MAG, pat: "stripes", col2: CYAN, pants: CYAN, fat: .5 }, hear: 1.2, beh: { meditate: .6, stare: .25, watch: .15 } }),
      CH("Веган Святослав", 800, { y: 540, pose: "lotus", skin: "#c7e8a0", head: { w: 44, h: 60, jaw: .75 }, eyes: { l: .9, r: .9, gap: .42, bags: true }, nose: { t: "long", s: 1.2 }, hair: "manbun", hairC: "#6b4423", beard: true, beardC: "#6b4423", scape: true, body: { w: 60, h: 66, col: PAPER, pat: "hatch", pants: "#b98", fat: .45 }, hear: 0.9, beh: { meditate: .8, stare: .2 } }),
      CH("Гуру Шанти", 1070, { y: 540, pose: "lotus", skin: "#e8b07a", head: { w: 50, h: 56, jaw: 1.05 }, eyes: { l: .9, r: .9, gap: .42 }, nose: { t: "potato", s: 1.2 }, brow: "thick", hair: "none", dot: true, ears: 1.6, earring: true, chin2: true, body: { w: 92, h: 66, col: ORG, pants: ORG, fat: .78 }, hear: 1.6, sm: 1.2, beh: { meditate: .5, stare: .5 } })
    ],
    events: [
      { name: "Хоровое «Ом-м-м»", icon: "🕉️", amb: 36, dur: [4, 5], every: [9, 12], warn: 2, snd: "om" },
      { name: "Поющая чаша", icon: "🥣", amb: 24, dur: [3, 3.5], every: [7, 10], warn: 1, snd: "bowl" },
      { name: "ГОНГ", icon: "🔔", amb: 50, dur: [2.2, 2.8], every: [12, 16], warn: 2, snd: "gong" },
      { name: "Собака мордой вниз", icon: "🐕", amb: 0, dur: [5, 6], every: [19, 25], warn: 3, loudMult: 1.6, pressureAdd: 12, pose: "dog", bad: true },
      { name: "Поза ребёнка", icon: "👶", amb: 0, dur: [4.5, 5.5], every: [16, 22], warn: 2, loudMult: 0.5, pose: "child" }
    ]
  },
  {
    id: "wedding", hard: 0.95, em: "💒", name: "Свадьба (финал)", skulls: 5, base: 10, surface: 1.0, surfName: "стоишь у алтаря", g0: 1.1, sp: [17, 21], spT: [7, 9],
    stink: 1.3, decay: 0.05, wind: () => 10, closed: true, vents: [{ x: 1235, w: 60, k: 1.8, name: "балкон" }], focus: { x: 760, y: 380 }, tint: 1400, px: 580, standAll: true, boss: true,
    rule: "ФИНАЛ. Всё идёт по сценарию: на клятвах и фото на тебя смотрят ВСЕ. Зато «Горько!» и салют — громче всего в игре.",
    intro: "Суббота. Твоя свадьба. Рядом Лена в белом, сзади тёща. Шаурма дяди Толи всё ещё здесь. Это последний бой.",
    win: "Вы женаты! Лена ничего не заподозрила. Тёща — заподозрила, но промолчала: ей это ещё пригодится.", lose: "Свадьбу сняли на три камеры. Видео посмотрели 4 миллиона раз. Лена ушла к тамаде.",
    tips: ["Сценарий одинаковый каждый раз: выучи его.", "На клятвах и фото все смотрят на тебя: не стреляй, даже если очень хочется.", "Балкон справа: туда можно выгнать облако. Тамада Гоша стоит рядом с невестой, пьян и отлично подходит на роль виноватого."],
    npcs: [
      CH("Тёща Тамара", 330, { pose: "stand", y: 470, skin: "#f2a57e", head: { w: 54, h: 56, jaw: 1.15 }, eyes: { l: .85, r: .85, gap: .4, vein: true }, nose: { t: "hook", s: 1.4 }, brow: "thick", hair: "afro", hairC: "#7a2cff", lips: true, chin2: true, earring: true, gossip: true, body: { w: 92, h: 70, col: "#c2185b", pat: "dots", col2: YEL, pants: "#333", fat: .78 }, hear: 1.3, beh: { stare: .45, watch: .55 } }),
      CH("Невеста Лена", 760, { pose: "stand", y: 470, skin: "#ffd9c0", head: { w: 44, h: 56, jaw: .72 }, eyes: { l: 1.3, r: 1.3, gap: .46 }, nose: { t: "button", s: .9 }, hair: "veil", veilC: "#ffffffdd", lips: true, blushC: "#ff2d9566", faceWatch: true, body: { w: 66, h: 74, col: "#fff", pat: "dots", col2: "#ffd6ec", pants: "#fff", fat: .7 }, shoe: "#fff", hear: 1.0, sm: 1.3, beh: { stare: .5, watch: .3, phone: .2 } }),
      CH("Регистратор Нина Петровна", 1110, { pose: "stand", y: 470, skin: "#e8d0c0", head: { w: 46, h: 60, jaw: .8 }, eyes: { l: .8, r: .8, gap: .42 }, nose: { t: "long", s: 1.3 }, brow: "thin", hair: "bun", hairC: "#3a2616", glasses: true, lips: true, body: { w: 76, h: 74, col: "#2b4a8a", pat: "bow", pants: "#222" }, hear: 1.2, beh: { watch: .65, stare: .35 } }),
      CH("Тамада Гоша", 950, { pose: "stand", y: 470, skin: "#f2a57e", head: { w: 50, h: 54, jaw: 1.1, tilt: .12 }, eyes: { l: .7, r: .9, gap: .4, bags: true, vein: true }, nose: { t: "potato", s: 1.6, col: "#e0245e" }, brow: "uni", hair: "mullet", hairC: "#6b4a2a", must: true, blushC: "#ff2d9588", scape: true, body: { w: 82, h: 72, col: YEL, pat: "suit", col2: MAG, pants: "#222", fat: .7 }, hear: 0.6, beh: { watch: .5, sleep: .2, stare: .3 } })
    ],
    events: [
      { at: 1.5, name: "Марш: выход невесты", icon: "🎻", amb: 34, dur: [5, 5], warn: 1.5, snd: "violin" },
      { at: 7, name: "Речь регистратора", icon: "🎤", amb: 22, dur: [5, 5], warn: 1.5, snd: "announce" },
      { at: 13, name: "КЛЯТВЫ: все смотрят на вас", icon: "💍", amb: -8, dur: [7, 7], warn: 4, calm: true, allStare: true },
      { at: 21, name: "«ГОРЬКО!!!»", icon: "🥂", amb: 58, dur: [3.2, 3.2], warn: 3, snd: "crowd" },
      { at: 26, name: "Первый танец", icon: "💃", amb: 36, dur: [8, 8], warn: 2, snd: "violin" },
      { at: 36, name: "Тост тамады", icon: "🎙️", amb: 30, dur: [6, 6], warn: 1.5, snd: "laugh" },
      { at: 44, name: "ФОТО: все замерли", icon: "📸", amb: -6, dur: [5, 5], warn: 3, calm: true, allStare: true },
      { at: 51, name: "«ГОРЬКО!!!» ещё раз", icon: "🥂", amb: 58, dur: [3.2, 3.2], warn: 3, snd: "crowd" },
      { at: 56, name: "Салют", icon: "🎆", amb: 62, dur: [4, 4], warn: 2, snd: "boom", flash: true }
    ]
  }
];

// ---- козырь и доп. цели для каждого уровня ----
// Козырь: один раз за уровень (кнопка E) создаёт свой громкий момент. Кто в этот миг смотрит на тебя — заподозрит.
// Цели: k — что проверяем, n — порог, who — кого подставить. Цели не влияют на звёзды.
const EXTRA = {
  home: { trump: { name: "Сделать телик погромче", icon: "📺", amb: 40, dur: 4, snd: "crowd" }, goals: [{ k: "frameWho", who: "Барсик", t: "Подставь Барсика" }, { k: "vent", n: 2, t: "Выгони 2 облака в форточку" }, { k: "noHeard", t: "Ни разу не попадись на слух" }] },
  metro: { trump: { name: "Закашляться", icon: "😷", amb: 38, dur: 3, snd: "cough" }, goals: [{ k: "frameWho", who: "Дед Пихто", t: "Подставь деда Пихто" }, { k: "big", n: 1, p: 65 }, { k: "noTrump", t: "Обойдись без козыря" }] },
  office: { trump: { name: "Уронить степлер", icon: "📎", amb: 40, dur: 2.5, snd: "crash" }, goals: [{ k: "frameWho", who: "Виталик", t: "Подставь Виталика" }, { k: "vent", n: 2, t: "Отправь 2 облака в вытяжку" }, { k: "noBlame", t: "Пусть тебя ни разу не учуют" }] },
  date: { trump: { name: "Уронить вилку", icon: "🍴", amb: 42, dur: 2.5, snd: "crash" }, goals: [{ k: "burn", n: 1, t: "Сожги облако над свечой" }, { k: "frameWho", who: "Старик", t: "Подставь старика за соседним столом" }, { k: "maxSus", n: 30, t: "Подозрение ни разу не выше 30%" }] },
  cinema: { trump: { name: "Хрустнуть попкорном", icon: "🍿", amb: 38, dur: 3, snd: "crash" }, goals: [{ k: "big", n: 2, p: 70 }, { k: "frameWho", who: "Вовочка", t: "Подставь Вовочку-ябеду" }, { k: "noHeard", t: "Ни разу не попадись на слух" }] },
  elevator: { trump: { name: "Нажать «Вызов»", icon: "🔔", amb: 45, dur: 3, snd: "ring" }, goals: [{ k: "vent", n: 2, t: "Выгони 2 облака в двери" }, { k: "frameWho", who: "Бабуля Роза", t: "Подставь бабулю Розу" }, { k: "farts", n: 6, t: "Не больше 6 залпов" }] },
  library: { trump: { name: "Чихнуть", icon: "🤧", amb: 42, dur: 2, snd: "cough" }, goals: [{ k: "frameWho", who: "Соня", t: "Подставь спящую Соню" }, { k: "noHeard", t: "Ни разу не попадись на слух" }, { k: "vent", n: 1, t: "Выгони облако в окно" }] },
  exam: { trump: { name: "Уронить пенал", icon: "✏️", amb: 40, dur: 2.5, snd: "crash" }, goals: [{ k: "frameWho", who: "Колян", t: "Подставь Коляна" }, { k: "vent", n: 1, t: "Выгони облако в окно" }, { k: "big", n: 1, p: 60 }] },
  funeral: { trump: { name: "Громко высморкаться", icon: "🤧", amb: 40, dur: 3, snd: "cough" }, goals: [{ k: "frameWho", who: "дядя Толя (покойник)", t: "Свали всё на покойника" }, { k: "vent", n: 2, t: "Утопи 2 облака в ладане" }, { k: "maxSus", n: 40, t: "Подозрение ни разу не выше 40%" }] },
  yoga: { trump: { name: "Ударить в поющую чашу", icon: "🥣", amb: 40, dur: 3.5, snd: "bowl" }, goals: [{ k: "frameWho", who: "Веган Святослав", t: "Подставь вегана Святослава" }, { k: "noTrump", t: "Обойдись без козыря" }, { k: "vent", n: 1, t: "Утопи облако в аромалампе" }] },
  wedding: { trump: { name: "Уронить кольцо", icon: "💍", amb: 42, dur: 3, snd: "crash" }, goals: [{ k: "frameWho", who: "Тамада Гоша", t: "Подставь тамаду Гошу" }, { k: "noHeard", t: "Ни разу не попадись на слух" }, { k: "big", n: 2, p: 60 }] }
};
LEVELS.forEach(L => Object.assign(L, EXTRA[L.id]));
// текст для целей «мощный залп» собирается из порога
LEVELS.forEach(L => (L.goals || []).forEach(g => { if (g.k === "big") g.t = `${g.n > 1 ? g.n + " залпа" : "Залп"} на ${g.p}%+ силы, и никто не услышал`; }));

// ---- сюжет: день недели и заголовок газеты при проигрыше (раскрыт / лопнул) ----
const STORY_META = {
  home: { day: "Пн, вечер", news: ["СЕМЬЯ ПЕРЕСМОТРЕЛА ЗАВЕЩАНИЕ: КВАРТИРА ДОСТАЛАСЬ КОТУ", "ВЗРЫВ НА ДИВАНЕ: БАБУШКА ПРОСНУЛАСЬ ВПЕРВЫЕ С 2009 ГОДА"] },
  metro: { day: "Вт, утро", news: ["«ПОДСЛУШАНО В МЕТРО»: 40 ТЫСЯЧ ЛАЙКОВ ЗА ОДНО ВИДЕО", "В МЕТРО ОБНАРУЖЕН НОВЫЙ ИСТОЧНИК ГАЗА. ГАЗОВИКИ ВЫЕХАЛИ НА МЕСТО"] },
  office: { day: "Вт, день", news: ["СОТРУДНИКА ПЕРЕИМЕНОВАЛИ В «ПЕРДУНОВА» ПРИКАЗОМ ДИРЕКТОРА", "ОФИС ЭВАКУИРОВАН: СОТРУДНИКИ ЖАЛУЮТСЯ НА «ХИМИЧЕСКУЮ АТАКУ»"] },
  date: { day: "Ср, вечер", news: ["НЕВЕСТА СБЕЖАЛА К ОФИЦИАНТУ ПРЯМО ВО ВРЕМЯ УЖИНА", "В РЕСТОРАНЕ ПОТУХЛИ ВСЕ СВЕЧИ ОДНОВРЕМЕННО. ПОЛИЦИЯ ИЩЕТ ПРИЧИНУ"] },
  cinema: { day: "Ср, ночь", news: ["ЗАЛ АПЛОДИРОВАЛ: «ЛУЧШАЯ СЦЕНА ФИЛЬМА БЫЛА НЕ НА ЭКРАНЕ»", "СЕАНС ПРЕРВАН: ЗРИТЕЛИ ПРИНЯЛИ ЗВУК ЗА ВЗРЫВ В ЗАЛЕ"] },
  elevator: { day: "Чт, утро", news: ["ПОЖАРНЫЕ ОТКАЗАЛИСЬ ЗАХОДИТЬ В ЗАСТРЯВШИЙ ЛИФТ", "ЛИФТ ВЫБРОСИЛО НА 14 ЭТАЖ БЕЗ ЭЛЕКТРИЧЕСТВА"] },
  library: { day: "Чт, вечер", news: ["БИБЛИОТЕКА ВНЕСЛА ЧИТАТЕЛЯ В ЧЁРНЫЙ СПИСОК ПОЖИЗНЕННО", "В БИБЛИОТЕКЕ С ПОЛОК ПОПАДАЛИ КНИГИ. СЕЙСМОЛОГИ В НЕДОУМЕНИИ"] },
  exam: { day: "Пт, утро", news: ["СТУДЕНТА ОТЧИСЛИЛИ ЗА МОРАЛЬНЫЙ УЩЕРБ ОТЛИЧНИЦЕ", "ЭКЗАМЕН СОРВАН: «ЭТО БЫЛ НЕ ГРОМ», — ЗАЯВИЛ ПРЕПОДАВАТЕЛЬ"] },
  funeral: { day: "Пт, день", news: ["ВДОВА: «ХУДШИЙ ДЕНЬ В МОЕЙ ЖИЗНИ, И ДЕЛО НЕ В МУЖЕ»", "НА ПОХОРОНАХ ПОКОЙНЫЙ ЯКОБЫ «ОТВЕТИЛ». СВЯЩЕННИК ВЗЯЛ ОТПУСК"] },
  yoga: { day: "Сб, утро", news: ["ГУРУ ИЗГНАЛ УЧЕНИКА: «ЕГО КАРМА ПАХНЕТ»", "НА РЕТРИТЕ МОЛЧАНИЯ ВПЕРВЫЕ ЗА 10 ЛЕТ ПРОЗВУЧАЛ ЗВУК"] },
  wedding: { day: "Сб, 12:00", news: ["СВАДЕБНОЕ ВИДЕО НАБРАЛО 4 МИЛЛИОНА ПРОСМОТРОВ. НЕВЕСТА УШЛА К ТАМАДЕ", "НА СВАДЬБЕ ВЗОРВАЛСЯ САЛЮТ. ГОСТИ УВЕРЕНЫ: НЕ ТОЛЬКО ОН"] }
};
LEVELS.forEach(L => Object.assign(L, STORY_META[L.id]));


// ---- бесконечный режим «Смена в метро» ----
// Давление растёт всё быстрее, на остановках пассажиры меняются. Результат — сколько секунд продержался.
const ENDLESS = Object.assign({}, LEVELS.find(L => L.id === "metro"), {
  endless: true, name: "Смена в метро", em: "♾️", skulls: 0, goals: [],
  rule: "Бесконечная поездка. Давление растёт всё быстрее, на каждой остановке входят новые пассажиры. Козырь перезаряжается.",
  intro: "Конечная? Какая конечная. Это кольцевая. Ты едешь, пока тебя не раскроют или не разорвёт.",
  tips: ["Козырь перезаряжается каждые 30 секунд.", "Новые пассажиры садятся на места вышедших. Кто они — заранее не знаешь.", "Рекорд сохраняется."]
});
// пассажиры для смены: сидячие люди и кот из других уровней
function passengerPool() {
  const pool = [];
  for (const L of LEVELS) for (const n of L.npcs) if (!n.walk && n.pose !== "stand" && n.pose !== "lotus" && !n.faceWatch && n.kind !== "dog" && !n.aid) pool.push(n);
  return pool;
}
const HEAR_MARGIN = 3;
function gasFor(p, sp) { return p < 30 ? 0 : 64 * Math.pow((p - 30) / 70, 1.2) * sp; }
const ATTN = { sleep: 0.12, meditate: 0.3, phone: 0.5, watch: 0.8, stare: 1.35, suspicious: 1.7, sniff: 1.3, shock: 2 };
const STATE_ICON = { sleep: "💤", meditate: "🧘", phone: "📱", watch: "", stare: "👀", suspicious: "🤨", sniff: "👃", shock: "😱" };

