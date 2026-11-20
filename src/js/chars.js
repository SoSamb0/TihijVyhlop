// ================= ПЕРСОНАЖИ =================
function CH(n, x, o = {}) {
  const d = { n, x, y: 505, sc: 1, pose: "sit", kind: "human", skin: "#ffc9a3", hair: "bald3", hairC: INK, brow: "thin", teeth: "none", hear: 1, sm: 1, nosey: 6, beh: { watch: .6, phone: .2, stare: .2 } };
  const c = Object.assign(d, o);
  c.head = Object.assign({ w: 50, h: 56, jaw: 0.85, skull: 1, tilt: 0 }, o.head);
  c.eyes = Object.assign({ l: 1, r: 1, gap: 0.42, dy: 0, col: "#fffbe6", pup: 0.4 }, o.eyes);
  c.nose = Object.assign({ t: "potato", s: 1, col: null }, o.nose);
  c.body = Object.assign({ w: 72, h: 64, col: CYAN, pants: "#3a2a55" }, o.body);
  return c;
}
function headPos(c) { if (c.kind !== "human") return { x: c.x, y: c.y - 60 }; return { x: c.x, y: c.y - (c.body.h + c.head.h * 0.8) * c.sc }; }
function headPts(hd) { const pts = []; for (let i = 0; i < 14; i++) { const a = i / 14 * 6.2832, sn = Math.sin(a), cs = Math.cos(a); const wx = sn > 0 ? lerp(hd.w, hd.w * hd.jaw, sn) : lerp(hd.w, hd.w * hd.skull, -sn); pts.push(cs * wx, sn * hd.h); } return pts; }

