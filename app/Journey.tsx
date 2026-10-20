import { Arm, Body, GOLD, Head, Heart, SHIRT, Scene, Sparkle, delay } from "./Chibi";
import { lineMessageUrl } from "./data";

/* 1. ประเมิน InBody */
function SceneInBody() {
  return (
    <Scene label="ตัวการ์ตูนยืนบนเครื่อง InBody">
      <rect x="150" y="80" width="10" height="105" rx="4" fill="#4a4740" />
      <rect x="132" y="44" width="66" height="48" rx="9" fill="#1a1918" stroke={SHIRT} strokeWidth="2" />
      <text x="165" y="38" textAnchor="middle" fontSize="11" fontWeight="700" fill={SHIRT}>InBody</text>
      <rect className="anim-grow" x="143" y="62" width="9" height="24" rx="2" fill="#ffb347" />
      <rect className="anim-grow" style={delay(-0.6)} x="160" y="62" width="9" height="24" rx="2" fill={SHIRT} />
      <rect className="anim-grow" style={delay(-1.2)} x="177" y="62" width="9" height="24" rx="2" fill="#5ec8ff" />
      <rect className="anim-scan" x="136" y="50" width="58" height="2" rx="1" fill="#fff" opacity="0.7" />
      <rect x="50" y="178" width="96" height="9" rx="4" fill="#4a4740" />
      <g className="anim-bob">
        <Arm d="M84 130 L70 156" />
        <Arm d="M112 130 L140 120" />
        <circle cx="142" cy="119" r="5" fill="#777" />
        <Body x={98} y={122} />
        <Head x={98} y={98} />
      </g>
      <g transform="translate(36 52)">
        <g className="anim-bob" style={delay(-0.8)}>
          <circle r="20" fill={SHIRT} />
          <text y="5" textAnchor="middle" fontSize="13" fontWeight="800" fill="#121110">FREE</text>
        </g>
      </g>
    </Scene>
  );
}

/* 2. เทรนเนอร์วางโปรแกรม + โภชนาการ */
function SceneTrainer() {
  return (
    <Scene label="เทรนเนอร์ถือแผนการฝึกและจานอาหาร">
      <g className="anim-bob">
        <Arm d="M58 130 L46 154" />
        <Arm d="M86 130 L104 136" />
        <Body x={72} y={122} shirt="#ffb347" />
        <path d="M66 124 L72 134 L78 124" stroke="#fff" strokeWidth="2" fill="none" />
        <Head x={72} y={98} cap="#ff7a3d" />
      </g>
      <g transform="translate(100 108)">
        <g className="anim-sway">
          <rect width="38" height="48" rx="5" fill="#fff" />
          <rect x="12" y="-4" width="14" height="7" rx="2" fill="#888" />
          {[12, 24, 36].map((y, i) => (
            <g key={y}>
              <path className="anim-tick" style={delay(i * 0.5)} d={`M6 ${y} l3 3 l5 -6`} stroke="#22a95a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <rect x="17" y={y - 2} width="15" height="3" rx="1.5" fill="#ccc" />
            </g>
          ))}
        </g>
      </g>
      <ellipse cx="190" cy="172" rx="34" ry="9" fill="#fff" />
      <ellipse cx="190" cy="168" rx="26" ry="6" fill="#f1ede4" />
      <circle cx="176" cy="160" r="8" fill="#4caf50" />
      <circle cx="183" cy="155" r="7" fill="#66c46a" />
      <ellipse cx="200" cy="162" rx="10" ry="7" fill="#fff" stroke="#eee" />
      <circle cx="200" cy="162" r="4" fill="#ffc531" />
      <rect x="186" y="160" width="10" height="7" rx="3" fill="#e9a76b" />
      <Heart x={180} y={138} />
      <Heart x={200} y={132} d={-1.2} />
    </Scene>
  );
}

