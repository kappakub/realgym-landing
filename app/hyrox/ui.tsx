"use client";

import { useState } from "react";
import { formatTime, parseTime, totals, type Segment, type SegmentKind } from "./hyrox";

export const KIND_STYLE: Record<SegmentKind, { label: string; dot: string; text: string }> = {
  run: { label: "วิ่ง", dot: "bg-brand", text: "text-brand" },
  station: { label: "สถานี", dot: "bg-warm", text: "text-warm" },
  roxzone: { label: "ROX ZONE", dot: "bg-rox", text: "text-rox" },
  rest: { label: "พัก", dot: "bg-muted", text: "text-muted" },
};

export const inputCls =
  "w-full rounded-xl border border-line bg-background px-3 py-2.5 text-foreground placeholder:text-muted/60 focus:border-brand focus:outline-none";

/* ---------- ช่องกรอกเวลา ---------- */

export function TimeInput({ ms, onChange, label }: { ms: number | null; onChange: (ms: number | null) => void; label: string }) {
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

export function Totals({ segments }: { segments: Segment[] }) {
  const t = totals(segments);
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {[
        { l: "วิ่งรวม", v: t.run, c: "text-brand" },
        { l: "สถานีรวม", v: t.station, c: "text-warm" },
        ...(segments.some((s) => s.kind === "roxzone") ? [{ l: "ROX ZONE รวม", v: t.roxzone, c: "text-rox" }] : []),
        ...(t.rest > 0 ? [{ l: "พักรวม", v: t.rest, c: "text-muted" }] : []),
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

