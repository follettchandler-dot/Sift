import { ImageResponse } from "next/og";

export const alt = "Itemized — Know where every dollar actually goes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#FAFAF7",
          backgroundImage:
            "radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.08), transparent 40%), radial-gradient(circle at 80% 20%, rgba(28, 25, 23, 0.04), transparent 40%)",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Top row: Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "#1c1917",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "36px",
              fontWeight: 700,
              fontFamily: "sans-serif",
            }}
          >
            I
          </div>
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: "#1c1917",
              letterSpacing: "-0.02em",
              fontFamily: "sans-serif",
            }}
          >
            itemized
          </div>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 16px",
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              borderRadius: "9999px",
              color: "#d97706",
              fontSize: "18px",
              fontWeight: 500,
              alignSelf: "flex-start",
              fontFamily: "sans-serif",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "9999px",
                background: "#f59e0b",
              }}
            />
            The infrastructure for itemized purchase data
          </div>
          <div
            style={{
              fontSize: "88px",
              lineHeight: 0.95,
              color: "#1c1917",
              letterSpacing: "-0.03em",
              fontWeight: 400,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>Your bank shows charges.</div>
            <div style={{ color: "#d97706", fontStyle: "italic" }}>
              We show items.
            </div>
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#78716c",
              fontFamily: "sans-serif",
              fontWeight: 300,
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            Every bank says &ldquo;Walmart $152.&rdquo; Itemized shows you $82
            groceries, $41 office, $29 toys.
          </div>
        </div>

        {/* Bottom row: URL + stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontFamily: "sans-serif",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              color: "#1c1917",
              fontWeight: 600,
            }}
          >
            itemized.io
          </div>
          <div style={{ display: "flex", gap: "40px" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: "32px",
                  color: "#1c1917",
                  fontWeight: 700,
                  fontFamily: "serif",
                }}
              >
                94%
              </div>
              <div style={{ fontSize: "14px", color: "#a8a29e" }}>
                AI accuracy
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: "32px",
                  color: "#1c1917",
                  fontWeight: 700,
                  fontFamily: "serif",
                }}
              >
                147
              </div>
              <div style={{ fontSize: "14px", color: "#a8a29e" }}>
                categories
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: "32px",
                  color: "#1c1917",
                  fontWeight: 700,
                  fontFamily: "serif",
                }}
              >
                &lt;3s
              </div>
              <div style={{ fontSize: "14px", color: "#a8a29e" }}>
                per receipt
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
