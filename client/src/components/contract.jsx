import React, { useState } from 'react';

const ContactUs = () => {
  // Styles based on your screenshot to ensure design consistency
  const styles = {
    pageContainer: {
      backgroundColor: '#E6F7F8', // Light mint background from screenshot
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      paddingBottom: '40px'
    },
    navbar: {
    
      backgroundColor: '#DDE3F8', // Light periwinkle nav color
      padding: '15px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '40px'
    },
    logo: {
      color: '#7C8DB5', // Muted purple/blue logo color
      fontSize: '28px',
      fontWeight: '900',
      letterSpacing: '1px',
      fontFamily: 'Impact, sans-serif', // Condensed font style
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
      boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      transition: 'transform 0.2s ease'
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
    // Using Serif font to match the body text in your screenshot
    cardBody: {
      fontFamily: '"Times New Roman", Times, serif', 
      fontSize: '18px',
      color: '#333',
      lineHeight: '1.5'
    },
    formContainer: {
        maxWidth: '600px',
        margin: '50px auto 0',
        padding: '0 20px'
    },
    input: {
        width: '100%',
        padding: '15px',
        marginBottom: '15px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        fontSize: '16px'
    },
    button: {
        width: '100%',
        padding: '15px',
        borderRadius: '30px',
        border: 'none',
        // The purple gradient from your "Sweat now" button
        background: 'linear-gradient(90deg, #6b66ff 0%, #a855f7 100%)', 
        color: 'white',
        fontWeight: 'bold',
        fontSize: '18px',
        cursor: 'pointer',
        textTransform: 'uppercase'
    }
  };

  const teamMembers = [
    {
      role: "Frontend Developer",
      name: "Varadarajulu Jashwanth",
      icon: "💻" 
    },
    {
      role: "Backend Developer",
      name: "Tanush Saideep Amiesetty",
      icon: "⚙️"
    },
    {
      role: "Database Administrator",
      name: "Voggu Abhinay Vardhan",
      icon: "🗄️"
    }
  ];

  return (
    <div style={styles.pageContainer}>
      {/* Navbar Simulation */}
      <nav style={styles.navbar}>
        <h1 style={styles.logo}>FITFORGE</h1>
        {/* You can add your existing Link components here */}
        <div style={{display: 'flex', gap: '20px', color: '#666', fontWeight: 'bold'}}>
            <a href='/'>Home</a>
            <span>Contact Us</span>
        </div>
      </nav>

      <h2 style={styles.header}>Meet The Team</h2>

      {/* Team Cards Grid */}
      <div style={styles.gridContainer}>
        {teamMembers.map((member, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.cardTitle}>
              <span>{member.role}</span>
              <span>{member.icon}</span>
            </div>
            <p style={styles.cardBody}>
              {member.name}
            </p>
          </div>
        ))}
      </div>
      </div>
      );

     
  
};

export default ContactUs;