// ================= МЕНЮ =================
function hideAll() { document.querySelectorAll(".ov").forEach(o => o.classList.remove("show")); }
function show(id) { hideAll(); $(id).classList.add("show"); }
function buildLevels() {
  const g = $("lvGrid"); g.innerHTML = "";
  LEVELS.forEach((L, i) => {
    const locked = i + 1 > save.unlocked, st = save.stars[L.id] || 0, d = document.createElement("div"); d.className = "lv" + (locked ? " locked" : "");
    const gd = (save.goals[L.id] || []).filter(Boolean).length;
    d.innerHTML = `<div class="num">${i + 1}</div><div class="em">${locked ? "🔒" : L.em}</div><div class="nm">${L.name}</div><div class="sk">${"💀".repeat(L.skulls)}</div><div class="st">${"★".repeat(st)}${"☆".repeat(3 - st)}</div><div class="gl">🎯 ${gd}/${(L.goals || []).length}</div>`;
    if (!locked) d.onclick = () => { initAudio(); openIntro(i); }; g.appendChild(d);
  });
  const e = $("bEndless"), open = save.unlocked >= 3;
  e.className = "endless" + (open ? "" : " locked");
  e.innerHTML = open ? `♾️ СМЕНА В МЕТРО <small>бесконечный режим · рекорд ${save.endless || 0} с</small>` : `🔒 СМЕНА В МЕТРО <small>откроется после «Опенспейса»</small>`;
  e.onclick = open ? () => { initAudio(); openIntro(-1); } : null;
}
function openIntro(i) {
  levelIdx = i; const L = i < 0 ? ENDLESS : LEVELS[i];
  $("inName").textContent = i < 0 ? `${L.em} ${L.name}` : `${L.em} ${i + 1}. ${L.name}`; $("inSkulls").textContent = i < 0 ? `рекорд: ${save.endless || 0} с` : "💀".repeat(L.skulls) + "🤍".repeat(5 - L.skulls);
  $("inText").textContent = L.intro; $("inRule").textContent = "ПРАВИЛО: " + L.rule;
  $("inTips").innerHTML = L.tips.map(t => `<div>• ${t}</div>`).join("") + (L.trump ? `<div>${L.trump.icon} Козырь (${TOUCH ? "★" : "E"}): <b>${L.trump.name}</b> — один громкий момент, когда захочешь. Только не на глазах у всех.</div>` : "") + (i < 0 ? "" : "<div>⏱ Продержись 60 секунд: не лопни и не попадись.</div>");
  const done = save.goals[L.id] || [];
  $("inGoals").style.display = L.goals && L.goals.length ? "" : "none";
  $("inGoals").innerHTML = "<b>ДОП. ЦЕЛИ (по желанию)</b>" + (L.goals || []).map((g, k) => `<div class="${done[k] ? "ok" : ""}">${done[k] ? "✔" : "•"} ${g.t}</div>`).join("");
  mode = "intro"; G = null; show("ovIntro");
}
$("bPlay").onclick = () => { initAudio(); buildLevels(); show("ovLevels"); mode = "levels"; };
$("bHow").onclick = () => show("ovHow"); $("bHowBack").onclick = () => show("ovMenu");
$("bCred").onclick = () => { $("credList").innerHTML = CREDITS.length ? CREDITS.map(c => `<div>🔊 <b>${c.title}</b> — ${c.author}, ${c.license}<br><span style="opacity:.7">${c.url}</span></div>`).join("") : "<div>Все звуки синтезированы.</div>"; show("ovCred"); };
$("bCredBack").onclick = () => show("ovMenu");
$("bReset").onclick = () => { if (confirm("Точно стереть прогресс? Это как кремация — назад не вернуть.")) { save = { unlocked: 1, stars: {}, goals: {}, endless: 0 }; persist(); } };
$("bLvBack").onclick = () => { show("ovMenu"); mode = "menu"; };
$("bStart").onclick = () => { initAudio(); startLevel(levelIdx); };
$("bInBack").onclick = () => { buildLevels(); show("ovLevels"); mode = "levels"; };
$("bResume").onclick = () => { hideAll(); mode = "play"; };
$("bRestart").onclick = () => startLevel(levelIdx);
$("bPMenu").onclick = () => { updateBed(0, 700); buildLevels(); show("ovLevels"); mode = "levels"; };
$("bRsRetry").onclick = () => startLevel(levelIdx);
$("bRsNext").onclick = () => { buildLevels(); openIntro(levelIdx + 1); };
$("bStart").textContent = TOUCH ? "НАЧАТЬ" : "НАЧАТЬ (Enter)";
$("bRsMenu").onclick = () => { buildLevels(); show("ovLevels"); mode = "levels"; };
function pause() { mode = "pause"; G.charging = false; G.power = 0; keys = {}; updateBed(0, 700); show("ovPause"); }
// общие действия для клавиатуры и сенсорных кнопок
function pressFire() { if (mode !== "play" || !G || G.over) return; if (G.cd > 0) addFloat("рано, отдышись!", G.me.x, G.me.y - 215, "#fff", 20); else { G.charging = true; G.power = 0; } }
function releaseFire() { if (mode === "play" && G && !G.over && G.charging) releaseFart(false); }
addEventListener("keydown", e => {
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
  if (e.repeat) return; keys[e.code] = true;
  if (e.code === "KeyM") muted = !muted;
  if (mode === "intro" && e.code === "Enter") { initAudio(); startLevel(levelIdx); return; }
  if (mode === "pause" && e.code === "Escape") { hideAll(); mode = "play"; return; }
  if (mode !== "play" || !G || G.over) return;
  if (e.code === "Space") pressFire();
  if (e.code === "KeyE") useTrump();
  if (e.code === "Escape") pause();
});
addEventListener("keyup", e => { keys[e.code] = false; if (e.code === "Space") releaseFire(); });
addEventListener("blur", () => { keys = {}; if (mode === "play" && G && !G.over) pause(); });

