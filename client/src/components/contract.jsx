import React from 'react';
import Navbar from './navbar';
import Footer from './Footer';

const ContactUs = () => {
  const styles = {
    page: {
      backgroundColor: '#E6F7F8',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    },
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '40px 20px'
    },
    name: {
      fontSize: '32px',
      fontWeight: '900',
      textAlign: 'center',
      marginBottom: '6px'
    },
    roleTitle: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#555',
      marginBottom: '40px'
    },
    sectionTitle: {
      fontSize: '18px',
      fontWeight: '800',
      letterSpacing: '1px',
      marginBottom: '16px',
      marginTop: '40px'
    },
    divider: {
      height: '1px',
      backgroundColor: '#cfd8dc',
      margin: '20px 0'
    },
    rolesRow: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '20px',
      fontWeight: '600'
    },
    roleItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    techGroup: {
      marginBottom: '20px'
    },
    techLabel: {
      fontWeight: '700',
      marginBottom: '6px'
    },
    techList: {
      color: '#4F46E5',
      fontWeight: '600'
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        {/* NAME */}
        <div style={styles.name}>Varadarajulu Jashwanth</div>
        <div style={styles.roleTitle}>Solo Full-Stack Developer</div>

        {/* ROLES */}
        <div style={styles.sectionTitle}>ROLES</div>
        <div style={styles.rolesRow}>
          <div style={styles.roleItem}>💻 Frontend Development</div>
          <div style={styles.roleItem}>⚙ Backend Development</div>
          <div style={styles.roleItem}>🗄 Database & Deployment</div>
        </div>

        <div style={styles.divider}></div>

        {/* TECH STACK */}
        <div style={styles.sectionTitle}>LANGUAGES & TECHNOLOGIES</div>

        <div style={styles.techGroup}>
          <div style={styles.techLabel}>Frontend</div>
          <div style={styles.techList}>HTML · CSS · JavaScript · React</div>
        </div>

        <div style={styles.techGroup}>
          <div style={styles.techLabel}>Backend</div>
          <div style={styles.techList}>Node.js · Express.js · REST APIs</div>
        </div>

        <div style={styles.techGroup}>
          <div style={styles.techLabel}>Database & Tools</div>
          <div style={styles.techList}>MongoDB · Git · Vercel</div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;