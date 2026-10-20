"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DIVISIONS,
  STATION_PRESETS,
  formatTime,
  hyroxTemplate,
  parseTime,
  todayISO,
  totals,
  type Segment,
  type SegmentKind,
  type Session,
  type SessionMode,
} from "./hyrox";
import {
  deleteSession,
  isDemo,
  listSessions,
  saveSession,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  signUpWithEmail,
  supabase,
  toUser,
  type User,
} from "./store";

const KIND_STYLE: Record<SegmentKind, { label: string; dot: string; text: string }> = {
  run: { label: "วิ่ง", dot: "bg-brand", text: "text-brand" },
  station: { label: "สถานี", dot: "bg-warm", text: "text-warm" },
  roxzone: { label: "ROX ZONE", dot: "bg-rox", text: "text-rox" },
};

const inputCls =
  "w-full rounded-xl border border-line bg-background px-3 py-2.5 text-foreground placeholder:text-muted/60 focus:border-brand focus:outline-none";

/* ---------- ช่องกรอกเวลา ---------- */

function TimeInput({ ms, onChange, label }: { ms: number | null; onChange: (ms: number | null) => void; label: string }) {
  // remount ทุกครั้งที่ค่าเปลี่ยนจากข้างนอก (เช่นกดจับเวลา) ผ่าน key ด้านล่าง
  const [text, setText] = useState(ms == null ? "" : formatTime(ms));
  const [bad, setBad] = useState(false);
  return (
    <input
      inputMode="numeric"
      aria-label={`เวลา ${label}`}
      placeholder="mm:ss"
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        setBad(false);
      }}
      onBlur={() => {
        if (!text.trim()) return onChange(null);
        const v = parseTime(text);
        if (v == null) setBad(true);
        else onChange(v);
      }}
      className={`w-24 shrink-0 rounded-xl border bg-background px-3 py-2 text-center font-mono text-base focus:outline-none ${
        bad ? "border-red-500" : "border-line focus:border-brand"
      }`}
    />
  );
}

/* ---------- สรุปเวลา ---------- */

