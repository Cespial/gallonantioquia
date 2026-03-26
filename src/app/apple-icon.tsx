import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1B5E20",
          borderRadius: "36px",
          fontSize: 120,
          fontWeight: 900,
          color: "#C8A951",
          fontFamily: "serif",
        }}
      >
        G
      </div>
    ),
    { ...size }
  );
}
