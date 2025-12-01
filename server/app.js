const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const pdf = require("html-pdf-node");

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ------------------------------------------------------
//  MONGODB CONNECTION
// ------------------------------------------------------
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ DB Error:", err));


// ------------------------------------------------------
//  USER MODEL
// ------------------------------------------------------
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  height: Number,
  weight: Number,
  gender: String,
  activityLevel: Number, // 1.2 to 1.9
  age: Number
});

const User = mongoose.model("User", userSchema, "users");
const fs = require("fs");
const path = require("path");


// ------------------------------------------------------
//  CALCULATION LOGIC
// ------------------------------------------------------

// Calculate BMR (Mifflin-St Jeor Equation)
function calculateBMR(weight, height, age, gender) {
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  return gender === "female" ? bmr - 161 : bmr + 5;
}

function getDetailedPlan(bmi) {
  // 1. UNDERWEIGHT (< 18.5)
  if (bmi < 18.5) {
    return {
      category: "Underweight",
      color: "#f59e0b", // Orange
      macros: { protein: 140, carbs: 350, fat: 90 },
      micros: ["Vitamin D", "Calcium", "Iron"],
      foodsEat: ["Nuts & Nut Butters", "Avocados", "Whole Milk/Yogurt", "Red Meat", "Oats"],
      foodsAvoid: ["Low-calorie sodas", "Skipping meals", "Black coffee (on empty stomach)"],
      suggestion: "Focus on Caloric Surplus (+500 kcal). Prioritize strength training to build mass, not just fat."
    };
  }
  // 2. HEALTHY (18.5 - 24.9)
  if (bmi < 25) {
    return {
      category: "Healthy Weight",
      color: "#22c55e", // Green
      macros: { protein: 130, carbs: 250, fat: 70 },
      micros: ["Magnesium", "Vitamin C", "Omega-3"],
      foodsEat: ["Lean Chicken", "Brown Rice", "Leafy Greens", "Berries", "Eggs"],
      foodsAvoid: ["Processed Sugar", "Deep fried foods", "Excessive Alcohol"],
      suggestion: "Focus on Maintenance & Performance. Mix cardio with hypertrophy training."
    };
  }
  // 3. OVERWEIGHT (25 - 29.9)
  if (bmi < 30) {
    return {
      category: "Overweight",
      color: "#eab308", // Yellow
      macros: { protein: 160, carbs: 150, fat: 60 },
      micros: ["Zinc", "Vitamin B12", "Fiber"],
      foodsEat: ["White Fish", "Quinoa", "Broccoli/Asparagus", "Greek Yogurt", "Turkey"],
      foodsAvoid: ["Sugary Drinks", "White Bread", "Pasta (in excess)", "Candy"],
      suggestion: "Focus on Caloric Deficit (-300 kcal). Increase protein to prevent muscle loss while cutting fat."
    };
  }
  // 4. OBESE (30+)
  return {
    category: "Obese",
    color: "#ef4444", // Red
    macros: { protein: 170, carbs: 100, fat: 50 },
    micros: ["Potassium", "Vitamin D", "Fiber (Crucial)"],
    foodsEat: ["Lean Beef", "Leafy Salads", "Legumes", "Berries", "Watermelon"],
    foodsAvoid: ["Soda/Juice", "Fast Food", "Ice Cream", "Beer/Alcohol"],
    suggestion: "Focus on Low Impact Activity & Strict Deficit. Walking and swimming are best to protect joints."
  };
}

