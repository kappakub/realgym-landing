"use client";

import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";

const SEEN_KEY = "realgym-hyrox-guide-seen";
const noop = () => () => {};

function readSeen() {
  try {
    return localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

/** คู่มือแบบพับได้: เปิดให้ดูเต็ม ๆ เฉพาะครั้งแรก ครั้งต่อไปพับไว้ กดเปิดดูได้ */
export default function GuideToggle({ children }: { children: ReactNode }) {
  // ฝั่งเซิร์ฟเวอร์ถือว่า "เคยเห็นแล้ว" (พับไว้) แล้วค่อยเช็คจริงในเบราว์เซอร์
  const seen = useSyncExternalStore(noop, readSeen, () => true);
  const [manual, setManual] = useState<boolean | null>(null);
  const open = manual ?? !seen;

  // จำว่าเคยเห็นแล้ว ตอนออกจากหน้า (ครั้งหน้าจะพับไว้)
  useEffect(() => {
    const markSeen = () => {
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {
        // ข้าม
      }
    };
    window.addEventListener("pagehide", markSeen);
    return () => window.removeEventListener("pagehide", markSeen);
  }, []);

  return (
    <section id="guide" aria-labelledby="guide-title" className="scroll-mt-20 rounded-3xl border border-line bg-surface/50">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          setManual(!open);
          try {
            localStorage.setItem(SEEN_KEY, "1");
          } catch {
            // ข้าม
          }
        }}
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
      >
        <span>
          <span id="guide-title" className="block font-display text-xl font-bold">
            📖 วิธีใช้งาน 4 สเต็ป
          </span>
          <span className="block text-sm text-muted">การ์ตูนสอนใช้งาน ใช้เวลาอ่านไม่ถึง 1 นาที</span>
        </span>
        <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-lg transition ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </section>
  );
}
