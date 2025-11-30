import React from 'react'
const Greet = ({ username }) => {
    return <div className="greetbox">
        <h2 className="greet">Welcome back,  {username}! </h2>
    </div>
  };

export default Greet