function Totals({ segments }: { segments: Segment[] }) {
  const t = totals(segments);
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {[
        { l: "วิ่งรวม", v: t.run, c: "text-brand" },
        { l: "สถานีรวม", v: t.station, c: "text-warm" },
        { l: "ROX ZONE รวม", v: t.roxzone, c: "text-rox" },
        { l: "เวลารวม", v: t.total, c: "text-foreground" },
      ].map((x) => (
        <div key={x.l} className="rounded-2xl bg-surface-2 p-3">
          <p className="text-xs text-muted">{x.l}</p>
          <p className={`font-mono text-xl font-bold ${x.c}`}>{formatTime(x.v)}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- นาฬิกาจับเวลาแบบแข่งจริง ---------- */

function RaceTimer({ segments, onSplit }: { segments: Segment[]; onSplit: (index: number, ms: number) => void }) {
  const [startAt, setStartAt] = useState<number | null>(null);
  const [lastSplit, setLastSplit] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (startAt == null) return;
    const id = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [startAt]);

  const current = segments.findIndex((s) => s.ms == null);
  const done = current === -1;
  const running = startAt != null && !done;

  const start = () => {
    const t = Date.now();
    setStartAt(t);
    setLastSplit(t);
    setNow(t);
  };
  const split = () => {
    if (lastSplit == null || done) return;
    const t = Date.now();
    onSplit(current, t - lastSplit);
    setLastSplit(t);
    setNow(t);
    if (current === segments.length - 1) setStartAt(null);
  };

  return (
    <div className="rounded-3xl border border-brand/40 bg-gradient-to-br from-brand/10 to-transparent p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted">จับเวลาแบบแข่งจริง</p>
          <p className="font-mono text-4xl font-bold">
            {formatTime(running && startAt != null ? now - startAt : null, true)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">ช่วงตอนนี้</p>
          <p className={`font-display font-bold ${done ? "text-brand" : KIND_STYLE[segments[current].kind].text}`}>
            {done ? "จบการแข่งขัน 🎉" : segments[current].name}
          </p>
          <p className="font-mono text-sm text-muted">
            {running && lastSplit != null ? formatTime(now - lastSplit, true) : ""}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {!running ? (
          <button
            type="button"
            onClick={start}
            disabled={done}
            className="col-span-2 rounded-full bg-brand py-3.5 font-display text-lg font-bold text-brand-ink disabled:opacity-40"
          >
            {current > 0 ? "เริ่มจับต่อจากช่วงนี้" : "เริ่มจับเวลา"}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setStartAt(null)}
              className="rounded-full border border-line py-3.5 font-display font-bold"
            >
              หยุด
            </button>
            <button
              type="button"
              onClick={split}
              className="rounded-full bg-brand py-3.5 font-display text-lg font-bold text-brand-ink"
            >
              จบช่วงนี้ ▶
            </button>
          </>
        )}
      </div>
      <p className="mt-2 text-center text-xs text-muted">
        กด “จบช่วงนี้” ทุกครั้งที่เปลี่ยนช่วง ระบบจะกรอกเวลาให้อัตโนมัติ หรือพิมพ์เวลาเองด้านล่างก็ได้
      </p>
    </div>
  );
}

/* ---------- ฟอร์ม HYROX SIM (เทมเพลตแก้ไม่ได้ กรอกแค่เวลา) ---------- */

function HyroxRows({ segments, setMs }: { segments: Segment[]; setMs: (i: number, ms: number | null) => void }) {
  return (
    <ol className="space-y-1.5">
      {segments.map((s, i) => (
        <li
          key={i}
          className={`flex items-center gap-3 rounded-2xl px-3 py-2 ${s.kind === "roxzone" ? "bg-background/60" : "bg-surface-2"}`}
        >
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${KIND_STYLE[s.kind].dot}`} />
          <span className="min-w-0 flex-1">
            <span className={`block truncate font-display ${s.kind === "roxzone" ? "text-sm text-rox" : "font-bold"}`}>
              {s.name}
            </span>
            <span className="block text-xs text-muted">{s.amount}</span>
          </span>
          <TimeInput key={`${i}-${s.ms}`} ms={s.ms} label={s.name} onChange={(v) => setMs(i, v)} />
        </li>
      ))}
    </ol>
  );
}

/* ---------- ฟอร์มโปรแกรมกำหนดเอง ---------- */

function CustomRows({ segments, setSegments }: { segments: Segment[]; setSegments: (s: Segment[]) => void }) {
  const update = (i: number, patch: Partial<Segment>) =>
    setSegments(segments.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= segments.length) return;
    const next = [...segments];
    [next[i], next[j]] = [next[j], next[i]];
    setSegments(next);
  };
  const add = (kind: SegmentKind) =>
    setSegments([
      ...segments,
      kind === "run"
        ? { kind, name: "Run", amount: "1 km", ms: null }
        : kind === "roxzone"
          ? { kind, name: "ROX ZONE", amount: "", ms: null }
          : { kind, name: "SkiErg", amount: "1000 m", ms: null },
    ]);

  return (
    <div className="space-y-2">
      {segments.map((s, i) => (
        <div key={i} className="rounded-2xl bg-surface-2 p-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold ${KIND_STYLE[s.kind].text}`}>
              {i + 1}. {KIND_STYLE[s.kind].label}
            </span>
            <span className="flex-1" />
            <button type="button" aria-label="เลื่อนขึ้น" onClick={() => move(i, -1)} className="h-8 w-8 rounded-full border border-line text-sm">↑</button>
            <button type="button" aria-label="เลื่อนลง" onClick={() => move(i, 1)} className="h-8 w-8 rounded-full border border-line text-sm">↓</button>
            <button
              type="button"
              aria-label="ลบ"
              onClick={() => setSegments(segments.filter((_, j) => j !== i))}
              className="h-8 w-8 rounded-full border border-line text-sm text-red-400"
            >
              ✕
            </button>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {s.kind === "station" ? (
              <>
                <select
                  aria-label="สถานี"
                  value={STATION_PRESETS.includes(s.name) ? s.name : "อื่น ๆ"}
                  onChange={(e) => update(i, { name: e.target.value === "อื่น ๆ" ? "" : e.target.value })}
                  className={`${inputCls} min-w-0 flex-1 basis-40`}
                >
                  {STATION_PRESETS.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
                {!STATION_PRESETS.includes(s.name) && (
                  <input
                    aria-label="ชื่อสถานี"
                    placeholder="ชื่อท่า"
                    value={s.name}
                    onChange={(e) => update(i, { name: e.target.value })}
                    className={`${inputCls} min-w-0 flex-1 basis-32`}
                  />
                )}
              </>
            ) : (
              <span className="flex-1 basis-40 font-display font-bold">{s.name}</span>
            )}
            <input
              aria-label="ระยะหรือจำนวน"
              placeholder={s.kind === "run" ? "เช่น 1 km" : "เช่น 50 m / 20 reps"}
              value={s.amount}
              onChange={(e) => update(i, { amount: e.target.value })}
              className={`${inputCls} w-32 flex-1 basis-28`}
            />
            <TimeInput key={`${i}-${s.ms}`} ms={s.ms} label={s.name} onChange={(v) => update(i, { ms: v })} />
          </div>
        </div>
      ))}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <button type="button" onClick={() => add("run")} className="rounded-full border border-brand/60 py-2.5 text-sm font-semibold text-brand">+ วิ่ง</button>
        <button type="button" onClick={() => add("station")} className="rounded-full border border-warm/60 py-2.5 text-sm font-semibold text-warm">+ สถานี</button>
        <button type="button" onClick={() => add("roxzone")} className="rounded-full border border-rox/60 py-2.5 text-sm font-semibold text-rox">+ ROX ZONE</button>
      </div>
    </div>
  );
}

/* ---------- หน้าบันทึกใหม่ ---------- */

const customStart = (): Segment[] => [
  { kind: "run", name: "Run", amount: "1 km", ms: null },
  { kind: "roxzone", name: "ROX ZONE", amount: "", ms: null },
  { kind: "station", name: "SkiErg", amount: "1000 m", ms: null },
];

function NewSessionForm({ onSaved }: { onSaved: () => void }) {
  const [mode, setMode] = useState<SessionMode | null>(null);
  const [date, setDate] = useState(todayISO);
  const [division, setDivision] = useState(DIVISIONS[0]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [segments, setSegments] = useState<Segment[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const pick = (m: SessionMode) => {
    setMode(m);
    setSegments(m === "hyrox" ? hyroxTemplate() : customStart());
    setError("");
  };
  const setMs = (i: number, ms: number | null) =>
    setSegments((prev) => prev.map((s, j) => (j === i ? { ...s, ms } : s)));

  const filled = segments.filter((s) => s.ms != null).length;

  const save = async () => {
    if (!mode) return;
    if (filled === 0) return setError("กรอกเวลาอย่างน้อย 1 ช่วงก่อนบันทึกนะ");
    if (mode === "custom" && segments.some((s) => !s.name.trim())) return setError("ตั้งชื่อท่าให้ครบทุกสถานีก่อนนะ");
    setSaving(true);
    setError("");
    try {
      await saveSession({
        date,
        mode,
        title: mode === "hyrox" ? "HYROX Simulation" : title.trim() || "โปรแกรมของฉัน",
        division: mode === "hyrox" ? division : "",
        segments,
        total_ms: totals(segments).total,
        note: note.trim(),
      });
      setMode(null);
      setNote("");
      setTitle("");
      onSaved();
    } catch {
      setError("บันทึกไม่สำเร็จ ลองใหม่อีกครั้งนะ");
    } finally {
      setSaving(false);
    }
  };

  if (!mode) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => pick("hyrox")}
          className="rounded-3xl border border-brand bg-surface p-6 text-left transition hover:bg-surface-2"
        >
          <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-brand-ink">เหมือนแข่งจริง</span>
          <p className="mt-4 font-display text-2xl font-bold">HYROX SIM</p>
          <p className="mt-1 text-sm text-muted">
            วิ่ง 8 × 1 km + 8 สถานีตามลำดับแข่ง พร้อม ROX ZONE โปรแกรมล็อกไว้ กรอกแค่เวลา หรือกดจับเวลาสด
          </p>
        </button>
        <button
          type="button"
          onClick={() => pick("custom")}
          className="rounded-3xl border border-line bg-surface p-6 text-left transition hover:border-warm hover:bg-surface-2"
        >
          <span className="rounded-full bg-warm px-3 py-1 text-xs font-bold text-brand-ink">ปรับเองได้</span>
          <p className="mt-4 font-display text-2xl font-bold">โปรแกรมของฉัน</p>
          <p className="mt-1 text-sm text-muted">
            ซ้อมวันนี้วิ่งกี่กิโล ทำสถานีไหนบ้าง เพิ่ม ลบ สลับลำดับ แก้ระยะได้ตามใจ
          </p>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <button type="button" onClick={() => setMode(null)} className="text-sm text-muted hover:text-foreground">
        ← เลือกรูปแบบใหม่
      </button>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1 block text-muted">วันที่ซ้อม</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
        </label>
        {mode === "hyrox" ? (
          <label className="block text-sm">
            <span className="mb-1 block text-muted">รุ่นที่ซ้อม</span>
            <select value={division} onChange={(e) => setDivision(e.target.value)} className={inputCls}>
              {DIVISIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </label>
        ) : (
          <label className="block text-sm">
            <span className="mb-1 block text-muted">ชื่อโปรแกรมวันนี้</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="เช่น Half Sim / ซ้อมขา" className={inputCls} />
          </label>
        )}
      </div>

      {mode === "hyrox" ? (
        <>
          <RaceTimer segments={segments} onSplit={(i, ms) => setMs(i, ms)} />
          <div className="flex items-center justify-between text-sm">
            <p className="font-display font-bold">ผลแยกแต่ละช่วง</p>
            <p className="text-muted">กรอกแล้ว {filled}/{segments.length}</p>
          </div>
          <HyroxRows segments={segments} setMs={setMs} />
        </>
      ) : (
        <CustomRows segments={segments} setSegments={setSegments} />
      )}

      <Totals segments={segments} />

      <label className="block text-sm">
        <span className="mb-1 block text-muted">โน้ต (ไม่บังคับ)</span>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          placeholder="เช่น Wall Balls แบ่งเซ็ต 25×4 / Sled หนักกว่าที่คิด"
          className={inputCls}
        />
      </label>

      {error && <p className="rounded-xl bg-red-500/15 p-3 text-sm text-red-300">{error}</p>}
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="w-full rounded-full bg-brand py-4 font-display text-lg font-bold text-brand-ink disabled:opacity-50"
      >
        {saving ? "กำลังบันทึก..." : "บันทึกผลวันนี้"}
      </button>
    </div>
  );
}

/* ---------- ประวัติ ---------- */

function History({ sessions, onDeleted }: { sessions: Session[]; onDeleted: () => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const pbId = useMemo(() => {
    const full = sessions.filter((s) => s.mode === "hyrox" && s.segments.every((x) => x.ms != null));
    if (!full.length) return null;
    return full.reduce((a, b) => (b.total_ms < a.total_ms ? b : a)).id;
  }, [sessions]);

  if (!sessions.length) {
    return (
      <p className="rounded-3xl border border-dashed border-line p-8 text-center text-muted">
        ยังไม่มีประวัติ ลองบันทึกผลซ้อมครั้งแรกกันเลย 💪
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {sessions.map((s) => {
        const t = totals(s.segments);
        const isOpen = open === s.id;
        return (
          <li key={s.id} className={`rounded-3xl border bg-surface p-4 ${s.id === pbId ? "border-brand" : "border-line"}`}>
            <button type="button" onClick={() => setOpen(isOpen ? null : s.id)} className="flex w-full items-start gap-3 text-left">
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-lg font-bold">{s.title}</span>
                  {s.id === pbId && <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-brand-ink">PB 🏆</span>}
                </span>
                <span className="block text-sm text-muted">
                  {new Date(`${s.date}T00:00:00`).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                  {s.division && ` · ${s.division}`}
                </span>
              </span>
              <span className="font-mono text-2xl font-bold">{formatTime(s.total_ms)}</span>
            </button>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span className="text-brand">วิ่ง {formatTime(t.run)}</span>
              <span className="text-warm">สถานี {formatTime(t.station)}</span>
              <span className="text-rox">ROX ZONE {formatTime(t.roxzone)}</span>
            </div>
            {isOpen && (
              <div className="mt-4 space-y-1 border-t border-line pt-3 text-sm">
                {s.segments.map((x, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${KIND_STYLE[x.kind].dot}`} />
                    <span className="flex-1">
                      {x.name} <span className="text-muted">{x.amount}</span>
                    </span>
                    <span className="font-mono">{formatTime(x.ms)}</span>
                  </div>
                ))}
                {s.note && <p className="mt-2 rounded-xl bg-surface-2 p-3 text-muted">📝 {s.note}</p>}
                <button
                  type="button"
                  onClick={async () => {
                    if (!window.confirm("ลบผลการซ้อมนี้ใช่ไหม?")) return;
                    await deleteSession(s.id);
                    onDeleted();
                  }}
                  className="mt-2 text-sm text-red-400 hover:underline"
                >
                  ลบรายการนี้
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ---------- เข้าสู่ระบบ ---------- */

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function AuthPanel() {
  const [tab, setTab] = useState<"in" | "up">("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<{ kind: "err" | "ok"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (tab === "in") {
      const r = await signInWithEmail(email, password);
      if (r.error) setMsg({ kind: "err", text: r.error });
    } else {
      const r = await signUpWithEmail(email, password, name);
      if (r.error) setMsg({ kind: "err", text: r.error });
      else if (r.needsConfirm) setMsg({ kind: "ok", text: "สมัครสำเร็จ! เช็คอีเมลแล้วกดลิงก์ยืนยัน จากนั้นกลับมาเข้าสู่ระบบได้เลย" });
    }
    setBusy(false);
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-line bg-surface p-6 sm:p-8">
      <h2 className="font-display text-2xl font-bold">เข้าสู่ระบบเพื่อเก็บผลซ้อม</h2>
      <p className="mt-1 text-sm text-muted">ข้อมูลของคุณเห็นได้เฉพาะตัวคุณเอง</p>

      <button
        type="button"
        onClick={() => signInWithGoogle()}
        className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-white py-3.5 font-semibold text-[#1f1f1f] hover:brightness-95"
      >
        <GoogleIcon />
        เข้าสู่ระบบด้วย Google
      </button>

      <div className="my-6 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />
        หรือใช้อีเมล
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="mb-4 grid grid-cols-2 rounded-full bg-surface-2 p-1 text-sm">
        {(["in", "up"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t);
              setMsg(null);
            }}
            className={`rounded-full py-2 font-semibold ${tab === t ? "bg-brand text-brand-ink" : "text-muted"}`}
          >
            {t === "in" ? "เข้าสู่ระบบ" : "สมัครใหม่"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-3">
        {tab === "up" && (
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="ชื่อเล่น" autoComplete="nickname" className={inputCls} />
        )}
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="อีเมล" autoComplete="email" className={inputCls} />
        <input
          required
          type="password"
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="รหัสผ่าน (อย่างน้อย 6 ตัว)"
          autoComplete={tab === "in" ? "current-password" : "new-password"}
          className={inputCls}
        />
        {msg && (
          <p className={`rounded-xl p-3 text-sm ${msg.kind === "err" ? "bg-red-500/15 text-red-300" : "bg-brand/15 text-brand"}`}>{msg.text}</p>
        )}
        <button type="submit" disabled={busy} className="w-full rounded-full bg-brand py-3.5 font-display text-lg font-bold text-brand-ink disabled:opacity-50">
          {busy ? "รอสักครู่..." : tab === "in" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
        </button>
      </form>
    </div>
  );
}

/* ---------- แอปหลัก ---------- */

export default function HyroxApp() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(isDemo);
  const [tab, setTab] = useState<"new" | "history">("new");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setUser(toUser(data.session?.user ?? null));
      setAuthReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setUser(toUser(session?.user ?? null)));
    return () => data.subscription.unsubscribe();
  }, []);

  const canUse = isDemo || !!user;

  useEffect(() => {
    if (!canUse) return;
    listSessions()
      .then((list) => {
        setSessions(list);
        setLoadError(false);
      })
      .catch(() => setLoadError(true));
  }, [canUse, version]);

  const refresh = () => setVersion((v) => v + 1);

  if (!authReady) {
    return <div className="mx-auto h-64 max-w-md animate-pulse rounded-3xl border border-line bg-surface" />;
  }

  return (
    <div>
      {isDemo && (
        <p className="mb-5 rounded-2xl border border-warm/50 bg-warm/10 p-4 text-sm text-warm">
          🧪 โหมดทดลอง: ระบบสมาชิกยังไม่เปิดใช้งาน ข้อมูลที่บันทึกจะเก็บไว้ในเครื่องนี้เท่านั้น
        </p>
      )}

      {!canUse ? (
        <AuthPanel />
      ) : (
        <>
          {user && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-2xl bg-surface p-4">
              <p className="min-w-0 truncate">
                สวัสดี <span className="font-display font-bold text-brand">{user.name}</span> 👋
              </p>
              <button type="button" onClick={() => signOut()} className="shrink-0 rounded-full border border-line px-4 py-1.5 text-sm hover:border-brand">
                ออกจากระบบ
              </button>
            </div>
          )}

          <div className="mb-6 grid grid-cols-2 rounded-full bg-surface p-1">
            {(["new", "history"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full py-2.5 font-display font-bold ${tab === t ? "bg-brand text-brand-ink" : "text-muted"}`}
              >
                {t === "new" ? "บันทึกวันนี้" : `ประวัติของฉัน (${sessions.length})`}
              </button>
            ))}
          </div>

          {loadError && <p className="mb-4 rounded-xl bg-red-500/15 p-3 text-sm text-red-300">โหลดข้อมูลไม่สำเร็จ ลองรีเฟรชหน้าอีกครั้ง</p>}

          {tab === "new" ? (
            <NewSessionForm
              onSaved={() => {
                refresh();
                setTab("history");
              }}
            />
          ) : (
            <History sessions={sessions} onDeleted={refresh} />
          )}
        </>
      )}
    </div>
  );
}
