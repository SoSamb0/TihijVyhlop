// ================= СОСТОЯНИЕ =================
let G = null, mode = "menu", keys = {}, lastT = 0, levelIdx = 0, bgCache = null;

// i — номер уровня в LEVELS, или -1 для бесконечного режима
function startLevel(i) {
  levelIdx = i; const L = i < 0 ? ENDLESS : LEVELS[i];
  const me = P_YOU(); me.x = L.px; me.y = L.standAll ? 470 : L.lotusAll ? 540 : 505; me.pose = L.standAll ? "stand" : L.lotusAll ? "lotus" : "sit";
  G = {
    L, t: 0, dur: L.endless ? Infinity : 60, P: 22, sus: 0, power: 0, charging: false, fanDir: 0, cd: 0,
    me, npcs: L.npcs.map(makeNpc), sources: [], clouds: [], fx: [], floats: [],
    // событие с полем at — по сценарию (свадьба), иначе случайное с интервалом every
    evs: L.events.map(e => ({ def: e, next: e.at !== undefined ? e.at : rnd(e.every[0] * 0.35, e.every[1] * 0.7) })),
    active: [], amb: L.base, wind: 0, fl: { vents: [] },
    rumble: { next: rnd(4, 6), on: false, t: 0, amt: 0 }, heardT: 0, tut: i === 0 ? 0 : 9,
    trump: { ready: true, cd: 0 }, forecast: [],
    motes: Array.from({ length: 26 }, () => ({ x: rnd(140, 1250), y: rnd(120, 560), s: rnd(.5, 1.3) })),
    stats: { farts: 0, heard: 0, framed: 0, framedBy: {}, blamed: 0, cleanPowers: [], vented: 0, burned: 0, maxSus: 0, trumpUsed: false },
    over: false, endT: 0, shake: 0, hbT: 0, flash: 0, lastFart: -9
  };
  buildBg(L); mode = "play"; hideAll();
}
function makeNpc(o) {
  const n = Object.assign({}, o, { bubble: null, susT: 0, heardAcc: 0, dir: 1, lastQ: -10, home: o.x, aidT: o.aid ? rnd(8, 12) : 0, aidOn: 0, sniff: null });
  n.cycle = buildCycle(n); n.ci = Math.floor(Math.random() * n.cycle.length);
  enterCycle(n, rnd(0.2, 0.8));
  return n;
}
function buildBg(L) {
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const real = ctx; ctx = c.getContext("2d"); BOIL = 1; SEED = 1; SCENES[L.id].bg(); ctx = real; bgCache = c;
}

// ---- ритм персонажей ----
// Вместо случайных состояний у каждого свой цикл: «спит 9с → смотрит в телик 4с → косится на тебя 3с → ...».
// Цикл строится из весов beh: чем больше вес, тем дольше состояние.
function buildCycle(n) {
  const ents = Object.entries(n.beh).sort((a, b) => b[1] - a[1]), cyc = [];
  for (const [st, w] of ents) if (st !== "stare") cyc.push([st, st === "sleep" || st === "meditate" ? 5 + w * 8 : 3 + w * 6]);
  if (n.beh.stare) cyc.push(["stare", 1.8 + n.beh.stare * 4]);
  return cyc.length ? cyc : [["watch", 5]];
}
function enterCycle(n, frac = 1) {
  const [st, d] = n.cycle[n.ci]; n.state = st; n.stDur = d * rnd(0.88, 1.12); n.stT = n.stDur * frac;
}
function nextCycleState(n) { return n.cycle[(n.ci + 1) % n.cycle.length][0]; }
// за 1.2 с до того, как персонаж станет внимательнее, над ним загорается «!»
function warnsSoon(n) { return n.susT <= 0 && !n.sniff && n.stT < 1.2 && ATTN[nextCycleState(n)] > ATTN[n.state] + 0.2; }

