"use client";

import { useState } from "react";
import { STATION_PRESETS, formatTime, todayISO, totals, type SegmentKind } from "./hyrox";
import {
  KIND_NAME,
  PRESETS,
  SOUNDS,
  buildQueue,
  clonePreset,
  loadPrograms,
  loadSoundSettings,
  playSound,
  queueToSegments,
  speak,
  step,
  storePrograms,
  storeSoundSettings,
  unlockAudio,
  uid,
  type Program,
  type QueueItem,
  type SoundSettings,
  type Step,
  type Target,
} from "./interval";
import { saveSession } from "./store";
import { RunnerHost } from "./RunScreen";
import { KIND_STYLE, TimeInput, Totals, inputCls } from "./ui";
import { DurationWheel, RepsWheel } from "./Wheel";

const TARGETS: { id: Target; label: string; hint: string }[] = [
  { id: "distance", label: "ระยะทาง", hint: "กดเองเมื่อถึง" },
  { id: "reps", label: "จำนวนครั้ง", hint: "กดเองเมื่อครบ" },
  { id: "time", label: "เวลา", hint: "นับถอยหลัง ไปต่อเอง" },
];

const KINDS: SegmentKind[] = ["run", "station", "roxzone", "rest"];

const defaultName = (k: SegmentKind) => (k === "station" ? "SkiErg" : k === "run" ? "วิ่ง" : k === "rest" ? "พัก" : "ROX ZONE");

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active ? "border-brand bg-brand font-semibold text-brand-ink" : "border-line text-muted hover:border-foreground/40"
      }`}
    >
      {children}
    </button>
  );
}

/* ---------- การ์ดแก้ไขแต่ละท่า ---------- */

function StepCard({
  s,
  index,
  onChange,
  onMove,
  onCopy,
  onRemove,
}: {
  s: Step;
  index: number;
  onChange: (patch: Partial<Step>) => void;
  onMove: (dir: -1 | 1) => void;
  onCopy: () => void;
  onRemove: () => void;
}) {
  const isPreset = STATION_PRESETS.includes(s.name);
  return (
    <div className="rounded-2xl border border-line bg-surface-2 p-3">
      <div className="flex items-center gap-1.5">
        <span className={`h-2.5 w-2.5 rounded-full ${KIND_STYLE[s.kind].dot}`} />
        <span className="text-sm font-semibold">ท่าที่ {index + 1}</span>
        <span className="flex-1" />
        <button type="button" aria-label="เลื่อนขึ้น" onClick={() => onMove(-1)} className="h-8 w-8 rounded-full border border-line text-sm">↑</button>
        <button type="button" aria-label="เลื่อนลง" onClick={() => onMove(1)} className="h-8 w-8 rounded-full border border-line text-sm">↓</button>
        <button type="button" aria-label="ทำซ้ำ" onClick={onCopy} className="h-8 w-8 rounded-full border border-line text-sm">⧉</button>
        <button type="button" aria-label="ลบ" onClick={onRemove} className="h-8 w-8 rounded-full border border-line text-sm text-red-400">✕</button>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {KINDS.map((k) => (
          <button
            key={k}
            type="button"
            aria-pressed={s.kind === k}
            onClick={() =>
              onChange({
                kind: k,
                name: defaultName(k),
                ...(k === "rest" ? { target: "time" as Target, value: s.target === "time" ? s.value : 30 } : {}),
              })
            }
            className={`rounded-full border px-3 py-1.5 text-sm ${
              s.kind === k ? `${KIND_STYLE[k].dot} border-transparent font-semibold text-brand-ink` : "border-line text-muted"
            }`}
          >
            {KIND_NAME[k]}
          </button>
        ))}
      </div>

      {s.kind === "station" && (
        <div className="mt-3 flex flex-wrap gap-2">
          <select
            aria-label="เลือกท่า"
            value={isPreset ? s.name : "อื่น ๆ"}
            onChange={(e) => onChange({ name: e.target.value === "อื่น ๆ" ? "" : e.target.value })}
            className={`${inputCls} min-w-0 flex-1 basis-40`}
          >
            {STATION_PRESETS.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
          {!isPreset && (
            <input
              aria-label="ชื่อท่า"
              placeholder="พิมพ์ชื่อท่า"
              value={s.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className={`${inputCls} min-w-0 flex-1 basis-32`}
            />
          )}
        </div>
      )}

      {s.kind !== "rest" && (
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {TARGETS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={s.target === t.id}
              onClick={() =>
                onChange({ target: t.id, value: t.id === "time" ? 30 : t.id === "reps" ? 10 : s.kind === "run" ? 500 : 50 })
              }
              className={`rounded-xl border px-2 py-2 text-left ${s.target === t.id ? "border-brand bg-brand/10" : "border-line"}`}
            >
              <span className={`block text-sm font-semibold ${s.target === t.id ? "text-brand" : ""}`}>{t.label}</span>
              <span className="block text-[11px] leading-tight text-muted">{t.hint}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        {s.target === "time" ? (
          <>
            <DurationWheel key={`t-${s.value}`} seconds={s.value} onChange={(v) => onChange({ value: v })} label={`เวลา ${s.name}`} />
            <span className="text-xs text-muted">เลื่อนขึ้นลงเพื่อเลือกเวลา</span>
          </>
        ) : s.target === "reps" ? (
          <>
            <RepsWheel key={`r-${s.value}`} value={s.value} onChange={(v) => onChange({ value: v })} label={`จำนวนครั้ง ${s.name}`} />
            <span className="text-xs text-muted">เลื่อนขึ้นลงเพื่อเลือกจำนวนครั้ง</span>
          </>
        ) : (
          <>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              aria-label="ระยะทาง (เมตร)"
              value={s.value || ""}
              onChange={(e) => onChange({ value: Math.max(0, Math.round(Number(e.target.value))) })}
              className={`${inputCls} w-28 text-center font-mono`}
            />
            <span className="text-sm text-muted">เมตร</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- ตั้งค่าเสียง ---------- */

function SoundPanel({ value, onChange }: { value: SoundSettings; onChange: (s: SoundSettings) => void }) {
  const toggle = (k: "voice" | "countdown" | "vibrate", label: string) => (
    <label className="flex items-center justify-between gap-3 py-1.5 text-sm">
      {label}
      <input type="checkbox" checked={value[k]} onChange={(e) => onChange({ ...value, [k]: e.target.checked })} className="h-5 w-5 accent-[var(--brand)]" />
    </label>
  );
  return (
    <div className="rounded-3xl border border-line bg-surface p-4">
      <p className="font-display font-bold">🔔 เสียงตอนเปลี่ยนท่า</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {SOUNDS.map((s) => (
          <Chip
            key={s.id}
            active={value.sound === s.id}
            onClick={() => {
              unlockAudio();
              playSound(s.id);
              onChange({ ...value, sound: s.id });
            }}
          >
            {s.label}
          </Chip>
        ))}
      </div>
      <p className="mt-1 text-xs text-muted">แตะเพื่อฟังตัวอย่าง</p>
      <div className="mt-3 divide-y divide-line">
        {toggle("voice", "เสียงพูดบอกท่าต่อไป")}
        {toggle("countdown", "ติ๊ก 3-2-1 ก่อนหมดเวลา")}
        {toggle("vibrate", "สั่นเตือน (มือถือ Android)")}
      </div>
      {value.voice && (
        <button type="button" onClick={() => speak("ต่อไป วิ่ง 500 เมตร")} className="mt-2 text-xs text-brand underline">
          ลองฟังเสียงพูด
        </button>
      )}
    </div>
  );
}

/* ---------- หน้าสร้างโปรแกรม ---------- */

function Builder({
  program,
  setProgram,
  sound,
  setSound,
  onStart,
  onManual,
}: {
  program: Program;
  setProgram: (p: Program) => void;
  sound: SoundSettings;
  setSound: (s: SoundSettings) => void;
  onStart: () => void;
  onManual: () => void;
}) {
  const [saved, setSaved] = useState<Program[]>(loadPrograms);
  const [flash, setFlash] = useState("");

  const steps = program.steps;
  const setSteps = (s: Step[]) => setProgram({ ...program, steps: s });
  const update = (i: number, patch: Partial<Step>) => setSteps(steps.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const move = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= steps.length) return;
    const n = [...steps];
    [n[i], n[j]] = [n[j], n[i]];
    setSteps(n);
  };

  const queue = buildQueue(program);
  const timedSec = queue.filter((q) => q.step.target === "time").reduce((a, q) => a + q.step.value, 0);
  const manual = queue.filter((q) => q.step.target !== "time").length;
  const invalid = steps.some((s) => !s.name.trim() || !(s.value > 0));

  const saveProgram = () => {
    const name = program.name.trim() || "โปรแกรมของฉัน";
    const list = [{ ...program, name }, ...saved.filter((p) => p.name !== name)].slice(0, 20);
    storePrograms(list);
    setSaved(list);
    setFlash(`บันทึก “${name}” แล้ว`);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm text-muted">เริ่มจากโปรแกรมสำเร็จรูป หรือโปรแกรมที่เคยบันทึกไว้</p>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {[...saved.map((p) => ({ p, mine: true })), ...PRESETS.map((p) => ({ p, mine: false }))].map(({ p, mine }) => (
            <span key={(mine ? "m-" : "p-") + p.name} className="flex shrink-0 items-center overflow-hidden rounded-full border border-line">
              <button
                type="button"
                onClick={() => setProgram(clonePreset(p))}
                className="px-4 py-2 text-sm hover:bg-surface-2"
              >
                {mine ? "⭐ " : ""}
                {p.name}
              </button>
              {mine && (
                <button
                  type="button"
                  aria-label={`ลบ ${p.name}`}
                  onClick={() => {
                    const list = saved.filter((x) => x.name !== p.name);
                    storePrograms(list);
                    setSaved(list);
                  }}
                  className="border-l border-line px-3 py-2 text-sm text-muted hover:text-red-400"
                >
                  ✕
                </button>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">ชื่อโปรแกรม</span>
          <input value={program.name} onChange={(e) => setProgram({ ...program, name: e.target.value })} placeholder="เช่น ซ้อมขา + วิ่ง" className={inputCls} />
        </label>
        <div className="text-sm">
          <span className="mb-1 block text-muted">จำนวนรอบ</span>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="ลดรอบ" onClick={() => setProgram({ ...program, rounds: Math.max(1, program.rounds - 1) })} className="h-11 w-11 rounded-full border border-line text-xl">−</button>
            <span className="w-10 text-center font-mono text-2xl font-bold">{program.rounds}</span>
            <button type="button" aria-label="เพิ่มรอบ" onClick={() => setProgram({ ...program, rounds: Math.min(30, program.rounds + 1) })} className="h-11 w-11 rounded-full border border-line text-xl">+</button>
          </div>
        </div>
      </div>

      {program.rounds > 1 && (
        <div className="rounded-3xl border border-line bg-surface p-4">
          <p className="font-display font-bold">⏸ พักระหว่างรอบ</p>
          <p className="text-xs text-muted">เลื่อนเลือกเวลาเองได้ · 00:00 = ไม่พัก</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <DurationWheel key={`rr-${program.roundRest}`} seconds={program.roundRest} onChange={(v) => setProgram({ ...program, roundRest: v })} label="พักระหว่างรอบ" />
            <div className="flex flex-wrap gap-2">
              {[0, 30, 60, 90, 120].map((v) => (
                <Chip key={v} active={program.roundRest === v} onClick={() => setProgram({ ...program, roundRest: v })}>
                  {v === 0 ? "ไม่พัก" : v < 60 ? `${v} วิ` : `${v / 60} นาที`}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {steps.map((s, i) => (
          <StepCard
            key={s.id}
            s={s}
            index={i}
            onChange={(p) => update(i, p)}
            onMove={(d) => move(i, d)}
            onCopy={() => setSteps([...steps.slice(0, i + 1), { ...s, id: uid() }, ...steps.slice(i + 1)])}
            onRemove={() => setSteps(steps.filter((_, j) => j !== i))}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          { l: "+ วิ่ง 500 m", s: () => step("run", "วิ่ง", "distance", 500), c: "border-brand/60 text-brand" },
          { l: "+ วิ่ง 30 วิ", s: () => step("run", "วิ่ง", "time", 30), c: "border-brand/60 text-brand" },
          { l: "+ สถานี", s: () => step("station", "SkiErg", "distance", 250), c: "border-warm/60 text-warm" },
          { l: "+ ROX ZONE", s: () => step("roxzone", "ROX ZONE", "time", 20), c: "border-rox/60 text-rox" },
          { l: "+ พัก 30 วิ", s: () => step("rest", "พัก", "time", 30), c: "border-line text-muted" },
        ].map((b) => (
          <button key={b.l} type="button" onClick={() => setSteps([...steps, b.s()])} className={`rounded-full border py-2.5 text-sm font-semibold ${b.c}`}>
            {b.l}
          </button>
        ))}
      </div>

      <SoundPanel value={sound} onChange={setSound} />

      <div className="rounded-3xl border border-brand/40 bg-brand/5 p-4 text-sm">
        <p>
          <span className="font-display font-bold">{steps.length} ท่า × {program.rounds} รอบ</span> = {queue.length} ช่วง
        </p>
        <p className="mt-1 text-muted">
          นับถอยหลังอัตโนมัติรวม {formatTime(timedSec * 1000)} · ต้องกด “เสร็จ” เอง {manual} ช่วง
        </p>
      </div>

      {invalid && <p className="rounded-xl bg-red-500/15 p-3 text-sm text-red-300">ใส่ชื่อท่าและระยะ/จำนวน/เวลาให้ครบทุกท่าก่อนนะ</p>}
      {flash && <p className="rounded-xl bg-brand/15 p-3 text-sm text-brand">{flash}</p>}

      <button
        type="button"
        disabled={invalid || steps.length === 0}
        onClick={onStart}
        className="w-full rounded-full bg-brand py-4 font-display text-xl font-bold text-brand-ink disabled:opacity-40"
      >
        ▶ เริ่มเลย
      </button>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={saveProgram} disabled={invalid} className="rounded-full border border-line py-3 text-sm font-semibold hover:border-brand disabled:opacity-40">
          ⭐ บันทึกโปรแกรมนี้
        </button>
        <button type="button" onClick={onManual} disabled={invalid} className="rounded-full border border-line py-3 text-sm font-semibold hover:border-brand disabled:opacity-40">
          ✍️ กรอกเวลาเอง
        </button>
      </div>
    </div>
  );
}


/* ---------- สรุปผล + บันทึก ---------- */

function Result({
  program,
  queue,
  initial,
  onBack,
  onSaved,
}: {
  program: Program;
  queue: QueueItem[];
  initial: (number | null)[];
  onBack: () => void;
  onSaved: () => void;
}) {
  const [results, setResults] = useState(initial);
  const [date, setDate] = useState(todayISO);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const segments = queueToSegments(program, queue, results);
  const finished = initial.some((r) => r != null);

  const save = async () => {
    if (!segments.some((s) => s.ms != null)) return setError("กรอกเวลาอย่างน้อย 1 ช่วงก่อนบันทึกนะ");
    setBusy(true);
    setError("");
    try {
      await saveSession({
        date,
        mode: "custom",
        title: program.name.trim() || "โปรแกรมของฉัน",
        division: program.rounds > 1 ? `${program.rounds} รอบ` : "",
        segments,
        total_ms: totals(segments).total,
        note: note.trim(),
      });
      onSaved();
    } catch {
      setError("บันทึกไม่สำเร็จ ลองใหม่อีกครั้งนะ");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {finished && (
        <div className="rounded-3xl border border-brand bg-brand/10 p-5 text-center">
          <p className="text-4xl">🎉</p>
          <p className="font-display text-2xl font-bold">จบโปรแกรมแล้ว เก่งมาก!</p>
          <p className="font-mono text-4xl font-bold text-brand">{formatTime(totals(segments).total)}</p>
        </div>
      )}
      <label className="block text-sm">
        <span className="mb-1 block text-muted">วันที่ซ้อม</span>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
      </label>

      <div>
        <p className="mb-2 font-display font-bold">เวลาแต่ละช่วง {finished ? "(แก้ไขได้)" : ""}</p>
        <ol className="space-y-1.5">
          {segments.map((s, i) => (
            <li key={i} className="flex items-center gap-3 rounded-2xl bg-surface-2 px-3 py-2">
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${KIND_STYLE[s.kind].dot}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-semibold">{s.name}</span>
                <span className="block text-xs text-muted">{s.amount}</span>
              </span>
              <TimeInput key={`${i}-${s.ms}`} ms={s.ms} label={s.name} onChange={(v) => setResults(results.map((r, j) => (j === i ? v : r)))} />
            </li>
          ))}
        </ol>
      </div>

      <Totals segments={segments} />

      <label className="block text-sm">
        <span className="mb-1 block text-muted">โน้ต (ไม่บังคับ)</span>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="รู้สึกยังไงวันนี้ ท่าไหนหนัก" className={inputCls} />
      </label>
      {error && <p className="rounded-xl bg-red-500/15 p-3 text-sm text-red-300">{error}</p>}
      <button type="button" onClick={save} disabled={busy} className="w-full rounded-full bg-brand py-4 font-display text-lg font-bold text-brand-ink disabled:opacity-50">
        {busy ? "กำลังบันทึก..." : "บันทึกผลวันนี้"}
      </button>
      <button type="button" onClick={onBack} className="w-full text-sm text-muted hover:text-foreground">
        ← กลับไปแก้โปรแกรม
      </button>
    </div>
  );
}

/* ---------- รวมทุกขั้น ---------- */

export default function CustomProgram({ onSaved }: { onSaved: () => void }) {
  const [program, setProgram] = useState<Program>(() => clonePreset(PRESETS[1]));
  const [sound, setSoundState] = useState<SoundSettings>(loadSoundSettings);
  const [stage, setStage] = useState<"build" | "run" | "result">("build");
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [results, setResults] = useState<(number | null)[]>([]);

  const setSound = (s: SoundSettings) => {
    setSoundState(s);
    storeSoundSettings(s);
  };

  if (stage === "run") {
    return (
      <RunnerHost
        queue={queue}
        rounds={program.rounds}
        sound={sound}
        onDone={(r) => {
          setResults(r);
          setStage("result");
        }}
      />
    );
  }

  if (stage === "result") {
    return <Result program={program} queue={queue} initial={results} onBack={() => setStage("build")} onSaved={onSaved} />;
  }

  return (
    <Builder
      program={program}
      setProgram={setProgram}
      sound={sound}
      setSound={setSound}
      onStart={() => {
        unlockAudio();
        const q = buildQueue(program);
        setQueue(q);
        setResults(q.map(() => null));
        setStage("run");
      }}
      onManual={() => {
        const q = buildQueue(program);
        setQueue(q);
        setResults(q.map(() => null));
        setStage("result");
      }}
    />
  );
}
