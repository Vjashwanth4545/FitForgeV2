import React from "react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot
} from "recharts";

const bmiData = [
  { bmi: 15, pop: 1 },
  { bmi: 17, pop: 5 },
  { bmi: 18.5, pop: 15 },
  { bmi: 22, pop: 35 },
  { bmi: 25, pop: 45 }, // Healthy Peak
  { bmi: 27, pop: 50 }, // Average Peak
  { bmi: 30, pop: 35 },
  { bmi: 35, pop: 15 },
  { bmi: 40, pop: 5 },
  { bmi: 45, pop: 1 }
];

export default function BMIBellCurve({ userBmi }) {
  const numericBmi = Number(userBmi) || 22;

  // We find the approximate "Height" of the curve at your BMI 
  // so we can place the dot exactly on top of the curve line.
  const closestData = bmiData.reduce((prev, curr) =>
    Math.abs(curr.bmi - numericBmi) < Math.abs(prev.bmi - numericBmi) ? curr : prev
  );

  return (
    <div style={{ width: "100%", height: "300px" }}> {/* Increased height for labels */}
      <ResponsiveContainer>
        <ComposedChart
          data={bmiData}
          margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="purpleFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          {/* 1. Y-AXIS IS BACK */}
          <YAxis 
  tickFormatter={(value) => `${value}%`} 
  width={40}
  // STYLE THE SIDE NUMBERS
  tick={{ 
    fontFamily: '"Bebas Neue", sans-serif', 
    letterSpacing: '1px', 
    fontSize: '1.1rem', 
    fill: '#888888' 
  }}
/>

<XAxis
  dataKey="bmi"
  type="number"
  domain={[15, 45]}
  tickCount={7}
  // 1. STYLE THE NUMBERS (15, 20, 25...)
  tick={{ 
    fontFamily: '"Bebas Neue", sans-serif', 
    letterSpacing: '1px', 
    fontSize: '1.1rem',  // Slightly smaller for numbers
    fill: '#374151' 
  }}
  // 2. STYLE THE TITLE ("BMI Scale")
  label={{ 
    value: "BMI Scale", 
    position: "insideBottom", 
    offset: -10,
    style: {
      fontFamily: '"Bebas Neue", sans-serif', // Your Custom Font
      letterSpacing: '1px',
      fontSize: '1.3rem', // Your Size
      fill: '#4c1d95' 
    }
  }}
/>
          
          <CartesianGrid vertical={false} stroke="#eee" strokeDasharray="5 5" />

          <Area
            type="monotone"
            dataKey="pop"
            stroke="#7c3aed"
            strokeWidth={3}
            fill="url(#purpleFill)"
            animationDuration={1500}
          />

          {/* 2. THE "YOU" LINE (Vertical Line) */}
          <ReferenceLine 
  x={numericBmi} 
  stroke="#000" 
  strokeDasharray="3 3" 
  label={{ 
    position: 'top', 
    value: 'YOU', 
    // STYLE THE "YOU" TEXT
    style: {
      fontFamily: '"Bebas Neue", sans-serif',
      letterSpacing: '1px',
      fontSize: '1.5rem', // Make "YOU" slightly bigger
      fill: '#000',
      fontWeight: 'bold'
    }
  }} 
/> 
          

          {/* 3. THE "YOU" DOT (Sitting on the curve) */}
          <ReferenceDot 
            x={numericBmi} 
            y={closestData.pop} 
            r={6} 
            fill="#7c3aed" 
            stroke="white" 
            strokeWidth={2} 
            isFront={true}
          />

        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}