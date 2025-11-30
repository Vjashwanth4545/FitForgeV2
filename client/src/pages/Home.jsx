import React from 'react'
import './Home.css';
import Navbar from '../components/navbar'
import Thought from '../components/thought';
import Greet from '../components/greet';
import Modules from '../components/mod';
import Footer from '../components/Footer';

const Home = ({ setIsLoggedIn, username }) => {
  return (
    <>
      <Navbar setIsLoggedIn={setIsLoggedIn} />

      <div className="appy-container">
        <Greet username={username} />
        <Thought />
        <Modules />
        <Footer />
      </div>

    </>
  );
};

export default Home;