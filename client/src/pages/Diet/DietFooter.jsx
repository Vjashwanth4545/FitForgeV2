import React from "react";
import "./Diet.css"
export default function DietFooter() {
  return (
    <footer className="diet-footer">
      <div className="diet-footer-content">
        
        <div className="diet-footer-section">
          <h4 style={{ color: "var(--brand-color)", fontWeight: 800 }}>
            FITFORGE
          </h4>
          <p>
            Fuel your body the right way. Track calories, optimize meals, and
            build a sustainable healthy lifestyle.
          </p>
        </div>

        <div className="diet-footer-section">
          <h4>Quick Links</h4>
          <a href="/">Home</a>
          <a href="#">Meal Plans</a>
          <a href="#">Nutrition Guide</a>
          <a href="#">Privacy Policy</a>
        </div>

        <div className="diet-footer-section">
          <h4>Connect</h4>
          <div className="diet-social-icons">
            <span>🐦</span>
            <span>📷</span>
            <span>📘</span>
          </div>
          <p style={{ marginTop: "10px" }}>support@fitforge.app</p>
        </div>

      </div>

      <div className="diet-footer-bottom">
        &copy; 2025 FitForge. All rights reserved.
      </div>
    </footer>
  );
}