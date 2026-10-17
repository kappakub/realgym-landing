"use client";

import dynamic from "next/dynamic";

// ปฏิทินใช้วันเวลาจากเครื่องของลูกค้า จึงแสดงผลฝั่งเบราว์เซอร์เท่านั้น
const BookingCalendar = dynamic(() => import("./BookingCalendar"), {
  ssr: false,
  loading: () => <div className="h-[520px] animate-pulse rounded-3xl border border-line bg-surface" />,
});

export default function BookingSection() {
  return <BookingCalendar />;
}
