import React, { useEffect, useState } from "react";
import "./Diet.css";
import MacroPie from "./MacroPie";
import axios from "axios";
export default function DietBody({ username }) {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
      try {
        const res = await axios.get(`https://fitforgev2.onrender.com/api/diet/${username}`);
        const data = res.data;  // FIXED
    
        if (!mounted) return;
    
        if (!data.success) {
          setError(data.message || "Failed to load profile");
          setLoading(false);
          return;
        }
    
        const height = Number(data.height);
        const weight = Number(data.weight);
        const age = Number(data.age);
        const activityLevel = Number(data.activityLevel);
    
        if (
          Number.isNaN(height) ||
          Number.isNaN(weight) ||
          Number.isNaN(age) ||
          Number.isNaN(activityLevel)
        ) {
          setError("Invalid numeric values from server.");
          setLoading(false);
          return;
        }
    
        const userObj = {
          username,
          gender: data.gender,
          age,
          height,
          weight,
          activityLevel,
        };
    
        setUser(userObj);
        calculatePlan(userObj);
      } catch (err) {
        console.error(err);
        setError("Network error when fetching user profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
    return () => {
      mounted = false;
    };
  }, [username]);

  const calculatePlan = (u) => {
    const { age, gender, height, weight, activityLevel } = u;

    const heightM = height / 100 || 1;
    const bmiVal = Number((weight / (heightM * heightM)).toFixed(1)) || 0;

    let bmiCat = "Normal";
    if (bmiVal < 18.5) bmiCat = "Underweight";
    else if (bmiVal >= 25 && bmiVal < 29.9) bmiCat = "Overweight";
    else if (bmiVal >= 30) bmiCat = "Obese";

    const BMR =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const tdee = Math.round(BMR * activityLevel);

    let goalType = "Maintenance";
    let target = tdee;
    let macroSplit = { p: 0.3, c: 0.5, f: 0.2 };

    if (weight > height - 100) {
      goalType = "Fat Loss";
      target = Math.max(1200, tdee - 400);
      macroSplit = { p: 0.4, c: 0.35, f: 0.25 };
    } else if (weight < height - 110) {
      goalType = "Muscle Gain";
      target = tdee + 300;
      macroSplit = { p: 0.3, c: 0.5, f: 0.2 };
    }

    const pG = Math.round((target * macroSplit.p) / 4);
    const cG = Math.round((target * macroSplit.c) / 4);
    const fG = Math.round((target * macroSplit.f) / 9);

    setResults({
      bmi: bmiVal,
      bmiCategory: bmiCat,
      targetCalories: target,
      goalType,
      macros: { p: pG, c: cG, f: fG },
      meals: {
        breakfast: Math.round(target * 0.25),
        lunch: Math.round(target * 0.35),
        snack: Math.round(target * 0.1),
        dinner: Math.round(target * 0.3),
      },
    });
  };

  if (loading) {
    return <div className="diet-container">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="diet-container">
        <div className="diet-intro">
          <h2>Hello, <span className="highlight">{username}</span></h2>
        </div>
        <div className="diet-card">
          <h3>Profile Error</h3>
          <p className="muted">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="diet-container">
        <div className="diet-intro">
          <h2>Hello, <span className="highlight">{username}</span></h2>
        </div>
        <div className="diet-card">
          <h3>No profile</h3>
          <p className="muted">No stored profile found for this account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="diet-container">
      <div className="diet-intro">
        <h2>Hello, <span className="highlight">{username}</span></h2>
        <p>Your personalized nutrition plan  is below.</p>
      </div>

      <div className="diet-card">
        <h3>Your Stored Details</h3>
        <div className="details-grid">
          <p><strong>Gender:</strong> {user.gender}</p>
          <p><strong>Age:</strong> {user.age} years</p>
          <p><strong>Height:</strong> {user.height} cm</p>
          <p><strong>Weight:</strong> {user.weight} kg</p>
          <p><strong>Activity Level:</strong> {user.activityLevel}</p>
        </div>
      </div>

      {results && (
        <>
          <div className="stats-row">
            <div className="diet-card stat-card">
              <h4>BMI Score</h4>
              <div className="big-number">{results.bmi}</div>
              <div className={`badge ${results.bmiCategory.toLowerCase()}`}>
                {results.bmiCategory}
              </div>
            </div>

            <div className="diet-card stat-card">
              <h4>Daily Target</h4>
              <div className="big-number primary">{results.targetCalories}</div>
              <div className="sub-text">kcal / day</div>
            </div>

            <div className="diet-card stat-card">
              <h4>Goal</h4>
              <div className="goal-text">{results.goalType}</div>
            </div>
          </div>

          <div className="main-split">
            <div className="diet-card chart-card">
              <h3>Macro Distribution</h3>
              <MacroPie
                protein={results.macros.p}
                carbs={results.macros.c}
                fat={results.macros.f}
              />
            </div>

            <div className="diet-card meal-card">
              <h3>Recommended Meal Split</h3>
              <div className="meal-list">
                <MealItem icon="🍳" name="Breakfast" cals={results.meals.breakfast} color="#ffb703" />
                <MealItem icon="🍱" name="Lunch" cals={results.meals.lunch} color="#fb8500" />
                <MealItem icon="🍎" name="Snack" cals={results.meals.snack} color="#219ebc" />
                <MealItem icon="🍽️" name="Dinner" cals={results.meals.dinner} color="#023047" />
              </div>
            </div>
          </div>

          <div className="diet-card">
            <h3>Good Food Options</h3>
            <div className="food-grid">
              <FoodColumn title="Protein" color="#8b5cf6" items={["Chicken", "Eggs", "Paneer", "Lentils"]} />
              <FoodColumn title="Carbs" color="#3b82f6" items={["Rice", "Oats", "Banana", "Sweet Potato"]} />
              <FoodColumn title="Healthy Fats" color="#f59e0b" items={["Nuts", "Olive Oil", "Avocado"]} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* Small presentation components */
function MealItem({ name, cals, color, icon }) {
  return (
    <div className="meal-item" style={{ borderLeft: `4px solid ${color}` }}>
      <span className="meal-icon">{icon}</span>
      <div className="meal-info">
        <span>{name}</span>
        <span className="meal-cals">{cals} kcal</span>
      </div>
    </div>
  );
}

function FoodColumn({ title, items, color }) {
  return (
    <div className="food-col">
      <h4 style={{ color }}>{title}</h4>
      <ul>
        {items.map((i, idx) => (
          <li key={idx}>{i}</li>
        ))}
      </ul>
    </div>
  );
}