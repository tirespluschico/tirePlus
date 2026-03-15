import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const runtime = "nodejs";
export const alt = "Tires+ Complete Auto Service — Chico, CA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = readFileSync(join(process.cwd(), "public/images/tireplus.png"));
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  const bgData = readFileSync(join(process.cwd(), "public/images/tireplusfront.jpg"));
  const bgSrc = `data:image/jpeg;base64,${bgData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bgSrc}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />

        {/* Dark gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(47,63,90,0.93) 0%, rgba(47,63,90,0.80) 50%, rgba(47,63,90,0.30) 100%)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px 80px",
            gap: "28px",
            maxWidth: "680px",
          }}
        >
          {/* Logo */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="Tires+" style={{ width: "280px", objectFit: "contain" }} />

          {/* Headline */}
          <div
            style={{
              fontSize: "52px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.15,
              letterSpacing: "-1px",
            }}
          >
            Get Back on the Road —{" "}
            <span style={{ color: "#cf2327" }}>Fast.</span>
          </div>

          {/* Sub */}
          <div style={{ fontSize: "22px", color: "#c1cde1", lineHeight: 1.5 }}>
            Tires, brakes, alignments &amp; full auto repair in Chico, CA.
          </div>

          {/* Phone pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#cf2327",
              color: "#fff",
              borderRadius: "999px",
              padding: "12px 32px",
              fontSize: "20px",
              fontWeight: 700,
              width: "fit-content",
              letterSpacing: "0.5px",
            }}
          >
            530-342-8338
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
