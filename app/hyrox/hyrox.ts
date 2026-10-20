export type SegmentKind = "run" | "station" | "roxzone" | "rest";

export type Segment = {
  kind: SegmentKind;
  name: string;
  /** ระยะ/จำนวน เช่น "1 km", "100 reps" */
  amount: string;
  /** เวลาเป็นมิลลิวินาที (null = ยังไม่ได้กรอก) */
  ms: number | null;
};

export type SessionMode = "hyrox" | "custom";

export type Session = {
  id: string;
  date: string; // YYYY-MM-DD
  mode: SessionMode;
  title: string;
  division: string;
  segments: Segment[];
  total_ms: number;
  note: string;
  created_at: string;
};

export type NewSession = Omit<Session, "id" | "created_at">;

export const DIVISIONS = ["Open ชาย", "Open หญิง", "Pro ชาย", "Pro หญิง", "Doubles", "Relay"];

/** 8 สถานีตามลำดับการแข่ง HYROX */
export const HYROX_STATIONS: { name: string; amount: string }[] = [
  { name: "SkiErg", amount: "1000 m" },
  { name: "Sled Push", amount: "50 m" },
  { name: "Sled Pull", amount: "50 m" },
  { name: "Burpee Broad Jumps", amount: "80 m" },
  { name: "Rowing", amount: "1000 m" },
  { name: "Farmers Carry", amount: "200 m" },
  { name: "Sandbag Lunges", amount: "100 m" },
  { name: "Wall Balls", amount: "100 reps" },
];

/** เทมเพลตมาตรฐาน: วิ่ง 1 km → ROX ZONE → สถานี → ROX ZONE ... (จบที่ Wall Balls) */
export function hyroxTemplate(): Segment[] {
  const out: Segment[] = [];
  HYROX_STATIONS.forEach((st, i) => {
    out.push({ kind: "run", name: `Run ${i + 1}`, amount: "1 km", ms: null });
    out.push({ kind: "roxzone", name: "ROX ZONE", amount: "เข้าสถานี", ms: null });
    out.push({ kind: "station", name: st.name, amount: st.amount, ms: null });
    if (i < HYROX_STATIONS.length - 1) {
      out.push({ kind: "roxzone", name: "ROX ZONE", amount: "ออกไปวิ่ง", ms: null });
    }
  });
  return out;
}

/** ตัวเลือกสถานีสำหรับโปรแกรมกำหนดเอง */
export const STATION_PRESETS = [
  ...HYROX_STATIONS.map((s) => s.name),
  "Run",
  "Assault Bike",
  "Kettlebell Swing",
  "Box Jump",
  "Thruster",
  "อื่น ๆ",
];

/** แปลงข้อความเวลา เช่น "4:35", "1:02:10", "435", "75" เป็นมิลลิวินาที */
export function parseTime(input: string): number | null {
  const t = input.trim();
  if (!t) return null;
  let parts: number[];
  if (t.includes(":")) {
    parts = t.split(":").map((p) => Number(p));
  } else if (/^\d+$/.test(t)) {
    // พิมพ์ตัวเลขล้วน: 2 หลักท้าย = วินาที เช่น 435 = 4:35
    const n = t.padStart(3, "0");
    parts = [Number(n.slice(0, -2)), Number(n.slice(-2))];
  } else {
    return null;
  }
  if (parts.some((p) => !Number.isFinite(p) || p < 0) || parts.length > 3) return null;
  if (parts.slice(1).some((p) => p >= 60)) return null;
  const secs = parts.reduce((acc, p) => acc * 60 + p, 0);
  return Math.round(secs * 1000);
}

export function formatTime(ms: number | null, withTenths = false): string {
  if (ms == null) return "--:--";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const ss = String(s).padStart(2, "0");
  const tenths = withTenths ? `.${Math.floor((ms % 1000) / 100)}` : "";
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${ss}${tenths}` : `${m}:${ss}${tenths}`;
}

export function totals(segments: Segment[]) {
  const sum = (k: SegmentKind) =>
    segments.filter((s) => s.kind === k).reduce((a, s) => a + (s.ms ?? 0), 0);
  const run = sum("run");
  const station = sum("station");
  const roxzone = sum("roxzone");
  const rest = sum("rest");
  return { run, station, roxzone, rest, total: run + station + roxzone + rest };
}

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
