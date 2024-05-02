
import React from 'react';
import axios from 'axios';
import ConfigureBudget from '../ConfigureBudget/ConfigureBudget';
import { useNavigate } from "react-router-dom";

export default function SignupPage() {
  const navigate = useNavigate();

  function signup() {

    const newdata = {
        username: document.getElementById('username').value,
        createpassword: document.getElementById('CreatePassword').value
        
    };
    console.log('data is', newdata)
    axios.post('http://localhost:3001/signup', newdata).then(res => {
      if(res && res.data && res.data.token) {
        console.log('response for signup is', res)
        const token = res.data.token;
        localStorage.setItem('jwt', token);
        navigate("/ConfigureBudget");
        //window.location.href = '/dashboard'
       //console.log(res.data.username);
        
     }
      //window.location.href = '/ConfigureBudget'
    })

  }


  return (
    <div className="LPage">
      <div className = "row">
          <label>Username</label>
          <input type="text" name="Username" id="username"></input>
          
      </div>
      <div className = "row">
          <label >Create Password</label>
          <input type="text" name="CreatePassword" id="CreatePassword"></input>
        </div>
        <div className = "row">
          <label>Confirm Password</label>
          <input type="text" name="ConfirmPassword" id="ConfirmPassword"></input>
        </div>
        <div className = "row">
                <button onClick={signup}>Signup</button>
        </div>
    </div>


  

         

  );
}


