"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { formatTime, type SegmentKind } from "./hyrox";
import { KIND_NAME, createRunner, describeTarget, type QueueItem, type Runner, type SoundSettings } from "./interval";
import { KIND_STYLE } from "./ui";

/* ---------- จอเล่นเต็มจอ (ใช้ทั้งโปรแกรมของฉัน และ HYROX SIM) ---------- */

const KIND_BG: Record<SegmentKind, string> = {
  run: "from-brand/30",
  station: "from-warm/30",
  roxzone: "from-rox/30",
  rest: "from-surface-2",
};

function RunScreen({ runner, queue, rounds, race }: { runner: Runner; queue: QueueItem[]; rounds: number; race: boolean }) {
  const snap = useSyncExternalStore(runner.subscribe, runner.getSnapshot, runner.getSnapshot);
  const cur = queue[snap.index];
  const nxt = queue[snap.index + 1];
  const s = cur.step;
  const timed = s.target === "time";
  const remain = timed ? Math.max(0, s.value * 1000 - snap.elapsed) : 0;
  const pct = timed ? Math.min(100, (snap.elapsed / (s.value * 1000)) * 100) : 0;
  const total = snap.results.reduce<number>((a, r) => a + (r ?? 0), 0) + snap.elapsed;
  const prev = snap.index > 0 ? queue[snap.index - 1] : null;
  const canBack = !!prev && snap.phase !== "lead";

  return (
    <div className={`fixed inset-0 z-50 flex flex-col bg-background bg-gradient-to-b ${snap.phase === "lead" ? "from-brand/20" : KIND_BG[s.kind]} to-background`}>
      <div className="flex items-center justify-between px-5 pt-5 text-sm">
        <span className="text-muted">
          {rounds > 1 && `รอบ ${cur.round}/${rounds} · `}ช่วง {snap.index + 1}/{queue.length}
        </span>
        {!race && <span className="font-mono text-muted">รวม {formatTime(total)}</span>}
      </div>
      <div className="mx-5 mt-3 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-brand transition-all" style={{ width: `${(snap.index / queue.length) * 100}%` }} />
      </div>

      {race && snap.phase !== "lead" && (
        <div className="mt-4 text-center">
          <p className="text-xs tracking-widest text-muted">เวลารวมการแข่ง</p>
          <p className="font-mono text-5xl font-bold text-brand">{formatTime(total, true)}</p>
        </div>
      )}

      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {snap.phase === "lead" ? (
          <>
            <p className="font-display text-xl text-muted">เตรียมตัว…</p>
            <p className="font-display text-[9rem] font-extrabold leading-none text-brand">{snap.lead}</p>
            <p className="mt-4 text-muted">
              เริ่มด้วย {s.name} {describeTarget(s)}
            </p>
          </>
        ) : (
          <>
            <span className={`rounded-full px-4 py-1 text-sm font-bold text-brand-ink ${KIND_STYLE[s.kind].dot}`}>{KIND_NAME[s.kind]}</span>
            <p className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">{s.name}</p>
            <p className={`mt-1 font-display text-2xl font-bold ${KIND_STYLE[s.kind].text}`}>{describeTarget(s)}</p>
            <p className={`mt-5 font-mono font-bold ${race ? "text-5xl sm:text-6xl" : "text-7xl sm:text-8xl"}`}>
              {formatTime(timed ? remain + 999 : snap.elapsed, !timed)}
            </p>
            <p className="mt-1 text-sm text-muted">
              {timed ? "นับถอยหลัง · ไปต่อเองอัตโนมัติ" : race ? "เวลาช่วงนี้ · กดเมื่อจบช่วง" : "จับเวลาอยู่ · กดเสร็จเมื่อทำครบ"}
            </p>
            {timed && (
              <div className="mt-5 h-3 w-full max-w-sm overflow-hidden rounded-full bg-line">
                <div className={`h-full ${KIND_STYLE[s.kind].dot}`} style={{ width: `${pct}%` }} />
              </div>
            )}
            {snap.phase === "paused" && <p className="mt-4 rounded-full bg-warm px-4 py-1 font-bold text-brand-ink">หยุดชั่วคราว</p>}
          </>
        )}
      </div>

      <div className="space-y-3 px-5 pb-8">
        {nxt && snap.phase !== "lead" && (
          <p className="text-center text-sm text-muted">
            ต่อไป: <span className="font-semibold text-foreground">{nxt.step.name}</span> {describeTarget(nxt.step)}
          </p>
        )}
        {snap.phase !== "lead" && !timed && (
          <button
            type="button"
            onClick={() => runner.next()}
            disabled={snap.phase === "paused"}
            className="w-full rounded-full bg-brand py-6 font-display text-2xl font-extrabold text-brand-ink active:scale-[0.98] disabled:opacity-40"
          >
            {race ? (nxt ? "จบช่วงนี้ ▶" : "เข้าเส้นชัย 🏁") : "เสร็จ ✓ ไปต่อ"}
          </button>
        )}
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => runner.back()}
            disabled={!canBack}
            aria-label={prev ? `ย้อนกลับไป ${prev.step.name}` : "ย้อนกลับ"}
            className="rounded-full border border-line py-3 text-sm font-semibold disabled:opacity-30"
          >
            ↩ ย้อน
          </button>
          {snap.phase === "paused" ? (
            <button type="button" onClick={() => runner.resume()} className="rounded-full bg-foreground py-3 text-sm font-bold text-background">
              ▶ ต่อ
            </button>
          ) : (
            <button type="button" onClick={() => runner.pause()} disabled={snap.phase === "lead"} className="rounded-full border border-line py-3 text-sm font-semibold disabled:opacity-40">
              ❚❚ พัก
            </button>
          )}
          <button
            type="button"
            onClick={() => runner.next()}
            disabled={snap.phase !== "run"}
            className="rounded-full border border-line py-3 text-sm font-semibold disabled:opacity-40"
          >
            ข้าม ⏭
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("จบการซ้อมตอนนี้เลยใช่ไหม? เวลาที่จับไว้จะถูกเก็บไว้")) runner.stop();
            }}
            className="rounded-full border border-line py-3 text-sm font-semibold text-red-300"
          >
            จบ
          </button>
        </div>
        {canBack && (
          <p className="text-center text-[11px] text-muted">
            กดพลาด? “↩ ย้อน” จะกลับไป {prev.step.name} และนับเวลาต่อจากเดิม
          </p>
        )}
      </div>
    </div>
  );
}

export function RunnerHost({
  queue,
  rounds,
  sound,
  race = false,
  onDone,
}: {
  queue: QueueItem[];
  rounds: number;
  sound: SoundSettings;
  race?: boolean;
  onDone: (r: (number | null)[]) => void;
}) {
  const [runner] = useState(() => createRunner(queue, sound));
  const snap = useSyncExternalStore(runner.subscribe, runner.getSnapshot, runner.getSnapshot);

  useEffect(() => {
    runner.start();
    document.body.style.overflow = "hidden";
    return () => {
      runner.dispose();
      document.body.style.overflow = "";
    };
  }, [runner]);

  useEffect(() => {
    if (snap.phase === "done") onDone(snap.results);
  }, [snap.phase, snap.results, onDone]);

  return <RunScreen runner={runner} queue={queue} rounds={rounds} race={race} />;
}
