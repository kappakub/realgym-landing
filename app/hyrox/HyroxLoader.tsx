"use client";

import dynamic from "next/dynamic";

// ใช้ข้อมูลในเบราว์เซอร์ (การล็อกอิน / ที่เก็บข้อมูล) จึงแสดงผลฝั่งเบราว์เซอร์เท่านั้น
const HyroxApp = dynamic(() => import("./HyroxApp"), {
  ssr: false,
  loading: () => <div className="mx-auto h-64 max-w-md animate-pulse rounded-3xl border border-line bg-surface" />,
});

export default function HyroxLoader() {
  return <HyroxApp />;
}