function addFloat(text, x, y, color = "#fff", size = 26) { G.floats.push({ text, x, y, color, size, t: 0 }); }
function addFx(text, x, y, size, col) { G.fx.push({ text, x, y, size, col, t: 0, rot: rnd(-.25, .25) }); }
function say(n, text, dur = 2.6) { n.bubble = { text, t: 0, dur }; n.lastQ = G.t; }
function distFactor(n) { return clamp(1.45 - Math.abs(n.x - G.me.x) / 560, 0.3, 1.45); }
function hearMul(n) { let h = n.hear; if (n.hp && !G.fl.doors) h *= 0.1; if (n.aidOn > 0) h *= 3; return h; }
function attnOf(n) { return n.aidOn > 0 ? Math.max(ATTN[n.state], 1.2) : ATTN[n.state]; }
function alertAll(by) { for (const n of G.npcs) if (n !== by && isHuman(n)) { n.state = "suspicious"; n.susT = 4; } }
function isHuman(n) { return n.kind === "human"; }
function watchers() { return G.npcs.filter(n => isHuman(n) && (n.state === "stare" || n.state === "suspicious")); }
function loudMult() { return G.active.reduce((m, a) => m * (a.def.loudMult || 1), 1); }
function pressureMult() { return G.L.hard * (G.L.endless ? 1 + G.t / 90 : 1); }

// ---- залп ----
function releaseFart(forced) {
  const L = G.L, me = G.me, power = forced ? 100 : G.power;
  G.power = 0; G.charging = false;
  if (power < 30) { addFloat("слишком слабо — ничего не вышло", me.x, me.y - 215, "#fff", 20); G.cd = 0.5; return; }
  const loud = forced ? 130 : power * L.surface * loudMult() * rnd(0.9, 1.12);
  const dur = forced ? 2.2 : clamp(0.25 + power / 100 * 1.1, 0.25, 1.35);
  G.cd = 1.3; if (G.tut === 0) G.tut = 1;
  const gas = Math.min(G.P, gasFor(power, 1));
  G.P -= gas; G.stats.farts++; G.lastFart = G.t;
  const src = { kind: "fart", loud, t: 0, dur, reacted: new Set(), power, wasHeard: false };
  G.sources.push(src);
  playFart(power, loud, dur);
  const heard = loud > G.amb + HEAR_MARGIN;
  addFx(pick(loud > 55 ? ONO.big : loud > 22 ? ONO.mid : ONO.small), me.x + 95, me.y - 30, clamp(20 + loud * 0.7, 22, 90), heard ? MAG : LIME);
  spawnCloud(gas * 0.75);
  G.shake = Math.max(G.shake, loud / 45);
}
function spawnCloud(amount) {
  const L = G.L, me = G.me, s = amount * L.stink * rnd(0.8, 1.2);
  if (s < 0.5) return null;
  const c = { x: me.x + 22, y: me.y - 8, r: 48, s, pv: 0, age: 0, smelled: new Set(), vented: false, blobs: Array.from({ length: 8 }, () => ({ a: rnd(0, 6.28), d: rnd(0.15, 0.8), r: rnd(0.4, 0.62), w: rnd(0.5, 2) })) };
  G.clouds.push(c); if (G.clouds.length > 9) G.clouds.shift(); return c;
}
function burst() {
  G.P = 100; releaseFart(true);
  G.npcs.forEach(n => { n.state = "shock"; n.susT = 99; say(n, n.kind === "cat" ? "*в ужасе лезет на шкаф*" : n.kind === "dog" ? "АУ-У-У-У!" : pick(Q.burst), 3); });
  G.shake = 16; G.flash = 1; lose("burst");
}
function lose(why) {
  if (G.over) return; G.over = true; G.result = { win: false, why }; G.endT = 2.4; G.charging = false;
  if (why === "caught") G.npcs.forEach(n => { n.state = "suspicious"; n.susT = 99; if (!n.bubble && isHuman(n)) say(n, pick(Q.caught), 3); });
  setTimeout(() => jingle(false), 500);
}
function win() { G.over = true; G.result = { win: true }; G.endT = 1.3; G.charging = false; jingle(true); }

