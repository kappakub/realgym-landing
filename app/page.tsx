import BookingSection from "./BookingSection";
import Journey from "./Journey";
import {
  FACEBOOK_URL,
  LINE_URL,
  MESSENGER_URL,
  PHONE,
  PHONE_URL,
  YOUTUBE_URL,
  CLASS_PRICE,
  branches,
  lineMessageUrl,
} from "./data";

const CTA = "ทักไลน์เลย";

function LineIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 3C6.48 3 2 6.64 2 11.13c0 4.02 3.56 7.39 8.37 8.03.33.07.77.22.88.5.1.25.07.65.03.9l-.14.86c-.04.25-.2.99.87.54 1.07-.45 5.77-3.4 7.87-5.82C21.33 14.55 22 12.92 22 11.13 22 6.64 17.52 3 12 3Z" />
    </svg>
  );
}

function LineButton({ big = false, label = CTA }: { big?: boolean; label?: string }) {
  return (
    <a
      href={LINE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-brand font-display font-bold text-brand-ink shadow-[0_8px_30px_-8px_var(--brand)] transition hover:brightness-95 ${
        big ? "px-8 py-4 text-lg" : "px-5 py-2.5 text-sm"
      }`}
    >
      <LineIcon />
      {label}
    </a>
  );
}

function SectionTitle({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="mb-2 font-display text-sm font-medium tracking-widest text-brand">{kicker}</p>
      <h2 className="font-display text-title font-bold">{title}</h2>
      {sub && <p className="mt-3 text-lead text-muted">{sub}</p>}
    </div>
  );
}

const stats = [
  { n: "100+", l: "เครื่องออกกำลังกาย" },
  { n: "200+", l: "คลาสต่อเดือน" },
  { n: "1,300", l: "ตร.ม. ต่อสาขา" },
  { n: "7", l: "สาขาในกรุงเทพฯ" },
];

const highlights = [
  {
    icon: "📅",
    title: "จองคลาสง่าย จ่ายสะดวก",
    desc: "ดูตารางคลาสแบบปฏิทิน เลือกวันและเวลาที่สะดวก กดจองแล้วสแกน QR พร้อมเพย์จ่ายได้ทันที ไม่ต้องโทร ไม่ต้องรอ",
  },
  {
    icon: "🌤️",
    title: "ฟิตเนส Open Air ที่ใหญ่ที่สุด",
    desc: "พื้นที่โล่ง อากาศถ่ายเท ไม่อึดอัด กว่า 1,300 ตร.ม. ต่อสาขา มีให้เลือก 7 สาขาทั่วกรุงเทพฯ พร้อมที่จอดรถ",
  },
  {
    icon: "🏋️",
    title: "เครื่องเยอะ ลองเล่นฟรี",
    desc: "เครื่องออกกำลังกายกว่า 100 เครื่อง เล่นครบไม่ต้องรอคิว ทดลองเล่นฟรี 3 วัน หรือทดลองเทรนกับโค้ชฟรี 1 ครั้ง",
  },
];

const plans = [
  {
    name: "ทดลองเล่นฟรี",
    price: "ฟรี",
    unit: "3 วัน",
    points: ["ใช้เครื่องออกกำลังกายได้ทุกเครื่อง", "เข้าร่วมคลาสตามเงื่อนไขสาขา", "ไม่มีค่าใช้จ่าย"],
    msg: "สวัสดีครับ/ค่ะ อยากลงทะเบียนทดลองเล่นฟรี 3 วัน",
  },
  {
    name: "สมาชิกรายเดือน",
    price: "1,000",
    unit: "บาท / เดือน",
    points: ["เล่นได้ไม่จำกัดครั้ง", "เข้าคลาสกลุ่มกว่า 200 คลาส/เดือน", "จองคลาสล่วงหน้าผ่าน LINE"],
    msg: "สวัสดีครับ/ค่ะ อยากสมัครสมาชิกรายเดือน 1,000 บาท",
    featured: true,
  },
  {
    name: "ทดลองเทรนกับโค้ช",
    price: "ฟรี",
    unit: "1 ครั้ง",
    points: ["โค้ชมีใบรับรอง ดูแลใกล้ชิด", "วางโปรแกรมตามเป้าหมาย", "เหมาะมากสำหรับมือใหม่"],
    msg: "สวัสดีครับ/ค่ะ อยากจองทดลองเทรนกับโค้ชฟรี 1 ครั้ง",
  },
];

const payment = [
  { step: "1", title: "เลือกวันในปฏิทิน", desc: "เลือกสาขาและวันที่อยากมาเล่น" },
  { step: "2", title: "กดจองคลาส", desc: "เลือกคลาสและเวลาที่ชอบ" },
  { step: "3", title: "สแกน QR จ่าย", desc: `สแกนพร้อมเพย์ ${CLASS_PRICE} บาท ด้วยแอปธนาคารใดก็ได้` },
  { step: "4", title: "ส่งสลิปทาง LINE", desc: "แอดมินยืนยันที่นั่ง แล้วมาเล่นได้เลย" },
];

const faqs = [
  {
    q: "ทดลองเล่นฟรี 3 วัน ต้องลงทะเบียนก่อนไหม?",
    a: "แนะนำให้ทัก LINE ลงทะเบียนล่วงหน้า ทีมงานจะยืนยันสาขาและแนะนำช่วงเวลาที่สะดวกให้",
  },
  {
    q: "จองคลาสแล้วจ่ายเงินยังไง?",
    a: `เลือกวันในปฏิทินหัวข้อ “จองคลาส” กดจองคลาสที่ต้องการ แล้วสแกน QR พร้อมเพย์จ่าย ${CLASS_PRICE} บาท จากนั้นกดส่งสลิปทาง LINE แอดมินจะยืนยันที่นั่งให้`,
  },
  {
    q: "มือใหม่ไม่เคยเล่นฟิตเนส มาได้ไหม?",
    a: "ได้แน่นอน มีเทรนเนอร์มืออาชีพคอยแนะนำ และทดลองเทรนกับโค้ชได้ฟรี 1 ครั้ง เพื่อวางโปรแกรมให้เหมาะกับเป้าหมายของคุณ",
  },
  {
    q: "เปิดกี่โมง มีที่จอดรถไหม?",
    a: "จันทร์-ศุกร์ 7:00-23:00 น. เสาร์-อาทิตย์ 8:00-22:00 น. ทุกสาขามีที่จอดรถรองรับ",
  },
];

export default function Home() {
  return (
    <>
      {/* แถบบน */}
      <header className="sticky top-0 z-30 border-b border-line/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <a href="#top" className="font-display text-xl font-extrabold tracking-tight">
            REAL<span className="text-brand"> GYM</span>
          </a>
          <nav className="hidden gap-6 text-sm text-muted md:flex">
            <a href="#highlights" className="hover:text-foreground">จุดเด่น</a>
            <a href="#booking" className="hover:text-foreground">จองคลาส</a>
            <a href="#journey" className="hover:text-foreground">เปลี่ยนร่าง 3 เดือน</a>
            <a href="#pricing" className="hover:text-foreground">ราคา</a>
            <a href="#faq" className="hover:text-foreground">คำถาม</a>
            <a href="#contact" className="hover:text-foreground">สาขา</a>
          </nav>
          <LineButton />
        </div>
      </header>

      <main id="top" className="overflow-x-clip">
        {/* ส่วนหัว */}
        <section className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-[-30%] h-[520px] w-[520px] rounded-full bg-brand/15 blur-3xl sm:right-[-10%]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-[-20%] h-[360px] w-[360px] rounded-full bg-warm/10 blur-3xl"
          />
          <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-24">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-muted">
              <span className="h-2 w-2 rounded-full bg-brand" />
              ฟิตเนส Open Air · 7 สาขาในกรุงเทพฯ
            </p>
            <h1 className="font-display text-hero font-extrabold">
              ออกกำลังกาย
              <br />
              <span className="text-brand">ให้สนุก</span> แบบมีเพื่อน
            </h1>
            <p className="mt-6 max-w-xl text-lead text-muted">
              ฟิตเนส Open Air ที่ใหญ่ที่สุด เครื่องเยอะ ไม่ต้องรอคิว คลาสสนุกทุกวัน
              จองคลาสและจ่ายเงินง่าย ๆ ผ่าน LINE — มาลองเล่นฟรีก่อนได้เลย
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LineButton big />
              <a
                href="#booking"
                className="inline-flex items-center justify-center rounded-full border border-line px-8 py-4 font-display text-lg font-medium transition hover:border-brand"
              >
                จองคลาส / สแกนจ่าย
              </a>
            </div>

            <dl className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.l} className="rounded-2xl border border-line bg-surface p-4">
                  <dt className="text-sm text-muted">{s.l}</dt>
                  <dd className="font-display text-3xl font-bold text-brand">{s.n}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* จุดเด่น */}
        <section id="highlights" className="scroll-mt-20 border-t border-line/60 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionTitle kicker="WHY REAL GYM" title="ทำไมใคร ๆ ก็มาเล่นที่ REAL GYM" />
            <div className="grid gap-4 md:grid-cols-3">
              {highlights.map((h) => (
                <div key={h.title} className="rounded-3xl border border-line bg-surface p-6 sm:p-8">
                  <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-brand/15 text-3xl">
                    <span aria-hidden>{h.icon}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold">{h.title}</h3>
                  <p className="mt-3 text-muted">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* จองคลาส */}
        <section id="booking" className="scroll-mt-20 bg-surface/50 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionTitle
              kicker="BOOK A CLASS"
              title="จองคลาสจากปฏิทิน สแกนจ่ายได้ทันที"
              sub={`เลือกวัน เลือกคลาส แล้วสแกน QR พร้อมเพย์ คลาสละ ${CLASS_PRICE} บาท`}
            />
            <BookingSection />

            <h3 className="mb-5 mt-16 font-display text-2xl font-bold">จอง → สแกนจ่าย → มาเล่น</h3>
            <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {payment.map((p) => (
                <li key={p.step} className="rounded-2xl border border-line bg-background p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand font-display font-bold text-brand-ink">
                    {p.step}
                  </span>
                  <p className="mt-3 font-display font-bold">{p.title}</p>
                  <p className="text-sm text-muted">{p.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* เปลี่ยนร่างใน 3 เดือน */}
        <section id="journey" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionTitle
              kicker="3-MONTH JOURNEY"
              title="เปลี่ยนร่างใน 3 เดือน กับ REAL GYM"
              sub="ไม่ต้องเริ่มคนเดียว เรามีเทรนเนอร์พาไปทีละสเต็ป ตั้งแต่วันแรกจนถึงวันถ่ายรูปร่างทอง"
            />
            <Journey />
          </div>
        </section>

        {/* ราคา */}
        <section id="pricing" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionTitle kicker="PRICING" title="เริ่มต้นแบบไม่ต้องคิดเยอะ" sub="ลองฟรีก่อน ชอบแล้วค่อยสมัคร" />
            <div className="grid gap-4 md:grid-cols-3">
              {plans.map((p) => (
                <div
                  key={p.name}
                  className={`flex flex-col rounded-3xl border p-6 sm:p-8 ${
                    p.featured ? "border-brand bg-surface-2" : "border-line bg-surface"
                  }`}
                >
                  {p.featured && (
                    <span className="mb-3 self-start rounded-full bg-brand px-3 py-1 text-xs font-semibold text-brand-ink">
                      ยอดนิยม
                    </span>
                  )}
                  <h3 className="font-display text-xl font-bold">{p.name}</h3>
                  <p className="mt-4">
                    <span className="font-display text-5xl font-extrabold text-brand">{p.price}</span>
                    <span className="ml-2 text-muted">{p.unit}</span>
                  </p>
                  <ul className="mt-6 flex-1 space-y-2 text-muted">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex gap-2">
                        <span className="text-brand">✓</span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={lineMessageUrl(p.msg)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-8 rounded-full px-6 py-3 text-center font-display font-bold transition ${
                      p.featured
                        ? "bg-brand text-brand-ink hover:brightness-95"
                        : "border border-line hover:border-brand"
                    }`}
                  >
                    {CTA}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* คำถามที่พบบ่อย */}
        <section id="faq" className="scroll-mt-20 bg-surface/50 py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionTitle kicker="FAQ" title="คำถามที่พบบ่อย" />
            <div className="space-y-3">
              {faqs.map((f) => (
                <details key={f.q} className="group rounded-2xl border border-line bg-background p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display font-medium">
                    {f.q}
                    <span className="text-2xl text-brand transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ติดต่อเรา */}
        <section id="contact" className="scroll-mt-20 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionTitle
              kicker="CONTACT"
              title="ติดต่อเรา & สาขาใกล้คุณ"
              sub="เปิดทุกวัน · จันทร์-ศุกร์ 7:00-23:00 น. · เสาร์-อาทิตย์ 8:00-22:00 น."
            />
            <div className="mb-10 grid gap-3 sm:grid-cols-3">
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-brand p-5 text-brand-ink"
              >
                <LineIcon className="h-8 w-8" />
                <span>
                  <span className="block font-display font-bold">LINE</span>
                  <span className="text-sm">@RealGymSF</span>
                </span>
              </a>
              <a href={PHONE_URL} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-5 hover:border-brand">
                <span className="text-2xl" aria-hidden>📞</span>
                <span>
                  <span className="block font-display font-bold">โทร</span>
                  <span className="text-sm text-muted">{PHONE}</span>
                </span>
              </a>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-5 hover:border-brand"
              >
                <span className="text-2xl" aria-hidden>💬</span>
                <span>
                  <span className="block font-display font-bold">Facebook</span>
                  <span className="text-sm text-muted">Real Gym</span>
                </span>
              </a>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {branches.map((b) => (
                <li key={b.name} className="rounded-2xl border border-line bg-surface p-5">
                  <p className="font-display text-lg font-bold">สาขา{b.name}</p>
                  <div className="mt-4 flex gap-2 text-sm">
                    <a href={`tel:${b.phone}`} className="flex-1 rounded-full border border-line py-2 text-center hover:border-brand">
                      โทร
                    </a>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-full border border-line py-2 text-center hover:border-brand"
                    >
                      นำทาง
                    </a>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-16 rounded-3xl border border-brand/40 bg-gradient-to-br from-brand/15 to-transparent p-8 text-center sm:p-12">
              <h2 className="font-display text-title font-bold">พร้อมเริ่มแล้วใช่ไหม?</h2>
              <p className="mx-auto mt-3 max-w-md text-muted">ทักมาคุยกับทีมงานได้เลย เราช่วยแนะนำสาขาและคลาสที่เหมาะกับคุณ</p>
              <div className="mt-6">
                <LineButton big />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ส่วนท้าย */}
      <footer className="border-t border-line/60 pb-28 pt-10 md:pb-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            <span className="font-display font-bold text-foreground">REAL GYM</span> · ฟิตเนส Open Air ·
            433 แขวงบางชัน เขตคลองสามวา กรุงเทพฯ 10510
          </p>
          <div className="flex gap-4">
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Facebook</a>
            <a href={MESSENGER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Messenger</a>
            <a href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">YouTube</a>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted">© 2026 REAL GYM</p>
      </footer>

      {/* ปุ่ม LINE ลอยบนมือถือ */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-background/95 p-3 backdrop-blur md:hidden">
        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-full bg-brand py-3.5 font-display text-lg font-bold text-brand-ink"
        >
          <LineIcon />
          {CTA}
        </a>
      </div>
    </>
  );
}
