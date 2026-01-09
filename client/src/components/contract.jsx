import React from 'react';

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
      textTransform: 'uppercase',
      margin: 0
    },
    header: {
      textAlign: 'center',
      color: '#1a1a1a',
      fontSize: '24px',
      fontWeight: '800',
      textTransform: 'uppercase',
      marginBottom: '30px',
      letterSpacing: '0.5px'
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '0 20px'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '20px',
      padding: '30px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
    },
    cardTitle: {
      fontSize: '20px',
      fontWeight: '800',
      textTransform: 'uppercase',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#000'
    },
    cardBody: {
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: '18px',
      color: '#333',
      lineHeight: '1.5'
    }
  };

  // SOLO DEVELOPER ROLES
  const roles = [
    { role: "Frontend Development", icon: "💻" },
    { role: "Backend Development", icon: "⚙️" },
    { role: "Database & Deployment", icon: "🗄️" }
  ];

  return (
    <div style={styles.pageContainer}>
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>FITFORGE</h1>
        <div style={{ display: 'flex', gap: '20px', fontWeight: 'bold' }}>
          <a href="/">Home</a>
          <span>Contact Us</span>
        </div>
      </nav>

      <h2 style={styles.header}>Meet the Creator</h2>

      <div style={styles.gridContainer}>
        {roles.map((item, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.cardTitle}>
              <span>{item.role}</span>
              <span>{item.icon}</span>
            </div>
            <p style={styles.cardBody}>
              Varadarajulu Jashwanth
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactUs;