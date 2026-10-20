import { formatTime, type Segment, type SegmentKind } from "./hyrox";

/* ---------- โปรแกรมที่ลูกค้าสร้างเอง ---------- */

/** distance = ระยะ (เมตร) / reps = จำนวนครั้ง (กดเองเมื่อเสร็จ) / time = เวลา (วินาที) นับถอยหลังแล้วไปต่อเอง */
export type Target = "distance" | "reps" | "time";

export type Step = {
  id: string;
  kind: SegmentKind;
  name: string;
  target: Target;
  value: number;
  /** ข้อความแทนระยะ/จำนวน (เช่น ROX ZONE "เข้าสถานี") */
  label?: string;
};

export type Program = {
  name: string;
  rounds: number;
  /** พักระหว่างรอบ (วินาที) 0 = ไม่พัก */
  roundRest: number;
  steps: Step[];
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export const step = (kind: SegmentKind, name: string, target: Target, value: number): Step => ({
  id: uid(),
  kind,
  name,
  target,
  value,
});

export const KIND_NAME: Record<SegmentKind, string> = {
  run: "วิ่ง",
  station: "สถานี",
  roxzone: "ROX ZONE",
  rest: "พัก",
};

export function describeTarget(s: Pick<Step, "target" | "value" | "label">) {
  if (s.label) return s.label;
  if (s.target === "distance") return s.value >= 1000 && s.value % 100 === 0 ? `${s.value / 1000} km` : `${s.value} m`;
  if (s.target === "reps") return `${s.value} ครั้ง`;
  return s.value < 60 ? `${s.value} วิ` : formatTime(s.value * 1000);
}

/** คำอ่านสำหรับเสียงพูด */
export function speakTarget(s: Pick<Step, "target" | "value" | "label">) {
  if (s.label) return "";
  if (s.target === "distance") return s.value >= 1000 && s.value % 100 === 0 ? `${s.value / 1000} กิโลเมตร` : `${s.value} เมตร`;
  if (s.target === "reps") return `${s.value} ครั้ง`;
  const m = Math.floor(s.value / 60);
  const sec = s.value % 60;
  return `${m ? `${m} นาที ` : ""}${sec ? `${sec} วินาที` : ""}`.trim();
}

export const PRESETS: Program[] = [
  {
    name: "วิ่งสลับพัก 30/30 × 8",
    rounds: 8,
    roundRest: 0,
    steps: [step("run", "วิ่งเร็ว", "time", 30), step("rest", "พัก", "time", 30)],
  },
  {
    name: "Run + Wall Balls × 4",
    rounds: 4,
    roundRest: 60,
    steps: [step("run", "วิ่ง", "distance", 400), step("station", "Wall Balls", "reps", 20)],
  },
  {
    name: "HYROX Half Sim",
    rounds: 1,
    roundRest: 0,
    steps: [
      step("run", "วิ่ง", "distance", 500),
      step("station", "SkiErg", "distance", 500),
      step("run", "วิ่ง", "distance", 500),
      step("station", "Sled Push", "distance", 25),
      step("run", "วิ่ง", "distance", 500),
      step("station", "Burpee Broad Jumps", "distance", 40),
      step("run", "วิ่ง", "distance", 500),
      step("station", "Wall Balls", "reps", 50),
    ],
  },
  {
    name: "EMOM สถานี 10 นาที",
    rounds: 5,
    roundRest: 0,
    steps: [step("station", "Kettlebell Swing", "time", 60), step("station", "Burpee Broad Jumps", "time", 60)],
  },
];

export const clonePreset = (p: Program): Program => ({
  ...p,
  steps: p.steps.map((s) => ({ ...s, id: uid() })),
});

/** ลำดับช่วงที่จะเล่นจริง (คลี่ตามจำนวนรอบ + พักระหว่างรอบ) */
export type QueueItem = { step: Step; round: number };

export function buildQueue(p: Program): QueueItem[] {
  const out: QueueItem[] = [];
  for (let r = 1; r <= p.rounds; r++) {
    p.steps.forEach((s) => out.push({ step: s, round: r }));
    if (p.roundRest > 0 && r < p.rounds) {
      out.push({ step: { id: `rr${r}`, kind: "rest", name: "พักระหว่างรอบ", target: "time", value: p.roundRest }, round: r });
    }
  }
  return out;
}

export function queueToSegments(p: Program, queue: QueueItem[], results: (number | null)[]): Segment[] {
  return queue.map((q, i) => ({
    kind: q.step.kind,
    name: p.rounds > 1 ? `R${q.round} · ${q.step.name}` : q.step.name,
    amount: describeTarget(q.step),
    ms: results[i] ?? null,
  }));
}

/* ---------- บันทึกโปรแกรมไว้ใช้ซ้ำ (เก็บในเครื่อง) ---------- */

const PROGRAMS_KEY = "realgym-hyrox-programs";

export function loadPrograms(): Program[] {
  try {
    return JSON.parse(localStorage.getItem(PROGRAMS_KEY) || "[]") as Program[];
  } catch {
    return [];
  }
}

export function storePrograms(list: Program[]) {
  try {
    localStorage.setItem(PROGRAMS_KEY, JSON.stringify(list));
  } catch {
    // เก็บไม่ได้ก็ข้ามไป
  }
}

/* ---------- เสียงแจ้งเตือน (สร้างเสียงเองด้วย Web Audio ไม่ต้องโหลดไฟล์) ---------- */

export type SoundId = "beep" | "whistle" | "bell" | "boxing" | "chime" | "none";

export const SOUNDS: { id: SoundId; label: string }[] = [
  { id: "beep", label: "บี๊บ" },
  { id: "whistle", label: "นกหวีด" },
  { id: "bell", label: "ระฆัง" },
  { id: "boxing", label: "ระฆังมวย" },
  { id: "chime", label: "กริ๊งใส" },
  { id: "none", label: "ไม่มีเสียง" },
];

export type SoundSettings = {
  sound: SoundId;
  voice: boolean;
  countdown: boolean;
  vibrate: boolean;
};

export const DEFAULT_SOUND: SoundSettings = { sound: "beep", voice: true, countdown: true, vibrate: true };

const SOUND_KEY = "realgym-hyrox-sound";

export function loadSoundSettings(): SoundSettings {
  try {
    return { ...DEFAULT_SOUND, ...(JSON.parse(localStorage.getItem(SOUND_KEY) || "{}") as Partial<SoundSettings>) };
  } catch {
    return DEFAULT_SOUND;
  }
}

export function storeSoundSettings(s: SoundSettings) {
  try {
    localStorage.setItem(SOUND_KEY, JSON.stringify(s));
  } catch {
    // ข้าม
  }
}

type Tone = { freq: number; type?: OscillatorType; at?: number; dur: number; gain?: number; vibrato?: number; decay?: boolean };

let ctx: AudioContext | null = null;

/** ต้องเรียกตอนลูกค้ากดปุ่ม (มือถือจะยอมให้เล่นเสียงหลังจากมีการแตะเท่านั้น) */
export function unlockAudio() {
  if (typeof window === "undefined") return;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
}

function tones(list: Tone[]) {
  if (!ctx) return;
  const t0 = ctx.currentTime + 0.02;
  for (const t of list) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = t.type ?? "sine";
    osc.frequency.value = t.freq;
    const start = t0 + (t.at ?? 0);
    const peak = t.gain ?? 0.3;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(peak, start + 0.01);
    if (t.decay) g.gain.exponentialRampToValueAtTime(0.0001, start + t.dur);
    else {
      g.gain.setValueAtTime(peak, start + t.dur - 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, start + t.dur);
    }
    if (t.vibrato) {
      const lfo = ctx.createOscillator();
      const lg = ctx.createGain();
      lfo.frequency.value = t.vibrato;
      lg.gain.value = t.freq * 0.04;
      lfo.connect(lg).connect(osc.frequency);
      lfo.start(start);
      lfo.stop(start + t.dur);
    }
    osc.connect(g).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + t.dur + 0.05);
  }
}

