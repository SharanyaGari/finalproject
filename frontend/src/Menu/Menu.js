
import React from 'react';
import {
    Link
  } from "react-router-dom";


function Menu() {
  return (

    // {/* //Accessibility */}
    <nav aria-describedby="A navigation element for the home page">
        <ul>
          {/* //Accessibility */}
            <li aria-label="Know more about this page"><Link to="/">Home</Link></li>
            {/* <li><Link to="dashboard">Dashboard</Link></li> */}
            <li aria-label="Know more about this page"><Link to="login">Login</Link></li>
            <li aria-label="Know more about this page"><Link to="signup">Signup</Link></li>

        </ul>
    </nav>
  );
}

export default Menu;
