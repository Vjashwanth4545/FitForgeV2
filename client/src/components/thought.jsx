import React, { useState, useEffect } from 'react';

import { thoughts } from '../data/thougths';

const Thought = () => {

  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme")
  );

  // pick a random thought
  const randomThought = () => {
    const index = Math.floor(Math.random() * thoughts.length);
    setMessage(thoughts[index]);
  };

  // detect theme change
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme"));
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  // change message when theme changes OR when page loads
  useEffect(() => {
    randomThought();
  }, [theme]);

  return (
    <div className="thought-box">
      <div className='thought'>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Thought;