const bellAt = (at: number, base: number): Tone[] => [
  { freq: base, at, dur: 1.4, gain: 0.35, decay: true },
  { freq: base * 2.76, at, dur: 0.9, gain: 0.12, decay: true },
  { freq: base * 5.4, at, dur: 0.5, gain: 0.06, decay: true },
];

/** เสียงตอนเปลี่ยนช่วง */
export function playSound(id: SoundId) {
  switch (id) {
    case "beep":
      return tones([
        { freq: 880, dur: 0.18, type: "square", gain: 0.18 },
        { freq: 1320, at: 0.22, dur: 0.3, type: "square", gain: 0.18 },
      ]);
    case "whistle":
      return tones([
        { freq: 2300, dur: 0.25, type: "triangle", gain: 0.3, vibrato: 28 },
        { freq: 2300, at: 0.32, dur: 0.55, type: "triangle", gain: 0.3, vibrato: 28 },
      ]);
    case "bell":
      return tones(bellAt(0, 660));
    case "boxing":
      return tones([...bellAt(0, 820), ...bellAt(0.28, 820), ...bellAt(0.56, 820)]);
    case "chime":
      return tones([
        { freq: 1046, dur: 0.6, gain: 0.25, decay: true },
        { freq: 1318, at: 0.12, dur: 0.6, gain: 0.25, decay: true },
        { freq: 1568, at: 0.24, dur: 0.9, gain: 0.25, decay: true },
      ]);
  }
}

