import React, { useEffect, useState } from "react";
import axios from "axios";
import BMIGauge from "./BMIGuage";
import BMIBellCurve from "./BMIbellcurve";

function calBmi(height, weight) {
  return weight / (height * height);
}

function getCategory(bmi) {
  if (bmi < 16) return "Severe Thinness";
  if (bmi >= 16 && bmi < 17) return "Moderate Thinness";
  if (bmi >= 17 && bmi < 18.5) return "Mild Thinness (Leaner)";
  if (bmi >= 18.5 && bmi < 25) return "Normal (Fit)";
  if (bmi >= 25 && bmi < 30) return "Overweight";
  if (bmi >= 30 && bmi < 35) return "Obese Class I";
  if (bmi >= 35 && bmi < 40) return "Obese Class II";
  return "Obese Class III";
}

const BMIbody = ({ username }) => {
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [category, setCategory] = useState("");

  // extra calculated data
  const [healthyRange, setHealthyRange] = useState({});
  const [bmiPrime, setBmiPrime] = useState(null);
  const [ponderalIndex, setPI] = useState(null);

  useEffect(() => {
    async function fetchBMI() {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/bmi/${username}`
        );

        if (response.data.success) {
          const heightCm = response.data.height; 
          const w = response.data.weight;
          
          // convert height correctly
          const h = heightCm / 100; // meters
          
          setHeight(h);
          setWeight(w);
          
          // correct BMI calculation now
          const calculatedBMI = calBmi(h, w);
          setBmi(Number(calculatedBMI.toFixed(2)));

          setCategory(getCategory(calculatedBMI));

          // Healthy weight range
          const minW = (18.5 * h * h).toFixed(1);
          const maxW = (25 * h * h).toFixed(1);
          setHealthyRange({ min: minW, max: maxW });

          // BMI Prime
          setBmiPrime((calculatedBMI / 25).toFixed(2));

          // Ponderal Index
          setPI((w / (h * h * h)).toFixed(2));

        } else {
          alert(response.data.message);
        }
      } catch (err) {
        console.error(err);
      }
    }

    fetchBMI();
  }, [username]);

  return (
    <>
      <div className="bmi-greet">
        Your BMI Report, {username}!!
      </div>

      {bmi && (
        <div className="bmi-box">
          <p><b>Your BMI:</b> {bmi}</p>
          <p><b>Status:</b> {category}</p>
          <p><b>Healthy BMI Range:</b> 18.5 - 25</p>
          <p><b>Healthy Weight Range:</b> {healthyRange.min}kg - {healthyRange.max}kg</p>
          <p><b>BMI Prime:</b> {bmiPrime}</p>
          <p><b>Ponderal Index:</b> {ponderalIndex}</p>
        </div>
      )}

      {/* Graph Boxes */}
      <div className="bmi-graph">
        <div className="graph-box">
         <p>BMI Guage</p>
         <BMIGauge bmi={bmi} />
        </div>
        <div className="graph-box">
         <p>Your BMI vs Population</p>
         <BMIBellCurve userBmi={Number(bmi)} />
        </div>
      </div>
    </>
  );
};

export default BMIbody;