/* 3. ออกกำลังกายจริง */
function SceneWorkout() {
  return (
    <Scene label="ตัวการ์ตูนยกบาร์เบล">
      <g className="anim-lift">
        <Arm d="M106 138 L90 64" />
        <Arm d="M134 138 L150 64" />
        <rect x="58" y="57" width="124" height="6" rx="3" fill="#bdbdbd" />
        <rect x="52" y="44" width="12" height="32" rx="3" fill="#333" />
        <rect x="176" y="44" width="12" height="32" rx="3" fill="#333" />
        <rect x="44" y="49" width="8" height="22" rx="3" fill="#555" />
        <rect x="188" y="49" width="8" height="22" rx="3" fill="#555" />
      </g>
      <Body x={120} y={124} />
      <Head x={120} y={100} />
      <path className="anim-float" d="M156 92 C152 98 152 102 156 102 C160 102 160 98 156 92Z" fill="#5ec8ff" />
      <path className="anim-float" style={delay(-1.3)} d="M84 96 C80 102 80 106 84 106 C88 106 88 102 84 96Z" fill="#5ec8ff" />
      <Sparkle x={40} y={120} d={-0.4} color={SHIRT} />
      <Sparkle x={202} y={118} d={-1} color={SHIRT} />
    </Scene>
  );
}

/* 4. รอดูผลลัพธ์ 3 เดือน */
function SceneWait() {
  return (
    <Scene label="ปฏิทินนับ 3 เดือน">
      <g className="anim-bob">
        <Arm d="M58 130 L46 154" />
        <Arm d="M86 130 L90 112" />
        <rect x="84" y="96" width="12" height="20" rx="4" fill="#5ec8ff" />
        <rect x="86" y="91" width="8" height="6" rx="2" fill="#2b7bb9" />
        <Body x={72} y={122} />
        <Head x={72} y={98} />
      </g>
      <g transform="translate(130 40)">
        <rect width="88" height="92" rx="12" fill="#fff" />
        <rect width="88" height="24" rx="12" fill="#ff6b6b" />
        <rect y="12" width="88" height="12" fill="#ff6b6b" />
        <circle cx="24" cy="2" r="4" fill="#555" />
        <circle cx="64" cy="2" r="4" fill="#555" />
        {["1", "2", "3"].map((m, i) => (
          <g key={m} className="anim-month" style={delay([0, -4, -2][i])}>
            <text x="44" y="64" textAnchor="middle" fontSize="34" fontWeight="800" fill="#121110">{m}</text>
            <text x="44" y="82" textAnchor="middle" fontSize="12" fill="#777">เดือน</text>
          </g>
        ))}
      </g>
      <rect x="130" y="146" width="88" height="10" rx="5" fill="#34312b" />
      <rect className="anim-fill" x="130" y="146" width="88" height="10" rx="5" fill={SHIRT} />
      <Sparkle x={222} y={36} d={-0.7} color={SHIRT} />
    </Scene>
  );
}

