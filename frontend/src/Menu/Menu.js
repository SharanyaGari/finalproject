
import React from 'react';
import {
    Link
  } from "react-router-dom";


function Menu() {
  return (

    //Accessbility
    <nav aria-describedby="A navigation element for the home page">
        <ul>
            <li><Link to="/">Home</Link></li>
            {/* <li><Link to="dashboard">Dashboard</Link></li> */}
            <li><Link to="login">Login</Link></li>
            <li><Link to="signup">Signup</Link></li>

        </ul>
    </nav>
  );
}

export default Menu;
