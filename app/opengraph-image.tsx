import { ImageResponse } from "next/og";

export const alt = "VQBYTE — ERP, CRM, LMS, custom software, SEO and digital marketing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0b172a 0%, #0b2a44 60%, #005e86 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 44, fontWeight: 800, color: "#06a8e6", letterSpacing: -1 }}>VQBYTE</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, maxWidth: 980 }}>
            Software that runs your business. Marketing that grows it.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#b6c8d8" }}>
            ERP · CRM · LMS · Inventory · Custom software · SEO · Digital marketing
          </div>
        </div>
        <div style={{ display: "flex", width: 160, height: 8, borderRadius: 4, background: "#06a8e6" }} />
      </div>
    ),
    size,
  );
}
