
import React from 'react';
import axios from 'axios';
import ConfigureBudget from '../ConfigureBudget/ConfigureBudget';
import { useNavigate } from "react-router-dom";
import { useAuthContext } from '../AuthContext/AuthContext';

export default function SignupPage() {
  const navigate = useNavigate();
  const { authState, setAuthState } = useAuthContext();

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
        const refreshToken = res.data.refreshToken;
        const expiresAt = res.data.expiresAt
        localStorage.setItem('jwt', token);
        localStorage.setItem('refresh_token', refreshToken);
        setAuthState({expiresAt: Date.now() + 20 * 1000, isAuthenticated: true, tokenAboutToExpire: false})
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