// ------------------------------------------------------
//  HTML GENERATOR (FIXED PAGINATION)
// ------------------------------------------------------
function buildGaugeSvg(bmi, color) {
  const cx = 100, cy = 90, r = 70;
  // Clamp BMI between 15 and 40 for visual purposes
  const clamp = Math.max(15, Math.min(40, bmi)); 
  const ratio = (clamp - 15) / (40 - 15);
  const angle = -90 + (ratio * 180);
  const rad = angle * (Math.PI / 180);
  const x2 = cx + r * Math.cos(rad);
  const y2 = cy + r * Math.sin(rad);

  return `
    <svg width="160" height="90" viewBox="0 0 200 110" style="margin: 0 auto; display: block;">
      <path d="M30 90 A70 70 0 0 1 170 90" fill="none" stroke="#e2e8f0" stroke-width="15" stroke-linecap="round"/>
      <path d="M30 90 A70 70 0 0 1 70 26.5" fill="none" stroke="#f59e0b" stroke-width="15" stroke-dasharray="4,2"/>
      <path d="M70 26.5 A70 70 0 0 1 130 26.5" fill="none" stroke="#22c55e" stroke-width="15" stroke-dasharray="4,2"/>
      <path d="M130 26.5 A70 70 0 0 1 170 90" fill="none" stroke="#ef4444" stroke-width="15" stroke-dasharray="4,2"/>
      <line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="#1e293b" stroke-width="5" stroke-linecap="round"/>
      <circle cx="${cx}" cy="${cy}" r="6" fill="#1e293b"/>
      <text x="${cx}" y="108" font-family="sans-serif" font-weight="bold" font-size="18" text-anchor="middle" fill="${color}">${bmi}</text>
    </svg>
  `;
}

