import { Arm, Body, GOLD, Head, SHIRT, Scene, Sparkle, delay } from "../Chibi";

const ROX = "#5ec8ff";
const WARM = "#ffb347";

/* 1. เข้าสู่ระบบ */
function SceneLogin() {
  return (
    <Scene label="ตัวการ์ตูนถือมือถือเข้าสู่ระบบด้วย Google">
      <g className="anim-bob">
        <Arm d="M58 130 L46 154" />
        <Arm d="M86 130 L104 120" />
        <Body x={72} y={122} />
        <Head x={72} y={98} />
      </g>
      <g transform="translate(104 70)">
        <g className="anim-sway">
          <rect width="56" height="96" rx="10" fill="#222" stroke="#555" strokeWidth="2" />
          <rect x="6" y="10" width="44" height="76" rx="5" fill="#f6f3ec" />
          <circle cx="28" cy="34" r="12" fill="#fff" stroke="#ddd" />
          <text x="28" y="39" textAnchor="middle" fontSize="14" fontWeight="800" fill="#4285F4">G</text>
          <rect className="anim-pop" x="11" y="56" width="34" height="10" rx="5" fill={SHIRT} />
          <rect x="11" y="70" width="34" height="6" rx="3" fill="#ddd" />
        </g>
      </g>
      <g transform="translate(196 70)">
        <g className="anim-pop">
          <rect x="-16" y="-2" width="32" height="26" rx="6" fill={GOLD} />
          <path d="M-9 -2 V-10 A9 9 0 0 1 9 -10 V-6" stroke={GOLD} strokeWidth="5" fill="none" strokeLinecap="round" />
          <circle cy="10" r="4" fill="#7a5a00" />
        </g>
      </g>
      <Sparkle x={186} y={128} d={-0.5} color={SHIRT} />
    </Scene>
  );
}

/* 2. เลือกรูปแบบ */
function SceneChoose() {
  return (
    <Scene label="ตัวการ์ตูนเลือกระหว่าง HYROX SIM กับโปรแกรมของฉัน">
      <g transform="translate(14 46)">
        <g className="anim-pop">
          <rect width="78" height="46" rx="10" fill={SHIRT} />
          <text x="39" y="22" textAnchor="middle" fontSize="12" fontWeight="800" fill="#121110">HYROX</text>
          <text x="39" y="37" textAnchor="middle" fontSize="12" fontWeight="800" fill="#121110">SIM 🔒</text>
        </g>
      </g>
      <g transform="translate(148 46)">
        <g className="anim-pop" style={delay(-1.2)}>
          <rect width="78" height="46" rx="10" fill={WARM} />
          <text x="39" y="22" textAnchor="middle" fontSize="11" fontWeight="800" fill="#121110">โปรแกรม</text>
          <text x="39" y="37" textAnchor="middle" fontSize="11" fontWeight="800" fill="#121110">ของฉัน ✏️</text>
        </g>
      </g>
      <g className="anim-bob">
        <Arm d="M106 132 L84 106" />
        <Arm d="M134 132 L156 106" />
        <Body x={120} y={124} />
        <Head x={120} y={100} />
      </g>
    </Scene>
  );
}

/* 3. จับเวลา */
function SceneTimer() {
  return (
    <Scene label="ตัวการ์ตูนวิ่งพร้อมนาฬิกาจับเวลา">
      {[118, 140, 162].map((y, i) => (
        <rect key={y} className="anim-dash" style={delay(i * -0.3)} x="20" y={y} width="26" height="4" rx="2" fill={ROX} />
      ))}
      <g className="anim-bob" style={{ animationDuration: "0.6s" }}>
        <Arm d="M64 132 L48 118" />
        <Arm d="M92 132 L108 146" />
        <Body x={78} y={124} />
        <Head x={78} y={100} />
      </g>
      <g transform="translate(176 92)">
        <rect x="-6" y="-46" width="12" height="10" rx="3" fill="#888" />
        <circle r="38" fill="#fff" stroke={SHIRT} strokeWidth="6" />
        <circle r="3" fill="#121110" />
        <line className="anim-spin" x1="0" y1="0" x2="0" y2="-28" stroke="#ff4d4d" strokeWidth="3" strokeLinecap="round" />
        <text y="22" textAnchor="middle" fontSize="11" fontWeight="800" fill="#121110">SPLIT</text>
      </g>
    </Scene>
  );
}