// ---- козырь ----
// Один раз за уровень (в «Смене» — раз в 30 с) создаёт громкий момент. Кто смотрит на тебя, видит, что это ты.
function useTrump() {
  const T = G.L.trump; if (!T || !G.trump.ready || G.over) return;
  G.trump.ready = false; G.trump.cd = G.L.endless ? 30 : Infinity; G.stats.trumpUsed = true;
  G.active.push({ def: { name: T.name, icon: T.icon, amb: T.amb, warn: 1, trump: true }, t: 0, dur: T.dur });
  playEventSound(T.snd, T.dur); G.flash = 0.6;
  addFx(T.name.toUpperCase() + "!", G.me.x, G.me.y - 260, 30, YEL);
  for (const n of watchers()) { G.sus += 12 * n.sm; n.state = "suspicious"; n.susT = 4; say(n, pick(["Ты чего?", "Это ты специально?", "Что за цирк?", "Ты нарочно шумишь?"])); }
}

// ---- кто виноват ----
// Кандидаты: ты, все персонажи и предметы (гроб). Виноват тот, кто ближе к облаку.
function blameTarget(n, cx) {
  const cands = [{ me: true, x: G.me.x, n: "ты" }];
  for (const o of G.npcs) { if (o === n && (n.sniffer || Math.abs(o.x - cx) > 75)) continue; cands.push({ o, x: o.x, n: o.n, self: o === n }); }
  for (const p of (G.L.props || [])) cands.push({ prop: p, x: p.x, n: p.n });
  cands.sort((a, b) => Math.abs(a.x - cx) - Math.abs(b.x - cx));
  return cands[0];
}
function judge(n, c) {
  const who = blameTarget(n, c.x), amt = Math.max(c.s, 4);
  if (who.self) { // облако висит над самим нюхачом: не понял, откуда несёт
    G.sus += 2; say(n, n.kind === "dog" ? "*чихает и крутится на месте*" : pick(["Фу! Откуда несёт?!", "Чем это пахнет? Канализация?", "Кто-то сдох под полом?", "Господи, опять трубы прорвало?"]), 2.6);
    n.susT = 0; addFloat("не понял, откуда", c.x, 300, "#fff", 22);
  } else if (who.me) {
    const add = clamp(9 + amt * 0.7, 10, 30) * n.sm * (G.heardT > 0 ? 1.25 : 1);
    G.sus += add; G.stats.blamed++;
    say(n, n.kind === "dog" ? "ГАВ! ГАВ! (на тебя)" : n.kind === "cat" ? "*смотрит на тебя с отвращением*" : n.snitch ? pick(["ЭТО ОН НАВОНЯЛ! Я ВИДЕЛ!", "А ОН ПУКНУЛ! ФУУУ!", "МАРЬ ИВАННА, ОН ВОНЯЕТ!"]) : pick(Q.accuse), 3);
    n.state = "suspicious"; n.susT = 5; addFloat(`+${Math.round(add)} подозрения`, G.me.x, G.me.y - 250, MAG, 24); blip(200);
    if (n.snitch || n.gossip) alertAll(n);
  } else {
    G.sus = Math.max(0, G.sus - 4); G.stats.framed++; G.stats.framedBy[who.n] = (G.stats.framedBy[who.n] || 0) + 1;
    say(n, n.kind === "dog" ? `ГАВ! (на ${who.n})` : pick(Q.frame).replace(/\{s\}/g, who.n), 3);
    if (who.o) { const o = who.o; say(o, o.kind === "cat" ? "Мяу?.. (за что)" : o.kind === "dog" ? "*виновато скулит*" : o.state === "sleep" ? "Хр-р... а? Что?" : pick(Q.protest), 2.6); }
    addFloat("ПОДСТАВА!", c.x, 300, LIME, 30); blip(1200);
  }
}

