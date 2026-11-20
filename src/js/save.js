// ================= СОХРАНЕНИЕ =================
const SAVE_KEY = "tihiy_vyhlop_v2";
let save = { unlocked: 1, stars: {}, goals: {}, endless: 0 };
try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s && s.unlocked) { save = Object.assign(save, s); delete save.best; } } catch (e) {}
function persist() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch (e) {} }

