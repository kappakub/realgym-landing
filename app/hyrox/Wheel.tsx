"use client";

import { useRef } from "react";

const ITEM = 40; // ความสูงแต่ละแถว (px)
const VISIBLE = 5; // แสดงทีละ 5 แถว ตัวกลางคือค่าที่เลือก

/** ล้อเลื่อนเลือกค่าแบบนาฬิกาปลุกในมือถือ (ปัดขึ้นลง หรือแตะตัวเลข) */
export function Wheel({
  values,
  value,
  onChange,
  format = String,
  label,
  className = "w-16",
}: {
  values: number[];
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  label: string;
  className?: string;
}) {
  const timer = useRef<number | null>(null);
  const ready = useRef(false);
  const index = Math.max(0, values.indexOf(value));

  const settle = (el: HTMLDivElement) => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const i = Math.min(values.length - 1, Math.max(0, Math.round(el.scrollTop / ITEM)));
      if (values[i] !== value) onChange(values[i]);
    }, 90);
  };

  return (
    <div className={`relative ${className}`} style={{ height: ITEM * VISIBLE }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 rounded-xl border border-brand/60 bg-brand/10"
        style={{ top: ITEM * 2, height: ITEM }}
      />
      <div
        role="listbox"
        aria-label={label}
        tabIndex={0}
        ref={(el) => {
          // ตั้งตำแหน่งเริ่มต้นครั้งเดียวตอนแสดงผล
          if (el && !ready.current) {
            el.scrollTop = index * ITEM;
            ready.current = true;
          }
        }}
        onScroll={(e) => settle(e.currentTarget)}
        onKeyDown={(e) => {
          if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
          e.preventDefault();
          const next = Math.min(values.length - 1, Math.max(0, index + (e.key === "ArrowDown" ? 1 : -1)));
          e.currentTarget.scrollTo({ top: next * ITEM, behavior: "smooth" });
        }}
        className="relative h-full snap-y snap-mandatory overflow-y-scroll overscroll-contain rounded-xl [scrollbar-width:none] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand [&::-webkit-scrollbar]:hidden"
        style={{
          paddingBlock: ITEM * 2,
          maskImage: "linear-gradient(transparent, #000 30%, #000 70%, transparent)",
          WebkitMaskImage: "linear-gradient(transparent, #000 30%, #000 70%, transparent)",
        }}
      >
        {values.map((v, i) => (
          <button
            key={v}
            type="button"
            role="option"
            aria-selected={i === index}
            tabIndex={-1}
            onClick={(e) => e.currentTarget.parentElement?.scrollTo({ top: i * ITEM, behavior: "smooth" })}
            className={`block w-full snap-center text-center font-mono transition ${
              i === index ? "text-2xl font-bold text-foreground" : "text-lg text-muted"
            }`}
            style={{ height: ITEM }}
          >
            {format(v)}
          </button>
        ))}
      </div>
    </div>
  );
}

const range = (from: number, to: number, step = 1) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);

const MINUTES = range(0, 59);
const SECONDS = range(0, 59);
const pad = (n: number) => String(n).padStart(2, "0");

/** เลือกเวลา นาที : วินาที (ค่าเป็นวินาที) */
export function DurationWheel({ seconds, onChange, label }: { seconds: number; onChange: (s: number) => void; label: string }) {
  const m = Math.min(59, Math.floor(seconds / 60));
  const s = seconds % 60;
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-background px-2">
      <Wheel values={MINUTES} value={m} onChange={(v) => onChange(v * 60 + s)} format={pad} label={`${label} นาที`} />
      <span className="text-xs text-muted">นาที</span>
      <span className="px-1 font-mono text-2xl font-bold">:</span>
      <Wheel values={SECONDS} value={s} onChange={(v) => onChange(m * 60 + v)} format={pad} label={`${label} วินาที`} />
      <span className="pr-1 text-xs text-muted">วิ</span>
    </div>
  );
}

const REPS = range(1, 300);

export function RepsWheel({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-background px-2">
      <Wheel values={REPS} value={value} onChange={onChange} label={label} className="w-20" />
      <span className="pr-2 text-sm text-muted">ครั้ง</span>
    </div>
  );
}
