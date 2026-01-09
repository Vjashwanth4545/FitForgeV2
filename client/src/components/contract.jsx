import React from 'react';
import Navbar from './navbar';
import Footer from './Footer';

const ContactUs = () => {
  const styles = {
    pageContainer: {
      backgroundColor: '#E6F7F8',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      paddingBottom: '40px'
    },
    section: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '0 20px'
    },
    name: {
      textAlign: 'center',
      fontSize: '30px',
      fontWeight: '900',
      marginTop: '40px'
    },
    title: {
      textAlign: 'center',
      fontSize: '18px',
      color: '#555',
      marginBottom: '40px'
    },
    divider: {
      height: '1px',
      backgroundColor: '#cfd8dc',
      margin: '40px 0'
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '800',
      marginBottom: '16px',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    rolesRow: {
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '20px',
      fontSize: '16px',
      fontWeight: '600'
    },
    role: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    techList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '14px',
      fontSize: '15px',
      fontWeight: '600',
      color: '#4F46E5'
    },
    tech: {
      padding: '4px 0'
    }
  };

  const roles = [
    { label: 'Frontend Development', icon: '💻' },
    { label: 'Backend Development', icon: '⚙️' },
    { label: 'Database & Deployment', icon: '🗄️' }
  ];

  const languages = [
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Node.js',
    'Express.js',
    'MongoDB'
  ];

  return (
    <div style={styles.pageContainer}>
      <Navbar />

      <div style={styles.section}>
        {/* NAME */}
        <div style={styles.name}>Varadarajulu Jashwanth</div>
        <div style={styles.title}>Solo Full-Stack Developer</div>

        <div style={styles.divider}></div>

        {/* ROLES */}
        <div style={styles.sectionTitle}>Roles</div>
        <div style={styles.rolesRow}>
          {roles.map((r, i) => (
            <div key={i} style={styles.role}>
              <span>{r.icon}</span>
              <span>{r.label}</span>
            </div>
          ))}
        </div>

        <div style={styles.divider}></div>

        {/* TECH STACK */}
        <div style={styles.sectionTitle}>Languages & Technologies</div>
        <div style={styles.techList}>
          {languages.map((tech, i) => (
            <span key={i} style={styles.tech}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;