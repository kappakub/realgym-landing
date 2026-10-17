"use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  CLASS_PRICE,
  PROMPTPAY_ID,
  PROMPTPAY_IS_DEMO,
  branches,
  classes,
  lineMessageUrl,
  weeklySchedule,
} from "./data";
import { promptPayPayload } from "./promptpay";

const WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];
const BOOK_AHEAD_DAYS = 30;

type Session = { date: Date; time: string; cls: string };

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function sameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function thaiDate(d: Date) {
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
}

function bookingRef(s: Session, branchIndex: number) {
  const mm = String(s.date.getMonth() + 1).padStart(2, "0");
  const dd = String(s.date.getDate()).padStart(2, "0");
  return `RG${branchIndex + 1}-${mm}${dd}-${s.time.replace(":", "")}-${s.cls.slice(0, 3).toUpperCase()}`;
}

function sessionsFor(date: Date, now: Date): Session[] {
  return weeklySchedule[date.getDay()]
    .map((s) => {
      const [h, m] = s.time.split(":").map(Number);
      const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m);
      return { ...s, date: start };
    })
    .filter((s) => s.date > now);
}

function PaymentDialog({
  session,
  branchIndex,
  onClose,
}: {
  session: Session;
  branchIndex: number;
  onClose: () => void;
}) {
  const ref = bookingRef(session, branchIndex);
  const branch = branches[branchIndex].name;
  const payload = promptPayPayload(PROMPTPAY_ID, CLASS_PRICE);
  const message = `ส่งสลิปจองคลาสครับ/ค่ะ\nรหัสจอง: ${ref}\nคลาส: ${session.cls}\nสาขา: ${branch}\nวันที่: ${thaiDate(session.date)} เวลา ${session.time} น.\nยอดชำระ: ${CLASS_PRICE} บาท\n(แนบรูปสลิปถัดจากข้อความนี้)`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="ชำระเงินค่าคลาส"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-t-3xl border border-line bg-surface p-6 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-brand">สแกนจ่ายเพื่อยืนยันการจอง</p>
            <h3 className="font-display text-2xl font-bold">{session.cls}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="ปิด"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line text-xl hover:border-brand"
          >
            ×
          </button>
        </div>

        <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-muted">สาขา</dt>
          <dd>{branch}</dd>
          <dt className="text-muted">วันที่</dt>
          <dd>{thaiDate(session.date)}</dd>
          <dt className="text-muted">เวลา</dt>
          <dd>{session.time} น.</dd>
          <dt className="text-muted">รหัสจอง</dt>
          <dd className="font-mono">{ref}</dd>
        </dl>

        <div className="mt-5 rounded-2xl bg-white p-5 text-center text-[#121110]">
          <p className="font-display text-lg font-bold text-[#113566]">PromptPay พร้อมเพย์</p>
          <div className="relative mx-auto mt-3 w-fit">
            <QRCodeSVG value={payload} size={210} level="M" marginSize={0} />
            {PROMPTPAY_IS_DEMO && (
              <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 -rotate-12 bg-red-600/90 py-1 font-display text-sm font-bold text-white">
                ตัวอย่าง ห้ามโอนจริง
              </span>
            )}
          </div>
          <p className="mt-3 font-display text-3xl font-extrabold">{CLASS_PRICE.toLocaleString()} บาท</p>
          <p className="text-xs text-neutral-500">สแกนด้วยแอปธนาคารใดก็ได้ ยอดเงินขึ้นให้อัตโนมัติ</p>
        </div>

        <ol className="mt-5 space-y-1 text-sm text-muted">
          <li>1. เปิดแอปธนาคาร กด “สแกนจ่าย” แล้วสแกน QR ด้านบน</li>
          <li>2. ชำระเงิน แล้วบันทึกสลิปไว้</li>
          <li>3. กดปุ่มด้านล่างเพื่อส่งสลิปทาง LINE แอดมินยืนยันที่นั่งให้</li>
        </ol>

        <a
          href={lineMessageUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center rounded-full bg-brand px-6 py-4 font-display text-lg font-bold text-brand-ink transition hover:brightness-95"
        >
          จ่ายแล้ว ส่งสลิปทาง LINE
        </a>
        <p className="mt-2 text-center text-xs text-muted">ที่นั่งจะยืนยันเมื่อแอดมินได้รับสลิป</p>
      </div>
    </div>
  );
}