function drawHair(c, back) {
  const hd = c.head, w = hd.w * hd.skull, h = hd.h, col = c.hairC;
  const cap = (k = 1, top = 1) => { const pts = []; for (let i = 0; i <= 8; i++) { const a = Math.PI + i * Math.PI / 8; pts.push(Math.cos(a) * w * 1.05 * k, Math.sin(a) * h * 1.03 * top - h * 0.12); } return pts; };
  if (back) {
    if (c.hair === "long") shape([-w * 1.15, -h * .3, -w * 1.2, h * 1.2, -w * .5, h * 1.35, w * .5, h * 1.35, w * 1.2, h * 1.2, w * 1.15, -h * .3, 0, -h * 1.15], { fill: col });
    if (c.hair === "mullet") shape([-w * .9, 0, -w * 1.3, h * 1.3, -w * .2, h * 1.1, w * .2, h * 1.1, w * 1.3, h * 1.3, w * .9, 0], { fill: col });
    if (c.hair === "veil") shape([-w * 1.3, h * 1.4, -w * 1.25, -h * .4, 0, -h * 1.3, w * 1.25, -h * .4, w * 1.3, h * 1.4], { fill: c.veilC || "#1b1b1b" });
    if (c.hair === "afro") for (let i = 0; i < 9; i++) { const a = Math.PI * .85 + i * Math.PI * 1.3 / 8; wE(Math.cos(a) * w * 1.05, Math.sin(a) * h * 1.0 - h * .1, w * .42, h * .4, { fill: col, lw: 4 }); }
    return;
  }
  switch (c.hair) {
    case "bald3": for (let i = -1; i <= 1; i++) shape([i * 10, -h * .97, i * 16 + rj(3), -h * 1.25, i * 22, -h * 1.12], { closed: false, lw: 3.5 }); break;
    case "comb": shape([...cap(1, .95), w * .9, -h * .45, 0, -h * .62, -w * .95, -h * .35], { fill: col }); for (let i = 0; i < 4; i++) wL(-w * .7 + i * w * .4, -h * .95, -w * .5 + i * w * .4, -h * .6, 2, "#ffffff55"); break;
    case "buzz": shape([...cap(1, .97), w * .95, -h * .5, -w * .95, -h * .5], { fill: col }); dots(-w, -h * 1.1, w * 2, h * .55, "#00000055", 7, 1.2); break;
    case "spikes": { const pts = [-w * 1.02, -h * .3]; for (let i = 0; i <= 10; i++) { const a = Math.PI + i * Math.PI / 10, r = i % 2 ? 1.45 : 0.98; pts.push(Math.cos(a) * w * r, Math.sin(a) * h * r - h * .1); } pts.push(w * 1.02, -h * .3, 0, -h * .5); shape(pts, { fill: col, smooth: false }); break; }
    case "bowl": shape([...cap(1.02, 1), w * 1.05, h * .05, w * .7, -h * .18, 0, -h * .1, -w * .7, -h * .18, -w * 1.05, h * .05], { fill: col }); break;
    case "bun": shape([...cap(1, 1), w * .9, -h * .4, 0, -h * .55, -w * .9, -h * .4], { fill: col }); wE(0, -h * 1.2, w * .4, h * .3, { fill: col }); break;
    case "manbun": shape([...cap(1, .96), w * .9, -h * .45, 0, -h * .58, -w * .9, -h * .45], { fill: col }); wE(w * .15, -h * 1.15, w * .28, h * .22, { fill: col }); break;
    case "pigtails": shape([...cap(1, 1), w * .9, -h * .4, 0, -h * .6, -w * .9, -h * .4], { fill: col }); for (const s of [-1, 1]) { shape([s * w * 1.0, -h * .3, s * w * 1.7, -h * .5, s * w * 1.8, h * .5, s * w * 1.25, h * .2], { fill: col }); wE(s * w * 1.1, -h * .3, 7, 7, { fill: MAG, lw: 3 }); } break;
    case "pony": shape([...cap(1, 1), w * .9, -h * .4, 0, -h * .58, -w * .9, -h * .4], { fill: col }); shape([w * .6, -h * .95, w * 1.7, -h * .7, w * 1.5, h * .6, w * 1.05, -h * .2], { fill: col }); break;
    case "bob": case "long": shape([...cap(1.08, 1.02), w * 1.1, h * .5, w * .78, h * .45, w * .8, -h * .35, 0, -h * .6, -w * .8, -h * .35, -w * .78, h * .45, -w * 1.1, h * .5], { fill: col }); break;
    case "mullet": shape([...cap(1, 1), w * .95, -h * .45, w * .3, -h * .7, -w * .95, -h * .4], { fill: col }); break;
    case "messy": for (let i = 0; i < 9; i++) { const a = Math.PI + i * Math.PI / 8; shape([Math.cos(a) * w * .8, Math.sin(a) * h * .85, Math.cos(a + .2) * w * 1.2, Math.sin(a + .2) * h * 1.25, Math.cos(a + .35) * w * 1.45, Math.sin(a + .1) * h * 1.3], { closed: false, lw: 7, stroke: col }); } break;
    case "cap": shape([...cap(1.03, 1), w * 1.03, -h * .42, -w * 1.03, -h * .42], { fill: col }); shape([-w * .3, -h * .5, w * 1.6, -h * .42, w * 1.55, -h * .3, -w * .3, -h * .34], { fill: col }); break;
    case "beret": wE(w * .1, -h * .95, w * 1.05, h * .3, { fill: col }); wL(w * .1, -h * 1.22, w * .2, -h * 1.4, 4); break;
    case "scarf": shape([...cap(1.1, 1.05), w * 1.15, h * .6, w * .85, h * .95, w * .78, -h * .25, 0, -h * .55, -w * .78, -h * .25, -w * .85, h * .95, -w * 1.15, h * .6], { fill: col }); dots(-w, -h * 1.1, w * 2, h * .6, "#ffffffaa", 13, 2.6); shape([-12, h * .95, 0, h * 1.25, 12, h * .95, 0, h * 1.05], { fill: col, lw: 4 }); break;
    case "ushanka": shape([...cap(1.12, 1.08), w * 1.15, -h * .3, -w * 1.15, -h * .3], { fill: col }); for (const s of [-1, 1]) shape([s * w * .95, -h * .35, s * w * 1.35, -h * .3, s * w * 1.3, h * .55, s * w * .95, h * .35], { fill: lerpColor(col, "#ffffff", .25) }); wE(0, -h * .75, 9, 9, { fill: "#d00", lw: 3 }); break;
    case "afro": break;
    case "veil": shape([...cap(1.05, 1.02), w * .9, -h * .35, 0, -h * .5, -w * .9, -h * .35], { fill: c.veilC || "#1b1b1b" }); break;
    case "none": break;
  }
}
function drawFace(c, s, skin) {
  const hd = c.head, E = c.eyes, w = hd.w, h = hd.h, st = s.st || "watch", lk = s.look || { x: 0, y: 0 };
  const closed = st === "sleep" || st === "meditate";
  for (const sd of [-1, 1]) {
    const k = (sd < 0 ? E.l : E.r) * (s.bulge || 1) * (st === "shock" ? 1.3 : 1), r = w * 0.27 * k, ex = sd * w * E.gap, ey = -h * 0.14 + (sd > 0 ? E.dy : 0);
    if (E.bags) shape([ex - r, ey + r * .7, ex, ey + r * 1.6, ex + r, ey + r * .7], { closed: false, lw: 2.5 });
    if (closed) { shape([ex - r, ey, ex, ey + r * .55, ex + r, ey], { closed: false, lw: 4 }); for (let i = -1; i <= 1; i++) wL(ex + i * r * .5, ey + r * .35, ex + i * r * .7, ey + r * .75, 2); continue; }
    wE(ex, ey, r, r * 1.1, { fill: E.col, lw: 4 });
    if (E.vein || s.vein) { ctx.strokeStyle = "#e0245e"; ctx.lineWidth = 1.6; for (let i = 0; i < 3; i++) { const a = i * 2.1 + sd; ctx.beginPath(); ctx.moveTo(ex + Math.cos(a) * r * .9, ey + Math.sin(a) * r); ctx.lineTo(ex + Math.cos(a + .3) * r * .45, ey + Math.sin(a + .3) * r * .5); ctx.stroke(); } }
    const pr = r * (st === "shock" ? 0.2 : E.pup * (sd > 0 && E.lazy ? 1.5 : 1)), lx = (sd > 0 && E.lazy) ? -lk.x * .5 : lk.x;
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + lx * r * .45, ey + lk.y * r * .5, pr, 0, 7); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ex + lx * r * .45 - pr * .35, ey + lk.y * r * .5 - pr * .35, pr * .3, 0, 7); ctx.fill();
    if (st === "suspicious" || st === "stare" || st === "sniff") {
      const cut = st === "stare" ? 0.55 : 1.0;
      ctx.save(); ctx.beginPath(); ctx.ellipse(ex, ey, r + 3, r * 1.1 + 3, 0, 0, 7); ctx.clip(); ctx.fillStyle = skin; ctx.fillRect(ex - r - 5, ey - r * 1.3, r * 2 + 10, r * cut); ctx.restore();
      wL(ex - r, ey - r * (1.25 - cut), ex + r, ey - r * (1.25 - cut), 3.5);
    }
    // брови
    const by = ey - r * 1.55, bw = c.brow === "thick" || c.brow === "uni" ? 8 : c.brow === "none" ? 0 : 4.5;
    if (bw) {
      const tiltB = st === "suspicious" ? 9 : (st === "sniff" || s.worried) ? -8 : st === "shock" ? -3 : 0, up = st === "shock" ? 10 : 0;
      wL(ex - r * 1.05, by - up - tiltB * -sd * -1, ex + r * 1.05, by - up + tiltB * -sd * -1 * -1, bw);
    }
  }
  if (c.brow === "uni") wL(-w * E.gap, -h * .14 - w * .42, w * E.gap, -h * .14 - w * .42, 8);
  if (c.glasses) { const r = w * .34; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.arc(sd * w * E.gap, -h * .14, r, 0, 7); ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.stroke(); ctx.fillStyle = "#ffffff22"; ctx.fill(); } wL(-w * E.gap + r, -h * .14, w * E.gap - r, -h * .14, 3.5); }
  // нос
  const N = c.nose, ns = w * 0.2 * N.s, ncol = N.col || lerpColor(skin, "#e0245e", .28), ny = h * .16;
  if (N.t === "potato") { wE(2, ny, ns * 1.15, ns, { fill: ncol, lw: 4 }); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-ns * .4, ny + ns * .45, 2.4, 0, 7); ctx.arc(ns * .5, ny + ns * .45, 2.4, 0, 7); ctx.fill(); }
  else if (N.t === "hook") shape([-ns * .3, -h * .15, ns * 1.3, ny + ns * .6, ns * .2, ny + ns * 1.2, -ns * .6, ny + ns * .5], { fill: ncol, lw: 4 });
  else if (N.t === "pig") { wE(0, ny, ns * 1.3, ns * .95, { fill: ncol, lw: 4 }); wE(-ns * .5, ny, ns * .25, ns * .4, { fill: INK, lw: 0 }); wE(ns * .5, ny, ns * .25, ns * .4, { fill: INK, lw: 0 }); }
  else if (N.t === "long") shape([-ns * .5, -h * .12, ns * .6, -h * .1, ns * .9, ny + ns * 1.4, 0, ny + ns * 1.9, -ns * .8, ny + ns * 1.3], { fill: ncol, lw: 4 });
  else wE(0, ny, ns * .6, ns * .5, { fill: ncol, lw: 3.5 });
  if (c.wart) { wE(w * .5, h * .35, 5, 5, { fill: "#8a5a3a", lw: 2.5 }); wL(w * .5, h * .33, w * .58, h * .22, 1.5); }
  if (c.stubble) dots(-w * .6, h * .3, w * 1.2, h * .6, "#17081f88", 8, 1.3);
  if (c.blushC || s.blush) { ctx.fillStyle = s.blush || c.blushC; for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sd * w * .6, h * .22, w * .17, h * .1, 0, 0, 7); ctx.fill(); } }
  // рот
  const my = h * .55, ex = s.expr || "flat", mw = w * .32;
  if (c.beard) shape([-w * hd.jaw * .95, h * .25, -w * .5, h * 1.25, 0, h * 1.45, w * .5, h * 1.25, w * hd.jaw * .95, h * .25, 0, h * .42], { fill: c.beardC || c.hairC });
  const teeth = (x0, x1, y0, y1) => { const t = c.teeth; shape([x0, y0, x1, y0, x1, y1, x0, y1], { fill: t === "gold" ? YEL : "#fffbe6", lw: 3, smooth: false }); const n = t === "gap" ? 2 : 4; for (let i = 1; i < n; i++) wL(x0 + (x1 - x0) * i / n + rj(2), y0, x0 + (x1 - x0) * i / n + rj(3), y1, t === "gap" ? 6 : 2); };
  switch (ex) {
    case "o": wE(0, my, mw * .4, mw * .5, { fill: "#4a0d2a", lw: 3.5 }); break;
    case "shock": shape([-mw, my - 6, 0, my - 12, mw, my - 6, mw * .8, my + mw * 1.1, -mw * .8, my + mw * 1.1], { fill: "#4a0d2a", lw: 4 }); teeth(-mw * .6, mw * .6, my - 8, my + 2); wE(0, my + mw * .7, mw * .4, mw * .25, { fill: MAG, lw: 2.5 }); break;
    case "smile": shape([-mw, my - 4, 0, my + mw * .55, mw, my - 6], { closed: false, lw: 4 }); if (c.teeth === "buck") teeth(-7, 7, my + 2, my + 16); break;
    case "smug": shape([-mw * .8, my, 0, my + 4, mw, my - mw * .5], { closed: false, lw: 4 }); break;
    case "frown": shape([-mw, my + 8, 0, my - mw * .35, mw, my + 9], { closed: false, lw: 4 }); break;
    case "disgust": shape([-mw, my, -mw * .5, my - 7, 0, my + 5, mw * .5, my - 7, mw, my + 3], { closed: false, lw: 4, smooth: false }); shape([-4, my + 4, 12, my + 5, 14, my + 24, 2, my + 26], { fill: MAG, lw: 3 }); break;
    case "teeth": teeth(-mw, mw, my - 9, my + 9); break;
    case "relief": shape([-mw * .8, my - 2, 0, my + mw * .7, mw * .8, my - 2], { fill: "#4a0d2a", lw: 3.5 }); break;
    case "sleep": wE(mw * .2, my, 6, 7, { fill: "#4a0d2a", lw: 3 }); shape([mw * .3, my + 6, mw * .45, my + 22, mw * .25, my + 24], { fill: CYAN, lw: 2 }); break;
    case "cry": shape([-mw, my - 4, -mw * .3, my + 10, mw * .3, my - 2, mw, my + 12], { fill: "#4a0d2a", lw: 4 }); break;
    default: wL(-mw * .7, my + rj(2), mw * .7, my + 2, 4); if (c.teeth === "buck") teeth(-7, 7, my, my + 13);
  }
  if (c.must) shape([-w * .55, my - 4, -w * .2, my - 16, 0, my - 9, w * .2, my - 16, w * .55, my - 4, w * .25, my - 3, 0, my - 5, -w * .25, my - 3], { fill: c.mustC || c.hairC, lw: 3.5 });
  if (c.lips) wE(0, my, mw * .5, 5, { fill: "#e0245e", lw: 2.5 });
  if (c.dot) wE(0, -h * .55, 5, 5, { fill: "#e0245e", lw: 2 });
  if (c.cig) { wL(mw * .4, my, mw * 1.6, my + 6, 5, "#fff"); wE(mw * 1.7, my + 6, 3, 3, { fill: ORG, lw: 1.5 }); }
}
function drawChar(c, s = {}) {
  if (c.kind === "cat") return drawCat(c, s);
  if (c.kind === "dog") return drawDog(c, s);
  const B = c.body, bw = B.w, bh = B.h, skin = s.skin || c.skin, t = s.t || 0, hd = c.head;
  ctx.save(); ctx.translate(c.x, c.y + (s.lift || 0)); if (s.tilt) ctx.rotate(s.tilt); ctx.scale(c.sc, c.sc);
  const shoe = c.shoe || INK;
  if (c.pose === "lotus") { shape([-bw * .8, -4, 0, -14, bw * .8, -4, bw * .7, 20, -bw * .7, 20], { fill: B.pants }); wE(-bw * .55, 14, 15, 9, { fill: skin, lw: 3.5 }); wE(bw * .55, 14, 15, 9, { fill: skin, lw: 3.5 }); }
  else if (c.pose === "stand") { const st = s.walking ? Math.sin(t * 9) * 9 : 0; for (const sd of [-1, 1]) { shape([sd * bw * .08, -8, sd * bw * .38, -8, sd * bw * .34 + st * sd, 100, sd * bw * .1 + st * sd, 100], { fill: B.pants, smooth: false }); shape([sd * bw * .05 + st * sd, 98, sd * bw * .5 + st * sd, 100, sd * bw * .5 + st * sd, 114, sd * bw * .05 + st * sd, 114], { fill: shoe, lw: 4 }); } }
  else for (const sd of [-1, 1]) { shape([sd * bw * .06, -10, sd * bw * .42, -10, sd * bw * .42, 20, sd * bw * .36, 62, sd * bw * .12, 62, sd * bw * .1, 18], { fill: B.pants, smooth: false }); shape([sd * bw * .06, 60, sd * bw * .5, 62, sd * bw * .52, 74, sd * bw * .06, 74], { fill: shoe, lw: 4 }); }
  // тело
  const belly = B.fat || 0.6;
  const bp = [-bw * .42, -bh, bw * .42, -bh, bw * belly, -bh * .4, bw * .52, 0, -bw * .52, 0, -bw * belly, -bh * .4];
  if (B.pat === "mayka") { shape(bp, { fill: skin }); shape([-bw * .22, -bh, -bw * .1, -bh * .65, bw * .1, -bh * .65, bw * .22, -bh, bw * .36, -bh * .9, bw * (belly - .06), -bh * .4, bw * .5, 0, -bw * .5, 0, -bw * (belly - .06), -bh * .4, -bw * .36, -bh * .9], { fill: "#f4f4e8", lw: 4, smooth: false }); wE(bw * .15, -bh * .3, 9, 6, { fill: "#c9b037", lw: 0 }); }
  else shape(bp, { fill: B.col });
  if (B.pat === "stripes") for (let i = 1; i < 5; i++) wL(-bw * .5, -bh + i * bh / 5, bw * .5, -bh + i * bh / 5 + rj(2), 5, B.col2 || INK);
  if (B.pat === "dots") dots(-bw * .45, -bh + 6, bw * .9, bh - 10, B.col2 || "#fff", 14, 3.2);
  if (B.pat === "suit") { shape([-bw * .2, -bh, 0, -bh * .3, bw * .2, -bh], { fill: "#fff", lw: 3.5, smooth: false }); shape([0, -bh + 4, 7, -bh * .6, 0, -bh * .28, -7, -bh * .6], { fill: B.col2 || MAG, lw: 3, smooth: false }); }
  if (B.pat === "bow") { shape([-15, -bh - 2, 0, -bh + 7, -15, -bh + 16], { fill: INK, lw: 2, smooth: false }); shape([15, -bh - 2, 0, -bh + 7, 15, -bh + 16], { fill: INK, lw: 2, smooth: false }); for (let i = 0; i < 3; i++) wE(0, -bh * .7 + i * 14, 2.5, 2.5, { fill: INK, lw: 0 }); }
  if (B.pat === "cross") { wL(0, -bh * .8, 0, -bh * .2, 5, YEL); wL(-10, -bh * .6, 10, -bh * .6, 5, YEL); }
  if (B.pat === "hatch") hatch(-bw * .5, -bh, bw, bh, "#00000044", 8, 2);
  // руки
  const arm = (sd, x2, y2, hand = true) => { shape([sd * bw * .44, -bh * .85, sd * bw * .7, -bh * .45, x2, y2], { closed: false, lw: 15, stroke: INK }); shape([sd * bw * .44, -bh * .85, sd * bw * .7, -bh * .45, x2, y2], { closed: false, lw: 9, stroke: B.sleeve || (B.pat === "mayka" ? skin : B.col), j: 0 }); if (hand) wE(x2, y2, 10, 9, { fill: skin, lw: 3.5 }); };
  const am = s.arm || "down";
  if (am === "fanL" || am === "fanR") { const d = am === "fanL" ? -1 : 1, a = Math.sin(t * 24) * 22; arm(d, d * bw * 1.25, -bh * 1.0 + a); arm(-d, -d * bw * .6, -4); for (let i = 0; i < 3; i++) wL(d * (bw * 1.5 + i * 12), -bh * 1.2 + i * 16, d * (bw * 1.9 + i * 12), -bh * 1.2 + i * 16, 3, "#ffffffcc"); }
  else if (am === "phone") { arm(-1, -8, -bh * .45, false); arm(1, 8, -bh * .45, false); shape([-15, -bh * .72, 15, -bh * .72, 15, -bh * .2, -15, -bh * .2], { fill: INK, lw: 3, smooth: false }); shape([-11, -bh * .66, 11, -bh * .66, 11, -bh * .3, -11, -bh * .3], { fill: CYAN, lw: 0, smooth: false }); }
  else if (am === "belly") { arm(-1, -bw * .15, -bh * .3); arm(1, bw * .15, -bh * .3); }
  else if (am === "pray") { arm(-1, -4, -bh * .6); arm(1, 4, -bh * .6); }
  else { arm(-1, -bw * .62, -6); arm(1, bw * .62, -6); }
  if (c.prop === "beer") { shape([bw * .5, -34, bw * .78, -34, bw * .78, 2, bw * .5, 2], { fill: ORG, lw: 3.5, smooth: false }); shape([bw * .48, -40, bw * .8, -40, bw * .8, -30, bw * .48, -30], { fill: "#fff", lw: 3 }); }
  if (c.prop === "bags") for (const sd of [-1, 1]) { shape([sd * bw * .5, 4, sd * bw * 1.0, 0, sd * bw * 1.05, 58, sd * bw * .45, 60], { fill: sd < 0 ? MAG : YEL, lw: 4 }); dots(sd > 0 ? bw * .5 : -bw, 8, bw * .5, 46, "#00000033", 9, 2); }
  if (c.prop === "censer") { wL(bw * .62, -6, bw * .8, 50, 2.5); wE(bw * .82, 60, 11, 12, { fill: YEL, lw: 3.5 }); for (let i = 0; i < 3; i++) shape([bw * .82 + Math.sin(t * 3 + i) * 8, 44 - i * 18, bw * .82 + Math.sin(t * 3 + i + 1) * 12, 34 - i * 18, bw * .82 + Math.sin(t * 3 + i + 2) * 8, 24 - i * 18], { closed: false, lw: 3, stroke: "#ffffff99" }); }
  // голова
  const bob = Math.sin(t * 2 + c.x * .01) * 2;
  ctx.translate(0, -bh - hd.h * .8 + bob); ctx.rotate(hd.tilt + (s.headTilt || 0));
  shape([-hd.w * hd.jaw * .35, hd.h * .7, hd.w * hd.jaw * .35, hd.h * .7, hd.w * .3, hd.h * 1.05, -hd.w * .3, hd.h * 1.05], { fill: skin, lw: 4, smooth: false });
  drawHair(c, true);
  const es = c.ears || 1; for (const sd of [-1, 1]) { wE(sd * hd.w * 1.0, 2, hd.w * .2 * es, hd.h * .24 * es, { fill: skin, lw: 4 }); if (c.earring && sd > 0) wE(sd * hd.w * 1.05, hd.h * .3, 5, 5, { fill: YEL, lw: 2.5 }); }
  if (c.hp) shape([-hd.w * 1.05, 0, -hd.w * .8, -hd.h * 1.15, hd.w * .8, -hd.h * 1.15, hd.w * 1.05, 0], { closed: false, lw: 8 });
  if (c.chin2) wE(0, hd.h * .82, hd.w * hd.jaw * .7, hd.h * .25, { fill: skin, lw: 3.5 });
  shape(headPts(hd), { fill: skin, lw: 5 });
  if (s.puff) for (const sd of [-1, 1]) wE(sd * hd.w * hd.jaw * .85, hd.h * .4, hd.w * .3, hd.h * .25, { fill: skin, lw: 4 });
  drawHair(c, false);
  if (c.hp) for (const sd of [-1, 1]) wE(sd * hd.w * 1.05, 2, 13, 19, { fill: s.hpOff ? "#888" : MAG, lw: 4 });
  if (c.aid) { wE(hd.w * 1.05, 6, 7, 10, { fill: s.aidOn ? LIME : "#b9a", lw: 3 }); }
  drawFace(c, s, skin);
  if (s.sweat) for (let i = 0; i < s.sweat; i++) { const sx = hd.w * (0.8 + i * 0.16) * (i % 2 ? -1 : 1), sy = -hd.h * .5 + ((t * 70 + i * 33) % 60); shape([sx, sy - 9, sx + 7, sy + 4, sx, sy + 8, sx - 7, sy + 4], { fill: CYAN, lw: 2.5 }); }
  ctx.restore();
}
function drawCat(c, s) {
  const t = s.t || 0, st = s.st, lk = s.look || { x: 0, y: 0 };
  ctx.save(); ctx.translate(c.x, c.y);
  shape([-40, -12, -75 + Math.sin(t * 2) * 12, -30, -88, -70, -70, -95], { closed: false, lw: 13 }); shape([-40, -12, -75 + Math.sin(t * 2) * 12, -30, -88, -70, -70, -95], { closed: false, lw: 7, stroke: ORG, j: 0 });
  wE(0, -22, 50, 27, { fill: ORG }); for (let i = -1; i <= 1; i++) wL(i * 18, -44, i * 18 + 6, -22, 5, "#b0500a");
  shape([-34, -60, -38, -100, -14, -84, 0, -88, 14, -84, 36, -104, 36, -60, 28, -34, 0, -26, -28, -34], { fill: ORG });
  if (st === "sleep") { shape([-22, -62, -13, -57, -5, -62], { closed: false, lw: 3 }); shape([7, -62, 15, -57, 23, -62], { closed: false, lw: 3 }); }
  else { const b = st === "shock" || st === "suspicious" ? 1.35 : 1; wE(-14, -64, 11 * b, 13 * b, { fill: LIME, lw: 3.5 }); wE(15, -62, 8 * b, 10 * b, { fill: LIME, lw: 3.5 }); ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(-14 + lk.x * 4, -64, 3, 10 * b, 0, 0, 7); ctx.ellipse(15 - lk.x * 2, -62, 2.5, 7 * b, 0, 0, 7); ctx.fill(); }
  shape([-5, -52, 5, -52, 0, -46], { fill: MAG, lw: 2.5, smooth: false }); for (const sd of [-1, 1]) for (let i = 0; i < 2; i++) wL(sd * 12, -48 + i * 5, sd * 46, -54 + i * 10, 2);
  if (st === "sniff" || st === "suspicious") shape([-8, -42, 0, -34, 8, -42], { closed: false, lw: 3 });
  ctx.restore();
}
function drawDog(c, s) {
  const t = s.t || 0, st = s.st, d = c.face || -1;
  ctx.save(); ctx.translate(c.x, c.y); ctx.scale(-d, 1);
  shape([36, -30, 52 + Math.sin(t * 14) * 6, -52, 46, -62], { closed: false, lw: 8 });
  wE(0, -24, 44, 25, { fill: "#e9d7ae" }); for (const x of [-26, 22]) shape([x, -8, x + 12, -8, x + 12, 10, x, 10], { fill: "#e9d7ae", lw: 3.5 });
  wE(-30, -58, 32, 28, { fill: "#e9d7ae" }); wE(-56, -52, 11, 22, { fill: "#6b4a2a", lw: 4 }); wE(-6, -52, 11, 22, { fill: "#6b4a2a", lw: 4 });
  wE(-34, -46, 16, 12, { fill: "#3a2616", lw: 3.5 });
  if (st === "sleep") { wL(-46, -64, -38, -64, 3); wL(-26, -64, -18, -64, 3); } else for (const sd of [-1, 1]) { wE(-32 + sd * 11, -66, 8, 9, { fill: "#fffbe6", lw: 3 }); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-32 + sd * 11 - 2, -65, 3.5, 0, 7); ctx.fill(); }
  wE(-40, -50, 6, 5, { fill: INK, lw: 0 }); shape([-36, -38, -30, -24, -24, -38], { fill: MAG, lw: 2.5 });
  if (s.sniffing) for (let i = 0; i < 3; i++) wL(-60 - i * 8, -50 + i * 4, -72 - i * 8, -56 + i * 6, 2.5);
  ctx.restore();
}

