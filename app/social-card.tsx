import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const socialCardSize = {
  width: 1200,
  height: 630,
};

export async function createSocialCard() {
  const character = await readFile(
    join(process.cwd(), "public/character/neutral-social.jpg"),
    "base64",
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        padding: 24,
        background: "#e6e1d9",
        color: "#eeeae3",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          borderRadius: 28,
          background: "#171714",
        }}
      >
        <div
          style={{
            width: "59%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "58px 52px 48px 58px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 29,
              fontWeight: 700,
              letterSpacing: "-0.04em",
            }}
          >
            {site.name}<span style={{ color: "#ed674d" }}>.</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                marginBottom: 17,
                color: "#ed674d",
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Software engineer · product builder
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 62,
                fontWeight: 700,
                letterSpacing: "-0.065em",
                lineHeight: 0.96,
              }}
            >
              <span>Complicated,</span>
              <span>slightly stubborn</span>
              <span style={{ color: "#ed674d" }}>problems.</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              color: "#a7a49f",
              fontSize: 20,
              letterSpacing: "0.01em",
            }}
          >
            Sablebook · 73Kit · erkan.dev
          </div>
        </div>

        <div
          style={{
            width: "41%",
            display: "flex",
            borderLeft: "2px solid #ed674d",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src={`data:image/jpeg;base64,${character}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      </div>
    </div>,
    socialCardSize,
  );
}
