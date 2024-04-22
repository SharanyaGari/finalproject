import React from 'react';
import './App.css';
import './pb.sass'

import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";



import Menu from './Menu/Menu';
import Hero from './Hero/Hero';
import Footer from './Footer/Footer';
import LoginPage from './LoginPage/LoginPage';
import HomePage from './HomePage/HomePage';
import DashboardPage from './DashboardPage/DashboardPage';
import SignupPage from './SignupPage/SignupPage';




function App() {
  return (
    <Router>
       <Menu/>
       <Hero/>
       <div className='mainContainer'>
        <Routes>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/dashboard" element={<DashboardPage/>}/>
          <Route path="/signup" element={<SignupPage/>}/>
          <Route path="/" element={<HomePage/>}/>
        </Routes>
       </div>
       <Footer initialCount={0}></Footer>


    </Router>

  );
}

export default App;
