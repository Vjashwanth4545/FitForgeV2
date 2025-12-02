import React from "react";

export default function BMIGauge({ bmi = null, width = "100%", height = "80px" }) {
  const maxBMI = 40;
  const value = Math.min(Math.max(bmi || 0, 0), maxBMI);
  const percent = (value / maxBMI) * 100;

  const safePercent = Math.min(Math.max(percent, 2.5), 97.5);

  const ranges = [
    { label: "Under", min: 0, max: 18.5, color: "#a78bfa" },
    { label: "Fit", min: 18.5, max: 25, color: "#7c3aed" },
    { label: "Over", min: 25, max: 30, color: "#f59e0b" },
    { label: "Obese", min: 30, max: 40, color: "#ff6b6b" },
  ];

  function getCategory(b) {
    if (b < 18.5) return "Leaner (Underweight)";
    if (b < 25) return "Normal (Fit)";
    if (b < 30) return "Overweight";
    return "Obese";
  }

  return (
    <div
    style={{
      width: "100%",
      maxWidth: "850px",
      margin: "0 auto",
      padding: "20px 0 35px",
      position: "relative",
    }}
  >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontFamily: "Bebas Neue", fontSize: 22, color: "#7c3aed" }}>
          {bmi?.toFixed(2)} kg/m²
        </div>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height,
          background: "#eee",
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(124,58,237,0.18)",
        }}
      >
        <div style={{ display: "flex", width: "100%", height: "100%" }}>
          {ranges.map((r, i) => (
            <div
              key={i}
              style={{
                flex: r.max - r.min,
                background: r.color,
                opacity: 0.88,
              }}
            ></div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: `calc(${safePercent}% - 8px)`,
            top: -8,
            transition: "left .5s ease-out",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "white",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2), 0 0 8px #7c3aed",
            }}
          ></div>

          <div
            style={{
              marginTop: 8,
              padding: "4px 8px",
              borderRadius: 8,
              background: "linear-gradient(90deg,#7c3aed,#a855f7)",
              fontFamily: "Poppins",
              fontSize: 12,
              color: "white",
              boxShadow: "0 6px 20px rgba(124,58,237,0.25)",
            }}
          >
            {bmi?.toFixed(1)}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 12,
          fontFamily: "Poppins",
          fontSize: 12,
          color: "#555",
        }}
      >
        {ranges.map((r, i) => (
          <div key={i} style={{ textAlign: "center", width: "25%" }}>
            <div style={{ fontWeight: 700, color: r.color }}>{r.label}</div>
            <div>
              {r.min} - {r.max}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 14, fontFamily: "Poppins", fontWeight: 600 }}>
        {getCategory(bmi)}
      </div>
    </div>
  );
}