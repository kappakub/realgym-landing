"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "#highlights", label: "จุดเด่น" },
  { href: "#booking", label: "จองคลาส / สแกนจ่าย" },
  { href: "#journey", label: "เปลี่ยนร่าง 3 เดือน" },
  { href: "#pricing", label: "ราคา" },
  { href: "#faq", label: "คำถามที่พบบ่อย" },
  { href: "#contact", label: "สาขา & ติดต่อ" },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "ปิดเมนู" : "เปิดเมนู"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="grid h-10 w-10 place-items-center rounded-full border border-line"
      >
        <span className="relative block h-3.5 w-5">
          <span className={`absolute left-0 h-0.5 w-5 rounded bg-foreground transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
          <span className={`absolute left-0 top-1.5 h-0.5 w-5 rounded bg-foreground transition ${open ? "opacity-0" : ""}`} />
          <span className={`absolute left-0 h-0.5 w-5 rounded bg-foreground transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
        </span>
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full border-b border-line bg-background px-4 pb-5 pt-2 shadow-2xl shadow-black/60">
          <Link
            href="/hyrox"
            onClick={close}
            className="mb-2 flex items-center justify-between rounded-2xl border border-rox/50 bg-rox/10 px-4 py-3"
          >
            <span>
              <span className="block font-display font-bold text-rox">บันทึก HYROX SIM</span>
              <span className="block text-xs text-muted">จับเวลาแบบแข่งจริง · สร้างโปรแกรม HIIT เอง</span>
            </span>
            <span className="text-rox">→</span>
          </Link>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={close} className="block border-b border-line/60 px-2 py-3 text-foreground last:border-0">
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
