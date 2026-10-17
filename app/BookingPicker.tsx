"use client";

import { useState } from "react";
import { branches, classes, lineMessageUrl } from "./data";

const days = ["วันนี้", "พรุ่งนี้", "จันทร์", "อังคาร", "พุธ", "พฤหัสฯ", "ศุกร์", "เสาร์", "อาทิตย์"];
const times = ["เช้า (7:00-12:00)", "บ่าย (12:00-17:00)", "เย็น (17:00-21:00)"];

function Chips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          aria-pressed={value === o}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            value === o
              ? "border-brand bg-brand font-semibold text-brand-ink"
              : "border-line bg-surface-2 text-foreground hover:border-brand"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default function BookingPicker() {
  const [cls, setCls] = useState(classes[0].name);
  const [branch, setBranch] = useState(branches[0].name);
  const [day, setDay] = useState(days[0]);
  const [time, setTime] = useState(times[2]);

  const message = `สวัสดีครับ/ค่ะ อยากจองคลาส ${cls}\nสาขา: ${branch}\nวัน: ${day}\nช่วงเวลา: ${time}\nรบกวนเช็คที่ว่างและแจ้งวิธีชำระเงินด้วยครับ/ค่ะ`;

  return (
    <div className="rounded-3xl border border-line bg-surface p-5 sm:p-8">
      <div className="space-y-6">
        <div>
          <p className="mb-3 font-display font-medium">1. เลือกคลาส</p>
          <Chips options={classes.map((c) => c.name)} value={cls} onChange={setCls} />
        </div>
        <div>
          <p className="mb-3 font-display font-medium">2. เลือกสาขา</p>
          <Chips options={branches.map((b) => b.name)} value={branch} onChange={setBranch} />
        </div>
        <div>
          <p className="mb-3 font-display font-medium">3. เลือกวัน</p>
          <Chips options={days} value={day} onChange={setDay} />
        </div>
        <div>
          <p className="mb-3 font-display font-medium">4. ช่วงเวลา</p>
          <Chips options={times} value={time} onChange={setTime} />
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-surface-2 p-4 text-sm text-muted">
        <p className="mb-1 font-semibold text-foreground">สรุปการจอง</p>
        <p>
          {cls} · {branch} · {day} · {time}
        </p>
      </div>

      <a
        href={lineMessageUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-4 font-display text-lg font-bold text-brand-ink transition hover:brightness-95"
      >
        ส่งคำขอจองทาง LINE
      </a>
      <p className="mt-3 text-center text-xs text-muted">
        กดแล้วจะเปิด LINE พร้อมข้อความจองให้อัตโนมัติ แอดมินจะยืนยันที่ว่างและส่งช่องทางชำระเงินให้
      </p>
    </div>
  );
}
