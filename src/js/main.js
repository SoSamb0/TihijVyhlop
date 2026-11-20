// ================= ЦИКЛ =================
function frame(ts) {
  const t = ts / 1000, dt = Math.min(0.05, t - lastT || 0.016); lastT = t;
  update(dt); BOIL = 1; SEED = 1;
  ctx.clearRect(0, 0, W, H);
  if (mode === "cutscene" && CS) drawCutscene(t); else if ((mode === "play" || mode === "pause" || mode === "result") && G) drawGame(t); else drawMenuBg(t);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
