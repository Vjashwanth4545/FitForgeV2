import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
const allExercises = [
    // Cardio
    "Running",
    "Walking",
    "Cycling",
    "Elliptical",
    "Skipping",
    "Weight Training",
    "Bench Press",
    "Push Ups",
    "Squats",
    "Deadlift",
    "Yoga",
    "Swimming",
  
    // Chest
    "Barbell Bench Press",
    "Incline Dumbbell Press",
    "Decline Barbell Press",
    "Chest Dips",
    "Cable Chest Fly",
    "Machine Chest Press",
    "Dumbbell Bench Press",
    "Pec Deck Machine",
    "Push-Ups",
    "Incline Cable Fly",
  
    // Shoulders
    "Barbell Overhead Press",
    "Dumbbell Shoulder Press",
    "Arnold Press",
    "Lateral Raises",
    "Front Raises",
    "Rear Delt Fly",
    "Cable Rear Delt",
    "Machine Shoulder Press",
    "Upright Row",
    "Face Pulls",
  
    // Legs
    "Barbell Squat",
    "Leg Press",
    "Bulgarian Split Squat",
    "Lunges",
    "Leg Extension",
    "Hamstring Curl",
    "Romanian Deadlift",
    "Hack Squat Machine",
    "Goblet Squat",
    "Deadlift (Conventional)",
  
    // Back
    "Pull-Ups",
    "Lat Pulldown",
    "Seated Cable Row",
    "Barbell Bent-Over Row",
    "T-Bar Row",
    "Dumbbell Row",
    "Machine Row",
    "Straight Arm Lat Pulldown",
  
    // Biceps
    "Barbell Curl",
    "Dumbbell Curl",
    "Hammer Curl",
    "Concentration Curl",
    "Cable Curl",
    "Preacher Curl",
    "EZ Bar Curl",
    "Incline Dumbbell Curl",
    "Reverse Curl",
    "Spider Curl",
  
    // Triceps
    "Tricep Pushdown",
    "Skull Crushers",
    "Overhead Dumbbell Extension",
    "Close Grip Bench Press",
    "Dips",
    "Rope Pushdown",
    "Tricep Kickback",
    "Machine Tricep Press",
    "Bench Dips",
    "Single Arm Cable Extension",
  
    // Core
    "Plank",
    "Leg Raise",
    "Bicycle Crunch",
    "Cable Crunch",
    "Hanging Knee Raise",
    "Russian Twist",
    "Mountain Climbers",
    "Ab Wheel Rollout",
    "Flutter Kicks",
    "Toe Touches",
  
    // Glutes
    "Hip Thrust",
    "Glute Bridge",
    "Cable Kickback",
    "Smith Machine Squat",
    "Step-Ups",
    "Reverse Lunges",
    "Frog Pumps",
    "Banded Side Walk",
    "B-Stance RDL",
  
    // Full Body
    "Kettlebell Swing",
    "Burpees",
    "Battle Rope",
    "Thrusters",
    "Sled Push",
    "Farmer’s Walk",
    "Box Jump",
    "Clean & Press",
    "Rowing Machine",
    "Ski Erg"
  ];

