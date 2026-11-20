// ================= РИСОВАНИЕ ИГРЫ =================
function lookVec(n) {
  if (n.state === "phone") return { x: 0, y: 0.9 };
  if (n.state === "sniff") return { x: Math.sin(G.t * 7) * 0.8, y: -0.3 };
  const h = headPos(n); let tx, ty;
  if (n.state === "stare" || n.state === "suspicious" || n.state === "shock") { const p = headPos(G.me); tx = p.x; ty = p.y; } else { tx = G.L.focus.x; ty = G.L.focus.y; }
  const dx = tx - h.x, dy = ty - h.y, m = Math.hypot(dx, dy) || 1; return { x: dx / m, y: dy / m };
}
const EXPR = { sleep: "sleep", meditate: "smile", phone: "flat", watch: "flat", stare: "flat", suspicious: "frown", sniff: "disgust", shock: "shock" };
function drawBubble(n) {
  const b = n.bubble; if (!b) return; const hp = headPos(n), a = clamp(b.t / 0.12, 0, 1) * clamp((b.dur - b.t) / 0.3, 0, 1);
  ctx.save(); ctx.globalAlpha = a; const lines = wrap(b.text, 240, 25);
  const w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 36, h = lines.length * 27 + 22;
  const x = clamp(hp.x - w / 2, 120, W - w - 12), y = Math.max(74, hp.y - (n.kind === "human" ? n.head.h * n.sc : 30) - h - 40);
  shape([hp.x - 12, y + h - 4, hp.x + 14, y + h - 4, hp.x + 4, y + h + 24], { fill: "#fff", lw: 4, smooth: false });
  shape([x, y + 8, x + w * .5, y - 3, x + w, y + 6, x + w + 5, y + h * .5, x + w - 2, y + h, x + w * .5, y + h + 4, x + 2, y + h - 3, x - 5, y + h * .5], { fill: "#fff", lw: 4.5 });
  lines.forEach((l, i) => T(l, x + w / 2, y + 26 + i * 27, 25, INK, "center", "Neucha", 400));
  ctx.restore();
}
function drawCloud(c, t) {
  const a = clamp(c.s / 26, 0.12, 0.6);
  for (const b of c.blobs) { const x = c.x + Math.cos(b.a + t * b.w * 0.3) * c.r * b.d * .8, y = c.y + Math.sin(b.a + t * b.w * 0.3) * c.r * b.d * 0.45; wE(x, y, c.r * b.r * .7, c.r * b.r * .55, { fill: `rgba(150,230,30,${a})`, lw: 3, stroke: `rgba(23,8,31,${a + .15})`, j: 4, reg: 0 }); }
  if (c.s > 9) for (let i = -1; i <= 1; i++) shape([c.x + i * c.r * .35, c.y - c.r * .3, c.x + i * c.r * .35 + Math.sin(t * 4 + i) * 9, c.y - c.r * .5, c.x + i * c.r * .35, c.y - c.r * .7], { closed: false, lw: 3, stroke: "#4a7a0a" });
  if (c.s > 22) TO("☠", c.x, c.y, 34, "#fff", "center", 5);
}
function drawPlayer(t) {
  const me = G.me, p = G.P / 100, pose = G.fl.pose;
  const skin = p < 0.5 ? me.skin : p < 0.75 ? lerpColor(me.skin, "#ff6b5a", (p - 0.5) / 0.25) : p < 0.9 ? lerpColor("#ff6b5a", "#c77dff", (p - 0.75) / 0.15) : lerpColor("#c77dff", LIME, (p - 0.9) / 0.1);
  const charging = G.charging && G.power > 5, just = G.t - G.lastFart < 0.7;
  let expr = "flat"; if (G.over && G.result && !G.result.win) expr = "shock"; else if (just) expr = "relief"; else if (charging) expr = "teeth"; else if (G.rumble.on) expr = "cry"; else if (p > 0.7) expr = "frown"; else if (p < 0.25) expr = "smile";
  const sus = G.npcs.find(n => n.state === "suspicious" || n.state === "sniff"); let look;
  { const a = sus ? headPos(sus) : G.L.focus, b = headPos(me), dx = a.x - b.x, dy = a.y - b.y, m = Math.hypot(dx, dy) || 1; look = { x: dx / m, y: dy / m }; }
  SEED = 500;
  drawChar(me, { st: G.over && !G.result.win ? "shock" : "watch", expr, look, t, skin, tilt: (pose === "dog" ? 0.55 : pose === "child" ? 0.3 : 0) + (G.rumble.on ? Math.sin(t * 40) * 0.03 : 0), arm: G.fanDir < 0 ? "fanL" : G.fanDir > 0 ? "fanR" : G.rumble.on ? "belly" : "down", puff: charging && G.power > 40, bulge: p > 0.85 ? 1.25 : 1, worried: p > 0.6, vein: p > 0.8, sweat: p > 0.88 ? 4 : p > 0.75 ? 2 : p > 0.6 ? 1 : 0, blush: charging && G.power > 55 ? "#ff2d95aa" : null });
  const h = headPos(me); if (G.t < 3) TO("▼ ТЫ", h.x, h.y - 100 + Math.sin(t * 6) * 5, 28, YEL);
}
function drawGame(t) {
  const L = G.L, me = G.me;
  ctx.save();
  if (G.shake > 0) ctx.translate(rnd(-G.shake, G.shake), rnd(-G.shake, G.shake));
  
  ctx.drawImage(bgCache, 0, 0);
  const S = SCENES[L.id]; SEED = 100; if (S.fx) S.fx(t);
  // вытяжки
  for (const v of G.fl.vents) { for (let i = 0; i < 4; i++) { const a = t * 3 + i * 1.57, r = 26 + i * 9; ctx.beginPath(); ctx.arc(v.x, 380, r, a, a + 1.2); ctx.lineWidth = 3; ctx.strokeStyle = "#ffffffaa"; ctx.stroke(); } }
  // пылинки показывают ветер
  ctx.strokeStyle = "#ffffff99"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
  for (const m of G.motes) { const len = clamp(G.wind * 0.18 * m.s, -30, 30); ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - len - 2, m.y); ctx.stroke(); }
  const pose = G.fl.pose, tilt = pose === "dog" ? 0.55 : pose === "child" ? 0.3 : 0;
  const order = G.npcs.slice().sort((a, b) => (a.pose === "stand" ? 1 : 0) - (b.pose === "stand" ? 1 : 0));
  let drawnMe = false;
  order.forEach((n, i) => {
    if (n.pose === "stand" && !drawnMe && me.pose !== "stand") { drawPlayer(t); drawnMe = true; }
    SEED = 1000 + G.npcs.indexOf(n) * 400;
    const lk = lookVec(n); if (warnsSoon(n)) { const p = headPos(G.me), h = headPos(n), k = 1 - n.stT / 1.2; lk.x = lerp(lk.x, Math.sign(p.x - h.x), k * 0.7); }
    drawChar(n, { st: n.state, expr: n.kind === "human" && n.n === "Вдова" && n.state === "watch" ? "cry" : EXPR[n.state], look: lk, t, walking: !!n.walk && n.state !== "suspicious" && n.state !== "sniff", tilt, arm: n.state === "phone" ? "phone" : n.state === "meditate" ? "pray" : "down", hpOff: n.hp && G.fl.doors, aidOn: n.aidOn > 0, sniffing: n.sniffing });
  });
  if (!drawnMe) drawPlayer(t);
  SEED = 4000; if (S.front) S.front(t);
  // темнота кинотеатра
  let dark = 0;
  if (L.dark) { dark = 0.74 * (1 - G.fl.light); ctx.fillStyle = `rgba(8,2,20,${dark})`; ctx.fillRect(0, 320, W, 320); }
  SEED = 5000;
  for (const c of G.clouds) drawCloud(c, t);
  drawForecast(t, dark);
  // ономатопея
  for (const f of G.fx) { const k = f.t / 1.1, sc = 0.6 + Math.min(1, f.t * 8) * 0.5; ctx.save(); ctx.translate(f.x + k * 30, f.y - k * 40); ctx.rotate(f.rot); ctx.scale(sc, sc); ctx.globalAlpha = clamp(1.4 - k * 1.4, 0, 1); if (f.size > 34) { const pts = [], n = 14, w = f.size * f.text.length * 0.42 + 30, h = f.size * 0.95; for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * 6.283, r = i % 2 ? 1 : 0.72; pts.push(Math.cos(a) * w * r, Math.sin(a) * h * r); } shape(pts, { fill: f.col, lw: 5, smooth: false, j: 3 }); TO(f.text, 0, 0, f.size, "#fff", "center", 7, "Rubik Dirt"); } else TO(f.text, 0, 0, f.size, f.col, "center", 5, "Rubik Dirt"); ctx.restore(); }
  // значки и пузыри
  for (const n of G.npcs) {
    const h = headPos(n), top = h.y - (n.kind === "human" ? n.head.h * n.sc : 30) - 26;
    if (dark < 0.4) {
      const ic = n.aidOn > 0 ? "🦻" : STATE_ICON[n.state] || "👁";
      if (!n.bubble) {
        T(ic, h.x + 34, top, 28);
        if (n.susT <= 0 && !n.sniff && !G.fl.allStare && n.stDur) {
          ctx.beginPath(); ctx.arc(h.x + 34, top, 21, -1.57, -1.57 + 6.283 * clamp(n.stT / n.stDur, 0, 1)); ctx.lineWidth = 4; ctx.strokeStyle = "#ffffffcc"; ctx.stroke();
          const nx = STATE_ICON[nextCycleState(n)] || "👁"; ctx.globalAlpha = 0.65; T("→" + nx, h.x + 74, top + 2, 17); ctx.globalAlpha = 1;
        }
      }
      if (warnsSoon(n)) TO("!", h.x - 30, top - 6 + Math.sin(t * 20) * 4, 40, YEL, "center", 6);
    }
    else if (!n.bubble) T("?", h.x + 30, top, 26, "#ffffff55");
    if (n.sniff) { ctx.beginPath(); ctx.arc(h.x - 40, top, 14, -1.57, -1.57 + 6.283 * (n.sniff.t / 1.5)); ctx.lineWidth = 6; ctx.strokeStyle = MAG; ctx.stroke(); }
  }
  for (const n of G.npcs) drawBubble(n);
  for (const f of G.floats) { ctx.save(); ctx.globalAlpha = clamp(1.8 - f.t, 0, 1); TO(f.text, f.x, f.y - f.t * 40, f.size, f.color); ctx.restore(); }
  if (G.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${G.flash * 0.18})`; ctx.fillRect(0, 0, W, H); }
  if (G.P > 80) { const a = (G.P - 80) / 20 * (0.3 + Math.sin(t * 8) * 0.1), gr = ctx.createRadialGradient(640, 360, 250, 640, 360, 750); gr.addColorStop(0, "rgba(255,0,80,0)"); gr.addColorStop(1, `rgba(255,0,80,${a})`); ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H); }
  ctx.restore();
  drawHUD(t);
}
function drawForecast(t, dark) {
  for (const f of G.forecast) {
    const c = f.c, end = f.path[f.path.length - 1];
    if (Math.abs(end - c.x) > 12) {
      ctx.save(); ctx.setLineDash([10, 9]); ctx.lineDashOffset = -t * 30; ctx.lineWidth = 4; ctx.strokeStyle = f.n ? "#ff2d95cc" : "#ffffffaa";
      ctx.beginPath(); ctx.moveTo(c.x, c.y - 4); ctx.lineTo(end, c.y - 4); ctx.stroke(); ctx.restore();
      shape([end, c.y - 16, end + Math.sign(end - c.x) * 18, c.y - 4, end, c.y + 8], { fill: f.n ? MAG : "#fff", lw: 3, smooth: false, j: 0 });
    }
    if (f.gone) { TO("выветрится", c.x, c.y - c.r * 0.5 - 18, 15, CYAN, "center", 4); continue; }
    if (!f.n || dark > 0.4) continue;
    const h = headPos(f.n), y = h.y - (f.n.kind === "human" ? f.n.head.h * f.n.sc : 30) - 70;
    const who = f.who, txt = who.me ? "на ТЕБЯ" : who.self ? "не поймёт" : "на: " + who.n;
    const col = who.me ? MAG : who.self ? "#fff" : LIME;
    ctx.font = "900 17px Rubik"; const w = Math.max(ctx.measureText(txt).width, 90) + 24;
    panel(h.x - w / 2, y - 34, w, 52, "#17081fee");
    T(`👃 учует через ${f.t.toFixed(1)}`, h.x, y - 20, 14, "#fff"); T(txt, h.x, y + 2, 17, col);
  }
}
function panel(x, y, w, h, fill = INK) { wR(x, y, w, h, { fill, lw: 0, j: 3, reg: 0 }); }
function meter(x, y, w, h, v, col, bg = "#fff") { wR(x, y, w, h, { fill: bg, lw: 5 }); if (v > 0.01) { ctx.fillStyle = col; ctx.fillRect(x + 4, y + 4, (w - 8) * clamp(v, 0, 1), h - 8); hatch(x + 4, y + 4, (w - 8) * clamp(v, 0, 1), h - 8, "#00000022", 8, 2); } }
function drawHUD(t) {
  const L = G.L, me = G.me; SEED = 7000;
  panel(-10, -10, W + 20, 72);
  TO(`${L.em} ${L.name}`, 18, 30, 24, "#fff", "left", 0, "Rubik Dirt");
  const tl = Math.max(0, G.dur - G.t);
  if (L.endless) { T("НА СМЕНЕ", 520, 31, 14, "#fff", "right"); meter(530, 14, 250, 34, (G.t % 60) / 60, LIME); T(`${Math.floor(G.t)} с · рекорд ${save.endless || 0}`, 655, 31, 16); }
  else { T("ПРОДЕРЖИСЬ", 520, 31, 14, "#fff", "right"); meter(530, 14, 250, 34, G.t / G.dur, LIME); T(`${Math.ceil(tl)} сек`, 655, 31, 17); }
  T("ПОДОЗРЕНИЕ", 968, 31, 14, "#fff", "right");
  meter(978, 14, 284, 34, G.sus / 100, G.sus > 70 ? MAG : G.sus > 40 ? ORG : YEL); T(`${Math.round(G.sus)}%`, 1120, 31, 17);
  // ближайшие громкие и тихие моменты
  let ly = 80; const list = [];
  for (const a of G.active) if (a.def.warn > 0) list.push({ txt: `${a.def.icon} ${a.def.name} — СЕЙЧАС`, col: a.def.calm || a.def.bad ? MAG : LIME, bg: INK });
  for (const e of G.evs) { const d = e.next - G.t; if (e.def.warn >= 1 && d > 0 && d <= e.def.warn + 1.5 && !G.active.some(a => a.def === e.def)) list.push({ txt: `${e.def.icon} ${e.def.name} через ${d.toFixed(1)}`, col: e.def.calm || e.def.bad ? "#ffa0c8" : YEL, bg: "#17081fcc" }); }
  for (const it of list.slice(0, 3)) { ctx.font = "900 17px Rubik"; const w = ctx.measureText(it.txt).width + 26; panel(116, ly, w, 30, it.bg); T(it.txt, 129, ly + 15, 17, it.col, "left"); ly += 35; }
  // давление
  const px = 30, py = 120, ph = 400, pw = 50; panel(8, 78, 96, 500, "#17081fdd"); T("ДАВЛЕНИЕ", 56, 98, 13, "#fff");
  wR(px, py, pw, ph, { fill: "#fff", lw: 5 }); const pv = clamp(G.P / 100, 0, 1), fh = (ph - 8) * pv;
  if (fh > 2) { const gr = ctx.createLinearGradient(0, py + ph, 0, py); gr.addColorStop(0, LIME); gr.addColorStop(0.6, YEL); gr.addColorStop(0.85, ORG); gr.addColorStop(1, MAG); ctx.fillStyle = gr; ctx.fillRect(px + 4, py + ph - 4 - fh, pw - 8, fh); }
  if (G.charging) { const out = Math.min(G.P, gasFor(G.power, 1)), oh = (ph - 8) * out / 100; if (oh > 1) { ctx.fillStyle = "#ffffffdd"; ctx.fillRect(px + 4, py + ph - 4 - fh, pw - 8, oh); hatch(px + 4, py + ph - 4 - fh, pw - 8, oh, INK, 8, 2); } }
  wL(px - 6, py + 4, px + pw + 6, py + 4, 5, MAG);
  T(`${Math.round(G.P)}`, px + pw / 2, py + ph + 24, 24, G.P > 80 ? MAG : "#fff");
  // шум и твоя громкость на одной шкале
  panel(-10, 630, W + 20, 100);
  const nx = 250, ny = 658, nw = 720, nh = 32;
  T("ТИХО", nx - 14, ny + 17, 15, "#fff", "right"); T("ГРОМКО", nx + nw + 14, ny + 17, 15, "#fff", "left");
  meter(nx, ny, nw, nh, G.amb / 100, CYAN); T("шум вокруг", nx + 12, ny + 17, 14, INK, "left", "Rubik", 800);
  let hint = TOUCH ? "зажми и отпусти, пока метка в синей зоне" : "зажми ПРОБЕЛ и отпусти, пока метка в синей зоне", hc = "#fff";
  if (G.cd > 0 && !G.charging) { hint = "отдышись..."; hc = "#aaa"; }
  if (G.charging) {
    const proj = G.power * L.surface * loudMult(), mx = nx + 4 + (nw - 8) * clamp(proj / 100, 0, 1), ok = proj < G.amb, weak = G.power < 30;
    wL(mx, ny - 8, mx, ny + nh + 8, 8, ok ? "#0a9a2a" : MAG); shape([mx - 10, ny - 16, mx + 10, ny - 16, mx, ny - 2], { fill: ok ? LIME : MAG, lw: 3, smooth: false, j: 0 });
    hint = weak ? "слабо — держи дольше" : ok ? "ТИХО — можно отпускать" : "УСЛЫШАТ!"; hc = weak ? "#fff" : ok ? LIME : MAG;
  }
  for (const s of G.sources) if (s.kind === "fart" && s.cur > 0) { const mx = nx + 4 + (nw - 8) * clamp(s.cur / 100, 0, 1); wL(mx, ny, mx, ny + nh, 6, s.masked ? "#0a9a2a" : MAG); }
  TO(hint, nx + nw / 2, ny - 16, 18, hc, "center", 4);
  T(TOUCH ? "" : "ПРОБЕЛ — сбросить давление     ← →  — гнать облако     E — козырь     Esc — пауза", 640, 703, 13, "#bbb", "center", "Rubik", 500);
  // козырь
  if (L.trump) {
    const ready = G.trump.ready, tx = 1048, ty = 650;
    panel(tx, ty, 220, 46, ready ? YEL : "#3a2a44");
    T(`${L.trump.icon} ${TOUCH ? "" : "E: "}${L.trump.name}`, tx + 110, ty + 16, 13, ready ? INK : "#999");
    T(ready ? "козырь готов" : L.endless ? `перезарядка ${Math.ceil(G.trump.cd)} с` : "использован", tx + 110, ty + 33, 12, ready ? INK : "#888", "center", "Rubik", 600);
  }
  // доп. цели
  if (L.goals && L.goals.length) {
    let gy = 80; panel(1010, gy - 6, 262, 22 + L.goals.length * 24, "#17081fcc"); T("ДОП. ЦЕЛИ", 1141, gy + 6, 12, "#fff");
    for (const g of L.goals) {
      gy += 24; const done = goalDone(g, G.stats, true) && !["noHeard", "noBlame", "noTrump", "maxSus", "farts"].includes(g.k), failed = goalFailed(g, G.stats);
      const mark = done ? "✔" : failed ? "✘" : "•", col = done ? LIME : failed ? "#ff6b9a" : "#fff";
      ctx.font = "800 13px Rubik"; let txt = g.t; const pr = goalProgress(g, G.stats); if (pr) txt += " " + pr;
      if (ctx.measureText(txt).width > 226) { while (ctx.measureText(txt + "…").width > 226 && txt.length > 4) txt = txt.slice(0, -1); txt += "…"; }
      T(mark, 1022, gy + 6, 14, col, "left"); T(txt, 1040, gy + 6, 13, col, "left", "Rubik", 800);
    }
  }
  // обучение на первом уровне
  if (G.tut < 9 && !G.over) {
    const cl = G.clouds.find(c => c.s > 3);
    const msg = G.tut === 0 ? (TOUCH ? "Давление растёт. Зажми кнопку ЗАЖМИ и отпусти, пока метка внизу в синей зоне" : "Давление растёт. Зажми ПРОБЕЛ и отпусти, пока метка внизу в синей зоне") : cl ? (TOUCH ? "Осталось облако! Гони его кнопкой ← к форточке. Пунктир показывает, кто учует" : "Осталось облако! Гони его стрелкой ← к форточке. Пунктир показывает, кто учует") : null;
    if (G.tut === 1 && !cl && G.t > 25) G.tut = 9;
    if (msg) { ctx.font = "900 22px Rubik"; const w = ctx.measureText(msg).width + 40; panel(640 - w / 2, 590, w, 36, MAG); T(msg, 640, 608, 22, "#fff"); }
  }
  SEED = 8000; wR(4, 4, W - 8, H - 8, { lw: 8, j: 2 });
  ctx.globalAlpha = 0.4; ctx.drawImage(grain, 0, 0, W, H); ctx.globalAlpha = 1;
  if (G.over && G.result) TO(L.endless ? `${Math.floor(G.t)} СЕК` : G.result.win ? "ВЫЖИЛ!" : G.result.why === "burst" ? "ПРОРВАЛО!!!" : "РАСКРЫТ!", 640, 300, 110, G.result.win ? LIME : MAG, "center", 14, "Rubik Dirt");
}