/* 5. ถ่ายรูป Body Profile ร่างทอง */
function SceneBodyProfile() {
  return (
    <Scene label="ตัวการ์ตูนร่างทองโพสท่าถ่ายรูป">
      <circle className="anim-sparkle" cx="88" cy="120" r="62" fill={GOLD} opacity="0.16" />
      <g className="anim-bob">
        <Arm d="M74 130 L46 126 L42 100" skin={GOLD} />
        <Arm d="M102 130 L130 126 L134 100" skin={GOLD} />
        <circle cx="42" cy="98" r="7" fill={GOLD} />
        <circle cx="134" cy="98" r="7" fill={GOLD} />
        <path d="M50 120 q6 -8 12 0" stroke="#e0a91f" strokeWidth="1.6" fill="none" />
        <path d="M114 120 q6 -8 12 0" stroke="#e0a91f" strokeWidth="1.6" fill="none" />
        <Body x={88} y={122} shirt={GOLD} skin={GOLD} abs />
        <Head x={88} y={98} skin={GOLD} />
      </g>
      <Sparkle x={36} y={70} d={0} />
      <Sparkle x={140} y={62} s={1.3} d={-0.6} />
      <Sparkle x={30} y={160} s={0.8} d={-1.1} />
      <Sparkle x={146} y={150} s={0.9} d={-1.5} />
      <g stroke="#777" strokeWidth="3" strokeLinecap="round">
        <path d="M196 124 L180 184 M196 124 L212 184 M196 124 V184" />
      </g>
      <rect x="174" y="96" width="44" height="30" rx="6" fill="#222" />
      <rect x="182" y="90" width="14" height="8" rx="2" fill="#222" />
      <circle cx="196" cy="111" r="10" fill="#444" stroke="#999" strokeWidth="2" />
      <circle cx="196" cy="111" r="4" fill="#5ec8ff" />
      <circle className="anim-flash" cx="189" cy="92" r="22" fill="#fff" opacity="0" />
      <text x="196" y="80" textAnchor="middle" fontSize="9" fontWeight="700" fill={GOLD}>BODY PROFILE</text>
    </Scene>
  );
}

const steps = [
  {
    when: "วันแรก",
    title: "ประเมิน InBody ฟรี",
    desc: "วัดไขมัน กล้ามเนื้อ และสัดส่วนด้วยเครื่อง InBody แล้วนั่งคุยเป้าหมายกับเทรนเนอร์แบบเป็นกันเอง ไม่มีค่าใช้จ่าย",
    Scene: SceneInBody,
  },
  {
    when: "สัปดาห์แรก",
    title: "เทรนเนอร์วางแผนให้",
    desc: "ออกแบบโปรแกรมฝึก จัดตารางเข้ายิม และวางแผนโภชนาการให้เหมาะกับร่างกายและไลฟ์สไตล์ของคุณ",
    Scene: SceneTrainer,
  },
  {
    when: "ทุกสัปดาห์",
    title: "ลงมือออกกำลังกายจริง",
    desc: "ฝึกตามโปรแกรม เข้าคลาสสนุก ๆ มีเทรนเนอร์คอยดูท่าและเชียร์อยู่ข้าง ๆ ตลอดทาง",
    Scene: SceneWorkout,
  },
  {
    when: "ครบ 3 เดือน",
    title: "ดูผลลัพธ์",
    desc: "วัด InBody อีกครั้งเทียบกับวันแรก เห็นความเปลี่ยนแปลงของร่างกายเป็นตัวเลขชัด ๆ",
    Scene: SceneWait,
  },
  {
    when: "ฉลองความสำเร็จ",
    title: "ถ่ายรูป Body Profile ร่างทอง",
    desc: "เก็บโมเมนต์ร่างใหม่ด้วยรูป Body Profile สวย ๆ เป็นรางวัลให้ความตั้งใจของตัวเอง",
    Scene: SceneBodyProfile,
  },
];

export default function Journey() {
  return (
    <>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {steps.map(({ when, title, desc, Scene: Art }, i) => (
          <li key={title} className="flex flex-col overflow-hidden rounded-3xl border border-line bg-surface">
            <div className="relative bg-gradient-to-b from-surface-2 to-surface px-3 pt-3">
              <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-brand font-display font-bold text-brand-ink">
                {i + 1}
              </span>
              <Art />
            </div>
            <div className="flex-1 p-5 pt-3">
              <p className="text-sm font-medium text-brand">{when}</p>
              <h3 className="font-display text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{desc}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-8 text-center">
        <a
          href={lineMessageUrl("สวัสดีครับ/ค่ะ อยากนัดประเมิน InBody ฟรี และปรึกษาเทรนเนอร์")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-4 font-display text-lg font-bold text-brand-ink transition hover:brightness-95"
        >
          เริ่มสเต็ปแรก นัดประเมิน InBody ฟรี
        </a>
      </div>
    </>
  );
}
