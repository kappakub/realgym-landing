import { ImageResponse } from "next/og";

export const alt = "REAL GYM - Fitness Open Air";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#121110",
          color: "#f6f3ec",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 120, fontWeight: 800 }}>
          REAL<span style={{ color: "#ccfe0e", marginLeft: 24 }}>GYM</span>
        </div>
        <div style={{ fontSize: 56, marginTop: 16, color: "#ccfe0e" }}>FITNESS OPEN AIR</div>
        <div style={{ fontSize: 36, marginTop: 32, color: "#b9b3a6" }}>
          7 Branches in Bangkok · 100+ Machines · 200+ Classes / Month
        </div>
      </div>
    ),
    size,
  );
}
