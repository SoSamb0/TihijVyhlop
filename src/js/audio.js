// ================= АУДИО =================
let AC = null, master = null, bedGain = null, bedFilter = null, muted = false;
const SAMPLES = { fart: [], rumble: [] };
function initAudio() {
  if (AC) { if (AC.state === "suspended") AC.resume(); return; }
  AC = new (window.AudioContext || window.webkitAudioContext)();
  master = AC.createGain(); master.gain.value = 0.9; master.connect(AC.destination);
  const nb = AC.createBuffer(1, AC.sampleRate * 3, AC.sampleRate), d = nb.getChannelData(0); let last = 0;
  for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.2; }
  const src = AC.createBufferSource(); src.buffer = nb; src.loop = true;
  bedFilter = AC.createBiquadFilter(); bedFilter.type = "lowpass"; bedFilter.frequency.value = 700;
  bedGain = AC.createGain(); bedGain.gain.value = 0; src.connect(bedFilter).connect(bedGain).connect(master); src.start();
  if (SOUND_DATA) for (const kind of ["fart", "rumble"]) for (const s of (SOUND_DATA[kind] || [])) {
    const bin = atob(s.b64), arr = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    AC.decodeAudioData(arr.buffer).then(buf => SAMPLES[kind].push({ buf, dur: buf.duration })).catch(() => {});
  }
}
function whiteNoise(dur) { const b = AC.createBuffer(1, Math.max(1, Math.floor(AC.sampleRate * dur)), AC.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; const s = AC.createBufferSource(); s.buffer = b; return s; }
function envGain(t, a, peak, dur, rel = 0.1) { const g = AC.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.setValueAtTime(peak, t + Math.max(a, dur - rel)); g.gain.linearRampToValueAtTime(0.0001, t + dur); return g; }
function canPlay() { return AC && !muted; }
function playFart(power, loud, dur, delay = 0, volMul = 1) {
  if (!canPlay()) return;
  const vol = clamp(0.12 + loud / 100 * 0.9, 0.05, 1.1) * volMul;
  if (SAMPLES.fart.length && Math.random() < 0.85) {
    // записи делятся по длине: короткие — для слабых залпов, длинные — для мощных
    const sorted = SAMPLES.fart.slice().sort((a, b) => a.dur - b.dur), n = sorted.length;
    const lo = power < 55 ? 0 : power < 80 ? Math.floor(n / 3) : Math.floor(n * 2 / 3), hi = power < 55 ? Math.ceil(n / 3) : power < 80 ? Math.ceil(n * 2 / 3) : n;
    const s = sorted[Math.floor(rnd(lo, Math.max(lo + 1, hi)))];
    const src = AC.createBufferSource(); src.buffer = s.buf; const rate = rnd(0.85, 1.25); src.playbackRate.value = rate;
    const len = Math.min(s.dur / rate, dur + 0.15), t = AC.currentTime + delay, g = envGain(t, 0.01, vol, len, Math.min(0.15, len * 0.3));
    src.connect(g).connect(master); src.start(t); src.stop(t + len + 0.05);
  } else synthFart(power, vol, dur, delay);
}
function synthFart(power, vol, dur, delay = 0) {
  const t = AC.currentTime + delay, base = rnd(55, 120) * (power < 25 ? 1.8 : 1);
  const osc = AC.createOscillator(); osc.type = "sawtooth"; osc.frequency.setValueAtTime(base * 1.25, t); osc.frequency.exponentialRampToValueAtTime(base * rnd(0.55, 0.85), t + dur);
  const lfo = AC.createOscillator(); lfo.frequency.value = rnd(14, 34); const lfoG = AC.createGain(); lfoG.gain.value = base * rnd(0.25, 0.5); lfo.connect(lfoG).connect(osc.frequency);
  const am = AC.createGain(); am.gain.value = 0.55; const amO = AC.createOscillator(); amO.type = "square"; amO.frequency.value = rnd(8, 26); const amG = AC.createGain(); amG.gain.value = 0.45; amO.connect(amG).connect(am.gain);
  const lp = AC.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 350 + power * 9; lp.Q.value = rnd(3, 9);
  const nz = whiteNoise(dur + 0.1), bp = AC.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = rnd(250, 600); const nzG = AC.createGain(); nzG.gain.value = rnd(0.1, 0.35);
  const g = envGain(t, 0.02, vol * 0.9, dur, 0.12); osc.connect(am).connect(lp).connect(g); nz.connect(bp).connect(nzG).connect(g); g.connect(master);
  [osc, lfo, amO, nz].forEach(n => { n.start(t); n.stop(t + dur + 0.05); });
}
function playSqueak() { if (!canPlay()) return; const t = AC.currentTime, o = AC.createOscillator(); o.type = "square"; o.frequency.setValueAtTime(rnd(500, 800), t); o.frequency.exponentialRampToValueAtTime(rnd(900, 1400), t + 0.18); const g = envGain(t, 0.01, 0.22, 0.22, 0.05); o.connect(g).connect(master); o.start(t); o.stop(t + 0.25); }
function playRumble(vol = 0.5) {
  if (!canPlay()) return; const t = AC.currentTime;
  if (SAMPLES.rumble.length && Math.random() < 0.7) { const s = pick(SAMPLES.rumble), src = AC.createBufferSource(); src.buffer = s.buf; const len = Math.min(s.dur, 1.6), g = envGain(t, 0.05, vol * 1.2, len, 0.3); src.connect(g).connect(master); src.start(t); src.stop(t + len + 0.05); return; }
  const o = AC.createOscillator(); o.type = "sine"; o.frequency.setValueAtTime(rnd(50, 70), t); o.frequency.linearRampToValueAtTime(rnd(90, 140), t + 0.5); o.frequency.linearRampToValueAtTime(rnd(40, 60), t + 1.2);
  const lfo = AC.createOscillator(); lfo.frequency.value = rnd(6, 12); const lg = AC.createGain(); lg.gain.value = 25; lfo.connect(lg).connect(o.frequency);
  const n = whiteNoise(1.3), lp = AC.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 180; const ng = AC.createGain(); ng.gain.value = 0.6;
  const g = envGain(t, 0.1, vol, 1.3, 0.4); o.connect(g); n.connect(lp).connect(ng).connect(g); g.connect(master); [o, lfo, n].forEach(x => { x.start(t); x.stop(t + 1.35); });
}
function tone(freq, start, dur, type = "triangle", vol = 0.2) { const t = AC.currentTime + start, o = AC.createOscillator(); o.type = type; o.frequency.value = freq; const g = envGain(t, 0.02, vol, dur, Math.min(0.2, dur * 0.4)); o.connect(g).connect(master); o.start(t); o.stop(t + dur + 0.05); return o; }
function noiseBurst(start, dur, ftype, freq, vol, q = 1) { const t = AC.currentTime + start, n = whiteNoise(dur), f = AC.createBiquadFilter(); f.type = ftype; f.frequency.value = freq; f.Q.value = q; const g = AC.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur); n.connect(f).connect(g).connect(master); n.start(t); n.stop(t + dur + 0.05); }
const NOTE = n => 440 * Math.pow(2, (n - 69) / 12);
function playEventSound(kind, dur) {
  if (!canPlay() || !kind) return;
  switch (kind) {
    case "boom": noiseBurst(0, Math.min(dur, 2.5), "lowpass", 160, 1.0); noiseBurst(0, 0.5, "lowpass", 900, 0.5); break;
    case "thunder": noiseBurst(0, 0.3, "highpass", 1500, 0.3); noiseBurst(0.1, Math.min(dur, 3), "lowpass", 120, 0.9); break;
    case "crash": for (let i = 0; i < 4; i++) noiseBurst(i * 0.06, 0.25, "highpass", rnd(2500, 5000), 0.5); break;
    case "gong": [110, 167, 222, 301].forEach((f, i) => { const t = AC.currentTime, o = AC.createOscillator(); o.frequency.value = f; const g = AC.createGain(); g.gain.setValueAtTime(0.25 / (i + 1), t); g.gain.exponentialRampToValueAtTime(0.001, t + 3.5); o.connect(g).connect(master); o.start(t); o.stop(t + 3.6); }); break;
    case "om": [110, 110.7, 165, 220.5].forEach(f => tone(f, 0, dur, "sawtooth", 0.05)); break;
    case "bowl": tone(523, 0, dur, "sine", 0.12); tone(527, 0, dur, "sine", 0.1); break;
    case "cough": for (let i = 0; i < 3; i++) noiseBurst(i * 0.22, 0.16, "bandpass", rnd(600, 1000), 0.7, 2); break;
    case "ring": for (let i = 0; i < Math.floor(dur / 0.6); i++) { tone(1000, i * 0.6, 0.12, "square", 0.06); tone(1300, i * 0.6 + 0.13, 0.12, "square", 0.06); } break;
    case "printer": tone(70, 0, dur, "square", 0.05); for (let i = 0; i < dur * 4; i++) noiseBurst(i * 0.25, 0.12, "bandpass", 3000, 0.15, 3); break;
    case "laugh": for (let i = 0; i < dur * 5; i++) { tone(rnd(180, 260), i * 0.2, 0.1, "sawtooth", 0.05); noiseBurst(i * 0.2, 0.12, "bandpass", 1100, 0.15, 2); } break;
    case "crowd": noiseBurst(0, dur, "bandpass", 900, 0.5, 0.6); for (let i = 0; i < 6; i++) tone(rnd(200, 400), i * 0.3, 0.3, "sawtooth", 0.03); break;
    case "cry": for (let i = 0; i < dur / 0.8; i++) { const t = AC.currentTime + i * 0.8, o = AC.createOscillator(); o.type = "triangle"; o.frequency.setValueAtTime(620, t); o.frequency.linearRampToValueAtTime(380, t + 0.7); const g = envGain(t, 0.05, 0.08, 0.7, 0.2); o.connect(g).connect(master); o.start(t); o.stop(t + 0.75); } break;
    case "announce": tone(NOTE(76), 0, 0.35, "sine", 0.15); tone(NOTE(72), 0.35, 0.5, "sine", 0.15); for (let i = 0; i < 8; i++) tone(rnd(130, 180), 0.9 + i * 0.22, 0.18, "sawtooth", 0.04); break;
    case "brakes": { const t = AC.currentTime, o = AC.createOscillator(); o.type = "sawtooth"; o.frequency.setValueAtTime(1800, t); o.frequency.linearRampToValueAtTime(1200, t + 1.2); const bp = AC.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 2000; bp.Q.value = 8; const g = envGain(t, 0.05, 0.08, 1.3, 0.3); o.connect(bp).connect(g).connect(master); o.start(t); o.stop(t + 1.4); break; }
    case "screech": noiseBurst(0, dur, "bandpass", 2600, 0.35, 6); break;
    case "pages": noiseBurst(0, 0.25, "highpass", 3000, 0.12); break;
    case "clock": for (let i = 0; i < 3; i++) tone(NOTE(60 - i * 5), i * 1, 0.9, "sine", 0.15); break;
    case "drill": noiseBurst(0, dur, "bandpass", 200, 0.4, 3); break;
    case "ding": tone(NOTE(84), 0, 0.5, "sine", 0.15); break;
    default: {
      const seqs = { ads: [72, 74, 76, 79, 76, 79, 84], violin: [76, 79, 81, 79, 76, 74, 72, 74], march: [57, 57, 57, 57, 60, 59, 59, 57, 57, 56, 57], chase: [62, 62, 65, 62, 67, 62, 65, 64] };
      const seq = seqs[kind]; if (!seq) return;
      const step = kind === "march" ? 0.55 : kind === "chase" ? 0.16 : 0.3, type = kind === "violin" ? "sawtooth" : kind === "march" ? "square" : "triangle", vol = kind === "violin" ? 0.06 : kind === "march" ? 0.07 : 0.12;
      for (let i = 0; i * step < dur; i++) tone(NOTE(seq[i % seq.length]), i * step, step * 0.9, type, vol);
      if (kind === "march") for (let i = 0; i * 1.1 < dur; i++) noiseBurst(i * 1.1, 0.4, "lowpass", 120, 0.6);
    }
  }
}
function updateBed(amb, tint) {
  if (!AC) return;
  bedGain.gain.setTargetAtTime(muted ? 0 : Math.pow(clamp(amb, 0, 100) / 100, 1.4) * 0.22, AC.currentTime, 0.25);
  bedFilter.frequency.setTargetAtTime(tint || 700, AC.currentTime, 0.3);
}
function jingle(win) {
  if (!canPlay()) return;
  if (win) [72, 76, 79, 84].forEach((n, i) => tone(NOTE(n), i * 0.13, 0.3, "square", 0.08));
  else [67, 66, 65, 64].forEach((n, i) => tone(NOTE(n), i * 0.45, i === 3 ? 1.2 : 0.42, "sawtooth", 0.09));
}
function blip(f = 880) { if (canPlay()) tone(f, 0, 0.08, "square", 0.05); }
function heartbeat() { if (canPlay()) { noiseBurst(0, 0.12, "lowpass", 90, 0.9); noiseBurst(0.18, 0.12, "lowpass", 80, 0.7); } }

