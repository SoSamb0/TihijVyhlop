"use strict";
// ================= УТИЛИТЫ =================
const W = 1280, H = 720, INK = "#17081f";
const MAG = "#ff2d95", LIME = "#b6ff3b", CYAN = "#22e0ff", YEL = "#ffe53b", PUR = "#7a2cff", ORG = "#ff7a1a", PAPER = "#f6eed3";
const cv = document.getElementById("c");
let ctx = cv.getContext("2d");
const $ = id => document.getElementById(id);
const rnd = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const pick = a => a[Math.floor(Math.random() * a.length)];
function lerpColor(c1, c2, t) {
  const a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
  const r = Math.round(lerp(a >> 16, b >> 16, t)), g = Math.round(lerp((a >> 8) & 255, (b >> 8) & 255, t)), bl = Math.round(lerp(a & 255, b & 255, t));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
}
function fitStage() { $("stage").style.transform = `translate(-50%,-50%) scale(${Math.min(innerWidth / W, innerHeight / H) * 0.985})`; }
addEventListener("resize", fitStage); fitStage();

// ---- дрожащая тушь ----
let BOIL = 0, SEED = 1;
function rj(a) { const n = Math.sin((SEED++) * 12.9898 + BOIL * 78.233) * 43758.5453; return ((n - Math.floor(n)) - 0.5) * 2 * a; }
function trace(P, smooth, closed, ox, oy) {
  const n = P.length; ctx.beginPath();
  if (!smooth) { ctx.moveTo(P[0][0] + ox, P[0][1] + oy); for (let i = 1; i < n; i++) ctx.lineTo(P[i][0] + ox, P[i][1] + oy); if (closed) ctx.closePath(); return; }
  if (closed) {
    ctx.moveTo((P[n - 1][0] + P[0][0]) / 2 + ox, (P[n - 1][1] + P[0][1]) / 2 + oy);
    for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n]; ctx.quadraticCurveTo(a[0] + ox, a[1] + oy, (a[0] + b[0]) / 2 + ox, (a[1] + b[1]) / 2 + oy); }
  } else {
    ctx.moveTo(P[0][0] + ox, P[0][1] + oy);
    for (let i = 1; i < n - 1; i++) { const a = P[i], b = P[i + 1]; ctx.quadraticCurveTo(a[0] + ox, a[1] + oy, (a[0] + b[0]) / 2 + ox, (a[1] + b[1]) / 2 + oy); }
    ctx.lineTo(P[n - 1][0] + ox, P[n - 1][1] + oy);
  }
}
// универсальная фигура: заливка слегка съезжает относительно контура, как в дешёвой печати
function shape(pts, o = {}) {
  const j = o.j === undefined ? 2 : o.j, lw = o.lw === undefined ? 5 : o.lw, closed = o.closed !== false, smooth = o.smooth !== false;
  const P = []; for (let i = 0; i < pts.length; i += 2) P.push([pts[i] + rj(j), pts[i + 1] + rj(j)]);
  if (o.fill) { trace(P, smooth, closed, o.reg === 0 ? 0 : 2.5, o.reg === 0 ? 0 : 2); ctx.fillStyle = o.fill; ctx.fill(); }
  if (lw > 0) { trace(P, smooth, closed, 0, 0); ctx.lineWidth = Math.max(1, lw + rj(lw * 0.2)); ctx.strokeStyle = o.stroke || INK; ctx.lineJoin = ctx.lineCap = "round"; ctx.stroke(); }
}
function wE(x, y, rx, ry, o = {}) { const n = o.n || 12, pts = []; for (let i = 0; i < n; i++) { const a = i / n * 6.2832 + (o.rot || 0); pts.push(x + Math.cos(a) * rx, y + Math.sin(a) * ry); } shape(pts, o); }
function wR(x, y, w, h, o = {}) { shape([x, y, x + w / 2, y, x + w, y, x + w, y + h / 2, x + w, y + h, x + w / 2, y + h, x, y + h, x, y + h / 2], Object.assign({ smooth: false }, o)); }
function wL(x1, y1, x2, y2, lw = 4, col = INK) { shape([x1, y1, (x1 + x2) / 2, (y1 + y2) / 2, x2, y2], { closed: false, lw, stroke: col }); }
function dots(x, y, w, h, col, step = 10, r = 2) { ctx.fillStyle = col; let row = 0; for (let yy = y; yy < y + h; yy += step * 0.86, row++) for (let xx = x + (row % 2 ? step / 2 : 0); xx < x + w; xx += step) { ctx.beginPath(); ctx.arc(xx, yy, r, 0, 7); ctx.fill(); } }
function hatch(x, y, w, h, col = INK, step = 9, lw = 2) { ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip(); ctx.strokeStyle = col; ctx.lineWidth = lw; for (let i = -h; i < w; i += step) { ctx.beginPath(); ctx.moveTo(x + i, y + h); ctx.lineTo(x + i + h, y); ctx.stroke(); } ctx.restore(); }
function T(s, x, y, size = 20, col = INK, align = "center", font = "Rubik", weight = 900) { ctx.font = `${weight} ${size}px ${font}, Rubik, system-ui, sans-serif`; ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.fillText(s, x, y); }
function TO(s, x, y, size = 20, col = "#fff", align = "center", lw = 6, font = "Rubik") { ctx.font = `900 ${size}px ${font}, Rubik, system-ui, sans-serif`; ctx.textAlign = align; ctx.textBaseline = "middle"; ctx.lineJoin = "round"; ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.strokeText(s, x, y); ctx.fillStyle = col; ctx.fillText(s, x, y); }
function wrap(s, maxW, size, font = "Neucha") { ctx.font = `400 ${size}px ${font}, Rubik, sans-serif`; const words = s.split(" "), lines = []; let cur = ""; for (const w of words) { const t = cur ? cur + " " + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; } if (cur) lines.push(cur); return lines; }
// бумажное зерно
const grain = document.createElement("canvas"); grain.width = 320; grain.height = 180;
(() => { const g = grain.getContext("2d"); for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${Math.random() < 0.5 ? "0,0,0" : "255,255,255"},${Math.random() * 0.1})`; g.fillRect(Math.random() * 320, Math.random() * 180, 1 + Math.random() * 2, 1 + Math.random() * 2); } })();

