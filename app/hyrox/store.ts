import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { NewSession, Session } from "./hyrox";

// ถ้าตั้งค่า Supabase แล้ว จะใช้ระบบสมาชิก + ฐานข้อมูลจริง
// ถ้ายังไม่ได้ตั้ง จะเป็น "โหมดทดลอง" เก็บข้อมูลไว้ในเครื่องของลูกค้าเท่านั้น
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;
export const isDemo = !supabase;

export type User = { id: string; email: string; name: string };

const TABLE = "hyrox_sessions";
const LOCAL_KEY = "realgym-hyrox-demo";

function readLocal(): Session[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]") as Session[];
  } catch {
    return [];
  }
}

function writeLocal(list: Session[]) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch {
    // เบราว์เซอร์ไม่อนุญาตให้เก็บข้อมูล (เช่นโหมดไม่ระบุตัวตน)
  }
}

const sortSessions = (list: Session[]) =>
  [...list].sort((a, b) => b.date.localeCompare(a.date) || b.created_at.localeCompare(a.created_at));

export async function listSessions(): Promise<Session[]> {
  if (!supabase) return sortSessions(readLocal());
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Session[];
}

export async function saveSession(s: NewSession): Promise<void> {
  if (!supabase) {
    const row: Session = { ...s, id: crypto.randomUUID(), created_at: new Date().toISOString() };
    writeLocal([row, ...readLocal()]);
    return;
  }
  const { error } = await supabase.from(TABLE).insert(s);
  if (error) throw error;
}

export async function deleteSession(id: string): Promise<void> {
  if (!supabase) {
    writeLocal(readLocal().filter((s) => s.id !== id));
    return;
  }
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw error;
}

/* ---------- ระบบสมาชิก ---------- */

export function toUser(u: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null): User | null {
  if (!u) return null;
  const meta = u.user_metadata ?? {};
  const name = (meta.full_name as string) || (meta.name as string) || (u.email ?? "").split("@")[0];
  return { id: u.id, email: u.email ?? "", name };
}

export async function signInWithGoogle() {
  if (!supabase) return;
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/hyrox` },
  });
}

export async function signInWithEmail(email: string, password: string) {
  if (!supabase) return { error: "ยังไม่ได้เปิดระบบสมาชิก" };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : null };
}

export async function signUpWithEmail(email: string, password: string, name: string) {
  if (!supabase) return { error: "ยังไม่ได้เปิดระบบสมาชิก", needsConfirm: false };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name }, emailRedirectTo: `${window.location.origin}/hyrox` },
  });
  if (error) {
    const msg = /already/i.test(error.message)
      ? "อีเมลนี้สมัครไว้แล้ว ลองเข้าสู่ระบบแทน"
      : /password/i.test(error.message)
        ? "รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร"
        : "สมัครไม่สำเร็จ ลองใหม่อีกครั้ง";
    return { error: msg, needsConfirm: false };
  }
  return { error: null, needsConfirm: !data.session };
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
}
