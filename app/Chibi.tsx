import type { CSSProperties, ReactNode } from "react";

// ชิ้นส่วนตัวการ์ตูนจิบิ (SVG ล้วน) ใช้ร่วมกันทุกหน้า อนิเมชันอยู่ใน globals.css (anim-*)

export const SKIN = "#ffd9b8";
export const GOLD = "#ffcf3f";
export const HAIR = "#3b2a20";
export const INK = "#2b1d14";
export const SHIRT = "#ccfe0e";

export const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

export function Head({ x, y, skin = SKIN, cap }: { x: number; y: number; skin?: string; cap?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="30" fill={skin} />
      <path d="M-31 2 C-34 -38 34 -38 31 2 C24 -14 8 -20 -2 -12 C-12 -20 -26 -12 -31 2Z" fill={HAIR} />
      {cap && (
        <>
          <path d="M-29 -10 C-28 -40 28 -40 29 -10Z" fill={cap} />
          <rect x="4" y="-14" width="34" height="7" rx="3.5" fill={cap} />
        </>
      )}
      <g className="anim-blink">
        <ellipse cx="-11" cy="6" rx="3.6" ry="4.6" fill={INK} />
        <ellipse cx="11" cy="6" rx="3.6" ry="4.6" fill={INK} />
        <circle cx="-10" cy="4" r="1.3" fill="#fff" />
        <circle cx="12" cy="4" r="1.3" fill="#fff" />
      </g>
      <ellipse cx="-19" cy="15" rx="5" ry="3" fill="#ff8fa3" opacity="0.6" />
      <ellipse cx="19" cy="15" rx="5" ry="3" fill="#ff8fa3" opacity="0.6" />
      <path d="M-5 15 Q0 20 5 15" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function Body({ x, y, shirt = SHIRT, skin = SKIN, abs }: { x: number; y: number; shirt?: string; skin?: string; abs?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-13" y="38" width="9" height="17" rx="4" fill={skin} />
      <rect x="4" y="38" width="9" height="17" rx="4" fill={skin} />
      <ellipse cx="-9" cy="56" rx="8" ry="4" fill="#222" />
      <ellipse cx="9" cy="56" rx="8" ry="4" fill="#222" />
      <rect x="-18" y="0" width="36" height="34" rx="12" fill={shirt} />
      {abs && (
        <g stroke="#e0a91f" strokeWidth="1.6" strokeLinecap="round">
          <path d="M0 8 V26" />
          <path d="M-7 13 H7 M-7 20 H7" />
        </g>
      )}
      <rect x="-17" y="28" width="34" height="13" rx="5" fill="#2a2a2a" />
    </g>
  );
}

export function Arm({ d, skin = SKIN }: { d: string; skin?: string }) {
  return <path d={d} stroke={skin} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" />;
}

export function Sparkle({ x, y, s = 1, d = 0, color = GOLD }: { x: number; y: number; s?: number; d?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="anim-sparkle" style={delay(d)} d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z" fill={color} />
    </g>
  );
}

export function Heart({ x, y, d = 0 }: { x: number; y: number; d?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        className="anim-float"
        style={delay(d)}
        d="M0 6 C-10 -2 -6 -10 0 -5 C6 -10 10 -2 0 6Z"
        fill="#ff6b8b"
      />
    </g>
  );
}

export function Scene({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 240 200" role="img" aria-label={label} className="h-auto w-full">
      <ellipse cx="120" cy="190" rx="100" ry="8" fill="#000" opacity="0.25" />
      {children}
    </svg>
  );
}
