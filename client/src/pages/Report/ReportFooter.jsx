import React from "react";

export default function ReportFooter() {
  return (
    <footer className="footer">
      <div className="footer-content">
        
        <div className="footer-section">
          <h4 style={{ color: "var(--brand-color)", fontWeight: 800 }}>
            FITFORGE
          </h4>
          <p>
            Forging a better version of you, one rep at a time. Join the 
            community and track your progress.
          </p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <a href="#">Home</a>
          <a href="#">About Us</a>
          <a href="#">Contact Support</a>
          <a href="#">Privacy Policy</a>
        </div>

        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-icons">
            <span>🐦</span>
            <span>📷</span>
            <span>📘</span>
          </div>
          <p style={{ marginTop: "10px" }}>support@fitforge.app</p>
        </div>

      </div>

      <div className="footer-bottom">
        &copy; 2025 FitForge. All rights reserved.
      </div>
    </footer>
  );
}