const caloriesMap = {
    // -------------------------
    // Cardio (Original)
    // -------------------------
    "Running": 10,
    "Walking": 4,
    "Cycling": 8,
    "Elliptical": 7,
    "Skipping": 12,
    "Weight Training": 6,
    "Bench Press": 5,
    "Push Ups": 7,
    "Squats": 6,
    "Deadlift": 8,
    "Yoga": 3,
    "Swimming": 9,
  
    // -------------------------
    // Chest
    // -------------------------
    "Barbell Bench Press": 5,
    "Incline Dumbbell Press": 5,
    "Decline Barbell Press": 5,
    "Chest Dips": 7,
    "Cable Chest Fly": 5,
    "Machine Chest Press": 4,
    "Dumbbell Bench Press": 5,
    "Pec Deck Machine": 4,
    "Push-Ups": 7,
    "Incline Cable Fly": 5,
  
    // -------------------------
    // Shoulders
    // -------------------------
    "Barbell Overhead Press": 6,
    "Dumbbell Shoulder Press": 6,
    "Arnold Press": 6,
    "Lateral Raises": 4,
    "Front Raises": 4,
    "Rear Delt Fly": 4,
    "Cable Rear Delt": 4,
    "Machine Shoulder Press": 5,
    "Upright Row": 5,
    "Face Pulls": 4,
  
    // -------------------------
    // Legs
    // -------------------------
    "Barbell Squat": 8,
    "Leg Press": 6,
    "Bulgarian Split Squat": 7,
    "Lunges": 6,
    "Leg Extension": 4,
    "Hamstring Curl": 4,
    "Romanian Deadlift": 7,
    "Hack Squat Machine": 7,
    "Goblet Squat": 6,
    "Deadlift (Conventional)": 8,
  
    // -------------------------
    // Back
    // -------------------------
    "Pull-Ups": 8,
    "Lat Pulldown": 6,
    "Seated Cable Row": 5,
    "Barbell Bent-Over Row": 6,
    "T-Bar Row": 6,
    "Dumbbell Row": 5,
    "Machine Row": 4,
    "Straight Arm Lat Pulldown": 4,
  
    // -------------------------
    // Biceps
    // -------------------------
    "Barbell Curl": 4,
    "Dumbbell Curl": 4,
    "Hammer Curl": 4,
    "Concentration Curl": 3,
    "Cable Curl": 3,
    "Preacher Curl": 4,
    "EZ Bar Curl": 4,
    "Incline Dumbbell Curl": 4,
    "Reverse Curl": 3,
    "Spider Curl": 4,
  
    // -------------------------
    // Triceps
    // -------------------------
    "Tricep Pushdown": 3,
    "Skull Crushers": 4,
    "Overhead Dumbbell Extension": 4,
    "Close Grip Bench Press": 5,
    "Dips": 6,
    "Rope Pushdown": 3,
    "Tricep Kickback": 3,
    "Machine Tricep Press": 3,
    "Bench Dips": 4,
    "Single Arm Cable Extension": 3,
  
    // -------------------------
    // Core
    // -------------------------
    "Plank": 3,
    "Leg Raise": 4,
    "Bicycle Crunch": 5,
    "Cable Crunch": 4,
    "Hanging Knee Raise": 5,
    "Russian Twist": 4,
    "Mountain Climbers": 8,
    "Ab Wheel Rollout": 5,
    "Flutter Kicks": 4,
    "Toe Touches": 3,
  
    // -------------------------
    // Glutes
    // -------------------------
    "Hip Thrust": 5,
    "Glute Bridge": 4,
    "Cable Kickback": 4,
    "Smith Machine Squat": 7,
    "Step-Ups": 6,
    "Reverse Lunges": 6,
    "Frog Pumps": 3,
    "Banded Side Walk": 3,
    "B-Stance RDL": 6,
  
    // -------------------------
    // Full Body
    // -------------------------
    "Kettlebell Swing": 10,
    "Burpees": 12,
    "Battle Rope": 10,
    "Thrusters": 9,
    "Sled Push": 11,
    "Farmer’s Walk": 7,
    "Box Jump": 8,
    "Clean & Press": 10,
    "Rowing Machine": 7,
    "Ski Erg": 7
  };

  const ReportBody = ({ username }) => {
  const [entries, setEntries] = useState([
    { exercise: "", minutes: "" }
  ]);

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const addEntry = () => {
    setEntries([...entries, { exercise: "", minutes: "" }]);
  };

  const handleSubmit = async () => {
    if (entries.length < 3) {
      alert("Please add at least 5 exercises!");
      return;
    }
  
    for (let e of entries) {
      if (!e.exercise || !e.minutes) {
        alert("Please fill exercise and minutes for all rows");
        return;
      }
    }
  
    const formatted = entries.map(item => ({
      name: item.exercise,
      minutes: Number(item.minutes),
      calories: Number(item.minutes) * (caloriesMap[item.exercise] || 5)
    }));
  
    try {
      const response = await axios.post(
        "https://fitforgev2.onrender.com/api/generate-report",
        {
          username: username,   // <-- sending username only
          exercises: formatted
        },
        { responseType: "blob" }
      );
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "fitness_report.pdf";
      a.click();
  
    } catch (err) {
      console.error(err);
      alert("Error generating PDF");
    }
  };
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Track Your Exercises</h2>
      <p style={styles.subtext}>
        Add at least <strong>5 exercises</strong> to generate your Fitness Report.
      </p>

      {/* Exercise Input Boxes */}
      {entries.map((item, index) => (
        <div key={index} style={styles.row}>
        <Select
  options={allExercises.map(ex => ({ label: ex, value: ex }))}
  value={item.exercise ? { label: item.exercise, value: item.exercise } : null}
  onChange={(selected) => handleChange(index, "exercise", selected.value)}
  placeholder="Search exercise..."
  isSearchable={true}
  menuPortalTarget={document.body}
  menuPosition="fixed"
  styles={{
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    control: (base) => ({
      ...base,
      padding: "5px",
      borderRadius: "8px",
      borderColor: "#ccc",
    }),
  }}
/>
          <input
            type="number"
            style={styles.input}
            placeholder="Time (in minutes)"
            value={item.minutes}
            onChange={(e) => handleChange(index, "minutes", e.target.value)}
          />

        </div>
      ))}

      {/* Add More Button */}
      <button onClick={addEntry} style={styles.addBtn}>
        + Add Exercise
      </button>

      {/* Generate Report Button (visible only after 5 entries) */}
      {entries.length >= 5 && (
        <button onClick={handleSubmit} style={styles.submitBtn}>
          Get Your Fitness Report
        </button>
      )}
    </div>
  );
};

// -----------------------------
// Inline CSS Styling
// -----------------------------
const styles = {
    container: {
        width: "70%",
        marginTop: "200px",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: "40px",
        padding: "20px 30px",
        background: "#f4f4ff",
        borderRadius: "14px",
        boxShadow: "0 0 10px rgba(0,0,0,0.08)"
      },
  heading: {
    textAlign: "center",
    color: "#6c63ff",
    fontSize: "30px",
    marginBottom: "10px"
  },
  subtext: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#555"
  },
  row: {
    display: "flex",
    gap: "20px",
    marginBottom: "15px"
  },
  select: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  input: {
    width: "200px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  addBtn: {
    marginTop: "10px",
    background: "#6c63ff",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  submitBtn: {
    marginTop: "20px",
    background: "#4caf50",
    color: "white",
    padding: "12px 25px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  }
};

export default ReportBody;