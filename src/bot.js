// Бот для проверки баланса. Подключается к открытой игре (index.html):
//   в консоли браузера:  (0,eval)(await (await fetch('src/bot.js')).text()); runAll(20)
//   или автоматически:   node tools/balance.mjs
// runAll(N, opts) прогоняет каждый уровень N раз и возвращает таблицу побед.
// opts.spam — стратегия «пукать по малому без остановки» (должна проигрывать),
// opts.nofan — не гонять облако, opts.notrump — не пользоваться козырем,
// opts.goal — номер доп. цели уровня: бот целенаправленно пытается её выполнить (проверка, что цель выполнима).
muted = true;
window.bot = function (i, opts = {}) {
  const realShow = showResult, realBg = buildBg, realAfter = storyAfter;
  showResult = function () { mode = "done"; }; buildBg = function () {}; storyAfter = (L, then) => then();
  startLevel(i);
  const L = G.L; let n = 0;
  const g = opts.goal !== undefined ? L.goals[opts.goal] : null;
  const skill = 0.93;
  const notrump = opts.notrump || (g && g.k === "noTrump");
  // куда гнать облако ради цели
  const goalX = () => {
    if (!g) return null;
    if (g.k === "frameWho") { const o = G.npcs.find(n => n.n === g.who) || (L.props || []).find(p => p.n === g.who); return o ? o.x : null; }
    if (g.k === "vent") return L.vents.length ? L.vents[0].x : (L.xmax || 1030) - 20;
    if (g.k === "burn") return L.candle;
    return null;
  };
  while (mode === "play" && n < 6000) {
    n++; keys = {};
    const k = L.surface * loudMult(), safe = (G.amb * skill) / k;
    const need = 30 + 70 * Math.pow(Math.min(1, G.P / 64), 1 / 1.2);
    let target = Math.min(100, safe, need);
    const ws = watchers();
    if (ws.some(w => w.faceWatch)) target = Math.min(target, 52);
    if (ws.length) target = Math.min(target, 78);
    const dur = 0.25 + target / 100 * 1.1, ev = G.active.filter(a => a.def.amb > 15).sort((a, b) => b.def.amb - a.def.amb)[0];
    if (ev && (ev.dur - ev.t) < dur + 0.35) target = Math.min(target, (L.base * 0.9) / k);
    // цель «мощный залп»: если шум позволяет — бьём на пороге силы
    if (g && g.k === "big" && (G.amb + 3) / (k * 1.12) >= g.p && (!ev || ev.dur - ev.t > 1.1) && G.P > 25) target = Math.max(target, g.p);
    // цель «не больше N залпов»: только крупные залпы
    const minShot = g && g.k === "farts" ? 50 : 42;
    if (opts.spam) {
      if (!G.charging && G.cd <= 0 && G.P > 8) pressFire();
      else if (G.charging && G.power >= Math.max(31, Math.min(36, safe))) releaseFire();
    } else {
      // цель «мощный залп»: зажимаем заранее, если громкое событие вот-вот начнётся
      const soonBig = g && g.k === "big" && !ws.length && G.evs.some(e => e.next > G.t && e.next - G.t < 1.2 && (L.base + e.def.amb + 3) / (k * 1.12) >= g.p);
      const holdBig = g && g.k === "big" && !ws.length && G.charging && G.power >= g.p * 0.9 && (G.amb + 3) / (k * 1.12) < g.p && G.P < 88 && G.evs.some(e => e.next > G.t && e.next - G.t < 1.5);
      if (!G.charging) { if (G.cd <= 0 && ((target >= minShot && G.P > 20) || G.P > 90 || (soonBig && G.P > 30))) pressFire(); }
      else if (!holdBig && !(soonBig && G.power < g.p) && (G.power >= target || (G.P > 90 && G.power >= 50))) releaseFire();
      // козырь: когда давит, тихо и никто не смотрит
      if (!notrump && G.trump.ready && L.trump && !ws.length && !G.charging) {
        if (g && g.k === "big") { if (ev && G.P > 45) useTrump(); }   // козырь поверх громкого события
        else if (G.P > 70 && G.amb < L.base + 8) useTrump();
      }
      // облако гоним туда, где по прогнозу виноватым окажется не игрок
      const gx = goalX();
      if (gx !== null && !opts.nofan) {
        // гоним самое свежее облако к цели, пока оно рядом с игроком
        const c = G.clouds.filter(c => c.s > 3 && Math.abs(c.x - G.me.x) < 250).pop();
        if (c && Math.abs(c.x - gx) > 45 && !(ws.length && g.k !== "frameWho")) keys[gx < c.x ? "ArrowLeft" : "ArrowRight"] = true;
      }
      const f = G.forecast.find(f => f.n && f.who.me) || G.forecast.find(f => Math.abs(f.c.x - G.me.x) < 160);
      if (gx === null && f && !ws.length && !opts.nofan && Math.abs(f.c.x - G.me.x) < 250) {
        let tx = null; for (const v of G.fl.vents) if (tx === null || Math.abs(v.x - G.me.x) < Math.abs(tx - G.me.x)) tx = v.x;
        if (L.candle) tx = L.candle;
        if (tx === null) { const sc = G.npcs.find(o => o.scape), pr = (L.props || [])[0]; tx = pr ? pr.x : sc ? sc.x : G.me.x + 300; }
        keys[tx < f.c.x ? "ArrowLeft" : "ArrowRight"] = true;
      }
    }
    update(1 / 30);
    if (L.endless && G.t > 600) break;
  }
  keys = {}; showResult = realShow; buildBg = realBg; storyAfter = realAfter;
  const st = G.stats, goals = (L.goals || []).map(g => goalDone(g, st, !!(G.result && G.result.win)));
  return { win: !!(G.result && G.result.win), why: G.result && G.result.why, sus: Math.round(G.sus), t: Math.floor(G.t), framed: st.framed, blamed: st.blamed, heard: st.heard, goals };
};
window.runAll = function (N = 20, opts = {}) {
  const rows = [];
  for (let i = 0; i < LEVELS.length; i++) {
    let w = 0, s = 0; const why = {}, gl = (LEVELS[i].goals || []).map(() => 0);
    for (let r = 0; r < N; r++) {
      const x = bot(i, opts);
      if (x.win) { w++; s += x.sus; } else why[x.why] = (why[x.why] || 0) + 1;
      x.goals.forEach((d, k) => gl[k] += d ? 1 : 0);
    }
    rows.push({ n: i + 1, id: LEVELS[i].id, name: LEVELS[i].name, win: w / N, sus: w ? Math.round(s / w) : null, burst: (why.burst || 0) / N, caught: (why.caught || 0) / N, goals: gl.map(g => g / N) });
  }
  let e = 0; const en = Math.max(3, Math.round(N / 4)); for (let r = 0; r < en; r++) e += bot(-1, opts).t;
  mode = "menu"; G = null; show("ovMenu");
  return { rows, endless: Math.round(e / en) };
};

// для каждой доп. цели: сколько раз из N бот её выполнил, когда целенаправленно старался
window.runGoals = function (N = 12) {
  const out = [];
  LEVELS.forEach((L, i) => (L.goals || []).forEach((g, k) => {
    let ok = 0; for (let r = 0; r < N; r++) if (bot(i, { goal: k }).goals[k]) ok++;
    out.push({ n: i + 1, level: L.name, goal: g.t, rate: ok / N });
  }));
  mode = "menu"; G = null; show("ovMenu");
  return out;
};