function buildHtml({ user, bmi, bmr, tdee, exercises, totalCalories, plan }) {
  const date = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  const maxHeartRate = 220 - user.age;
  const targetHeartRateLow = Math.round(maxHeartRate * 0.6);
  const targetHeartRateHigh = Math.round(maxHeartRate * 0.8);

  const exerciseRows = exercises.map((ex, i) => `
    <tr class="${i % 2 === 0 ? 'bg-gray' : ''}">
      <td style="text-align:center; color:#64748b; font-size:12px;">${i + 1}</td>
      <td style="font-weight:600; color:#1e293b;">${ex.name}</td>
      <td>${ex.minutes} <span style="font-size:11px; color:#94a3b8">min</span></td>
      <td style="font-weight:bold; color:#3b82f6;">${ex.calories}</td>
    </tr>
  `).join("");

  // Lists for foods
  const eatList = plan.foodsEat.map(f => `<span class="badge badge-green">${f}</span>`).join(" ");
  const avoidList = plan.foodsAvoid.map(f => `<span class="badge badge-red">${f}</span>`).join(" ");

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      
      body { 
        font-family: 'Inter', sans-serif; 
        margin: 0; 
        padding: 40px; 
        background: #fff; 
        color: #334155; 
        -webkit-print-color-adjust: exact; 
      }

      /* PAGINATION FIXES */
      .card { 
        background: white; 
        border-radius: 12px; 
        border: 1px solid #e2e8f0; 
        padding: 20px; 
        margin-bottom: 20px;
        page-break-inside: avoid; /* CRITICAL: Prevents cutting in half */
        break-inside: avoid;      /* CRITICAL: Modern browser support */
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      }

      .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }
      .header h1 { margin: 0; color: #0f172a; font-size: 24px; text-transform: uppercase; letter-spacing: 1px; }
      .header p { margin: 5px 0 0; color: #64748b; font-size: 13px; }

      .grid-2 { display: flex; gap: 20px; margin-bottom: 0px; }
      .col { flex: 1; }

      .section-title { 
        font-size: 14px; 
        font-weight: 700; 
        color: #0f172a; 
        text-transform: uppercase; 
        letter-spacing: 0.5px; 
        border-bottom: 1px solid #f1f5f9; 
        padding-bottom: 8px; 
        margin-bottom: 15px; 
      }

      /* Stats */
      .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .stat-box { background: #f8fafc; padding: 10px; border-radius: 8px; text-align: center; }
      .stat-val { display: block; font-weight: 700; font-size: 16px; color: #0f172a; }
      .stat-label { font-size: 11px; color: #64748b; text-transform: uppercase; }

      /* Table */
      table { width: 100%; border-collapse: collapse; font-size: 13px; }
      th { text-align: left; color: #64748b; font-size: 11px; text-transform: uppercase; padding: 8px; border-bottom: 2px solid #e2e8f0; }
      td { padding: 10px 8px; border-bottom: 1px solid #f1f5f9; }
      .bg-gray { background-color: #f8fafc; }

      /* Total Bar */
      .total-bar { 
        display: flex; justify-content: space-between; align-items: center; 
        background: #eff6ff; padding: 12px 20px; border-radius: 8px; 
        color: #1e40af; font-weight: bold; margin-top: 10px; 
      }

      /* Macros */
      .macro-row { display: flex; align-items: center; margin-bottom: 8px; font-size: 13px; }
      .macro-name { width: 60px; font-weight: 600; }
      .macro-bar-bg { flex: 1; height: 8px; background: #e2e8f0; border-radius: 4px; margin: 0 10px; overflow: hidden; }
      .macro-fill { height: 100%; border-radius: 4px; }

      /* Badges */
      .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; margin-bottom: 4px; }
      .badge-green { background: #dcfce7; color: #166534; }
      .badge-red { background: #fee2e2; color: #991b1b; }

      .footer { text-align: center; font-size: 10px; color: #94a3b8; margin-top: 30px; padding-top: 10px; border-top: 1px solid #e2e8f0; }
    </style>
  </head>
  <body>

    <div class="header">
      <h1>Fitness Analytics Report</h1>
      <p>Prepared for <strong>${user.username}</strong> on ${date}</p>
    </div>

    <div class="grid-2">
      <div class="col card" style="text-align: center;">
        <div class="section-title">Body Mass Index</div>
        ${buildGaugeSvg(bmi, plan.color)}
        <div style="font-weight:bold; color:${plan.color}; margin-top:5px;">${plan.category}</div>
        <div style="font-size: 12px; color: #64748b; margin-top:5px;">Target: 18.5 - 24.9</div>
      </div>

      <div class="col card">
        <div class="section-title">Metabolic Profile</div>
        <div class="stat-grid">
          <div class="stat-box">
            <span class="stat-val">${user.weight} kg</span>
            <span class="stat-label">Weight</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">${user.height} cm</span>
            <span class="stat-label">Height</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">${bmr} kcal</span>
            <span class="stat-label">BMR (Rest)</span>
          </div>
          <div class="stat-box">
            <span class="stat-val">${tdee} kcal</span>
            <span class="stat-label">TDEE (Active)</span>
          </div>
        </div>
        <div style="margin-top: 12px; font-size: 12px; color: #64748b; text-align:center;">
          Target Heart Rate Zone: <strong>${targetHeartRateLow} - ${targetHeartRateHigh} bpm</strong>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">Weekly Exercise Log</div>
      <table cellspacing="0">
        <thead>
          <tr>
            <th width="10%">#</th>
            <th width="50%">Exercise Activity</th>
            <th width="20%">Duration</th>
            <th width="20%">Energy Burned</th>
          </tr>
        </thead>
        <tbody>${exerciseRows}</tbody>
      </table>
      <div class="total-bar">
        <span>TOTAL WEEKLY BURN</span>
        <span style="font-size:18px;">🔥 ${totalCalories} kcal</span>
      </div>
    </div>

    <div class="grid-2">
      
      <div class="col card">
        <div class="section-title">Daily Nutrition Goals</div>
        
        <div class="macro-row">
          <span class="macro-name">Protein</span>
          <div class="macro-bar-bg"><div class="macro-fill" style="width: 70%; background: #3b82f6;"></div></div>
          <span>${plan.macros.protein}g</span>
        </div>
        <div class="macro-row">
          <span class="macro-name">Carbs</span>
          <div class="macro-bar-bg"><div class="macro-fill" style="width: 50%; background: #10b981;"></div></div>
          <span>${plan.macros.carbs}g</span>
        </div>
        <div class="macro-row">
          <span class="macro-name">Fats</span>
          <div class="macro-bar-bg"><div class="macro-fill" style="width: 30%; background: #f59e0b;"></div></div>
          <span>${plan.macros.fat}g</span>
        </div>

        <div style="margin-top:15px;">
           <div class="stat-label" style="margin-bottom:5px;">Vital Micronutrients</div>
           <div style="color:#334155; font-size:12px;">
             ${plan.micros.join(" • ")}
           </div>
        </div>
      </div>

      <div class="col card">
        <div class="section-title">Dietary Recommendations</div>
        
        <div style="margin-bottom: 12px;">
          <div style="font-size:12px; font-weight:bold; color:#166534; margin-bottom:4px;">✅ Recommended Foods</div>
          <div>${eatList}</div>
        </div>

        <div>
          <div style="font-size:12px; font-weight:bold; color:#991b1b; margin-bottom:4px;">❌ Foods to Limit</div>
          <div>${avoidList}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">Expert Analysis & Action Plan</div>
      <p style="font-size:13px; line-height: 1.6; color:#334155;">
        ${plan.suggestion} Based on your BMR of <strong>${bmr}</strong>, your body burns this amount at complete rest. 
        Given your activity level, you require roughly <strong>${tdee}</strong> calories to maintain weight. 
        To reach your fitness goals efficiently, stick to the target heart rate of <strong>${targetHeartRateLow}-${targetHeartRateHigh} BPM</strong> 
        during cardio sessions.
      </p>
    </div>

    <div class="footer">
      Generated by FitForge AI • ID: #${user._id} • ${new Date().getFullYear()}
    </div>

  </body>
  </html>`;
}
const workoutDatabase = {
  "muscleGain": [
    {
      "day": "Monday",
      "split": "Push (Chest/Shoulders/Triceps)",
      "exercises": [
        {
          "name": "Barbell Bench Press",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552004/Dumbellbenchpress_iiind2.png",
          "sets": 4,
          "reps": "8-10",
          "rest": "90s"
        },
        {
          "name": "Incline Dumbbell Press",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552012/inclinedDumbbell_Press_mcsloc.jpg",
          "sets": 3,
          "reps": "10-12",
          "rest": "60s"
        },
        {
          "name": "Dumbbell Shoulder Press",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552004/dumbell_shoulder_press_p261jk.png",
          "sets": 4,
          "reps": "8-12",
          "rest": "90s"
        },
        {
          "name": "Lateral Raises",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552014/lateral_raises_mb99ip.png",
          "sets": 3,
          "reps": "15",
          "rest": "45s"
        },
        {
          "name": "Skull Crushers",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552033/skull_crusher_nxumlz.jpg",
          "sets": 3,
          "reps": "10-12",
          "rest": "60s"
        },
        {
          "name": "Tricep Pushdown (Cable)",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552034/tricep_pushdown_ujdwxp.jpg",
          "sets": 3,
          "reps": "12-15",
          "rest": "45s"
        }
      ]
    },
    {
      "day": "Tuesday",
      "split": "Pull (Back/Biceps/Rear Delt)",
      "exercises": [
        {
          "name": "Pull-Ups",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552024/pulls_ups_vpyn9q.jpg",
          "sets": 4,
          "reps": "6-10",
          "rest": "120s"
        },
        {
          "name": "Seated Cable Row",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552929/seated_cable_rows_ea5odu.jpg",
          "sets": 3,
          "reps": "10-12",
          "rest": "60s"
        },
        {
          "name": "Face Pulls",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552005/face_pull_a0szxz.jpg",
          "sets": 4,
          "reps": "15",
          "rest": "45s"
        },
        {
          "name": "Barbell Curl",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764551990/barbell_curl_qxm7sm.jpg",
          "sets": 3,
          "reps": "10",
          "rest": "60s"
        },
        {
          "name": "Hammer Curl",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552009/hammer_curls_uyuuaq.jpg",
          "sets": 3,
          "reps": "12",
          "rest": "45s"
        }
      ]
    },
    {
      "day": "Wednesday",
      "split": "Legs & Glutes",
      "exercises": [
        {
          "name": "Barbell Squat",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764551990/barbell_squaat_obmlnt.jpg",
          "sets": 4,
          "reps": "6-8",
          "rest": "120s"
        },
        {
          "name": "Romanian Deadlift",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552027/romanian_deadlift_qbjl3v.jpg",
          "sets": 4,
          "reps": "8-10",
          "rest": "90s"
        },
        {
          "name": "Leg Press",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552016/leg_press_xy1z34.png",
          "sets": 3,
          "reps": "10-12",
          "rest": "90s"
        },
        {
          "name": "Hip Thrust",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552035/trow_bar_dhukxv.jpg",
          "sets": 4,
          "reps": "10-12",
          "rest": "90s"
        },
        {
          "name": "Leg Extension",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552015/leg_extention_hrac4o.png",
          "sets": 3,
          "reps": "15",
          "rest": "45s"
        }
      ]
    },
    {
      "day": "Thursday",
      "split": "Rest",
      "exercises": []
    },
    {
      "day": "Friday",
      "split": "Upper Body Pump",
      "exercises": [
        {
          "name": "Dumbbell Bench Press",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552004/Dumbellbenchpress_iiind2.png",
          "sets": 3,
          "reps": "10-12",
          "rest": "60s"
        },
        {
          "name": "Lat Pulldown",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552928/lat_pulldown_bfejcd.jpg",
          "sets": 3,
          "reps": "10-12",
          "rest": "60s"
        },
        {
          "name": "Arnold Press",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764551991/barbell_shoulder_press_la7cue.png",
          "sets": 3,
          "reps": "10",
          "rest": "60s"
        },
        {
          "name": "Pec Deck",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552022/pecDeckMachine_j4mztg.png",
          "sets": 3,
          "reps": "15",
          "rest": "45s"
        },
        {
          "name": "Preacher Curl",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764551998/concentrated_curls_r5saxd.jpg",
          "sets": 3,
          "reps": "12",
          "rest": "45s"
        }
      ]
    },
    {
      "day": "Saturday",
      "split": "Lower Body (Unilateral)",
      "exercises": [
        {
          "name": "Bulgarian Split Squat",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764551991/belarian_split_squat_shu05c.png",
          "sets": 3,
          "reps": "10/leg",
          "rest": "90s"
        },
        {
          "name": "Goblet Squat",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552007/goblet_sqat_xvv1gv.jpg",
          "sets": 3,
          "reps": "12",
          "rest": "60s"
        },
        {
          "name": "Hamstring Curl",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552010/hamstring_curl_o1qo9k.png",
          "sets": 3,
          "reps": "12-15",
          "rest": "45s"
        },
        {
          "name": "Glute Bridge",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552008/hack_machine_suat_xkq5zg.jpg",
          "sets": 3,
          "reps": "15",
          "rest": "45s"
        }
      ]
    },
    {
      "day": "Sunday",
      "split": "Rest",
      "exercises": []
    }
  ],
  "maintenance": [
    {
      "day": "Monday",
      "split": "Upper Power",
      "exercises": [
        {
          "name": "Bench Press",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552004/Dumbellbenchpress_iiind2.png",
          "sets": 5,
          "reps": "5",
          "rest": "120s"
        },
        {
          "name": "Bent-Over Row",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764551990/barbelbentoverrow_ua9kqk.jpg",
          "sets": 5,
          "reps": "5",
          "rest": "120s"
        },
        {
          "name": "Overhead Press",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552021/overhead_press_u7supu.png",
          "sets": 3,
          "reps": "6-8",
          "rest": "90s"
        },
        {
          "name": "Chest Dips",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764551996/chestDips_nao0uy.jpg",
          "sets": 3,
          "reps": "8-10",
          "rest": "90s"
        }
      ]
    },
    {
      "day": "Tuesday",
      "split": "Lower Power",
      "exercises": [
        {
          "name": "Squat",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764551990/barbell_squaat_obmlnt.jpg",
          "sets": 5,
          "reps": "5",
          "rest": "180s"
        },
        {
          "name": "Deadlift",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552027/romanian_deadlift_qbjl3v.jpg",
          "sets": 3,
          "reps": "5",
          "rest": "180s"
        },
        {
          "name": "Leg Press",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552016/leg_press_xy1z34.png",
          "sets": 3,
          "reps": "10",
          "rest": "90s"
        }
      ]
    },
    {
      "day": "Wednesday",
      "split": "Active Recovery",
      "exercises": [
        {
          "name": "Rowing Machine",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552018/machine_row_o5kh5s.jpg",
          "sets": 1,
          "reps": "20 min",
          "rest": "N/A"
        }
      ]
    },
    {
      "day": "Thursday",
      "split": "Upper Hypertrophy",
      "exercises": [
        {
          "name": "Incline Dumbbell Press",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552012/inclinedDumbbell_Press_mcsloc.jpg",
          "sets": 3,
          "reps": "10",
          "rest": "60s"
        },
        {
          "name": "Lat Pulldown",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552928/lat_pulldown_bfejcd.jpg",
          "sets": 3,
          "reps": "10-12",
          "rest": "60s"
        },
        {
          "name": "Lateral Raises",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552014/lateral_raises_mb99ip.png",
          "sets": 3,
          "reps": "15",
          "rest": "45s"
        },
        {
          "name": "Cable Curl",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764551991/cabel_curl_xvghlr.jpg",
          "sets": 3,
          "reps": "12",
          "rest": "45s"
        },
        {
          "name": "Rope Pushdown",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552028/rope_pulldown_qrhiii.jpg",
          "sets": 3,
          "reps": "12",
          "rest": "45s"
        }
      ]
    },
    {
      "day": "Friday",
      "split": "Lower Hypertrophy",
      "exercises": [
        {
          "name": "Lunges",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552017/luges_afwu7d.png",
          "sets": 3,
          "reps": "12/leg",
          "rest": "60s"
        },
        {
          "name": "RDL",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552027/romanian_deadlift_qbjl3v.jpg",
          "sets": 3,
          "reps": "10",
          "rest": "90s"
        },
        {
          "name": "Leg Extension",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552015/leg_extention_hrac4o.png",
          "sets": 3,
          "reps": "15",
          "rest": "45s"
        },
        {
          "name": "Cable Kickback",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552028/rear_delt_fly_dumbell_ocswiz.png",
          "sets": 3,
          "reps": "15/leg",
          "rest": "45s"
        }
      ]
    },
    {
      "day": "Saturday",
      "split": "Core & Functional",
      "exercises": [
        {
          "name": "Plank",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552022/plank_bo0fg8.jpg",
          "sets": 3,
          "reps": "60s",
          "rest": "60s"
        },
        {
          "name": "Farmer’s Walk",
          "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552009/hammer_curls_uyuuaq.jpg",
          "sets": 3,
          "reps": "30m",
          "rest": "60s"
        }
      ]
    },
    {
      "day": "Sunday",
      "split": "Rest",
      "exercises": []
    }
  ],
  
  "fatLoss": [
  {
    "day": "Monday",
    "split": "Metabolic Circuit A",
    "exercises": [
      {
        "name": "Push-Ups",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552026/pushups_lzylvl.png",
        "sets": 4,
        "reps": "AMRAP"
      },
      {
        "name": "Kettlebell Swing",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552006/front_raises_j4iwrn.png",
        "sets": 4,
        "reps": "20"
      },
      {
        "name": "Mountain Climbers",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552010/hanging_knee_raise_mhybph.jpg",
        "sets": 4,
        "reps": "40s"
      }
    ]
  },

  {
    "day": "Tuesday",
    "split": "Cardio",
    "exercises": [
      {
        "name": "Rowing Machine",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552018/machine_row_o5kh5s.jpg",
        "sets": 1,
        "reps": "30 min"
      }
    ]
  },

  {
    "day": "Wednesday",
    "split": "Full Body Strength",
    "exercises": [
      {
        "name": "Thrusters",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552006/front_raises_j4iwrn.png",
        "sets": 3,
        "reps": "12"
      },
      {
        "name": "Lunges",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552017/luges_afwu7d.png",
        "sets": 3,
        "reps": "12",
        "rest": "45s"
      }
    ]
  },

  {
    "day": "Thursday",
    "split": "HIIT",
    "exercises": [
      {
        "name": "Battle Rope",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552028/rope_pulldown_qrhiii.jpg",
        "sets": 5,
        "reps": "30s on/30s off"
      },
      {
        "name": "Burpees",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552026/pushups_lzylvl.png",
        "sets": 5,
        "reps": "10"
      }
    ]
  },

  {
    "day": "Friday",
    "split": "Metabolic Circuit B",
    "exercises": [
      {
        "name": "Box Jump",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552006/front_raises_j4iwrn.png",
        "sets": 4,
        "reps": "12"
      },
      {
        "name": "Step-Ups",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552016/leg_rises_ycrkyi.jpg",
        "sets": 4,
        "reps": "12/leg"
      },
      {
        "name": "Clean & Press",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552021/overhead_press_u7supu.png",
        "sets": 3,
        "reps": "10"
      }
    ]
  },

  {
    "day": "Saturday",
    "split": "Active",
    "exercises": [
      {
        "name": "Ski Erg",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552017/luges_afwu7d.png",
        "sets": 1,
        "reps": "20 min"
      }
    ]
  },

  {
    "day": "Sunday",
    "split": "Rest",
    "exercises": []
  },

],
"lowImpact": [
  {
    "day": "Monday",
    "split": "Machine Strength",
    "exercises": [
      {
        "name": "Machine Chest Press",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552020/machne_chest_press_fsm1xw.png",
        "sets": 3,
        "reps": "12"
      },
      {
        "name": "Machine Row",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552018/machine_row_o5kh5s.jpg",
        "sets": 3,
        "reps": "12"
      },
      {
        "name": "Leg Press",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552016/leg_press_xy1z34.png",
        "sets": 3,
        "reps": "10"
      },
      {
        "name": "Glute Bridge",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552008/hack_machine_suat_xkq5zg.jpg",
        "sets": 3,
        "reps": "12"
      }
    ]
  },
  {
    "day": "Tuesday",
    "split": "Cardio",
    "exercises": [
      {
        "name": "Rowing Machine",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552018/machine_row_o5kh5s.jpg",
        "sets": 1,
        "reps": "15 min"
      }
    ]
  },
  {
    "day": "Wednesday",
    "split": "Functional Core",
    "exercises": [
      {
        "name": "Plank",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552022/plank_bo0fg8.jpg",
        "sets": 3,
        "reps": "20-30s"
      },
      {
        "name": "Banded Side Walk",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552028/rear_delt_fly_dumbell_ocswiz.png",
        "sets": 3,
        "reps": "10 steps"
      },
      {
        "name": "Straight Arm Pulldown",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552034/straight-arm-lat-pulldowns_tj6bys.jpg",
        "sets": 3,
        "reps": "12"
      }
    ]
  },
  {
    "day": "Thursday",
    "split": "Rest",
    "exercises": []
  },
  {
    "day": "Friday",
    "split": "Full Body Support",
    "exercises": [
      {
        "name": "Machine Shoulder Press",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552930/shoulder_press_quma9o.jpg",
        "sets": 3,
        "reps": "12"
      },
      {
        "name": "Lat Pulldown",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552928/lat_pulldown_bfejcd.jpg",
        "sets": 3,
        "reps": "10"
      },
      {
        "name": "Smith Machine Squat",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764551990/barbell_squaat_obmlnt.jpg",
        "sets": 3,
        "reps": "10"
      }
    ]
  },
  {
    "day": "Saturday",
    "split": "Light Active",
    "exercises": [
      {
        "name": "Ski Erg",
        "img": "https://res.cloudinary.com/db361cin2/image/upload/v1764552017/luges_afwu7d.png",
        "sets": 1,
        "reps": "10 min"
      }
    ]
  },
  {
    "day": "Sunday",
    "split": "Rest",
    "exercises": []
  }
]
}
  // 1. MUSCLE GAIN (BMI < 18.5)

// ------------------------------------------------------
// ROUTES
// ------------------------------------------------------
app.post("/api/generate-report", async (req, res) => {
  try {
    const { username, exercises } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ success: false });

    const hM = user.height / 100;
    const bmi = +(user.weight / (hM * hM)).toFixed(1);
    const age = user.age || 25;
    const gender = user.gender || "male";

    const bmr = Math.round(calculateBMR(user.weight, user.height, age, gender));
    const tdee = Math.round(bmr * 1.35);

    const plan = getDetailedPlan(bmi);

    const safeExercises = (exercises || []).map(x => ({
      name: x.name || "Unknown",
      minutes: Number(x.minutes) || 0,
      calories: Number(x.calories) || 0
    }));

    const totalCalories = safeExercises.reduce((a, b) => a + b.calories, 0);

    const html = buildHtml({ user, bmi, bmr, tdee, exercises: safeExercises, totalCalories, plan });

    // 🚀 PDF GENERATION (NO BROWSER NEEDED)
    let file = { content: html };
    let options = { format: "A4", printBackground: true };

    const pdfBuffer = await pdf.generatePdf(file, options);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${username}_report.pdf`);
    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.toString() });
  }
});

    
    // Generate PDF with chrome-aws-lambda



app.get("/", (req, res) => res.send("Server running ✔"));

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.json({ success: false, message: "Invalid username" });
  if (user.password !== password)
    return res.json({ success: false, message: "Invalid password" });

  res.json({ success: true });
});

// Signup
app.post("/api/login/newuser", async (req, res) => {
  const exists = await User.findOne({ username: req.body.username });

  if (exists) return res.json({ success: false, message: "User exists" });

  await new User(req.body).save();
  res.json({ success: true });
});

// Diet Info
app.get("/api/diet/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.json({ success: false });

  res.json({ success: true, ...user._doc });
});
app.put("/api/user/update", async (req, res) => {
  const data = {};
  if (req.body.age !== undefined) data.age = req.body.age;
  if (req.body.weight !== undefined) data.weight = req.body.weight;
  if (req.body.height !== undefined) data.height = req.body.height;
  if (req.body.gender !== undefined) data.gender = req.body.gender;
  if (req.body.activityLevel !== undefined) data.activityLevel = req.body.activityLevel;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: req.body.username },
      data,
      { new: true }
    );

    if (!updatedUser)
      return res.json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Profile updated successfully", user: updatedUser });

  } catch (err) {
    res.json({ success: false, message: "Update failed", error: err });
  }
});

// BMI
app.get("/api/bmi/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.json({ success: false });

  res.json({ success: true, height: user.height, weight: user.weight });
});

// Workout Plan
app.get("/api/workout/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });

  const h = user.height / 100;
  const bmi = +(user.weight / (h*h)).toFixed(1);

  let plan;
  if (bmi < 18.5) plan = workoutDatabase.muscleGain;
  else if (bmi < 25) plan = workoutDatabase.maintenance;
  else if (bmi < 30) plan = workoutDatabase.fatLoss;
  else plan = workoutDatabase.lowImpact;

  res.json({ success: true, bmi, plan });
});
app.post("/api/user/profile", async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user)
      return res.json({ success: false, message: "User not found" });

    res.json({
      success: true,
      username: user.username,
      age: user.age,
      weight: user.weight,
      height: user.height,
      gender: user.gender,
      activityLevel: user.activityLevel
    });

  } catch (err) {
    res.json({ success: false, message: "Error loading profile", error: err });
  }
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at port ${PORT}`);
});