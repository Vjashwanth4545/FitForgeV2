import React from 'react';
import Navbar from './navbar';
const ContactUs = () => {
  const styles = {
    pageContainer: {
      backgroundColor: '#E6F7F8',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      paddingBottom: '40px'
    },
    navbar: {
      backgroundColor: '#DDE3F8',
      padding: '15px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px'
    },
    logo: {
      color: '#7C8DB5',
      fontSize: '28px',
      fontWeight: '900',
      letterSpacing: '1px',
      fontFamily: 'Impact, sans-serif',
      textTransform: 'uppercase'
    },
    header: {
      textAlign: 'center',
      fontSize: '26px',
      fontWeight: '900',
      marginBottom: '10px'
    },
    subHeader: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#555',
      marginBottom: '30px'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '24px',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '0 20px'
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '800',
      textTransform: 'uppercase',
      marginBottom: '12px'
    },
    cardBody: {
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: '18px'
    },
    techGrid: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      marginTop: '10px'
    },
    techBox: {
      backgroundColor: '#EEF2FF',
      color: '#4F46E5',
      padding: '8px 14px',
      borderRadius: '12px',
      fontWeight: '700',
      fontSize: '14px'
    }
  };

  const roles = [
    { title: "Frontend Development", icon: "💻" },
    { title: "Backend Development", icon: "⚙️" },
    { title: "Database & Deployment", icon: "🗄️" }
  ];

  const languages = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
  ];

  return (
    <div style={styles.pageContainer}>
      <Navbar />
     

      {/* NAME AT TOP */}
      <h2 style={styles.header}>Varadarajulu Jashwanth</h2>
      <p style={styles.subHeader}>Solo Full-Stack Developer</p>

      {/* ROLES */}

      {/* LANGUAGES / TECH STACK */}
      <div style={{ maxWidth: '1000px', margin: '40px auto 0', padding: '0 20px' }}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Languages & Technologies</div>
          <div style={styles.techGrid}>
            {languages.map((tech, index) => (
              <div key={index} style={styles.techBox}>
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;