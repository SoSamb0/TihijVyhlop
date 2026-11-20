// Бот для проверки баланса. В консоли страницы игры:
//   (0,eval)(await (await fetch('/src/bot.js')).text()); runAll(24,false)
// spam=true — стратегия «пукать по малому без остановки» (должна проигрывать).
muted = true; window._sr = showResult; window._bb = buildBg;
window.bot = function (i, spam, skill) {
  skill = skill || 0.93;
  showResult = function () { mode = 'done'; }; buildBg = function () {}; foodIdx = 0; startLevel(i);
  const L = G.L; let n = 0, hissing = false;
  while (mode === 'play' && n < 5000) {
    n++; keys = {};
    const lm = loudMult(), k = L.surface * lm, safe = (G.amb * skill) / k, sp = 1;
    const need = 30 + 70 * Math.pow(Math.min(1, G.P / (64 * sp)), 1 / 1.2);
    let target = Math.min(100, safe, need);
    const ws = watchers(); if (ws.some(w => w.faceWatch)) target = Math.min(target, 52); if (ws.length) target = Math.min(target, 78);
    const dur = 0.25 + target / 100 * 1.1, ev = G.active.filter(a => a.def.amb > 15).sort((a, b) => b.def.amb - a.def.amb)[0];
    if (ev && (ev.dur - ev.t) < dur + (L.echo ? 0.9 : 0.35)) target = Math.min(target, (L.base * 0.9) / k);
    if (spam) { if (!G.charging && G.cd <= 0 && G.P > 8) { G.charging = true; G.power = 0; } else if (G.charging && G.power >= Math.max(31, Math.min(36, safe))) releaseFart(false); }
    else {
      if (!G.charging) { if (G.cd <= 0 && ((target >= 42 && G.P > 20) || G.P > 90)) { G.charging = true; G.power = 0; } }
      else if (G.power >= target || (G.P > 90 && G.power >= 50)) releaseFart(false);
      const c = G.clouds.find(c => c.s > 4 && Math.abs(c.x - G.me.x) < 230);
      if (c && !ws.length && !window.NOFAN) {
        let tx = null; for (const v of G.fl.vents) if (tx === null || Math.abs(v.x - G.me.x) < Math.abs(tx - G.me.x)) tx = v.x;
        if (L.candle) tx = L.candle;
        if (tx === null) { const sc = G.npcs.find(o => o.scape), pr = (L.props || [])[0]; tx = pr ? pr.x : sc ? sc.x : G.me.x + 300; }
        keys[tx < c.x ? 'ArrowLeft' : 'ArrowRight'] = true;
      }
    }
    update(1 / 30);
  }
  keys = {}; showResult = window._sr; buildBg = window._bb;
  return { win: !!(G.result && G.result.win), why: G.result && G.result.why, sus: Math.round(G.sus), gas: Math.round(G.gas), bl: G.stats.blamed, fr: G.stats.framed, hd: G.stats.heard };
};
window.runAll = function (N, spam, skill) {
  const out = {};
  for (let i = 0; i < LEVELS.length; i++) {
    let w = 0, s = 0, g = 0, bl = 0, fr = 0, hd = 0; const why = {};
    for (let r = 0; r < N; r++) { const x = bot(i, spam, skill); g += x.gas; bl += x.bl; fr += x.fr; hd += x.hd; if (x.win) { w++; s += x.sus; } else why[x.why] = (why[x.why] || 0) + 1; }
    out[(i + 1) + ' ' + LEVELS[i].id] = `${w}/${N} sus${w ? Math.round(s / w) : '-'} gas${Math.round(g / N)}/${quotaOf(LEVELS[i])} bl${(bl / N).toFixed(1)} fr${(fr / N).toFixed(1)} hd${(hd / N).toFixed(1)} ${JSON.stringify(why)}`;
  }
  mode = 'menu'; G = null; show('ovMenu'); muted = false;
  return JSON.stringify(out, null, 1);
};
