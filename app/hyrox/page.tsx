import type { Metadata } from "next";
import Link from "next/link";
import Guide from "./Guide";
import HyroxLoader from "./HyroxLoader";

export const metadata: Metadata = {
  title: "บันทึกผล HYROX Simulation | REAL GYM",
  description:
    "บันทึกเวลาซ้อม HYROX Simulation ของคุณกับ REAL GYM ครบ 8 สถานี + ROX ZONE จับเวลาแบบแข่งจริง ดูประวัติและ PB ของตัวเอง",
  openGraph: {
    title: "บันทึกผล HYROX Simulation | REAL GYM",
    description: "จับเวลาแบบแข่งจริง ครบ 8 สถานี + ROX ZONE เก็บประวัติและ PB ของคุณ",
  },
};

export default function HyroxPage() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="font-display text-xl font-extrabold tracking-tight">
            REAL<span className="text-brand"> GYM</span>
          </Link>
          <Link href="/" className="rounded-full border border-line px-4 py-1.5 text-sm hover:border-brand">
            ← หน้าหลัก
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl overflow-x-clip px-4 pb-20 pt-10 sm:px-6">
        <p className="font-display text-sm font-medium tracking-widest text-brand">HYROX SIMULATION LOG</p>
        <h1 className="mt-2 font-display text-title font-bold">บันทึกผลซ้อม HYROX ของฉัน</h1>
        <p className="mt-3 max-w-2xl text-lead text-muted">
          ซ้อม Sim ที่ REAL GYM แล้วจดเวลาไว้ที่นี่ ดูว่าวิ่ง สถานี หรือ ROX ZONE ตรงไหนที่ยังเร็วขึ้นได้อีก
        </p>

        <section className="mt-10" aria-labelledby="guide">
          <h2 id="guide" className="mb-4 font-display text-2xl font-bold">
            ใช้งานง่าย ๆ 4 สเต็ป
          </h2>
          <Guide />
        </section>

        <section className="mt-14" aria-label="บันทึกผล">
          <HyroxLoader />
        </section>
      </main>
    </>
  );
}