/** เสียงติ๊กนับถอยหลัง 3-2-1 */
export function playTick(final = false) {
  tones([{ freq: final ? 1400 : 1000, dur: final ? 0.35 : 0.09, type: "sine", gain: 0.3 }]);
}

export function playFinish() {
  tones([
    { freq: 784, dur: 0.18, type: "triangle", gain: 0.3 },
    { freq: 988, at: 0.18, dur: 0.18, type: "triangle", gain: 0.3 },
    { freq: 1175, at: 0.36, dur: 0.18, type: "triangle", gain: 0.3 },
    { freq: 1568, at: 0.54, dur: 0.6, type: "triangle", gain: 0.3 },
  ]);
}

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "th-TH";
  u.rate = 1.05;
  window.speechSynthesis.speak(u);
}

export function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(pattern);
}

/* ---------- ตัวจับเวลาแบบ HIIT ---------- */

export type RunnerPhase = "lead" | "run" | "paused" | "done";

export type RunnerSnapshot = {
  phase: RunnerPhase;
  index: number;
  /** เวลาที่ใช้ไปในช่วงปัจจุบัน (ms) */
  elapsed: number;
  /** นับถอยหลังก่อนเริ่ม (วินาที) */
  lead: number;
  results: (number | null)[];
};

const LEAD_MS = 3000;

