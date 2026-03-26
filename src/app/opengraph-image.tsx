import { ImageResponse } from "next/og";

export const alt = "Gallón Antioquia — Conversaciones para Antioquia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          backgroundColor: "#F5F0E1",
          position: "relative",
        }}
      >
        {/* Decorative bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundColor: "#1B5E20",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "8px",
            left: 0,
            right: 0,
            height: "4px",
            backgroundColor: "#C8A951",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "#1B5E20",
              fontFamily: "serif",
              letterSpacing: "-2px",
            }}
          >
            GALLÓN
          </span>
          <span
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: "#C8A951",
              fontFamily: "serif",
              letterSpacing: "-2px",
            }}
          >
            ANTIOQUIA
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: "28px",
            color: "#5A5A5A",
            fontFamily: "serif",
            maxWidth: "700px",
            lineHeight: 1.5,
          }}
        >
          Una plataforma de pensamiento, territorio y liderazgo para Antioquia.
        </p>

        {/* Bottom label */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "2px",
              backgroundColor: "#C8A951",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              color: "#8A8A7A",
              fontFamily: "sans-serif",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Conversaciones para Antioquia
          </span>
        </div>

        {/* Mountain silhouette at bottom right */}
        <svg
          viewBox="0 0 400 100"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: "400px",
            height: "100px",
            opacity: 0.08,
          }}
        >
          <path
            d="M0,100 L50,40 L100,70 L150,20 L200,50 L250,10 L300,45 L350,25 L400,60 L400,100 Z"
            fill="#1B5E20"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