// ---- прогноз облака ----
// Прокручиваем облако на 4 с вперёд с текущим ветром: кто учует первым и на кого подумает.
function forecastCloud(c) {
  const L = G.L, xmin = L.xmin || 130, xmax = L.xmax || 1255, dt = 0.1;
  let x = c.x, r = c.r, s = c.s, pv = c.pv; const path = [x];
  for (let t = dt; t <= 4; t += dt) {
    r = Math.min(240, r + 30 * dt); pv *= Math.exp(-1.1 * dt); x += (G.wind + pv) * dt;
    let k = L.decay; for (const v of G.fl.vents) if (Math.abs(x - v.x) < v.w) { k += v.k; x += (v.x - x) * Math.min(1, dt * 1.2); }
    s *= Math.exp(-k * dt);
    if (x < xmin || x > xmax) { if (G.fl.open) return { path, gone: true }; x = clamp(x, xmin, xmax); }
    path.push(x);
    if (s < 0.7) return { path, gone: true };
    for (const n of G.npcs) {
      if (c.smelled.has(n) || n.sniff || n.sniffer) continue;
      if (s * clamp(1.15 - Math.abs(x - n.x) / r, 0, 1) > n.nosey) {
        // ещё полторы секунды принюхивания: облако продолжает лететь
        let x2 = x, pv2 = pv; for (let u = 0; u < 1.5; u += dt) { pv2 *= Math.exp(-1.1 * dt); x2 = clamp(x2 + (G.wind + pv2) * dt, xmin, xmax); }
        return { path, n, t, who: blameTarget(n, x2) };
      }
    }
  }
  return { path };
}

