import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Workout.css";

export default function WorkoutPlanner({ username }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    if (!username) {
      setError("No username provided.");
      setLoading(false);
      return;
    }

    let mounted = true;

    async function load() {
      try {
        const res = await axios.get(`http://localhost:5001/api/workout/${username}`);
        const data = res.data;

        if (!mounted) return;

        if (!data.success) {
          setError(data.message || "Failed to load workout plan");
          return;
        }

        setPlan({
          bmi: data.bmi,
          goal: data.planType,
          level: data.planType,
          days: data.plan
        });

      } catch (err) {
        console.error(err);
        setError("Network error while fetching workout plan.");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [username]);

  if (loading)
    return <div className="workout-container">Loading workout plan...</div>;

  if (error)
    return (
      <div className="workout-container">
        <div className="workout-card error">{error}</div>
      </div>
    );

  if (!plan)
    return <div className="workout-container">No plan available.</div>;

  return (
    <>
      <div className="workout-container">
        
        <header className="workout-hero">
          <div className="hero-text">
            <h1>Weekly Workout Plan</h1>
            <p>
              {username} — {plan.level} • Goal: {plan.goal} • BMI {plan.bmi}
            </p>
          </div>
        </header>

        <div className="workout-grid">
          {plan.days.map((day, idx) => (
            <div
              key={idx}
              className={`workout-card ${day.split === "Rest" ? "rest-day" : ""}`}
            >
              <div className="card-head">
                <h3>
                  {day.day}{" "}
                  <span className="split">({day.split})</span>
                </h3>
              </div>

              {day.exercises.length === 0 ? (
                <p className="muted">Rest day — recover and stretch.</p>
              ) : (
                <ul className="exercise-list">
                  {day.exercises.map((ex, i) => (
                    <li
                      key={i}
                      className="exercise-item"
                      onClick={() => setSelectedExercise(ex)}
                    >
                      <strong>{ex.name}</strong>
                      <span className="meta">{ex.sets}× {ex.reps}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="workout-card tips">
          <h3>Training Tips</h3>
          <ul>
            <li>Warm up 5–10 minutes before each session.</li>
            <li>Progressively increase load each week (2.5–5%).</li>
            <li>Prioritize sleep and protein intake on training days.</li>
          </ul>
        </div>
      </div>

      {/* MODAL POPUP */}
      {selectedExercise && (
        <div className="exercise-modal-overlay" onClick={() => setSelectedExercise(null)}>
          <div className="exercise-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedExercise.name}</h2>

            <img
              src={`/workout/${selectedExercise.img}`}
              alt={selectedExercise.name}
              className="exercise-img"
            />

            <div className="exercise-details">
              <p><strong>Sets:</strong> {selectedExercise.sets}</p>
              <p><strong>Reps:</strong> {selectedExercise.reps}</p>
              {selectedExercise.rest && <p><strong>Rest:</strong> {selectedExercise.rest}</p>}
            </div>

            <button className="close-btn" onClick={() => setSelectedExercise(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}