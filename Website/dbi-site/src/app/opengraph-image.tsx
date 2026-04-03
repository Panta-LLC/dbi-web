import { ImageResponse } from "next/og";

export const alt = "Delta Bay Impact — educational equity and mentorship in Contra Costa County";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1e4d8b",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <span
          style={{
            color: "#ff7900",
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          Delta Bay Impact
        </span>
        <span
          style={{
            marginTop: 28,
            fontSize: 34,
            fontWeight: 500,
            maxWidth: 920,
            textAlign: "center",
            lineHeight: 1.25,
            paddingLeft: 48,
            paddingRight: 48,
          }}
        >
          Every African American Student Deserves to Thrive
        </span>
        <span
          style={{
            marginTop: 36,
            fontSize: 22,
            fontWeight: 400,
            opacity: 0.92,
            maxWidth: 880,
            textAlign: "center",
            lineHeight: 1.35,
            paddingLeft: 48,
            paddingRight: 48,
          }}
        >
          Mentorship, academic support, and advocacy for youth in Contra Costa County.
        </span>
      </div>
    ),
    { ...size },
  );
}
