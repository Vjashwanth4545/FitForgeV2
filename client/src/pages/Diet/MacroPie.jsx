import React from "react";

export default function MacroPie({ protein = 0, carbs = 0, fat = 0 }) {
  // 1. Convert Grams to Calories for the correct visual split
  const calsP = protein * 4;
  const calsC = carbs * 4;
  const calsF = fat * 9;

  const totalCalories = calsP + calsC + calsF;
  
  // Safety check to avoid dividing by zero
  const safeTotal = totalCalories > 0 ? totalCalories : 1;

  const pPerc = (calsP / safeTotal) * 100;
  const cPerc = (calsC / safeTotal) * 100;
  const fPerc = (calsF / safeTotal) * 100;

  // Modern Dark Mode Colors
  const colors = {
    protein: "#a78bfa", // Soft Purple
    carbs: "#60a5fa",   // Soft Blue
    fat: "#facc15",     // Soft Yellow
    empty: "#333333",   // Dark Grey for empty state
  };

  // Conic Gradient Logic
  const gradient = totalCalories > 0 
    ? `conic-gradient(
        ${colors.protein} 0% ${pPerc}%,
        ${colors.carbs} ${pPerc}% ${pPerc + cPerc}%,
        ${colors.fat} ${pPerc + cPerc}% 100%
      )`
    : `conic-gradient(${colors.empty} 0% 100%)`;

  const styles = {
    wrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Segoe UI', sans-serif",
      width: "100%",
    },
    chart: {
      position: "relative",
      width: "180px",
      height: "180px",
      borderRadius: "50%",
      background: gradient,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "0 0 20px rgba(0,0,0,0.5)", // Darker shadow for depth
    },
    hole: {
      width: "140px",
      height: "140px",
      // CRITICAL: Matches the Dark Card background (#1e1e1e)
      background: "#1e1e1e", 
      borderRadius: "50%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      boxShadow: "inset 0 4px 10px rgba(0,0,0,0.5)", // Inner shadow for depth
    },
    totalLabel: {
      fontSize: "11px",
      color: "#888",
      fontWeight: "700",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    totalValue: {
      fontSize: "26px",
      fontWeight: "bold",
      color: "#ffffff", // White text
    },
    unit: {
      fontSize: "12px",
      color: "#666",
    },
    legend: {
      display: "flex",
      gap: "20px",
      marginTop: "20px",
    },
    legendItem: {
      textAlign: "center",
    },
    legendLabel: (color) => ({
      color: color,
      fontWeight: "bold",
      fontSize: "13px",
      marginBottom: "2px"
    }),
    legendVal: {
      color: "#ccc",
      fontSize: "12px"
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.chart}>
        <div style={styles.hole}>
          <span style={styles.totalLabel}>Total</span>
          <span style={styles.totalValue}>{Math.round(totalCalories)}</span>
          <span style={styles.unit}>kcal</span>
        </div>
      </div>
      
      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={styles.legendLabel(colors.protein)}>Protein</div>
          <div style={styles.legendVal}>{protein}g</div>
        </div>
        <div style={styles.legendItem}>
          <div style={styles.legendLabel(colors.carbs)}>Carbs</div>
          <div style={styles.legendVal}>{carbs}g</div>
        </div>
        <div style={styles.legendItem}>
          <div style={styles.legendLabel(colors.fat)}>Fat</div>
          <div style={styles.legendVal}>{fat}g</div>
        </div>
      </div>
    </div>
  );
}