// ---- обновление ----
function update(dt) {
  if (mode !== "play" || !G) return;
  const L = G.L, me = G.me; G.t += dt;
  G.fx.forEach(f => f.t += dt); G.fx = G.fx.filter(f => f.t < 1.1);
  G.floats.forEach(f => f.t += dt); G.floats = G.floats.filter(f => f.t < 1.8);
  G.npcs.forEach(n => { if (n.bubble) { n.bubble.t += dt; if (n.bubble.t > n.bubble.dur) n.bubble = null; } });
  G.shake = Math.max(0, G.shake - dt * 12); G.flash = Math.max(0, G.flash - dt * 2);
  if (G.over) { G.endT -= dt; updateBed(0, 700); if (G.endT <= 0) { if (G.result.win) { G.endT = 99; storyAfter(G.L, showResult); } else showResult(); } return; }

  // события
  for (const e of G.evs) if (G.t >= e.next) {
    const d = rnd(e.def.dur[0], e.def.dur[1]); G.active.push({ def: e.def, t: 0, dur: d }); playEventSound(e.def.snd, d);
    if (e.def.pressureAdd) { G.P += e.def.pressureAdd; addFloat(`+${e.def.pressureAdd} давления!`, me.x, me.y - 230, MAG, 24); }
    if (e.def.amb > 30) G.flash = 1;
    if (e.def.doors && L.endless) swapPassenger();
    e.next = e.def.at !== undefined ? Infinity : G.t + d + rnd(e.def.every[0], e.def.every[1]);
  }
  let amb = L.base, tint = L.tint, wind = L.wind(G.t); const fl = { vents: L.vents.slice(), open: !L.closed, light: 0 };
  for (const a of G.active) {
    a.t += dt; const env = clamp(a.t / 0.35, 0, 1) * clamp((a.dur - a.t) / 0.4, 0, 1); amb += a.def.amb * env;
    if (a.def.tint && env > 0.5) tint = a.def.tint;
    if (a.def.wind !== undefined) wind = a.def.wind;
    if (a.def.doors) fl.doors = true; if (a.def.open) fl.open = true; if (a.def.vent) fl.vents.push(a.def.vent);
    if (a.def.pose) fl.pose = a.def.pose; if (a.def.flash) fl.light = Math.max(fl.light, env);
    if (a.def.allStare) fl.allStare = true;
  }
  G.active = G.active.filter(a => a.t < a.dur);
  G.amb = clamp(amb + Math.sin(G.t * 1.7) * 1.5 + Math.sin(G.t * 3.3), 0, 100); G.wind = wind; G.fl = fl;
  if (!G.trump.ready) { G.trump.cd -= dt; if (G.trump.cd <= 0) { G.trump.ready = true; addFloat("козырь снова готов (E)", me.x, me.y - 230, YEL, 20); } }

  // управление: стрелки гонят облако
  const left = keys.ArrowLeft || keys.KeyA, right = keys.ArrowRight || keys.KeyD;
  G.fanDir = left ? -1 : right ? 1 : 0;

  // давление: ровный рост + урчание волнами
  const pm = pressureMult();
  G.P += L.g0 * pm * dt;
  const R = G.rumble;
  if (!R.on && G.t >= R.next) { R.on = true; R.t = 0; R.amt = rnd(L.sp[0], L.sp[1]) * pm; const loud = rnd(9, 17); G.sources.push({ kind: "rumble", loud, t: 0, dur: 1.2, reacted: new Set() }); playRumble(clamp(loud / 40, 0.2, 0.6)); addFx("УРРРЛ", me.x - 90, me.y - 60, 30, YEL); }
  if (R.on) { R.t += dt; G.P += R.amt / 1.6 * dt; if (R.t >= 1.6) { R.on = false; R.next = G.t + rnd(L.spT[0], L.spT[1]); } }
  if (G.P >= 100) { burst(); return; }
  if (G.P > 85) { G.hbT -= dt; if (G.hbT <= 0) { heartbeat(); G.hbT = 0.75; } }
  G.cd = Math.max(0, G.cd - dt);
  if (G.charging) G.power = Math.min(100, G.power + 68 * dt);
  updateBed(G.amb, tint);

  // слух
  for (const s of G.sources) {
    s.t += dt;
    const env = clamp(s.t / 0.06, 0, 1) * clamp((s.dur - s.t) / (s.dur * 0.25), 0, 1);
    s.cur = s.loud * env; const excess = s.cur - G.amb - HEAR_MARGIN; s.masked = excess <= 0;
    if (excess > 0) for (const n of G.npcs) {
      const h = excess * hearMul(n) * distFactor(n) * attnOf(n) * (s.kind === "fart" ? 1 : 0.35);
      G.sus += h * dt * 0.9 * n.sm; n.heardAcc += h * dt;
      if (s.kind === "fart" && h > 0.5) { G.heardT = 4; s.wasHeard = true; }
      if (!s.reacted.has(n) && n.heardAcc > 1.1) {
        s.reacted.add(n);
        if (G.t - n.lastQ > 1.5) say(n, n.kind === "cat" ? pick(["Мяу?!", "МРРЯУ!"]) : n.kind === "dog" ? pick(["Гав?!", "Р-р-р?"]) : s.kind === "rumble" ? pick(Q.rumble) : n.snitch ? pick(["А ОН ПУКНУЛ!", "ХА-ХА! ПУК!", "Я ВСЁ РАССКАЖУ!"]) : pick(Q.hear));
        n.state = "suspicious"; n.susT = s.kind === "rumble" ? 3 : rnd(4, 6);
        if (s.kind === "fart") { G.stats.heard++; blip(660); if (n.snitch || n.gossip) alertAll(n); }
      }
    }
  }
  for (const s of G.sources) if (s.kind === "fart" && s.t >= s.dur && !s.wasHeard && s.loud < 130) G.stats.cleanPowers.push(s.power);
  G.sources = G.sources.filter(s => s.t < s.dur);
  G.npcs.forEach(n => n.heardAcc = Math.max(0, n.heardAcc - dt * 0.6)); G.heardT = Math.max(0, G.heardT - dt);

  // взгляды
  const ws = watchers();
  if (G.charging && G.power > 80 && ws.length) G.sus += 1.0 * ws.length * dt;
  const face = ws.find(n => n.faceWatch);
  if (face && G.charging && G.power > 55) { G.sus += 9 * dt; if (G.t - face.lastQ > 3) say(face, pick(Q.strain)); }
  const own = G.clouds.find(c => c.s > 8 && Math.abs(c.x - me.x) < 70 && c.age > 1.2);
  if (own && ws.length) { G.sus += 1.8 * ws.length * dt; if (Math.random() < dt * 0.6) addFloat("над тобой зелёное марево!", me.x, me.y - 250, LIME, 20); }
  if (G.fanDir && ws.length) { G.sus += 1.6 * ws.length * dt; const w = ws[0]; if (Math.random() < dt * 0.3 && G.t - w.lastQ > 4) say(w, pick(Q.fan)); }

  // облака
  const xmin = L.xmin || 130, xmax = L.xmax || 1255;
  for (const c of G.clouds) {
    c.age += dt; c.r = Math.min(240, c.r + 30 * dt); c.y += (395 - c.y) * Math.min(1, dt * 0.7);
    if (G.fanDir && Math.abs(c.x - me.x) < 250) c.pv = clamp(c.pv + G.fanDir * 420 * dt, -210, 210);
    c.pv *= Math.exp(-1.1 * dt); c.x += (wind + c.pv) * dt;
    let k = L.decay;
    for (const v of fl.vents) if (Math.abs(c.x - v.x) < v.w) { k += v.k; c.x += (v.x - c.x) * Math.min(1, dt * 1.2); c.vented = true; }
    c.s *= Math.exp(-k * dt);
    if (c.x < xmin || c.x > xmax) { if (fl.open) { c.s = 0; c.vented = true; } else { c.x = clamp(c.x, xmin, xmax); c.pv *= -0.4; } }
    c.candleT = L.candle && c.s > 7 && Math.abs(c.x - L.candle) < 42 ? (c.candleT || 0) + dt : 0;
    if (c.candleT > 0.4) {
      addFx("ПЫХ!", L.candle, 380, 70, ORG); G.flash = .8; G.sources.push({ kind: "rumble", loud: 40, t: 0, dur: 0.5, reacted: new Set() }); if (canPlay()) noiseBurst(0, 0.5, "lowpass", 500, 0.8);
      if (!ws.length) { G.stats.burned++; addFloat("УЛИКИ СОЖЖЕНЫ", L.candle, 320, YEL, 26); } c.s = 0;
    }
    for (const n of G.npcs) {
      if (c.smelled.has(n) || n.sniff) continue;
      const amt = c.s * clamp(1.15 - Math.abs(c.x - n.x) / c.r, 0, 1);
      if (amt > n.nosey) {
        c.smelled.add(n);
        if (isHuman(n)) { n.sniff = { c, t: 1.5 }; n.state = "sniff"; n.susT = 2.2; say(n, pick(Q.sniff), 1.4); }
        else if (n.kind === "cat") { n.state = "suspicious"; n.susT = 3; say(n, pick(["*кашляет шерстью*", "Мяу. Фу.", "*уходит, шатаясь*"]), 2); }
      }
    }
  }
  for (const c of G.clouds) if (c.s <= 0.7 && c.vented && c.age > 0.5) { G.stats.vented++; if (G.stats.vented <= 3) addFloat("облако выветрилось", c.x, 330, CYAN, 20); }
  G.clouds = G.clouds.filter(c => c.s > 0.7);
  G.forecast = G.clouds.filter(c => c.s > 3).slice(-3).map(c => Object.assign(forecastCloud(c), { c }));
  for (const m of G.motes) { m.x += wind * m.s * dt * 1.3 + Math.sin(G.t * m.s + m.y) * 6 * dt; if (m.x < 130) m.x = 1255; if (m.x > 1255) m.x = 130; }

  // персонажи
  for (const n of G.npcs) {
    if (n.sniff) { n.sniff.t -= dt; if (n.sniff.t <= 0) { judge(n, n.sniff.c); n.sniff = null; } }
    if (n.aid) { n.aidT -= dt; if (n.aidOn > 0) { n.aidOn -= dt; if (n.aidOn <= 0) n.aidT = rnd(n.aid.every[0], n.aid.every[1]); } else if (n.aidT <= 0) { n.aidOn = n.aid.dur; say(n, "Ась? Щас аппарат включу!", 2); blip(1500); } }
    if (n.susT > 0) { n.susT -= dt; if (n.susT <= 0) { n.ci = (n.ci + 1) % n.cycle.length; enterCycle(n); } }
    else { n.stT -= dt; if (n.stT <= 0) { n.ci = (n.ci + 1) % n.cycle.length; enterCycle(n); } }
    if (fl.allStare && isHuman(n) && n.susT <= 0 && !n.sniff) n.state = "stare";
    else if (!fl.allStare && n.susT <= 0 && !n.sniff) n.state = n.cycle[n.ci][0];
    if (n.walk) { const sp = (n.state === "suspicious" || n.state === "sniff") ? 0 : n.walk.speed; n.x += n.dir * sp * dt; if (n.x > n.walk.b) { n.x = n.walk.b; n.dir = -1; } if (n.x < n.walk.a) { n.x = n.walk.a; n.dir = 1; } }
    if (n.sniffer) {
      let best = null; for (const c of G.clouds) if (c.s > 4 && !c.dogged && (!best || c.s > best.s)) best = c;
      const tx = best ? best.x : n.home; n.sniffing = !!best;
      if (Math.abs(tx - n.x) > 6) { n.face = tx > n.x ? 1 : -1; n.x += n.face * (best ? 85 : 50) * dt; }
      else if (best) { best.dogged = true; judge(n, best); }
    }
  }
  if (!G.sources.some(s => s.kind === "fart" && !s.masked)) G.sus -= 0.6 * dt;
  G.sus = clamp(G.sus, 0, 100); G.stats.maxSus = Math.max(G.stats.maxSus, G.sus);
  if (G.sus >= 100) { lose("caught"); return; }
  if (G.t >= G.dur) win();
}