export default function BookingCalendar() {
  const [now] = useState(() => new Date());
  const today = startOfDay(now);
  const lastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + BOOK_AHEAD_DAYS);

  const [branchIndex, setBranchIndex] = useState(0);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date>(() =>
    sessionsFor(today, now).length ? today : new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
  );
  const [booking, setBooking] = useState<Session | null>(null);

  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const out: (Date | null)[] = Array(first.getDay()).fill(null);
    for (let d = 1; d <= days; d++) out.push(new Date(month.getFullYear(), month.getMonth(), d));
    return out;
  }, [month]);

  const canPrev = month > new Date(today.getFullYear(), today.getMonth(), 1);
  const canNext = new Date(month.getFullYear(), month.getMonth() + 1, 1) <= lastDay;
  const sessions = sessionsFor(selected, now);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <div className="min-w-0 rounded-3xl border border-line bg-surface p-4 sm:p-6">
        <p className="mb-3 font-display font-medium">เลือกสาขา</p>
        <div className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1">
          {branches.map((b, i) => (
            <button
              key={b.name}
              type="button"
              onClick={() => setBranchIndex(i)}
              aria-pressed={branchIndex === i}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                branchIndex === i
                  ? "border-brand bg-brand font-semibold text-brand-ink"
                  : "border-line bg-surface-2 hover:border-brand"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            disabled={!canPrev}
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
            aria-label="เดือนก่อน"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-lg enabled:hover:border-brand disabled:opacity-30"
          >
            ‹
          </button>
          <p className="font-display text-lg font-bold">
            {MONTHS[month.getMonth()]} {month.getFullYear() + 543}
          </p>
          <button
            type="button"
            disabled={!canNext}
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
            aria-label="เดือนถัดไป"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-lg enabled:hover:border-brand disabled:opacity-30"
          >
            ›
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted">
          {WEEKDAYS.map((w) => (
            <span key={w} className="py-1">{w}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (!d) return <span key={`e${i}`} />;
            const bookable = d >= today && d <= lastDay && sessionsFor(d, now).length > 0;
            const isSelected = sameDay(d, selected);
            return (
              <button
                key={d.toISOString()}
                type="button"
                disabled={!bookable}
                onClick={() => setSelected(d)}
                aria-pressed={isSelected}
                aria-label={thaiDate(d)}
                className={`relative aspect-square rounded-xl text-sm transition sm:text-base ${
                  isSelected
                    ? "bg-brand font-bold text-brand-ink"
                    : bookable
                      ? "bg-surface-2 hover:ring-1 hover:ring-brand"
                      : "text-muted/40"
                }`}
              >
                {d.getDate()}
                {sameDay(d, today) && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="min-w-0 rounded-3xl border border-line bg-surface p-4 sm:p-6">
        <p className="text-sm text-muted">คลาสวันที่</p>
        <p className="font-display text-xl font-bold">{thaiDate(selected)}</p>
        <p className="mb-4 text-sm text-muted">สาขา{branches[branchIndex].name}</p>

        {sessions.length === 0 ? (
          <p className="rounded-2xl bg-surface-2 p-5 text-center text-muted">วันนี้ไม่มีคลาสที่ยังจองได้แล้ว ลองเลือกวันอื่นนะ</p>
        ) : (
          <ul className="space-y-3">
            {sessions.map((s) => {
              const info = classes.find((c) => c.name === s.cls);
              return (
                <li key={s.time} className="flex items-center gap-4 rounded-2xl bg-surface-2 p-4">
                  <span className="w-14 shrink-0 font-display text-lg font-bold text-brand">{s.time}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display font-bold">{s.cls}</span>
                    <span className="block truncate text-sm text-muted">{info?.desc}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setBooking(s)}
                    className="shrink-0 rounded-full bg-brand px-4 py-2 font-display text-sm font-bold text-brand-ink hover:brightness-95"
                  >
                    จอง {CLASS_PRICE}฿
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-4 text-xs text-muted">จองล่วงหน้าได้ {BOOK_AHEAD_DAYS} วัน · คลาสละ {CLASS_PRICE} บาท</p>
      </div>

      {booking && (
        <PaymentDialog session={booking} branchIndex={branchIndex} onClose={() => setBooking(null)} />
      )}
    </div>
  );
}
