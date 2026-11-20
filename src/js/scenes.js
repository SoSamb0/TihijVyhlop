// ================= СЦЕНЫ =================
function room(wall, wall2, floor, fy = 590) { ctx.fillStyle = wall; ctx.fillRect(0, 0, W, fy); dots(0, 60, W, fy - 60, wall2, 16, 3.2); ctx.fillStyle = floor; ctx.fillRect(0, fy, W, H - fy); hatch(0, fy, W, H - fy, "#00000033", 14, 3); wL(0, fy, W, fy, 7); }
function frameBox(x, y, w, h, fill) { wR(x, y, w, h, { fill, lw: 6 }); }
function sign(x, y, w, h, fill, lines, size = 16, col = INK) { ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.rotate(rj(0.03)); wR(-w / 2, -h / 2, w, h, { fill, lw: 5 }); lines.forEach((l, i) => T(l, 0, (i - (lines.length - 1) / 2) * size * 1.25, size, i % 2 ? MAG : col)); ctx.restore(); }
function actOf(name) { return G ? G.active.find(a => a.def.name === name) : null; }
const SCENES = {
  home: {
    bg() {
      room("#ff9bd0", "#ff6fb8", "#8a4a1a");
      frameBox(70, 110, 200, 190, "#1a1055"); wE(215, 160, 26, 26, { fill: YEL, lw: 4 }); wL(170, 110, 170, 300, 7); wL(70, 205, 270, 205, 7); wR(70, 110, 100, 95, { fill: "#22e0ff55", lw: 5 }); T("форточка", 120, 320, 15, INK, "center", "Neucha", 400);
      frameBox(540, 110, 120, 150, YEL); wE(600, 175, 32, 38, { fill: "#d9c9a3" }); wL(588, 168, 594, 174, 3); wL(594, 168, 588, 174, 3); wL(606, 168, 612, 174, 3); wL(612, 168, 606, 174, 3); wL(588, 195, 612, 193, 3); shape([540, 135, 580, 110, 590, 118, 548, 146], { fill: INK }); T("Дед † 2019", 600, 245, 14);
      wR(120, 430, 270, 125, { fill: PUR, lw: 6 }); wR(105, 385, 55, 170, { fill: "#9a5cff", lw: 6 }); wR(345, 385, 55, 170, { fill: "#9a5cff", lw: 6 }); hatch(120, 500, 270, 55, "#00000044");
      shape([330, 372, 880, 368, 890, 470, 320, 470], { fill: ORG, lw: 6 }); wR(305, 445, 600, 110, { fill: "#ffa040", lw: 6 }); wR(290, 410, 62, 145, { fill: ORG, lw: 6 }); wR(858, 410, 62, 145, { fill: ORG, lw: 6 }); dots(320, 460, 560, 80, "#ffe53b88", 18, 4); hatch(305, 520, 600, 35, "#00000044");
      wR(1000, 470, 195, 120, { fill: "#5c2e0e", lw: 6 }); hatch(1000, 470, 195, 120, "#00000055"); wR(980, 255, 235, 170, { fill: INK, lw: 6 }); wL(1095, 425, 1095, 470, 9); wL(1050, 255, 1010, 205, 5); wL(1140, 255, 1180, 205, 5);
      wL(945, 590, 945, 300, 7); shape([900, 300, 990, 300, 968, 235, 922, 235], { fill: YEL, lw: 6, smooth: false }); dots(905, 240, 80, 60, "#ff7a1a88", 9, 2);
      for (let i = 0; i < 3; i++) wE(430 + i * 26, 600 + i * 6, 12, 5, { fill: "#c9b037", lw: 3 });
    },
    fx(t) { const ev = G && G.active.length; ctx.fillStyle = ev ? (Math.sin(t * 22) > 0 ? CYAN : YEL) : (Math.sin(t * 3) > 0 ? "#3d6bff" : "#2ec4b6"); ctx.fillRect(997, 272, 201, 136); dots(997, 272, 201, 136, "#00000033", 6, 1.2); if (actOf("ГОООЛ!")) TO("ГОЛ!!!", 1097, 340, 44, "#fff"); else if (actOf("Реклама на полную")) { TO("КРЕДИТ", 1097, 320, 30, YEL); TO("НА ГРОБ 0%", 1097, 360, 24, "#fff"); } }
  },
  metro: {
    bg() {
      room("#b9c4d0", "#9aa7b6", "#4a4f5a"); wR(40, 120, 1200, 175, { fill: "#3a3f4a", lw: 7 });
      for (const x of [270, 1010]) { wL(x, 70, x, 590, 12); wL(x, 70, x, 590, 6, "#e8e8e8"); } wL(0, 84, W, 84, 12); wL(0, 84, W, 84, 6, "#e8e8e8");
      sign(380, 62, 520, 44, YEL, ["КРЕДИТ НА ПОХОРОНЫ — 0%! Умри сейчас, плати потом"], 16);
      wR(250, 425, 800, 45, { fill: "#1456c2", lw: 6 }); wR(250, 465, 800, 78, { fill: "#1e7bff", lw: 6 }); dots(260, 470, 780, 66, "#22e0ff77", 14, 3); hatch(250, 520, 800, 23, "#00000055");
      sign(1080, 320, 150, 80, "#fff", ["НЕ", "ПРИСЛОНЯТЬСЯ", "К ЖИЗНИ"], 14);
      shape([160, 400, 230, 400, 236, 590, 154, 590], { fill: "#5a6070", lw: 6 }); T("ДВЕРИ", 195, 420, 13, "#fff");
    },
    fx(t) {
      const stop = G && G.fl.doors;
      for (let i = 0; i < 4; i++) { const x = 70 + i * 295; ctx.fillStyle = stop ? "#c9d2dc" : "#0d0a1a"; ctx.fillRect(x, 136, 258, 142); ctx.save(); ctx.beginPath(); ctx.rect(x, 136, 258, 142); ctx.clip(); if (stop) { hatch(x, 136, 258, 142, "#00000022", 12, 3); TO("«КЛАДБИЩЕНСКАЯ»", x + 129, 200, 20, YEL, "center", 5); } else for (let k = 0; k < 7; k++) { const lx = ((k * 230 - t * 1500) % 1600 + 1600) % 1600 - 150 - x * 0; ctx.fillStyle = k % 2 ? YEL : MAG; ctx.fillRect(lx, 150 + k * 17, 130, 5); } ctx.restore(); wR(x, 136, 258, 142, { lw: 6 }); }
      if (stop) { wR(150, 395, 90, 200, { fill: "#0d0a1a", lw: 6 }); TO("←", 195, 490, 50, LIME); }
    }
  },
  office: {
    bg() {
      room("#b8f2ff", "#7fdcf5", "#6a6f7a");
      frameBox(60, 95, 540, 225, "#fff59a"); for (let i = 0; i < 8; i++) { const h = 50 + (i * 47) % 130; wR(80 + i * 64, 318 - h, 48, h, { fill: i % 2 ? PUR : MAG, lw: 4 }); dots(84 + i * 64, 322 - h, 40, h - 6, "#ffe53b99", 10, 2); } wL(330, 95, 330, 320, 7);
      sign(690, 105, 320, 125, "#fff", ["СОКРАЩЕНИЕ —", "ЭТО ВОЗМОЖНОСТЬ!", "(для компании)"], 21);
      wR(1090, 80, 150, 60, { fill: "#e8e8e8", lw: 6 }); for (let i = 0; i < 6; i++) wL(1102 + i * 24, 92, 1102 + i * 24, 128, 4); T("ВЫТЯЖКА", 1165, 155, 14);
      wR(1085, 410, 150, 105, { fill: "#d0d0d8", lw: 6 }); wR(1105, 388, 110, 26, { fill: "#fff", lw: 4 }); wR(1065, 515, 190, 78, { fill: "#3a3f4a", lw: 6 }); hatch(1065, 515, 190, 78, "#00000055");
      wR(40, 430, 72, 160, { fill: "#f0f0f0", lw: 6 }); wE(76, 398, 34, 42, { fill: CYAN, lw: 6 });
      wR(900, 250, 90, 110, { fill: "#fff", lw: 5 }); T("ЛУЧШИЙ", 945, 270, 12); T("РАБОТНИК", 945, 286, 12); wE(945, 322, 20, 22, { fill: "#ccc", lw: 3 }); T("?", 945, 324, 22);
    },
    fx(t) { const pr = actOf("Принтер"); if (pr) { const y = 388 - ((t * 50) % 44); wR(1115 + Math.sin(t * 50) * 3, y, 90, 44, { fill: "#fff", lw: 3 }); } const d = G ? Math.sign(G.wind) : 0; if (d) for (let i = 0; i < 3; i++) TO(d > 0 ? "→" : "←", 640 + (i - 1) * 60, 110, 26, "#ffffffaa", "center", 3); },
    front() { wR(150, 520, 1000, 32, { fill: "#c98a4a", lw: 6 }); hatch(150, 520, 1000, 32, "#00000033"); wR(170, 552, 30, 50, { fill: "#7a4a1a", lw: 5 }); wR(1100, 552, 30, 50, { fill: "#7a4a1a", lw: 5 }); for (const x of [400, 620, 860]) { wR(x - 56, 428, 112, 82, { fill: INK, lw: 5 }); wR(x - 47, 437, 94, 62, { fill: x === 620 ? LIME : CYAN, lw: 0 }); dots(x - 47, 437, 94, 62, "#00000033", 7, 1.3); wR(x - 10, 508, 20, 14, { fill: INK, lw: 3 }); } }
  },
  date: {
    bg() {
      room("#7a1a55", "#a02a70", "#2a1020");
      for (let x = 40; x < W; x += 105) { wL(x, 0, x + rj(4), 62, 3); wE(x, 72, 11, 13, { fill: YEL, lw: 4 }); }
      sign(950, 125, 250, 160, INK, ["МЕНЮ", "Фасолевый суп .... 350₽", "Чесночный хлеб ... 200₽", "Скорая ........ бесплатно"], 15, "#fff");
      frameBox(160, 150, 170, 130, CYAN); wE(245, 215, 40, 40, { fill: MAG, lw: 5 }); shape([225, 205, 245, 235, 265, 205], { closed: false, lw: 4 }); T("LOVE IS DEAD", 245, 265, 13);
      for (const x of [1090]) { wR(x - 80, 500, 160, 22, { fill: "#fff", lw: 5 }); wR(x - 8, 522, 16, 70, { fill: "#5c2e0e", lw: 4 }); }
    },
    fx(t) { if (actOf("Скрипач у столика")) { SEED = 9000; drawChar(CH("скрипач", 640, { pose: "stand", y: 440, sc: .9, skin: "#e8d08a", head: { w: 38, h: 58, jaw: .7, tilt: .2 }, nose: { t: "long", s: 1.3 }, hair: "mullet", hairC: INK, must: true, body: { w: 60, h: 72, col: INK, pat: "bow", pants: INK, fat: .5 } }), { st: "sleep", expr: "smile", t, arm: "pray" }); TO("♪ ♫", 700 + Math.sin(t * 5) * 10, 250, 40, YEL); } },
    front(t) {
      shape([370, 468, 910, 464, 915, 500, 365, 502], { fill: "#fff", lw: 6 }); wR(390, 500, 500, 92, { fill: "#f4e8ff", lw: 6 }); dots(396, 506, 488, 80, "#ff2d9544", 16, 4); wR(612, 590, 56, 24, { fill: "#5c2e0e", lw: 5 });
      wE(540, 460, 52, 15, { fill: "#fff", lw: 5 }); wE(540, 456, 40, 9, { fill: "#8c5a2b", lw: 3 }); for (let i = 0; i < 5; i++) wE(520 + i * 10, 455, 4, 3, { fill: "#4a1a0b", lw: 0 });
      wR(633, 410, 14, 54, { fill: "#fff", lw: 4 }); shape([640, 380 + Math.sin(t * 9) * 3, 650, 400, 640, 412, 630, 400], { fill: YEL, lw: 3.5 }); wE(640, 404, 4, 5, { fill: ORG, lw: 0 });
      wE(770, 460, 42, 12, { fill: "#fff", lw: 5 }); shape([755, 455, 770, 440, 785, 455], { fill: LIME, lw: 3 });
    }
  },
  cinema: {
    bg() { ctx.fillStyle = "#1a0d33"; ctx.fillRect(0, 0, W, H); dots(0, 0, W, H, "#2a1a55", 18, 3); wR(130, 62, 1020, 262, { fill: "#000", lw: 8 }); for (let r = 0; r < 2; r++) for (let i = 0; i < 9; i++) wR(150 + i * 115 + r * 50, 335 + r * 50, 92, 60, { fill: "#6a0d2a", lw: 5 }); for (let i = 0; i < 9; i++) { wR(170 + i * 125, 440, 110, 125, { fill: "#c2185b", lw: 6 }); dots(176 + i * 125, 446, 98, 110, "#ff2d9566", 12, 2.6); } sign(40, 350, 90, 60, LIME, ["ВЫХОД", "←"], 18); },
    fx(t) {
      const boom = actOf("ВЗРЫВ на экране"), calm = actOf("Драматичная тишина"), chase = actOf("Погоня");
      ctx.fillStyle = boom ? (Math.sin(t * 30) > 0 ? ORG : YEL) : calm ? "#3a3f4a" : chase ? CYAN : "#7a7f8a"; ctx.fillRect(142, 74, 996, 238); dots(142, 74, 996, 238, "#00000033", 8, 1.6);
      if (boom) { const pts = []; for (let i = 0; i < 20; i++) { const a = i / 20 * 6.283, r = i % 2 ? 130 : 70; pts.push(640 + Math.cos(a) * r * 1.6, 195 + Math.sin(a) * r * .75); } shape(pts, { fill: MAG, lw: 6, smooth: false }); TO("БА-БАХ!", 640, 195, 64, YEL, "center", 9, "Rubik Dirt"); }
      else if (calm) { T("...", 640, 180, 60, "#aaa"); T("(герой молча смотрит на могилу 4 минуты)", 640, 270, 18, "#999", "center", "Neucha", 400); }
      else if (chase) for (let i = 0; i < 5; i++) { const x = ((i * 260 + t * 700) % 1000) + 160; wR(x - 40, 225, 84, 36, { fill: i % 2 ? MAG : YEL, lw: 4 }); wE(x - 22, 262, 10, 10, { fill: INK, lw: 0 }); wE(x + 26, 262, 10, 10, { fill: INK, lw: 0 }); }
      else { wE(560, 195, 44, 56, { fill: "#aaa", lw: 5 }); wE(720, 195, 44, 56, { fill: "#aaa", lw: 5 }); T("— Мы все умрём, Жан. — Да, Мари.", 640, 285, 18, "#ddd", "center", "Neucha", 400); }
    },
    front() { for (let i = 0; i < 9; i++) wR(140 + i * 125, 562, 120, 70, { fill: PUR, lw: 6 }); }
  },
  elevator: {
    bg() {
      ctx.fillStyle = "#0d0512"; ctx.fillRect(0, 0, W, H); wR(215, 66, 850, 586, { fill: "#9aa7b6", lw: 8 }); for (let x = 240; x < 1060; x += 42) wL(x, 74, x + rj(3), 590, 3, "#c9d2dc"); hatch(215, 66, 850, 524, "#00000018", 22, 5);
      wR(215, 590, 850, 62, { fill: "#3a3f4a", lw: 6 }); hatch(215, 590, 850, 62, "#00000055");
      wR(990, 250, 54, 165, { fill: "#6a6f7a", lw: 5 }); for (let i = 0; i < 6; i++) wE(1017, 270 + i * 25, 9, 9, { fill: i === 2 ? MAG : "#ddd", lw: 3 });
      wR(555, 82, 170, 54, { fill: INK, lw: 5 }); TO("13½", 640, 110, 34, MAG, "center", 0);
      sign(255, 165, 215, 76, "#fff", ["Не более 4 человек", "и 1 запаха"], 16);
      T("ЗДЕСЬ БЫЛ ВАСЯ", 620, 330, 16, "#00000077", "center", "Neucha", 400); T("и тут же умер", 640, 352, 14, "#00000066", "center", "Neucha", 400);
      wL(1052, 80, 1052, 588, 6);
    },
    fx(t) { if (actOf("Двери приоткрылись")) { wR(1035, 80, 34, 510, { fill: LIME, lw: 5 }); TO("→", 1050, 320, 40, "#fff"); } if (Math.sin(t * 13) > 0.93) { ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.fillRect(215, 66, 850, 586); } }
  },
  library: {
    bg() {
      room("#ffe9a0", "#ffd65a", "#6a3a1a");
      const cols = [MAG, CYAN, LIME, ORG, PUR, "#fff", YEL];
      for (let s = 0; s < 3; s++) { for (let i = 0; i < 30; i++) { const h = 68 + (i * 13 + s * 7) % 34; const lean = (i * 7 + s) % 11 === 0; ctx.save(); ctx.translate(300 + i * 23, 190 + s * 120); if (lean) ctx.rotate(.25); wR(0, -h, 20, h, { fill: cols[(i + s * 3) % 7], lw: 3.5 }); wL(4, -h + 12, 16, -h + 12, 2); ctx.restore(); } wR(280, 190 + s * 120, 720, 16, { fill: "#5c2e0e", lw: 5 }); }
      frameBox(70, 110, 200, 200, CYAN); wL(170, 110, 170, 310, 7); wL(70, 210, 270, 210, 7); T("окно", 170, 328, 15, INK, "center", "Neucha", 400);
      sign(1010, 110, 230, 66, "#fff", ["ТИХО!"], 40, MAG); sign(1020, 190, 210, 50, YEL, ["Шум карается смертью"], 15);
      wR(960, 470, 270, 122, { fill: "#7a4a1a", lw: 6 }); hatch(960, 470, 270, 122, "#00000044");
    },
    fx(t) { const ev = G && G.evs.find(e => e.def.name === "Упала стопка книг!"), fallen = actOf("Упала стопка книг!"); const wob = ev && ev.next - G.t < 2 ? Math.sin(t * 26) * 0.09 : 0; const cols = [MAG, CYAN, LIME, ORG, PUR, YEL]; ctx.save(); ctx.translate(215, 590); ctx.rotate(fallen ? 1.25 : wob); for (let i = 0; i < 7; i++) wR(-42 + (i % 2) * 8, -28 - i * 27, 84, 25, { fill: cols[i % 6], lw: 4 }); ctx.restore(); },
    front() { wR(250, 520, 760, 28, { fill: "#b9773a", lw: 6 }); hatch(250, 520, 760, 28, "#00000033"); wR(272, 548, 26, 50, { fill: "#7a4a1a", lw: 5 }); wR(962, 548, 26, 50, { fill: "#7a4a1a", lw: 5 }); wL(690, 518, 690, 472, 5); shape([660, 472, 720, 472, 706, 444, 674, 444], { fill: LIME, lw: 5, smooth: false }); wR(350, 506, 76, 16, { fill: "#fff", lw: 3 }); wR(760, 506, 76, 16, { fill: "#fff", lw: 3 }); }
  },
  exam: {
    bg() {
      room("#b6ffd9", "#7df0b8", "#8a6a3a");
      wR(290, 76, 690, 232, { fill: "#0a5a3a", lw: 10, stroke: "#5c2e0e" }); wR(290, 76, 690, 232, { lw: 4 });
      T("ЭКЗАМЕН", 635, 115, 32, "#fff", "center", "Neucha", 400); T("∫ смерть · dx = ?", 635, 180, 40, "#fff", "center", "Neucha", 400); T("Телефоны сдать. Газы — тоже.", 635, 255, 23, YEL, "center", "Neucha", 400);
      frameBox(1050, 90, 190, 230, "#4a4f6a"); wL(1145, 90, 1145, 320, 6); wE(1100, 150, 42, 22, { fill: "#8a8fa6", lw: 4 }); wE(1180, 170, 46, 24, { fill: "#8a8fa6", lw: 4 }); T("окно", 1145, 338, 15, INK, "center", "Neucha", 400);
      sign(135, 330, 150, 86, "#fff", ["До отчисления:", "0"], 18);
      wR(135, 110, 140, 190, { fill: YEL, lw: 5 }); T("ТАБЛИЦА", 205, 130, 13); for (let i = 0; i < 20; i++) wR(143 + (i % 5) * 26, 146 + Math.floor(i / 5) * 36, 22, 30, { fill: i % 3 ? "#fff" : MAG, lw: 2.5 });
    },
    fx(t) { const th = actOf("Гром за окном"); if (th) { ctx.fillStyle = Math.sin(t * 40) > 0 ? "#fff" : "#4a4f6a"; ctx.fillRect(1056, 96, 178, 218); shape([1150, 110, 1120, 200, 1150, 195, 1125, 300, 1190, 180, 1160, 186, 1180, 110], { fill: YEL, lw: 4, smooth: false }); } },
    front() { for (const x of [415, 620, 850]) { wR(x - 92, 518, 184, 24, { fill: "#e0a060", lw: 6 }); wR(x - 82, 542, 14, 56, { fill: "#777", lw: 4 }); wR(x + 68, 542, 14, 56, { fill: "#777", lw: 4 }); wR(x - 42, 508, 74, 12, { fill: "#fff", lw: 3 }); } }
  },
  funeral: {
    bg() {
      room("#3a1a5a", "#4a2a70", "#1a0d26");
      for (const x of [200, 640]) { const pts = [x - 72, 305, x - 72, 160, x - 50, 105, x, 82, x + 50, 105, x + 72, 160, x + 72, 305]; shape(pts, { fill: CYAN, lw: 7 }); const cs = [YEL, MAG, LIME]; for (let i = 0; i < 6; i++) wR(x - 60 + (i % 3) * 40, 120 + Math.floor(i / 3) * 90, 38, 84, { fill: cs[(i + Math.floor(i / 3)) % 3], lw: 4 }); }
      wR(890, 505, 225, 88, { fill: "#4a2a10", lw: 6 }); hatch(890, 505, 225, 88, "#00000055");
      shape([872, 470, 1128, 438, 1140, 482, 884, 518], { fill: "#9a5a1a", lw: 7 }); wL(990, 452, 1002, 492, 5, YEL); wL(982, 470, 1012, 466, 5, YEL);
      frameBox(935, 285, 125, 148, YEL); wE(997, 350, 34, 40, { fill: "#f2a57e", lw: 5 }); shape([980, 362, 997, 376, 1014, 362], { closed: false, lw: 4 }); wE(985, 342, 5, 6, { fill: INK, lw: 0 }); wE(1009, 342, 5, 6, { fill: INK, lw: 0 }); wE(997, 354, 9, 7, { fill: "#e0245e", lw: 3 }); shape([935, 312, 980, 285, 990, 294, 942, 324], { fill: INK }); T("Толя", 997, 418, 17);
      for (let i = 0; i < 6; i++) { wE(870 + i * 52, 584, 17, 14, { fill: i % 2 ? "#fff" : MAG, lw: 4 }); wE(870 + i * 52, 584, 5, 5, { fill: YEL, lw: 0 }); }
      sign(135, 345, 190, 70, "#fff", ["Смеяться", "строго запрещено"], 16);
    },
    fx() { if (actOf("МИНУТА МОЛЧАНИЯ")) { ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.fillRect(0, 0, W, H); TO("минута молчания", 640, 110, 30, "#ffffff88", "center", 4); } },
    front() { wR(150, 530, 720, 32, { fill: "#5c2e0e", lw: 6 }); wR(150, 562, 720, 40, { fill: "#3a1a0a", lw: 6 }); hatch(150, 562, 720, 40, "#00000055"); }
  },
  yoga: {
    bg() {
      room("#fff0c0", "#ffd9a0", "#e0a050");
      wR(330, 80, 620, 262, { fill: CYAN, lw: 8 }); wE(830, 150, 46, 46, { fill: YEL, lw: 6 }); for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; wL(830 + Math.cos(a) * 58, 150 + Math.sin(a) * 58, 830 + Math.cos(a) * 80, 150 + Math.sin(a) * 80, 5, ORG); } shape([330, 342, 420, 250, 560, 300, 700, 240, 950, 342], { fill: LIME, lw: 6 });
      for (const x of [1215]) { wR(x - 36, 480, 72, 112, { fill: ORG, lw: 6 }); for (let i = 0; i < 5; i++) shape([x + (i - 2) * 16, 482, x + (i - 2) * 30, 400 - Math.abs(i - 2) * -16, x + (i - 2) * 22 + 10, 482], { fill: "#0a9a4a", lw: 4 }); }
      wR(150, 520, 60, 70, { fill: PUR, lw: 6 }); wE(180, 510, 26, 12, { fill: MAG, lw: 5 }); T("аромалампа", 180, 606, 13, "#fff");
      wL(1190, 205, 1190, 430, 7); wL(1120, 205, 1120, 430, 7); wL(1110, 205, 1200, 205, 7);
      for (const [x, c] of [[350, PUR], [580, CYAN], [800, MAG], [1070, YEL]]) { wR(x - 95, 560, 190, 26, { fill: c, lw: 6 }); hatch(x - 95, 560, 190, 26, "#00000022", 10, 2); }
      sign(70, 110, 215, 76, "#fff", ["Тишина — золото.", "Пук — карма."], 17);
    },
    fx(t) { const g = actOf("ГОНГ"); wE(1155 + (g ? Math.sin(t * 40) * 4 : 0), 310, 32, 32, { fill: ORG, lw: 6 }); wE(1155, 310, 12, 12, { fill: YEL, lw: 3 }); for (let i = 0; i < 3; i++) shape([180 + Math.sin(t * 2 + i) * 8, 495 - i * 22, 180 + Math.sin(t * 2 + i + 1) * 14, 482 - i * 22, 180 + Math.sin(t * 2 + i + 2) * 8, 470 - i * 22], { closed: false, lw: 3, stroke: "#ff2d9599" }); const p = G && G.fl.pose; if (p) TO(p === "dog" ? "СОБАКА МОРДОЙ ВНИЗ: громкость ×1.6" : "ПОЗА РЕБЁНКА: громкость ×0.5", 640, 100, 26, p === "dog" ? MAG : LIME); }
    },
  wedding: {
    bg() {
      room("#ffd6ec", "#ffb3d9", "#7a1a2a");
      // красная дорожка
      shape([520, 590, 760, 590, 900, 720, 380, 720], { fill: "#d0103a", lw: 6, smooth: false }); dots(520, 600, 240, 110, "#ffe53b55", 16, 3);
      // окна с занавесками
      for (const x of [110, 420]) { frameBox(x, 100, 150, 200, CYAN); wL(x + 75, 100, x + 75, 300, 6); shape([x - 10, 92, x + 50, 92, x + 30, 310, x - 14, 310], { fill: MAG, lw: 5 }); shape([x + 160, 92, x + 100, 92, x + 120, 310, x + 164, 310], { fill: MAG, lw: 5 }); }
      // арка из цветов
      for (let i = 0; i <= 18; i++) { const a = Math.PI + i * Math.PI / 18, x = 760 + Math.cos(a) * 190, y = 330 + Math.sin(a) * 210; wE(x, y, 22, 20, { fill: [YEL, "#fff", MAG, LIME][i % 4], lw: 4 }); wE(x, y, 6, 6, { fill: ORG, lw: 0 }); }
      wL(570, 330, 570, 590, 8); wL(950, 330, 950, 590, 8);
      // стол регистратора с кольцами
      wR(880, 470, 200, 120, { fill: "#fff", lw: 6 }); dots(886, 476, 188, 108, "#ff2d9533", 14, 3); wE(950, 462, 16, 8, { fill: "#d0103a", lw: 3 }); wE(944, 456, 7, 7, { fill: null, lw: 3, stroke: YEL }); wE(956, 456, 7, 7, { fill: null, lw: 3, stroke: YEL });
      sign(120, 215, 190, 60, "#fff", ["Совет да любовь", "(и вентиляция)"], 15);
      // балкон справа
      wR(1160, 90, 110, 500, { fill: "#9ae6ff", lw: 6 }); wL(1215, 90, 1215, 590, 5); for (let i = 0; i < 6; i++) wL(1170, 470 + i * 20, 1262, 470 + i * 20, 4); T("балкон", 1215, 75, 14);
      // торт
      wR(60, 470, 120, 120, { fill: "#fff", lw: 5 }); wR(75, 420, 90, 50, { fill: "#fff", lw: 5 }); wR(92, 385, 56, 35, { fill: "#fff", lw: 5 }); for (const y of [500, 445, 400]) dots(70, y, 100, 10, MAG, 12, 3); wR(116, 362, 8, 22, { fill: YEL, lw: 3 });
    },
    fx(t) {
      if (actOf("Салют")) for (let i = 0; i < 5; i++) { const x = 1215 + Math.cos(i * 1.3 + t) * 30, y = 200 + Math.sin(i * 2 + t * 3) * 60; for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283; wL(x, y, x + Math.cos(a) * 26, y + Math.sin(a) * 26, 4, [YEL, MAG, LIME][i % 3]); } }
      if (actOf("ФОТО: все замерли") && Math.sin(t * 6) > 0.85) { ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(0, 0, W, H); }
      if (actOf("«ГОРЬКО!!!»") || actOf("«ГОРЬКО!!!» ещё раз")) TO("ГОРЬКО!!!", 760, 150 + Math.sin(t * 12) * 6, 60, MAG, "center", 8, "Rubik Dirt");
      if (actOf("КЛЯТВЫ: все смотрят на вас")) TO("«...в болезни и в здравии...»", 760, 170, 26, "#fff", "center", 5);
    }
  }
};