// «Смена»: на остановке один пассажир выходит, на его место садится случайный другой
function swapPassenger() {
  const idx = G.npcs.map((n, i) => i).filter(i => !G.npcs[i].sniff);
  if (!idx.length) return;
  const i = pick(idx), old = G.npcs[i], pool = passengerPool().filter(p => !G.npcs.some(n => n.n === p.n));
  if (!pool.length) return;
  const nw = makeNpc(Object.assign({}, pick(pool), { x: old.x, y: old.kind === "cat" ? 505 : old.y }));
  if (nw.kind === "cat") nw.y = 505;
  G.npcs[i] = nw;
  addFloat(`${old.n} вышел(а), вошёл(ла) ${nw.n}`, old.x, 250, "#fff", 18);
}

// ---- доп. цели ----
function goalDone(g, st, won) {
  switch (g.k) {
    case "frameWho": return (st.framedBy[g.who] || 0) >= 1;
    case "vent": return st.vented >= g.n;
    case "burn": return st.burned >= g.n;
    case "big": return st.cleanPowers.filter(p => p >= g.p).length >= g.n;
    case "noHeard": return won && st.heard === 0;
    case "noBlame": return won && st.blamed === 0;
    case "noTrump": return won && !st.trumpUsed;
    case "maxSus": return won && st.maxSus <= g.n;
    case "farts": return won && st.farts <= g.n;
  }
  return false;
}
// для HUD: ещё не провалена ли цель вида «ни разу не...»
function goalFailed(g, st) {
  switch (g.k) {
    case "noHeard": return st.heard > 0;
    case "noBlame": return st.blamed > 0;
    case "noTrump": return st.trumpUsed;
    case "maxSus": return st.maxSus > g.n;
    case "farts": return st.farts > g.n;
  }
  return false;
}
function goalProgress(g, st) {
  if (g.k === "vent") return `${Math.min(st.vented, g.n)}/${g.n}`;
  if (g.k === "big") return `${Math.min(st.cleanPowers.filter(p => p >= g.p).length, g.n)}/${g.n}`;
  if (g.k === "farts") return `${st.farts}/${g.n}`;
  return "";
}