/* 4. ดูประวัติ + PB */
function SceneHistory() {
  return (
    <Scene label="ตัวการ์ตูนถือถ้วยรางวัล PB กับกราฟพัฒนาการ">
      <g transform="translate(130 60)">
        <rect width="96" height="110" rx="12" fill="#1a1918" stroke="#444" />
        {[
          { x: 14, h: 70, c: "#555" },
          { x: 38, h: 58, c: "#777" },
          { x: 62, h: 42, c: SHIRT },
        ].map((b, i) => (
          <rect key={b.x} className="anim-grow" style={delay(i * -0.4)} x={b.x} y={98 - b.h} width="18" height={b.h} rx="4" fill={b.c} />
        ))}
        <text x="71" y="48" textAnchor="middle" fontSize="10" fontWeight="800" fill={SHIRT}>PB!</text>
      </g>
      <g className="anim-bob">
        <Arm d="M52 136 L46 74" />
        <Arm d="M76 136 L82 74" />
        <g transform="translate(64 44)">
          <g className="anim-pop">
            <path d="M-20 -14 H20 V0 A20 20 0 0 1 -20 0Z" fill={GOLD} />
            <rect x="-4" y="18" width="8" height="8" fill={GOLD} />
            <rect x="-12" y="25" width="24" height="6" rx="2" fill="#c99a1e" />
          </g>
        </g>
        <Body x={64} y={124} />
        <Head x={64} y={102} />
      </g>
      <Sparkle x={30} y={60} d={-0.3} />
      <Sparkle x={104} y={50} s={1.2} d={-1} />
    </Scene>
  );
}

const steps = [
  { title: "เข้าสู่ระบบ", desc: "ใช้บัญชี Google กดทีเดียวจบ หรือสมัครด้วยอีเมลก็ได้ ข้อมูลเห็นได้เฉพาะคุณ", Art: SceneLogin },
  {
    title: "เลือกรูปแบบการซ้อม",
    desc: "HYROX SIM = โปรแกรมแข่งจริง ล็อกไว้ กรอกแค่เวลา / โปรแกรมของฉัน = สร้างเอง ตั้งระยะ จำนวนครั้ง หรือเวลา และจำนวนรอบได้",
    Art: SceneChoose,
  },
  {
    title: "จับเวลาหรือกรอกเวลา",
    desc: "ท่าที่ตั้งเป็นเวลา จะนับถอยหลังแล้วไปท่าต่อไปเอง มีเสียงเตือน / ท่าที่ตั้งเป็นระยะหรือจำนวนครั้ง กด “เสร็จ” เมื่อทำครบ",
    Art: SceneTimer,
  },
  { title: "ดูพัฒนาการ & PB", desc: "ทุกครั้งที่บันทึกจะเก็บเป็นประวัติ ระบบติดป้าย PB 🏆 ให้รอบที่เร็วที่สุด", Art: SceneHistory },
];

export default function Guide() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {steps.map(({ title, desc, Art }, i) => (
        <li key={title} className="overflow-hidden rounded-3xl border border-line bg-surface">
          <div className="relative bg-gradient-to-b from-surface-2 to-surface px-3 pt-3">
            <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-brand font-display font-bold text-brand-ink">
              {i + 1}
            </span>
            <Art />
          </div>
          <div className="p-5 pt-3">
            <h3 className="font-display text-lg font-bold">{title}</h3>
            <p className="mt-1 text-sm text-muted">{desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
