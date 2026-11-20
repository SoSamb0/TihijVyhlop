// ================= СЕНСОРНОЕ УПРАВЛЕНИЕ =================
// На телефоне и планшете поверх игры появляются кнопки: «ЗАЖМИ» (как пробел), ← → (гнать облако), ★ (козырь), II (пауза).
const TOUCH = matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
(function setupTouch() {
  if (!TOUCH) return;
  const hold = (id, down, up) => {
    const el = $(id);
    const on = e => { e.preventDefault(); initAudio(); el.classList.add("down"); down(); };
    const off = e => { e.preventDefault(); if (!el.classList.contains("down")) return; el.classList.remove("down"); if (up) up(); };
    el.addEventListener("pointerdown", on); el.addEventListener("pointerup", off); el.addEventListener("pointercancel", off); el.addEventListener("pointerleave", off);
  };
  hold("tFire", pressFire, releaseFire);
  hold("tL", () => { keys.ArrowLeft = true; }, () => { keys.ArrowLeft = false; });
  hold("tR", () => { keys.ArrowRight = true; }, () => { keys.ArrowRight = false; });
  hold("tTrump", useTrump);
  hold("tPause", () => { if (mode === "play" && G && !G.over) pause(); });
  // кнопки видны только во время игры
  setInterval(() => {
    $("touch").classList.toggle("on", mode === "play" && !!G && !G.over);
    if (G && G.L) { $("tTrump").classList.toggle("off", !G.trump.ready); $("tTrump").style.display = G.L.trump ? "" : "none"; }
  }, 100);
})();