function showResult() {
  mode = "result"; updateBed(0, 700);
  const L = G.L, r = G.result; let st = 0;
  $("rsTitle").textContent = L.endless ? "СМЕНА ОКОНЧЕНА" : r.win ? "ТЫ ВЫЖИЛ" : r.why === "burst" ? "ПРОРВАЛО" : "ТЕБЯ РАСКРЫЛИ";
  if (L.endless) {
    const sec = Math.floor(G.t), rec = save.endless || 0, isRec = sec > rec;
    if (isRec) { save.endless = sec; persist(); }
    $("rsStars").textContent = `${sec} с`;
    $("rsText").textContent = (r.why === "burst" ? "Тебя разорвало на перегоне. " : "Тебя вычислили. ") + (isRec ? "Это новый рекорд!" : `Рекорд: ${rec} с.`);
    $("rsStats").innerHTML = [["Продержался", sec + " с"], ["Рекорд", Math.max(sec, rec) + " с"], ["Залпов", G.stats.farts], ["Подставил других", G.stats.framed + " раз"]].map(([a, b]) => `<span>${a}</span><b>${b}</b>`).join("");
    $("rsGoals").innerHTML = ""; $("bRsNext").style.display = "none"; $("rsPaper").style.display = "none"; show("ovResult"); return;
  }
  const goals = (L.goals || []).map(g => goalDone(g, G.stats, r.win));
  if (r.win) {
    st = G.sus < 20 ? 3 : G.sus < 45 ? 2 : 1;
    save.stars[L.id] = Math.max(save.stars[L.id] || 0, st);
    save.unlocked = Math.max(save.unlocked, Math.min(LEVELS.length, levelIdx + 2));
  }
  const prev = save.goals[L.id] || [];
  save.goals[L.id] = goals.map((d, i) => d || !!prev[i]); persist();
  $("rsStars").textContent = r.win ? "★".repeat(st) + "☆".repeat(3 - st) : "💀";
  $("rsPaper").style.display = r.win ? "none" : "";
  if (!r.win) $("rsHead").textContent = L.news ? L.news[r.why === "burst" ? 1 : 0] : "";
  $("rsText").textContent = r.win ? L.win + (levelIdx === LEVELS.length - 1 ? " Ты прошёл всю игру. Тебе больше нечего бояться. Кроме смерти. И шаурмы." : "")
    : r.why === "burst" ? "Звук был слышен в соседнем районе. Сейсмологи зафиксировали толчок в 3 балла. Штаны не выжили." : L.lose;
  $("rsGoals").innerHTML = (L.goals || []).map((g, i) => `<div class="${goals[i] ? "ok" : prev[i] ? "old" : "no"}">${goals[i] ? "✔" : prev[i] ? "✔" : "✘"} ${g.t}${!goals[i] && prev[i] ? " <i>(выполнено раньше)</i>" : ""}</div>`).join("");
  const rows = [["Залпов", G.stats.farts], ["Тебя услышали", G.stats.heard + " раз"], ["Тебя учуяли", G.stats.blamed + " раз"], ["Подставил других", G.stats.framed + " раз"], ["Подозрение в конце", Math.round(G.sus) + "%"]];
  $("rsStats").innerHTML = rows.map(([a, b]) => `<span>${a}</span><b>${b}</b>`).join("");
  $("bRsNext").style.display = r.win && levelIdx < LEVELS.length - 1 ? "" : "none";
  show("ovResult");
}
