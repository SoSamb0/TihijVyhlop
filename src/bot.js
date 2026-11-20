// Бот для проверки баланса. Подключается к открытой игре (index.html):
//   в консоли браузера:  (0,eval)(await (await fetch('src/bot.js')).text()); runAll(20)
//   или автоматически:   node tools/balance.mjs
// runAll(N, opts) прогоняет каждый уровень N раз и возвращает таблицу побед.
// opts.spam — стратегия «пукать по малому без остановки» (должна проигрывать),
// opts.nofan — не гонять облако, opts.notrump — не пользоваться козырем.
muted = true;
window.bot = function (i, opts = {}) {
  const realShow = showResult, realBg = buildBg;
  showResult = function () { mode = "done"; }; buildBg = function () {};
  startLevel(i);
  const L = G.L; let n = 0;
  while (mode === "play" && n < 6000) {
    n++; keys = {};
    const k = L.surface * loudMult(), safe = (G.amb * 0.93) / k;
    const need = 30 + 70 * Math.pow(Math.min(1, G.P / 64), 1 / 1.2);
    let target = Math.min(100, safe, need);
    const ws = watchers();
    if (ws.some(w => w.faceWatch)) target = Math.min(target, 52);
    if (ws.length) target = Math.min(target, 78);
    const dur = 0.25 + target / 100 * 1.1, ev = G.active.filter(a => a.def.amb > 15).sort((a, b) => b.def.amb - a.def.amb)[0];
    if (ev && (ev.dur - ev.t) < dur + 0.35) target = Math.min(target, (L.base * 0.9) / k);
    if (opts.spam) {
      if (!G.charging && G.cd <= 0 && G.P > 8) pressFire();
      else if (G.charging && G.power >= Math.max(31, Math.min(36, safe))) releaseFire();
    } else {
      if (!G.charging) { if (G.cd <= 0 && ((target >= 42 && G.P > 20) || G.P > 90)) pressFire(); }
      else if (G.power >= target || (G.P > 90 && G.power >= 50)) releaseFire();
      // козырь: когда давит, тихо и никто не смотрит
      if (!opts.notrump && G.trump.ready && L.trump && G.P > 70 && G.amb < L.base + 8 && !ws.length && !G.charging) useTrump();
      // облако гоним туда, где по прогнозу виноватым окажется не игрок
      const f = G.forecast.find(f => f.n && f.who.me) || G.forecast.find(f => Math.abs(f.c.x - G.me.x) < 160);
      if (f && !ws.length && !opts.nofan && Math.abs(f.c.x - G.me.x) < 250) {
        let tx = null; for (const v of G.fl.vents) if (tx === null || Math.abs(v.x - G.me.x) < Math.abs(tx - G.me.x)) tx = v.x;
        if (L.candle) tx = L.candle;
        if (tx === null) { const sc = G.npcs.find(o => o.scape), pr = (L.props || [])[0]; tx = pr ? pr.x : sc ? sc.x : G.me.x + 300; }
        keys[tx < f.c.x ? "ArrowLeft" : "ArrowRight"] = true;
      }
    }
    update(1 / 30);
    if (L.endless && G.t > 600) break;
  }
  keys = {}; showResult = realShow; buildBg = realBg;
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