// ================= ФОН МЕНЮ =================
const menuNpc = CH("Баба", 1120, { y: 560, sc: 1.35, skin: "#f6d9c4", head: { w: 46, h: 52, jaw: .95 }, eyes: { l: .8, r: .8, gap: .42, bags: true }, nose: { t: "hook", s: 1.3 }, hair: "scarf", hairC: MAG, glasses: true, wart: true, teeth: "gap", body: { w: 78, h: 60, col: PUR, pat: "dots", col2: YEL, pants: "#5a3a2a", fat: .7 } });
const menuMe = P_YOU(); menuMe.x = 160; menuMe.y = 560; menuMe.sc = 1.35;
function drawMenuBg(t) {
  SEED = 1; ctx.fillStyle = MAG; ctx.fillRect(0, 0, W, H); dots(0, 0, W, H, "#ff6fb8", 22, 6);
  for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283 + t * 0.05; shape([640, 360, 640 + Math.cos(a) * 1200, 360 + Math.sin(a) * 1200, 640 + Math.cos(a + .2) * 1200, 360 + Math.sin(a + .2) * 1200], { fill: i % 2 ? "#ffe53b55" : "#22e0ff33", lw: 0, smooth: false, j: 0 }); }
  for (let i = 0; i < 6; i++) { const x = (i * 230 + t * 40) % (W + 300) - 150, y = 120 + (i * 97) % 480; drawCloud({ x, y, r: 70 + (i % 3) * 20, s: 14, blobs: MB[i] }, t); }
  const p = (Math.sin(t * 0.8) + 1) / 2; SEED = 300;
  drawChar(menuMe, { st: "watch", expr: p > 0.6 ? "teeth" : "smile", look: { x: 0.6, y: 0 }, t, skin: lerpColor("#ffc9a3", "#ff6b5a", p), sweat: p > 0.7 ? 3 : 0, puff: p > 0.6, arm: p > .6 ? "belly" : "down", vein: p > .7 });
  SEED = 600; const sus = Math.sin(t * 0.5) > 0.2; drawChar(menuNpc, { st: sus ? "suspicious" : "sleep", expr: sus ? "frown" : "sleep", look: { x: -1, y: 0 }, t });
  SEED = 8000; wR(4, 4, W - 8, H - 8, { lw: 8 }); ctx.globalAlpha = 0.55; ctx.drawImage(grain, 0, 0, W, H); ctx.globalAlpha = 1;
}
const MB = Array.from({ length: 6 }, () => Array.from({ length: 8 }, () => ({ a: rnd(0, 6.28), d: rnd(0.15, 0.8), r: rnd(0.4, 0.62), w: rnd(0.5, 2) })));

