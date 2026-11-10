import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

/** PNG version of the brand logo for emails (most email apps block SVG). */
export const dynamic = "force-static";

export async function GET() {
  const svg = await readFile(path.join(process.cwd(), "public/brand/vqbyte-logo.svg"), "utf8");
  const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={340} height={113} alt="VQBYTE" />
      </div>
    ),
    { width: 360, height: 120, headers: { "cache-control": "public, max-age=31536000, immutable" } },
  );
}
