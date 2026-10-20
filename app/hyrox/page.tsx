import type { Metadata } from "next";
import Link from "next/link";
import Guide from "./Guide";
import GuideToggle from "./GuideToggle";
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

      <main className="mx-auto max-w-5xl overflow-x-clip px-4 pb-20 pt-6 sm:px-6 sm:pt-10">
        <p className="font-display text-sm font-medium tracking-widest text-brand">HYROX SIMULATION LOG</p>
        <h1 className="mt-1 font-display text-3xl font-bold sm:text-title">บันทึกผลซ้อม HYROX ของฉัน</h1>
        <p className="mt-2 max-w-2xl text-muted">จับเวลา Sim แบบแข่งจริง หรือสร้างโปรแกรม HIIT ของตัวเอง แล้วดูพัฒนาการทุกครั้ง</p>

        <div className="mt-5">
          <GuideToggle>
            <Guide />
          </GuideToggle>
        </div>

        <section className="mt-6" aria-label="บันทึกผล">
          <HyroxLoader />
        </section>
      </main>
    </>
  );
}