export function createRunner(queue: QueueItem[], settings: SoundSettings) {
  let snap: RunnerSnapshot = { phase: "lead", index: 0, elapsed: 0, lead: 3, results: queue.map(() => null) };
  const listeners = new Set<() => void>();
  let timer: number | null = null;
  let leadStart = 0;
  let elapsedBefore = 0;
  let resumeAt: number | null = null;
  let lastBeep = -1;
  let wakeLock: { release: () => Promise<void> } | null = null;

  const emit = (patch: Partial<RunnerSnapshot>) => {
    snap = { ...snap, ...patch };
    listeners.forEach((l) => l());
  };

  const announce = (i: number, prefix: string) => {
    const s = queue[i].step;
    if (settings.voice) speak(`${prefix} ${s.name} ${speakTarget(s)}`);
  };

  const beginStep = (i: number, now: number) => {
    elapsedBefore = 0;
    resumeAt = now;
    lastBeep = -1;
    emit({ phase: "run", index: i, elapsed: 0 });
  };

  const finish = (results: (number | null)[]) => {
    stopTimer();
    playFinish();
    if (settings.vibrate) vibrate([200, 100, 200, 100, 400]);
    if (settings.voice) speak("เสร็จแล้ว เก่งมาก");
    void wakeLock?.release().catch(() => undefined);
    wakeLock = null;
    emit({ phase: "done", results, elapsed: 0 });
  };

  const complete = (ms: number, now: number) => {
    const results = [...snap.results];
    results[snap.index] = Math.round(ms);
    const next = snap.index + 1;
    if (next >= queue.length) return finish(results);
    snap = { ...snap, results };
    playSound(settings.sound);
    if (settings.vibrate) vibrate([250, 80, 250]);
    announce(next, "ต่อไป");
    beginStep(next, now);
  };

  const elapsedAt = (now: number) => elapsedBefore + (resumeAt != null ? now - resumeAt : 0);

  const tick = () => {
    const now = Date.now();
    if (snap.phase === "lead") {
      const left = Math.ceil((LEAD_MS - (now - leadStart)) / 1000);
      if (left <= 0) {
        playSound(settings.sound);
        if (settings.vibrate) vibrate(300);
        announce(0, "เริ่ม");
        return beginStep(0, now);
      }
      if (left !== snap.lead) {
        playTick();
        emit({ lead: left });
      }
      return;
    }
    if (snap.phase !== "run") return;
    const elapsed = elapsedAt(now);
    const s = queue[snap.index].step;
    if (s.target === "time") {
      const remainMs = s.value * 1000 - elapsed;
      if (remainMs <= 0) return complete(s.value * 1000, now);
      const remainSec = Math.ceil(remainMs / 1000);
      if (settings.countdown && remainSec <= 3 && remainSec !== lastBeep) {
        lastBeep = remainSec;
        playTick(false);
      }
    }
    emit({ elapsed });
  };

  const startTimer = () => {
    if (timer == null) timer = window.setInterval(tick, 100);
  };
  const stopTimer = () => {
    if (timer != null) window.clearInterval(timer);
    timer = null;
  };

  return {
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getSnapshot: () => snap,
    start() {
      unlockAudio();
      leadStart = Date.now();
      playTick();
      const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } };
      nav.wakeLock
        ?.request("screen")
        .then((w) => (wakeLock = w))
        .catch(() => undefined);
      startTimer();
    },
    /** ลูกค้ากด "เสร็จ" (ใช้กับช่วงที่เป็นระยะทาง/จำนวนครั้ง หรือกดข้ามช่วงที่นับเวลา) */
    next() {
      if (snap.phase !== "run") return;
      const now = Date.now();
      complete(elapsedAt(now), now);
    },
    pause() {
      if (snap.phase !== "run") return;
      const now = Date.now();
      elapsedBefore = elapsedAt(now);
      resumeAt = null;
      emit({ phase: "paused", elapsed: elapsedBefore });
    },
    resume() {
      if (snap.phase !== "paused") return;
      unlockAudio();
      resumeAt = Date.now();
      emit({ phase: "run" });
    },
    /** ย้อนกลับไปช่วงก่อนหน้า (กดเสร็จพลาด) เวลาช่วงก่อนหน้านับต่อจากเดิม ไม่เสียเวลาที่ผ่านไป */
    back() {
      if ((snap.phase !== "run" && snap.phase !== "paused") || snap.index === 0) return;
      const now = Date.now();
      const prev = snap.index - 1;
      const results = [...snap.results];
      const carried = (results[prev] ?? 0) + elapsedAt(now);
      results[prev] = null;
      elapsedBefore = carried;
      resumeAt = snap.phase === "run" ? now : null;
      lastBeep = -1;
      if (settings.vibrate) vibrate(80);
      emit({ index: prev, results, elapsed: carried });
    },
    /** จบก่อนกำหนด เก็บเวลาช่วงปัจจุบันไว้ด้วย */
    stop() {
      if (snap.phase === "done") return;
      const results = [...snap.results];
      if (snap.phase === "run" || snap.phase === "paused") results[snap.index] = Math.round(elapsedAt(Date.now()));
      finish(results);
    },
    dispose() {
      stopTimer();
      void wakeLock?.release().catch(() => undefined);
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    },
  };
}

export type Runner = ReturnType<typeof createRunner>;
